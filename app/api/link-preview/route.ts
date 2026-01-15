import { NextResponse } from "next/server";
import validator from "validator";
import { getFallbackPreviewImage } from "@/lib/utils/link-preview-image";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  let validUrl: string;
  try {
    const normalizedUrl = url.startsWith("http://") || url.startsWith("https://") 
      ? url 
      : `https://${url}`;
    
    if (!validator.isURL(normalizedUrl, {
      protocols: ["http", "https"],
      require_protocol: false,
      require_valid_protocol: true,
      require_host: true,
      require_port: false,
      allow_protocol_relative_urls: false,
      validate_length: true,
    })) {
      return NextResponse.json(
        { error: "Invalid URL format. Please provide a valid URL with a proper domain." },
        { status: 400 }
      );
    }
    
    const urlObj = new URL(normalizedUrl);
    validUrl = urlObj.toString();
  } catch {
    return NextResponse.json(
      { error: "Invalid URL format. Please provide a valid URL with a proper domain." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/preview?url=${encodeURIComponent(validUrl)}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 403 || response.status === 408 || response.status === 404) {
        const fallback = await getFallbackPreviewImage();
        return NextResponse.json({
          title: null,
          description: null,
          image: fallback,
          logo: null,
          url: validUrl,
        });
      }

      throw new Error(errorData.error || `Backend returned ${response.status}`);
    }

    const result = await response.json();
    const metadata = result.data;

    let image = metadata.image;
    if (!image) {
      image = await getFallbackPreviewImage();
    }

    return NextResponse.json({
      title: metadata.title,
      description: metadata.description,
      image,
      logo: metadata.logo,
      url: metadata.url,
    });
  } catch (error) {
    console.error("Error fetching link preview:", error);
    const fallback = await getFallbackPreviewImage();
    return NextResponse.json({
      title: null,
      description: null,
      image: fallback,
      logo: null,
      url: validUrl,
    });
  }
}

