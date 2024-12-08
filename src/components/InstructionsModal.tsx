import React from 'react';
import { X, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">Como usar o ABC Autismo?</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <p className="text-gray-600 leading-relaxed mb-6">
                A aplicação deve ser intuitiva, permitindo que os cuidadores, terapeutas ou pais adicionem imagens personalizadas para criar um sistema de comunicação adaptado às necessidades da criança. As imagens representam objetos, lugares, roupas, alimentos ou outras categorias essenciais para a comunicação.
              </p>

              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Como Funciona:</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">1. Seleção de Imagens:</h4>
                      <p className="text-gray-600 ml-4">• As imagens são organizadas por categorias (ex.: Comida, Lugares, Roupa).</p>
                      <p className="text-gray-600 ml-4">• A criança seleciona a imagem que corresponde ao que deseja comunicar, como "comer maçã" ou "ir ao parque."</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">2. Criação de Frases:</h4>
                      <p className="text-gray-600 ml-4">• A aplicação permite combinar imagens com texto ou áudio para formar frases simples, como "Quero comer" seguido da imagem de comida escolhida.</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">3. Interação e Feedback:</h4>
                      <p className="text-gray-600 ml-4">• Ao selecionar uma imagem, a aplicação pode reproduzir um som ou frase correspondente (ex.: "Maçã"). Isso reforça a associação visual e auditiva.</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">4. Personalização:</h4>
                      <p className="text-gray-600 ml-4">• É possível adicionar imagens importadas a partir do computador ou por URL.</p>
                      <p className="text-gray-600 ml-4">• O texto ou som associado a cada imagem pode ser ajustado para refletir a linguagem usada pela criança.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Objetivo:</h3>
                  <p className="text-gray-600">
                    A utilização das imagens facilita a comunicação funcional, reduz frustrações e incentiva a autonomia das crianças no espectro do autismo. A aplicação deve ser clara, com botões grandes e imagens de alta qualidade para promover uma experiência agradável e acessível.
                  </p>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Autoria da Aplicação (ABC Autismo)</h3>
                  <p className="text-gray-600">
                    2024 © Todos os direitos reservados.
                  </p>
                  <p className="text-gray-600">
                    Esta aplicação foi desenvolvida com o propósito de promover a inclusão e melhorar a comunicação de crianças no espectro do autismo. O conteúdo e as funcionalidades são projetados para facilitar a interação entre cuidadores, terapeutas e crianças, respeitando as necessidades individuais de cada utilizador. A reprodução, distribuição ou uso não autorizado de qualquer parte deste sistema é estritamente proibida. As imagens usadas nesta aplicação foram todas geradas com inteligência artificial. Obrigado por contribuir para um mundo mais acessível e inclusivo. O conteúdo está disponível sob a licença Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International, permitindo a partilha e adaptação, desde que seja atribuído o devido crédito, para fins não comerciais, e com distribuição sob os mesmos termos. Juntos, construímos um mundo mais inclusivo e acessível.
                  </p>
                  <p className="text-gray-600 font-medium">
                    Autoria de Patrício Brito © 2024
                  </p>
                </section>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};