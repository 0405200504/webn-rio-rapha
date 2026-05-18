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
                // Otimização de Performance: Para de observar o elemento após a animação para poupar CPU
                observer.unobserve(entry.target);
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
       4. MODAL DE CAPTURA (POPUP) E FLUXO DE INSCRIÇÃO / GOOGLE SHEETS
       ==========================================================================
       
       GUIA DE CONFIGURAÇÃO DA PLANILHA DE LEADS (GOOGLE SHEETS)
       --------------------------------------------------------------------------
       Para que os leads preenchidos no site sejam salvos automaticamente e a 
       sua planilha fique com um visual premium e perfeitamente organizada, 
       siga o passo a passo abaixo:

       PASSO 1:
       Crie uma nova planilha no Google Sheets (ex: "Leads - Webinário Raphael Pereira").

       PASSO 2:
       No menu superior do Google Sheets, clique em: Extensões > Apps Script.

       PASSO 3:
       Apague qualquer código que estiver no editor e cole o script completo abaixo:

// --- INÍCIO DO CÓDIGO DO APPS SCRIPT (Copie e cole no Google Sheets) ---
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 1. Configuração e Formatação Automática da Planilha (Deixa a planilha linda e organizada)
    if (sheet.getLastRow() === 0) {
      // Cria o cabeçalho se a planilha estiver vazia
      var cabecalho = ["Data/Hora", "Nome", "WhatsApp", "E-mail"];
      sheet.appendRow(cabecalho);
      
      // Formatação Premium do Cabeçalho (Estética da Marca: Fundo Escuro, Letra Laranja)
      var rangeCabecalho = sheet.getRange(1, 1, 1, 4);
      rangeCabecalho.setBackground("#0B0B0B")
                    .setFontColor("#FF6A00")
                    .setFontWeight("bold")
                    .setHorizontalAlignment("center")
                    .setFontFamily("Arial");
      
      // Congela a primeira linha para o cabeçalho ficar fixo ao rolar a planilha
      sheet.setFrozenRows(1);
    }
    
    // 2. Captura e Tratamento dos Dados do Lead
    var nome = e.parameter.nome || "Não informado";
    var whatsapp = e.parameter.whatsapp || "Não informado";
    var email = e.parameter.email || "Não informado";
    var dataHora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
    
    // 3. Inserção dos Dados na Planilha
    sheet.appendRow([dataHora, nome, whatsapp, email]);
    
    // 4. Ajuste Automático do Tamanho das Colunas para não cortar nenhum texto
    sheet.autoResizeColumns(1, 4);
    
    // 5. Alinhamento dos Dados Inseridos (Data centralizada, restante à esquerda)
    var ultimaLinha = sheet.getLastRow();
    sheet.getRange(ultimaLinha, 1).setHorizontalAlignment("center");
    sheet.getRange(ultimaLinha, 2, 1, 3).setHorizontalAlignment("left");

    // Retorna sucesso para o site
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
// --- FIM DO CÓDIGO DO APPS SCRIPT ---

       PASSO 4:
       No Apps Script, clique no ícone de disquete (Salvar).

       PASSO 5:
       Clique no botão azul "Implantar" (Deploy) no canto superior direito > "Nova implantação".
       - Selecione o tipo: "App da Web" (Web App).
       - Descrição: Webhook Leads
       - Executar como: "Eu"
       - Quem pode acessar: "Qualquer pessoa" (Anyone) -> IMPORTANTE: Tem que ser "Qualquer pessoa".

       PASSO 6:
       Clique em "Implantar", autorize as permissões do Google e copie a "URL do App da Web".

       PASSO 7:
       Cole a URL copiada dentro das aspas da constante GOOGLE_SHEETS_WEBHOOK_URL abaixo:
       ========================================================================== */

    // IMPORTANTE: Cole abaixo a URL do Web App gerada no Google Apps Script
    const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwXzdnnh8yxghs47oqJkftTdUlZi7nZBJBPg6SbvxbMvYuYQvueuuMHLX2I2-2GCrCwcw/exec";

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

                // Enviar dados para o Google Sheets em segundo plano
                const formData = new FormData(popupForm);
                
                if (GOOGLE_SHEETS_WEBHOOK_URL && GOOGLE_SHEETS_WEBHOOK_URL !== "COLE_SUA_URL_DO_WEB_APP_AQUI") {
                    fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => console.log('Sucesso no envio para o Google Sheets:', data))
                    .catch(error => console.error('Erro ao enviar para o Google Sheets:', error));
                } else {
                    console.warn('URL do Google Sheets Webhook não configurada. Simulando envio local.');
                }

                // Após 4 segundos, exibir mensagem final
                setTimeout(() => {
                    loadingBox.classList.add('hidden');
                    successBox.classList.remove('hidden');
                }, 4000);
            }
        });
    }
});
