// App functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('FamilyFinance App - Loading...');
    
    // Check if user is authenticated
    checkAuth();
    
    // Initialize app
    initApp();
});

// Storage management functions
function getCurrentStorageKey() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const currentFamily = JSON.parse(localStorage.getItem('currentFamily') || '{}');
    
    if (currentFamily.isFamilyLogin && currentFamily.id) {
        return `familyData_${currentFamily.id}`;
    } else if (currentUser.isDemo && currentUser.id) {
        return `demoData_${currentUser.id}`;
    } else if (currentUser.isLoggedIn && currentUser.id) {
        return `userData_${currentUser.id}`;
    }
    return null;
}

function getStorageData() {
    const storageKey = getCurrentStorageKey();
    if (!storageKey) return {};
    
    const data = localStorage.getItem(storageKey);
    if (!data) {
        console.log('No storage data found for key:', storageKey);
        return {};
    }
    
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error('Error parsing storage data:', e);
        return {};
    }
}

function saveStorageData(data) {
    const storageKey = getCurrentStorageKey();
    if (!storageKey) return;
    
    localStorage.setItem(storageKey, JSON.stringify(data));
}

function updateStorageData(key, value) {
    const storageData = getStorageData();
    storageData[key] = value;
    saveStorageData(storageData);
}

function getStorageItem(key, defaultValue = []) {
    const storageData = getStorageData();
    return storageData[key] || defaultValue;
}

function setStorageItem(key, value) {
    const storageData = getStorageData();
    storageData[key] = value;
    saveStorageData(storageData);
}

function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const currentFamily = localStorage.getItem('currentFamily');
    
    if (!currentUser && !currentFamily) {
        // No auth data, show auth section
        showAuthSection();
        return false;
    }
    
    // User is authenticated, show app
    showAppSection();
    return true;
}

function initApp() {
    console.log('Initializing app...');
    
    // Only bind events if user is authenticated
    if (checkAuth()) {
        bindAppEvents();
        loadDashboard();
        initializeDemoData();
        initMobileSidebar();
    } else {
        bindAuthEvents();
    }
}

function initMobileSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            sidebarToggle.classList.toggle('active');
        });
        
        // Close sidebar when clicking on links
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    sidebarToggle.classList.remove('active');
                }
            });
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                !sidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target) &&
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                sidebarToggle.classList.remove('active');
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('active');
                sidebarToggle.classList.remove('active');
            }
        });
    }
}

function initializeDemoData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const currentFamily = JSON.parse(localStorage.getItem('currentFamily') || '{}');
    
    // Only initialize default data if storage doesn't exist
    const storageKey = getCurrentStorageKey();
    const storageData = localStorage.getItem(storageKey);
    
    if (!storageData) {
        console.log('Initializing fresh data');
        
        if (currentFamily.isFamilyLogin) {
            // Initialize family data
            const familyStorage = {
                familyName: currentFamily.familyName || 'Семья',
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
            
            saveStorageData(familyStorage);
        } else if (currentUser.isDemo) {
            // Initialize demo data
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
            
            saveStorageData(demoStorage);
        } else {
            // Initialize user data
            const userStorage = {
                email: currentUser.email || '',
                fullName: currentUser.fullName || '',
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
            
            saveStorageData(userStorage);
        }
    }
}

function bindAuthEvents() {
    console.log('Binding auth events...');
    
    // Auth option buttons
    const personalAuthBtn = document.getElementById('personal-auth-btn');
    const familyAuthBtn = document.getElementById('family-auth-btn');
    const demoAuthBtn = document.getElementById('demo-auth-btn');
    
    if (personalAuthBtn) {
        personalAuthBtn.addEventListener('click', showPersonalAuthModal);
    }
    
    if (familyAuthBtn) {
        familyAuthBtn.addEventListener('click', showFamilyAuthModal);
    }
    
    if (demoAuthBtn) {
        demoAuthBtn.addEventListener('click', startDemoMode);
    }
    
    // Auth modal events
    bindAuthModalEvents();
}

function bindAuthModalEvents() {
    // Personal auth modal
    const personalLoginForm = document.getElementById('personal-login-form');
    const personalRegisterForm = document.getElementById('personal-register-form');
    const personalModalClose = document.querySelector('#personal-auth-modal .modal-close');
    
    if (personalLoginForm) personalLoginForm.addEventListener('submit', handlePersonalLogin);
    if (personalRegisterForm) personalRegisterForm.addEventListener('submit', handlePersonalRegister);
    if (personalModalClose) personalModalClose.addEventListener('click', closePersonalAuthModal);
    
    // Family auth modal
    const familyAuthForm = document.getElementById('family-auth-form');
    const createFamilyFromAuthBtn = document.getElementById('create-family-from-auth-btn');
    const familyModalClose = document.querySelector('#family-auth-modal .modal-close');
    
    if (familyAuthForm) familyAuthForm.addEventListener('submit', handleFamilyAuth);
    if (createFamilyFromAuthBtn) createFamilyFromAuthBtn.addEventListener('click', showCreateFamilyModal);
    if (familyModalClose) familyModalClose.addEventListener('click', closeFamilyAuthModal);
    
    // Create family modal
    const createFamilyForm = document.getElementById('create-family-form');
    const createFamilyModalClose = document.querySelector('#create-family-modal .modal-close');
    
    if (createFamilyForm) createFamilyForm.addEventListener('submit', handleCreateFamily);
    if (createFamilyModalClose) createFamilyModalClose.addEventListener('click', closeCreateFamilyModal);
    
    // Tab switching
    document.querySelectorAll('#personal-auth-modal .tab-btn').forEach(tab => {
        tab.addEventListener('click', function() {
            switchPersonalAuthTab(this.dataset.tab);
        });
    });
    
    // Close modals on outside click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
}

function bindAppEvents() {
    console.log('Binding app events...');
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            switchPage(this.dataset.page);
        });
    });
    
    // Modal buttons
    document.getElementById('add-transaction-btn')?.addEventListener('click', showTransactionModal);
    document.getElementById('add-transaction-page-btn')?.addEventListener('click', showTransactionModal);
    document.getElementById('add-account-btn')?.addEventListener('click', showAccountModal);
    document.getElementById('add-category-btn')?.addEventListener('click', showCategoryModal);
    document.getElementById('add-budget-btn')?.addEventListener('click', showBudgetModal);
    document.getElementById('add-goal-btn')?.addEventListener('click', showGoalModal);
    document.getElementById('add-member-btn')?.addEventListener('click', showMemberModal);
    document.getElementById('delete-account-btn')?.addEventListener('click', showDeleteAccountModal);
    
    // Form submissions
    document.getElementById('transaction-form')?.addEventListener('submit', handleTransactionSubmit);
    document.getElementById('account-form')?.addEventListener('submit', handleAccountSubmit);
    document.getElementById('category-form')?.addEventListener('submit', handleCategorySubmit);
    document.getElementById('budget-form')?.addEventListener('submit', handleBudgetSubmit);
    document.getElementById('goal-form')?.addEventListener('submit', handleGoalSubmit);
    document.getElementById('member-form')?.addEventListener('submit', handleMemberSubmit);
    document.getElementById('add-funds-form')?.addEventListener('submit', handleAddFundsSubmit);
    document.getElementById('confirm-delete-account')?.addEventListener('click', handleDeleteAccount);
    
    // Filter buttons
    document.getElementById('apply-filters')?.addEventListener('click', applyTransactionFilters);
    document.getElementById('clear-filters')?.addEventListener('click', clearTransactionFilters);
    
    // Other buttons
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    document.getElementById('switch-family-btn')?.addEventListener('click', handleSwitchFamily);
    
    // Modal close events
    document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    // Close modals on outside click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });
}

