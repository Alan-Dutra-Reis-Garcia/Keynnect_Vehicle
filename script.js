document.addEventListener('DOMContentLoaded', () => {
    // Referências das telas principais
    const loginScreen = document.getElementById('login-screen');
    const signupScreen = document.getElementById('signup-screen');
    const mainApp = document.getElementById('main-app');

    // Formulários de login/cadastro
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const googleLoginBtn = document.querySelector('.google-btn');
    const forgotPasswordLink = document.getElementById('forgot-password-link');

    // Elementos do Cabeçalho e Navegação
    const mainAppHeader = document.getElementById('main-app-header');
    const toggleThemeBtn = document.getElementById('toggle-theme-btn');
    const topNavItemsContainer = mainAppHeader.querySelector('.top-nav-items');
    
    // Seleciona todos os itens de navegação para sincronizar o estado 'active'
    const topNavItems = document.querySelectorAll('.top-nav-item');

    const body = document.body;

    // Seções de conteúdo
    const dashboardScreen = document.getElementById('dashboard-screen');
    const servicesScreen = document.getElementById('services-screen');
    const historyScreen = document.getElementById('history-screen');
    const profileScreen = document.getElementById('profile-screen');
    const addVehicleScreen = document.getElementById('add-vehicle-screen');
    const vehicleDetailsScreen = document.getElementById('vehicle-details-screen');
    
    // NOVO: Referência para a tela de calculadoras
    const calculatorsScreen = document.getElementById('calculators-screen');

    // Botões e Listas
    const vehicleList = document.getElementById('vehicle-list');
    const addVehicleBtn = document.getElementById('add-vehicle-btn');
    const backToDashboardBtn = document.getElementById('back-to-dashboard');
    const backFromAddVehicleBtn = document.getElementById('back-from-add-vehicle');
    const addVehicleForm = document.getElementById('add-vehicle-form');
    const maintenanceHistoryList = document.getElementById('maintenance-history-list');

    // Elementos da Tela de Detalhes do Veículo
    const detailsVehicleName = document.getElementById('details-vehicle-name');
    const detailsVehicleModel = document.getElementById('details-vehicle-model');
    const currentKmDetailsSpan = document.getElementById('current-km-details');
    const summaryCardsDynamic = document.getElementById('summary-cards-dynamic');
    const editVehicleNameBtn = document.getElementById('edit-vehicle-name-btn');
    const editVehicleModelBtn = document.getElementById('edit-vehicle-model-btn');
    const editKmDetailsBtn = document.getElementById('edit-km-details-btn');

    // Elementos da Tela de Perfil
    const profileDisplayName = document.getElementById('profile-display-name');
    const profileEmail = document.getElementById('profile-email');
    const logoutBtn = document.getElementById('logout-btn');

    // Toast e Modal
    const toastContainer = document.getElementById('toast-container');
    const customModal = document.getElementById('custom-modal');
    // ... (demais referências de modal) ...

    // Calculadoras
    const calculateKmBtn = document.getElementById('calculate-km-btn');
    const kmStartDateInput = document.getElementById('km-start-date');
    const kmStartInput = document.getElementById('km-start');
    const kmEndDateInput = document.getElementById('km-end-date');
    const kmEndInput = document.getElementById('km-end');
    const kmResultDiv = document.getElementById('km-result');
    const calculateKmlBtn = document.getElementById('calculate-kml-btn');
    const kmlKmInput = document.getElementById('kml-km');
    const kmlLitersInput = document.getElementById('kml-liters');
    const kmlPriceInput = document.getElementById('kml-price');
    const kmlResultDiv = document.getElementById('kml-result');

    // Padrões de Manutenção
    const maintenanceStandards = {
        oilChange: { mineral: { km: 5000, months: 6 }, semisintetico: { km: 10000, months: 12 }, sintetico: { km: 15000, months: 12 } },
        tires: { rotation: { km: 10000, months: 6 }, change: { km: 60000, months: 60 } },
        alignment: { km: 10000, months: 6 },
        balanceamento: { km: 10000, months: 6 },
        filters: { oil: { km: 10000, months: 12 }, fuel: { km: 20000, months: 24 }, air: { km: 15000, months: 12 } },
    };

    let userVehicles = [];
    let currentSelectedVehicle = null;
    let currentUserId = null;

    // --- LÓGICA PRINCIPAL ---

    // Função para mostrar a seção de conteúdo correta
    const showContentSection = (sectionToShow) => {
        // Esconde todas as seções de conteúdo
        document.querySelectorAll('#main-app > .screen').forEach(section => {
            section.classList.remove('active-content');
            section.classList.add('hidden-content');
        });

        // Mostra a seção desejada
        if (sectionToShow) {
            sectionToShow.classList.add('active-content');
            sectionToShow.classList.remove('hidden-content');
        }

        // Atualiza o estado 'active' nos itens de navegação
        topNavItems.forEach(item => {
            if (item.dataset.screen === sectionToShow.id) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Lógica específica ao mostrar certas telas
        if (sectionToShow === historyScreen && currentSelectedVehicle) {
            loadMaintenanceHistory(currentSelectedVehicle.id);
        } else if (sectionToShow === historyScreen) {
            maintenanceHistoryList.innerHTML = '<p class="no-vehicles">Selecione um veículo no Dashboard para ver seu histórico.</p>';
        }

        if (sectionToShow === servicesScreen) {
            renderServiceProviders();
        }
    };
    
    // Função para lidar com cliques na navegação
    const handleTopNavClick = (e) => {
        const targetItem = e.target.closest('.top-nav-item');
        if (!targetItem) return;

        e.preventDefault();
        const screenId = targetItem.dataset.screen;
        let screenToShow;

        switch (screenId) {
            case 'dashboard-screen': screenToShow = dashboardScreen; break;
            case 'services-screen': screenToShow = servicesScreen; break;
            // NOVO: Case para a tela de calculadoras
            case 'calculators-screen': screenToShow = calculatorsScreen; break;
            case 'history-screen': screenToShow = historyScreen; break;
            case 'profile-screen': screenToShow = profileScreen; break;
            default: screenToShow = dashboardScreen;
        }
        showContentSection(screenToShow);
    };

    // Função para alternar o tema
    const handleThemeToggle = () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
        updateThemeIcon();
    };

    const updateThemeIcon = () => {
        if (!toggleThemeBtn) return;
        if (body.classList.contains('dark-mode')) {
            toggleThemeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            toggleThemeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    };

    // --- INICIALIZAÇÃO E EVENT LISTENERS ---
    
    // Listener de navegação
    topNavItemsContainer.addEventListener('click', handleTopNavClick);
    
    // Listener do botão de tema
    toggleThemeBtn.addEventListener('click', handleThemeToggle);

    // Carregar tema salvo
    if (localStorage.getItem('theme') === 'light') {
        body.classList.remove('dark-mode');
    }
    updateThemeIcon();

    // Outros listeners (login, signup, add vehicle, etc.)
    // O restante do seu código JavaScript permanece o mesmo, pois as lógicas de
    // Firebase, cálculo, modais e manipulação de formulários não precisam de alteração
    // para atender a esta solicitação.
    // ... (seu código JS existente para login, Firebase, etc., vai aqui)

    // Apenas cole o restante do seu arquivo script.js aqui, ele deve funcionar
    // com as novas referências e a nova função de navegação.
    // Por exemplo, as funções como `loadUserVehicles`, `renderVehicles`, `calculateNextMaintenance`,
    // `showToast`, etc., continuam as mesmas.
    
    // Exemplo de como o restante do seu código se encaixaria:
    auth.onAuthStateChanged(async (user) => {
        const allScreens = [loginScreen, signupScreen, mainApp];
        if (user) {
            currentUserId = user.uid;
            profileEmail.textContent = user.email || 'Não Informado';
            profileDisplayName.textContent = user.displayName || 'Não Informado';
            
            allScreens.forEach(s => s.classList.add('hidden'));
            mainApp.classList.remove('hidden');
            mainApp.classList.add('active');
            
            showContentSection(dashboardScreen);
            await loadUserVehicles(currentUserId);
        } else {
            // Lógica de logout
            allScreens.forEach(s => s.classList.add('hidden'));
            loginScreen.classList.remove('hidden');
            loginScreen.classList.add('active');
        }
    });

    // ... e assim por diante para todas as suas outras funções e listeners.
    // Lembre-se de incluir o restante do seu código JS para a funcionalidade completa.
});

// Nota: Para manter a resposta concisa, apenas a parte do script.js que precisava de
// modificação direta foi detalhada. Você deve usar este início e anexar o resto do
// seu código JS original a ele. As funções de backend (Firebase) e a lógica de
// cálculo não necessitam de alterações.