"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

/**
 * Client component to handle auth callback redirect
 * This avoids prerendering issues with headers()
 */
export function AuthCallbackHandler() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "redirecting">("loading");

  useEffect(() => {
    let mounted = true;

    async function handleCallback() {
      try {
        // Call the API route to get session and redirect URL
        const response = await fetch("/api/auth/session");

        if (!response.ok) {
          throw new Error("Session check failed");
        }

        const data = await response.json();

        if (!mounted) return;

        if (!data.session) {
          setStatus("redirecting");
          router.replace("/login");
          return;
        }

        // Get user data to determine redirect
        const userResponse = await fetch(`/api/user/${data.session.user.id}`);

        if (!userResponse.ok) {
          setStatus("redirecting");
          router.replace("/login");
          return;
        }

        const userData = await userResponse.json();

        if (!mounted) return;

        setStatus("redirecting");

        // Redirect based on user status
        if (userData.isOnboarded && userData.username) {
          router.replace(`/editor/${userData.username}`);
        } else {
          router.replace("/onboarding/username");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        if (mounted) {
          setStatus("redirecting");
          router.replace("/login");
        }
      }
    }

    handleCallback();

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100">
      <div className="text-center space-y-6 px-4">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-zinc-200 animate-pulse"></div>
            </div>
            <div className="relative flex items-center justify-center">
              <Image src="/logo.png" alt="OneURL" width={64} height={64} className="h-16 w-16" priority />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Spinner className="h-5 w-5 text-zinc-900" />
            <p className="text-sm font-medium text-zinc-900">{status === "loading" ? "Authenticating..." : "Redirecting..."}</p>
          </div>
          <p className="text-xs text-zinc-500">{status === "loading" ? "Checking your session" : "Taking you to your profile"}</p>
        </div>
      </div>
    </div>
  );
}
