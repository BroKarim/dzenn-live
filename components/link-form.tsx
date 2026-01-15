"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldControl, FieldError } from "@/components/ui/field";
import { Fieldset } from "@/components/ui/fieldset";
import { linkSchema } from "@/lib/validations/schemas";

type Link = {
  id: string;
  title: string;
  url: string;
};

interface LinkFormProps {
  onAddLink: (link: Link) => void;
}

export function LinkForm({ onAddLink }: LinkFormProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [titleError, setTitleError] = useState("");
  const [urlError, setUrlError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTitleError("");
    setUrlError("");

    try {
      const validated = linkSchema.parse({ title, url });
      onAddLink({ id: Date.now().toString(), ...validated });
      setTitle("");
      setUrl("");
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
      }
    }
  };

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <Fieldset className="max-w-none">
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <FieldControl
                render={(props) => (
                  <Input
                    {...props}
                    id="title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setTitleError("");
                    }}
                    placeholder="e.g., My Portfolio"
                    aria-invalid={titleError ? "true" : undefined}
                    className="w-full"
                  />
                )}
              />
              {titleError && <FieldError>{titleError}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="url">URL</FieldLabel>
              <FieldControl
                render={(props) => (
                  <Input
                    {...props}
                    id="url"
                    type="text"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setUrlError("");
                    }}
                    placeholder="example.com or https://example.com"
                    aria-invalid={urlError ? "true" : undefined}
                    className="w-full"
                  />
                )}
              />
              {urlError && <FieldError>{urlError}</FieldError>}
            </Field>

            <Button type="submit" className="w-full">
              Add Link
            </Button>
          </Fieldset>
        </form>
      </CardContent>
    </Card>
  );
}

export type { Link };

