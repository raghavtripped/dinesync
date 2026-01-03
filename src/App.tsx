import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
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
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const nextStep = () => {
    const steps: AppStep[] = ['invitation', 'lobby', 'preference', 'revelation', 'voting'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white flex items-center justify-center p-4 overflow-hidden relative transition-colors duration-300">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-orange-200/40 dark:bg-swiggy-orange/20 rounded-full blur-[120px] pointer-events-none transition-colors duration-500" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-[100px] pointer-events-none transition-colors duration-500" />

      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md shadow-lg border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white transition-all hover:scale-110 active:scale-95"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

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
