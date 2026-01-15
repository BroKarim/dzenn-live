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

export async function fetchMetadata(url: string): Promise<MetadataResult> {
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
      if (response.status === 403) {
        throw new Error("FORBIDDEN");
      }
      if (response.status === 404) {
        throw new Error("NOT_FOUND");
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    return extractMetadataFromHtml(html, url);
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error(`[Metadata] Timeout for ${url}`);
        throw new Error("TIMEOUT");
      }
      
      if (error.message === "FORBIDDEN" || error.message === "NOT_FOUND") {
        throw error;
      }
    }
    
    console.error(`[Metadata] Error fetching metadata for ${url}:`, error);
    throw error;
  }
}

