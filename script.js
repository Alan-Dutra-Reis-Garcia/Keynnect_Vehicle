document.addEventListener('DOMContentLoaded', () => {
    // Referências de UI
    const loginScreen = document.getElementById('login-screen');
    const signupScreen = document.getElementById('signup-screen');
    const mainApp = document.getElementById('main-app');
    const body = document.body;

    // Forms
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const googleLoginBtn = document.querySelector('.google-btn');
    const forgotPasswordLink = document.getElementById('forgot-password-link');

    // Navegação Principal
    const bottomNav = document.querySelector('.bottom-nav');
    const navItems = document.querySelectorAll('.nav-item');

    // Botões de Tema
    const dashboardThemeBtn = document.getElementById('toggle-theme-btn-dashboard');
    const profileThemeBtn = document.getElementById('toggle-theme-btn-profile');

    // Seções de Conteúdo
    const contentScreens = document.querySelectorAll('#main-app > .screen');
    const addVehicleScreen = document.getElementById('add-vehicle-screen');
    const vehicleDetailsScreen = document.getElementById('vehicle-details-screen');

    // Elementos do Dashboard
    const vehicleList = document.getElementById('vehicle-list');
    const addVehicleBtn = document.getElementById('add-vehicle-btn');

    // Adicionar/Editar Veículo
    const addVehicleForm = document.getElementById('add-vehicle-form');
    const backFromAddVehicleBtn = document.getElementById('back-from-add-vehicle');
    const newVehicleNameInput = document.getElementById('new-vehicle-name');
    const newVehicleModelInput = document.getElementById('new-vehicle-model');
    const newVehicleKmInput = document.getElementById('new-vehicle-km');
    const newVehicleOilKmInput = document.getElementById('new-vehicle-oil-km');
    const newVehicleOilDateInput = document.getElementById('new-vehicle-oil-date');
    const newVehicleOilTypeSelect = document.getElementById('new-vehicle-oil-type');
    const newVehicleTiresKmInput = document.getElementById('new-vehicle-tires-km');
    const newVehicleTiresDateInput = document.getElementById('new-vehicle-tires-date');

    // Detalhes do Veículo
    const backToDashboardBtn = document.getElementById('back-to-dashboard');
    const editVehicleDetailsBtn = document.getElementById('edit-vehicle-details-btn');
    const detailsVehicleName = document.getElementById('details-vehicle-name');
    const detailsVehicleModel = document.getElementById('details-vehicle-model');
    const currentKmDetailsSpan = document.getElementById('current-km-details');
    const editKmDetailsBtn = document.getElementById('edit-km-details-btn');
    const summaryCardsDynamic = document.getElementById('summary-cards-dynamic');
    
    // Histórico
    const maintenanceHistoryList = document.getElementById('maintenance-history-list');

    // Perfil
    const profileDisplayName = document.getElementById('profile-display-name');
    const profileEmail = document.getElementById('profile-email');
    const editProfileBtn = document.getElementById('edit-profile-btn');
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
    
    // Serviços
    const serviceBranchFilter = document.getElementById('service-branch-filter');
    const serviceCityFilter = document.getElementById('service-city-filter');
    const serviceProvidersList = document.getElementById('service-providers-list');

    // Modais e Toasts
    const toastContainer = document.getElementById('toast-container');
    const customModal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalInputGroup = document.getElementById('modal-input-group');
    const modalInputLabel = document.getElementById('modal-input-label');
    const modalInput = document.getElementById('modal-input');
    const modalSelect = document.getElementById('modal-select');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const modalSaveBtn = document.getElementById('modal-save-btn');
    const serviceDetailsModal = document.getElementById('service-details-modal');
    const serviceDetailsCloseBtn = document.getElementById('service-details-close-btn');

    // Estado da Aplicação
    let userVehicles = [];
    let currentSelectedVehicle = null;
    let currentUserId = null;

    // --- PADRÕES DE MANUTENÇÃO ---
    const maintenanceStandards = {
        oilChange: { mineral: { km: 5000, months: 6 }, semisintetico: { km: 10000, months: 12 }, sintetico: { km: 10000, months: 12 } },
        tires: { rotation: { km: 10000, months: 6 }, change: { km: 50000, months: 60 } },
        alignment: { km: 10000, months: 6 },
        balanceamento: { km: 10000, months: 6 },
        filters: { oil: { km: 10000, months: 12 }, fuel: { km: 15000, months: 12 }, air: { km: 15000, months: 12 } },
    };
    
    // --- DADOS DE SERVIÇOS (MOCK) ---
    const serviceProviders = [
        { name: "Borracharia Móvel do Neguinho", phone: "(44) 99949-6361", address: "Atendimento Móvel", hours: "08:00 - 18:00", website: null, whatsapp: "5544999496361", image: "https://i.imgur.com/g2a0gq3.jpeg", type: "Móvel", branch: "Borracharia", city: "Maringá", state: "PR" },
        { name: "Mecânica Auto Forte", phone: "(44) 3030-4040", address: "Av. Brasil, 1234", hours: "08:00 - 18:30", website: "autoforte.com.br", whatsapp: "5544987654321", image: "https://i.imgur.com/U41238a.jpeg", type: "Fixo", branch: "Mecânica", city: "Maringá", state: "PR" },
        { name: "Lava Rápido Brilho Total", phone: "(44) 91234-5678", address: "R. das Flores, 56", hours: "09:00 - 17:00", website: null, whatsapp: "5544912345678", image: "https://i.imgur.com/rSCTqCo.jpeg", type: "Fixo", branch: "Lava Jato", city: "Sarandi", state: "PR" },
        { name: "Estética Veicular Premium", phone: "(44) 99999-8888", address: "Atendimento a domicílio", hours: "Sob agendamento", website: "studiopremium.com.br", whatsapp: "5544999998888", image: "https://i.imgur.com/Jd34e9C.jpeg", type: "Móvel", branch: "Estética", city: "Maringá", state: "PR" },
    ];

    // --- FUNÇÕES AUXILIARES ---
    const parseLocaleNumber = (stringNumber) => {
        if (typeof stringNumber !== 'string' || stringNumber.trim() === '') return NaN;
        return parseFloat(stringNumber.replace(/\./g, '').replace(/,/g, '.'));
    };

    const addMonthsToDate = (dateString, monthsToAdd) => {
        if (!dateString) return null;
        const date = new Date(dateString + 'T00:00:00Z');
        if (isNaN(date.getTime())) return null;
        date.setMonth(date.getMonth() + monthsToAdd);
        return date.toISOString().split('T')[0];
    };

    const formatDateForDisplay = (dateString) => {
        if (!dateString || dateString.length < 10) return 'N/I';
        const [year, month, day] = dateString.substring(0, 10).split('-');
        return `${day}/${month}/${year}`;
    };
    
    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // --- CONTROLE DE UI (TELAS, MODAIS, TOASTS) ---
    const showScreen = (screenToShow) => {
        const allScreens = [loginScreen, signupScreen, mainApp];
        allScreens.forEach(screen => {
            screen.classList.toggle('active', screen === screenToShow);
            screen.classList.toggle('hidden', screen !== screenToShow);
        });
    };

    const showContentSection = (screenIdToShow) => {
        contentScreens.forEach(screen => {
            screen.classList.toggle('active-content', screen.id === screenIdToShow);
            screen.classList.toggle('hidden-content', screen.id !== screenIdToShow);
        });

        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.screen === screenIdToShow);
        });

        if (screenIdToShow === 'history-screen') {
            if (currentSelectedVehicle) {
                loadMaintenanceHistory(currentSelectedVehicle.id);
            } else {
                maintenanceHistoryList.innerHTML = '<p class="no-vehicles">Selecione um veículo no dashboard para ver o histórico.</p>';
            }
        } else if (screenIdToShow === 'services-screen') {
            renderServiceProviders();
        }
    };

    const showToast = (message, type = 'attention', duration = 3000) => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="icon fas ${getToastIcon(type)}"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        }, duration);
    };

    const getToastIcon = (type) => ({
        success: 'fa-check-circle', error: 'fa-times-circle', attention: 'fa-exclamation-triangle'
    })[type] || 'fa-info-circle';

    const showCustomModal = ({ title, message, inputType = 'text', inputLabel, inputValue = '', options = [], onSave }) => {
        modalTitle.textContent = title;
        modalMessage.textContent = message || '';
        
        modalInput.classList.toggle('hidden', inputType === 'select');
        modalSelect.classList.toggle('hidden', inputType !== 'select');
        
        if (inputType === 'none') {
            modalInputGroup.style.display = 'none';
        } else {
            modalInputGroup.style.display = 'block';
            modalInputLabel.textContent = inputLabel || '';
            
            if (inputType === 'select') {
                modalSelect.innerHTML = '';
                options.forEach(opt => {
                    const optionEl = document.createElement('option');
                    optionEl.value = opt.value;
                    optionEl.textContent = opt.text;
                    optionEl.selected = opt.value === inputValue;
                    modalSelect.appendChild(optionEl);
                });
            } else {
                modalInput.type = inputType;
                modalInput.value = inputValue;
            }
        }
        
        customModal.classList.remove('hidden');
        customModal.classList.add('show');
        
        modalSaveBtn.onclick = () => {
            const value = (inputType === 'select') ? modalSelect.value : modalInput.value;
            hideCustomModal();
            onSave(value);
        };
    };

    const hideCustomModal = () => {
        customModal.classList.remove('show');
        setTimeout(() => customModal.classList.add('hidden'), 300);
    };

    // --- AUTENTICAÇÃO E PERFIL ---
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUserId = user.uid;
            profileEmail.textContent = user.email || 'Não informado';
            profileDisplayName.textContent = user.displayName || user.email.split('@')[0];
            showScreen(mainApp);
            showContentSection('dashboard-screen');
            await loadUserVehicles(currentUserId);
        } else {
            currentUserId = null; userVehicles = []; currentSelectedVehicle = null;
            showScreen(loginScreen);
        }
    });

    const getFirebaseErrorMessage = (code) => ({
        'auth/invalid-email': 'Email inválido.',
        'auth/user-disabled': 'Usuário desabilitado.',
        'auth/user-not-found': 'Usuário não encontrado.',
        'auth/wrong-password': 'Senha incorreta.',
        'auth/email-already-in-use': 'Este email já está em uso.',
        'auth/weak-password': 'Senha fraca (mínimo 6 caracteres).',
    })[code] || 'Ocorreu um erro. Tente novamente.';

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm['login-email'].value;
        const password = loginForm['login-password'].value;
        auth.signInWithEmailAndPassword(email, password)
            .then(() => showToast('Login bem-sucedido!', 'success'))
            .catch(err => showToast(getFirebaseErrorMessage(err.code), 'error'));
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = signupForm['signup-email'].value;
        const password = signupForm['signup-password'].value;
        if (password !== signupForm['signup-confirm-password'].value) return showToast('As senhas não coincidem!', 'error');

        auth.createUserWithEmailAndPassword(email, password)
            .then(cred => {
                db.collection('users').doc(cred.user.uid).set({
                    email: email, createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                showToast('Cadastro realizado com sucesso!', 'success');
                showScreen(loginScreen);
            })
            .catch(err => showToast(getFirebaseErrorMessage(err.code), 'error'));
    });
    
    googleLoginBtn?.addEventListener('click', async () => {
        try {
            const cred = await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
            const userDoc = await db.collection('users').doc(cred.user.uid).get();
            if (!userDoc.exists) {
                await db.collection('users').doc(cred.user.uid).set({
                    email: cred.user.email, displayName: cred.user.displayName, createdAt: firebase.firestore.FieldValue.serverTimestamp()
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
            title: 'Recuperar Senha', message: 'Insira seu e-mail para receber o link de redefinição.', inputLabel: 'E-mail:', inputType: 'email',
            onSave: async (email) => {
                if (!email.trim()) return showToast('Por favor, insira um e-mail.', 'attention');
                try {
                    await auth.sendPasswordResetEmail(email.trim());
                    showToast('Link de redefinição enviado!', 'success');
                } catch (error) {
                    showToast(getFirebaseErrorMessage(error.code), 'error');
                }
            }
        });
    });

    logoutBtn.addEventListener('click', () => {
        showCustomModal({
            title: 'Sair da Conta', message: 'Tem certeza que deseja sair?', inputType: 'none',
            onSave: () => auth.signOut().then(() => showToast('Você saiu.', 'success'))
        });
    });
    editProfileBtn.addEventListener('click', () => showToast('Funcionalidade em desenvolvimento.', 'attention'));

    // --- GESTÃO DE VEÍCULOS ---
    const loadUserVehicles = async (userId) => {
        if (!userId) return;
        try {
            const snapshot = await db.collection('users').doc(userId).collection('vehicles').orderBy('name').get();
            userVehicles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderVehicles();
        } catch (error) { showToast('Erro ao carregar veículos.', 'error'); }
    };

    const renderVehicles = () => {
        vehicleList.innerHTML = '';
        if (userVehicles.length === 0) {
            vehicleList.innerHTML = '<p class="no-vehicles">Nenhum veículo cadastrado. Adicione um para começar!</p>';
            return;
        }

        userVehicles.forEach(vehicle => {
            const card = document.createElement('div');
            card.className = 'card vehicle-card-item';
            card.innerHTML = `
                <div class="vehicle-info">
                    <h3>${vehicle.name}</h3>
                    <p>${vehicle.model}</p>
                    <p><strong>${(vehicle.km || 0).toLocaleString('pt-BR')} km</strong></p>
                </div>
                <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
            `;
            card.querySelector('.vehicle-info').onclick = () => {
                currentSelectedVehicle = vehicle;
                updateVehicleDetailsScreen(vehicle);
                showContentSection('vehicle-details-screen');
            };
            card.querySelector('.delete-btn').onclick = (e) => {
                e.stopPropagation();
                showCustomModal({
                    title: 'Confirmar Exclusão', message: `Deseja remover o veículo "${vehicle.name}"?`, inputType: 'none',
                    onSave: () => deleteVehicle(vehicle.id, vehicle.name)
                });
            };
            vehicleList.appendChild(card);
        });
    };
    
    addVehicleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = newVehicleNameInput.value.trim(), model = newVehicleModelInput.value.trim(), km = parseInt(newVehicleKmInput.value);
        if (!name || !model || isNaN(km)) return showToast('Preencha nome, modelo e KM.', 'attention');

        const newVehicleData = {
            name, model, km, createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            maintenances: {
                oilChange: { lastKm: parseInt(newVehicleOilKmInput.value) || 0, lastDate: newVehicleOilDateInput.value || '', oilType: newVehicleOilTypeSelect.value || '' },
                tires: { lastKm: parseInt(newVehicleTiresKmInput.value) || 0, lastDate: newVehicleTiresDateInput.value || '' },
                alignment: { lastKm: 0, lastDate: '' }, balanceamento: { lastKm: 0, lastDate: '' },
                filterOil: { lastKm: 0, lastDate: '' }, filterFuel: { lastKm: 0, lastDate: '' }, filterAir: { lastKm: 0, lastDate: '' }
            }
        };

        try {
            await db.collection('users').doc(currentUserId).collection('vehicles').add(newVehicleData);
            showToast('Veículo adicionado!', 'success');
            addVehicleForm.reset();
            showContentSection('dashboard-screen');
            loadUserVehicles(currentUserId);
        } catch (error) { showToast('Erro ao salvar veículo.', 'error'); }
    });

    const deleteVehicle = async (vehicleId, vehicleName) => {
        try {
            await db.collection('users').doc(currentUserId).collection('vehicles').doc(vehicleId).delete();
            if (currentSelectedVehicle?.id === vehicleId) currentSelectedVehicle = null;
            showToast(`${vehicleName} removido.`, 'success');
            loadUserVehicles(currentUserId);
            showContentSection('dashboard-screen');
        } catch (error) { showToast('Erro ao remover veículo.', 'error'); }
    };
    
    const handleMainFieldEdit = (field, currentValue) => {
        const labels = { name: 'Apelido', model: 'Modelo', km: 'KM Atual' };
        showCustomModal({
            title: `Editar ${labels[field]}`, inputType: field === 'km' ? 'number' : 'text', inputLabel: `Novo ${labels[field]}:`, inputValue: currentValue,
            onSave: async (newValue) => {
                const parsedValue = field === 'km' ? parseInt(newValue) : newValue.trim();
                if ((field !== 'km' && !parsedValue) || (field === 'km' && isNaN(parsedValue))) return showToast('Valor inválido.', 'error');
                
                try {
                    await db.collection('users').doc(currentUserId).collection('vehicles').doc(currentSelectedVehicle.id).update({ [field]: parsedValue });
                    currentSelectedVehicle[field] = parsedValue;
                    updateVehicleDetailsScreen(currentSelectedVehicle);
                    renderVehicles();
                    showToast(`${labels[field]} atualizado!`, 'success');
                } catch (error) { showToast(`Erro ao atualizar ${labels[field]}.`, 'error'); }
            }
        });
    };

    const handleMaintenanceEdit = (maintType, field, currentValue) => {
        const labels = { lastKm: 'KM da última troca', lastDate: 'Data da última troca', oilType: 'Tipo de Óleo' };
        const inputTypes = { lastKm: 'number', lastDate: 'date', oilType: 'select' };
        showCustomModal({
            title: `Editar Manutenção`, message: `Alterando ${labels[field]}`, inputType: inputTypes[field], inputLabel: 'Novo valor:', inputValue: currentValue,
            options: field === 'oilType' ? [{value: 'mineral', text: 'Mineral'}, {value: 'semisintetico', text: 'Semissintético'}, {value: 'sintetico', text: 'Sintético'}] : [],
            onSave: async (newValue) => {
                const parsedValue = inputTypes[field] === 'number' ? parseInt(newValue) : newValue;
                const path = `maintenances.${maintType}.${field}`;
                try {
                    await db.collection('users').doc(currentUserId).collection('vehicles').doc(currentSelectedVehicle.id).update({ [path]: parsedValue });
                    currentSelectedVehicle.maintenances[maintType][field] = parsedValue;
                    updateVehicleDetailsScreen(currentSelectedVehicle);
                    showToast('Manutenção atualizada!', 'success');
                } catch (error) { showToast('Erro ao atualizar.', 'error'); }
            }
        });
    };

    // --- DETALHES DO VEÍCULO E MANUTENÇÕES ---
    const calculateNextMaintenance = (type, lastKm, lastDate, subType = null) => {
        const standard = subType ? maintenanceStandards[type]?.[subType] : maintenanceStandards[type];
        if (!standard || (!lastKm && !lastDate)) return { display: 'N/I', nextKm: 0, nextDate: null };
        
        const nextKm = lastKm ? lastKm + standard.km : 0;
        const nextDate = lastDate ? addMonthsToDate(lastDate, standard.months) : null;
        let displayParts = [];
        if (nextKm > 0) displayParts.push(`${nextKm.toLocaleString('pt-BR')} km`);
        if (nextDate) displayParts.push(formatDateForDisplay(nextDate));
        return { nextKm, nextDate, display: displayParts.join(' ou ') };
    };

    const updateVehicleDetailsScreen = (vehicle) => {
        if (!vehicle) return;
        const m = vehicle.maintenances || {};
        const getVal = (path, formatFn) => {
            const value = path.split('.').reduce((o, i) => o?.[i], m);
            return (value) ? (formatFn ? formatFn(value) : value) : 'N/I';
        };

        detailsVehicleName.textContent = vehicle.name;
        detailsVehicleModel.textContent = vehicle.model;
        currentKmDetailsSpan.textContent = (vehicle.km || 0).toLocaleString('pt-BR');

        const calcs = {
            oilChange: calculateNextMaintenance('oilChange', m.oilChange?.lastKm, m.oilChange?.lastDate, m.oilChange?.oilType),
            tiresRotation: calculateNextMaintenance('tires', m.tires?.lastKm, m.tires?.lastDate, 'rotation'),
            tiresChange: calculateNextMaintenance('tires', m.tires?.lastKm, m.tires?.lastDate, 'change'),
            alignment: calculateNextMaintenance('alignment', m.alignment?.lastKm, m.alignment?.lastDate),
            balanceamento: calculateNextMaintenance('balanceamento', m.balanceamento?.lastKm, m.balanceamento?.lastDate),
            filterOil: calculateNextMaintenance('filters', m.filterOil?.lastKm, m.filterOil?.lastDate, 'oil'),
            filterFuel: calculateNextMaintenance('filters', m.filterFuel?.lastKm, m.filterFuel?.lastDate, 'fuel'),
            filterAir: calculateNextMaintenance('filters', m.filterAir?.lastKm, m.filterAir?.lastDate, 'air'),
        };

        document.getElementById('oil-last-km').textContent = getVal('oilChange.lastKm', v => v.toLocaleString('pt-BR') + ' km');
        document.getElementById('oil-last-date').textContent = getVal('oilChange.lastDate', formatDateForDisplay);
        document.getElementById('oil-type-brand').textContent = getVal('oilChange.oilType', capitalizeFirstLetter);
        document.getElementById('oil-next-change').textContent = calcs.oilChange.display;

        document.getElementById('pneus-last-km').textContent = getVal('tires.lastKm', v => v.toLocaleString('pt-BR') + ' km');
        document.getElementById('pneus-last-date').textContent = getVal('tires.lastDate', formatDateForDisplay);
        document.getElementById('pneus-rotation-suggested').textContent = calcs.tiresRotation.display;
        document.getElementById('pneus-next-change').textContent = calcs.tiresChange.display;

        document.getElementById('alignment-last-km').textContent = getVal('alignment.lastKm', v => v.toLocaleString('pt-BR') + ' km');
        document.getElementById('alignment-last-date').textContent = getVal('alignment.lastDate', formatDateForDisplay);
        document.getElementById('alignment-next').textContent = calcs.alignment.display;
        
        document.getElementById('balanceamento-last-km').textContent = getVal('balanceamento.lastKm', v => v.toLocaleString('pt-BR') + ' km');
        document.getElementById('balanceamento-last-date').textContent = getVal('balanceamento.lastDate', formatDateForDisplay);
        document.getElementById('balanceamento-next').textContent = calcs.balanceamento.display;

        document.getElementById('filter-oil-last-km').textContent = getVal('filterOil.lastKm', v => v.toLocaleString('pt-BR') + ' km');
        document.getElementById('filter-oil-last-date').textContent = getVal('filterOil.lastDate', formatDateForDisplay);
        document.getElementById('filter-oil-next').textContent = calcs.filterOil.display;

        document.getElementById('filter-fuel-last-km').textContent = getVal('filterFuel.lastKm', v => v.toLocaleString('pt-BR') + ' km');
        document.getElementById('filter-fuel-last-date').textContent = getVal('filterFuel.lastDate', formatDateForDisplay);
        document.getElementById('filter-fuel-next').textContent = calcs.filterFuel.display;

        document.getElementById('filter-air-last-km').textContent = getVal('filterAir.lastKm', v => v.toLocaleString('pt-BR') + ' km');
        document.getElementById('filter-air-last-date').textContent = getVal('filterAir.lastDate', formatDateForDisplay);
        document.getElementById('filter-air-next').textContent = calcs.filterAir.display;
        
        renderMaintenanceSummaryCards(vehicle.km, calcs);
    };

    const renderMaintenanceSummaryCards = (currentKm, calcs) => {
        summaryCardsDynamic.innerHTML = '';
        const getStatus = (currentKm, nextKm, nextDate) => {
            const today = new Date(); today.setHours(0,0,0,0);
            const nextDateObj = nextDate ? new Date(nextDate + 'T00:00:00Z') : null;
            if ((nextKm && currentKm >= nextKm) || (nextDateObj && today >= nextDateObj)) return 'status-overdue';
            if ((nextKm && nextKm - currentKm <= 1000) || (nextDateObj && (nextDateObj - today) / 864e5 <= 30)) return 'status-attention';
            return 'status-ok';
        };

        const items = [
            { type: 'Troca de Óleo', icon: 'fas fa-oil-can', calc: calcs.oilChange },
            { type: 'Pneus (Rodízio)', icon: 'fas fa-tire', calc: calcs.tiresRotation },
            { type: 'Alinhamento', icon: 'fas fa-align-center', calc: calcs.alignment },
            { type: 'Filtro de Ar', icon: 'fas fa-filter', calc: calcs.filterAir }
        ];

        items.forEach(({ type, icon, calc }) => {
            const statusClass = getStatus(currentKm, calc.nextKm, calc.nextDate);
            summaryCardsDynamic.innerHTML += `
                <div class="card summary-card ${statusClass}">
                    <i class="${icon} icon"></i>
                    <h3>${type}</h3>
                    <p>${calc.display}</p>
                </div>`;
        });
    };

    // --- HISTÓRICO ---
    const loadMaintenanceHistory = async (vehicleId) => {
        maintenanceHistoryList.innerHTML = '';
        if (!currentUserId || !vehicleId) return;

        try {
            const vehicleDoc = await db.collection('users').doc(currentUserId).collection('vehicles').doc(vehicleId).get();
            if (!vehicleDoc.exists) return;

            const m = vehicleDoc.data().maintenances || {};
            const historyItems = [];
            const typeLabels = { oilChange: 'Troca de Óleo', tires: 'Pneus', alignment: 'Alinhamento', balanceamento: 'Balanceamento', filterOil: 'Filtro de Óleo', filterFuel: 'Filtro de Combustível', filterAir: 'Filtro de Ar' };

            for (const type in m) {
                if (m[type].lastDate) {
                    let details = [];
                    if (m[type].lastKm) details.push(`KM: ${m[type].lastKm.toLocaleString('pt-BR')}`);
                    if (m[type].oilType) details.push(`Tipo: ${capitalizeFirstLetter(m[type].oilType)}`);
                    historyItems.push({
                        date: m[type].lastDate, type: typeLabels[type] || type, details: details.join(', ')
                    });
                }
            }
            
            if (historyItems.length === 0) {
                 maintenanceHistoryList.innerHTML = '<p class="no-vehicles">Nenhum histórico de manutenção encontrado.</p>';
                 return;
            }

            historyItems.sort((a, b) => new Date(b.date) - new Date(a.date));
            historyItems.forEach(item => {
                maintenanceHistoryList.innerHTML += `
                    <div class="card history-item">
                        <span class="history-date">${formatDateForDisplay(item.date)}</span>
                        <span class="history-type">${item.type}</span>
                        <span class="history-details">${item.details}</span>
                    </div>`;
            });

        } catch (error) { showToast('Erro ao carregar histórico.', 'error'); }
    };
    
    // --- CALCULADORAS ---
    calculateKmlBtn.addEventListener('click', () => {
        const km = parseLocaleNumber(kmlKmInput.value), consumption = parseLocaleNumber(kmlLitersInput.value), price = parseLocaleNumber(kmlPriceInput.value);
        if (isNaN(km) || isNaN(consumption) || isNaN(price) || consumption <= 0) return showToast('Preencha todos os campos com valores válidos.', 'attention');
        const litersNeeded = km / consumption, totalCost = litersNeeded * price;
        kmlResultDiv.innerHTML = `Litros Necessários: <strong>${litersNeeded.toFixed(2)} L</strong><br>Custo Total: <strong>R$ ${totalCost.toFixed(2)}</strong>`;
    });
    
    calculateKmBtn.addEventListener('click', () => {
        const startKm = parseLocaleNumber(kmStartInput.value), endKm = parseLocaleNumber(kmEndInput.value);
        const startDate = new Date(kmStartDateInput.value + 'T00:00:00Z'), endDate = new Date(kmEndDateInput.value + 'T00:00:00Z');
        if(isNaN(startKm) || isNaN(endKm) || !kmStartDateInput.value || !kmEndDateInput.value || startKm >= endKm || startDate >= endDate) return showToast('Preencha os campos com valores válidos.', 'attention');
        
        const diffDays = Math.ceil((endDate - startDate) / 864e5), kmRodado = endKm - startKm;
        const dailyAvg = diffDays > 0 ? kmRodado / diffDays : 0, monthlyAvg = dailyAvg * 30.44;
        kmResultDiv.innerHTML = `KM Rodados: <strong>${kmRodado.toLocaleString('pt-BR')} km</strong><br>Média Diária: <strong>${dailyAvg.toFixed(2)} km</strong><br>Média Mensal: <strong>${monthlyAvg.toFixed(2)} km</strong>`;
    });

    // --- LÓGICA DE SERVIÇOS ---
    const renderServiceProviders = () => {
        const branch = serviceBranchFilter.value, city = serviceCityFilter.value.toLowerCase();
        const filtered = serviceProviders.filter(p => (!branch || p.branch === branch) && (!city || p.city.toLowerCase().includes(city)));
        serviceProvidersList.innerHTML = filtered.length === 0 ? '<p class="no-vehicles">Nenhum prestador encontrado.</p>' : '';
        
        filtered.forEach(provider => {
            serviceProvidersList.innerHTML += `
                <div class="card service-card" data-provider='${JSON.stringify(provider)}'>
                    <img src="${provider.image}" alt="${provider.name}" class="service-card-image">
                    <h3>${provider.name}</h3>
                    <p>${provider.city}, ${provider.state}</p>
                    <div class="service-card-tags">
                        <span class="tag">${provider.branch}</span>
                        ${provider.type === 'Móvel' ? '<span class="tag">Atendimento Móvel</span>' : ''}
                    </div>
                </div>`;
        });
    };
    
    const showServiceDetails = (provider) => {
        document.getElementById('service-details-image').src = provider.image;
        document.getElementById('service-details-name').textContent = provider.name;
        document.getElementById('service-details-branch').textContent = provider.branch;
        document.getElementById('service-details-phone').textContent = provider.phone;
        document.getElementById('service-details-address').textContent = provider.address;
        document.getElementById('service-details-hours').textContent = provider.hours;
        const websiteLink = document.getElementById('service-details-website');
        websiteLink.textContent = provider.website || 'Não informado';
        websiteLink.href = provider.website ? `https://${provider.website}` : '#';
        document.getElementById('service-details-whatsapp').href = provider.whatsapp ? `https://wa.me/${provider.whatsapp}` : '#';
        serviceDetailsModal.classList.remove('hidden');
        serviceDetailsModal.classList.add('show');
    };
    
    // --- EVENT LISTENERS GERAIS ---
    showSignupLink.addEventListener('click', (e) => { e.preventDefault(); showScreen(signupScreen); });
    showLoginLink.addEventListener('click', (e) => { e.preventDefault(); showScreen(loginScreen); });

    bottomNav.addEventListener('click', (e) => {
        const target = e.target.closest('.nav-item');
        if (target) { e.preventDefault(); showContentSection(target.dataset.screen); }
    });

    addVehicleBtn.addEventListener('click', () => showContentSection('add-vehicle-screen'));
    backFromAddVehicleBtn.addEventListener('click', () => showContentSection('dashboard-screen'));
    backToDashboardBtn.addEventListener('click', () => { currentSelectedVehicle = null; showContentSection('dashboard-screen'); });
    editVehicleDetailsBtn.addEventListener('click', () => handleMainFieldEdit('name', currentSelectedVehicle?.name));
    editKmDetailsBtn.addEventListener('click', () => handleMainFieldEdit('km', currentSelectedVehicle?.km));
    
    serviceProvidersList.addEventListener('click', (e) => {
        const card = e.target.closest('.service-card');
        if (card?.dataset.provider) showServiceDetails(JSON.parse(card.dataset.provider));
    });
    serviceDetailsCloseBtn.addEventListener('click', () => {
        serviceDetailsModal.classList.remove('show');
        setTimeout(() => serviceDetailsModal.classList.add('hidden'), 300);
    });
    modalCancelBtn.addEventListener('click', hideCustomModal);
    [serviceBranchFilter, serviceCityFilter].forEach(el => el.addEventListener('input', renderServiceProviders));

    // --- TEMA ---
    const updateThemeIcon = (isDark) => {
        const iconClass = isDark ? 'fa-sun' : 'fa-moon';
        if(dashboardThemeBtn) dashboardThemeBtn.innerHTML = `<i class="fas ${iconClass}"></i>`;
        if(profileThemeBtn) profileThemeBtn.innerHTML = `<i class="fas ${iconClass}"></i>`;
    };

    const handleThemeToggle = () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
    };
    
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if ((savedTheme === 'dark') || (!savedTheme && prefersDark)) {
        body.classList.add('dark-mode');
        updateThemeIcon(true);
    } else {
        updateThemeIcon(false);
    }
    
    dashboardThemeBtn?.addEventListener('click', handleThemeToggle);
    profileThemeBtn?.addEventListener('click', handleThemeToggle);
});