"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toastSuccess, toastError } from "@/lib/toast";

export default function PreviewClient() {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch("/api/profile/publish", {
        method: "POST",
      });

      if (res.ok) {
        toastSuccess("Profile published", "Your profile is now live!");
        router.push("/dashboard");
      } else {
        const data = await res.json();
        toastError("Publish failed", data.error || "Failed to publish your profile");
      }
    } catch {
      toastError("Error", "Failed to publish your profile");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex justify-center gap-4 pt-4">
      <Button variant="outline" onClick={() => router.back()} size="lg">
        Back
      </Button>
      <Button onClick={handlePublish} disabled={isPublishing} size="lg">
        {isPublishing ? "Publishing..." : "Publish Profile"}
      </Button>
    </div>
  );
}
