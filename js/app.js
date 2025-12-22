document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Управление хранилищем
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
    if (!data) return {};
    
    try {
        return JSON.parse(data);
    } catch (e) {
        return {};
    }
}

function saveStorageData(data) {
    const storageKey = getCurrentStorageKey();
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(data));
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

// Инициализация приложения
let currentDeleteCallback = null;

function initApp() {
    if (!checkAuth()) {
        return;
    }
    
    bindAppEvents();
    loadDashboard();
    initMobileSidebar();
    updateUserInfo();
}

function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const currentFamily = localStorage.getItem('currentFamily');
    
    if (!currentUser && !currentFamily) {
        showAuthSection();
        return false;
    }
    
    // Проверяем, если это демо, убеждаемся что данные существуют
    const userData = JSON.parse(currentUser || '{}');
    if (userData.isDemo) {
        const demoKey = `demoData_${userData.id}`;
        if (!localStorage.getItem(demoKey)) {
            // Создаем чистые демо-данные
            const demoStorage = {
                isDemo: true,
                fullName: 'Демо Пользователь',
                email: 'demo@example.com',
                transactions: [
                    {
                        id: `trans_${Date.now()}_1`,
                        type: 'income',
                        amount: 50000,
                        category: 'Зарплата',
                        account: 'Основной счет',
                        description: 'Зарплата за декабрь',
                        date: new Date().toISOString().split('T')[0]
                    },
                    {
                        id: `trans_${Date.now()}_2`,
                        type: 'expense',
                        amount: 3500,
                        category: 'Продукты',
                        account: 'Основной счет',
                        description: 'Покупка продуктов',
                        date: new Date().toISOString().split('T')[0]
                    }
                ],
                accounts: [
                    { id: `acc_${Date.now()}_1`, name: 'Наличные', type: 'cash', balance: 10000, color: '#10B981' },
                    { id: `acc_${Date.now()}_2`, name: 'Основной счет', type: 'bank', balance: 46500, color: '#3B82F6' },
                    { id: `acc_${Date.now()}_3`, name: 'Кредитная карта', type: 'credit', balance: -15000, color: '#EF4444' }
                ],
                categories: [
                    { id: `cat_${Date.now()}_1`, name: 'Зарплата', type: 'income', icon: '💰', color: '#10B981' },
                    { id: `cat_${Date.now()}_2`, name: 'Бизнес', type: 'income', icon: '💼', color: '#059669' },
                    { id: `cat_${Date.now()}_3`, name: 'Продукты', type: 'expense', icon: '🛒', color: '#EF4444' },
                    { id: `cat_${Date.now()}_4`, name: 'Транспорт', type: 'expense', icon: '🚗', color: '#DC2626' },
                    { id: `cat_${Date.now()}_5`, name: 'Развлечения', type: 'expense', icon: '🎮', color: '#F59E0B' },
                    { id: `cat_${Date.now()}_6`, name: 'Образование', type: 'expense', icon: '🎓', color: '#8B5CF6' }
                ],
                budgets: [
                    { id: `budget_${Date.now()}_1`, category: 'Продукты', amount: 10000, period: new Date().toISOString().slice(0, 7) }
                ],
                goals: [
                    { 
                        id: `goal_${Date.now()}_1`, 
                        name: 'Новый автомобиль', 
                        targetAmount: 500000, 
                        currentAmount: 150000,
                        deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
                        description: 'Накопить на новый автомобиль'
                    }
                ],
                familyMembers: [],
                settings: { currency: 'RUB', theme: 'light' },
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            
            localStorage.setItem(demoKey, JSON.stringify(demoStorage));
        }
    }
    
    showAppSection();
    return true;
}

function updateUserInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const currentFamily = JSON.parse(localStorage.getItem('currentFamily') || '{}');
    const userName = currentUser.fullName || currentFamily.familyName || 'Пользователь';
    document.getElementById('user-name').textContent = userName;
    
    if (currentFamily.isFamilyLogin) {
        document.getElementById('family-info').classList.remove('hidden');
        document.getElementById('family-name-display').textContent = currentFamily.familyName;
        document.getElementById('family-name-display-page').textContent = currentFamily.familyName;
        document.getElementById('family-info-card').classList.remove('hidden');
        document.getElementById('family-content').classList.remove('hidden');
    } else {
        document.getElementById('family-info').classList.add('hidden');
        document.getElementById('family-info-card').classList.add('hidden');
        document.getElementById('family-content').classList.add('hidden');
    }
}

// Мобильное меню
function initMobileSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            sidebarToggle.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    sidebarToggle.classList.remove('active');
                }
            });
        });
        
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                !sidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target) &&
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                sidebarToggle.classList.remove('active');
            }
        });
        
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('active');
                sidebarToggle.classList.remove('active');
            }
        });
    }
}

// Аутентификация
function showAuthSection() {
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('app-section').classList.add('hidden');
    bindAuthEvents();
}

function showAppSection() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('app-section').classList.remove('hidden');
    updateUserInfo();
}

function bindAuthEvents() {
    document.getElementById('personal-auth-btn')?.addEventListener('click', showPersonalAuthModal);
    document.getElementById('family-auth-btn')?.addEventListener('click', showFamilyAuthModal);
    document.getElementById('demo-auth-btn')?.addEventListener('click', startDemoMode);
    
    bindAuthModalEvents();
}

function bindAuthModalEvents() {
    // Закрытие модальных окон
    document.getElementById('personal-auth-close-btn')?.addEventListener('click', closePersonalAuthModal);
    document.getElementById('family-auth-close-btn')?.addEventListener('click', closeFamilyAuthModal);
    document.getElementById('create-family-auth-close-btn')?.addEventListener('click', closeCreateFamilyAuthModal);
    
    // Переключение вкладок
    document.querySelectorAll('#personal-auth-modal .tab-btn').forEach(tab => {
        tab.addEventListener('click', function() {
            switchPersonalAuthTab(this.dataset.tab);
        });
    });
    
    // Формы
    document.getElementById('personal-login-form')?.addEventListener('submit', handlePersonalLogin);
    document.getElementById('personal-register-form')?.addEventListener('submit', handlePersonalRegister);
    document.getElementById('family-auth-form')?.addEventListener('submit', handleFamilyAuth);
    document.getElementById('create-family-from-auth-btn')?.addEventListener('click', showCreateFamilyAuthModal);
    document.getElementById('create-family-auth-form')?.addEventListener('submit', handleCreateFamilyAuth);
    
    // Закрытие по клику вне модального окна
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) closeAllModals();
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeAllModals();
    });
}

