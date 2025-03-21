import React, { useState } from 'react';
import { Tag, AlertCircle, Plus } from 'lucide-react';

interface TagSelectorProps {
  onTagSelect: (tag: string) => void;
  className?: string;
}

export function TagSelector({ onTagSelect, className = '' }: TagSelectorProps) {
  const [customTag, setCustomTag] = useState('');
  const [error, setError] = useState<string>('');

  const handleCreateTag = () => {
    if (!customTag.trim()) {
      setError('A tag não pode estar vazia');
      return;
    }

    // Basic validation
    if (customTag.length > 50) {
      setError('A tag deve ter no máximo 50 caracteres');
      return;
    }

    if (!/^[a-zA-Z0-9\s\-_]+$/.test(customTag)) {
      setError('A tag deve conter apenas letras, números, espaços, hífens e underscores');
      return;
    }

    onTagSelect(customTag.trim());
    setCustomTag('');
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateTag();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Nova Tag
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite uma nova tag"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            onClick={handleCreateTag}
            className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>Dicas:</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>Use tags descritivas e relevantes</li>
          <li>Evite tags muito longas</li>
          <li>Separe palavras com hífen ou underscore</li>
        </ul>
      </div>
    </div>
  );
}