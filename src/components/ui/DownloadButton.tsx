import React from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface DownloadButtonProps {
  url: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ url, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    if (onClick) {
      onClick(e);
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.button
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl shadow-blue-500/25"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Download className="w-6 h-6" />
      <span className="font-medium text-lg">Descarregar Imagens</span>
    </motion.button>
  );
};