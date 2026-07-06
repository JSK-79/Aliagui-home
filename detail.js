
/* ==========================================================================
   CONFIG
   ========================================================================== */
const WHATSAPP_NUMBER = "2250142789097";
const productData = {
  title: "Parure de lit Wax Royal",
  images: [
    {c1:"#c1633d", c2:"#8b7263", label:"Vue 1"},
    {c1:"#2c3a52", c2:"#c1633d", label:"Vue 2"},
    {c1:"#8b7263", c2:"#2c3a52", label:"Vue 3"},
    {c1:"#f3e9dd", c2:"#c1633d", label:"Vue 4"},
  ]
};

// Génère une image placeholder en SVG (à remplacer par de vraies photos produit)
function placeholderImg(c1, c2, label){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${c1}'/><stop offset='100%' stop-color='${c2}'/>
    </linearGradient></defs>
    <rect width='800' height='800' fill='url(#g)'/>
    <text x='50%' y='52%' font-family='sans-serif' font-size='42' fill='#ffffffcc' text-anchor='middle'>${label}</text>
  </svg>`;
  return "data:image/svg+xml;base64," + btoa(svg);
}

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
    thumb.innerHTML = `<img src="${placeholderImg(img.c1, img.c2, img.label)}" alt="Miniature ${i+1}">`;
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
  mainImage.src = placeholderImg(img.c1, img.c2, img.label);
  mainImage.alt = productData.title + " - " + img.label;
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
  {name:"Parure Wax Bleu", c1:"#2c3a52", c2:"#c1633d"},
  {name:"Service de table Ivoire", c1:"#f3e9dd", c2:"#8b7263"},
  {name:"Coussin brodé Terracotta", c1:"#c1633d", c2:"#f3e9dd"},
  {name:"Nappe imprimée Adire", c1:"#8b7263", c2:"#2c3a52"},
  {name:"Plaid tissé Savane", c1:"#c1633d", c2:"#2c3a52"},
  {name:"Set de coussins Wax", c1:"#2c3a52", c2:"#8b7263"},
];
const track = document.getElementById('suggestionsTrack');
suggestions.forEach(s => {
  const card = document.createElement('div');
  card.className = 'suggestion-card';
  card.innerHTML = `
    <div class="card-img-placeholder"><img src="${placeholderImg(s.c1, s.c2, '')}" alt="${s.name}"></div>
    <div class="card-footer">
      <span>${s.name.toUpperCase()}</span>
      <a href="#">Voir les détails <i class="fa-solid fa-arrow-right"></i></a>
    </div>`;
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
