"use client";

import { AlignCenterVertical, AlignEndVertical, AlignStartVertical } from "lucide-react";
import { ProfileLayout } from "@/lib/generated/prisma/enums";
import type { ProfileEditorData } from "@/server/user/profile/payloads";

interface ProfileLayoutSelectorProps {
  profile: ProfileEditorData;
  onUpdate: (profile: ProfileEditorData) => void;
}

export function ProfileLayoutSelector({ profile, onUpdate }: ProfileLayoutSelectorProps) {
  const layouts = [
    { id: ProfileLayout.left_stack, icon: AlignEndVertical, label: "Left Stack" },
    { id: ProfileLayout.center, icon: AlignCenterVertical, label: "Centered" },
    { id: ProfileLayout.left_row, icon: AlignStartVertical, label: "Left Row" },
  ];

  const handleLayoutChange = (layout: ProfileLayout) => {
    onUpdate({ ...profile, layout });
  };

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-3 gap-2">
        {layouts.map((layoutItem) => {
          const Icon = layoutItem.icon;
          const isActive = profile.layout === layoutItem.id;

          return (
            <button
              key={layoutItem.id}
              onClick={() => handleLayoutChange(layoutItem.id)}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 p-2.5 transition-all ${
                isActive
                  ? "shadow-[0px_32px_64px_-16px_#0000004c,0px_16px_32px_-8px_#0000004c,0px_8px_16px_-4px_#0000003d,0px_4px_8px_-2px_#0000003d,0px_-8px_16px_-1px_#00000029,0px_2px_4px_-1px_#0000003d,0px_0px_0px_1px_#000000,inset_0px_0px_0px_1px_#ffffff14,inset_0px_1px_0px_#ffffff33] border-none bg-primary/10 text-primary"
                  : "border-white/5 bg-transparent text-muted-foreground hover:border-white/10 hover:text-foreground"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "opacity-60"}`} />
              <span className="text-[10px]  tracking-wider font-semibold">{layoutItem.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
