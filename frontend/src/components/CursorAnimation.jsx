import React, { useEffect, useRef } from 'react';

export default function CursorAnimation() {
  const canvasRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        // Random velocity drifting slightly upwards
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.7) * 1.5;
        this.size = Math.random() * 3 + 1;
        this.maxLife = Math.random() * 40 + 30;
        this.life = this.maxLife;
        // Alternate colors between primary violet and accent cyan
        const h = Math.random() > 0.5 ? 263 : 190;
        this.color = `hsla(${h}, 90%, 65%, `;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
      }

      draw(c) {
        const opacity = this.life / this.maxLife;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = this.color + `${opacity})`;
        c.fill();
        
        // Add subtle bloom glow for larger particles
        if (this.size > 2) {
          c.shadowBlur = 8;
          c.shadowColor = this.color === 263 ? 'rgba(139, 92, 246, 0.4)' : 'rgba(6, 182, 212, 0.4)';
        } else {
          c.shadowBlur = 0;
        }
      }
    }

    let particles = [];
    let mouse = { x: null, y: null };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Move the custom cursor dot immediately
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
      
      // Move the custom cursor ring (with a slight delay in transition handled by CSS)
      if (ringRef.current) {
        ringRef.current.style.left = `${e.clientX}px`;
        ringRef.current.style.top = `${e.clientY}px`;
      }

      // Spawn particles
      for (let i = 0; i < 2; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
      }
    };

    // Check hover states on interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'SELECT' || 
        target.tagName === 'TEXTAREA' ||
        target.closest('.glass-card-interactive') ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]');
      
      if (isInteractive) {
        document.body.classList.add('cursor-hover');
      } else {
        document.body.classList.remove('cursor-hover');
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('resize', handleResize);

    // Canvas animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Limit total particles to maintain performance
      if (particles.length > 150) {
        particles.shift();
      }

      particles.forEach((particle, index) => {
        particle.update();
        if (particle.life <= 0) {
          particles.splice(index, 1);
        } else {
          particle.draw(ctx);
        }
      });

      // Draw active connection lines between close particles for a neural network effect
      ctx.lineWidth = 0.5;
      ctx.shadowBlur = 0;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80) {
            const alpha = (1 - dist / 80) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('resize', handleResize);
      document.body.classList.remove('cursor-hover');
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div ref={dotRef} className="custom-cursor" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  );
}
