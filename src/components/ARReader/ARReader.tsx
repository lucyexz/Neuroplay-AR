import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ARReaderProps {
  onDetect: (target: 'bandaid' | 'school' | 'tooth' | 'street') => void;
  onError?: (error: string) => void;
}

export function ARReader({ onDetect, onError }: ARReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const [detectedTarget, setDetectedTarget] = useState<string | null>(null);
  const mindARRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isNavigatingRef = useRef(false);
  const detectionCountRef = useRef<{ [key: string]: number }>({
    tooth: 0,
    school: 0,
    bandaid: 0,
    street: 0
  });
  const lastDetectionRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initAR = async () => {
      try {
        if (!videoRef.current || !containerRef.current) return;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', '');
          videoRef.current.setAttribute('muted', '');
          videoRef.current.play().catch(console.error);

          videoRef.current.onloadedmetadata = () => {
            if (mounted) {
              setCameraReady(true);
              setIsLoading(false);
              startDetection();
            }
          };
        }
      } catch (err) {
        console.error('Camera error:', err);
        if (mounted) {
          setIsLoading(false);
          onError?.('Não foi possível acessar a câmera. Verifique as permissões.');
        }
      }
    };

    const startDetection = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const detect = () => {
        if (!mounted || !video || !canvas || !ctx) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const brightness = calculateBrightness(imageData);
        const hasHighContrast = checkHighContrast(imageData);

        if (brightness > 50 && brightness < 200 && hasHighContrast) {
          const detectedShape = detectShape(imageData);

          if (detectedShape) {
            if (lastDetectionRef.current === detectedShape) {
              detectionCountRef.current[detectedShape]++;
            } else {
              lastDetectionRef.current = detectedShape;
              detectionCountRef.current = {
                tooth: 0,
                school: 0,
                bandaid: 0,
                street: 0
              };
              detectionCountRef.current[detectedShape] = 1;
            }

            if (detectionCountRef.current[detectedShape] >= 3 && !isNavigatingRef.current) {
              isNavigatingRef.current = true;
              setDetectedTarget(detectedShape);

              if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
              }

              setTimeout(() => {
                if (mounted) {
                  onDetect(detectedShape as 'bandaid' | 'school' | 'tooth' | 'street');
                }
              }, 1500);
              return;
            }
          } else {
            lastDetectionRef.current = null;
            detectionCountRef.current = {
              tooth: 0,
              school: 0,
              bandaid: 0,
              street: 0
            };
          }
        }

        if (mounted && !isNavigatingRef.current) {
          animationFrameRef.current = requestAnimationFrame(detect);
        }
      };

      animationFrameRef.current = requestAnimationFrame(detect);
    };

    const calculateBrightness = (imageData: ImageData): number => {
      let sum = 0;
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
      }

      return sum / (data.length / 4);
    };

    const checkHighContrast = (imageData: ImageData): boolean => {
      const data = imageData.data;
      let darkPixels = 0;
      let lightPixels = 0;

      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (avg < 100) darkPixels++;
        if (avg > 155) lightPixels++;
      }

      const total = data.length / 4;
      return (darkPixels / total > 0.2 && lightPixels / total > 0.2);
    };

    const detectShape = (imageData: ImageData): string | null => {
      const data = imageData.data;
      let redPixels = 0;
      let bluePixels = 0;
      let whitePixels = 0;
      let brightWhitePixels = 0;
      let pinkPixels = 0;
      let greenPixels = 0;
      let grayPixels = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (r > 200 && g < 150 && b < 150) redPixels++;
        if (r > 180 && g > 100 && g < 180 && b > 100 && b < 180) pinkPixels++;
        if (b > 180 && r < 180 && g < 180 && b > r + 30) bluePixels++;
        if (r > 200 && g > 200 && b > 200) whitePixels++;
        if (r > 230 && g > 230 && b > 230) brightWhitePixels++;
        if (g > 150 && g > r + 30 && g > b + 20 && r < 180 && b < 180) greenPixels++;
        if (r > 100 && r < 180 && g > 100 && g < 180 && b > 100 && b < 180 && Math.abs(r - g) < 30 && Math.abs(g - b) < 30) grayPixels++;
      }

      const total = data.length / 4;
      const redRatio = redPixels / total;
      const pinkRatio = pinkPixels / total;
      const blueRatio = bluePixels / total;
      const whiteRatio = whitePixels / total;
      const brightWhiteRatio = brightWhitePixels / total;
      const greenRatio = greenPixels / total;
      const grayRatio = grayPixels / total;

      const scores = {
        tooth: 0,
        school: 0,
        bandaid: 0,
        street: 0
      };

      if (brightWhiteRatio > 0.35 && blueRatio < 0.1 && redRatio < 0.08 && greenRatio < 0.1) {
        scores.tooth += 3;
      }
      if (whiteRatio > 0.5 && blueRatio < 0.08 && redRatio < 0.08 && greenRatio < 0.1) {
        scores.tooth += 2;
      }

      if (blueRatio > 0.12) {
        scores.school += 3;
      }
      if (blueRatio > 0.08 && whiteRatio > 0.2 && whiteRatio < 0.45) {
        scores.school += 2;
      }

      if (redRatio > 0.12 || pinkRatio > 0.15) {
        scores.bandaid += 3;
      }
      if ((redRatio > 0.08 || pinkRatio > 0.1) && whiteRatio > 0.2 && whiteRatio < 0.4) {
        scores.bandaid += 2;
      }

      if (greenRatio > 0.15 && grayRatio > 0.1) {
        scores.street += 3;
      }
      if (greenRatio > 0.1 && grayRatio > 0.15) {
        scores.street += 2;
      }
      if (grayRatio > 0.25 && whiteRatio > 0.1 && whiteRatio < 0.3) {
        scores.street += 2;
      }

      const maxScore = Math.max(scores.tooth, scores.school, scores.bandaid, scores.street);

      if (maxScore < 2) {
        return null;
      }

      if (scores.tooth === maxScore && scores.tooth >= 3) {
        return 'tooth';
      }
      if (scores.school === maxScore && scores.school >= 3) {
        return 'school';
      }
      if (scores.bandaid === maxScore && scores.bandaid >= 3) {
        return 'bandaid';
      }
      if (scores.street === maxScore && scores.street >= 3) {
        return 'street';
      }

      return null;
    };

    initAR();

    return () => {
      mounted = false;
      isNavigatingRef.current = false;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }

      if (mindARRef.current) {
        try {
          mindARRef.current.stop?.();
        } catch (e) {
          console.error('Error stopping MindAR:', e);
        }
      }
    };
  }, [onDetect, onError]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        playsInline
        muted
      />

      <canvas
        ref={canvasRef}
        className="hidden"
      />

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80"
          >
            <div className="text-center">
              <motion.div
                className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p className="text-white text-xl font-semibold">
                Iniciando câmera...
              </p>
            </div>
          </motion.div>
        )}

        {cameraReady && !detectedTarget && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto">
              <motion.div
                className="absolute inset-0 border-4 border-purple-400 rounded-3xl"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-purple-400 rounded-tl-xl" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-purple-400 rounded-tr-xl" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-purple-400 rounded-bl-xl" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-purple-400 rounded-br-xl" />
            </div>
          </motion.div>
        )}

        {cameraReady && !detectedTarget && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-16 sm:bottom-20 inset-x-0 text-center px-4"
          >
            <div className="bg-black/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-md mx-auto">
              <p className="text-white text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                Aponte para um card
              </p>
              <p className="text-white/80 text-sm sm:text-base">
                Curativo • Material Escolar • Dente
              </p>
            </div>
          </motion.div>
        )}

        {detectedTarget && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-purple-500/90 backdrop-blur-sm"
          >
            <div className="text-center">
              <motion.div
                className="text-6xl sm:text-8xl mb-4 sm:mb-6"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: 2,
                }}
              >
                {detectedTarget === 'bandaid' && '💉'}
                {detectedTarget === 'school' && '🎒'}
                {detectedTarget === 'tooth' && '🦷'}
                {detectedTarget === 'street' && '🚦'}
              </motion.div>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">
                Card detectado!
              </h2>
              <p className="text-white/90 text-lg sm:text-xl">
                Abrindo atividade...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {cameraReady && !detectedTarget && (
        <div className="absolute top-6 inset-x-6 flex justify-between items-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-green-500/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2"
          >
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="text-white font-semibold">Câmera ativa</span>
          </motion.div>
        </div>
      )}
    </div>
  );
}
