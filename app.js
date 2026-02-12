(function () {
  const synth = window.speechSynthesis;
  let audioCtx;

  function readState() {
    try {
      return JSON.parse(localStorage.getItem('petitMondeState') || '{}');
    } catch {
      return {};
    }
  }

  function writeState(patch) {
    const current = { age: 3, soundEnabled: true, ...readState(), ...patch };
    localStorage.setItem('petitMondeState', JSON.stringify(current));
    return current;
  }

  function ensureAudioContext() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }

  function playTone(freq = 440, duration = 0.16, type = 'sine') {
    if (!readState().soundEnabled) return;
  function playTone(freq = 440, duration = 0.16) {
    const state = readState();
    if (!state.soundEnabled) return;
    ensureAudioContext();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = 0.001;
    gain.gain.exponentialRampToValueAtTime(0.16, audioCtx.currentTime + 0.02);
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = 0.001;
    gain.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  function speak(text) {
    if (!readState().soundEnabled || !synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR';
    u.rate = 0.95;
    synth.speak(u);
  }

  function playAnimalSound(name) {
    const sounds = {
      Chien: [300, 220],
      Chat: [500, 650],
      Vache: [190, 150],
      Canard: [620, 480],
      Grenouille: [220, 180],
      Cochon: [270, 230],
      Mouton: [340, 290],
      Cheval: [240, 300],
    };
    const seq = sounds[name] || [400, 500];
    playTone(seq[0], 0.12, 'square');
    setTimeout(() => playTone(seq[1], 0.12, 'square'), 130);
  }

  const animalSet = [
    { emoji: '🐶', name: 'Chien' },
    { emoji: '🐱', name: 'Chat' },
    { emoji: '🐮', name: 'Vache' },
    { emoji: '🦆', name: 'Canard' },
    { emoji: '🐸', name: 'Grenouille' },
    { emoji: '🐷', name: 'Cochon' },
    { emoji: '🐑', name: 'Mouton' },
    { emoji: '🐴', name: 'Cheval' },
  ];

  const gameCatalog = {
    1: [
      { id: 'colorTap', label: '🌈 Couleur magique' },
      { id: 'animalTap', label: '🐶 Animal sonore' },
      { id: 'balloonSingle', label: '🎈 Un ballon' },
      { id: 'emojiTap', label: '😀 Sourire touché' },
      { id: 'bigSmall', label: '🔵 Grand / petit' },
      { id: 'pianoMini', label: '🎹 Piano doux' },
      { id: 'shapeTap', label: '🔺 Toucher les formes' },
      { id: 'peekaboo', label: '🙈 Coucou caché' },
      { id: 'lightFlash', label: '✨ Étoile brillante' },
      { id: 'animalName', label: '🗣️ Nom de l’animal' },
    ],
    2: [
      { id: 'colorTap', label: '🌈 Couleur magique' },
      { id: 'animalTap', label: '🐶 Animal sonore' },
      { id: 'balloonCount3', label: '🎈 Compter 1 à 3' },
      { id: 'shapePick', label: '🔺 Choisir la forme' },
      { id: 'pianoMini', label: '🎹 Piano doux' },
      { id: 'emojiMatch', label: '🙂 Trouve le même' },
      { id: 'vehicleSound', label: '🚗 Sons des véhicules' },
      { id: 'bubblePop', label: '🫧 Bulles à éclater' },
      { id: 'clapCount', label: '👏 Tape des mains' },
      { id: 'animalName', label: '🗣️ Nom de l’animal' },
    ],
    3: [
      { id: 'balloonCount5', label: '🎈 Compter 1 à 5' },
      { id: 'animalTap', label: '🐶 Animal sonore' },
      { id: 'shapePick', label: '🔺 Formes magiques' },
      { id: 'colorFind', label: '🎨 Trouve la couleur' },
      { id: 'piano7', label: '🎹 Piano 7 notes' },
      { id: 'memory4', label: '🧠 Mémoire 4 cartes' },
      { id: 'numberVoice', label: '🔢 Nombres parlés' },
      { id: 'bubblePop', label: '🫧 Bulles à éclater' },
      { id: 'farmSound', label: '🚜 Ferme sonore' },
      { id: 'emojiMatch', label: '🙂 Trouve le même' },
    ],
    4: [
      { id: 'balloonCount8', label: '🎈 Compter 1 à 8' },
      { id: 'animalTap', label: '🐶 Animal sonore' },
      { id: 'shapePick', label: '🔺 Formes + consignes' },
      { id: 'colorFind', label: '🎨 Couleur demandée' },
      { id: 'piano7', label: '🎹 Piano 7 notes' },
      { id: 'memory6', label: '🧠 Mémoire 6 cartes' },
      { id: 'numberVoice', label: '🔢 Nombres parlés' },
      { id: 'vehicleSound', label: '🚗 Sons des véhicules' },
      { id: 'clapCount', label: '👏 Rythme des mains' },
      { id: 'oddOneOut', label: '🧐 Trouve l’intrus' },
    ],
    5: [
      { id: 'balloonCount10', label: '🎈 Compter 1 à 10' },
      { id: 'animalTap', label: '🐶 Animal sonore' },
      { id: 'shapePick', label: '🔺 Formes + vitesse' },
      { id: 'colorFind', label: '🎨 Couleur demandée' },
      { id: 'piano7', label: '🎹 Piano 7 notes' },
      { id: 'memory8', label: '🧠 Mémoire 8 cartes' },
      { id: 'numberVoice', label: '🔢 Nombres parlés' },
      { id: 'vehicleSound', label: '🚗 Sons des véhicules' },
      { id: 'oddOneOut', label: '🧐 Trouve l’intrus' },
      { id: 'quickTap', label: '⚡ Tape vite !' },
    ],
  };

  function gameButton(item) {
    const btn = document.createElement('button');
    btn.className = 'game-pill';
    btn.textContent = item.label;
    btn.dataset.game = item.id;
    return btn;
  }

  function clearPlay() {
    const zone = document.getElementById('playZone');
    zone.innerHTML = '';
    return zone;
  }

  function renderGameList(age) {
    const list = document.getElementById('gameList');
    list.innerHTML = '';
    gameCatalog[age].forEach((g) => list.appendChild(gameButton(g)));
    document.getElementById('gameCountHint').textContent = `${gameCatalog[age].length} jeux affichés pour ${age} an${age > 1 ? 's' : ''}.`;
  }

  function mountStatusBox(zone) {
    const wrap = document.createElement('div');
    wrap.style.textAlign = 'center';
    const status = document.createElement('p');
    status.className = 'status';
    status.id = 'liveStatus';
    const hint = document.createElement('p');
    hint.className = 'hint';
    hint.id = 'liveHint';
    wrap.append(status, hint);
    zone.appendChild(wrap);
    return { wrap, status, hint };
  }

  function runGame(id) {
    const zone = clearPlay();
    const age = readState().age || 3;
    document.querySelectorAll('.game-pill').forEach((b) => b.classList.toggle('active', b.dataset.game === id));
    document.getElementById('currentGameTitle').textContent = `Zone de jeu : ${id}`;

    const { wrap, status, hint } = mountStatusBox(zone);

    const countGame = (target) => {
      const b = document.createElement('button');
      b.className = 'emoji';
      b.textContent = '🎈';
      b.setAttribute('aria-label', 'Ballon');
      const c = document.createElement('p');
      c.className = 'counter';
      c.textContent = '0';
      let value = 0;
      status.textContent = 'On commence !';
      hint.textContent = `Un seul ballon apparaît à la fois. Objectif : ${target}.`;
      b.addEventListener('click', () => {
        value += 1;
        c.textContent = String(value);
        b.style.visibility = 'hidden';
        b.disabled = true;
        playTone(280 + value * 36, 0.11);
        speak(String(value));
        setTimeout(() => {
          b.style.visibility = 'visible';
          b.disabled = false;
        }, 450);
        if (value >= target) {
          status.className = 'status celebration';
          status.textContent = `Bravo, ${target} ballons 🎉`;
          speak('Bravo');
          setTimeout(() => {
            value = 0;
            c.textContent = '0';
            status.className = 'status';
            status.textContent = 'On recommence !';
          }, 700);
        } else {
          status.className = 'status';
          status.textContent = `Encore ${target - value}`;
        }
      });
      wrap.prepend(b, c);
    };

    if (id === 'colorTap' || id === 'colorFind') {
      const colors = [
        ['Rouge', '#ff595e', 261],
        ['Bleu', '#5b8cff', 329],
        ['Vert', '#49c88f', 392],
        ['Jaune', '#ffca3a', 440],
      ];
      const b = document.createElement('button');
      b.className = 'big-circle';
      let i = 0;
      b.style.background = colors[i][1];
      status.textContent = `Couleur : ${colors[i][0]}`;
      hint.textContent = 'Appuie pour changer la couleur.';
      b.addEventListener('click', () => {
        i = (i + 1) % colors.length;
        b.style.background = colors[i][1];
        status.textContent = `Couleur : ${colors[i][0]}`;
        playTone(colors[i][2], 0.16);
        speak(colors[i][0]);
      });
      wrap.prepend(b);
    } else if (id === 'animalTap' || id === 'animalName' || id === 'farmSound') {
      const b = document.createElement('button');
      b.className = 'emoji';
      let i = 0;
      const draw = () => {
        const a = animalSet[i % animalSet.length];
        b.textContent = a.emoji;
        status.textContent = `${a.name}`;
      };
      draw();
      hint.textContent = 'Appuie sur l’animal : bruit + nom de l’animal.';
      b.addEventListener('click', () => {
        const a = animalSet[i % animalSet.length];
        playAnimalSound(a.name);
        speak(a.name);
        i += 1;
        setTimeout(draw, 80);
      });
      wrap.prepend(b);
    } else if (id.startsWith('balloonCount') || id === 'balloonSingle') {
      const target = id === 'balloonSingle' ? 1 : Number(id.replace('balloonCount', '')) || Math.max(2, age + 1);
      countGame(target);
    } else if (id === 'shapeTap' || id === 'shapePick') {
      const targets = ['Carré', 'Rond', 'Triangle'];
      let t = targets[Math.floor(Math.random() * targets.length)];
      const row = document.createElement('div');
      row.className = 'btn-row';
      row.style.justifyContent = 'center';
      const s = document.createElement('button');
      s.className = 'shape-btn';
      s.style.background = '#5b8cff';
      const c = document.createElement('button');
      c.className = 'shape-btn shape-circle';
      c.style.background = '#49c88f';
      const tr = document.createElement('button');
      tr.className = 'shape-triangle';
      const check = (picked) => {
        if (id === 'shapeTap') {
          status.textContent = `${picked}`;
          speak(picked);
          playTone(420, 0.13);
          return;
        }
        if (picked === t) {
          status.className = 'status celebration';
          status.textContent = `Oui, ${picked} !`;
          playTone(640, 0.2);
          speak(`Bravo ${picked}`);
        } else {
          status.className = 'status';
          status.textContent = 'Essaie encore';
          playTone(220, 0.12);
        }
        setTimeout(() => {
          t = targets[Math.floor(Math.random() * targets.length)];
          hint.textContent = `Trouve : ${t}`;
          status.className = 'status';
        }, 700);
      };
      s.addEventListener('click', () => check('Carré'));
      c.addEventListener('click', () => check('Rond'));
      tr.addEventListener('click', () => check('Triangle'));
      row.append(s, c, tr);
      status.textContent = 'Joue avec les formes';
      hint.textContent = id === 'shapePick' ? `Trouve : ${t}` : 'Appuie sur une forme.';
      wrap.prepend(row);
    } else if (id === 'pianoMini' || id === 'piano7') {
      const notes = id === 'pianoMini'
        ? [['Do', 262], ['Mi', 330], ['Sol', 392]]
        : [['Do', 262], ['Ré', 294], ['Mi', 330], ['Fa', 349], ['Sol', 392], ['La', 440], ['Si', 494]];
      const piano = document.createElement('div');
      piano.className = 'piano';
      notes.forEach(([name, hz]) => {
        const b = document.createElement('button');
        b.className = 'note';
        b.textContent = name;
        b.addEventListener('click', () => {
          playTone(hz, 0.25);
          speak(name);
        });
        piano.appendChild(b);
      });
      status.textContent = 'Compose ta musique';
      hint.textContent = 'Appuie sur les touches.';
      wrap.prepend(piano);
    } else if (id === 'memory4' || id === 'memory6' || id === 'memory8' || id === 'emojiMatch') {
      const count = Number(id.replace('memory', '')) || 4;
      const pool = ['🐶', '🐱', '🐮', '🦆', '🐸', '🐷'];
      const pairs = Math.max(2, Math.floor(count / 2));
      const symbols = pool.slice(0, pairs).flatMap((e) => [e, e]).sort(() => Math.random() - 0.5);
      const board = document.createElement('div');
      board.className = 'btn-row';
      board.style.justifyContent = 'center';
      let opened = [];
      let lock = false;
      symbols.forEach((sym) => {
        const b = document.createElement('button');
        b.textContent = '❓';
        b.addEventListener('click', () => {
          if (lock || b.dataset.done === '1' || opened.includes(b)) return;
          b.textContent = sym;
          opened.push(b);
          playTone(360, 0.08);
          if (opened.length === 2) {
            lock = true;
            if (opened[0].textContent === opened[1].textContent) {
              opened.forEach((x) => (x.dataset.done = '1'));
              status.textContent = 'Paire trouvée !';
              playTone(610, 0.15);
            } else {
              status.textContent = 'Essaie encore';
              playTone(210, 0.12);
              setTimeout(() => opened.forEach((x) => (x.textContent = '❓')), 500);
            }
            setTimeout(() => { opened = []; lock = false; }, 520);
          }
        });
        board.appendChild(b);
      });
      status.textContent = 'Trouve les paires';
      hint.textContent = 'Retourne 2 cartes.';
      wrap.prepend(board);
    } else if (id === 'emojiTap' || id === 'peekaboo' || id === 'lightFlash') {
      const b = document.createElement('button');
      b.className = 'emoji';
      const seq = id === 'peekaboo' ? ['🙈', '🙉', '🙊'] : id === 'lightFlash' ? ['✨', '⭐', '🌟'] : ['😀', '😄', '🥳'];
      let i = 0;
      b.textContent = seq[0];
      status.textContent = 'Appuie pour changer';
      hint.textContent = 'Jeu sensoriel pour les plus petits.';
      b.addEventListener('click', () => {
        i = (i + 1) % seq.length;
        b.textContent = seq[i];
        playTone(420 + i * 90, 0.1);
      });
      wrap.prepend(b);
    } else if (id === 'vehicleSound') {
      const vehicles = [['🚗', 'voiture', 330], ['🚂', 'train', 240], ['🚢', 'bateau', 180], ['✈️', 'avion', 500]];
      let i = 0;
      const b = document.createElement('button');
      b.className = 'emoji';
      b.textContent = vehicles[0][0];
      status.textContent = 'Sons des véhicules';
      hint.textContent = 'Appuie sur le véhicule.';
      b.addEventListener('click', () => {
        const v = vehicles[i % vehicles.length];
        b.textContent = v[0];
        speak(v[1]);
        playTone(v[2], 0.14, 'sawtooth');
        i += 1;
      });
      wrap.prepend(b);
    } else if (id === 'bubblePop' || id === 'quickTap') {
      let score = 0;
      const b = document.createElement('button');
      b.className = 'emoji';
      b.textContent = id === 'bubblePop' ? '🫧' : '⚡';
      status.textContent = 'Score : 0';
      hint.textContent = id === 'quickTap' ? 'Tape vite pendant 10 secondes !' : 'Éclate les bulles.';
      let startedAt = 0;
      b.addEventListener('click', () => {
        if (id === 'quickTap' && !startedAt) startedAt = Date.now();
        score += 1;
        status.textContent = `Score : ${score}`;
        playTone(520, 0.08);
        if (id === 'quickTap' && Date.now() - startedAt > 10000) {
          speak(`Temps fini, score ${score}`);
          hint.textContent = 'Temps fini ! Reclique pour rejouer.';
          score = 0;
          startedAt = 0;
        }
      });
      wrap.prepend(b);
    } else if (id === 'bigSmall') {
      const b = document.createElement('button');
      b.className = 'big-circle';
      b.style.background = '#5b8cff';
      let big = true;
      status.textContent = 'Grand';
      hint.textContent = 'Appuie : grand puis petit.';
      b.addEventListener('click', () => {
        big = !big;
        b.style.width = big ? '180px' : '110px';
        b.style.height = big ? '180px' : '110px';
        status.textContent = big ? 'Grand' : 'Petit';
        speak(status.textContent);
        playTone(big ? 360 : 480, 0.1);
      });
      wrap.prepend(b);
    } else if (id === 'clapCount' || id === 'numberVoice') {
      let n = 0;
      const b = document.createElement('button');
      b.textContent = id === 'clapCount' ? '👏 Compter' : '🔢 Nombre suivant';
      status.textContent = '0';
      hint.textContent = 'Clique pour avancer.';
      b.addEventListener('click', () => {
        n += 1;
        status.textContent = String(n);
        speak(String(n));
        playTone(250 + n * 25, 0.08);
      });
      wrap.prepend(b);
    } else if (id === 'oddOneOut') {
      const row = document.createElement('div');
      row.className = 'btn-row';
      row.style.justifyContent = 'center';
      const items = ['🍎', '🍎', '🍎', '🍌'];
      items.sort(() => Math.random() - 0.5);
      const odd = items.indexOf('🍌');
      status.textContent = 'Trouve l’intrus';
      hint.textContent = 'Un élément est différent.';
      items.forEach((emoji, idx) => {
        const b = document.createElement('button');
        b.className = 'emoji';
        b.textContent = emoji;
        b.addEventListener('click', () => {
          if (idx === odd) {
            status.className = 'status celebration';
            status.textContent = 'Bravo !';
            playTone(650, 0.15);
          } else {
            status.className = 'status';
            status.textContent = 'Essaie encore';
            playTone(200, 0.1);
          }
        });
        row.appendChild(b);
      });
      wrap.prepend(row);
    }

    document.getElementById('gameHint').textContent = hint.textContent;
  }

  function initHub() {
    const state = writeState({});
    const ageButtons = document.getElementById('ageButtons');
    const ageStatus = document.getElementById('ageStatus');
    const soundToggle = document.getElementById('soundToggle');

    function refreshAgeUI() {
      const age = readState().age;
      ageButtons.querySelectorAll('button').forEach((b) => b.classList.toggle('active', Number(b.dataset.age) === age));
      ageStatus.textContent = `Âge choisi : ${age} ans`;
      renderGameList(age);
      runGame(gameCatalog[age][0].id);
    }

    soundToggle.classList.toggle('active', !!state.soundEnabled);
    soundToggle.textContent = state.soundEnabled ? '🔊 Son activé' : '🔇 Son coupé';

    ageButtons.addEventListener('click', (event) => {
      const btn = event.target.closest('button[data-age]');
      if (!btn) return;
      const age = Number(btn.dataset.age);
      writeState({ age });
      playTone(460 + age * 18, 0.1);
      speak(`${age} ans`);
      refreshAgeUI();
    });

    soundToggle.addEventListener('click', () => {
      const next = writeState({ soundEnabled: !readState().soundEnabled });
      soundToggle.classList.toggle('active', !!next.soundEnabled);
      soundToggle.textContent = next.soundEnabled ? '🔊 Son activé' : '🔇 Son coupé';
      if (next.soundEnabled) playTone(530, 0.11);
    });

    document.getElementById('gameList').addEventListener('click', (event) => {
      const btn = event.target.closest('button[data-game]');
      if (!btn) return;
      runGame(btn.dataset.game);
    });

    refreshAgeUI();
  }

  window.PetitMonde = { initHub };
})();