// Модальные окна аутентификации
function showPersonalAuthModal() {
    closeAllModals();
    document.getElementById('personal-auth-modal').classList.add('active');
}

function showFamilyAuthModal() {
    closeAllModals();
    document.getElementById('family-auth-modal').classList.add('active');
}

function showCreateFamilyAuthModal() {
    closeAllModals();
    document.getElementById('create-family-auth-modal').classList.add('active');
}

function closePersonalAuthModal() {
    document.getElementById('personal-auth-modal').classList.remove('active');
}

function closeFamilyAuthModal() {
    document.getElementById('family-auth-modal').classList.remove('active');
}

function closeCreateFamilyAuthModal() {
    document.getElementById('create-family-auth-modal').classList.remove('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
}

function switchPersonalAuthTab(tabName) {
    document.querySelectorAll('#personal-auth-modal .tab-btn').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    document.querySelectorAll('#personal-auth-modal .auth-form').forEach(form => {
        form.classList.toggle('active', form.id === `personal-${tabName}-form`);
    });
}

// Проверка существования пользователя по email
function isUserExistsInApp(email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(user => user.email === email);
}

// Проверка существования семьи по названию
function isFamilyExistsInApp(familyName) {
    const families = JSON.parse(localStorage.getItem('families') || '[]');
    return families.some(family => family.name === familyName);
}

// Обработчики аутентификации
async function handlePersonalLogin(e) {
    e.preventDefault();
    const email = document.getElementById('personal-login-email').value.trim().toLowerCase();
    const password = document.getElementById('personal-login-password').value;

    if (!email || !password) {
        showAlert('Пожалуйста, заполните все поля', 'error');
        return;
    }

    showLoading('Вход в систему...');
    
    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email);
        
        if (!user) {
            hideLoading();
            showAlert('Пользователь с таким email не найден', 'error');
            return;
        }
        
        if (user.password !== password) {
            hideLoading();
            showAlert('Неверный пароль', 'error');
            return;
        }
        
        const userSessionData = {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            isLoggedIn: true,
            createdAt: user.createdAt
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userSessionData));
        
        // Удаляем текущую семью, если есть
        localStorage.removeItem('currentFamily');
        
        closePersonalAuthModal();
        hideLoading();
        showAlert('Успешный вход!', 'success');
        showAppSection();
        bindAppEvents();
        loadDashboard();
    }, 1500);
}

async function handlePersonalRegister(e) {
    e.preventDefault();
    const fullName = document.getElementById('personal-register-name').value.trim();
    const email = document.getElementById('personal-register-email').value.trim().toLowerCase();
    const password = document.getElementById('personal-register-password').value;

    if (!fullName || !email || !password) {
        showAlert('Пожалуйста, заполните все поля', 'error');
        return;
    }

    if (password.length < 6) {
        showAlert('Пароль должен содержать не менее 6 символов', 'error');
        return;
    }

    // Проверка существования пользователя
    if (isUserExistsInApp(email)) {
        showAlert('Пользователь с таким email уже зарегистрирован', 'error');
        return;
    }

    showLoading('Создание аккаунта...');
    
    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const newUser = {
            id: userId,
            email: email,
            fullName: fullName,
            password: password,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        const userSessionData = {
            id: userId,
            email: email,
            fullName: fullName,
            isLoggedIn: true,
            createdAt: newUser.createdAt
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userSessionData));
        
        // Удаляем текущую семью, если есть
        localStorage.removeItem('currentFamily');
        
        // Создаем начальные данные для пользователя
        const initialUserData = {
            fullName: fullName,
            email: email,
            transactions: [],
            accounts: [
                { id: `acc_${Date.now()}_1`, name: 'Наличные', type: 'cash', balance: 0, color: '#10B981' },
                { id: `acc_${Date.now()}_2`, name: 'Основной счет', type: 'bank', balance: 0, color: '#3B82F6' }
            ],
            categories: [
                { id: `cat_${Date.now()}_1`, name: 'Зарплата', type: 'income', icon: '💰', color: '#10B981' },
                { id: `cat_${Date.now()}_2`, name: 'Бизнес', type: 'income', icon: '💼', color: '#059669' },
                { id: `cat_${Date.now()}_3`, name: 'Продукты', type: 'expense', icon: '🛒', color: '#EF4444' },
                { id: `cat_${Date.now()}_4`, name: 'Транспорт', type: 'expense', icon: '🚗', color: '#DC2626' },
                { id: `cat_${Date.now()}_5`, name: 'Развлечения', type: 'expense', icon: '🎮', color: '#F59E0B' },
                { id: `cat_${Date.now()}_6`, name: 'Образование', type: 'expense', icon: '🎓', color: '#8B5CF6' }
            ],
            budgets: [],
            goals: [],
            familyMembers: [],
            settings: { currency: 'RUB', theme: 'light' },
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        
        localStorage.setItem(`userData_${userId}`, JSON.stringify(initialUserData));
        
        closePersonalAuthModal();
        hideLoading();
        showAlert('Аккаунт успешно создан!', 'success');
        showAppSection();
        bindAppEvents();
        loadDashboard();
    }, 1500);
}

function handleFamilyAuth(e) {
    e.preventDefault();
    const familyName = document.getElementById('family-auth-name').value.trim();
    const familyPassword = document.getElementById('family-auth-password').value;

    if (!familyName || !familyPassword) {
        showAlert('Пожалуйста, заполните все поля', 'error');
        return;
    }

    showLoading('Вход в семью...');
    
    setTimeout(() => {
        if (!isFamilyExistsInApp(familyName)) {
            hideLoading();
            showAlert('Семья с таким названием не найдена', 'error');
            return;
        }
        
        const families = JSON.parse(localStorage.getItem('families') || '[]');
        const family = families.find(f => f.name === familyName);
        
        if (!family) {
            hideLoading();
            showAlert('Ошибка при поиске семьи', 'error');
            return;
        }
        
        if (family.password !== familyPassword) {
            hideLoading();
            showAlert('Неверный пароль семьи', 'error');
            return;
        }
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        if (!currentUser.id) {
            hideLoading();
            showAlert('Сначала войдите в личный аккаунт', 'error');
            return;
        }
        
        // Проверяем, не состоит ли пользователь уже в этой семье
        const isMember = family.members?.some(member => member.userId === currentUser.id);
        
        if (!isMember) {
            hideLoading();
            showAlert('Вы не являетесь участником этой семьи. Попросите администратора добавить вас.', 'error');
            return;
        }
        
        const sessionFamilyData = {
            id: family.id,
            familyName: family.name,
            isFamilyLogin: true,
            createdAt: family.createdAt,
            createdBy: family.createdBy,
            currentUserId: currentUser.id
        };
        
        localStorage.setItem('currentFamily', JSON.stringify(sessionFamilyData));
        
        closeFamilyAuthModal();
        hideLoading();
        showAlert(`Добро пожаловать в семью "${familyName}"!`, 'success');
        showAppSection();
        bindAppEvents();
        loadDashboard();
    }, 1500);
}

