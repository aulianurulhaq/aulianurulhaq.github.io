/**
 * Navigation & State Manager
 * Mengelola navigasi tab 14 minggu, submenu per minggu, tema, dan rendering tampilan.
 */

const AppState = {
  activeWeekId: "week1",
  activeSubmenuId: "w1-konsep",
  isSidebarOpen: true,
  theme: localStorage.getItem("sisdig_theme") || "dark"
};

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  applyTheme(AppState.theme);
  renderSidebar();
  setupEventListeners();
  loadRoute(AppState.activeWeekId, AppState.activeSubmenuId);
}

// ==========================================
// RENDER SIDEBAR MINGGU 1 - 14
// ==========================================
function renderSidebar() {
  const sidebarNav = document.getElementById("sidebar-weeks-nav");
  if (!sidebarNav) return;

  let html = "";
  CURRICULUM_DATA.forEach((week) => {
    const isActiveWeek = week.id === AppState.activeWeekId;
    const isReady = week.status === "active";

    html += `
      <div class="week-item ${isActiveWeek ? 'expanded active' : ''}" id="nav-item-${week.id}">
        <div class="week-header" onclick="toggleWeek('${week.id}')">
          <div class="week-meta">
            <span class="week-number">M${week.number}</span>
            <div class="week-title-wrap">
              <span class="week-title">${week.title}</span>
              <span class="week-badge-mini ${isReady ? 'badge-active' : 'badge-soon'}">
                ${isReady ? 'Interaktif' : 'Minggu ' + week.number}
              </span>
            </div>
          </div>
          <i class="fas fa-chevron-right chevron-icon"></i>
        </div>

        <div class="week-submenus ${isActiveWeek ? 'show' : ''}" id="submenus-${week.id}">
          ${week.submenus.map(sub => {
            const isSubActive = isActiveWeek && sub.id === AppState.activeSubmenuId;
            return `
              <button 
                type="button" 
                class="submenu-btn ${isSubActive ? 'active' : ''}" 
                onclick="navigateTo('${week.id}', '${sub.id}')"
                data-subid="${sub.id}"
              >
                <i class="fas fa-${sub.icon || 'circle'}"></i>
                <span>${sub.title}</span>
              </button>
            `;
          }).join("")}
        </div>
      </div>
    `;
  });

  sidebarNav.innerHTML = html;
}

// ==========================================
// NAVIGASI & ROUTING KONTEN
// ==========================================
function toggleWeek(weekId) {
  const weekData = getWeekData(weekId);
  if (!weekData) return;

  const defaultSub = weekData.submenus[0]?.id || "";
  navigateTo(weekId, defaultSub);
}

function navigateTo(weekId, submenuId) {
  AppState.activeWeekId = weekId;
  AppState.activeSubmenuId = submenuId;

  // Update UI sidebar
  document.querySelectorAll(".week-item").forEach(item => {
    const isCurrent = item.id === `nav-item-${weekId}`;
    item.classList.toggle("expanded", isCurrent);
    item.classList.toggle("active", isCurrent);
    const subContainer = item.querySelector(".week-submenus");
    if (subContainer) {
      subContainer.classList.toggle("show", isCurrent);
    }
  });

  document.querySelectorAll(".submenu-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.subid === submenuId);
  });

  loadRoute(weekId, submenuId);

  // Jika mobile, otomatis tutup sidebar setelah pilih menu
  if (window.innerWidth < 1024) {
    closeSidebar();
  }
}

function loadRoute(weekId, submenuId) {
  const weekData = getWeekData(weekId);
  const mainContent = document.getElementById("main-render-area");
  const breadcrumbWeek = document.getElementById("breadcrumb-week");
  const breadcrumbTopic = document.getElementById("breadcrumb-topic");

  if (!weekData || !mainContent) return;

  // Update breadcrumbs
  if (breadcrumbWeek) breadcrumbWeek.textContent = `Minggu ${weekData.number}: ${weekData.title}`;
  const curSub = weekData.submenus.find(s => s.id === submenuId);
  if (breadcrumbTopic) breadcrumbTopic.textContent = curSub ? curSub.title : "Materi Pembelajaran";

  // Check status
  if (weekData.status === "active" && weekId === "week1") {
    // Render Week 1 interactive module
    Week1Controller.init(mainContent, submenuId);
  } else {
    // Render upcoming weeks placeholder and syllabus preview
    mainContent.innerHTML = getUpcomingWeekTemplate(weekData, curSub);
  }
}

