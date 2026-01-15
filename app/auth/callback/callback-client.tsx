"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

interface CallbackClientProps {
  redirectTo: "/dashboard" | "/onboarding/username" | "/login";
}

export function CallbackClient({ redirectTo }: CallbackClientProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(redirectTo);
  }, [router, redirectTo]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100">
      <div className="text-center space-y-6 px-4">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-zinc-200 animate-pulse"></div>
            </div>
            <div className="relative flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="OneURL"
                width={64}
                height={64}
                className="h-16 w-16"
                priority
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Spinner className="h-5 w-5 text-zinc-900" />
            <p className="text-sm font-medium text-zinc-900">
              Redirecting...
            </p>
          </div>
          <p className="text-xs text-zinc-500">
            {redirectTo === "/dashboard" 
              ? "Taking you to your dashboard" 
              : redirectTo === "/onboarding/username"
              ? "Setting up your profile"
              : "Redirecting to login"}
          </p>
        </div>
      </div>
    </div>
  );
}