function handleCreateFamilyAuth(e) {
    e.preventDefault();
    const familyName = document.getElementById('create-family-auth-name').value.trim();
    const familyPassword = document.getElementById('create-family-auth-password').value;
    const confirmPassword = document.getElementById('confirm-family-auth-password').value;

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

    // Проверка существования семьи
    if (isFamilyExistsInApp(familyName)) {
        showAlert('Семья с таким названием уже существует', 'error');
        return;
    }

    showLoading('Создание семьи...');
    
    setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        if (!currentUser.id) {
            hideLoading();
            showAlert('Сначала войдите в личный аккаунт', 'error');
            return;
        }
        
        const familyId = `family_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const sessionFamilyData = {
            id: familyId,
            familyName: familyName,
            isFamilyLogin: true,
            createdAt: new Date().toISOString(),
            createdBy: currentUser.id,
            currentUserId: currentUser.id
        };
        
        localStorage.setItem('currentFamily', JSON.stringify(sessionFamilyData));
        
        const families = JSON.parse(localStorage.getItem('families') || '[]');
        const familyData = {
            id: familyId,
            name: familyName,
            password: familyPassword,
            createdBy: currentUser.id,
            members: [{
                userId: currentUser.id,
                email: currentUser.email,
                name: currentUser.fullName,
                role: 'admin',
                joinedAt: new Date().toISOString()
            }],
            createdAt: new Date().toISOString()
        };
        
        families.push(familyData);
        localStorage.setItem('families', JSON.stringify(families));
        
        const initialFamilyData = {
            familyName: familyName,
            familyId: familyId,
            transactions: [],
            accounts: [
                { id: `acc_${Date.now()}_1`, name: 'Общие наличные', type: 'cash', balance: 0, color: '#10B981' },
                { id: `acc_${Date.now()}_2`, name: 'Общий счет', type: 'bank', balance: 0, color: '#3B82F6' }
            ],
            categories: [
                { id: `cat_${Date.now()}_1`, name: 'Общий доход', type: 'income', icon: '💰', color: '#10B981' },
                { id: `cat_${Date.now()}_2`, name: 'Продукты', type: 'expense', icon: '🛒', color: '#EF4444' },
                { id: `cat_${Date.now()}_3`, name: 'Коммунальные', type: 'expense', icon: '⚡', color: '#DC2626' },
                { id: `cat_${Date.now()}_4`, name: 'Транспорт', type: 'expense', icon: '🚗', color: '#F59E0B' },
                { id: `cat_${Date.now()}_5`, name: 'Развлечения', type: 'expense', icon: '🎮', color: '#8B5CF6' }
            ],
            budgets: [],
            goals: [],
            members: [{
                userId: currentUser.id,
                email: currentUser.email,
                name: currentUser.fullName,
                role: 'admin',
                joinedAt: new Date().toISOString()
            }],
            settings: { currency: 'RUB', theme: 'light' },
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString()
        };
        
        localStorage.setItem(`familyData_${familyId}`, JSON.stringify(initialFamilyData));
        
        closeCreateFamilyAuthModal();
        hideLoading();
        showAlert(`Семья "${familyName}" успешно создана!`, 'success');
        showAppSection();
        bindAppEvents();
        loadDashboard();
    }, 1500);
}

function startDemoMode() {
    showLoading('Загрузка демо-версии...');
    
    setTimeout(() => {
        // Очищаем все предыдущие демо-данные
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('demoData_')) {
                localStorage.removeItem(key);
            }
        }
        
        const demoId = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const demoData = {
            id: demoId,
            isDemo: true,
            fullName: 'Демо Пользователь',
            email: 'demo@example.com',
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('currentUser', JSON.stringify(demoData));
        
        // Удаляем текущую семью
        localStorage.removeItem('currentFamily');
        
        const demoStorage = {
            isDemo: true,
            fullName: 'Демо Пользователь',
            email: 'demo@example.com',
            transactions: [
                {
                    id: `trans_${Date.now()}_1`,
                    type: 'income',
                    amount: 50000,
                    category: 'Зарплата',
                    account: 'Основной счет',
                    description: 'Зарплата за декабрь',
                    date: new Date().toISOString().split('T')[0]
                },
                {
                    id: `trans_${Date.now()}_2`,
                    type: 'expense',
                    amount: 3500,
                    category: 'Продукты',
                    account: 'Основной счет',
                    description: 'Покупка продуктов',
                    date: new Date().toISOString().split('T')[0]
                }
            ],
            accounts: [
                { id: `acc_${Date.now()}_1`, name: 'Наличные', type: 'cash', balance: 10000, color: '#10B981' },
                { id: `acc_${Date.now()}_2`, name: 'Основной счет', type: 'bank', balance: 46500, color: '#3B82F6' },
                { id: `acc_${Date.now()}_3`, name: 'Кредитная карта', type: 'credit', balance: -15000, color: '#EF4444' }
            ],
            categories: [
                { id: `cat_${Date.now()}_1`, name: 'Зарплата', type: 'income', icon: '💰', color: '#10B981' },
                { id: `cat_${Date.now()}_2`, name: 'Бизнес', type: 'income', icon: '💼', color: '#059669' },
                { id: `cat_${Date.now()}_3`, name: 'Продукты', type: 'expense', icon: '🛒', color: '#EF4444' },
                { id: `cat_${Date.now()}_4`, name: 'Транспорт', type: 'expense', icon: '🚗', color: '#DC2626' },
                { id: `cat_${Date.now()}_5`, name: 'Развлечения', type: 'expense', icon: '🎮', color: '#F59E0B' },
                { id: `cat_${Date.now()}_6`, name: 'Образование', type: 'expense', icon: '🎓', color: '#8B5CF6' }
            ],
            budgets: [
                { id: `budget_${Date.now()}_1`, category: 'Продукты', amount: 10000, period: new Date().toISOString().slice(0, 7) }
            ],
            goals: [
                { 
                    id: `goal_${Date.now()}_1`, 
                    name: 'Новый автомобиль', 
                    targetAmount: 500000, 
                    currentAmount: 150000,
                    deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
                    description: 'Накопить на новый автомобиль'
                }
            ],
            familyMembers: [],
            settings: { currency: 'RUB', theme: 'light' },
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        
        localStorage.setItem(`demoData_${demoId}`, JSON.stringify(demoStorage));
        
        hideLoading();
        showAlert('Демо-режим активирован!', 'success');
        showAppSection();
        bindAppEvents();
        loadDashboard();
    }, 1500);
}

// Основные события приложения
function bindAppEvents() {
    // Навигация
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            switchPage(this.dataset.page);
        });
    });
    
    // Кнопки добавления
    document.getElementById('add-transaction-btn')?.addEventListener('click', () => showTransactionModal());
    document.getElementById('add-transaction-page-btn')?.addEventListener('click', () => showTransactionModal());
    document.getElementById('add-account-btn')?.addEventListener('click', () => showAccountModal());
    document.getElementById('add-category-btn')?.addEventListener('click', () => showCategoryModal());
    document.getElementById('add-budget-btn')?.addEventListener('click', () => showBudgetModal());
    document.getElementById('add-goal-btn')?.addEventListener('click', () => showGoalModal());
    document.getElementById('add-member-btn')?.addEventListener('click', () => showMemberModal());
    document.getElementById('delete-account-btn')?.addEventListener('click', () => showDeleteAccountModal());
    
    // Формы
    document.getElementById('transaction-form')?.addEventListener('submit', handleTransactionSubmit);
    document.getElementById('account-form')?.addEventListener('submit', handleAccountSubmit);
    document.getElementById('category-form')?.addEventListener('submit', handleCategorySubmit);
    document.getElementById('budget-form')?.addEventListener('submit', handleBudgetSubmit);
    document.getElementById('goal-form')?.addEventListener('submit', handleGoalSubmit);
    document.getElementById('member-form')?.addEventListener('submit', handleMemberSubmit);
    document.getElementById('add-funds-form')?.addEventListener('submit', handleAddFundsSubmit);
    document.getElementById('confirm-delete-account')?.addEventListener('click', handleDeleteAccount);
    
    // Фильтры транзакций
    document.getElementById('apply-filters')?.addEventListener('click', applyTransactionFilters);
    document.getElementById('clear-filters')?.addEventListener('click', clearTransactionFilters);
    
    // Выход и переключение
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    document.getElementById('switch-family-btn')?.addEventListener('click', handleSwitchFamily);
    
    // Закрытие модальных окон
    document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Закрытие по клику вне модального окна
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) closeAllModals();
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeAllModals();
    });
}

// Навигация по страницам
function switchPage(pageName) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');
    document.getElementById(`${pageName}-page`).classList.add('active');

    switch(pageName) {
        case 'dashboard': loadDashboard(); break;
        case 'transactions': loadTransactions(); break;
        case 'accounts': loadAccounts(); break;
        case 'categories': loadCategories(); break;
        case 'budgets': loadBudgets(); break;
        case 'goals': loadGoals(); break;
        case 'family': loadFamily(); break;
    }
}

function loadDashboard() {
    updateDashboardStats();
    loadRecentTransactions();
    loadExpenseCategories();
}

function loadTransactions() {
    const transactions = getStorageItem('transactions');
    renderTransactionsTable(transactions);
}

function loadAccounts() {
    const accounts = getStorageItem('accounts');
    renderAccountsGrid(accounts);
}

function loadCategories() {
    const categories = getStorageItem('categories');
    renderCategories(categories);
}

function loadBudgets() {
    const budgets = getStorageItem('budgets');
    renderBudgets(budgets);
}

function loadGoals() {
    const goals = getStorageItem('goals');
    renderGoals(goals);
}

function loadFamily() {
    const currentFamily = JSON.parse(localStorage.getItem('currentFamily') || '{}');
    
    if (!currentFamily.isFamilyLogin) {
        document.getElementById('family-info-card').classList.add('hidden');
        document.getElementById('family-content').classList.add('hidden');
    } else {
        document.getElementById('family-info-card').classList.remove('hidden');
        document.getElementById('family-content').classList.remove('hidden');
        
        const familyData = getStorageData();
        const members = familyData.members || [];
        document.getElementById('family-members-count').textContent = members.length;
        
        const budgets = familyData.budgets || [];
        const totalBudget = budgets.reduce((sum, budget) => sum + parseFloat(budget.amount || 0), 0);
        document.getElementById('family-total-budget').textContent = formatCurrency(totalBudget);
        
        const goals = familyData.goals || [];
        document.getElementById('family-active-goals').textContent = goals.length;
        
        renderFamilyMembers(members);
    }
}

// Обновление статистики дашборда
function updateDashboardStats() {
    const transactions = getStorageItem('transactions');
    let totalIncome = 0;
    let totalExpense = 0;
    
    transactions.forEach(transaction => {
        if (transaction.type === 'income') totalIncome += parseFloat(transaction.amount);
        else totalExpense += parseFloat(transaction.amount);
    });
    
    const totalBalance = totalIncome - totalExpense;
    
    document.getElementById('total-income').textContent = formatCurrency(totalIncome);
    document.getElementById('total-expense').textContent = formatCurrency(totalExpense);
    document.getElementById('total-balance').textContent = formatCurrency(totalBalance);
    
    const balanceElement = document.getElementById('total-balance');
    balanceElement.style.color = totalBalance < 0 ? '#EF4444' : '#10B981';
}

function loadRecentTransactions() {
    const transactions = getStorageItem('transactions');
    const recentTransactions = transactions.slice(-5).reverse();
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
        if (!categoryTotals[transaction.category]) categoryTotals[transaction.category] = 0;
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

// Рендеринг таблицы транзакций
function renderTransactionsTable(transactions) {
    const tbody = document.getElementById('transactions-table-body');
    tbody.innerHTML = '';
    
    if (transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">Нет транзакций</td></tr>';
        return;
    }
    
    transactions.forEach((transaction, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td><span class="transaction-type-badge ${transaction.type}">${transaction.type === 'income' ? 'Доход' : 'Расход'}</span></td>
            <td>${transaction.category}</td>
            <td>${transaction.description || '-'}</td>
            <td>${transaction.account}</td>
            <td class="${transaction.type === 'income' ? 'transaction-income' : 'transaction-expense'}">
                ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
            </td>
            <td>
                <button class="btn-icon delete" onclick="showDeleteConfirmation('транзакцию', function() { deleteTransaction('${transaction.id}'); })">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Рендеринг счетов
function renderAccountsGrid(accounts) {
    const grid = document.getElementById('accounts-grid');
    grid.innerHTML = '';
    
    if (accounts.length === 0) {
        grid.innerHTML = '<div class="no-data">Нет счетов</div>';
        return;
    }
    
    accounts.forEach((account) => {
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
                    <span>Тип: ${getAccountTypeName(account.type)}</span>
                </div>
                <button class="btn-icon delete" onclick="showDeleteConfirmation('счет', function() { deleteAccount('${account.id}'); })">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Рендеринг категорий
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
        incomeCategories.forEach((category) => {
            incomeContainer.appendChild(createCategoryCard(category));
        });
    }
    
    if (expenseCategories.length === 0) {
        expenseContainer.innerHTML = '<div class="no-data">Нет категорий расходов</div>';
    } else {
        expenseCategories.forEach((category) => {
            expenseContainer.appendChild(createCategoryCard(category));
        });
    }
}

function createCategoryCard(category) {
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
            <button class="btn-icon delete" onclick="showDeleteConfirmation('категорию', function() { deleteCategory('${category.id}'); })">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    return card;
}

// Рендеринг бюджетов
function renderBudgets(budgets) {
    const grid = document.getElementById('budgets-grid');
    grid.innerHTML = '';
    
    if (budgets.length === 0) {
        grid.innerHTML = '<div class="no-data">Нет бюджетов</div>';
        return;
    }
    
    budgets.forEach((budget) => {
        const transactions = getStorageItem('transactions');
        const spent = transactions
            .filter(t => t.category === budget.category && t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
        const percentage = (spent / budget.amount) * 100;
        const isOverBudget = percentage > 100;
        
        const card = document.createElement('div');
        card.className = 'budget-card';
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
                <button class="btn-icon delete" onclick="showDeleteConfirmation('бюджет', function() { deleteBudget('${budget.id}'); })">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Рендеринг целей
function renderGoals(goals) {
    const grid = document.getElementById('goals-grid');
    grid.innerHTML = '';
    
    if (goals.length === 0) {
        grid.innerHTML = '<div class="no-data">Нет целей</div>';
        return;
    }
    
    goals.forEach((goal) => {
        const percentage = (goal.currentAmount / goal.targetAmount) * 100;
        const daysLeft = goal.deadline ? 
            Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;
        
        const card = document.createElement('div');
        card.className = 'goal-card';
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
                <button class="btn btn-primary btn-sm" onclick="showAddFundsModal('${goal.id}')">
                    <i class="fas fa-plus"></i>
                    Пополнить
                </button>
                <button class="btn-icon delete" onclick="showDeleteConfirmation('цель', function() { deleteGoal('${goal.id}'); })">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Рендеринг членов семьи
function renderFamilyMembers(members) {
    const grid = document.getElementById('family-members-grid');
    grid.innerHTML = '';
    
    if (members.length === 0) {
        grid.innerHTML = '<div class="no-data">Нет участников</div>';
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const currentFamily = JSON.parse(localStorage.getItem('currentFamily') || '{}');
    
    members.forEach((member) => {
        const isCurrentUser = member.userId === currentUser.id;
        const card = document.createElement('div');
        card.className = 'member-card';
        card.innerHTML = `
            <div class="member-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="member-info">
                <h4>${member.name} ${isCurrentUser ? '(Вы)' : ''}</h4>
                <span class="member-email">${member.email}</span>
                <span class="member-role ${member.role}">${member.role === 'admin' ? 'Администратор' : 'Участник'}</span>
            </div>
            ${!isCurrentUser && currentFamily.createdBy === currentUser.id ? `
            <div class="member-actions">
                <button class="btn-icon delete" onclick="showDeleteConfirmation('участника', function() { deleteFamilyMember('${member.userId}'); })">
                    <i class="fas fa-trash"></i>
                </button>
            </div>` : ''}
        `;
        grid.appendChild(card);
    });
}

// Модальные окна данных
function showTransactionModal(transactionId = null) {
    loadCategoriesForTransaction();
    loadAccountsForTransaction();
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    
    if (transactionId) {
        const transactions = getStorageItem('transactions');
        const transaction = transactions.find(t => t.id === transactionId);
        
        if (transaction) {
            document.getElementById('transaction-id').value = transactionId;
            document.getElementById('transaction-modal-title').textContent = 'Редактировать транзакцию';
            document.getElementById('transaction-modal-subtitle').textContent = 'Измените данные финансовой операции';
            document.getElementById('amount').value = transaction.amount;
            document.getElementById('description').value = transaction.description || '';
            document.getElementById('date').value = transaction.date;
            
            // Установка типа транзакции
            document.querySelector(`input[name="type"][value="${transaction.type}"]`).checked = true;
            
            // Установка категории и счета
            setTimeout(() => {
                document.getElementById('category').value = transaction.category;
                document.getElementById('account').value = transaction.account;
            }, 100);
        }
    } else {
        document.getElementById('transaction-id').value = '';
        document.getElementById('transaction-modal-title').textContent = 'Добавить транзакцию';
        document.getElementById('transaction-modal-subtitle').textContent = 'Введите данные о финансовой операции';
        document.getElementById('transaction-form').reset();
        document.querySelector('input[name="type"][value="income"]').checked = true;
    }
    
    document.getElementById('transaction-modal').classList.add('active');
}

function showAccountModal(accountId = null) {
    if (accountId) {
        const accounts = getStorageItem('accounts');
        const account = accounts.find(a => a.id === accountId);
        
        if (account) {
            document.getElementById('account-id').value = accountId;
            document.getElementById('account-modal-title').textContent = 'Редактировать счет';
            document.getElementById('account-modal-subtitle').textContent = 'Измените данные финансового счета';
            document.getElementById('account-name').value = account.name;
            document.getElementById('account-type').value = account.type;
            document.getElementById('account-balance').value = account.balance;
            document.getElementById('account-color').value = account.color;
        }
    } else {
        document.getElementById('account-id').value = '';
        document.getElementById('account-modal-title').textContent = 'Добавить счет';
        document.getElementById('account-modal-subtitle').textContent = 'Создайте новый финансовый счет';
        document.getElementById('account-form').reset();
        document.getElementById('account-color').value = '#3B82F6';
    }
    
    document.getElementById('account-modal').classList.add('active');
}

function showCategoryModal(categoryId = null) {
    if (categoryId) {
        const categories = getStorageItem('categories');
        const category = categories.find(c => c.id === categoryId);
        
        if (category) {
            document.getElementById('category-id').value = categoryId;
            document.getElementById('category-modal-title').textContent = 'Редактировать категорию';
            document.getElementById('category-modal-subtitle').textContent = 'Измените данные категории';
            document.getElementById('category-name').value = category.name;
            document.getElementById('category-type').value = category.type;
            document.getElementById('category-icon').value = category.icon;
            document.getElementById('category-color').value = category.color;
        }
    } else {
        document.getElementById('category-id').value = '';
        document.getElementById('category-modal-title').textContent = 'Добавить категорию';
        document.getElementById('category-modal-subtitle').textContent = 'Создайте новую категорию для классификации транзакций';
        document.getElementById('category-form').reset();
        document.getElementById('category-color').value = '#6B7280';
        document.getElementById('category-type').value = 'expense';
    }
    
    document.getElementById('category-modal').classList.add('active');
}

function showBudgetModal(budgetId = null) {
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
    
    const now = new Date();
    document.getElementById('budget-period').value = now.toISOString().slice(0, 7);
    
    if (budgetId) {
        const budgets = getStorageItem('budgets');
        const budget = budgets.find(b => b.id === budgetId);
        
        if (budget) {
            document.getElementById('budget-id').value = budgetId;
            document.getElementById('budget-modal-title').textContent = 'Редактировать бюджет';
            document.getElementById('budget-modal-subtitle').textContent = 'Измените данные бюджета';
            document.getElementById('budget-category').value = budget.category;
            document.getElementById('budget-amount').value = budget.amount;
            document.getElementById('budget-period').value = budget.period;
        }
    } else {
        document.getElementById('budget-id').value = '';
        document.getElementById('budget-modal-title').textContent = 'Добавить бюджет';
        document.getElementById('budget-modal-subtitle').textContent = 'Установите лимит расходов по категории';
        document.getElementById('budget-form').reset();
    }
    
    document.getElementById('budget-modal').classList.add('active');
}

function showGoalModal(goalId = null) {
    if (goalId) {
        const goals = getStorageItem('goals');
        const goal = goals.find(g => g.id === goalId);
        
        if (goal) {
            document.getElementById('goal-id').value = goalId;
            document.getElementById('goal-modal-title').textContent = 'Редактировать цель';
            document.getElementById('goal-modal-subtitle').textContent = 'Измените данные финансовой цели';
            document.getElementById('goal-name').value = goal.name;
            document.getElementById('goal-amount').value = goal.targetAmount;
            document.getElementById('goal-deadline').value = goal.deadline;
            document.getElementById('goal-description').value = goal.description || '';
        }
    } else {
        document.getElementById('goal-id').value = '';
        document.getElementById('goal-modal-title').textContent = 'Добавить цель';
        document.getElementById('goal-modal-subtitle').textContent = 'Создайте новую финансовую цель';
        document.getElementById('goal-form').reset();
    }
    
    document.getElementById('goal-modal').classList.add('active');
}

function showMemberModal() {
    document.getElementById('member-id').value = '';
    document.getElementById('member-modal-title').textContent = 'Добавить участника';
    document.getElementById('member-modal-subtitle').textContent = 'Пригласите нового участника в семью';
    document.getElementById('member-form').reset();
    document.getElementById('member-role').value = 'member';
    
    document.getElementById('member-modal').classList.add('active');
}

function showAddFundsModal(goalId) {
    const goals = getStorageItem('goals');
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    document.getElementById('add-funds-form').dataset.goalId = goalId;
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

function showDeleteConfirmation(itemName, callback) {
    currentDeleteCallback = callback;
    document.getElementById('delete-confirmation-title').textContent = `Удалить ${itemName}`;
    document.getElementById('delete-confirmation-text').textContent = `Вы уверены, что хотите удалить ${itemName}? Это действие нельзя отменить.`;
    document.getElementById('delete-confirmation-modal').classList.add('active');
    
    // Установка обработчика подтверждения
    const confirmBtn = document.getElementById('confirm-delete-btn');
    confirmBtn.onclick = function() {
        if (currentDeleteCallback) {
            currentDeleteCallback();
            currentDeleteCallback = null;
        }
        closeAllModals();
    };
}

// Обработчики форм
function handleTransactionSubmit(e) {
    e.preventDefault();
    const transactionId = document.getElementById('transaction-id').value;
    const transaction = {
        id: transactionId || `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: document.querySelector('input[name="type"]:checked').value,
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        account: document.getElementById('account').value,
        description: document.getElementById('description').value,
        date: document.getElementById('date').value
    };
    
    const transactions = getStorageItem('transactions');
    
    if (transactionId) {
        // Редактирование существующей транзакции
        const index = transactions.findIndex(t => t.id === transactionId);
        if (index !== -1) {
            const oldTransaction = transactions[index];
            // Отмена старого влияния на баланс
            updateAccountBalance(oldTransaction.account, oldTransaction.type, -parseFloat(oldTransaction.amount));
            // Применение нового влияния
            updateAccountBalance(transaction.account, transaction.type, transaction.amount);
            transactions[index] = transaction;
        }
    } else {
        // Добавление новой транзакции
        transactions.push(transaction);
        updateAccountBalance(transaction.account, transaction.type, transaction.amount);
    }
    
    setStorageItem('transactions', transactions);
    
    showAlert(transactionId ? 'Транзакция успешно обновлена!' : 'Транзакция успешно добавлена!', 'success');
    closeAllModals();
    const activePage = document.querySelector('.page.active').id.replace('-page', '');
    switchPage(activePage);
}

