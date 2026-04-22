import { motion, useAnimation, useInView } from 'framer-motion';
import { PropsWithChildren, RefObject, useEffect } from 'react';

type AgentCardProps = PropsWithChildren<{
  title: string;
  description: string;
  accent: string;
  cardRef: RefObject<HTMLElement>;
}>;

export function AgentCard({ title, description, accent, cardRef, children }: AgentCardProps) {
  const controls = useAnimation();
  const isInView = useInView(cardRef, { amount: 0.45 });

  useEffect(() => {
    controls.start(
      isInView
        ? {
            opacity: 1,
            y: 0,
          }
        : {
            opacity: 0,
            y: 40,
          },
    );
  }, [controls, isInView]);

  return (
    <motion.article
      ref={cardRef}
      animate={controls}
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative z-10 rounded-2xl border border-slate-700/70 bg-slate-900/90 p-6 shadow-lg shadow-black/25 backdrop-blur"
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-slate-300">{description}</p>
      {children}
    </motion.article>
  );
}
