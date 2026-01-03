import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Calculator, ArrowRight, Share2, Receipt } from 'lucide-react';
import { SessionData } from '../types';

interface Props {
  data: SessionData;
}

type Step = 'receipt' | 'split-config' | 'final-split';

export default function Scene6SmartSplit({ data }: Props) {
  const [step, setStep] = useState<Step>('split-config');
  const [hasPaid, setHasPaid] = useState(false);
  
  // Bill Split State (Preset totals for demo)
  const [vegShare, setVegShare] = useState(1400);
  const [nonVegShare, setNonVegShare] = useState(1800);
  const [mocktail, setMocktail] = useState(300);
  const [cocktail, setCocktail] = useState(900);
  
  const totalCalculated = vegShare + nonVegShare + mocktail + cocktail;

  const [participants, setParticipants] = useState(data.session.participants.map(p => ({
    ...p,
    paymentStatus: 'pending',
    splitAmount: 0,
    tags: [] as string[]
  })));

  // Mock assigning splits based on preferences (Demo Logic)
  useEffect(() => {
     // Simple weighted split logic simulation
     const totalVegPeople = 2; // Aditya, Kabir
     const totalNonVegPeople = 2; // Sneha, Host
     
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
        else { amt = 0; } // fallback
        return { ...p, splitAmount: Math.round(amt), tags };
     }));
  }, [vegShare, nonVegShare, mocktail, cocktail]);

  const handlePay = () => {
    setHasPaid(true);
    setTimeout(() => {
      setParticipants(prev => prev.map(p => p.id === 1 ? { ...p, paymentStatus: 'paid' } : p));
    }, 1500);
    setTimeout(() => {
      setParticipants(prev => prev.map(p => p.id === 2 ? { ...p, paymentStatus: 'paid' } : p));
    }, 2500);
  };

  const userShare = 265; 
  const totalPaid = (hasPaid ? userShare : 0) + participants.filter(p => p.paymentStatus === 'paid').reduce((acc, _) => acc + 220, 0);

  // STEP 2: CATEGORIZATION
  if (step === 'split-config') {
     return (
        <motion.div
           key="config"
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
           className="flex flex-col h-full p-6 space-y-6 overflow-y-auto"
        >
           <header className="space-y-1">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                 <Calculator className="w-6 h-6 text-swiggy-orange" />
                 Bill Split (Simulated)
              </h2>
              <p className="text-gray-400 text-sm">Categorize items for smart splitting.</p>
           </header>

           {/* Mini Receipt Summary */}
           <div className="bg-white/5 rounded-lg p-4 flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <Receipt className="w-4 h-4" />
                <span>Total Bill</span>
              </div>
              <span className="font-bold text-lg">₹930</span>
           </div>

           <div className="space-y-6">
              <div className="space-y-4">
                 <div className="glass-card p-4 space-y-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase">Veg Dishes Total</label>
                       <div className="flex items-center gap-2">
                          <span className="text-gray-400">₹</span>
                          <input 
                             type="number" 
                             value={vegShare} 
                             onChange={e => setVegShare(Number(e.target.value))}
                             className="bg-transparent text-xl font-bold w-full focus:outline-none"
                          />
                       </div>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase">Non-Veg Dishes Total</label>
                       <div className="flex items-center gap-2">
                          <span className="text-gray-400">₹</span>
                          <input 
                             type="number" 
                             value={nonVegShare} 
                             onChange={e => setNonVegShare(Number(e.target.value))}
                             className="bg-transparent text-xl font-bold w-full focus:outline-none"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="glass-card p-4 space-y-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase">Mocktail Add-on</label>
                       <div className="flex items-center gap-2">
                          <span className="text-gray-400">₹</span>
                          <input 
                             type="number" 
                             value={mocktail} 
                             onChange={e => setMocktail(Number(e.target.value))}
                             className="bg-transparent text-xl font-bold w-full focus:outline-none"
                          />
                       </div>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase">Cocktail Add-on</label>
                       <div className="flex items-center gap-2">
                          <span className="text-gray-400">₹</span>
                          <input 
                             type="number" 
                             value={cocktail} 
                             onChange={e => setCocktail(Number(e.target.value))}
                             className="bg-transparent text-xl font-bold w-full focus:outline-none"
                          />
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass-card bg-swiggy-orange/10 border-swiggy-orange/30 p-4 flex justify-between items-center">
              <span className="font-bold">Computed Total</span>
              <span className="text-2xl font-bold text-swiggy-orange">₹{totalCalculated}</span>
           </div>

           <button 
              onClick={() => setStep('final-split')}
              className="w-full btn-primary flex items-center justify-center gap-2"
           >
              Split for People <ArrowRight className="w-5 h-5" />
           </button>
        </motion.div>
     );
  }

  // STEP 3: FINAL SUMMARY
  if (step === 'final-split') {
     return (
        <motion.div
           key="final"
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="flex flex-col h-full p-6 space-y-6 overflow-y-auto"
        >
             <div className="text-center space-y-2">
               <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                   Split Summary
               </h2>
               <p className="text-gray-400 text-sm">Based on individual preferences.</p>
             </div>
             
             <div className="flex-1 space-y-4">
                {participants.map(p => (
                   <div key={p.id} className="glass-card p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg border border-white/10">
                            {p.avatar}
                         </div>
                         <div>
                            <div className="font-bold">{p.name}</div>
                            <div className="flex gap-1 mt-1">
                               {p.tags.map(t => (
                                  <span key={t} className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300">{t}</span>
                               ))}
                            </div>
                         </div>
                      </div>
                      <div className="font-mono text-xl font-bold text-swiggy-orange">₹{p.splitAmount}</div>
                   </div>
                ))}
                
                {/* Host Yourself */}
                <div className="glass-card p-4 flex justify-between items-center border-swiggy-orange/30">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-swiggy-orange flex items-center justify-center text-lg text-white">
                            👑
                         </div>
                         <div>
                            <div className="font-bold">You</div>
                            <div className="flex gap-1 mt-1">
                               <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300">Non-Veg</span>
                               <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300">Mocktail</span>
                            </div>
                         </div>
                      </div>
                      <div className="font-mono text-xl font-bold text-white">₹{Math.round((1800/2) + (300/2))}</div>
                   </div>
             </div>

             <div className="mt-auto space-y-3">
                <button className="w-full py-4 rounded-xl font-bold text-lg bg-[#5BC5A7] text-white shadow-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                   <Share2 className="w-5 h-5" /> Settle on Splitwise
                </button>
             </div>
        </motion.div>
     );
  }

  // STEP 1: RECEIPT (Default)
  return (
    <motion.div
      key="receipt"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-gray-900 relative"
    >
      <div className="flex-1 p-6 overflow-y-auto pb-48">
         <div className="bg-white text-black p-6 rounded-t-xl shadow-xl relative pb-12" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 98%)' }}>
         <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
            <h2 className="font-bold text-xl uppercase tracking-widest flex items-center justify-center gap-2">
               <Receipt className="w-5 h-5" /> Receipt
            </h2>
            <p className="text-xs text-gray-500">{new Date().toLocaleString()}</p>
         </div>

         <div className="space-y-4">
            {data.bill_details.items.map((item) => (
               <div key={item.id} className="flex justify-between items-start">
               <div>
                  <div className="font-bold text-sm">{item.name}</div>
                  <div className="flex -space-x-1 mt-1">
                     {item.assigned_to.includes('all') ? (
                        <span className="text-[10px] bg-gray-200 px-1 rounded">Shared (4)</span>
                     ) : (
                        item.assigned_to.map(id => {
                        const p = data.session.participants.find(part => part.id === id);
                        return p ? <span key={id} className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-[8px]">{p.avatar}</span> : null;
                        })
                     )}
                  </div>
               </div>
               <div className="font-mono">₹{item.price}</div>
               </div>
            ))}
            
            <div className="border-t-2 border-dashed border-gray-300 pt-2 flex justify-between font-bold text-lg">
               <span>Total</span>
               <span>₹930</span>
            </div>
         </div>
         </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gray-800 rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20">
         <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6" />
         
         <div className="flex justify-between items-end mb-6">
         <div>
            <div className="text-gray-400 text-sm mb-1">Your Share</div>
            <div className="text-4xl font-bold text-white flex items-center gap-1">
               ₹{userShare}
               {hasPaid && <Check className="w-6 h-6 text-green-500" />}
            </div>
         </div>
         <div className="text-right">
            <div className="text-xs text-gray-400 mb-1">Total Collected</div>
            <div className="text-swiggy-orange font-mono">₹{totalPaid} / ₹930</div>
         </div>
         </div>

         <div className="flex flex-col gap-3 mb-6">
             <button
               onClick={() => setStep('split-config')}
               className="w-full py-4 rounded-xl font-bold text-lg bg-swiggy-orange text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
               <Calculator className="w-5 h-5" /> Generate Bill & Split
            </button>

            {!hasPaid ? (
               <button
                  onClick={handlePay}
                  className="w-full py-3 rounded-xl font-medium text-sm bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all"
               >
                  Just Pay My Share (₹{userShare})
               </button>
            ) : (
               <button disabled className="w-full py-3 rounded-xl font-medium text-sm bg-gray-700 text-green-400 flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> You Paid
               </button>
            )}
         </div>

         <div className="space-y-3">
         <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2">
               <span className="w-6 h-6 rounded-full bg-swiggy-orange flex items-center justify-center text-xs">👑</span>
               You
            </span>
            {hasPaid ? <span className="text-green-400 flex items-center gap-1"><Check className="w-3 h-3"/> Paid</span> : <span className="text-yellow-400 flex items-center gap-1"><Clock className="w-3 h-3"/> Paying...</span>}
         </div>
         {participants.map(p => (
            <div key={p.id} className="flex justify-between items-center text-sm">
               <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs">{p.avatar}</span>
                  {p.name}
               </span>
               {p.paymentStatus === 'paid' ? (
                  <span className="text-green-400 flex items-center gap-1"><Check className="w-3 h-3"/> Paid</span>
               ) : (
                  <span className="text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3"/> Pending</span>
               )}
            </div>
         ))}
         </div>
      </div>
    </motion.div>
  );
}
