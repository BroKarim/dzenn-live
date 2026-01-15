"use client";

import { useRef, useState } from "react";
import { Download, ChevronLeft } from "lucide-react";
import { ReactQRCode, type ReactQRCodeRef } from "@lglab/react-qr-code";
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogPanel,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  url: string;
  filename?: string;
  onBack?: () => void;
}

export function QRCodeDialog({
  open,
  onOpenChange,
  title,
  url,
  filename = "qr-code",
  onBack,
}: QRCodeDialogProps) {
  const qrCodeRef = useRef<ReactQRCodeRef>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (format: "png" | "svg") => {
    if (!qrCodeRef.current) return;

    setDownloading(format);
    try {
      qrCodeRef.current.download({
        name: filename,
        format,
        size: format === "png" ? 1000 : 500,
      });
    } catch (error) {
      console.error("Failed to download QR code:", error);
    } finally {
      setTimeout(() => setDownloading(null), 500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="sm:max-w-md">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="h-8 w-8 rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className="flex-1">{title}</DialogTitle>
          </div>
        </DialogHeader>

        <DialogPanel>
          <div className="space-y-6 px-6 pb-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-lg border bg-background p-8">
                <ReactQRCode
                  ref={qrCodeRef}
                  value={url}
                  size={256}
                  level="H"
                  dataModulesSettings={{
                    style: "rounded",
                  }}
                  finderPatternOuterSettings={{
                    style: "rounded-lg",
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Here is your unique OneURL QR code that will direct people to your profile when scanned.
              </p>
            </div>

            <div className="space-y-3 border-t pt-6">
              <Button
                variant="outline"
                className="w-full justify-between h-auto py-6 px-4"
                onClick={() => handleDownload("png")}
                disabled={downloading !== null}
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-semibold text-sm">Download PNG</span>
                  <span className="text-xs text-muted-foreground">
                    High quality image
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">.PNG</span>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-between h-auto py-6 px-4"
                onClick={() => handleDownload("svg")}
                disabled={downloading !== null}
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-semibold text-sm">Download SVG</span>
                  <span className="text-xs text-muted-foreground">
                    Scalable vector graphic
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">.SVG</span>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </div>
              </Button>
            </div>
          </div>
        </DialogPanel>
      </DialogPopup>
    </Dialog>
  );
}

