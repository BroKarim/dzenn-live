import sharp from "sharp";

export async function optimizeImage(base64: string, type: "icon" | "media") {
  const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,/);
  if (!matches) throw new Error("Invalid base64 format");

  const mimeType = matches[1];
  const allowedMedia = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  const allowedIcon = [...allowedMedia, "image/x-icon", "image/vnd.microsoft.icon", "image/svg+xml"];

  if (type === "media" && !allowedMedia.includes(mimeType)) {
    throw new Error("Invalid media format. Only JPG, PNG, and WebP are allowed.");
  }

  if (type === "icon" && !allowedIcon.includes(mimeType)) {
    throw new Error("Invalid icon format. JPG, PNG, WebP, ICO, and SVG are allowed.");
  }

  const base64Data = base64.split(";base64,").pop();
  if (!base64Data) throw new Error("Invalid base64 data");

  const buffer = Buffer.from(base64Data, "base64");
  let pipeline = sharp(buffer);

  if (type === "icon") {
    pipeline = pipeline.resize(128, 128, { fit: "cover" }).webp({ quality: 80 });
  } else {
    pipeline = pipeline.resize(1200, null, { withoutEnlargement: true }).webp({ quality: 75 });
  }

  const optimizedBuffer = await pipeline.toBuffer();
  return optimizedBuffer;
}
