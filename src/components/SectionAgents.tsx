import { useMemo, useRef } from 'react';
import { AgentCard } from './AgentCard';
import { FlowLine } from './FlowLine';
import { AnchorSide, useFlowPath } from '../hooks/useFlowPath';

type Agent = {
  id: string;
  title: string;
  description: string;
  accent: string;
};

type Connection = {
  fromId: string;
  toId: string;
  fromSide: AnchorSide;
  toSide: AnchorSide;
};

const AGENTS: Agent[] = [
  {
    id: 'planner',
    title: 'Planner Agent',
    description: 'Понимает задачу, декомпозирует шаги и создаёт маршрут выполнения.',
    accent: '#38bdf8',
  },
  {
    id: 'operator',
    title: 'Operator Agent',
    description: 'Запускает операции, вызывает API и выполняет оркестрацию сервисов.',
    accent: '#22d3ee',
  },
  {
    id: 'formatter',
    title: 'Formatter Agent',
    description: 'Нормализует результат, приводит формат к ожидаемой структуре интерфейса.',
    accent: '#818cf8',
  },
  {
    id: 'editor',
    title: 'Editor Agent',
    description: 'Проверяет качество, вносит правки и отдаёт финальный ответ пользователю.',
    accent: '#c084fc',
  },
];

const CONNECTIONS: Connection[] = [
  { fromId: 'planner', toId: 'operator', fromSide: 'right', toSide: 'left' },
  { fromId: 'operator', toId: 'formatter', fromSide: 'bottom', toSide: 'top' },
  { fromId: 'formatter', toId: 'editor', fromSide: 'right', toSide: 'left' },
];

export function SectionAgents() {
  const containerRef = useRef<HTMLElement>(null);

  const plannerRef = useRef<HTMLElement>(null);
  const operatorRef = useRef<HTMLElement>(null);
  const formatterRef = useRef<HTMLElement>(null);
  const editorRef = useRef<HTMLElement>(null);

  const agentRefs = useMemo(
    () => ({
      planner: plannerRef,
      operator: operatorRef,
      formatter: formatterRef,
      editor: editorRef,
    }),
    [],
  );

  const path = useFlowPath(containerRef, agentRefs, CONNECTIONS);

  return (
    <section ref={containerRef} className="relative">
      <header className="mb-10 max-w-2xl">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-cyan-300">Architecture</p>
        <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Цепочка агентов</h2>
        <p className="text-slate-300">
          Единый flow-маршрут визуально показывает как задача проходит через всех агентов.
        </p>
      </header>

      <div className="relative">
        <FlowLine path={path} containerRef={containerRef} />

        <div className="relative z-10 grid gap-6 sm:grid-cols-2">
          <AgentCard cardRef={plannerRef} title={AGENTS[0].title} description={AGENTS[0].description} accent={AGENTS[0].accent} />

          <AgentCard cardRef={operatorRef} title={AGENTS[1].title} description={AGENTS[1].description} accent={AGENTS[1].accent} />

          <AgentCard cardRef={formatterRef} title={AGENTS[2].title} description={AGENTS[2].description} accent={AGENTS[2].accent} />

          <AgentCard cardRef={editorRef} title={AGENTS[3].title} description={AGENTS[3].description} accent={AGENTS[3].accent} />
        </div>
      </div>
    </section>
  );
}
