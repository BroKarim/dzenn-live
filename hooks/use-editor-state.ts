import { useState, useCallback } from "react";
import { EditorState } from "@/lib/editor/types";
import { initialEditorState } from "@/lib/editor/initial-state";

/**
 * Custom hook for managing editor state
 * Provides state and update function with proper typing
 */
export function useEditorState() {
  const [state, setState] = useState<EditorState>(initialEditorState);

  const updateState = useCallback((updates: Partial<EditorState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    state,
    updateState,
  };
}
