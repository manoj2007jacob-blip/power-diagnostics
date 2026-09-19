/**
 * Power Diagnostics UAE — Admin Control Suite JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initAuthSession();
  initSidebarAndLayout();
  initViewRouter();
  initMasterData();
  initModalsAndForms();
  initCharts();
});

// =========================================================================
// 1. Authentication & Session Management
// =========================================================================
const DEFAULT_USER = {
  name: 'Eng. Tariq Al-Mansoor',
  email: 'admin@powerdiagnostics.ae',
  role: 'Super Administrator',
  avatar: 'TA',
  phone: '+971 50 188 6773',
  department: 'Technical Operations & Fleet'
};

function initAuthSession() {
  const isLoginPage = window.location.pathname.includes('admin-login.html');
  const loggedInUser = localStorage.getItem('power_diag_admin_user');

  if (isLoginPage) {
    const loginForm = document.getElementById('adminLoginForm');
    const demoLoginBtn = document.getElementById('btnDemoLogin');
    const errorAlert = document.getElementById('loginErrorAlert');

    if (demoLoginBtn) {
      demoLoginBtn.addEventListener('click', () => {
        document.getElementById('adminEmail').value = 'admin@powerdiagnostics.ae';
        document.getElementById('adminPassword').value = 'admin123';
        submitLogin();
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitLogin();
      });
    }

    function submitLogin() {
      const email = document.getElementById('adminEmail').value.trim();
      const password = document.getElementById('adminPassword').value;
      const submitBtn = document.getElementById('btnLoginSubmit');

      if (!email || !password) {
        showError('Please enter both administrative email and password.');
        return;
      }

      if (email === 'admin@powerdiagnostics.ae' && password === 'admin123') {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Authenticating...';
        
        setTimeout(() => {
          localStorage.setItem('power_diag_admin_user', JSON.stringify(DEFAULT_USER));
          window.location.href = 'admin-dashboard.html#dashboard';
        }, 600);
      } else {
        showError('Invalid credentials. Use demo: admin@powerdiagnostics.ae / admin123');
      }
    }

    function showError(msg) {
      if (errorAlert) {
        errorAlert.textContent = msg;
        errorAlert.classList.remove('d-none');
      }
    }
  } else {
    let user = DEFAULT_USER;
    if (loggedInUser) {
      try {
        user = JSON.parse(loggedInUser);
      } catch (e) {
        user = DEFAULT_USER;
      }
    } else {
      localStorage.setItem('power_diag_admin_user', JSON.stringify(DEFAULT_USER));
    }
    renderUserProfile(user);

    const logoutBtns = document.querySelectorAll('.btn-admin-logout');
    logoutBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('power_diag_admin_user');
        window.location.href = 'admin-login.html';
      });
    });
  }
}

function renderUserProfile(user) {
  const nameEl = document.getElementById('navbarUserName');
  const roleEl = document.getElementById('navbarUserRole');
  const avatarEl = document.getElementById('navbarUserAvatar');

  if (nameEl) nameEl.textContent = user.name || DEFAULT_USER.name;
  if (roleEl) roleEl.textContent = user.role || DEFAULT_USER.role;
  if (avatarEl) avatarEl.textContent = user.avatar || 'TA';

  const menuName = document.getElementById('menuUserFullName');
  const menuEmail = document.getElementById('menuUserEmail');
  if (menuName) menuName.textContent = user.name;
  if (menuEmail) menuEmail.textContent = user.email;

  const profName = document.getElementById('profileEditName');
  const profEmail = document.getElementById('profileEditEmail');
  const profPhone = document.getElementById('profileEditPhone');
  const profRole = document.getElementById('profileEditRole');

  if (profName) profName.value = user.name;
  if (profEmail) profEmail.value = user.email;
  if (profPhone) profPhone.value = user.phone || DEFAULT_USER.phone;
  if (profRole) profRole.value = user.role;
}

// =========================================================================
// 2. Sidebar Toggle & Responsive Layout
// =========================================================================
function initSidebarAndLayout() {
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const mobileBackdrop = document.getElementById('sidebarBackdrop');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        document.body.classList.toggle('sidebar-mobile-open');
      } else {
        document.body.classList.toggle('sidebar-collapsed');
      }
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', () => {
      document.body.classList.remove('sidebar-mobile-open');
    });
  }

  const menuLinks = document.querySelectorAll('.admin-menu-link:not([data-bs-toggle]), .admin-submenu-link');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        document.body.classList.remove('sidebar-mobile-open');
      }
    });
  });
}

// =========================================================================
// 3. View Router (Dynamic Tab / View Switching)
// =========================================================================
function initViewRouter() {
  function activateRoute(routeId) {
    const validRoutes = [
      'dashboard', 
      'brands', 
      'products', 
      'category', 
      'subcategory', 
      'enquiries', 
      'blogs', 
      'report-enquiries', 
      'report-rentals', 
      'report-sales'
    ];
    const targetRoute = validRoutes.includes(routeId) ? routeId : 'dashboard';

    // Hide all views
    document.querySelectorAll('.admin-view-panel').forEach(panel => {
      panel.classList.add('d-none');
    });

    // Show target view
    const activePanel = document.getElementById('view-' + targetRoute);
    if (activePanel) {
      activePanel.classList.remove('d-none');
    }

    // Reset active links
    document.querySelectorAll('.admin-menu-link, .admin-submenu-link').forEach(link => {
      link.classList.remove('active');
    });

    // Activate matching link
    const matchingLink = document.querySelector('[data-route="' + targetRoute + '"]');
    if (matchingLink) {
      matchingLink.classList.add('active');

      // Expand Master accordion if applicable
      const masterCollapse = document.getElementById('masterSubmenu');
      if (['brands', 'products', 'category', 'subcategory'].includes(targetRoute) && masterCollapse) {
        if (!masterCollapse.classList.contains('show')) {
          bootstrap.Collapse.getOrCreateInstance(masterCollapse).show();
        }
        const masterParentLink = document.querySelector('[data-bs-target="#masterSubmenu"]');
        if (masterParentLink) masterParentLink.classList.add('active');
      }

      // Expand Reports accordion if applicable
      const reportsCollapse = document.getElementById('reportsSubmenu');
      if (['report-enquiries', 'report-rentals', 'report-sales'].includes(targetRoute) && reportsCollapse) {
        if (!reportsCollapse.classList.contains('show')) {
          bootstrap.Collapse.getOrCreateInstance(reportsCollapse).show();
        }
        const reportsParentLink = document.querySelector('[data-bs-target="#reportsSubmenu"]');
        if (reportsParentLink) reportsParentLink.classList.add('active');
      }
    }

    // Scroll to top of content smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('[data-route]').forEach(link => {
    link.addEventListener('click', (e) => {
      const route = link.getAttribute('data-route');
      if (route) {
        window.location.hash = route;
        activateRoute(route);
      }
    });
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) activateRoute(hash);
  });

  const initialHash = window.location.hash.replace('#', '') || 'dashboard';
  activateRoute(initialHash);
}

// =========================================================================
// 4. Master Datasets & Tables Rendering
// =========================================================================
const masterData = {
  brands: [
    { id: 1, name: 'Fluke Corporation', country: 'USA', products: 18, status: 'Active', featured: true },
    { id: 2, name: 'Hioki E.E. Corp', country: 'Japan', products: 14, status: 'Active', featured: true },
    { id: 3, name: 'Megger Group', country: 'UK', products: 12, status: 'Active', featured: true },
    { id: 4, name: 'Omicron Electronics', country: 'Austria', products: 8, status: 'Active', featured: true },
    { id: 5, name: 'Vanguard Instruments', country: 'USA', products: 9, status: 'Active', featured: false },
    { id: 6, name: 'Rigol Technologies', country: 'China', products: 11, status: 'Active', featured: false },
    { id: 7, name: 'Chauvin Arnoux', country: 'France', products: 7, status: 'Active', featured: false },
    { id: 8, name: 'Baur GmbH', country: 'Austria', products: 6, status: 'Active', featured: false },
    { id: 9, name: 'Doble Engineering', country: 'USA', products: 5, status: 'Active', featured: false }
  ],

  categories: [
    { id: 1, name: 'Partial Discharge Diagnostic', code: 'CAT-PD', count: 12, subcategories: 4, status: 'Active' },
    { id: 2, name: 'High Voltage Testing Equipment', code: 'CAT-HV', count: 18, subcategories: 5, status: 'Active' },
    { id: 3, name: 'Transformer & Substation Testing', code: 'CAT-TR', count: 15, subcategories: 4, status: 'Active' },
    { id: 4, name: 'Power Quality & Energy Analyzers', code: 'CAT-PQ', count: 10, subcategories: 3, status: 'Active' },
    { id: 5, name: 'Cable Fault Location & Diagnostics', code: 'CAT-CBL', count: 9, subcategories: 3, status: 'Active' },
    { id: 6, name: 'Thermal Imaging & Optical Gas Detection', code: 'CAT-TH', count: 6, subcategories: 2, status: 'Active' }
  ],

  subcategories: [
    { id: 1, name: 'Portable PD Detectors', parentCategory: 'Partial Discharge Diagnostic', count: 5, status: 'Active' },
    { id: 2, name: 'Acoustic & Ultrasonic Imagers', parentCategory: 'Partial Discharge Diagnostic', count: 4, status: 'Active' },
    { id: 3, name: 'Continuous Online PD Monitors', parentCategory: 'Partial Discharge Diagnostic', count: 3, status: 'Active' },
    { id: 4, name: 'VLF High Voltage Test Sets', parentCategory: 'High Voltage Testing Equipment', count: 6, status: 'Active' },
    { id: 5, name: 'Primary Current Injection Sets', parentCategory: 'High Voltage Testing Equipment', count: 7, status: 'Active' },
    { id: 6, name: 'Transformer Turns Ratio (TTR)', parentCategory: 'Transformer & Substation Testing', count: 5, status: 'Active' },
    { id: 7, name: 'Winding Resistance Ohmmeter', parentCategory: 'Transformer & Substation Testing', count: 4, status: 'Active' },
    { id: 8, name: 'Three-Phase Power Loggers', parentCategory: 'Power Quality & Energy Analyzers', count: 6, status: 'Active' }
  ],

  products: [
    { id: 1, code: 'HIO-3280', name: 'Hioki 3280-10F AC Clamp Meter', brand: 'Hioki E.E. Corp', category: 'High Voltage Testing Equipment', subcategory: 'Clamp Meters', type: 'Sale & Rental', stock: 15, status: 'In Stock' },
    { id: 2, code: 'FLU-1736', name: 'Fluke 1736 Three-Phase Power Logger', brand: 'Fluke Corporation', category: 'Power Quality & Energy Analyzers', subcategory: 'Three-Phase Power Loggers', type: 'Sale & Rental', stock: 8, status: 'In Stock' },
    { id: 3, code: 'FLU-1550C', name: 'Fluke 1550C 5kV Insulation Tester', brand: 'Fluke Corporation', category: 'High Voltage Testing Equipment', subcategory: 'Insulation Testers', type: 'Sale & Rental', stock: 6, status: 'In Stock' },
    { id: 4, code: 'OMI-CPC100', name: 'Omicron CPC 100 Multi-functional Test Set', brand: 'Omicron Electronics', category: 'Transformer & Substation Testing', subcategory: 'Primary Current Injection Sets', type: 'Rental Only', stock: 4, status: 'In Stock' },
    { id: 5, code: 'MEG-SVERK780', name: 'Megger SVERKER 780 Relay Test Set', brand: 'Megger Group', category: 'High Voltage Testing Equipment', subcategory: 'Relay Test Sets', type: 'Sale & Rental', stock: 5, status: 'In Stock' },
    { id: 6, code: 'OPT-SF6-CAM', name: 'SF6 Gas Leakage Optical Imaging Camera', brand: 'Fluke Corporation', category: 'Thermal Imaging & Optical Gas Detection', subcategory: 'Optical Gas Detection', type: 'Sale & Rental', stock: 2, status: 'Low Stock' },
    { id: 7, code: 'VAN-TRM203', name: 'Vanguard TRM-203 Winding Resistance Meter', brand: 'Vanguard Instruments', category: 'Transformer & Substation Testing', subcategory: 'Winding Resistance Ohmmeter', type: 'Sale & Rental', stock: 7, status: 'In Stock' },
    { id: 8, code: 'FLU-810', name: 'Fluke 810 Vibration Diagnostic Tester', brand: 'Fluke Corporation', category: 'General Test & Measurement', subcategory: 'Vibration Analyzers', type: 'Sale Only', stock: 4, status: 'In Stock' }
  ],

  enquiries: [
    { id: 'RFQ-8921', client: 'Rashid Al Nuaimi', company: 'DEWA Substation Projects', email: 'rashid.nuaimi@dewa.gov.ae', phone: '+971 50 245 8891', service: 'Equipment Rental', equipment: 'Omicron CPC 100 Test Set', date: '2026-09-19', status: 'New', notes: 'Requires 2-week rental starting next Monday for 132kV commissioning.' },
    { id: 'RFQ-8920', client: 'Mohammad Al Fahim', company: 'Petrofac Emirates', email: 'm.fahim@petrofac.ae', phone: '+971 52 871 0022', service: 'Partial Discharge Testing', equipment: 'PD Diagnostic Survey Onsite', date: '2026-09-18', status: 'In Progress', notes: 'Scheduled site survey for 33kV switchgear at Habshan.' },
    { id: 'RFQ-8919', client: 'Vikram Sundaram', company: 'Schneider Electric FZE', email: 'vikram.s@se.com', phone: '+971 55 930 1144', service: 'Purchase / Supply', equipment: 'Fluke 1736 Power Logger (3 units)', date: '2026-09-18', status: 'Quoted', notes: 'Official quotation sent via email for AED 38,400.' },
    { id: 'RFQ-8918', client: 'David Henderson', company: 'Drydocks World Dubai', email: 'd.henderson@drydocks.gov.ae', phone: '+971 50 662 9011', service: 'Calibration & Repair', equipment: 'Megger SVERKER 780 Calibration', date: '2026-09-17', status: 'Closed', notes: 'Calibration completed, NIST certificate issued.' },
    { id: 'RFQ-8917', client: 'Sultan Al Qasimi', company: 'SEWA Power Distribution', email: 's.qasimi@sewa.gov.ae', phone: '+971 50 711 3490', service: 'Equipment Rental', equipment: 'Fluke 1550C 5kV Insulation Tester', date: '2026-09-16', status: 'Quoted', notes: 'Quoted 5 days rental package with calibrated leads.' }
  ],

  blogs: [
    {
      id: 1,
      title: 'Partial Discharge Testing in High-Voltage Gas-Insulated Switchgear (GIS)',
      category: 'Partial Discharge Diagnostic',
      author: 'Eng. Tariq Al-Mansoor',
      date: '2026-09-15',
      views: 1420,
      readTime: '6 min read',
      status: 'Published',
      excerpt: 'Comprehensive methodologies for detecting UHF and acoustic partial discharge anomalies in 132kV/400kV GIS installations.',
      content: 'Gas-Insulated Switchgear (GIS) substations demand rigorous non-intrusive partial discharge diagnostics. Using ultra-high-frequency (UHF) sensors and acoustic emission sensors, engineers can pinpoint particle contamination, floating electrodes, and void discharge before catastrophic insulation failure occurs.'
    },
    {
      id: 2,
      title: 'Transformer SFRA Testing: Detecting Mechanical Deformation Before Failure',
      category: 'Transformer & Substation Testing',
      author: 'Dr. M. Jacob',
      date: '2026-09-10',
      views: 980,
      readTime: '8 min read',
      status: 'Published',
      excerpt: 'How Sweep Frequency Response Analysis provides a mechanical fingerprint of power transformer core and winding integrity.',
      content: 'SFRA is an essential diagnostic tool for assessing transformer winding movement caused by short circuits, heavy seismic events, or transit shocks. Comparing baseline frequency responses reveals axial displacement, radial buckling, and core grounding issues.'
    },
    {
      id: 3,
      title: 'Optimizing Power Quality & Harmonics in Critical Data Centers',
      category: 'Power Quality & Energy Analyzers',
      author: 'Technical Operations Team',
      date: '2026-08-28',
      views: 750,
      readTime: '5 min read',
      status: 'Published',
      excerpt: 'Mitigating non-linear load harmonics, voltage sags, and neutral-earth voltage in mission-critical facilities across UAE.',
      content: 'Data center uptime requires continuous Class A power quality logging. Non-linear server power supplies generate 3rd and 9th triplen harmonics that overheat neutral conductors and trigger nuisance breaker tripping.'
    },
    {
      id: 4,
      title: 'Acoustic Ultrasound Imaging for Substation Corona Detection',
      category: 'Partial Discharge Diagnostic',
      author: 'Eng. Tariq Al-Mansoor',
      date: '2026-09-18',
      views: 0,
      readTime: '4 min read',
      status: 'Draft',
      excerpt: 'Visualizing acoustic sound fields on live high-voltage busbars and insulator strings in outdoor desert environments.',
      content: 'Industrial acoustic imagers overlay sound heatmaps over optical video frames in real-time, allowing substation engineers to identify surface tracking and corona discharge from safe distances.'
    }
  ]
};

function initMasterData() {
  renderBrandsTable();
  renderCategoriesTable();
  renderSubcategoriesTable();
  renderProductsTable();
  renderEnquiriesTable();
  renderDashboardRecentTable();
  renderBlogsTable();
  renderReportEnquiriesTable();
}

function renderBrandsTable() {
  const tbody = document.getElementById('tableBrandsBody');
  if (!tbody) return;

  tbody.innerHTML = masterData.brands.map(b => `
    <tr>
      <td class="fw-bold text-dark">#${b.id}</td>
      <td>
        <div class="d-flex align-items-center gap-2">
          <div class="bg-light border rounded px-2 py-1 fw-bold text-primary small">${b.name.split(' ')[0]}</div>
          <span class="fw-semibold">${b.name}</span>
        </div>
      </td>
      <td>${b.country}</td>
      <td><span class="badge bg-secondary-subtle text-dark border">${b.products} Products</span></td>
      <td>
        ${b.featured ? '<span class="badge bg-primary-subtle text-primary border border-primary-subtle"><i class="bi bi-star-fill me-1"></i> Featured</span>' : '<span class="text-muted small">Standard</span>'}
      </td>
      <td>
        <span class="badge-status badge-status-active"><i class="bi bi-check-circle-fill"></i> ${b.status}</span>
      </td>
      <td class="text-end">
        <button class="btn-action-icon me-1" title="Edit Brand"><i class="bi bi-pencil-fill"></i></button>
        <button class="btn-action-icon text-danger" title="Delete Brand"><i class="bi bi-trash3-fill"></i></button>
      </td>
    </tr>
  `).join('');
}

function renderCategoriesTable() {
  const tbody = document.getElementById('tableCategoriesBody');
  if (!tbody) return;

  tbody.innerHTML = masterData.categories.map(c => `
    <tr>
      <td class="fw-bold text-dark">#${c.id}</td>
      <td>
        <span class="badge bg-light text-primary border font-monospace me-2">${c.code}</span>
        <span class="fw-bold">${c.name}</span>
      </td>
      <td><span class="badge bg-primary-subtle text-primary border border-primary-subtle">${c.subcategories} Subcategories</span></td>
      <td><span class="badge bg-secondary-subtle text-dark border">${c.count} Products</span></td>
      <td><span class="badge-status badge-status-active"><i class="bi bi-check-circle-fill"></i> ${c.status}</span></td>
      <td class="text-end">
        <button class="btn-action-icon me-1" title="Edit Category"><i class="bi bi-pencil-fill"></i></button>
        <button class="btn-action-icon text-danger" title="Delete Category"><i class="bi bi-trash3-fill"></i></button>
      </td>
    </tr>
  `).join('');
}

function renderSubcategoriesTable() {
  const tbody = document.getElementById('tableSubcategoriesBody');
  if (!tbody) return;

  tbody.innerHTML = masterData.subcategories.map(s => `
    <tr>
      <td class="fw-bold text-dark">#${s.id}</td>
      <td class="fw-bold text-dark">${s.name}</td>
      <td><span class="badge bg-light text-dark border">${s.parentCategory}</span></td>
      <td><span class="badge bg-primary-subtle text-primary border border-primary-subtle">${s.count} Products</span></td>
      <td><span class="badge-status badge-status-active"><i class="bi bi-check-circle-fill"></i> ${s.status}</span></td>
      <td class="text-end">
        <button class="btn-action-icon me-1" title="Edit Subcategory"><i class="bi bi-pencil-fill"></i></button>
        <button class="btn-action-icon text-danger" title="Delete Subcategory"><i class="bi bi-trash3-fill"></i></button>
      </td>
    </tr>
  `).join('');
}

function renderProductsTable() {
  const tbody = document.getElementById('tableProductsBody');
  if (!tbody) return;

  tbody.innerHTML = masterData.products.map(p => `
    <tr>
      <td class="font-monospace fw-bold text-primary">${p.code}</td>
      <td>
        <div class="fw-bold text-dark">${p.name}</div>
        <small class="text-muted">${p.brand}</small>
      </td>
      <td><span class="badge bg-light text-dark border small">${p.category}</span></td>
      <td><span class="badge bg-secondary-subtle text-dark small">${p.type}</span></td>
      <td class="fw-bold">${p.stock} units</td>
      <td>
        ${p.status === 'In Stock' 
          ? '<span class="badge-status badge-status-active"><i class="bi bi-check-circle-fill"></i> In Stock</span>' 
          : '<span class="badge-status badge-status-progress"><i class="bi bi-exclamation-triangle-fill"></i> Low Stock</span>'}
      </td>
      <td class="text-end">
        <button class="btn-action-icon me-1" title="Edit Product"><i class="bi bi-pencil-fill"></i></button>
        <button class="btn-action-icon text-danger" title="Delete Product"><i class="bi bi-trash3-fill"></i></button>
      </td>
    </tr>
  `).join('');
}

function renderEnquiriesTable() {
  const tbody = document.getElementById('tableEnquiriesBody');
  if (!tbody) return;

  tbody.innerHTML = masterData.enquiries.map(e => `
    <tr>
      <td class="font-monospace fw-bold text-dark">${e.id}</td>
      <td>
        <div class="d-flex align-items-center gap-2">
          <div class="bg-primary-subtle text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; font-size: 0.75rem;">
            ${e.client.split(' ').map(n=>n[0]).join('').substring(0,2)}
          </div>
          <div>
            <div class="fw-bold text-dark">${e.client}</div>
            <small class="text-muted">${e.company}</small>
          </div>
        </div>
      </td>
      <td>
        <div><i class="bi bi-telephone text-primary me-1"></i> <a href="tel:${e.phone}" class="text-decoration-none">${e.phone}</a></div>
        <small class="text-muted"><i class="bi bi-envelope me-1"></i> ${e.email}</small>
      </td>
      <td>
        <span class="badge bg-light text-primary border mb-1 d-inline-block">${e.service}</span>
        <div class="small fw-semibold text-dark">${e.equipment}</div>
      </td>
      <td class="text-nowrap small text-muted">${e.date}</td>
      <td>
        ${getEnquiryBadge(e.status)}
      </td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary px-2 py-1" onclick="openEnquiryModal('${e.id}')">
          <i class="bi bi-eye-fill me-1"></i> View
        </button>
      </td>
    </tr>
  `).join('');
}

function renderDashboardRecentTable() {
  const tbody = document.getElementById('tableDashboardRecentBody');
  if (!tbody) return;

  tbody.innerHTML = masterData.enquiries.slice(0, 4).map(e => `
    <tr>
      <td class="font-monospace fw-bold text-dark">${e.id}</td>
      <td>
        <div class="d-flex align-items-center gap-2">
          <div class="bg-primary-subtle text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center" style="width: 28px; height: 28px; font-size: 0.7rem;">
            ${e.client.split(' ').map(n=>n[0]).join('').substring(0,2)}
          </div>
          <div>
            <div class="fw-bold text-dark">${e.client}</div>
            <small class="text-muted" style="font-size: 0.75rem;">${e.company}</small>
          </div>
        </div>
      </td>
      <td><span class="badge bg-light text-primary border">${e.service}</span></td>
      <td class="fw-semibold text-dark">${e.equipment}</td>
      <td>${getEnquiryBadge(e.status)}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-light border px-2 py-1" onclick="openEnquiryModal('${e.id}')">
          <i class="bi bi-arrow-right"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// 5. Blogs Table Rendering
function renderBlogsTable() {
  const tbody = document.getElementById('tableBlogsBody');
  if (!tbody) return;

  tbody.innerHTML = masterData.blogs.map(b => `
    <tr>
      <td class="fw-bold text-dark text-nowrap" style="width: 50px;">#${b.id}</td>
      <td style="min-width: 260px;">
        <div class="fw-bold text-dark mb-1">${b.title}</div>
        <div class="small text-muted">${b.excerpt}</div>
      </td>
      <td class="text-nowrap"><span class="badge bg-light text-primary border small">${b.category}</span></td>
      <td class="text-nowrap">
        <div class="small fw-semibold text-dark">${b.author}</div>
        <small class="text-muted">${b.readTime}</small>
      </td>
      <td class="small text-muted text-nowrap">${b.date}</td>
      <td class="text-nowrap">
        <span class="badge bg-light text-dark border"><i class="bi bi-eye me-1"></i> ${b.views.toLocaleString()}</span>
      </td>
      <td class="text-nowrap">
        ${b.status === 'Published' 
          ? '<span class="badge-status badge-status-active"><i class="bi bi-check-circle-fill"></i> Published</span>' 
          : '<span class="badge-status badge-status-progress"><i class="bi bi-pencil-fill"></i> Draft</span>'}
      </td>
      <td class="text-end text-nowrap" style="width: 120px;">
        <button class="btn-action-icon me-1" onclick="viewBlogModal(${b.id})" title="View Post"><i class="bi bi-eye-fill"></i></button>
        <button class="btn-action-icon me-1" title="Edit Post"><i class="bi bi-pencil-fill"></i></button>
        <button class="btn-action-icon text-danger" title="Delete Post"><i class="bi bi-trash3-fill"></i></button>
      </td>
    </tr>
  `).join('');
}

// 6. Reports -> Detailed Enquiries Table
function renderReportEnquiriesTable() {
  const tbody = document.getElementById('tableReportEnquiriesBody');
  if (!tbody) return;

  tbody.innerHTML = masterData.enquiries.map(e => `
    <tr>
      <td class="font-monospace fw-bold text-dark">${e.id}</td>
      <td class="fw-bold text-dark">${e.client}</td>
      <td>${e.company}</td>
      <td><span class="badge bg-light text-primary border">${e.service}</span></td>
      <td class="fw-semibold">${e.equipment}</td>
      <td>${e.date}</td>
      <td>${getEnquiryBadge(e.status)}</td>
      <td class="fw-bold text-success">${e.status === 'Quoted' || e.status === 'Closed' ? 'AED 24,500' : 'Pending RFQ'}</td>
    </tr>
  `).join('');
}

function getEnquiryBadge(status) {
  switch (status) {
    case 'New':
      return '<span class="badge-status badge-status-new"><i class="bi bi-lightning-fill"></i> New Lead</span>';
    case 'In Progress':
      return '<span class="badge-status badge-status-progress"><i class="bi bi-clock-fill"></i> In Progress</span>';
    case 'Quoted':
      return '<span class="badge-status badge-status-quoted"><i class="bi bi-file-earmark-text-fill"></i> Quoted</span>';
    case 'Closed':
      return '<span class="badge-status badge-status-closed"><i class="bi bi-check-circle-fill"></i> Closed</span>';
    default:
      return '<span class="badge-status badge-status-inactive">' + status + '</span>';
  }
}

window.openEnquiryModal = function(id) {
  const enq = masterData.enquiries.find(item => item.id === id);
  if (!enq) return;

  document.getElementById('modalEnqId').textContent = enq.id;
  document.getElementById('modalEnqClient').textContent = enq.client;
  document.getElementById('modalEnqCompany').textContent = enq.company;
  document.getElementById('modalEnqEmail').textContent = enq.email;
  document.getElementById('modalEnqPhone').textContent = enq.phone;
  document.getElementById('modalEnqPhoneLink').href = 'tel:' + enq.phone;
  document.getElementById('modalEnqWaLink').href = 'https://wa.me/' + enq.phone.replace(/[^0-9]/g, '');
  document.getElementById('modalEnqService').textContent = enq.service;
  document.getElementById('modalEnqEquipment').textContent = enq.equipment;
  document.getElementById('modalEnqDate').textContent = enq.date;
  document.getElementById('modalEnqNotes').textContent = enq.notes;
  document.getElementById('modalEnqStatusSelect').value = enq.status;

  const modalEl = document.getElementById('enquiryDetailsModal');
  if (modalEl) {
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }
};

window.viewBlogModal = function(id) {
  const blog = masterData.blogs.find(b => b.id === id);
  if (!blog) return;

  alert('Blog Preview: ' + blog.title + '\n\nCategory: ' + blog.category + '\nAuthor: ' + blog.author + '\n\nExcerpt: ' + blog.excerpt);
};

// =========================================================================
// 5. Modals & Form Submission Handlers
// =========================================================================
function initModalsAndForms() {
  const saveEnqStatusBtn = document.getElementById('btnSaveEnqStatus');
  if (saveEnqStatusBtn) {
    saveEnqStatusBtn.addEventListener('click', () => {
      const enqId = document.getElementById('modalEnqId').textContent;
      const newStatus = document.getElementById('modalEnqStatusSelect').value;
      const target = masterData.enquiries.find(e => e.id === enqId);
      if (target) {
        target.status = newStatus;
        renderEnquiriesTable();
        renderDashboardRecentTable();
        renderReportEnquiriesTable();
      }
      const modalEl = document.getElementById('enquiryDetailsModal');
      if (modalEl) {
        bootstrap.Modal.getInstance(modalEl).hide();
      }
    });
  }

  // Write Blog Form Handler
  const formWriteBlog = document.getElementById('formWriteBlog');
  if (formWriteBlog) {
    formWriteBlog.addEventListener('submit', (e) => {
      e.preventDefault();
      const newBlog = {
        id: masterData.blogs.length + 1,
        title: document.getElementById('blogTitle').value,
        category: document.getElementById('blogCategory').value,
        author: document.getElementById('blogAuthor').value || 'Eng. Tariq Al-Mansoor',
        date: new Date().toISOString().split('T')[0],
        views: 0,
        readTime: document.getElementById('blogReadTime').value || '5 min read',
        status: document.getElementById('blogStatus').value,
        excerpt: document.getElementById('blogExcerpt').value,
        content: document.getElementById('blogContent').value
      };
      masterData.blogs.unshift(newBlog);
      renderBlogsTable();
      formWriteBlog.reset();
      const modalEl = document.getElementById('writeBlogModal');
      if (modalEl) bootstrap.Modal.getInstance(modalEl).hide();
    });
  }

  const profileForm = document.getElementById('profileEditForm');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedUser = {
        name: document.getElementById('profileEditName').value,
        email: document.getElementById('profileEditEmail').value,
        phone: document.getElementById('profileEditPhone').value,
        role: document.getElementById('profileEditRole').value,
        avatar: document.getElementById('profileEditName').value.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()
      };
      localStorage.setItem('power_diag_admin_user', JSON.stringify(updatedUser));
      renderUserProfile(updatedUser);

      const modalEl = document.getElementById('profileDetailsModal');
      if (modalEl) {
        bootstrap.Modal.getInstance(modalEl).hide();
      }
    });
  }

  const addProductForm = document.getElementById('formAddProduct');
  if (addProductForm) {
    addProductForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newProd = {
        id: masterData.products.length + 1,
        code: document.getElementById('prodCode').value,
        name: document.getElementById('prodName').value,
        brand: document.getElementById('prodBrand').value,
        category: document.getElementById('prodCategory').value,
        subcategory: document.getElementById('prodSubcategory').value,
        type: document.getElementById('prodType').value,
        stock: parseInt(document.getElementById('prodStock').value, 10) || 1,
        status: 'In Stock'
      };
      masterData.products.unshift(newProd);
      renderProductsTable();
      addProductForm.reset();
      const modalEl = document.getElementById('addProductModal');
      if (modalEl) bootstrap.Modal.getInstance(modalEl).hide();
    });
  }

  const addBrandForm = document.getElementById('formAddBrand');
  if (addBrandForm) {
    addBrandForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newBrand = {
        id: masterData.brands.length + 1,
        name: document.getElementById('brandName').value,
        country: document.getElementById('brandCountry').value,
        products: 0,
        status: 'Active',
        featured: document.getElementById('brandFeatured').checked
      };
      masterData.brands.push(newBrand);
      renderBrandsTable();
      addBrandForm.reset();
      const modalEl = document.getElementById('addBrandModal');
      if (modalEl) bootstrap.Modal.getInstance(modalEl).hide();
    });
  }

  const addCategoryForm = document.getElementById('formAddCategory');
  if (addCategoryForm) {
    addCategoryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newCat = {
        id: masterData.categories.length + 1,
        name: document.getElementById('catName').value,
        code: document.getElementById('catCode').value,
        count: 0,
        subcategories: 0,
        status: 'Active'
      };
      masterData.categories.push(newCat);
      renderCategoriesTable();
      addCategoryForm.reset();
      const modalEl = document.getElementById('addCategoryModal');
      if (modalEl) bootstrap.Modal.getInstance(modalEl).hide();
    });
  }

  const addSubcategoryForm = document.getElementById('formAddSubcategory');
  if (addSubcategoryForm) {
    addSubcategoryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newSub = {
        id: masterData.subcategories.length + 1,
        name: document.getElementById('subName').value,
        parentCategory: document.getElementById('subParentCategory').value,
        count: 0,
        status: 'Active'
      };
      masterData.subcategories.push(newSub);
      renderSubcategoriesTable();
      addSubcategoryForm.reset();
      const modalEl = document.getElementById('addSubcategoryModal');
      if (modalEl) bootstrap.Modal.getInstance(modalEl).hide();
    });
  }
}

// =========================================================================
// 6. Analytics Charts
// =========================================================================
function initCharts() {
  if (typeof Chart === 'undefined') return;

  // 1. Inquiry Trends Chart (Line & Area)
  const ctxTrends = document.getElementById('chartInquiryTrends');
  if (ctxTrends) {
    new Chart(ctxTrends, {
      type: 'line',
      data: {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [
          {
            label: 'Equipment Rental RFQs',
            data: [32, 45, 58, 51, 67, 84],
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: 4.5,
            pointHoverRadius: 6,
            pointBackgroundColor: '#2563eb',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2
          },
          {
            label: 'PD Testing & Diagnostic Surveys',
            data: [18, 24, 30, 28, 42, 53],
            borderColor: '#10b981',
            backgroundColor: 'transparent',
            borderDash: [5, 4],
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 5.5,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 20,
            bottom: 5,
            left: 5,
            right: 15
          }
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 8,
              padding: 16,
              font: {
                family: 'Inter',
                size: 11.5,
                weight: '600'
              },
              color: '#475569'
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleFont: { family: 'Inter', size: 12, weight: '700' },
            bodyFont: { family: 'Inter', size: 11.5 },
            padding: 10,
            cornerRadius: 8,
            boxPadding: 4
          }
        },
        scales: {
          y: {
            suggestedMin: 0,
            suggestedMax: 100,
            grid: {
              color: '#f1f5f9',
              drawBorder: false
            },
            ticks: {
              font: { family: 'Inter', size: 11 },
              color: '#94a3b8',
              stepSize: 20
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: { family: 'Inter', size: 11.5, weight: '500' },
              color: '#64748b'
            }
          }
        }
      }
    });
  }

  // 2. Category Distribution Doughnut Chart
  const ctxCategory = document.getElementById('chartCategoryDistribution');
  if (ctxCategory) {
    new Chart(ctxCategory, {
      type: 'doughnut',
      data: {
        labels: ['Partial Discharge', 'High Voltage', 'Transformer Testing', 'Power Quality', 'Cable Faults'],
        datasets: [{
          data: [35, 25, 20, 12, 8],
          backgroundColor: ['#2563eb', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
          borderWidth: 2.5,
          borderColor: '#ffffff',
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              font: { family: 'Inter', size: 11, weight: '500' },
              color: '#475569',
              boxWidth: 8,
              padding: 12
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleFont: { family: 'Inter', size: 12, weight: '700' },
            bodyFont: { family: 'Inter', size: 11.5 },
            padding: 10,
            cornerRadius: 8
          }
        },
        cutout: '68%'
      }
    });
  }
}
