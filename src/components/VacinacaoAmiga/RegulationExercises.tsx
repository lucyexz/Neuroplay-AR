import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Exercise = 'menu' | 'breathing' | 'waves' | 'countdown';

interface RegulationExercisesProps {
  onComplete?: () => void;
}

export function RegulationExercises({ onComplete }: RegulationExercisesProps) {
  const [currentExercise, setCurrentExercise] = useState<Exercise>('menu');
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [countdownNumber, setCountdownNumber] = useState(5);

  const startBreathing = () => {
    setCurrentExercise('breathing');
    let phase: 'inhale' | 'exhale' = 'inhale';
    const interval = setInterval(() => {
      phase = phase === 'inhale' ? 'exhale' : 'inhale';
      setBreathingPhase(phase);
    }, 3000);

    setTimeout(() => {
      clearInterval(interval);
      setCurrentExercise('menu');
    }, 18000);
  };

  const startWaves = () => {
    setCurrentExercise('waves');
    setTimeout(() => {
      setCurrentExercise('menu');
    }, 15000);
  };

  const startCountdown = () => {
    setCurrentExercise('countdown');
    setCountdownNumber(5);

    let count = 5;
    const interval = setInterval(() => {
      count--;
      setCountdownNumber(count);

      if (count === 0) {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentExercise('menu');
        }, 1000);
      }
    }, 1000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {currentExercise === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center p-8"
          >
            <h2 className="text-4xl font-bold text-purple-700 mb-4">
              Vamos nos acalmar?
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Escolha um exercício para se sentir melhor
            </p>

            <div className="space-y-4">
              <button
                onClick={startBreathing}
                className="w-full p-8 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-3xl shadow-lg hover:shadow-xl active:scale-95 transition-all border-4 border-blue-200"
              >
                <div className="text-6xl mb-3">🫧</div>
                <h3 className="text-2xl font-bold text-blue-700 mb-2">
                  Respirar com Bolhas
                </h3>
                <p className="text-lg text-gray-700">
                  Inspire e expire devagar
                </p>
              </button>

              <button
                onClick={startWaves}
                className="w-full p-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl shadow-lg hover:shadow-xl active:scale-95 transition-all border-4 border-purple-200"
              >
                <div className="text-6xl mb-3">🌊</div>
                <h3 className="text-2xl font-bold text-purple-700 mb-2">
                  Ondas Calmas
                </h3>
                <p className="text-lg text-gray-700">
                  Observe as ondas suaves
                </p>
              </button>

              <button
                onClick={startCountdown}
                className="w-full p-8 bg-gradient-to-r from-green-100 to-teal-100 rounded-3xl shadow-lg hover:shadow-xl active:scale-95 transition-all border-4 border-green-200"
              >
                <div className="text-6xl mb-3">🔢</div>
                <h3 className="text-2xl font-bold text-green-700 mb-2">
                  Contagem Regressiva
                </h3>
                <p className="text-lg text-gray-700">
                  Contar de 5 até 1
                </p>
              </button>
            </div>
          </motion.div>
        )}

        {currentExercise === 'breathing' && (
          <motion.div
            key="breathing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center p-8"
          >
            <h2 className="text-3xl font-bold text-blue-700 mb-8">
              Respirar com Bolhas
            </h2>

            <div className="relative w-80 h-80 mx-auto flex items-center justify-center">
              <motion.div
                className="absolute w-full h-full rounded-full bg-gradient-to-br from-blue-200 to-cyan-200 flex items-center justify-center"
                animate={{
                  scale: breathingPhase === 'inhale' ? [0.6, 1] : [1, 0.6],
                }}
                transition={{
                  duration: 3,
                  ease: 'easeInOut',
                }}
              >
                <span className="text-7xl">🫧</span>
              </motion.div>
            </div>

            <motion.p
              className="mt-8 text-3xl font-bold"
              animate={{
                color: breathingPhase === 'inhale' ? '#0EA5E9' : '#8B5CF6',
              }}
            >
              {breathingPhase === 'inhale' ? 'Inspire... 🌬️' : 'Expire... 😌'}
            </motion.p>
          </motion.div>
        )}

        {currentExercise === 'waves' && (
          <motion.div
            key="waves"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center p-8"
          >
            <h2 className="text-3xl font-bold text-purple-700 mb-8">
              Ondas Calmas
            </h2>

            <div className="relative w-full h-80 mx-auto overflow-hidden rounded-3xl bg-gradient-to-b from-purple-100 to-pink-100">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-full h-32 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${
                      i % 2 === 0 ? 'rgba(167, 139, 250, 0.3)' : 'rgba(244, 114, 182, 0.3)'
                    }, transparent)`,
                    top: `${i * 20}%`,
                  }}
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}

              <div className="relative z-10 flex items-center justify-center h-full">
                <motion.span
                  className="text-8xl"
                  animate={{
                    y: [-20, 20, -20],
                    rotate: [-5, 5, -5],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  🌊
                </motion.span>
              </div>
            </div>

            <p className="mt-8 text-2xl font-semibold text-gray-700">
              Observe as ondas... respire devagar...
            </p>
          </motion.div>
        )}

        {currentExercise === 'countdown' && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center p-8"
          >
            <h2 className="text-3xl font-bold text-green-700 mb-8">
              Contagem Regressiva
            </h2>

            <div className="relative w-80 h-80 mx-auto flex items-center justify-center">
              <motion.div
                className="absolute w-full h-full rounded-full bg-gradient-to-br from-green-200 to-teal-200 flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              >
                <motion.span
                  key={countdownNumber}
                  className="text-9xl font-bold text-green-700"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  {countdownNumber === 0 ? '✓' : countdownNumber}
                </motion.span>
              </motion.div>
            </div>

            <p className="mt-8 text-2xl font-semibold text-gray-700">
              {countdownNumber === 0 ? 'Pronto! Você consegue!' : 'Respire fundo...'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
