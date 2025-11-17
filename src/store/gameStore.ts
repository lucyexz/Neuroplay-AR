import { create } from 'zustand';

interface GameState {
  trafficLight: 'red' | 'green';
  characterPosition: number;
  gamePhase: 'waiting' | 'crossing' | 'success';
  showMessage: boolean;
  message: string;
  stars: boolean;
  setTrafficLight: (light: 'red' | 'green') => void;
  setCharacterPosition: (position: number) => void;
  setGamePhase: (phase: 'waiting' | 'crossing' | 'success') => void;
  setMessage: (message: string, show: boolean) => void;
  setStars: (visible: boolean) => void;
  attemptCrossing: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  trafficLight: 'red',
  characterPosition: 0,
  gamePhase: 'waiting',
  showMessage: false,
  message: '',
  stars: false,

  setTrafficLight: (light) => set({ trafficLight: light }),

  setCharacterPosition: (position) => set({ characterPosition: position }),

  setGamePhase: (phase) => set({ gamePhase: phase }),

  setMessage: (message, show) => {
    set({ message, showMessage: show });
    if (show) {
      setTimeout(() => {
        set({ showMessage: false });
      }, 2000);
    }
  },

  setStars: (visible) => set({ stars: visible }),

  attemptCrossing: () => {
    const state = get();
    if (state.gamePhase !== 'waiting') return;

    if (state.trafficLight === 'red') {
      set({
        message: '⚠️ Espere! O sinal está vermelho!',
        showMessage: true
      });
      setTimeout(() => set({ showMessage: false }), 2000);
    } else {
      set({ gamePhase: 'crossing' });
    }
  },

  resetGame: () => {
    set({
      characterPosition: 0,
      gamePhase: 'waiting',
      showMessage: false,
      message: '',
      stars: false,
    });
  },
}));
