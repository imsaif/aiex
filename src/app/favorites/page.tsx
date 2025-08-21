import { redirect } from 'next/navigation';

export default function FavoritesPage() {
  // Favorites functionality has been removed, redirect to patterns page
  redirect('/patterns');
}