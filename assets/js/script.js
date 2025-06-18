const dropdown = document.getElementById('languageDropdown');
const label = document.getElementById('selectedLanguage');
const options = dropdown.querySelectorAll('.dropdown-content div');
const linkResume = document.getElementById('linkResume');
window.currentTranslations = {};
window.getTranslation = function (key) {
  const keys = key.split('.');
  let result = window.currentTranslations;
  for (const k of keys) {
    if (result && result.hasOwnProperty(k)) {
      result = result[k];
    } else {
      return null;
    }
  }
  return result;
};
// Toggle dropdown open/close
label.addEventListener('click', () => {
  dropdown.classList.toggle('open');
});

// When an option is clicked, update label, save lang, load translations, close dropdown
options.forEach(option => {
  option.addEventListener('click', () => {
    const lang = option.getAttribute('data-lang').toLowerCase();
    label.textContent = option.getAttribute('data-lang');
    dropdown.classList.remove('open');
    setLanguage(lang);
  });
});

// Close dropdown if clicking outside
document.addEventListener('click', (event) => {
  if (!dropdown.contains(event.target)) {
    dropdown.classList.remove('open');
  }
});

async function loadLanguage(lang, callback) {
  try {
    const res = await fetch(`assets/json/translations/${lang}.json`);
    if (!res.ok) throw new Error("Language file not found");
    const translations = await res.json();
    window.currentTranslations = translations;

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const dataI18nValue = el.getAttribute("data-i18n");
      if (dataI18nValue.startsWith('[placeholder]')) {
        const translationKey = dataI18nValue.replace('[placeholder]', '');
        const keys = translationKey.split('.');
        let text = translations;
        keys.forEach(k => { if (text) text = text[k]; });
        if (text) el.setAttribute('placeholder', text);
      } else {
        const keys = dataI18nValue.split('.');
        let text = translations;
        keys.forEach(k => { if (text) text = text[k]; });
        if (text) el.textContent = text;
      }
    });
    linkResume.href = `assets/pdf/cv_${lang}.pdf`;
    // ✅ Ejecutar callback cuando termina
    if (typeof callback === 'function') callback();

  } catch (error) {
    console.error("Error loading language:", error);
  }
}

function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  loadLanguage(lang, rotatePhrases);
}

// Initialize language on page load
let savedLang = localStorage.getItem("lang");
if (!savedLang) {
  const browserLang = navigator.language.slice(0, 2);
  const fallbackLang = ["en", "es", "pt"].includes(browserLang) ? browserLang : "es";
  localStorage.setItem("lang", fallbackLang);
  savedLang = fallbackLang;
}

label.textContent = savedLang.toUpperCase();
loadLanguage(savedLang, rotatePhrases);
linkResume.href = `assets/pdf/cv_${savedLang}.pdf`;

// menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuImg = document.getElementById('menuImg');
const bodyMenu = document.getElementById('overlayContent');

menuBtn.addEventListener('click', () => {
  bodyMenu.style.opacity = bodyMenu.style.opacity === '1' ? '0.5' : '1';
  menuImg.classList.toggle('grayscale');
  menuImg.classList.toggle('color');
  dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  mobileMenu.classList.toggle('active');
});


// words animation
let phrasesInterval;
function rotatePhrases() {
  clearInterval(phrasesInterval); // limpiar el anterior si existe

  const phrases = [
    getTranslation('Phrases.1'),
    getTranslation('Phrases.2'),
    getTranslation('Phrases.3'),
    getTranslation('Phrases.4'),
  ];

  const textElement = document.getElementById('rotatingText');
  let index = 0;

  function rotateText() {
    textElement.classList.add('fade-out');
    setTimeout(() => {
      textElement.textContent = phrases[index];
      textElement.classList.remove('fade-out');
      index = (index + 1) % phrases.length;
    }, 500);
  }

  rotateText();
  phrasesInterval = setInterval(rotateText, 2000);
}


// animations scrolls
document.addEventListener('DOMContentLoaded', () => {
  // Animación general para elementos con .animate-on-scroll
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const generalObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('visible');
        el.classList.remove('hidden');
        generalObserver.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => generalObserver.observe(el));

  // Animación especial para las tarjetas de educación
  const educationSection = document.getElementById('education');
  const educationCards = educationSection?.querySelectorAll('.education-card');

  if (educationSection && educationCards?.length) {
    const educationObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          educationCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('visible');
            }, index * 300);
          });
          educationObserver.unobserve(educationSection);
        }
      });
    }, { threshold: 0.1 });

    educationObserver.observe(educationSection);
  }

  // Animación especial para las tarjetas de trabajo
  const workSection = document.getElementById('work-cards');
  const workCards = workSection?.querySelectorAll('.work-card');

  if (workSection && workCards?.length) {
    const workObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          workCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('visible');
            }, index * 300);
          });
          workObserver.unobserve(workSection);
        }
      });
    }, { threshold: 0.1 });

    workObserver.observe(workSection);
  }
});