// Section management
function showAuthSection() {
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('app-section').classList.add('hidden');
}

function showAppSection() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('app-section').classList.remove('hidden');
    
    // Update user info
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const currentFamily = JSON.parse(localStorage.getItem('currentFamily') || '{}');
    
    const userName = currentUser.fullName || currentFamily.familyName || 'Пользователь';
    document.getElementById('user-name').textContent = userName;
    
    // Show family info if in family mode
    if (currentFamily.isFamilyLogin) {
        document.getElementById('family-info').classList.remove('hidden');
        document.getElementById('family-name-display').textContent = currentFamily.familyName;
        
        // Update family page
        document.getElementById('family-name-display-page').textContent = currentFamily.familyName;
        document.getElementById('family-info-card').classList.remove('hidden');
        document.getElementById('family-content').classList.remove('hidden');
    }
}

// Auth modals for app
function showPersonalAuthModal() {
    document.getElementById('personal-auth-modal').classList.add('active');
}

function showFamilyAuthModal() {
    document.getElementById('family-auth-modal').classList.add('active');
}

function showCreateFamilyModal() {
    document.getElementById('create-family-modal').classList.add('active');
}

function closePersonalAuthModal() {
    document.getElementById('personal-auth-modal').classList.remove('active');
}

function closeFamilyAuthModal() {
    document.getElementById('family-auth-modal').classList.remove('active');
}

