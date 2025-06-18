document.addEventListener('DOMContentLoaded', () => {
    // Referências das telas principais
    const loginScreen = document.getElementById('login-screen');
    const signupScreen = document.getElementById('signup-screen');
    const mainApp = document.getElementById('main-app');

    // Referências dos formulários de login/cadastro
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const googleLoginBtn = document.querySelector('.google-btn');

    // Referências dos elementos do cabeçalho
    const mainAppHeader = document.getElementById('main-app-header');
    const toggleThemeBtn = document.getElementById('toggle-theme-btn');
    const topNavItemsContainer = mainAppHeader.querySelector('.top-nav-items');
    const topNavItems = mainAppHeader.querySelectorAll('.top-nav-item');

    const body = document.body;

    // Elementos do Dashboard
    const vehicleList = document.getElementById('vehicle-list');
    const addVehicleBtn = document.getElementById('add-vehicle-btn');

    // Elementos das seções de conteúdo (para navegação interna do main-app)
    const dashboardScreen = document.getElementById('dashboard-screen');
    const scheduleScreen = document.getElementById('schedule-screen');
    const servicesScreen = document.getElementById('services-screen');
    const historyScreen = document.getElementById('history-screen');
    const profileScreen = document.getElementById('profile-screen');
    const vehicleDetailsScreen = document.getElementById('vehicle-details-screen');
    const backToDashboardBtn = document.getElementById('back-to-dashboard');
    const addVehicleScreen = document.getElementById('add-vehicle-screen');
    const backFromAddVehicleBtn = document.getElementById('back-from-add-vehicle');
    const addVehicleForm = document.getElementById('add-vehicle-form');

    // Referências para os campos do formulário de adicionar veículo
    const newVehicleNameInput = document.getElementById('new-vehicle-name');
    const newVehicleModelInput = document.getElementById('new-vehicle-model');
    const newVehicleKmInput = document.getElementById('new-vehicle-km');
    const newVehicleOilKmInput = document.getElementById('new-vehicle-oil-km');
    const newVehicleOilDateInput = document.getElementById('new-vehicle-oil-date');
    const newVehicleOilTypeSelect = document.getElementById('new-vehicle-oil-type');
    const newVehicleTiresKmInput = document.getElementById('new-vehicle-tires-km');
    const newVehicleTiresDateInput = document.getElementById('new-vehicle-tires-date');


    // Elementos da Tela de Detalhes do Veículo
    const detailsVehicleName = document.getElementById('details-vehicle-name');
    const editVehicleNameBtn = document.getElementById('edit-vehicle-name-btn');
    const detailsVehicleModel = document.getElementById('details-vehicle-model');
    const editVehicleModelBtn = document.getElementById('edit-vehicle-model-btn');
    const currentKmDetailsSpan = document.getElementById('current-km-details');
    const editKmDetailsBtn = document.getElementById('edit-km-details-btn');
    const kmDisplayDetailsContainer = document.querySelector('.km-display-details');
    const summaryCardsDynamic = document.getElementById('summary-cards-dynamic');

    // Elementos da Aba Histórico
    const maintenanceHistoryList = document.getElementById('maintenance-history-list');

    // Elementos da Aba Perfil
    const profileDisplayName = document.getElementById('profile-display-name');
    const profileEmail = document.getElementById('profile-email');
    const editProfileBtn = document.getElementById('edit-profile-btn');

    // Referência ao link "Esqueceu a senha?"
    const forgotPasswordLink = document.getElementById('forgot-password-link');

    // Referência ao container de toasts
    const toastContainer = document.getElementById('toast-container');

    // Referências do Modal Customizado
    const customModal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalInputGroup = document.getElementById('modal-input-group');
    const modalInputLabel = document.getElementById('modal-input-label');
    const modalInput = document.getElementById('modal-input');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const modalSaveBtn = document.getElementById('modal-save-btn');

    // Botão Sair do Perfil
    const logoutBtn = document.getElementById('logout-btn');


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


    // --- Dados de Referência de Manutenção (Padrões da Indústria) ---
    // Valores de KM e Tempo (em meses)
    const maintenanceStandards = {
        oilChange: {
            mineral: { km: 5000, months: 6 },
            semisintetico: { km: 10000, months: 12 },
            sintetico: { km: 15000, months: 12 }
        },
        tires: {
            rotation: { km: 10000, months: 6 }, // Rodízio de pneus
            change: { km: 60000, months: 60 } // Troca geral de pneus
        },
        alignment: { km: 10000, months: 6 }, // Alinhamento
        balanceamento: { km: 10000, months: 6 }, // Balanceamento
        filters: {
            oil: { km: 10000, months: 12 }, // Geralmente junto com a troca de óleo
            fuel: { km: 20000, months: 24 },
            air: { km: 15000, months: 12 }
        },
        brakes: { km: 20000, months: 24 }, // Pastilhas
        sparkPlugs: { km: 40000, months: 48 }, // Velas de ignição
        timingBelt: { km: 60000, months: 60 } // Correia dentada (exemplo)
    };

    let userVehicles = [];
    let currentSelectedVehicle = null;
    let currentUserId = null;


    // --- Funções Auxiliares de Tratamento de Números e Datas ---

    const parseLocaleNumber = (stringNumber) => {
        if (typeof stringNumber !== 'string') return NaN;
        let cleanedNumber = stringNumber.replace(/\./g, '');
        cleanedNumber = cleanedNumber.replace(/,/g, '.');
        return parseFloat(cleanedNumber);
    };

    const addMonthsToDate = (dateString, monthsToAdd) => {
        if (!dateString) return null;
        const date = new Date(dateString + 'T00:00:00');
        if (isNaN(date.getTime())) return null;

        date.setMonth(date.getMonth() + monthsToAdd);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return 'N/I';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    // Função auxiliar para capitalizar a primeira letra
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };


    // --- Funções de UI/Navegação ---

    // Mostra uma tela principal (login, cadastro, main-app)
    const showScreen = (screenToShow) => {
        const allScreens = [loginScreen, signupScreen, mainApp];
        allScreens.forEach(screen => {
            if (screen === screenToShow) {
                screen.classList.add('active');
                screen.classList.remove('hidden');
            } else {
                screen.classList.remove('active');
                screen.classList.add('hidden');
            }
        });
    };

    // Mostra uma seção de conteúdo dentro do main-app
    const showContentSection = (sectionToShow) => {
        // Ajustado o seletor para pegar as sections dentro da tag <main>
        const contentSections = document.querySelectorAll('#main-app > main > section');
        contentSections.forEach(section => {
            if (section === sectionToShow) {
                section.classList.add('active-content');
                section.classList.remove('hidden-content');
            } else {
                section.classList.remove('active-content');
                section.classList.add('hidden-content');
            }
        });

        topNavItems.forEach(item => {
            if (item.dataset.screen === sectionToShow.id) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Controla a visibilidade do KM atual na tela de detalhes
        if (kmDisplayDetailsContainer) {
            if (sectionToShow === vehicleDetailsScreen && currentSelectedVehicle) {
                kmDisplayDetailsContainer.style.display = 'flex';
            } else {
                kmDisplayDetailsContainer.style.display = 'none';
            }
        }

        // Lógica para carregar histórico e serviços quando as telas são ativadas
        if (sectionToShow === historyScreen) {
            if (currentSelectedVehicle) {
                loadMaintenanceHistory(currentSelectedVehicle.id);
            } else {
                maintenanceHistoryList.innerHTML = '<p class="no-vehicles">Selecione um veículo no Dashboard para ver seu histórico de manutenções.</p>';
            }
        }

        if (sectionToShow === servicesScreen) {
            renderServiceProviders();
        }
    };

    // Carrega os veículos do usuário do Firestore
    const loadUserVehicles = async (userId) => {
        if (!userId) {
            userVehicles = [];
            renderVehicles();
            return;
        }
        try {
            const vehiclesSnapshot = await db.collection('users').doc(userId).collection('vehicles').orderBy('name').get();
            userVehicles = vehiclesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderVehicles();
            if (userVehicles.length === 0) {
                showToast('Adicione seu primeiro veículo!', 'attention');
            }
        } catch (error) {
            console.error('Erro ao carregar veículos:', error);
            showToast('Erro ao carregar veículos. Tente novamente.', 'error');
        }
    };

    // Renderiza os cards de veículos no Dashboard
    const renderVehicles = () => {
        vehicleList.innerHTML = '';
        if (userVehicles.length === 0) {
            vehicleList.innerHTML = '<p class="no-vehicles">Nenhum veículo cadastrado. Adicione um para começar!</p>';
            return;
        }

        userVehicles.forEach(vehicle => {
            const vehicleCard = document.createElement('div');
            vehicleCard.classList.add('vehicle-card-item');
            vehicleCard.dataset.vehicleId = vehicle.id;
            vehicleCard.innerHTML = `
                <div class="vehicle-info">
                    <h3>${vehicle.name}</h3>
                    <p>${vehicle.model}</p>
                    <p>${vehicle.km.toLocaleString('pt-BR')} km</p>
                </div>
                <button class="delete-btn" data-vehicle-id="${vehicle.id}" aria-label="Remover ${vehicle.name}"><i class="fas fa-trash-alt"></i></button>
            `;
            vehicleCard.querySelector('.vehicle-info').addEventListener('click', () => {
                currentSelectedVehicle = vehicle;
                updateVehicleDetailsScreen(vehicle);
                showContentSection(vehicleDetailsScreen);
            });
            vehicleCard.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                showCustomModal({
                    title: 'Confirmar Exclusão',
                    message: `Tem certeza que deseja remover o veículo "${vehicle.name}"?`,
                    inputType: 'none',
                    onSave: () => {
                        deleteVehicle(vehicle.id, vehicle.name);
                    }
                });
            });
            vehicleList.appendChild(vehicleCard);
        });
    };

    // Remove um veículo do Firestore
    const deleteVehicle = async (vehicleId, vehicleName) => {
        if (!currentUserId) {
            showToast('Erro: Você precisa estar logado para remover um veículo.', 'error');
            return;
        }
        try {
            await db.collection('users').doc(currentUserId).collection('vehicles').doc(vehicleId).delete();
            userVehicles = userVehicles.filter(v => v.id !== vehicleId);
            renderVehicles();
            showToast(`${vehicleName} removido com sucesso!`, 'success');
            if (currentSelectedVehicle && currentSelectedVehicle.id === vehicleId) {
                showContentSection(dashboardScreen);
                currentSelectedVehicle = null;
            }
        } catch (error) {
            console.error('Erro ao remover veículo:', error);
            showToast('Erro ao remover veículo: ' + error.message, 'error');
        }
    };

    // Calcula a próxima manutenção com base nos padrões
    const calculateNextMaintenance = (typeKey, lastKm, lastDate, subTypeKey = null) => {
        let kmStandard = 0;
        let monthsStandard = 0;

        if (subTypeKey && maintenanceStandards[typeKey] && maintenanceStandards[typeKey][subTypeKey]) {
            kmStandard = maintenanceStandards[typeKey][subTypeKey].km;
            monthsStandard = maintenanceStandards[typeKey][subTypeKey].months;
        } else if (maintenanceStandards[typeKey] && maintenanceStandards[typeKey].km) {
            kmStandard = maintenanceStandards[typeKey].km;
            monthsStandard = maintenanceStandards[typeKey].months;
        } else {
            console.warn(`Padrão de manutenção para ${typeKey}${subTypeKey ? '.' + subTypeKey : ''} não encontrado. Usando padrão genérico.`);
            kmStandard = 10000;
            monthsStandard = 12;
        }

        let suggestedNextKm = (lastKm > 0) ? lastKm + kmStandard : 0;
        let suggestedNextDate = (lastDate && lastDate !== '') ? addMonthsToDate(lastDate, monthsStandard) : null;
        
        let displayString = '';
        let finalNextKm = suggestedNextKm;
        let finalNextDate = suggestedNextDate;

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const currentDay = today.getDate();

        if (lastKm === 0 && (!lastDate || lastDate === '')) {
            return { nextKm: 0, nextDate: null, display: 'Não calculado (N/I)' };
        }

        if (suggestedNextKm > 0 && suggestedNextDate) {
            const dateObj = new Date(suggestedNextDate + 'T00:00:00');
            const kmDiff = suggestedNextKm - currentSelectedVehicle.km;
            
            const msPerDay = 1000 * 60 * 60 * 24;
            const todayMs = Date.UTC(currentYear, currentMonth, currentDay);
            const suggestedDateMs = Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());

            const daysUntilSuggestedDate = Math.ceil((suggestedDateMs - todayMs) / msPerDay);

            if (isFinite(kmDiff) && kmDiff <= 0 && isFinite(daysUntilSuggestedDate) && daysUntilSuggestedDate <= 0) {
                displayString = `VENCIDO (KM e Data)! Sug.: ${suggestedNextKm.toLocaleString('pt-BR')} km ou ${formatDateForDisplay(suggestedNextDate)}`;
            } else if (isFinite(kmDiff) && kmDiff <= 0) {
                 displayString = `VENCIDO (KM)! Sug.: ${suggestedNextKm.toLocaleString('pt-BR')} km`;
            } else if (isFinite(daysUntilSuggestedDate) && daysUntilSuggestedDate <= 0) {
                 displayString = `VENCIDO (Data)! Sug.: ${formatDateForDisplay(suggestedNextDate)}`;
            } else {
                if (daysUntilSuggestedDate < (kmDiff / 100)) {
                     displayString = `Sug.: ${suggestedNextKm.toLocaleString('pt-BR')} km ou ${formatDateForDisplay(suggestedNextDate)}`;
                } else {
                     displayString = `Sug.: ${suggestedNextKm.toLocaleString('pt-BR')} km ou ${formatDateForDisplay(suggestedNextDate)}`;
                }
            }
        } else if (suggestedNextKm > 0) {
            displayString = `Sug.: ${suggestedNextKm.toLocaleString('pt-BR')} km`;
            finalNextDate = null;
        } else if (suggestedNextDate) {
            displayString = `Sug.: ${formatDateForDisplay(suggestedNextDate)}`;
            finalNextKm = 0;
        } else {
            displayString = 'Não calculado (N/I)';
            finalNextKm = 0;
            finalNextDate = null;
        }

        return {
            nextKm: finalNextKm,
            nextDate: finalNextDate,
            display: displayString
        };
    };

    // Atualiza a tela de detalhes do veículo
    const updateVehicleDetailsScreen = (vehicle) => {
        detailsVehicleName.textContent = vehicle.name;
        detailsVehicleModel.textContent = vehicle.model;
        currentKmDetailsSpan.textContent = vehicle.km.toLocaleString('pt-BR');

        // Calcula e exibe informações da troca de óleo
        const oilChangeCalc = calculateNextMaintenance('oilChange', vehicle.maintenances.oilChange.lastKm, vehicle.maintenances.oilChange.lastDate, vehicle.maintenances.oilChange.oilType);
        document.getElementById('oil-last-km').textContent = vehicle.maintenances.oilChange.lastKm !== 0 ? `${vehicle.maintenances.oilChange.lastKm.toLocaleString('pt-BR')} km` : 'Não informado';
        document.getElementById('oil-last-date').textContent = vehicle.maintenances.oilChange.lastDate ? formatDateForDisplay(vehicle.maintenances.oilChange.lastDate) : 'Não informado';
        document.getElementById('oil-type-brand').textContent = vehicle.maintenances.oilChange.oilType ? `${capitalizeFirstLetter(vehicle.maintenances.oilChange.oilType)}` : 'Não informado';
        document.getElementById('oil-next-change').textContent = oilChangeCalc.display;

        // Calcula e exibe informações dos pneus
        const tiresRotationCalc = calculateNextMaintenance('tires', vehicle.maintenances.tires.lastKm, vehicle.maintenances.tires.lastDate, 'rotation');
        const tiresChangeCalc = calculateNextMaintenance('tires', vehicle.maintenances.tires.lastKm, vehicle.maintenances.tires.lastDate, 'change');
        document.getElementById('pneus-last-km').textContent = vehicle.maintenances.tires.lastKm !== 0 ? `${vehicle.maintenances.tires.lastKm.toLocaleString('pt-BR')} km` : 'Não informado';
        document.getElementById('pneus-last-date').textContent = vehicle.maintenances.tires.lastDate ? formatDateForDisplay(vehicle.maintenances.tires.lastDate) : 'Não informado';
        document.getElementById('pneus-rotation-suggested').textContent = tiresRotationCalc.display;
        document.getElementById('pneus-next-change').textContent = tiresChangeCalc.display + ' (Troca Geral)';

        // Calcula e exibe informações de alinhamento e balanceamento
        const alignmentCalc = calculateNextMaintenance('alignment', vehicle.maintenances.alignment.lastKm, vehicle.maintenances.alignment.lastDate);
        const balanceamentoCalc = calculateNextMaintenance('balanceamento', vehicle.maintenances.balanceamento.lastKm, vehicle.maintenances.balanceamento.lastDate);
        document.getElementById('alignment-last-km').textContent = vehicle.maintenances.alignment.lastKm !== 0 ? `${vehicle.maintenances.alignment.lastKm.toLocaleString('pt-BR')} km` : 'Não informado';
        document.getElementById('alignment-last-date').textContent = vehicle.maintenances.alignment.lastDate ? `${formatDateForDisplay(vehicle.maintenances.alignment.lastDate)}` : 'Não informado';
        document.getElementById('alignment-next').textContent = alignmentCalc.display;
        document.getElementById('balanceamento-last-km').textContent = vehicle.maintenances.balanceamento.lastKm !== 0 ? `${vehicle.maintenances.balanceamento.lastKm.toLocaleString('pt-BR')} km` : 'Não informado';
        document.getElementById('balanceamento-last-date').textContent = vehicle.maintenances.balanceamento.lastDate !== 0 ? `${formatDateForDisplay(vehicle.maintenances.balanceamento.lastDate)}` : 'Não informado';
        document.getElementById('balanceamento-next').textContent = balanceamentoCalc.display;

        // Calcula e exibe informações dos filtros
        const filterOilCalc = calculateNextMaintenance('filters', vehicle.maintenances.filterOil.lastKm, vehicle.maintenances.filterOil.lastDate, 'oil');
        const filterFuelCalc = calculateNextMaintenance('filters', vehicle.maintenances.filterFuel.lastKm, vehicle.maintenances.filterFuel.lastDate, 'fuel');
        const filterAirCalc = calculateNextMaintenance('filters', vehicle.maintenances.filterAir.lastKm, vehicle.maintenances.filterAir.lastDate, 'air');

        document.getElementById('filter-oil-last-km').textContent =
            vehicle.maintenances.filterOil.lastKm !== 0
                ? `${vehicle.maintenances.filterOil.lastKm.toLocaleString('pt-BR')} km`
                : 'Não informado';
        document.getElementById('filter-oil-last-date').textContent =
            vehicle.maintenances.filterOil.lastDate
                ? formatDateForDisplay(vehicle.maintenances.filterOil.lastDate)
                : 'Não informado';
        document.getElementById('filter-oil-next').textContent = filterOilCalc.display;

        document.getElementById('filter-fuel-last-km').textContent =
            vehicle.maintenances.filterFuel.lastKm !== 0
                ? `${vehicle.maintenances.filterFuel.lastKm.toLocaleString('pt-BR')} km`
                : 'Não informado';
        document.getElementById('filter-fuel-last-date').textContent =
            vehicle.maintenances.filterFuel.lastDate
                ? formatDateForDisplay(vehicle.maintenances.filterFuel.lastDate)
                : 'Não informado';
        document.getElementById('filter-fuel-next').textContent = filterFuelCalc.display;

        document.getElementById('filter-air-last-km').textContent =
            vehicle.maintenances.filterAir.lastKm !== 0
                ? `${vehicle.maintenances.filterAir.lastKm.toLocaleString('pt-BR')} km`
                : 'Não informado';
        document.getElementById('filter-air-last-date').textContent =
            vehicle.maintenances.filterAir.lastDate
                ? formatDateForDisplay(vehicle.maintenances.filterAir.lastDate)
                : 'Não informado';
        document.getElementById('filter-air-next').textContent = filterAirCalc.display;

    
        // Renderiza os cards de resumo de manutenção
        renderMaintenanceSummaryCards(vehicle.km, {
            oilChange: { lastKm: vehicle.maintenances.oilChange.lastKm, nextKm: oilChangeCalc.nextKm, nextDate: oilChangeCalc.nextDate },
            tires: { lastKm: vehicle.maintenances.tires.lastKm, rotationSuggestedKm: tiresRotationCalc.nextKm, rotationSuggestedDate: tiresRotationCalc.nextDate },
            alignment: { lastKm: vehicle.maintenances.alignment.lastKm, nextKm: alignmentCalc.nextKm, nextDate: alignmentCalc.nextDate },
            filterAir: { lastKm: vehicle.maintenances.filterAir.lastKm, nextKm: filterAirCalc.nextKm, nextDate: filterAirCalc.nextDate }
        });

        attachMaintenanceEditListeners();
    };

    // Renderiza os cards de resumo de manutenção (óleo, pneus, etc.)
    const renderMaintenanceSummaryCards = (currentVehicleKm, calculatedMaintenances) => {
        summaryCardsDynamic.innerHTML = '';

        const getStatusClass = (currentKm, nextKm, nextDate) => {
            const today = new Date();
            const nextDateObj = nextDate ? new Date(nextDate + 'T00:00:00') : null;

            const isKmOverdue = (nextKm !== 0 && currentKm >= nextKm);
            const isDateOverdue = (nextDateObj && today >= nextDateObj);

            const kmDifference = nextKm - currentKm;
            const daysDifference = nextDateObj ? Math.ceil((nextDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : Infinity;

            const isKmAttention = (nextKm !== 0 && kmDifference <= 1000 && kmDifference > 0);
            const isDateAttention = (nextDateObj && daysDifference <= 30 && daysDifference > 0);

            if (isKmOverdue || isDateOverdue) {
                return 'status-overdue';
            }
            if (isKmAttention || isDateAttention) {
                return 'status-attention';
            }
            return 'status-ok';
        };
        
        const getNextDisplayValue = (nextKm, nextDate) => {
            let display = [];
            if (nextKm > 0) {
                display.push(`${nextKm.toLocaleString('pt-BR')} km`);
            }
            if (nextDate && nextDate !== '') {
                display.push(formatDateForDisplay(nextDate));
            }
            if (display.length === 0) return 'Não calculado';
            return `Próxima: ${display.join(' ou ')}`;
        };

        const maintenanceItems = [
            {
                type: 'Troca de Óleo',
                icon: 'fas fa-oil-can',
                lastValue: calculatedMaintenances.oilChange.lastKm,
                nextKm: calculatedMaintenances.oilChange.nextKm,
                nextDate: calculatedMaintenances.oilChange.nextDate,
                unit: 'km'
            },
            {
                type: 'Pneus (Rodízio)',
                icon: 'fas fa-tire',
                lastValue: calculatedMaintenances.tires.lastKm,
                nextKm: calculatedMaintenances.tires.rotationSuggestedKm,
                nextDate: calculatedMaintenances.tires.rotationSuggestedDate,
                unit: 'km'
            },
            {
                type: 'Alinhamento',
                icon: 'fas fa-align-center',
                lastValue: calculatedMaintenances.alignment.lastKm,
                nextKm: calculatedMaintenances.alignment.nextKm,
                nextDate: calculatedMaintenances.alignment.nextDate,
                unit: 'km'
            },
            {
                type: 'Filtro de Ar',
                icon: 'fas fa-filter',
                lastValue: calculatedMaintenances.filterAir.lastKm,
                nextKm: calculatedMaintenances.filterAir.nextKm,
                nextDate: calculatedMaintenances.filterAir.nextDate,
                unit: 'km'
            }
        ];

        maintenanceItems.forEach(item => {
            const statusClass = getStatusClass(currentVehicleKm, item.nextKm, item.nextDate);
            summaryCardsDynamic.innerHTML += `
                <div class="card summary-card ${statusClass}">
                    <i class="${item.icon} icon"></i>
                    <div class="card-content">
                        <h3>${item.type}</h3>
                        <p>Última: ${item.lastValue !== 0 ? item.lastValue.toLocaleString('pt-BR') + ' ' + item.unit : 'N/I'}</p>
                        <p>${getNextDisplayValue(item.nextKm, item.nextDate)}</p>
                    </div>
                </div>
            `;
        });
    };

    // Exibe um toast (notificação flutuante)
    const showToast = (message, type, duration = 3000) => {
        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        toast.innerHTML = `<i class="icon fas ${getToastIcon(type)}"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        void toast.offsetWidth; // Força reflow para a transição
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');

            toast.addEventListener('transitionend', () => {
                toast.remove();
            }, { once: true });
        }, duration);
    };

    const getToastIcon = (type) => {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-times-circle';
            case 'attention': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    };

    // Mostra o modal customizado com opções de input/confirmação
    const showCustomModal = ({ title, message, inputType = 'text', inputLabel, inputValue = '', onSave, onCancel }) => {
        modalTitle.textContent = title;
        modalMessage.textContent = message || '';

        if (inputType === 'none') {
            modalInputGroup.style.display = 'none';
        } else {
            modalInputGroup.style.display = 'block';
            modalInputLabel.textContent = inputLabel || '';
            modalInput.type = inputType;
            modalInput.value = (typeof inputValue === 'number' || inputType === 'text') ? inputValue.toString() : inputValue;
            modalInput.focus();
            if (inputType !== 'date') {
                modalInput.select();
            }
        }

        customModal.classList.add('show');
        
        modalSaveBtn.onclick = null;
        modalCancelBtn.onclick = null;

        modalSaveBtn.onclick = () => {
            const inputValueFromModal = (inputType === 'none') ? true : modalInput.value;
            hideCustomModal();
            onSave(inputValueFromModal);
        };

        modalCancelBtn.onclick = () => {
            hideCustomModal();
            if (onCancel) onCancel();
        };
    };

    const hideCustomModal = () => {
        customModal.classList.remove('show');
        modalInput.value = '';
    };

    // Anexa listeners de edição para as manutenções detalhadas
    const attachMaintenanceEditListeners = () => {
        const editButtons = document.querySelectorAll('.maintenance-item .edit-btn');

        editButtons.forEach(button => {
            // Remove listener anterior para evitar duplicidade
            if (button._listenerFn) {
                button.removeEventListener('click', button._listenerFn);
            }
            
            const maintenanceType = button.dataset.maintenanceType;
            const fieldName = button.dataset.fieldName;
            const label = button.dataset.label;
            
            const listenerFn = (e) => handleMaintenanceEdit(maintenanceType, fieldName, label);
            button.addEventListener('click', listenerFn);
            button._listenerFn = listenerFn; // Armazena a função para remoção futura
        });
    };

    // Lida com a edição de um campo de manutenção via modal
    const handleMaintenanceEdit = async (maintenanceType, fieldName, displayLabel) => {
        if (!currentSelectedVehicle || !currentUserId) {
            showToast('Erro: Você precisa estar logado e ter um veículo selecionado para atualizar.', 'error');
            return;
        }

        let currentMaintenanceValue = currentSelectedVehicle.maintenances[maintenanceType][fieldName];
        let inputModality = 'text';
        let currentInputValue = currentMaintenanceValue || '';

        if (fieldName.toLowerCase().includes('km')) {
            inputModality = 'number';
            currentInputValue = currentMaintenanceValue !== 0 ? currentMaintenanceValue : '';
        } else if (fieldName.toLowerCase().includes('date')) {
            inputModality = 'date';
            currentInputValue = currentMaintenanceValue || '';
        } else {
            inputModality = 'text';
            currentInputValue = currentMaintenanceValue || '';
        }
        
        const editableFields = ['lastKm', 'lastDate', 'oilType'];
        if (!editableFields.includes(fieldName)) {
            showToast(`"${displayLabel}" é calculado automaticamente e não pode ser editado diretamente.`, 'attention');
            return;
        }

        showCustomModal({
            title: `Editar ${displayLabel}`,
            inputLabel: 'Valor:',
            inputType: inputModality,
            inputValue: currentInputValue,
            onSave: async (newValue) => {
                let isValid = true;
                let parsedValue = newValue;

                if (inputModality === 'number') {
                    parsedValue = parseInt(newValue);
                    if (isNaN(parsedValue) || parsedValue < 0) {
                        isValid = false;
                        showToast(`Valor inválido para ${displayLabel}. Por favor, insira um número inteiro válido (positivo).`, 'error');
                    }
                } else if (inputModality === 'date') {
                    if (!/^\d{4}-\d{2}-\d{2}$/.test(newValue)) {
                        isValid = false;
                        showToast(`Data inválida para ${displayLabel}. Use o formato AAAA-MM-DD.`, 'error');
                    }
                }
                if (maintenanceType === 'oilChange' && fieldName === 'oilType' && newValue.trim() === '') {
                    isValid = false;
                    showToast(`O tipo de óleo não pode ser vazio.`, 'error');
                }


                if (isValid) {
                    try {
                        const updatePath = `maintenances.${maintenanceType}.${fieldName}`;
                        await db.collection('users').doc(currentUserId).collection('vehicles').doc(currentSelectedVehicle.id).update({
                            [updatePath]: parsedValue
                        });
                        currentSelectedVehicle.maintenances[maintenanceType][fieldName] = parsedValue;
                        updateVehicleDetailsScreen(currentSelectedVehicle);
                        showToast(`${displayLabel} atualizado!`, 'success');
                    } catch (error) {
                        console.error('Erro ao atualizar manutenção:', error);
                        showToast('Erro ao atualizar manutenção: ' + error.message, 'error');
                    }
                }
            },
            onCancel: () => {
                showToast(`Edição de ${displayLabel} cancelada.`, 'attention');
            }
        });
    };

    // Mapeia códigos de erro do Firebase para mensagens amigáveis
    const getFirebaseErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 'auth/invalid-email': return 'Email inválido.';
            case 'auth/user-disabled': return 'Usuário desabilitado.';
            case 'auth/user-not-found': return 'Usuário não encontrado. Crie uma conta.';
            case 'auth/wrong-password': return 'Senha incorreta.';
            case 'auth/email-already-in-use': return 'Este email já está em uso.';
            case 'auth/weak-password': return 'Senha muito fraca. Mínimo de 6 caracteres.';
            case 'auth/operation-not-allowed': return 'Operação não permitida.';
            default: return 'Ocorreu um erro. Tente novamente.';
        }
    };

    // Carrega e exibe o histórico de manutenções para um veículo específico
    const loadMaintenanceHistory = async (vehicleId) => {
        maintenanceHistoryList.innerHTML = '';

        if (!currentUserId || !vehicleId) {
            maintenanceHistoryList.innerHTML = '<p class="no-vehicles">Selecione um veículo para ver seu histórico.</p>';
            return;
        }

        try {
            const vehicleDoc = await db.collection('users').doc(currentUserId).collection('vehicles').doc(vehicleId).get();
            if (!vehicleDoc.exists) {
                maintenanceHistoryList.innerHTML = '<p class="no-vehicles">Veículo não encontrado.</p>';
                return;
            }

            const vehicleData = vehicleDoc.data();
            const maintenances = vehicleData.maintenances || {};
            const historyItems = [];

            for (const type in maintenances) {
                const maintenance = maintenances[type];
                if ((maintenance.lastKm && maintenance.lastKm !== 0) || (maintenance.lastDate && maintenance.lastDate !== '')) {
                    let details = [];
                    if (maintenance.lastKm && maintenance.lastKm !== 0) {
                        details.push(`KM: ${maintenance.lastKm.toLocaleString('pt-BR')}`);
                    }
                    if (maintenance.oilType) {
                        details.push(`Tipo de Óleo: ${capitalizeFirstLetter(maintenance.oilType)}`);
                    }

                    const eventDate = maintenance.lastDate || '2000-01-01'; // Fallback para ordenação se não houver data

                    historyItems.push({
                        date: eventDate,
                        type: type,
                        details: details.join(', ')
                    });
                }
            }

            if (historyItems.length === 0) {
                maintenanceHistoryList.innerHTML = '<p class="no-vehicles">Nenhum histórico de manutenção encontrado para este veículo.</p>';
                return;
            }

            historyItems.sort((a, b) => new Date(b.date) - new Date(a.date));

            historyItems.forEach(item => {
                const historyCard = document.createElement('div');
                historyCard.classList.add('history-item', 'card');
                let displayType = capitalizeFirstLetter(item.type.replace(/([A-Z])/g, ' $1'));
                switch (item.type) {
                    case 'oilChange': displayType = 'Troca de Óleo'; break;
                    case 'tires': displayType = 'Manutenção de Pneus'; break;
                    case 'alignment': displayType = 'Alinhamento'; break;
                    case 'balanceamento': displayType = 'Balanceamento'; break;
                    case 'filterOil': displayType = 'Troca Filtro de Óleo'; break;
                    case 'filterFuel': displayType = 'Troca Filtro de Combustível'; break;
                    case 'filterAir': displayType = 'Troca Filtro de Ar'; break;
                    case 'brakes': displayType = 'Manutenção de Freios'; break;
                    case 'sparkPlugs': displayType = 'Troca de Velas'; break;
                    case 'timingBelt': displayType = 'Troca de Correia Dentada'; break;
                    case 'coolant': displayType = 'Troca Fluido de Arrefecimento'; break;
                }

                historyCard.innerHTML = `
                    <span class="history-date">${formatDateForDisplay(item.date)}</span>
                    <span class="history-type">${displayType}</span>
                    <span class="history-details">${item.details}</span>
                `;
                maintenanceHistoryList.appendChild(historyCard);
            });

        } catch (error) {
            console.error('Erro ao carregar histórico de manutenções:', error);
            showToast('Erro ao carregar histórico. Tente novamente.', 'error');
        }
    };

    // --- Services Screen Logic ---
    const serviceProviders = [
        {
            name: "Borracharia Móvel do Neguinho",
            phone: "(44) 99949-6361",
            address: "Atendimento Móvel em Maringá - PR",
            hours: "08:00 às 18:00",
            website: null,
            whatsapp: "5544999496361",
            image: "https://iili.io/FnTQzOB.png",
            type: "Móvel",
            branch: "Borracharia",
            city: "Maringá",
            state: "PR"
        },
        // Adicionar mais prestadores de serviço aqui
    ];

    const serviceTypeFilter = document.getElementById('service-type-filter');
    const serviceBranchFilter = document.getElementById('service-branch-filter');
    const serviceStateFilter = document.getElementById('service-state-filter');
    const serviceCityFilter = document.getElementById('service-city-filter');
    const serviceProvidersList = document.getElementById('service-providers-list');
    const serviceDetailsModal = document.getElementById('service-details-modal');
    const serviceDetailsCloseBtn = document.getElementById('service-details-close-btn');

    const renderServiceProviders = () => {
        const filteredProviders = serviceProviders.filter(provider => {
            const matchesType = !serviceTypeFilter.value || provider.type === serviceTypeFilter.value;
            const matchesBranch = !serviceBranchFilter.value || provider.branch === serviceBranchFilter.value;
            const matchesState = !serviceStateFilter.value || provider.state.toLowerCase().includes(serviceStateFilter.value.toLowerCase());
            const matchesCity = !serviceCityFilter.value || provider.city.toLowerCase().includes(serviceCityFilter.value.toLowerCase());
            return matchesType && matchesBranch && matchesState && matchesCity;
        });

        serviceProvidersList.innerHTML = '';
        if (filteredProviders.length === 0) {
            serviceProvidersList.innerHTML = '<p class="no-vehicles">Nenhum prestador de serviço encontrado com os filtros selecionados.</p>';
            return;
        }

        filteredProviders.forEach(provider => {
            const serviceCard = document.createElement('div');
            serviceCard.classList.add('service-card');
            serviceCard.innerHTML = `
                <img src="${provider.image}" alt="${provider.name}">
                <h3>${provider.name}</h3>
                <p>${provider.branch} - ${provider.city}, ${provider.state}</p>
            `;
            serviceCard.addEventListener('click', () => showServiceDetails(provider));
            serviceProvidersList.appendChild(serviceCard);
        });
    };

    const showServiceDetails = (provider) => {
        document.getElementById('service-details-name').textContent = provider.name;
        document.getElementById('service-details-phone').textContent = provider.phone;
        document.getElementById('service-details-address').textContent = provider.address;
        document.getElementById('service-details-hours').textContent = provider.hours;

        const websiteLink = document.getElementById('service-details-website');
        if (provider.website) {
            websiteLink.textContent = provider.website;
            websiteLink.href = provider.website.startsWith('http') ? provider.website : `http://${provider.website}`;
            websiteLink.style.display = 'inline';
        } else {
            websiteLink.textContent = 'Não tem';
            websiteLink.href = '#';
            websiteLink.style.display = 'inline'; // Manter visível mesmo se não houver site
        }

        const whatsappLink = document.getElementById('service-details-whatsapp');
        if (provider.whatsapp) {
            whatsappLink.href = `https://wa.me/${provider.whatsapp}`;
            whatsappLink.style.display = 'inline-flex';
        } else {
            whatsappLink.style.display = 'none';
        }
        serviceDetailsModal.classList.add('show');
    };

    serviceDetailsCloseBtn.addEventListener('click', () => {
        serviceDetailsModal.classList.remove('show');
    });

    // Event listeners para os filtros
    serviceTypeFilter.addEventListener('change', renderServiceProviders);
    serviceBranchFilter.addEventListener('change', renderServiceProviders);
    serviceStateFilter.addEventListener('input', renderServiceProviders);
    serviceCityFilter.addEventListener('input', renderServiceProviders);


    // --- Event Handlers ---

    // Lida com o formulário de login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            currentUserId = userCredential.user.uid;
            showToast('Login bem-sucedido!', 'success');
            showScreen(mainApp);
            showContentSection(dashboardScreen);
            loadUserVehicles(currentUserId);
        } catch (error) {
            console.error('Erro no login:', error);
            showToast('Erro no login: ' + getFirebaseErrorMessage(error.code), 'error');
        }
    });

    // Lida com o formulário de cadastro
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        if (password !== confirmPassword) {
            showToast('As senhas não coincidem!', 'error');
            return;
        }

        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            currentUserId = userCredential.user.uid;
            await db.collection('users').doc(currentUserId).set({
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            showToast('Cadastro realizado com sucesso! Faça login.', 'success');
            showScreen(loginScreen);
        } catch (error) {
            console.error('Erro no cadastro:', error);
            showToast('Erro no cadastro: ' + getFirebaseErrorMessage(error.code), 'error');
        }
    });

    // Navegação entre telas de login e cadastro
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen(signupScreen);
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen(loginScreen);
    });

    // Login com Google
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            try {
                const userCredential = await auth.signInWithPopup(provider);
                currentUserId = userCredential.user.uid;
                const userDocRef = db.collection('users').doc(currentUserId);
                const userDoc = await userDocRef.get();
                if (!userDoc.exists) {
                    await userDocRef.set({
                        email: userCredential.user.email,
                        displayName: userCredential.user.displayName,
                        photoURL: userCredential.user.photoURL,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
                showToast('Login com Google bem-sucedido!', 'success');
                showScreen(mainApp);
                showContentSection(dashboardScreen);
                loadUserVehicles(currentUserId);
            } catch (error) {
                console.error('Erro no login com Google:', error);
                showToast('Erro no login com Google: ' + getFirebaseErrorMessage(error.code), 'error');
            }
        });
    }

    // Event listener para o link "Esqueceu a senha?"
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            showCustomModal({
                title: 'Recuperar Senha',
                message: 'Por favor, insira seu e-mail cadastrado para receber um link de redefinição de senha.',
                inputLabel: 'E-mail:',
                inputType: 'email',
                inputValue: '',
                onSave: async (email) => {
                    const trimmedEmail = email.trim();
                    if (trimmedEmail) {
                        try {
                            await auth.sendPasswordResetEmail(trimmedEmail);
                            showToast('Se o e-mail estiver cadastrado, um link de redefinição de senha foi enviado.', 'success');
                        } catch (error) {
                            console.error('Erro ao enviar e-mail de redefinição:', error);
                            showToast('Erro ao tentar enviar e-mail de redefinição. Por favor, verifique o e-mail e tente novamente.', 'error');
                        }
                    } else {
                        showToast('Por favor, insira um e-mail.', 'attention');
                    }
                },
                onCancel: () => {
                    showToast('Recuperação de senha cancelada.', 'attention');
                }
            });
        });
    }

    // Event listener para o botão de edição do nome do veículo
    if (editVehicleNameBtn) {
        editVehicleNameBtn.addEventListener('click', () => {
            if (!currentSelectedVehicle || !currentUserId) {
                showToast('Erro: Nenhum veículo selecionado ou usuário não logado.', 'error');
                return;
            }

            showCustomModal({
                title: 'Editar Nome do Veículo',
                inputLabel: 'Novo nome:',
                inputType: 'text',
                inputValue: currentSelectedVehicle.name,
                onSave: async (newName) => {
                    const trimmedName = newName.trim();
                    if (trimmedName) {
                        try {
                            await db.collection('users').doc(currentUserId).collection('vehicles').doc(currentSelectedVehicle.id).update({
                                name: trimmedName
                            });
                            currentSelectedVehicle.name = trimmedName;
                            updateVehicleDetailsScreen(currentSelectedVehicle);
                            renderVehicles(); // Atualiza o card no dashboard
                            showToast('Nome do veículo atualizado com sucesso!', 'success');
                        } catch (error) {
                            console.error('Erro ao atualizar nome do veículo:', error);
                            showToast('Erro ao atualizar nome: ' + error.message, 'error');
                        }
                    } else {
                        showToast('O nome do veículo não pode ser vazio.', 'attention');
                    }
                },
                onCancel: () => {
                    showToast('Edição do nome do veículo cancelada.', 'attention');
                }
            });
        });
    }

    // Event listener para o botão de edição do modelo do veículo
    if (editVehicleModelBtn) {
        editVehicleModelBtn.addEventListener('click', () => {
            if (!currentSelectedVehicle || !currentUserId) {
                showToast('Erro: Nenhum veículo selecionado ou usuário não logado.', 'error');
                return;
            }

            showCustomModal({
                title: 'Editar Modelo do Veículo',
                inputLabel: 'Novo modelo:',
                inputType: 'text',
                inputValue: currentSelectedVehicle.model,
                onSave: async (newModel) => {
                    const trimmedModel = newModel.trim();
                    if (trimmedModel) {
                        try {
                            await db.collection('users').doc(currentUserId).collection('vehicles').doc(currentSelectedVehicle.id).update({
                                model: trimmedModel
                            });
                            currentSelectedVehicle.model = trimmedModel;
                            updateVehicleDetailsScreen(currentSelectedVehicle);
                            renderVehicles(); // Atualiza o card no dashboard
                            showToast('Modelo do veículo atualizado com sucesso!', 'success');
                        } catch (error) {
                            console.error('Erro ao atualizar modelo do veículo:', error);
                            showToast('Erro ao atualizar modelo: ' + error.message, 'error');
                        }
                    } else {
                        showToast('O modelo do veículo não pode ser vazio.', 'attention');
                    }
                },
                onCancel: () => {
                    showToast('Edição do modelo do veículo cancelada.', 'attention');
                }
            });
        });
    }

    // Atualizar KM no cabeçalho de detalhes do veículo
    editKmDetailsBtn.addEventListener('click', () => {
        if (!currentSelectedVehicle || !currentUserId) {
            showToast('Erro: Você precisa estar logado e ter um veículo selecionado para atualizar o KM.', 'error');
            return;
        }

        showCustomModal({
            title: `Atualizar KM do ${currentSelectedVehicle.name}`,
            inputLabel: 'Novo KM atual:',
            inputType: 'number',
            inputValue: currentSelectedVehicle.km,
            onSave: async (newKmValue) => {
                const parsedKm = parseInt(newKmValue);
                if (!isNaN(parsedKm) && parsedKm >= 0) {
                    try {
                        await db.collection('users').doc(currentUserId).collection('vehicles').doc(currentSelectedVehicle.id).update({
                            km: parsedKm
                        });
                        currentSelectedVehicle.km = parsedKm;
                        updateVehicleDetailsScreen(currentSelectedVehicle);
                        renderVehicles();
                        showToast('KM atualizado para: ' + parsedKm.toLocaleString('pt-BR'), 'success');
                    } catch (error) {
                        console.error('Erro ao atualizar KM:', error);
                        showToast('Erro ao atualizar KM: ' + error.message, 'error');
                    }
                } else {
                    showToast('KM inválido. Por favor, insira um número inteiro válido (apenas dígitos).', 'error');
                }
            },
            onCancel: () => {
                showToast('Atualização de KM cancelada.', 'attention');
            }
        });
    });

    // Alternar tema
    const handleThemeToggle = () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
        updateThemeIcon();
    };

    const updateThemeIcon = () => {
        if (toggleThemeBtn) {
            if (body.classList.contains('dark-mode')) {
                toggleThemeBtn.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                toggleThemeBtn.innerHTML = '<i class="fas fa-moon"></i>';
            }
        }
    };

    // Lida com o clique nos itens de navegação superior
    const handleTopNavClick = (e) => {
        const targetItem = e.target.closest('.top-nav-item');
        if (targetItem) {
            e.preventDefault();
            const screenId = targetItem.dataset.screen;
            let screenToShow;

            switch (screenId) {
                case 'dashboard-screen':
                    screenToShow = dashboardScreen;
                    break;
                case 'schedule-screen':
                    screenToShow = scheduleScreen;
                    break;
                case 'services-screen':
                    screenToShow = servicesScreen;
                    break;
                case 'history-screen':
                    screenToShow = historyScreen;
                    break;
                case 'profile-screen':
                    screenToShow = profileScreen;
                    break;
                default:
                    screenToShow = dashboardScreen;
            }
            showContentSection(screenToShow);
        }
    };

    // Botão Voltar para o Dashboard na tela de detalhes do veículo
    backToDashboardBtn.addEventListener('click', () => {
        showContentSection(dashboardScreen);
        currentSelectedVehicle = null;
        if (kmDisplayDetailsContainer) {
             kmDisplayDetailsContainer.style.display = 'none';
        }
    });

    // Botão Adicionar Novo Veículo no Dashboard
    addVehicleBtn.addEventListener('click', () => {
        showContentSection(addVehicleScreen);
        addVehicleForm.reset();
    });

    // Botão Voltar do formulário de adicionar veículo
    backFromAddVehicleBtn.addEventListener('click', () => {
        showContentSection(dashboardScreen);
    });

    // Lida com o formulário de adicionar veículo
    addVehicleForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!currentUserId) {
            showToast('Erro: Você precisa estar logado para adicionar um veículo.', 'error');
            return;
        }

        const vehicleName = newVehicleNameInput.value.trim();
        const vehicleModel = newVehicleModelInput.value.trim();
        const vehicleKm = parseInt(newVehicleKmInput.value);

        if (!vehicleName || !vehicleModel || isNaN(vehicleKm) || vehicleKm < 0) {
            showToast('Por favor, preencha o nome, modelo e KM atual do veículo.', 'attention');
            return;
        }

        const oilKm = newVehicleOilKmInput.value ? parseInt(newVehicleOilKmInput.value) : 0;
        const oilDate = newVehicleOilDateInput.value || '';
        const oilType = newVehicleOilTypeSelect.value || '';

        const tiresKm = newVehicleTiresKmInput.value ? parseInt(newVehicleTiresKmInput.value) : 0;
        const tiresDate = newVehicleTiresDateInput.value || '';

        const newVehicleData = {
            name: vehicleName,
            model: vehicleModel,
            km: vehicleKm,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            maintenances: {
                oilChange: { lastKm: oilKm, lastDate: oilDate, oilType: oilType },
                tires: { lastKm: tiresKm, lastDate: tiresDate },
                alignment: { lastKm: 0, lastDate: '' },
                balanceamento: { lastKm: 0, lastDate: '' },
                filterOil: { lastKm: 0, lastDate: '' },
                filterFuel: { lastKm: 0, lastDate: '' },
                filterAir: { lastKm: 0, lastDate: '' }
            }
        };

        try {
            await db.collection('users').doc(currentUserId).collection('vehicles').add(newVehicleData);
            showToast('Veículo adicionado com sucesso!', 'success');
            addVehicleForm.reset();
            showContentSection(dashboardScreen);
            loadUserVehicles(currentUserId);
        } catch (error) {
            console.error('Erro ao adicionar veículo:', error);
            showToast('Erro ao adicionar veículo: ' + error.message, 'error');
        }
    });

    // Lida com o cálculo de KM rodado
    calculateKmBtn.addEventListener('click', () => {
        const startDateStr = kmStartDateInput.value;
        const endDateStr = kmEndDateInput.value;
        const startKm = parseLocaleNumber(kmStartInput.value);
        const endKm = parseLocaleNumber(kmEndInput.value);

        if (!startDateStr || !endDateStr || isNaN(startKm) || isNaN(endKm) || startKm < 0 || endKm < 0 || startKm >= endKm) {
            showToast('Por favor, preencha todos os campos corretamente (KM válidos e final maior que inicial).', 'attention');
            return;
        }

        const startDate = new Date(startDateStr + 'T00:00:00');
        const endDate = new Date(endDateStr + 'T00:00:00');

        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const kmRodado = endKm - startKm;

        let dailyAvg = 0;
        let monthlyAvg = 0;

        if (diffDays > 0) {
            dailyAvg = kmRodado / diffDays;
            monthlyAvg = dailyAvg * (365.25 / 12);
        }

        kmResultDiv.innerHTML = `
            KM Rodados: ${kmRodado.toLocaleString('pt-BR')} km<br>
            Média Diária: ${dailyAvg.toFixed(2).toLocaleString('pt-BR')} km<br>
            Média Mensal: ${monthlyAvg.toFixed(2).toLocaleString('pt-BR')} km
        `;
        showToast('Cálculo de KM rodado realizado!', 'success');
    });

    // Lida com o cálculo de KM por Litro
    calculateKmlBtn.addEventListener('click', () => {
        const km = parseLocaleNumber(kmlKmInput.value);
        const liters = parseLocaleNumber(kmlLitersInput.value);
        const pricePerLiter = parseLocaleNumber(kmlPriceInput.value);

        if (isNaN(km) || isNaN(liters) || isNaN(pricePerLiter) || km < 0 || liters <= 0 || pricePerLiter <= 0) {
            showToast('Por favor, preencha todos os campos corretamente com números válidos e positivos.', 'attention');
            return;
        }

        const kml = km / liters;
        const costPerKm = pricePerLiter / kml;

        kmlResultDiv.innerHTML = `
            Consumo: ${kml.toFixed(2).toLocaleString('pt-BR')} km/litro<br>
            Custo por KM: R$ ${costPerKm.toFixed(2).toLocaleString('pt-BR')}
        `;
        showToast('Cálculo de KM/Litro realizado!', 'success');
    });

    // Lida com o logout do usuário
    logoutBtn.addEventListener('click', () => {
        showCustomModal({
            title: 'Sair da Conta',
            message: 'Tem certeza que deseja sair?',
            inputType: 'none',
            onSave: async () => {
                try {
                    await auth.signOut();
                    currentUserId = null;
                    userVehicles = [];
                    currentSelectedVehicle = null;
                    showScreen(loginScreen);
                    showToast('Você saiu da sua conta.', 'success');
                } catch (error) {
                    console.error('Erro ao fazer logout:', error);
                    showToast('Erro ao sair: ' + error.message, 'error');
                }
            },
            onCancel: () => {
                showToast('Ação de sair cancelada.', 'attention');
            }
        });
    });


    // --- Inicialização ---
    // Mantém o estado de login e popula o perfil
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUserId = user.uid;
            profileEmail.textContent = user.email || 'Não Informado';
            profileDisplayName.textContent = user.displayName || 'Não Informado';
            showScreen(mainApp);
            showContentSection(dashboardScreen);
            await loadUserVehicles(currentUserId);
        } else {
            currentUserId = null;
            userVehicles = [];
            currentSelectedVehicle = null;
            profileEmail.textContent = 'Não Informado';
            profileDisplayName.textContent = 'Não Informado';
            showScreen(loginScreen);
        }
    });

    // Esconde o display de KM inicial, pois só é visível na tela de detalhes do veículo
    if (kmDisplayDetailsContainer) {
        kmDisplayDetailsContainer.style.display = 'none';
    }
    
    // Adiciona event listeners globais
    toggleThemeBtn.addEventListener('click', handleThemeToggle);
    topNavItemsContainer.addEventListener('click', handleTopNavClick);
    updateThemeIcon(); // Define o ícone inicial do tema ao carregar
});