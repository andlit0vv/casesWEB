import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    const hdr = document.getElementById('hdr');
    const mobileToggle = document.getElementById('mobileNavToggle');
    const mobileNav = document.getElementById('mobileNav');
    const casesToggle = document.getElementById('casesToggle');
    const casesDropdown = document.getElementById('casesDropdown');
    const roadmap = document.querySelector('.roadmap-vertical') as HTMLElement | null;
    const openBriefBtn = document.getElementById('openBriefBtn');
    const briefModal = document.getElementById('briefModal');
    const closeBriefBtn = document.getElementById('closeBriefBtn');
    const briefForm = briefModal?.querySelector('form');

    const onScroll = () => {
      hdr?.classList.toggle('scrolled', window.scrollY > 40);
    };

    const onMobileClick = () => {
      mobileNav?.classList.toggle('open');
    };

    const onCasesClick = (event: Event) => {
      event.stopPropagation();
      if (!casesDropdown || !casesToggle) return;
      const isOpen = casesDropdown.classList.toggle('open');
      casesToggle.setAttribute('aria-expanded', String(isOpen));
    };

    const closeBriefModal = () => {
      if (!briefModal) return;
      briefModal.classList.remove('open');
      document.body.style.overflow = '';
    };

    const openBriefModal = () => {
      if (!briefModal) return;
      briefModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const onOpenBrief = (event: Event) => {
      event.preventDefault();
      openBriefModal();
    };

    const onModalBackdrop = (event: Event) => {
      if (event.target === briefModal) {
        closeBriefModal();
      }
    };

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeBriefModal();
      }
    };

    const onFormSubmit = (event: Event) => {
      event.preventDefault();
      closeBriefModal();
    };

    const onDocClick = (event: Event) => {
      if (!casesDropdown || !casesToggle) return;
      if (!casesDropdown.contains(event.target as Node) && !casesToggle.contains(event.target as Node)) {
        casesDropdown.classList.remove('open');
        casesToggle.setAttribute('aria-expanded', 'false');
      }
    };

    const reveals = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' },
    );

    reveals.forEach((el) => obs.observe(el));

    const roadmapItems = document.querySelectorAll('.roadmap-item');
    const roadmapObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -15% 0px' },
    );
    roadmapItems.forEach((item) => roadmapObs.observe(item));

    const architectureNodes = document.querySelectorAll('.architecture-system .agent-node');
    const architectureObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('visible', entry.isIntersecting);
        });
      },
      { threshold: 0.2, rootMargin: '-8% 0px -8% 0px' },
    );
    architectureNodes.forEach((node) => architectureObs.observe(node));

    const updateRoadmapProgress = () => {
      if (!roadmap) return;
      const rect = roadmap.getBoundingClientRect();
      const max = Math.max(rect.height - 14, 0);
      const viewportAnchor = window.innerHeight * 0.28;
      const raw = viewportAnchor - rect.top;
      const offset = Math.min(Math.max(raw, 0), max);
      roadmap.style.setProperty('--timeline-progress', `${offset}px`);
    };

    const bg = document.getElementById('pageBg');
    const svgBase = document.getElementById('svgBase');
    const svgReveal = document.getElementById('svgReveal');
    const patBase = document.getElementById('grid-base-pattern');
    const patReveal = document.getElementById('grid-reveal-pattern');

    const CELL = 44;
    const SPX = 0.42;
    const SPY = 0.28;
    let offX = 0;
    let offY = 0;
    let frameId = 0;

    const setSize = () => {
      if (!svgBase || !svgReveal) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      [svgBase, svgReveal].forEach((svg) => {
        svg.setAttribute('width', String(w));
        svg.setAttribute('height', String(h));
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      });
    };

    const tick = () => {
      if (!patBase || !patReveal) return;
      offX = (offX + SPX) % CELL;
      offY = (offY + SPY) % CELL;
      patBase.setAttribute('x', String(offX));
      patBase.setAttribute('y', String(offY));
      patReveal.setAttribute('x', String(offX));
      patReveal.setAttribute('y', String(offY));
      frameId = requestAnimationFrame(tick);
    };

    const onMouseMove = (event: MouseEvent) => {
      bg?.style.setProperty('--cx', `${event.clientX}px`);
      bg?.style.setProperty('--cy', `${event.clientY}px`);
    };

    const onMouseLeave = () => {
      bg?.style.setProperty('--cx', '-500px');
      bg?.style.setProperty('--cy', '-500px');
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    mobileToggle?.addEventListener('click', onMobileClick);
    casesToggle?.addEventListener('click', onCasesClick);
    openBriefBtn?.addEventListener('click', onOpenBrief);
    closeBriefBtn?.addEventListener('click', closeBriefModal);
    briefModal?.addEventListener('click', onModalBackdrop);
    document.addEventListener('keydown', onKeydown);
    briefForm?.addEventListener('submit', onFormSubmit);
    document.addEventListener('click', onDocClick);

    mobileNav?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => mobileNav.classList.remove('open'));
    });

    window.addEventListener('scroll', updateRoadmapProgress, { passive: true });
    window.addEventListener('resize', updateRoadmapProgress);

    if (bg && svgBase && svgReveal && patBase && patReveal) {
      setSize();
      window.addEventListener('resize', setSize);
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('mouseleave', onMouseLeave);
      frameId = requestAnimationFrame(tick);
    }

    updateRoadmapProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
      mobileToggle?.removeEventListener('click', onMobileClick);
      casesToggle?.removeEventListener('click', onCasesClick);
      openBriefBtn?.removeEventListener('click', onOpenBrief);
      closeBriefBtn?.removeEventListener('click', closeBriefModal);
      briefModal?.removeEventListener('click', onModalBackdrop);
      document.removeEventListener('keydown', onKeydown);
      briefForm?.removeEventListener('submit', onFormSubmit);
      document.removeEventListener('click', onDocClick);
      window.removeEventListener('scroll', updateRoadmapProgress);
      window.removeEventListener('resize', updateRoadmapProgress);
      window.removeEventListener('resize', setSize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(frameId);
      obs.disconnect();
      roadmapObs.disconnect();
      architectureObs.disconnect();
    };
  }, []);

  return (
    <>
      <div className="page-bg" id="pageBg" aria-hidden="true">
        <div className="bg-orbs">
          <div className="bg-orb bg-orb--gold" />
          <div className="bg-orb bg-orb--amber" />
          <div className="bg-orb bg-orb--sun" />
        </div>

        <div className="grid-base">
          <svg id="svgBase">
            <defs>
              <pattern id="grid-base-pattern" width="44" height="44" patternUnits="userSpaceOnUse">
                <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,190,70,0.25)" strokeWidth="0.82" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-base-pattern)" />
          </svg>
        </div>

        <div className="grid-reveal">
          <svg id="svgReveal">
            <defs>
              <pattern id="grid-reveal-pattern" width="44" height="44" patternUnits="userSpaceOnUse">
                <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255,215,80,1)" strokeWidth="1.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-reveal-pattern)" />
          </svg>
        </div>
      </div>
      <div className="page-grid" aria-hidden="true" />

      <header id="hdr">
        <div className="header-top">
          <a className="header-logo" href="/">
            Aivion<span>.</span>
          </a>

          <nav className="header-nav" aria-label="Навигация по кейсу">
            <a className="nav-link" href="#problem">
              Проблема
            </a>
            <a className="nav-link" href="#solution">
              Решение
            </a>
            <a className="nav-link" href="#example">
              Пример
            </a>
            <a className="nav-link" href="#stack">
              Стек
            </a>
          </nav>

          <div className="cases-menu">
            <button className="cases-btn" id="casesToggle" aria-expanded="false" aria-controls="casesDropdown">
              Все кейсы
            </button>
            <div className="cases-dropdown" id="casesDropdown">
              <a className="cases-item" href="#">
                Мультиагентная система SMM
              </a>
              <a className="cases-item" href="#">
                AI microservice
              </a>
              <a className="cases-item" href="#">
                PromptLab
              </a>
              <a className="cases-item" href="#">
                Автогенерация TZ
              </a>
              <a className="cases-item" href="#">
                Корпоративная BPMS система
              </a>
            </div>
          </div>

          <button className="nav-toggle" id="mobileNavToggle" aria-label="Открыть меню">
            ☰
          </button>
          <nav className="mobile-nav" id="mobileNav" aria-label="Мобильная навигация">
            <a className="nav-link" href="#problem">
              Проблема
            </a>
            <a className="nav-link" href="#solution">
              Решение
            </a>
            <a className="nav-link" href="#example">
              Пример
            </a>
            <a className="nav-link" href="#stack">
              Стек
            </a>
            <div className="mobile-cases" aria-label="Список кейсов">
              <span className="mobile-cases-title">Все кейсы</span>
              <a className="cases-item" href="#">
                Мультиагентная система SMM
              </a>
              <a className="cases-item" href="#">
                AI microservice
              </a>
              <a className="cases-item" href="#">
                PromptLab
              </a>
              <a className="cases-item" href="#">
                Автогенерация TZ
              </a>
              <a className="cases-item" href="#">
                Корпоративная BPMS система
              </a>
            </div>
          </nav>
        </div>
      </header>

      <div className="case-hero">
        <h1 className="case-title reveal">
          Мультиагентная система для <br /> автоматизации <span className="hi">SMM-команд</span>
        </h1>
        <p className="case-lead reveal">
          К нам обратилась сеть e-commerce брендов (NDA), где контент-команда ежедневно выпускала десятки публикаций для
          разных площадок. Из-за ручной координации редакторов, дизайнеров и маркетологов запуск кампаний регулярно
          срывался.
        </p>
      </div>

      <div className="section-divider" />

      <article className="case-body">
        <div className="section-heading reveal" id="problem">
          <h2>Какую проблему мы выявили</h2>
        </div>
        <p className="reveal">
          Команда вела контент-план в нескольких таблицах и чатах: один человек собирал бриф, второй писал текст, третий
          адаптировал формат под площадку, а затем всё вручную согласовывалось перед публикацией.
        </p>
        <p className="reveal">
          Отсутствовал единый контур контроля сроков и качества, а правки терялись между каналами.{' '}
          <span className="problem-accent">Ключевой вывод:</span> узкое место не в специалистах, а в процессе, где
          повторяющиеся операции не были автоматизированы.
        </p>

        <div className="block-sep" />

        <div className="section-heading reveal" id="solution">
          <h2>Решение</h2>
        </div>
        <p className="reveal">
          <strong>
            Мы разработали мультиагентную AI-систему, которая распределяет задачи между агентами, формирует контент-пакеты
            и передаёт их в рабочий пайплайн маркетинговой команды.
          </strong>
        </p>
        <div className="solution-flow reveal">
          <div className="flow-step">
            <span className="flow-dot" />
            <div>
              <h3>Агентная декомпозиция</h3>
              <p>
                Отдельные агенты отвечают за брифинг, генерацию черновика, адаптацию под платформы и контроль бренд-тональности.
              </p>
            </div>
          </div>
          <div className="flow-step">
            <span className="flow-dot" />
            <div>
              <h3>Асинхронный production-пайплайн</h3>
              <p>
                Запросы обрабатываются через очередь задач, поэтому команда получает готовые материалы без ручного ожидания и
                переключений между сервисами.
              </p>
            </div>
          </div>
          <div className="flow-step">
            <span className="flow-dot" />
            <div>
              <h3>Проверка качества и рисков</h3>
              <p>
                Финальный агент проверяет соответствие гайдам, юридическим ограничениям и KPI кампании до публикации.
              </p>
            </div>
          </div>
        </div>

        <div className="block-sep" />

        <div className="section-heading reveal" id="architecture">
          <h2>Архитектура решения</h2>
        </div>
        <div className="architecture-system reveal" aria-label="Диаграмма мультиагентной архитектуры">
          <div className="architecture-agents">
            <article className="agent-node agent-node--tl">
              <h4>Оркестратор задач</h4>
              <p>Распределяет входящие брифы по цепочкам агентов и контролирует SLA на каждом этапе подготовки контента.</p>
            </article>
            <article className="agent-node agent-node--bl">
              <h4>Контент-агенты</h4>
              <p>Генерируют тексты, варианты креативов и адаптации под каналы: Telegram, VK, Instagram и email-рассылки.</p>
            </article>
            <article className="agent-node agent-node--tr">
              <h4>Агент качества</h4>
              <p>Проверяет tone of voice, brand-safety и соответствие коммерческим целям кампании перед выдачей результата.</p>
            </article>
            <article className="agent-node agent-node--br">
              <h4>Мониторинг и отчётность</h4>
              <p>Собирает метрики по времени, стоимости и результативности публикаций в едином дашборде для руководителя.</p>
            </article>
          </div>
        </div>

        <div className="block-sep" />

        <div className="section-heading reveal" id="example">
          <h2>Пример использования</h2>
        </div>
        <p className="reveal">
          <strong>Ниже — практический roadmap запуска кампании:</strong> от постановки брифа до публикации и автоматического
          пост-анализа по каналам.
        </p>

        <div className="roadmap-vertical reveal" aria-label="Roadmap запуска SMM-кампании">
          <article className="roadmap-item left">
            <div className="roadmap-content">
              <h4>Постановка брифа</h4>
              <p>Маркетолог загружает цели, целевую аудиторию и оффер кампании в систему одним шаблоном.</p>
            </div>
            <span className="roadmap-marker" />
          </article>
          <article className="roadmap-item right">
            <span className="roadmap-marker" />
            <div className="roadmap-content">
              <h4>Автогенерация контента</h4>
              <p>Контент-агенты формируют тексты и форматы под каждую площадку с учётом заданных ограничений.</p>
            </div>
          </article>
          <article className="roadmap-item left">
            <div className="roadmap-content">
              <h4>Проверка качества</h4>
              <p>Агент контроля валидирует сообщения на соответствие бренд-гайдам и корректность формулировок.</p>
            </div>
            <span className="roadmap-marker" />
          </article>
          <article className="roadmap-item right">
            <span className="roadmap-marker" />
            <div className="roadmap-content">
              <h4>Публикация по расписанию</h4>
              <p>Материалы автоматически передаются в планировщик публикаций без ручной сборки финальных версий.</p>
            </div>
          </article>
          <article className="roadmap-item left">
            <div className="roadmap-content">
              <h4>Пост-аналитика</h4>
              <p>После выхода контента система собирает метрики охватов, CTR и конверсий для следующей итерации.</p>
            </div>
            <span className="roadmap-marker" />
          </article>
        </div>

        <div className="block-sep" />

        <div className="section-heading reveal" id="results">
          <h2>Результаты</h2>
        </div>
        <div className="hero-results reveal" aria-label="Ключевые результаты">
          <div className="metric-card">
            <div className="metric-value">x3.5</div>
            <div className="metric-note">Скорость подготовки кампании: 14 часов → 4 часа</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">−62%</div>
            <div className="metric-note">Сокращение ручных правок за счёт проверки качества до публикации</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">+41%</div>
            <div className="metric-note">Рост вовлечённости по ключевым каналам за первые 8 недель</div>
          </div>
        </div>

        <div className="block-sep" />

        <div className="section-heading reveal" id="stack">
          <h2>Стек технологий</h2>
        </div>
        <div className="tech-row reveal">
          <span className="tech-chip">Python</span>
          <span className="tech-chip">FastAPI</span>
          <span className="tech-chip">OpenAI API</span>
          <span className="tech-chip">LangGraph</span>
          <span className="tech-chip">PostgreSQL</span>
          <span className="tech-chip">Redis</span>
          <span className="tech-chip">Asyncio</span>
          <span className="tech-chip">Docker</span>
          <span className="tech-chip">Metabase</span>
        </div>

        <div className="cta-wrap reveal" id="cta">
          <h3>Обсудим вашу задачу</h3>
          <p>
            Покажем, как запустить мультиагентный контур для SMM, ускорить выпуск кампаний и снизить нагрузку на команду.
          </p>
          <a href="#" className="cta-btn" id="openBriefBtn">
            Запросить разбор
          </a>
        </div>
      </article>

      <div className="modal-overlay" id="briefModal" role="dialog" aria-modal="true" aria-labelledby="briefTitle">
        <form className="modal-card">
          <button className="modal-close" id="closeBriefBtn" aria-label="Закрыть форму" type="button">
            ×
          </button>
          <h2 className="modal-title" id="briefTitle">
            Далее давайте обсудим вашу задачу
          </h2>
          <input className="modal-field" type="text" name="name" placeholder="Ваше имя" />
          <input className="modal-field" type="text" name="company" placeholder="Название компании" />
          <input className="modal-field" type="text" name="role" placeholder="Позиция в компании" />
          <input className="modal-field" type="text" name="team_size" placeholder="Размер команды" />
          <input className="modal-field" type="text" name="budget" placeholder="Бюджет" />
          <textarea className="modal-field" name="task" placeholder="Опишите вашу задачу" />
          <input className="modal-field" type="text" name="contact" placeholder="Ваш контакт (@telegram_id / +7 (999) 123-45-67)" />
          <button className="modal-submit" type="submit">
            Отправить заявку
          </button>
        </form>
      </div>
    </>
  );
}
