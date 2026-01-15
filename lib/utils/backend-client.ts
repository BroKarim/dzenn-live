const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export interface MetadataResult {
  title: string | null;
  description: string | null;
  image: string | null;
  logo: string | null;
  url: string;
}

export async function fetchMetadataFromBackend(url: string): Promise<MetadataResult> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/preview?url=${encodeURIComponent(url)}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 403) {
        throw new Error("FORBIDDEN");
      }
      
      if (response.status === 408) {
        throw new Error("TIMEOUT");
      }
      
      if (response.status === 404) {
        throw new Error("NOT_FOUND");
      }

      throw new Error(errorData.error || `Backend returned ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "FORBIDDEN" || error.message === "TIMEOUT" || error.message === "NOT_FOUND") {
        throw error;
      }
    }
    throw error;
  }
}

