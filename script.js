document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. FAQ ACCORDION LOGIC
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const button = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        button.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    /* ==========================================================================
       2. INTERSECTION OBSERVER FOR SCROLL ANIMATIONS (FADE-IN / FADE-UP)
       ========================================================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                // Optional: Stop observing once animation has triggered
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.fade-in, .fade-up');
    animatedElements.forEach(el => observer.observe(el));

    /* ==========================================================================
       3. SMOOTH SCROLL FOR ANCHOR LINKS
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 0; // Adjust if you have a fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Focus the first input of the form slightly after scroll
                setTimeout(() => {
                    const firstInput = targetElement.querySelector('input');
                    if (firstInput) firstInput.focus();
                }, 500);
            }
        });
    });

    /* ==========================================================================
       4. MODAL DE CAPTURA (POPUP) E FLUXO DE INSCRIÇÃO
       ========================================================================== */
    const openPopupBtns = document.querySelectorAll('.open-popup-btn');
    const captureModal = document.getElementById('capture-modal');
    const closeModalBtn = document.getElementById('close-modal');
    
    const modalStep1 = document.getElementById('modal-step-1');
    const modalStep2 = document.getElementById('modal-step-2');
    const popupForm = document.getElementById('popup-form');
    const loadingBox = document.getElementById('loading-box');
    const progressBar = document.getElementById('progress-bar');
    const successBox = document.getElementById('success-box');

    // Função para abrir o modal e resetar o estado
    const openModal = () => {
        if (!captureModal) return;
        
        // Resetar estados
        modalStep1.classList.remove('hidden');
        modalStep2.classList.add('hidden');
        loadingBox.classList.remove('hidden');
        successBox.classList.add('hidden');
        progressBar.style.width = '0%';
        if (popupForm) popupForm.reset();
        
        captureModal.classList.add('active');
        
        // Focar no primeiro input após abrir
        setTimeout(() => {
            const firstInput = popupForm.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 300);
    };

    // Função para fechar o modal
    const closeModal = () => {
        if (!captureModal) return;
        captureModal.classList.remove('active');
    };

    // Eventos de clique para abrir
    openPopupBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    // Eventos para fechar (botão X e clique fora)
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (captureModal) {
        captureModal.addEventListener('click', (e) => {
            if (e.target === captureModal) {
                closeModal();
            }
        });
    }

    // Fechar com tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && captureModal && captureModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Submissão do formulário no Popup
    if (popupForm) {
        popupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validação básica
            const inputs = popupForm.querySelectorAll('input[required]');
            let isValid = true;
            inputs.forEach(input => {
                if (!input.value.trim()) isValid = false;
            });

            if (isValid) {
                // Transição para o Step 2 (Carregamento)
                modalStep1.classList.add('hidden');
                modalStep2.classList.remove('hidden');
                loadingBox.classList.remove('hidden');
                successBox.classList.add('hidden');
                
                // Iniciar animação da barra de progresso (4 segundos)
                setTimeout(() => {
                    progressBar.style.width = '100%';
                }, 50);

                // Após 4 segundos, exibir mensagem final
                setTimeout(() => {
                    loadingBox.classList.add('hidden');
                    successBox.classList.remove('hidden');
                }, 4000);
            }
        });
    }
});
