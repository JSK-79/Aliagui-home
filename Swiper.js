
        // Initialiser le carrousel
    var swiper = new Swiper(".mySwiper", {
        slidesPerView: 3, // Nombre de cartes visibles
    spaceBetween: 30, // Espace entre les cartes
    pagination: {
        el: ".swiper-pagination",
    clickable: true,
            },
    navigation: {
        nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
            },
    breakpoints: {
        // Pour les mobiles
        320: {
        slidesPerView: 1,
    spaceBetween: 10
                },
    // Pour les tablettes
    768: {
        slidesPerView: 2,
    spaceBetween: 20
                },
    // Pour les écrans de bureau
    1024: {
        slidesPerView: 3,
    spaceBetween: 30
                }
            }
        });
