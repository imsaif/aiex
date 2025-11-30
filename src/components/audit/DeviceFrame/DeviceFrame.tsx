'use client';

import { MobileFrame } from './MobileFrame';
import { DesktopFrame } from './DesktopFrame';
import type { DeviceType } from '@/utils/imageDetection';

interface DeviceFrameProps {
  deviceType: DeviceType;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

export function DeviceFrame({ deviceType, imageSrc, imageAlt, className }: DeviceFrameProps) {
  if (deviceType === 'mobile') {
    return <MobileFrame imageSrc={imageSrc} imageAlt={imageAlt} className={className} />;
  }
  return <DesktopFrame imageSrc={imageSrc} imageAlt={imageAlt} className={className} />;
}
