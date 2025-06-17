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

    // Referências dos elementos do cabeçalho (agora fixos no DOM dentro de #main-app)
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
    const historyScreen = document.getElementById('history-screen');
    const profileScreen = document.getElementById('profile-screen');
    const vehicleDetailsScreen = document.getElementById('vehicle-details-screen');
    const backToDashboardBtn = document.getElementById('back-to-dashboard');

    // Elementos da Tela de Detalhes do Veículo
    const detailsVehicleName = document.getElementById('details-vehicle-name');
    const detailsVehicleModel = document.getElementById('details-vehicle-model');
    const currentKmDetailsSpan = document.getElementById('current-km-details'); // Span para o KM na tela de detalhes
    const editKmDetailsBtn = document.getElementById('edit-km-details-btn'); // Botão de edição para o KM na tela de detalhes
    const kmDisplayDetailsContainer = document.querySelector('.km-display-details'); // Container do KM nos detalhes
    const summaryCardsDynamic = document.getElementById('summary-cards-dynamic');

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
        timingBelt: { km: 60000, months: 60 }, // Correia dentada (exemplo)
        coolant: { km: 30000, months: 36 } // Fluido de arrefecimento
    };


    // --- Dados Mock (simulando um backend) ---
    // Agora incluindo 'lastDate' para cálculos baseados em tempo
    let userVehicles = [
        {
            id: 'v1',
            name: 'Honda Civic 2022 do Alan',
            model: 'Civic',
            km: 8500,
            maintenances: {
                oilChange: { lastKm: 8000, lastDate: '2024-01-15', oilType: 'sintetico' },
                tires: { lastKm: 7000, lastDate: '2024-03-01' }, // Rodízio e próxima troca serão calculados
                alignment: { lastKm: 7500, lastDate: '2024-02-10' },
                balanceamento: { lastKm: 7500, lastDate: '2024-02-10' },
                filterOil: { lastKm: 8000, lastDate: '2024-01-15' },
                filterFuel: { lastKm: 5000, lastDate: '2023-05-20' },
                filterAir: { lastKm: 5000, lastDate: '2023-05-20' }
            }
        },
        {
            id: 'v2',
            name: 'Toyota Corolla 2019 da Maria',
            model: 'Corolla',
            km: 45200,
            maintenances: {
                oilChange: { lastKm: 44000, lastDate: '2024-05-01', oilType: 'semisintetico' },
                tires: { lastKm: 40000, lastDate: '2024-01-01' },
                alignment: { lastKm: 42000, lastDate: '2024-03-15' },
                balanceamento: { lastKm: 42000, lastDate: '2024-03-15' },
                filterOil: { lastKm: 44000, lastDate: '2024-05-01' },
                filterFuel: { lastKm: 30000, lastDate: '2023-02-01' },
                filterAir: { lastKm: 30000, lastDate: '2023-02-01' }
            }
        },
        {
            id: 'v3',
            name: 'VW Polo 2023 do João',
            model: 'Polo',
            km: 1200,
            maintenances: {
                oilChange: { lastKm: 0, lastDate: '2024-10-01', oilType: 'mineral' }, // Exemplo de carro novo
                tires: { lastKm: 0, lastDate: '2024-10-01' },
                alignment: { lastKm: 0, lastDate: '2024-10-01' },
                balanceamento: { lastKm: 0, lastDate: '2024-10-01' },
                filterOil: { lastKm: 0, lastDate: '2024-10-01' },
                filterFuel: { lastKm: 0, lastDate: '2024-10-01' },
                filterAir: { lastKm: 0, lastDate: '2024-10-01' }
            }
        }
    ];

    let currentSelectedVehicle = null; // Armazena o veículo atualmente visualizado nos detalhes

    // --- Funções Auxiliares de Tratamento de Números e Datas ---

    /**
     * Converte uma string de número formatada para a localidade (ex: "1.234,56") para um número JS padrão (ex: 1234.56).
     * @param {string} stringNumber - A string do número a ser convertida.
     * @returns {number} O número parseado, ou NaN se a conversão falhar.
     */
    const parseLocaleNumber = (stringNumber) => {
        if (typeof stringNumber !== 'string') return NaN;
        // Remove separadores de milhares (pontos)
        let cleanedNumber = stringNumber.replace(/\./g, '');
        // Troca o separador decimal (vírgula) por ponto
        cleanedNumber = cleanedNumber.replace(/,/g, '.');
        return parseFloat(cleanedNumber);
    };

    /**
     * Adiciona um número de meses a uma data.
     * @param {string} dateString - Data no formato 'YYYY-MM-DD'.
     * @param {number} monthsToAdd - Número de meses a adicionar.
     * @returns {string} Nova data no formato 'YYYY-MM-DD'.
     */
    const addMonthsToDate = (dateString, monthsToAdd) => {
        if (!dateString) return null;
        const date = new Date(dateString + 'T00:00:00'); // Garante fuso horário local
        if (isNaN(date.getTime())) return null; // Retorna null se a data for inválida

        date.setMonth(date.getMonth() + monthsToAdd);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    /**
     * Formata uma data para exibição localizada (DD/MM/YYYY).
     * @param {string} dateString - Data no formato 'YYYY-MM-DD'.
     * @returns {string} Data formatada.
     */
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return 'N/I';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };


    // --- Funções de UI/Navegação ---

    /**
     * Exibe uma tela principal do aplicativo (loginScreen, signupScreen, mainApp).
     * @param {HTMLElement} screenToShow - A tela a ser exibida.
     */
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


    /**
     * Exibe uma seção de conteúdo específica dentro do main-app.
     * @param {HTMLElement} sectionToShow - A seção de conteúdo a ser exibida.
     */
    const showContentSection = (sectionToShow) => {
        const contentSections = document.querySelectorAll('#main-app > .screen'); // Seleciona apenas as seções filhas diretas
        contentSections.forEach(section => {
            if (section === sectionToShow) {
                section.classList.add('active-content');
                section.classList.remove('hidden-content');
            } else {
                section.classList.remove('active-content');
                section.classList.add('hidden-content');
            }
        });

        // Atualiza a navegação superior (agora topNavItems é uma NodeList fixa)
        topNavItems.forEach(item => {
            if (item.dataset.screen === sectionToShow.id) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Gerencia a visibilidade do KM de detalhes
        if (kmDisplayDetailsContainer) {
            if (sectionToShow === vehicleDetailsScreen && currentSelectedVehicle) {
                kmDisplayDetailsContainer.style.display = 'flex';
            } else {
                kmDisplayDetailsContainer.style.display = 'none';
            }
        }
    };

    /**
     * Renderiza os cards de veículos no Dashboard.
     */
    const renderVehicles = () => {
        vehicleList.innerHTML = ''; // Limpa a lista existente
        if (userVehicles.length === 0) {
            vehicleList.innerHTML = '<p class="no-vehicles">Nenhum veículo cadastrado. Adicione um para começar!</p>';
            return;
        }

        userVehicles.forEach(vehicle => {
            const vehicleCard = document.createElement('div');
            vehicleCard.classList.add('vehicle-card-item');
            vehicleCard.dataset.vehicleId = vehicle.id; // Armazena o ID do veículo
            vehicleCard.innerHTML = `
                <div class="vehicle-info">
                    <h3>${vehicle.name}</h3>
                    <p>${vehicle.model}</p>
                    <p>${vehicle.km.toLocaleString('pt-BR')} km</p>
                </div>
                <button class="delete-btn" data-vehicle-id="${vehicle.id}"><i class="fas fa-trash-alt"></i></button>
            `;
            // Event listener para ir para detalhes do veículo
            vehicleCard.querySelector('.vehicle-info').addEventListener('click', () => {
                currentSelectedVehicle = vehicle;
                updateVehicleDetailsScreen(vehicle);
                showContentSection(vehicleDetailsScreen);
            });
            // Event listener para excluir veículo
            vehicleCard.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation(); // Impede que o clique no botão ative o clique no card inteiro
                // Usar modal para confirmação de exclusão
                showCustomModal({
                    title: 'Confirmar Exclusão',
                    message: `Tem certeza que deseja remover o veículo "${vehicle.name}"?`,
                    inputType: 'none', // Não precisa de input para confirmação
                    onSave: () => {
                        userVehicles = userVehicles.filter(v => v.id !== vehicle.id);
                        renderVehicles(); // Re-renderiza a lista de veículos
                        showToast(`${vehicle.name} removido com sucesso!`, 'success'); // Feedback via toast
                        // Se o veículo removido era o selecionado, volta para o dashboard
                        if (currentSelectedVehicle && currentSelectedVehicle.id === vehicle.id) {
                            showContentSection(dashboardScreen);
                            currentSelectedVehicle = null;
                        }
                    }
                });
            });
            vehicleList.appendChild(vehicleCard);
        });
    };

    /**
     * Calcula o próximo KM e Data sugeridos para uma manutenção.
     * Retorna o que ocorrer primeiro (KM ou Data).
     * @param {string} typeKey - A chave do tipo de manutenção no `maintenanceStandards` (e.g., 'oilChange', 'tires').
     * @param {number} lastKm - O KM da última manutenção.
     * @param {string} lastDate - A data da última manutenção (YYYY-MM-DD).
     * @param {string} [subTypeKey] - Subtipo (e.g., 'mineral', 'rotation') se aplicável.
     * @returns {{ nextKm: number, nextDate: string, display: string }} Objeto com KM, Data e string de exibição.
     */
    const calculateNextMaintenance = (typeKey, lastKm, lastDate, subTypeKey = null) => {
        let kmStandard = 0;
        let monthsStandard = 0;

        if (subTypeKey && maintenanceStandards[typeKey] && maintenanceStandards[typeKey][subTypeKey]) {
            kmStandard = maintenanceStandards[typeKey][subTypeKey].km;
            monthsStandard = maintenanceStandards[typeKey][subTypeKey].months;
        } else if (maintenanceStandards[typeKey] && maintenanceStandards[typeKey].km) { // Se não tem subtipo, ou subtipo não encontrado
            kmStandard = maintenanceStandards[typeKey].km;
            monthsStandard = maintenanceStandards[typeKey].months;
        } else {
            // Padrão de fallback se a chave não for encontrada
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

        // Se a última data não existe (nunca foi feita a manutenção), os cálculos não são válidos ainda.
        if (lastKm === 0 && (!lastDate || lastDate === '')) {
            return { nextKm: 0, nextDate: null, display: 'Não calculado (N/I)' };
        }

        // Determina o que vem primeiro: KM ou Data
        if (suggestedNextKm > 0 && suggestedNextDate) {
            const dateObj = new Date(suggestedNextDate + 'T00:00:00');
            const kmDiff = suggestedNextKm - currentSelectedVehicle.km; // Quão longe está o KM sugerido do KM atual do veículo
            
            // Simular se a data sugerida já passou ou está próxima
            const msPerDay = 1000 * 60 * 60 * 24;
            const todayMs = Date.UTC(currentYear, currentMonth, currentDay); // Data de hoje em UTC para comparação
            const suggestedDateMs = Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()); // Data sugerida em UTC

            const daysUntilSuggestedDate = Math.ceil((suggestedDateMs - todayMs) / msPerDay);

            if (kmDiff <= 0 && daysUntilSuggestedDate <= 0) { // Ambos passaram
                displayString = `VENCIDO (KM e Data)! Sug.: ${suggestedNextKm.toLocaleString('pt-BR')} km ou ${formatDateForDisplay(suggestedNextDate)}`;
            } else if (kmDiff <= 0) { // KM passou
                 displayString = `VENCIDO (KM)! Sug.: ${suggestedNextKm.toLocaleString('pt-BR')} km`;
            } else if (daysUntilSuggestedDate <= 0) { // Data passou
                 displayString = `VENCIDO (Data)! Sug.: ${formatDateForDisplay(suggestedNextDate)}`;
            } else { // Nenhum passou
                // Compara qual deve ser feito primeiro
                // Se a data está mais próxima (em termos de "urgência" comparada ao KM restante)
                // Isto é uma simplificação. Em um sistema real, seria mais complexo.
                if (daysUntilSuggestedDate < (kmDiff / 100)) { // Ex: se faltam menos de 100 dias e mais de 10000 km, prioriza a data
                     displayString = `Sug.: ${suggestedNextKm.toLocaleString('pt-BR')} km ou ${formatDateForDisplay(suggestedNextDate)}`;
                } else {
                     displayString = `Sug.: ${suggestedNextKm.toLocaleString('pt-BR')} km ou ${formatDateForDisplay(suggestedNextDate)}`;
                }
            }
        } else if (suggestedNextKm > 0) {
            displayString = `Sug.: ${suggestedNextKm.toLocaleString('pt-BR')} km`;
            finalNextDate = null; // Garante que a data não seja exibida se só tem KM
        } else if (suggestedNextDate) {
            displayString = `Sug.: ${formatDateForDisplay(suggestedNextDate)}`;
            finalNextKm = 0; // Garante que o KM não seja exibido se só tem data
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

    /**
     * Atualiza os elementos na tela de detalhes do veículo com os dados do veículo selecionado.
     * @param {object} vehicle - O objeto veículo com seus dados.
     */
    const updateVehicleDetailsScreen = (vehicle) => {
        detailsVehicleName.textContent = vehicle.name;
        detailsVehicleModel.textContent = vehicle.model;
        currentKmDetailsSpan.textContent = vehicle.km.toLocaleString('pt-BR'); // Atualiza o KM na área de detalhes

        // --- CALCULA E EXIBE AS PRÓXIMAS MANUTENÇÕES AUTOMATICAMENTE ---
        // Troca de Óleo
        const oilChangeCalc = calculateNextMaintenance('oilChange', vehicle.maintenances.oilChange.lastKm, vehicle.maintenances.oilChange.lastDate, vehicle.maintenances.oilChange.oilType);
        document.getElementById('oil-last-date').textContent = vehicle.maintenances.oilChange.lastKm !== 0 ? `${vehicle.maintenances.oilChange.lastKm.toLocaleString('pt-BR')} km, ${formatDateForDisplay(vehicle.maintenances.oilChange.lastDate)}` : 'Não informado';
        document.getElementById('oil-type-brand').textContent = vehicle.maintenances.oilChange.oilType ? `${vehicle.maintenances.oilChange.oilType.charAt(0).toUpperCase() + vehicle.maintenances.oilChange.oilType.slice(1)}` : 'Não informado';
        document.getElementById('oil-next-change').textContent = oilChangeCalc.display;

        // Pneus (Rodízio e Troca Geral)
        const tiresRotationCalc = calculateNextMaintenance('tires', vehicle.maintenances.tires.lastKm, vehicle.maintenances.tires.lastDate, 'rotation');
        const tiresChangeCalc = calculateNextMaintenance('tires', vehicle.maintenances.tires.lastKm, vehicle.maintenances.tires.lastDate, 'change');
        document.getElementById('pneus-last-change').textContent = vehicle.maintenances.tires.lastKm !== 0 ? `${vehicle.maintenances.tires.lastKm.toLocaleString('pt-BR')} km, ${formatDateForDisplay(vehicle.maintenances.tires.lastDate)}` : 'Não informado';
        document.getElementById('pneus-rotation-suggested').textContent = tiresRotationCalc.display;
        document.getElementById('pneus-next-change').textContent = tiresChangeCalc.display + ' (Troca Geral)';

        // Alinhamento & Balanceamento
        const alignmentCalc = calculateNextMaintenance('alignment', vehicle.maintenances.alignment.lastKm, vehicle.maintenances.alignment.lastDate);
        const balanceamentoCalc = calculateNextMaintenance('balanceamento', vehicle.maintenances.balanceamento.lastKm, vehicle.maintenances.balanceamento.lastDate);
        document.getElementById('alignment-last').textContent = vehicle.maintenances.alignment.lastKm !== 0 ? `${vehicle.maintenances.alignment.lastKm.toLocaleString('pt-BR')} km, ${formatDateForDisplay(vehicle.maintenances.alignment.lastDate)}` : 'Não informado';
        document.getElementById('alignment-next').textContent = alignmentCalc.display;
        document.getElementById('balanceamento-last').textContent = vehicle.maintenances.balanceamento.lastKm !== 0 ? `${vehicle.maintenances.balanceamento.lastKm.toLocaleString('pt-BR')} km, ${formatDateForDisplay(vehicle.maintenances.balanceamento.lastDate)}` : 'Não informado';
        document.getElementById('balanceamento-next').textContent = balanceamentoCalc.display;

        // Filtros
        const filterOilCalc = calculateNextMaintenance('filters', vehicle.maintenances.filterOil.lastKm, vehicle.maintenances.filterOil.lastDate, 'oil');
        const filterFuelCalc = calculateNextMaintenance('filters', vehicle.maintenances.filterFuel.lastKm, vehicle.maintenances.filterFuel.lastDate, 'fuel');
        const filterAirCalc = calculateNextMaintenance('filters', vehicle.maintenances.filterAir.lastKm, vehicle.maintenances.filterAir.lastDate, 'air');

        document.getElementById('filter-oil-last').textContent =
            vehicle.maintenances.filterOil.lastKm !== 0
                ? `${vehicle.maintenances.filterOil.lastKm.toLocaleString('pt-BR')} km, ${formatDateForDisplay(vehicle.maintenances.filterOil.lastDate)}`
                : 'Não informado';
        document.getElementById('filter-oil-next').textContent = filterOilCalc.display;

        document.getElementById('filter-fuel-last').textContent =
            vehicle.maintenances.filterFuel.lastKm !== 0
                ? `${vehicle.maintenances.filterFuel.lastKm.toLocaleString('pt-BR')} km, ${formatDateForDisplay(vehicle.maintenances.filterFuel.lastDate)}`
                : 'Não informado';
        document.getElementById('filter-fuel-next').textContent = filterFuelCalc.display;

        document.getElementById('filter-air-last').textContent =
            vehicle.maintenances.filterAir.lastKm !== 0
                ? `${vehicle.maintenances.filterAir.lastKm.toLocaleString('pt-BR')} km, ${formatDateForDisplay(vehicle.maintenances.filterAir.lastDate)}`
                : 'Não informado';
        document.getElementById('filter-air-next').textContent = filterAirCalc.display;

    
        // Popular os cards de Manutenções Rápidas (usando os valores calculados)
        renderMaintenanceSummaryCards(vehicle.km, {
            oilChange: { lastKm: vehicle.maintenances.oilChange.lastKm, nextKm: oilChangeCalc.nextKm, nextDate: oilChangeCalc.nextDate },
            tires: { lastKm: vehicle.maintenances.tires.lastKm, rotationSuggestedKm: tiresRotationCalc.nextKm, rotationSuggestedDate: tiresRotationCalc.nextDate },
            alignment: { lastKm: vehicle.maintenances.alignment.lastKm, nextKm: alignmentCalc.nextKm, nextDate: alignmentCalc.nextDate },
            filterAir: { lastKm: vehicle.maintenances.filterAir.lastKm, nextKm: filterAirCalc.nextKm, nextDate: filterAirCalc.nextDate }
        });

        // Adicionar listeners de edição para os campos de "última" e "tipo"
        attachMaintenanceEditListeners();
    };

    /**
     * Renderiza os cards de Manutenções Rápidas com base no KM atual e próximos KMs sugeridos.
     * @param {number} currentVehicleKm - O KM atual do veículo.
     * @param {object} calculatedMaintenances - O objeto de manutenções com KMs e Datas JÁ calculados.
     */
    const renderMaintenanceSummaryCards = (currentVehicleKm, calculatedMaintenances) => {
        summaryCardsDynamic.innerHTML = ''; // Limpa os cards existentes

        const getStatusClass = (currentKm, nextKm, nextDate) => {
            const today = new Date();
            const nextDateObj = nextDate ? new Date(nextDate + 'T00:00:00') : null;

            const isKmOverdue = (nextKm !== 0 && currentKm >= nextKm);
            const isDateOverdue = (nextDateObj && today >= nextDateObj);

            // Calcula a diferença para "atenção"
            const kmDifference = nextKm - currentKm;
            const daysDifference = nextDateObj ? Math.ceil((nextDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : Infinity;

            const isKmAttention = (nextKm !== 0 && kmDifference <= 1000 && kmDifference > 0);
            const isDateAttention = (nextDateObj && daysDifference <= 30 && daysDifference > 0); // Próximos 30 dias

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

    /**
     * Exibe uma notificação toast temporária.
     * @param {string} message - A mensagem a ser exibida.
     * @param {string} type - O tipo de notificação ('success', 'error', 'attention').
     * @param {number} duration - Duração em milissegundos (padrão: 3000ms).
     */
    const showToast = (message, type, duration = 3000) => {
        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        toast.innerHTML = `<i class="icon fas ${getToastIcon(type)}"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        void toast.offsetWidth; // Força o reflow para a transição funcionar
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide'); // Adiciona classe para transição de saída

            toast.addEventListener('transitionend', () => {
                toast.remove(); // Remove o toast do DOM após a transição de saída
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

    /**
     * Exibe um modal customizado com opções.
     * @param {object} options - Opções para o modal.
     * @param {string} options.title - Título do modal.
     * @param {string} [options.message] - Mensagem opcional no corpo do modal.
     * @param {string} [options.inputType='text'] - Tipo de input ('text', 'number', 'date', 'none').
     * @param {string} [options.inputLabel] - Label para o campo de input.
     * @param {string|number} [options.inputValue=''] - Valor inicial do campo de input.
     * @param {function} options.onSave - Função de callback chamada ao clicar em "Salvar", recebe o valor do input.
     * @param {function} [options.onCancel] - Função de callback opcional chamada ao clicar em "Cancelar".
     */
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
            if (inputType !== 'date') { // Não seleciona texto em campos de data
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

    /**
     * Anexa os event listeners para os botões de edição de manutenção na tela de detalhes do veículo.
     */
    const attachMaintenanceEditListeners = () => {
        const editButtons = document.querySelectorAll('.maintenance-item .edit-btn');

        editButtons.forEach(button => {
            // Remove listener anterior para evitar duplicação em re-renderizações
            if (button._listenerFn) {
                button.removeEventListener('click', button._listenerFn);
            }
            
            const maintenanceType = button.dataset.maintenanceType;
            const fieldName = button.dataset.fieldName;
            const label = button.dataset.label;
            
            const listenerFn = (e) => handleMaintenanceEdit(maintenanceType, fieldName, label);
            button.addEventListener('click', listenerFn);
            button._listenerFn = listenerFn; // Armazena a referência para poder remover depois
        });
    };


    /**
     * Lida com a edição de campos de manutenção.
     * @param {string} maintenanceType - A chave do tipo de manutenção (ex: 'tires', 'oilChange').
     * @param {string} fieldName - O nome do campo a ser editado (ex: 'lastKm', 'lastDate', 'oilType').
     * @param {string} displayLabel - O texto que aparece no modal para o campo (ex: 'Última troca de Pneus').
     */
    const handleMaintenanceEdit = (maintenanceType, fieldName, displayLabel) => {
        if (!currentSelectedVehicle) {
            showToast('Erro: Nenhum veículo selecionado.', 'error');
            return;
        }

        let currentMaintenanceValue = currentSelectedVehicle.maintenances[maintenanceType][fieldName];
        let inputModality = 'text'; // Padrão
        let currentInputValue = currentMaintenanceValue || ''; // Valor inicial

        // Define a modalidade do input e o valor inicial com base no campo
        if (fieldName.toLowerCase().includes('km')) {
            inputModality = 'number';
            currentInputValue = currentMaintenanceValue !== 0 ? currentMaintenanceValue : '';
        } else if (fieldName.toLowerCase().includes('date')) {
            inputModality = 'date';
            currentInputValue = currentMaintenanceValue || '';
        } else { // Para campos de texto como 'oilType'
            inputModality = 'text';
            currentInputValue = currentMaintenanceValue || '';
        }
        
        // Verifica se o campo é editável (apenas 'lastKm', 'lastDate', 'oilType')
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
            onSave: (newValue) => {
                let isValid = true;
                let parsedValue = newValue;

                if (inputModality === 'number') {
                    parsedValue = parseInt(newValue);
                    if (isNaN(parsedValue) || parsedValue < 0) {
                        isValid = false;
                        showToast(`Valor inválido para ${displayLabel}. Por favor, insira um número inteiro válido (positivo).`, 'error');
                    }
                } else if (inputModality === 'date') {
                    // Simples validação de formato de data YYYY-MM-DD
                    if (!/^\d{4}-\d{2}-\d{2}$/.test(newValue)) {
                        isValid = false;
                        showToast(`Data inválida para ${displayLabel}. Use o formato AAAA-MM-DD.`, 'error');
                    }
                }
                // Para 'text', qualquer valor é considerado válido, a menos que outras regras sejam adicionadas.
                // Para 'oilType', poderíamos ter uma lista de validação em um app real.
                if (maintenanceType === 'oilChange' && fieldName === 'oilType' && newValue.trim() === '') {
                    isValid = false;
                    showToast(`O tipo de óleo não pode ser vazio.`, 'error');
                }


                if (isValid) {
                    currentSelectedVehicle.maintenances[maintenanceType][fieldName] = parsedValue;
                    updateVehicleDetailsScreen(currentSelectedVehicle); // Re-renderiza a tela (recalcula as próximas datas/km)
                    showToast(`${displayLabel} atualizado!`, 'success');
                }
            },
            onCancel: () => {
                showToast(`Edição de ${displayLabel} cancelada.`, 'attention');
            }
        });
    };


    // --- Event Handlers ---

    // Login/Cadastro
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Login bem-sucedido!', 'success');
        showScreen(mainApp); // Mostra o mainApp
        showContentSection(dashboardScreen); // Define o dashboard como a primeira seção do mainApp
        renderVehicles(); // Renderiza os veículos no dashboard
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Cadastro realizado com sucesso! Faça login.', 'success');
        showScreen(loginScreen);
    });

    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen(signupScreen);
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen(loginScreen);
    });


    // Atualizar KM no cabeçalho de detalhes do veículo
    editKmDetailsBtn.addEventListener('click', () => {
        if (!currentSelectedVehicle) {
            showToast('Erro: Nenhum veículo selecionado para atualizar o KM.', 'error');
            return;
        }

        showCustomModal({
            title: `Atualizar KM do ${currentSelectedVehicle.name}`,
            inputLabel: 'Novo KM atual:',
            inputType: 'number',
            inputValue: currentSelectedVehicle.km,
            onSave: (newKmValue) => {
                const parsedKm = parseInt(newKmValue);
                if (!isNaN(parsedKm) && parsedKm >= 0) {
                    currentSelectedVehicle.km = parsedKm;
                    updateVehicleDetailsScreen(currentSelectedVehicle);
                    renderVehicles(); // Para atualizar o KM no card do dashboard
                    showToast('KM atualizado para: ' + parsedKm.toLocaleString('pt-BR'), 'success');
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
        if (toggleThemeBtn) { // Verifica se o botão existe (está no DOM)
            if (body.classList.contains('dark-mode')) {
                toggleThemeBtn.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                toggleThemeBtn.innerHTML = '<i class="fas fa-moon"></i>';
            }
        }
    };


    // Navegação superior
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


    // Botão Voltar do Detalhes do Veículo
    backToDashboardBtn.addEventListener('click', () => {
        showContentSection(dashboardScreen);
        currentSelectedVehicle = null;
        if (kmDisplayDetailsContainer) {
             kmDisplayDetailsContainer.style.display = 'none';
        }
    });

    // Calculadora de KM Rodado
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

    // Calculadora de KM/Litro
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

    // Botão Sair do Perfil
    logoutBtn.addEventListener('click', () => {
        showCustomModal({
            title: 'Sair da Conta',
            message: 'Tem certeza que deseja sair?',
            inputType: 'none',
            onSave: () => {
                // Lógica para deslogar (limpar dados de sessão, etc.)
                currentSelectedVehicle = null; // Limpa o veículo selecionado
                showScreen(loginScreen); // Volta para a tela de login
                showToast('Você saiu da sua conta.', 'success');
            },
            onCancel: () => {
                showToast('Ação de sair cancelada.', 'attention');
            }
        });
    });


    // --- Inicialização ---
    // Exibe a tela de login por padrão
    showScreen(loginScreen);
    if (kmDisplayDetailsContainer) { // Garante que o container existe
        kmDisplayDetailsContainer.style.display = 'none'; // Garante que o KM nos detalhes esteja escondido inicialmente
    }
    
    // NOTA IMPORTANTE: Como mainAppHeader e seus filhos estão no DOM desde o início (em #main-app),
    // seus listeners podem ser anexados aqui na inicialização global.
    toggleThemeBtn.addEventListener('click', handleThemeToggle);
    topNavItemsContainer.addEventListener('click', handleTopNavClick);
    updateThemeIcon(); // Inicializa o ícone do tema.


    // Adicionar um ouvinte para o botão "Adicionar Novo Veículo" (apenas para demonstração)
    addVehicleBtn.addEventListener('click', () => {
        showToast('Funcionalidade "Adicionar Novo Veículo" seria implementada aqui!', 'attention');
    });
});