// App script: Mobile menu, brief form submission, progressive enhancement reveals, parallax, tilt

export function initApp() {
  // Mobile Menu
  const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
  const menu = document.querySelector<HTMLElement>('#menu');

  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('open', open);
    });

    menu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      })
    );

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        menu.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Brief Form WhatsApp submission
  const briefForm = document.querySelector<HTMLFormElement>('#brief-form');
  if (briefForm) {
    briefForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const form = event.currentTarget as HTMLFormElement;
      if (!form.reportValidity()) return;

      const name = (form.elements.namedItem('name') as HTMLInputElement)?.value.trim() || '';
      const business = (form.elements.namedItem('business') as HTMLInputElement)?.value.trim() || '';
      const service = (form.elements.namedItem('service') as HTMLSelectElement)?.value || '';
      const details = (form.elements.namedItem('message') as HTMLTextAreaElement)?.value.trim() || '';

      const text = `Hola, Sabores y Colores.${name ? ` Soy ${name}.` : ''}${business ? ` Mi marca es ${business}.` : ''}\nMe interesa: ${service}.${details ? `\nMi idea: ${details}` : ''}\n¿Podemos platicar sobre mi proyecto?`;
      const url = 'https://wa.me/529993628792?text=' + encodeURIComponent(text);

      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();

      const status = document.querySelector<HTMLElement>('#form-status');
      if (status) {
        status.textContent = 'Tu mensaje está listo. Si WhatsApp no se abrió, ';
        const fallback = document.createElement('a');
        fallback.href = url;
        fallback.target = '_blank';
        fallback.rel = 'noopener noreferrer';
        fallback.textContent = 'ábrelo aquí.';
        fallback.style.textDecoration = 'underline';
        status.appendChild(fallback);
      }
    });

    document.querySelector('#name')?.addEventListener('input', (event) =>
      (event.target as HTMLInputElement).setCustomValidity('')
    );
  }

  // Gentle motion & reveal observer
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 761px)');
  const hero = document.querySelector<HTMLElement>('.hero-with-portrait');
  const portrait = document.querySelector<HTMLElement>('.hero-scene');

  let observer: IntersectionObserver | null = null;
  let frame = 0;

  const items = [
    ...document.querySelectorAll<HTMLElement>(
      '.section-head, .services article, .about-grid > div, .values, .project, .steps article, .price-card, .digital-card, .faq-grid > div, .contact-grid > div, .contact-grid > form'
    ),
  ];

  const revealAll = () => {
    observer?.disconnect();
    items.forEach((el) => el.classList.remove('motion-ready', 'motion-pending', 'motion-visible'));
  };

  function setupReveal() {
    revealAll();
    if (reduced.matches || !('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('motion-visible');
            observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    items.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return;
      el.classList.add('motion-ready', 'motion-pending');
      const siblings = [...(el.parentElement?.children || [])];
      el.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(el), 2) * 65}ms`);
      observer?.observe(el);
    });
  }

  function updateParallax() {
    frame = 0;
    if (!hero || !portrait) return;
    if (reduced.matches || !desktop.matches || document.body.classList.contains('motion-paused')) {
      portrait.style.removeProperty('--hero-shift');
      return;
    }
    const box = hero.getBoundingClientRect();
    if (box.bottom <= 0 || box.top >= window.innerHeight) return;
    const shift = Math.max(-15, Math.min(32, -box.top * 0.09));
    portrait.style.setProperty('--hero-shift', `${shift.toFixed(2)}px`);
  }

  function scheduleParallax() {
    if (!frame) frame = requestAnimationFrame(updateParallax);
  }

  window.addEventListener('scroll', scheduleParallax, { passive: true });
  window.addEventListener('resize', scheduleParallax, { passive: true });
  reduced.addEventListener('change', () => {
    setupReveal();
    scheduleParallax();
  });
  desktop.addEventListener('change', scheduleParallax);
  setupReveal();
  scheduleParallax();

  // Motion toggle button
  const toggle = document.querySelector<HTMLButtonElement>('.motion-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const paused = document.body.classList.toggle('motion-paused');
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.textContent = paused ? '▶ Activar animación' : 'Ⅱ Pausar animación';
      window.dispatchEvent(new Event('scroll'));
    });
  }

  // Reading progress and project image shift
  const cards = [...document.querySelectorAll<HTMLElement>('.project-image')];
  let pending = false;

  function updateScroll() {
    pending = false;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    document.documentElement.style.setProperty(
      '--read-progress',
      total > 0 ? String(Math.min(1, Math.max(0, window.scrollY / total))) : '0'
    );
    const active =
      !reduced.matches && desktop.matches && !document.body.classList.contains('motion-paused');
    cards.forEach((card) => {
      const box = card.getBoundingClientRect();
      if (!active) {
        card.style.removeProperty('--project-shift');
        return;
      }
      if (box.bottom < 0 || box.top > window.innerHeight) return;
      const shift = Math.max(
        -14,
        Math.min(14, (window.innerHeight / 2 - box.top - box.height / 2) * 0.04)
      );
      card.style.setProperty('--project-shift', `${shift.toFixed(2)}px`);
    });
  }

  function scheduleScroll() {
    if (!pending) {
      pending = true;
      requestAnimationFrame(updateScroll);
    }
  }

  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll, { passive: true });
  reduced.addEventListener('change', scheduleScroll);
  scheduleScroll();

  // 3D Tilt Effect on Price Cards
  const fine = matchMedia('(hover:hover) and (pointer:fine)');
  document.querySelectorAll<HTMLElement>('.price-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (!fine.matches || reduced.matches) return;
      const b = card.getBoundingClientRect();
      card.style.setProperty(
        '--tilt-y',
        `${(((event.clientX - b.left) / b.width) * 5 - 2.5).toFixed(2)}deg`
      );
      card.style.setProperty(
        '--tilt-x',
        `${(2.5 - ((event.clientY - b.top) / b.height) * 5).toFixed(2)}deg`
      );
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
    });
  });
}
