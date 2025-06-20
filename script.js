document.addEventListener('DOMContentLoaded', () => {
    // --- REFERÊNCIAS DE ELEMENTOS ---
    const body = document.body;
    // Telas principais
    const loginScreen = document.getElementById('login-screen');
    const signupScreen = document.getElementById('signup-screen');
    const mainApp = document.getElementById('main-app');
    const contentScreens = document.querySelectorAll('#main-app > .screen');
    // Navegação
    const bottomNav = document.querySelector('.bottom-nav');
    // Formulários
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const addVehicleForm = document.getElementById('add-vehicle-form');
    // Botões
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const googleLoginBtn = document.querySelector('.google-btn');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const addVehicleBtn = document.getElementById('add-vehicle-btn');
    const backFromAddVehicleBtn = document.getElementById('back-from-add-vehicle');
    const backToDashboardBtn = document.getElementById('back-to-dashboard');
    const editVehicleDetailsBtn = document.getElementById('edit-vehicle-details-btn');
    const editKmDetailsBtn = document.getElementById('edit-km-details-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const dashboardThemeBtn = document.getElementById('toggle-theme-btn-dashboard');
    const profileThemeBtn = document.getElementById('toggle-theme-btn-profile');
    // Dashboard
    const vehicleList = document.getElementById('vehicle-list');
    // Detalhes do Veículo
    const detailsVehicleName = document.getElementById('details-vehicle-name');
    const detailsVehicleModel = document.getElementById('details-vehicle-model');
    const currentKmDetailsSpan = document.getElementById('current-km-details');
    const summaryCardsDynamic = document.getElementById('summary-cards-dynamic');
    const maintenanceSections = document.querySelector('.maintenance-sections');
    // Histórico
    const maintenanceHistoryList = document.getElementById('maintenance-history-list');
    // Perfil
    const profileDisplayName = document.getElementById('profile-display-name');
    const profileEmail = document.getElementById('profile-email');
    // Calculadoras
    const calculateKmlBtn = document.getElementById('calculate-kml-btn');
    const kmlKmInput = document.getElementById('kml-km');
    const kmlLitersInput = document.getElementById('kml-liters');
    const kmlPriceInput = document.getElementById('kml-price');
    const kmlResultDiv = document.getElementById('kml-result');
    const calculateKmBtn = document.getElementById('calculate-km-btn');
    const kmStartDateInput = document.getElementById('km-start-date');
    const kmStartInput = document.getElementById('km-start');
    const kmEndDateInput = document.getElementById('km-end-date');
    const kmEndInput = document.getElementById('km-end');
    const kmResultDiv = document.getElementById('km-result');
    // Serviços
    const serviceBranchFilter = document.getElementById('service-branch-filter');
    const serviceCityFilter = document.getElementById('service-city-filter');
    const serviceProvidersList = document.getElementById('service-providers-list');
    const serviceDetailsModal = document.getElementById('service-details-modal');
    const serviceDetailsCloseBtn = document.getElementById('service-details-close-btn');
    // Modal Genérico
    const customModal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalInputGroup = document.getElementById('modal-input-group');
    const modalInputLabel = document.getElementById('modal-input-label');
    const modalInput = document.getElementById('modal-input');
    const modalSelect = document.getElementById('modal-select');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const modalSaveBtn = document.getElementById('modal-save-btn');
    // Toast
    const toastContainer = document.getElementById('toast-container');

    // --- ESTADO DA APLICAÇÃO ---
    let userVehicles = [];
    let currentSelectedVehicle = null;
    let currentUserId = null;

    // --- DADOS E PADRÕES ---
    const maintenanceStandards = {
        oilChange: { mineral: { km: 5000, months: 6 }, semisintetico: { km: 10000, months: 12 }, sintetico: { km: 10000, months: 12 } },
        tires: { rotation: { km: 10000, months: 6 }, change: { km: 50000, months: 60 } },
        alignment: { km: 10000, months: 6 },
        balanceamento: { km: 10000, months: 6 },
        filters: { oil: { km: 10000, months: 12 }, fuel: { km: 15000, months: 12 }, air: { km: 15000, months: 12 } },
    };
    const serviceProviders = [
        { name: "Borracharia Móvel do Neguinho", phone: "(44) 99949-6361", address: "Atendimento Móvel", hours: "08:00 - 18:00", website: null, whatsapp: "5544999496361", image: "https://i.imgur.com/g2a0gq3.jpeg", type: "Móvel", branch: "Borracharia", city: "Maringá", state: "PR" },
        { name: "Mecânica Auto Forte", phone: "(44) 3030-4040", address: "Av. Brasil, 1234", hours: "08:00 - 18:30", website: "autoforte.com.br", whatsapp: "5544987654321", image: "https://i.imgur.com/U41238a.jpeg", type: "Fixo", branch: "Mecânica", city: "Maringá", state: "PR" },
        { name: "Lava Rápido Brilho Total", phone: "(44) 91234-5678", address: "R. das Flores, 56", hours: "09:00 - 17:00", website: null, whatsapp: "5544912345678", image: "https://i.imgur.com/rSCTqCo.jpeg", type: "Fixo", branch: "Lava Jato", city: "Sarandi", state: "PR" },
        { name: "Estética Veicular Premium", phone: "(44) 99999-8888", address: "Atendimento a domicílio", hours: "Sob agendamento", website: "studiopremium.com.br", whatsapp: "5544999998888", image: "https://i.imgur.com/Jd34e9C.jpeg", type: "Móvel", branch: "Estética", city: "Maringá", state: "PR" },
    ];
    const maintTypeLabels = {
        oilChange: { title: "Troca de Óleo", fields: { lastKm: "KM da Última Troca", lastDate: "Data da Última Troca", oilType: "Tipo de Óleo" } },
        tires: { title: "Pneus", fields: { lastKm: "KM da Última Manutenção", lastDate: "Data da Última Manutenção" } },
        alignment: { title: "Alinhamento", fields: { lastKm: "KM do Último Alinhamento", lastDate: "Data do Último Alinhamento" } },
        balanceamento: { title: "Balanceamento", fields: { lastKm: "KM do Último Balanceamento", lastDate: "Data do Último Balanceamento" } },
        filters: { title: "Filtros", fields: { lastDate: "Data da Última Troca" } } // Simplificado para data
    };

    // --- FUNÇÕES AUXILIARES ---
    const parseLocaleNumber = (str) => parseFloat(String(str).replace(/\./g, '').replace(/,/g, '.'));
    const addMonthsToDate = (dateStr, months) => {
        if (!dateStr) return null;
        const d = new Date(dateStr + 'T00:00:00Z');
        if (isNaN(d.getTime())) return null;
        d.setMonth(d.getMonth() + months);
        return d.toISOString().split('T')[0];
    };
    const formatDate = (dateStr) => {
        if (!dateStr || dateStr.length < 10) return 'N/I';
        const [y, m, d] = dateStr.substring(0, 10).split('-');
        return `${d}/${m}/${y}`;
    };
    const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

    // --- UI E NAVEGAÇÃO ---
    const showScreen = (screenToShow) => {
        [loginScreen, signupScreen, mainApp].forEach(s => {
            s.classList.toggle('active', s === screenToShow);
            s.classList.toggle('hidden', s !== screenToShow);
        });
    };

    const showContentSection = (screenId) => {
        contentScreens.forEach(s => {
            s.classList.toggle('active-content', s.id === screenId);
            s.classList.toggle('hidden-content', s.id !== screenId);
        });
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.screen === screenId);
        });
        // Lógica específica ao mostrar tela
        if (screenId === 'services-screen') renderServiceProviders();
        if (screenId === 'history-screen') {
            if (currentSelectedVehicle) {
                loadMaintenanceHistory(currentSelectedVehicle.id);
            } else {
                maintenanceHistoryList.innerHTML = '<p class="no-vehicles">Selecione um veículo no dashboard para ver o histórico.</p>';
            }
        }
    };
    
    const showToast = (message, type = 'attention', duration = 3000) => {
        const toast = document.createElement('div');
        const icon = { success: 'fa-check-circle', error: 'fa-times-circle', attention: 'fa-exclamation-triangle' }[type] || 'fa-info-circle';
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="icon fas ${icon}"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        }, duration);
    };

    const showCustomModal = ({ title, message, inputType = 'text', inputLabel, inputValue = '', options = [], onSave }) => {
        modalTitle.textContent = title;
        modalMessage.textContent = message || '';
        modalInput.classList.toggle('hidden', inputType === 'select');
        modalSelect.classList.toggle('hidden', inputType !== 'select');
        modalInputGroup.style.display = inputType === 'none' ? 'none' : 'block';
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
            setTimeout(() => modalInput.focus(), 150);
        }
        
        customModal.classList.add('show');
        modalSaveBtn.onclick = () => {
            const value = inputType === 'select' ? modalSelect.value : modalInput.value;
            hideCustomModal();
            onSave(value);
        };
    };
    const hideCustomModal = () => customModal.classList.remove('show');

    // --- AUTENTICAÇÃO E PERFIL ---
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUserId = user.uid;
            profileEmail.textContent = user.email || 'Não informado';
            profileDisplayName.textContent = user.displayName || user.email.split('@')[0];
            showScreen(mainApp);
            await loadUserVehicles(currentUserId);
            showContentSection('dashboard-screen');
        } else {
            currentUserId = null;
            userVehicles = [];
            currentSelectedVehicle = null;
            showScreen(loginScreen);
        }
    });

    const getFirebaseErrorMessage = (code) => ({
        'auth/invalid-email': 'Email inválido.', 'auth/user-disabled': 'Usuário desabilitado.', 'auth/user-not-found': 'Usuário não encontrado.', 'auth/wrong-password': 'Senha incorreta.', 'auth/email-already-in-use': 'Este email já está em uso.', 'auth/weak-password': 'Senha fraca (mínimo 6 caracteres).',
    })[code] || 'Ocorreu um erro. Tente novamente.';

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm['login-email'].value, password = loginForm['login-password'].value;
        auth.signInWithEmailAndPassword(email, password)
            .then(() => showToast('Login bem-sucedido!', 'success'))
            .catch(err => showToast(getFirebaseErrorMessage(err.code), 'error'));
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = signupForm['signup-email'].value, password = signupForm['signup-password'].value;
        if (password !== signupForm['signup-confirm-password'].value) return showToast('As senhas não coincidem!', 'error');
        auth.createUserWithEmailAndPassword(email, password)
            .then(cred => db.collection('users').doc(cred.user.uid).set({ email, createdAt: firebase.firestore.FieldValue.serverTimestamp() }))
            .then(() => { showToast('Cadastro realizado!', 'success'); showScreen(loginScreen); })
            .catch(err => showToast(getFirebaseErrorMessage(err.code), 'error'));
    });

    googleLoginBtn.addEventListener('click', async () => {
        try {
            const cred = await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
            const userDoc = await db.collection('users').doc(cred.user.uid).get();
            if (!userDoc.exists) {
                await db.collection('users').doc(cred.user.uid).set({
                    email: cred.user.email, displayName: cred.user.displayName, createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            showToast('Login com Google bem-sucedido!', 'success');
        } catch (err) { showToast(getFirebaseErrorMessage(err.code), 'error'); }
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
                } catch (err) { showToast(getFirebaseErrorMessage(err.code), 'error'); }
            }
        });
    });

    logoutBtn.addEventListener('click', () => showCustomModal({ title: 'Sair da Conta', message: 'Tem certeza que deseja sair?', inputType: 'none', onSave: () => auth.signOut() }));

    // --- VEÍCULOS ---
    const loadUserVehicles = async (userId) => {
        if (!userId) return;
        try {
            const snapshot = await db.collection('users').doc(userId).collection('vehicles').orderBy('name').get();
            userVehicles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderVehicles();
        } catch(error) { showToast('Erro ao carregar veículos.', 'error'); }
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
                <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>`;
            card.querySelector('.vehicle-info').onclick = () => {
                currentSelectedVehicle = vehicle;
                updateVehicleDetailsScreen(vehicle);
                showContentSection('vehicle-details-screen');
            };
            card.querySelector('.delete-btn').onclick = (e) => {
                e.stopPropagation();
                showCustomModal({ title: 'Excluir Veículo', message: `Remover "${vehicle.name}" permanentemente?`, inputType: 'none', onSave: () => deleteVehicle(vehicle.id) });
            };
            vehicleList.appendChild(card);
        });
    };
    
    addVehicleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { value: name } = addVehicleForm['new-vehicle-name'];
        const { value: model } = addVehicleForm['new-vehicle-model'];
        const km = parseInt(addVehicleForm['new-vehicle-km'].value);
        if (!name || !model || isNaN(km)) return showToast('Preencha nome, modelo e KM.', 'attention');
        
        const { value: oilKm } = addVehicleForm['new-vehicle-oil-km'];
        const { value: oilDate } = addVehicleForm['new-vehicle-oil-date'];
        const { value: oilType } = addVehicleForm['new-vehicle-oil-type'];
        const { value: tiresKm } = addVehicleForm['new-vehicle-tires-km'];
        const { value: tiresDate } = addVehicleForm['new-vehicle-tires-date'];

        const data = {
            name, model, km, createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            maintenances: {
                oilChange: { lastKm: parseInt(oilKm) || 0, lastDate: oilDate || '', oilType: oilType || '' },
                tires: { lastKm: parseInt(tiresKm) || 0, lastDate: tiresDate || '' },
                alignment: { lastKm: 0, lastDate: '' }, balanceamento: { lastKm: 0, lastDate: '' },
                filters: { lastDate: '' } // Simplificado
            }
        };
        try {
            await db.collection('users').doc(currentUserId).collection('vehicles').add(data);
            showToast('Veículo adicionado!', 'success');
            addVehicleForm.reset();
            await loadUserVehicles(currentUserId);
            showContentSection('dashboard-screen');
        } catch { showToast('Erro ao salvar veículo.', 'error'); }
    });

    const deleteVehicle = async (vehicleId) => {
        try {
            await db.collection('users').doc(currentUserId).collection('vehicles').doc(vehicleId).delete();
            if (currentSelectedVehicle?.id === vehicleId) currentSelectedVehicle = null;
            showToast('Veículo removido.', 'success');
            await loadUserVehicles(currentUserId);
            showContentSection('dashboard-screen');
        } catch { showToast('Erro ao remover veículo.', 'error'); }
    };
    
    const handleMainFieldEdit = (field, currentValue) => {
        const labels = { name: 'Apelido do Veículo', model: 'Modelo do Veículo', km: 'KM Atual' };
        showCustomModal({
            title: `Editar ${labels[field]}`, inputType: field === 'km' ? 'number' : 'text', inputLabel: `Novo valor:`, inputValue: currentValue,
            onSave: async (newValue) => {
                const parsedValue = field === 'km' ? parseInt(newValue) : newValue.trim();
                if ((field !== 'km' && !parsedValue) || (field === 'km' && (isNaN(parsedValue) || parsedValue < (currentSelectedVehicle?.km || 0)))) {
                    return showToast('Valor inválido. O KM não pode ser menor que o atual.', 'error');
                }
                try {
                    await db.collection('users').doc(currentUserId).collection('vehicles').doc(currentSelectedVehicle.id).update({ [field]: parsedValue });
                    currentSelectedVehicle[field] = parsedValue;
                    updateVehicleDetailsScreen(currentSelectedVehicle);
                    renderVehicles(); // Atualiza card na lista
                    showToast(`${labels[field]} atualizado!`, 'success');
                } catch { showToast(`Erro ao atualizar.`, 'error'); }
            }
        });
    };

    const handleMaintenanceEdit = (maintType, field, currentValue) => {
        const typeLabel = maintTypeLabels[maintType]?.title || capitalize(maintType);
        const fieldLabel = maintTypeLabels[maintType]?.fields[field] || capitalize(field);
        
        showCustomModal({
            title: `Editar ${typeLabel}`, message: `Alterando: ${fieldLabel}`,
            inputType: field === 'lastKm' ? 'number' : (field === 'oilType' ? 'select' : 'date'),
            inputLabel: 'Novo valor:', inputValue: currentValue,
            options: field === 'oilType' ? [
                {value: '', text: 'Nenhum'}, {value: 'mineral', text: 'Mineral'}, {value: 'semisintetico', text: 'Semissintético'}, {value: 'sintetico', text: 'Sintético'}
            ] : [],
            onSave: async (newValue) => {
                const parsedValue = field === 'lastKm' ? parseInt(newValue) : newValue;
                const path = `maintenances.${maintType}.${field}`;
                try {
                    await db.collection('users').doc(currentUserId).collection('vehicles').doc(currentSelectedVehicle.id).update({ [path]: parsedValue });
                    currentSelectedVehicle.maintenances[maintType][field] = parsedValue;
                    updateVehicleDetailsScreen(currentSelectedVehicle);
                    showToast('Manutenção atualizada!', 'success');
                } catch { showToast('Erro ao atualizar.', 'error'); }
            }
        });
    };

    // --- DETALHES DO VEÍCULO E MANUTENÇÕES ---
    const calculateNextMaintenance = (type, lastKm, lastDate, subType = null) => {
        const standard = subType ? (maintenanceStandards[type]?.[subType] || maintenanceStandards[type]) : maintenanceStandards[type];
        if (!standard || (!lastKm && !lastDate)) return { display: 'N/I', nextKm: 0, nextDate: null };
        
        const nextKm = lastKm ? lastKm + standard.km : 0;
        const nextDate = lastDate ? addMonthsToDate(lastDate, standard.months) : null;
        let displayParts = [];
        if (nextKm > 0) displayParts.push(`${nextKm.toLocaleString('pt-BR')} km`);
        if (nextDate) displayParts.push(formatDate(nextDate));
        return { nextKm, nextDate, display: displayParts.length > 0 ? displayParts.join(' ou ') : 'N/I' };
    };

    const updateVehicleDetailsScreen = (v) => {
        if (!v) return;
        const m = v.maintenances || {};
        const getVal = (path, fn) => { const val = path.split('.').reduce((o, i) => o?.[i], m); return (val || val === 0) ? (fn ? fn(val) : val) : 'N/I'; };

        detailsVehicleName.textContent = v.name;
        detailsVehicleModel.textContent = v.model;
        currentKmDetailsSpan.textContent = (v.km || 0).toLocaleString('pt-BR');

        const oilChangeCalc = calculateNextMaintenance('oilChange', m.oilChange?.lastKm, m.oilChange?.lastDate, m.oilChange?.oilType);
        const tiresRotationCalc = calculateNextMaintenance('tires', m.tires?.lastKm, m.tires?.lastDate, 'rotation');
        const tiresChangeCalc = calculateNextMaintenance('tires', m.tires?.lastKm, m.tires?.lastDate, 'change');
        const alignmentCalc = calculateNextMaintenance('alignment', m.alignment?.lastKm, m.alignment?.lastDate);
        const balanceamentoCalc = calculateNextMaintenance('balanceamento', m.balanceamento?.lastKm, m.balanceamento?.lastDate);
        const filtersCalc = calculateNextMaintenance('filters', null, m.filters?.lastDate, 'air'); // Filtros baseados apenas na data
        
        document.getElementById('oil-last-km').textContent = getVal('oilChange.lastKm', v => v.toLocaleString('pt-BR') + ' km');
        document.getElementById('oil-last-date').textContent = getVal('oilChange.lastDate', formatDate);
        document.getElementById('oil-type-brand').textContent = getVal('oilChange.oilType', capitalize);
        document.getElementById('oil-next-change').textContent = oilChangeCalc.display;

        document.getElementById('pneus-last-km').textContent = getVal('tires.lastKm', v => v.toLocaleString('pt-BR') + ' km');
        document.getElementById('pneus-last-date').textContent = getVal('tires.lastDate', formatDate);
        document.getElementById('pneus-rotation-suggested').textContent = tiresRotationCalc.display;
        document.getElementById('pneus-next-change').textContent = tiresChangeCalc.display;

        document.getElementById('alignment-last-km').textContent = getVal('alignment.lastKm', v => v.toLocaleString('pt-BR') + ' km');
        document.getElementById('alignment-last-date').textContent = getVal('alignment.lastDate', formatDate);
        document.getElementById('alignment-next').textContent = alignmentCalc.display;
        
        document.getElementById('balanceamento-last-km').textContent = getVal('balanceamento.lastKm', v => v.toLocaleString('pt-BR') + ' km');
        document.getElementById('balanceamento-last-date').textContent = getVal('balanceamento.lastDate', formatDate);
        document.getElementById('balanceamento-next').textContent = balanceamentoCalc.display;

        document.getElementById('filter-oil-last-date').textContent = getVal('filters.lastDate', formatDate);
        document.getElementById('filter-fuel-last-date').textContent = getVal('filters.lastDate', formatDate);
        document.getElementById('filter-air-last-date').textContent = getVal('filters.lastDate', formatDate);
        document.getElementById('filter-oil-next').textContent = filtersCalc.display;
        document.getElementById('filter-fuel-next').textContent = filtersCalc.display;
        document.getElementById('filter-air-next').textContent = filtersCalc.display;

        renderMaintenanceSummaryCards(v.km, { oilChangeCalc, tiresRotationCalc, alignmentCalc, filtersCalc });
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
            { type: 'Troca de Óleo', icon: 'fas fa-oil-can', calc: calcs.oilChangeCalc },
            { type: 'Pneus (Rodízio)', icon: 'fas fa-tire', calc: calcs.tiresRotationCalc },
            { type: 'Alinhamento', icon: 'fas fa-align-center', calc: calcs.alignmentCalc },
            { type: 'Filtros', icon: 'fas fa-filter', calc: calcs.filtersCalc }
        ];

        items.forEach(({ type, icon, calc }) => {
            const statusClass = getStatus(currentKm, calc.nextKm, calc.nextDate);
            summaryCardsDynamic.innerHTML += `<div class="card summary-card ${statusClass}"><i class="${icon} icon"></i><h3>${type}</h3><p>${calc.display}</p></div>`;
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
            let historyItems = [];
            for (const type in m) {
                if (m[type].lastDate) {
                    let details = [];
                    if (m[type].lastKm) details.push(`KM: ${m[type].lastKm.toLocaleString('pt-BR')}`);
                    if (m[type].oilType) details.push(`Tipo: ${capitalize(m[type].oilType)}`);
                    historyItems.push({ date: m[type].lastDate, type: maintTypeLabels[type]?.title || type, details: details.join(', ') });
                }
            }
            if (historyItems.length === 0) {
                 maintenanceHistoryList.innerHTML = '<p class="no-vehicles">Nenhum histórico de manutenção encontrado.</p>'; return;
            }
            historyItems.sort((a, b) => new Date(b.date) - new Date(a.date));
            historyItems.forEach(item => {
                maintenanceHistoryList.innerHTML += `<div class="card history-item"><span class="history-date">${formatDate(item.date)}</span><span class="history-type">${item.type}</span><span class="history-details">${item.details}</span></div>`;
            });
        } catch { showToast('Erro ao carregar histórico.', 'error'); }
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

    // --- SERVIÇOS ---
    const renderServiceProviders = () => {
        const branch = serviceBranchFilter.value, city = serviceCityFilter.value.toLowerCase();
        const filtered = serviceProviders.filter(p => (!branch || p.branch === branch) && (!city || p.city.toLowerCase().includes(city)));
        serviceProvidersList.innerHTML = filtered.length === 0 ? '<p class="no-vehicles">Nenhum prestador encontrado.</p>' : '';
        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = 'card service-card';
            card.innerHTML = `<img src="${p.image}" alt="${p.name}" class="service-card-image"><h3>${p.name}</h3><p>${p.city}, ${p.state}</p><div class="service-card-tags"><span class="tag">${p.branch}</span>${p.type === 'Móvel' ? '<span class="tag">Atendimento Móvel</span>' : ''}</div>`;
            card.onclick = () => showServiceDetails(p);
            serviceProvidersList.appendChild(card);
        });
    };
    
    const showServiceDetails = (p) => {
        document.getElementById('service-details-image').src = p.image;
        document.getElementById('service-details-name').textContent = p.name;
        document.getElementById('service-details-branch').textContent = p.branch;
        document.getElementById('service-details-phone').textContent = p.phone;
        document.getElementById('service-details-address').textContent = p.address;
        document.getElementById('service-details-hours').textContent = p.hours;
        const websiteLink = document.getElementById('service-details-website');
        websiteLink.textContent = p.website || 'Não informado';
        websiteLink.href = p.website ? `https://${p.website.replace(/^https?:\/\//, '')}` : '#';
        document.getElementById('service-details-whatsapp').href = p.whatsapp ? `https://wa.me/${p.whatsapp}` : '#';
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
    maintenanceSections.addEventListener('click', (e) => {
        const card = e.target.closest('.maintenance-item');
        if (!card || !currentSelectedVehicle) return;
        const maintType = card.dataset.maintType;
        if (!maintType) return;
        const fields = Object.keys(maintTypeLabels[maintType]?.fields || {});
        if (fields.length === 1) { // Ação direta se houver só um campo editável
            handleMaintenanceEdit(maintType, fields[0], currentSelectedVehicle.maintenances[maintType]?.[fields[0]] || '');
        } else { // Abre um seletor se houver múltiplos campos
            showCustomModal({
                title: `Editar ${maintTypeLabels[maintType]?.title}`, message: 'Qual informação deseja alterar?', inputType: 'select',
                options: fields.map(f => ({ value: f, text: maintTypeLabels[maintType].fields[f] })),
                onSave: (fieldToEdit) => handleMaintenanceEdit(maintType, fieldToEdit, currentSelectedVehicle.maintenances[maintType]?.[fieldToEdit] || '')
            });
        }
    });
    [serviceBranchFilter, serviceCityFilter].forEach(el => el.addEventListener('input', renderServiceProviders));
    serviceDetailsCloseBtn.addEventListener('click', () => serviceDetailsModal.classList.remove('show'));
    modalCancelBtn.addEventListener('click', hideCustomModal);
    editProfileBtn.addEventListener('click', () => showToast('Funcionalidade em desenvolvimento.', 'attention'));

    // --- TEMA ---
    const updateThemeIcon = (isDark) => {
        const icon = isDark ? 'fa-sun' : 'fa-moon';
        if (dashboardThemeBtn) dashboardThemeBtn.innerHTML = `<i class="fas ${icon}"></i>`;
        if (profileThemeBtn) profileThemeBtn.innerHTML = `<i class="fas ${icon}"></i>`;
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