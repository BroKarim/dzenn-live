"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Link as LinkIcon, CreditCard, Image as ImageIcon, Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogClose } from "@/components/ui/alert-dialog";
import type { ProfileEditorData } from "@/server/user/profile/payloads";
import { createLink, deleteLink, uploadMedia } from "@/server/user/links/actions";
import { toast } from "sonner";

interface LinkCardEditorProps {
  profile: ProfileEditorData;
  onUpdate: (profile: ProfileEditorData) => void;
}

export function LinkCardEditor({ profile, onUpdate }: LinkCardEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedLink, setExpandedLink] = useState(false);
  const [expandedStripe, setExpandedStripe] = useState(false);
  const [expandedImage, setExpandedImage] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    description: "",
    icon: null as string | null,
    mediaUrl: null as string | null,
    mediaType: null as "image" | "video" | null,
    paymentProvider: null as "stripe" | "lemonsqueezy" | null,
    paymentAccountId: null as string | null,
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/x-icon", "image/vnd.microsoft.icon", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPG, PNG, WebP, ICO or SVG.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const result = reader.result as string;
      setLogoPreview(result);

      try {
        const uploadResult = await uploadMedia(result, file.name, "icon");

        if (uploadResult.success && uploadResult.url) {
          setNewLink({ ...newLink, icon: uploadResult.url });
          toast.success("Icon uploaded!");
        } else {
          toast.error("Failed to upload icon");
          setLogoPreview(null);
        }
      } catch (error) {
        toast.error("Error uploading icon");
        setLogoPreview(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPG, PNG or WebP.");
      return;
    }

    const isVideo = file.type.startsWith("video/");
    const reader = new FileReader();
    reader.onloadend = async () => {
      const result = reader.result as string;
      setMediaPreview(result);

      try {
        const uploadResult = await uploadMedia(result, file.name, "media");

        if (uploadResult.success && uploadResult.url) {
          setNewLink({
            ...newLink,
            mediaUrl: uploadResult.url,
            mediaType: isVideo ? "video" : "image",
            paymentProvider: null,
            paymentAccountId: null,
          });
          toast.success("Media uploaded!");
        } else {
          toast.error("Failed to upload media");
          setMediaPreview(null);
        }
      } catch (error) {
        toast.error("Error uploading media");
        setMediaPreview(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePaymentSelect = (provider: "stripe" | "lemonsqueezy") => {
    setNewLink({
      ...newLink,
      paymentProvider: provider,
      paymentAccountId: "dummy-account-id",
      mediaUrl: null,
      mediaType: null,
    });
    setMediaPreview(null);
    setExpandedStripe(false);
    toast.success(`Connected with ${provider === "stripe" ? "Stripe" : "Lemon Squeezy"}`);
  };

  const handleAdd = async () => {
    const payload = {
      title: newLink.title,
      url: newLink.url.trim(),
      description: newLink.description || null,
      icon: newLink.icon || null,
      mediaUrl: newLink.mediaUrl || null,
      mediaType: newLink.mediaType || null,
      paymentProvider: newLink.paymentProvider || null,
      paymentAccountId: newLink.paymentAccountId || null,
      position: profile.links.length,
      isActive: true,
    };

    const { LinkSchema } = await import("@/server/user/links/schema");
    const validation = LinkSchema.safeParse(payload);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      toast.error(firstError.message);
      return;
    }

    setIsSaving(true);
    try {
      const result = await createLink(payload);

      if (result.success && result.data) {
        onUpdate({ ...profile, links: [...profile.links, result.data as any] });
        toast.success("Link added!");
        resetForm();
      } else {
        toast.error(result.error || "Failed to add link");
      }
    } catch (error) {
      toast.error("Error adding link");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteLink(id);
      if (result.success) {
        onUpdate({ ...profile, links: profile.links.filter((l) => l.id !== id) });
        toast.success("Link deleted!");
      } else {
        toast.error(result.error || "Failed to delete link");
      }
    } catch (error) {
      toast.error("Error deleting link");
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setExpandedLink(false);
    setExpandedStripe(false);
    setExpandedImage(false);
    setLogoPreview(null);
    setMediaPreview(null);
    setNewLink({
      title: "",
      url: "",
      description: "",
      icon: null,
      mediaUrl: null,
      mediaType: null,
      paymentProvider: null,
      paymentAccountId: null,
    });
  };

  return (
    <div className="space-y-4">
      {!isAdding && (
        <Button onClick={() => setIsAdding(true)} className="w-full gap-2 py-6 border-2 border-dashed" variant="outline">
          <Plus className="h-4 w-4" /> Add New Link
        </Button>
      )}

      {isAdding && (
        <div className="border-2 border-dashed rounded-xl p-4 space-y-4 bg-card">
          <div className="flex gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Logo</Label>
              <div className="relative">
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" id="logo-upload" />
                <div className="h-14 w-14 rounded-lg border-2 border-dashed border-border bg-muted flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden">
                  {logoPreview ? <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" /> : <Plus className="h-5 w-5 text-muted-foreground" />}
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <Label className="text-xs">Name</Label>
              <Input value={newLink.title} onChange={(e) => setNewLink({ ...newLink, title: e.target.value })} placeholder="e.g. My Portfolio" className="h-14" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Description (Optional)</Label>
            <Textarea value={newLink.description} onChange={(e) => setNewLink({ ...newLink, description: e.target.value })} placeholder="Short description about this link" rows={3} />
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={expandedLink ? "default" : "outline"}
              size="icon"
              onClick={() => {
                setExpandedLink(!expandedLink);
                setExpandedStripe(false);
                setExpandedImage(false);
              }}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant={expandedStripe || newLink.paymentProvider ? "default" : "outline"}
              size="icon"
              onClick={() => {
                setExpandedStripe(!expandedStripe);
                setExpandedLink(false);
                setExpandedImage(false);
              }}
            >
              <CreditCard className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant={expandedImage || mediaPreview ? "default" : "outline"}
              size="icon"
              onClick={() => {
                setExpandedImage(!expandedImage);
                setExpandedLink(false);
                setExpandedStripe(false);
              }}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>

            <div className="flex-1" />

            <Button type="button" variant="ghost" size="icon" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>

          {expandedLink && (
            <div className="space-y-2 animate-in slide-in-from-top-2">
              <Label className="text-xs">Link URL</Label>
              <Input value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} placeholder="https://example.com" />
            </div>
          )}

          {expandedStripe && (
            <div className="space-y-2 animate-in slide-in-from-top-2">
              <Label className="text-xs">Connect Payment Provider</Label>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => handlePaymentSelect("stripe")}>
                  Connect with Stripe
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => handlePaymentSelect("lemonsqueezy")}>
                  Connect with Lemon Squeezy
                </Button>
              </div>
            </div>
          )}

          {expandedImage && (
            <div className="space-y-2 animate-in slide-in-from-top-2">
              <Label className="text-xs">Upload Image/Video</Label>
              <div className="relative">
                <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="h-32 rounded-lg border-2 border-dashed border-border bg-muted flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden">
                  {mediaPreview ? (
                    newLink.mediaType === "video" ? (
                      <video src={mediaPreview} className="h-full w-full object-cover" muted />
                    ) : (
                      <img src={mediaPreview} alt="Preview" className="h-full w-full object-cover" />
                    )
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Click to upload</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button onClick={handleAdd} disabled={isSaving} className="flex-1 gap-2">
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Link
            </Button>
            <Button onClick={resetForm} variant="outline" disabled={isSaving}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {profile.links?.map((link: any) => (
          <div key={link.id} className="flex items-center justify-between p-3 border rounded-xl bg-card">
            <div className="flex items-center gap-3">
              {link.icon && <img src={link.icon} alt="" className="h-8 w-8 rounded object-cover" />}
              <span className="font-medium text-sm">{link.title}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(link.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel adding this link?</AlertDialogTitle>
            <AlertDialogDescription>This will discard all unsaved changes.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant="outline" />}>No, keep editing</AlertDialogClose>
            <AlertDialogClose onClick={resetForm} render={<Button variant="destructive" />}>
              Yes, discard
            </AlertDialogClose>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
