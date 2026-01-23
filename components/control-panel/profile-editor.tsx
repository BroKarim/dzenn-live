
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Camera } from "lucide-react"
import { EditorState } from "@/lib/editor"

interface ProfileEditorProps {
  state: EditorState
  onUpdate: (updates: Partial<EditorState>) => void
}

export function ProfileEditor({ state, onUpdate }: ProfileEditorProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onUpdate({
          profile: { ...state.profile, avatar: reader.result as string },
        })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="relative group cursor-pointer">
          <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
            {state.profile.avatar ? (
              <img src={state.profile.avatar} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <Camera className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageUpload}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="text-[10px] text-white font-medium text-center px-2">CHANGE IMAGE</span>
          </div>
        </div>
      </div>

      {/* Name & Description */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Display Name</Label>
          <Input
            value={state.profile.name}
            onChange={(e) => onUpdate({ profile: { ...state.profile, name: e.target.value } })}
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <Label>Bio / Description</Label>
          <Textarea
            value={state.profile.description}
            onChange={(e) => onUpdate({ profile: { ...state.profile, description: e.target.value } })}
            placeholder="Tell something about yourself"
            rows={3}
          />
        </div>
      </div>
    </div>
  )
}


