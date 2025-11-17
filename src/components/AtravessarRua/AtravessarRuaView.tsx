import { useState } from 'react';
import { Intro } from './Intro';
import { Steps } from './Steps';
import { GameWrapper } from './GameWrapper';
import { Success } from './Success';
import { motion } from 'framer-motion';

interface AtravessarRuaViewProps {
  onBack: () => void;
}

type Phase = 'intro' | 'steps' | 'game' | 'success';

export function AtravessarRuaView({ onBack }: AtravessarRuaViewProps) {
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    reducedMotion: false,
    muteSounds: false,
    largeButtons: false,
  });

  const handleRestart = () => {
    setCurrentPhase('intro');
  };

  return (
    <div className="relative w-full min-h-screen">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-50 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg hover:bg-white active:scale-95 transition-all"
      >
        <span className="text-2xl">✕</span>
      </button>

      <button
        onClick={() => setShowSettings(!showSettings)}
        className="absolute top-4 right-4 z-50 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg hover:bg-white active:scale-95 transition-all"
      >
        <span className="text-2xl">⚙️</span>
      </button>

      {showSettings && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="absolute top-20 right-4 z-50 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 w-80"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Configurações</h3>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Reduzir animações</span>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) =>
                  setSettings({ ...settings, reducedMotion: e.target.checked })
                }
                className="w-6 h-6"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-gray-700">Sem sons</span>
              <input
                type="checkbox"
                checked={settings.muteSounds}
                onChange={(e) =>
                  setSettings({ ...settings, muteSounds: e.target.checked })
                }
                className="w-6 h-6"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-gray-700">Botões grandes</span>
              <input
                type="checkbox"
                checked={settings.largeButtons}
                onChange={(e) =>
                  setSettings({ ...settings, largeButtons: e.target.checked })
                }
                className="w-6 h-6"
              />
            </label>
          </div>

          <button
            onClick={() => setShowSettings(false)}
            className="mt-6 w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg active:scale-95 transition-all"
          >
            Fechar
          </button>
        </motion.div>
      )}

      {currentPhase === 'intro' && (
        <Intro onStart={() => setCurrentPhase('steps')} />
      )}

      {currentPhase === 'steps' && (
        <Steps onComplete={() => setCurrentPhase('game')} />
      )}

      {currentPhase === 'game' && (
        <GameWrapper onComplete={() => setCurrentPhase('success')} />
      )}

      {currentPhase === 'success' && (
        <Success onRestart={handleRestart} onBackToMenu={onBack} />
      )}
    </div>
  );
}
