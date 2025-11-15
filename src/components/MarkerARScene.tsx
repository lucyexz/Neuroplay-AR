import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import { Backpack } from './Backpack';
import { SchoolItem } from './SchoolItem';

interface MarkerARSceneProps {
  onBack: () => void;
}

interface Item {
  id: string;
  type: 'pencil' | 'notebook' | 'bottle' | 'eraser' | 'ruler' | 'scissors';
  position: [number, number, number];
  collected: boolean;
}

const initialItems: Item[] = [
  { id: '1', type: 'pencil', position: [-0.6, 0.3, 0.3], collected: false },
  { id: '2', type: 'notebook', position: [0.6, 0.4, 0.3], collected: false },
  { id: '3', type: 'bottle', position: [-0.5, 0.5, -0.3], collected: false },
  { id: '4', type: 'eraser', position: [0.7, 0.3, -0.3], collected: false },
  { id: '5', type: 'ruler', position: [-0.7, 0.45, 0], collected: false },
  { id: '6', type: 'scissors', position: [0.55, 0.35, -0.5], collected: false },
];

export function MarkerARScene({ onBack }: MarkerARSceneProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>(initialItems);
  const [completed, setCompleted] = useState(false);
  const [markerDetected, setMarkerDetected] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isSafariBrowser = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);
    setIsSafari(isSafariBrowser);

    const startCamera = async () => {
      try {
        let stream: MediaStream;

        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
        } catch (err) {
          console.warn('Tentando com constraints simplificadas...', err);
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'environment',
            },
            audio: false,
          });
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          await new Promise<void>((resolve, reject) => {
            if (!videoRef.current) {
              reject(new Error('Video element not found'));
              return;
            }

            const video = videoRef.current;

            let timeoutId: NodeJS.Timeout;

            const handleLoadedMetadata = () => {
              video.removeEventListener('loadedmetadata', handleLoadedMetadata);
              video.removeEventListener('loadeddata', handleLoadedData);
              clearTimeout(timeoutId);
              setVideoReady(true);
              resolve();
            };

            const handleLoadedData = () => {
              video.removeEventListener('loadedmetadata', handleLoadedMetadata);
              video.removeEventListener('loadeddata', handleLoadedData);
              clearTimeout(timeoutId);
              setVideoReady(true);
              resolve();
            };

            const handleError = (e: Event) => {
              video.removeEventListener('error', handleError);
              video.removeEventListener('loadedmetadata', handleLoadedMetadata);
              video.removeEventListener('loadeddata', handleLoadedData);
              clearTimeout(timeoutId);
              reject(new Error('Video load error'));
            };

            timeoutId = setTimeout(() => {
              video.removeEventListener('error', handleError);
              video.removeEventListener('loadedmetadata', handleLoadedMetadata);
              video.removeEventListener('loadeddata', handleLoadedData);
              reject(new Error('Video initialization timeout'));
            }, 10000);

            video.addEventListener('loadedmetadata', handleLoadedMetadata);
            video.addEventListener('loadeddata', handleLoadedData);
            video.addEventListener('error', handleError);

            if (video.readyState >= 2) {
              clearTimeout(timeoutId);
              setVideoReady(true);
              resolve();
            }
          });

          try {
            await videoRef.current.play();

            await new Promise<void>((resolve) => {
              const checkPlaying = () => {
                if (videoRef.current &&
                    !videoRef.current.paused &&
                    videoRef.current.readyState >= 2 &&
                    videoRef.current.videoWidth > 0 &&
                    videoRef.current.videoHeight > 0) {
                  setVideoPlaying(true);
                  resolve();
                } else {
                  requestAnimationFrame(checkPlaying);
                }
              };
              checkPlaying();

              setTimeout(() => {
                setVideoPlaying(true);
                resolve();
              }, 1000);
            });
          } catch (playError) {
            console.warn('Erro ao iniciar reprodução:', playError);
            setVideoPlaying(true);
          }

          setHasCamera(true);
        }

        setIsLoading(false);
      } catch (err: any) {
        console.error('Erro ao acessar câmera:', err);

        let errorMessage = 'Não foi possível acessar a câmera.';

        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMessage = 'Permissão da câmera negada. Por favor, permita o acesso à câmera nas configurações.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          errorMessage = 'Nenhuma câmera encontrada no dispositivo.';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          errorMessage = 'A câmera está sendo usada por outro aplicativo.';
        } else if (err.name === 'OverconstrainedError') {
          errorMessage = 'Câmera traseira não disponível. Tente outro dispositivo.';
        } else if (err.name === 'SecurityError') {
          errorMessage = 'Acesso à câmera bloqueado. Verifique se está usando HTTPS.';
        }

        setError(errorMessage);
        setIsLoading(false);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasCamera || !videoReady) return;

    const detectMarker = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (video.videoWidth === 0 || video.videoHeight === 0) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let whitePixels = 0;
      let blackPixels = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const brightness = (r + g + b) / 3;

        if (brightness > 200) whitePixels++;
        if (brightness < 50) blackPixels++;
      }

      const totalPixels = canvas.width * canvas.height;
      const whiteRatio = whitePixels / totalPixels;
      const blackRatio = blackPixels / totalPixels;

      const contrast = Math.abs(whiteRatio - blackRatio);
      setMarkerDetected(contrast > 0.15);
    };

    detectionIntervalRef.current = setInterval(detectMarker, 100);

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [hasCamera, videoReady]);

  const handleItemCollected = (itemId: string) => {
    setItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.id === itemId ? { ...item, collected: true } : item
      );

      if (newItems.every((item) => item.collected)) {
        setCompleted(true);
      }

      return newItems;
    });
  };

  const handleReset = () => {
    setCompleted(false);
    setItems(initialItems);
  };

  if (isLoading) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-yellow-50">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center max-w-md space-y-6">
            <button
              onClick={onBack}
              className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-50 active:scale-95 transition-all"
            >
              <span className="text-2xl">←</span>
            </button>

            <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-blue-500 mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-blue-600">
              Inicializando AR com Marcador...
            </h1>
            <p className="text-base text-gray-600">
              Permita o acesso à câmera quando solicitado
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-yellow-50">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="text-center max-w-md space-y-6">
            <button
              onClick={onBack}
              className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-50 active:scale-95 transition-all"
            >
              <span className="text-2xl">←</span>
            </button>

            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-red-600">Erro</h1>
            <p className="text-base text-gray-700">{error}</p>
            <button
              onClick={onBack}
              className="w-full px-8 py-4 bg-blue-500 text-white text-lg font-semibold rounded-2xl shadow-lg hover:bg-blue-600 active:scale-95 transition-all"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
        playsInline
        autoPlay
        muted
      />

      <canvas
        ref={canvasRef}
        className="hidden"
      />

      {!videoPlaying && hasCamera && (
        <div className="absolute inset-0 flex items-center justify-center bg-black" style={{ zIndex: 5 }}>
          <div className="text-center text-white space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto"></div>
            <p className="text-lg font-semibold">Inicializando câmera...</p>
          </div>
        </div>
      )}

      {videoPlaying && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <Canvas
            gl={{
              alpha: true,
              antialias: true,
              preserveDrawingBuffer: true,
              powerPreference: isSafari ? 'default' : 'high-performance'
            }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={75} />
              <ambientLight intensity={1} />
              <directionalLight position={[5, 5, 5]} intensity={1.2} />
              <pointLight position={[-5, 3, 3]} intensity={0.5} color="#B3E5FC" />

              {markerDetected && (
                <group position={[0, -0.2, -2]} scale={markerDetected ? 1 : 0.5}>
                  <Backpack position={[0, 0, 0]} />

                  {items.map((item) => (
                    <SchoolItem
                      key={item.id}
                      type={item.type}
                      position={item.position}
                      onCollected={() => handleItemCollected(item.id)}
                      isCollected={item.collected}
                    />
                  ))}
                </group>
              )}
            </Suspense>
          </Canvas>
        </div>
      )}

      <div className="absolute top-6 left-6" style={{ zIndex: 10 }}>
        <button
          onClick={onBack}
          className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:bg-white active:scale-95 transition-all"
        >
          <span className="text-2xl">←</span>
        </button>
      </div>

      <div className="absolute top-6 left-1/2 transform -translate-x-1/2" style={{ zIndex: 10 }}>
        <div
          className={`backdrop-blur-sm px-6 py-3 rounded-full shadow-lg transition-all ${
            markerDetected
              ? 'bg-green-500/90 text-white'
              : 'bg-white/90 text-gray-800'
          }`}
        >
          <p className="text-lg font-semibold">
            {markerDetected ? '✓ Marcador detectado!' : 'Aponte para um marcador'}
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2" style={{ zIndex: 10 }}>
        <div className="bg-blue-500/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
          <p className="text-sm font-medium text-white">
            Itens coletados: {items.filter((i) => i.collected).length}/{items.length}
          </p>
        </div>
      </div>

      {completed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm pointer-events-none" style={{ zIndex: 20 }}>
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-sm pointer-events-auto">
            <h2 className="text-4xl font-bold text-green-600 mb-4">Parabéns!</h2>
            <p className="text-xl text-gray-700 mb-6">
              Você guardou todos os materiais!
            </p>
            <div className="space-y-3">
              <button
                onClick={handleReset}
                className="w-full px-8 py-4 bg-blue-500 text-white text-lg font-semibold rounded-2xl shadow-lg hover:bg-blue-600 active:scale-95 transition-all"
              >
                Começar Novamente
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
