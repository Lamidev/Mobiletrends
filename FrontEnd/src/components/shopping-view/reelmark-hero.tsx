'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export interface HeroGadgetCard {
  id: string;
  title: string;
  category: string;
  image: string;
}

interface ReelmarkHeroProps {
  products?: any[];
  onSelectProduct?: (productId: string) => void;
  onExploreClick?: () => void;
}

const STOCK_GADGET_CARDS: HeroGadgetCard[] = [
  {
    id: 'stock-1',
    title: 'iPhone 16 Pro Max',
    category: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'stock-2',
    title: 'MacBook Pro M3 Max',
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'stock-3',
    title: 'AirPods Max Studio',
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'stock-4',
    title: 'Galaxy S24 Ultra',
    category: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'stock-5',
    title: 'Apple Watch Ultra 2',
    category: 'Smartwatches',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'stock-6',
    title: 'iPad Pro M4 OLED',
    category: 'Tablets',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'stock-7',
    title: 'Sony WH-1000XM5',
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'stock-8',
    title: 'Dell XPS 16 OLED',
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'stock-9',
    title: 'Google Pixel 9 Pro',
    category: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'stock-10',
    title: 'PlayStation 5 Pro',
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=85',
  },
];

const CARD_COUNT = STOCK_GADGET_CARDS.length; // 10
const PITCH = 196;
const TOTAL_TRACK = CARD_COUNT * PITCH; // 1960 units

/**
 * Computes a rounded-corner SVG path for an arbitrary 4-vertex quad (trapezoid)
 * so the cylindrical perspective cards have smooth 15u corners along angled top/bottom edges.
 */
function buildRoundedQuadPath(
  pts: [number, number][],
  r: number
): string {
  const n = pts.length;
  let d = '';

  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n];
    const curr = pts[i];
    const next = pts[(i + 1) % n];

    const v1x = prev[0] - curr[0];
    const v1y = prev[1] - curr[1];
    const len1 = Math.hypot(v1x, v1y) || 1;
    const r1 = Math.min(r, len1 * 0.45);

    const v2x = next[0] - curr[0];
    const v2y = next[1] - curr[1];
    const len2 = Math.hypot(v2x, v2y) || 1;
    const r2 = Math.min(r, len2 * 0.45);

    const p1x = curr[0] + (v1x / len1) * r1;
    const p1y = curr[1] + (v1y / len1) * r1;

    const p2x = curr[0] + (v2x / len2) * r2;
    const p2y = curr[1] + (v2y / len2) * r2;

    if (i === 0) {
      d += `M ${p1x.toFixed(2)} ${p1y.toFixed(2)} `;
    } else {
      d += `L ${p1x.toFixed(2)} ${p1y.toFixed(2)} `;
    }
    d += `Q ${curr[0].toFixed(2)} ${curr[1].toFixed(2)} ${p2x.toFixed(2)} ${p2y.toFixed(2)} `;
  }

  d += 'Z';
  return `path('${d}')`;
}

