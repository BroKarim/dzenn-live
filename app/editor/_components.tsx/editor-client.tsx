"use client";

import EditorHeader from "./editor-header";
import Preview from "./editor-preview";
import ControlPanel from "./control-panel";
import { useEditorState } from "@/hooks/use-editor-state";

interface EditorClientProps {
  initialData: any;
}

export default function EditorClient({ initialData }: EditorClientProps) {
  const { state, updateState } = useEditorState();

  return (
    <main className="min-h-screen flex h-screen flex-col bg-background">
      <EditorHeader />

      <div className="flex flex-1 gap-6 overflow-hidden p-6">
        <Preview state={state} />
        <ControlPanel state={state} onUpdate={updateState} profileId={initialData?.id} links={initialData?.links || []} />
      </div>
    </main>
  );
}
