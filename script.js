// Configuración de Firebase Realtime Database
const firebaseConfig = {
    databaseURL: "https://soles-eae92-default-rtdb.firebaseio.com"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let dbProducts = [];

// Orden estricto requerido para el catálogo administrativo y navegación
const categoryHeaders = {
    'pizzas': { title: 'Pizzas' },
    'empanadas': { title: 'Empanadas' },
    'tartas': { title: 'Tartas' },
    'sandwichs': { title: 'Sándwiches clásicos' },
    'sandwichs-esp': { title: 'Sándwiches especiales' },
    'gratinados': { title: 'Gratinados' },
    'milanesas': { title: 'Milanesas' },
    'pastas': { title: 'Pastas caseras' },
    'lomo': { title: 'Platos de lomo' },
    'pollo': { title: 'Platos de pollo' },
    'papas': { title: 'Papas' },
    'tortillas': { title: 'Tortillas' },
    'omelette': { title: 'Omelette' },
    'ensaladas': { title: 'Ensaladas' },
    'bebidas': { title: 'Bebidas y postres' }
};

// Lista inicial de respaldo completa con ensaladas incluidas
const initialProductsSeed = [
    // PIZZAS
    { id: "p1", categoria: "pizzas", nombre: "Muzzarella", precio: 4500, precio_secundario: 8000, disponible: "TRUE" },
    { id: "p2", categoria: "pizzas", nombre: "Especial", precio: 5000, precio_secundario: 9000, disponible: "TRUE" },

    // EMPANADAS
    { id: "e1", categoria: "empanadas", nombre: "Carne", precio: 2500, precio_secundario: 27000, disponible: "TRUE" },
    { id: "e2", categoria: "empanadas", nombre: "Jamón y Queso", precio: 2500, precio_secundario: 27000, disponible: "TRUE" },

    // TARTAS
    { id: "t1", categoria: "tartas", nombre: "Verdura", precio: 3000, precio_secundario: 5500, disponible: "TRUE" },

    // SÁNDWICHES CLÁSICOS
    { id: "s1", categoria: "sandwichs", nombre: "Sándwich de Miga", precio: 2200, disponible: "TRUE" },
    { id: "s2", categoria: "sandwichs", nombre: "Tostado o Carlito", precio: 3500, disponible: "TRUE" },

    // SÁNDWICHES ESPECIALES
    { id: "se1", categoria: "sandwichs-esp", nombre: "Hamburguesa Completa", precio: 6500, disponible: "TRUE" },

    // GRATINADOS
    { id: "g1", categoria: "gratinados", nombre: "Gratinado de Jamón y Queso", precio: 7000, disponible: "TRUE" },

    // MILANESAS (precio: Pollo, precio_secundario: Carne)
    { id: "m1", categoria: "milanesas", nombre: "Milanesa Completa", precio: 8500, precio_secundario: 9500, disponible: "TRUE" },
    { id: "m2", categoria: "milanesas", nombre: "Milanesa Napolitana", precio: 9500, precio_secundario: 10500, disponible: "TRUE" },

    // PASTAS
    { id: "pas1", categoria: "pastas", nombre: "Tallarines", precio: 6000, disponible: "TRUE" },

    // PLATOS DE LOMO
    { id: "l1", categoria: "lomo", nombre: "Grillado a la Plancha", precio: 12500, disponible: "TRUE" },

    // PLATOS DE POLLO
    { id: "po1", categoria: "pollo", nombre: "Grillado a la Plancha", precio: 11000, disponible: "TRUE" },

    // PAPAS
    { id: "pap1", categoria: "papas", nombre: "Papas Fritas Chicas", precio: 7000, disponible: "TRUE" },

    // TORTILLAS
    { id: "tor1", categoria: "tortillas", nombre: "Tortilla de Papas Chica", precio: 7000, disponible: "TRUE" },

    // OMELETTE
    { id: "ome1", categoria: "omelette", nombre: "Omelette Tradicional", precio: 7000, disponible: "TRUE" },

    // ENSALADAS
    { id: "ens1", categoria: "ensaladas", nombre: "Ensalada Chica", precio: 4000, disponible: "TRUE" },
    { id: "ens2", categoria: "ensaladas", nombre: "Ensalada Grande", precio: 4900, disponible: "TRUE" },
    { id: "ens3", categoria: "ensaladas", nombre: "Ensalada Chica Especial", precio: 5000, disponible: "TRUE" },
    { id: "ens4", categoria: "ensaladas", nombre: "Ensalada Grande Especial", precio: 6500, disponible: "TRUE" },

    // BEBIDAS & POSTRES
    { id: "b1", categoria: "bebidas", subtipo: "bebida", nombre: "Gaseosa 1.5L", precio: 3500, disponible: "TRUE" },
    { id: "b2", categoria: "bebidas", subtipo: "postre", nombre: "Flan Casero", precio: 2500, disponible: "TRUE" }
];

let menuDiario = {
    opt1: 'Cargando...', price1: 0,
    opt2: 'Cargando...', price2: 0,
    optVeg: 'Cargando...', priceVeg: 0
};

let configOtros = {
    deliveryCost: 1500,
    cbu: '0070108830004157511274',
    alias: 'sietesolesraul',
    ensChica: 4000,
    ensGrande: 4900,
    ensEspChica: 5000,
    ensEspGrande: 6500
};

let selectedMenuDiarioOption = 'opt1';

let isMenuDiarioChanged = false;
let isOtrosChanged = false;
let isEnsaladasChanged = false;
let isProductsPanelChanged = false;
let pendingCloseAction = null;
let pendingDeleteIndex = null;

const defaultImages = {
    'pizzas': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9ZNVFLDhCCq16vmXQqERkmn827qJGAjgtMzVfK-CYjw&s=10',
    'empanadas': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk4Ev4Q5IwuYlwhO0ghjG4t9WF9CpVxCkG1CBUrNpBIQ&s=10',
    'tartas': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqoP0IL6wVRQC9hkFMHyCvuoH5hvCMB2fW9GdJ5MzBhA&s=10',
    'sandwichs': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1000&q=80',
    'sandwichs-esp': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',
    'gratinados': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1000&q=80',
    'milanesas': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTILeBZQoubn5fXEYg-Z9dRAoBvvb6pDZ9O5j1FOsb1Dg&s=10',
    'pastas': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1000&q=80',
    'lomo': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    'pollo': 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1000&q=80',
    'papas': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1000&q=80',
    'tortillas': 'https://images.unsplash.com/photo-1613564834361-9436948817d1?auto=format&fit=crop&w=1000&q=80',
    'omelette': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=80',
    'ensaladas': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80',
    'bebidas': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=1000&q=80'
};

// Ingredientes para las ensaladas según requerimientos
const baseIngredients = ["Lechuga", "Tomate", "Cebolla", "Huevo", "Zanahoria"];
const extraIngredients = ["Pollo", "Choclo", "Jamón", "Queso", "Ananá", "Palmitos"];
const saladLimits = { 'chica': 3, 'grande': 5, 'esp-chica': 4, 'esp-grande': 5 };

let cart = [];
let pendingSaladItem = null;
let pendingSwBtnElement = null;

let pizzaFlavors = [];
let empanadaFlavors = [];
let tartaFlavors = [];
let sandwichsClasicos = [];
let sandwichsEspeciales = [];
let gratinadosList = [];
let milanesasList = [];
let pastasList = [];
let lomoList = [];
let polloList = [];
let papasOptions = [];
let tortillasList = [];
let omelettesList = [];

let selectedPizzaIdx = 0;
let selectedPizzaSize = 'half';
let selectedEmpanadaFlavor = '';
let selectedEmpanadaQty = "1";
let selectedTartaFlavorIdx = 0;
let selectedTartaPortion = "1";
let selectedSwClasicoIdx = 0;
let selectedSwEspIdx = 0;
let selectedGratinadoIdx = 0;
let selectedMilaIdx = 0;
let selectedPastaIdx = 0;
let selectedLomoIdx = 0;
let selectedPolloIdx = 0;
let selectedSaladType = "chica";
let selectedSaladIngredients = new Set();

document.addEventListener('DOMContentLoaded', () => {
    listenToMenuDiario();
    listenToConfigOtros();
    renderCategoryPills();
    listenToProducts();

    const passInput = document.getElementById('admin-pass-input');
    if (passInput) {
        passInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') verifyAdminPass();
        });
    }
});

