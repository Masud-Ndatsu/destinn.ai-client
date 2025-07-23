'use client';

import { usePathname } from 'next/navigation';
import { ChatbotWidget } from './ChatbotWidget';

export default function ConditionalChatWidget() {
  const pathname = usePathname();
  
  // Hide chat widget if the path contains '/admin'
  if (pathname?.includes('/admin')) {
    return null;
  }
  
  return <ChatbotWidget />;
}