export default function ReelmarkHero({
  onExploreClick,
}: ReelmarkHeroProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pointerDownPosRef = useRef<{ x: number; y: number } | null>(null);
  const didDragRef = useRef(false);

  // Cylindrical curve + continuous drift + drag momentum physics loop
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let offset = 0;
    let velocity = 0; // extra fling velocity in frame units / sec
    let isDragging = false;
    let lastPointerX = 0;
    let lastMoveTime = performance.now();
    let lastFrameTime = performance.now();
    let rafId = 0;

    const getStageMetrics = () => {
      const rect = stage.getBoundingClientRect();
      // Responsive virtual coordinate width:
      // Phones (<= 540px): 520u scale so cards are large & prominent (~125px x 210px+)
      // Small tablets (<= 820px): 680u scale
      // Desktop (> 820px): 1440u scale
      const virtualWidth =
        rect.width <= 540 ? 520 : rect.width <= 820 ? 680 : 1440;
      const u = rect.width / virtualWidth;
      const centerX = virtualWidth / 2;
      const curveRadius =
        rect.width <= 540 ? 310 : rect.width <= 820 ? 390 : 706;
      const centerY = rect.height / (u || 1) / 2 + 6;
      return { u, virtualWidth, centerX, curveRadius, centerY };
    };

    const renderFrame = (now: number) => {
      const dt = Math.min(0.064, Math.max(0.001, (now - lastFrameTime) / 1000));
      lastFrameTime = now;

      const { u, virtualWidth, centerX, curveRadius, centerY } =
        getStageMetrics();

      if (!isDragging) {
        const autoSpeed = prefersReducedMotion ? 0 : 50; // 50 frame units / sec right -> left
        offset -= (autoSpeed + velocity) * dt;
        // Momentum velocity decays ~95% per second
        velocity *= Math.pow(0.05, dt);
        if (Math.abs(velocity) < 0.5) velocity = 0;
      }

      // Position and warp each of the 10 cards along the cylinder
      for (let i = 0; i < CARD_COUNT; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        // Unpushed offset t relative to center, wrapped in [-TOTAL_TRACK/2, TOTAL_TRACK/2]
        const raw = i * PITCH + offset;
        const wrapped =
          ((((raw + TOTAL_TRACK / 2) % TOTAL_TRACK) + TOTAL_TRACK) % TOTAL_TRACK) -
          TOTAL_TRACK / 2;
        const t = wrapped;

        // Push centers outward to preserve ~26u gap even as cards widen near edges
        const x = centerX + t * (1 + 0.083 * Math.pow(t / curveRadius, 2));
        const d = Math.abs(x - centerX) / curveRadius;

        // Card width grows toward the cylinder edges
        const w = 170 + 48 * d * d;
        const xL = x - w / 2;
        const xR = x + w / 2;

        // Left & right vertical edge heights computed from each edge's own normalized distance q
        const qL = Math.abs(xL - centerX) / curveRadius;
        const qR = Math.abs(xR - centerX) / curveRadius;

        const hL = 280 + 92 * Math.pow(qL, 2.6);
        const hR = 280 + 92 * Math.pow(qR, 2.6);

        // Vertical center rises slightly toward edges
        const yC = centerY - 12 * d * d;
        const maxH = Math.max(hL, hR);
        const topBox = yC - maxH / 2;

        // Convert to pixels using current frame scale u
        const boxW = w * u;
        const boxH = maxH * u;
        const leftPx = xL * u;
        const topPx = topBox * u;

        const yTL = ((maxH - hL) / 2) * u;
        const yBL = yTL + hL * u;
        const yTR = ((maxH - hR) / 2) * u;
        const yBR = yTR + hR * u;

        const cornerR = Math.max(10, 15 * u);
        const clipPath = buildRoundedQuadPath(
          [
            [0, yTL],
            [boxW, yTR],
            [boxW, yBR],
            [0, yBL],
          ],
          cornerR
        );

        el.style.width = `${boxW.toFixed(1)}px`;
        el.style.height = `${boxH.toFixed(1)}px`;
        el.style.transform = `translate3d(${leftPx.toFixed(1)}px, ${topPx.toFixed(1)}px, 0)`;
        el.style.clipPath = clipPath;
        (el.style as any).webkitClipPath = clipPath;

        // Hide cards completely outside the viewport to avoid overdraw
        const isVisible = xR > -80 && xL < virtualWidth + 80;
        el.style.visibility = isVisible ? 'visible' : 'hidden';
      }

      rafId = requestAnimationFrame(renderFrame);
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      didDragRef.current = false;
      pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
      lastPointerX = e.clientX;
      lastMoveTime = performance.now();
      velocity = 0;
      stage.classList.add('cursor-grabbing');
      stage.classList.remove('cursor-grab');
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const now = performance.now();
      const dt = Math.max(0.004, (now - lastMoveTime) / 1000);
      const dxPx = e.clientX - lastPointerX;

      if (
        pointerDownPosRef.current &&
        Math.hypot(e.clientX - pointerDownPosRef.current.x, e.clientY - pointerDownPosRef.current.y) > 6
      ) {
        didDragRef.current = true;
      }

      const u = getStageMetrics().u || 1;
      const dxUnits = dxPx / u;

      offset += dxUnits;
      const instantVel = -dxUnits / dt;
      velocity = velocity * 0.6 + instantVel * 0.4;

      lastPointerX = e.clientX;
      lastMoveTime = now;
    };

    const handlePointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      stage.classList.remove('cursor-grabbing');
      stage.classList.add('cursor-grab');
    };

    stage.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    rafId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(rafId);
      stage.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  const handleCardClick = () => {
    if (didDragRef.current) return;
    if (onExploreClick) {
      onExploreClick();
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#fafaf8] pt-10 sm:pt-14 pb-12 sm:pb-16 select-none border-b border-[#daddd4] font-body">
      {/* Subtle studio ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[420px] bg-gradient-to-b from-[#0C1172]/[0.035] via-[#DF5E00]/[0.015] to-transparent blur-3xl" />

      {/* Top Copy + Handwritten Notes Container */}
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8 flex flex-col items-center text-center z-10">
        {/* Big Bold Headline (2 lines, no top pill) */}
        <div className="relative max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.65, delay: 0.05, ease: 'easeOut' }}
            className="font-manrope text-[36px] xs:text-[42px] sm:text-[62px] lg:text-[78px] font-bold text-[#20231e] leading-[1.06] tracking-[-0.04em]"
          >
            Upgrade Your World
            <span className="block tracking-[-0.035em] text-[#111344]">
              with <span className="text-[#DF5E00]">Flagship</span> Gadgets
            </span>
          </motion.h1>

          {/* Left "//" Doodle Stroke */}
          <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            viewBox="0 0 44 44"
            fill="none"
            className="hidden md:block absolute -bottom-10 -left-16 lg:-left-24 w-9 h-9 text-[#0C1172]"
          >
            <motion.path
              d="M18 6 L6 34 M34 8 L22 36"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            />
          </motion.svg>

          {/* Right Handwritten Note + Curved Arrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="hidden lg:flex flex-col items-center absolute -right-40 xl:-right-52 top-20 pointer-events-none"
          >
            <div className="font-caveat rotate-[16deg] text-[#0C1172] text-[25px] font-semibold leading-[1.05] text-center">
              <span>100% Authentic</span>
              <span className="block text-[#DF5E00]">flagship tech</span>
            </div>
            {/* Curving arrow starting strictly below the note and curling down to the cards */}
            <svg
              viewBox="0 0 90 95"
              fill="none"
              className="w-20 h-20 mt-1 text-[#0C1172]"
            >
              <motion.path
                d="M12 10 C 62 12, 78 46, 38 76"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.75 }}
              />
              <motion.path
                d="M36 63 L36 78 L52 76"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 1.35 }}
              />
            </svg>
          </motion.div>
        </div>

        {/* High-Converting Universal Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="font-body mt-5 max-w-[620px] text-[#62665d] text-[13.5px] sm:text-[15.5px] leading-[1.75] font-normal"
        >
          Whether you are building projects, creating 4K content, gaming, or
          elevating your daily workflow, get factory sealed brand new and clean
          UK used devices with verified battery health and real warranty.
        </motion.p>
      </div>

      {/* Curved Cylindrical 10-Card Carousel Band (Pure Stock Images) */}
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.35, ease: 'easeOut' }}
        className="relative w-full mt-5 sm:mt-6 overflow-hidden"
      >
        <div
          ref={stageRef}
          className="relative mx-auto w-full max-w-[1440px] h-[310px] sm:h-[360px] md:h-[395px] lg:h-[420px] cursor-grab touch-pan-y"
        >
          {STOCK_GADGET_CARDS.map((item, idx) => (
            <div
              key={item.id}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className="group absolute top-0 left-0 overflow-hidden bg-[#E5E8F0] will-change-transform"
            >
              {/* Cover-fitted Stock Gadget Image */}
              <img
                src={item.image}
                alt={item.title}
                draggable={false}
                className="w-full h-full object-cover object-center pointer-events-none transition-transform duration-700 group-hover:scale-105"
              />

              
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom CTA Button inside Dashed Outline Ring + Handwritten Note */}
      <div className="relative mt-6 sm:mt-8 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          {/* Handwritten "Best deals" Note + Small Arrow */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="hidden sm:flex items-center absolute -left-36 -bottom-2 pointer-events-none"
          >
            <span className="font-caveat rotate-[20deg] text-[#0C1172] text-[24px] font-semibold whitespace-nowrap mr-1">
              Best deals
            </span>
            <svg
              viewBox="0 0 56 36"
              fill="none"
              className="w-12 h-8 -mt-4 text-[#DF5E00]"
            >
              <motion.path
                d="M4 6 C 18 22, 34 24, 48 18"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              />
              <motion.path
                d="M40 12 L49 18 L42 26"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, delay: 1.35 }}
              />
            </svg>
          </motion.div>

          {/* Dashed Outline Ring wrapping the Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="p-1.5 rounded-[8px] border-[1.5px] border-dashed border-[#0C1172]/45 hover:border-[#0C1172] transition-colors"
          >
            <button
              type="button"
              onClick={onExploreClick}
              className="font-manrope h-[52px] px-9 rounded-[6px] bg-[#111344] hover:bg-[#0C1172] text-white text-[14px] sm:text-[15px] font-semibold tracking-tight shadow-md transition-all duration-300 active:scale-95 cursor-pointer"
            >
              Explore Gadgets
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