function getUpcomingWeekTemplate(week, sub) {
  return `
    <div class="topic-content animate-fade-in">
      <div class="topic-header">
        <div class="topic-meta">
          <span class="badge badge-warning"><i class="fas fa-clock"></i> Silabus Minggu ke-${week.number}</span>
          <span class="badge badge-outline">${week.category}</span>
        </div>
        <h2 class="topic-title">${week.title}</h2>
        <p class="topic-subtitle">${week.description}</p>
      </div>

      <!-- Overview Card -->
      <div class="card mt-4">
        <div class="card-header-flex">
          <div>
            <h3 class="card-title"><i class="fas fa-graduation-cap"></i> Capaian Pembelajaran (Learning Outcomes)</h3>
            <p class="card-desc">Target kompetensi yang akan dicapai pada materi minggu ini:</p>
          </div>
          <span class="badge badge-info">Silabus Terstruktur</span>
        </div>

        <ul class="styled-list mt-3">
          ${week.objectives.map(obj => `<li>${obj}</li>`).join("")}
        </ul>
      </div>

      <!-- Submenu Topics List -->
      <div class="card mt-4">
        <h3 class="card-title"><i class="fas fa-list-ol"></i> Daftar Rencana Submateri Minggu ${week.number}:</h3>
        <div class="grid-2-cols mt-3">
          ${week.submenus.map((s, idx) => `
            <div class="upcoming-sub-card ${s.id === sub?.id ? 'sub-card-highlight' : ''}">
              <div class="sub-num">0${idx + 1}</div>
              <div class="sub-info">
                <h4>${s.title}</h4>
                <span class="badge badge-dim"><i class="fas fa-hourglass-start"></i> Segera Diluncurkan</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Callout Ready for Expansion -->
      <div class="callout callout-info mt-4">
        <div class="callout-icon"><i class="fas fa-puzzle-piece"></i></div>
        <div class="callout-body">
          <h4>Arsitektur Siap Berkembang:</h4>
          <p>
            Modul minggu ini telah disiapkan dalam skema data kurikulum. Begitu Anda siap menambahkan materi interaktif 
            untuk Minggu ${week.number}, pengembang cukup mengaktifkan file script terkait tanpa perlu merombak struktur tata letak web!
          </p>
          <div class="mt-2">
            <button class="btn btn-outline btn-sm" onclick="navigateTo('week1', 'w1-konsep')">
              <i class="fas fa-arrow-left"></i> Kembali ke Modul Aktif (Minggu 1)
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// SETUP EVENT LISTENERS & SEARCH
// ==========================================
function setupEventListeners() {
  // Mobile sidebar toggle
  const toggleBtn = document.getElementById("btn-toggle-sidebar");
  const sidebar = document.getElementById("app-sidebar");
  const overlay = document.getElementById("sidebar-overlay");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      if (overlay) overlay.classList.toggle("active");
    });
  }

  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }

  // Theme toggle
  const themeBtn = document.getElementById("btn-toggle-theme");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      AppState.theme = AppState.theme === "dark" ? "light" : "dark";
      applyTheme(AppState.theme);
    });
  }

  // Quick Topic Search
  const searchInput = document.getElementById("global-search-input");
  const searchResults = document.getElementById("search-results-dropdown");

  if (searchInput && searchResults) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) {
        searchResults.classList.add("hidden");
        return;
      }

      const matches = [];
      CURRICULUM_DATA.forEach(w => {
        if (w.title.toLowerCase().includes(q) || w.description.toLowerCase().includes(q)) {
          matches.push({ week: w, sub: w.submenus[0], matchType: `Minggu ${w.number}` });
        }
        w.submenus.forEach(s => {
          if (s.title.toLowerCase().includes(q)) {
            matches.push({ week: w, sub: s, matchType: `Submenu Minggu ${w.number}` });
          }
        });
      });

      if (matches.length > 0) {
        searchResults.classList.remove("hidden");
        searchResults.innerHTML = matches.slice(0, 6).map(m => `
          <div class="search-result-item" onclick="selectSearchResult('${m.week.id}', '${m.sub.id}')">
            <span class="search-tag">${m.matchType}</span>
            <div class="search-item-title">${m.sub.title}</div>
            <small class="text-muted">${m.week.title}</small>
          </div>
        `).join("");
      } else {
        searchResults.classList.remove("hidden");
        searchResults.innerHTML = `<div class="p-3 text-muted text-center"><small>Tidak ditemukan topik yang sesuai.</small></div>`;
      }
    });

    document.addEventListener("click", (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.add("hidden");
      }
    });
  }
}

function selectSearchResult(weekId, subId) {
  const searchResults = document.getElementById("search-results-dropdown");
  const searchInput = document.getElementById("global-search-input");
  if (searchResults) searchResults.classList.add("hidden");
  if (searchInput) searchInput.value = "";
  navigateTo(weekId, subId);
}

function closeSidebar() {
  const sidebar = document.getElementById("app-sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  if (sidebar) sidebar.classList.remove("open");
  if (overlay) overlay.classList.remove("active");
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("sisdig_theme", theme);
  const themeIcon = document.querySelector("#btn-toggle-theme i");
  if (themeIcon) {
    themeIcon.className = theme === "dark" ? "fas fa-moon" : "fas fa-sun";
  }
}
