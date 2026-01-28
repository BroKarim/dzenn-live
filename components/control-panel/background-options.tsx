"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon, Palette, Rainbow } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { ProfileEditorData } from "@/server/user/profile/payloads";
import { BACKGROUND_COLORS } from "@/lib/background-colors";

const WALLPAPER_PRESETS = [
  "https://images.unsplash.com/photo-1765498069280-b863094c17bf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1767321173860-52dea6b50337?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1767321173860-52dea6b50337?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1767321173860-52dea6b50337?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1767321173860-52dea6b50337?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1767321173860-52dea6b50337?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

interface BackgroundOptionsProps {
  profile: ProfileEditorData;
  onUpdate: (profile: ProfileEditorData) => void;
}

export default function BackgroundOptions({ profile, onUpdate }: BackgroundOptionsProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ ...profile, bgImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Tabs value={profile.bgType} onValueChange={(v) => onUpdate({ ...profile, bgType: v as any })}>
      <TabsList className="grid w-full grid-cols-4 h-auto bg-transparent  p-1 gap-1">
        <TabsTrigger value="color" className="p-0 h-full w-full">
          <div className="w-full h-full rounded-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/20">
            <Palette className="h-6 w-6 text-muted-foreground" />
          </div>
        </TabsTrigger>
        <TabsTrigger value="gradient" className="p-0 h-full w-full">
          <div className="w-full h-full rounded-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/20">
            <Rainbow className="h-6 w-6 text-muted-foreground" />
          </div>
        </TabsTrigger>
        <TabsTrigger value="wallpaper" className="p-0 h-full w-full">
          <div className="w-full h-full rounded-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/20">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          </div>
        </TabsTrigger>
        <TabsTrigger value="image" className="p-0 h-full w-full">
          <div className="w-full h-full rounded-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/20">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="color" className="space-y-4 pt-4">
        <div className="flex flex-wrap gap-1 justify-between">
          {BACKGROUND_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onUpdate({ ...profile, bgColor: color })}
              className={`relative aspect-square h-10 w-10 rounded-full transition-all duration-200 ${
                profile.bgColor === color ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110 z-10" : "hover:scale-110 active:scale-95 border border-black/5"
              }`}
              style={{ backgroundColor: color }}
            >
              {profile.bgColor === color && <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse" />}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
          <div className="relative h-8 w-12 overflow-hidden rounded-md border shadow-sm">
            <Input type="color" value={profile.bgColor || "#000000"} onChange={(e) => onUpdate({ ...profile, bgColor: e.target.value })} className="absolute -inset-2 h-12 w-16 cursor-pointer" />
          </div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Custom Color</span>
        </div>
      </TabsContent>

      <TabsContent value="gradient" className="space-y-4 pt-4">
        <div className="grid grid-cols-1 gap-2">
          {[
            { from: "#4f46e5", to: "#ec4899" },
            { from: "#f97316", to: "#dc2626" },
            { from: "#10b981", to: "#3b82f6" },
          ].map((g, i) => (
            <button
              key={i}
              onClick={() => onUpdate({ ...profile, bgGradientFrom: g.from, bgGradientTo: g.to })}
              className="h-10 w-full rounded-lg border-2 border-transparent"
              style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="wallpaper" className="space-y-4 pt-4">
        <div className="grid grid-cols-3 gap-2">
          {WALLPAPER_PRESETS.map((url) => (
            <button
              key={url}
              onClick={() => onUpdate({ ...profile, bgWallpaper: url })}
              className={`relative h-20 overflow-hidden rounded-lg border-2 transition-all ${profile.bgWallpaper === url ? "border-primary" : "border-transparent"}`}
            >
              <img src={url} className="h-full w-full object-cover" alt="preset" />
            </button>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="image" className="space-y-4 pt-4">
        <div className="flex flex-col gap-4">
          <div className="relative group flex h-32 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted transition-colors hover:border-primary/50">
            {profile.bgImage ? (
              <img src={profile.bgImage} className="h-full w-full rounded-lg object-cover" alt="upload" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-6 w-6" />
                <span className="text-xs">Upload Background</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 cursor-pointer opacity-0" />
          </div>
          {profile.bgImage && (
            <Button variant="outline" size="sm" onClick={() => onUpdate({ ...profile, bgImage: null })} className="w-full text-destructive">
              Remove Image
            </Button>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