function closeCreateFamilyModal() {
    document.getElementById('create-family-modal').classList.remove('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

function switchPersonalAuthTab(tabName) {
    // Update tabs
    document.querySelectorAll('#personal-auth-modal .tab-btn').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // Update forms
    document.querySelectorAll('#personal-auth-modal .auth-form').forEach(form => {
        form.classList.toggle('active', form.id === `personal-${tabName}-form`);
    });
}

function startDemoMode() {
    const demoId = `demo_${Date.now()}`;
    const demoData = {
        id: demoId,
        isDemo: true,
        fullName: 'Демо Пользователь',
        createdAt: new Date().toISOString()
    };
    localStorage.setItem('currentUser', JSON.stringify(demoData));
    
    // Всегда создаем новое хранилище для демо (данные обнуляются)
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
    
    showAppSection();
    bindAppEvents();
    loadDashboard();
    showAlert('Демо-режим активирован!', 'success');
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

// Auth form handlers
function handlePersonalLogin(e) {
    e.preventDefault();
    const email = document.getElementById('personal-login-email').value;
    const password = document.getElementById('personal-login-password').value;

    if (!email || !password) {
        showAlert('Пожалуйста, заполните все поля', 'error');
        return;
    }

    showLoading('Вход в систему...');
    
    setTimeout(() => {
        hideLoading();
        
        // Search for existing user by email
        let userId = null;
        let userData = null;
        
        // Search through all user data
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('userData_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data.email === email) {
                        userId = key.replace('userData_', '');
                        userData = data;
                        break;
                    }
                } catch (e) {
                    console.error('Error parsing user data:', e);
                }
            }
        }
        
        if (!userId) {
            // User not found, create new
            userId = `user_${Date.now()}`;
            userData = {
                id: userId,
                email: email,
                fullName: email.split('@')[0],
                isLoggedIn: true,
                createdAt: new Date().toISOString()
            };
            
            // Create new storage
            const newUserStorage = {
                email: email,
                fullName: email.split('@')[0],
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
            
            localStorage.setItem(`userData_${userId}`, JSON.stringify(newUserStorage));
        }
        
        // Save current user
        localStorage.setItem('currentUser', JSON.stringify({
            id: userId,
            email: email,
            fullName: userData.fullName || email.split('@')[0],
            isLoggedIn: true,
            createdAt: userData.createdAt || new Date().toISOString()
        }));
        
        closePersonalAuthModal();
        showAlert('Успешный вход!', 'success');
        showAppSection();
        bindAppEvents();
        loadDashboard();
    }, 1500);
}

function handlePersonalRegister(e) {
    e.preventDefault();
    const fullName = document.getElementById('personal-register-name').value;
    const email = document.getElementById('personal-register-email').value;
    const password = document.getElementById('personal-register-password').value;

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
        let userId = null;
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('userData_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data.email === email) {
                        userId = key.replace('userData_', '');
                        break;
                    }
                } catch (e) {
                    console.error('Error parsing user data:', e);
                }
            }
        }
        
        if (!userId) {
            // New user, create ID
            userId = `user_${Date.now()}`;
        }
        
        // Create or update user data
        const userData = {
            id: userId,
            email: email,
            fullName: fullName,
            isLoggedIn: true,
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Create or update storage
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
        
        closePersonalAuthModal();
        showAlert('Аккаунт успешно создан!', 'success');
        showAppSection();
        bindAppEvents();
        loadDashboard();
    }, 2000);
}

function handleFamilyAuth(e) {
    e.preventDefault();
    const familyName = document.getElementById('family-auth-name').value;
    const familyPassword = document.getElementById('family-auth-password').value;

    if (!familyName || !familyPassword) {
        showAlert('Пожалуйста, заполните все поля', 'error');
        return;
    }

    showLoading('Вход в семью...');
    
    setTimeout(() => {
        hideLoading();
        
        // Search for existing family
        let familyId = null;
        let familyData = null;
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('familyData_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data.familyName === familyName) {
                        familyId = key.replace('familyData_', '');
                        familyData = data;
                        break;
                    }
                } catch (e) {
                    console.error('Error parsing family data:', e);
                }
            }
        }
        
        if (!familyId) {
            // Family not found, create new
            familyId = `family_${Date.now()}`;
            familyData = {
                familyName: familyName,
                createdAt: new Date().toISOString()
            };
            
            // Create new storage
            const newFamilyStorage = {
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
            
            localStorage.setItem(`familyData_${familyId}`, JSON.stringify(newFamilyStorage));
        }
        
        // Save current family
        localStorage.setItem('currentFamily', JSON.stringify({
            id: familyId,
            familyName: familyName,
            isFamilyLogin: true,
            createdAt: familyData.createdAt || new Date().toISOString()
        }));
        
        closeFamilyAuthModal();
        showAlert(`Добро пожаловать в семью "${familyName}"!`, 'success');
        showAppSection();
        bindAppEvents();
        loadDashboard();
    }, 1500);
}

function handleCreateFamily(e) {
    e.preventDefault();
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
        let familyId = null;
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('familyData_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data.familyName === familyName) {
                        familyId = key.replace('familyData_', '');
                        break;
                    }
                } catch (e) {
                    console.error('Error parsing family data:', e);
                }
            }
        }
        
        if (!familyId) {
            familyId = `family_${Date.now()}`;
        }
        
        const familyData = {
            id: familyId,
            familyName: familyName,
            isFamilyLogin: true,
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('currentFamily', JSON.stringify(familyData));
        
        // Create or update storage
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
        
        closeCreateFamilyModal();
        showAlert(`Семья "${familyName}" успешно создана!`, 'success');
        showAppSection();
        bindAppEvents();
        loadDashboard();
    }, 1500);
}

// Page navigation
function switchPage(pageName) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');
    document.getElementById(`${pageName}-page`).classList.add('active');

    switch(pageName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'transactions':
            loadTransactions();
            break;
        case 'accounts':
            loadAccounts();
            break;
        case 'categories':
            loadCategories();
            break;
        case 'budgets':
            loadBudgets();
            break;
        case 'goals':
            loadGoals();
            break;
        case 'family':
            loadFamily();
            break;
    }
}

// Data loading functions
function loadDashboard() {
    console.log('Loading dashboard...');
    
    // Always show stats and charts
    document.getElementById('dashboard-stats').classList.remove('hidden');
    document.getElementById('dashboard-charts').classList.remove('hidden');
    
    // Calculate stats
    updateDashboardStats();
    
    // Load recent transactions
    loadRecentTransactions();
    
    // Load expense chart
    loadExpenseCategories();
}

