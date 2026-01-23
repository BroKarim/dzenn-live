import React from "react"
import { EditorState } from "@/lib/editor"

interface PreviewBackgroundProps {
  state: EditorState
}

export function PreviewBackground({ state }: PreviewBackgroundProps) {
  const getBackgroundStyle = () => {
    switch (state.backgroundType) {
      case "gradient":
        return { background: `linear-gradient(135deg, ${state.backgroundGradient.from} 0%, ${state.backgroundGradient.to} 100%)` }
      case "wallpaper":
        return { 
          backgroundImage: `url(${state.backgroundWallpaper})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      case "image":
        return { 
          backgroundImage: `url(${state.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      default:
        return { backgroundColor: state.backgroundColor }
    }
  }

  return (
    <>
      <div 
        className="absolute inset-0 transition-all duration-500"
        style={{ 
          ...getBackgroundStyle(),
          filter: `
            blur(${state.bgEffects.blur}px) 
            brightness(${state.bgEffects.brightness}%) 
            saturate(${state.bgEffects.saturation}%) 
            contrast(${state.bgEffects.contrast}%)
          `,
          transform: state.bgEffects.blur > 0 ? 'scale(1.1)' : 'scale(1)'
        }}
      />
      
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ 
          opacity: state.bgEffects.noise / 100,
          backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')`,
          filter: 'contrast(150%) brightness(100%)'
        }}
      />
    </>
  )
}
