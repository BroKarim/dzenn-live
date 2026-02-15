import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ensureUserHasProfile } from "@/server/user/settings/actions";
import { CallbackClient } from "./callback-client";

export default async function AuthCallbackPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const { username } = await ensureUserHasProfile();
  const redirectTo = `/editor/${username}`;

  return <CallbackClient redirectTo={redirectTo} />;
}
