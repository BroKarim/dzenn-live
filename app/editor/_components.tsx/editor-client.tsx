"use client";

import { useEffect, useState } from "react";
import EditorHeader from "./editor-header";
import Preview from "./editor-preview";
import ControlPanel from "./control-panel";
import { EditorDock } from "./editor-dock";
import { UnsavedChangesDialog } from "./unsaved-changes-dialog";
import { NavigationGuard } from "./navigation-guard";
import { useEditorStore } from "@/lib/stores/editor-store";
import type { ProfileEditorData } from "@/server/user/profile/payloads";

interface EditorClientProps {
  initialProfile: ProfileEditorData;
}

export default function EditorClient({ initialProfile }: EditorClientProps) {
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const { draftProfile, isDirty, initializeEditor, updateDraft, discardChanges, _hasHydrated } = useEditorStore();

  useEffect(() => {
    if (_hasHydrated) {
      initializeEditor(initialProfile);
    }
  }, [initialProfile, initializeEditor, _hasHydrated]);

  useEffect(() => {
    if (_hasHydrated && isDirty && draftProfile) {
      const hasDraftFromPreviousSession = JSON.stringify(draftProfile) !== JSON.stringify(initialProfile);

      if (hasDraftFromPreviousSession) {
        setShowUnsavedDialog(true);
      }
    }
  }, [_hasHydrated]);

  const handleRestoreDraft = () => {
    setShowUnsavedDialog(false);
  };

  const handleDiscardDraft = () => {
    discardChanges();
    setShowUnsavedDialog(false);
  };

  if (!_hasHydrated) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-4 bg-background">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium animate-pulse">Synchronizing editor...</p>
      </div>
    );
  }

  const currentProfile = draftProfile || initialProfile;

  return (
    <main className="min-h-screen flex h-screen flex-col bg-background">
      <NavigationGuard />
      <EditorHeader profile={currentProfile} />

      <div className="flex flex-1 gap-6 overflow-hidden p-6">
        <div className="flex flex-1 justify-center items-start overflow-hidden pt-4">
          <div className="w-full h-full flex flex-col scale-90 origin-top">
            <Preview profile={currentProfile} viewMode={viewMode} />
          </div>
        </div>
        <ControlPanel profile={currentProfile} onUpdate={updateDraft} />
      </div>

      <EditorDock viewMode={viewMode} setViewMode={setViewMode} />

      <UnsavedChangesDialog open={showUnsavedDialog} onRestore={handleRestoreDraft} onDiscard={handleDiscardDraft} />
    </main>
  );
}
