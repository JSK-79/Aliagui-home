
  // ---- reveal on scroll ----
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  },{ threshold:0.15 });
  document.querySelectorAll('.reveal, .reveal-scale, .stagger').forEach(el=>io.observe(el));

  // ---- carousel ----
  const track = document.getElementById('carTrack');
  const prevBtn = document.getElementById('carPrev');
  const nextBtn = document.getElementById('carNext');
  const dotsWrap = document.getElementById('carDots');
  const cards = Array.from(track.children);

  function visibleCount(){
    if (window.innerWidth <= 560) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function pageCount(){
    return Math.max(1, Math.ceil(cards.length / visibleCount()));
  }

  function buildDots(){
    dotsWrap.innerHTML = '';
    const pages = pageCount();
    for(let i=0;i<pages;i++){
      const dot = document.createElement('button');
      dot.className = 'car-dot' + (i===0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Aller à la page ' + (i+1));
      dot.addEventListener('click', ()=> goToPage(i));
      dotsWrap.appendChild(dot);
    }
  }

  function goToPage(i){
    const pageWidth = track.clientWidth;
    track.scrollTo({ left: pageWidth * i, behavior:'smooth' });
  }

  function updateActiveDot(){
    const pageWidth = track.clientWidth || 1;
    const idx = Math.round(track.scrollLeft / pageWidth);
    document.querySelectorAll('.car-dot').forEach((d,i)=> d.classList.toggle('active', i===idx));
  }

  prevBtn.addEventListener('click', ()=>{
    track.scrollBy({ left: -track.clientWidth, behavior:'smooth' });
  });
  nextBtn.addEventListener('click', ()=>{
    track.scrollBy({ left: track.clientWidth, behavior:'smooth' });
  });

  let scrollTimeout;
  track.addEventListener('scroll', ()=>{
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveDot, 80);
  });

  window.addEventListener('resize', ()=>{
    buildDots();
    updateActiveDot();
  });

  buildDots();
