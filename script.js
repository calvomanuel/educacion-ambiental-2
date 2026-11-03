
document.addEventListener('DOMContentLoaded', () => {

  const navItems = document.querySelectorAll('.nav-links .nav-item');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  const closeMobileMenu = () => {
    if (navLinks && navLinks.classList.contains('show')) {
      navLinks.classList.remove('show');
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
      }
      if (navOverlay) {
        navOverlay.classList.remove('active');
        navOverlay.setAttribute('aria-hidden', 'true');
      }
      document.body.style.overflow = '';
    }
  };

  const openMobileMenu = () => {
    if (navLinks) {
      navLinks.classList.add('show');
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.textContent = '✕';
      }
      if (navOverlay) {
        navOverlay.classList.add('active');
        navOverlay.setAttribute('aria-hidden', 'false');
      }
      document.body.style.overflow = 'hidden'; // Evitar scroll del fondo al ver menú
    }
  };

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      if (navLinks.classList.contains('show')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileMenu);
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      closeMobileMenu();

      if (!item.classList.contains('contact-trigger-item')) {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      }
    });
  });

  const learnMoreBtn = document.getElementById('learnMoreBtn');
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('cuidado-planeta');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  const contactModal = document.getElementById('contactModal');
  const openContactBtns = document.querySelectorAll('.open-contact-btn');
  const closeContactBtn = document.getElementById('closeContactBtn');

  const openContactModal = () => {
    contactModal.classList.add('active');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Evitar scroll del fondo
  };

  const closeContactModal = () => {
    contactModal.classList.remove('active');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openContactBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal();
    });
  });

  if (closeContactBtn) {
    closeContactBtn.addEventListener('click', closeContactModal);
  }

  // Cerrar al dar clic fuera de la cajita modal
  window.addEventListener('click', (e) => {
    if (e.target === contactModal) {
      closeContactModal();
    }
    if (e.target === binDetailModal) {
      closeBinDetailModal();
    }
  });

  // Cerrar con tecla Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (contactModal.classList.contains('active')) closeContactModal();
      if (binDetailModal.classList.contains('active')) closeBinDetailModal();
    }
  });

  // Envío del formulario rápido de contacto (con soporte para backend Python)
  const quickContactForm = document.getElementById('quickContactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (quickContactForm) {
    quickContactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre = document.getElementById('nombreContacto').value;
      const mensaje = document.getElementById('mensajeContacto').value;

      formFeedback.textContent = 'Enviando mensaje... 🍃';
      formFeedback.style.color = '#2e7d32';

      try {
        // Intenta conectar al servidor Python local si está en ejecución
        const response = await fetch('/api/contacto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, mensaje, fecha: new Date().toISOString() })
        });

        if (response.ok) {
          formFeedback.textContent = '¡Mensaje guardado con éxito! Gracias por cuidar la Tierra 🌍✨';
          quickContactForm.reset();
        } else {
          throw new Error('Servidor offline');
        }
      } catch (err) {
        // Si no está corriendo el servidor python, respuesta simulada amigable
        setTimeout(() => {
          formFeedback.textContent = '¡Gracias ' + nombre + '! Tu mensaje ha sido recibido con amor para el planeta 🌱';
          quickContactForm.reset();
          playSuccessSound();
        }, 500);
      }
    });
  }

  
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  const activateTab = (tabId) => {
    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    tabPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === tabId);
    });
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activateTab(btn.dataset.tab);
    });
  });

  const categoryTabBtns = document.querySelectorAll('.category-tab-btn');
  const tipCards = document.querySelectorAll('.tip-card');

  categoryTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.categoryFilter;
      tipCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  const binDetailModal = document.getElementById('binDetailModal');
  const closeBinDetailBtn = document.getElementById('closeBinDetailBtn');
  const binModalTitle = document.getElementById('binModalTitle');
  const binModalDesc = document.getElementById('binModalDesc');
  const binModalWhat = document.getElementById('binModalWhat');
  const binModalTime = document.getElementById('binModalTime');
  const binModalIcon = document.getElementById('binModalIcon');

  const binInfoData = {
    organico: {
      title: 'Contenedor Verde: Residuos Orgánicos',
      icon: '🍎',
      color: '#2e7d32',
      desc: 'Son todos aquellos restos biodegradables de origen vegetal o animal que pueden descomponerse naturalmente y convertirse en composta para nutrir la tierra.',
      what: 'Cáscaras de frutas, sobras de verduras, cáscaras de huevo, restos de café, hojas secas y servilletas de papel usadas.',
      time: 'Tardan de 2 semanas a 4 meses en degradarse.'
    },
    plastico: {
      title: 'Contenedor Azul: Plásticos y Envases',
      icon: '🧴',
      color: '#1976d2',
      desc: 'Materiales sintéticos que deben limpiarse y aplastarse para facilitar su reciclaje y evitar que terminen en los océanos y ríos.',
      what: 'Botellas de agua y refresco (PET), envases de champú, bolsas limpias, tapas de botellas y envases de yogur.',
      time: 'Tardan entre 100 y 500 años en degradarse si no se reciclan.'
    },
    papel: {
      title: 'Contenedor Amarillo: Papel y Cartón',
      icon: '📦',
      color: '#f57f17',
      desc: 'El reciclaje de papel y cartón ayuda a evitar la tala de miles de árboles y ahorra hasta un 70% de agua y energía.',
      what: 'Cajas de cartón desarmadas, periódicos, revistas, hojas de cuaderno, folletos y sobres.',
      time: 'Tarda de 2 a 5 meses en degradarse.'
    },
    vidrio: {
      title: 'Contenedor Verde Oscuro: Vidrio',
      icon: '🍾',
      color: '#00796b',
      desc: '¡El vidrio es 100% reciclable infinitas veces sin perder calidad! Deposítalo sin tapas ni corchos.',
      what: 'Botellas de bebidas, frascos de mermelada, tarros de conservas y frascos de perfume vacíos.',
      time: '¡Puede tardar hasta 4,000 años en degradarse en la naturaleza!'
    },
    metal: {
      title: 'Contenedor Gris: Metales y Aluminio',
      icon: '🥫',
      color: '#546e7a',
      desc: 'Metales como el aluminio y la hojalata son altamente valiosos. Su reciclaje reduce la necesidad de minería destructiva.',
      what: 'Latas de refresco (aluminio), latas de conserva/atún, tapas metálicas, papel aluminio limpio y alambres.',
      time: 'Una lata de aluminio tarda de 10 a 100 años en descomponerse.'
    }
  };

  const openBinDetailModal = (category) => {
    const data = binInfoData[category];
    if (!data) return;

    binModalTitle.textContent = data.title;
    binModalIcon.textContent = data.icon;
    binModalDesc.textContent = data.desc;
    binModalWhat.textContent = data.what;
    binModalTime.textContent = data.time;

    binDetailModal.classList.add('active');
    binDetailModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    playPopSound();
  };

  const closeBinDetailModal = () => {
    binDetailModal.classList.remove('active');
    binDetailModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeBinDetailBtn) {
    closeBinDetailBtn.addEventListener('click', closeBinDetailModal);
  }

  const clickableBins = document.querySelectorAll('.bin-clickable');
  clickableBins.forEach(bin => {
    bin.addEventListener('click', () => {
      const type = bin.dataset.binType;
      openBinDetailModal(type);
    });
  });

  const trashItems = [
    { name: 'Cáscara de Manzana', icon: '🍎', category: 'organico' },
    { name: 'Botella de Plástico (PET)', icon: '🧴', category: 'plastico' },
    { name: 'Caja de Cartón', icon: '📦', category: 'papel' },
    { name: 'Botella de Vidrio', icon: '🍾', category: 'vidrio' },
    { name: 'Lata de Refresco (Aluminio)', icon: '🥫', category: 'metal' },
    { name: 'Cáscara de Plátano', icon: '🍌', category: 'organico' },
    { name: 'Bolsa de Plástico', icon: '🛍️', category: 'plastico' },
    { name: 'Periódico Viejo', icon: '📰', category: 'papel' },
    { name: 'Frasco de Mermelada', icon: '🫙', category: 'vidrio' },
    { name: 'Lata de Atún', icon: '🥫', category: 'metal' },
    { name: 'Hojas secas del jardín', icon: '🍂', category: 'organico' },
    { name: 'Vaso de Plástico Desechable', icon: '🥤', category: 'plastico' }
  ];

  let currentItemIndex = 0;
  let score = 0;
  let streak = 0;

  const currentTrashIcon = document.getElementById('currentTrashIcon');
  const currentTrashName = document.getElementById('currentTrashName');
  const gameScoreEl = document.getElementById('gameScore');
  const gameStreakEl = document.getElementById('gameStreak');
  const gameFeedbackEl = document.getElementById('gameFeedback');
  const gameBinBtns = document.querySelectorAll('.game-bin-btn');

  const updateGameItem = () => {
    const item = trashItems[currentItemIndex];
    if (currentTrashIcon && currentTrashName) {
      currentTrashIcon.textContent = item.icon;
      currentTrashName.textContent = item.name;
    }
  };

  const handleGameChoice = (selectedCategory) => {
    const item = trashItems[currentItemIndex];
    if (selectedCategory === item.category) {
      score += 10;
      streak += 1;
      gameScoreEl.textContent = score;
      gameStreakEl.textContent = streak;
      gameFeedbackEl.className = 'game-feedback correct';
      gameFeedbackEl.textContent = `¡Excelente! ¡El/la ${item.name} va en el contenedor correcto! 🌱 (+10 pts)`;
      playSuccessSound();
    } else {
      streak = 0;
      gameStreakEl.textContent = streak;
      gameFeedbackEl.className = 'game-feedback wrong';
      const categoryNames = {
        organico: 'Orgánicos (Verde)',
        plastico: 'Plástico (Azul)',
        papel: 'Papel (Amarillo)',
        vidrio: 'Vidrio (Verde Oscuro)',
        metal: 'Metal (Gris)'
      };
      gameFeedbackEl.textContent = `¡Casi! ${item.name} corresponde a ${categoryNames[item.category]}. ¡Sigue intentando! 💪`;
      playBuzzSound();
    }

    // Siguiente residuo aleatorio
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * trashItems.length);
    } while (nextIndex === currentItemIndex && trashItems.length > 1);
    
    currentItemIndex = nextIndex;
    setTimeout(updateGameItem, 400);
  };

  gameBinBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      handleGameChoice(btn.dataset.targetCategory);
    });
  });

  // Inicializar primer residuo
  updateGameItem();

  // ----------------------------------------------------
  // 8. EFECTOS DE SONIDO MEDIANTE WEB AUDIO API
  // ----------------------------------------------------
  let audioCtx = null;
  const getAudioContext = () => {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    return audioCtx;
  };

  const playPopSound = () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) { /* Audio silenciado */ }
  };

  const playSuccessSound = () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.4);
    } catch (e) { /* Audio silenciado */ }
  };

  const playBuzzSound = () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.25);
    } catch (e) { /* Audio silenciado */ }
  };
});
