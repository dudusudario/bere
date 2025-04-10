
import React from 'react';
import { DesktopSidebar } from '@/components/sidebar/DesktopSidebar';
import { MobileSidebar } from '@/components/sidebar/MobileSidebar';

export function AppSidebar() {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}
