import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  velocity: { x: number; y: number };
  rotation: number;
  rotationSpeed: number;
}

interface HeartParticlesProps {
  onComplete: () => void;
  count?: number;
  originY?: number;
}

export const HeartParticles = ({ onComplete, count = 20, originY = 50 }: HeartParticlesProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = [
      'hsl(350, 100%, 70%)',
      'hsl(340, 90%, 65%)',
      'hsl(0, 90%, 70%)',
      'hsl(330, 95%, 75%)',
      'hsl(0, 100%, 60%)',
    ];

    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: originY,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocity: {
        x: (Math.random() - 0.5) * 4,
        y: -Math.random() * 6 - 2,
      },
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    }));

    setParticles(newParticles);

    const animationInterval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: p.x + p.velocity.x,
          y: p.y + p.velocity.y,
          velocity: {
            x: p.velocity.x * 0.98,
            y: p.velocity.y + 0.3,
          },
          rotation: p.rotation + p.rotationSpeed,
        }))
      );
    }, 16);

    const timeout = setTimeout(() => {
      clearInterval(animationInterval);
      onComplete();
    }, 2000);

    return () => {
      clearInterval(animationInterval);
      clearTimeout(timeout);
    };
  }, [count, originY, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute transition-opacity duration-1000"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: `rotate(${particle.rotation}deg)`,
            opacity: Math.max(0, 1 - particle.y / 100),
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={particle.color}
            className="drop-shadow-lg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
};
