import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
};

const MAX = 90;
const COLORS = ["#7ee787", "#7aa2f7"];

export function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 触屏设备没有光标，粒子只会被误解成卡顿；尊重系统的减弱动效设置
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let boxW = 0;
    let boxH = 0;
    let originX = 0;
    let originY = 0;
    let raf = 0;
    let prev: { x: number; y: number } | null = null;
    const parts: Particle[] = [];

    // canvas 是替换元素，`fixed inset-0` 只会把它摆成固有尺寸而不会拉伸，
    // 所以必须显式写 CSS 宽高。用 clientWidth 而不是 innerWidth：后者含滚动条，
    // 而 fixed 元素的可视区不含，混用会让画面被横向压缩、粒子跟鼠标对不上。
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      boxW = document.documentElement.clientWidth;
      boxH = document.documentElement.clientHeight;
      canvas.style.width = `${boxW}px`;
      canvas.style.height = `${boxH}px`;
      canvas.width = Math.round(boxW * dpr);
      canvas.height = Math.round(boxH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const rect = canvas.getBoundingClientRect();
      originX = rect.left;
      originY = rect.top;
    };

    const draw = () => {
      ctx.clearRect(0, 0, boxW, boxH);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.9;
        p.vy *= 0.9;
        p.life -= 0.035;
        if (p.life <= 0) {
          parts.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life * 0.5;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      // 空了就停掉循环，不一直占着帧
      if (parts.length === 0) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(draw);
    };

    const spawn = (x: number, y: number) => {
      if (parts.length >= MAX) parts.shift();
      parts.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        life: 1,
        size: 1.4 + Math.random() * 2.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    };

    const onMove = (e: PointerEvent) => {
      const x = e.clientX - originX;
      const y = e.clientY - originY;
      if (prev) {
        // 沿两帧之间的路径补点，否则快速移动时拖尾会断成一节一节的
        const dx = x - prev.x;
        const dy = y - prev.y;
        const steps = Math.min(5, Math.max(1, Math.round(Math.hypot(dx, dy) / 10)));
        for (let i = 1; i <= steps; i++) spawn(prev.x + (dx * i) / steps, prev.y + (dy * i) / steps);
      } else {
        spawn(x, y);
      }
      prev = { x, y };
      if (!raf) raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
