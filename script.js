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

    // Elementos do Dashboard e Telas de Conteúdo
    const vehicleList = document.getElementById('vehicle-list');
    const addVehicleBtn = document.getElementById('add-vehicle-btn');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const servicesScreen = document.getElementById('services-screen');
    const historyScreen = document.getElementById('history-screen');
    const profileScreen = document.getElementById('profile-screen');
    const vehicleDetailsScreen = document.getElementById('vehicle-details-screen');
    const backToDashboardBtn = document.getElementById('back-to-dashboard');
    const addVehicleScreen = document.getElementById('add-vehicle-screen');
    const backFromAddVehicleBtn = document.getElementById('back-from-add-vehicle');
    const addVehicleForm = document.getElementById('add-vehicle-form');
    
    // **NOVO**: Referência para a tela de calculadoras
    const calculatorsScreen = document.getElementById('calculators-screen');

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
    const summaryCardsDynamic = document.getElementById('summary-cards-dynamic');
    const maintenanceHistoryList = document.getElementById('maintenance-history-list');

    // Elementos da Aba Perfil
    const profileDisplayName = document.getElementById('profile-display-name');
    const profileEmail = document.getElementById('profile-email');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const toastContainer = document.getElementById('toast-container');
    const customModal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalInputGroup = document.getElementById('modal-input-group');
    const modalInputLabel = document.getElementById('modal-input-label');
    const modalInput = document.getElementById('modal-input');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const modalSaveBtn = document.getElementById('modal-save-btn');
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

    const maintenanceStandards = {
        oilChange: { mineral: { km: 5000, months: 6 }, semisintetico: { km: 10000, months: 12 }, sintetico: { km: 15000, months: 12 } },
        tires: { rotation: { km: 10000, months: 6 }, change: { km: 60000, months: 60 } },
        alignment: { km: 10000, months: 6 },
        balanceamento: { km: 10000, months: 6 },
        filters: { oil: { km: 10000, months: 12 }, fuel: { km: 20000, months: 24 }, air: { km: 15000, months: 12 } },
        brakes: { km: 20000, months: 24 },
        sparkPlugs: { km: 40000, months: 48 },
        timingBelt: { km: 60000, months: 60 }
    };

    let userVehicles = [];
    let currentSelectedVehicle = null;
    let currentUserId = null;

    // --- Funções Auxiliares de Tratamento de Números e Datas ---
    const parseLocaleNumber = (stringNumber) => {
        if (typeof stringNumber !== 'string') return NaN;
        return parseFloat(stringNumber.replace(/\./g, '').replace(/,/g, '.'));
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

    // --- Funções de UI/Navegação ---
    const showScreen = (screenToShow) => {
        [loginScreen, signupScreen, mainApp].forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        });
        screenToShow.classList.add('active');
        screenToShow.classList.remove('hidden');
    };

    const showContentSection = (sectionToShow) => {
        document.querySelectorAll('#main-app .main-content > .screen').forEach(section => {
            section.classList.remove('active-content');
            section.classList.add('hidden-content');
        });
        if (sectionToShow) {
            sectionToShow.classList.add('active-content');
            sectionToShow.classList.remove('hidden-content');
        }

        topNavItems.forEach(item => {
            item.classList.toggle('active', item.dataset.screen === sectionToShow?.id);
        });

        if (sectionToShow === historyScreen && currentSelectedVehicle) {
            loadMaintenanceHistory(currentSelectedVehicle.id);
        } else if (sectionToShow === historyScreen) {
            maintenanceHistoryList.innerHTML = '<p class="no-vehicles">Selecione um veículo no Dashboard para ver seu histórico.</p>';
        }
        if (sectionToShow === servicesScreen) {
            renderServiceProviders();
        }
    };
    
    // O restante do seu código JavaScript original vai aqui.
    // Colei todo o restante para garantir a funcionalidade.
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
                <button class="delete-btn" data-vehicle-id="${vehicle.id}"><i class="fas fa-trash-alt"></i></button>
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
                 displayString = `Sug.: ${suggestedNextKm.toLocaleString('pt-BR')} km ou ${formatDateForDisplay(suggestedNextDate)}`;
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

        return { nextKm: finalNextKm, nextDate: finalNextDate, display: displayString };
    };

    const updateVehicleDetailsScreen = (vehicle) => {
        detailsVehicleName.textContent = vehicle.name;
        detailsVehicleModel.textContent = vehicle.model;
        currentKmDetailsSpan.textContent = vehicle.km.toLocaleString('pt-BR');

        const oilChangeCalc = calculateNextMaintenance('oilChange', vehicle.maintenances.oilChange.lastKm, vehicle.maintenances.oilChange.lastDate, vehicle.maintenances.oilChange.oilType);
        document.getElementById('oil-last-km').textContent = vehicle.maintenances.oilChange.lastKm ? `${vehicle.maintenances.oilChange.lastKm.toLocaleString('pt-BR')} km` : 'N/I';
        document.getElementById('oil-last-date').textContent = formatDateForDisplay(vehicle.maintenances.oilChange.lastDate);
        document.getElementById('oil-type-brand').textContent = vehicle.maintenances.oilChange.oilType ? `${capitalizeFirstLetter(vehicle.maintenances.oilChange.oilType)}` : 'N/I';
        document.getElementById('oil-next-change').textContent = oilChangeCalc.display;

        const tiresRotationCalc = calculateNextMaintenance('tires', vehicle.maintenances.tires.lastKm, vehicle.maintenances.tires.lastDate, 'rotation');
        const tiresChangeCalc = calculateNextMaintenance('tires', vehicle.maintenances.tires.lastKm, vehicle.maintenances.tires.lastDate, 'change');
        document.getElementById('pneus-last-km').textContent = vehicle.maintenances.tires.lastKm ? `${vehicle.maintenances.tires.lastKm.toLocaleString('pt-BR')} km` : 'N/I';
        document.getElementById('pneus-last-date').textContent = formatDateForDisplay(vehicle.maintenances.tires.lastDate);
        document.getElementById('pneus-rotation-suggested').textContent = tiresRotationCalc.display;
        document.getElementById('pneus-next-change').textContent = tiresChangeCalc.display + ' (Troca Geral)';

        const alignmentCalc = calculateNextMaintenance('alignment', vehicle.maintenances.alignment.lastKm, vehicle.maintenances.alignment.lastDate);
        const balanceamentoCalc = calculateNextMaintenance('balanceamento', vehicle.maintenances.balanceamento.lastKm, vehicle.maintenances.balanceamento.lastDate);
        document.getElementById('alignment-last-km').textContent = vehicle.maintenances.alignment.lastKm ? `${vehicle.maintenances.alignment.lastKm.toLocaleString('pt-BR')} km` : 'N/I';
        document.getElementById('alignment-last-date').textContent = formatDateForDisplay(vehicle.maintenances.alignment.lastDate);
        document.getElementById('alignment-next').textContent = alignmentCalc.display;
        document.getElementById('balanceamento-last-km').textContent = vehicle.maintenances.balanceamento.lastKm ? `${vehicle.maintenances.balanceamento.lastKm.toLocaleString('pt-BR')} km` : 'N/I';
        document.getElementById('balanceamento-last-date').textContent = formatDateForDisplay(vehicle.maintenances.balanceamento.lastDate);
        document.getElementById('balanceamento-next').textContent = balanceamentoCalc.display;

        const filterOilCalc = calculateNextMaintenance('filters', vehicle.maintenances.filterOil.lastKm, vehicle.maintenances.filterOil.lastDate, 'oil');
        const filterFuelCalc = calculateNextMaintenance('filters', vehicle.maintenances.filterFuel.lastKm, vehicle.maintenances.filterFuel.lastDate, 'fuel');
        const filterAirCalc = calculateNextMaintenance('filters', vehicle.maintenances.filterAir.lastKm, vehicle.maintenances.filterAir.lastDate, 'air');
        document.getElementById('filter-oil-last-km').textContent = vehicle.maintenances.filterOil.lastKm ? `${vehicle.maintenances.filterOil.lastKm.toLocaleString('pt-BR')} km` : 'N/I';
        document.getElementById('filter-oil-last-date').textContent = formatDateForDisplay(vehicle.maintenances.filterOil.lastDate);
        document.getElementById('filter-oil-next').textContent = filterOilCalc.display;
        document.getElementById('filter-fuel-last-km').textContent = vehicle.maintenances.filterFuel.lastKm ? `${vehicle.maintenances.filterFuel.lastKm.toLocaleString('pt-BR')} km` : 'N/I';
        document.getElementById('filter-fuel-last-date').textContent = formatDateForDisplay(vehicle.maintenances.filterFuel.lastDate);
        document.getElementById('filter-fuel-next').textContent = filterFuelCalc.display;
        document.getElementById('filter-air-last-km').textContent = vehicle.maintenances.filterAir.lastKm ? `${vehicle.maintenances.filterAir.lastKm.toLocaleString('pt-BR')} km` : 'N/I';
        document.getElementById('filter-air-last-date').textContent = formatDateForDisplay(vehicle.maintenances.filterAir.lastDate);
        document.getElementById('filter-air-next').textContent = filterAirCalc.display;
    
        renderMaintenanceSummaryCards(vehicle.km, {
            oilChange: { lastKm: vehicle.maintenances.oilChange.lastKm, nextKm: oilChangeCalc.nextKm, nextDate: oilChangeCalc.nextDate },
            tires: { lastKm: vehicle.maintenances.tires.lastKm, rotationSuggestedKm: tiresRotationCalc.nextKm, rotationSuggestedDate: tiresRotationCalc.nextDate },
            alignment: { lastKm: vehicle.maintenances.alignment.lastKm, nextKm: alignmentCalc.nextKm, nextDate: alignmentCalc.nextDate },
            filterAir: { lastKm: vehicle.maintenances.filterAir.lastKm, nextKm: filterAirCalc.nextKm, nextDate: filterAirCalc.nextDate }
        });

        attachMaintenanceEditListeners();
    };

    const renderMaintenanceSummaryCards = (currentVehicleKm, calculatedMaintenances) => {
        summaryCardsDynamic.innerHTML = '';
        const getStatusClass = (currentKm, nextKm, nextDate) => {
            const today = new Date();
            const nextDateObj = nextDate ? new Date(nextDate + 'T00:00:00') : null;
            const isKmOverdue = nextKm && currentKm >= nextKm;
            const isDateOverdue = nextDateObj && today >= nextDateObj;
            const kmDifference = nextKm ? nextKm - currentKm : Infinity;
            const daysDifference = nextDateObj ? Math.ceil((nextDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : Infinity;
            if (isKmOverdue || isDateOverdue) return 'status-overdue';
            if ((nextKm && kmDifference <= 1000) || (nextDateObj && daysDifference <= 30)) return 'status-attention';
            return 'status-ok';
        };
        const getNextDisplayValue = (nextKm, nextDate) => {
            let display = [];
            if (nextKm) display.push(`${nextKm.toLocaleString('pt-BR')} km`);
            if (nextDate) display.push(formatDateForDisplay(nextDate));
            return display.length === 0 ? 'Não calculado' : `Próxima: ${display.join(' ou ')}`;
        };
        const items = [
            { type: 'Troca de Óleo', icon: 'fas fa-oil-can', ...calculatedMaintenances.oilChange, unit: 'km' },
            { type: 'Pneus (Rodízio)', icon: 'fas fa-tire', lastValue: calculatedMaintenances.tires.lastKm, nextKm: calculatedMaintenances.tires.rotationSuggestedKm, nextDate: calculatedMaintenances.tires.rotationSuggestedDate, unit: 'km' },
            { type: 'Alinhamento', icon: 'fas fa-align-center', ...calculatedMaintenances.alignment, unit: 'km' },
            { type: 'Filtro de Ar', icon: 'fas fa-filter', ...calculatedMaintenances.filterAir, unit: 'km' }
        ];
        items.forEach(item => {
            const statusClass = getStatusClass(currentVehicleKm, item.nextKm, item.nextDate);
            summaryCardsDynamic.innerHTML += `
                <div class="card summary-card ${statusClass}">
                    <i class="${item.icon} icon"></i>
                    <div class="card-content">
                        <h3>${item.type}</h3>
                        <p>Última: ${(item.lastKm || item.lastValue) ? (item.lastKm || item.lastValue).toLocaleString('pt-BR') + ' ' + item.unit : 'N/I'}</p>
                        <p>${getNextDisplayValue(item.nextKm, item.nextDate)}</p>
                    </div>
                </div>
            `;
        });
    };

    const showToast = (message, type, duration = 3000) => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="icon fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-exclamation-triangle'}"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        }, duration);
    };

    const showCustomModal = ({ title, message, inputType = 'text', inputLabel, inputValue = '', onSave, onCancel }) => {
        modalTitle.textContent = title;
        modalMessage.textContent = message || '';
        modalInputGroup.style.display = inputType === 'none' ? 'none' : 'block';
        if (inputType !== 'none') {
            modalInputLabel.textContent = inputLabel || '';
            modalInput.type = inputType;
            modalInput.value = inputValue;
            modalInput.focus();
        }
        customModal.classList.add('show');
        modalSaveBtn.onclick = () => {
            hideCustomModal();
            onSave(modalInput.value);
        };
        modalCancelBtn.onclick = () => {
            hideCustomModal();
            if (onCancel) onCancel();
        };
    };
    const hideCustomModal = () => customModal.classList.remove('show');

    const attachMaintenanceEditListeners = () => {
        document.querySelectorAll('.maintenance-item .edit-btn').forEach(button => {
            const listener = () => handleMaintenanceEdit(button.dataset.maintenanceType, button.dataset.fieldName, button.dataset.label);
            button.removeEventListener('click', button._listenerFn);
            button.addEventListener('click', listener);
            button._listenerFn = listener;
        });
    };

    const handleMaintenanceEdit = async (maintenanceType, fieldName, displayLabel) => {
        if (!currentSelectedVehicle || !currentUserId) return;
        const currentMaintenanceValue = currentSelectedVehicle.maintenances[maintenanceType][fieldName];
        const inputModality = fieldName.toLowerCase().includes('date') ? 'date' : fieldName.toLowerCase().includes('km') ? 'number' : 'text';

        showCustomModal({
            title: `Editar ${displayLabel}`,
            inputLabel: 'Novo Valor:',
            inputType: inputModality,
            inputValue: currentMaintenanceValue || '',
            onSave: async (newValue) => {
                const parsedValue = inputModality === 'number' ? parseInt(newValue, 10) : newValue;
                if (inputModality === 'number' && (isNaN(parsedValue) || parsedValue < 0)) {
                    showToast('Valor de KM inválido.', 'error');
                    return;
                }
                try {
                    await db.collection('users').doc(currentUserId).collection('vehicles').doc(currentSelectedVehicle.id).update({
                        [`maintenances.${maintenanceType}.${fieldName}`]: parsedValue
                    });
                    currentSelectedVehicle.maintenances[maintenanceType][fieldName] = parsedValue;
                    updateVehicleDetailsScreen(currentSelectedVehicle);
                    showToast(`${displayLabel} atualizado!`, 'success');
                } catch (error) {
                    showToast('Erro ao atualizar: ' + error.message, 'error');
                }
            }
        });
    };
    
    const getFirebaseErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 'auth/invalid-email': return 'Email inválido.';
            case 'auth/user-not-found': return 'Usuário não encontrado.';
            case 'auth/wrong-password': return 'Senha incorreta.';
            case 'auth/email-already-in-use': return 'Este email já está em uso.';
            case 'auth/weak-password': return 'Senha muito fraca (mínimo 6 caracteres).';
            default: return 'Ocorreu um erro. Tente novamente.';
        }
    };

    const loadMaintenanceHistory = async (vehicleId) => {
        maintenanceHistoryList.innerHTML = '';
        if (!currentUserId || !vehicleId) return;

        try {
            const vehicleDoc = await db.collection('users').doc(currentUserId).collection('vehicles').doc(vehicleId).get();
            if (!vehicleDoc.exists) {
                 maintenanceHistoryList.innerHTML = '<p class="no-vehicles">Veículo não encontrado.</p>';
                return;
            }
            const maintenances = vehicleDoc.data().maintenances || {};
            const historyItems = [];
            const typeMap = {
                oilChange: 'Troca de Óleo', tires: 'Manutenção de Pneus', alignment: 'Alinhamento',
                balanceamento: 'Balanceamento', filterOil: 'Troca Filtro de Óleo',
                filterFuel: 'Troca Filtro de Combustível', filterAir: 'Troca Filtro de Ar'
            };

            for (const type in maintenances) {
                const maintenance = maintenances[type];
                if (maintenance.lastKm || maintenance.lastDate) {
                    let details = [];
                    if (maintenance.lastKm) details.push(`KM: ${maintenance.lastKm.toLocaleString('pt-BR')}`);
                    if (maintenance.oilType) details.push(`Tipo: ${capitalizeFirstLetter(maintenance.oilType)}`);
                    historyItems.push({
                        date: maintenance.lastDate || '2000-01-01',
                        type: typeMap[type] || capitalizeFirstLetter(type),
                        details: details.join(', ')
                    });
                }
            }
            if (historyItems.length === 0) {
                maintenanceHistoryList.innerHTML = '<p class="no-vehicles">Nenhum histórico de manutenção encontrado.</p>';
                return;
            }
            historyItems.sort((a, b) => new Date(b.date) - new Date(a.date));
            historyItems.forEach(item => {
                const historyCard = document.createElement('div');
                historyCard.className = 'history-item card';
                historyCard.innerHTML = `<span class="history-date">${formatDateForDisplay(item.date)}</span><span class="history-type">${item.type}</span><span class="history-details">${item.details}</span>`;
                maintenanceHistoryList.appendChild(historyCard);
            });
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
            showToast('Erro ao carregar histórico.', 'error');
        }
    };
    
    const capitalizeFirstLetter = (string) => string ? string.charAt(0).toUpperCase() + string.slice(1) : '';

    const serviceProviders = [{ name: "Borracharia Móvel do Neguinho", phone: "(44) 99949-6361", address: "Atendimento Móvel em Maringá - PR", hours: "08:00 às 18:00", website: null, whatsapp: "5544999496361", image: "https://iili.io/FnTQzOB.png", type: "Móvel", branch: "Borracharia", city: "Maringá", state: "PR" }];
    const serviceTypeFilter = document.getElementById('service-type-filter');
    const serviceBranchFilter = document.getElementById('service-branch-filter');
    const serviceStateFilter = document.getElementById('service-state-filter');
    const serviceCityFilter = document.getElementById('service-city-filter');
    const serviceProvidersList = document.getElementById('service-providers-list');
    const serviceDetailsModal = document.getElementById('service-details-modal');
    const serviceDetailsCloseBtn = document.getElementById('service-details-close-btn');

    const renderServiceProviders = () => {
        const filtered = serviceProviders.filter(p => 
            (!serviceTypeFilter.value || p.type === serviceTypeFilter.value) &&
            (!serviceBranchFilter.value || p.branch === serviceBranchFilter.value) &&
            (!serviceStateFilter.value || p.state.toLowerCase().includes(serviceStateFilter.value.toLowerCase())) &&
            (!serviceCityFilter.value || p.city.toLowerCase().includes(serviceCityFilter.value.toLowerCase()))
        );
        serviceProvidersList.innerHTML = '';
        if (filtered.length === 0) {
            serviceProvidersList.innerHTML = '<p class="no-vehicles">Nenhum prestador encontrado.</p>';
            return;
        }
        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = 'service-card card';
            card.innerHTML = `<img src="${p.image}" alt="${p.name}"><h3>${p.name}</h3><p>${p.branch} - ${p.city}, ${p.state}</p>`;
            card.addEventListener('click', () => showServiceDetails(p));
            serviceProvidersList.appendChild(card);
        });
    };

    const showServiceDetails = (provider) => {
        document.getElementById('service-details-name').textContent = provider.name;
        document.getElementById('service-details-phone').textContent = provider.phone;
        document.getElementById('service-details-address').textContent = provider.address;
        document.getElementById('service-details-hours').textContent = provider.hours;
        const websiteLink = document.getElementById('service-details-website');
        websiteLink.textContent = provider.website || 'Não informado';
        if (provider.website) websiteLink.href = provider.website;
        const whatsappLink = document.getElementById('service-details-whatsapp');
        whatsappLink.style.display = provider.whatsapp ? 'inline-flex' : 'none';
        if (provider.whatsapp) whatsappLink.href = `https://wa.me/${provider.whatsapp}`;
        serviceDetailsModal.classList.add('show');
    };

    serviceDetailsCloseBtn.addEventListener('click', () => serviceDetailsModal.classList.remove('show'));
    [serviceTypeFilter, serviceBranchFilter, serviceStateFilter, serviceCityFilter].forEach(el => el.addEventListener('input', renderServiceProviders));
    
    // --- Event Handlers ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await auth.signInWithEmailAndPassword(loginForm['login-email'].value, loginForm['login-password'].value);
            showToast('Login bem-sucedido!', 'success');
        } catch (error) {
            showToast(getFirebaseErrorMessage(error.code), 'error');
        }
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = signupForm['signup-email'].value;
        const password = signupForm['signup-password'].value;
        const confirm = signupForm['signup-confirm-password'].value;
        if (password !== confirm) {
            showToast('As senhas não coincidem!', 'error');
            return;
        }
        try {
            const cred = await auth.createUserWithEmailAndPassword(email, password);
            await db.collection('users').doc(cred.user.uid).set({
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            showToast('Cadastro realizado com sucesso! Faça login.', 'success');
            showScreen(loginScreen);
        } catch (error) {
            showToast(getFirebaseErrorMessage(error.code), 'error');
        }
    });

    googleLoginBtn.addEventListener('click', async () => {
        try {
            const cred = await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
            const userDoc = await db.collection('users').doc(cred.user.uid).get();
            if (!userDoc.exists) {
                await db.collection('users').doc(cred.user.uid).set({
                    email: cred.user.email,
                    displayName: cred.user.displayName,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            showToast('Login com Google bem-sucedido!', 'success');
        } catch (error) {
            showToast(getFirebaseErrorMessage(error.code), 'error');
        }
    });

    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        showCustomModal({
            title: 'Recuperar Senha',
            message: 'Insira seu e-mail para receber o link de redefinição.',
            inputLabel: 'E-mail:', inputType: 'email',
            onSave: async (email) => {
                if (email) {
                    try {
                        await auth.sendPasswordResetEmail(email);
                        showToast('Link de redefinição enviado, verifique seu e-mail.', 'success');
                    } catch (error) {
                        showToast(getFirebaseErrorMessage(error.code), 'error');
                    }
                }
            }
        });
    });

    addVehicleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentUserId) return;
        const newVehicleData = {
            name: newVehicleNameInput.value.trim(),
            model: newVehicleModelInput.value.trim(),
            km: parseInt(newVehicleKmInput.value) || 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            maintenances: {
                oilChange: { lastKm: parseInt(newVehicleOilKmInput.value) || 0, lastDate: newVehicleOilDateInput.value || '', oilType: newVehicleOilTypeSelect.value || '' },
                tires: { lastKm: parseInt(newVehicleTiresKmInput.value) || 0, lastDate: newVehicleTiresDateInput.value || '' },
                alignment: { lastKm: 0, lastDate: '' },
                balanceamento: { lastKm: 0, lastDate: '' },
                filterOil: { lastKm: 0, lastDate: '' },
                filterFuel: { lastKm: 0, lastDate: '' },
                filterAir: { lastKm: 0, lastDate: '' }
            }
        };
        try {
            await db.collection('users').doc(currentUserId).collection('vehicles').add(newVehicleData);
            showToast('Veículo adicionado!', 'success');
            addVehicleForm.reset();
            showContentSection(dashboardScreen);
            loadUserVehicles(currentUserId);
        } catch (error) {
            showToast('Erro ao adicionar veículo: ' + error.message, 'error');
        }
    });

    calculateKmBtn.addEventListener('click', () => {
        const startKm = parseLocaleNumber(kmStartInput.value);
        const endKm = parseLocaleNumber(kmEndInput.value);
        if (isNaN(startKm) || isNaN(endKm) || startKm >= endKm) {
            showToast('Valores de KM inválidos.', 'attention');
            return;
        }
        const diffDays = Math.ceil(Math.abs(new Date(kmEndDateInput.value) - new Date(kmStartDateInput.value)) / (1000 * 60 * 60 * 24));
        const kmRodado = endKm - startKm;
        const dailyAvg = diffDays > 0 ? kmRodado / diffDays : 0;
        kmResultDiv.innerHTML = `KM Rodados: ${kmRodado.toLocaleString('pt-BR')} km<br>Média Diária: ${dailyAvg.toFixed(2)} km`;
    });
    calculateKmlBtn.addEventListener('click', () => {
        const km = parseLocaleNumber(kmlKmInput.value);
        const liters = parseLocaleNumber(kmlLitersInput.value);
        const price = parseLocaleNumber(kmlPriceInput.value);
        if (isNaN(km) || isNaN(liters) || liters <= 0) {
            showToast('Valores inválidos para cálculo.', 'attention');
            return;
        }
        const kml = km / liters;
        const cost = price / kml;
        kmlResultDiv.innerHTML = `Consumo: ${kml.toFixed(2)} km/l<br>Custo por KM: R$ ${cost.toFixed(2)}`;
    });

    logoutBtn.addEventListener('click', () => auth.signOut());
    showSignupLink.addEventListener('click', (e) => { e.preventDefault(); showScreen(signupScreen); });
    showLoginLink.addEventListener('click', (e) => { e.preventDefault(); showScreen(loginScreen); });
    addVehicleBtn.addEventListener('click', () => showContentSection(addVehicleScreen));
    backFromAddVehicleBtn.addEventListener('click', () => showContentSection(dashboardScreen));
    backToDashboardBtn.addEventListener('click', () => showContentSection(dashboardScreen));
    toggleThemeBtn.addEventListener('click', () => body.classList.toggle('dark-mode'));
    topNavItemsContainer.addEventListener('click', (e) => {
        const target = e.target.closest('.top-nav-item');
        if (!target) return;
        e.preventDefault();
        const screenId = target.dataset.screen;
        const screenMap = {
            'dashboard-screen': dashboardScreen,
            'services-screen': servicesScreen,
            'calculators-screen': calculatorsScreen,
            'history-screen': historyScreen,
            'profile-screen': profileScreen
        };
        showContentSection(screenMap[screenId]);
    });
    
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUserId = user.uid;
            const userDoc = await db.collection('users').doc(user.uid).get();
            const userData = userDoc.data();
            profileEmail.textContent = user.email;
            profileDisplayName.textContent = userData?.displayName || user.displayName || 'Não Informado';
            loadUserVehicles(currentUserId);
            showScreen(mainApp);
            showContentSection(dashboardScreen);
        } else {
            currentUserId = null;
            userVehicles = [];
            currentSelectedVehicle = null;
            showScreen(loginScreen);
        }
    });
});