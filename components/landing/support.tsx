"use client";

import { useState } from "react";
import { FaCommentDots, FaGithub, FaCoffee, FaPaypal, FaRegCopy, FaCheck, FaQrcode } from "react-icons/fa";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FeedbackDialog } from "@/components/feedback-dialog";
import { toastSuccess } from "@/lib/toast";
import {
  Tooltip,
  TooltipTrigger,
  TooltipPopup,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverTrigger,
  PopoverPopup,
} from "@/components/ui/popover";

export function Support({ variant = "landing" }: { variant?: "landing" | "dashboard" } = {}) {
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [qrPopoverOpen, setQrPopoverOpen] = useState(false);

  const upiId = "kartik.labhshetwar@oksbi";
  const paypalUrl = "https://www.paypal.com/paypalme/KartikLabhshetwar";

  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopiedUPI(true);
      toastSuccess("Copied!", "UPI ID copied to clipboard");
      setTimeout(() => setCopiedUPI(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const isDashboard = variant === "dashboard";
  
  return (
    <section className={`${isDashboard ? "pt-8 md:pt-12 pb-8 md:pb-12" : "border-t-2 border-dashed border-zinc-200 pt-24 md:pt-32 pb-24 md:pb-32"} bg-zinc-100`}>
      <div className={`mx-auto w-full max-w-6xl ${isDashboard ? "" : "px-4 sm:px-6 lg:px-8"}`}>
        <div className="space-y-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-medium">Sponsor OneURL</h2>
            <p className="text-sm md:text-base text-zinc-600 leading-relaxed">
              OneURL is built with passion and maintained as an open-source project. 
              Your support helps cover hosting costs, enables new features, and keeps the platform free for everyone. 
              Every contribution, big or small, makes a difference. Thank you for being part of this journey!
            </p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Have ideas or feedback? <span className="font-medium text-zinc-600">We&apos;d love to hear from you!</span>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <FeedbackDialog
                trigger={
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground border border-primary"
                  >
                    <FaCommentDots className="w-4 h-4 mr-2" />
                    Leave Feedback
                  </Button>
                }
              />
              <Button
                className="bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-900"
                onClick={() => window.open("https://github.com/KartikLabhshetwar/oneurl", "_blank")}
              >
                <FaGithub className="w-4 h-4 mr-2" />
                Star on GitHub
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Buy me a coffee */}
            <Card className="bg-white rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                    <FaCoffee className="w-5 h-5 text-zinc-900" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-zinc-900">Buy Me a Coffee</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">Support with a small donation.</p>
                </div>
                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-zinc-900 font-medium"
                  onClick={() => window.open("https://buymeacoffee.com/code_kartik", "_blank")}
                >
                  Buy Me a Coffee
                </Button>
              </CardContent>
            </Card>

            {/* UPI */}
            <Card className="bg-white rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                      @
                    </div>
                  </div>
                  <Popover open={qrPopoverOpen} onOpenChange={setQrPopoverOpen}>
                    <PopoverTrigger
                      render={
                        <button 
                          className="p-1.5 rounded-md hover:bg-zinc-100 transition-colors"
                          onClick={() => setQrPopoverOpen(true)}
                        >
                          <FaQrcode className="w-4 h-4 text-zinc-600" />
                        </button>
                      }
                    />
                    <PopoverPopup side="top" align="end" className="p-4">
                      <div className="space-y-3">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="rounded-lg border border-zinc-200 bg-white p-4">
                            <Image
                              src="/qr.jpeg"
                              alt="UPI QR Code"
                              width={256}
                              height={256}
                              className="rounded-lg"
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-zinc-500 mb-1">UPI ID</p>
                            <p className="text-sm font-mono text-zinc-900">{upiId}</p>
                          </div>
                        </div>
                      </div>
                    </PopoverPopup>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-zinc-900">UPI</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">Direct transfer via UPI.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500">UPI ID</label>
                  <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                    <span className="flex-1 text-sm text-zinc-900 font-mono truncate">
                      {upiId}
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <button
                              onClick={handleCopyUPI}
                              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-zinc-200 transition-colors shrink-0"
                              aria-label="Copy UPI ID"
                            >
                              {copiedUPI ? (
                                <FaCheck className="h-4 w-4 text-green-600" />
                              ) : (
                                <FaRegCopy className="h-4 w-4 text-zinc-600" />
                              )}
                            </button>
                          }
                        />
                        <TooltipPopup>{copiedUPI ? "Copied!" : "Copy UPI ID"}</TooltipPopup>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Paypal */}
            <Card className="bg-white rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                    <FaPaypal className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-zinc-900">PayPal</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">Support via PayPal.</p>
                </div>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  onClick={() => window.open(paypalUrl, "_blank")}
                >
                  <FaPaypal className="w-4 h-4 mr-2" />
                  Donate with PayPal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