function handleAccountSubmit(e) {
    e.preventDefault();
    const accountId = document.getElementById('account-id').value;
    const account = {
        id: accountId || `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: document.getElementById('account-name').value,
        type: document.getElementById('account-type').value,
        balance: parseFloat(document.getElementById('account-balance').value) || 0,
        color: document.getElementById('account-color').value
    };
    
    const accounts = getStorageItem('accounts');
    
    if (accountId) {
        const index = accounts.findIndex(a => a.id === accountId);
        if (index !== -1) {
            accounts[index] = account;
        }
    } else {
        accounts.push(account);
    }
    
    setStorageItem('accounts', accounts);
    
    showAlert(accountId ? 'Счет успешно обновлен!' : 'Счет успешно создан!', 'success');
    closeAllModals();
    loadAccounts();
}

function handleCategorySubmit(e) {
    e.preventDefault();
    const categoryId = document.getElementById('category-id').value;
    const category = {
        id: categoryId || `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: document.getElementById('category-name').value,
        type: document.getElementById('category-type').value,
        icon: document.getElementById('category-icon').value,
        color: document.getElementById('category-color').value
    };
    
    const categories = getStorageItem('categories');
    
    // Проверка на уникальность названия категории
    const existingCategory = categories.find(cat => 
        cat.name === category.name && cat.type === category.type && cat.id !== categoryId
    );
    
    if (existingCategory) {
        showAlert('Категория с таким названием и типом уже существует', 'error');
        return;
    }
    
    if (categoryId) {
        const index = categories.findIndex(c => c.id === categoryId);
        if (index !== -1) {
            categories[index] = category;
        }
    } else {
        categories.push(category);
    }
    
    setStorageItem('categories', categories);
    
    showAlert(categoryId ? 'Категория успешно обновлена!' : 'Категория успешно создана!', 'success');
    closeAllModals();
    loadCategories();
}

