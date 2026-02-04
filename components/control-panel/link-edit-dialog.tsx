"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Link as LinkIcon, CreditCard, Image as ImageIcon, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { updateLink, uploadMedia } from "@/server/user/links/actions";
import { toast } from "sonner";

type LinkType = "url" | "payment" | "media";

interface LinkData {
  id: string;
  title: string;
  url: string;
  description: string | null;
  icon: string | null;
  mediaUrl: string | null;
  mediaType: "image" | "video" | null;
  paymentProvider: "stripe" | "lemonsqueezy" | null;
  paymentAccountId: string | null;
  isActive: boolean;
  position: number;
}

interface LinkEditDialogProps {
  link: LinkData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (link: LinkData) => void;
}

export function LinkEditDialog({ link, open, onOpenChange, onSave }: LinkEditDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedType, setSelectedType] = useState<LinkType>("url");
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  const [editData, setEditData] = useState({
    title: "",
    url: "",
    description: "",
    icon: null as string | null,
    mediaUrl: null as string | null,
    mediaType: null as "image" | "video" | null,
    paymentProvider: null as "stripe" | "lemonsqueezy" | null,
    paymentAccountId: null as string | null,
  });

  useEffect(() => {
    if (link) {
      setEditData({
        title: link.title || "",
        url: link.url || "",
        description: link.description || "",
        icon: link.icon,
        mediaUrl: link.mediaUrl,
        mediaType: link.mediaType,
        paymentProvider: link.paymentProvider,
        paymentAccountId: link.paymentAccountId,
      });
      setIconPreview(link.icon);
      setMediaPreview(link.mediaUrl);

      // Determine type based on existing data
      if (link.paymentProvider) {
        setSelectedType("payment");
      } else if (link.mediaUrl) {
        setSelectedType("media");
      } else {
        setSelectedType("url");
      }
    }
  }, [link]);

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/x-icon", "image/vnd.microsoft.icon", "image/svg+xml", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPG, PNG, WebP, ICO or SVG.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const result = reader.result as string;
      setIconPreview(result);

      const uploadToast = toast.loading("Uploading icon...");

      try {
        const uploadResult = await uploadMedia(result, file.name, "icon");
        if (uploadResult.success && uploadResult.url) {
          setEditData({ ...editData, icon: uploadResult.url });
          toast.success("Icon uploaded!", { id: uploadToast });
        } else {
          toast.error(uploadResult.error || "Failed to upload icon", { id: uploadToast });
          setIconPreview(editData.icon);
        }
      } catch (error) {
        toast.error("Error uploading icon", { id: uploadToast });
        setIconPreview(editData.icon);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPG, PNG or WebP.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const result = reader.result as string;
      setMediaPreview(result);

      const uploadToast = toast.loading("Uploading media...");

      try {
        const uploadResult = await uploadMedia(result, file.name, "media");
        if (uploadResult.success && uploadResult.url) {
          setEditData({
            ...editData,
            mediaUrl: uploadResult.url,
            mediaType: "image",
          });
          toast.success("Media uploaded!", { id: uploadToast });
        } else {
          toast.error(uploadResult.error || "Failed to upload media", { id: uploadToast });
          setMediaPreview(editData.mediaUrl);
        }
      } catch (error) {
        toast.error("Error uploading media", { id: uploadToast });
        setMediaPreview(editData.mediaUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePaymentSelect = (provider: "stripe" | "lemonsqueezy") => {
    setEditData({
      ...editData,
      paymentProvider: provider,
      paymentAccountId: "dummy-account-id",
    });
    toast.success(`Connected with ${provider === "stripe" ? "Stripe" : "Lemon Squeezy"}`);
  };

  const handleSave = async () => {
    if (!link) return;

    const { LinkSchema } = await import("@/server/user/links/schema");
    const payload = {
      title: editData.title,
      url: editData.url.trim(),
      description: editData.description || null,
      icon: editData.icon || null,
      mediaUrl: editData.mediaUrl || null,
      mediaType: editData.mediaType || null,
      paymentProvider: editData.paymentProvider || null,
      paymentAccountId: editData.paymentAccountId || null,
      position: link.position,
      isActive: link.isActive,
    };

    const validation = LinkSchema.safeParse(payload);
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    // Just update the local state, don't save to DB yet
    onSave({ ...link, ...payload });
    toast.success("Changes applied to preview");
    onOpenChange(false);
  };

  const typeOptions = [
    { id: "url" as LinkType, icon: LinkIcon, label: "URL" },
    { id: "payment" as LinkType, icon: CreditCard, label: "Payment" },
    { id: "media" as LinkType, icon: ImageIcon, label: "Media" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">Edit Link</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Icon Upload */}
          <div className="flex gap-3">
            <div className="relative shrink-0">
              <input id="edit-icon-upload" type="file" accept="image/*" onChange={handleIconUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
              <label htmlFor="edit-icon-upload" className="h-12 w-12 rounded-lg border border-dashed border-border bg-muted/50 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden">
                {iconPreview ? <img src={iconPreview} alt="Icon" className="h-full w-full object-cover" /> : <Plus className="h-4 w-4 text-muted-foreground" />}
              </label>
            </div>

            <div className="flex-1 space-y-2">
              <Input value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} placeholder="Link title" className="h-10 text-sm" />
            </div>
          </div>

          {/* Description */}
          <Input value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} placeholder="Description (optional)" className="h-10 text-sm" />

          {/* Type Selector */}
          <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
            {typeOptions.map((type) => {
              const Icon = type.icon;
              const isActive = selectedType === type.id;

              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`
                    flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all
                    ${isActive ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}
                  `}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Content */}
          {selectedType === "url" && <Input value={editData.url} onChange={(e) => setEditData({ ...editData, url: e.target.value })} placeholder="https://example.com" className="h-10 text-sm" />}

          {selectedType === "payment" && (
            <div className="flex gap-2">
              <button
                onClick={() => handlePaymentSelect("stripe")}
                className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${editData.paymentProvider === "stripe" ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}
              >
                Stripe
              </button>
              <button
                onClick={() => handlePaymentSelect("lemonsqueezy")}
                className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${editData.paymentProvider === "lemonsqueezy" ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}
              >
                Lemon Squeezy
              </button>
            </div>
          )}

          {selectedType === "media" && (
            <div className="relative">
              <input id="edit-media-upload" type="file" accept="image/*" onChange={handleMediaUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
              <label htmlFor="edit-media-upload" className="h-20 rounded-lg border border-dashed border-border bg-muted/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden">
                {mediaPreview ? (
                  <img src={mediaPreview} alt="Media" className="h-full w-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="h-5 w-5 text-muted-foreground mb-1" />
                    <span className="text-[10px] text-muted-foreground">Click to upload</span>
                  </>
                )}
              </label>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} disabled={isSaving || !editData.title} size="sm" className="flex-1 h-9 text-sm">
              {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Save Changes
            </Button>
            <Button onClick={() => onOpenChange(false)} variant="ghost" size="sm" className="h-9 text-sm" disabled={isSaving}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
