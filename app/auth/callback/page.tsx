import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getOnboardingStatus } from "@/server/user/settings/actions";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

export default async function AuthCallbackPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const { isOnboarded, username } = await getOnboardingStatus();

  if (isOnboarded && username) {
    redirect(`/editor/${username}`);
  } else {
    redirect("/onboarding/username");
  }

  // This UI will strictly only be visible if redirects take time (SSR streaming)
  // or if there's a slight delay before the redirect instruction is processed.
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
            <p className="text-sm font-medium text-zinc-900">Redirecting...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
