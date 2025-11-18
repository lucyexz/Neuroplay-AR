import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ARReaderProps {
  onDetect: (target: 'bandaid' | 'school' | 'tooth' | 'street') => void;
  onError?: (error: string) => void;
}

interface ColorProfile {
  beige: number;
  lightBackground: number;
  darkBlue: number;
  mediumBlue: number;
  coral: number;
  salmon: number;
  darkGreen: number;
  mediumGreen: number;
  black: number;
  white: number;
}

export function ARReader({ onDetect, onError }: ARReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const [detectedTarget, setDetectedTarget] = useState<string | null>(null);
  const [detectionProgress, setDetectionProgress] = useState(0);
  const [currentColor, setCurrentColor] = useState<string>('purple');
  const [helpMessage, setHelpMessage] = useState<string>('');
  const [confidenceScore, setConfidenceScore] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const isNavigatingRef = useRef(false);
  const detectionCountRef = useRef<{ [key: string]: number }>({
    tooth: 0,
    school: 0,
    bandaid: 0,
    street: 0
  });
  const lastDetectionRef = useRef<string | null>(null);
  const noDetectionTimerRef = useRef<NodeJS.Timeout | null>(null);

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
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (!ctx) return;

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const detect = () => {
        if (!mounted || !video || !canvas || !ctx) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const centerX = Math.floor(canvas.width * 0.3);
        const centerY = Math.floor(canvas.height * 0.25);
        const roiWidth = Math.floor(canvas.width * 0.4);
        const roiHeight = Math.floor(canvas.height * 0.5);

        const imageData = ctx.getImageData(centerX, centerY, roiWidth, roiHeight);

        const brightness = calculateBrightness(imageData);
        const contrast = calculateContrast(imageData);

        if (brightness > 40 && brightness < 220 && contrast > 30) {
          const detectionResult = detectCardAdvanced(imageData);

          if (detectionResult && detectionResult.confidence > 60) {
            if (noDetectionTimerRef.current) {
              clearTimeout(noDetectionTimerRef.current);
              noDetectionTimerRef.current = null;
            }

            if (lastDetectionRef.current === detectionResult.card) {
              detectionCountRef.current[detectionResult.card]++;
            } else {
              lastDetectionRef.current = detectionResult.card;
              detectionCountRef.current = {
                tooth: 0,
                school: 0,
                bandaid: 0,
                street: 0
              };
              detectionCountRef.current[detectionResult.card] = 1;
            }

            const requiredFrames = 5;
            const progress = Math.min((detectionCountRef.current[detectionResult.card] / requiredFrames) * 100, 100);

            if (mounted) {
              setDetectionProgress(progress);
              setConfidenceScore(detectionResult.confidence);

              const colorMap: { [key: string]: string } = {
                tooth: 'blue',
                school: 'blue',
                bandaid: 'red',
                street: 'green'
              };
              setCurrentColor(colorMap[detectionResult.card] || 'purple');

              const nameMap: { [key: string]: string } = {
                tooth: 'Escovar Dentes',
                school: 'Material Escolar',
                bandaid: 'Vacinação',
                street: 'Atravessar Rua'
              };
              setHelpMessage(`${nameMap[detectionResult.card]} detectado - ${Math.round(progress)}%`);

              if (navigator.vibrate && detectionCountRef.current[detectionResult.card] === 1) {
                navigator.vibrate(20);
              }
            }

            if (detectionCountRef.current[detectionResult.card] >= requiredFrames && !isNavigatingRef.current) {
              isNavigatingRef.current = true;
              setDetectedTarget(detectionResult.card);

              if (navigator.vibrate) {
                navigator.vibrate([50, 80, 50]);
              }

              if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
              }

              setTimeout(() => {
                if (mounted) {
                  if (navigator.vibrate) {
                    navigator.vibrate(100);
                  }
                  onDetect(detectionResult.card as 'bandaid' | 'school' | 'tooth' | 'street');
                }
              }, 1500);
              return;
            }
          } else {
            resetDetection(mounted);

            if (!noDetectionTimerRef.current) {
              noDetectionTimerRef.current = setTimeout(() => {
                if (mounted && !isNavigatingRef.current) {
                  setHelpMessage('💡 Alinhe o card dentro do quadrado (20-30cm de distância)');
                }
              }, 4000);
            }
          }
        } else {
          resetDetection(mounted);

          if (mounted) {
            if (brightness <= 40) {
              setHelpMessage('💡 Muito escuro - procure mais luz natural');
            } else if (brightness >= 220) {
              setHelpMessage('💡 Muito claro - evite luz direta no card');
            } else if (contrast <= 30) {
              setHelpMessage('💡 Posicione o card dentro do quadrado');
            }
          }
        }

        if (mounted && !isNavigatingRef.current) {
          animationFrameRef.current = requestAnimationFrame(detect);
        }
      };

      animationFrameRef.current = requestAnimationFrame(detect);
    };

    const resetDetection = (mounted: boolean) => {
      lastDetectionRef.current = null;
      detectionCountRef.current = {
        tooth: 0,
        school: 0,
        bandaid: 0,
        street: 0
      };
      if (mounted) {
        setDetectionProgress(0);
        setConfidenceScore(0);
        setCurrentColor('purple');
      }
    };

    const calculateBrightness = (imageData: ImageData): number => {
      const data = imageData.data;
      let sum = 0;
      const sampleStep = 4;

      for (let i = 0; i < data.length; i += 4 * sampleStep) {
        sum += (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
      }

      return sum / (data.length / (4 * sampleStep));
    };

    const calculateContrast = (imageData: ImageData): number => {
      const data = imageData.data;
      const brightnesses: number[] = [];
      const sampleStep = 8;

      for (let i = 0; i < data.length; i += 4 * sampleStep) {
        brightnesses.push(data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
      }

      if (brightnesses.length < 2) return 0;

      const mean = brightnesses.reduce((a, b) => a + b, 0) / brightnesses.length;
      const variance = brightnesses.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / brightnesses.length;

      return Math.sqrt(variance);
    };

    const analyzeColorProfile = (imageData: ImageData): ColorProfile => {
      const data = imageData.data;
      const profile: ColorProfile = {
        beige: 0,
        lightBackground: 0,
        darkBlue: 0,
        mediumBlue: 0,
        coral: 0,
        salmon: 0,
        darkGreen: 0,
        mediumGreen: 0,
        black: 0,
        white: 0
      };

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (r > 220 && g > 210 && b > 190 && r < 255 && g < 245 && b < 230) {
          profile.beige++;
        }
        if (r > 200 && g > 190 && b > 180 && Math.abs(r - g) < 30 && Math.abs(g - b) < 30) {
          profile.lightBackground++;
        }

        if (b > 140 && b > r + 40 && b > g + 30 && r < 120 && g < 130) {
          profile.darkBlue++;
        }
        if (b > 100 && b > r + 20 && b > g + 15 && r < 180 && g < 180 && b > 80) {
          profile.mediumBlue++;
        }

        if (r > 200 && r > g + 50 && r > b + 70 && g > 80 && g < 160 && b > 70 && b < 140) {
          profile.coral++;
        }
        if (r > 180 && r > g + 30 && r > b + 40 && g > 100 && g < 170 && b > 100 && b < 160) {
          profile.salmon++;
        }

        if (g > 100 && g > r + 30 && g > b + 30 && r < 100 && b < 100 && g < 180) {
          profile.darkGreen++;
        }
        if (g > 80 && g > r + 15 && g > b + 20 && r < 150 && b < 140) {
          profile.mediumGreen++;
        }

        if (r < 60 && g < 60 && b < 60) {
          profile.black++;
        }
        if (r > 230 && g > 230 && b > 230) {
          profile.white++;
        }
      }

      return profile;
    };

    const detectCardAdvanced = (imageData: ImageData): { card: string; confidence: number } | null => {
      const profile = analyzeColorProfile(imageData);
      const total = imageData.data.length / 4;

      const beigeRatio = profile.beige / total;
      const lightBgRatio = profile.lightBackground / total;
      const darkBlueRatio = profile.darkBlue / total;
      const mediumBlueRatio = profile.mediumBlue / total;
      const coralRatio = profile.coral / total;
      const salmonRatio = profile.salmon / total;
      const darkGreenRatio = profile.darkGreen / total;
      const mediumGreenRatio = profile.mediumGreen / total;
      const blackRatio = profile.black / total;
      const whiteRatio = profile.white / total;

      const scores: { [key: string]: { score: number; confidence: number } } = {
        tooth: { score: 0, confidence: 0 },
        school: { score: 0, confidence: 0 },
        bandaid: { score: 0, confidence: 0 },
        street: { score: 0, confidence: 0 }
      };

      if ((beigeRatio > 0.25 || lightBgRatio > 0.35) && (mediumBlueRatio > 0.08 || darkBlueRatio > 0.04)) {
        scores.tooth.score += 10;
        scores.tooth.confidence = Math.min(100, (beigeRatio + mediumBlueRatio) * 150);
      }
      if (lightBgRatio > 0.4 && (mediumBlueRatio > 0.05 || darkBlueRatio > 0.03) && blackRatio > 0.08) {
        scores.tooth.score += 8;
        scores.tooth.confidence = Math.min(100, scores.tooth.confidence + 30);
      }
      if ((beigeRatio > 0.2 || lightBgRatio > 0.3) && mediumBlueRatio > 0.06 && coralRatio < 0.08 && darkGreenRatio < 0.06) {
        scores.tooth.score += 6;
        scores.tooth.confidence = Math.min(100, scores.tooth.confidence + 20);
      }

      if (darkBlueRatio > 0.15 || mediumBlueRatio > 0.25) {
        scores.school.score += 10;
        scores.school.confidence = Math.min(100, (darkBlueRatio + mediumBlueRatio) * 120);
      }
      if ((darkBlueRatio > 0.12 || mediumBlueRatio > 0.2) && blackRatio > 0.05) {
        scores.school.score += 8;
        scores.school.confidence = Math.min(100, scores.school.confidence + 25);
      }
      if (mediumBlueRatio > 0.18 && coralRatio < 0.08 && darkGreenRatio < 0.08) {
        scores.school.score += 6;
        scores.school.confidence = Math.min(100, scores.school.confidence + 20);
      }

      if (coralRatio > 0.15 || salmonRatio > 0.18) {
        scores.bandaid.score += 10;
        scores.bandaid.confidence = Math.min(100, (coralRatio + salmonRatio) * 140);
      }
      if ((coralRatio > 0.12 || salmonRatio > 0.14) && (beigeRatio > 0.1 || lightBgRatio > 0.15)) {
        scores.bandaid.score += 8;
        scores.bandaid.confidence = Math.min(100, scores.bandaid.confidence + 25);
      }
      if ((coralRatio > 0.1 || salmonRatio > 0.12) && blackRatio > 0.05 && mediumBlueRatio < 0.1) {
        scores.bandaid.score += 6;
        scores.bandaid.confidence = Math.min(100, scores.bandaid.confidence + 20);
      }

      if (darkGreenRatio > 0.15 || mediumGreenRatio > 0.2) {
        scores.street.score += 10;
        scores.street.confidence = Math.min(100, (darkGreenRatio + mediumGreenRatio) * 130);
      }
      if ((darkGreenRatio > 0.12 || mediumGreenRatio > 0.15) && blackRatio > 0.06) {
        scores.street.score += 8;
        scores.street.confidence = Math.min(100, scores.street.confidence + 25);
      }
      if (mediumGreenRatio > 0.12 && whiteRatio > 0.08 && coralRatio < 0.08 && darkBlueRatio < 0.08) {
        scores.street.score += 6;
        scores.street.confidence = Math.min(100, scores.street.confidence + 20);
      }

      const scoresArray = Object.entries(scores)
        .map(([name, data]) => ({ name, score: data.score, confidence: data.confidence }))
        .sort((a, b) => b.score - a.score);

      const winner = scoresArray[0];
      const runnerUp = scoresArray[1];

      if (winner.score >= 8 && winner.score > runnerUp.score + 3 && winner.confidence > 60) {
        return { card: winner.name, confidence: winner.confidence };
      }

      return null;
    };

    initAR();

    return () => {
      mounted = false;
      isNavigatingRef.current = false;

      if (noDetectionTimerRef.current) {
        clearTimeout(noDetectionTimerRef.current);
        noDetectionTimerRef.current = null;
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
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
                className={`absolute inset-0 border-4 rounded-3xl ${
                  currentColor === 'blue' ? 'border-blue-400' :
                  currentColor === 'red' ? 'border-red-400' :
                  currentColor === 'green' ? 'border-green-400' :
                  'border-purple-400'
                }`}
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

              <div className={`absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 rounded-tl-xl ${
                currentColor === 'blue' ? 'border-blue-400' :
                currentColor === 'red' ? 'border-red-400' :
                currentColor === 'green' ? 'border-green-400' :
                'border-purple-400'
              }`} />
              <div className={`absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 rounded-tr-xl ${
                currentColor === 'blue' ? 'border-blue-400' :
                currentColor === 'red' ? 'border-red-400' :
                currentColor === 'green' ? 'border-green-400' :
                'border-purple-400'
              }`} />
              <div className={`absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 rounded-bl-xl ${
                currentColor === 'blue' ? 'border-blue-400' :
                currentColor === 'red' ? 'border-red-400' :
                currentColor === 'green' ? 'border-green-400' :
                'border-purple-400'
              }`} />
              <div className={`absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 rounded-br-xl ${
                currentColor === 'blue' ? 'border-blue-400' :
                currentColor === 'red' ? 'border-red-400' :
                currentColor === 'green' ? 'border-green-400' :
                'border-purple-400'
              }`} />

              {detectionProgress > 0 && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -bottom-20 left-0 right-0"
                >
                  <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-3 mx-auto w-64">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-white text-xs font-semibold">
                        Confiança: {Math.round(confidenceScore)}%
                      </span>
                      <span className="text-white text-xs">
                        {Math.round(detectionProgress)}%
                      </span>
                    </div>
                    <div className="relative h-2.5 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`absolute inset-y-0 left-0 rounded-full ${
                          currentColor === 'blue' ? 'bg-blue-500' :
                          currentColor === 'red' ? 'bg-red-500' :
                          currentColor === 'green' ? 'bg-green-500' :
                          'bg-purple-500'
                        }`}
                        style={{ width: `${detectionProgress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
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
              {helpMessage ? (
                <p className="text-white text-base sm:text-lg font-semibold">
                  {helpMessage}
                </p>
              ) : (
                <>
                  <p className="text-white text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                    Aponte para um card
                  </p>
                  <p className="text-white/80 text-sm sm:text-base">
                    Escovar Dentes • Material Escolar • Vacinação • Atravessar Rua
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}

        {detectedTarget && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 backdrop-blur-sm"
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
            <span className="text-white font-semibold text-sm">Câmera ativa</span>
          </motion.div>
        </div>
      )}
    </div>
  );
}
