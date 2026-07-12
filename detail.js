
/* ==========================================================================
   CONFIG
   ========================================================================== */
const WHATSAPP_NUMBER = "2250142789097";
const productData = {
  title: "Parure de lit Wax Royal",
  images: [
    "image/detail1.jpeg",
    "image/detail2.jpeg",
    "image/detail3.jpeg",
    "image/detail4.jpeg"
  ]
};


/* ==========================================================================
   GALERIE PRODUIT (photos, miniatures, flèches, swipe)
   ========================================================================== */
let currentImg = 0;
const mainImage = document.getElementById('mainImage');
const thumbnailRow = document.getElementById('thumbnailRow');

function renderGallery(){
  document.getElementById('productTitle').textContent = productData.title;

  thumbnailRow.innerHTML = "";
  productData.images.forEach((img, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'thumb' + (i === currentImg ? ' active' : '');
    thumb.innerHTML = `<img src="${img}" alt="Miniature ${i+1}">`;
    thumb.addEventListener('click', () => { currentImg = i; updateGallery(); });
    thumbnailRow.appendChild(thumb);
  });
  updateGallery();
}

function updateGallery(){
  const img = productData.images[currentImg];
  
  mainImage.style.animation = 'none';
  void mainImage.offsetWidth; // relance l'animation
  mainImage.style.animation = 'imgIn .4s ease forwards';
  mainImage.src = img;
  mainImage.alt = productData.title;
  [...thumbnailRow.children].forEach((t, i) => t.classList.toggle('active', i === currentImg));
}

document.getElementById('prevBtn').addEventListener('click', () => {
  currentImg = (currentImg - 1 + productData.images.length) % productData.images.length;
  updateGallery();
});
document.getElementById('nextBtn').addEventListener('click', () => {
  currentImg = (currentImg + 1) % productData.images.length;
  updateGallery();
});

// Défilement au doigt (mobile) / à la souris
let touchStartX = 0;
const galleryMain = document.querySelector('.gallery-main');
galleryMain.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX, {passive:true});
galleryMain.addEventListener('touchend', e => {
  const diff = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(diff) > 40){
    diff > 0 ? document.getElementById('prevBtn').click() : document.getElementById('nextBtn').click();
  }
}, {passive:true});

// Navigation au clavier quand la galerie a le focus
galleryMain.setAttribute('tabindex','0');
galleryMain.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') document.getElementById('prevBtn').click();
  if (e.key === 'ArrowRight') document.getElementById('nextBtn').click();
});

renderGallery();

/* ==========================================================================
   BOUTONS WHATSAPP FONCTIONNELS
   ========================================================================== */
function waLink(message){
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
document.getElementById('whatsappOrderBtn').href = waLink(`Bonjour, je souhaite commander : ${productData.title}`);
document.getElementById('whatsappAdviceBtn').href = waLink(`Bonjour, j'aimerais un conseil au sujet de : ${productData.title}`);

/* ==========================================================================
   SUGGESTIONS "VOUS AIMEREZ AUSSI" — carrousel avec pagination
   ========================================================================== */
const suggestions = [
  {
    name: "Couverture terre d'afrique",
    description: "Une couverture élégante aux finitions soignées, idéale pour une chambre raffinée.",
    image: "image/aimerez5.jpeg"
  },
  {
    name: "Couverture Élégance",
    description: "Apportez douceur et confort à votre intérieur avec ce modèle intemporel.",
    image: "image/aimerez8.jpeg"
  },
  {
    name: "Couverture Prestige",
    description: "Un design moderne qui sublime votre espace de repos avec élégance.",
    image: "image/aimerez4.jpeg"
  },
  {
    name: "Chemin de table black and white",
    description: "Des matières de qualité pour un table bien dressée",
    image: "image/aimerez13.jpeg"
  },
  {
    name: "Couverture Luxe",
    description: "Une finition haut de gamme pour une décoration chaleureuse et chic.",
    image: "image/aimerez2.jpeg"
  },
  {
    name: "Chemin de table Horizon",
    description: "Faites la table parfaite",
    image: "image/aimerez11.jpeg"
  }
];
const track = document.getElementById('suggestionsTrack');
suggestions.forEach(s => {
  const card = document.createElement('div');
  card.className = 'suggestion-card';
  card.innerHTML = `
    <img src="${s.image}" alt="${s.name}">

    <div class="card-footer">
        <h3>${s.name}</h3>

        <p class="suggestion-description">
            ${s.description}
        </p>

        <a href="#" class="details-btn">
            Voir les détails
            <i class="fa-solid fa-arrow-right"></i>
        </a>
    </div>
`;
  track.appendChild(card);
});

const dots = document.querySelectorAll('#carouselPagination .dot');
function scrollToPage(page){
  const cardWidth = track.querySelector('.suggestion-card').offsetWidth + 40;
  const cardsPerPage = Math.round(track.clientWidth / cardWidth) || 1;
  track.scrollTo({ left: page * cardsPerPage * cardWidth, behavior: 'smooth' });
  dots.forEach((d,i) => d.classList.toggle('active', i === page));
}
dots.forEach(d => d.addEventListener('click', () => scrollToPage(Number(d.dataset.page))));
document.getElementById('pagPrev').addEventListener('click', () => {
  const active = [...dots].findIndex(d => d.classList.contains('active'));
  scrollToPage(Math.max(0, active - 1));
});
document.getElementById('pagNext').addEventListener('click', () => {
  const active = [...dots].findIndex(d => d.classList.contains('active'));
  scrollToPage(Math.min(dots.length - 1, active + 1));
});

/* ==========================================================================
   ANIMATIONS AU DÉFILEMENT (reveal) + barres de notes animées
   ========================================================================== */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

const bars = document.querySelectorAll('.progress');
const barIo = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.style.width = entry.target.dataset.width + '%';
      barIo.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
bars.forEach(b => barIo.observe(b));

function showToast(text){
  const toast = document.getElementById('toast');
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

