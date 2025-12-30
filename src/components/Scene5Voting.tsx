import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { SessionData } from '../types';
import { cn } from '../lib/utils';
import { ThumbsUp, Check } from 'lucide-react';

interface Props {
  onNext: () => void;
  data: SessionData;
}

export default function Scene5Voting({ onNext, data }: Props) {
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [hasVoted, setHasVoted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  // Simulate incoming votes
  useEffect(() => {
    if (!hasVoted) return;

    // Simulate others voting for the same thing the user voted for (to force consensus for demo)
    // Or just default to the first one (Behrouz) if user picks something else?
    // Let's just stack votes on the user's choice to make them feel influential, 
    // OR stack on the "Best Match" (r1) to show the AI was right.
    // The design doc says: "User taps Behrouz. Simulate 2 other votes coming in immediately."
    
    // Let's find what the user voted for
    const userChoice = Object.keys(votes).find(k => votes[k] > 0);
    if (!userChoice) return;

    const timeouts = [
      setTimeout(() => {
        setVotes(prev => ({ ...prev, [userChoice]: (prev[userChoice] || 0) + 1 }));
      }, 500),
      setTimeout(() => {
        setVotes(prev => ({ ...prev, [userChoice]: (prev[userChoice] || 0) + 1 }));
      }, 1200),
      setTimeout(() => {
        setVotes(prev => ({ ...prev, [userChoice]: (prev[userChoice] || 0) + 1 }));
        setWinner(userChoice);
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
              onClick={onNext}
              className="w-full btn-primary"
            >
              Proceed to Pay
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

