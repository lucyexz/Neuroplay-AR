import { useState } from 'react';
import { Scene3D } from './Scene3D';
import { ARScene3D } from './ARScene3D';
import { CameraARScene } from './CameraARScene';
import { MarkerARScene } from './MarkerARScene';

interface ARViewProps {
  onBack: () => void;
}

export function ARView({ onBack }: ARViewProps) {
  const [mode, setMode] = useState<'menu' | 'webxr' | 'camera' | 'marker' | '3d'>('menu');

  if (mode === 'menu') {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-yellow-50">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <button
            onClick={onBack}
            className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-50 active:scale-95 transition-all"
          >
            <span className="text-2xl">←</span>
          </button>

          <div className="text-center max-w-md space-y-6">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
              Organize a Mochila
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Toque nos objetos para colocá-los na mochila
            </p>

            <div className="space-y-4">
              <button
                onClick={() => setMode('camera')}
                className="w-full px-8 py-4 bg-blue-500 text-white text-xl font-semibold rounded-2xl shadow-lg hover:bg-blue-600 active:scale-95 transition-all"
              >
                AR com Câmera 📸
              </button>
              <button
                onClick={() => setMode('marker')}
                className="w-full px-8 py-4 bg-teal-500 text-white text-xl font-semibold rounded-2xl shadow-lg hover:bg-teal-600 active:scale-95 transition-all"
              >
                AR com Marcador 🎯
              </button>
              <button
                onClick={() => setMode('webxr')}
                className="w-full px-8 py-4 bg-indigo-500 text-white text-xl font-semibold rounded-2xl shadow-lg hover:bg-indigo-600 active:scale-95 transition-all"
              >
                AR WebXR (Avançado)
              </button>
              <button
                onClick={() => setMode('3d')}
                className="w-full px-8 py-4 bg-green-500 text-white text-xl font-semibold rounded-2xl shadow-lg hover:bg-green-600 active:scale-95 transition-all"
              >
                Modo 3D
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'webxr') {
    return <ARScene3D onBack={() => setMode('menu')} />;
  }

  if (mode === 'camera') {
    return <CameraARScene onBack={() => setMode('menu')} />;
  }

  if (mode === 'marker') {
    return <MarkerARScene onBack={() => setMode('menu')} />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <ARScene hasCamera={false} onBack={() => setMode('menu')} />
    </div>
  );
}

interface ARSceneProps {
  hasCamera: boolean;
  onBack: () => void;
}

function ARScene({ hasCamera, onBack }: ARSceneProps) {
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
    <>
      <div className={`absolute inset-0 ${hasCamera ? 'mix-blend-normal' : ''}`}>
        <Scene3D onComplete={handleComplete} resetTrigger={resetTrigger} />
      </div>

      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={onBack}
          className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:bg-white active:scale-95 transition-all"
        >
          <span className="text-2xl">←</span>
        </button>
      </div>

      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
          <p className="text-lg font-semibold text-gray-800">
            Toque nos objetos para guardar na mochila
          </p>
        </div>
      </div>

      {completed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-20 pointer-events-none">
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-sm pointer-events-auto">
            <h2 className="text-4xl font-bold text-green-600 mb-4">
              Parabéns!
            </h2>
            <p className="text-xl text-gray-700 mb-6">
              Você guardou todos os materiais!
            </p>
            <button
              onClick={handleReset}
              className="px-8 py-4 bg-blue-500 text-white text-lg font-semibold rounded-2xl shadow-lg hover:bg-blue-600 active:scale-95 transition-all"
            >
              Começar Novamente
            </button>
          </div>
        </div>
      )}
    </>
  );
}
