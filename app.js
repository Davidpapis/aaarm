/* ==========================================================================
   JAVASCRIPT LOGIC: ASOCIACIÓN AUTISMO ÁNGEL RIVIÈRE
   SPA ScrollSpy routing, acrostic letters, tax calculator, progress slider,
   copy IBAN, scroll reveals, full-screen lightbox video, and dynamic floating button.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

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


  // --- 3. VIDEO LIGHTBOX MODAL ---
  const triggerVideoModal = document.getElementById('trigger-video-modal');
  const videoModal = document.getElementById('video-modal');
  const videoModalClose = document.getElementById('video-modal-close');
  const videoModalOverlay = document.getElementById('video-modal-overlay');
  const lightboxVideo = document.getElementById('lightbox-video');

  if (triggerVideoModal && videoModal && lightboxVideo) {
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

    triggerVideoModal.addEventListener('click', openModal);
    
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
      desc: 'Las personas autistas se expresan de forma sincera y sin filtros sociales artificiales, ofreciendo una visión directa, pura y auténtica de su mundo interior.'
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

  letterBoxes.forEach(box => {
    const handleLetterSelection = () => {
      // Remove active class from all letters
      letterBoxes.forEach(b => b.classList.remove('active'));
      
      // Add active class to current letter
      box.classList.add('active');
      
      // Get letter data
      const letter = box.getAttribute('data-letter');
      if (acrosticData[letter]) {
        detailTitle.textContent = `${letter} - ${acrosticData[letter].title}`;
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


  // --- 6. INTERACTIVE TIMELINE ROADMAP: ELVIRIA ---
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

});
