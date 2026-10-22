const menuButton=document.querySelector('.menu-toggle');const menu=document.querySelector('#menu');
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menu.classList.toggle('open',open)});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}});
document.querySelector('#brief-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const name=form.elements.name.value.trim();const business=form.elements.business.value.trim();const details=form.elements.message.value.trim();const text=`Hola, Sabores y Colores.${name?` Soy ${name}.`:""}${business?` Mi marca es ${business}.`:''}\nMe interesa: ${form.elements.service.value}.${details?`\nMi idea: ${details}`:''}\n¿Podemos platicar sobre mi proyecto?`;const url='https://wa.me/529993628792?text='+encodeURIComponent(text);const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.click();const status=document.querySelector('#form-status');status.textContent='Tu mensaje está listo. Si WhatsApp no se abrió, ';const fallback=document.createElement('a');fallback.href=url;fallback.target='_blank';fallback.rel='noopener noreferrer';fallback.textContent='ábrelo aquí.';fallback.style.textDecoration='underline';status.appendChild(fallback)});document.querySelector('#name').addEventListener('input',event=>event.target.setCustomValidity(''));
document.querySelector('#year').textContent=new Date().getFullYear();

// Gentle motion, progressively enhanced; all content remains readable without JS.
(()=>{
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const desktop=window.matchMedia('(min-width: 761px)');
 const hero=document.querySelector('.hero-with-portrait');
 const portrait=document.querySelector('.hero-scene');
 let observer=null,frame=0;
 const items=[...document.querySelectorAll('.section-head,.services article,.about-grid>div,.values,.project,.steps article,.price-card,.digital-card,.faq-grid>div,.contact-grid>div,.contact-grid>form')];
 const revealAll=()=>{observer?.disconnect();items.forEach(el=>el.classList.remove('motion-ready','motion-pending','motion-visible'));};
 function setupReveal(){
  revealAll();
  if(reduced.matches||!('IntersectionObserver' in window))return;
  observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('motion-visible');observer.unobserve(entry.target)}})},{threshold:.08});
  items.forEach(el=>{if(el.getBoundingClientRect().top<window.innerHeight*.95)return;el.classList.add('motion-ready','motion-pending');const siblings=[...el.parentElement.children];el.style.setProperty('--reveal-delay',`${Math.min(siblings.indexOf(el),2)*65}ms`);observer.observe(el)});
 }
 function updateParallax(){frame=0;if(reduced.matches||!desktop.matches||document.body.classList.contains('motion-paused')){portrait.style.removeProperty('--hero-shift');return}const box=hero.getBoundingClientRect();if(box.bottom<=0||box.top>=window.innerHeight)return;const shift=Math.max(-15,Math.min(32,-box.top*.09));portrait.style.setProperty('--hero-shift',`${shift.toFixed(2)}px`)}
 function scheduleParallax(){if(!frame)frame=requestAnimationFrame(updateParallax)}
 window.addEventListener('scroll',scheduleParallax,{passive:true});window.addEventListener('resize',scheduleParallax,{passive:true});
 reduced.addEventListener('change',()=>{setupReveal();scheduleParallax()});desktop.addEventListener('change',scheduleParallax);
 setupReveal();scheduleParallax();
})();

(()=>{
 const toggle=document.querySelector('.motion-toggle');
 toggle.addEventListener('click',()=>{const paused=document.body.classList.toggle('motion-paused');toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'▶ Activar animación':'Ⅱ Pausar animación';window.dispatchEvent(new Event('scroll'))});
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');const desktop=matchMedia('(min-width: 761px)');const cards=[...document.querySelectorAll('.project-image')];let pending=false;
 function update(){pending=false;const total=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--read-progress',total>0?Math.min(1,Math.max(0,scrollY/total)):0);const active=!reduced.matches&&desktop.matches&&!document.body.classList.contains('motion-paused');cards.forEach(card=>{const box=card.getBoundingClientRect();if(!active){card.style.removeProperty('--project-shift');return}if(box.bottom<0||box.top>innerHeight)return;const shift=Math.max(-14,Math.min(14,(innerHeight/2-box.top-box.height/2)*.04));card.style.setProperty('--project-shift',shift.toFixed(2)+'px')})}
 function schedule(){if(!pending){pending=true;requestAnimationFrame(update)}}window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});reduced.addEventListener('change',schedule);schedule();
})();

// The package under the pointer is highlighted; no package is preselected.
(()=>{const fine=matchMedia('(hover:hover) and (pointer:fine)');const reduce=matchMedia('(prefers-reduced-motion:reduce)');document.querySelectorAll('.price-card').forEach(card=>{card.addEventListener('pointermove',event=>{if(!fine.matches||reduce.matches)return;const b=card.getBoundingClientRect();card.style.setProperty('--tilt-y',((event.clientX-b.left)/b.width*5-2.5).toFixed(2)+'deg');card.style.setProperty('--tilt-x',(2.5-(event.clientY-b.top)/b.height*5).toFixed(2)+'deg')});card.addEventListener('pointerleave',()=>{card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y')})})})();
