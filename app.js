document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const envelopeFront = document.querySelector('.envelope-front');
    const envelopeBack = document.querySelector('.envelope-back');
    const envelopeFlap = document.querySelector('.envelope-flap');
    const letter = document.querySelector('.letter');
    const cardPages = document.querySelector('.card-pages');
    const customizationForm = document.querySelector('.customization-form');
    const shareModal = document.querySelector('.share-modal');
    
    // Buttons
    const envelopeBtn = document.querySelector('.envelope-btn');
    const openCardBtn = document.querySelector('.open-card-btn');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const restartBtn = document.querySelector('.restart-btn');
    const customizeBtn = document.querySelector('.customize-btn');
    const saveBtn = document.querySelector('.save-btn');
    const shareBtns = document.querySelectorAll('.share-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const closeModal = document.querySelector('.close-modal');
    const copyLinkBtn = document.getElementById('copy-link');
    const socialBtns = document.querySelectorAll('.social-btn');
    
    // Card pages
    const cardPagesArray = Array.from(document.querySelectorAll('.card-page'));
    
    // State
    let currentPage = 0;
    let customCardData = {
        recipient: 'Someone Special',
        message: 'I wanted to send you something special...',
        sender: 'Me',
        theme: 'default'
    };
    
    // Open envelope animation
    envelopeBtn.addEventListener('click', () => {
        envelopeFront.classList.add('flip');
        envelopeBack.classList.add('active');
        envelopeBack.classList.add('flip');
        
        setTimeout(() => {
            envelopeFlap.classList.add('open');
            
            setTimeout(() => {
                letter.classList.add('pull-out');
            }, 500);
        }, 1000);
    });
    
    // Open card
    openCardBtn.addEventListener('click', () => {
        envelopeBack.classList.remove('active');
        cardPages.classList.add('active');
    });
    
    // Navigation between card pages
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentPage < cardPagesArray.length - 1) {
                cardPagesArray[currentPage].classList.remove('active');
                currentPage++;
                cardPagesArray[currentPage].classList.add('active');
            }
        });
    });
    
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentPage > 0) {
                cardPagesArray[currentPage].classList.remove('active');
                currentPage--;
                cardPagesArray[currentPage].classList.add('active');
            }
        });
    });
    
    // Restart button
    restartBtn.addEventListener('click', () => {
        resetEverything();
    });
    
    // Customize button
    customizeBtn.addEventListener('click', () => {
        cardPages.classList.remove('active');
        customizationForm.classList.add('active');
        
        // Pre-fill form with current values
        document.getElementById('recipient').value = customCardData.recipient;
        document.getElementById('message').value = customCardData.message;
        document.getElementById('sender').value = customCardData.sender;
        document.getElementById('theme').value = customCardData.theme;
    });
    
    // Save customized card
    saveBtn.addEventListener('click', () => {
        customCardData = {
            recipient: document.getElementById('recipient').value || 'Someone Special',
            message: document.getElementById('message').value || 'I wanted to send you something special...',
            sender: document.getElementById('sender').value || 'Me',
            theme: document.getElementById('theme').value || 'default'
        };
        
        // Update card content
        document.querySelector('.address-lines span').textContent = `To: ${customCardData.recipient}`;
        document.querySelector('.page-1 .card-text').textContent = customCardData.message;
        document.querySelector('.signature').innerHTML = `With love,<br>${customCardData.sender}`;
        
        // Apply theme
        cardPagesArray.forEach(page => {
            page.className = `card-page ${page.classList[1]}`;
            if (customCardData.theme !== 'default') {
                page.classList.add(`theme-${customCardData.theme}`);
            }
        });
        
        customizationForm.classList.remove('active');
        cardPages.classList.add('active');
    });
    
    // Cancel customization
    cancelBtn.addEventListener('click', () => {
        customizationForm.classList.remove('active');
        cardPages.classList.add('active');
    });
    
    // Share functionality
    shareBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            openShareModal();
        });
    });
    
    // Close share modal
    closeModal.addEventListener('click', () => {
        shareModal.classList.remove('active');
    });
    
    // Click outside modal to close
    shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) {
            shareModal.classList.remove('active');
        }
    });
    
    // Copy share link
    copyLinkBtn.addEventListener('click', () => {
        const shareLinkInput = document.getElementById('share-link');
        shareLinkInput.select();
        document.execCommand('copy');
        
        // Show copied feedback
        const originalText = copyLinkBtn.textContent;
        copyLinkBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyLinkBtn.textContent = originalText;
        }, 2000);
    });
    
    // Social sharing buttons
    socialBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const shareUrl = document.getElementById('share-link').value;
            const text = `Check out this e-card I made for you!`;
            let shareLink;
            
            if (btn.classList.contains('whatsapp')) {
                shareLink = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`;
            } else if (btn.classList.contains('email')) {
                shareLink = `mailto:?subject=E-Card for You&body=${encodeURIComponent(text + '\n\n' + shareUrl)}`;
            } else if (btn.classList.contains('facebook')) {
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
            } else if (btn.classList.contains('twitter')) {
                shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
            }
            
            window.open(shareLink, '_blank');
        });
    });
    
    // Helper functions
    function resetEverything() {
        // Reset envelope
        envelopeFront.classList.remove('flip');
        envelopeBack.classList.remove('flip');
        envelopeBack.classList.remove('active');
        envelopeFlap.classList.remove('open');
        letter.classList.remove('pull-out');
        
        // Reset card pages
        cardPages.classList.remove('active');
        cardPagesArray.forEach(page => page.classList.remove('active'));
        cardPagesArray[0].classList.add('active');
        currentPage = 0;
        
        // Reset custom form
        customizationForm.classList.remove('active');
        
        // Show envelope front
        envelopeFront.classList.add('active');
    }
    
    function openShareModal() {
        // Generate a share link with encoded parameters
        const baseUrl = window.location.href.split('?')[0];
        const params = new URLSearchParams();
        params.set('recipient', customCardData.recipient);
        params.set('message', customCardData.message);
        params.set('sender', customCardData.sender);
        params.set('theme', customCardData.theme);
        
        const shareUrl = `${baseUrl}?${params.toString()}`;
        document.getElementById('share-link').value = shareUrl;
        
        shareModal.classList.add('active');
    }
    
    // Check URL for shared card parameters
    function loadSharedCard() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('recipient')) {
            customCardData = {
                recipient: urlParams.get('recipient'),
                message: urlParams.get('message'),
                sender: urlParams.get('sender'),
                theme: urlParams.get('theme')
            };
            
            // Update card content
            document.querySelector('.address-lines span').textContent = `To: ${customCardData.recipient}`;
            document.querySelector('.page-1 .card-text').textContent = customCardData.message;
            document.querySelector('.signature').innerHTML = `With love,<br>${customCardData.sender}`;
            
            // Apply theme
            cardPagesArray.forEach(page => {
                page.className = `card-page ${page.classList[1]}`;
                if (customCardData.theme !== 'default') {
                    page.classList.add(`theme-${customCardData.theme}`);
                }
            });
        }
    }
    
    // Initialize
    loadSharedCard();
});