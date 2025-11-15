import { useState } from 'react';
import { ARReader } from './ARReader';
import { motion } from 'framer-motion';

interface ARReaderViewProps {
  onBack: () => void;
  onNavigate: (screen: 'vacinacao' | 'backpack' | 'toothbrushing') => void;
}

export function ARReaderView({ onBack, onNavigate }: ARReaderViewProps) {
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const handleDetect = (target: 'bandaid' | 'school' | 'tooth') => {
    switch (target) {
      case 'bandaid':
        onNavigate('vacinacao');
        break;
      case 'school':
        onNavigate('backpack');
        break;
      case 'tooth':
        onNavigate('toothbrushing');
        break;
    }
  };

  const handleStart = () => {
    setHasStarted(true);
  };

  if (error) {
    return (
      <div className="relative w-full h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="text-8xl mb-6">⚠️</div>
          <h2 className="text-3xl font-bold text-red-700 mb-4">
            Erro ao acessar câmera
          </h2>
          <p className="text-lg text-red-600 mb-8">{error}</p>
          <button
            onClick={onBack}
            className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white text-xl font-bold rounded-full shadow-lg active:scale-95 transition-all"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="relative w-full h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl text-center"
        >
          <motion.div
            className="text-9xl mb-8"
            animate={{
              rotate: [0, -10, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            📸
          </motion.div>

          <h1 className="text-5xl font-bold text-purple-700 mb-6">
            Ler Cards
          </h1>

          <p className="text-2xl text-gray-700 mb-12">
            Aponte a câmera para um card especial e descubra uma atividade!
          </p>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Cards disponíveis:
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-purple-100 rounded-2xl">
                <div className="text-5xl">💉</div>
                <div className="text-left">
                  <h3 className="font-bold text-purple-800 text-xl">Curativo</h3>
                  <p className="text-purple-700">Vacinação Amiga</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-100 rounded-2xl">
                <div className="text-5xl">🎒</div>
                <div className="text-left">
                  <h3 className="font-bold text-blue-800 text-xl">Material Escolar</h3>
                  <p className="text-blue-700">Mochila Interativa</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-green-100 rounded-2xl">
                <div className="text-5xl">🦷</div>
                <div className="text-left">
                  <h3 className="font-bold text-green-800 text-xl">Dente</h3>
                  <p className="text-green-700">Escovação de Dentes</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={onBack}
              className="px-8 py-4 bg-gray-300 hover:bg-gray-400 text-gray-800 text-xl font-bold rounded-full shadow-lg active:scale-95 transition-all"
            >
              Voltar
            </button>

            <button
              onClick={handleStart}
              className="px-12 py-4 bg-purple-500 hover:bg-purple-600 text-white text-xl font-bold rounded-full shadow-lg active:scale-95 transition-all"
            >
              Iniciar Câmera
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            A câmera será ativada para detectar os cards
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-50 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg hover:bg-white active:scale-95 transition-all"
      >
        <span className="text-2xl">✕</span>
      </button>

      <ARReader onDetect={handleDetect} onError={setError} />
    </div>
  );
}
