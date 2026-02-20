"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Link as LinkIcon, Image as ImageIcon, Loader2, GripVertical, X, ExternalLink, Pencil } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import type { ProfileEditorData } from "@/server/user/profile/payloads";
import { getUploadUrl } from "@/server/upload/actions";
import { compressImage } from "@/lib/media";
import { LinkEditDialog } from "./link-edit-dialog";
import { toast } from "sonner";
import { Button2 } from "@/components/ui/button-2";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  const [editingLink, setEditingLink] = useState<any | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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
    let file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/x-icon", "image/vnd.microsoft.icon", "image/svg+xml", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPG, PNG, WebP, ICO or SVG.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size too large (max 5MB)");
      return;
    }

    try {
      // 1. Client-side Compression (skip for ICO/SVG)
      if (!file.type.includes("svg") && !file.type.includes("icon")) {
        try {
          const compressed = await compressImage(file, {
            maxSizeMB: 0.1, // Icon can be very small (100KB)
            maxWidthOrHeight: 256,
          });
          file = compressed;
        } catch (err) {
          console.warn("Compression failed, using original", err);
        }
      }

      // 2. Get Presigned URL
      const { success, url, publicUrl, error } = await getUploadUrl(file.name, file.type);

      if (!success || !url) throw new Error(error || "Failed to get upload URL");

      // 3. Upload to S3
      const res = await fetch(url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!res.ok) throw new Error("Failed to upload icon to S3");

      setNewLink({ ...newLink, icon: publicUrl! });
      setLogoPreview(publicUrl!); // Preview directly from S3 URL or creating object URL is better, but this works if publicUrl is fast
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error uploading icon");
      setLogoPreview(null);
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPG, PNG or WebP.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size too large (max 10MB)");
      return;
    }

    try {
      // 1. Client-side Compression
      try {
        const compressed = await compressImage(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 800,
        });
        file = compressed;
      } catch (err) {
        console.warn("Compression failed, using original", err);
      }

      // 2. Get Presigned URL
      const { success, url, publicUrl, error } = await getUploadUrl(file.name, file.type);

      if (!success || !url) throw new Error(error || "Failed to get upload URL");

      // 3. Upload to S3
      const res = await fetch(url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!res.ok) throw new Error("Failed to upload media to S3");

      setNewLink({
        ...newLink,
        mediaUrl: publicUrl!,
        mediaType: "image",
      });
      setMediaPreview(publicUrl!);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error uploading media");
      setMediaPreview(null);
    }
  };

  const handlePaymentSelect = (provider: "stripe" | "lemonsqueezy") => {
    setNewLink({
      ...newLink,
      paymentProvider: provider,
      paymentAccountId: "dummy-account-id",
    });
  };

  const handleAdd = async () => {
    const payload = {
      id: `temp-${Date.now()}`,
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
    } as any;

    const { LinkSchema } = await import("@/server/user/links/schema");
    const { id, ...validationPayload } = payload;
    const validation = LinkSchema.safeParse(validationPayload);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      toast.error(firstError.message);
      return;
    }

    onUpdate({ ...profile, links: [...profile.links, payload] });
    resetForm();
  };

  const handleDelete = (id: string) => {
    onUpdate({
      ...profile,
      links: profile.links.filter((l) => l.id !== id),
    });
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

  const handleEdit = (link: any) => {
    setEditingLink(link);
    setEditDialogOpen(true);
  };

  const handleEditSave = (updatedLink: any) => {
    onUpdate({
      ...profile,
      links: profile.links.map((l) => (l.id === updatedLink.id ? updatedLink : l)),
    });
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = profile.links.findIndex((l) => l.id === active.id);
    const newIndex = profile.links.findIndex((l) => l.id === over.id);

    const newLinks = arrayMove(profile.links, oldIndex, newIndex).map((link, index) => ({
      ...link,
      position: index,
    }));

    onUpdate({ ...profile, links: newLinks });
  };

  const typeOptions = [
    { id: "url" as LinkType, icon: LinkIcon, label: "URL" },
    // { id: "payment" as LinkType, icon: CreditCard, label: "Payment" },
    { id: "media" as LinkType, icon: ImageIcon, label: "Media" },
  ];

  return (
    <div className="space-y-3">
      {!isAdding && (
        <div className="flex justify-end">
          <Button2 onClick={() => setIsAdding(true)} variant="blue" className="w-1/3 rounded-md">
            <Plus className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
            <span>Add link</span>
          </Button2>
        </div>
      )}

      {isAdding && (
        <div className="border border-border rounded-xl bg-card overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
            <span className="text-xs font-medium text-foreground">New Link</span>
            <button onClick={resetForm} className="p-1 rounded-md hover:bg-muted transition-colors">
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>

          <div className="p-3 space-y-3">
            <div className="flex gap-2">
              <div className="relative shrink-0">
                <input id="add-icon-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                <label htmlFor="add-icon-upload" className="h-10 w-10 rounded-lg border border-dashed border-border bg-muted/50 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden">
                  {logoPreview ? <img src={logoPreview} alt="Icon" className="h-full w-full object-cover" /> : <Plus className="h-4 w-4 text-muted-foreground" />}
                </label>
              </div>

              <Input value={newLink.title} onChange={(e) => setNewLink({ ...newLink, title: e.target.value })} placeholder="Link title" className="h-10 flex-1 text-sm" />
            </div>

            <Input value={newLink.description} onChange={(e) => setNewLink({ ...newLink, description: e.target.value })} placeholder="Description (optional)" className="h-10 text-sm" />
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
            {/* Dynamic Content Based on Type */}
            {selectedType === "url" && <Input value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} placeholder="https://example.com" className="h-10 text-sm" />}

            {/* {selectedType === "payment" && (
              <div className="relative">
                <div className="flex gap-2 filter grayscale opacity-50 pointer-events-none">
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
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="bg-background/80 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-border shadow-sm">Coming Soon</span>
                </div>
              </div>
            )} */}

            {selectedType === "media" && (
              <div className="relative">
                <input id="media-upload" type="file" accept="image/*" onChange={handleMediaUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" style={{ pointerEvents: "auto" }} />
                <label htmlFor="media-upload" className="h-20 rounded-lg border border-dashed border-border bg-muted/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden">
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

      <div className="space-y-1.5">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={profile.links?.map((l) => l.id) || []} strategy={verticalListSortingStrategy}>
            <TooltipProvider>
              {/* link preview */}
              {profile.links?.map((link: any) => (
                <SortableLinkItem key={link.id} link={link} onEdit={handleEdit} onDelete={handleDelete} deletingId={deletingId} />
              ))}
            </TooltipProvider>
          </SortableContext>
        </DndContext>

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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>This will discard all unsaved changes to this link.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" size="sm">
              Keep editing
            </AlertDialogCancel>
            <AlertDialogAction onClick={resetForm} variant="destructive" size="sm">
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LinkEditDialog link={editingLink} open={editDialogOpen} onOpenChange={setEditDialogOpen} onSave={handleEditSave} />
    </div>
  );
}

const Link2Icon = LinkIcon;

interface SortableLinkItemProps {
  link: any;
  onEdit: (link: any) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

function SortableLinkItem({ link, onEdit, onDelete, deletingId }: SortableLinkItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} className="group flex items-center rounded-xl gap-2 py-3 shadow-dzenn border-none bg-card hover:border-primary/30 transition-all">
      <div {...attributes} {...listeners} className="p-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity touch-none">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      {link.icon ? (
        <img src={link.icon} alt="" className="h-10 w-10 rounded-md object-cover shrink-0" />
      ) : (
        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center shrink-0">
          <LinkIcon className="h-4 w-4 text-muted-foreground" />
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
            <TooltipTrigger asChild>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-muted transition-colors">
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
            </TooltipTrigger>
            <TooltipContent side="top">Open link</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={() => onEdit(link)} className="p-1.5 rounded-md hover:bg-muted transition-colors">
              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Edit link</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={() => onDelete(link.id)} disabled={deletingId === link.id} className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors">
              {deletingId === link.id ? <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" /> : <Trash2 className="h-3.5 w-3.5 text-destructive" />}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Delete link</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
