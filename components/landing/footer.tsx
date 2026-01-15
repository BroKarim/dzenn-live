import Image from "next/image";
import Link from "next/link";
import { FeedbackDialog } from "@/components/feedback-dialog";

export function LandingFooter() {
  return (
    <footer className="border-t-2 border-dashed border-zinc-200 bg-zinc-100 pt-12 pb-12">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
         <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
             <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <Image 
                      src="/logo.png" 
                      alt="OneURL Logo" 
                      width={32} 
                      height={32} 
                      className="w-8 h-8"
                    />
                    <span className="font-medium text-sm">OneURL</span>
                 </div>
                 <p className="text-xs text-zinc-600 max-w-md leading-relaxed">
                     The open-source link in bio tool designed for minimalists. 
                     Join thousands of creators sharing their work simply.
                 </p>
             </div>
            
             <div className="space-y-4">
                 <h4 className="font-medium text-sm">Community</h4>
                 <ul className="space-y-2 text-xs text-zinc-600">
                     <li><a href="https://github.com/KartikLabhshetwar/oneurl" className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                     <li><a href="https://x.com/code_kartik" className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                     <li><Link href="/support" className="hover:text-foreground transition-colors">Sponsor OneURL</Link></li>  
                 </ul>
                 <div className="pt-2">
                   <FeedbackDialog />
                 </div>
             </div>
         </div>
         
         <div className="border-t border-zinc-200 pt-8 text-center text-xs text-zinc-600">
             <div>© {new Date().getFullYear()} OneURL. Open Source BSD 3-Clause License.</div>
         </div>
      </div>
    </footer>
  );
}

