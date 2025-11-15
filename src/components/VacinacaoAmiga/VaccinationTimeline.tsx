import { useState } from 'react';
import { motion } from 'framer-motion';

interface Step {
  id: number;
  title: string;
  icon: string;
  description: string;
  color: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Chegar no posto',
    icon: '🏥',
    description: 'Você vai entrar em um lugar seguro',
    color: 'bg-blue-100 border-blue-300 text-blue-700',
  },
  {
    id: 2,
    title: 'Esperar sentado',
    icon: '🪑',
    description: 'Você pode ficar calmo esperando',
    color: 'bg-teal-100 border-teal-300 text-teal-700',
  },
  {
    id: 3,
    title: 'Arregaçar a manga',
    icon: '👕',
    description: 'Vamos mostrar o bracinho',
    color: 'bg-cyan-100 border-cyan-300 text-cyan-700',
  },
  {
    id: 4,
    title: 'Limpar o braço',
    icon: '🧼',
    description: 'Um toque gelado e rápido',
    color: 'bg-green-100 border-green-300 text-green-700',
  },
  {
    id: 5,
    title: 'Tomar a vacina',
    icon: '💉',
    description: 'Rápido como um piscar! 1, 2, 3 pronto!',
    color: 'bg-purple-100 border-purple-300 text-purple-700',
  },
  {
    id: 6,
    title: 'Colocar curativo',
    icon: '🩹',
    description: 'Escolha seu curativo favorito',
    color: 'bg-pink-100 border-pink-300 text-pink-700',
  },
  {
    id: 7,
    title: 'Pronto, acabou!',
    icon: '🎉',
    description: 'Você foi muito corajoso!',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
  },
];

interface VaccinationTimelineProps {
  onStepClick?: (step: Step) => void;
}

export function VaccinationTimeline({ onStepClick }: VaccinationTimelineProps) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  const handleStepClick = (step: Step) => {
    setSelectedStep(step.id);
    onStepClick?.(step);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Como vai ser a vacinação
      </h2>
      <p className="text-center text-gray-600 mb-8 text-lg">
        Toque em cada etapa para saber mais
      </p>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.button
            key={step.id}
            onClick={() => handleStepClick(step)}
            className={`w-full p-6 rounded-3xl border-4 ${step.color} transition-all shadow-lg hover:shadow-xl`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={{
              borderColor: selectedStep === step.id ? '#7C3AED' : undefined,
              boxShadow: selectedStep === step.id ? '0 20px 25px -5px rgba(124, 58, 237, 0.3)' : undefined,
            }}
          >
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center text-5xl">
                {step.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold">Passo {index + 1}</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                <p className="text-lg opacity-90">{step.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
