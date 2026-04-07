'use client';

import dynamic from 'next/dynamic';
import type { CompanyLogo } from '@/data/company-logos';

const CompanyLogoCarousel = dynamic(() => import('./CompanyLogoCarousel'), {
  ssr: true,
  loading: () => <div className="h-10" />,
});

interface LazyLogoCarouselProps {
  companies: CompanyLogo[];
  size?: 'xs' | 'sm' | 'md' | 'lg';
  gap?: 'default' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function LazyLogoCarousel(props: LazyLogoCarouselProps) {
  return <CompanyLogoCarousel {...props} />;
}
