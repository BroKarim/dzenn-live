import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProfileEditorData } from "@/server/user/profile/payloads";

interface EditorState {
  originalProfile: ProfileEditorData | null;
  draftProfile: ProfileEditorData | null;
  isDirty: boolean;
  _hasHydrated: boolean;

  setHasHydrated: (state: boolean) => void;
  initializeEditor: (profile: ProfileEditorData) => void;
  updateDraft: (profile: ProfileEditorData) => void;
  markAsSaved: () => void;
  discardChanges: () => void;
  clearDraft: () => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      originalProfile: null,
      draftProfile: null,
      isDirty: false,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      initializeEditor: (serverProfile) => {
        const state = get();
        if (!state._hasHydrated) return;

        // Always update originalProfile with fresh data from the server.
        // This ensures DB-side changes (created IDs, deletions) are always reflected.
        const serverLinkIds = new Set((serverProfile.links ?? []).map((l) => l.id));
        const draftProfile = state.draftProfile;

        // Determine if there's a valid pending draft to restore:
        // A draft is valid only if ALL its link IDs exist in the current server state.
        // After a successful save, real IDs are always committed to the store (no temp-IDs survive).
        // So any temp-ID found in a cached draft means it's stale — discard it.
        const hasDirtyDraft = draftProfile !== null && draftProfile.id === serverProfile.id && JSON.stringify(draftProfile) !== JSON.stringify(serverProfile) && (draftProfile.links ?? []).every((l) => serverLinkIds.has(l.id));

        set({
          originalProfile: serverProfile,
          draftProfile: hasDirtyDraft ? draftProfile : serverProfile,
          isDirty: hasDirtyDraft,
        });
      },

      updateDraft: (profile) => {
        const { originalProfile } = get();
        set({
          draftProfile: profile,
          isDirty: JSON.stringify(profile) !== JSON.stringify(originalProfile),
        });
      },

      markAsSaved: () => {
        const { draftProfile } = get();
        set({ originalProfile: draftProfile, isDirty: false });
      },

      discardChanges: () => {
        const { originalProfile } = get();
        set({ draftProfile: originalProfile, isDirty: false });
      },

      clearDraft: () => {
        set({ originalProfile: null, draftProfile: null, isDirty: false });
      },
    }),
    {
      name: "dzenn-editor-draft",
      // Only persist the draft — originalProfile always comes fresh from the server
      partialize: (state) => ({
        draftProfile: state.draftProfile,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
