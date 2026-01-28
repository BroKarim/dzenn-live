"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Link as LinkIcon, CreditCard, Image as ImageIcon, Loader2, GripVertical, ChevronRight, X, ExternalLink } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogClose } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import type { ProfileEditorData } from "@/server/user/profile/payloads";
import { createLink, deleteLink, uploadMedia } from "@/server/user/links/actions";
import { toast } from "sonner";
import { Button2 } from "@/components/ui/button-2";

interface LinkCardEditorProps {
  profile: ProfileEditorData;
  onUpdate: (profile: ProfileEditorData) => void;
}

type LinkType = "url" | "payment" | "media";

export function LinkCardEditor({ profile, onUpdate }: LinkCardEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedType, setSelectedType] = useState<LinkType>("url");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
    });
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
    setDeletingId(id);
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
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setSelectedType("url");
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

  const typeOptions = [
    { id: "url" as LinkType, icon: LinkIcon, label: "URL" },
    { id: "payment" as LinkType, icon: CreditCard, label: "Payment" },
    { id: "media" as LinkType, icon: ImageIcon, label: "Media" },
  ];

  return (
    <div className="space-y-3">
      {/* Add New Link Button - Compact & Aligned Right */}
      {!isAdding && (
        <div className="flex justify-end">
          <Button2 onClick={() => setIsAdding(true)} variant="blue" size="sm" className="w-1/3 rounded-md">
            <Plus className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
            <span>Add link</span>
          </Button2>
        </div>
      )}

      {/* Compact Add Form */}
      {isAdding && (
        <div className="border border-border rounded-xl bg-card overflow-hidden animate-in slide-in-from-top-2 duration-200">
          {/* Form Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
            <span className="text-xs font-medium text-foreground">New Link</span>
            <button onClick={resetForm} className="p-1 rounded-md hover:bg-muted transition-colors">
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>

          <div className="p-3 space-y-3">
            {/* Type Selector - Compact Pills */}
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
                    <span className="hidden sm:inline">{type.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Title + Icon Row */}
            <div className="flex gap-2">
              {/* Icon Upload */}
              <div className="relative shrink-0">
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <div className="h-10 w-10 rounded-lg border border-dashed border-border bg-muted/50 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden">
                  {logoPreview ? <img src={logoPreview} alt="Icon" className="h-full w-full object-cover" /> : <Plus className="h-4 w-4 text-muted-foreground" />}
                </div>
              </div>

              {/* Title Input */}
              <Input value={newLink.title} onChange={(e) => setNewLink({ ...newLink, title: e.target.value })} placeholder="Link title" className="h-10 flex-1 text-sm" />
            </div>

            {/* Dynamic Content Based on Type */}
            {selectedType === "url" && <Input value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} placeholder="https://example.com" className="h-10 text-sm" />}

            {selectedType === "payment" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handlePaymentSelect("stripe")}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${newLink.paymentProvider === "stripe" ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}
                >
                  Stripe
                </button>
                <button
                  onClick={() => handlePaymentSelect("lemonsqueezy")}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${newLink.paymentProvider === "lemonsqueezy" ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}
                >
                  Lemon Squeezy
                </button>
              </div>
            )}

            {selectedType === "media" && (
              <div className="relative">
                <input type="file" accept="image/*" onChange={handleMediaUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <div className="h-20 rounded-lg border border-dashed border-border bg-muted/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden">
                  {mediaPreview ? (
                    <img src={mediaPreview} alt="Media" className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon className="h-5 w-5 text-muted-foreground mb-1" />
                      <span className="text-[10px] text-muted-foreground">Click to upload</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <Button onClick={handleAdd} disabled={isSaving || !newLink.title} size="sm" className="flex-1 h-9 text-sm">
                {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
                Add Link
              </Button>
              <Button onClick={resetForm} variant="ghost" size="sm" className="h-9 text-sm" disabled={isSaving}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Link List - Compact */}
      <div className="space-y-1.5">
        <TooltipProvider>
          {profile.links?.map((link: any) => (
            <div
              key={link.id}
              className="group flex items-center gap-2 p-2 shadow-[0px_32px_64px_-16px_#0000004c,0px_16px_32px_-8px_#0000004c,0px_8px_16px_-4px_#0000003d,0px_4px_8px_-2px_#0000003d,0px_-8px_16px_-1px_#00000029,0px_2px_4px_-1px_#0000003d,0px_0px_0px_1px_#000000,inset_0px_0px_0px_1px_#ffffff14,inset_0px_1px_0px_#ffffff33] border-none rounded-lg bg-card hover:border-primary/30 transition-all"
            >
              {/* Drag Handle */}
              <div className="p-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
              </div>

              {/* Icon */}
              {link.icon ? (
                <img src={link.icon} alt="" className="h-7 w-7 rounded-md object-cover shrink-0" />
              ) : (
                <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center shrink-0">
                  <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              )}

              {/* Title */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{link.title}</p>
                {link.url && <p className="text-[10px] text-muted-foreground truncate">{link.url}</p>}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {link.url && (
                  <Tooltip>
                    <TooltipTrigger>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-muted transition-colors">
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="top">Open link</TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger>
                    <button onClick={() => handleDelete(link.id)} disabled={deletingId === link.id} className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors">
                      {deletingId === link.id ? <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" /> : <Trash2 className="h-3.5 w-3.5 text-destructive" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Delete link</TooltipContent>
                </Tooltip>
              </div>
            </div>
          ))}
        </TooltipProvider>

        {/* Empty State */}
        {(!profile.links || profile.links.length === 0) && !isAdding && (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted mb-2">
              <Link2Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No links yet</p>
            <p className="text-xs text-muted-foreground/70">Add your first link above</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>This will discard all unsaved changes to this link.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant="outline" size="sm" />}>Keep editing</AlertDialogClose>
            <AlertDialogClose onClick={resetForm} render={<Button variant="destructive" size="sm" />}>
              Discard
            </AlertDialogClose>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Import Link2 icon alias
const Link2Icon = LinkIcon;
