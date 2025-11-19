import { useState } from 'react';
import { ARView } from './ARView';
import { ToothBrushingView } from './ToothBrushingView';
import { VacinacaoAmigaView } from './VacinacaoAmiga/VacinacaoAmigaView';
import { ARReaderView } from './ARReader/ARReaderView';
import { AtravessarRuaView } from './AtravessarRua/AtravessarRuaView';

type Activity = 'menu' | 'backpack' | 'toothbrushing' | 'vacinacao' | 'arreader' | 'street';

export function MainMenu() {
  const [currentActivity, setCurrentActivity] = useState<Activity>('menu');

  if (currentActivity === 'backpack') {
    return <ARView onBack={() => setCurrentActivity('menu')} />;
  }

  if (currentActivity === 'toothbrushing') {
    return <ToothBrushingView onBack={() => setCurrentActivity('menu')} />;
  }

  if (currentActivity === 'vacinacao') {
    return <VacinacaoAmigaView onBack={() => setCurrentActivity('menu')} />;
  }

  if (currentActivity === 'arreader') {
    return (
      <ARReaderView
        onBack={() => setCurrentActivity('menu')}
        onNavigate={(screen) => setCurrentActivity(screen)}
      />
    );
  }

  if (currentActivity === 'street') {
    return <AtravessarRuaView onBack={() => setCurrentActivity('menu')} />;
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 overflow-y-auto">
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 py-8">
        <div className="text-center max-w-2xl space-y-6 sm:space-y-8 w-full">
          <h1 className="text-3xl sm:text-5xl font-bold text-blue-600 mb-3 sm:mb-4">
            Neuroplay
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8 sm:mb-12 px-4">
            Escolha uma atividade para começar
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
            <button
              onClick={() => setCurrentActivity('arreader')}
              className="group relative bg-gradient-to-br from-pink-500 to-purple-600 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl active:scale-95 transition-all md:col-span-2"
            >
              <div className="text-5xl sm:text-7xl mb-3 sm:mb-4">📸</div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                LER CARDS
              </h2>
              <p className="text-white/90 text-base sm:text-lg">
                Aponte a câmera para um card e descubra uma atividade
              </p>
              <div className="absolute inset-0 rounded-3xl border-4 border-white opacity-0 group-hover:opacity-50 transition-opacity"></div>
            </button>

            <div className="md:col-span-2 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2 sm:my-4"></div>
            <button
              onClick={() => setCurrentActivity('backpack')}
              className="group relative bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl active:scale-95 transition-all"
            >
              <div className="text-5xl sm:text-7xl mb-3 sm:mb-4">🎒</div>
              <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-2">
                Mochila Interativa
              </h2>
              <p className="text-gray-600 text-sm sm:text-lg">
                Organize os materiais escolares na mochila
              </p>
              <div className="absolute inset-0 rounded-3xl border-4 border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <button
              onClick={() => setCurrentActivity('toothbrushing')}
              className="group relative bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl active:scale-95 transition-all"
            >
              <div className="text-5xl sm:text-7xl mb-3 sm:mb-4">🦷</div>
              <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-2">
                Escovação de Dentes
              </h2>
              <p className="text-gray-600 text-sm sm:text-lg">
                Aprenda a escovar os dentes de forma divertida
              </p>
              <div className="absolute inset-0 rounded-3xl border-4 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <button
              onClick={() => setCurrentActivity('vacinacao')}
              className="group relative bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl active:scale-95 transition-all"
            >
              <div className="text-5xl sm:text-7xl mb-3 sm:mb-4">💉</div>
              <h2 className="text-xl sm:text-2xl font-bold text-purple-600 mb-2">
                Vacinação Amiga
              </h2>
              <p className="text-gray-600 text-sm sm:text-lg">
                Prepare-se para a vacina de forma calma e segura
              </p>
              <div className="absolute inset-0 rounded-3xl border-4 border-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <button
              onClick={() => setCurrentActivity('street')}
              className="group relative bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl active:scale-95 transition-all"
            >
              <div className="text-5xl sm:text-7xl mb-3 sm:mb-4">🚦</div>
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-600 mb-2">
                Atravessar a Rua
              </h2>
              <p className="text-gray-600 text-sm sm:text-lg">
                Aprenda a atravessar a rua com segurança
              </p>
              <div className="absolute inset-0 rounded-3xl border-4 border-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>

          <p className="text-sm sm:text-base text-gray-600 mt-3 sm:mt-4 px-4">
            💡 Use <strong>LER CARDS</strong> para acessar as atividades de forma mágica!
          </p>

          <div className="mt-8 sm:mt-12 text-center pb-4">
            <p className="text-xs sm:text-sm text-gray-500">
              Aplicativo educativo para crianças
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
