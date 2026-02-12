"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getOnboardingStatus } from "@/server/user/settings/actions";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

function LoginContent() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { theme, resolvedTheme } = useTheme();

  const currentMode = resolvedTheme || theme;

  useEffect(() => {
    if (!isPending && session?.user) {
      const handleNavigation = async () => {
        try {
          const { isOnboarded, username } = await getOnboardingStatus();

          if (!isOnboarded || !username) {
            router.push("/new");
          } else {
            router.push(`/editor/${username}`);
          }
        } catch (error) {
          console.error("Auth navigation error:", error);
          router.push("/new"); // Fallback to onboarding
        }
      };
      handleNavigation();
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground font-medium">Authenticating...</div>
      </div>
    );
  }

  if (session?.user) {
    return null;
  }

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left side - Background Image */}
      <div className="hidden bg-[url('https://res.cloudinary.com/dctl5pihh/image/upload/v1768287477/background_valoru.jpg')] bg-center bg-cover bg-no-repeat lg:block grayscale-[0.5] opacity-80" />

      {/* Right side - Auth Content */}
      <div className="relative flex flex-col items-center justify-center gap-4 p-4 sm:p-6 md:p-8">
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Back</span>
            </Button>
          </Link>
        </div>

        <div className="flex w-full max-w-sm items-center justify-center gap-4 sm:max-w-md lg:max-w-lg">
          <AuthCard />
        </div>

        <div className="absolute right-4 bottom-8 left-4 flex flex-col items-center gap-2 sm:right-6 sm:bottom-10 sm:left-6">
          <p className="hidden px-2 text-center text-muted-foreground text-xs leading-relaxed sm:block sm:text-sm max-w-xs">
            {currentMode === "dark" ? "Our intern is sleeping, meanwhile check out our" : "Our intern is having his lunch, meanwhile checkout our"}{" "}
            <Link href="/privacy" className="underline hover:text-primary transition-colors">
              privacy policy
            </Link>{" "}
            page :D
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
