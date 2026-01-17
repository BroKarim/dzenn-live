"use client"

interface PreviewProps {
  state: {
    backgroundType: string
    backgroundColor: string
    backgroundGradient: { from: string; to: string }
    blurAmount: number
    padding: number
  }
}

export default function EditorPreview({ state }: PreviewProps) {
  const getBackgroundStyle = () => {
    if (state.backgroundType === "gradient") {
      return {
        background: `linear-gradient(135deg, ${state.backgroundGradient.from} 0%, ${state.backgroundGradient.to} 100%)`,
      }
    }
    return {
      backgroundColor: state.backgroundColor,
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <div
        className="relative flex-1 overflow-hidden rounded-xl border border-border"
        style={{ ...getBackgroundStyle() }}
      >
        {/* Background blur effect */}
        <div className="absolute inset-0 backdrop-blur-sm" style={{ backdropFilter: `blur(${state.blurAmount}px)` }} />

        {/* Preview card */}
        <div
          className="relative flex items-center justify-center p-4 sm:p-6 lg:p-8"
          style={{ padding: `${state.padding}px` }}
        >
          <div className="w-full max-w-2xl rounded-lg bg-card/95 p-6 shadow-2xl backdrop-blur-md">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20" />
              <h2 className="text-lg font-semibold text-card-foreground">Brokerish</h2>
            </div>

            <p className="mb-6 text-sm text-muted-foreground">Design and build tools people love</p>

            <div className="mb-6 flex gap-3">
              <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
                Work
              </button>
              <button className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Articles
              </button>
              <button className="text-sm text-muted-foreground transition-colors hover:text-foreground">Contact</button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">Zindex</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  An open-source catalog that actually ships. A curated hub of templates, components, tools, and assets.
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">ZonaFeliz</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  A data-driven, climate-based planting calendar built for my team. It integrates historical.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  )
}
