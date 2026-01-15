"use client";

import { useState, useEffect, useCallback } from "react";
import validator from "validator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogPanel,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Field, FieldLabel, FieldControl, FieldError, FieldDescription } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { linkSchema } from "@/lib/validations/schemas";
import { toastError } from "@/lib/toast";
import type { Link } from "@/lib/hooks/use-links";
import Image from "next/image";

interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; url: string; icon?: string | null }) => Promise<void>;
  isPending?: boolean;
  initialData?: Link | null;
  title: string;
  description: string;
  submitLabel?: string;
}

interface LinkPreview {
  title: string | null;
  description: string | null;
  image: string | null;
  logo: string | null;
  url: string;
}

function getDomainIcon(url: string): string {
  try {
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
    const domain = urlObj.hostname.replace("www.", "");
    
    if (domain.includes("github")) {
      return "https://github.com/identicons/app.png";
    }
    if (domain.includes("twitter") || domain.includes("x.com")) {
      return "https://abs.twimg.com/favicons/twitter.3.ico";
    }
    if (domain.includes("linkedin")) {
      return "https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca";
    }
    if (domain.includes("youtube")) {
      return "https://www.youtube.com/s/desktop/favicon.ico";
    }
    
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return "";
  }
}


export function LinkDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
  initialData,
  title,
  description,
  submitLabel = "Add Link",
}: LinkDialogProps) {
  const [formTitle, setFormTitle] = useState(initialData?.title ?? "");
  const [formUrl, setFormUrl] = useState(initialData?.url ?? "");
  const [isIconLink, setIsIconLink] = useState(!!initialData?.icon);
  const [titleError, setTitleError] = useState("");
  const [urlError, setUrlError] = useState("");
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [manualPreviewLoading, setManualPreviewLoading] = useState(false);

  const validateUrl = useCallback((url: string, showError = false, showToast = false): boolean => {
    if (!url || url.trim() === "") {
      setIsValidUrl(false);
      if (showError) {
        setUrlError("URL is required");
      }
      if (showToast) {
        toastError("URL required", "Please enter a URL");
      }
      return false;
    }

    const normalizedUrl = url.startsWith("http://") || url.startsWith("https://") 
      ? url 
      : `https://${url}`;

    const isValid = validator.isURL(normalizedUrl, {
      protocols: ["http", "https"],
      require_protocol: false,
      require_valid_protocol: true,
      require_host: true,
      require_port: false,
      allow_protocol_relative_urls: false,
      validate_length: true,
    });

    if (!isValid) {
      setIsValidUrl(false);
      if (showError) {
        setUrlError("Invalid URL format. Please enter a valid URL (e.g., example.com or https://example.com)");
      }
      if (showToast) {
        toastError("Invalid URL", "Please enter a valid URL with a proper domain (e.g., example.com or https://example.com)");
      }
      return false;
    }

    setIsValidUrl(true);
    if (showError) {
      setUrlError("");
    }
    return true;
  }, []);

  const fetchPreview = useCallback(async (url: string) => {
    if (!url || url.trim() === "") {
      setPreview(null);
      setIsValidUrl(false);
      setUrlError("URL is required");
      toastError("URL required", "Please enter a URL first");
      return;
    }

    if (!validateUrl(url, true, true)) {
      setPreview(null);
      return;
    }

    setIsLoadingPreview(true);
    setManualPreviewLoading(true);
    setUrlError("");
    try {
      const normalizedUrl = url.startsWith("http://") || url.startsWith("https://") 
        ? url 
        : `https://${url}`;
      const response = await fetch(`/api/link-preview?url=${encodeURIComponent(normalizedUrl)}`);
      if (response.ok) {
        const data = await response.json();
        setPreview(data);
        setUrlError("");
        if (data.title && !formTitle && !initialData) {
          setFormTitle(data.title);
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: "Failed to fetch preview" }));
        setPreview(null);
        const errorMessage = errorData.error || "Failed to fetch preview. Please check the URL and try again.";
        if (!isIconLink) {
          setUrlError(errorMessage);
        }
        toastError("Preview failed", errorMessage);
      }
    } catch {
      setPreview(null);
      const errorMessage = "Failed to fetch preview. Please check the URL and try again.";
      if (!isIconLink) {
        setUrlError(errorMessage);
      }
      toastError("Preview failed", errorMessage);
    } finally {
      setIsLoadingPreview(false);
      setManualPreviewLoading(false);
    }
  }, [formTitle, initialData, isIconLink, validateUrl]);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormTitle(initialData.title);
        setFormUrl(initialData.url);
        setIsIconLink(!!initialData.icon);
        setPreview(null);
      } else {
        setFormTitle("");
        setFormUrl("");
        setIsIconLink(false);
        setPreview(null);
      }
      setTitleError("");
      setUrlError("");
      setIsValidUrl(false);
    }
  }, [open, initialData]);

  const handleManualPreview = async () => {
    if (!formUrl.trim()) {
      setUrlError("Please enter a URL first");
      toastError("URL required", "Please enter a URL first");
      return;
    }

    if (!validateUrl(formUrl, true, true)) {
      return;
    }

    setManualPreviewLoading(true);
    try {
      await fetchPreview(formUrl);
    } finally {
      setManualPreviewLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    
    if (formUrl.trim()) {
      const isValid = validateUrl(formUrl, false);
      if (!isValid && formUrl.length > 0) {
        setUrlError("");
      }
    } else {
      setIsValidUrl(false);
      setPreview(null);
      setUrlError("");
    }
  }, [formUrl, open, validateUrl]);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTitleError("");
    setUrlError("");

    if (!formUrl.trim()) {
      setUrlError("URL is required");
      toastError("URL required", "Please enter a URL");
      return;
    }

    if (!validateUrl(formUrl, true)) {
      toastError("Invalid URL", "Please enter a valid URL");
      return;
    }

    if (!isIconLink && !preview && !initialData) {
      setUrlError("Please click 'Preview' to fetch link information before adding");
      toastError("Preview required", "Please click 'Preview' to fetch link information before adding");
      return;
    }

    try {
      let titleToUse = formTitle.trim();
      if (!titleToUse && preview?.title) {
        titleToUse = preview.title;
      } else if (!titleToUse) {
        try {
          const normalizedUrl = formUrl.startsWith("http://") || formUrl.startsWith("https://") 
            ? formUrl 
            : `https://${formUrl}`;
          const urlObj = new URL(normalizedUrl);
          const domain = urlObj.hostname.replace("www.", "");
          const domainParts = domain.split(".");
          titleToUse = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
        } catch {
          titleToUse = "Link";
        }
      }

      const normalizedUrl = formUrl.startsWith("http://") || formUrl.startsWith("https://") 
        ? formUrl 
        : `https://${formUrl}`;

      let iconToUse: string | undefined = undefined;
      if (isIconLink) {
        iconToUse = preview?.logo || "🔗";
      }

      const validated = linkSchema.parse({ 
        title: titleToUse, 
        url: normalizedUrl,
        icon: iconToUse
      });
      await onSubmit({ 
        title: validated.title, 
        url: validated.url,
        icon: validated.icon
      });
      if (!initialData) {
        setFormTitle("");
        setFormUrl("");
        setIsIconLink(false);
        setPreview(null);
      }
    } catch (error) {
      if (error && typeof error === "object" && "issues" in error) {
        const zodError = error as { issues: Array<{ path: (string | number)[]; message: string }> };
        zodError.issues.forEach((issue) => {
          if (issue.path[0] === "title") {
            setTitleError(issue.message);
          } else if (issue.path[0] === "url") {
            setUrlError(issue.message);
          }
        });
        const firstError = zodError.issues[0]?.message || "Invalid input";
        toastError("Invalid input", firstError);
      }
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    if (!initialData) {
      setFormTitle("");
      setFormUrl("");
      setIsIconLink(false);
    }
    setTitleError("");
    setUrlError("");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form onSubmit={handleSubmit}>
          <DialogPanel>
            <div className="space-y-4 py-2">
              <Field>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FieldLabel htmlFor="icon-link-toggle">Icon Link</FieldLabel>
                    <FieldDescription>
                      Display as a social media icon instead of a preview card
                    </FieldDescription>
                  </div>
                  <Switch
                    id="icon-link-toggle"
                    checked={isIconLink}
                    onCheckedChange={setIsIconLink}
                    disabled={isPending}
                  />
                </div>
              </Field>

              {!isIconLink && (
                <Field>
                  <FieldLabel htmlFor="link-title">Title</FieldLabel>
                  <FieldControl
                    render={(props) => (
                      <Input
                        {...props}
                        id="link-title"
                        value={formTitle}
                        onChange={(e) => {
                          setFormTitle(e.target.value);
                          setTitleError("");
                        }}
                        placeholder="e.g., My Portfolio"
                        aria-invalid={titleError ? "true" : undefined}
                        disabled={isPending}
                        autoFocus
                      />
                    )}
                  />
                  {titleError && <FieldError>{titleError}</FieldError>}
                </Field>
              )}
              <Field>
                <FieldLabel htmlFor="link-url">Profile URL</FieldLabel>
                <FieldControl
                  render={(props) => (
                    <div className="space-y-2">
                      <div className="relative">
                        <Input
                          {...props}
                          id="link-url"
                          type="text"
                          value={formUrl}
                          onChange={(e) => {
                            setFormUrl(e.target.value);
                            setUrlError("");
                            setPreview(null);
                          }}
                          onBlur={() => {
                            if (formUrl.trim() && !isValidUrl) {
                              validateUrl(formUrl, true, true);
                            }
                          }}
                          placeholder="example.com or https://example.com"
                          aria-invalid={urlError ? "true" : undefined}
                          disabled={isPending}
                          className={isValidUrl && !urlError ? "pr-10" : ""}
                        />
                        {isValidUrl && !urlError && !isLoadingPreview && !manualPreviewLoading && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <Check className="h-4 w-4 text-green-600" />
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleManualPreview}
                        disabled={isPending || !formUrl.trim() || manualPreviewLoading}
                        className="w-full"
                      >
                        {manualPreviewLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Fetching preview...
                          </>
                        ) : (
                          "Preview"
                        )}
                      </Button>
                      {isLoadingPreview && (
                        <FieldDescription>Fetching preview...</FieldDescription>
                      )}
                    </div>
                  )}
                />
                {urlError && <FieldError>{urlError}</FieldError>}
              </Field>
              
              {preview && !isIconLink && (
                <Field>
                  <FieldLabel>Preview</FieldLabel>
                  <FieldDescription>
                    This is how your link will appear
                  </FieldDescription>
                  <div className="mt-2 rounded-lg border border-zinc-200 bg-white overflow-hidden">
                    {preview.image && (
                      <div className="w-full h-48 bg-zinc-100 relative overflow-hidden">
                        <Image
                          src={preview.image}
                          alt={preview.title || "Link preview image"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-zinc-100 flex items-center justify-center">
                          {preview.logo ? (
                            <Image
                              src={preview.logo}
                              alt={preview.title || "Link preview"}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <img
                              src={getDomainIcon(preview.url)}
                              alt=""
                              className="w-8 h-8"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                              }}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-900 truncate">
                            {preview.title || "Untitled"}
                          </p>
                          <p className="text-xs text-zinc-500 truncate">
                            {preview.url}
                          </p>
                          {preview.description && (
                            <p className="text-xs text-zinc-600 line-clamp-2 mt-1">
                              {preview.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Field>
              )}
              
              {preview && isIconLink && (
                <Field>
                  <FieldLabel>Preview</FieldLabel>
                  <FieldDescription>
                    This is how your icon link will appear
                  </FieldDescription>
                  <div className="mt-2 rounded-lg border border-zinc-200 bg-white p-3">
                    <div className="flex items-center justify-center">
                      <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-zinc-100 flex items-center justify-center">
                        {preview.logo ? (
                          <Image
                            src={preview.logo}
                            alt={preview.title || "Icon preview"}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <img
                            src={getDomainIcon(preview.url)}
                            alt=""
                            className="w-8 h-8"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </Field>
              )}
            </div>
          </DialogPanel>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={
                isPending || 
                !formUrl.trim() || 
                !isValidUrl || 
                (!isIconLink && !preview && !initialData)
              }
            >
              {isPending
                ? initialData
                  ? "Saving..."
                  : "Adding..."
                : submitLabel}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

