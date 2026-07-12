
    document.addEventListener('DOMContentLoaded', () => {
      /* ---- Animation au scroll ---- */
      const revealTargets = document.querySelectorAll(
        '.contact-header, .contact-info h2, .contact-form-container h2, .info-card, .contact-form, .showroom-section'
      );
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealTargets.forEach((el) => revealObserver.observe(el));

      /* ---- Toast ---- */
      const contactToast = document.getElementById('contactToast');
      let toastTimeout;
      function showToast(message) {
        if (!contactToast) return;
        contactToast.textContent = message;
        contactToast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => contactToast.classList.remove('show'), 3500);
      }

      /* ---- Formulaire de contact -> WhatsApp ---- */
      const form = document.getElementById('contactForm');
      const formNote = document.getElementById('formNote');
      const WHATSAPP_NUMBER = '2250142789097';

      if (form) {
        const fields = {
          nom: form.querySelector('#nom'),
          email: form.querySelector('#email'),
          sujet: form.querySelector('#sujet'),
          message: form.querySelector('#message'),
        };

        Object.values(fields).forEach((field) => {
          field.addEventListener('input', () => field.classList.remove('input-error'));
        });

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          let valid = true;

          Object.values(fields).forEach((field) => {
            if (!field.value.trim()) {
              field.classList.add('input-error');
              valid = false;
            }
          });

          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (fields.email.value && !emailPattern.test(fields.email.value.trim())) {
            fields.email.classList.add('input-error');
            valid = false;
          }

          if (!valid) {
            if (formNote) {
              formNote.textContent = 'Merci de remplir correctement tous les champs.';
              formNote.classList.remove('success');
            }
            return;
          }

          const { nom, email, sujet, message } = fields;
          const texte =
            `Bonjour Aliagui Home, je m'appelle ${nom.value.trim()}.\n` +
            `Email : ${email.value.trim()}\n` +
            `Sujet : ${sujet.value.trim()}\n` +
            `Message : ${message.value.trim()}`;

          const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texte)}`;
          window.open(url, '_blank', 'noopener');

          if (formNote) {
            formNote.textContent = 'Redirection vers WhatsApp…';
            formNote.classList.add('success');
          }
          showToast('Votre message est prêt à être envoyé sur WhatsApp !');
          form.reset();
        });
      }

      /* ---- Newsletter ---- */
      const newsletterForm = document.getElementById('newsletterForm');
      const newsletterMsg = document.getElementById('newsletterMsg');
      if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
          e.preventDefault();
          newsletterMsg.classList.add('show');
          newsletterForm.reset();
        });
      }
    });
