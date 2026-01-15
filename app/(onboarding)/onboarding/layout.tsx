"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogPopup,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogClose,
} from "@/components/ui/alert-dialog";

const steps = [
  { path: "/onboarding/username", label: "Username", step: 1 },
  { path: "/onboarding/avatar", label: "Profile", step: 2 },
  { path: "/onboarding/links", label: "Links", step: 3 },
  { path: "/onboarding/preview", label: "Preview", step: 4 },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const currentStep = steps.findIndex((step) => step.path === pathname);
  const [hasUnsavedData, setHasUnsavedData] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [skipDialogOpen, setSkipDialogOpen] = useState(false);
  const [hasUnsavedLinks, setHasUnsavedLinks] = useState(false);

  useEffect(() => {
    const checkUnsavedData = async () => {
      setIsChecking(true);
      try {
        const [profileRes, linksRes] = await Promise.all([
          fetch("/api/profile").catch(() => null),
          fetch("/api/links").catch(() => null),
        ]);

        const profile = profileRes?.ok ? await profileRes.json() : null;
        const linksData = linksRes?.ok ? await linksRes.json() : { links: [] };

        const hasUsername = !!profile?.username;
        const hasSavedLinks = (linksData?.links?.length ?? 0) > 0;

        const hasLocalUsername = !!localStorage.getItem("onboarding-username");
        const localLinks = localStorage.getItem("onboarding-links");
        let hasLocalLinks = false;
        if (localLinks) {
          try {
            const parsed = JSON.parse(localLinks);
            hasLocalLinks = Array.isArray(parsed) && parsed.length > 0;
          } catch {
            hasLocalLinks = false;
          }
        }

        setHasUnsavedData(hasUsername || hasSavedLinks || hasLocalUsername || hasLocalLinks);
      } catch {
        const hasLocalUsername = !!localStorage.getItem("onboarding-username");
        const localLinks = localStorage.getItem("onboarding-links");
        let hasLocalLinks = false;
        if (localLinks) {
          try {
            const parsed = JSON.parse(localLinks);
            hasLocalLinks = Array.isArray(parsed) && parsed.length > 0;
          } catch {
            hasLocalLinks = false;
          }
        }
        setHasUnsavedData(hasLocalUsername || hasLocalLinks);
      } finally {
        setIsChecking(false);
      }
    };

    checkUnsavedData();
  }, [pathname]);

  useEffect(() => {
    const handleLinksChanged = (event: CustomEvent<{ hasUnsavedLinks: boolean }>) => {
      setHasUnsavedLinks(event.detail.hasUnsavedLinks);
    };

    window.addEventListener("onboarding-links-changed", handleLinksChanged as EventListener);
    return () => {
      window.removeEventListener("onboarding-links-changed", handleLinksChanged as EventListener);
    };
  }, []);

  const handleSkip = async () => {
    if (hasUnsavedData || hasUnsavedLinks) {
      setSkipDialogOpen(true);
    } else {
      await handleCompleteOnboarding();
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      const usernameFromStorage = localStorage.getItem("onboarding-username");
      const linksFromStorage = localStorage.getItem("onboarding-links");
      
      let username: string | undefined;
      let links: Array<{ title: string; url: string; icon?: string }> | undefined;

      if (usernameFromStorage) {
        username = usernameFromStorage;
      }

      if (linksFromStorage) {
        try {
          links = JSON.parse(linksFromStorage);
        } catch {
          links = undefined;
        }
      }

      if (username || (links && links.length > 0)) {
        const res = await fetch("/api/profile/complete-onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, links }),
        });

        if (res.ok) {
          localStorage.removeItem("onboarding-username");
          localStorage.removeItem("onboarding-links");
        }
      } else {
        await fetch("/api/profile/complete-onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
      }

      router.push("/dashboard");
    } catch {
      router.push("/dashboard");
    }
  };

  const handleConfirmSkip = async () => {
    setSkipDialogOpen(false);
    await handleCompleteOnboarding();
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100">
      <div className="border-b-2 border-dashed border-zinc-200 bg-zinc-100/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="OneURL"
              width={128}
              height={128}
              className="h-12 w-12"
            />
            <h1 className="text-sm font-medium font-mono">OneURL</h1>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleSkip} disabled={isChecking}>
            Skip for now
          </Button>
          <AlertDialog open={skipDialogOpen} onOpenChange={setSkipDialogOpen}>
            <AlertDialogPopup>
              <AlertDialogHeader>
                <AlertDialogTitle>Leave onboarding?</AlertDialogTitle>
                <AlertDialogDescription>
                  You have unsaved progress. Your username and any links you&apos;ve added will be lost if you leave now. Are you sure you want to continue?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogClose>
                  <Button variant="outline">Cancel</Button>
                </AlertDialogClose>
                <Button variant="destructive" onClick={handleConfirmSkip}>
                  Leave anyway
                </Button>
              </AlertDialogFooter>
            </AlertDialogPopup>
          </AlertDialog>
        </div>
      </div>

      <div className="border-b-2 border-dashed border-zinc-200 bg-zinc-100/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              return (
                <div key={step.path} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                        isActive
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : isCompleted
                            ? "border-zinc-900 bg-zinc-900 text-white"
                            : "border-zinc-300 text-zinc-500"
                      }`}
                    >
                      {isCompleted ? (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <span className="text-xs font-medium">
                          {step.step}
                        </span>
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        isActive
                          ? "text-zinc-900"
                          : "text-zinc-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-2 h-0.5 flex-1 transition-colors ${
                        isCompleted
                          ? "bg-zinc-900"
                          : "bg-zinc-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center font-mono text-sm">{children}</div>
    </div>
  );
}

