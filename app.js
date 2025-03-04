document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    // DOM Elements - Gallery
    const categoryButtons = document.querySelectorAll('.category-btn');
    const cardTemplates = document.querySelectorAll('.card-template');
    const selectCardButtons = document.querySelectorAll('.select-card-btn');
    
    // DOM Elements - Customization
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const currentPageSpan = document.getElementById('current-page');
    const applyCustomizationButton = document.getElementById('apply-customization');
    const previewPages = document.querySelectorAll('.preview-page');
    
    // DOM Elements - Preview
    const envelope = document.querySelector('.envelope');
    const previewInstructions = document.querySelector('.preview-instructions');
    const resetPreviewButton = document.getElementById('reset-preview');
    const goToShareButton = document.getElementById('go-to-share');
    
    // DOM Elements - Share
    const shareLink = document.getElementById('share-link');
    const copyLinkButton = document.getElementById('copy-link');
    const socialButtons = document.querySelectorAll('.social-btn');
    const createNewCardButton = document.getElementById('create-new-card');
    
    // State Management
    let currentSection = 'gallery-section';
    let selectedCardId = null;
    let currentPreviewPage = 0;
    let cardData = {
        cardId: null,
        recipient: 'Someone Special',
        message: 'Your personalized message will appear here.',
        sender: 'Your Name',
        fontFamily: 'Arial, sans-serif',
        textColor: '#000000',
        category: ''
    };
    
    // Initialize application
    function init() {
        loadCardFromUrl();
        updateCardPreview();
        setupEventListeners();
    }
    
    // Setup Event Listeners
    function setupEventListeners() {
        // Navigation
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetSection = button.id.replace('-btn', '-section');
                changeSection(targetSection);
            });
        });
        
        // Category filtering
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterCards(button.dataset.category);
                
                // Update active category
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
        
        // Card selection
        selectCardButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const cardTemplate = e.target.closest('.card-template');
                selectedCardId = cardTemplate.dataset.id;
                cardData.cardId = selectedCardId;
                cardData.category = cardTemplate.dataset.category;
                
                // Update preview with selected card
                updateCardPreview();
                
                // Navigate to customize section
                changeSection('customize-section');
            });
        });
        
        // Preview page navigation
        prevPageButton.addEventListener('click', () => {
            if (currentPreviewPage > 0) {
                currentPreviewPage--;
                updatePreviewPageDisplay();
            }
        });
        
        nextPageButton.addEventListener('click', () => {
            if (currentPreviewPage < previewPages.length - 1) {
                currentPreviewPage++;
                updatePreviewPageDisplay();
            }
        });
        
        // Apply customization
        applyCustomizationButton.addEventListener('click', () => {
            updateCardData();
            updateCardPreview();
        });
        
        // Envelope interaction
        envelope.addEventListener('click', () => {
            if (!envelope.classList.contains('opened')) {
                envelope.classList.add('opened');
                previewInstructions.textContent = 'Click the card to open it';
                
                // After envelope opens, allow clicking on card
                setTimeout(() => {
                    envelope.addEventListener('click', openCard, { once: true });
                }, 1500);
            }
        });
        
        // Reset preview
        resetPreviewButton.addEventListener('click', () => {
            resetCardPreview();
        });
        
        // Navigate to share
        goToShareButton.addEventListener('click', () => {
            changeSection('share-section');
            generateShareLink();
            updateShareThumbnail();
        });
        
        // Copy share link
        copyLinkButton.addEventListener('click', () => {
            shareLink.select();
            document.execCommand('copy');
            
            // Visual feedback
            copyLinkButton.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyLinkButton.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        });
        
        // Social sharing
        socialButtons.forEach(button => {
            button.addEventListener('click', () => {
                const url = shareLink.value;
                const text = `Check out this e-card I made for you!`;
                
                if (button.classList.contains('whatsapp')) {
                    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                } else if (button.classList.contains('email')) {
                    window.open(`mailto:?subject=E-Card for You&body=${encodeURIComponent(text + '\n\n' + url)}`, '_blank');
                } else if (button.classList.contains('facebook')) {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                } else if (button.classList.contains('twitter')) {
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                }
            });
        });
        
        // Create new card
        createNewCardButton.addEventListener('click', () => {
            resetApplication();
            changeSection('gallery-section');
        });
    }
    
    // Section Navigation
    function changeSection(sectionId) {
        // Update navigation buttons
        navButtons.forEach(button => {
            if (button.id === sectionId.replace('section', 'btn')) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update visible section
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
        
        currentSection = sectionId;
        
        // Special actions when changing to certain sections
        if (sectionId === 'preview-section') {
            resetCardPreview();
        }
    }
    
    // Card Filtering by category
    function filterCards(category) {
        cardTemplates.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Update preview page display
    function updatePreviewPageDisplay() {
        previewPages.forEach((page, index) => {
            if (index === currentPreviewPage) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });
        
        currentPageSpan.textContent = currentPreviewPage + 1;
    }
    
    // Update card data from form inputs
    function updateCardData() {
        cardData.recipient = document.getElementById('recipient-name').value || 'Someone Special';
        cardData.message = document.getElementById('card-message').value || 'Your personalized message will appear here.';
        cardData.sender = document.getElementById('sender-name').value || 'Your Name';
        cardData.fontFamily = document.getElementById('font-family').value;
        cardData.textColor = document.getElementById('text-color').value;
    }
    
    // Update card preview with current data
    function updateCardPreview() {
        // Update customization form values
        document.getElementById('recipient-name').value = cardData.recipient;
        document.getElementById('card-message').value = cardData.message;
        document.getElementById('sender-name').value = cardData.sender;
        document.getElementById('font-family').value = cardData.fontFamily;
        document.getElementById('text-color').value = cardData.textColor;
        
        // Update preview pages with selected card
        if (cardData.cardId) {
            const cardImagePath = `images/cards/${cardData.category}${cardData.cardId}.jpg`;
            
            // Front cover
            document.getElementById('front-cover-preview').style.backgroundImage = `url(${cardImagePath})`;
            document.getElementById('card-cover-content').style.backgroundImage = `url(${cardImagePath})`;
            
            // Inside left (typically has a design related to theme)
            const insideLeftImagePath = `images/cards/${cardData.category}-inside.jpg`;
            document.getElementById('inside-left-preview').style.backgroundImage = `url(${insideLeftImagePath})`;
            document.getElementById('card-inside-left').style.backgroundImage = `url(${insideLeftImagePath})`;
        }
        
        // Update text content
        document.getElementById('envelope-recipient').textContent = `To: ${cardData.recipient}`;
        document.getElementById('message-recipient').textContent = cardData.recipient;
        document.getElementById('message-content').textContent = cardData.message;
        document.getElementById('message-sender').textContent = cardData.sender;
        document.getElementById('share-recipient').textContent = cardData.recipient;
        
        // Apply text styling
        const messageContainer = document.querySelector('.message-container');
        messageContainer.style.fontFamily = cardData.fontFamily;
        messageContainer.style.color = cardData.textColor;
    }
    
    // Reset card preview animation
    function resetCardPreview() {
        envelope.classList.remove('opened', 'card-opened');
        previewInstructions.textContent = 'Click the envelope to open it';
    }
    
    // Open card animation
    function openCard() {
        if (envelope.classList.contains('opened') && !envelope.classList.contains('card-opened')) {
            envelope.classList.add('card-opened');
            previewInstructions.textContent = 'Your card is now open';
        }
    }
    
    // Generate share link
    function generateShareLink() {
        const baseUrl = window.location.href.split('?')[0];
        const params = new URLSearchParams();
        
        params.set('id', cardData.cardId);
        params.set('category', cardData.category);
        params.set('recipient', cardData.recipient);
        params.set('message', cardData.message);
        params.set('sender', cardData.sender);
        params.set('font', encodeURIComponent(cardData.fontFamily));
        params.set('color', cardData.textColor.substring(1));
        
        shareLink.value = `${baseUrl}?${params.toString()}`;
    }
    
    // Update share thumbnail
    function updateShareThumbnail() {
        if (cardData.cardId) {
            const cardImagePath = `images/cards/${cardData.category}${cardData.cardId}.jpg`;
            document.getElementById('share-thumbnail').style.backgroundImage = `url(${cardImagePath})`;
        }
    }
    
    // Load card from URL parameters
    function loadCardFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.has('id')) {
            cardData.cardId = urlParams.get('id');
            cardData.category = urlParams.get('category');
            cardData.recipient = urlParams.get('recipient');
            cardData.message = urlParams.get('message');
            cardData.sender = urlParams.get('sender');
            cardData.fontFamily = decodeURIComponent(urlParams.get('font'));
            cardData.textColor = '#' + urlParams.get('color');
            
            selectedCardId = cardData.cardId;
            
            // If it's a shared card, go directly to preview
            changeSection('preview-section');
        }
    }
    
    // Reset application to initial state
    function resetApplication() {
        selectedCardId = null;
        currentPreviewPage = 0;
        cardData = {
            cardId: null,
            recipient: 'Someone Special',
            message: 'Your personalized message will appear here.',
            sender: 'Your Name',
            fontFamily: 'Arial, sans-serif',
            textColor: '#000000',
            category: ''
        };
        
        resetCardPreview();
        updatePreviewPageDisplay();
        
        // Reset category filter
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        categoryButtons[0].classList.add('active');
        filterCards('all');
    }
    
    // Initialize the application
    init();
});