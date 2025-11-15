import { XR, createXRStore } from '@react-three/xr';
import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import { ARContent } from './ARContent';

interface ARScene3DProps {
  onBack: () => void;
}

export function ARScene3D({ onBack }: ARScene3DProps) {
  const [store] = useState(() => createXRStore());
  const [isARAvailable, setIsARAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      (navigator as any).xr
        ?.isSessionSupported('immersive-ar')
        .then((supported: boolean) => {
          setIsARAvailable(supported);
          if (!supported) {
            setError('AR não é suportado neste dispositivo');
          }
        })
        .catch(() => {
          setIsARAvailable(false);
          setError('Erro ao verificar suporte AR');
        });
    } else {
      setIsARAvailable(false);
      setError('WebXR não está disponível neste navegador');
    }
  }, []);

  const handleEnterAR = async () => {
    try {
      await store.enterAR();
    } catch (err) {
      setError('Não foi possível iniciar AR. Tente novamente.');
      console.error('AR Error:', err);
    }
  };

  if (isARAvailable === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Verificando suporte AR...</p>
        </div>
      </div>
    );
  }

  if (isARAvailable === false) {
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-yellow-50 p-8 overflow-y-auto">
        <div className="text-center max-w-md space-y-6 py-8">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold text-gray-800">AR não disponível</h2>
          <p className="text-lg text-gray-600">{error}</p>

          {isIOS ? (
            <div className="bg-blue-50 p-6 rounded-2xl text-left space-y-4">
              <h3 className="text-lg font-bold text-blue-800 text-center">
                🍎 Instruções para iPhone/iPad
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p className="font-semibold">Para ativar AR no Safari:</p>
                <ol className="list-decimal list-inside space-y-2 pl-2">
                  <li>Abra <strong>Ajustes</strong> (Settings)</li>
                  <li>Role até <strong>Safari</strong></li>
                  <li>Role até <strong>Avançado</strong> (Advanced)</li>
                  <li>Toque em <strong>Experimental Features</strong></li>
                  <li>Ative <strong>WebXR Device API</strong></li>
                  <li>Ative <strong>WebXR Augmented Reality Module</strong></li>
                  <li>Reinicie o Safari e volte aqui</li>
                </ol>
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-xs text-yellow-800">
                    <strong>Nota:</strong> Requer iOS 15.4 ou superior e iPhone/iPad com chip A12 ou mais recente
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 p-6 rounded-2xl text-left space-y-4">
              <h3 className="text-lg font-bold text-green-800 text-center">
                🤖 Para Android
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p>Use o navegador <strong>Chrome</strong> em um dispositivo compatível com ARCore.</p>
                <p className="text-xs text-gray-600">
                  A maioria dos celulares Android modernos (2018+) suportam ARCore.
                </p>
              </div>
            </div>
          )}

          <button
            onClick={onBack}
            className="w-full px-8 py-4 bg-blue-500 text-white text-lg font-semibold rounded-2xl shadow-lg hover:bg-blue-600 active:scale-95 transition-all"
          >
            Voltar ao Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <XR store={store}>
        <Canvas>
          <Suspense fallback={null}>
            <ARContent />
          </Suspense>
        </Canvas>
      </XR>

      {!store.isPresenting && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-yellow-50 p-8">
          <div className="text-center max-w-md space-y-6">
            <button
              onClick={onBack}
              className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-50 active:scale-95 transition-all"
            >
              <span className="text-2xl">←</span>
            </button>

            <div className="text-6xl mb-4">🎒</div>
            <h1 className="text-3xl font-bold text-blue-600 mb-4">
              Modo AR
            </h1>
            <p className="text-lg text-gray-700 mb-4">
              Aponte a câmera para uma superfície plana (como uma mesa ou chão)
            </p>
            <p className="text-base text-gray-600 mb-8">
              A mochila aparecerá no mundo real e você poderá interagir com os objetos ao redor dela
            </p>

            <button
              onClick={handleEnterAR}
              className="w-full px-8 py-4 bg-blue-500 text-white text-xl font-semibold rounded-2xl shadow-lg hover:bg-blue-600 active:scale-95 transition-all"
            >
              Iniciar AR
            </button>

            {error && (
              <p className="text-sm text-red-600 mt-4">{error}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
