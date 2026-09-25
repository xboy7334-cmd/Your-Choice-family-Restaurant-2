import { useEffect, useRef } from 'react';
export default function Confetti() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current; if (!element) return;
    const context = element.getContext('2d'); if (!context) return;
    const dpr = window.devicePixelRatio || 1;
    element.width = window.innerWidth * dpr; element.height = window.innerHeight * dpr;
    element.style.width = `${window.innerWidth}px`; element.style.height = `${window.innerHeight}px`;
    context.scale(dpr, dpr);
    const colors = ['#7C6FE9', '#34D399', '#FFC87A', '#F78CA8', '#E9E6FF'];
    const pieces = Array.from({ length: 130 }, () => ({ x: Math.random() * window.innerWidth, y: -20 - Math.random() * window.innerHeight * .5, size: 4 + Math.random() * 6, speed: 2 + Math.random() * 4, drift: Math.random() * 2 - 1, color: colors[Math.floor(Math.random() * colors.length)], rotation: Math.random() * 6, spin: Math.random() * .15 - .075 }));
    let frame = 0; let animation = 0;
    const draw = () => { if (!context) return; context.clearRect(0, 0, window.innerWidth, window.innerHeight); pieces.forEach((piece) => { piece.y += piece.speed; piece.x += piece.drift; piece.rotation += piece.spin; context.save(); context.translate(piece.x, piece.y); context.rotate(piece.rotation); context.fillStyle = piece.color; context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * .65); context.restore(); }); frame += 1; if (frame < 190) animation = requestAnimationFrame(draw); };
    animation = requestAnimationFrame(draw); return () => cancelAnimationFrame(animation);
  }, []);
  return <canvas ref={canvas} className="confetti-canvas" aria-hidden="true" />;
}
