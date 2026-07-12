
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

  