function showToast(msg) {
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');
    if (toast && toastMsg) {
        toastMsg.innerText = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

function listenToConfigOtros() {
    db.ref("ConfigOtros").on("value", (snapshot) => {
        const data = snapshot.val();
        if (data) {
            configOtros = {
                deliveryCost: parseInt(data.deliveryCost) || 1500,
                cbu: data.cbu || '0070108830004157511274',
                alias: data.alias || 'sietesolesraul',
                ensChica: parseInt(data.ensChica) || 4000,
                ensGrande: parseInt(data.ensGrande) || 4900,
                ensEspChica: parseInt(data.ensEspChica) || 5000,
                ensEspGrande: parseInt(data.ensEspGrande) || 6500
            };
        } else {
            db.ref("ConfigOtros").set(configOtros);
        }
        updateUIWithConfigOtros();
        renderMenu();
    });
}

function updateUIWithConfigOtros() {
    const formattedCost = `$${configOtros.deliveryCost.toLocaleString('es-AR')}`;
    document.querySelectorAll('.md-delivery-price-text, .cart-delivery-price-text').forEach(el => {
        el.innerText = `+${formattedCost}`;
    });
    document.querySelectorAll('.display-bank-cbu').forEach(el => el.innerText = configOtros.cbu);
    document.querySelectorAll('.display-bank-alias').forEach(el => el.innerText = configOtros.alias);
    
    const delDisplay = document.getElementById('cart-delivery-cost-display');
    if (delDisplay) delDisplay.innerText = formattedCost;

    updateCartTotal();
}

function listenToMenuDiario() {
    db.ref("MenuDiario").on("value", (snapshot) => {
        const data = snapshot.val();
        if (data) {
            menuDiario = {
                opt1: data.opt1 || 'No disponible',
                price1: parseInt(data.price1) || 0,
                opt2: data.opt2 || 'No disponible',
                price2: parseInt(data.price2) || 0,
                optVeg: data.optVeg || 'No disponible',
                priceVeg: parseInt(data.priceVeg) || 0
            };
        } else {
            const defaultMenu = {
                opt1: 'Milanesa con puré', price1: 4500,
                opt2: 'Pastel de papa', price2: 4500,
                optVeg: 'Tarta de verduras con ensalada', priceVeg: 4200
            };
            db.ref("MenuDiario").set(defaultMenu);
        }
    });
}

function listenToProducts() {
    db.ref("Productos").on("value", (snapshot) => {
        const data = snapshot.val();
        dbProducts = [];

        if (!data) {
            const updates = {};
            initialProductsSeed.forEach(prod => updates[`Productos/${prod.id}`] = prod);
            db.ref().update(updates);
            return;
        }

        Object.keys(data).forEach(key => {
            dbProducts.push({
                id: key,
                ...data[key],
                subtipo: data[key].subtipo || 'bebida',
                disponible: data[key].disponible !== undefined ? String(data[key].disponible).toUpperCase() : 'TRUE'
            });
        });

        parseProductsData();
        renderMenu();

        const adminModal = document.getElementById('admin-panel-modal');
        if (adminModal && adminModal.classList.contains('open')) {
            renderAdminProductsList(document.getElementById('admin-search-input')?.value || '');
        }
    });
}

function parseProductsData() {
    const activeProducts = dbProducts.filter(p => String(p.disponible).toUpperCase() === 'TRUE');

    pizzaFlavors = activeProducts.filter(p => p.categoria === 'pizzas').map(p => ({
        id: p.id, name: p.nombre, halfPrice: parseInt(p.precio) || 0, fullPrice: parseInt(p.precio_secundario) || 0
    }));

    empanadaFlavors = activeProducts.filter(p => p.categoria === 'empanadas').map(p => p.nombre);

    tartaFlavors = activeProducts.filter(p => p.categoria === 'tartas').map(p => ({
        id: p.id, name: p.nombre, price1: parseInt(p.precio) || 0, price2: parseInt(p.precio_secundario) || 0
    }));

    sandwichsClasicos = activeProducts.filter(p => p.categoria === 'sandwichs').map(p => ({
        id: p.id, name: p.nombre, price: parseInt(p.precio) || 0
    }));

    sandwichsEspeciales = activeProducts.filter(p => p.categoria === 'sandwichs-esp').map(p => ({
        id: p.id, name: p.nombre, price: parseInt(p.precio) || 0
    }));

    gratinadosList = activeProducts.filter(p => p.categoria === 'gratinados').map(p => ({
        id: p.id, name: p.nombre, price: parseInt(p.precio) || 0
    }));

    milanesasList = activeProducts.filter(p => p.categoria === 'milanesas').map(p => ({
        id: p.id,
        name: p.nombre,
        pricePollo: parseInt(p.precio) || 0,
        priceTernera: parseInt(p.precio_secundario) || (parseInt(p.precio) || 0)
    }));

    pastasList = activeProducts.filter(p => p.categoria === 'pastas').map(p => ({
        id: p.id, name: p.nombre, price: parseInt(p.precio) || 0
    }));

    lomoList = activeProducts.filter(p => p.categoria === 'lomo').map(p => ({
        id: p.id, name: p.nombre, price: parseInt(p.precio) || 0
    }));

    polloList = activeProducts.filter(p => p.categoria === 'pollo').map(p => ({
        id: p.id, name: p.nombre, price: parseInt(p.precio) || 0
    }));

    papasOptions = activeProducts.filter(p => p.categoria === 'papas').map(p => ({
        id: p.id, name: p.nombre, price: parseInt(p.precio) || 0
    }));

    tortillasList = activeProducts.filter(p => p.categoria === 'tortillas').map(p => ({
        id: p.id, name: p.nombre, price: parseInt(p.precio) || 0
    }));

    omelettesList = activeProducts.filter(p => p.categoria === 'omelette').map(p => ({
        id: p.id, name: p.nombre, price: parseInt(p.precio) || 0
    }));
}

function openConfigModal() {
    const input = document.getElementById('admin-pass-input');
    input.value = '';
    input.type = 'password';
    document.getElementById('pass-eye-icon').className = 'fa-solid fa-eye';
    document.getElementById('config-auth-modal').classList.add('open');
    setTimeout(() => input.focus(), 100);
}

function closeConfigAuthModal() {
    document.getElementById('config-auth-modal').classList.remove('open');
}

function togglePasswordVisibility() {
    const input = document.getElementById('admin-pass-input');
    const icon = document.getElementById('pass-eye-icon');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fa-solid fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fa-solid fa-eye';
    }
}

function verifyAdminPass() {
    const pass = document.getElementById('admin-pass-input').value;
    if (pass === '7solespororo') {
        closeConfigAuthModal();
        openAdminSelectorModal();
    } else {
        alert('Contraseña incorrecta.');
    }
}

function openAdminSelectorModal() {
    document.getElementById('admin-menu-selector-modal').classList.add('open');
}

function closeAdminSelectorModal() {
    document.getElementById('admin-menu-selector-modal').classList.remove('open');
}

function openAdminProductsPanel() {
    closeAdminSelectorModal();
    isProductsPanelChanged = false;
    openAdminPanel();
}

function cancelAdminProductsModal() {
    document.getElementById('admin-panel-modal').classList.remove('open');
    openAdminSelectorModal();
}

function exitAdminProductsModal() {
    document.getElementById('admin-panel-modal').classList.remove('open');
    showToast("Catálogo guardado con éxito");
}

function openAdminMenuDiarioPanel() {
    closeAdminSelectorModal();
    document.getElementById('admin-menu-opt1').value = menuDiario.opt1 || '';
    document.getElementById('admin-menu-price1').value = menuDiario.price1 || '';
    document.getElementById('admin-menu-opt2').value = menuDiario.opt2 || '';
    document.getElementById('admin-menu-price2').value = menuDiario.price2 || '';
    document.getElementById('admin-menu-optveg').value = menuDiario.optVeg || '';
    document.getElementById('admin-menu-priceveg').value = menuDiario.priceVeg || '';
    
    isMenuDiarioChanged = false;
    document.getElementById('admin-menu-diario-modal').classList.add('open');
}

function markMenuDiarioChanged() { isMenuDiarioChanged = true; }

function cancelAdminMenuDiarioModal() {
    forceCloseAdminMenuDiarioModal();
    openAdminSelectorModal();
}

function forceCloseAdminMenuDiarioModal() {
    document.getElementById('admin-menu-diario-modal').classList.remove('open');
    isMenuDiarioChanged = false;
}

function saveAdminMenuDiario() {
    const opt1 = document.getElementById('admin-menu-opt1').value.trim();
    const price1 = parseInt(document.getElementById('admin-menu-price1').value) || 0;
    const opt2 = document.getElementById('admin-menu-opt2').value.trim();
    const price2 = parseInt(document.getElementById('admin-menu-price2').value) || 0;
    const optVeg = document.getElementById('admin-menu-optveg').value.trim();
    const priceVeg = parseInt(document.getElementById('admin-menu-priceveg').value) || 0;

    const updatedMenu = {
        opt1: opt1 || 'No disponible', price1,
        opt2: opt2 || 'No disponible', price2,
        optVeg: optVeg || 'No disponible', priceVeg
    };

    db.ref("MenuDiario").set(updatedMenu).then(() => {
        forceCloseAdminMenuDiarioModal();
        showToast("Menú del Día guardado correctamente");
    });
}

function openAdminEnsaladasPanel() {
    closeAdminSelectorModal();
    document.getElementById('admin-ens-chica').value = configOtros.ensChica || 4000;
    document.getElementById('admin-ens-grande').value = configOtros.ensGrande || 4900;
    document.getElementById('admin-ens-esp-chica').value = configOtros.ensEspChica || 5000;
    document.getElementById('admin-ens-esp-grande').value = configOtros.ensEspGrande || 6500;

    isEnsaladasChanged = false;
    document.getElementById('admin-ensaladas-modal').classList.add('open');
}

function markEnsaladasChanged() { isEnsaladasChanged = true; }

function cancelAdminEnsaladasModal() {
    forceCloseAdminEnsaladasModal();
    openAdminSelectorModal();
}

function forceCloseAdminEnsaladasModal() {
    document.getElementById('admin-ensaladas-modal').classList.remove('open');
    isEnsaladasChanged = false;
}

function saveAdminEnsaladas() {
    const ensChica = parseInt(document.getElementById('admin-ens-chica').value) || 0;
    const ensGrande = parseInt(document.getElementById('admin-ens-grande').value) || 0;
    const ensEspChica = parseInt(document.getElementById('admin-ens-esp-chica').value) || 0;
    const ensEspGrande = parseInt(document.getElementById('admin-ens-esp-grande').value) || 0;

    if (isNaN(ensChica) || isNaN(ensGrande) || isNaN(ensEspChica) || isNaN(ensEspGrande)) {
        alert('Por favor ingresá precios válidos para las ensaladas.');
        return;
    }

    const updated = {
        ...configOtros,
        ensChica,
        ensGrande,
        ensEspChica,
        ensEspGrande
    };

    db.ref("ConfigOtros").set(updated).then(() => {
        forceCloseAdminEnsaladasModal();
        showToast("Precios de ensaladas guardados correctamente");
    });
}

function openAdminOtrosPanel() {
    closeAdminSelectorModal();
    document.getElementById('admin-delivery-cost').value = configOtros.deliveryCost || 1500;
    document.getElementById('admin-bank-cbu').value = configOtros.cbu || '';
    document.getElementById('admin-bank-alias').value = configOtros.alias || '';

    isOtrosChanged = false;
    document.getElementById('admin-otros-modal').classList.add('open');
}

function markOtrosChanged() { isOtrosChanged = true; }

function cancelAdminOtrosModal() {
    forceCloseAdminOtrosModal();
    openAdminSelectorModal();
}

function forceCloseAdminOtrosModal() {
    document.getElementById('admin-otros-modal').classList.remove('open');
    isOtrosChanged = false;
}

function saveAdminOtros() {
    const cost = parseInt(document.getElementById('admin-delivery-cost').value);
    const cbu = document.getElementById('admin-bank-cbu').value.trim();
    const alias = document.getElementById('admin-bank-alias').value.trim();

    if (isNaN(cost) || !cbu || !alias) {
        alert('Por favor completá todos los campos correctamente.');
        return;
    }

    const updated = { 
        ...configOtros,
        deliveryCost: cost, 
        cbu, 
        alias
    };

    db.ref("ConfigOtros").set(updated).then(() => {
        forceCloseAdminOtrosModal();
        showToast("Datos generales guardados correctamente");
    });
}

function openUnsavedModal() {
    document.getElementById('confirm-unsaved-modal').classList.add('open');
}

function closeUnsavedModal() {
    document.getElementById('confirm-unsaved-modal').classList.remove('open');
}

function confirmSaveAndExit() {
    closeUnsavedModal();
    if (pendingCloseAction && pendingCloseAction.save) pendingCloseAction.save();
}

function confirmExitWithoutSave() {
    closeUnsavedModal();
    if (pendingCloseAction && pendingCloseAction.close) pendingCloseAction.close();
}

function openMenuDiarioModal() {
    const container = document.getElementById('menu-diario-options-container');
    container.innerHTML = `
        <label class="menu-diario-card-option selected" onclick="selectMenuDiarioOption('opt1', this)">
            <div style="display:flex; align-items:center; gap:10px;">
                <input type="radio" name="public-menu-opt" value="opt1" checked>
                <div class="menu-diario-opt-info">
                    <span class="menu-diario-opt-title">Opción 1</span>
                    <span class="menu-diario-opt-desc">${menuDiario.opt1}</span>
                </div>
            </div>
            <span class="menu-diario-opt-price">${menuDiario.price1 > 0 ? `$${menuDiario.price1.toLocaleString('es-AR')}` : ''}</span>
        </label>
        <label class="menu-diario-card-option" onclick="selectMenuDiarioOption('opt2', this)">
            <div style="display:flex; align-items:center; gap:10px;">
                <input type="radio" name="public-menu-opt" value="opt2">
                <div class="menu-diario-opt-info">
                    <span class="menu-diario-opt-title">Opción 2</span>
                    <span class="menu-diario-opt-desc">${menuDiario.opt2}</span>
                </div>
            </div>
            <span class="menu-diario-opt-price">${menuDiario.price2 > 0 ? `$${menuDiario.price2.toLocaleString('es-AR')}` : ''}</span>
        </label>
        <label class="menu-diario-card-option" onclick="selectMenuDiarioOption('optVeg', this)">
            <div style="display:flex; align-items:center; gap:10px;">
                <input type="radio" name="public-menu-opt" value="optVeg">
                <div class="menu-diario-opt-info">
                    <span class="menu-diario-opt-title">Menú Vegetariano</span>
                    <span class="menu-diario-opt-desc">${menuDiario.optVeg}</span>
                </div>
            </div>
            <span class="menu-diario-opt-price">${menuDiario.priceVeg > 0 ? `$${menuDiario.priceVeg.toLocaleString('es-AR')}` : ''}</span>
        </label>
    `;
    selectedMenuDiarioOption = 'opt1';
    updateMdCheckoutFields();
    document.getElementById('public-menu-diario-modal').classList.add('open');
}

function closeMenuDiarioModal() {
    document.getElementById('public-menu-diario-modal').classList.remove('open');
}

function selectMenuDiarioOption(key, element) {
    selectedMenuDiarioOption = key;
    document.querySelectorAll('.menu-diario-card-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    const radio = element.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
}

function updateMdCheckoutFields() {
    const deliveryType = document.querySelector('input[name="md-delivery-type"]:checked').value;
    const paymentMethod = document.getElementById('md-payment-method').value;

    document.getElementById('md-address-group').style.display = (deliveryType === 'delivery') ? 'block' : 'none';
    document.getElementById('md-transfer-info').style.display = (paymentMethod === 'Transferencia') ? 'block' : 'none';
    document.getElementById('md-cash-change-group').style.display = (deliveryType === 'delivery' && paymentMethod === 'Efectivo') ? 'block' : 'none';
}

function sendWhatsAppMenuDiarioOrder() {
    const name = document.getElementById('md-client-name').value.trim();
    if (!name) { alert('Por favor ingresá tu nombre y apellido.'); return; }

    const deliveryType = document.querySelector('input[name="md-delivery-type"]:checked').value;
    const address = document.getElementById('md-client-address').value.trim();
    if (deliveryType === 'delivery' && !address) { alert('Por favor ingresá la dirección para delivery.'); return; }

    const paymentMethod = document.getElementById('md-payment-method').value;
    const cashAmount = document.getElementById('md-cash-amount').value.trim();
    if (deliveryType === 'delivery' && paymentMethod === 'Efectivo' && !cashAmount) { alert('Por favor especificá con cuánto vas a pagar.'); return; }

    const notes = document.getElementById('md-client-notes').value.trim();
    
    let chosenTitle = 'Opción 1';
    let chosenDesc = menuDiario.opt1;
    let chosenPrice = menuDiario.price1;

    if (selectedMenuDiarioOption === 'opt2') {
        chosenTitle = 'Opción 2'; chosenDesc = menuDiario.opt2; chosenPrice = menuDiario.price2;
    } else if (selectedMenuDiarioOption === 'optVeg') {
        chosenTitle = 'Menú Vegetariano'; chosenDesc = menuDiario.optVeg; chosenPrice = menuDiario.priceVeg;
    }

    const orderNum = Math.floor(1000 + Math.random() * 9000);

    let text = `*PEDIDO MENÚ DEL DÍA #${orderNum} - SIETE SOLES*\n`;
    text += `---------------------------------\n`;
    text += `*Cliente:* ${name}\n`;
    text += `*Modalidad:* ${deliveryType === 'delivery' ? `Delivery (+$${configOtros.deliveryCost.toLocaleString('es-AR')})` : 'Retiro en Local'}\n`;
    if (deliveryType === 'delivery') text += `*Dirección:* ${address}\n`;
    text += `*Pago:* ${paymentMethod}\n`;
    if (deliveryType === 'delivery' && paymentMethod === 'Efectivo') text += `*Paga con:* ${cashAmount}\n`;
    if (notes) text += `*Notas:* ${notes}\n`;
    text += `---------------------------------\n`;
    text += `*MENÚ ELEGIDO:*\n• *${chosenTitle}:* ${chosenDesc} (${chosenPrice > 0 ? `$${chosenPrice.toLocaleString('es-AR')}` : ''})\n`;
    text += `---------------------------------\n`;

    window.open(`https://wa.me/543464527827?text=${encodeURIComponent(text)}`, '_blank');
}

function openAdminPanel() {
    document.getElementById('admin-search-input').value = '';
    renderAdminProductsList();
    document.getElementById('admin-panel-modal').classList.add('open');
}

// Renderizado del Catálogo de Productos Ordenado Estrictamente según Requerimientos
function renderAdminProductsList(filterText = '') {
    const container = document.getElementById('admin-products-list');
    container.innerHTML = '';
    const query = filterText.toLowerCase().trim();

    const orderedCategories = Object.keys(categoryHeaders);
    
    const sortedProducts = [...dbProducts].sort((a, b) => {
        let indexA = orderedCategories.indexOf(a.categoria);
        let indexB = orderedCategories.indexOf(b.categoria);
        if (indexA === -1) indexA = 999;
        if (indexB === -1) indexB = 999;
        return indexA - indexB;
    });

    sortedProducts.forEach((prod) => {
        const index = dbProducts.findIndex(p => p.id === prod.id);
        const catTitle = categoryHeaders[prod.categoria]?.title || prod.categoria;
        if (query && !prod.nombre.toLowerCase().includes(query) && !catTitle.toLowerCase().includes(query)) return;

        const isPizzaOrTarta = ['pizzas', 'tartas'].includes(prod.categoria);
        const isMilanesa = prod.categoria === 'milanesas';
        const isEmpanada = prod.categoria === 'empanadas';
        const isBebidas = prod.categoria === 'bebidas';
        const isAvailable = String(prod.disponible).toUpperCase() === 'TRUE';

        let inputsHTML = '';
        if (isPizzaOrTarta) {
            inputsHTML = `
                <div class="admin-prod-inputs multi-inputs">
                    <div>
                        <label style="font-size:0.65rem; color:var(--text-muted); display:block;">Nombre / Gusto</label>
                        <input type="text" id="admin-name-${index}" value="${prod.nombre}" oninput="isProductsPanelChanged = true">
                    </div>
                    <div>
                        <label style="font-size:0.65rem; color:var(--text-muted); display:block;">${prod.categoria === 'pizzas' ? 'Precio 1/2' : 'Precio 1 Porción'}</label>
                        <input type="number" id="admin-price-${index}" value="${prod.precio}" oninput="isProductsPanelChanged = true">
                    </div>
                    <div>
                        <label style="font-size:0.65rem; color:var(--text-muted); display:block;">${prod.categoria === 'pizzas' ? 'Precio Entera' : 'Precio 2 Porciones'}</label>
                        <input type="number" id="admin-price-sec-${index}" value="${prod.precio_secundario || 0}" oninput="isProductsPanelChanged = true">
                    </div>
                </div>
            `;
        } else if (isMilanesa) {
            inputsHTML = `
                <div class="admin-prod-inputs multi-inputs">
                    <div>
                        <label style="font-size:0.65rem; color:var(--text-muted); display:block;">Nombre / Variedad</label>
                        <input type="text" id="admin-name-${index}" value="${prod.nombre}" oninput="isProductsPanelChanged = true">
                    </div>
                    <div>
                        <label style="font-size:0.65rem; color:var(--text-muted); display:block;">Precio Pollo ($)</label>
                        <input type="number" id="admin-price-${index}" value="${prod.precio}" oninput="isProductsPanelChanged = true">
                    </div>
                    <div>
                        <label style="font-size:0.65rem; color:var(--text-muted); display:block;">Precio Carne ($)</label>
                        <input type="number" id="admin-price-sec-${index}" value="${prod.precio_secundario || prod.precio || 0}" oninput="isProductsPanelChanged = true">
                    </div>
                </div>
            `;
        } else if (isEmpanada) {
            inputsHTML = `
                <div class="admin-prod-inputs multi-inputs">
                    <div>
                        <label style="font-size:0.65rem; color:var(--text-muted); display:block;">Gusto</label>
                        <input type="text" id="admin-name-${index}" value="${prod.nombre}" oninput="isProductsPanelChanged = true">
                    </div>
                    <div>
                        <label style="font-size:0.65rem; color:var(--text-muted); display:block;">Precio Unidad ($)</label>
                        <input type="number" id="admin-price-${index}" value="${prod.precio}" oninput="isProductsPanelChanged = true">
                    </div>
                    <div>
                        <label style="font-size:0.65rem; color:var(--text-muted); display:block;">Precio Docena ($)</label>
                        <input type="number" id="admin-price-sec-${index}" value="${prod.precio_secundario || 0}" oninput="isProductsPanelChanged = true">
                    </div>
                </div>
            `;
        } else if (isBebidas) {
            inputsHTML = `
                <div class="admin-prod-inputs multi-inputs">
                    <div>
                        <label style="font-size:0.65rem; color:var(--text-muted); display:block;">Nombre / Gusto</label>
                        <input type="text" id="admin-name-${index}" value="${prod.nombre}" oninput="isProductsPanelChanged = true">
                    </div>
                    <div>
                        <label style="font-size:0.65rem; color:var(--text-muted); display:block;">Tipo</label>
                        <select id="admin-subtipo-${index}" onchange="isProductsPanelChanged = true">
                            <option value="bebida" ${prod.subtipo === 'bebida' ? 'selected' : ''}>Bebida</option>
                            <option value="postre" ${prod.subtipo === 'postre' ? 'selected' : ''}>Postre</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:0.65rem; color:var(--text-muted); display:block;">Precio ($)</label>
                        <input type="number" id="admin-price-${index}" value="${prod.precio}" oninput="isProductsPanelChanged = true">
                    </div>
                </div>
            `;
        } else {
            inputsHTML = `
                <div class="admin-prod-inputs">
                    <div>
                        <label style="font-size:0.65rem; color:var(--text-muted); display:block;">Nombre / Gusto / Variedad</label>
                        <input type="text" id="admin-name-${index}" value="${prod.nombre}" oninput="isProductsPanelChanged = true">
                    </div>
                    <div>
                        <label style="font-size:0.65rem; color:var(--text-muted); display:block;">Precio ($)</label>
                        <input type="number" id="admin-price-${index}" value="${prod.precio}" oninput="isProductsPanelChanged = true">
                    </div>
                </div>
            `;
        }

        container.innerHTML += `
            <div class="admin-prod-card ${!isAvailable ? 'disabled-prod' : ''}">
                <div class="admin-prod-header">
                    <span class="admin-prod-cat">${catTitle}</span>
                    <span class="status-tag">${isAvailable ? 'Visible' : 'Oculto'}</span>
                </div>
                ${inputsHTML}
                <div class="admin-card-actions">
                    <button class="btn-save-prod" onclick="saveProductChanges(${index})"><i class="fa-solid fa-floppy-disk"></i> Guardar</button>
                    <button class="btn-toggle-prod" onclick="toggleProductAvailability(${index})">${isAvailable ? 'Ocultar' : 'Mostrar'}</button>
                    <button class="btn-delete-prod" onclick="confirmDeleteProduct(${index})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
    });
}

function filterAdminProducts() {
    renderAdminProductsList(document.getElementById('admin-search-input').value);
}

function saveProductChanges(index) {
    const prod = dbProducts[index];
    const name = document.getElementById(`admin-name-${index}`).value;
    const price = document.getElementById(`admin-price-${index}`).value;
    const updatedData = { ...prod, nombre: name, precio: price };

    if (['pizzas', 'empanadas', 'tartas', 'milanesas'].includes(prod.categoria)) {
        const secInput = document.getElementById(`admin-price-sec-${index}`);
        if (secInput) updatedData.precio_secundario = secInput.value;
    }

    if (prod.categoria === 'bebidas') {
        const subtipoInput = document.getElementById(`admin-subtipo-${index}`);
        if (subtipoInput) updatedData.subtipo = subtipoInput.value;
    }

    db.ref(`Productos/${prod.id}`).update(updatedData).then(() => {
        showToast(`Producto "${name}" actualizado correctamente`);
    });
}

function toggleProductAvailability(index) {
    const prod = dbProducts[index];
    const isCurrentlyAvailable = String(prod.disponible).toUpperCase() === 'TRUE';
    db.ref(`Productos/${prod.id}/disponible`).set(isCurrentlyAvailable ? 'FALSE' : 'TRUE').then(() => {
        showToast(`Visibilidad de "${prod.nombre}" actualizada`);
    });
}

function confirmDeleteProduct(index) {
    pendingDeleteIndex = index;
    const prod = dbProducts[index];
    document.getElementById('delete-modal-text').innerText = `¿Estás seguro de que querés eliminar permanentemente el producto "${prod.nombre}"? Esta acción no se puede deshacer.`;
    document.getElementById('confirm-delete-modal').classList.add('open');
}

function closeDeleteModal() {
    document.getElementById('confirm-delete-modal').classList.remove('open');
    pendingDeleteIndex = null;
}

function executeProductDeletion() {
    if (pendingDeleteIndex !== null && dbProducts[pendingDeleteIndex]) {
        const prod = dbProducts[pendingDeleteIndex];
        db.ref(`Productos/${prod.id}`).remove().then(() => {
            closeDeleteModal();
            showToast(`Producto "${prod.nombre}" eliminado`);
        });
    }
}

function openAddProductModal() {
    document.getElementById('new-prod-name').value = '';
    document.getElementById('new-prod-price').value = '';
    toggleCategoryPriceFields();
    document.getElementById('add-product-modal').classList.add('open');
}

function closeAddProductModal() {
    document.getElementById('add-product-modal').classList.remove('open');
}

function toggleCategoryPriceFields() {
    const cat = document.getElementById('new-prod-category').value;
    document.getElementById('standard-price-group').style.display = 'none';
    document.getElementById('pizza-prices-group').style.display = 'none';
    document.getElementById('milanesa-prices-group').style.display = 'none';
    document.getElementById('empanada-prices-group').style.display = 'none';
    document.getElementById('tarta-prices-group').style.display = 'none';
    document.getElementById('bebida-subtipo-group').style.display = 'none';

    if (cat === 'pizzas') document.getElementById('pizza-prices-group').style.display = 'block';
    else if (cat === 'milanesas') document.getElementById('milanesa-prices-group').style.display = 'block';
    else if (cat === 'empanadas') document.getElementById('empanada-prices-group').style.display = 'block';
    else if (cat === 'tartas') document.getElementById('tarta-prices-group').style.display = 'block';
    else {
        document.getElementById('standard-price-group').style.display = 'block';
        if (cat === 'bebidas') document.getElementById('bebida-subtipo-group').style.display = 'block';
    }
}

function saveNewProduct() {
    const category = document.getElementById('new-prod-category').value;
    const name = document.getElementById('new-prod-name').value.trim();

    if (!name) { alert('Ingresá el nombre del producto.'); return; }

    const prodId = `prod_${Date.now()}`;
    let newProd = { id: prodId, categoria: category, nombre: name, disponible: 'TRUE' };

    if (category === 'pizzas') {
        newProd.precio = document.getElementById('new-prod-price-half').value || 0;
        newProd.precio_secundario = document.getElementById('new-prod-price-full').value || 0;
    } else if (category === 'milanesas') {
        const pPollo = document.getElementById('new-prod-price-mila-pollo').value || 0;
        const pTernera = document.getElementById('new-prod-price-mila-ternera').value || 0;
        newProd.precio = pPollo;
        newProd.precio_secundario = pTernera;
    } else if (category === 'empanadas') {
        newProd.precio = document.getElementById('new-prod-price-emp-unit').value || 0;
        newProd.precio_secundario = document.getElementById('new-prod-price-emp-dozen').value || 0;
    } else if (category === 'tartas') {
        newProd.precio = document.getElementById('new-prod-price-tarta-p1').value || 0;
        newProd.precio_secundario = document.getElementById('new-prod-price-tarta-p2').value || 0;
    } else {
        newProd.precio = document.getElementById('new-prod-price').value || 0;
        if (category === 'bebidas') {
            newProd.subtipo = document.getElementById('new-prod-subtipo').value || 'bebida';
        }
    }

    db.ref(`Productos/${prodId}`).set(newProd).then(() => {
        closeAddProductModal();
        showToast("Nuevo producto agregado");
    });
}

function renderCategoryPills() {
    const pillsContainer = document.getElementById('category-pills');
    pillsContainer.innerHTML = `<button class="pill-btn active" onclick="filterCategory('all', this)">Menú Completo</button>`;

    Object.keys(categoryHeaders).forEach(catKey => {
        pillsContainer.innerHTML += `<button class="pill-btn" onclick="filterCategory('${catKey}', this)">${categoryHeaders[catKey].title}</button>`;
    });
}

function filterCategory(catKey, element) {
    document.querySelectorAll('.pill-btn').forEach(btn => btn.classList.remove('active'));
    if (element) element.classList.add('active');

    const sections = document.querySelectorAll('.category-section');
    sections.forEach(sec => {
        sec.style.display = (catKey === 'all' || sec.id === `section-${catKey}`) ? 'block' : 'none';
    });

    if (catKey !== 'all') {
        const secEl = document.getElementById(`section-${catKey}`);
        if (secEl) secEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function renderMenu() {
    const container = document.getElementById('menu-container');
    if (!container) return;
    container.innerHTML = '';

    Object.keys(categoryHeaders).forEach(catKey => {
        const catInfo = categoryHeaders[catKey];
        const sectionHTML = document.createElement('section');
        sectionHTML.className = 'category-section';
        sectionHTML.id = `section-${catKey}`;

        sectionHTML.innerHTML = `
            <div class="category-cover">
                <img src="${defaultImages[catKey]}" alt="${catInfo.title}" class="cover-img">
                <div class="cover-overlay">
                    <h2>${catInfo.title}</h2>
                </div>
            </div>
            <div class="products-grid" id="grid-${catKey}"></div>
        `;

        container.appendChild(sectionHTML);
        const gridContainer = sectionHTML.querySelector(`#grid-${catKey}`);

        if (catKey === 'pizzas' && pizzaFlavors.length > 0) renderPizzasCardGrouped(gridContainer);
        else if (catKey === 'empanadas' && empanadaFlavors.length > 0) renderEmpanadasCard(gridContainer);
        else if (catKey === 'tartas' && tartaFlavors.length > 0) renderTartasCard(gridContainer);
        else if (catKey === 'sandwichs' && sandwichsClasicos.length > 0) renderSandwichsClasicosCard(gridContainer);
        else if (catKey === 'sandwichs-esp' && sandwichsEspeciales.length > 0) renderSandwichsEspecialesCard(gridContainer);
        else if (catKey === 'gratinados' && gratinadosList.length > 0) renderGratinadosCard(gridContainer);
        else if (catKey === 'milanesas' && milanesasList.length > 0) renderMilanesasCard(gridContainer);
        else if (catKey === 'pastas' && pastasList.length > 0) renderPastasCard(gridContainer);
        else if (catKey === 'lomo' && lomoList.length > 0) renderLomoCards(gridContainer);
        else if (catKey === 'pollo' && polloList.length > 0) renderPolloCards(gridContainer);
        else if (catKey === 'papas') renderPapasCards(gridContainer);
        else if (catKey === 'tortillas') renderTortillasCards(gridContainer);
        else if (catKey === 'omelette') renderOmeletteCards(gridContainer);
        else if (catKey === 'ensaladas') renderEnsaladasCard(gridContainer);
        else if (catKey === 'bebidas') renderBebidasCards(gridContainer);
    });
}

function renderPizzasCardGrouped(container) {
    container.innerHTML = `
        <div class="product-card">
            <div class="step-wrapper">
                <span class="step-label">1. Variedad:</span>
                <div class="flavor-grid">
                    ${pizzaFlavors.map((p, idx) => `
                        <button class="flavor-bubble ${idx === 0 ? 'selected' : ''}" onclick="selectPizzaFlavor(${idx}, this)">
                            Pizza ${p.name}
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="step-wrapper">
                <span class="step-label">2. Tamaño:</span>
                <div class="variant-pills">
                    <button class="variant-btn selected" id="pizza-btn-half" onclick="selectPizzaSize('half', this)">½ Pizza</button>
                    <button class="variant-btn" id="pizza-btn-full" onclick="selectPizzaSize('full', this)">Pizza Entera</button>
                </div>
            </div>

            <div class="product-bottom">
                <div class="price-box">
                    <span class="price-label">Precio</span>
                    <span class="price" id="pizza-price-display">$0</span>
                </div>
                <button class="btn-add" onclick="addPizzaToCartGrouped(this)">Agregar</button>
            </div>
        </div>
    `;
    selectedPizzaIdx = 0;
    selectedPizzaSize = 'half';
    updatePizzaPriceDisplay();
}

function selectPizzaFlavor(idx, btn) {
    selectedPizzaIdx = idx;
    btn.parentElement.querySelectorAll('.flavor-bubble').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    updatePizzaPriceDisplay();
}

function selectPizzaSize(size, btn) {
    selectedPizzaSize = size;
    btn.parentElement.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    updatePizzaPriceDisplay();
}

function updatePizzaPriceDisplay() {
    const pizza = pizzaFlavors[selectedPizzaIdx];
    if (!pizza) return;
    const price = selectedPizzaSize === 'half' ? pizza.halfPrice : pizza.fullPrice;

    const btnHalf = document.getElementById('pizza-btn-half');
    const btnFull = document.getElementById('pizza-btn-full');

    if (btnHalf && btnFull) {
        btnHalf.innerText = `½ Pizza ($${pizza.halfPrice.toLocaleString('es-AR')})`;
        btnFull.innerText = `Pizza Entera ($${pizza.fullPrice.toLocaleString('es-AR')})`;
    }

    document.getElementById('pizza-price-display').innerText = `$${price.toLocaleString('es-AR')}`;
}

function addPizzaToCartGrouped(btn) {
    const pizza = pizzaFlavors[selectedPizzaIdx];
    const price = selectedPizzaSize === 'half' ? pizza.halfPrice : pizza.fullPrice;
    const sizeText = selectedPizzaSize === 'half' ? '½ Pizza' : 'Pizza Entera';

    addToCart({
        id: `pizza-${selectedPizzaIdx}-${selectedPizzaSize}`,
        name: `Pizza ${pizza.name} (${sizeText})`,
        price
    }, btn);
}

function renderEmpanadasCard(container) {
    const basePriceItem = dbProducts.find(p => p.categoria === 'empanadas' && String(p.disponible).toUpperCase() === 'TRUE');
    const unitPrice = basePriceItem ? (parseInt(basePriceItem.precio) || 2500) : 2500;
    const dozenPrice = basePriceItem ? (parseInt(basePriceItem.precio_secundario) || 27000) : 27000;

    container.innerHTML = `
        <div class="product-card">
            <div class="step-wrapper">
                <span class="step-label">1. Gusto:</span>
                <div class="flavor-grid">
                    ${empanadaFlavors.map((f, idx) => `
                        <button class="flavor-bubble ${idx === 0 ? 'selected' : ''}" onclick="selectEmpanadaFlavor('${f}', this)">${f}</button>
                    `).join('')}
                </div>
            </div>

            <div class="step-wrapper">
                <span class="step-label">2. Cantidad:</span>
                <div class="variant-pills">
                    <button class="variant-btn selected" onclick="selectEmpanadaQty('1', ${unitPrice}, this)">1 Unid ($${unitPrice.toLocaleString('es-AR')})</button>
                    <button class="variant-btn" onclick="selectEmpanadaQty('2', ${unitPrice * 2}, this)">2 Unid ($${(unitPrice * 2).toLocaleString('es-AR')})</button>
                    <button class="variant-btn" onclick="selectEmpanadaQty('12', ${dozenPrice}, this)">1 Docena ($${dozenPrice.toLocaleString('es-AR')})</button>
                </div>
            </div>

            <div class="product-bottom">
                <div class="price-box">
                    <span class="price-label">Precio</span>
                    <span class="price" id="emp-price-display">$${unitPrice.toLocaleString('es-AR')}</span>
                </div>
                <button class="btn-add" onclick="addEmpanadaToCart(this)">Agregar</button>
            </div>
        </div>
    `;
    selectedEmpanadaFlavor = empanadaFlavors[0];
    selectedEmpanadaQty = "1";
}

function selectEmpanadaFlavor(flavor, btn) {
    selectedEmpanadaFlavor = flavor;
    btn.parentElement.querySelectorAll('.flavor-bubble').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}

function selectEmpanadaQty(qty, price, btn) {
    selectedEmpanadaQty = qty;
    btn.parentElement.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('emp-price-display').innerText = `$${price.toLocaleString('es-AR')}`;
}

function addEmpanadaToCart(btn) {
    const basePriceItem = dbProducts.find(p => p.categoria === 'empanadas' && String(p.disponible).toUpperCase() === 'TRUE');
    const unitPrice = basePriceItem ? (parseInt(basePriceItem.precio) || 2500) : 2500;
    const dozenPrice = basePriceItem ? (parseInt(basePriceItem.precio_secundario) || 27000) : 27000;

    const priceMap = { "1": unitPrice, "2": unitPrice * 2, "12": dozenPrice };
    const qtyText = selectedEmpanadaQty === "12" ? "1 Docena" : `${selectedEmpanadaQty} Unid.`;
    const price = priceMap[selectedEmpanadaQty];

    addToCart({
        id: `emp-${selectedEmpanadaFlavor}-${selectedEmpanadaQty}`,
        name: `Empanada (${selectedEmpanadaFlavor} - ${qtyText})`,
        price
    }, btn);
}

function renderTartasCard(container) {
    container.innerHTML = `
        <div class="product-card">
            <div class="step-wrapper">
                <span class="step-label">1. Gusto:</span>
                <div class="flavor-grid">
                    ${tartaFlavors.map((t, idx) => `
                        <button class="flavor-bubble ${idx === 0 ? 'selected' : ''}" onclick="selectTartaFlavor(${idx}, this)">Tarta de ${t.name}</button>
                    `).join('')}
                </div>
            </div>

            <div class="step-wrapper">
                <span class="step-label">2. Porciones:</span>
                <div class="variant-pills">
                    <button class="variant-btn selected" id="tarta-btn-p1" onclick="selectTartaPortions('1', this)">1 Porción</button>
                    <button class="variant-btn" id="tarta-btn-p2" onclick="selectTartaPortions('2', this)">2 Porciones</button>
                </div>
            </div>

            <div class="product-bottom">
                <div class="price-box">
                    <span class="price-label">Precio</span>
                    <span class="price" id="tarta-price-display">$0</span>
                </div>
                <button class="btn-add" onclick="addTartaToCart(this)">Agregar</button>
            </div>
        </div>
    `;
    selectedTartaFlavorIdx = 0;
    selectedTartaPortion = "1";
    updateTartaPriceDisplay();
}

function selectTartaFlavor(idx, btn) {
    selectedTartaFlavorIdx = idx;
    btn.parentElement.querySelectorAll('.flavor-bubble').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    updateTartaPriceDisplay();
}

function selectTartaPortions(portion, btn) {
    selectedTartaPortion = portion;
    btn.parentElement.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    updateTartaPriceDisplay();
}

function updateTartaPriceDisplay() {
    const tarta = tartaFlavors[selectedTartaFlavorIdx];
    if (!tarta) return;

    const price = selectedTartaPortion === '1' ? tarta.price1 : tarta.price2;

    const btnP1 = document.getElementById('tarta-btn-p1');
    const btnP2 = document.getElementById('tarta-btn-p2');

    if (btnP1 && btnP2) {
        btnP1.innerText = `1 Porción ($${tarta.price1.toLocaleString('es-AR')})`;
        btnP2.innerText = `2 Porciones ($${tarta.price2.toLocaleString('es-AR')})`;
    }

    document.getElementById('tarta-price-display').innerText = `$${price.toLocaleString('es-AR')}`;
}

function addTartaToCart(btn) {
    const tarta = tartaFlavors[selectedTartaFlavorIdx];
    const price = selectedTartaPortion === '1' ? tarta.price1 : tarta.price2;

    addToCart({
        id: `tarta-${tarta.name}-${selectedTartaPortion}`,
        name: `Tarta de ${tarta.name} (${selectedTartaPortion} ${selectedTartaPortion === '1' ? 'porción' : 'porciones'})`,
        price
    }, btn);
}

function renderSandwichsClasicosCard(container) {
    container.innerHTML = `
        <div class="product-card">
            <div class="step-wrapper">
                <span class="step-label">Variedad:</span>
                <div class="flavor-grid">
                    ${sandwichsClasicos.map((sw, idx) => `
                        <button class="flavor-bubble ${idx === 0 ? 'selected' : ''}" onclick="selectSwClasico(${idx}, this)">
                            ${sw.name}
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="product-bottom">
                <div class="price-box">
                    <span class="price-label">Precio</span>
                    <span class="price" id="sw-clasico-price">$${sandwichsClasicos[0].price.toLocaleString('es-AR')}</span>
                </div>
                <button class="btn-add" onclick="addSwClasicoToCart(this)">Agregar</button>
            </div>
        </div>
    `;
    selectedSwClasicoIdx = 0;
}

function selectSwClasico(idx, btn) {
    selectedSwClasicoIdx = idx;
    btn.parentElement.querySelectorAll('.flavor-bubble').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('sw-clasico-price').innerText = `$${sandwichsClasicos[idx].price.toLocaleString('es-AR')}`;
}

function addSwClasicoToCart(btn) {
    const item = sandwichsClasicos[selectedSwClasicoIdx];
    if (item.name === 'Tostado o Carlito') {
        pendingSwBtnElement = btn;
        document.getElementById('tostado-carlito-modal').classList.add('open');
    } else {
        addToCart({ id: `sw-c-${item.id}`, name: item.name, price: item.price }, btn);
    }
}

function confirmTostadoCarlitoChoice(choice) {
    const item = sandwichsClasicos[selectedSwClasicoIdx];
    addToCart({ id: `sw-c-${item.id}-${choice}`, name: choice, price: item.price }, pendingSwBtnElement);
    closeTostadoCarlitoModal();
}

function closeTostadoCarlitoModal() {
    document.getElementById('tostado-carlito-modal').classList.remove('open');
    pendingSwBtnElement = null;
}

function renderSandwichsEspecialesCard(container) {
    container.innerHTML = `
        <div class="product-card">
            <div class="step-wrapper">
                <span class="step-label">Variedad:</span>
                <div class="flavor-grid">
                    ${sandwichsEspeciales.map((sw, idx) => `
                        <button class="flavor-bubble ${idx === 0 ? 'selected' : ''}" onclick="selectSwEspecial(${idx}, this)">
                            ${sw.name}
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="product-bottom">
                <div class="price-box">
                    <span class="price-label">Precio</span>
                    <span class="price" id="sw-esp-price">$${sandwichsEspeciales[0].price.toLocaleString('es-AR')}</span>
                </div>
                <button class="btn-add" onclick="addSwEspecialToCart(this)">Agregar</button>
            </div>
        </div>
    `;
    selectedSwEspIdx = 0;
}

function selectSwEspecial(idx, btn) {
    selectedSwEspIdx = idx;
    btn.parentElement.querySelectorAll('.flavor-bubble').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('sw-esp-price').innerText = `$${sandwichsEspeciales[idx].price.toLocaleString('es-AR')}`;
}

function addSwEspecialToCart(btn) {
    const item = sandwichsEspeciales[selectedSwEspIdx];
    addToCart({ id: `sw-e-${item.id}`, name: item.name, price: item.price }, btn);
}

function renderGratinadosCard(container) {
    container.innerHTML = `
        <div class="product-card">
            <div class="step-wrapper">
                <span class="step-label">Variedad:</span>
                <div class="flavor-grid">
                    ${gratinadosList.map((g, idx) => `
                        <button class="flavor-bubble ${idx === 0 ? 'selected' : ''}" onclick="selectGratinado(${idx}, this)">
                            ${g.name}
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="product-bottom">
                <div class="price-box">
                    <span class="price-label">Precio</span>
                    <span class="price" id="gratinado-price">$${gratinadosList[0].price.toLocaleString('es-AR')}</span>
                </div>
                <button class="btn-add" onclick="addGratinadoToCart(this)">Agregar</button>
            </div>
        </div>
    `;
    selectedGratinadoIdx = 0;
}

function selectGratinado(idx, btn) {
    selectedGratinadoIdx = idx;
    btn.parentElement.querySelectorAll('.flavor-bubble').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('gratinado-price').innerText = `$${gratinadosList[idx].price.toLocaleString('es-AR')}`;
}

function addGratinadoToCart(btn) {
    const item = gratinadosList[selectedGratinadoIdx];
    addToCart({ id: `grat-${item.id}`, name: item.name, price: item.price }, btn);
}

function renderMilanesasCard(container) {
    container.innerHTML = `
        <div class="product-card">
            <div class="step-wrapper">
                <span class="step-label">1. Variedad:</span>
                <div class="flavor-grid">
                    ${milanesasList.map((m, idx) => `
                        <button class="flavor-bubble ${idx === 0 ? 'selected' : ''}" onclick="selectMilanesa(${idx}, this)">
                            ${m.name}
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="step-wrapper">
                <div class="option-field">
                    <label class="step-label">2. Carne:</label>
                    <select id="mila-carne-type" onchange="updateMilanesaPriceDisplay()">
                        <option value="Pollo">Pollo</option>
                        <option value="Carne">Carne</option>
                    </select>
                </div>
                <div class="option-field" style="margin-top: 8px;">
                    <label class="step-label">3. Guarnición:</label>
                    <select id="mila-guarnicion-side">
                        <option value="Papas Fritas">Papas Fritas</option>
                        <option value="Ensalada">Ensalada</option>
                    </select>
                </div>
            </div>

            <div class="product-bottom">
                <div class="price-box">
                    <span class="price-label">Precio</span>
                    <span class="price" id="mila-price-display">$0</span>
                </div>
                <button class="btn-add" onclick="addMilanesaCardToCart(this)">Agregar</button>
            </div>
        </div>
    `;
    selectedMilaIdx = 0;
    updateMilanesaPriceDisplay();
}

function selectMilanesa(idx, btn) {
    selectedMilaIdx = idx;
    btn.parentElement.querySelectorAll('.flavor-bubble').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    updateMilanesaPriceDisplay();
}

function updateMilanesaPriceDisplay() {
    const item = milanesasList[selectedMilaIdx];
    if (!item) return;
    const carneType = document.getElementById('mila-carne-type')?.value || 'Pollo';
    const finalPrice = carneType === 'Carne' ? item.priceTernera : item.pricePollo;
    document.getElementById('mila-price-display').innerText = `$${finalPrice.toLocaleString('es-AR')}`;
}

function addMilanesaCardToCart(btn) {
    const item = milanesasList[selectedMilaIdx];
    const carne = document.getElementById('mila-carne-type').value;
    const side = document.getElementById('mila-guarnicion-side').value;
    const finalPrice = carne === 'Carne' ? item.priceTernera : item.pricePollo;

    addToCart({
        id: `mila-${item.id}-${carne}-${side}-${Date.now()}`,
        name: `${item.name} (${carne})`,
        details: `Guarnición: ${side}`,
        isMilaEnsalada: (side === 'Ensalada'),
        saladChoice: '',
        price: finalPrice
    }, btn);
}

function renderPastasCard(container) {
    container.innerHTML = `
        <div class="product-card">
            <div class="step-wrapper">
                <span class="step-label">1. Variedad:</span>
                <div class="flavor-grid">
                    ${pastasList.map((p, idx) => `
                        <button class="flavor-bubble ${idx === 0 ? 'selected' : ''}" onclick="selectPasta(${idx}, this)">
                            ${p.name}
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="step-wrapper">
                <div class="option-field">
                    <label class="step-label">2. Salsa / Acompañamiento:</label>
                    <select id="pasta-salsa-select" onchange="updatePastaCardPrice()">
                        <option value="Salsa Común / Crema / Tuco" data-extra="0">Salsa Común / Crema / Tuco</option>
                        <option value="Salsa Boloñesa" data-extra="2000">Salsa Boloñesa (+ $2.000)</option>
                        <option value="Estofado" data-extra="2900">Estofado (+ $2.900)</option>
                    </select>
                </div>
            </div>

            <div class="product-bottom">
                <div class="price-box">
                    <span class="price-label">Precio</span>
                    <span class="price" id="pasta-card-price">$${pastasList[0].price.toLocaleString('es-AR')}</span>
                </div>
                <button class="btn-add" onclick="addPastaCardToCart(this)">Agregar</button>
            </div>
        </div>
    `;
    selectedPastaIdx = 0;
}

function selectPasta(idx, btn) {
    selectedPastaIdx = idx;
    btn.parentElement.querySelectorAll('.flavor-bubble').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    updatePastaCardPrice();
}

function updatePastaCardPrice() {
    const item = pastasList[selectedPastaIdx];
    const select = document.getElementById('pasta-salsa-select');
    const extra = parseInt(select.options[select.selectedIndex].getAttribute('data-extra'));
    document.getElementById('pasta-card-price').innerText = `$${(item.price + extra).toLocaleString('es-AR')}`;
}

function addPastaCardToCart(btn) {
    const item = pastasList[selectedPastaIdx];
    const select = document.getElementById('pasta-salsa-select');
    const sauce = select.value;
    const extra = parseInt(select.options[select.selectedIndex].getAttribute('data-extra'));
    const price = item.price + extra;
    const isCommonSauce = (sauce === "Salsa Común / Crema / Tuco");

    addToCart({
        id: `pasta-${item.id}-${Date.now()}`,
        name: `${item.name}`,
        details: isCommonSauce ? 'Salsa Común' : `Salsa: ${sauce}`,
        isPastaComun: isCommonSauce,
        sauceOption: isCommonSauce ? 'Tuco' : sauce,
        price
    }, btn);
}

function renderLomoCards(container) {
    container.innerHTML = `
        <div class="product-card">
            <div class="step-wrapper">
                <div class="option-field">
                    <label class="step-label">Preparación / Variedad de Lomo:</label>
                    <select id="lomo-select" onchange="updateLomoPrice()">
                        ${lomoList.map((item, idx) => `<option value="${idx}">Lomo ${item.name} - $${item.price.toLocaleString('es-AR')}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="product-bottom">
                <div class="price-box">
                    <span class="price-label">Precio</span>
                    <span class="price" id="lomo-price-display">$${lomoList[0].price.toLocaleString('es-AR')}</span>
                </div>
                <button class="btn-add" onclick="addLomoToCart(this)">Agregar</button>
            </div>
        </div>
    `;
    selectedLomoIdx = 0;
}

function updateLomoPrice() {
    const idx = document.getElementById('lomo-select').value;
    selectedLomoIdx = idx;
    document.getElementById('lomo-price-display').innerText = `$${lomoList[idx].price.toLocaleString('es-AR')}`;
}

function addLomoToCart(btn) {
    const item = lomoList[selectedLomoIdx];
    addToCart({ id: `lomo-${item.id}`, name: `Lomo ${item.name}`, price: item.price }, btn);
}

function renderPolloCards(container) {
    container.innerHTML = `
        <div class="product-card">
            <div class="step-wrapper">
                <div class="option-field">
                    <label class="step-label">Preparación / Variedad de Pollo:</label>
                    <select id="pollo-select" onchange="updatePolloPrice()">
                        ${polloList.map((item, idx) => `<option value="${idx}">Pollo ${item.name} - $${item.price.toLocaleString('es-AR')}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="product-bottom">
                <div class="price-box">
                    <span class="price-label">Precio</span>
                    <span class="price" id="pollo-price-display">$${polloList[0].price.toLocaleString('es-AR')}</span>
                </div>
                <button class="btn-add" onclick="addPolloToCart(this)">Agregar</button>
            </div>
        </div>
    `;
    selectedPolloIdx = 0;
}

function updatePolloPrice() {
    const idx = document.getElementById('pollo-select').value;
    selectedPolloIdx = idx;
    document.getElementById('pollo-price-display').innerText = `$${polloList[idx].price.toLocaleString('es-AR')}`;
}

function addPolloToCart(btn) {
    const item = polloList[selectedPolloIdx];
    addToCart({ id: `pollo-${item.id}`, name: `Pollo ${item.name}`, price: item.price }, btn);
}

function renderPapasCards(container) {
    const list = papasOptions.length > 0 ? papasOptions : [{ id: "pap1", name: "Papas Fritas Chicas", price: 7000 }];
    container.innerHTML = `
        <div class="product-card">
            <div class="step-wrapper">
                <div class="option-field">
                    <label class="step-label">Opción de Papas:</label>
                    <select id="papas-option" onchange="updatePapasPrice()">
                        ${list.map((p, idx) => `<option value="${idx}">${p.name} - $${p.price.toLocaleString('es-AR')}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="product-bottom">
                <div class="price-box">
                    <span class="price-label">Precio</span>
                    <span class="price" id="papas-price-display">$${list[0].price.toLocaleString('es-AR')}</span>
                </div>
                <button class="btn-add" onclick="addPapasToCart(this)">Agregar</button>
            </div>
        </div>
    `;
}

function updatePapasPrice() {
    const idx = document.getElementById('papas-option').value;
    const item = papasOptions[idx];
    if (item) document.getElementById('papas-price-display').innerText = `$${item.price.toLocaleString('es-AR')}`;
}

function addPapasToCart(btn) {
    const idx = document.getElementById('papas-option').value;
    const item = papasOptions[idx];
    if (item) addToCart({ id: `papas-${item.id}`, name: item.name, price: item.price }, btn);
}

function renderTortillasCards(container) {
    const list = tortillasList.length > 0 ? tortillasList : [{ id: "tor1", name: "Tortilla de Papas Chica", price: 7000 }];
    container.innerHTML = `
        <div class="product-card">
            <div class="step-wrapper">
                <div class="option-field">
                    <label class="step-label">Opción de Tortilla:</label>
                    <select id="tortilla-size" onchange="updateTortillaPrice()">
                        ${list.map((t, idx) => `<option value="${idx}">${t.name} - $${t.price.toLocaleString('es-AR')}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="product-bottom">
                <div class="price-box">
                    <span class="price-label">Precio</span>
                    <span class="price" id="tortilla-price-display">$${list[0].price.toLocaleString('es-AR')}</span>
                </div>
                <button class="btn-add" onclick="addTortillaToCart(this)">Agregar</button>
            </div>
        </div>
    `;
}

function updateTortillaPrice() {
    const idx = document.getElementById('tortilla-size').value;
    const item = tortillasList[idx];
    if (item) document.getElementById('tortilla-price-display').innerText = `$${item.price.toLocaleString('es-AR')}`;
}

function addTortillaToCart(btn) {
    const idx = document.getElementById('tortilla-size').value;
    const item = tortillasList[idx];
    if (item) addToCart({ id: `tortilla-${item.id}`, name: item.name, price: item.price }, btn);
}

function renderOmeletteCards(container) {
    const list = omelettesList.length > 0 ? omelettesList : [{ id: "ome1", name: "Omelette Tradicional", price: 7000 }];
    container.innerHTML = `
        <div class="product-card">
            <div class="step-wrapper">
                <div class="option-field">
                    <label class="step-label">Opción de Omelette:</label>
                    <select id="omelette-type" onchange="updateOmelettePrice()">
                        ${list.map((o, idx) => `<option value="${idx}">${o.name} - $${o.price.toLocaleString('es-AR')}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="product-bottom">
                <div class="price-box">
                    <span class="price-label">Precio</span>
                    <span class="price" id="omelette-price-display">$${list[0].price.toLocaleString('es-AR')}</span>
                </div>
                <button class="btn-add" onclick="addOmeletteToCart(this)">Agregar</button>
            </div>
        </div>
    `;
}

function updateOmelettePrice() {
    const idx = document.getElementById('omelette-type').value;
    const item = omelettesList[idx];
    if (item) document.getElementById('omelette-price-display').innerText = `$${item.price.toLocaleString('es-AR')}`;
}

function addOmeletteToCart(btn) {
    const idx = document.getElementById('omelette-type').value;
    const item = omelettesList[idx];
    if (item) addToCart({ id: `omelette-${item.id}`, name: item.name, price: item.price }, btn);
}

// Renderizado de Ensaladas vinculado a ConfigOtros
function renderEnsaladasCard(container) {
    const priceChica = configOtros.ensChica;
    const priceGrande = configOtros.ensGrande;
    const priceEspChica = configOtros.ensEspChica;
    const priceEspGrande = configOtros.ensEspGrande;

    container.innerHTML = `
        <div class="product-card">
            <div class="step-wrapper">
                <span class="step-label">1. Elegir Tamaño:</span>
                <div class="variant-pills">
                    <button class="variant-btn selected" onclick="selectSaladType('chica', ${priceChica}, this)">Chica (hasta 3 ing.) - $${priceChica.toLocaleString('es-AR')}</button>
                    <button class="variant-btn" onclick="selectSaladType('grande', ${priceGrande}, this)">Grande (hasta 5 ing.) - $${priceGrande.toLocaleString('es-AR')}</button>
                    <button class="variant-btn" onclick="selectSaladType('esp-chica', ${priceEspChica}, this)">Especial chica (4 ing.) - $${priceEspChica.toLocaleString('es-AR')}</button>
                    <button class="variant-btn" onclick="selectSaladType('esp-grande', ${priceEspGrande}, this)">Especial grande (hasta 5 ing.) - $${priceEspGrande.toLocaleString('es-AR')}</button>
                </div>
            </div>

            <div class="step-wrapper">
                <span class="step-label">2. Ingredientes Normales:</span>
                <div class="flavor-grid">
                    ${baseIngredients.map(ing => `
                        <button class="flavor-bubble" onclick="toggleSaladIngredient('${ing}', false, this)">${ing}</button>
                    `).join('')}
                </div>

                <span class="step-label" style="margin-top: 12px; display: block;">Ingredientes Especiales:</span>
                <div class="flavor-grid" id="salad-extra-grid">
                    ${extraIngredients.map(ing => `
                        <button class="flavor-bubble disabled-bubble" onclick="toggleSaladIngredient('${ing}', true, this)">${ing}</button>
                    `).join('')}
                </div>
            </div>

            <div class="product-bottom">
                <div class="price-box">
                    <span class="price-label">Precio</span>
                    <span class="price" id="salad-price-display">$${priceChica.toLocaleString('es-AR')}</span>
                </div>
                <button class="btn-add" onclick="validateAndAddSalad(this)">Agregar</button>
            </div>
        </div>
    `;

    selectedSaladType = "chica";
    selectedSaladIngredients.clear();
    updateSaladBubblesState();
}

function selectSaladType(type, price, btn) {
    selectedSaladType = type;
    btn.parentElement.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    document.getElementById('salad-price-display').innerText = `$${price.toLocaleString('es-AR')}`;

    if (!selectedSaladType.startsWith('esp')) {
        extraIngredients.forEach(ing => selectedSaladIngredients.delete(ing));
    }

    updateSaladBubblesState();
}

function toggleSaladIngredient(ing, isExtra, btn) {
    const maxAllowed = saladLimits[selectedSaladType] || 3;
    const isSpecial = selectedSaladType.startsWith('esp');

    if (isExtra && !isSpecial) return;

    if (selectedSaladIngredients.has(ing)) {
        selectedSaladIngredients.delete(ing);
    } else {
        if (selectedSaladIngredients.size < maxAllowed) {
            selectedSaladIngredients.add(ing);
        }
    }

    updateSaladBubblesState();
}

function updateSaladBubblesState() {
    const maxAllowed = saladLimits[selectedSaladType] || 3;
    const isSpecial = selectedSaladType.startsWith('esp');

    document.querySelectorAll('#section-ensaladas .flavor-bubble').forEach(btn => {
        const text = btn.innerText;
        const isExtra = extraIngredients.includes(text);

        if (selectedSaladIngredients.has(text)) {
            btn.classList.add('selected');
            btn.classList.remove('disabled-bubble');
        } else {
            btn.classList.remove('selected');
            if ((isExtra && !isSpecial) || selectedSaladIngredients.size >= maxAllowed) {
                btn.classList.add('disabled-bubble');
            } else {
                btn.classList.remove('disabled-bubble');
            }
        }
    });
}

function validateAndAddSalad(btn) {
    const maxAllowed = saladLimits[selectedSaladType] || 3;

    const priceMap = { 
        'chica': configOtros.ensChica, 
        'grande': configOtros.ensGrande, 
        'esp-chica': configOtros.ensEspChica, 
        'esp-grande': configOtros.ensEspGrande 
    };
    const price = priceMap[selectedSaladType];

    const typeNames = {
        'chica': 'Chica', 'grande': 'Grande',
        'esp-chica': 'Especial Chica', 'esp-grande': 'Especial Grande'
    };

    const totalSelected = Array.from(selectedSaladIngredients);

    if (totalSelected.length === 0) {
        alert('Seleccioná al menos un ingrediente.');
        return;
    }

    const itemObj = {
        id: `salad-${Date.now()}`,
        name: `Ensalada (${typeNames[selectedSaladType]})`,
        details: `Ingredientes: ${totalSelected.join(', ')}`,
        price
    };

    if (totalSelected.length < maxAllowed) {
        const missing = maxAllowed - totalSelected.length;
        pendingSaladItem = itemObj;
        document.getElementById('salad-modal-text').innerText = `Te faltan seleccionar ${missing} ingrediente${missing > 1 ? 's' : ''} para completar el máximo permitido (${maxAllowed}). ¿Deseás agregarla así o volver y agregar más ingredientes?`;

        document.getElementById('btn-force-salad').onclick = () => {
            addToCart(pendingSaladItem, btn);
            closeSaladModal();
        };

        document.getElementById('salad-confirm-modal').classList.add('open');
    } else {
        addToCart(itemObj, btn);
    }
}

function closeSaladModal() {
    document.getElementById('salad-confirm-modal').classList.remove('open');
    pendingSaladItem = null;
}

function renderBebidasCards(container) {
    const bebidasData = dbProducts
        .filter(p => p.categoria === 'bebidas' && String(p.disponible).toUpperCase() === 'TRUE')
        .map(p => ({
            id: p.id,
            name: p.nombre,
            subtipo: p.subtipo || 'bebida',
            price: parseInt(p.precio) || 0,
            isGaseosa: p.nombre.toLowerCase().includes('gaseosa')
        }));

    const bebidasGroup = bebidasData.filter(b => b.subtipo === 'bebida');
    const postresGroup = bebidasData.filter(b => b.subtipo === 'postre');

    const flavors = ["Cola", "Lima", "Fanta", "Pomelo"];

    if (bebidasGroup.length > 0) {
        container.insertAdjacentHTML('beforeend', `<div class="subgroup-title"><i class="fa-solid fa-glass-water"></i> Bebidas</div>`);
        bebidasGroup.forEach(item => {
            container.insertAdjacentHTML('beforeend', `
                <div class="product-card">
                    <div class="step-wrapper">
                        <span class="step-label">${item.name}</span>
                        ${item.isGaseosa ? `
                            <div class="option-field" style="margin-top: 4px;">
                                <label class="step-label">Sabor:</label>
                                <select id="bebida-flavor-${item.id}">
                                    ${flavors.map(f => `<option value="${f}">${f}</option>`).join('')}
                                </select>
                            </div>
                        ` : ''}
                    </div>
                    <div class="product-bottom">
                        <div class="price-box">
                            <span class="price-label">Precio</span>
                            <span class="price">$${item.price.toLocaleString('es-AR')}</span>
                        </div>
                        <button class="btn-add" onclick="addBebidaToCartCustom('${item.id}', '${item.name}', ${item.price}, ${item.isGaseosa}, this)">Agregar</button>
                    </div>
                </div>
            `);
        });
    }

    if (postresGroup.length > 0) {
        container.insertAdjacentHTML('beforeend', `<div class="subgroup-title" style="margin-top:20px;"><i class="fa-solid fa-ice-cream"></i> Postres</div>`);
        postresGroup.forEach(item => {
            container.insertAdjacentHTML('beforeend', `
                <div class="product-card">
                    <div class="step-wrapper">
                        <span class="step-label">${item.name}</span>
                    </div>
                    <div class="product-bottom">
                        <div class="price-box">
                            <span class="price-label">Precio</span>
                            <span class="price">$${item.price.toLocaleString('es-AR')}</span>
                        </div>
                        <button class="btn-add" onclick="addBebidaToCartCustom('${item.id}', '${item.name}', ${item.price}, false, this)">Agregar</button>
                    </div>
                </div>
            `);
        });
    }
}

function addBebidaToCartCustom(id, name, price, isGaseosa, btn) {
    if (isGaseosa) {
        const flavor = document.getElementById(`bebida-flavor-${id}`).value;
        addToCart({ id: `bebida-${id}-${flavor}`, name: `${name} (${flavor})`, price }, btn);
    } else {
        addToCart({ id: `bebida-${id}`, name, price }, btn);
    }
}

function triggerAddAnimation(buttonElement) {
    if (!buttonElement) return;

    const originalHTML = buttonElement.innerHTML;
    buttonElement.innerText = "¡Agregado!";
    buttonElement.style.pointerEvents = "none";

    setTimeout(() => {
        buttonElement.innerHTML = originalHTML;
        buttonElement.style.pointerEvents = "auto";
    }, 1000);
}

function addToCart(item, btnElement = null) {
    if (item.isMilaEnsalada || item.isPastaComun) {
        cart.push({ ...item, qty: 1 });
    } else {
        const existing = cart.find(i => i.id === item.id && i.details === item.details);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ ...item, qty: 1 });
        }
    }

    updateCartUI();

    if (btnElement) {
        triggerAddAnimation(btnElement);
    }
}

function updateQty(index, delta) {
    if (cart[index]) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
    }
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateSaladChoice(index, value) {
    if (cart[index]) cart[index].saladChoice = value;
}

function updatePastaSauceOption(index, value) {
    if (cart[index]) cart[index].sauceOption = value;
}

function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');

    const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
    cartCount.innerText = totalCount;

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><i class="fa-solid fa-utensils"></i><p>El carrito está vacío.</p></div>';
    } else {
        cartItems.innerHTML = cart.map((item, idx) => `
            <div class="cart-item">
                <div class="cart-item-header">
                    <div>
                        <div class="cart-item-title">${item.name}</div>
                        ${item.details ? `<div class="cart-item-detail">${item.details}</div>` : ''}
                        <div class="cart-item-detail">$${item.price.toLocaleString('es-AR')} c/u</div>
                    </div>
                    <button class="btn-remove" onclick="removeFromCart(${idx})" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                </div>

                ${item.isMilaEnsalada ? `
                    <div class="cart-item-custom-input">
                        <label>Ingredientes de ensalada (hasta 3):</label>
                        <input type="text" placeholder="Ej: lechuga, tomate" 
                               value="${item.saladChoice || ''}" 
                               oninput="updateSaladChoice(${idx}, this.value)">
                    </div>
                ` : ''}

                ${item.isPastaComun ? `
                    <div class="cart-item-custom-input">
                        <label>¿Qué salsa preferís?</label>
                        <select class="cart-item-select" onchange="updatePastaSauceOption(${idx}, this.value)">
                            <option value="Tuco" ${item.sauceOption === 'Tuco' ? 'selected' : ''}>Tuco</option>
                            <option value="Crema" ${item.sauceOption === 'Crema' ? 'selected' : ''}>Crema</option>
                            <option value="Mixta" ${item.sauceOption === 'Mixta' ? 'selected' : ''}>Mixta (Tuco + Crema)</option>
                        </select>
                    </div>
                ` : ''}

                <div class="cart-item-footer">
                    <div class="item-qty">
                        <button class="qty-btn" onclick="updateQty(${idx}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty(${idx}, 1)">+</button>
                    </div>
                    <strong>$${(item.price * item.qty).toLocaleString('es-AR')}</strong>
                </div>
            </div>
        `).join('');
    }

    updateCartTotal();
}

function updateCartTotal() {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;
    const addressGroup = document.getElementById('address-group');
    const deliveryCostLine = document.getElementById('delivery-cost-line');

    let deliveryCost = 0;

    if (deliveryType === 'delivery') {
        deliveryCost = configOtros.deliveryCost;
        addressGroup.style.display = 'block';
        deliveryCostLine.style.display = 'flex';
    } else {
        addressGroup.style.display = 'none';
        deliveryCostLine.style.display = 'none';
    }

    const total = subtotal + deliveryCost;

    document.getElementById('cart-subtotal').innerText = `$${subtotal.toLocaleString('es-AR')}`;
    document.getElementById('cart-total').innerText = `$${total.toLocaleString('es-AR')}`;

    togglePaymentInfo();
}

function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.classList.toggle('open');
    document.body.style.overflow = cartModal.classList.contains('open') ? 'hidden' : '';
}

function togglePaymentInfo() {
    const method = document.getElementById('payment-method').value;
    const deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;

    document.getElementById('transfer-info').style.display = (method === 'Transferencia') ? 'block' : 'none';
    document.getElementById('cash-change-group').style.display = (deliveryType === 'delivery' && method === 'Efectivo') ? 'block' : 'none';
}

function sendWhatsAppOrder() {
    if (cart.length === 0) { alert('El carrito está vacío.'); return; }

    const name = document.getElementById('client-name').value.trim();
    if (!name) { alert('Por favor ingresá tu nombre.'); return; }

    const deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;
    const address = document.getElementById('client-address').value.trim();
    if (deliveryType === 'delivery' && !address) { alert('Por favor ingresá la dirección.'); return; }

    const paymentMethod = document.getElementById('payment-method').value;
    const cashAmount = document.getElementById('cash-amount').value.trim();
    if (deliveryType === 'delivery' && paymentMethod === 'Efectivo' && !cashAmount) { alert('Especificá con cuánto vas a pagar.'); return; }

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].isMilaEnsalada && (!cart[i].saladChoice || !cart[i].saladChoice.trim())) {
            alert(`Especificá la ensalada para "${cart[i].name}".`);
            return;
        }
    }

    const notes = document.getElementById('client-notes').value.trim();
    const orderNum = Math.floor(1000 + Math.random() * 9000);

    let text = `*NUEVO PEDIDO #${orderNum} - SIETE SOLES*\n`;
    text += `---------------------------------\n`;
    text += `*Cliente:* ${name}\n`;
    text += `*Modalidad:* ${deliveryType === 'delivery' ? `Delivery (+$${configOtros.deliveryCost.toLocaleString('es-AR')})` : 'Retiro en Local'}\n`;
    if (deliveryType === 'delivery') text += `*Dirección:* ${address}\n`;
    text += `*Pago:* ${paymentMethod}\n`;
    if (deliveryType === 'delivery' && paymentMethod === 'Efectivo') text += `*Paga con:* ${cashAmount}\n`;
    if (notes) text += `*Notas:* ${notes}\n`;
    text += `---------------------------------\n`;
    text += `*DETALLE DEL PEDIDO:*\n`;

    cart.forEach(item => {
        text += `• ${item.qty}x ${item.name}`;
        if (item.details) text += `\n   _${item.details}_`;
        if (item.isMilaEnsalada && item.saladChoice) text += `\n   _Ensalada: ${item.saladChoice.trim()}_`;
        if (item.isPastaComun && item.sauceOption) text += `\n   _Salsa: ${item.sauceOption}_`;
        text += ` - $${(item.price * item.qty).toLocaleString('es-AR')}\n`;
    });

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const deliveryCost = (deliveryType === 'delivery') ? configOtros.deliveryCost : 0;
    const total = subtotal + deliveryCost;

    text += `---------------------------------\n`;
    text += `*Subtotal:* $${subtotal.toLocaleString('es-AR')}\n`;
    if (deliveryCost > 0) text += `*Envío:* $${deliveryCost.toLocaleString('es-AR')}\n`;
    text += `*TOTAL:* $${total.toLocaleString('es-AR')}\n`;

    window.open(`https://wa.me/543464527827?text=${encodeURIComponent(text)}`, '_blank');
}