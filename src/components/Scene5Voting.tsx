import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { SessionData } from '../types';
import { cn } from '../lib/utils';
import { Check, Calendar, MapPin, Calculator, Receipt } from 'lucide-react';

interface Props {
  onNext: () => void;
  data: SessionData;
}

type Step = 'voting' | 'confirmed' | 'splitwise';

export default function Scene5Voting({ onNext, data }: Props) {
  const [step, setStep] = useState<Step>('voting');
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [hasVoted, setHasVoted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  // Bill split state
  const [vegShare, setVegShare] = useState(400);
  const [nonVegShare, setNonVegShare] = useState(350);
  const [mocktail, setMocktail] = useState(90);
  const [cocktail, setCocktail] = useState(90);

  const totalCalculated = vegShare + nonVegShare + mocktail + cocktail;

  const [participants, setParticipants] = useState(data.session.participants.map(p => ({
    ...p,
    paymentStatus: 'pending',
    splitAmount: 0,
    tags: [] as string[]
  })));

  // Mock assigning splits based on preferences
  useEffect(() => {
     const totalVegPeople = 2;
     const totalNonVegPeople = 2;

     const vegPerPerson = vegShare / totalVegPeople;
     const nonVegPerPerson = nonVegShare / totalNonVegPeople;

     const mocktailSplit = mocktail / 2;
     const cocktailSplit = cocktail / 2;

     setParticipants(prev => prev.map(p => {
        let amt = 0;
        let tags: string[] = [];
        if (p.name === 'Aditya') { amt = vegPerPerson + mocktailSplit; tags=['Veg', 'Mocktail']; }
        else if (p.name === 'Sneha') { amt = nonVegPerPerson + cocktailSplit; tags=['Non-Veg', 'Cocktail']; }
        else if (p.name === 'Kabir') { amt = vegPerPerson + cocktailSplit; tags=['Veg', 'Cocktail']; }
        else { amt = 0; }
        return { ...p, splitAmount: Math.round(amt), tags };
     }));
  }, [vegShare, nonVegShare, mocktail, cocktail]);

  // Clean up confetti on unmount
  useEffect(() => {
    return () => {
      confetti.reset();
    };
  }, []);

  // Simulate incoming votes
  useEffect(() => {
    if (!hasVoted) return;

    const targetWinner = 'r2';

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

  const maxVotes = 4;

  const handleConfirmReservation = () => {
    setStep('confirmed');
    confetti.reset();
  };

  if (step === 'confirmed') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col h-full p-6 space-y-8 overflow-y-auto"
      >
        {/* Reservation Confirmed Section */}
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)] mx-auto">
            <Check className="w-12 h-12 text-white" />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Reservation Confirmed</h2>
            <p className="text-gray-500 dark:text-gray-400">Table for 6 reserved.</p>
          </div>

          <div className="bg-white dark:bg-white/10 rounded-2xl p-6 w-full max-w-md mx-auto space-y-4 shadow-xl">
            <div className="flex items-start gap-4 text-left">
               <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img src={data.recommendations.find(r => r.id === winner)?.image} alt="Restaurant" className="w-full h-full object-cover" />
               </div>
               <div>
                 <h3 className="font-bold text-lg text-gray-900 dark:text-white">{data.recommendations.find(r => r.id === winner)?.name}</h3>
                 <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                   <MapPin className="w-3 h-3" />
                   <span>1.2 km away</span>
                 </div>
                 <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                   <Calendar className="w-3 h-3" />
                   <span>Today, 8:00 PM</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Bill Split Section */}
        <div className="space-y-6">
          <header className="space-y-1 text-center">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2 text-gray-900 dark:text-white">
               <Calculator className="w-6 h-6 text-swiggy-orange" />
               Bill Split (Simulated)
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Categorize items for smart splitting.</p>
          </header>

          {/* Mini Receipt Summary */}
          <div className="bg-white dark:bg-white/5 rounded-lg p-4 flex justify-between items-center text-sm shadow-sm border border-gray-100 dark:border-transparent">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300">
              <Receipt className="w-4 h-4" />
              <span>Total Bill</span>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">₹930</span>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-4 space-y-4">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Veg Dishes Total</label>
                  <div className="flex items-center gap-2">
                     <span className="text-gray-400">₹</span>
                     <input
                        type="number"
                        value={vegShare}
                        onChange={e => setVegShare(Number(e.target.value))}
                        className="bg-transparent text-xl font-bold w-full focus:outline-none text-gray-900 dark:text-white"
                     />
                  </div>
               </div>
               <div className="h-px bg-gray-200 dark:bg-white/10" />
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Non-Veg Dishes Total</label>
                  <div className="flex items-center gap-2">
                     <span className="text-gray-400">₹</span>
                     <input
                        type="number"
                        value={nonVegShare}
                        onChange={e => setNonVegShare(Number(e.target.value))}
                        className="bg-transparent text-xl font-bold w-full focus:outline-none text-gray-900 dark:text-white"
                     />
                  </div>
               </div>
            </div>

            <div className="glass-card p-4 space-y-4">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Mocktail Add-on</label>
                  <div className="flex items-center gap-2">
                     <span className="text-gray-400">₹</span>
                     <input
                        type="number"
                        value={mocktail}
                        onChange={e => setMocktail(Number(e.target.value))}
                        className="bg-transparent text-xl font-bold w-full focus:outline-none text-gray-900 dark:text-white"
                     />
                  </div>
               </div>
               <div className="h-px bg-gray-200 dark:bg-white/10" />
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Cocktail Add-on</label>
                  <div className="flex items-center gap-2">
                     <span className="text-gray-400">₹</span>
                     <input
                        type="number"
                        value={cocktail}
                        onChange={e => setCocktail(Number(e.target.value))}
                        className="bg-transparent text-xl font-bold w-full focus:outline-none text-gray-900 dark:text-white"
                     />
                  </div>
               </div>
            </div>
         </div>

         <div className="glass-card bg-orange-50 dark:bg-swiggy-orange/10 border-orange-200 dark:border-swiggy-orange/30 p-4 flex justify-between items-center">
            <span className="font-bold text-gray-900 dark:text-white">Computed Total</span>
            <span className="text-2xl font-bold text-swiggy-orange">₹{totalCalculated}</span>
         </div>

         <button
           onClick={() => setStep('splitwise')}
           className="w-full btn-primary flex items-center justify-center gap-2"
         >
           Split on Splitwise
         </button>
        </div>
      </motion.div>
    );
  }

      if (step === 'splitwise') {
    return (
      <motion.div
        key="splitwise"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col h-full p-6 space-y-6 overflow-y-auto"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2 text-gray-900 dark:text-white">
            <span className="text-green-500">✓</span> Split Created
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Everyone has been notified via Splitwise.</p>
        </div>

        <div className="space-y-4">
          {participants.map(p => (
            <div key={p.id} className="glass-card p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg border border-gray-100 dark:border-white/10">
                  {p.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{p.name}</div>
                  <div className="flex gap-1 mt-1">
                    {p.tags.map(t => (
                      <span key={t} className="text-[10px] bg-white dark:bg-white/10 border border-gray-100 dark:border-transparent px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-300">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="font-mono text-xl font-bold text-swiggy-orange">₹{p.splitAmount}</div>
            </div>
          ))}

          {/* Host Yourself */}
          <div className="glass-card p-4 flex justify-between items-center border-orange-200 dark:border-swiggy-orange/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-swiggy-orange flex items-center justify-center text-lg text-white">
                👑
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white">You</div>
                <div className="flex gap-1 mt-1">
                  <span className="text-[10px] bg-white dark:bg-white/10 border border-gray-100 dark:border-transparent px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-300">Non-Veg</span>
                  <span className="text-[10px] bg-white dark:bg-white/10 border border-gray-100 dark:border-transparent px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-300">Mocktail</span>
                </div>
              </div>
            </div>
            <div className="font-mono text-xl font-bold text-gray-900 dark:text-white">₹{Math.round((350/2) + (90/2))}</div>
          </div>
        </div>

        <div className="glass-card bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 p-4 flex justify-between items-center">
          <span className="font-bold text-gray-900 dark:text-white">Total Split</span>
          <span className="text-xl font-bold text-green-600 dark:text-green-400">₹{totalCalculated}</span>
        </div>

        <div className="space-y-3">
          <button className="w-full py-4 rounded-xl font-bold text-lg bg-[#5BC5A7] text-white shadow-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all">
            Open Splitwise App
          </button>
          <button
            onClick={onNext}
            className="w-full py-3 rounded-xl font-medium text-sm bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20 active:scale-95 transition-all"
          >
            Done
          </button>
        </div>
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Vote to Eat!</h2>
        <p className="text-gray-500 dark:text-gray-400">Majority wins.</p>
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
                "relative overflow-hidden rounded-xl border-2 transition-all bg-white dark:bg-gray-800 shadow-md",
                isWinner ? "border-swiggy-orange shadow-[0_0_30px_rgba(252,128,25,0.3)] z-10 scale-105" : "border-transparent opacity-80"
              )}
            >
              {/* Background Progress Bar */}
              <motion.div
                className="absolute inset-0 bg-orange-100 dark:bg-swiggy-orange/20"
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ type: "spring", stiffness: 100 }}
              />

              <div className="relative p-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  <img src={rec.image} alt={rec.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{rec.name}</h3>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{voteCount} votes</div>
                  </div>
                </div>

                {!hasVoted ? (
                  <button
                    onClick={() => handleVote(rec.id)}
                    className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white rounded-full hover:bg-swiggy-orange hover:text-white transition-colors"
                  >
                    Vote
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    {/* Avatars of voters simulation */}
                    <div className="flex -space-x-2">
                      {Array.from({ length: voteCount }).map((_, i) => (
                         <div key={i} className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-500 border border-white dark:border-gray-800" />
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
            <div className="bg-green-100 dark:bg-green-500/20 border border-green-500 text-green-800 dark:text-green-200 p-4 rounded-xl text-center mb-4 font-medium">
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
