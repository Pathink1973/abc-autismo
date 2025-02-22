import React from 'react';
import { Play, Trash2, Volume2, X, ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import { PictureCard } from './PictureCard';
import { motion, AnimatePresence } from 'framer-motion';

export const CommunicationBar: React.FC = () => {
  const { selectedCards, removeCard, clearCards } = useStore();
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const speak = () => {
    const text = selectedCards.map((card) => card.voiceLabel || card.label).join(' ');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-PT';
    utterance.voice = window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang.includes('pt-PT') && voice.gender === 'female');
    window.speechSynthesis.speak(utterance);
  };

  React.useEffect(() => {
    const initVoices = () => {
      window.speechSynthesis.getVoices();
    };
    
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = initVoices;
    }
    
    initVoices();
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-lg border-t border-gray-200/50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <AnimatePresence mode="popLayout">
              {selectedCards.map((card, index) => (
                <motion.div
                  key={`${card.id}-${index}`} // Using both card.id and index to ensure uniqueness
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ type: "spring", delay: index * 0.1 }}
                  className="relative w-24 flex-shrink-0 group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <PictureCard card={card} />
                  <motion.button
                    onClick={() => removeCard(card.id)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-blue-500/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg backdrop-blur-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Remover ${card.label}`}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                  {index < selectedCards.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: hoveredIndex === index ? 1 : 0.5,
                        scale: hoveredIndex === index ? 1.2 : 1,
                      }}
                      className="flex items-center px-1"
                    >
                      <ArrowLeft 
                        className={`w-5 h-5 ${
                          hoveredIndex === index 
                            ? 'text-blue-500' 
                            : 'text-gray-400'
                        }`}
                      />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex gap-2">
            <motion.button
              onClick={speak}
              className="p-3 bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/25"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Falar"
            >
              <Volume2 className="w-6 h-6" />
            </motion.button>
            <motion.button
              onClick={clearCards}
              className="p-3 bg-red-500 text-white rounded-full shadow-lg shadow-red-500/25"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Limpar todas as imagens"
            >
              <Trash2 className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};