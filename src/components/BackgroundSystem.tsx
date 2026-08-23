import { useEffect, useRef } from 'react';

export const BackgroundSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle structure definition
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseOpacity: number;
    }

    const particles: Particle[] = [];
    // Adjust density dynamically based on viewport dimensions
    const particleCount = width < 600 ? 32 : 55;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35, // Smooth floating movement
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2 + 1, // 1px to 3px sized red energy dots
        baseOpacity: Math.random() * 0.45 + 0.35, // Highly legible atmospheric glow
      });
    }

    // Adapt to window resize changes
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Throttled render tick (~30fps) without expensive shadow blur
    let last = 0;
    const render = (now: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (now - last < 33) return;
      last = now;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150, 212, 0, ${p.baseOpacity})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          const maxDist = 130;
          if (distSq < maxDist * maxDist) {
            const opacity = (1 - Math.sqrt(distSq) / maxDist) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(150, 212, 0, ${opacity})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black select-none pointer-events-none">
      {/* High performance dynamic particle simulation canvas with z-10 index to stay above overlays */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-90 z-10" />

      {/* Cybernetic Dark Vignettes for ultimate futuristic legibility and immersion */}
      <div className="absolute inset-0 bg-black/40 z-1" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/25 to-black/95 z-2" />

      {/* Radiant atmospheric bottom red grid fog overlay */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-[#96D400]/5 to-transparent blur-2xl z-3" />
    </div>
  );
};
