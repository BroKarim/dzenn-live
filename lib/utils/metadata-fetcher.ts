import urlMetadata from "url-metadata";
import * as cheerio from "cheerio";

const getModernUserAgent = () => {
  return "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
};

const getRequestHeaders = () => {
  return {
    "User-Agent": getModernUserAgent(),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "DNT": "1",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Cache-Control": "max-age=0",
  };
};

export interface MetadataResult {
  title: string | null;
  description: string | null;
  image: string | null;
  logo: string | null;
  url: string;
}

function resolveUrl(url: string, baseUrl: string): string {
  try {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (url.startsWith("//")) {
      return `https:${url}`;
    }
    if (url.startsWith("/")) {
      const urlObj = new URL(baseUrl);
      return `${urlObj.protocol}//${urlObj.host}${url}`;
    }
    return new URL(url, baseUrl).toString();
  } catch {
    return url;
  }
}

function extractMetadataFromHtml(html: string, url: string): MetadataResult {
  const $ = cheerio.load(html);
  
  const getMeta = (property: string, name?: string): string | null => {
    const ogValue = $(`meta[property="${property}"]`).attr("content");
    if (ogValue) return ogValue;
    
    if (name) {
      const metaValue = $(`meta[name="${name}"]`).attr("content");
      if (metaValue) return metaValue;
    }
    
    return null;
  };

  const title = getMeta("og:title") || 
                getMeta("twitter:title") || 
                $("title").text().trim() || 
                null;

  const description = getMeta("og:description") || 
                      getMeta("twitter:description") || 
                      getMeta("description") || 
                      null;

  let image = getMeta("og:image") || 
              getMeta("twitter:image") || 
              getMeta("twitter:image:src") || 
              null;
  
  if (image) {
    image = resolveUrl(image, url);
  }

  let logo: string | null = null;
  const faviconHref = $('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').first().attr("href");
  if (faviconHref) {
    logo = resolveUrl(faviconHref, url);
  }

  return {
    title,
    description,
    image,
    logo,
    url,
  };
}

async function fetchWithCheerio(url: string): Promise<MetadataResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: getRequestHeaders(),
      redirect: "follow",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    return extractMetadataFromHtml(html, url);
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function fetchMetadata(url: string): Promise<MetadataResult> {
  try {
    const metadata = await urlMetadata(url, {
      timeout: 15000,
      requestHeaders: getRequestHeaders(),
      maxRedirects: 10,
      ensureSecureImageRequest: true,
    });

    let favicon: string | null = null;
    if (metadata.favicons && Array.isArray(metadata.favicons) && metadata.favicons.length > 0) {
      const firstFavicon = metadata.favicons[0];
      if (typeof firstFavicon === "string") {
        favicon = firstFavicon;
      } else if (firstFavicon && typeof firstFavicon === "object" && "href" in firstFavicon) {
        favicon = firstFavicon.href as string;
      }
    }

    return {
      title: metadata["og:title"] || metadata.title || null,
      description: metadata["og:description"] || metadata.description || null,
      image: metadata["og:image"] || metadata.image || null,
      logo: metadata["og:logo"] || metadata.logo || favicon || null,
      url,
    };
  } catch (error) {
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes("403") || errorMessage.includes("forbidden") || errorMessage.includes("response code 403")) {
        console.log(`[Metadata] 403 Forbidden for ${url}, trying cheerio fallback`);
        try {
          return await fetchWithCheerio(url);
        } catch (fallbackError) {
          console.error(`[Metadata] Cheerio fallback also failed for ${url}:`, fallbackError);
          throw new Error("FORBIDDEN");
        }
      }
      
      if (errorMessage.includes("timeout")) {
        console.error(`[Metadata] Timeout for ${url}`);
        throw new Error("TIMEOUT");
      }
      
      if (errorMessage.includes("404") || errorMessage.includes("not found")) {
        console.error(`[Metadata] 404 Not Found for ${url}`);
        throw new Error("NOT_FOUND");
      }
    }
    
    console.error(`[Metadata] Error fetching metadata for ${url}:`, error);
    throw error;
  }
}