function loadTransactions() {
    console.log('Loading transactions...');
    const transactions = getStorageItem('transactions');
    renderTransactionsTable(transactions);
}

function loadAccounts() {
    console.log('Loading accounts...');
    const accounts = getStorageItem('accounts');
    renderAccountsGrid(accounts);
}

function loadCategories() {
    console.log('Loading categories...');
    const categories = getStorageItem('categories');
    renderCategories(categories);
}

function loadBudgets() {
    console.log('Loading budgets...');
    const budgets = getStorageItem('budgets');
    renderBudgets(budgets);
}

function loadGoals() {
    console.log('Loading goals...');
    const goals = getStorageItem('goals');
    renderGoals(goals);
}

function loadFamily() {
    console.log('Loading family...');
    const currentFamily = JSON.parse(localStorage.getItem('currentFamily') || '{}');
    const familyMembers = getStorageItem('familyMembers');
    
    if (!currentFamily.isFamilyLogin) {
        document.getElementById('family-info-card').classList.add('hidden');
        document.getElementById('family-content').classList.add('hidden');
    } else {
        document.getElementById('family-info-card').classList.remove('hidden');
        document.getElementById('family-content').classList.remove('hidden');
        
        // Update family stats
        document.getElementById('family-members-count').textContent = familyMembers.length + 1; // +1 for current user
        
        // Calculate total budget
        const budgets = getStorageItem('budgets');
        const totalBudget = budgets.reduce((sum, budget) => sum + parseFloat(budget.amount), 0);
        document.getElementById('family-total-budget').textContent = formatCurrency(totalBudget);
        
        // Count active goals
        const goals = getStorageItem('goals');
        document.getElementById('family-active-goals').textContent = goals.length;
        
        // Render family members
        renderFamilyMembers(familyMembers);
    }
}

// Render functions
function updateDashboardStats() {
    const transactions = getStorageItem('transactions');
    
    let totalIncome = 0;
    let totalExpense = 0;
    
    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            totalIncome += parseFloat(transaction.amount);
        } else {
            totalExpense += parseFloat(transaction.amount);
        }
    });
    
    const totalBalance = totalIncome - totalExpense;
    
    document.getElementById('total-income').textContent = formatCurrency(totalIncome);
    document.getElementById('total-expense').textContent = formatCurrency(totalExpense);
    document.getElementById('total-balance').textContent = formatCurrency(totalBalance);
    
    // Update balance color
    const balanceElement = document.getElementById('total-balance');
    if (totalBalance < 0) {
        balanceElement.style.color = '#EF4444';
    } else {
        balanceElement.style.color = '#10B981';
    }
}

function loadRecentTransactions() {
    const transactions = getStorageItem('transactions');
    const recentTransactions = transactions.slice(-5).reverse(); // Last 5 transactions
    
    const container = document.getElementById('recent-transactions');
    container.innerHTML = '';
    
    if (recentTransactions.length === 0) {
        container.innerHTML = '<div class="no-data">Нет транзакций</div>';
        return;
    }
    
    recentTransactions.forEach(transaction => {
        const transactionElement = document.createElement('div');
        transactionElement.className = 'recent-transaction';
        transactionElement.innerHTML = `
            <div class="transaction-icon ${transaction.type}">
                ${transaction.type === 'income' ? '⬇️' : '⬆️'}
            </div>
            <div class="transaction-info">
                <div class="transaction-category">${transaction.category}</div>
                <div class="transaction-description">${transaction.description || 'Без описания'}</div>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
            </div>
        `;
        container.appendChild(transactionElement);
    });
}

