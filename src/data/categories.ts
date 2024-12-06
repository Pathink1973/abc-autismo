import { Category } from '../types';
import { translations } from '../i18n/translations';

export const categories: Category[] = [
  {
    id: 'actions',
    name: translations.categories.actions,
    icon: '🏃',
    color: 'bg-blue-500'
  },
  {
    id: 'body',
    name: translations.categories.body,
    icon: '👤',
    color: 'bg-pink-500'
  },
  {
    id: 'clothes',
    name: translations.categories.clothes,
    icon: '👕',
    color: 'bg-indigo-500'
  },
  {
    id: 'diseases',
    name: translations.categories.diseases,
    icon: '🏥',
    color: 'bg-red-400'
  },
  {
    id: 'emotions',
    name: translations.categories.emotions,
    icon: '😊',
    color: 'bg-yellow-500'
  },
  {
    id: 'food',
    name: translations.categories.food,
    icon: '🍎',
    color: 'bg-red-500'
  },
  {
    id: 'general',
    name: translations.categories.general,
    icon: '📌',
    color: 'bg-purple-500'
  },
  {
    id: 'objects',
    name: translations.categories.objects,
    icon: '📱',
    color: 'bg-gray-500'
  },
  {
    id: 'places',
    name: translations.categories.places,
    icon: '🏠',
    color: 'bg-green-500'
  },
  {
    id: 'weather',
    name: translations.categories.weather,
    icon: '☀️',
    color: 'bg-cyan-500'
  }
].sort((a, b) => a.name.localeCompare(b.name));