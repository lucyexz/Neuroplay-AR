import { useState } from 'react';
import { ToothBrushingScene } from './ToothBrushingScene';

interface ToothBrushingViewProps {
  onBack: () => void;
}

export function ToothBrushingView({ onBack }: ToothBrushingViewProps) {
  const [completed, setCompleted] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  const handleComplete = () => {
    setCompleted(true);
  };

  const handleReset = () => {
    setCompleted(false);
    setResetTrigger((prev) => prev + 1);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:bg-white active:scale-95 transition-all"
      >
        <span className="text-2xl">←</span>
      </button>

      <ToothBrushingScene onComplete={handleComplete} resetTrigger={resetTrigger} />

      {completed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-20 pointer-events-none">
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-sm pointer-events-auto">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-4xl font-bold text-green-600 mb-4">
              Parabéns!
            </h2>
            <p className="text-xl text-gray-700 mb-6">
              Seus dentes estão limpos e brilhantes!
            </p>
            <div className="space-y-3">
              <button
                onClick={handleReset}
                className="w-full px-8 py-4 bg-blue-500 text-white text-lg font-semibold rounded-2xl shadow-lg hover:bg-blue-600 active:scale-95 transition-all"
              >
                Escovar Novamente
              </button>
              <button
                onClick={onBack}
                className="w-full px-8 py-4 bg-gray-500 text-white text-lg font-semibold rounded-2xl shadow-lg hover:bg-gray-600 active:scale-95 transition-all"
              >
                Voltar ao Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
