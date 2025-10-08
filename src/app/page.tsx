import { Metadata } from 'next';
import { generateHomeMetadata } from '@/utils/metadata';
import HomeClient from './home-client';

export const metadata: Metadata = generateHomeMetadata();

export default function Home() {
  return <HomeClient />;
}
