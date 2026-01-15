"use client";

import { useState } from "react";
import { MessageCircle, Bug, Sparkles, MessageSquare, HelpCircle, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogPanel,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "";
const FEEDBACK_EMAIL = "kartik.labhshetwar@gmail.com";

type FeedbackCategory = "bug" | "improvement" | "feedback" | "other";

const categories: { id: FeedbackCategory; label: string; icon: typeof Bug }[] = [
  { id: "bug", label: "Bug", icon: Bug },
  { id: "improvement", label: "Improvement", icon: Sparkles },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "other", label: "Other", icon: HelpCircle },
];

type SubmitState = "idle" | "submitting" | "success" | "error";

export function FeedbackDialog({ trigger }: { trigger?: React.ReactElement }) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory | null>(null);
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (!selectedCategory || !message.trim()) return;

    if (!WEB3FORMS_ACCESS_KEY) {
      setSubmitState("error");
      setErrorMessage("Form service not configured. Please contact support.");
      return;
    }

    setSubmitState("submitting");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("access_key", WEB3FORMS_ACCESS_KEY);
      formData.append("subject", `[${selectedCategory.toUpperCase()}] Feedback from OneURL`);
      formData.append("category", selectedCategory);
      formData.append("message", message);
      formData.append("from_name", "OneURL User");
      formData.append("to_email", FEEDBACK_EMAIL);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSubmitState("success");
        setTimeout(() => {
          setOpen(false);
          setSelectedCategory(null);
          setMessage("");
          setSubmitState("idle");
          setErrorMessage("");
        }, 2000);
      } else {
        setSubmitState("error");
        setErrorMessage(data.message || "Failed to submit feedback. Please try again.");
      }
    } catch {
      setSubmitState("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  };

  const canSubmit = selectedCategory && message.trim().length > 0 && message.length <= 400 && submitState === "idle";

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="text-xs text-zinc-600">
      <MessageCircle className="w-4 h-4 mr-2" />
      Feedback
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger || defaultTrigger} />
      <DialogPopup>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-zinc-600" />
            <DialogTitle>Share your feedback</DialogTitle>
          </div>
        </DialogHeader>
        <DialogPanel>
          <div className="space-y-6">
            {submitState === "success" ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-zinc-900">Thank you!</h3>
                  <p className="text-sm text-zinc-600">Your feedback has been submitted successfully.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = selectedCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedCategory(category.id)}
                        disabled={submitState === "submitting"}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                          isSelected
                            ? "bg-zinc-900 text-white border-zinc-900"
                            : "bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300",
                          submitState === "submitting" && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {category.label}
                      </button>
                    );
                  })}
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Tell us about a bug, improvement idea, or any feedback you have..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[120px] resize-none"
                    maxLength={400}
                    disabled={submitState === "submitting"}
                  />
                  <div className="flex justify-between items-center text-xs text-zinc-500">
                    <span>{message.length}/400</span>
                  </div>
                </div>
                {submitState === "error" && errorMessage && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <p className="text-sm text-red-600">{errorMessage}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogPanel>
        <DialogFooter>
          {submitState !== "success" && (
            <>
              <Button
                variant="ghost"
                onClick={() => {
                  setOpen(false);
                  setSelectedCategory(null);
                  setMessage("");
                  setSubmitState("idle");
                  setErrorMessage("");
                }}
                disabled={submitState === "submitting"}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || submitState !== "idle"}
                className="bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50"
              >
                {submitState === "submitting" ? "Submitting..." : "Submit"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}

