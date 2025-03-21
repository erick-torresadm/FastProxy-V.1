import React from 'react';
import { X } from 'lucide-react';

interface ProxyTagsProps {
  tags: string[];
  onRemoveTag?: (tag: string) => void;
  className?: string;
}

const getRandomColor = (tag: string) => {
  const colors = [
    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  ];
  
  // Use the tag string to generate a consistent index
  const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

export function ProxyTags({ tags, onRemoveTag, className = '' }: ProxyTagsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <span
          key={index}
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRandomColor(tag)}`}
        >
          {tag}
          {onRemoveTag && (
            <button
              onClick={() => onRemoveTag(tag)}
              className="ml-1 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      ))}
      {tags.length === 0 && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Nenhuma tag adicionada
        </span>
      )}
    </div>
  );
}