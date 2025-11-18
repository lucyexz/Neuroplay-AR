import { useState } from 'react';
import { ARReader } from './ARReader';
import { motion } from 'framer-motion';

interface ARReaderViewProps {
  onBack: () => void;
  onNavigate: (screen: 'vacinacao' | 'backpack' | 'toothbrushing' | 'street') => void;
}

export function ARReaderView({ onBack, onNavigate }: ARReaderViewProps) {
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const handleDetect = (target: 'bandaid' | 'school' | 'tooth' | 'street') => {
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
      case 'street':
        onNavigate('street');
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

          <p className="text-2xl text-gray-700 mb-6">
            Aponte a câmera para um card especial e descubra uma atividade!
          </p>

          <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center justify-center gap-2">
              <span className="text-2xl">💡</span>
              Como usar
            </h3>
            <div className="space-y-3 text-left max-w-xl mx-auto">
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-1">📱</span>
                <p className="text-gray-700">
                  <strong>1.</strong> Ao iniciar a câmera, você verá um <strong>quadrado piscante</strong> no centro da tela
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-1">🎯</span>
                <p className="text-gray-700">
                  <strong>2.</strong> <strong>Alinhe o card dentro do quadrado</strong> a cerca de 20-30cm de distância
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-1">⏱️</span>
                <p className="text-gray-700">
                  <strong>3.</strong> Mantenha o card <strong>firme por 2 segundos</strong> até a detecção confirmar
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-1">💡</span>
                <p className="text-gray-700">
                  <strong>Dica:</strong> Use em local com <strong>boa iluminação</strong> (nem muito claro, nem escuro)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Cards disponíveis:
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                <div className="text-5xl">💉</div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-red-800 text-xl">Curativo</h3>
                  <p className="text-red-700">Vacinação Amiga</p>
                </div>
                <div className="flex gap-1">
                  <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow" title="Vermelho"></div>
                  <div className="w-6 h-6 bg-pink-400 rounded-full border-2 border-white shadow" title="Rosa"></div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-50 border-2 border-blue-300 rounded-2xl">
                <div className="text-5xl">🎒</div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-blue-800 text-xl">Material Escolar</h3>
                  <p className="text-blue-700">Mochila Interativa</p>
                </div>
                <div className="flex gap-1">
                  <div className="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow" title="Azul"></div>
                  <div className="w-6 h-6 bg-white rounded-full border-2 border-gray-300 shadow" title="Branco"></div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 border-2 border-gray-300 rounded-2xl">
                <div className="text-5xl">🦷</div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-gray-800 text-xl">Dente</h3>
                  <p className="text-gray-700">Escovação de Dentes</p>
                </div>
                <div className="flex gap-1">
                  <div className="w-6 h-6 bg-white rounded-full border-2 border-gray-400 shadow" title="Branco puro"></div>
                  <div className="w-6 h-6 bg-gray-100 rounded-full border-2 border-gray-300 shadow" title="Branco gelo"></div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-green-50 border-2 border-green-300 rounded-2xl">
                <div className="text-5xl">🚦</div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-green-800 text-xl">Rua/Semáforo</h3>
                  <p className="text-green-700">Atravessar com Segurança</p>
                </div>
                <div className="flex gap-1">
                  <div className="w-6 h-6 bg-green-600 rounded-full border-2 border-white shadow" title="Verde"></div>
                  <div className="w-6 h-6 bg-gray-500 rounded-full border-2 border-white shadow" title="Cinza"></div>
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

          <div className="bg-yellow-50/80 backdrop-blur-sm rounded-2xl p-4 mt-6 border-2 border-yellow-200">
            <p className="text-sm text-yellow-800 font-semibold">
              ⚠️ <strong>Importante:</strong> Os círculos coloridos ao lado de cada card mostram as <strong>cores principais</strong> que devem estar presentes no card físico para uma detecção bem-sucedida!
            </p>
          </div>
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
