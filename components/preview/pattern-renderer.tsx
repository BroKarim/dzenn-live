"use client";

interface PatternRendererProps {
  type: string;
  color: string;
  opacity: number;
  thickness: number;
  scale: number;
}

interface MaskContentProps {
  type: string;
  actualScale: number;
  holeSize: number;
}

function MaskContent({ type, actualScale, holeSize }: MaskContentProps) {
  switch (type) {
    case "grid":
      // Melubangi kotak di tengah setiap sel
      return <rect x={(actualScale - holeSize) / 2} y={(actualScale - holeSize) / 2} width={holeSize} height={holeSize} fill="black" />;

    case "dots":
      // Melubangi lingkaran di tengah
      return <circle cx={actualScale / 2} cy={actualScale / 2} r={holeSize / 2} fill="black" />;

    case "stripes":
      // Melubangi garis vertikal
      return <rect x={(actualScale - holeSize) / 2} y="0" width={holeSize} height={actualScale} fill="black" />;

    case "waves":
      // Membuat "bidang" gelombang yang melubangi
      return (
        <path
          d={`
            M 0 ${actualScale / 2} 
            Q ${actualScale / 4} ${actualScale / 2 - holeSize / 2}, ${actualScale / 2} ${actualScale / 2} 
            T ${actualScale} ${actualScale / 2}
            V ${actualScale} H 0 Z
          `}
          fill="black"
        />
      );

    case "noise":
      // Noise pixelated dengan lubang-lubang kecil random
      const noiseDots = [];
      const count = 15;
      for (let i = 0; i < count; i++) {
        const x = (i * 137.5) % actualScale;
        const y = (i * 253.1) % actualScale;
        noiseDots.push(<rect key={i} x={x} y={y} width={holeSize / 4} height={holeSize / 4} fill="black" />);
      }
      return <>{noiseDots}</>;

    default:
      return null;
  }
}

export function PatternRenderer({ type, color, opacity, thickness, scale }: PatternRendererProps) {
  if (type === "none") return null;

  const patternId = `pattern-${type}`;
  const maskId = `mask-${type}`;
  const opacityDecimal = opacity / 100;

  // Base scale (ukuran satu ubin pattern)
  // 100% scale kita set ke 40px agar lebih leluasa
  const actualScale = (scale / 100) * 40;

  // Hole Size (ukuran lubang)
  // Semakin kecil thickness slider (13%), semakin kecil lubangnya (bentuk makin tebal)
  // Semakin besar thickness slider (200%), semakin besar lubangnya (bentuk makin tipis)
  const holeSize = (thickness / 200) * actualScale;

  // Convert hex color to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 255, g: 255, b: 255 };
  };

  const rgb = hexToRgb(color);
  /**
   * Kita gunakan fill solid tapi dengan mask.
   * Mask Putih = Terlihat (Solid Color)
   * Mask Hitam = Berlubang (Transparan, memperlihatkan background)
   */
  const patternFillColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacityDecimal})`;

  return (
    <svg className="absolute inset-0 h-full w-full pointer-events-none">
      <defs>
        <mask id={maskId}>
          {/* Base mask putih (artinya seluruh area terisi warna) */}
          <rect width="100%" height="100%" fill="white" />
          {/* Konten pattern sebagai lubang (hitam) */}
          <pattern id={`${patternId}-mask`} x="0" y="0" width={actualScale} height={actualScale} patternUnits="userSpaceOnUse" patternTransform={type === "stripes" ? "rotate(45)" : ""}>
            <MaskContent type={type} actualScale={actualScale} holeSize={holeSize} />
          </pattern>
          <rect width="100%" height="100%" fill={`url(#${patternId}-mask)`} />
        </mask>
      </defs>

      {/* Bidang solid yang dikenakan mask untuk membuat lubang pattern */}
      <rect width="100%" height="100%" fill={patternFillColor} mask={`url(#${maskId})`} />
    </svg>
  );
}
