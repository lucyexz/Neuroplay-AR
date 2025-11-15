import { motion, AnimatePresence } from 'framer-motion';

interface Topic {
  id: number;
  title: string;
  icon: string;
  content: string;
  color: string;
}

const topics: Topic[] = [
  {
    id: 1,
    title: 'O que é uma vacina?',
    icon: '💉',
    content: 'É um remédio especial que protege você de ficar doente. Como um escudo mágico para o seu corpo!',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    id: 2,
    title: 'Por que dói um pouquinho?',
    icon: '🩹',
    content: 'A agulha é bem fininha e rápida. É como um beliscão pequeno que passa logo. Dura menos que um segundo!',
    color: 'bg-purple-100 text-purple-800',
  },
  {
    id: 3,
    title: 'Por que é rápido?',
    icon: '⚡',
    content: 'A vacina entra rapidinho no seu braço. Você nem tem tempo de piscar! 1, 2, 3 e já acabou!',
    color: 'bg-green-100 text-green-800',
  },
  {
    id: 4,
    title: 'Como funciona?',
    icon: '🛡️',
    content: 'A vacina ensina seu corpo a ser forte contra doenças. É como treinar para ser um super-herói!',
    color: 'bg-yellow-100 text-yellow-800',
  },
  {
    id: 5,
    title: 'E depois?',
    icon: '🎈',
    content: 'Depois você pode escolher um curativo legal e ficar orgulhoso. Você foi muito corajoso!',
    color: 'bg-pink-100 text-pink-800',
  },
];

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EducationModal({ isOpen, onClose }: EducationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-8 bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">
                  Entender Melhor
                </h2>
                <button
                  onClick={onClose}
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all active:scale-95"
                  aria-label="Fechar"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                {topics.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 rounded-3xl ${topic.color} border-4 border-opacity-50`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-6xl flex-shrink-0">{topic.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">{topic.title}</h3>
                        <p className="text-lg leading-relaxed">{topic.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: topics.length * 0.1 }}
                  className="text-center p-8 bg-gradient-to-br from-green-100 to-teal-100 rounded-3xl"
                >
                  <div className="text-7xl mb-4">🌟</div>
                  <h3 className="text-3xl font-bold text-green-800 mb-3">
                    Você é corajoso!
                  </h3>
                  <p className="text-xl text-green-700">
                    Agora você sabe tudo sobre vacinas. Está tudo bem sentir um pouquinho de medo,
                    mas lembre-se: é rápido e te deixa protegido!
                  </p>
                </motion.div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t-2 border-gray-200">
              <button
                onClick={onClose}
                className="w-full py-4 bg-purple-500 hover:bg-purple-600 text-white text-xl font-bold rounded-full shadow-lg active:scale-95 transition-all"
              >
                Entendi!
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
