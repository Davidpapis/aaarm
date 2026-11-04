/* ==========================================================================
   JAVASCRIPT LOGIC: ASOCIACIÓN AUTISMO ÁNGEL RIVIÈRE
   SPA ScrollSpy routing, acrostic letters, progress slider,
   copy IBAN, scroll reveals, full-screen lightbox video, and dynamic floating button.
   ========================================================================== */

function initApp() {

  // --- 1. MOBILE NAVIGATION MENU TOGGLE ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileMenu) {
    const header = document.querySelector('.main-header');

    const positionMobileMenu = () => {
      if (!header) return;
      const headerBottom = header.getBoundingClientRect().bottom;
      document.documentElement.style.setProperty('--mobile-menu-top', `${Math.max(0, headerBottom)}px`);
    };

    const closeMobileMenu = () => {
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
    };

    mobileToggle.addEventListener('click', () => {
      const isActive = mobileToggle.classList.toggle('active');
      positionMobileMenu();
      mobileToggle.setAttribute('aria-expanded', String(isActive));
      mobileMenu.classList.toggle('is-open', isActive);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    window.addEventListener('resize', () => {
      positionMobileMenu();
      if (window.innerWidth > 768) closeMobileMenu();
    }, { passive: true });
    window.addEventListener('scroll', positionMobileMenu, { passive: true });
    positionMobileMenu();
  }


  // --- 2. SPA TAB ROUTER & FLOATING DONATION BUTTON ---
  const sections = document.querySelectorAll('.page-view');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const floatingDonationBtn = document.getElementById('floating-donation-btn');

  function router() {
    let hash = window.location.hash || '#inicio';
    let targetElement = null;
    
    try {
      targetElement = document.querySelector(hash);
    } catch (e) {
      console.error("Invalid selector for hash: " + hash, e);
    }
    
    let activeSection = null;
    if (targetElement) {
      if (targetElement.classList.contains('page-view')) {
        activeSection = targetElement;
      } else {
        activeSection = targetElement.closest('.page-view');
      }
    }
    
    if (!activeSection) {
      hash = '#inicio';
      activeSection = document.getElementById('inicio');
      targetElement = activeSection;
    }

    // Hide all section views and show active target
    sections.forEach(sec => {
      sec.classList.remove('active');
    });
    activeSection.classList.add('active');

    // Highlight corresponding navigation links
    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref === hash || (activeSection && linkHref === '#' + activeSection.id)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Handle scroll position: sub-element vs top of page
    if (targetElement && targetElement !== activeSection) {
      setTimeout(() => {
        const headerOffset = 120; // Height of top bar + header
        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 50);
    } else {
      window.scrollTo(0, 0);
    }

    // Manage floating donation button visibility
    if (floatingDonationBtn) {
      if (hash === '#colabora') {
        floatingDonationBtn.classList.remove('visible');
      } else {
        floatingDonationBtn.classList.add('visible');
      }
    }
  }

  // Bind router handler to hashchange and run on initial load
  window.addEventListener('hashchange', router);
  router();


  // --- 2b. TRANSPARENT HEADER OVER THE INICIO HERO PHOTO ---
  const mainHeader = document.querySelector('.main-header');
  const heroSliderSection = document.getElementById('hero-slider-section');

  function updateHeaderTransparency() {
    if (!mainHeader || !heroSliderSection) return;
    const hash = window.location.hash || '#inicio';
    const onInicio = hash === '#inicio' || hash === '#' || hash === '';
    const heroHeight = heroSliderSection.offsetHeight;
    const shouldBeTransparent = onInicio && window.scrollY < Math.max(heroHeight - 120, 0);
    mainHeader.classList.toggle('header-transparent', shouldBeTransparent);
  }

  window.addEventListener('scroll', updateHeaderTransparency, { passive: true });
  window.addEventListener('hashchange', updateHeaderTransparency);
  window.addEventListener('resize', updateHeaderTransparency);
  updateHeaderTransparency();


  // --- 3. VIDEO LIGHTBOX MODAL ---
  const triggerVideoModal = document.getElementById('trigger-video-modal');
  const triggerVideoHeroModal = document.getElementById('trigger-video-hero-modal');
  const videoModal = document.getElementById('video-modal');
  const videoModalClose = document.getElementById('video-modal-close');
  const videoModalOverlay = document.getElementById('video-modal-overlay');
  const lightboxVideo = document.getElementById('lightbox-video');

  if (videoModal && lightboxVideo) {
    const openModal = () => {
      videoModal.classList.add('active');
      videoModal.setAttribute('aria-hidden', 'false');
      lightboxVideo.play().catch(err => console.log("Video playback blocked: ", err));
    };

    const closeModal = () => {
      videoModal.classList.remove('active');
      videoModal.setAttribute('aria-hidden', 'true');
      lightboxVideo.pause();
      lightboxVideo.currentTime = 0; // Reset video to beginning
    };

    if (triggerVideoModal) triggerVideoModal.addEventListener('click', openModal);
    if (triggerVideoHeroModal) triggerVideoHeroModal.addEventListener('click', openModal);
    
    if (videoModalClose) videoModalClose.addEventListener('click', closeModal);
    if (videoModalOverlay) videoModalOverlay.addEventListener('click', closeModal);

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeModal();
      }
    });
  }


  // --- 4. SCROLL-REVEAL ANNIHILATION (INTERSECTION OBSERVER) ---
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active-reveal');
        // Once revealed, no need to track it further
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });


  // --- 5. INTERACTIVE ACROSTIC: AUTISMO ---
  const letterBoxes = document.querySelectorAll('.letter-box');
  const detailCard = document.getElementById('letter-detail-card');
  const detailTitle = document.getElementById('detail-title');
  const detailDesc = document.getElementById('detail-desc');

  const acrosticData = {
    'A': {
      title: 'Auténtico',
      desc: 'Las personas con autismo viven y expresan el mundo desde una mirada única y auténtica. Ser uno mismo también es una forma de conectar, sentir y aportar.'
    },
    'U': {
      title: 'Único',
      desc: 'Cada persona en el espectro tiene un perfil irrepetible de fortalezas, sensibilidades y talentos. Hablamos de espectro porque la diversidad dentro de él es inmensa.'
    },
    'T': {
      title: 'Tenaz',
      desc: 'Poseen una gran perseverancia e intensidad de enfoque cuando se dedican a temas de su interés, logrando un alto grado de pericia y concentración en sus proyectos.'
    },
    'I': {
      title: 'Inigualable',
      desc: 'Su forma original de procesar la información y estructurar problemas les permite aportar soluciones sumamente creativas y enfoques refrescantes a la sociedad.'
    },
    'S': {
      title: 'Sincero',
      desc: 'La honestidad y la transparencia son rasgos de identidad. Su comunicación está libre de segundas intenciones, dobles sentidos sociales confusos o falsedades.'
    },
    'M': {
      title: 'Maravilloso',
      desc: 'Una sensibilidad extraordinaria que percibe el entorno en "alta definición", con una inmensa capacidad de asombro y detalle ante pequeñas maravillas diarias.'
    },
    'O': {
      title: 'Original',
      desc: 'Su pensamiento divergente no está encasillado por las convenciones sociales ordinarias, aportando originalidad, arte, rigor científico y color al mundo.'
    }
  };

  const acrosticColors = {
    'A': 'var(--brand-yellow)',
    'U': 'var(--brand-green)',
    'T': 'var(--brand-red)',
    'I': 'var(--brand-blue)',
    'S': 'var(--brand-yellow)',
    'M': 'var(--brand-red)',
    'O': 'var(--brand-blue)'
  };

  letterBoxes.forEach(box => {
    const handleLetterSelection = () => {
      // Remove active class from all letters
      letterBoxes.forEach(b => b.classList.remove('active'));
      
      // Add active class to current letter
      box.classList.add('active');
      
      // Get letter data
      const letter = box.getAttribute('data-letter');
      if (acrosticData[letter]) {
        detailTitle.textContent = acrosticData[letter].title;
        detailTitle.style.color = acrosticColors[letter];
        detailDesc.textContent = acrosticData[letter].desc;
        
        // Add subtle animation trigger
        detailCard.style.animation = 'none';
        detailCard.offsetHeight; // Trigger reflow
        detailCard.style.animation = 'viewFadeIn 0.4s ease-out forwards';
      }
    };

    box.addEventListener('mouseenter', handleLetterSelection);
    box.addEventListener('click', handleLetterSelection);
  });

  // Default to A on startup to fill detail card on load
  const firstLetterBox = document.querySelector('.letter-box[data-letter="A"]');
  if (firstLetterBox) {
    firstLetterBox.click();
  }


  // --- 6. BLOG: LOCAL READER AND CATEGORY FILTERS ---
  const blogPosts = {
    convenio: {
      category: 'Colaboración institucional',
      categoryClass: 'category-blue',
      date: 'Subvención Municipal · 2025 / 2026',
      title: 'Subvención del Ayuntamiento de Marbella 2025 y 2026 (56.000 €)',
      body: [
        'La Asociación de Autismo Ángel Rivière agradece el respaldo continuado del Excmo. Ayuntamiento de Marbella mediante la concesión de las subvenciones correspondientes a los ejercicios 2025 y 2026.',
        'Para el ejercicio 2026, el Ayuntamiento de Marbella ha otorgado una subvención por importe de 56.000 €, que permite dar continuidad y fortalecer los programas de atención terapéutica, orientación familiar, inclusión y actividades de acompañamiento dirigidas a las personas con TEA y sus familias en nuestro municipio.'
      ],
      media: {
        type: 'image',
        src: new URL('./assets/images/blog/convenio-ayuntamiento-2026.jpg', import.meta.url).href,
        alt: 'Firma del convenio de subvención con la Alcaldesa del Ayuntamiento de Marbella',
        caption: 'Acto de firma del convenio de colaboración entre el Ayuntamiento de Marbella y AAAR'
      }
    },
    'onda-cero': {
      category: 'Entrevista en Radio',
      categoryClass: 'category-yellow',
      date: '26 de enero de 2026 · Onda Cero Marbella',
      title: 'Onda Cero Marbella: La Asociación de Autismo Ángel Rivière trabaja para desarrollar su Centro de Día y Residencia',
      bodyHtml: `
        <p>Nuestra asociación ha participado en el programa <strong>"Más de Uno Marbella" de Onda Cero</strong> para dar a conocer el trabajo que estamos realizando para el desarrollo del futuro <strong>Centro de Día y Residencia</strong> en Marbella.</p>
        <p>Durante la entrevista abordamos las necesidades de las personas con Trastorno del Espectro Autista al llegar a la etapa adulta y cómo este proyecto pionero ofrecerá atención especializada, autonomía y tranquilidad a las familias de toda la Costa del Sol.</p>
        <p style="margin-top: 20px;">
          <a href="https://www.ondacero.es/emisoras/andalucia/marbella/audios-podcast/mas-de-uno/asociacion-autismo-angel-riviere-trabaja-desarrollar-centro-dia_2026012669778296c48f6b4ee36ddbf5.html" target="_blank" rel="noopener noreferrer" class="btn btn-coral">
            <i class="fa-solid fa-headphones"></i> Escuchar entrevista completa en Onda Cero
          </a>
        </p>
      `,
      media: {
        type: 'image',
        src: new URL('./assets/images/elviria-render-aereo.png', import.meta.url).href,
        alt: 'Render del futuro Centro de Día y Residencia de AAAR',
        caption: 'Proyecto del futuro Centro de Día y Residencia de la Asociación de Autismo Ángel Rivière'
      }
    },
    'torneo-golf': {
      category: 'Evento Solidario',
      categoryClass: 'category-green',
      date: 'Evento Benéfico · Marbella',
      title: 'Torneo de Golf Solidario a beneficio de AAAR',
      bodyHtml: `
        <p>Queremos agradecer de corazón a todos los participantes, patrocinadores, voluntarios y colaboradores que hicieron posible nuestro <strong>Torneo de Golf Solidario</strong> a beneficio de la Asociación de Autismo Ángel Rivière.</p>
        <p>Puedes ver el vídeo resumen de la jornada en nuestro canal oficial de Instagram:</p>
        <p style="margin-top: 20px;">
          <a href="https://www.instagram.com/reel/DZ9OHAntwPj/?igsh=MW9ibHo1cmJ4M3YxMQ==" target="_blank" rel="noopener noreferrer" class="btn btn-coral">
            <i class="fa-brands fa-instagram"></i> Ver vídeo del Torneo de Golf en Instagram
          </a>
        </p>
      `,
      media: {
        type: 'image',
        src: new URL('./assets/images/blog/actividad-inclusion-aaar.png', import.meta.url).href,
        alt: 'Torneo de Golf Solidario AAAR',
        caption: 'Jornada solidaria en apoyo a los proyectos de la asociación'
      }
    },
    'loteria-navidad': {
      category: 'Campaña Solidaria',
      categoryClass: 'category-red',
      date: 'Sorteo 22 de diciembre de 2026',
      title: 'Lotería de Navidad 2026 (Nº 69.291): ¡No te quedes sin tu décimo!',
      bodyHtml: `
        <p>Ya puedes adquirir el décimo de la <strong>Lotería Nacional de Navidad 2026</strong> de la Asociación de Autismo Ángel Rivière de Marbella con el número <strong>69.291</strong> (donativo incluido: 23 €).</p>
        <p>Con cada décimo colaboras directamente con el mantenimiento de nuestras terapias, servicios de apoyo familiar y el impulso de nuestro futuro Centro de Día y Residencia.</p>
        <p>Contacta con nuestra sede en Río Real o llámanos al <strong>952 903 333 / 618 848 494</strong> para reservar tus décimos.</p>
      `,
      media: {
        type: 'image',
        src: new URL('./assets/images/blog/decimo-loteria-2026.jpg', import.meta.url).href,
        alt: 'Décimo de Lotería de Navidad 2026 Nº 69.291 de la Asociación de Autismo Ángel Rivière',
        caption: 'Décimo oficial Lotería de Navidad 2026 · Número 69.291 · Asociación de Autismo Ángel Rivière'
      }
    },
    'asamblea-ordinaria': {
      category: 'Asociación',
      categoryClass: 'category-yellow',
      date: '20 de octubre',
      title: 'Convocatoria de Asamblea Ordinaria y Extraordinaria',
      body: [
        'AAAR comparte con las personas asociadas la convocatoria de Asamblea Ordinaria y Extraordinaria.',
        'Este espacio de participación permite conocer la actividad de la asociación, compartir propuestas y tomar parte en las decisiones que orientan sus próximos pasos.'
      ],
      media: {
        type: 'slider',
        label: 'Galería de espacios AAAR',
        items: [
          { src: 'assets/images/hero-original-enhanced/hero-recepcion-mejorada.png', alt: 'Recepción de la asociación', caption: 'Un espacio de bienvenida para familias y personas usuarias.' },
          { src: 'assets/images/hero-original-enhanced/hero-sala-familiar-mejorada.png', alt: 'Sala de atención familiar', caption: 'Atención y acompañamiento a las familias.' },
          { src: 'assets/images/hero-original-enhanced/hero-sala-terapia-mejorada.png', alt: 'Sala de terapia sensorial', caption: 'Entornos adaptados para el desarrollo individual.' }
        ]
      }
    },
    'formacion-voluntariado': {
      category: 'Voluntariado',
      categoryClass: 'category-green',
      date: '16 de abril',
      title: 'Formación para el servicio de apoyo a la inclusión, ocio y tiempo libre',
      body: [
        'La asociación impulsa una formación para personas voluntarias interesadas en apoyar actividades de inclusión, ocio y tiempo libre.',
        'El voluntariado amplía las oportunidades de participación social y acompaña a las personas autistas desde el respeto, la escucha y el apoyo individualizado.'
      ],
      media: {
        type: 'video',
        provider: 'youtube',
        src: 'https://www.youtube.com/embed/fSZYFWM0bdM',
        label: 'Vídeo de presentación de la asociación'
      }
    },
    voluntariado: {
      category: 'Voluntariado',
      categoryClass: 'category-green',
      date: '16 de abril',
      title: 'Voluntariado con chicos y chicas con autismo',
      body: [
        'AAAR invita a las personas interesadas a colaborar en actividades de apoyo, ocio e inclusión junto a chicos y chicas con autismo.',
        'Cada participación contribuye a construir entornos más accesibles, relaciones significativas y experiencias compartidas para toda la comunidad.'
      ],
      media: {
        type: 'audio',
        label: 'Audio de la asociación',
        emptyMessage: 'Esta publicación está preparada para incorporar un enlace de audio cuando esté disponible.'
      }
    },
    comunicado: {
      category: 'Comunicado',
      categoryClass: 'category-red',
      date: '28 de mayo',
      title: 'Comunicado de la asociación',
      body: [
        'AAAR publica este comunicado para mantener informadas a las familias, personas asociadas y entidades colaboradoras sobre asuntos de interés para la asociación.',
        'La transparencia y la comunicación directa forman parte del compromiso de la entidad con toda su comunidad.'
      ]
    },
    covid: {
      category: 'Comunicado',
      categoryClass: 'category-red',
      date: '16 de marzo',
      title: 'Comunicado ante el estado de alerta por COVID-19',
      body: [
        'La asociación compartió esta actualización para informar a su comunidad durante el estado de alerta por COVID-19.',
        'El objetivo fue trasladar la información disponible y acompañar a las familias ante una situación excepcional.'
      ]
    },
    'asamblea-extraordinaria': {
      category: 'Asociación',
      categoryClass: 'category-blue',
      date: '19 de mayo',
      title: 'Convocatoria de Asamblea Extraordinaria',
      body: [
        'AAAR publica la convocatoria de Asamblea Extraordinaria para facilitar la participación de las personas asociadas.',
        'Las asambleas son una herramienta esencial para mantener una asociación abierta, participativa y conectada con las necesidades de sus familias.'
      ]
    },
    'signos-alerta': {
      category: 'Asociación',
      categoryClass: 'category-blue',
      date: 'Guía para familias',
      title: 'Signos de alerta de autismo en niños de 2 a 3 años',
      bodyHtml: `
        <p>Sobre los 2 / 3 años de edad se pueden empezar a identificar señales de alarma en el desarrollo del lenguaje del niño, la interacción social y el comportamiento.</p>
        <p>Detectarlos a tiempo es importante para poder ofrecerle los apoyos adecuados lo antes posible.</p>
        <ul><li>Cada niño es diferente, pero existen señales tempranas que pueden ayudar a las familias a identificar si algo no va como se espera en su desarrollo.</li></ul>
        <h4>🔍 SIGNOS DE AUTISMO EN NIÑOS DE 2 A 3 AÑOS</h4>
        <p>A esta edad, algunos niños pueden mostrar ciertas diferencias en su forma de comunicarse, jugar o relacionarse.</p>
        <h4>🗣️ Dificultades en el lenguaje</h4>
        <p>No dice palabras o tiene muy pocas<br>No combina dos palabras (por ejemplo: “quiero agua”)<br>Repite palabras sin intención comunicativa<br>No responde a su nombre</p>
        <h4>👁️ Interacción social diferente</h4>
        <p>Evita o reduce el contacto visual<br>No señala para compartir interés (por ejemplo, enseñar algo)<br>No imita gestos o acciones<br>Parece no interesarse por otros niños</p>
        <h4>🧸 Juego poco variado o repetitivo</h4>
        <p>Juega siempre de la misma manera<br>Alinea objetos (coches, juguetes…)<br>No realiza juego simbólico (dar de comer a muñecos, por ejemplo)</p>
        <h4>🔁 Conductas repetitivas</h4>
        <p>Movimientos repetitivos (balanceo, aleteo de manos)<br>Necesidad de rutinas muy marcadas<br>Malestar intenso ante cambios</p>
        <h4>🔊 Sensibilidad sensorial</h4>
        <p>Le molestan sonidos, luces o texturas<br>Reacciona de forma intensa a ciertos estímulos o, por el contrario, parece no reaccionar</p>
        <h4>⚠️ CUÁNDO PREOCUPARSE</h4>
        <p>No es necesario que aparezcan todas las señales. Sin embargo, es recomendable consultar con un profesional si:</p>
        <ul><li>El niño no habla o ha dejado de hablar</li><li>No responde a su nombre</li><li>No señala ni comparte intereses</li><li>No muestra intención de comunicarse</li><li>Hay pérdida de habilidades adquiridas</li></ul>
        <h4>🩺 QUÉ HACER SI SOSPECHAS DE AUTISMO</h4>
        <p>Si observas varias de estas señales: consulta con el pediatra, solicita una valoración del desarrollo, acude a un especialista en desarrollo infantil</p>
        <p>La detección temprana permite iniciar apoyos que pueden marcar una gran diferencia en el desarrollo del niño</p>
        <h4>📍 APOYO A FAMILIAS EN MÁLAGA</h4>
        <p>Si buscas orientación sobre los síntomas del autismo en niños de 2 a 3 años en Marbella, Málaga o Andalucía. En AAAR, Asociación Autismo Ángel Riviere ofrecemos información, diagnóstico, acompañamiento, información sobre recursos y apoyo a familias durante todo el proceso.</p>
        <p><i class="fa-solid fa-heart guide-blue-heart" aria-hidden="true"></i> Un niño/a con autismo siente, aprende y se desarrolla, aunque lo haga de una manera diferente. Comprender sus necesidades es el primer paso para ayudarle.</p>
        <p>👉 Detectar a tiempo permite actuar antes y mejorar el desarrollo del niño.</p>
        <h4>¿Tienes dudas sobre tu hijo?</h4>
        <p>Si has identificado algunas de estas señales, no estás solo.</p>
        <p>Podemos ayudarte a entender lo que está ocurriendo y orientarte en los siguientes pasos.</p>
        <p>👉 <a href="#contacto">Contacta con nuestra asociación</a> y te acompañaremos en el proceso.</p>
        <h4>SABER MÁS</h4>
      `,
      media: {
        type: 'image',
        src: new URL('./assets/images/blog/actividad-inclusion-aaar.png', import.meta.url).href,
        alt: 'Espacio de orientación y acompañamiento a familias',
        caption: 'Orientación y acompañamiento a familias'
      }
    }
  };

  const blogFilters = document.querySelectorAll('.blog-filter');
  const blogCards = document.querySelectorAll('.blog-card');
  const blogReadButtons = document.querySelectorAll('.blog-read-button');
  const blogGrid = document.getElementById('blog-grid');
  const blogIntro = document.querySelector('.blog-intro');
  const blogFiltersWrap = document.querySelector('.blog-filters');
  const blogReader = document.getElementById('blog-reader');
  const blogBackButton = document.getElementById('blog-back-button');
  const blogReaderCategory = document.getElementById('blog-reader-category');
  const blogReaderTitle = document.getElementById('blog-reader-title');
  const blogReaderDate = document.getElementById('blog-reader-date');
  const blogReaderMedia = document.getElementById('blog-reader-media');
  const blogReaderBody = document.getElementById('blog-reader-body');

  blogFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      const selected = filter.dataset.filter;
      blogFilters.forEach(item => item.classList.toggle('active', item === filter));
      blogCards.forEach(card => {
        card.hidden = selected !== 'all' && card.dataset.category !== selected;
      });
    });
  });

  function renderBlogMedia(media) {
    if (!blogReaderMedia) return;
    blogReaderMedia.replaceChildren();
    blogReaderMedia.hidden = !media;
    if (!media) return;

    if (media.type === 'image') {
      const figure = document.createElement('figure');
      figure.className = 'article-image';
      const image = document.createElement('img');
      image.src = media.src;
      image.alt = media.alt;
      image.loading = 'eager';
      const caption = document.createElement('figcaption');
      caption.textContent = media.caption;
      figure.append(image, caption);
      blogReaderMedia.append(figure);
      return;
    }

    if (media.type === 'slider') {
      const slider = document.createElement('section');
      slider.className = 'article-slider';
      slider.setAttribute('aria-label', media.label);
      const image = document.createElement('img');
      const caption = document.createElement('p');
      caption.className = 'article-slider-caption';
      const controls = document.createElement('div');
      controls.className = 'article-slider-controls';
      const previous = document.createElement('button');
      previous.type = 'button';
      previous.setAttribute('aria-label', 'Imagen anterior');
      previous.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
      const counter = document.createElement('span');
      const next = document.createElement('button');
      next.type = 'button';
      next.setAttribute('aria-label', 'Imagen siguiente');
      next.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
      controls.append(previous, counter, next);
      slider.append(image, caption, controls);

      let currentItem = 0;
      const updateSlide = () => {
        const item = media.items[currentItem];
        image.src = item.src;
        image.alt = item.alt;
        caption.textContent = item.caption;
        counter.textContent = `${currentItem + 1} / ${media.items.length}`;
      };
      previous.addEventListener('click', () => {
        currentItem = (currentItem - 1 + media.items.length) % media.items.length;
        updateSlide();
      });
      next.addEventListener('click', () => {
        currentItem = (currentItem + 1) % media.items.length;
        updateSlide();
      });
      updateSlide();
      blogReaderMedia.append(slider);
      return;
    }

    if (media.type === 'video' && media.provider === 'youtube') {
      const mediaFrame = document.createElement('div');
      mediaFrame.className = 'article-video';
      const label = document.createElement('p');
      label.className = 'article-media-label';
      label.innerHTML = `<i class="fa-solid fa-video"></i> ${media.label}`;
      const iframe = document.createElement('iframe');
      iframe.src = media.src;
      iframe.title = media.label;
      iframe.loading = 'lazy';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      mediaFrame.append(label, iframe);
      blogReaderMedia.append(mediaFrame);
      return;
    }

    const mediaFrame = document.createElement('div');
    mediaFrame.className = `article-${media.type}`;
    const label = document.createElement('p');
    label.className = 'article-media-label';
    label.innerHTML = `<i class="fa-solid fa-${media.type === 'video' ? 'video' : 'headphones'}"></i> ${media.label}`;
    if (!media.src) {
      const empty = document.createElement('p');
      empty.className = 'article-media-empty';
      empty.textContent = media.emptyMessage;
      mediaFrame.append(label, empty);
      blogReaderMedia.append(mediaFrame);
      return;
    }

    const player = document.createElement(media.type);
    player.controls = true;
    player.preload = 'metadata';
    if (media.poster) player.poster = media.poster;
    const source = document.createElement('source');
    source.src = media.src;
    source.type = 'video/mp4';
    player.append(source);
    mediaFrame.append(label, player);
    blogReaderMedia.append(mediaFrame);
  }

  function showBlogPost(postId) {
    const post = blogPosts[postId];
    if (!post || !blogReader || !blogReaderCategory || !blogReaderTitle || !blogReaderDate || !blogReaderBody) return;

    blogReaderCategory.className = `blog-category ${post.categoryClass}`;
    blogReaderCategory.textContent = post.category;
    blogReaderTitle.textContent = post.title;
    blogReaderDate.textContent = post.date;
    renderBlogMedia(post.media);
    if (post.bodyHtml) {
      blogReaderBody.innerHTML = post.bodyHtml;
    } else {
      blogReaderBody.replaceChildren(...post.body.map(text => {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        return paragraph;
      }));
    }

    if (blogIntro) blogIntro.hidden = true;
    if (blogFiltersWrap) blogFiltersWrap.hidden = true;
    if (blogGrid) blogGrid.hidden = true;
    blogReader.hidden = false;
    blogReader.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showBlogIndex() {
    if (blogIntro) blogIntro.hidden = false;
    if (blogFiltersWrap) blogFiltersWrap.hidden = false;
    if (blogGrid) blogGrid.hidden = false;
    if (blogReader) blogReader.hidden = true;
    if (blogIntro) blogIntro.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  blogReadButtons.forEach(button => {
    button.addEventListener('click', () => showBlogPost(button.dataset.article));
  });

  if (blogBackButton) blogBackButton.addEventListener('click', showBlogIndex);

  // --- 6a. HOME LATEST NEWS CONTINUOUS HORIZONTAL MARQUEE (SYNCED WITH #actualidad) ---
  const homeNewsTrack = document.getElementById('home-news-marquee-track');
  const homeNewsScroller = homeNewsTrack ? homeNewsTrack.closest('.home-news-marquee') : null;
  if (homeNewsTrack && homeNewsScroller && blogCards.length > 0) {
    let pointerStartX = 0;
    let pointerStartY = 0;
    let draggedHorizontally = false;

    const createHomeNewsSet = (isDuplicate = false) => {
      const set = document.createElement('div');
      set.className = 'home-news-marquee-set';
      if (isDuplicate) set.setAttribute('aria-hidden', 'true');

      blogCards.forEach(sourceCard => {
        const clone = sourceCard.cloneNode(true);
        clone.classList.remove('reveal', 'active-reveal', 'blog-featured');
        clone.classList.add('home-news-marquee-card');
        clone.removeAttribute('hidden');
        if (isDuplicate) {
          clone.setAttribute('tabindex', '-1');
          clone.querySelectorAll('button, a').forEach(el => el.setAttribute('tabindex', '-1'));
        }

        const readBtn = clone.querySelector('.blog-read-button');
        const articleId = readBtn ? readBtn.getAttribute('data-article') : null;

        const openFromHome = (e) => {
          if (draggedHorizontally) {
            e.preventDefault();
            return;
          }
          e.preventDefault();
          window.location.hash = '#actualidad';
          setTimeout(() => {
            if (articleId) {
              showBlogPost(articleId);
            }
          }, 60);
        };

        if (readBtn) {
          readBtn.addEventListener('click', openFromHome);
        }
        clone.addEventListener('click', (e) => {
          if (!e.target.closest('.blog-read-button')) {
            openFromHome(e);
          }
        });

        set.appendChild(clone);
      });

      return set;
    };

    // Render 3 identical sets so the user can swipe infinitely both left and right
    const setA = createHomeNewsSet(true);
    const setB = createHomeNewsSet(false);
    const setC = createHomeNewsSet(true);
    homeNewsTrack.replaceChildren(setA, setB, setC);

    let setWidth = 0;
    let preciseScroll = 0;
    let isDesktopHovered = false;
    let isTouchSwipingX = false;
    let touchResumeTimer = null;
    const isDesktopPointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const measureAndCenter = () => {
      const w = setB.offsetWidth;
      if (w > 0 && Math.abs(w - setWidth) > 2) {
        setWidth = w;
        if (homeNewsScroller.scrollLeft < setWidth * 0.5 || homeNewsScroller.scrollLeft > setWidth * 2.5) {
          homeNewsScroller.scrollLeft = setWidth;
          preciseScroll = setWidth;
        }
      }
    };

    const normalizeInfiniteScroll = () => {
      if (!setWidth) setWidth = setB.offsetWidth;
      if (!setWidth) return;
      if (homeNewsScroller.scrollLeft >= setWidth * 2) {
        homeNewsScroller.scrollLeft -= setWidth;
        preciseScroll = homeNewsScroller.scrollLeft;
      } else if (homeNewsScroller.scrollLeft <= 2) {
        homeNewsScroller.scrollLeft += setWidth;
        preciseScroll = homeNewsScroller.scrollLeft;
      }
    };

    // Desktop only: pause on mouse hover so user can click comfortably
    homeNewsScroller.addEventListener('mouseenter', () => {
      if (isDesktopPointer()) isDesktopHovered = true;
    });
    homeNewsScroller.addEventListener('mouseleave', () => {
      isDesktopHovered = false;
      preciseScroll = homeNewsScroller.scrollLeft;
    });

    // Touch handling: vertical scroll does NOT stop the marquee; horizontal finger drag moves smoothly both ways
    homeNewsScroller.addEventListener('touchstart', (e) => {
      if (!e.touches[0]) return;
      pointerStartX = e.touches[0].clientX;
      pointerStartY = e.touches[0].clientY;
      draggedHorizontally = false;
      if (touchResumeTimer) {
        clearTimeout(touchResumeTimer);
        touchResumeTimer = null;
      }
    }, { passive: true });

    homeNewsScroller.addEventListener('touchmove', (e) => {
      if (!e.touches[0]) return;
      const dx = Math.abs(e.touches[0].clientX - pointerStartX);
      const dy = Math.abs(e.touches[0].clientY - pointerStartY);
      if (dx > 8 && dx > dy) {
        draggedHorizontally = true;
        isTouchSwipingX = true;
        preciseScroll = homeNewsScroller.scrollLeft;
      }
    }, { passive: true });

    const endTouchSwipe = () => {
      if (isTouchSwipingX) {
        if (touchResumeTimer) clearTimeout(touchResumeTimer);
        // Wait briefly for native momentum scroll to settle, then continue seamless auto-scroll
        touchResumeTimer = setTimeout(() => {
          preciseScroll = homeNewsScroller.scrollLeft;
          isTouchSwipingX = false;
        }, 550);
      }
      setTimeout(() => {
        draggedHorizontally = false;
      }, 80);
    };

    homeNewsScroller.addEventListener('touchend', endTouchSwipe, { passive: true });
    homeNewsScroller.addEventListener('touchcancel', endTouchSwipe, { passive: true });

    homeNewsScroller.addEventListener('scroll', () => {
      normalizeInfiniteScroll();
      if (isTouchSwipingX || isDesktopHovered) {
        preciseScroll = homeNewsScroller.scrollLeft;
      }
    }, { passive: true });

    window.addEventListener('resize', measureAndCenter, { passive: true });
    requestAnimationFrame(() => {
      measureAndCenter();
      const step = () => {
        if (!setWidth) measureAndCenter();
        if (setWidth > 0 && !isDesktopHovered && !isTouchSwipingX) {
          preciseScroll += 0.65;
          if (preciseScroll >= setWidth * 2) {
            preciseScroll -= setWidth;
          }
          homeNewsScroller.scrollLeft = preciseScroll;
        }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  // --- 6b. 3D DIGITAL BOOKSTORE & PDF READER MODAL ---
  const btnJumpLibreria = document.getElementById('btn-jump-libreria');
  const librarySection = document.getElementById('libreria-guias');
  const libPills = document.querySelectorAll('.lib-pill');
  const bookCards = document.querySelectorAll('.book-showcase-card');
  const bookReadBtns = document.querySelectorAll('.btn-book-read');
  const pdfModal = document.getElementById('pdf-reader-modal');
  const pdfModalBackdrop = document.getElementById('pdf-reader-backdrop');
  const pdfModalClose = document.getElementById('pdf-modal-close');
  const pdfModalTitle = document.getElementById('pdf-modal-title');
  const pdfModalIframe = document.getElementById('pdf-modal-iframe');
  const pdfModalDownload = document.getElementById('pdf-modal-download');
  const pdfModalNewtab = document.getElementById('pdf-modal-newtab');

  if (btnJumpLibreria && librarySection) {
    btnJumpLibreria.addEventListener('click', () => {
      if (blogReader && !blogReader.hidden) {
        showBlogIndex();
      }
      const headerOffset = 110;
      const topPos = librarySection.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: topPos, behavior: 'smooth' });
    });
  }

  libPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cat = pill.getAttribute('data-lib-filter');
      libPills.forEach(p => p.classList.toggle('active', p === pill));
      bookCards.forEach(card => {
        const matches = cat === 'all' || card.getAttribute('data-lib-category') === cat;
        card.hidden = !matches;
        card.classList.toggle('is-filtered-out', !matches);
      });
    });
  });

  // Mobile/Touch toggle for book cards so tapping a book reveals the overlay
  bookCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-book-read') || e.target.closest('.btn-book-download')) {
        return;
      }
      const wasActive = card.classList.contains('is-open');
      bookCards.forEach(c => c.classList.remove('is-open'));
      if (!wasActive) {
        card.classList.add('is-open');
      }
    });
  });

  if (pdfModal && pdfModalIframe) {
    const openPdfReader = (url, title) => {
      if (pdfModalTitle) pdfModalTitle.textContent = title || 'Visor de Guía PDF';
      pdfModalIframe.src = url;
      if (pdfModalDownload) {
        pdfModalDownload.href = url;
        pdfModalDownload.setAttribute('download', (title || 'Guia-AAAR').replace(/[^a-zA-Z0-9_-]+/g, '-') + '.pdf');
      }
      if (pdfModalNewtab) {
        pdfModalNewtab.href = url;
      }
      pdfModal.classList.add('active');
      pdfModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closePdfReader = () => {
      pdfModal.classList.remove('active');
      pdfModal.setAttribute('aria-hidden', 'true');
      pdfModalIframe.src = 'about:blank';
      document.body.style.overflow = '';
    };

    bookReadBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = btn.getAttribute('data-pdf-url');
        const title = btn.getAttribute('data-pdf-title');
        if (url) openPdfReader(url, title);
      });
    });

    if (pdfModalClose) pdfModalClose.addEventListener('click', closePdfReader);
    if (pdfModalBackdrop) pdfModalBackdrop.addEventListener('click', closePdfReader);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && pdfModal.classList.contains('active')) {
        closePdfReader();
      }
    });
  }

  // --- 7. PARTNER MARQUEE ---
  // Keystatic-ready fields for each collaborator: title, logo and link.
  const partners = [
    { title: 'Ayuntamiento de Marbella', logo: new URL('./assets/images/logo-ayuntamiento-marbella.png', import.meta.url).href, link: 'https://ayuntamiento.marbella.es/' },
    { title: 'Plataforma para la Promoción del Voluntariado de Marbella', logo: new URL('./assets/images/logo-plataforma-voluntariado.jpg', import.meta.url).href, link: 'https://ayuntamiento.marbella.es/' },
    { title: 'Fundación ”la Caixa”', logo: 'https://www.google.com/s2/favicons?domain=fundacionlacaixa.org&sz=256', link: 'https://fundacionlacaixa.org/es/' },
    { title: 'CaixaBank', logo: 'https://www.google.com/s2/favicons?domain=caixabank.es&sz=256', link: 'https://www.caixabank.es/' },
    { title: 'Rotary Club Marbella', logo: 'https://www.google.com/s2/favicons?domain=rotaryclubmarbella.es&sz=256', link: 'https://rotaryclubmarbella.es/' },
    { title: 'Aguja Solidaria', logo: 'https://www.google.com/s2/favicons?domain=agujasolidaria.org&sz=256', link: 'https://agujasolidaria.org/' },
    { title: 'Fuerte Nagüeles', logo: new URL('./assets/images/logo-fuerte-nagueles.png', import.meta.url).href, link: 'https://fuertenagueles.com/' },
    { title: 'Asociación CADI', logo: new URL('./assets/images/logo-cadi.png', import.meta.url).href, link: 'https://www.asociacioncadi.org/' },
    { title: 'Global Gift Foundation', logo: 'https://www.google.com/s2/favicons?domain=globalgiftfoundation.org&sz=256', link: 'https://www.globalgiftfoundation.org/es/' },
    { title: 'Alar Consultores', logo: 'https://www.google.com/s2/favicons?domain=alarconsultores.com&sz=256', link: 'https://www.alarconsultores.com/' },
    { title: 'CD Marbella Juega', logo: 'https://www.google.com/s2/favicons?domain=cdmarbellajuega.com&sz=256', link: 'https://www.cdmarbellajuega.com/' }
  ];

  // --- 7b. INTERACTIVE STATUTES PANEL IN REGISTROS ---
  const btnToggleStatutes = document.getElementById('btn-toggle-statutes');
  const btnCloseStatutes = document.getElementById('btn-close-statutes');
  const statutesPanel = document.getElementById('statutes-expand-panel');
  const statutesToggleLabel = document.getElementById('statutes-toggle-label');
  const statutesToggleIcon = document.getElementById('statutes-toggle-icon');

  if (btnToggleStatutes && statutesPanel) {
    const setStatutesOpen = (open) => {
      statutesPanel.hidden = !open;
      btnToggleStatutes.setAttribute('aria-expanded', String(open));
      btnToggleStatutes.classList.toggle('active', open);
      if (statutesToggleLabel) {
        statutesToggleLabel.textContent = open ? 'Ocultar los Estatutos' : 'Abrir y leer los Estatutos';
      }
      if (statutesToggleIcon) {
        statutesToggleIcon.className = open ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down';
      }
      if (open) {
        setTimeout(() => {
          statutesPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 60);
      }
    };

    btnToggleStatutes.addEventListener('click', () => {
      setStatutesOpen(statutesPanel.hidden);
    });

    btnToggleStatutes.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setStatutesOpen(statutesPanel.hidden);
      }
    });

    if (btnCloseStatutes) {
      btnCloseStatutes.addEventListener('click', () => {
        setStatutesOpen(false);
        btnToggleStatutes.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

  const partnersTrack = document.getElementById('partners-marquee-track');
  if (partnersTrack) {
    const createPartnerSet = (isDuplicate = false) => {
      const set = document.createElement('div');
      set.className = 'partners-marquee-set';
      if (isDuplicate) set.setAttribute('aria-hidden', 'true');
      partners.forEach(partner => {
        const link = document.createElement('a');
        link.className = 'partner-logo-card';
        link.href = partner.link;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', `Visitar web de ${partner.title}`);
        const fallback = document.createElement('span');
        fallback.className = 'partner-logo-fallback';
        fallback.textContent = partner.title;
        const image = document.createElement('img');
        image.src = partner.logo;
        image.alt = `Logotipo de ${partner.title}`;
        image.loading = 'lazy';
        image.addEventListener('error', () => image.remove());
        link.append(fallback, image);
        set.append(link);
      });
      return set;
    };
    partnersTrack.append(createPartnerSet(), createPartnerSet(true));
  }


  // --- 8. INTERACTIVE TIMELINE ROADMAP: ELVIRIA ---
  const roadmapBtns = document.querySelectorAll('.roadmap-btn');
  const roadmapDisplay = document.getElementById('roadmap-display');
  const phaseTitle = document.getElementById('phase-title');
  const phaseDesc = document.getElementById('phase-desc');
  const phasePrice = document.getElementById('phase-price');

  const roadmapData = {
    '1': {
      num: 'Fase 1',
      title: 'Viabilidad, Fianza y Aceptación de Parcela',
      desc: 'Conformidad oficial de la parcela de 6.650 m² ratificada por unanimidad en la Asamblea Extraordinaria del 9 de octubre de 2025.',
      price: '46.897,54 €'
    },
    '2': {
      num: 'Fase 2',
      title: 'Desarrollo del Proyecto Básico y de Ejecución',
      desc: 'Redacción y visado técnico del proyecto arquitectónico del Centro de Día, Residencia y Viviendas Tuteladas. Incluye estudios topográficos, diseño de accesibilidad cognitiva, eficiencia energética y tramitación de licencias de obra.',
      price: '75.000,00 €'
    },
    '3': {
      num: 'Fase 3',
      title: 'Adecuación del Terreno y Cimentación',
      desc: 'Movimiento de tierras en la parcela de Santa María-Elviria, vallado perimetral de seguridad, dotación de accesos viales, acometidas básicas de agua/luz, y levantamiento de la cimentación principal (fase inicial de obra).',
      price: '320.000,00 €'
    },
    '4': {
      num: 'Fase 4',
      title: 'Estructura y Albañilería de Edificios',
      desc: 'Levantamiento de pilares, forjados de plantas, cerramientos exteriores de fachada con aislamiento termo-acústico y tabiquería interior para separar las viviendas tuteladas, comedor, oficinas y salas de terapia.',
      price: '850.000,00 €'
    },
    '5': {
      num: 'Fase 5',
      title: 'Equipamiento Terapéutico y Puesta en Marcha',
      desc: 'Mobiliario adaptado para personas autistas, equipamiento completo de salas de integración sensorial y psicomotricidad, cocina industrial, climatización inteligente y tramitación de la licencia de apertura e inauguración.',
      price: '280.000,00 €'
    }
  };

  roadmapBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons
      roadmapBtns.forEach(b => b.classList.remove('active'));
      
      // Make current active
      btn.classList.add('active');
      
      const phase = btn.getAttribute('data-phase');
      if (roadmapData[phase]) {
        const data = roadmapData[phase];
        
        // Update display text with animation
        roadmapDisplay.style.opacity = '0';
        
        setTimeout(() => {
          roadmapDisplay.querySelector('.phase-number').textContent = data.num;
          phaseTitle.textContent = data.title;
          phaseDesc.textContent = data.desc;
          phasePrice.textContent = data.price;
          roadmapDisplay.style.opacity = '1';
        }, 150);
      }
    });
  });

  // Default to Phase 1 on startup
  const firstPhaseBtn = document.querySelector('.roadmap-btn[data-phase="1"]');
  if (firstPhaseBtn) {
    firstPhaseBtn.click();
  }



  // --- 8. CLIPBOARD IBAN COPY ---
  const btnCopyIban = document.getElementById('btn-copy-iban');
  const ibanTarget = document.getElementById('iban-copy-target');
  const copiedToast = document.getElementById('copied-toast');

  if (btnCopyIban && ibanTarget && copiedToast) {
    btnCopyIban.addEventListener('click', () => {
      // Clean spaces from IBAN for a clean copy
      const ibanText = ibanTarget.textContent.replace(/\s+/g, '');
      
      navigator.clipboard.writeText(ibanText).then(() => {
        // Show success toast
        copiedToast.classList.add('show');
        
        // Hide after 2.5 seconds
        setTimeout(() => {
          copiedToast.classList.remove('show');
        }, 2500);
      }).catch(err => {
        console.error('No se pudo copiar el texto: ', err);
      });
    });
  }


  // --- 9. CONTACT FORM SIMULATION ---
  const contactForm = document.getElementById('association-contact-form');
  const successAlert = document.getElementById('form-success-alert');

  if (contactForm && successAlert) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic validation
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const msg = document.getElementById('contact-msg').value.trim();
      const privacy = document.getElementById('contact-privacy').checked;

      if (!privacy) {
        alert("Debes aceptar la política de privacidad.");
        return;
      }

      // Hide form inputs
      contactForm.style.display = 'none';
      
      // Show success container
      successAlert.style.display = 'block';
    });
  }


  // --- 10. PREMIUM MICRO-INTERACTIVE PARALLAX ON HERO BLOBS ---
  const heroSection = document.querySelector('.hero-spectacular');
  const blobs = document.querySelectorAll('.glow-blob');

  if (heroSection && blobs.length > 0 && window.innerWidth > 768) {
    heroSection.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;

      blobs.forEach((blob, idx) => {
        // Different factors for multi-layered depth
        const factor = (idx + 1) * 15;
        const xTrans = (mouseX - 0.5) * factor;
        const yTrans = (mouseY - 0.5) * factor;
        blob.style.transform = `translate(${xTrans}px, ${yTrans}px)`;
      });
    });
  }


  // --- 11. REGISTRATION DONATION FORM ---
  const donationSubmitForm = document.getElementById('donation-submit-form');
  const donationSuccessBox = document.getElementById('donation-success-box');

  if (donationSubmitForm && donationSuccessBox) {
    donationSubmitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const privacy = document.getElementById('don-privacy').checked;
      if (!privacy) {
        alert("Debes aceptar la política de privacidad.");
        return;
      }
      
      // Get input values for simulated PDF receipt
      const name = document.getElementById('don-name').value.trim();
      const dni = document.getElementById('don-id').value.trim();
      const amount = document.getElementById('don-amount').value || '250';
      const type = document.getElementById('don-type').value || 'puntual';

      // Hide form
      donationSubmitForm.style.display = 'none';
      
      // Show success
      donationSuccessBox.style.display = 'block';

      // Attach PDF simulation listener
      const btnDownloadPdf = document.getElementById('btn-download-pdf');
      if (btnDownloadPdf) {
        // Remove previous listener if any by replacing element
        const newBtn = btnDownloadPdf.cloneNode(true);
        btnDownloadPdf.parentNode.replaceChild(newBtn, btnDownloadPdf);
        
        newBtn.addEventListener('click', () => {
          alert("Generando justificante provisional en formato PDF... Su descarga comenzará en unos instantes.");
          
          // Generate a beautifully structured mock text PDF file content
          const dateStr = new Date().toLocaleDateString('es-ES');
          const fakePdfContent = `%PDF-1.4
%
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 595 842] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
5 0 obj
<< /Length 500 >>
stream
BT
/F1 18 Tf
50 750 Td (JUSTIFICANTE PROVISIONAL DE REGISTRO DE DONACION - AAAR) Tj
0 -40 Td /F1 12 Tf (Entidad Declarada de Utilidad Publica - NIF: G-92396118) Tj
0 -45 Td (Fecha de Registro: ${dateStr}) Tj
0 -25 Td (Donante: ${name}) Tj
0 -20 Td (NIF/NIE/CIF: ${dni}) Tj
0 -20 Td (Importe Registrado: ${amount} EUR) Tj
0 -20 Td (Modalidad: Donacion ${type.toUpperCase()}) Tj
0 -40 Td (Detalles de Pago para transferencia:) Tj
0 -20 Td (Banco: CaixaBank   IBAN: ES92 2100 9033 8002 0023 9455   Bizum: 15174) Tj
0 -40 Td (Por favor, realice la transferencia bancaria adjuntando su DNI en el concepto.) Tj
0 -20 Td (Este documento es un justificante provisional. Recibira el certificado fiscal oficial) Tj
0 -15 Td (en su correo electronico tras la verificacion de la transferencia.) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000074 00000 n 
0000000143 00000 n 
0000000281 00000 n 
0000000371 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
920
%%EOF`;

          const blob = new Blob([fakePdfContent], { type: "application/pdf" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `Justificante_Donacion_Provisional_${dni.replace(/\s+/g, '')}.pdf`;
          link.click();
        });
      }
    });
  }


  // --- 10. HERO SLIDER LUMÍNICO (CONTROLLER) ---
  function initHeroSlider() {
    const heroSlider = document.getElementById('hero-slider-section');
    if (!heroSlider) return;

    // The inline controller is initialized first. Avoid a second autoplay
    // timer competing with it and making crossfades feel uneven.
    if (typeof window.heroGoToSlide === 'function') return;

    const bgSlides = heroSlider.querySelectorAll('.hero-bg-slide');
    const contents = heroSlider.querySelectorAll('.hero-slide-content');
    const tabBtns = heroSlider.querySelectorAll('.hero-tab-btn');
    const prevArrow = document.getElementById('hero-prev-arrow');
    const nextArrow = document.getElementById('hero-next-arrow');

    if (bgSlides.length === 0) return;

    let currentSlide = 0;
    const totalSlides = bgSlides.length;
    let autoPlayTimer = null;

    function goToSlide(targetIndex) {
      if (targetIndex < 0) targetIndex = totalSlides - 1;
      if (targetIndex >= totalSlides) targetIndex = 0;

      currentSlide = targetIndex;

      // Update background slides
      bgSlides.forEach((slide, i) => {
        if (i === currentSlide) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      // Update content layers
      contents.forEach((content, i) => {
        if (i === currentSlide) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });

      // Update tab buttons
      tabBtns.forEach((tab, i) => {
        if (i === currentSlide) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
    }

    // Expose globally for testing / control
    window.goToHeroSlide = goToSlide;

    // Arrow navigation
    if (prevArrow) {
      prevArrow.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(currentSlide - 1);
        resetAutoPlay();
      };
    }

    if (nextArrow) {
      nextArrow.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(currentSlide + 1);
        resetAutoPlay();
      };
    }

    // Tab buttons
    tabBtns.forEach(tab => {
      tab.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const target = parseInt(tab.getAttribute('data-slide-target'), 10);
        goToSlide(target);
        resetAutoPlay();
      };
    });

    // Auto-advance timer (every 6s)
    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 6000);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    function resetAutoPlay() {
      startAutoPlay();
    }

    heroSlider.onmouseenter = stopAutoPlay;
    heroSlider.onmouseleave = startAutoPlay;

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (window.scrollY < 400) {
        if (e.key === 'ArrowRight') {
          goToSlide(currentSlide + 1);
          resetAutoPlay();
        } else if (e.key === 'ArrowLeft') {
          goToSlide(currentSlide - 1);
          resetAutoPlay();
        }
      }
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    heroSlider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    heroSlider.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX < 0) {
          goToSlide(currentSlide + 1);
        } else {
          goToSlide(currentSlide - 1);
        }
        resetAutoPlay();
      }
    }, { passive: true });

    // Initialize slide 0 & start auto-play
    goToSlide(0);
    startAutoPlay();
  }

  initHeroSlider();

}

// Robust execution whether DOM is already loaded or pending
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
