  // Hamburger menu 
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mainNav = document.getElementById('mainNav');

  function closeNav(){
    mainNav.classList.remove('open');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
  function toggleNav(){
    const isOpen = mainNav.classList.toggle('open');
    hamburgerBtn.classList.toggle('active', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  }
  hamburgerBtn.addEventListener('click', toggleNav);
  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
  document.addEventListener('click', (e) => {
    if (mainNav.classList.contains('open') && !mainNav.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      closeNav();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  // Sticky header shrink on scroll
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  });

  // Scroll-reveal animations
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // Generic horizontal carousel setup: wheel-scroll, drag-to-scroll, arrow buttons
  function setupCarousel(trackId, prevId, nextId, step) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    if (!track) return;

    if (nextBtn) nextBtn.addEventListener('click', () => track.scrollBy({ left: step, behavior: 'smooth' }));
    if (prevBtn) prevBtn.addEventListener('click', () => track.scrollBy({ left: -step, behavior: 'smooth' }));

    // Allow vertical wheel to scroll the horizontal carousel when hovered
    track.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        track.scrollLeft += e.deltaY;
      }
    }, { passive: false });

    // Drag to scroll (mouse)
    let isDown = false, startX, scrollLeftStart;
    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.classList.add('dragging');
      startX = e.pageX - track.offsetLeft;
      scrollLeftStart = track.scrollLeft;
    });
    ['mouseleave', 'mouseup'].forEach(evt => track.addEventListener(evt, () => {
      isDown = false;
      track.classList.remove('dragging');
    }));
    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.2;
      track.scrollLeft = scrollLeftStart - walk;
    });

    // Touch support (native momentum handles most of it; this just improves drag precision)
    let touchStartX = 0, touchScrollStart = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].pageX;
      touchScrollStart = track.scrollLeft;
    }, { passive: true });
    track.addEventListener('touchmove', (e) => {
      const walk = (touchStartX - e.touches[0].pageX);
      track.scrollLeft = touchScrollStart + walk;
    }, { passive: true });
  }

  setupCarousel('collectionsTrack', 'collectionsPrev', 'collectionsNext', 366);
  setupCarousel('materialsTrack', 'materialsPrev', 'materialsNext', 366);
  setupCarousel('bestsellersTrack', 'bestsellersPrev', 'bestsellersNext', 306);

  // Newsletter 
  const form = document.getElementById('newsletterForm');
  const msg = document.getElementById('newsletterMsg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    msg.classList.add('show');
    form.reset();
    setTimeout(() => msg.classList.remove('show'), 4000);
  });

  // Toast confirmation when opening social linkS
  const toast = document.getElementById('toast');
  document.querySelectorAll('[data-social]').forEach(link => {
    link.addEventListener('click', () => {
      toast.textContent = 'Ouverture de ' + link.dataset.social + '…';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2200);
    });
  });

  // Smooth-scroll for in-page nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
