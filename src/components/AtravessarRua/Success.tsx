import { motion } from 'framer-motion';

interface SuccessProps {
  onRestart: () => void;
  onBackToMenu: () => void;
}

export function Success({ onRestart, onBackToMenu }: SuccessProps) {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        <motion.div
          className="text-8xl sm:text-9xl mb-6 sm:mb-8"
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          🎉
        </motion.div>

        <motion.h1
          className="text-3xl sm:text-5xl font-bold text-green-600 mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Muito bem!
        </motion.h1>

        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 mb-8 sm:mb-12 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-xl sm:text-2xl text-gray-800 mb-6">
            Você atravessou a rua com segurança!
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-green-100 rounded-2xl">
              <div className="text-4xl">✅</div>
              <p className="text-left text-gray-800 text-base sm:text-lg">
                Esperou o sinal verde
              </p>
            </div>

            <div className="flex items-center gap-4 p-4 bg-blue-100 rounded-2xl">
              <div className="text-4xl">👀</div>
              <p className="text-left text-gray-800 text-base sm:text-lg">
                Olhou para os dois lados
              </p>
            </div>

            <div className="flex items-center gap-4 p-4 bg-purple-100 rounded-2xl">
              <div className="text-4xl">🚶</div>
              <p className="text-left text-gray-800 text-base sm:text-lg">
                Atravessou com calma
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={onRestart}
            className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-lg sm:text-xl font-bold rounded-full shadow-lg active:scale-95 transition-all"
          >
            Praticar Novamente
          </button>

          <button
            onClick={onBackToMenu}
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg sm:text-xl font-bold rounded-full shadow-lg active:scale-95 transition-all"
          >
            Voltar ao Início
          </button>
        </motion.div>

        <motion.p
          className="mt-6 text-gray-600 text-sm sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Continue sempre atravessando com segurança!
        </motion.p>
      </motion.div>
    </div>
  );
}
