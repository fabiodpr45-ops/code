(function () {
  const STORAGE_KEY = 'dpr45PlanningData';
  const AUTH_KEY = 'dpr45PlanningAuth';
  const VALID_LOGIN = 'DPR45';
  const VALID_PASSWORD = 'Isolation45';

  const defaultState = {
    sites: [],
    teams: []
  };

  function uid(prefix) {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return {
        sites: Array.isArray(parsed.sites) ? parsed.sites : [],
        teams: Array.isArray(parsed.teams) ? parsed.teams : []
      };
    } catch {
      return { ...defaultState };
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function isAuthenticated() {
    return localStorage.getItem(AUTH_KEY) === 'ok';
  }

  function requireAuth() {
    const page = document.body.dataset.page;
    const onLoginPage = page === 'login';

    if (onLoginPage && isAuthenticated()) {
      window.location.replace('pages/chantiers.html');
      return;
    }

    if (!onLoginPage && !isAuthenticated()) {
      window.location.replace('../index.html');
    }
  }

  function wireLogout() {
    const logoutButton = document.getElementById('logoutButton');
    if (!logoutButton) return;
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem(AUTH_KEY);
      window.location.replace('../index.html');
    });
  }

  function formatDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('fr-FR');
  }

  function daysBetween(start, end) {
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.round((new Date(end) - new Date(start)) / oneDay) + 1;
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function initLoginPage() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    const errorNode = document.getElementById('loginError');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const login = document.getElementById('loginInput').value.trim();
      const password = document.getElementById('passwordInput').value.trim();

      if (login === VALID_LOGIN && password === VALID_PASSWORD) {
        localStorage.setItem(AUTH_KEY, 'ok');
        window.location.replace('pages/chantiers.html');
        return;
      }

      errorNode.textContent = 'Login ou mot de passe incorrect.';
    });
  }

  function validateSite(site) {
    if (!site.name || !site.location || !site.lead || !site.startDate || !site.endDate || !site.estimatedDays) {
      return 'Merci de remplir tous les champs du chantier.';
    }
    if (new Date(site.startDate) > new Date(site.endDate)) {
      return 'La date de fin doit être supérieure ou égale à la date de démarrage.';
    }
    if (Number(site.estimatedDays) < 1) {
      return 'La durée estimée doit être au moins de 1 jour.';
    }
    return '';
  }

  function initSitesPage() {
    const siteForm = document.getElementById('siteForm');
    if (!siteForm) return;

    const siteList = document.getElementById('siteList');
    const siteFormError = document.getElementById('siteFormError');
    const siteFormTitle = document.getElementById('siteFormTitle');
    const siteSubmitButton = document.getElementById('siteSubmitButton');

    function resetSiteForm() {
      siteForm.reset();
      document.getElementById('siteId').value = '';
      siteFormTitle.textContent = 'Nouveau chantier';
      siteSubmitButton.textContent = 'Ajouter';
      siteFormError.textContent = '';
    }

    function render() {
      const state = loadState();
      if (!state.sites.length) {
        siteList.innerHTML = '<li class="empty">Aucun chantier enregistré.</li>';
        return;
      }

      siteList.innerHTML = state.sites
        .map((site) => {
          const realDuration = daysBetween(site.startDate, site.endDate);
          return `
            <li>
              <div>
                <strong>${escapeHtml(site.name)}</strong>
                <span>${escapeHtml(site.location)} · Chef : ${escapeHtml(site.lead)}</span>
                <span>${site.isSubcontracted ? 'Sous-traité' : 'Interne'} · ${formatDate(site.startDate)} → ${formatDate(site.endDate)}</span>
                <span>Durée estimée : ${site.estimatedDays} j · Durée calendrier : ${realDuration} j</span>
              </div>
              <div class="actions">
                <button class="secondary" data-action="edit" data-id="${site.id}">Éditer</button>
                <button class="danger" data-action="delete" data-id="${site.id}">Supprimer</button>
              </div>
            </li>
          `;
        })
        .join('');
    }

    siteForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const draft = {
        id: document.getElementById('siteId').value || uid('site'),
        name: document.getElementById('siteName').value.trim(),
        location: document.getElementById('siteLocation').value.trim(),
        lead: document.getElementById('siteLead').value.trim(),
        isSubcontracted: document.getElementById('siteIsSub').checked,
        startDate: document.getElementById('siteStart').value,
        endDate: document.getElementById('siteEnd').value,
        estimatedDays: Number(document.getElementById('siteDuration').value)
      };

      const validationError = validateSite(draft);
      if (validationError) {
        siteFormError.textContent = validationError;
        return;
      }

      const state = loadState();
      const index = state.sites.findIndex((site) => site.id === draft.id);
      if (index >= 0) {
        state.sites[index] = draft;
      } else {
        state.sites.push(draft);
      }

      saveState(state);
      resetSiteForm();
      render();
    });

    siteList.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;

      const id = button.dataset.id;
      const action = button.dataset.action;
      const state = loadState();
      const site = state.sites.find((item) => item.id === id);
      if (!site) return;

      if (action === 'delete') {
        state.sites = state.sites.filter((item) => item.id !== id);
        saveState(state);
        render();
        return;
      }

      document.getElementById('siteId').value = site.id;
      document.getElementById('siteName').value = site.name;
      document.getElementById('siteLocation').value = site.location;
      document.getElementById('siteLead').value = site.lead;
      document.getElementById('siteIsSub').checked = !!site.isSubcontracted;
      document.getElementById('siteStart').value = site.startDate;
      document.getElementById('siteEnd').value = site.endDate;
      document.getElementById('siteDuration').value = site.estimatedDays;
      siteFormTitle.textContent = 'Édition chantier';
      siteSubmitButton.textContent = 'Enregistrer';
      siteFormError.textContent = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    resetSiteForm();
    render();
  }

  function initTeamsPage() {
    const teamForm = document.getElementById('teamForm');
    if (!teamForm) return;

    const teamList = document.getElementById('teamList');
    const teamFormTitle = document.getElementById('teamFormTitle');
    const teamSubmitButton = document.getElementById('teamSubmitButton');

    function resetTeamForm() {
      teamForm.reset();
      document.getElementById('teamId').value = '';
      teamFormTitle.textContent = 'Nouvelle équipe';
      teamSubmitButton.textContent = 'Ajouter';
    }

    function render() {
      const state = loadState();
      if (!state.teams.length) {
        teamList.innerHTML = '<li class="empty">Aucune équipe enregistrée.</li>';
        return;
      }

      teamList.innerHTML = state.teams
        .map(
          (team) => `
            <li>
              <div>
                <strong>${escapeHtml(team.name)}</strong>
                <span>Chef : ${escapeHtml(team.leader)}</span>
                <span>${team.type === 'subcontractor' ? 'Sous-traitant' : 'Interne'}${team.company ? ` · ${escapeHtml(team.company)}` : ''}</span>
              </div>
              <div class="actions">
                <button class="secondary" data-action="edit" data-id="${team.id}">Éditer</button>
                <button class="danger" data-action="delete" data-id="${team.id}">Supprimer</button>
              </div>
            </li>
          `
        )
        .join('');
    }

    teamForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const team = {
        id: document.getElementById('teamId').value || uid('team'),
        name: document.getElementById('teamName').value.trim(),
        leader: document.getElementById('teamLeader').value.trim(),
        type: document.getElementById('teamType').value,
        company: document.getElementById('teamCompany').value.trim()
      };
      if (!team.name || !team.leader) return;

      const state = loadState();
      const index = state.teams.findIndex((item) => item.id === team.id);
      if (index >= 0) {
        state.teams[index] = team;
      } else {
        state.teams.push(team);
      }

      saveState(state);
      resetTeamForm();
      render();
    });

    teamList.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;

      const id = button.dataset.id;
      const action = button.dataset.action;
      const state = loadState();
      const team = state.teams.find((item) => item.id === id);
      if (!team) return;

      if (action === 'delete') {
        state.teams = state.teams.filter((item) => item.id !== id);
        saveState(state);
        render();
        return;
      }

      document.getElementById('teamId').value = team.id;
      document.getElementById('teamName').value = team.name;
      document.getElementById('teamLeader').value = team.leader;
      document.getElementById('teamType').value = team.type;
      document.getElementById('teamCompany').value = team.company || '';
      teamFormTitle.textContent = 'Édition équipe';
      teamSubmitButton.textContent = 'Enregistrer';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    resetTeamForm();
    render();
  }

  function renderPlanningList(sites) {
    if (!sites.length) {
      return '<p class="empty">Aucun chantier à planifier.</p>';
    }

    return `
      <div class="planning-list">
        ${sites
          .map(
            (site) => `
              <article class="planning-item">
                <h3>${escapeHtml(site.name)}</h3>
                <p>${escapeHtml(site.location)} · Chef : ${escapeHtml(site.lead)}</p>
                <p>${formatDate(site.startDate)} → ${formatDate(site.endDate)} (${site.estimatedDays} j estimés)</p>
                <p>${site.isSubcontracted ? 'Sous-traitant' : 'Interne'}</p>
              </article>
            `
          )
          .join('')}
      </div>
    `;
  }

  function renderTimeline(sites) {
    if (!sites.length) return '<p class="empty">Aucun chantier à afficher.</p>';

    const sorted = [...sites].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    return `
      <div class="timeline-list">
        ${sorted
          .map(
            (site) => `
              <div class="timeline-row">
                <div class="timeline-date">${formatDate(site.startDate)}</div>
                <div class="timeline-bar">
                  <strong>${escapeHtml(site.name)}</strong>
                  <span>${formatDate(site.endDate)} · ${site.estimatedDays} j</span>
                </div>
              </div>
            `
          )
          .join('')}
      </div>
    `;
  }

  function renderMonth(sites, yearMonth) {
    if (!yearMonth) return '<p class="empty">Choisis un mois pour filtrer.</p>';

    const [year, month] = yearMonth.split('-').map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const filtered = sites.filter((site) => new Date(site.endDate) >= start && new Date(site.startDate) <= end);
    if (!filtered.length) return '<p class="empty">Aucun chantier sur ce mois.</p>';

    return `
      <ul class="month-list">
        ${filtered
          .map(
            (site) => `
              <li>
                <strong>${escapeHtml(site.name)}</strong>
                <span>${formatDate(site.startDate)} → ${formatDate(site.endDate)}</span>
              </li>
            `
          )
          .join('')}
      </ul>
    `;
  }

  function renderLoad(sites, teams) {
    if (!teams.length) return '<p class="empty">Ajoute des équipes pour afficher leur charge.</p>';

    return `
      <div class="planning-list">
        ${teams
          .map((team) => {
            const matching = sites.filter(
              (site) => site.lead.toLowerCase() === team.leader.toLowerCase() || site.lead.toLowerCase().includes(team.leader.toLowerCase())
            );
            return `
              <article class="planning-item">
                <h3>${escapeHtml(team.name)}</h3>
                <p>Chef : ${escapeHtml(team.leader)}</p>
                <p>Type : ${team.type === 'subcontractor' ? 'Sous-traitant' : 'Interne'}</p>
                <p><strong>Chantiers :</strong> ${matching.length ? matching.map((site) => escapeHtml(site.name)).join(', ') : 'Aucun'}</p>
              </article>
            `;
          })
          .join('')}
      </div>
    `;
  }

  function initPlanningPage() {
    const planningView = document.getElementById('planningView');
    if (!planningView) return;

    const monthControls = document.getElementById('monthControls');
    const monthInput = document.getElementById('monthInput');
    const switcher = document.getElementById('viewSwitch');
    let currentView = 'list';

    monthInput.value = new Date().toISOString().slice(0, 7);

    function render() {
      const state = loadState();
      const sites = state.sites;

      monthControls.classList.toggle('hidden', currentView !== 'month');

      if (currentView === 'timeline') {
        planningView.innerHTML = renderTimeline(sites);
      } else if (currentView === 'month') {
        planningView.innerHTML = renderMonth(sites, monthInput.value);
      } else if (currentView === 'load') {
        planningView.innerHTML = renderLoad(sites, state.teams);
      } else {
        planningView.innerHTML = renderPlanningList(sites);
      }
    }

    switcher.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-view]');
      if (!button) return;

      currentView = button.dataset.view;
      switcher.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      render();
    });

    monthInput.addEventListener('change', render);
    render();
  }

  requireAuth();
  wireLogout();
  initLoginPage();
  initSitesPage();
  initTeamsPage();
  initPlanningPage();
})();
