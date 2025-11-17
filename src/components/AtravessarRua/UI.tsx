import { useGameStore } from '../../store/gameStore';
import { Circle, Play, RotateCcw } from 'lucide-react';

export function UI() {
  const trafficLight = useGameStore((state) => state.trafficLight);
  const showMessage = useGameStore((state) => state.showMessage);
  const message = useGameStore((state) => state.message);
  const gamePhase = useGameStore((state) => state.gamePhase);
  const attemptCrossing = useGameStore((state) => state.attemptCrossing);
  const resetGame = useGameStore((state) => state.resetGame);

  const getLightMessage = () => {
    if (trafficLight === 'red') {
      return '🔴 Sinal vermelho - Espere!';
    } else {
      return '🟢 Sinal verde - Pode atravessar!';
    }
  };

  const getVoiceGuidance = () => {
    if (trafficLight === 'red') {
      return 'Vermelho: Espere com segurança';
    } else {
      return 'Verde: Agora você pode ir';
    }
  };

  return (
    <>
      {/* Cabeçalho */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-blue-400 to-transparent p-6 pointer-events-none">
        <h1 className="text-white text-3xl font-bold text-center drop-shadow-lg">
          Aprenda a Atravessar com Segurança
        </h1>
      </div>

      {/* Status do semáforo */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <div className={`px-6 py-3 rounded-full shadow-lg font-bold text-lg flex items-center gap-2 transition-all duration-300 ${
          trafficLight === 'red'
            ? 'bg-red-500 text-white'
            : 'bg-green-500 text-white'
        }`}>
          <Circle className={`w-5 h-5 ${trafficLight === 'red' ? 'fill-white' : 'fill-white'}`} />
          {getLightMessage()}
        </div>
        <div className="text-center mt-2 text-white text-sm font-medium drop-shadow-md">
          {getVoiceGuidance()}
        </div>
      </div>

      {/* Mensagem de feedback */}
      {showMessage && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl animate-bounce">
            <p className="text-2xl font-bold text-center">{message}</p>
          </div>
        </div>
      )}

      {/* Botões de controle */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-blue-400 to-transparent">
        <div className="max-w-md mx-auto flex gap-4">
          <button
            onClick={attemptCrossing}
            disabled={gamePhase === 'crossing' || gamePhase === 'success'}
            className={`flex-1 py-4 px-6 rounded-2xl font-bold text-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              gamePhase === 'crossing' || gamePhase === 'success'
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 active:scale-95'
            }`}
          >
            <Play className="w-6 h-6" />
            Atravessar
          </button>

          <button
            onClick={resetGame}
            className="py-4 px-6 rounded-2xl font-bold text-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg hover:from-orange-500 hover:to-orange-600 active:scale-95 transition-all duration-200"
            aria-label="Reiniciar"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        {/* Dicas */}
        <div className="mt-4 text-center text-white text-sm font-medium drop-shadow-md">
          <p>💡 Dica: Use os dedos para girar, dar zoom e mover a câmera</p>
        </div>
      </div>

      {/* Indicador de toque */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
        <div className="text-6xl animate-pulse">👆</div>
      </div>
    </>
  );
}