function handleBudgetSubmit(e) {
    e.preventDefault();
    const budgetId = document.getElementById('budget-id').value;
    const budget = {
        id: budgetId || `budget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        category: document.getElementById('budget-category').value,
        amount: parseFloat(document.getElementById('budget-amount').value),
        period: document.getElementById('budget-period').value
    };
    
    const budgets = getStorageItem('budgets');
    
    if (budgetId) {
        const index = budgets.findIndex(b => b.id === budgetId);
        if (index !== -1) {
            budgets[index] = budget;
        }
    } else {
        budgets.push(budget);
    }
    
    setStorageItem('budgets', budgets);
    
    showAlert(budgetId ? 'Бюджет успешно обновлен!' : 'Бюджет создан!', 'success');
    closeAllModals();
    loadBudgets();
}

function handleGoalSubmit(e) {
    e.preventDefault();
    const goalId = document.getElementById('goal-id').value;
    const goal = {
        id: goalId || `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: document.getElementById('goal-name').value,
        targetAmount: parseFloat(document.getElementById('goal-amount').value),
        currentAmount: goalId ? getStorageItem('goals').find(g => g.id === goalId)?.currentAmount || 0 : 0,
        deadline: document.getElementById('goal-deadline').value,
        description: document.getElementById('goal-description').value
    };
    
    const goals = getStorageItem('goals');
    
    if (goalId) {
        const index = goals.findIndex(g => g.id === goalId);
        if (index !== -1) {
            goals[index] = goal;
        }
    } else {
        goals.push(goal);
    }
    
    setStorageItem('goals', goals);
    
    showAlert(goalId ? 'Цель успешно обновлена!' : 'Цель создана!', 'success');
    closeAllModals();
    loadGoals();
}

