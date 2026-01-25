import { Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { SOCIAL_PLATFORMS } from "@/lib/sosmed";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ProfileEditorData } from "@/server/user/profile/payloads";

interface SocialMediaEditorProps {
  profile: ProfileEditorData;
  onUpdate: (profile: ProfileEditorData) => void;
}

export function SocialMediaEditor({ profile, onUpdate }: SocialMediaEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [url, setUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const resetForm = () => {
    setEditingId(null);
    setSelectedPlatform("");
    setUrl("");
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleOpenEdit = (social: any) => {
    setEditingId(social.id);
    setSelectedPlatform(social.platform);
    setUrl(social.url);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!selectedPlatform) return;

    if (editingId) {
      const updated = profile.socials.map((s: any) => (s.id === editingId ? { ...s, platform: selectedPlatform, url } : s));
      onUpdate({ ...profile, socials: updated });
    } else {
      const newSocial = { id: Math.random().toString(36).substr(2, 9), platform: selectedPlatform, url, position: profile.socials.length };
      onUpdate({ ...profile, socials: [...(profile.socials || []), newSocial] });
    }
    resetForm();
  };

  const removeSocial = (id: string) => {
    onUpdate({ ...profile, socials: profile.socials.filter((s: any) => s.id !== id) });
  };

  // Filter platforms based on search
  const filteredPlatforms = SOCIAL_PLATFORMS.filter((p) => p.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-4">
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) resetForm();
          setIsOpen(open);
        }}
      >
        <DialogTrigger render={<Button variant="outline" className="w-full border-dashed py-6 gap-2 border-2" />}>
          <Plus className="h-4 w-4" /> Add Social Media
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Social Link" : "Add Social Link"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label>Select Platform</Label>

              {/* Search Input */}
              <Input placeholder="Search platform..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="mb-2" />

              {/* Platform Grid */}
              <ScrollArea className="h-[240px] rounded-md border p-2">
                <div className="grid grid-cols-2 gap-2">
                  {filteredPlatforms.length > 0 ? (
                    filteredPlatforms.map((platform) => {
                      const Icon = platform.icon;
                      const isSelected = selectedPlatform === platform.id;

                      return (
                        <button
                          key={platform.id}
                          type="button"
                          onClick={() => setSelectedPlatform(platform.id)}
                          className={`flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all hover:border-primary/50 ${isSelected ? "border-primary bg-primary/10 text-primary" : "border-muted bg-card"}`}
                        >
                          <Icon className={`h-5 w-5 shrink-0 ${isSelected ? "text-primary" : ""}`} />
                          <span className="text-sm font-medium truncate">{platform.label}</span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="col-span-2 flex items-center justify-center py-8 text-sm text-muted-foreground">No platform found</div>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <Label>URL / Link</Label>
              <Input placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" type="button" onClick={resetForm}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!selectedPlatform}>
              {editingId ? "Update Link" : "Add to Profile"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Social List Cards */}
      <div className="grid gap-2">
        {profile.socials?.map((social: any) => {
          const platform = SOCIAL_PLATFORMS.find((p) => p.id === social.platform);
          const Icon = platform?.icon || Globe;
          return (
            <div key={social.id} className="flex items-center justify-between group rounded-xl border bg-card p-3 transition-all hover:border-primary/50">
              <div className="flex flex-1 items-center gap-3 cursor-pointer" onClick={() => handleOpenEdit(social)}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold capitalize">{platform?.label || social.platform}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">{social.url || "No link added"}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" onClick={() => handleOpenEdit(social)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => removeSocial(social.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
