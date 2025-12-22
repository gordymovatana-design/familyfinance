document.addEventListener('DOMContentLoaded', function() {
    initMainPage();
});

function initMainPage() {
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
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

function bindEvents() {
    // Основные кнопки
    const startFreeBtn = document.getElementById('start-free-btn');
    const familyAccessBtn = document.getElementById('family-access-btn');
    const navLoginBtn = document.getElementById('nav-login-btn');
    const ctaStartBtn = document.getElementById('cta-start-btn');
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    
    if (startFreeBtn) startFreeBtn.addEventListener('click', () => showAuthModal('register'));
    if (familyAccessBtn) familyAccessBtn.addEventListener('click', showFamilyAccessModal);
    if (navLoginBtn) navLoginBtn.addEventListener('click', () => showAuthModal('login'));
    if (ctaStartBtn) ctaStartBtn.addEventListener('click', () => showAuthModal('register'));
    if (scrollToTopBtn) scrollToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Кнопки демо-режима
    const demoBtn1 = document.getElementById('demo-btn');
    const demoBtn2 = document.getElementById('demo-btn-2');
    if (demoBtn1) demoBtn1.addEventListener('click', startDemo);
    if (demoBtn2) demoBtn2.addEventListener('click', startDemo);
    
    // Кнопки закрытия модальных окон
    document.getElementById('auth-close-btn')?.addEventListener('click', closeAuthModal);
    document.getElementById('family-access-close-btn')?.addEventListener('click', closeFamilyAccessModal);
    document.getElementById('create-family-close-btn')?.addEventListener('click', closeCreateFamilyModal);
    document.getElementById('join-family-close-btn')?.addEventListener('click', closeJoinFamilyModal);
    document.getElementById('support-close-btn')?.addEventListener('click', closeSupportModal);
    document.getElementById('legal-close-btn')?.addEventListener('click', closeLegalModal);
    
    // Кнопки вкладок
    const loginTabBtn = document.getElementById('login-tab-btn');
    const registerTabBtn = document.getElementById('register-tab-btn');
    if (loginTabBtn) loginTabBtn.addEventListener('click', () => switchAuthTab('login'));
    if (registerTabBtn) registerTabBtn.addEventListener('click', () => switchAuthTab('register'));
    
    // Опции доступа к семье
    document.getElementById('create-family-option')?.addEventListener('click', showCreateFamilyModal);
    document.getElementById('join-family-option')?.addEventListener('click', showJoinFamilyModal);
    
    // Формы
    document.getElementById('login-form')?.addEventListener('submit', handleLogin);
    document.getElementById('register-form')?.addEventListener('submit', handleRegister);
    document.getElementById('create-family-form')?.addEventListener('submit', handleCreateFamilySubmit);
    document.getElementById('join-family-form')?.addEventListener('submit', handleJoinFamilySubmit);
    
    // Ссылки в футере
    document.getElementById('support-link')?.addEventListener('click', (e) => { e.preventDefault(); showSupportModal(); });
    document.getElementById('contacts-link')?.addEventListener('click', (e) => { e.preventDefault(); showSupportModal(); });
    document.getElementById('privacy-link')?.addEventListener('click', (e) => { e.preventDefault(); showLegalModal(); });
    document.getElementById('terms-link')?.addEventListener('click', (e) => { e.preventDefault(); showLegalModal(); });
    
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
    
    // Закрытие модальных окон
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) closeAllModals();
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeAllModals();
    });
}

// Функции для работы с модальными окнами
function showAuthModal(defaultTab = 'login') {
    closeAllModals();
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        switchAuthTab(defaultTab);
    }
}

function showFamilyAccessModal() {
    closeAllModals();
    const modal = document.getElementById('family-access-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function showCreateFamilyModal() {
    closeAllModals();
    const modal = document.getElementById('create-family-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function showJoinFamilyModal() {
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
    document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
    document.body.style.overflow = 'auto';
}

function switchAuthTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.toggle('active', form.id === `${tabName}-form`);
    });
}

// Функция проверки существования пользователя по email
function isUserExists(email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(user => user.email === email);
}

// Функция проверки существования семьи по названию
function isFamilyExists(familyName) {
    const families = JSON.parse(localStorage.getItem('families') || '[]');
    return families.some(family => family.name === familyName);
}

// Инициализация начальных данных в localStorage
function initLocalStorage() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    if (!localStorage.getItem('families')) {
        localStorage.setItem('families', JSON.stringify([]));
    }
    if (!localStorage.getItem('demoCleared')) {
        localStorage.setItem('demoCleared', 'true');
    }
}

