"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldControl, FieldError } from "@/components/ui/field";
import { Fieldset } from "@/components/ui/fieldset";
import { Select, SelectPopup as SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { collectionSchema } from "@/lib/validations/schemas";
import { Trash2, Plus } from "lucide-react";

type CollectionLink = {
  id: string;
  title: string;
  url: string;
  icon?: string | null;
};

interface CollectionFormProps {
  onSubmit: (data: {
    title: string;
    description?: string | null;
    category: string;
    links: Array<{ title: string; url: string; icon?: string | null }>;
  }) => void;
  initialData?: {
    title?: string;
    description?: string | null;
    category?: string;
    links?: CollectionLink[];
  };
  isLoading?: boolean;
}

export function CollectionForm({ onSubmit, initialData, isLoading }: CollectionFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "OTHER");
  const [links, setLinks] = useState<CollectionLink[]>(() =>
    initialData?.links || [{ id: `${Date.now()}`, title: "", url: "" }]
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addLink = () => {
    setLinks([...links, { id: `${Date.now()}-${Math.random()}`, title: "", url: "" }]);
  };

  const removeLink = (id: string) => {
    if (links.length > 1) {
      setLinks(links.filter((link) => link.id !== id));
    }
  };

  const updateLink = (id: string, field: "title" | "url", value: string) => {
    setLinks(
      links.map((link) => (link.id === id ? { ...link, [field]: value } : link))
    );
    if (errors[`link-${id}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`link-${id}-${field}`];
      setErrors(newErrors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validated = collectionSchema.parse({
        title,
        description: description || null,
        category,
        links: links.map((link) => ({ title: link.title, url: link.url, icon: link.icon })),
      });
      onSubmit(validated);
    } catch (error) {
      if (error && typeof error === "object" && "issues" in error) {
        const zodError = error as { issues: Array<{ path: (string | number)[]; message: string }> };
        const newErrors: Record<string, string> = {};
        
        zodError.issues.forEach((issue) => {
          if (issue.path[0] === "title") {
            newErrors.title = issue.message;
          } else if (issue.path[0] === "description") {
            newErrors.description = issue.message;
          } else if (issue.path[0] === "category") {
            newErrors.category = issue.message;
          } else if (issue.path[0] === "links" && typeof issue.path[1] === "number") {
            const linkIndex = issue.path[1];
            const field = issue.path[2];
            if (links[linkIndex]) {
              newErrors[`link-${links[linkIndex].id}-${field}`] = issue.message;
            }
          }
        });
        
        setErrors(newErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset className="max-w-none space-y-6">
        <Field>
          <FieldLabel htmlFor="title">Collection Title</FieldLabel>
          <FieldControl
            render={(props) => (
              <Input
                {...props}
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: "" });
                }}
                placeholder="e.g., Best React UI Libraries"
                aria-invalid={errors.title ? "true" : undefined}
                className="w-full"
              />
            )}
          />
          {errors.title && <FieldError>{errors.title}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description (Optional)</FieldLabel>
          <FieldControl
            render={(props) => (
              <Textarea
                {...props}
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors({ ...errors, description: "" });
                }}
                placeholder="Describe your collection..."
                aria-invalid={errors.description ? "true" : undefined}
                className="w-full"
                rows={3}
              />
            )}
          />
          {errors.description && <FieldError>{errors.description}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="category">Category</FieldLabel>
          <Select value={category} onValueChange={(value) => value && setCategory(value)}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UI_LIBRARY">UI Library</SelectItem>
              <SelectItem value="RESOURCES">Resources</SelectItem>
              <SelectItem value="SITES">Sites</SelectItem>
              <SelectItem value="TOOLS">Tools</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && <FieldError>{errors.category}</FieldError>}
        </Field>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 font-medium text-base/4.5 sm:text-sm/4">
              Links
            </label>
            <Button type="button" variant="outline" size="sm" onClick={addLink}>
              <Plus className="h-4 w-4 mr-1" />
              Add Link
            </Button>
          </div>

          {links.map((link) => (
            <Card key={link.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-4">
                    <Field>
                      <FieldLabel>Link Title</FieldLabel>
                      <FieldControl
                        render={(props) => (
                          <Input
                            {...props}
                            value={link.title}
                            onChange={(e) => updateLink(link.id, "title", e.target.value)}
                            placeholder="e.g., React"
                            aria-invalid={errors[`link-${link.id}-title`] ? "true" : undefined}
                          />
                        )}
                      />
                      {errors[`link-${link.id}-title`] && (
                        <FieldError>{errors[`link-${link.id}-title`]}</FieldError>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel>URL</FieldLabel>
                      <FieldControl
                        render={(props) => (
                          <Input
                            {...props}
                            value={link.url}
                            onChange={(e) => updateLink(link.id, "url", e.target.value)}
                            placeholder="example.com or https://example.com"
                            aria-invalid={errors[`link-${link.id}-url`] ? "true" : undefined}
                          />
                        )}
                      />
                      {errors[`link-${link.id}-url`] && (
                        <FieldError>{errors[`link-${link.id}-url`]}</FieldError>
                      )}
                    </Field>
                  </div>

                  {links.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLink(link.id)}
                      className="mt-6"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Collection" : "Create Collection"}
        </Button>
      </Fieldset>
    </form>
  );
}