function handleMemberSubmit(e) {
    e.preventDefault();
    const memberName = document.getElementById('member-name').value.trim();
    const memberEmail = document.getElementById('member-email').value.trim().toLowerCase();
    const memberRole = document.getElementById('member-role').value;

    if (!memberName || !memberEmail) {
        showAlert('Пожалуйста, заполните все поля', 'error');
        return;
    }

    // Находим пользователя по email
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === memberEmail);
    
    if (!user) {
        showAlert('Пользователь с таким email не найден. Попросите его сначала зарегистрироваться.', 'error');
        return;
    }
    
    const currentFamily = JSON.parse(localStorage.getItem('currentFamily') || '{}');
    const familyData = getStorageData();
    
    // Проверяем, не состоит ли пользователь уже в семье
    const isAlreadyMember = familyData.members?.some(member => member.userId === user.id);
    if (isAlreadyMember) {
        showAlert('Этот пользователь уже является участником семьи', 'error');
        return;
    }
    
    const newMember = {
        userId: user.id,
        email: user.email,
        name: memberName,
        role: memberRole,
        joinedAt: new Date().toISOString()
    };
    
    familyData.members = familyData.members || [];
    familyData.members.push(newMember);
    saveStorageData(familyData);
    
    // Обновляем общий список семей
    const families = JSON.parse(localStorage.getItem('families') || '[]');
    const familyIndex = families.findIndex(f => f.id === currentFamily.id);
    if (familyIndex !== -1) {
        families[familyIndex].members = families[familyIndex].members || [];
        families[familyIndex].members.push(newMember);
        localStorage.setItem('families', JSON.stringify(families));
    }
    
    showAlert('Участник успешно добавлен!', 'success');
    closeAllModals();
    loadFamily();
}

