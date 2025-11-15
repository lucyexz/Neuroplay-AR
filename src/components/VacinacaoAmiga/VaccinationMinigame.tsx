import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type GameStep = 'start' | 'cleaning' | 'bandaid' | 'injection' | 'completed';

const bandaidOptions = [
  { id: 1, emoji: '💙', color: 'bg-blue-200', name: 'Azul' },
  { id: 2, emoji: '💚', color: 'bg-green-200', name: 'Verde' },
  { id: 3, emoji: '💛', color: 'bg-yellow-200', name: 'Amarelo' },
  { id: 4, emoji: '💜', color: 'bg-purple-200', name: 'Roxo' },
  { id: 5, emoji: '🩷', color: 'bg-pink-200', name: 'Rosa' },
  { id: 6, emoji: '⭐', color: 'bg-orange-200', name: 'Estrela' },
];

interface VaccinationMinigameProps {
  onComplete?: () => void;
}

export function VaccinationMinigame({ onComplete }: VaccinationMinigameProps) {
  const [gameStep, setGameStep] = useState<GameStep>('start');
  const [cleanProgress, setCleanProgress] = useState(0);
  const [selectedBandaid, setSelectedBandaid] = useState<number | null>(null);
  const [armPosition, setArmPosition] = useState({ x: 0, y: 0 });
  const armRef = useRef<HTMLDivElement>(null);

  const handleClean = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameStep !== 'cleaning') return;

    const newProgress = Math.min(cleanProgress + 10, 100);
    setCleanProgress(newProgress);

    if (newProgress >= 100) {
      setTimeout(() => setGameStep('injection'), 500);
    }
  };

  const handleInjection = () => {
    if (gameStep !== 'injection') return;
    setGameStep('bandaid');
  };

  const handleBandaidSelect = (id: number) => {
    setSelectedBandaid(id);
    setTimeout(() => {
      setGameStep('completed');
      onComplete?.();
    }, 1000);
  };

  const handleStart = () => {
    setGameStep('cleaning');
    setCleanProgress(0);
    setSelectedBandaid(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {gameStep === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center p-8"
          >
            <div className="text-8xl mb-6">🤗</div>
            <h2 className="text-4xl font-bold text-purple-700 mb-4">
              Vamos praticar!
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Você vai aprender o passo a passo de forma divertida
            </p>
            <button
              onClick={handleStart}
              className="px-12 py-6 bg-purple-500 text-white text-2xl font-bold rounded-full shadow-xl hover:bg-purple-600 active:scale-95 transition-all"
            >
              Começar
            </button>
          </motion.div>
        )}

        {gameStep === 'cleaning' && (
          <motion.div
            key="cleaning"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center p-8"
          >
            <h2 className="text-3xl font-bold text-teal-700 mb-4">
              Limpar o braço
            </h2>
            <p className="text-xl text-gray-700 mb-6">
              Arraste o algodão sobre o braço
            </p>

            <div className="relative w-64 h-96 mx-auto bg-gradient-to-b from-amber-100 to-amber-200 rounded-full shadow-xl">
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full cursor-pointer"
                onMouseMove={handleClean}
                onTouchMove={handleClean}
                animate={{
                  opacity: 1 - cleanProgress / 100,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                  🧼
                </div>
              </motion.div>

              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-teal-200"
                animate={{
                  scale: cleanProgress / 100,
                  opacity: cleanProgress / 100,
                }}
              />
            </div>

            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                <motion.div
                  className="h-full bg-teal-500 rounded-full"
                  animate={{ width: `${cleanProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="mt-2 text-lg font-semibold text-gray-700">
                {cleanProgress}%
              </p>
            </div>
          </motion.div>
        )}

        {gameStep === 'injection' && (
          <motion.div
            key="injection"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center p-8"
          >
            <h2 className="text-3xl font-bold text-purple-700 mb-4">
              Tomar a vacina
            </h2>
            <p className="text-xl text-gray-700 mb-6">
              Toque no braço. Vai ser rápido!
            </p>

            <motion.button
              onClick={handleInjection}
              className="relative w-64 h-96 mx-auto bg-gradient-to-b from-amber-100 to-amber-200 rounded-full shadow-xl hover:shadow-2xl transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl"
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                💉
              </motion.div>
            </motion.button>

            <p className="mt-6 text-lg text-gray-600">
              Conta comigo: 3... 2... 1...
            </p>
          </motion.div>
        )}

        {gameStep === 'bandaid' && (
          <motion.div
            key="bandaid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center p-8"
          >
            <h2 className="text-3xl font-bold text-pink-700 mb-4">
              Escolha seu curativo!
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Qual você prefere?
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {bandaidOptions.map((bandaid) => (
                <motion.button
                  key={bandaid.id}
                  onClick={() => handleBandaidSelect(bandaid.id)}
                  className={`${bandaid.color} p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    borderColor: selectedBandaid === bandaid.id ? '#EC4899' : 'transparent',
                    borderWidth: selectedBandaid === bandaid.id ? 4 : 0,
                  }}
                >
                  <div className="text-5xl mb-2">{bandaid.emoji}</div>
                  <p className="text-sm font-semibold">{bandaid.name}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {gameStep === 'completed' && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8"
          >
            <motion.div
              className="text-9xl mb-6"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 1,
                repeat: 3,
              }}
            >
              🎉
            </motion.div>
            <h2 className="text-5xl font-bold text-purple-700 mb-4">
              Parabéns!
            </h2>
            <p className="text-2xl text-gray-700 mb-4">
              Você foi muito corajoso!
            </p>
            <p className="text-xl text-gray-600">
              Agora você sabe como vai ser!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
