// Luxe Nails - JavaScript для интерактивности и анимаций

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех функций
    initNavigation();
    initScrollAnimations();
    initBookingSystem();
    initGalleryFilters();
    initSmoothScrolling();
    initContactForm();
    initMobileMenu();
    initHeroAnimations();
    initParallaxEffects();
});

// Навигация и скролл эффекты
function initNavigation() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Изменение хедера при скролле
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
    
    // Активная ссылка навигации
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Анимации при скролле
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Анимация для карточек услуг с задержкой
                if (entry.target.classList.contains('service-card')) {
                    const cards = document.querySelectorAll('.service-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.transform = 'translateY(0)';
                            card.style.opacity = '1';
                        }, index * 100);
                    });
                }
                
                // Анимация для элементов галереи
                if (entry.target.classList.contains('gallery-item')) {
                    const items = document.querySelectorAll('.gallery-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.transform = 'translateY(0) scale(1)';
                            item.style.opacity = '1';
                        }, index * 150);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Наблюдение за элементами
    const animatedElements = document.querySelectorAll('.service-card, .gallery-item, .feature, .contact-item');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    // Анимация счетчиков
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => statsObserver.observe(stat));
}

// Анимация счетчиков
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
    const suffix = element.textContent.replace(/[0-9]/g, '');
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 40);
}

// Система бронирования
function initBookingSystem() {
    const bookingButtons = document.querySelectorAll('.booking-btn');
    const modal = document.getElementById('bookingModal');
    const successModal = document.getElementById('successModal');
    const closeButtons = document.querySelectorAll('.close');
    const bookingForm = document.getElementById('bookingForm');
    
    // Открытие модального окна
    bookingButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openBookingModal();
        });
    });
    
    // Закрытие модальных окон
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeAllModals();
        });
    });
    
    // Закрытие при клике вне модального окна
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Обработка формы бронирования
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleBookingSubmit(e);
    });
    
    // Установка минимальной даты (сегодня)
    const dateInput = document.getElementById('bookingDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    // Анимация при открытии модального окна
    function openBookingModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Анимация появления
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'translateY(0) scale(1)';
        }, 10);
    }
    
    function closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.opacity = '0';
            modal.querySelector('.modal-content').style.transform = 'translateY(-50px) scale(0.9)';
            
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
        document.body.style.overflow = 'auto';
    }
    
    // Обработка отправки формы
    function handleBookingSubmit(e) {
        const formData = new FormData(e.target);
        const bookingData = Object.fromEntries(formData.entries());
        
        // Показываем загрузку
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.innerHTML = '<span class="loading"></span> Отправка...';
        submitButton.disabled = true;
        
        // Имитация отправки данных
        setTimeout(() => {
            console.log('Booking data:', bookingData);
            
            // Показываем успешное сообщение
            modal.style.display = 'none';
            showSuccessModal();
            
            // Сбрасываем форму
            bookingForm.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Отправляем данные на сервер (в реальном проекте)
            // sendBookingToServer(bookingData);
        }, 2000);
    }
    
    function showSuccessModal() {
        successModal.style.display = 'block';
        setTimeout(() => {
            successModal.style.opacity = '1';
            successModal.querySelector('.modal-content').style.transform = 'translateY(0) scale(1)';
        }, 10);
        
        // Автоматическое закрытие через 5 секунд
        setTimeout(() => {
            closeAllModals();
        }, 5000);
    }
}

// Глобальная функция для закрытия модального окна успеха
function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    successModal.style.opacity = '0';
    successModal.querySelector('.modal-content').style.transform = 'translateY(-50px) scale(0.9)';
    
    setTimeout(() => {
        successModal.style.display = 'none';
    }, 300);
    document.body.style.overflow = 'auto';
}

