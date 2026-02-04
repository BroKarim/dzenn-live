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

      initializeEditor: (profile) => {
        const state = get();

        if (!state._hasHydrated) return;

        if (!state.originalProfile || state.originalProfile.id !== profile.id) {
          const { draftProfile } = state;
          const hasDraft = draftProfile && JSON.stringify(draftProfile) !== JSON.stringify(profile);

          set({
            originalProfile: profile,
            draftProfile: hasDraft ? draftProfile : profile,
            isDirty: !!hasDraft,
          });
        }
      },

      updateDraft: (profile) => {
        const { originalProfile } = get();
        const isDirty = JSON.stringify(profile) !== JSON.stringify(originalProfile);

        set({
          draftProfile: profile,
          isDirty,
        });
      },

      markAsSaved: () => {
        const { draftProfile } = get();
        set({
          originalProfile: draftProfile,
          isDirty: false,
        });
      },

      discardChanges: () => {
        const { originalProfile } = get();
        set({
          draftProfile: originalProfile,
          isDirty: false,
        });
      },

      clearDraft: () => {
        set({
          originalProfile: null,
          draftProfile: null,
          isDirty: false,
        });
      },
    }),
    {
      name: "dzenn-editor-draft",
      partialize: (state) => ({
        draftProfile: state.draftProfile,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
