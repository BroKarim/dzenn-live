"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Upload, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button" 
import { EditorState } from "@/lib/editor"

const WALLPAPER_PRESETS = [
  "https://images.unsplash.com/photo-1765498069280-b863094c17bf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1767321173860-52dea6b50337?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1767321173860-52dea6b50337?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1767321173860-52dea6b50337?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1767321173860-52dea6b50337?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1767321173860-52dea6b50337?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
]

interface BackgroundOptionsProps {
  state: Pick<EditorState, "backgroundType" | "backgroundColor" | "backgroundGradient" | "backgroundWallpaper" | "backgroundImage">
  onUpdate: (updates: Partial<EditorState>) => void
}

export default function BackgroundOptions({ state, onUpdate }: BackgroundOptionsProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onUpdate({ backgroundImage: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }
  
  return (
    <Tabs value={state.backgroundType} onValueChange={(v) => onUpdate({ backgroundType: v })}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="color">Color</TabsTrigger>
        <TabsTrigger value="gradient">Grad</TabsTrigger>
        <TabsTrigger value="wallpaper">Wall</TabsTrigger>
        <TabsTrigger value="image">Img</TabsTrigger>
      </TabsList>

      {/* Existing Color Content */}
      <TabsContent value="color" className="space-y-4 pt-4">
        <div className="grid grid-cols-3 gap-2">
          {["#1a1a1a", "#2d2d2d", "#3f3f3f", "#4f4f4f", "#1e293b", "#334155"].map((color) => (
            <button
              key={color}
              onClick={() => onUpdate({ backgroundColor: color })}
              className={`h-10 rounded-lg border-2 transition-all ${state.backgroundColor === color ? "border-primary" : "border-transparent"}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input type="color" value={state.backgroundColor} onChange={(e) => onUpdate({ backgroundColor: e.target.value })} className="h-8 w-12 cursor-pointer" />
          <span className="text-xs text-muted-foreground">Custom Color</span>
        </div>
      </TabsContent>

      {/* Existing Gradient Content */}
      <TabsContent value="gradient" className="space-y-4 pt-4">
        <div className="grid grid-cols-1 gap-2">
          {[
            { from: "#4f46e5", to: "#ec4899" },
            { from: "#f97316", to: "#dc2626" },
            { from: "#10b981", to: "#3b82f6" },
          ].map((g, i) => (
            <button
              key={i}
              onClick={() => onUpdate({ backgroundGradient: g })}
              className="h-10 w-full rounded-lg border-2 border-transparent"
              style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
            />
          ))}
        </div>
      </TabsContent>

      {/* NEW: Wallpaper Content */}
      <TabsContent value="wallpaper" className="space-y-4 pt-4">
        <div className="grid grid-cols-3 gap-2">
          {WALLPAPER_PRESETS.map((url) => (
            <button
              key={url}
              onClick={() => onUpdate({ backgroundWallpaper: url })}
              className={`relative h-20 overflow-hidden rounded-lg border-2 transition-all ${state.backgroundWallpaper === url ? "border-primary" : "border-transparent"}`}
            >
              <img src={url} className="h-full w-full object-cover" alt="preset" />
            </button>
          ))}
        </div>
      </TabsContent>

      {/* NEW: Image Upload Content */}
      <TabsContent value="image" className="space-y-4 pt-4">
        <div className="flex flex-col gap-4">
          <div className="relative group flex h-32 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted transition-colors hover:border-primary/50">
            {state.backgroundImage ? (
              <img src={state.backgroundImage} className="h-full w-full rounded-lg object-cover" alt="upload" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-6 w-6" />
                <span className="text-xs">Upload Background</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 cursor-pointer opacity-0" />
          </div>
          {state.backgroundImage && (
            <Button variant="outline" size="sm" onClick={() => onUpdate({ backgroundImage: null })} className="w-full text-destructive">
              Remove Image
            </Button>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}

