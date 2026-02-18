(function () {
  const STORAGE_KEY = 'planningChantierData';
  const AUTH_KEY = 'planningChantierAuth';
  const VALID_LOGIN = 'DPR45';
  const VALID_PASSWORD = 'Isolation45';

  const defaultData = {
    workers: [],
    subcontractors: [],
    sites: []
  };

  function uid(prefix) {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  function readData() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return {
        workers: parsed.workers || [],
        subcontractors: parsed.subcontractors || [],
        sites: parsed.sites || []
      };
    } catch {
      return { ...defaultData };
    }
  }

  function writeData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('fr-FR');
  }

  function isAuthenticated() {
    return localStorage.getItem(AUTH_KEY) === 'ok';
  }

  function requireAuth() {
    const page = document.body.dataset.page;
    if (!page) return;
    const isLoginPage = window.location.pathname.endsWith('login.html') || page === 'login';
    if (isLoginPage && isAuthenticated()) {
      window.location.replace('index.html');
      return;
    }
    if (!isLoginPage && !isAuthenticated()) {
      window.location.replace(window.location.pathname.includes('/pages/') ? '../login.html' : 'login.html');
    }
  }

  function wireLogout() {
    const btn = document.getElementById('logoutButton');
    if (!btn) return;
    btn.addEventListener('click', () => {
      localStorage.removeItem(AUTH_KEY);
      window.location.replace(window.location.pathname.includes('/pages/') ? '../login.html' : 'login.html');
    });
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
        window.location.replace('index.html');
        return;
      }

      errorNode.textContent = 'Identifiants incorrects.';
    });
  }

  function validateSiteDates(startDate, endDate) {
    if (!startDate || !endDate) return false;
    return new Date(startDate) <= new Date(endDate);
  }

  function initDatabasePage() {
    const workerForm = document.getElementById('workerForm');
    if (!workerForm) return;

    const workerList = document.getElementById('workerList');
    const subForm = document.getElementById('subForm');
    const subList = document.getElementById('subList');
    const siteForm = document.getElementById('siteForm');
    const siteList = document.getElementById('siteList');
    const bulkSiteForm = document.getElementById('bulkSiteForm');

    function render() {
      const data = readData();

      workerList.innerHTML = data.workers
        .map(
          (worker) => `
            <li>
              <div>
                <strong>${worker.name}</strong>
                <span>${worker.role}</span>
              </div>
              <button data-type="worker" data-id="${worker.id}" class="danger">Supprimer</button>
            </li>`
        )
        .join('') || '<li class="empty">Aucun ouvrier enregistré.</li>';

      subList.innerHTML = data.subcontractors
        .map(
          (sub) => `
            <li>
              <div>
                <strong>${sub.company}</strong>
                <span>Contact : ${sub.contact}</span>
              </div>
              <button data-type="sub" data-id="${sub.id}" class="danger">Supprimer</button>
            </li>`
        )
        .join('') || '<li class="empty">Aucun sous-traitant enregistré.</li>';

      siteList.innerHTML = data.sites
        .map(
          (site) => `
            <li>
              <div>
                <strong>${site.name}</strong>
                <span>${site.location} · ${formatDate(site.startDate)} → ${formatDate(site.endDate)}</span>
              </div>
              <button data-type="site" data-id="${site.id}" class="danger">Supprimer</button>
            </li>`
        )
        .join('') || '<li class="empty">Aucun chantier enregistré.</li>';
    }

    workerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('workerName').value.trim();
      const role = document.getElementById('workerRole').value.trim();
      if (!name || !role) return;

      const data = readData();
      data.workers.push({ id: uid('worker'), name, role });
      writeData(data);
      workerForm.reset();
      render();
    });

  function initDatabasePage() {
    const workerForm = document.getElementById('workerForm');
    if (!workerForm) return;

    const workerList = document.getElementById('workerList');
    const subForm = document.getElementById('subForm');
    const subList = document.getElementById('subList');
    const siteForm = document.getElementById('siteForm');
    const siteList = document.getElementById('siteList');

    function render() {
      const data = readData();

      workerList.innerHTML = data.workers
        .map(
          (worker) => `
            <li>
              <div>
                <strong>${worker.name}</strong>
                <span>${worker.role}</span>
              </div>
              <button data-type="worker" data-id="${worker.id}" class="danger">Supprimer</button>
            </li>`
        )
        .join('') || '<li class="empty">Aucun ouvrier enregistré.</li>';

      subList.innerHTML = data.subcontractors
        .map(
          (sub) => `
            <li>
              <div>
                <strong>${sub.company}</strong>
                <span>Contact : ${sub.contact}</span>
              </div>
              <button data-type="sub" data-id="${sub.id}" class="danger">Supprimer</button>
            </li>`
        )
        .join('') || '<li class="empty">Aucun sous-traitant enregistré.</li>';

      siteList.innerHTML = data.sites
        .map(
          (site) => `
            <li>
              <div>
                <strong>${site.name}</strong>
                <span>${site.location} · ${formatDate(site.startDate)} → ${formatDate(site.endDate)}</span>
              </div>
              <button data-type="site" data-id="${site.id}" class="danger">Supprimer</button>
            </li>`
        )
        .join('') || '<li class="empty">Aucun chantier enregistré.</li>';
    }

    workerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('workerName').value.trim();
      const role = document.getElementById('workerRole').value.trim();
      if (!name || !role) return;

      const data = readData();
      data.workers.push({ id: uid('worker'), name, role });
      writeData(data);
      workerForm.reset();
      render();
    });

    subForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const company = document.getElementById('subCompany').value.trim();
      const contact = document.getElementById('subContact').value.trim();
      if (!company || !contact) return;

      const data = readData();
      data.subcontractors.push({ id: uid('sub'), company, contact });
      writeData(data);
      subForm.reset();
      render();
    });

    siteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('siteName').value.trim();
      const location = document.getElementById('siteLocation').value.trim();
      const startDate = document.getElementById('siteStart').value;
      const endDate = document.getElementById('siteEnd').value;

      if (!name || !location || !startDate || !endDate) return;
      if (!validateSiteDates(startDate, endDate)) {
      if (!name || !location || !startDate || !endDate) return;
      if (new Date(startDate) > new Date(endDate)) {
        alert('La date de début doit être avant la date de fin.');
        return;
      }

      const data = readData();
      data.sites.push({
        id: uid('site'),
        name,
        location,
        startDate,
        endDate,
        workerIds: [],
        subcontractorIds: []
      });
      writeData(data);
      siteForm.reset();
      render();
    });

    bulkSiteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const raw = document.getElementById('bulkSitesInput').value.trim();
      if (!raw) return;

      const lines = raw.split('\n').map((line) => line.trim()).filter(Boolean);
      const data = readData();
      let added = 0;

      lines.forEach((line) => {
        const [name, location, startDate, endDate] = line.split('|').map((part) => (part || '').trim());
        if (!name || !location || !validateSiteDates(startDate, endDate)) return;

        data.sites.push({
          id: uid('site'),
          name,
          location,
          startDate,
          endDate,
          workerIds: [],
          subcontractorIds: []
        });
        added += 1;
      });

      writeData(data);
      bulkSiteForm.reset();
      render();
      if (!added) {
        alert('Aucune ligne valide. Vérifie le format Nom|Lieu|AAAA-MM-JJ|AAAA-MM-JJ');
      }
    });

    document.body.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.matches('button[data-type][data-id]')) return;

      const type = target.dataset.type;
      const id = target.dataset.id;
      const data = readData();

      if (type === 'worker') {
        data.workers = data.workers.filter((w) => w.id !== id);
        data.sites = data.sites.map((site) => ({
          ...site,
          workerIds: (site.workerIds || []).filter((workerId) => workerId !== id)
        }));
      }

      if (type === 'sub') {
        data.subcontractors = data.subcontractors.filter((s) => s.id !== id);
        data.sites = data.sites.map((site) => ({
          ...site,
          subcontractorIds: (site.subcontractorIds || []).filter((subId) => subId !== id)
        }));
      }

      if (type === 'site') {
        data.sites = data.sites.filter((s) => s.id !== id);
      }

      writeData(data);
      render();
    });

    render();
  }

  function dateInRange(day, start, end) {
    return day >= start && day <= end;
  }

  function renderTimeline(data) {
    return data.sites
      .slice()
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .map((site) => {
        const workers = (site.workerIds || [])
          .map((id) => data.workers.find((worker) => worker.id === id))
          .filter(Boolean)
          .map((w) => w.name)
          .join(', ');

        const subs = (site.subcontractorIds || [])
          .map((id) => data.subcontractors.find((sub) => sub.id === id))
          .filter(Boolean)
          .map((s) => s.company)
          .join(', ');

        return `
          <article class="timeline-item">
            <h3>${site.name}</h3>
            <p><strong>Lieu :</strong> ${site.location}</p>
            <p><strong>Période :</strong> ${formatDate(site.startDate)} → ${formatDate(site.endDate)}</p>
            <p><strong>Ouvriers :</strong> ${workers || 'Aucun'}</p>
            <p><strong>Sous-traitants :</strong> ${subs || 'Aucun'}</p>
          </article>
        `;
      })
      .join('');
  }

  function renderCalendar(data, monthValue) {
    const base = monthValue ? new Date(`${monthValue}-01`) : new Date();
    const year = base.getFullYear();
    const month = base.getMonth();
    const days = new Date(year, month + 1, 0).getDate();

    const labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    let html = '<div class="calendar-grid">';
    html += labels.map((label) => `<div class="calendar-head">${label}</div>`).join('');

    const firstDay = new Date(year, month, 1);
    const offset = (firstDay.getDay() + 6) % 7;
    for (let i = 0; i < offset; i += 1) {
      html += '<div class="calendar-cell empty"></div>';
    }

    for (let dayNum = 1; dayNum <= days; dayNum += 1) {
      const dayDate = new Date(year, month, dayNum);
      const chips = data.sites
        .filter((site) => dateInRange(dayDate, new Date(site.startDate), new Date(site.endDate)))
        .map((site) => `<span class="chip">${site.name}</span>`)
        .join('');

      html += `
        <div class="calendar-cell">
          <div class="calendar-day">${dayNum}</div>
          <div class="chips">${chips || '<span class="muted">-</span>'}</div>
        </div>
      `;
    }

    html += '</div>';
    return html;
  }

  function renderWorkload(data) {
    const workerCards = data.workers.map((worker) => {
      const assignedSites = data.sites.filter((site) => (site.workerIds || []).includes(worker.id));
      return `
        <article class="team-card">
          <h3>👷 ${worker.name}</h3>
          <p>${worker.role}</p>
          <p><strong>Chantiers:</strong> ${assignedSites.map((s) => s.name).join(', ') || 'Aucun'}</p>
        </article>
      `;
    });

    const subCards = data.subcontractors.map((sub) => {
      const assignedSites = data.sites.filter((site) => (site.subcontractorIds || []).includes(sub.id));
      return `
        <article class="team-card">
          <h3>🏗️ ${sub.company}</h3>
          <p>${sub.contact}</p>
          <p><strong>Chantiers:</strong> ${assignedSites.map((s) => s.name).join(', ') || 'Aucun'}</p>
        </article>
      `;
    });

    return `<div class="team-grid">${workerCards.concat(subCards).join('') || '<p class="empty">Aucune équipe.</p>'}</div>`;

      writeData(data);
      bulkSiteForm.reset();
      render();
      if (!added) {
        alert('Aucune ligne valide. Vérifie le format Nom|Lieu|AAAA-MM-JJ|AAAA-MM-JJ');
      }
    });

    document.body.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.matches('button[data-type][data-id]')) return;

      const type = target.dataset.type;
      const id = target.dataset.id;
      const data = readData();

      if (type === 'worker') {
        data.workers = data.workers.filter((w) => w.id !== id);
        data.sites = data.sites.map((site) => ({
          ...site,
          workerIds: (site.workerIds || []).filter((workerId) => workerId !== id)
        }));
      }

      if (type === 'sub') {
        data.subcontractors = data.subcontractors.filter((s) => s.id !== id);
        data.sites = data.sites.map((site) => ({
          ...site,
          subcontractorIds: (site.subcontractorIds || []).filter((subId) => subId !== id)
        }));
      }

      if (type === 'site') {
        data.sites = data.sites.filter((s) => s.id !== id);
      }

      writeData(data);
      render();
    });

    render();
  }

  function dateInRange(day, start, end) {
    return day >= start && day <= end;
  }

  function renderTimeline(data) {
    return data.sites
      .slice()
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .map((site) => {
        const workers = (site.workerIds || [])
          .map((id) => data.workers.find((worker) => worker.id === id))
          .filter(Boolean)
          .map((w) => w.name)
          .join(', ');

        const subs = (site.subcontractorIds || [])
          .map((id) => data.subcontractors.find((sub) => sub.id === id))
          .filter(Boolean)
          .map((s) => s.company)
          .join(', ');

        return `
          <article class="timeline-item">
            <h3>${site.name}</h3>
            <p><strong>Lieu :</strong> ${site.location}</p>
            <p><strong>Période :</strong> ${formatDate(site.startDate)} → ${formatDate(site.endDate)}</p>
            <p><strong>Ouvriers :</strong> ${workers || 'Aucun'}</p>
            <p><strong>Sous-traitants :</strong> ${subs || 'Aucun'}</p>
          </article>
        `;
      })
      .join('');
  }

  function renderCalendar(data, monthValue) {
    const base = monthValue ? new Date(`${monthValue}-01`) : new Date();
    const year = base.getFullYear();
    const month = base.getMonth();
    const days = new Date(year, month + 1, 0).getDate();

    const labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    let html = '<div class="calendar-grid">';
    html += labels.map((label) => `<div class="calendar-head">${label}</div>`).join('');

    const firstDay = new Date(year, month, 1);
    const offset = (firstDay.getDay() + 6) % 7;
    for (let i = 0; i < offset; i += 1) {
      html += '<div class="calendar-cell empty"></div>';
    }

    for (let dayNum = 1; dayNum <= days; dayNum += 1) {
      const dayDate = new Date(year, month, dayNum);
      const chips = data.sites
        .filter((site) => dateInRange(dayDate, new Date(site.startDate), new Date(site.endDate)))
        .map((site) => `<span class="chip">${site.name}</span>`)
        .join('');

      html += `
        <div class="calendar-cell">
          <div class="calendar-day">${dayNum}</div>
          <div class="chips">${chips || '<span class="muted">-</span>'}</div>
        </div>
      `;
    }

    html += '</div>';
    return html;
  }

  function renderWorkload(data) {
    const workerCards = data.workers.map((worker) => {
      const assignedSites = data.sites.filter((site) => (site.workerIds || []).includes(worker.id));
      return `
        <article class="team-card">
          <h3>👷 ${worker.name}</h3>
          <p>${worker.role}</p>
          <p><strong>Chantiers:</strong> ${assignedSites.map((s) => s.name).join(', ') || 'Aucun'}</p>
        </article>
      `;
    });

    const subCards = data.subcontractors.map((sub) => {
      const assignedSites = data.sites.filter((site) => (site.subcontractorIds || []).includes(sub.id));
      return `
        <article class="team-card">
          <h3>🏗️ ${sub.company}</h3>
          <p>${sub.contact}</p>
          <p><strong>Chantiers:</strong> ${assignedSites.map((s) => s.name).join(', ') || 'Aucun'}</p>
        </article>
      `;
    });

    return `<div class="team-grid">${workerCards.concat(subCards).join('') || '<p class="empty">Aucune équipe.</p>'}</div>`;
  }

  function initPlanningPage() {
    const assignForm = document.getElementById('assignForm');
    if (!assignForm) return;

    const assignSite = document.getElementById('assignSite');
    const assignWorker = document.getElementById('assignWorker');
    const assignSub = document.getElementById('assignSub');
    const planningView = document.getElementById('planningView');
    const viewSwitch = document.getElementById('viewSwitch');
    const calendarControls = document.getElementById('calendarControls');
    const calendarMonth = document.getElementById('calendarMonth');

    let currentView = 'timeline';

    function fillSelect(selectEl, entries, firstLabel, mapper) {
      selectEl.innerHTML = '';
      const first = document.createElement('option');
      first.value = '';
      first.textContent = firstLabel;
      selectEl.append(first);
      entries.forEach((entry) => {
        const option = document.createElement('option');
        option.value = entry.id;
        option.textContent = mapper(entry);
        selectEl.append(option);
      });
    }

    function renderPlanning() {
      const data = readData();

      assignSite.innerHTML = data.sites
        .map((site) => `<option value="${site.id}">${site.name}</option>`)
        .join('');

      fillSelect(assignWorker, data.workers, 'Aucun ouvrier', (worker) => `${worker.name} (${worker.role})`);
      fillSelect(assignSub, data.subcontractors, 'Aucun sous-traitant', (sub) => `${sub.company} - ${sub.contact}`);

      if (!data.sites.length) {
        planningView.innerHTML = '<p class="empty">Ajoute d\'abord des chantiers depuis la page Bases.</p>';
        return;
      }

      if (currentView === 'timeline') {
        calendarControls.classList.add('hidden');
        planningView.innerHTML = renderTimeline(data);
      } else if (currentView === 'calendar') {
        calendarControls.classList.remove('hidden');
        if (!calendarMonth.value) {
          const now = new Date();
          calendarMonth.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        }
        planningView.innerHTML = renderCalendar(data, calendarMonth.value);
      } else {
        calendarControls.classList.add('hidden');
        planningView.innerHTML = renderWorkload(data);
      }
    }

    assignForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const siteId = assignSite.value;
      const workerId = assignWorker.value;
      const subId = assignSub.value;
      if (!siteId) {
        alert('Choisis un chantier.');
        return;
      }

      const data = readData();
      const site = data.sites.find((entry) => entry.id === siteId);
      if (!site) return;

      site.workerIds = site.workerIds || [];
      site.subcontractorIds = site.subcontractorIds || [];

      if (workerId && !site.workerIds.includes(workerId)) {
        site.workerIds.push(workerId);
      }

      if (subId && !site.subcontractorIds.includes(subId)) {
        site.subcontractorIds.push(subId);
      }

      writeData(data);
      assignForm.reset();
      renderPlanning();
    });

    viewSwitch.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.matches('button[data-view]')) return;

      currentView = target.dataset.view;
      viewSwitch.querySelectorAll('button').forEach((button) => button.classList.remove('active'));
      target.classList.add('active');
      renderPlanning();
    });

    calendarMonth.addEventListener('change', renderPlanning);

    renderPlanning();
  }

  requireAuth();
  wireLogout();
  initLoginPage();
    document.body.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.matches('button[data-type][data-id]')) return;

      const type = target.dataset.type;
      const id = target.dataset.id;
      const data = readData();

      if (type === 'worker') {
        data.workers = data.workers.filter((w) => w.id !== id);
        data.sites = data.sites.map((site) => ({
          ...site,
          workerIds: (site.workerIds || []).filter((workerId) => workerId !== id)
        }));
      }

      if (type === 'sub') {
        data.subcontractors = data.subcontractors.filter((s) => s.id !== id);
        data.sites = data.sites.map((site) => ({
          ...site,
          subcontractorIds: (site.subcontractorIds || []).filter((subId) => subId !== id)
        }));
      }

      if (type === 'site') {
        data.sites = data.sites.filter((s) => s.id !== id);
      }

      writeData(data);
      render();
    });

    render();
  }

  function initPlanningPage() {
    const assignForm = document.getElementById('assignForm');
    if (!assignForm) return;

    const assignSite = document.getElementById('assignSite');
    const assignWorker = document.getElementById('assignWorker');
    const assignSub = document.getElementById('assignSub');
    const planningView = document.getElementById('planningView');
    const viewSwitch = document.getElementById('viewSwitch');
    const calendarControls = document.getElementById('calendarControls');
    const calendarMonth = document.getElementById('calendarMonth');

    let currentView = 'timeline';
    const timeline = document.getElementById('timeline');

    function fillSelect(selectEl, entries, firstLabel, mapper) {
      selectEl.innerHTML = '';
      const first = document.createElement('option');
      first.value = '';
      first.textContent = firstLabel;
      selectEl.append(first);
      entries.forEach((entry) => {
        const option = document.createElement('option');
        option.value = entry.id;
        option.textContent = mapper(entry);
        selectEl.append(option);
      });
    }

    function renderPlanning() {
      const data = readData();

      assignSite.innerHTML = data.sites
        .map((site) => `<option value="${site.id}">${site.name}</option>`)
        .join('');

      fillSelect(assignWorker, data.workers, 'Aucun ouvrier', (worker) => `${worker.name} (${worker.role})`);
      fillSelect(assignSub, data.subcontractors, 'Aucun sous-traitant', (sub) => `${sub.company} - ${sub.contact}`);

      if (!data.sites.length) {
        planningView.innerHTML = '<p class="empty">Ajoute d\'abord des chantiers depuis la page Bases.</p>';
        return;
      }

      if (currentView === 'timeline') {
        calendarControls.classList.add('hidden');
        planningView.innerHTML = renderTimeline(data);
      } else if (currentView === 'calendar') {
        calendarControls.classList.remove('hidden');
        if (!calendarMonth.value) {
          const now = new Date();
          calendarMonth.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        }
        planningView.innerHTML = renderCalendar(data, calendarMonth.value);
      } else {
        calendarControls.classList.add('hidden');
        planningView.innerHTML = renderWorkload(data);
      }
        timeline.innerHTML = '<p class="empty">Ajoute d\'abord des chantiers depuis la page Bases.</p>';
        return;
      }

      timeline.innerHTML = data.sites
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .map((site) => {
          const workers = (site.workerIds || [])
            .map((id) => data.workers.find((worker) => worker.id === id))
            .filter(Boolean)
            .map((w) => w.name)
            .join(', ');

          const subs = (site.subcontractorIds || [])
            .map((id) => data.subcontractors.find((sub) => sub.id === id))
            .filter(Boolean)
            .map((s) => s.company)
            .join(', ');

          return `
            <article class="timeline-item">
              <h3>${site.name}</h3>
              <p><strong>Lieu :</strong> ${site.location}</p>
              <p><strong>Période :</strong> ${formatDate(site.startDate)} → ${formatDate(site.endDate)}</p>
              <p><strong>Ouvriers :</strong> ${workers || 'Aucun'}</p>
              <p><strong>Sous-traitants :</strong> ${subs || 'Aucun'}</p>
            </article>
          `;
        })
        .join('');
    }

    assignForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const siteId = assignSite.value;
      const workerId = assignWorker.value;
      const subId = assignSub.value;
      if (!siteId) {
        alert('Choisis un chantier.');
        return;
      }

      const data = readData();
      const site = data.sites.find((entry) => entry.id === siteId);
      if (!site) return;

      site.workerIds = site.workerIds || [];
      site.subcontractorIds = site.subcontractorIds || [];

      if (workerId && !site.workerIds.includes(workerId)) {
        site.workerIds.push(workerId);
      }

      if (subId && !site.subcontractorIds.includes(subId)) {
        site.subcontractorIds.push(subId);
      }

      writeData(data);
      assignForm.reset();
      renderPlanning();
    });

    viewSwitch.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.matches('button[data-view]')) return;

      currentView = target.dataset.view;
      viewSwitch.querySelectorAll('button').forEach((button) => button.classList.remove('active'));
      target.classList.add('active');
      renderPlanning();
    });

    calendarMonth.addEventListener('change', renderPlanning);

    renderPlanning();
  }

  requireAuth();
  wireLogout();
  initLoginPage();
    });

    renderPlanning();
  }

  initDatabasePage();
  initPlanningPage();
})();
