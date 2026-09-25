import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'patient' | 'clinic' | 'ai_hub' | 'sensor';
  color: string;
  pulsePhase: number;
}

interface Pulse {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
}

export const CyberBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = !document.hidden;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Mouse coordinates
    const mouse = { x: -1000, y: -1000, radius: 140 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Generate nodes based on screen size
    const nodeCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 22000), 55);
    const nodes: Node[] = [];
    const colors = {
      patient: '#06b6d4', // cyan
      clinic: '#3b82f6',  // electric blue
      ai_hub: '#10b981',  // terminal green
      sensor: '#38bdf8',  // light cyan
    };

    const types: ('patient' | 'clinic' | 'ai_hub' | 'sensor')[] = ['patient', 'sensor', 'clinic', 'ai_hub'];

    for (let i = 0; i < nodeCount; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (prefersReducedMotion ? 0.05 : 0.4),
        vy: (Math.random() - 0.5) * (prefersReducedMotion ? 0.05 : 0.4),
        radius: type === 'ai_hub' ? 3.5 : type === 'clinic' ? 3.0 : 2.0,
        type,
        color: colors[type],
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Active data pulses traversing connections
    const pulses: Pulse[] = [];
    const maxPulses = 12;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid overlay
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 48;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update and draw connections
      const maxDistance = 140;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];

        // Position update
        a.x += a.vx;
        a.y += a.vy;

        // Wall bounce
        if (a.x < 0 || a.x > canvas.width) a.vx *= -1;
        if (a.y < 0 || a.y > canvas.height) a.vy *= -1;

        // Gentle cursor interaction
        const dxMouse = mouse.x - a.x;
        const dyMouse = mouse.y - a.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < mouse.radius && !prefersReducedMotion) {
          const force = (mouse.radius - distMouse) / mouse.radius;
          a.x -= (dxMouse / distMouse) * force * 1.5;
          a.y -= (dyMouse / distMouse) * force * 1.5;
        }

        // Draw connections to nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.18;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Randomly create pulses between connected nodes
            if (pulses.length < maxPulses && Math.random() < 0.003 && !prefersReducedMotion) {
              pulses.push({
                fromNode: i,
                toNode: j,
                progress: 0,
                speed: 0.008 + Math.random() * 0.012,
                color: a.color,
              });
            }
          }
        }

        // Draw node
        a.pulsePhase += 0.03;
        const pulseFactor = Math.sin(a.pulsePhase) * 0.5 + 1;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.radius * pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = a.color;
        ctx.fill();

        // Node glow
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `${a.color}15`;
        ctx.fill();
      }

      // Update and draw data pulses
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;

        const from = nodes[pulse.fromNode];
        const to = nodes[pulse.toNode];

        if (!from || !to || pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const currentX = from.x + (to.x - from.x) * pulse.progress;
        const currentY = from.y + (to.y - from.y) * pulse.progress;

        ctx.beginPath();
        ctx.arc(currentX, currentY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = pulse.color;
        ctx.shadowColor = pulse.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      aria-hidden="true"
    />
  );
};
