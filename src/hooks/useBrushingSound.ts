import { useRef, useCallback, useEffect } from 'react';

interface BrushingSoundOptions {
  enabled?: boolean;
  volume?: number;
}

export function useBrushingSound(options: BrushingSoundOptions = {}) {
  const { enabled = true, volume = 0.3 } = options;
  const brushingSoundRef = useRef<HTMLAudioElement | null>(null);
  const encouragementTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastEncouragementRef = useRef(0);
  const isBrushingRef = useRef(false);

  const encouragementSounds = [
    'Isso aí!',
    'Muito bem!',
    'Continue assim!',
    'Oba!',
    'Maravilha!'
  ];

  const playBrushingSound = useCallback(() => {
    if (!enabled || typeof window === 'undefined') return;

    if (!brushingSoundRef.current) {
      const brushAudio = new Audio();
      brushAudio.loop = true;
      brushAudio.volume = volume;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(150, audioContext.currentTime);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.3, audioContext.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();

      const pulseInterval = setInterval(() => {
        if (isBrushingRef.current) {
          gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(volume * 0.1, audioContext.currentTime + 0.1);
        }
      }, 200);

      brushingSoundRef.current = brushAudio;
      (brushAudio as any)._oscillator = oscillator;
      (brushAudio as any)._audioContext = audioContext;
      (brushAudio as any)._pulseInterval = pulseInterval;
      (brushAudio as any)._gainNode = gainNode;
    }

    isBrushingRef.current = true;
  }, [enabled, volume]);

  const stopBrushingSound = useCallback(() => {
    isBrushingRef.current = false;

    if (brushingSoundRef.current) {
      const audio = brushingSoundRef.current;
      const gainNode = (audio as any)._gainNode;
      const audioContext = (audio as any)._audioContext;

      if (gainNode && audioContext) {
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);
      }
    }

    if (encouragementTimerRef.current) {
      clearInterval(encouragementTimerRef.current);
      encouragementTimerRef.current = null;
    }
  }, []);

  const playBubbleSound = useCallback(() => {
    if (!enabled || typeof window === 'undefined') return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(volume * 0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  }, [enabled, volume]);

  const playSparkleSound = useCallback(() => {
    if (!enabled || typeof window === 'undefined') return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(1500, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(2500, audioContext.currentTime + 0.15);

    gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.25);
  }, [enabled, volume]);

  const playEncouragementSound = useCallback(() => {
    if (!enabled || typeof window === 'undefined') return;

    const now = Date.now();
    if (now - lastEncouragementRef.current < 5000) return;

    lastEncouragementRef.current = now;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator1.type = 'sine';
    oscillator2.type = 'sine';
    oscillator1.frequency.setValueAtTime(523, audioContext.currentTime);
    oscillator2.frequency.setValueAtTime(659, audioContext.currentTime);

    gainNode.gain.setValueAtTime(volume * 0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator1.start();
    oscillator2.start();
    oscillator1.stop(audioContext.currentTime + 0.3);
    oscillator2.stop(audioContext.currentTime + 0.3);

    const message = encouragementSounds[Math.floor(Math.random() * encouragementSounds.length)];
    console.log('🎉', message);
  }, [enabled, volume]);

  const playCelebrationSound = useCallback(() => {
    if (!enabled || typeof window === 'undefined') return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [523, 587, 659, 784, 880];

    notes.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

      const startTime = audioContext.currentTime + index * 0.1;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.6, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.4);
    });
  }, [enabled, volume]);

  useEffect(() => {
    return () => {
      if (brushingSoundRef.current) {
        const audio = brushingSoundRef.current;
        const oscillator = (audio as any)._oscillator;
        const audioContext = (audio as any)._audioContext;
        const pulseInterval = (audio as any)._pulseInterval;

        if (pulseInterval) clearInterval(pulseInterval);
        if (oscillator) oscillator.stop();
        if (audioContext) audioContext.close();

        brushingSoundRef.current = null;
      }

      if (encouragementTimerRef.current) {
        clearInterval(encouragementTimerRef.current);
      }
    };
  }, []);

  return {
    playBrushingSound,
    stopBrushingSound,
    playBubbleSound,
    playSparkleSound,
    playEncouragementSound,
    playCelebrationSound,
  };
}
