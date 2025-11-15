import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef } from 'react';
import { Backpack } from './Backpack';
import { SchoolItem } from './SchoolItem';
import { Confetti } from './Confetti';

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

interface CameraARSceneProps {
  onBack: () => void;
}

export function CameraARScene({ onBack }: CameraARSceneProps) {
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [items, setItems] = useState<Item[]>(initialItems);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [gyroRotation, setGyroRotation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const streamRef = useRef<MediaStream | null>(null);
  const [isSafari, setIsSafari] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const playCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isSafariBrowser = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);
    setIsSafari(isSafariBrowser);

    const handleOrientation = (event: DeviceOrientationEvent) => {
      setGyroRotation({
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0,
      });
    };

    if (typeof DeviceOrientationEvent !== 'undefined' && 'requestPermission' in DeviceOrientationEvent) {
      (DeviceOrientationEvent as any).requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (playCheckIntervalRef.current) {
        clearInterval(playCheckIntervalRef.current);
      }
    };
  }, []);

  const startCamera = async () => {
    setIsLoading(true);
    setCameraError(null);

    try {
      let stream: MediaStream;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
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
      }

      setHasCamera(true);
    } catch (error: any) {
      console.error('Erro ao acessar câmera:', error);

      let errorMessage = 'Não foi possível acessar a câmera.';

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Permissão da câmera negada. Por favor, permita o acesso à câmera nas configurações.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'Nenhuma câmera encontrada no dispositivo.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'A câmera está sendo usada por outro aplicativo.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Câmera traseira não disponível. Tente outro dispositivo.';
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Acesso à câmera bloqueado. Verifique se está usando HTTPS.';
      }

      setCameraError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemCollected = (itemId: string) => {
    setItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.id === itemId ? { ...item, collected: true } : item
      );

      const allCollected = newItems.every((item) => item.collected);
      if (allCollected) {
        setShowConfetti(true);
        setCompleted(true);
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ4NVKno7bVhGgU7ltryxnMpBSh+zO/cjT0KF2G36+ihUREMTqfj8LdlHAY5k9n0y3orBSd7xu/dijwKFluz6+mjUxENUKjl7bNfGAU6mtvyxXQpBSaByO/ajD4KGGCz6OifUBEMTqnh7rVjGwU7nNv0yHYpBSh7xu/aizsKFl226eqkVBIMUarj7bVhGgU6nN30yHUpBSl8xe/ai0AKFluz6emiUxANU6vk8LRiGgY8nN30yHQqBSh8xO/di0EKGVy16OqjUhALT6rm7rZjGgU7n9z0x3MqBSh9xO/dikAKGF216+mjUhEKTavk8LRiGgU8nN30yXUrBSl8xO/bjEEKGl216+qjURALTqrm7rVhGgY7nN30yHUpBSl8xO/bjEEKGl216+qiUhAKTqvl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl226+qiURAKTqrk7rVhGgY8nN30yHYqBSl8xO/bjEEKGl226+qiURENUqvl7rVhGgY7nN30yHYrBSl8xO/bjEEKGl216+qjURALTqrk7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALTqrl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/b');
            audio.volume = 0.4;
            audio.play().catch(() => {});
          }, 300);
        }
      }

      return newItems;
    });
  };

  const handleReset = () => {
    setCompleted(false);
    setItems(initialItems);
    setShowConfetti(false);
    setResetTrigger((prev) => prev + 1);
  };

  if (!hasCamera) {
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

            <div className="text-6xl mb-4">📸</div>
            <h1 className="text-3xl font-bold text-blue-600 mb-4">
              AR com Câmera
            </h1>
            <p className="text-lg text-gray-700 mb-4">
              Aponte a câmera para ver a mochila no mundo real
            </p>
            <p className="text-base text-gray-600 mb-8">
              Funciona em todos os dispositivos com câmera. Mova seu celular para ver os objetos de diferentes ângulos.
            </p>

            <button
              onClick={startCamera}
              disabled={isLoading}
              className="w-full px-8 py-4 bg-blue-500 text-white text-xl font-semibold rounded-2xl shadow-lg hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Iniciando Câmera...' : 'Iniciar Câmera AR'}
            </button>

            {cameraError && (
              <div className="bg-red-50 p-4 rounded-2xl">
                <p className="text-sm text-red-600">{cameraError}</p>
                <p className="text-xs text-red-500 mt-2">
                  Certifique-se de permitir o acesso à câmera quando solicitado
                </p>
              </div>
            )}
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

      {!videoPlaying && hasCamera && (
        <div className="absolute inset-0 flex items-center justify-center bg-black" style={{ zIndex: 5 }}>
          <div className="text-center text-white space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto"></div>
            <p className="text-lg font-semibold">Inicializando câmera...</p>
          </div>
        </div>
      )}

      {videoPlaying && (
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
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
            <PerspectiveCamera
              makeDefault
              position={[0, 0, 3]}
              fov={75}
              rotation={[
                (gyroRotation.beta * Math.PI) / 180 / 10,
                (gyroRotation.gamma * Math.PI) / 180 / 10,
                0,
              ]}
            />

            <ambientLight intensity={1} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <pointLight position={[-5, 3, 3]} intensity={0.5} color="#B3E5FC" />

            <group position={[0, -0.2, -2]}>
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

              {showConfetti && <Confetti />}
            </group>
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
        <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
          <p className="text-lg font-semibold text-gray-800">
            Toque nos objetos para guardar
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2" style={{ zIndex: 10 }}>
        <div className="bg-blue-500/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
          <p className="text-sm font-medium text-white">
            Mova o celular para explorar
          </p>
        </div>
      </div>

      {completed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm pointer-events-none" style={{ zIndex: 20 }}>
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-sm pointer-events-auto">
            <h2 className="text-4xl font-bold text-green-600 mb-4">
              Parabéns!
            </h2>
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
