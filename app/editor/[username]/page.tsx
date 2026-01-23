import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import EditorClient from "../_components.tsx/editor-client";

export default async function EditorPage({ params }: { params: { username: string } }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { username } = params;

  if (!session?.user) redirect("/login");

  const profile = await db.profile.findFirst({
    where: {
      user: { username: username },
    },
    include: {
      socials: true,
      links: { orderBy: { position: "asc" } },
    },
  });

  if (!profile) notFound();

  if (profile.userId !== session.user.id) {
    redirect("/dashboard");
  }
  return <EditorClient initialData={profile} />;
}
