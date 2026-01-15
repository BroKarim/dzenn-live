"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LinkDialog } from "@/components/link-dialog";
import { IconLinkDialog } from "@/components/icon-link-dialog";
import { Plus, Trash2, Pencil } from "lucide-react";
import { toastSuccess, toastError } from "@/lib/toast";
import { IconLink } from "@/components/icon-link";
import type { Link } from "@/lib/hooks/use-links";

type LocalLink = {
  id: string;
  title: string;
  url: string;
  icon?: string | null;
  position?: number;
  isActive?: boolean;
};

function getInitialLinks(): LocalLink[] {
  if (typeof window === "undefined") return [];
  const savedLinks = localStorage.getItem("onboarding-links");
  if (savedLinks) {
    try {
      const parsed = JSON.parse(savedLinks);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      localStorage.removeItem("onboarding-links");
    }
  }
  return [];
}

export default function LinksPage() {
  const router = useRouter();
  const [links, setLinks] = useState<LocalLink[]>(getInitialLinks);
  const [globalError, setGlobalError] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [iconLinkDialogOpen, setIconLinkDialogOpen] = useState(false);
  const [linkToEdit, setLinkToEdit] = useState<Link | null>(null);
  const [iconLinkToEdit, setIconLinkToEdit] = useState<LocalLink | null>(null);

  useEffect(() => {
    if (links.length > 0) {
      localStorage.setItem("onboarding-links", JSON.stringify(links));
    } else {
      localStorage.removeItem("onboarding-links");
    }

    const event = new CustomEvent("onboarding-links-changed", {
      detail: { hasUnsavedLinks: links.length > 0 },
    });
    window.dispatchEvent(event);
  }, [links]);

  const handleAddLink = async (data: { title: string; url: string; icon?: string | null }) => {
    const newLink: LocalLink = {
      id: `temp-${Date.now()}`,
      title: data.title,
      url: data.url,
      icon: data.icon ?? null,
      position: links.length,
      isActive: true,
    };
    setLinks([...links, newLink]);
    setAddDialogOpen(false);
    setGlobalError("");
    toastSuccess("Link added", `${data.title} has been added to your profile`);
  };

  const removeLink = (id: string) => {
    const linkToRemove = links.find((link) => link.id === id);
    setLinks(links.filter((link) => link.id !== id));
    setGlobalError("");
    if (linkToRemove) {
      toastSuccess("Link removed", `${linkToRemove.title} has been removed`);
    }
  };

  const handleIconLinkClick = (link: LocalLink) => {
    const linkToEditData: Link = {
      id: link.id,
      title: link.title,
      url: link.url,
      icon: link.icon ?? null,
      position: link.position ?? 0,
      isActive: link.isActive ?? true,
    };
    setLinkToEdit(linkToEditData);
    setEditDialogOpen(true);
  };

  const handleEditClick = (link: LocalLink) => {
    const linkToEditData: Link = {
      id: link.id,
      title: link.title,
      url: link.url,
      icon: link.icon ?? null,
      position: link.position ?? 0,
      isActive: link.isActive ?? true,
    };
    setLinkToEdit(linkToEditData);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (data: { title: string; url: string; icon?: string | null }) => {
    if (!linkToEdit) return;
    setLinks(links.map(link => 
      link.id === linkToEdit.id 
        ? { ...link, title: data.title, url: data.url, icon: data.icon ?? null }
        : link
    ));
    setEditDialogOpen(false);
    setLinkToEdit(null);
    toastSuccess("Link updated", `${data.title} has been updated`);
  };

  const handleEditDialogChange = (open: boolean) => {
    if (!open) {
      setLinkToEdit(null);
    }
    setEditDialogOpen(open);
  };

  const handleIconLinkSave = async (data: { title: string; url: string; icon?: string | null }) => {
    if (!iconLinkToEdit) return;
    setLinks(links.map(link => 
      link.id === iconLinkToEdit.id 
        ? { ...link, title: data.title, url: data.url, icon: data.icon }
        : link
    ));
    setIconLinkDialogOpen(false);
    setIconLinkToEdit(null);
  };

  const handleIconLinkRemove = async () => {
    if (!iconLinkToEdit) return;
    removeLink(iconLinkToEdit.id);
    setIconLinkDialogOpen(false);
    setIconLinkToEdit(null);
  };

  const handleContinue = async () => {
    if (links.length === 0) {
      setGlobalError("Add at least one link");
      toastError("No links added", "Please add at least one link to continue");
      return;
    }

    setGlobalError("");

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links }),
      });

      if (!res.ok) {
        const data = await res.json();
        const errorMessage = data.error || "Failed to save links";
        setGlobalError(errorMessage);
        toastError("Failed to save links", errorMessage);
        return;
      }

      toastSuccess("Links saved", "Your links have been saved successfully");
      localStorage.removeItem("onboarding-links");
      window.dispatchEvent(new CustomEvent("onboarding-links-changed", {
        detail: { hasUnsavedLinks: false },
      }));
      router.push("/onboarding/preview");
    } catch {
      const errorMessage = "Failed to save links";
      setGlobalError(errorMessage);
      toastError("Error", errorMessage);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12">
      <div className="w-full space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight leading-tight">Add your links</h2>
          <p className="text-xs text-zinc-600">
            Add the links you want to share on your profile
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => setAddDialogOpen(true)}
            variant="outline"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </Button>
        </div>

        {globalError && (
          <p className="text-sm text-destructive text-center">{globalError}</p>
        )}

        {links.length > 0 && (
          <div className="space-y-6">
            {(() => {
              const iconLinks = links.filter((link) => link.icon);
              const mainLinks = links.filter((link) => !link.icon);

              return (
                <>
                  {iconLinks.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-medium text-zinc-600">Icon Links</h3>
                      <div className="flex items-center gap-3 flex-wrap">
                        {iconLinks.map((link) => (
                          <div key={link.id}>
                            <IconLink 
                              link={{ ...link, position: link.position ?? 0, isActive: link.isActive ?? true }} 
                              onClick={() => handleIconLinkClick(link)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {mainLinks.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-medium text-zinc-600">Main Links</h3>
                      <div className="space-y-2">
                        {mainLinks.map((link) => (
                          <Card key={link.id} className="border-zinc-200">
                            <CardContent className="flex items-center justify-between py-3">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate text-xs">{link.title}</p>
                                <p className="text-xs text-zinc-500 truncate mt-0.5">{link.url}</p>
                              </div>
                              <div className="flex items-center gap-2 ml-4 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditClick(link)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="destructive-outline"
                                  size="sm"
                                  onClick={() => removeLink(link.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        <LinkDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onSubmit={handleAddLink}
          title="Add New Link"
          description="Add a new link to your profile. Enter a title and URL."
          submitLabel="Add Link"
        />

        <LinkDialog
          open={editDialogOpen}
          onOpenChange={handleEditDialogChange}
          onSubmit={handleUpdate}
          initialData={linkToEdit}
          title="Edit Link"
          description="Update the title, URL, or link type for this link."
          submitLabel="Save Changes"
        />

        <IconLinkDialog
          open={iconLinkDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIconLinkToEdit(null);
            }
            setIconLinkDialogOpen(open);
          }}
          onSave={handleIconLinkSave}
          onRemove={handleIconLinkRemove}
          isPending={false}
          link={iconLinkToEdit}
        />

        <div className="flex justify-center pt-4">
          <Button
            onClick={handleContinue}
            size="sm"
            disabled={links.length === 0}
            className="min-w-24"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

