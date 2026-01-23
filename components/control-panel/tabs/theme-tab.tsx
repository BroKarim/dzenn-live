import { Palette } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import BackgroundOptions from "@/components/control-panel/background-options"
import BackgroundEffect from "@/components/control-panel/background-effect"
import { CardTextureSelector } from "@/components/control-panel/texture-selector"
import { EditorState } from "@/lib/editor"

interface ThemeTabProps {
  state: EditorState
  onUpdate: (updates: Partial<EditorState>) => void
}

export function ThemeTab({ state, onUpdate }: ThemeTabProps) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Palette className="h-4 w-4" />
          Background
        </CardTitle>
        <CardDescription>Customize the editor background</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <BackgroundOptions state={state} onUpdate={onUpdate} />
        <BackgroundEffect 
          state={state.bgEffects} 
          onUpdate={(updates) => onUpdate({ bgEffects: { ...state.bgEffects, ...updates } })} 
        />
        <CardTextureSelector state={state} onUpdate={onUpdate} />
      </CardContent>
    </Card>
  )
}
