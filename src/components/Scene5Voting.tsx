import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { SessionData } from '../types';
import { cn } from '../lib/utils';
import { Check, Calendar, MapPin } from 'lucide-react';

interface Props {
  onNext: () => void;
  data: SessionData;
}

type Step = 'voting' | 'confirmed';

export default function Scene5Voting({ onNext, data }: Props) {
  const [step, setStep] = useState<Step>('voting');
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [hasVoted, setHasVoted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  // Clean up confetti on unmount
  useEffect(() => {
    return () => {
      confetti.reset();
    };
  }, []);

  // Simulate incoming votes
  useEffect(() => {
    if (!hasVoted) return;

    // Simulate meaningful vote flow (e.g., Night Canteen gets popular)
    // Target winner: Night Canteen (r2)
    const targetWinner = 'r2'; // Night Canteen

    const timeouts = [
      setTimeout(() => {
        setVotes(prev => ({ ...prev, [targetWinner]: (prev[targetWinner] || 0) + 1 }));
      }, 500),
      setTimeout(() => {
        setVotes(prev => ({ ...prev, [targetWinner]: (prev[targetWinner] || 0) + 1 }));
      }, 1200),
      setTimeout(() => {
        setVotes(prev => ({ ...prev, [targetWinner]: (prev[targetWinner] || 0) + 1 }));
        setWinner(targetWinner);
        triggerConfetti();
      }, 2000),
    ];

    return () => timeouts.forEach(clearTimeout);
  }, [hasVoted]);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FC8019', '#ffffff']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FC8019', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleVote = (id: string) => {
    if (hasVoted) return;
    setVotes({ [id]: 1 });
    setHasVoted(true);
  };

  const maxVotes = 4; // 4 participants

  const handleConfirmReservation = () => {
    setStep('confirmed');
    confetti.reset(); // Clear confetti when moving to confirmation
    
    // Auto timeout fallback
    setTimeout(() => {
       console.log("Auto-advancing to split scene...");
       onNext();
    }, 5000);
  };

  if (step === 'confirmed') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col h-full items-center justify-center p-6 text-center space-y-6"
      >
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]">
          <Check className="w-12 h-12 text-white" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-2">Reservation Confirmed</h2>
          <p className="text-gray-400">Table for 6 reserved.</p>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 w-full space-y-4">
          <div className="flex items-start gap-4 text-left">
             <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden">
                <img src={data.recommendations.find(r => r.id === winner)?.image} alt="Restaurant" className="w-full h-full object-cover" />
             </div>
             <div>
               <h3 className="font-bold text-lg">{data.recommendations.find(r => r.id === winner)?.name}</h3>
               <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                 <MapPin className="w-3 h-3" />
                 <span>1.2 km away</span>
               </div>
               <div className="flex items-center gap-1 text-sm text-gray-400">
                 <Calendar className="w-3 h-3" />
                 <span>Today, 8:00 PM</span>
               </div>
             </div>
          </div>
        </div>

        {/* Removed button, auto-advancing */}
        <p className="text-sm text-gray-500 animate-pulse">Generating bill...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full p-6"
    >
      <header className="text-center mb-8">
        <h2 className="text-2xl font-bold">Vote to Eat!</h2>
        <p className="text-gray-400">Majority wins.</p>
      </header>

      <div className="flex-1 grid grid-cols-1 gap-4 content-center">
        {data.recommendations.map((rec) => {
          const voteCount = votes[rec.id] || 0;
          const isWinner = winner === rec.id;
          const percent = (voteCount / maxVotes) * 100;

          return (
            <motion.div
              key={rec.id}
              layout
              className={cn(
                "relative overflow-hidden rounded-xl border-2 transition-all bg-gray-800",
                isWinner ? "border-swiggy-orange shadow-[0_0_30px_rgba(252,128,25,0.3)] z-10 scale-105" : "border-transparent opacity-80"
              )}
            >
              {/* Background Progress Bar */}
              <motion.div
                className="absolute inset-0 bg-swiggy-orange/20"
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ type: "spring", stiffness: 100 }}
              />

              <div className="relative p-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  <img src={rec.image} alt={rec.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-bold">{rec.name}</h3>
                    <div className="text-xs text-gray-400">{voteCount} votes</div>
                  </div>
                </div>

                {!hasVoted ? (
                  <button
                    onClick={() => handleVote(rec.id)}
                    className="px-4 py-2 bg-white/10 rounded-full hover:bg-swiggy-orange hover:text-white transition-colors"
                  >
                    Vote
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    {/* Avatars of voters simulation */}
                    <div className="flex -space-x-2">
                      {Array.from({ length: voteCount }).map((_, i) => (
                         <div key={i} className="w-6 h-6 rounded-full bg-gray-500 border border-gray-800" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-6"
          >
            <div className="bg-green-500/20 border border-green-500 text-green-200 p-4 rounded-xl text-center mb-4">
              It's decided! We're eating <strong>{data.recommendations.find(r => r.id === winner)?.name}</strong>.
            </div>
            <button
              onClick={handleConfirmReservation}
              className="w-full btn-primary"
            >
              Confirm Reservation
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
