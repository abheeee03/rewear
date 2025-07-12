'use client';

import { CldImage } from 'next-cloudinary';

interface CloudinaryConfigProps {
  children: React.ReactNode;
}

export function CloudinaryConfig({ children }: CloudinaryConfigProps) {
  return <>{children}</>;
}