// Фильтры галереи
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Обновляем активную кнопку
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Фильтруем элементы галереи
            galleryItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    setTimeout(() => {
                        item.style.display = 'block';
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px) scale(0.8)';
                        
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0) scale(1)';
                        }, 50);
                    }, index * 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-20px) scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Плавный скролл
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Кнопка "Смотреть работы" в hero секции
    const portfolioBtn = document.getElementById('portfolioBtn');
    if (portfolioBtn) {
        portfolioBtn.addEventListener('click', () => {
            const gallerySection = document.getElementById('gallery');
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = gallerySection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    }
}

// Контактная форма
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleContactSubmit(e);
        });
    }
    
    function handleContactSubmit(e) {
        const formData = new FormData(e.target);
        const contactData = Object.fromEntries(formData.entries());
        
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.innerHTML = '<span class="loading"></span> Отправка...';
        submitButton.disabled = true;
        
        // Имитация отправки
        setTimeout(() => {
            console.log('Contact data:', contactData);
            
            // Показываем уведомление
            showNotification('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
            
            // Сбрасываем форму
            contactForm.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    }
}

// Мобильное меню
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Закрытие меню при клике на ссылку
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

// Анимации hero секции
function initHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    const heroButtons = document.querySelector('.hero-buttons');
    const floatingCards = document.querySelectorAll('.floating-card');
    
    // Анимация появления текста
    setTimeout(() => {
        if (heroTitle) heroTitle.style.opacity = '1';
    }, 300);
    
    setTimeout(() => {
        if (heroDescription) heroDescription.style.opacity = '1';
    }, 600);
    
    setTimeout(() => {
        if (heroButtons) heroButtons.style.opacity = '1';
    }, 900);
    
    // Анимация плавающих карточек
    floatingCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 1200 + (index * 200));
    });
    
    // Интерактивность карточек
    floatingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.05)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
        });
    });
}

// Параллакс эффекты
function initParallaxEffects() {
    const decorationCircles = document.querySelectorAll('.decoration-circle');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        decorationCircles.forEach((circle, index) => {
            const speed = 0.2 + (index * 0.1);
            circle.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // Параллакс для floating cards
    const floatingCards = document.querySelectorAll('.floating-card');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        floatingCards.forEach((card, index) => {
            if (scrolled < window.innerHeight) {
                const speed = 0.1 + (index * 0.05);
                card.style.transform = `translateY(${scrolled * speed}px)`;
            }
        });
    });
}

// Система уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease-out;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Закрытие уведомления
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
    
    // Автоматическое закрытие
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    function hideNotification(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Дополнительные CSS стили для мобильного меню (добавляются динамически)
function addMobileMenuStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                left: -100%;
                top: 70px;
                flex-direction: column;
                background-color: rgba(255, 255, 255, 0.98);
                width: 100%;
                text-align: center;
                transition: 0.3s;
                box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
                backdrop-filter: blur(10px);
                padding: 2rem 0;
                z-index: 999;
            }
            
            .nav-menu.active {
                left: 0;
            }
            
            .nav-menu li {
                margin: 1rem 0;
            }
            
            .hamburger.active .bar:nth-child(2) {
                opacity: 0;
            }
            
            .hamburger.active .bar:nth-child(1) {
                transform: translateY(8px) rotate(45deg);
            }
            
            .hamburger.active .bar:nth-child(3) {
                transform: translateY(-8px) rotate(-45deg);
            }
            
            body.menu-open {
                overflow: hidden;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .notification-icon {
            font-weight: bold;
            font-size: 1.2rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            margin-left: auto;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
    `;
    
    document.head.appendChild(style);
}

// Добавляем стили при загрузке
addMobileMenuStyles();

// Дополнительные интерактивные эффекты
document.addEventListener('DOMContentLoaded', function() {
    // Эффект наведения на карточки услуг
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Анимация загрузки страницы
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Добавляем плавное появление всех элементов
        const allElements = document.querySelectorAll('*');
        allElements.forEach((el, index) => {
            if (index < 50) { // Только первые 50 элементов для производительности
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    el.style.transition = 'all 0.6s ease-out';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 50);
            }
        });
    });
    
    // Эффект печатания для hero заголовка
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.opacity = '1';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
});

// Функция для отправки данных на сервер (для реального проекта)
function sendBookingToServer(bookingData) {
    fetch('/api/booking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Booking confirmed:', data);
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Произошла ошибка при отправке заявки. Попробуйте еще раз.', 'error');
    });
}

// Валидация форм
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
        
        // Валидация email
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.style.borderColor = '#e74c3c';
                isValid = false;
            }
        }
        
        // Валидация телефона
        if (input.type === 'tel' && input.value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(input.value)) {
                input.style.borderColor = '#e74c3c';
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Маскирование телефона
function initPhoneMask() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value[0] === '8') {
                    value = '7' + value.slice(1);
                }
                
                let formattedValue = '+7';
                if (value.length > 1) {
                    formattedValue += ' (' + value.slice(1, 4);
                }
                if (value.length >= 4) {
                    formattedValue += ') ' + value.slice(4, 7);
                }
                if (value.length >= 7) {
                    formattedValue += '-' + value.slice(7, 9);
                }
                if (value.length >= 9) {
                    formattedValue += '-' + value.slice(9, 11);
                }
                
                e.target.value = formattedValue;
            }
        });
    });
}

// Инициализация маски телефона
initPhoneMask();