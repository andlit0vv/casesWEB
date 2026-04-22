import { RefObject, useEffect, useMemo, useState } from 'react';

export type AnchorSide = 'left' | 'right' | 'top' | 'bottom';

export type AnchorPoint = {
  x: number;
  y: number;
};

type Connection = {
  fromId: string;
  toId: string;
  fromSide: AnchorSide;
  toSide: AnchorSide;
};

type AgentRefs = Record<string, RefObject<HTMLElement>>;

const EXIT_OFFSET = 28;

const clampToContainer = (v: number, max: number): number => Math.max(0, Math.min(v, max));

const getAnchorPoint = (rect: DOMRect, side: AnchorSide, containerRect: DOMRect): AnchorPoint => {
  switch (side) {
    case 'left':
      return { x: rect.left - containerRect.left, y: rect.top - containerRect.top + rect.height / 2 };
    case 'right':
      return { x: rect.right - containerRect.left, y: rect.top - containerRect.top + rect.height / 2 };
    case 'top':
      return { x: rect.left - containerRect.left + rect.width / 2, y: rect.top - containerRect.top };
    case 'bottom':
      return { x: rect.left - containerRect.left + rect.width / 2, y: rect.bottom - containerRect.top };
    default:
      return { x: 0, y: 0 };
  }
};

const moveAway = (point: AnchorPoint, side: AnchorSide): AnchorPoint => {
  switch (side) {
    case 'left':
      return { x: point.x - EXIT_OFFSET, y: point.y };
    case 'right':
      return { x: point.x + EXIT_OFFSET, y: point.y };
    case 'top':
      return { x: point.x, y: point.y - EXIT_OFFSET };
    case 'bottom':
      return { x: point.x, y: point.y + EXIT_OFFSET };
  }
};

const buildRoute = (
  start: AnchorPoint,
  end: AnchorPoint,
  fromSide: AnchorSide,
  toSide: AnchorSide,
  width: number,
  height: number,
): string => {
  const startExit = moveAway(start, fromSide);
  const endEntry = moveAway(end, toSide);

  const points: AnchorPoint[] = [start, startExit];

  const horizontalFlow = fromSide === 'left' || fromSide === 'right' || toSide === 'left' || toSide === 'right';

  if (horizontalFlow) {
    const midX = clampToContainer((startExit.x + endEntry.x) / 2, width);
    points.push({ x: midX, y: startExit.y });
    points.push({ x: midX, y: endEntry.y });
  } else {
    const midY = clampToContainer((startExit.y + endEntry.y) / 2, height);
    points.push({ x: startExit.x, y: midY });
    points.push({ x: endEntry.x, y: midY });
  }

  points.push(endEntry, end);

  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ');
};

export function useFlowPath(
  containerRef: RefObject<HTMLElement>,
  agentRefs: AgentRefs,
  connections: Connection[],
): string {
  const [path, setPath] = useState('');

  const observedRefs = useMemo(() => Object.values(agentRefs), [agentRefs]);

  useEffect(() => {
    const recalculate = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const width = containerRect.width;
      const height = containerRect.height;

      const pathSegments = connections
        .map((connection) => {
          const fromEl = agentRefs[connection.fromId]?.current;
          const toEl = agentRefs[connection.toId]?.current;

          if (!fromEl || !toEl) return null;

          const fromRect = fromEl.getBoundingClientRect();
          const toRect = toEl.getBoundingClientRect();

          const start = getAnchorPoint(fromRect, connection.fromSide, containerRect);
          const end = getAnchorPoint(toRect, connection.toSide, containerRect);

          return buildRoute(start, end, connection.fromSide, connection.toSide, width, height);
        })
        .filter((segment): segment is string => Boolean(segment));

      setPath(pathSegments.join(' '));
    };

    recalculate();

    const observer = new ResizeObserver(() => recalculate());

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    observedRefs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    window.addEventListener('resize', recalculate);
    window.addEventListener('scroll', recalculate, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', recalculate);
      window.removeEventListener('scroll', recalculate);
    };
  }, [agentRefs, connections, containerRef, observedRefs]);

  return path;
}
