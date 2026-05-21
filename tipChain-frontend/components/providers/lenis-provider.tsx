'use client';

import { useEffect } from 'react';

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    let lenis: InstanceType<typeof import('lenis').default> | null = null;

    async function initLenis() {
      const Lenis = (await import('lenis')).default;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
      });

      function raf(time: number) {
        lenis?.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    initLenis();

    return () => {
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
