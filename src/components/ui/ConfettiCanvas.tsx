import React, { useEffect, useRef } from 'react';

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  opacity: number;
}

export const ConfettiCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const colors = ['#00C2D1', '#F5B942', '#10B981', '#EC4899', '#3B82F6', '#8B5CF6'];
    const pieces: ConfettiPiece[] = [];

    for (let i = 0; i < 75; i++) {
      pieces.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.4) - 50,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        opacity: 1.0,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      let activePieces = 0;
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        if (p.y > height * 0.7) {
          p.opacity -= 0.015;
        }

        if (p.opacity > 0) {
          activePieces++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      }

      if (activePieces > 0) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 select-none"
    />
  );
};
