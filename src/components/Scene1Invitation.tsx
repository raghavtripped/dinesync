import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Check, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  onNext: () => void;
}

type ViewState = 'setup' | 'generated' | 'ready';

export default function Scene1Invitation({ onNext }: Props) {
  const [viewState, setViewState] = useState<ViewState>('setup');
  const [groupName, setGroupName] = useState('Saturday Dinner Squad');
  const [participantCount, setParticipantCount] = useState(4);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleGenerate = () => {
    setViewState('generated');
  };

  const handleCopyLink = () => {
    navigator.vibrate?.(50);
    setCopied(true);
    setShowToast(true);
    
    // After copying, show the "Open Invite Link" button (Shared flow)
    setTimeout(() => {
      setViewState('ready');
      setShowToast(false);
    }, 1500);
  };

  const handleOpenInvite = () => {
    onNext();
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
          Start Group Plan
        </h1>
        <p className="text-gray-400 text-sm">Prototype — Invite, collect preferences, vote, and split.</p>
      </div>

      <div className="space-y-6">
        {/* Form is always visible, but might change state */}
        <div className={cn(
          "glass-card p-6 space-y-4 transition-all duration-500",
          viewState !== 'setup' ? "opacity-50 pointer-events-none scale-95" : ""
        )}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-swiggy-orange transition-colors"
              placeholder="e.g. Birthday Bash"
            />
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Expected People</label>
              <span className="text-swiggy-orange font-bold text-xl">{participantCount}</span>
            </div>
            <input
              type="range"
              min="2"
              max="20"
              value={participantCount}
              onChange={(e) => setParticipantCount(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-swiggy-orange"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Just us</span>
              <span>Huge Party</span>
            </div>
          </div>
        </div>

        {/* Dynamic Action Area */}
        <div className="relative min-h-[120px]">
          <AnimatePresence mode="wait">
            {viewState === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <button
                  onClick={handleGenerate}
                  className="w-full py-4 rounded-xl font-bold text-lg bg-[#FC8019] text-white shadow-lg hover:shadow-orange-500/20 active:scale-95 transition-all"
                >
                  Generate Link
                </button>
              </motion.div>
            )}

            {viewState === 'generated' && (
              <motion.div
                key="generated"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4 text-center"
              >
                 <div className="text-sm text-gray-400">
                   Link Ready! Share this with your friends.
                 </div>
                <button
                  onClick={handleCopyLink}
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
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {viewState === 'ready' && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 text-center"
              >
                <div className="text-sm text-gray-400">
                   You're all set! Join the lobby.
                 </div>
                <button
                  onClick={handleOpenInvite}
                  className="w-full py-4 rounded-xl font-bold text-lg bg-white text-black hover:bg-gray-100 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl"
                >
                  Open Invite Link <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-white/10 z-50 whitespace-nowrap"
        >
          <div className="w-2 h-2 rounded-full bg-green-500" />
          Lobby Created
        </motion.div>
      )}
    </motion.div>
  );
}