function handleAddFundsSubmit(e) {
    e.preventDefault();
    const goalId = e.target.dataset.goalId;
    const amount = parseFloat(document.getElementById('funds-amount').value);
    const account = document.getElementById('funds-account').value;
    const description = document.getElementById('funds-description').value;
    
    if (!amount || !account) {
        showAlert('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    const accounts = getStorageItem('accounts');
    const selectedAccount = accounts.find(acc => acc.name === account);
    
    if (!selectedAccount || parseFloat(selectedAccount.balance) < amount) {
        showAlert('Недостаточно средств на выбранном счете', 'error');
        return;
    }
    
    const goals = getStorageItem('goals');
    const goalIndex = goals.findIndex(g => g.id === goalId);
    
    if (goalIndex === -1) {
        showAlert('Цель не найдена', 'error');
        return;
    }
    
    goals[goalIndex].currentAmount += amount;
    
    if (goals[goalIndex].currentAmount >= goals[goalIndex].targetAmount) {
        goals[goalIndex].currentAmount = goals[goalIndex].targetAmount;
        showAlert(`Поздравляем! Цель "${goals[goalIndex].name}" достигнута! 🎉`, 'success');
    }
    
    updateAccountBalance(account, 'expense', amount);
    
    const transaction = {
        id: `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'expense',
        amount: amount,
        category: 'Накопления',
        account: account,
        description: description || `Пополнение цели: ${goals[goalIndex].name}`,
        date: new Date().toISOString().split('T')[0]
    };
    
    const transactions = getStorageItem('transactions');
    transactions.push(transaction);
    setStorageItem('transactions', transactions);
    
    setStorageItem('goals', goals);
    
    showAlert('Цель успешно пополнена!', 'success');
    closeAllModals();
    loadGoals();
}

function handleDeleteAccount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const currentFamily = JSON.parse(localStorage.getItem('currentFamily') || '{}');
    
    showLoading('Удаление аккаунта...');
    
    setTimeout(() => {
        if (currentFamily.isFamilyLogin) {
            // Для семейного аккаунта удаляем только данные семьи для этого пользователя
            const families = JSON.parse(localStorage.getItem('families') || '[]');
            const familyIndex = families.findIndex(f => f.id === currentFamily.id);
            if (familyIndex !== -1) {
                families[familyIndex].members = families[familyIndex].members.filter(m => m.userId !== currentUser.id);
                localStorage.setItem('families', JSON.stringify(families));
            }
            
            // Удаляем пользователя из семейных данных
            const familyData = getStorageData();
            if (familyData.members) {
                familyData.members = familyData.members.filter(m => m.userId !== currentUser.id);
                saveStorageData(familyData);
            }
            
            localStorage.removeItem('currentFamily');
            hideLoading();
            showAlert('Вы вышли из семьи', 'success');
        } else if (currentUser.isDemo) {
            // Для демо просто удаляем данные
            localStorage.removeItem(`demoData_${currentUser.id}`);
            localStorage.removeItem('currentUser');
            hideLoading();
            showAlert('Демо-аккаунт успешно удален', 'success');
        } else {
            // Удаляем пользователя из системы
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const updatedUsers = users.filter(u => u.id !== currentUser.id);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            
            // Удаляем данные пользователя
            localStorage.removeItem(`userData_${currentUser.id}`);
            localStorage.removeItem('currentUser');
            
            // Удаляем пользователя из всех семей
            const families = JSON.parse(localStorage.getItem('families') || '[]');
            families.forEach(family => {
                if (family.members) {
                    family.members = family.members.filter(m => m.userId !== currentUser.id);
                }
            });
            localStorage.setItem('families', JSON.stringify(families));
            
            hideLoading();
            showAlert('Аккаунт успешно удален', 'success');
        }
        
        setTimeout(() => window.location.href = 'index.html', 1500);
    }, 1500);
}

// Функции фильтрации
function applyTransactionFilters() {
    const typeFilter = document.getElementById('type-filter').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    let transactions = getStorageItem('transactions');
    
    if (typeFilter !== 'all') transactions = transactions.filter(t => t.type === typeFilter);
    if (startDate) transactions = transactions.filter(t => t.date >= startDate);
    if (endDate) transactions = transactions.filter(t => t.date <= endDate);
    
    renderTransactionsTable(transactions);
}

function clearTransactionFilters() {
    document.getElementById('type-filter').value = 'all';
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    const transactions = getStorageItem('transactions');
    renderTransactionsTable(transactions);
}

// Вспомогательные функции
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

// Форматирование
function formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return 'Нет даты';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

// Уведомления и загрузка
function showAlert(message, type = 'info') {
    const alert = document.querySelector('.alert-message');
    const alertText = document.querySelector('.alert-text');
    const alertClose = document.querySelector('.alert-close');
    
    if (alert && alertText) {
        alertText.textContent = message;
        alert.className = `alert-message alert-${type}`;
        alert.classList.remove('hidden');
        
        if (type === 'success') {
            alert.style.borderLeftColor = '#10B981';
            alert.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.05))';
        } else if (type === 'error') {
            alert.style.borderLeftColor = '#EF4444';
            alert.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(220, 38, 38, 0.05))';
        } else {
            alert.style.borderLeftColor = '#3B82F6';
            alert.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(37, 99, 235, 0.05))';
        }
        
        if (alertClose) {
            alertClose.onclick = () => alert.classList.add('hidden');
        }
        
        setTimeout(() => alert.classList.add('hidden'), 5000);
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
    if (loadingOverlay) loadingOverlay.classList.add('hidden');
}

// Управление сессиями
function handleLogout() {
    showLoading('Выход из системы...');
    
    setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        if (currentUser.isDemo) {
            // Для демо просто удаляем данные
            localStorage.removeItem(`demoData_${currentUser.id}`);
        }
        
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentFamily');
        hideLoading();
        showAlert('Вы успешно вышли из системы', 'success');
        setTimeout(() => window.location.href = 'index.html', 1000);
    }, 1000);
}

function handleSwitchFamily() {
    localStorage.removeItem('currentFamily');
    showAuthSection();
    bindAuthEvents();
}

// Функции удаления
function deleteTransaction(transactionId) {
    const transactions = getStorageItem('transactions');
    const transactionIndex = transactions.findIndex(t => t.id === transactionId);
    
    if (transactionIndex !== -1) {
        const transaction = transactions[transactionIndex];
        updateAccountBalance(transaction.account, transaction.type, -parseFloat(transaction.amount));
        transactions.splice(transactionIndex, 1);
        setStorageItem('transactions', transactions);
        showAlert('Транзакция удалена', 'success');
        loadTransactions();
    }
}

function deleteAccount(accountId) {
    const accounts = getStorageItem('accounts');
    const updatedAccounts = accounts.filter(acc => acc.id !== accountId);
    setStorageItem('accounts', updatedAccounts);
    showAlert('Счет удален', 'success');
    loadAccounts();
}

function deleteCategory(categoryId) {
    const categories = getStorageItem('categories');
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    setStorageItem('categories', updatedCategories);
    showAlert('Категория удалена', 'success');
    loadCategories();
}

function deleteBudget(budgetId) {
    const budgets = getStorageItem('budgets');
    const updatedBudgets = budgets.filter(b => b.id !== budgetId);
    setStorageItem('budgets', updatedBudgets);
    showAlert('Бюджет удален', 'success');
    loadBudgets();
}

function deleteGoal(goalId) {
    const goals = getStorageItem('goals');
    const updatedGoals = goals.filter(g => g.id !== goalId);
    setStorageItem('goals', updatedGoals);
    showAlert('Цель удалена', 'success');
    loadGoals();
}

function deleteFamilyMember(userId) {
    const currentFamily = JSON.parse(localStorage.getItem('currentFamily') || '{}');
    const familyData = getStorageData();
    
    if (familyData.members) {
        familyData.members = familyData.members.filter(m => m.userId !== userId);
        saveStorageData(familyData);
    }
    
    // Обновляем общий список семей
    const families = JSON.parse(localStorage.getItem('families') || '[]');
    const familyIndex = families.findIndex(f => f.id === currentFamily.id);
    if (familyIndex !== -1) {
        families[familyIndex].members = families[familyIndex].members.filter(m => m.userId !== userId);
        localStorage.setItem('families', JSON.stringify(families));
    }
    
    showAlert('Участник удален', 'success');
    loadFamily();
}

// Глобальные функции
window.app = {
    showPersonalAuthModal,
    showFamilyAuthModal,
    startDemoMode,
    closeAllModals,
    showTransactionModal,
    showAccountModal,
    showCategoryModal,
    showBudgetModal,
    showGoalModal,
    showMemberModal,
    showCreateFamilyAuthModal,
    showAddFundsModal,
    showDeleteAccountModal,
    showDeleteConfirmation,
    deleteTransaction,
    deleteAccount,
    deleteCategory,
    deleteBudget,
    deleteGoal,
    deleteFamilyMember
};