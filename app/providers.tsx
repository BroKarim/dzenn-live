"use client";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { ToastProvider } from "@/components/ui/toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";

export function Providers({
  children,
  routerConfig,
}: {
  children: React.ReactNode;
  routerConfig: Parameters<typeof NextSSRPlugin>[0]["routerConfig"];
}) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <NextSSRPlugin routerConfig={routerConfig} />
        {children}
      </ToastProvider>
    </QueryClientProvider>
  );
}

