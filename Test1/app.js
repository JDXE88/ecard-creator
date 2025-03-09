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

    // Add to setupEventListeners function in app.js
    const saveCardButton = document.getElementById('save-card');
    saveCardButton.addEventListener('click', () => {
        // First update card data from form
        updateCardData();

        // Then save to database
        saveCardToDatabase(cardData)
            .then(id => {
                alert('Card design saved successfully! You can access it from My Saved Cards.');
            })
            .catch(error => {
                console.error('Error saving card:', error);
                alert('There was an error saving your card. Please try again.');
            });
    });

    // Function to create a section for saved cards
    function createSavedCardsSection(cards) {
        // Create section for saved cards in gallery
        const gallerySectionDiv = document.querySelector('#gallery-section .cards-grid');

        // Add a header for saved cards
        const savedCardsHeader = document.createElement('h3');
        savedCardsHeader.textContent = 'My Saved Cards';
        savedCardsHeader.style.gridColumn = '1 / -1';
        savedCardsHeader.style.marginTop = '2rem';
        savedCardsHeader.style.marginBottom = '1rem';
        gallerySectionDiv.appendChild(savedCardsHeader);

        // Add each saved card
        cards.slice(0, 5).forEach(card => { // Show only the 5 most recent
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card-template';
            cardDiv.dataset.id = card.cardId;
            cardDiv.dataset.category = card.category;

            cardDiv.innerHTML = `
            <div class="card-preview">
                <img src="${card.customImage || `images/cards/${card.category}${card.cardId}.jpg`}" alt="Saved Card">
            </div>
            <h3>${card.recipient}'s Card</h3>
            <button class="select-card-btn">Select</button>
        `;

            // Add click event to load this saved card
            cardDiv.querySelector('.select-card-btn').addEventListener('click', () => {
                cardData = { ...card };
                updateCardPreview();
                changeSection('customize-section');
            });

            gallerySectionDiv.appendChild(cardDiv);
        });
    }

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

    // Add to app.js - Custom image upload functionality
    let customImageDataUrl = null;

    function setupCustomImageUpload() {
        const customImageInput = document.getElementById('custom-image');
        const useCustomImageBtn = document.getElementById('use-custom-image');

        useCustomImageBtn.addEventListener('click', () => {
            if (customImageInput.files && customImageInput.files[0]) {
                const reader = new FileReader();

                reader.onload = (e) => {
                    customImageDataUrl = e.target.result;

                    // Update front cover with custom image
                    document.getElementById('front-cover-preview').style.backgroundImage = `url(${customImageDataUrl})`;
                    document.getElementById('card-cover-content').style.backgroundImage = `url(${customImageDataUrl})`;

                    // Store the custom image in indexedDB for later retrieval
                    saveCustomImage(customImageDataUrl);

                    // Provide feedback to the user
                    alert('Custom image applied to your card!');
                };

                reader.readAsDataURL(customImageInput.files[0]);
            } else {
                alert('Please select an image first.');
            }
        });
    }

    // Save custom image to database
    function saveCustomImage(imageDataUrl) {
        if (db) {
            const settings = {
                customImage: imageDataUrl
            };

            saveUserSettings(settings)
                .then(() => console.log('Custom image saved to database'))
                .catch(error => console.error('Error saving custom image:', error));
        }
    }

    // Update the init function in app.js
    async function init() {
        try {
            // Initialize the database
            await initDatabase();

            // Load settings from database
            const settings = await getUserSettings();
            if (settings.customImage) {
                customImageDataUrl = settings.customImage;
            }

            // Load card from URL parameters or database
            await loadCardFromUrl();

            // Set up all event listeners
            setupEventListeners();
            setupCustomImageUpload();

            // Update card preview with current data
            updateCardPreview();

            // Add "My Saved Cards" section if there are any
            getSavedCards().then(cards => {
                if (cards.length > 0) {
                    createSavedCardsSection(cards);
                }
            });

        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    // Add to app.js - Database implementation for settings persistence

    // Initialize Database
    let db;
    const DB_NAME = 'eCardCreatorDB';
    const DB_VERSION = 1;
    const CARDS_STORE = 'savedCards';
    const SETTINGS_STORE = 'userSettings';

    function initDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = event => {
                console.error("Database error:", event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = event => {
                db = event.target.result;
                console.log("Database opened successfully");
                resolve(db);
            };

            request.onupgradeneeded = event => {
                const db = event.target.result;

                // Create savedCards object store
                if (!db.objectStoreNames.contains(CARDS_STORE)) {
                    const cardsStore = db.createObjectStore(CARDS_STORE, { keyPath: 'id', autoIncrement: true });
                    cardsStore.createIndex('createdAt', 'createdAt', { unique: false });
                }

                // Create userSettings object store
                if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
                    db.createObjectStore(SETTINGS_STORE, { keyPath: 'id' });
                }
            };
        });
    }

    // Save card data
    function saveCardToDatabase(cardData) {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error("Database not initialized"));
                return;
            }

            const transaction = db.transaction([CARDS_STORE], 'readwrite');
            const store = transaction.objectStore(CARDS_STORE);

            const cardToSave = {
                ...cardData,
                createdAt: new Date().toISOString()
            };

            const request = store.add(cardToSave);

            request.onsuccess = event => {
                console.log("Card saved successfully");
                resolve(event.target.result);
            };

            request.onerror = event => {
                console.error("Error saving card:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    // Load saved cards
    function getSavedCards() {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error("Database not initialized"));
                return;
            }

            const transaction = db.transaction([CARDS_STORE], 'readonly');
            const store = transaction.objectStore(CARDS_STORE);
            const index = store.index('createdAt');
            const request = index.openCursor(null, 'prev'); // Sort by newest first

            const cards = [];

            request.onsuccess = event => {
                const cursor = event.target.result;
                if (cursor) {
                    cards.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(cards);
                }
            };

            request.onerror = event => {
                console.error("Error loading cards:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    // Save user settings
    function saveUserSettings(settings) {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error("Database not initialized"));
                return;
            }

            const transaction = db.transaction([SETTINGS_STORE], 'readwrite');
            const store = transaction.objectStore(SETTINGS_STORE);

            // Always use the same ID for settings
            const userSettings = {
                id: 'userSettings',
                ...settings,
                updatedAt: new Date().toISOString()
            };

            const request = store.put(userSettings);

            request.onsuccess = event => {
                console.log("Settings saved successfully");
                resolve();
            };

            request.onerror = event => {
                console.error("Error saving settings:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    // Load user settings
    function getUserSettings() {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error("Database not initialized"));
                return;
            }

            const transaction = db.transaction([SETTINGS_STORE], 'readonly');
            const store = transaction.objectStore(SETTINGS_STORE);
            const request = store.get('userSettings');

            request.onsuccess = event => {
                resolve(request.result || {});
            };

            request.onerror = event => {
                console.error("Error loading settings:", event.target.error);
                reject(event.target.error);
            };
        });
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
    // In app.js, modify the openCard function
    function openCard() {
        if (envelope.classList.contains('opened') && !envelope.classList.contains('card-opened')) {
            envelope.classList.add('card-opened');
            previewInstructions.textContent = 'Your card is now open';

            // Add animation class to card pages
            document.querySelector('.card-page.cover').classList.add('turning');

            // After animation completes, show inside pages
            setTimeout(() => {
                document.querySelector('.card-page.inside-left').style.zIndex = '5';
                document.querySelector('.card-page.inside-right').style.zIndex = '5';
            }, 500);
        }
    }

    // In app.js, update the generateShareLink function
    function generateShareLink() {
        const baseUrl = window.location.href.split('?')[0];
        const params = new URLSearchParams();

        // Ensure all parameters are correctly set
        params.set('id', cardData.cardId);
        params.set('category', cardData.category);
        params.set('recipient', encodeURIComponent(cardData.recipient));
        params.set('message', encodeURIComponent(cardData.message));
        params.set('sender', encodeURIComponent(cardData.sender));
        params.set('font', encodeURIComponent(cardData.fontFamily));
        params.set('color', cardData.textColor.substring(1));

        const shareUrl = `${baseUrl}?${params.toString()}`;
        shareLink.value = shareUrl;

        // Make the link clickable
        shareLink.setAttribute('readonly', 'readonly');

        // Store in localStorage as recent card
        storeRecentCard(shareUrl);
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