import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Users, ArrowRight } from 'lucide-react';
import { SessionData, Participant } from '../types';
import { cn } from '../lib/utils';

interface Props {
  onNext: () => void;
  data: SessionData;
}

export default function Scene2Lobby({ onNext, data }: Props) {
  const [presentParticipants, setPresentParticipants] = useState<Participant[]>([]);
  
  // Host is always there
  const host = { id: 0, name: data.session.host_name, avatar: '👑', status: 'ready' };

  useEffect(() => {
    // Simulate users joining
    const timeouts = data.session.participants.map((p, index) => {
      return setTimeout(() => {
        setPresentParticipants(prev => [...prev, p]);
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Pop sound (placeholder)
        audio.volume = 0.2;
        audio.play().catch(() => {}); // Ignore autoplay errors
      }, (index + 1) * 1500);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [data.session.participants]);

  const allJoined = presentParticipants.length === data.session.participants.length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col h-full p-6"
    >
      <header className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{data.session.host_name}'s Dinner Party</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>{presentParticipants.length + 1}/4 Joined</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center border border-gray-200 dark:border-transparent">
          <span className="text-xl">👑</span>
        </div>
      </header>

      <div className="flex-1 relative flex items-center justify-center min-h-[400px]">
        {/* Table/Center */}
        <div className="absolute w-48 h-48 rounded-full border-4 border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center">
          <span className="text-gray-400 dark:text-white/20 font-medium">Waiting...</span>
        </div>

        {/* Host */}
        <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
           <div className="w-16 h-16 rounded-full bg-gradient-to-br from-swiggy-orange to-red-500 flex items-center justify-center text-3xl shadow-lg border-2 border-white relative">
              {host.avatar}
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></div>
           </div>
           <span className="font-medium text-sm text-gray-900 dark:text-white">{host.name}</span>
        </motion.div>

        {/* Participants */}
        <AnimatePresence>
          {presentParticipants.map((p, i) => {
            // Position them in a circle (simplified to 3 positions)
            const positions = [
              'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2', // Bottom
              'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2',   // Left
              'top-1/2 right-0 translate-x-1/2 -translate-y-1/2',    // Right
            ];
            const pos = positions[i % positions.length];

            return (
              <motion.div
                key={p.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={cn("absolute flex flex-col items-center gap-2", pos)}
              >
                <div className="relative group cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl shadow-lg border-2 border-gray-100 dark:border-white/20 group-hover:border-swiggy-orange transition-colors">
                    {p.avatar}
                  </div>
                  {/* Nudge Button */}
                  <button 
                    className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black flex items-center justify-center shadow-lg scale-0 group-hover:scale-100 transition-transform"
                    onClick={() => navigator.vibrate?.(100)}
                  >
                    <Bell className="w-4 h-4 fill-current" />
                  </button>
                  <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></div>
                </div>
                <span className="font-medium text-sm text-gray-900 dark:text-white">{p.name}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-8">
        <button
          disabled={!allJoined}
          onClick={onNext}
          className={cn(
            "w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2",
            allJoined 
              ? "bg-swiggy-orange text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02]" 
              : "bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-500 cursor-not-allowed"
          )}
        >
          {allJoined ? (
            <>
              Let's Decide <ArrowRight className="w-5 h-5" />
            </>
          ) : (
            "Waiting for friends..."
          )}
        </button>
      </div>
    </motion.div>
  );
}

