import imageCompression from "browser-image-compression";

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  fileType?: string;
}

/**
 * Compresses an image file on the client side using browser-image-compression.
 * This offloads the processing work from the server to the user's browser.
 */
export async function compressImage(file: File, options: CompressionOptions = {}): Promise<File> {
  const defaultOptions = {
    maxSizeMB: 1, // Max file size in MB
    maxWidthOrHeight: 1920, // Max width/height
    useWebWorker: true, // Multi-threading
    fileType: file.type === "image/png" ? "image/png" : "image/jpeg", // Preserve transparency only for PNG
    initialQuality: 0.8, // Good balance of quality/size
  };

  const config = { ...defaultOptions, ...options };

  try {
    const compressedFile = await imageCompression(file, config);
    console.log(`Image compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
    return compressedFile;
  } catch (error) {
    console.error("Image compression failed:", error);
    throw error;
  }
}

/**
 * Helper to convert File to Base64 (useful for previews)
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
