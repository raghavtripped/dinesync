import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Check, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  onNext: () => void;
}

const contexts = [
  { id: 'bday', label: '🎂 Birthday', color: 'bg-pink-500/20 text-pink-200' },
  { id: 'exam', label: '💼 Post-Exam', color: 'bg-blue-500/20 text-blue-200' },
  { id: 'catchup', label: '☕ Quick Catchup', color: 'bg-amber-500/20 text-amber-200' },
  { id: 'night', label: '🌙 Late Night', color: 'bg-indigo-500/20 text-indigo-200' },
];

export default function Scene1Invitation({ onNext }: Props) {
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleShare = () => {
    navigator.vibrate?.(50); // Haptic feedback if supported
    setCopied(true);
    setShowToast(true);
    setTimeout(() => {
      onNext();
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col gap-8 p-6"
    >
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-swiggy-orange to-orange-300 bg-clip-text text-transparent">
          Hungry with<br />friends?
        </h1>
        <p className="text-gray-400 text-lg">Start a DineSync in seconds.</p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">What's the vibe?</h3>
        <div className="flex flex-wrap gap-3">
          {contexts.map((ctx) => (
            <button
              key={ctx.id}
              onClick={() => setSelectedContext(ctx.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                selectedContext === ctx.id 
                  ? "bg-swiggy-orange text-white shadow-lg shadow-orange-500/30 scale-105" 
                  : "bg-white/5 hover:bg-white/10 text-gray-300"
              )}
            >
              {ctx.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={handleShare}
          className={cn(
            "w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all relative overflow-hidden",
            copied ? "bg-green-500 text-white" : "bg-[#FC8019] text-white animate-pulse-ring"
          )}
        >
          {copied ? (
            <>
              <Check className="w-6 h-6" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-6 h-6" />
              <span>Invite Friends</span>
            </>
          )}
        </button>
      </div>

      {/* Toast */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-white/10"
        >
          <div className="w-2 h-2 rounded-full bg-green-500" />
          Lobby Created
        </motion.div>
      )}
    </motion.div>
  );
}

