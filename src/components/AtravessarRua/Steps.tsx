import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface StepsProps {
  onComplete: () => void;
}

const steps = [
  {
    id: 1,
    icon: '🚶',
    title: 'Chegar na calçada',
    description: 'Primeiro, paramos na calçada, antes da rua',
    color: 'from-blue-400 to-blue-500',
  },
  {
    id: 2,
    icon: '👀',
    title: 'Procurar a faixa',
    description: 'Procuramos a faixa de pedestres branca',
    color: 'from-green-400 to-green-500',
  },
  {
    id: 3,
    icon: '🚦',
    title: 'Olhar o semáforo',
    description: 'Olhamos para o semáforo de pedestres',
    color: 'from-yellow-400 to-yellow-500',
  },
  {
    id: 4,
    icon: '🟢',
    title: 'Esperar ficar verde',
    description: 'Esperamos o sinal ficar verde para pedestres',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 5,
    icon: '🚶‍♂️',
    title: 'Atravessar com calma',
    description: 'Atravessamos devagar, olhando para os dois lados',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 6,
    icon: '✅',
    title: 'Chegar em segurança',
    description: 'Chegamos do outro lado em segurança!',
    color: 'from-purple-500 to-purple-600',
  },
];

export function Steps({ onComplete }: StepsProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [currentStep, onComplete]);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-3xl w-full">
        <div className="mb-8 sm:mb-12">
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index <= currentStep ? 'bg-green-500 w-12' : 'bg-gray-300 w-8'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep < steps.length && (
            <motion.div
              key={steps[currentStep].id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-center"
            >
              <motion.div
                className={`inline-block p-8 sm:p-12 rounded-full bg-gradient-to-br ${steps[currentStep].color} shadow-2xl mb-6 sm:mb-8`}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="text-6xl sm:text-8xl">{steps[currentStep].icon}</div>
              </motion.div>

              <motion.h2
                className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {steps[currentStep].title}
              </motion.h2>

              <motion.p
                className="text-lg sm:text-2xl text-gray-700 bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {steps[currentStep].description}
              </motion.p>

              <motion.div
                className="mt-8 text-gray-500 text-sm sm:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Passo {currentStep + 1} de {steps.length}
              </motion.div>
            </motion.div>
          )}

          {currentStep === steps.length && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="text-8xl sm:text-9xl mb-6">🎉</div>
              <h2 className="text-3xl sm:text-5xl font-bold text-green-600 mb-4">
                Muito bem!
              </h2>
              <p className="text-xl sm:text-2xl text-gray-700">
                Agora vamos praticar atravessar a rua!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
