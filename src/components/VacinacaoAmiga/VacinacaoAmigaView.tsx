import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import { CalmBackground } from './CalmBackground';
import { VaccinationTimeline } from './VaccinationTimeline';
import { VaccinationMinigame } from './VaccinationMinigame';
import { RegulationExercises } from './RegulationExercises';
import { EducationModal } from './EducationModal';

type Screen = 'home' | 'timeline' | 'minigame' | 'regulation';

interface VacinacaoAmigaViewProps {
  onBack: () => void;
}

export function VacinacaoAmigaView({ onBack }: VacinacaoAmigaViewProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isSilentMode, setIsSilentMode] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="absolute inset-0 opacity-30">
        <Canvas>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <CalmBackground />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between p-6">
          <button
            onClick={onBack}
            className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg hover:bg-white active:scale-95 transition-all"
          >
            <span className="text-2xl">←</span>
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => setIsSilentMode(!isSilentMode)}
              className={`bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white active:scale-95 transition-all ${
                isSilentMode ? 'ring-4 ring-purple-400' : ''
              }`}
              aria-label={isSilentMode ? 'Modo silencioso ativado' : 'Ativar modo silencioso'}
            >
              {isSilentMode ? (
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => setShowEducationModal(true)}
              className="bg-white/90 backdrop-blur-sm px-4 py-3 rounded-full shadow-lg hover:bg-white active:scale-95 transition-all text-purple-600 font-semibold"
            >
              ❓ Entender melhor
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {currentScreen === 'home' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center py-8"
            >
              <motion.div
                className="text-9xl mb-6"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                💉
              </motion.div>

              <h1 className="text-5xl font-bold text-purple-700 mb-4">
                Vacinação Amiga
              </h1>
              <p className="text-2xl text-gray-700 mb-12">
                Vamos aprender sobre vacinas de forma calma e segura
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <motion.button
                  onClick={() => setCurrentScreen('timeline')}
                  className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl active:scale-95 transition-all border-4 border-blue-200"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-7xl mb-4">📋</div>
                  <h2 className="text-2xl font-bold text-blue-700 mb-3">
                    Ver os passos
                  </h2>
                  <p className="text-lg text-gray-700">
                    Conheça cada etapa da vacinação
                  </p>
                </motion.button>

                <motion.button
                  onClick={() => setCurrentScreen('regulation')}
                  className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl active:scale-95 transition-all border-4 border-purple-200"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-7xl mb-4">🧘</div>
                  <h2 className="text-2xl font-bold text-purple-700 mb-3">
                    Me acalmar
                  </h2>
                  <p className="text-lg text-gray-700">
                    Exercícios para relaxar
                  </p>
                </motion.button>

                <motion.button
                  onClick={() => setCurrentScreen('minigame')}
                  className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl active:scale-95 transition-all border-4 border-green-200"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-7xl mb-4">🎮</div>
                  <h2 className="text-2xl font-bold text-green-700 mb-3">
                    Praticar
                  </h2>
                  <p className="text-lg text-gray-700">
                    Minijogo divertido
                  </p>
                </motion.button>

                <motion.button
                  onClick={() => setShowEducationModal(true)}
                  className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl active:scale-95 transition-all border-4 border-pink-200"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-7xl mb-4">📚</div>
                  <h2 className="text-2xl font-bold text-pink-700 mb-3">
                    Aprender
                  </h2>
                  <p className="text-lg text-gray-700">
                    Entender melhor
                  </p>
                </motion.button>
              </div>
            </motion.div>
          )}

          {currentScreen === 'timeline' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <VaccinationTimeline />
              <div className="text-center mt-8">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white text-xl font-bold rounded-full shadow-lg active:scale-95 transition-all"
                >
                  Voltar
                </button>
              </div>
            </motion.div>
          )}

          {currentScreen === 'regulation' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <RegulationExercises />
              <div className="text-center mt-8">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white text-xl font-bold rounded-full shadow-lg active:scale-95 transition-all"
                >
                  Voltar
                </button>
              </div>
            </motion.div>
          )}

          {currentScreen === 'minigame' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <VaccinationMinigame />
              <div className="text-center mt-8">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white text-xl font-bold rounded-full shadow-lg active:scale-95 transition-all"
                >
                  Voltar
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <EducationModal isOpen={showEducationModal} onClose={() => setShowEducationModal(false)} />
    </div>
  );
}
