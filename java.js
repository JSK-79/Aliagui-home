// ============================================================
// java.js - Fichier JavaScript global pour Aliagui Home
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================================
    // 1. HAMBURGER MENU
    // ============================================================
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mainNav = document.getElementById('mainNav');

    function closeNav() {
        if (mainNav) {
            mainNav.classList.remove('open');
        }
        if (hamburgerBtn) {
            hamburgerBtn.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
    }

    function toggleNav() {
        if (!mainNav || !hamburgerBtn) return;
        const isOpen = mainNav.classList.toggle('open');
        hamburgerBtn.classList.toggle('active', isOpen);
        hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    }

    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener('click', toggleNav);

        mainNav.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', closeNav);
        });
    }

    // Fermer le menu au clic en dehors
    document.addEventListener('click', function(e) {
        if (mainNav && mainNav.classList.contains('open') &&
            !mainNav.contains(e.target) &&
            hamburgerBtn && !hamburgerBtn.contains(e.target)) {
            closeNav();
        }
    });

    // Fermer avec la touche Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeNav();
    });

    // ============================================================
    // 2. STICKY HEADER SHRINK ON SCROLL
    // ============================================================
    const header = document.getElementById('siteHeader');
    window.addEventListener('scroll', function() {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 30);
        }
    });

    // ============================================================
    // 3. SCROLL-REVEAL ANIMATIONS
    // ============================================================
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealEls.forEach(function(el) {
        io.observe(el);
    });

    // ============================================================
    // 4. GENERIC HORIZONTAL CAROUSEL SETUP
    // ============================================================
    function setupCarousel(trackId, prevId, nextId, step) {
        const track = document.getElementById(trackId);
        const prevBtn = document.getElementById(prevId);
        const nextBtn = document.getElementById(nextId);
        if (!track) return;

        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                track.scrollBy({ left: step, behavior: 'smooth' });
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                track.scrollBy({ left: -step, behavior: 'smooth' });
            });
        }

        // Allow vertical wheel to scroll the horizontal carousel when hovered
        track.addEventListener('wheel', function(e) {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                track.scrollLeft += e.deltaY;
            }
        }, { passive: false });

        // Drag to scroll (mouse)
        let isDown = false, startX, scrollLeftStart;
        track.addEventListener('mousedown', function(e) {
            isDown = true;
            track.classList.add('dragging');
            startX = e.pageX - track.offsetLeft;
            scrollLeftStart = track.scrollLeft;
        });
        ['mouseleave', 'mouseup'].forEach(function(evt) {
            track.addEventListener(evt, function() {
                isDown = false;
                track.classList.remove('dragging');
            });
        });
        track.addEventListener('mousemove', function(e) {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 1.2;
            track.scrollLeft = scrollLeftStart - walk;
        });

        // Touch support
        let touchStartX = 0, touchScrollStart = 0;
        track.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].pageX;
            touchScrollStart = track.scrollLeft;
        }, { passive: true });
        track.addEventListener('touchmove', function(e) {
            const walk = (touchStartX - e.touches[0].pageX);
            track.scrollLeft = touchScrollStart + walk;
        }, { passive: true });
    }

    setupCarousel('collectionsTrack', 'collectionsPrev', 'collectionsNext', 366);
    setupCarousel('materialsTrack', 'materialsPrev', 'materialsNext', 366);
    setupCarousel('bestsellersTrack', 'bestsellersPrev', 'bestsellersNext', 306);

    // ============================================================
    // 5. NEWSLETTER
    // ============================================================
    const form = document.getElementById('newsletterForm');
    const msg = document.getElementById('newsletterMsg');

    if (form && msg) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            msg.classList.add('show');
            form.reset();
            setTimeout(function() {
                msg.classList.remove('show');
            }, 4000);
        });
    }

    // ============================================================
    // 6. TOAST CONFIRMATION
    // ============================================================
    const toast = document.getElementById('toast');

    // Pour les liens sociaux
    document.querySelectorAll('[data-social]').forEach(function(link) {
        link.addEventListener('click', function() {
            if (toast) {
                toast.textContent = 'Ouverture de ' + link.dataset.social + '…';
                toast.classList.add('show');
                clearTimeout(toast._timeout);
                toast._timeout = setTimeout(function() {
                    toast.classList.remove('show');
                }, 2200);
            }
        });
    });

    // ============================================================
    // 7. BOUTONS "VOIR LES DÉTAILS" (pour collections.html)
    // ============================================================
    const detailBtns = document.querySelectorAll('.btn-detail');
    detailBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (toast) {
                toast.textContent = 'Page détail en cours de construction…';
                toast.classList.add('show');
                clearTimeout(toast._timeout);
                toast._timeout = setTimeout(function() {
                    toast.classList.remove('show');
                }, 2500);
            }
        });
    });

    // ============================================================
    // 8. SMOOTH-SCROLL FOR IN-PAGE NAV LINKS
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.length > 1) {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

});