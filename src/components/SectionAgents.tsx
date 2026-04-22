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

const SOLUTIONS = [
  {
    title: 'Единый вход',
    description: 'Все задачи поступают в один контур и обрабатываются по предсказуемому сценарию.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 8h12" />
        <path d="M4 12h12" />
        <path d="M4 16h12" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    ),
  },
  {
    title: 'Поэтапная генерация',
    description: 'Контент создаётся шаг за шагом: сначала структура, затем наполнение и финальное оформление.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="6" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="18" cy="12" r="2" />
        <path d="M8 12h2" />
        <path d="M14 12h2" />
      </svg>
    ),
  },
  {
    title: 'Контроль качества на выходе',
    description: 'Перед отдачей результата выполняется проверка на соответствие формату и требованиям.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3 5 6v6c0 4.5 2.8 7 7 9 4.2-2 7-4.5 7-9V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

const EXAMPLE_FLOW = [
  'Отправка на модерацию',
  'Ввод параметров: цена, название поста и объём (в символах)',
  'Генерация черновика',
  'Проверка и финальная выдача',
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
    <section ref={containerRef} className="relative space-y-16">
      <section className="space-y-6">
        <header className="max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-cyan-300">Решения</p>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Что даёт система</h2>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {SOLUTIONS.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-5 shadow-lg shadow-black/20"
            >
              <div className="mb-3 inline-flex rounded-lg bg-cyan-500/10 p-2 text-cyan-300">{item.icon}</div>
              <h3 className="mb-2 text-base font-semibold text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed text-slate-300">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <header className="max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-cyan-300">Пример использования</p>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Как проходит задача</h2>
        </header>

        <ol className="space-y-3 rounded-2xl border border-slate-700/70 bg-slate-900/70 p-6">
          {EXAMPLE_FLOW.map((step, index) => (
            <li key={step} className="flex items-start gap-3 text-slate-200">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-xs font-semibold text-cyan-200">
                {index + 1}
              </span>
              <span className="text-sm leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-6">
        <header className="max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-cyan-300">Architecture</p>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Цепочка агентов</h2>
          <p className="text-slate-300">
            Единый flow-маршрут визуально показывает как задача проходит через всех агентов.
          </p>
        </header>

        <div className="relative">
          <FlowLine path={path} containerRef={containerRef} />

          <div className="relative z-10 grid grid-cols-2 gap-6">
            <AgentCard cardRef={plannerRef} title={AGENTS[0].title} description={AGENTS[0].description} accent={AGENTS[0].accent} />

            <AgentCard cardRef={operatorRef} title={AGENTS[1].title} description={AGENTS[1].description} accent={AGENTS[1].accent} />

            <AgentCard cardRef={formatterRef} title={AGENTS[2].title} description={AGENTS[2].description} accent={AGENTS[2].accent} />

            <AgentCard cardRef={editorRef} title={AGENTS[3].title} description={AGENTS[3].description} accent={AGENTS[3].accent} />
          </div>
        </div>
      </section>
    </section>
  );
}
