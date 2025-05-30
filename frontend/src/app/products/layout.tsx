import React, { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return <div><h2>products section</h2>{children}</div>;
}
