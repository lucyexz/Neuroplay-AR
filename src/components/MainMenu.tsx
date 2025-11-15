import { useState } from 'react';
import { ARView } from './ARView';
import { ToothBrushingView } from './ToothBrushingView';

type Activity = 'menu' | 'backpack' | 'toothbrushing';

export function MainMenu() {
  const [currentActivity, setCurrentActivity] = useState<Activity>('menu');

  if (currentActivity === 'backpack') {
    return <ARView onBack={() => setCurrentActivity('menu')} />;
  }

  if (currentActivity === 'toothbrushing') {
    return <ToothBrushingView onBack={() => setCurrentActivity('menu')} />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-2xl space-y-8">
          <h1 className="text-5xl font-bold text-blue-600 mb-4">
            Atividades Interativas
          </h1>
          <p className="text-xl text-gray-700 mb-12">
            Escolha uma atividade para começar
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setCurrentActivity('backpack')}
              className="group relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl active:scale-95 transition-all"
            >
              <div className="text-7xl mb-4">🎒</div>
              <h2 className="text-2xl font-bold text-blue-600 mb-2">
                Mochila Interativa
              </h2>
              <p className="text-gray-600 text-lg">
                Organize os materiais escolares na mochila
              </p>
              <div className="absolute inset-0 rounded-3xl border-4 border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <button
              onClick={() => setCurrentActivity('toothbrushing')}
              className="group relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl active:scale-95 transition-all"
            >
              <div className="text-7xl mb-4">🦷</div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                Escovação de Dentes
              </h2>
              <p className="text-gray-600 text-lg">
                Aprenda a escovar os dentes de forma divertida
              </p>
              <div className="absolute inset-0 rounded-3xl border-4 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              Aplicativo educativo para crianças
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
