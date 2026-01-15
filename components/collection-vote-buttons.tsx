"use client";

import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

interface CollectionVoteButtonsProps {
  collectionId: string;
  score: number;
  userVote?: "UP" | "DOWN" | null;
  onVote: (collectionId: string, voteType: "UP" | "DOWN") => void;
}

export function CollectionVoteButtons({
  collectionId,
  score,
  userVote,
  onVote,
}: CollectionVoteButtonsProps) {
  const [isVoting, setIsVoting] = useState(false);
  const displayScore = Math.max(0, score);
  const canDownvote = score > 0 || userVote === "DOWN";

  const handleVote = async (voteType: "UP" | "DOWN") => {
    if (isVoting) return;
    if (voteType === "DOWN" && !canDownvote) return;
    
    setIsVoting(true);
    try {
      await onVote(collectionId, voteType);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${userVote === "UP" ? "text-primary" : ""}`}
        onClick={() => handleVote("UP")}
        disabled={isVoting}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium min-w-[2ch] text-center">
        {displayScore}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 ${userVote === "DOWN" ? "text-destructive" : ""} ${!canDownvote ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => handleVote("DOWN")}
        disabled={isVoting || !canDownvote}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
}

