// Barber Demo: simulación interactiva local para la tarjeta de Distrito 07
declare global {
  interface Window {
    barberDemoMarkup: () => string;
    bindBarberDemo: (root: HTMLElement) => void;
  }
}

window.barberDemoMarkup = () => `<div class="barber-demo-page"><p class="demo-notice" id="project-description">DEMO INTERACTIVA · Prueba los botones. No se envían mensajes ni se abre ninguna página externa.</p><div class="barber-demo-wrap"><div class="simple-business-card branded-barber"><div class="barber-brand-header"><img src="/image/distrito07-logo.svg" alt="Distrito 07 Barbería" width="260" height="160"><span>CORTE CLÁSICO · ESTILO PROPIO</span></div><div class="simple-profile"><h2 id="project-title">Distrito 07</h2><p>Un buen corte habla de ti.<br>Cortes clásicos, fades y ritual de barba con atención al detalle.</p><div class="demo-badges"><span>✂ Corte & barba</span><span>◷ Atención con cita</span></div><button type="button" class="simple-link quiet" data-demo="contact">↓ Guardar contacto en el teléfono</button></div><button type="button" class="simple-link main" data-demo="whatsapp"><span>Agendar por WhatsApp<small>Elige tu servicio y prepara tu visita</small></span><span>↗</span></button><section class="demo-response" hidden tabindex="-1" aria-labelledby="demo-response-title"><div><h3 id="demo-response-title"></h3><button type="button" data-demo="close" aria-label="Cerrar vista de demostración">×</button></div><p id="demo-response-copy"></p><small>Simulación: no se realiza ninguna acción externa.</small></section><h5><span class="barber-section-icon">↗</span> Redes sociales</h5><button type="button" class="simple-link" data-demo="instagram"><span>◎ Instagram<small>Explora nuestros estilos y acabados</small></span><span>↗</span></button><button type="button" class="simple-link" data-demo="facebook"><span>f Facebook<small>Novedades de Distrito 07</small></span><span>↗</span></button><h5><span class="barber-section-icon">✂</span> Servicios</h5><div class="demo-services"><details><summary>Corte clásico y fade <span>+</span></summary><p>Consulta de estilo, corte y acabado. Duración ilustrativa: 45 minutos.</p><button type="button" data-demo="corte">Elegir este servicio →</button></details><details><summary>Diseño de barba <span>+</span></summary><p>Perfilado y acabado de barba. Duración ilustrativa: 30 minutos.</p><button type="button" data-demo="barba">Elegir este servicio →</button></details><details><summary>Corte + barba <span>+</span></summary><p>Una visita completa para tu corte y barba. Duración ilustrativa: 60 minutos.</p><button type="button" data-demo="combo">Elegir este servicio →</button></details></div><h5><span class="barber-section-icon">◷</span> Ubicación y horarios</h5><div class="simple-location"><p><b>Tu próxima visita</b><br>Ubicación de ejemplo · Ciudad de México</p><p>Lunes a sábado · 10:00 a 20:00</p><div class="demo-location-actions"><button type="button" class="simple-link" data-demo="map">⌖ Ver ubicación</button><button type="button" class="simple-link" data-demo="call">☎ Llamar</button></div></div><button type="button" class="simple-link demo-share" data-demo="share">Compartir tarjeta ↗</button><p class="simple-example">Distrito 07 es una marca conceptual.<br>Diseño de tarjeta por Sabores y Colores.</p></div></div></div>`;

window.bindBarberDemo = (root: HTMLElement) => {
  let lastButton: HTMLButtonElement | null = null;
  const messages: Record<string, [string, string]> = {
    contact: ['Guardar contacto', 'Aquí se guardaría el contacto de Distrito 07 en tu teléfono. En esta demo no se descarga ningún archivo.'],
    whatsapp: ['Tu cita empieza aquí', 'En una tarjeta publicada, este botón abriría WhatsApp con un mensaje para reservar. Puedes explorar los servicios y elegir uno para probar el recorrido.'],
    instagram: ['Instagram · Distrito 07', 'Este acceso llevaría al perfil de Instagram de la barbería, con cortes, estilos y novedades.'],
    facebook: ['Facebook · Distrito 07', 'Este acceso abriría la página de Facebook del negocio.'],
    corte: ['Servicio elegido: corte clásico y fade', 'Tu mensaje de ejemplo: “Hola, Distrito 07. Me gustaría agendar un corte clásico o fade. ¿Qué horarios tienen disponibles?”'],
    barba: ['Servicio elegido: diseño de barba', 'Tu mensaje de ejemplo: “Hola, Distrito 07. Me gustaría reservar un diseño de barba. ¿Qué horarios tienen disponibles?”'],
    combo: ['Servicio elegido: corte + barba', 'Tu mensaje de ejemplo: “Hola, Distrito 07. Me interesa una cita de corte y barba. ¿Tienen disponibilidad?”'],
    map: ['Ubicación del negocio', 'En la tarjeta final se abriría el mapa con la dirección real de la barbería. Esta muestra no contiene una ubicación real.'],
    call: ['Llamar a la barbería', 'En la tarjeta final se abriría el marcador del teléfono. La demo no inicia llamadas.'],
    share: ['Compartir tarjeta', 'En la tarjeta final podrías compartir su enlace. Esta simulación no copia ni comparte información.'],
  };
  const panel = root.querySelector('.demo-response') as HTMLElement;
  if (!panel) return;

  root.querySelectorAll<HTMLButtonElement>('[data-demo]').forEach((button) =>
    button.addEventListener('click', () => {
      const action = button.dataset.demo;
      if (!action) return;
      if (action === 'close') {
        panel.hidden = true;
        lastButton?.focus({ preventScroll: true });
        return;
      }
      const message = messages[action];
      if (!message) return;
      lastButton = button;
      const titleEl = root.querySelector('#demo-response-title');
      const copyEl = root.querySelector('#demo-response-copy');
      if (titleEl) titleEl.textContent = message[0];
      if (copyEl) copyEl.textContent = message[1];
      panel.hidden = false;
      panel.focus({ preventScroll: true });
      panel.scrollIntoView({
        block: 'nearest',
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    })
  );
};
