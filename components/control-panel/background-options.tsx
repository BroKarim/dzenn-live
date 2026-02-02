"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon, Palette, Rainbow } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { ProfileEditorData } from "@/server/user/profile/payloads";
import { BACKGROUND_COLORS } from "@/lib/background-colors";
import { BACKGROUND_GRADIENTS } from "@/lib/background-gradients";
import { getBackgroundPresets } from "@/server/website/background-presets/actions";
import type { BackgroundPreset } from "@/server/website/background-presets/schema";
import { useEffect, useState, useRef } from "react";
import { updateBackground } from "@/server/user/profile/actions";
import { toast } from "sonner";

interface BackgroundOptionsProps {
  profile: ProfileEditorData;
  onUpdate: (profile: ProfileEditorData) => void;
}

export default function BackgroundOptions({ profile, onUpdate }: BackgroundOptionsProps) {
  const [wallpaperPresets, setWallpaperPresets] = useState<BackgroundPreset[]>([]);
  const [isLoadingWallpapers, setIsLoadingWallpapers] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadWallpapers() {
      setIsLoadingWallpapers(true);
      const presets = await getBackgroundPresets();
      setWallpaperPresets(presets);
      setIsLoadingWallpapers(false);
    }
    loadWallpapers();
  }, []);

  // Debounced save to database
  const debouncedSave = (data: Partial<ProfileEditorData>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSaving(true);
    saveTimeoutRef.current = setTimeout(async () => {
      const toastId = toast.loading("Saving background...");

      try {
        const result = await updateBackground({
          bgType: data.bgType as any,
          bgColor: data.bgColor,
          bgGradientFrom: data.bgGradientFrom,
          bgGradientTo: data.bgGradientTo,
          bgWallpaper: data.bgWallpaper,
          bgImage: data.bgImage,
        });

        if (result.success) {
          toast.success("Background saved", { id: toastId });
        } else {
          toast.error("Failed to save", { id: toastId });
        }
      } catch (error) {
        toast.error("Error saving background", { id: toastId });
      } finally {
        setIsSaving(false);
      }
    }, 1500);
  };

  const handleBackgroundChange = (updates: Partial<ProfileEditorData>) => {
    // 1. Optimistic update - langsung update UI
    onUpdate({ ...profile, ...updates });

    // 2. Debounced save ke database
    debouncedSave({ ...profile, ...updates });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleBackgroundChange({ bgImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Tabs value={profile.bgType} onValueChange={(v) => handleBackgroundChange({ bgType: v as any })}>
      <TabsList className="grid w-full grid-cols-4 h-auto bg-transparent  p-1 gap-1">
        <TabsTrigger value="color" className="p-0 h-full w-full">
          <div className="w-full h-full rounded-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center gap-2 bg-muted/20">
            <Palette className="h-6 w-6 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground">Color</span>
          </div>
        </TabsTrigger>
        <TabsTrigger value="gradient" className="p-0 h-full w-full">
          <div className="w-full h-full rounded-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center gap-2 bg-muted/20">
            <Rainbow className="h-6 w-6 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground">Gradient</span>
          </div>
        </TabsTrigger>
        <TabsTrigger value="wallpaper" className="p-0 h-full w-full">
          <div className="w-full h-full rounded-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center gap-2 bg-muted/20">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground">Wallpaper</span>
          </div>
        </TabsTrigger>
        <TabsTrigger value="image" className="p-0 h-full w-full">
          <div className="w-full h-full rounded-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center gap-2 bg-muted/20">
            <Upload className="h-6 w-6 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground">Image</span>
          </div>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="color" className="space-y-4 pt-4">
        <div className="flex flex-wrap gap-1 justify-between">
          {BACKGROUND_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleBackgroundChange({ bgColor: color })}
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
            <Input type="color" value={profile.bgColor || "#000000"} onChange={(e) => handleBackgroundChange({ bgColor: e.target.value })} className="absolute -inset-2 h-12 w-16 cursor-pointer" />
          </div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Custom Color</span>
        </div>
      </TabsContent>

      <TabsContent value="gradient" className="space-y-4 pt-4">
        <div className="flex flex-wrap gap-1 justify-between">
          {BACKGROUND_GRADIENTS.map((gradient, i) => (
            <button
              key={i}
              onClick={() => handleBackgroundChange({ bgGradientFrom: gradient.from, bgGradientTo: gradient.to })}
              className={`relative aspect-square h-10 w-10 rounded-md transition-all duration-200 ${
                profile.bgGradientFrom === gradient.from && profile.bgGradientTo === gradient.to ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110 z-10" : "hover:scale-110 active:scale-95 border border-black/5"
              }`}
              style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
              title={gradient.name}
            >
              {profile.bgGradientFrom === gradient.from && profile.bgGradientTo === gradient.to && <div className="absolute inset-0 rounded-md border-2 border-primary/20 animate-pulse" />}
            </button>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="wallpaper" className="space-y-4 pt-4">
        {isLoadingWallpapers ? (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">Loading wallpapers...</div>
        ) : wallpaperPresets.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/10 py-12 text-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm font-medium text-muted-foreground">No wallpapers available</p>
            <p className="text-xs text-muted-foreground/70">Wallpapers will appear here once added</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {wallpaperPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleBackgroundChange({ bgWallpaper: preset.url })}
                className={`relative h-20 overflow-hidden rounded-lg border-2 transition-all ${
                  profile.bgWallpaper === preset.url ? "border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background scale-105" : "border-transparent hover:border-primary/50 hover:scale-105"
                }`}
                title={preset.name}
              >
                <Image src={preset.url} fill className="object-cover" alt={preset.name} sizes="(max-width: 768px) 33vw, 100px" />
                {profile.bgWallpaper === preset.url && <div className="absolute inset-0 bg-primary/10 border-2 border-primary/30" />}
              </button>
            ))}
          </div>
        )}
      </TabsContent>
      <TabsContent value="image" className="space-y-4 pt-4">
        <div className="flex flex-col gap-4">
          <div className="relative group flex h-32 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted transition-colors hover:border-primary/50">
            {profile.bgImage ? (
              <Image src={profile.bgImage} fill className="rounded-lg object-cover" alt="upload" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-6 w-6" />
                <span className="text-xs">Upload Background</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 cursor-pointer opacity-0" />
          </div>
          {profile.bgImage && (
            <Button variant="outline" size="sm" onClick={() => handleBackgroundChange({ bgImage: null })} className="w-full text-destructive">
              Remove Image
            </Button>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
