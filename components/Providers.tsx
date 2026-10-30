'use client';

import React from 'react';
import { LanguageProvider } from '@/lib/languageContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
