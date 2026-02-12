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
    const current = {
      age: 3,
      soundEnabled: true,
      balloons: 0,
      ...readState(),
      ...patch,
    };
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

  function playTone(freq = 440, duration = 0.16) {
    const state = readState();
    if (!state.soundEnabled) return;
    ensureAudioContext();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
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
    const state = readState();
    if (!state.soundEnabled || !synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR';
    u.rate = 0.95;
    synth.speak(u);
  }

  function wireSharedUI() {
    const state = writeState({});
    const ageRow = document.getElementById('ageButtons');
    if (ageRow) {
      ageRow.querySelectorAll('button').forEach((btn) => {
        btn.classList.toggle('active', Number(btn.dataset.age) === state.age);
      });
      ageRow.addEventListener('click', (event) => {
        const btn = event.target.closest('button[data-age]');
        if (!btn) return;
        const age = Number(btn.dataset.age);
        writeState({ age });
        ageRow.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const label = document.getElementById('ageStatus');
        if (label) label.textContent = `Âge choisi : ${age} ans`;
        playTone(450 + age * 22, 0.1);
        speak(`${age} ans`);
      });
      const label = document.getElementById('ageStatus');
      if (label) label.textContent = `Âge choisi : ${state.age} ans`;
    }

    const soundBtn = document.getElementById('soundToggle');
    if (soundBtn) {
      soundBtn.classList.toggle('active', !!state.soundEnabled);
      soundBtn.textContent = state.soundEnabled ? '🔊 Son activé' : '🔇 Son coupé';
      soundBtn.addEventListener('click', () => {
        const next = writeState({ soundEnabled: !readState().soundEnabled });
        soundBtn.classList.toggle('active', !!next.soundEnabled);
        soundBtn.textContent = next.soundEnabled ? '🔊 Son activé' : '🔇 Son coupé';
        if (next.soundEnabled) playTone(520, 0.12);
      });
    }
  }

  function initColors() {
    const zone = document.getElementById('playZone');
    if (!zone) return;
    const colors = [
      { n: 'Rouge', v: '#ff595e', t: 261 },
      { n: 'Bleu', v: '#5b8cff', t: 329 },
      { n: 'Vert', v: '#49c88f', t: 392 },
      { n: 'Jaune', v: '#ffca3a', t: 440 },
      { n: 'Violet', v: '#9d4edd', t: 493 },
    ];
    let i = 0;
    const btn = document.getElementById('colorBtn');
    const label = document.getElementById('status');
    btn.style.background = colors[i].v;
    label.textContent = `Couleur : ${colors[i].n}`;
    btn.addEventListener('click', () => {
      i = (i + 1) % colors.length;
      btn.style.background = colors[i].v;
      label.textContent = `Couleur : ${colors[i].n}`;
      playTone(colors[i].t, 0.18);
      speak(colors[i].n);
    });
  }

  function initAnimals() {
    const data = [
      { e: '🐶', n: 'Chien', s: 'Wouf wouf !', t: 280 },
      { e: '🐱', n: 'Chat', s: 'Miaou !', t: 340 },
      { e: '🐮', n: 'Vache', s: 'Meuh !', t: 230 },
      { e: '🦆', n: 'Canard', s: 'Coin coin !', t: 500 },
      { e: '🐸', n: 'Grenouille', s: 'Croa croa !', t: 190 },
    ];
    let i = 0;
    const btn = document.getElementById('animalBtn');
    const label = document.getElementById('status');
    const draw = () => {
      btn.textContent = data[i].e;
      label.textContent = `${data[i].n} : ${data[i].s}`;
    };
    draw();
    btn.addEventListener('click', () => {
      i = (i + 1) % data.length;
      draw();
      playTone(data[i].t, 0.2);
      speak(data[i].s);
    });
  }

  function initCount() {
    let state = writeState({ balloons: 0 });
    const target = Math.max(2, state.age + 1);
    const btn = document.getElementById('balloonBtn');
    const counter = document.getElementById('counter');
    const status = document.getElementById('status');
    const hint = document.getElementById('hint');
    hint.textContent = `Appuie sur le ballon pour compter jusqu'à ${target}.`;

    function resetBalloon() {
      btn.disabled = false;
      btn.style.visibility = 'visible';
    }

    function popAndRespawn() {
      btn.disabled = true;
      btn.style.visibility = 'hidden';
      setTimeout(resetBalloon, 500);
    }

    btn.addEventListener('click', () => {
      state = writeState({ balloons: (readState().balloons || 0) + 1 });
      const value = state.balloons;
      counter.textContent = value;
      playTone(280 + value * 40, 0.12);
      speak(String(value));
      popAndRespawn();
      if (value >= target) {
        status.className = 'status celebration';
        status.textContent = `Bravo 🎉 ${value} ballons comptés !`;
        speak('Bravo');
        writeState({ balloons: 0 });
        setTimeout(() => {
          counter.textContent = '0';
          status.className = 'status';
          status.textContent = 'On recommence !';
        }, 800);
      } else {
        status.className = 'status';
        status.textContent = `Encore ${target - value} !`;
      }
    });
  }

  function initShapes() {
    const targets = ['Carré', 'Rond', 'Triangle'];
    const info = document.getElementById('status');
    const hint = document.getElementById('hint');
    let target = targets[Math.floor(Math.random() * targets.length)];
    const refresh = () => {
      hint.textContent = `Trouve : ${target}`;
      info.textContent = `Clique sur ${target}`;
      info.className = 'status';
    };
    refresh();
    function check(picked) {
      if (picked === target) {
        info.className = 'status celebration';
        info.textContent = `Oui ! ${picked} 🎉`;
        playTone(640, .2);
        speak(`Bravo ${picked}`);
      } else {
        info.textContent = 'Essaie encore 🙂';
        playTone(220, .14);
      }
      setTimeout(() => {
        target = targets[Math.floor(Math.random() * targets.length)];
        refresh();
      }, 700);
    }
    document.getElementById('squareBtn').addEventListener('click', () => check('Carré'));
    document.getElementById('circleBtn').addEventListener('click', () => check('Rond'));
    document.getElementById('triangleBtn').addEventListener('click', () => check('Triangle'));
  }

  function initPiano() {
    const notes = [
      ['Do', 262], ['Ré', 294], ['Mi', 330], ['Fa', 349], ['Sol', 392], ['La', 440], ['Si', 494],
    ];
    const wrap = document.getElementById('piano');
    notes.forEach(([label, hz]) => {
      const b = document.createElement('button');
      b.className = 'note';
      b.textContent = label;
      b.addEventListener('click', () => {
        playTone(hz, 0.28);
        speak(label);
      });
      wrap.appendChild(b);
    });
  }

  function initMemory() {
    const symbols = ['🐶','🐱','🐶','🐱'];
    symbols.sort(() => Math.random() - 0.5);
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    let opened = [];
    let lock = false;
    symbols.forEach((sym, idx) => {
      const btn = document.createElement('button');
      btn.textContent = '❓';
      btn.dataset.sym = sym;
      btn.dataset.idx = String(idx);
      btn.addEventListener('click', () => {
        if (lock || btn.dataset.done === '1' || opened.includes(btn)) return;
        btn.textContent = sym;
        opened.push(btn);
        playTone(360, 0.08);
        if (opened.length === 2) {
          lock = true;
          if (opened[0].dataset.sym === opened[1].dataset.sym) {
            opened.forEach((b) => (b.dataset.done = '1'));
            status.textContent = 'Bravo, paire trouvée !';
            playTone(620, 0.16);
          } else {
            status.textContent = 'Essaie encore';
            playTone(220, 0.12);
            setTimeout(() => opened.forEach((b) => (b.textContent = '❓')), 500);
          }
          setTimeout(() => { opened = []; lock = false; }, 520);
        }
      });
      board.appendChild(btn);
    });
  }

  window.PetitMonde = {
    wireSharedUI,
    initColors,
    initAnimals,
    initCount,
    initShapes,
    initPiano,
    initMemory,
  };
})();