function loadExpenseCategories() {
    const transactions = getStorageItem('transactions');
    const categories = getStorageItem('categories');
    const expenseCategories = categories.filter(cat => cat.type === 'expense');
    
    const categoryTotals = {};
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    expenseTransactions.forEach(transaction => {
        if (!categoryTotals[transaction.category]) {
            categoryTotals[transaction.category] = 0;
        }
        categoryTotals[transaction.category] += parseFloat(transaction.amount);
    });
    
    const container = document.getElementById('expense-categories-grid');
    container.innerHTML = '';
    
    if (expenseCategories.length === 0) {
        container.innerHTML = '<div class="no-data">Нет категорий расходов</div>';
        return;
    }
    
    expenseCategories.forEach(category => {
        const total = categoryTotals[category.name] || 0;
        const card = document.createElement('div');
        card.className = 'expense-category-card';
        card.innerHTML = `
            <div class="category-icon" style="color: ${category.color};">${category.icon}</div>
            <div class="category-info">
                <div class="category-name">${category.name}</div>
                <div class="category-amount">${formatCurrency(total)}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderTransactionsTable(transactions) {
    const tbody = document.getElementById('transactions-table-body');
    tbody.innerHTML = '';
    
    if (transactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">Нет транзакций</td>
            </tr>
        `;
        return;
    }
    
    transactions.forEach((transaction, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td>
                <span class="transaction-type-badge ${transaction.type}">
                    ${transaction.type === 'income' ? 'Доход' : 'Расход'}
                </span>
            </td>
            <td>${transaction.category}</td>
            <td>${transaction.description || '-'}</td>
            <td>${transaction.account}</td>
            <td class="${transaction.type === 'income' ? 'transaction-income' : 'transaction-expense'}">
                ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
            </td>
            <td>
                <button class="btn-icon delete" onclick="deleteTransaction(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderAccountsGrid(accounts) {
    const grid = document.getElementById('accounts-grid');
    grid.innerHTML = '';
    
    if (accounts.length === 0) {
        grid.innerHTML = '<div class="no-data">Нет счетов</div>';
        return;
    }
    
    accounts.forEach((account, index) => {
        const card = document.createElement('div');
        card.className = 'account-card';
        card.innerHTML = `
            <div class="account-header">
                <div class="account-info">
                    <div class="account-icon" style="background-color: ${account.color}20; color: ${account.color};">
                        <i class="fas fa-wallet"></i>
                    </div>
                    <div>
                        <div class="account-name">${account.name}</div>
                        <div class="account-type">${getAccountTypeName(account.type)}</div>
                    </div>
                </div>
            </div>
            <div class="account-balance ${parseFloat(account.balance) < 0 ? 'negative' : ''}">
                ${formatCurrency(account.balance)}
            </div>
            <div class="account-footer">
                <div class="account-stats">
                    <span>Последняя операция: ${getLastTransactionDate(account.name)}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderCategories(categories) {
    const incomeContainer = document.getElementById('income-categories');
    const expenseContainer = document.getElementById('expense-categories');
    
    incomeContainer.innerHTML = '';
    expenseContainer.innerHTML = '';
    
    if (categories.length === 0) {
        incomeContainer.innerHTML = '<div class="no-data">Нет категорий доходов</div>';
        expenseContainer.innerHTML = '<div class="no-data">Нет категорий расходов</div>';
        return;
    }
    
    const incomeCategories = categories.filter(cat => cat.type === 'income');
    const expenseCategories = categories.filter(cat => cat.type === 'expense');
    
    if (incomeCategories.length === 0) {
        incomeContainer.innerHTML = '<div class="no-data">Нет категорий доходов</div>';
    } else {
        incomeCategories.forEach((category, index) => {
            incomeContainer.appendChild(createCategoryCard(category, index));
        });
    }
    
    if (expenseCategories.length === 0) {
        expenseContainer.innerHTML = '<div class="no-data">Нет категорий расходов</div>';
    } else {
        expenseCategories.forEach((category, index) => {
            // Adjust index for expense categories
            const globalIndex = categories.findIndex(cat => 
                cat.name === category.name && cat.type === category.type
            );
            expenseContainer.appendChild(createCategoryCard(category, globalIndex));
        });
    }
}

function createCategoryCard(category, index) {
    const card = document.createElement('div');
    card.className = `category-card ${category.type}`;
    card.innerHTML = `
        <div class="category-header">
            <div class="category-icon" style="color: ${category.color};">${category.icon}</div>
            <div class="category-info">
                <div class="category-name">${category.name}</div>
                <div class="category-type">${category.type === 'income' ? 'Доход' : 'Расход'}</div>
            </div>
        </div>
        <div class="action-buttons">
            <button class="btn-icon delete" onclick="deleteCategory(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    return card;
}

function renderBudgets(budgets) {
    const grid = document.getElementById('budgets-grid');
    grid.innerHTML = '';
    
    if (budgets.length === 0) {
        grid.innerHTML = '<div class="no-data">Нет бюджетов</div>';
        return;
    }
    
    budgets.forEach((budget, index) => {
        const card = document.createElement('div');
        card.className = 'budget-card';
        
        // Calculate spent amount
        const transactions = getStorageItem('transactions');
        const spent = transactions
            .filter(t => t.category === budget.category && t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
        const percentage = (spent / budget.amount) * 100;
        const isOverBudget = percentage > 100;
        
        card.innerHTML = `
            <div class="budget-header">
                <h4>${budget.category}</h4>
                <span class="budget-period">${budget.period}</span>
            </div>
            <div class="budget-amounts">
                <div class="budget-amount">
                    <span>Бюджет:</span>
                    <strong>${formatCurrency(budget.amount)}</strong>
                </div>
                <div class="budget-spent ${isOverBudget ? 'over-budget' : ''}">
                    <span>Потрачено:</span>
                    <strong>${formatCurrency(spent)}</strong>
                </div>
            </div>
            <div class="budget-progress">
                <div class="progress-bar">
                    <div class="progress-fill ${isOverBudget ? 'over-budget' : ''}" 
                         style="width: ${Math.min(percentage, 100)}%"></div>
                </div>
                <span class="progress-text">${percentage.toFixed(1)}%</span>
            </div>
            <div class="action-buttons">
                <button class="btn-icon delete" onclick="deleteBudget(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderGoals(goals) {
    const grid = document.getElementById('goals-grid');
    grid.innerHTML = '';
    
    if (goals.length === 0) {
        grid.innerHTML = '<div class="no-data">Нет целей</div>';
        return;
    }
    
    goals.forEach((goal, index) => {
        const card = document.createElement('div');
        card.className = 'goal-card';
        
        const percentage = (goal.currentAmount / goal.targetAmount) * 100;
        const daysLeft = goal.deadline ? 
            Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;
        
        card.innerHTML = `
            <div class="goal-header">
                <h4>${goal.name}</h4>
                ${goal.deadline ? `<span class="goal-deadline ${daysLeft < 0 ? 'overdue' : ''}">
                    ${daysLeft < 0 ? 'Просрочено' : `Осталось ${daysLeft} дней`}
                </span>` : ''}
            </div>
            <div class="goal-description">${goal.description || 'Без описания'}</div>
            <div class="goal-amounts">
                <div class="goal-current">${formatCurrency(goal.currentAmount)}</div>
                <div class="goal-target">из ${formatCurrency(goal.targetAmount)}</div>
            </div>
            <div class="goal-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%"></div>
                </div>
                <span class="progress-text">${percentage.toFixed(1)}%</span>
            </div>
            <div class="goal-actions">
                <button class="btn btn-primary btn-sm" onclick="showAddFundsModal(${index})">
                    <i class="fas fa-plus"></i>
                    Пополнить
                </button>
                <button class="btn-icon delete" onclick="deleteGoal(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderFamilyMembers(members) {
    const grid = document.getElementById('family-members-grid');
    grid.innerHTML = '';
    
    if (members.length === 0) {
        grid.innerHTML = '<div class="no-data">Нет участников</div>';
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const currentFamily = JSON.parse(localStorage.getItem('currentFamily') || '{}');
    
    // Add current user as admin
    const currentUserCard = document.createElement('div');
    currentUserCard.className = 'member-card';
    currentUserCard.innerHTML = `
        <div class="member-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="member-info">
            <h4>${currentUser.fullName || 'Вы'}</h4>
            <span class="member-email">${currentUser.email || 'Текущий пользователь'}</span>
            <span class="member-role admin">Администратор</span>
        </div>
    `;
    grid.appendChild(currentUserCard);
    
    members.forEach((member, index) => {
        const card = document.createElement('div');
        card.className = 'member-card';
        card.innerHTML = `
            <div class="member-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="member-info">
                <h4>${member.name}</h4>
                <span class="member-email">${member.email}</span>
                <span class="member-role ${member.role}">${member.role === 'admin' ? 'Администратор' : 'Участник'}</span>
            </div>
            <div class="member-actions">
                ${currentUser.isAdmin || currentFamily.isAdmin ? `<button class="btn-icon delete" onclick="deleteFamilyMember(${index})">
                    <i class="fas fa-trash"></i>
                </button>` : ''}
            </div>
        `;
        grid.appendChild(card);
    });
}

// Modal functions
function showTransactionModal() {
    // Load categories and accounts for dropdowns
    loadCategoriesForTransaction();
    loadAccountsForTransaction();
    
    // Set today's date as default
    document.getElementById('date').valueAsDate = new Date();
    
    document.getElementById('transaction-modal').classList.add('active');
}

function showAccountModal() {
    document.getElementById('account-modal').classList.add('active');
}

function showCategoryModal() {
    document.getElementById('category-modal').classList.add('active');
}

function showBudgetModal() {
    // Load expense categories for budget
    const categories = getStorageItem('categories');
    const expenseCategories = categories.filter(cat => cat.type === 'expense');
    
    const categorySelect = document.getElementById('budget-category');
    categorySelect.innerHTML = '<option value="">Выберите категорию расходов</option>';
    
    expenseCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
    
    // Set current month as default
    const now = new Date();
    document.getElementById('budget-period').value = now.toISOString().slice(0, 7);
    
    document.getElementById('budget-modal').classList.add('active');
}

function showGoalModal() {
    document.getElementById('goal-modal').classList.add('active');
}

function showMemberModal() {
    document.getElementById('member-modal').classList.add('active');
}

function showAddFundsModal(goalIndex) {
    const goals = getStorageItem('goals');
    const goal = goals[goalIndex];
    
    if (!goal) return;
    
    // Store current goal index for form submission
    document.getElementById('add-funds-form').dataset.goalIndex = goalIndex;
    
    // Load accounts for dropdown
    const accounts = getStorageItem('accounts');
    const accountSelect = document.getElementById('funds-account');
    accountSelect.innerHTML = '<option value="">Выберите счет</option>';
    
    accounts.forEach(account => {
        const option = document.createElement('option');
        option.value = account.name;
        option.textContent = account.name;
        option.dataset.balance = account.balance;
        accountSelect.appendChild(option);
    });
    
    document.getElementById('add-funds-modal').classList.add('active');
}

function showDeleteAccountModal() {
    document.getElementById('delete-account-modal').classList.add('active');
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Form handlers
function handleTransactionSubmit(e) {
    e.preventDefault();
    
    const transaction = {
        type: document.querySelector('input[name="type"]:checked').value,
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        account: document.getElementById('account').value,
        description: document.getElementById('description').value,
        date: document.getElementById('date').value
    };
    
    // Save transaction
    const transactions = getStorageItem('transactions');
    transactions.push(transaction);
    setStorageItem('transactions', transactions);
    
    // Update account balance
    updateAccountBalance(transaction.account, transaction.type, transaction.amount);
    
    showAlert('Транзакция успешно добавлена!', 'success');
    closeModals();
    
    // Reload current page
    const activePage = document.querySelector('.page.active').id.replace('-page', '');
    switchPage(activePage);
}

function handleAccountSubmit(e) {
    e.preventDefault();
    
    const account = {
        name: document.getElementById('account-name').value,
        type: document.getElementById('account-type').value,
        balance: parseFloat(document.getElementById('account-balance').value) || 0,
        color: document.getElementById('account-color').value
    };
    
    // Save account
    const accounts = getStorageItem('accounts');
    accounts.push(account);
    setStorageItem('accounts', accounts);
    
    showAlert('Счет успешно создан!', 'success');
    closeModals();
    loadAccounts();
}

function handleCategorySubmit(e) {
    e.preventDefault();
    
    const category = {
        name: document.getElementById('category-name').value,
        type: document.getElementById('category-type').value,
        icon: document.getElementById('category-icon').value,
        color: document.getElementById('category-color').value
    };
    
    // Save category
    const categories = getStorageItem('categories');
    categories.push(category);
    setStorageItem('categories', categories);
    
    showAlert('Категория успешно создана!', 'success');
    closeModals();
    loadCategories();
}

function handleBudgetSubmit(e) {
    e.preventDefault();
    
    const budget = {
        category: document.getElementById('budget-category').value,
        amount: parseFloat(document.getElementById('budget-amount').value),
        period: document.getElementById('budget-period').value
    };
    
    // Save budget
    const budgets = getStorageItem('budgets');
    budgets.push(budget);
    setStorageItem('budgets', budgets);
    
    showAlert('Бюджет создан!', 'success');
    closeModals();
    loadBudgets();
}

function handleGoalSubmit(e) {
    e.preventDefault();
    
    const goal = {
        name: document.getElementById('goal-name').value,
        targetAmount: parseFloat(document.getElementById('goal-amount').value),
        currentAmount: 0,
        deadline: document.getElementById('goal-deadline').value,
        description: document.getElementById('goal-description').value
    };
    
    // Save goal
    const goals = getStorageItem('goals');
    goals.push(goal);
    setStorageItem('goals', goals);
    
    showAlert('Цель создана!', 'success');
    closeModals();
    loadGoals();
}

function handleMemberSubmit(e) {
    e.preventDefault();
    
    const member = {
        name: document.getElementById('member-name').value,
        email: document.getElementById('member-email').value,
        role: document.getElementById('member-role').value
    };
    
    // Save member
    const members = getStorageItem('familyMembers');
    members.push(member);
    setStorageItem('familyMembers', members);
    
    showAlert('Участник добавлен!', 'success');
    closeModals();
    loadFamily();
}

function handleAddFundsSubmit(e) {
    e.preventDefault();
    
    const goalIndex = parseInt(e.target.dataset.goalIndex);
    const amount = parseFloat(document.getElementById('funds-amount').value);
    const account = document.getElementById('funds-account').value;
    const description = document.getElementById('funds-description').value;
    
    if (!amount || !account) {
        showAlert('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    // Check if account has sufficient balance
    const accounts = getStorageItem('accounts');
    const selectedAccount = accounts.find(acc => acc.name === account);
    
    if (!selectedAccount || parseFloat(selectedAccount.balance) < amount) {
        showAlert('Недостаточно средств на выбранном счете', 'error');
        return;
    }
    
    // Update goal
    const goals = getStorageItem('goals');
    const goal = goals[goalIndex];
    
    if (!goal) {
        showAlert('Цель не найдена', 'error');
        return;
    }
    
    goal.currentAmount += amount;
    
    // Check if goal is completed
    if (goal.currentAmount >= goal.targetAmount) {
        goal.currentAmount = goal.targetAmount;
        showAlert(`Поздравляем! Цель "${goal.name}" достигнута! 🎉`, 'success');
    }
    
    // Update account balance
    updateAccountBalance(account, 'expense', amount);
    
    // Add transaction record
    const transaction = {
        type: 'expense',
        amount: amount,
        category: 'Накопления',
        account: account,
        description: description || `Пополнение цели: ${goal.name}`,
        date: new Date().toISOString().split('T')[0]
    };
    
    const transactions = getStorageItem('transactions');
    transactions.push(transaction);
    setStorageItem('transactions', transactions);
    
    // Update goals
    goals[goalIndex] = goal;
    setStorageItem('goals', goals);
    
    showAlert('Цель успешно пополнена!', 'success');
    closeModals();
    loadGoals();
}

function handleDeleteAccount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const currentFamily = JSON.parse(localStorage.getItem('currentFamily') || '{}');
    
    if (confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить. Все ваши данные будут безвозвратно удалены.')) {
        // Clear all user data
        if (currentFamily.isFamilyLogin) {
            localStorage.removeItem(`familyData_${currentFamily.id}`);
            localStorage.removeItem('currentFamilyId');
            localStorage.removeItem('currentFamily');
        } else if (currentUser.isDemo) {
            localStorage.removeItem(`demoData_${currentUser.id}`);
            localStorage.removeItem('currentDemoId');
            localStorage.removeItem('currentUser');
        } else {
            localStorage.removeItem(`userData_${currentUser.id}`);
            localStorage.removeItem('currentUserId');
            localStorage.removeItem('currentUser');
        }
        
        showAlert('Аккаунт успешно удален', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Filter functions
function applyTransactionFilters() {
    const typeFilter = document.getElementById('type-filter').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    let transactions = getStorageItem('transactions');
    
    // Apply type filter
    if (typeFilter !== 'all') {
        transactions = transactions.filter(t => t.type === typeFilter);
    }
    
    // Apply date filter
    if (startDate) {
        transactions = transactions.filter(t => t.date >= startDate);
    }
    
    if (endDate) {
        transactions = transactions.filter(t => t.date <= endDate);
    }
    
    renderTransactionsTable(transactions);
}

function clearTransactionFilters() {
    document.getElementById('type-filter').value = 'all';
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    
    const transactions = getStorageItem('transactions');
    renderTransactionsTable(transactions);
}

// Utility functions
function loadCategoriesForTransaction() {
    const categories = getStorageItem('categories');
    const categorySelect = document.getElementById('category');
    
    categorySelect.innerHTML = '<option value="">Выберите категорию</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = `${category.icon} ${category.name}`;
        categorySelect.appendChild(option);
    });
}

function loadAccountsForTransaction() {
    const accounts = getStorageItem('accounts');
    const accountSelect = document.getElementById('account');
    
    accountSelect.innerHTML = '<option value="">Выберите счет</option>';
    
    accounts.forEach(account => {
        const option = document.createElement('option');
        option.value = account.name;
        option.textContent = account.name;
        option.dataset.balance = account.balance;
        accountSelect.appendChild(option);
    });
}

function updateAccountBalance(accountName, type, amount) {
    const accounts = getStorageItem('accounts');
    const accountIndex = accounts.findIndex(acc => acc.name === accountName);
    
    if (accountIndex !== -1) {
        if (type === 'income') {
            accounts[accountIndex].balance = parseFloat(accounts[accountIndex].balance) + amount;
        } else {
            accounts[accountIndex].balance = parseFloat(accounts[accountIndex].balance) - amount;
        }
        setStorageItem('accounts', accounts);
    }
}

function getAccountTypeName(type) {
    const types = {
        'cash': 'Наличные',
        'bank': 'Банковский счет',
        'credit': 'Кредитная карта',
        'savings': 'Накопительный',
        'investment': 'Инвестиционный'
    };
    return types[type] || type;
}

function getLastTransactionDate(accountName) {
    const transactions = getStorageItem('transactions');
    const accountTransactions = transactions.filter(t => t.account === accountName);
    
    if (accountTransactions.length === 0) {
        return 'Нет операций';
    }
    
    const lastTransaction = accountTransactions[accountTransactions.length - 1];
    return formatDate(lastTransaction.date);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('ru-RU');
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

function handleLogout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentFamily');
    window.location.href = 'index.html';
}

function handleSwitchFamily() {
    localStorage.removeItem('currentFamily');
    showAuthSection();
    bindAuthEvents();
}

// Delete functions
function deleteTransaction(index) {
    if (confirm('Вы уверены, что хотите удалить эту транзакцию?')) {
        const transactions = getStorageItem('transactions');
        
        // Update account balance before deleting
        const transaction = transactions[index];
        updateAccountBalance(transaction.account, transaction.type, -parseFloat(transaction.amount));
        
        transactions.splice(index, 1);
        setStorageItem('transactions', transactions);
        showAlert('Транзакция удалена', 'success');
        loadTransactions();
    }
}

function deleteAccount(index) {
    if (confirm('Вы уверены, что хотите удалить этот счет?')) {
        const accounts = getStorageItem('accounts');
        accounts.splice(index, 1);
        setStorageItem('accounts', accounts);
        showAlert('Счет удален', 'success');
        loadAccounts();
    }
}

function deleteCategory(index) {
    if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
        const categories = getStorageItem('categories');
        categories.splice(index, 1);
        setStorageItem('categories', categories);
        showAlert('Категория удалена', 'success');
        loadCategories();
    }
}

function deleteBudget(index) {
    if (confirm('Вы уверены, что хотите удалить этот бюджет?')) {
        const budgets = getStorageItem('budgets');
        budgets.splice(index, 1);
        setStorageItem('budgets', budgets);
        showAlert('Бюджет удален', 'success');
        loadBudgets();
    }
}

function deleteGoal(index) {
    if (confirm('Вы уверены, что хотите удалить эту цель?')) {
        const goals = getStorageItem('goals');
        goals.splice(index, 1);
        setStorageItem('goals', goals);
        showAlert('Цель удалена', 'success');
        loadGoals();
    }
}

function deleteFamilyMember(index) {
    if (confirm('Вы уверены, что хотите удалить этого участника?')) {
        const members = getStorageItem('familyMembers');
        members.splice(index, 1);
        setStorageItem('familyMembers', members);
        showAlert('Участник удален', 'success');
        loadFamily();
    }
}

// Make functions globally available
window.app = {
    showPersonalAuthModal,
    showFamilyAuthModal,
    startDemoMode,
    closeModals,
    showTransactionModal,
    showAccountModal,
    showCategoryModal,
    showBudgetModal,
    showGoalModal,
    showMemberModal,
    showCreateFamilyModal,
    showFamilyLoginModal: showFamilyAuthModal,
    showAddFundsModal,
    showDeleteAccountModal,
    deleteTransaction,
    deleteAccount,
    deleteCategory,
    deleteBudget,
    deleteGoal,
    deleteFamilyMember
};