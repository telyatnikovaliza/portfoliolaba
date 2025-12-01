// ========== Основные функции ==========

// 1. Анимация появления элементов при скролле
function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);
  
    // Наблюдаем за всеми секциями и карточками
    document.querySelectorAll('section, .about-card, .project, .contact-card').forEach(el => {
      observer.observe(el);
    });
  }
  
  // 2. Карусель проектов
  function initProjectsCarousel() {
    const projectsGrid = document.querySelector('.projects-grid');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const projects = document.querySelectorAll('.project');
    
    if (!projectsGrid || !prevBtn) return;
    
    let currentIndex = 0;
    const projectsPerView = getProjectsPerView();
    
    function updateCarousel() {
      const offset = -currentIndex * (100 / projectsPerView);
      projectsGrid.style.transform = `translateX(${offset}%)`;
      
      // Обновляем активные точки
      updateDots();
    }
    
    function getProjectsPerView() {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }
    
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });
    
    nextBtn.addEventListener('click', () => {
      if (currentIndex < projects.length - projectsPerView) {
        currentIndex++;
        updateCarousel();
      }
    });
    
    // Адаптация при изменении размера окна
    window.addEventListener('resize', () => {
      currentIndex = 0;
      updateCarousel();
    });
    
    // Создаем точки навигации
    function createDots() {
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'carousel-dots';
      
      for (let i = 0; i < Math.max(1, projects.length - projectsPerView + 1); i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        if (i === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
        });
        
        dotsContainer.appendChild(dot);
      }
      
      document.querySelector('.projects').appendChild(dotsContainer);
    }
    
    function updateDots() {
      const dots = document.querySelectorAll('.carousel-dot');
      dots.forEach((dot, index) => {
        if (index === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
    
    createDots();
    updateCarousel();
  }
  
  // 3. Смена текста в логотипе
  function initLogoAnimation() {
    const logoText = document.getElementById('logo-text');
    if (!logoText) return;
    
    const texts = ['telyatnikova', 'elizaveta'];
    let index = 0;
    
    setInterval(() => {
      logoText.style.opacity = 0;
      
      setTimeout(() => {
        index = (index + 1) % texts.length;
        logoText.textContent = texts[index];
        logoText.style.opacity = 1;
      }, 300);
    }, 3000);
  }
  
  // 4. Переключение темы (темная/светлая)
  function initThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌙';
    themeToggle.title = 'Сменить тему';
    
    // Добавляем кнопку в хедер
    document.querySelector('.header').appendChild(themeToggle);
    
    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      themeToggle.innerHTML = '☀️';
    }
    
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      
      if (document.body.classList.contains('dark-theme')) {
        themeToggle.innerHTML = '☀️';
        localStorage.setItem('theme', 'dark');
      } else {
        themeToggle.innerHTML = '🌙';
        localStorage.setItem('theme', 'light');
      }
    });
  }
  
  // 5. Обработка формы заказа
  function initOrderForm() {
    const orderBtn = document.querySelector('.btn');
    const modal = document.getElementById('orderModal');
    const closeBtn = document.querySelector('.close');
    const orderForm = document.getElementById('orderForm');
    const formMessage = document.getElementById('formMessage');
    
    if (!orderBtn) return;
    
    // Открытие модального окна
    orderBtn.addEventListener('click', function(e) {
      e.preventDefault();
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
    
    // Закрытие модального окна
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
    
    // Закрытие при клике вне модального окна
    window.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
    
    // Обработка отправки формы
    orderForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById('clientName').value,
        email: document.getElementById('clientEmail').value,
        phone: document.getElementById('clientPhone').value,
        projectType: document.getElementById('projectType').value,
        budget: document.getElementById('budget').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toLocaleString('ru-RU')
      };
      
      // Показываем загрузку
      const submitBtn = orderForm.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Отправка...';
      submitBtn.disabled = true;
      
      // Имитация отправки на сервер
      setTimeout(() => {
        console.log('Данные формы:', formData);
        
        // Показываем успешное сообщение
        formMessage.textContent = `Спасибо, ${formData.name}! Ваша заявка отправлена. Я свяжусь с вами в течение 24 часов.`;
        formMessage.className = 'form-message success';
        formMessage.style.display = 'block';
        
        // Сбрасываем форму
        orderForm.reset();
        
        // Восстанавливаем кнопку
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Автоматически закрываем модальное окно через 3 секунды
        setTimeout(() => {
          modal.style.display = 'none';
          document.body.style.overflow = 'auto';
          formMessage.style.display = 'none';
        }, 3000);
      }, 1500);
    });
  }
  
  // 6. Плавная прокрутка к якорям
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  // 7. Анимация при загрузке страницы
  function initPageLoadAnimation() {
    document.body.classList.add('page-loaded');
  }
  
  // 8. Прогресс-бар скролла
  function initProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + "%";
    });
  }
  
  // 9. Обновление информации в футере
  function updateFooterInfo() {
    const footer = document.querySelector('.footer-content');
    if (!footer) return;
    
    const jsInfo = document.createElement('p');
    jsInfo.innerHTML = '<strong>JavaScript функционал:</strong> анимация при прокрутке, карусель проектов, переключение темы, интерактивная форма, прогресс-бар';
    
    footer.insertBefore(jsInfo, footer.querySelector('.footer-links'));
  }
  
  // ========== Инициализация всех функций ==========
  document.addEventListener('DOMContentLoaded', function() {
    initLogoAnimation();
    initOrderForm();
    initScrollAnimations();
    initProjectsCarousel();
    initThemeToggle();
    initSmoothScroll();
    initPageLoadAnimation();
    initProgressBar();
    
    // Обновляем футер с информацией о JS-функционале
    updateFooterInfo();
  });