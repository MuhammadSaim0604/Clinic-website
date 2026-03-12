import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export function PolicyModal({ isOpen, onClose, title, content }: PolicyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto rounded-3xl p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-bold font-display text-slate-900">{title}</DialogTitle>
        </DialogHeader>
        <div 
          className="prose prose-slate max-w-none text-slate-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content || "Content coming soon..." }}
        />
      </DialogContent>
    </Dialog>
  );
}
