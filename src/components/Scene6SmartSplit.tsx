import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, CreditCard, ChevronUp } from 'lucide-react';
import { SessionData } from '../types';
import { cn } from '../lib/utils';

interface Props {
  data: SessionData;
}

export default function Scene6SmartSplit({ data }: Props) {
  const [hasPaid, setHasPaid] = useState(false);
  const [participants, setParticipants] = useState(data.session.participants.map(p => ({
    ...p,
    paymentStatus: 'pending' // 'pending' | 'paid'
  })));
  
  // Host (user) is separate in logic but let's include for display
  const userShare = 265;
  const totalBill = 930;

  const handlePay = () => {
    setHasPaid(true);
    // Simulate others paying
    setTimeout(() => {
      setParticipants(prev => prev.map(p => p.id === 1 ? { ...p, paymentStatus: 'paid' } : p));
    }, 1500);
    setTimeout(() => {
      setParticipants(prev => prev.map(p => p.id === 2 ? { ...p, paymentStatus: 'paid' } : p));
    }, 2500);
  };

  const paidAmount = (hasPaid ? userShare : 0) + participants.filter(p => p.paymentStatus === 'paid').length * (totalBill - userShare) / 3; // Rough approximation for visual progress
  // Actually let's just count explicitly if possible, but hardcoded values from doc are easiest for "Wizard of Oz"
  // Doc: Total 930. Your share 265. 
  // Let's just track progress based on count.

  const totalPaid = (hasPaid ? 265 : 0) + participants.filter(p => p.paymentStatus === 'paid').reduce((acc, _) => acc + 220, 0); // approx

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-gray-900 relative"
    >
      {/* Receipt */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white text-black p-6 rounded-t-xl shadow-xl relative pb-12" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 98%)' }}>
          <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
            <h2 className="font-bold text-xl uppercase tracking-widest">Receipt</h2>
            <p className="text-xs text-gray-500">{new Date().toLocaleString()}</p>
          </div>

          <div className="space-y-4">
            {data.bill_details.items.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-sm">{item.name}</div>
                  <div className="flex -space-x-1 mt-1">
                     {/* Avatars for who ordered */}
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
              <span>₹{totalBill}</span>
            </div>
          </div>
          
          {/* Jagged bottom edge using pseudo element or just CSS clip-path above */}
        </div>
      </div>

      {/* Payment Drawer */}
      <div className="bg-gray-800 rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-10">
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
             <div className="text-swiggy-orange font-mono">₹{totalPaid} / ₹{totalBill}</div>
          </div>
        </div>

        {/* Progress */}
        <div className="h-2 bg-gray-700 rounded-full mb-6 overflow-hidden">
          <motion.div 
             className="h-full bg-green-500"
             initial={{ width: 0 }}
             animate={{ width: `${(totalPaid / totalBill) * 100}%` }}
          />
        </div>

        <button
          onClick={handlePay}
          disabled={hasPaid}
          className={cn(
            "w-full py-4 rounded-xl font-bold text-lg mb-6 flex items-center justify-center gap-2 transition-all",
            hasPaid ? "bg-green-600 text-white" : "btn-primary"
          )}
        >
          {hasPaid ? "Paid Successfully" : "Pay via UPI"}
        </button>

        {/* Status List */}
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

