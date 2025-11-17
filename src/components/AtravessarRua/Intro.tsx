import { motion } from 'framer-motion';

interface IntroProps {
  onStart: () => void;
}

export function Intro({ onStart }: IntroProps) {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full text-center"
      >
        <motion.div
          className="text-7xl sm:text-9xl mb-6 sm:mb-8"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          🚦
        </motion.div>

        <h1 className="text-3xl sm:text-5xl font-bold text-green-700 mb-4 sm:mb-6">
          Atravessar a Rua com Segurança
        </h1>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 mb-8 sm:mb-12 shadow-lg">
          <p className="text-lg sm:text-2xl text-gray-700 leading-relaxed mb-6">
            Vamos aprender a atravessar a rua de forma segura e tranquila.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-green-100 rounded-2xl">
              <div className="text-4xl">👀</div>
              <p className="text-left text-gray-800 text-base sm:text-lg">
                Vamos sempre olhar para os dois lados
              </p>
            </div>

            <div className="flex items-center gap-4 p-4 bg-blue-100 rounded-2xl">
              <div className="text-4xl">🚦</div>
              <p className="text-left text-gray-800 text-base sm:text-lg">
                Vamos esperar o sinal ficar verde
              </p>
            </div>

            <div className="flex items-center gap-4 p-4 bg-yellow-100 rounded-2xl">
              <div className="text-4xl">🚶</div>
              <p className="text-left text-gray-800 text-base sm:text-lg">
                Vamos atravessar com calma na faixa
              </p>
            </div>
          </div>
        </div>

        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-12 py-5 bg-green-500 hover:bg-green-600 text-white text-xl sm:text-2xl font-bold rounded-full shadow-xl transition-colors"
        >
          Começar
        </motion.button>
      </motion.div>
    </div>
  );
}
