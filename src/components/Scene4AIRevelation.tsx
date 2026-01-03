import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { SessionData } from '../types';
import { cn } from '../lib/utils';

interface Props {
  onNext: () => void;
  data: SessionData;
}

export default function Scene4AIRevelation({ onNext, data }: Props) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [loadingText, setLoadingText] = useState("Checking 45 Restaurants...");

  useEffect(() => {
    const texts = [
      "Checking 45 Restaurants...",
      "Analyzing Spice Levels...",
      "Checking Delivery Times...",
      "Finding the best deals...",
      "Optimizing for maximum tasty..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(texts[i % texts.length]);
      i++;
    }, 800);

    const timeout = setTimeout(() => {
      setIsProcessing(false);
      clearInterval(interval);
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (isProcessing) {
    return (
      <motion.div
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center h-full space-y-8 p-6"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 rounded-full border-4 border-t-swiggy-orange border-r-transparent border-b-swiggy-orange border-l-transparent"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-swiggy-orange animate-pulse" />
          </div>
        </div>
        <motion.p
          key={loadingText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xl font-medium text-swiggy-orange text-center"
        >
          {loadingText}
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full p-6"
    >
      <header className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <Sparkles className="text-swiggy-orange" />
          Top Picks for You
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Based on everyone's cravings</p>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto pb-6">
        {data.recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.2 }}
            className="glass-card overflow-hidden group relative"
          >
            {/* Match Badge */}
            <div className={cn(
              "absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg",
              index === 0 
                ? "bg-gradient-to-r from-swiggy-orange to-pink-500 text-white animate-pulse" 
                : "bg-white/80 dark:bg-black/50 backdrop-blur-md text-gray-900 dark:text-white"
            )}>
              {rec.match_score}% Match
            </div>

            <div className="h-32 bg-gray-100 dark:bg-gray-800 relative">
               <img src={rec.image} alt={rec.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
               <div className="absolute bottom-3 left-3">
                 <h3 className="text-xl font-bold text-white">{rec.name}</h3>
                 <div className="flex gap-2 text-xs mt-1">
                   {rec.tags.map(tag => (
                     <span key={tag} className="bg-white/20 px-2 py-0.5 rounded text-white/90">{tag}</span>
                   ))}
                 </div>
               </div>
            </div>
            
            <div className="p-4 flex justify-between items-center bg-gray-50 dark:bg-white/5">
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                {rec.price_level} • 35 mins • 4.2★
              </div>
              {index === 0 && (
                 <span className="text-swiggy-orange text-sm font-bold">Best Bet</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full btn-primary"
      >
        Start Voting
      </button>
    </motion.div>
  );
}

