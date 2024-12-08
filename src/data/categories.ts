import { Category } from '../types';
import { translations } from '../i18n/translations';

export const categories: Category[] = [
  {
    id: 'actions',
    name: translations.categories.actions,
    icon: '🏃',
    color: 'bg-blue-500',
    group: 'actions'
  },
  {
    id: 'animals',
    name: translations.categories.animals,
    icon: '🐾',
    color: 'bg-amber-500',
    group: 'nature'
  },
  {
    id: 'body',
    name: translations.categories.body,
    icon: '👤',
    color: 'bg-pink-500',
    group: 'body'
  },
  {
    id: 'clothes',
    name: translations.categories.clothes,
    icon: '👕',
    color: 'bg-indigo-500',
    group: 'daily'
  },
  {
    id: 'colors',
    name: translations.categories.colors,
    icon: '🎨',
    color: 'bg-violet-500',
    group: 'expressions'
  },
  {
    id: 'emotions',
    name: translations.categories.emotions,
    icon: '😊',
    color: 'bg-yellow-500',
    group: 'expressions'
  },
  {
    id: 'food',
    name: translations.categories.food,
    icon: '🍎',
    color: 'bg-red-500',
    group: 'daily'
  },
  {
    id: 'general',
    name: translations.categories.general,
    icon: '📌',
    color: 'bg-purple-500',
    group: 'general'
  },
  {
    id: 'numbers',
    name: translations.categories.numbers,
    icon: '🔢',
    color: 'bg-teal-500',
    group: 'general'
  },
  {
    id: 'objects',
    name: translations.categories.objects,
    icon: '📱',
    color: 'bg-gray-500',
    group: 'things'
  },
  {
    id: 'places',
    name: translations.categories.places,
    icon: '🏠',
    color: 'bg-green-500',
    group: 'places'
  },
  {
    id: 'weather',
    name: translations.categories.weather,
    icon: '☀️',
    color: 'bg-cyan-500',
    group: 'nature'
  }
].sort((a, b) => a.name.localeCompare(b.name));