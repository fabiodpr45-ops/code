(function () {
  const STORAGE_KEY = 'planningChantierData';

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

    renderPlanning();
  }

  initDatabasePage();
  initPlanningPage();
})();
