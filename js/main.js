// Main page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('FamilyFinance - Main page loaded');
    
    // Initialize main functionality
    initMainPage();
});

function initMainPage() {
    console.log('Initializing main page...');
    
    // Bind all events
    bindEvents();
    setCurrentYear();
    initMobileMenu();
}

function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

function bindEvents() {
    console.log('Binding events...');
    
    // Main buttons
    const startFreeBtn = document.getElementById('start-free-btn');
    const familyAccessBtn = document.getElementById('family-access-btn');
    const navLoginBtn = document.getElementById('nav-login-btn');
    const ctaStartBtn = document.getElementById('cta-start-btn');
    
    if (startFreeBtn) {
        console.log('Found start-free button');
        startFreeBtn.addEventListener('click', function() {
            console.log('Start free button clicked');
            showAuthModal('register');
        });
    }
    
    if (familyAccessBtn) {
        console.log('Found family-access button');
        familyAccessBtn.addEventListener('click', function() {
            console.log('Family access button clicked');
            showFamilyAccessModal();
        });
    }
    
    if (navLoginBtn) {
        console.log('Found nav login button');
        navLoginBtn.addEventListener('click', function() {
            console.log('Nav login button clicked');
            showAuthModal('login');
        });
    }
    
    if (ctaStartBtn) {
        console.log('Found CTA start button');
        ctaStartBtn.addEventListener('click', function() {
            console.log('CTA start button clicked');
            showAuthModal('register');
        });
    }
    
    // Demo buttons
    const demoBtn1 = document.getElementById('demo-btn');
    const demoBtn2 = document.getElementById('demo-btn-2');
    
    if (demoBtn1) demoBtn1.addEventListener('click', startDemo);
    if (demoBtn2) demoBtn2.addEventListener('click', startDemo);
    
    // Modal close buttons
    const authCloseBtn = document.getElementById('auth-close-btn');
    const familyAccessCloseBtn = document.getElementById('family-access-close-btn');
    const createFamilyCloseBtn = document.getElementById('create-family-close-btn');
    const joinFamilyCloseBtn = document.getElementById('join-family-close-btn');
    const supportCloseBtn = document.getElementById('support-close-btn');
    const legalCloseBtn = document.getElementById('legal-close-btn');
    
    if (authCloseBtn) authCloseBtn.addEventListener('click', closeAuthModal);
    if (familyAccessCloseBtn) familyAccessCloseBtn.addEventListener('click', closeFamilyAccessModal);
    if (createFamilyCloseBtn) createFamilyCloseBtn.addEventListener('click', closeCreateFamilyModal);
    if (joinFamilyCloseBtn) joinFamilyCloseBtn.addEventListener('click', closeJoinFamilyModal);
    if (supportCloseBtn) supportCloseBtn.addEventListener('click', closeSupportModal);
    if (legalCloseBtn) legalCloseBtn.addEventListener('click', closeLegalModal);
    
    // Tab buttons
    const loginTabBtn = document.getElementById('login-tab-btn');
    const registerTabBtn = document.getElementById('register-tab-btn');
    
    if (loginTabBtn) loginTabBtn.addEventListener('click', function() { switchAuthTab('login'); });
    if (registerTabBtn) registerTabBtn.addEventListener('click', function() { switchAuthTab('register'); });
    
    // Family access options
    const createFamilyOption = document.getElementById('create-family-option');
    const joinFamilyOption = document.getElementById('join-family-option');
    
    if (createFamilyOption) createFamilyOption.addEventListener('click', showCreateFamilyModal);
    if (joinFamilyOption) joinFamilyOption.addEventListener('click', showJoinFamilyModal);
    
    // Form submissions
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const createFamilyForm = document.getElementById('create-family-form');
    const joinFamilyForm = document.getElementById('join-family-form');
    
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (createFamilyForm) createFamilyForm.addEventListener('submit', handleCreateFamilySubmit);
    if (joinFamilyForm) joinFamilyForm.addEventListener('submit', handleJoinFamilySubmit);
    
    // Footer links
    const supportLink = document.getElementById('support-link');
    const contactsLink = document.getElementById('contacts-link');
    const privacyLink = document.getElementById('privacy-link');
    const termsLink = document.getElementById('terms-link');
    
    if (supportLink) supportLink.addEventListener('click', function(e) { e.preventDefault(); showSupportModal(); });
    if (contactsLink) contactsLink.addEventListener('click', function(e) { e.preventDefault(); showSupportModal(); });
    if (privacyLink) privacyLink.addEventListener('click', function(e) { e.preventDefault(); showLegalModal(); });
    if (termsLink) termsLink.addEventListener('click', function(e) { e.preventDefault(); showLegalModal(); });
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Close modals on outside click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    console.log('All events bound successfully');
}

