export function getOgImageUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace("www.", "");
    
    return `https://${domain}/og.png`;
  } catch {
    return "";
  }
}

export async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const ogUrl = getOgImageUrl(url);
    if (!ogUrl) return null;
    
    const response = await fetch(ogUrl, { 
      method: "HEAD",
      signal: AbortSignal.timeout(3000)
    });
    
    if (response.ok) {
      return ogUrl;
    }
  } catch {
  }
  
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace("www.", "");
    return `https://${domain}/og.png`;
  } catch {
    return null;
  }
}

export function getDomainIcon(url: string): string {
  try {
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
    const domain = urlObj.hostname.replace("www.", "");
    
    if (domain.includes("github")) {
      return "https://github.com/identicons/app.png";
    }
    if (domain.includes("twitter") || domain.includes("x.com")) {
      return "https://abs.twimg.com/favicons/twitter.3.ico";
    }
    if (domain.includes("linkedin")) {
      return "https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca";
    }
    if (domain.includes("youtube")) {
      return "https://www.youtube.com/s/desktop/favicon.ico";
    }
    
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return "";
  }
}

