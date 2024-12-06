import React, { useState } from 'react';
import { CategoryList } from './components/CategoryList';
import { PictureGrid } from './components/PictureGrid';
import { CommunicationBar } from './components/CommunicationBar';
import { translations } from './i18n/translations';
import { Brain } from 'lucide-react';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <header className="bg-white/70 backdrop-blur-xl sticky top-0 z-10 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                {translations.appTitle}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {translations.appDescription}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-32">
        <CategoryList
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <PictureGrid categoryId={selectedCategory} />
      </main>

      <CommunicationBar />
    </div>
  );
}

export default App;