// Modal functions
function showAuthModal(defaultTab = 'login') {
    console.log('Showing auth modal with tab:', defaultTab);
    closeAllModals();
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        switchAuthTab(defaultTab);
    }
}

function showFamilyAccessModal() {
    console.log('Showing family access modal');
    closeAllModals();
    const modal = document.getElementById('family-access-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function showCreateFamilyModal() {
    console.log('Showing create family modal');
    closeAllModals();
    const modal = document.getElementById('create-family-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function showJoinFamilyModal() {
    console.log('Showing join family modal');
    closeAllModals();
    const modal = document.getElementById('join-family-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function showSupportModal() {
    closeAllModals();
    const modal = document.getElementById('support-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function showLegalModal() {
    closeAllModals();
    const modal = document.getElementById('legal-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function closeFamilyAccessModal() {
    const modal = document.getElementById('family-access-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function closeCreateFamilyModal() {
    const modal = document.getElementById('create-family-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function closeJoinFamilyModal() {
    const modal = document.getElementById('join-family-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function closeSupportModal() {
    const modal = document.getElementById('support-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function closeLegalModal() {
    const modal = document.getElementById('legal-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
}

function switchAuthTab(tabName) {
    console.log('Switching to tab:', tabName);
    // Update tabs
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // Update forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.toggle('active', form.id === `${tabName}-form`);
    });
}

// Form handlers
function handleLogin(e) {
    e.preventDefault();
    console.log('Login form submitted');
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showAlert('Пожалуйста, заполните все поля', 'error');
        return;
    }

    showLoading('Вход в систему...');
    
    setTimeout(() => {
        hideLoading();
        
        // Check if user already exists
        const existingUserKey = findUserByEmail(email);
        let userId;
        
        if (existingUserKey) {
            // User exists, restore their data
            userId = existingUserKey.replace('userData_', '');
            console.log('Existing user found, restoring data for:', userId);
        } else {
            // New user, create new ID
            userId = `user_${Date.now()}`;
            console.log('New user, creating ID:', userId);
        }
        
        const userData = {
            id: userId,
            email: email,
            fullName: email.split('@')[0],
            isLoggedIn: true,
            createdAt: existingUserKey ? getExistingUserCreatedAt(existingUserKey) : new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Initialize storage if it doesn't exist
        if (!existingUserKey) {
            initializeUserStorage(userId, email, email.split('@')[0]);
        }
        
        showAlert('Успешный вход!', 'success');
        setTimeout(() => goToApp(), 1000);
    }, 1500);
}

function handleRegister(e) {
    e.preventDefault();
    console.log('Register form submitted');
    
    const fullName = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (!fullName || !email || !password) {
        showAlert('Пожалуйста, заполните все поля', 'error');
        return;
    }

    if (password.length < 6) {
        showAlert('Пароль должен содержать не менее 6 символов', 'error');
        return;
    }

    showLoading('Создание аккаунта...');
    
    setTimeout(() => {
        hideLoading();
        
        // Check if user already exists
        const existingUserKey = findUserByEmail(email);
        let userId;
        
        if (existingUserKey) {
            // User exists, restore their data
            userId = existingUserKey.replace('userData_', '');
            console.log('Existing user found, restoring data for:', userId);
        } else {
            // New user, create new ID
            userId = `user_${Date.now()}`;
            console.log('New user, creating ID:', userId);
        }
        
        const userData = {
            id: userId,
            email: email,
            fullName: fullName,
            isLoggedIn: true,
            createdAt: existingUserKey ? getExistingUserCreatedAt(existingUserKey) : new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Initialize storage if it doesn't exist
        if (!existingUserKey) {
            initializeUserStorage(userId, email, fullName);
        }
        
        showAlert('Аккаунт успешно создан! Добро пожаловать в FamilyFinance!', 'success');
        setTimeout(() => goToApp(), 1000);
    }, 2000);
}

function handleCreateFamilySubmit(e) {
    e.preventDefault();
    console.log('Create family form submitted');
    
    const familyName = document.getElementById('create-family-name').value;
    const familyPassword = document.getElementById('create-family-password').value;
    const confirmPassword = document.getElementById('confirm-family-password').value;

    if (!familyName || !familyPassword || !confirmPassword) {
        showAlert('Пожалуйста, заполните все поля', 'error');
        return;
    }

    if (familyPassword !== confirmPassword) {
        showAlert('Пароли не совпадают', 'error');
        return;
    }

    if (familyPassword.length < 4) {
        showAlert('Пароль должен содержать не менее 4 символов', 'error');
        return;
    }

    showLoading('Создание семьи...');
    
    setTimeout(() => {
        hideLoading();
        
        // Check if family already exists
        const existingFamilyKey = findFamilyByName(familyName);
        let familyId;
        
        if (existingFamilyKey) {
            // Family exists, restore their data
            familyId = existingFamilyKey.replace('familyData_', '');
            console.log('Existing family found, restoring data for:', familyId);
        } else {
            // New family, create new ID
            familyId = `family_${Date.now()}`;
            console.log('New family, creating ID:', familyId);
        }
        
        const familyData = {
            id: familyId,
            familyName: familyName,
            isFamilyLogin: true,
            createdAt: existingFamilyKey ? getExistingFamilyCreatedAt(existingFamilyKey) : new Date().toISOString()
        };
        
        localStorage.setItem('currentFamily', JSON.stringify(familyData));
        
        // Initialize storage if it doesn't exist
        if (!existingFamilyKey) {
            initializeFamilyStorage(familyId, familyName);
        }
        
        showAlert(`Семья "${familyName}" успешно создана!`, 'success');
        closeCreateFamilyModal();
        setTimeout(() => goToApp(), 1000);
    }, 1500);
}

function handleJoinFamilySubmit(e) {
    e.preventDefault();
    console.log('Join family form submitted');
    
    const familyName = document.getElementById('join-family-name').value;
    const familyPassword = document.getElementById('join-family-password').value;

    if (!familyName || !familyPassword) {
        showAlert('Пожалуйста, заполните все поля', 'error');
        return;
    }

    showLoading('Вход в семью...');
    
    setTimeout(() => {
        hideLoading();
        
        // Check if family already exists
        const existingFamilyKey = findFamilyByName(familyName);
        let familyId;
        
        if (existingFamilyKey) {
            // Family exists, restore their data
            familyId = existingFamilyKey.replace('familyData_', '');
            console.log('Existing family found, restoring data for:', familyId);
        } else {
            // Family not found, create new
            familyId = `family_${Date.now()}`;
            console.log('New family, creating ID:', familyId);
        }
        
        const familyData = {
            id: familyId,
            familyName: familyName,
            isFamilyLogin: true,
            createdAt: existingFamilyKey ? getExistingFamilyCreatedAt(existingFamilyKey) : new Date().toISOString()
        };
        
        localStorage.setItem('currentFamily', JSON.stringify(familyData));
        
        // Initialize storage if it doesn't exist
        if (!existingFamilyKey) {
            initializeFamilyStorage(familyId, familyName);
        }
        
        showAlert(`Добро пожаловать в семью "${familyName}"!`, 'success');
        closeJoinFamilyModal();
        setTimeout(() => goToApp(), 1000);
    }, 1500);
}

function startDemo() {
    console.log('Starting demo mode');
    showLoading('Загрузка демо-версии...');
    
    setTimeout(() => {
        hideLoading();
        const demoId = `demo_${Date.now()}`;
        const demoData = {
            id: demoId,
            isDemo: true,
            fullName: 'Демо Пользователь',
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('currentUser', JSON.stringify(demoData));
        
        // Всегда создаем новое хранилище для демо
        initializeDemoStorage(demoId);
        
        showAlert('Демо-режим активирован!', 'success');
        setTimeout(() => goToApp(), 1000);
    }, 1500);
}

// Helper functions to find existing users and families
function findUserByEmail(email) {
    // Search through all localStorage keys for user data
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('userData_')) {
            try {
                const userData = JSON.parse(localStorage.getItem(key));
                if (userData.email === email) {
                    return key; // Return the storage key
                }
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
    }
    return null;
}

function findFamilyByName(familyName) {
    // Search through all localStorage keys for family data
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('familyData_')) {
            try {
                const familyData = JSON.parse(localStorage.getItem(key));
                if (familyData.familyName === familyName) {
                    return key; // Return the storage key
                }
            } catch (e) {
                console.error('Error parsing family data:', e);
            }
        }
    }
    return null;
}

function getExistingUserCreatedAt(storageKey) {
    try {
        const userData = JSON.parse(localStorage.getItem(storageKey));
        return userData.createdAt || new Date().toISOString();
    } catch (e) {
        return new Date().toISOString();
    }
}

function getExistingFamilyCreatedAt(storageKey) {
    try {
        const familyData = JSON.parse(localStorage.getItem(storageKey));
        return familyData.createdAt || new Date().toISOString();
    } catch (e) {
        return new Date().toISOString();
    }
}

// Storage initialization functions
function initializeUserStorage(userId, email, fullName) {
    console.log(`Initializing storage for user: ${userId}`);
    
    // Инициализируем данные для пользователя
    const userStorage = {
        email: email,
        fullName: fullName,
        transactions: [],
        accounts: [
            { name: 'Наличные', type: 'cash', balance: 0, color: '#10B981' },
            { name: 'Основной счет', type: 'bank', balance: 0, color: '#3B82F6' },
            { name: 'Кредитная карта', type: 'credit', balance: 0, color: '#EF4444' }
        ],
        categories: [
            { name: 'Зарплата', type: 'income', icon: '💰', color: '#10B981' },
            { name: 'Бизнес', type: 'income', icon: '💼', color: '#059669' },
            { name: 'Инвестиции', type: 'income', icon: '📈', color: '#047857' },
            { name: 'Продукты', type: 'expense', icon: '🛒', color: '#EF4444' },
            { name: 'Транспорт', type: 'expense', icon: '🚗', color: '#DC2626' },
            { name: 'Развлечения', type: 'expense', icon: '🎮', color: '#F59E0B' },
            { name: 'Жилье', type: 'expense', icon: '🏠', color: '#7C3AED' },
            { name: 'Здоровье', type: 'expense', icon: '💊', color: '#EC4899' }
        ],
        budgets: [],
        goals: [],
        familyMembers: [],
        settings: {
            currency: 'RUB',
            theme: 'light'
        },
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(`userData_${userId}`, JSON.stringify(userStorage));
}

function initializeFamilyStorage(familyId, familyName) {
    console.log(`Initializing storage for family: ${familyId}`);
    
    // Инициализируем данные для семьи
    const familyStorage = {
        familyName: familyName,
        transactions: [],
        accounts: [
            { name: 'Наличные', type: 'cash', balance: 0, color: '#10B981' },
            { name: 'Основной счет', type: 'bank', balance: 0, color: '#3B82F6' },
            { name: 'Кредитная карта', type: 'credit', balance: 0, color: '#EF4444' }
        ],
        categories: [
            { name: 'Зарплата', type: 'income', icon: '💰', color: '#10B981' },
            { name: 'Бизнес', type: 'income', icon: '💼', color: '#059669' },
            { name: 'Инвестиции', type: 'income', icon: '📈', color: '#047857' },
            { name: 'Продукты', type: 'expense', icon: '🛒', color: '#EF4444' },
            { name: 'Транспорт', type: 'expense', icon: '🚗', color: '#DC2626' },
            { name: 'Развлечения', type: 'expense', icon: '🎮', color: '#F59E0B' },
            { name: 'Жилье', type: 'expense', icon: '🏠', color: '#7C3AED' },
            { name: 'Здоровье', type: 'expense', icon: '💊', color: '#EC4899' }
        ],
        budgets: [],
        goals: [],
        familyMembers: [],
        settings: {
            currency: 'RUB',
            theme: 'light'
        },
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(`familyData_${familyId}`, JSON.stringify(familyStorage));
}

function initializeDemoStorage(demoId) {
    console.log(`Initializing storage for demo: ${demoId}`);
    
    // Инициализируем данные для демо
    const demoStorage = {
        isDemo: true,
        fullName: 'Демо Пользователь',
        transactions: [],
        accounts: [
            { name: 'Наличные', type: 'cash', balance: 0, color: '#10B981' },
            { name: 'Основной счет', type: 'bank', balance: 0, color: '#3B82F6' },
            { name: 'Кредитная карта', type: 'credit', balance: 0, color: '#EF4444' }
        ],
        categories: [
            { name: 'Зарплата', type: 'income', icon: '💰', color: '#10B981' },
            { name: 'Бизнес', type: 'income', icon: '💼', color: '#059669' },
            { name: 'Инвестиции', type: 'income', icon: '📈', color: '#047857' },
            { name: 'Продукты', type: 'expense', icon: '🛒', color: '#EF4444' },
            { name: 'Транспорт', type: 'expense', icon: '🚗', color: '#DC2626' },
            { name: 'Развлечения', type: 'expense', icon: '🎮', color: '#F59E0B' },
            { name: 'Жилье', type: 'expense', icon: '🏠', color: '#7C3AED' },
            { name: 'Здоровье', type: 'expense', icon: '💊', color: '#EC4899' }
        ],
        budgets: [],
        goals: [],
        familyMembers: [],
        settings: {
            currency: 'RUB',
            theme: 'light'
        },
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(`demoData_${demoId}`, JSON.stringify(demoStorage));
}

function goToApp() {
    console.log('Redirecting to app...');
    window.location.href = 'app.html';
}

// Utility functions
function showLoading(message = 'Загрузка...') {
    const loadingOverlay = document.querySelector('.loading-overlay');
    const loadingMessage = document.querySelector('.loading-message');
    
    if (loadingOverlay && loadingMessage) {
        loadingMessage.textContent = message;
        loadingOverlay.classList.remove('hidden');
    }
}

function hideLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

function showAlert(message, type = 'info') {
    const alert = document.querySelector('.alert-message');
    const alertText = document.querySelector('.alert-text');
    const alertClose = document.querySelector('.alert-close');
    
    if (alert && alertText) {
        alertText.textContent = message;
        alert.className = `alert-message alert-${type}`;
        alert.classList.remove('hidden');
        
        // Set alert type styling
        if (type === 'success') {
            alert.style.borderLeftColor = '#10B981';
        } else if (type === 'error') {
            alert.style.borderLeftColor = '#EF4444';
        } else {
            alert.style.borderLeftColor = '#3B82F6';
        }
        
        // Close button event
        if (alertClose) {
            alertClose.onclick = function() {
                alert.classList.add('hidden');
            };
        }
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            alert.classList.add('hidden');
        }, 5000);
    }
}

function setCurrentYear() {
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = `&copy; ${currentYear} FamilyFinance. Все права защищены.`;
    }
}

// Make functions globally available for onclick handlers
window.showAuthModal = showAuthModal;
window.showFamilyAccessModal = showFamilyAccessModal;
window.showCreateFamilyModal = showCreateFamilyModal;
window.showJoinFamilyModal = showJoinFamilyModal;
window.closeAuthModal = closeAuthModal;
window.closeFamilyAccessModal = closeFamilyAccessModal;
window.closeCreateFamilyModal = closeCreateFamilyModal;
window.closeJoinFamilyModal = closeJoinFamilyModal;
window.closeSupportModal = closeSupportModal;
window.closeLegalModal = closeLegalModal;
window.switchAuthTab = switchAuthTab;
window.startDemo = startDemo;
window.goToApp = goToApp;