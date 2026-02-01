// app/editor/[username]/page.tsx
import { Suspense } from "react";
import EditorContent from "@/app/editor/_components.tsx/editor";

export default function EditorPage({ params }: { params: Promise<{ username: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse">Loading editor...</div>
        </div>
      }
    >
      <EditorContent params={params} />
    </Suspense>
  );
}
