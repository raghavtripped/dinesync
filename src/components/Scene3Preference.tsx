import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, Leaf, Beef, Flame, Salad, Pizza, Candy } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  onNext: () => void;
}

const vibes = [
  { id: 'spicy', label: 'Spicy', icon: Flame, color: 'text-red-500' },
  { id: 'healthy', label: 'Healthy', icon: Salad, color: 'text-green-500' },
  { id: 'cheesy', label: 'Cheesy', icon: Pizza, color: 'text-yellow-500' },
  { id: 'sweet', label: 'Sweet', icon: Candy, color: 'text-pink-500' },
];

export default function Scene3Preference({ onNext }: Props) {
  const [step, setStep] = useState(0);
  const [budget, setBudget] = useState(300);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [isVeg, setIsVeg] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(prev => prev + 1);
    } else {
      setIsWaiting(true);
      // Simulate waiting for others
      setTimeout(() => {
        onNext();
      }, 3000);
    }
  };

  const getBudgetEmoji = (amount: number) => {
    if (amount < 200) return '💸';
    if (amount < 600) return '💰';
    return '💎';
  };

  if (isWaiting) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center h-full text-center space-y-6 p-6"
      >
        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center animate-bounce">
          <span className="text-4xl">🥗</span>
        </div>
        <h2 className="text-2xl font-bold">Convincing Aditya to eat Salad...</h2>
        <div className="w-full max-w-xs h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3 }}
            className="h-full bg-swiggy-orange"
          />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6 relative overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
        <motion.div
          className="h-full bg-swiggy-orange"
          initial={{ width: 0 }}
          animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center py-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="budget"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold text-center">What's the damage?</h2>
              <div className="text-center">
                <span className="text-6xl mb-4 block">{getBudgetEmoji(budget)}</span>
                <div className="text-2xl font-bold text-swiggy-orange">
                  ₹{budget}<span className="text-sm text-gray-400">/person</span>
                </div>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-4 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-swiggy-orange"
              />
              <div className="flex justify-between text-sm text-gray-400 font-medium">
                <span>Broke Student</span>
                <span>Treat Day</span>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="vibe"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold text-center">Vibe Check</h2>
              <div className="grid grid-cols-2 gap-4">
                {vibes.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVibe(v.id)}
                    className={cn(
                      "aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border-2",
                      selectedVibe === v.id
                        ? "bg-white/10 border-swiggy-orange scale-95"
                        : "bg-white/5 border-transparent hover:bg-white/10"
                    )}
                  >
                    <v.icon className={cn("w-10 h-10", v.color)} />
                    <span className="font-medium">{v.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="veg"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="space-y-8 flex flex-col items-center"
            >
              <h2 className="text-3xl font-bold text-center">Dietary Preference</h2>
              
              <div 
                onClick={() => setIsVeg(!isVeg)}
                className="w-64 h-32 bg-gray-800 rounded-full p-2 cursor-pointer relative transition-colors duration-500 border-2 border-white/10"
              >
                {/* Background Text */}
                <div className="absolute inset-0 flex items-center justify-between px-8 font-bold text-lg">
                  <span className={cn("transition-opacity", isVeg ? "opacity-0" : "opacity-100 text-red-400")}>MEAT</span>
                  <span className={cn("transition-opacity", isVeg ? "opacity-100 text-green-400" : "opacity-0")}>VEG</span>
                </div>

                {/* Knob */}
                <motion.div
                  animate={{ x: isVeg ? "100%" : "0%" }}
                  className={cn(
                    "w-28 h-28 rounded-full shadow-lg flex items-center justify-center transition-colors",
                    isVeg ? "bg-green-500" : "bg-red-500"
                  )}
                >
                  {isVeg ? <Leaf className="w-12 h-12 text-white" /> : <Beef className="w-12 h-12 text-white" />}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={handleNext}
          className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
        >
          {step === totalSteps - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}

