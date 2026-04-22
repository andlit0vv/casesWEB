import { motion, useScroll, useTransform } from 'framer-motion';
import { RefObject, useEffect, useRef, useState } from 'react';

type FlowLineProps = {
  path: string;
  containerRef: RefObject<HTMLElement>;
};

export function FlowLine({ path, containerRef }: FlowLineProps) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathLength, setPathLength] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const drawProgress = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0, 1, 0]);
  const dashOffset = useTransform(drawProgress, (progress) => pathLength * (1 - progress));
  const opacity = useTransform(scrollYProgress, [0.05, 0.2, 0.85, 1], [0, 1, 1, 0]);

  useEffect(() => {
    if (!pathRef.current || !path) return;
    setPathLength(pathRef.current.getTotalLength());
  }, [path]);

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      role="presentation"
      aria-hidden="true"
    >
      <motion.path
        ref={pathRef}
        d={path}
        fill="none"
        stroke="rgb(56 189 248 / 0.9)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="10 9"
        style={{ strokeDashoffset: dashOffset, opacity }}
      />
    </svg>
  );
}
