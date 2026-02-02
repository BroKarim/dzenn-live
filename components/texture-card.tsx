"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, PlayCircle, CreditCard } from "lucide-react";
import { GlassEffect } from "./control-panel/glass-effect";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  videoUrl?: string;
  isStripeEnabled?: boolean;
  backgroundColor?: string;
}

interface TexturedCardProps extends Partial<LinkItem> {
  texture?: "base" | "glassy";
  titleColor?: string;
  className?: string;
}

export function TexturedCard({ title, description, url, icon, imageUrl, videoUrl, isStripeEnabled, backgroundColor = "bg-zinc-800", titleColor = "text-white", texture = "base", className = "" }: TexturedCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasExtraContent = !!(description || videoUrl || isStripeEnabled);

  const CardHeader = (
    <div className="flex h-16 rounded-md w-full items-center">
      <div className={`flex flex-1 items-center ${!imageUrl ? "justify-center px-6" : "justify-start pl-6"}`}>
        <div className="flex items-center gap-3">
          {icon && <img src={icon} className="h-8 w-8 rounded-full object-cover shrink-0" alt="" />}
          <h2 className={`${texture === "glassy" ? "text-white" : titleColor} text-lg font-black tracking-tighter truncate max-w-[200px]`}>{title}</h2>
        </div>
      </div>
      {imageUrl && (
        <div className="flex w-20 items-center justify-center pl-2 h-full">
          <img src={imageUrl} className="w-full h-full object-cover shadow-sm" alt={title} />
        </div>
      )}
    </div>
  );

  const CardBody = (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: "auto",
        opacity: 1,
        transition: {
          height: { duration: 0.3, ease: "easeInOut" },
          opacity: { duration: 0.2, delay: 0.1 },
        },
      }}
      exit={{
        height: 0,
        opacity: 0,
        transition: {
          height: { duration: 0.3, ease: "easeInOut" },
          opacity: { duration: 0.15 },
        },
      }}
      className="overflow-hidden"
    >
      <motion.div initial={{ y: -10 }} animate={{ y: 0 }} exit={{ y: -10 }} transition={{ duration: 0.2, delay: 0.1 }} className="px-6 pb-6">
        <div className="flex flex-col gap-4 border-t border-white/10 pt-4">
          {description && (
            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-sm text-white/80 leading-relaxed">
              {description}
            </motion.p>
          )}
          {videoUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="aspect-video w-full overflow-hidden rounded-xl bg-black/20 flex items-center justify-center border border-white/5"
            >
              <PlayCircle className="h-10 w-10 text-white/50" />
            </motion.div>
          )}
          {isStripeEnabled && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="flex items-center gap-3 rounded-xl bg-white/10 p-3 border border-white/20">
              <CreditCard className="h-5 w-5 text-white" />
              <span className="text-xs font-bold text-white">Support via Stripe</span>
            </motion.div>
          )}
          <motion.a
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            href={url}
            target="_blank"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2 text-sm font-bold text-black transition-transform hover:scale-[1.02]"
            onClick={(e) => e.stopPropagation()}
          >
            Visit Link <ExternalLink className="h-3 w-3" />
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );

  const handleClick = () => {
    if (hasExtraContent) {
      setIsExpanded(!isExpanded);
    } else {
      window.open(url, "_blank");
    }
  };

  const WrapperProps = {
    onClick: handleClick,
    className: `group relative w-full cursor-pointer overflow-hidden rounded-md transition-all duration-300 shadow-xl ${!isExpanded && "hover:scale-[1.02] active:scale-[0.98]"} ${className} ${texture !== "glassy" ? backgroundColor : ""}`,
  };

  const Content = (
    <>
      <div className="absolute inset-0 opacity-10 rounded-md pointer-events-none" />
      {CardHeader}
      <AnimatePresence>{isExpanded && CardBody}</AnimatePresence>
      <div className="absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
    </>
  );

  return texture === "glassy" ? <GlassEffect {...WrapperProps}>{Content}</GlassEffect> : <div {...WrapperProps}>{Content}</div>;
}
