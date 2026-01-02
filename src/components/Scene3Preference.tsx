import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { ChevronDown } from 'lucide-react';

interface Props {
  onNext: () => void;
}

const CUISINES = ['North Indian', 'Chinese', 'Italian', 'South Indian', 'Mexican', 'Continental'];
const AMBIANCES = ['Casual Dining', 'Fine Dining', 'Cafe', 'Pub/Bar', 'Rooftop'];

export default function Scene3Preference({ onNext }: Props) {
  const [isWaiting, setIsWaiting] = useState(false);
  
  // Form State
  const [cuisine, setCuisine] = useState(CUISINES[0]);
  const [ambiance, setAmbiance] = useState(AMBIANCES[0]);
  const [budget, setBudget] = useState(600);
  const [vicinity, setVicinity] = useState(3);
  const [alcohol, setAlcohol] = useState<string>('Mocktail');
  const [foodType, setFoodType] = useState<string>('Both');

  // Simulation State
  const [simulatedResponses, setSimulatedResponses] = useState(0);

  const handleSubmit = () => {
    setIsWaiting(true);
  };

  useEffect(() => {
    if (isWaiting) {
      // Simulate 3 other people responding over 3-4 seconds
      const interval = setInterval(() => {
        setSimulatedResponses(prev => {
          if (prev >= 3) {
            clearInterval(interval);
            setTimeout(onNext, 1000); // Give a moment after everyone finishes
            return 3;
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isWaiting, onNext]);

  if (isWaiting) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center h-full text-center space-y-8 p-6"
      >
        <div className="w-24 h-24 bg-swiggy-orange/10 rounded-full flex items-center justify-center relative">
           <div className="absolute inset-0 border-4 border-swiggy-orange/30 rounded-full animate-ping" />
           <span className="text-4xl">🗳️</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Waiting for friends...</h2>
          <p className="text-gray-400">Everyone is casting their votes async.</p>
        </div>

        <div className="w-full max-w-xs space-y-4">
           {/* Simulate Other Users */}
           {['Aditya', 'Sneha', 'Kabir'].map((name, i) => (
             <div key={name} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                     {name[0]}
                   </div>
                   <span>{name}</span>
                </div>
                {i < simulatedResponses ? (
                  <span className="text-green-500 font-bold text-sm">Submitted</span>
                ) : (
                  <span className="text-gray-500 text-sm animate-pulse">Thinking...</span>
                )}
             </div>
           ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col h-full p-6 overflow-y-auto"
    >
      <header className="mb-6 space-y-2">
        <h2 className="text-2xl font-bold">Your Preferences</h2>
        <p className="text-gray-400 text-sm">Tell us what you're craving today.</p>
      </header>

      <div className="space-y-6 flex-1 pb-6">
        
        {/* Dropdowns Group */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Cuisine</label>
            <div className="relative">
              <select 
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full bg-white/10 text-white rounded-lg p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-swiggy-orange text-sm"
              >
                {CUISINES.map(c => <option key={c} value={c} className="bg-gray-800">{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Ambiance</label>
            <div className="relative">
              <select 
                value={ambiance}
                onChange={(e) => setAmbiance(e.target.value)}
                className="w-full bg-white/10 text-white rounded-lg p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-swiggy-orange text-sm"
              >
                {AMBIANCES.map(a => <option key={a} value={a} className="bg-gray-800">{a}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Sliders Group */}
        <div className="space-y-6">
          <div className="space-y-3">
             <div className="flex justify-between">
               <label className="text-xs font-bold text-gray-500 uppercase">Budget / Person</label>
               <span className="text-swiggy-orange font-bold">₹{budget}</span>
             </div>
             <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-swiggy-orange"
              />
          </div>

          <div className="space-y-3">
             <div className="flex justify-between">
               <label className="text-xs font-bold text-gray-500 uppercase">Vicinity Range</label>
               <span className="text-swiggy-orange font-bold">{vicinity} km</span>
             </div>
             <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={vicinity}
                onChange={(e) => setVicinity(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-swiggy-orange"
              />
          </div>
        </div>

        {/* Radio Groups */}
        <div className="space-y-4">
           <div className="space-y-2">
             <label className="text-xs font-bold text-gray-500 uppercase">Alcohol Preference</label>
             <div className="grid grid-cols-4 gap-2">
               {['Mocktail', 'Cocktail', 'Both', 'None'].map(opt => (
                 <button
                   key={opt}
                   onClick={() => setAlcohol(opt)}
                   className={cn(
                     "py-2 rounded-lg text-xs font-medium transition-all",
                     alcohol === opt 
                       ? "bg-swiggy-orange text-white shadow-lg" 
                       : "bg-white/5 text-gray-400 hover:bg-white/10"
                   )}
                 >
                   {opt}
                 </button>
               ))}
             </div>
           </div>

           <div className="space-y-2">
             <label className="text-xs font-bold text-gray-500 uppercase">Food Preference</label>
             <div className="grid grid-cols-3 gap-2">
               {['Veg', 'Non-Veg', 'Both'].map(opt => (
                 <button
                   key={opt}
                   onClick={() => setFoodType(opt)}
                   className={cn(
                     "py-2 rounded-lg text-xs font-medium transition-all",
                     foodType === opt 
                       ? "bg-swiggy-orange text-white shadow-lg" 
                       : "bg-white/5 text-gray-400 hover:bg-white/10"
                   )}
                 >
                   {opt}
                 </button>
               ))}
             </div>
           </div>
        </div>

      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-4 rounded-xl font-bold text-lg bg-white text-black hover:bg-gray-100 transition-all shadow-lg active:scale-95"
      >
        Submit Preferences
      </button>
    </motion.div>
  );
}
