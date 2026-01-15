import { requireAuth } from "@/lib/auth-guard";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardMobileNav } from "@/components/dashboard-mobile-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user?.isOnboarded) {
    redirect("/onboarding/username");
  }

  return (
    <SidebarProvider>
      <DashboardSidebar
        user={{
          name: user.name,
          username: user.username,
          avatarUrl: user.avatarUrl,
          image: user.image,
        }}
      />
      <SidebarInset>
        <div className="pb-16 md:pb-0">
          {children}
        </div>
        <DashboardMobileNav
          user={{
            name: user.name,
            username: user.username,
          }}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}

