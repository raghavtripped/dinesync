import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppStep, SessionData } from './types';
import rawData from './features/dinesync-smart-content.json';

import Scene1Invitation from './components/Scene1Invitation';
import Scene2Lobby from './components/Scene2Lobby';
import Scene3Preference from './components/Scene3Preference';
import Scene4AIRevelation from './components/Scene4AIRevelation';
import Scene5Voting from './components/Scene5Voting';

const data = rawData as SessionData;

function App() {
  const [step, setStep] = useState<AppStep>('invitation');

  const nextStep = () => {
    const steps: AppStep[] = ['invitation', 'lobby', 'preference', 'revelation', 'voting'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-swiggy-orange/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />

      <main className="w-full max-w-md relative z-10 min-h-[800px] flex flex-col">
        <AnimatePresence mode="wait">
          {step === 'invitation' && (
            <Scene1Invitation key="invitation" onNext={nextStep} />
          )}
          {step === 'lobby' && (
            <Scene2Lobby key="lobby" onNext={nextStep} data={data} />
          )}
          {step === 'preference' && (
            <Scene3Preference key="preference" onNext={nextStep} />
          )}
          {step === 'revelation' && (
            <Scene4AIRevelation key="revelation" onNext={nextStep} data={data} />
          )}
          {step === 'voting' && (
            <Scene5Voting key="voting" onNext={nextStep} data={data} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
