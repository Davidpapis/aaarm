/* ==========================================================================
   JAVASCRIPT LOGIC: ASOCIACIÓN AUTISMO ÁNGEL RIVIÈRE
   SPA ScrollSpy routing, acrostic letters, tax calculator, progress slider,
   copy IBAN, scroll reveals, full-screen lightbox video, and dynamic floating button.
   ========================================================================== */

function initApp() {

  // --- 1. MOBILE NAVIGATION MENU TOGGLE ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isActive = mobileToggle.classList.toggle('active');
      mobileMenu.style.display = isActive ? 'block' : 'none';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileMenu.style.display = 'none';
      });
    });
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
      desc: 'En el autismo se expresan de forma sincera y sin filtros sociales artificiales, ofreciendo una visión directa, pura y auténtica de su mundo interior.'
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
      date: '23 de octubre · Proyecto 2024',
      title: 'Renovamos el convenio para 2024 con el Ayuntamiento de Marbella',
      body: [
        'La Asociación de Autismo Ángel Rivière renueva su colaboración con el Ayuntamiento de Marbella para dar continuidad a las actividades dirigidas a personas autistas y sus familias.',
        'El apoyo permite sostener servicios de acompañamiento, actividades de ocio y tiempo libre, así como el trabajo diario que realiza la asociación con la comunidad.'
      ],
      media: {
        type: 'image',
        src: new URL('./assets/images/blog/actividad-inclusion-aaar.png', import.meta.url).href,
        alt: 'Espacio luminoso preparado para una actividad de inclusión y acompañamiento',
        caption: 'Actividad de acompañamiento e inclusión · Imagen editorial'
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

  // --- 7. PARTNER MARQUEE ---
  // Keystatic-ready fields for each collaborator: title, logo and link.
  const partners = [
    { title: 'Ayuntamiento de Marbella', logo: 'https://www.google.com/s2/favicons?domain=ayuntamiento.marbella.es&sz=256', link: 'https://ayuntamiento.marbella.es/' },
    { title: 'Fundación ”la Caixa”', logo: 'https://www.google.com/s2/favicons?domain=fundacionlacaixa.org&sz=256', link: 'https://fundacionlacaixa.org/es/' },
    { title: 'CaixaBank', logo: 'https://www.google.com/s2/favicons?domain=caixabank.es&sz=256', link: 'https://www.caixabank.es/' },
    { title: 'Rotary Club Marbella', logo: 'https://www.google.com/s2/favicons?domain=rotaryclubmarbella.es&sz=256', link: 'https://rotaryclubmarbella.es/' },
    { title: 'Aguja Solidaria', logo: 'https://www.google.com/s2/favicons?domain=agujasolidaria.org&sz=256', link: 'https://agujasolidaria.org/' },
    { title: 'Fuerte Nagüeles', logo: 'https://www.google.com/s2/favicons?domain=fuertenagueles.com&sz=256', link: 'https://fuertenagueles.com/' },
    { title: 'Asociación CADI', logo: 'https://www.google.com/s2/favicons?domain=asociacioncadi.org&sz=256', link: 'https://www.asociacioncadi.org/' },
    { title: 'Global Gift Foundation', logo: 'https://www.google.com/s2/favicons?domain=globalgiftfoundation.org&sz=256', link: 'https://www.globalgiftfoundation.org/es/' },
    { title: 'Alar Consultores', logo: 'https://www.google.com/s2/favicons?domain=alarconsultores.com&sz=256', link: 'https://www.alarconsultores.com/' },
    { title: 'CD Marbella Juega', logo: 'https://www.google.com/s2/favicons?domain=cdmarbellajuega.com&sz=256', link: 'https://www.cdmarbellajuega.com/' }
  ];

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
  const phasePercent = document.getElementById('phase-percent');
  const phaseProgressFill = document.getElementById('phase-progress-fill');
  const phasePrice = document.getElementById('phase-price');

  const roadmapData = {
    '1': {
      num: 'Fase 1',
      title: 'Viabilidad, Fianza y Aceptación de Parcela',
      desc: 'Conformidad oficial de la parcela de 6.650 m² firmada por la presidenta Lourdes Hijano Utrera y ratificada por unanimidad en la Asamblea Extraordinaria del 9 de octubre de 2025. Se ha tramitado y depositado la fianza administrativa municipal de 46.897,54 €.',
      percent: '100%',
      price: '46.897,54 €',
      width: '100%'
    },
    '2': {
      num: 'Fase 2',
      title: 'Desarrollo del Proyecto Básico y de Ejecución',
      desc: 'Redacción y visado técnico del proyecto arquitectónico del Centro de Día, Residencia y Viviendas Tuteladas. Incluye estudios topográficos, diseño de accesibilidad cognitiva, eficiencia energética y tramitación de licencias de obra.',
      percent: '60%',
      price: '75.000,00 €',
      width: '60%'
    },
    '3': {
      num: 'Fase 3',
      title: 'Adecuación del Terreno y Cimentación',
      desc: 'Movimiento de tierras en la parcela de Santa María-Elviria, vallado perimetral de seguridad, dotación de accesos viales, acometidas básicas de agua/luz, y levantamiento de la cimentación principal (fase inicial de obra).',
      percent: '15%',
      price: '320.000,00 €',
      width: '15%'
    },
    '4': {
      num: 'Fase 4',
      title: 'Estructura y Albañilería de Edificios',
      desc: 'Levantamiento de pilares, forjados de plantas, cerramientos exteriores de fachada con aislamiento termo-acústico y tabiquería interior para separar las viviendas tuteladas, comedor, oficinas y salas de terapia.',
      percent: '0%',
      price: '850.000,00 €',
      width: '0%'
    },
    '5': {
      num: 'Fase 5',
      title: 'Equipamiento Terapéutico y Puesta en Marcha',
      desc: 'Mobiliario adaptado para personas autistas, equipamiento completo de salas de integración sensorial y psicomotricidad, cocina industrial, climatización inteligente y tramitación de la licencia de apertura e inauguración.',
      percent: '0%',
      price: '280.000,00 €',
      width: '0%'
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
          phasePercent.textContent = data.percent;
          phaseProgressFill.style.width = data.width;
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

  // --- 7. INTERACTIVE TAX CALCULATOR WIDGET ---
  const donationInput = document.getElementById('donation-input');
  const calcDeduction = document.getElementById('calc-deduction');
  const calcNet = document.getElementById('calc-net');
  const calcPercent = document.getElementById('calc-percent');

  if (donationInput && calcDeduction && calcNet && calcPercent) {
    const calculateTaxes = () => {
      const amount = parseFloat(donationInput.value) || 0;
      let deduction = 0;

      if (amount <= 0) {
        calcDeduction.textContent = "0.00 €";
        calcNet.textContent = "0.00 €";
        calcPercent.textContent = "0%";
        return;
      }

      // Spanish Tax Law 49/2002 for Public Utility Entities (2025/2026 guidelines)
      // 80% deduction on the first 250€
      // 40% deduction on anything above 250€
      if (amount <= 250) {
        deduction = amount * 0.8;
      } else {
        deduction = (250 * 0.8) + ((amount - 250) * 0.4);
      }

      const netCost = amount - deduction;
      const averagePercent = (deduction / amount) * 100;

      // Update text views
      calcDeduction.textContent = `${deduction.toFixed(2)} €`;
      calcNet.textContent = `${netCost.toFixed(2)} €`;
      calcPercent.textContent = `${Math.round(averagePercent)}%`;
    };

    donationInput.addEventListener('input', calculateTaxes);
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
0 -20 Td (Banco: CaixaBank   IBAN: ES92 2100 9033 8002 0023 9455) Tj
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