// Обработчики форм
async function handleLogin(e) {
    e.preventDefault();
    
    initLocalStorage();
    
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showAlert('Пожалуйста, заполните все поля', 'error');
        return;
    }

    showLoading('Вход в систему...');
    
    // Имитация запроса на сервер
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
        
        hideLoading();
        showAlert('Успешный вход!', 'success');
        setTimeout(() => window.location.href = 'app.html', 1000);
    }, 1500);
}

async function handleRegister(e) {
    e.preventDefault();
    
    initLocalStorage();
    
    const fullName = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim().toLowerCase();
    const password = document.getElementById('register-password').value;

    if (!fullName || !email || !password) {
        showAlert('Пожалуйста, заполните все поля', 'error');
        return;
    }

    if (password.length < 6) {
        showAlert('Пароль должен содержать не менее 6 символов', 'error');
        return;
    }

    // Проверка существования пользователя
    if (isUserExists(email)) {
        showAlert('Пользователь с таким email уже зарегистрирован', 'error');
        return;
    }

    showLoading('Создание аккаунта...');
    
    // Имитация запроса на сервер
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
        
        hideLoading();
        showAlert('Аккаунт успешно создан!', 'success');
        setTimeout(() => window.location.href = 'app.html', 1000);
    }, 1500);
}

function handleCreateFamilySubmit(e) {
    e.preventDefault();
    
    initLocalStorage();
    
    const familyName = document.getElementById('create-family-name').value.trim();
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

    // Проверка существования семьи
    if (isFamilyExists(familyName)) {
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
        
        const families = JSON.parse(localStorage.getItem('families') || '[]');
        families.push(familyData);
        localStorage.setItem('families', JSON.stringify(families));
        
        const sessionFamilyData = {
            id: familyId,
            familyName: familyName,
            isFamilyLogin: true,
            createdAt: familyData.createdAt,
            createdBy: currentUser.id,
            currentUserId: currentUser.id
        };
        
        localStorage.setItem('currentFamily', JSON.stringify(sessionFamilyData));
        
        // Создаем семейные данные
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
        
        hideLoading();
        showAlert(`Семья "${familyName}" успешно создана!`, 'success');
        closeCreateFamilyModal();
        setTimeout(() => window.location.href = 'app.html', 1000);
    }, 1500);
}

function handleJoinFamilySubmit(e) {
    e.preventDefault();
    
    initLocalStorage();
    
    const familyName = document.getElementById('join-family-name').value.trim();
    const familyPassword = document.getElementById('join-family-password').value;

    if (!familyName || !familyPassword) {
        showAlert('Пожалуйста, заполните все поля', 'error');
        return;
    }

    showLoading('Вход в семью...');
    
    setTimeout(() => {
        const families = JSON.parse(localStorage.getItem('families') || '[]');
        const family = families.find(f => f.name === familyName);
        
        if (!family) {
            hideLoading();
            showAlert('Семья с таким названием не найдена', 'error');
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
            // Добавляем пользователя в семью
            family.members = family.members || [];
            family.members.push({
                userId: currentUser.id,
                email: currentUser.email,
                name: currentUser.fullName,
                role: 'member',
                joinedAt: new Date().toISOString()
            });
            
            localStorage.setItem('families', JSON.stringify(families));
            
            // Обновляем семейные данные
            const familyStorageKey = `familyData_${family.id}`;
            const familyData = JSON.parse(localStorage.getItem(familyStorageKey) || '{}');
            
            if (familyData.familyId) {
                familyData.members = familyData.members || [];
                familyData.members.push({
                    userId: currentUser.id,
                    email: currentUser.email,
                    name: currentUser.fullName,
                    role: 'member',
                    joinedAt: new Date().toISOString()
                });
                
                localStorage.setItem(familyStorageKey, JSON.stringify(familyData));
            }
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
        
        hideLoading();
        showAlert(`Добро пожаловать в семью "${familyName}"!`, 'success');
        closeJoinFamilyModal();
        setTimeout(() => window.location.href = 'app.html', 1000);
    }, 1500);
}

function startDemo() {
    showLoading('Загрузка демо-версии...');
    
    setTimeout(() => {
        // Очищаем все демо-данные для чистого старта
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
        
        // Удаляем текущую семью, если есть
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
                },
                {
                    id: `trans_${Date.now()}_3`,
                    type: 'expense',
                    amount: 1200,
                    category: 'Транспорт',
                    account: 'Наличные',
                    description: 'Такси',
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
                { 
                    id: `budget_${Date.now()}_1`, 
                    category: 'Продукты', 
                    amount: 10000, 
                    period: new Date().toISOString().slice(0, 7),
                    spent: 3500
                }
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
        setTimeout(() => window.location.href = 'app.html', 1000);
    }, 1500);
}

// Утилитные функции
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

function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
    }
}