import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PROFILE, ABOUT, STATS, SKILLS, PROJECTS, EDUCATION, ACHIEVEMENTS } from './data.js?v=3';

const API_BASE = window.API_BASE || '';
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const PALETTE = {
  dust: '#93AEBF',
  prussian: '#1C2F4D',
  pistachio: '#F2CEAE',
  rose: '#D48D91',
  bean: '#400D01',
};
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =====================  CONTENT  ===================== */
function renderContent() {
  if ($('#heroTag')) $('#heroTag').textContent = PROFILE.tagline;
  if ($('#aboutText')) $('#aboutText').innerHTML = ABOUT.map((p) => `<p>${esc(p)}</p>`).join('');
  if ($('#stats')) $('#stats').innerHTML = STATS.map((s) => `<div class="stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('');
  if ($('#skillGrid')) {
    $('#skillGrid').innerHTML = SKILLS.map((g) => `
      <div class="skill-card reveal"><h3>${esc(g.group)}</h3>
        <div class="pills">${g.items.map((i) => `<button type="button" class="pill c-${g.color}">${esc(i)}</button>`).join('')}</div></div>`).join('');
  }

  const engines = ['All', ...new Set(PROJECTS.map((p) => p.engine.split(' ·')[0]))];
  if ($('#filters')) $('#filters').innerHTML = engines.map((e, i) => `<button class="filter ${i ? '' : 'on'}" data-f="${esc(e)}">${esc(e)}</button>`).join('');
  if ($('#cards')) {
    $('#cards').innerHTML = PROJECTS.map((p) => `
      <button class="card reveal" data-id="${p.id}" data-engine="${esc(p.engine.split(' ·')[0])}">
        <div class="card-top">
          <span class="code-badge">${esc(p.code)}</span>
          <span class="engine">${esc(p.engine)}</span>
        </div>
        <h3>${esc(p.title)}</h3>
        <span class="badge">${esc(p.badge)}</span>
        <p>${esc(p.blurb)}</p>
        <div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
      </button>`).join('');
  }

  if ($('#timeline')) $('#timeline').innerHTML = EDUCATION.map((e) => `<li><div class="when">${esc(e.when)}</div><h3>${esc(e.title)}</h3><p>${esc(e.place)} &middot; ${esc(e.note)}</p></li>`).join('');
  if ($('#ach')) $('#ach').innerHTML = ACHIEVEMENTS.map((a) => `<li><span class="ic">${esc(a.code)}</span><div><b>${esc(a.title)}</b><p>${esc(a.text)}</p></div></li>`).join('');

  if ($('#mailLink')) {
    $('#mailLink').textContent = PROFILE.email;
    $('#mailLink').href = `mailto:${PROFILE.email}`;
  }
  if ($('#liLink')) $('#liLink').href = PROFILE.linkedin;
  if ($('#yr')) $('#yr').textContent = new Date().getFullYear();
}

function typedEffect() {
  const words = ['Game Developer', '3D Artist', 'Gameplay Programmer', 'Level Designer'];
  const el = $('#typed');
  if (!el) return;
  let w = 0, c = 0, del = false;
  if (reduceMotion) { el.textContent = words.join(' / '); return; }
  (function tick() {
    const word = words[w];
    el.textContent = word.slice(0, c);
    if (!del && c === word.length) { del = true; return setTimeout(tick, 1400); }
    if (del && c === 0) { del = false; w = (w + 1) % words.length; }
    c += del ? -1 : 1;
    setTimeout(tick, del ? 38 : 85);
  })();
}

/* =====================  UI & CURSOR SPARKLE TRAIL  ===================== */
function setupUI() {
  const root = document.documentElement;
  const saved = localStorage.getItem('theme') || 'light';
  const apply = (t) => {
    root.dataset.theme = t;
    if ($('#themeBtn')) $('#themeBtn').textContent = t === 'dark' ? 'LIGHT' : 'DARK';
    window.dispatchEvent(new CustomEvent('themechange', { detail: t }));
  };
  apply(saved);
  if ($('#themeBtn')) {
    $('#themeBtn').onclick = () => {
      const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', t);
      apply(t);
    };
  }

  if ($('#burger')) $('#burger').onclick = () => $('#navlinks').classList.toggle('open');
  if ($('#navlinks')) $('#navlinks').onclick = () => $('#navlinks').classList.remove('open');

  if ($('#skillGrid')) {
    $('#skillGrid').addEventListener('click', (e) => {
      const pill = e.target.closest('.pill');
      if (!pill) return;
      pill.classList.remove('popped');
      void pill.offsetWidth;
      pill.classList.add('popped');
    });
  }

  const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  const links = [...document.querySelectorAll('.links a')];
  const so = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-40% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach((s) => so.observe(s));

  if ($('#filters')) {
    $('#filters').onclick = (e) => {
      const b = e.target.closest('.filter'); if (!b) return;
      document.querySelectorAll('.filter').forEach((x) => x.classList.toggle('on', x === b));
      document.querySelectorAll('.card').forEach((c) => c.classList.toggle('hide', b.dataset.f !== 'All' && c.dataset.engine !== b.dataset.f));
    };
  }

  document.querySelectorAll('.card').forEach((card) => {
    if (reduceMotion) return;
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => (card.style.transform = ''));
  });

  const modal = $('#modal');
  const close = () => {
    const vid = modal.querySelector('video');
    if (vid) vid.pause();
    modal.hidden = true;
    document.body.style.overflow = '';
  };

  if ($('#cards')) {
    $('#cards').onclick = (e) => {
      const card = e.target.closest('.card'); if (!card) return;
      const p = PROJECTS.find((x) => x.id === card.dataset.id);
      if (!p) return;

      const videoBlock = p.video ? `
        <div class="modal-video" style="margin:14px 0;border-radius:12px;overflow:hidden;border:2px solid #1C2F4D;background:#000;">
          <video src="${esc(p.video)}" controls playsinline preload="metadata" controlsList="nodownload noplaybackrate" disablePictureInPicture style="width:100%;max-height:320px;display:block;background:#000;"></video>
        </div>` : '';

      $('#mBody').innerHTML = `
        <span class="code-badge">${esc(p.code)}</span>
        <h3 id="mTitle" style="font-size:2rem;margin:10px 0 4px">${esc(p.title)}</h3>
        <div class="engine">${esc(p.engine)}</div>
        <span class="badge">${esc(p.badge)}</span>
        ${videoBlock}
        <p>${esc(p.description)}</p>
        <div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
        <div class="links-row" style="position:relative;z-index:20;">${p.links.map((l) => {
          const rawUrl = (l.url || '').trim();
          const pending = !rawUrl || rawUrl === '#' || rawUrl.toUpperCase().startsWith('TODO');
          const finalUrl = pending
            ? ''
            : (/^(https?:\/\/|mailto:|\/|\.)/i.test(rawUrl) ? rawUrl : `https://${rawUrl}`);
          return `<a class="btn ${l.type === 'build' ? 'primary' : 'ghost'}" style="position:relative;z-index:21;cursor:pointer;" ${pending ? 'aria-disabled="true" title="Link coming soon"' : `href="${esc(finalUrl)}" target="_blank" rel="noopener noreferrer"`}>${esc(l.label)}${pending ? ' (Soon)' : ' &rarr;'}</a>`;
        }).join('')}</div>`;

      const vid = $('#mBody video');
      if (vid) {
        vid.addEventListener('error', () => {
          if (vid.parentElement) vid.parentElement.style.display = 'none';
        });
        vid.addEventListener('contextmenu', (ev) => ev.preventDefault());
      }

      const linksRow = $('#mBody .links-row');
      if (linksRow) {
        linksRow.style.setProperty('pointer-events', 'auto', 'important');
      }

      $('#mBody').querySelectorAll('.links-row a.btn').forEach((btn) => {
        btn.style.setProperty('pointer-events', 'auto', 'important');
        btn.addEventListener('click', (ev) => {
          const href = btn.getAttribute('href');
          ev.preventDefault();
          ev.stopPropagation();
          if (!href || href === '#') {
            alert('No URL found on this button — make sure js/data.js is saved.');
            return;
          }
          window.open(href, '_blank', 'noopener,noreferrer');
        });
      });

      modal.hidden = false;
      document.body.style.overflow = 'hidden';
    };
  }
  if ($('#mClose')) $('#mClose').onclick = close;
  if (modal) modal.onclick = (e) => e.target === modal && close();
  addEventListener('keydown', (e) => e.key === 'Escape' && close());

  const tc = $('#trailCanvas');
  if (tc && !reduceMotion) {
    const ctx = tc.getContext('2d');
    const resizeTrail = () => { tc.width = innerWidth; tc.height = innerHeight; };
    resizeTrail(); addEventListener('resize', resizeTrail);
    const sparks = [];
    const sparkCols = [PALETTE.rose, PALETTE.prussian, PALETTE.dust, PALETTE.bean];
    addEventListener('pointermove', (e) => {
      if (Math.random() > 0.45) return;
      sparks.push({
        x: e.clientX, y: e.clientY,
        vx: (Math.random() - 0.5) * 1.6,
        vy: -0.6 - Math.random() * 1.4,
        size: 3 + Math.random() * 4,
        life: 1,
        col: sparkCols[Math.floor(Math.random() * sparkCols.length)]
      });
    });
    (function drawTrail() {
      requestAnimationFrame(drawTrail);
      ctx.clearRect(0, 0, tc.width, tc.height);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.life -= 0.03;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.globalAlpha = s.life;
        ctx.fillStyle = s.col;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    })();
  }
}

/* =====================  3D BACKGROUND WORLD  ===================== */
function buildHeartGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, 0.35);
  s.bezierCurveTo(0, 0.35, -0.05, 0.55, -0.3, 0.55);
  s.bezierCurveTo(-0.65, 0.55, -0.65, 0.1, -0.65, 0.1);
  s.bezierCurveTo(-0.65, -0.2, -0.35, -0.45, 0, -0.7);
  s.bezierCurveTo(0.35, -0.45, 0.65, -0.2, 0.65, 0.1);
  s.bezierCurveTo(0.65, 0.1, 0.65, 0.55, 0.3, 0.55);
  s.bezierCurveTo(0.1, 0.55, 0, 0.35, 0, 0.35);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 3 });
  g.center();
  return g;
}

function buildStarGeometry(outerR = 0.6, innerR = 0.26) {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * r, y = Math.sin(a) * r;
    if (i === 0) s.moveTo(x, y); else s.lineTo(x, y);
  }
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03, bevelSegments: 3 });
  g.center();
  return g;
}

function setupBackground() {
  const canvas = $('#bg3d');
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 140);
  camera.position.set(0, 0, 16);

  const amb = new THREE.HemisphereLight(0xffffff, 0x1c2f4d, 1.5);
  const key = new THREE.DirectionalLight(0xffffff, 2.0); key.position.set(6, 10, 10);
  const pinkRim = new THREE.PointLight(0xd48d91, 2.4, 45); pinkRim.position.set(-8, 4, 6);
  scene.add(amb, key, pinkRim);

  const world = new THREE.Group();
  scene.add(world);

  const M = (c, r = 0.35, m = 0.1) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
  const interactables = [];
  const particles = [];
  const heartGeo = buildHeartGeometry();
  const starGeo = buildStarGeometry();

  window.triggerWorldBurst = (origin = new THREE.Vector3(0, 0, -3), count = 16) => {
    for (let i = 0; i < count; i++) {
      const isHeart = i % 2 === 0;
      const mesh = new THREE.Mesh(
        isHeart ? heartGeo : starGeo,
        M(isHeart ? PALETTE.rose : PALETTE.prussian, 0.25)
      );
      mesh.position.copy(origin);
      mesh.scale.setScalar(0.38);
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
      const speed = 0.07 + Math.random() * 0.09;
      mesh.userData = {
        vx: Math.cos(angle) * speed,
        vy: 0.05 + Math.random() * 0.09,
        vz: (Math.random() - 0.5) * 0.06,
        life: 1.0,
      };
      world.add(mesh);
      particles.push(mesh);
    }
  };

  [
    [-8.2, 3.2, -5, true, PALETTE.rose],
    [8.2, 3.5, -5.5, false, PALETTE.prussian],
    [-8.5, -2.8, -5.5, false, PALETTE.dust],
    [8.4, -3.0, -5.5, true, PALETTE.rose],
    [-1.2, 4.4, -7, false, PALETTE.rose],
    [1.4, -4.3, -7, true, PALETTE.dust],
  ].forEach(([x, y, z, isHeart, col], idx) => {
    const charm = new THREE.Mesh(isHeart ? heartGeo : starGeo, M(col, 0.25));
    charm.position.set(x, y, z);
    charm.scale.setScalar(0.8);
    charm.userData = { baseY: y, phase: idx * 0.9, spinBoost: 0 };
    world.add(charm);
    interactables.push(charm);
  });

  const ray = new THREE.Raycaster();
  const mouse = new THREE.Vector2(), smooth = new THREE.Vector2();
  addEventListener('pointermove', (e) => {
    mouse.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  });

  addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, a, input, textarea, .card, .modal-card, #heroStage, #chatbot')) return;
    const m = new THREE.Vector2((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    ray.setFromCamera(m, camera);
    const hits = ray.intersectObjects(interactables, true);
    if (hits.length) {
      hits[0].object.userData.spinBoost = 1.0;
      window.triggerWorldBurst(hits[0].object.position, 14);
    }
  });

  const resize = () => {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  };
  resize(); addEventListener('resize', resize);

  const clock = new THREE.Clock(); let visible = true;
  document.addEventListener('visibilitychange', () => (visible = !document.hidden));

  (function loop() {
    requestAnimationFrame(loop);
    if (!visible) return;
    const t = clock.getElapsedTime();
    smooth.lerp(mouse, 0.06);

    const sy = scrollY / Math.max(1, document.body.scrollHeight - innerHeight);
    world.rotation.y = smooth.x * 0.12;
    world.rotation.x = smooth.y * 0.06;
    world.position.y = sy * 3.0;

    interactables.forEach((obj) => {
      const u = obj.userData;
      obj.position.y = u.baseY + Math.sin(t * 1.6 + u.phase) * 0.28;
      if (u.spinBoost > 0) {
        u.spinBoost = Math.max(0, u.spinBoost - 0.025);
        obj.rotation.y += 0.28;
      } else {
        obj.rotation.y += 0.008;
      }
    });

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.position.x += p.userData.vx;
      p.position.y += p.userData.vy;
      p.position.z += p.userData.vz;
      p.rotation.y += 0.12;
      p.userData.life -= 0.022;
      p.scale.setScalar(Math.max(0.01, p.userData.life * 0.38));
      if (p.userData.life <= 0) {
        world.remove(p);
        particles.splice(i, 1);
      }
    }

    renderer.render(scene, camera);
  })();
}

/* =====================  FRAMELESS 3D HERO ROBOT  ===================== */
function setupHeroModel() {
  const host = $('#heroStage');
  if (!host) return;
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  host.appendChild(renderer.domElement);
  renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;touch-action:pan-y';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 1.3, 8.2);

  scene.add(new THREE.HemisphereLight(0xf2ceae, 0x1c2f4d, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.5); key.position.set(4, 6, 7); scene.add(key);
  const rimRose = new THREE.DirectionalLight(0xd48d91, 2.2); rimRose.position.set(-5, 3, -4); scene.add(rimRose);

  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.65, 0.1, 48),
    new THREE.MeshStandardMaterial({ color: PALETTE.prussian, roughness: 0.4, metalness: 0.2 })
  );
  disc.position.y = -1.72;
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.62, 0.035, 12, 64),
    new THREE.MeshBasicMaterial({ color: PALETTE.rose })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -1.66;
  scene.add(disc, ring);

  const pivot = new THREE.Group();
  scene.add(pivot);

  let model = null;
  let mixer = null;
  let rigParts = {};

  new GLTFLoader().load('assets/models/BossEnemy.glb', (gltf) => {
    model = gltf.scene;

    model.traverse((child) => {
      if (child.isMesh && child.material) {
        const matName = (child.material.name || '').toLowerCase();
        child.material = child.material.clone();
        if (matName.includes('002') || matName.includes('eye')) {
          child.material.color.set(PALETTE.pistachio);
          child.material.emissive = new THREE.Color(PALETTE.pistachio);
          child.material.emissiveIntensity = 0.55;
        } else if (matName.includes('003') || matName.includes('hand')) {
          child.material.color.set(PALETTE.rose);
        } else {
          child.material.color.set(PALETTE.dust);
        }
        child.material.roughness = 0.32;
        child.material.metalness = 0.15;
      }
    });

    model.rotation.y = -Math.PI / 2;
    model.updateMatrixWorld(true);

    const box = new THREE.Box3();
    model.traverse((child) => {
      if (child.isMesh) {
        child.geometry.computeBoundingBox();
        const meshBox = child.geometry.boundingBox.clone().applyMatrix4(child.matrixWorld);
        box.union(meshBox);
      }
    });

    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    const scale = 3.3 / maxDim;

    model.scale.setScalar(scale);
    model.position.set(
      -center.x * scale,
      -box.min.y * scale - 1.66,
      -center.z * scale
    );

    rigParts = {
      head: model.getObjectByName('Head'),
      armL: model.getObjectByName('Arm_l'),
      armR: model.getObjectByName('Arm_r'),
    };

    pivot.add(model);

    if (gltf.animations && gltf.animations.length) {
      mixer = new THREE.AnimationMixer(model);
      mixer.clipAction(gltf.animations[0]).play();
    }
  }, undefined, (err) => {
    console.warn('Could not load assets/models/BossEnemy.glb:', err);
  });

  let dragging = false, lastX = 0, targetY = 0, waveTimer = 0, spinTimer = 0;
  const el = renderer.domElement;
  el.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; el.setPointerCapture(e.pointerId); });
  el.addEventListener('pointerup', () => (dragging = false));
  el.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    targetY += (e.clientX - lastX) * 0.015;
    lastX = e.clientX;
  });
  el.addEventListener('click', () => {
    if (!dragging) { waveTimer = 1.0; window.triggerWorldBurst?.(new THREE.Vector3(2.5, 0, -2), 10); }
  });

  if ($('#waveBtn')) $('#waveBtn').onclick = () => { waveTimer = 1.2; };
  if ($('#spinBtn')) $('#spinBtn').onclick = () => { spinTimer = 1.0; targetY += Math.PI * 2; };
  if ($('#burstBtn')) $('#burstBtn').onclick = () => { window.triggerWorldBurst?.(new THREE.Vector3(0, 0.5, -2), 20); };

  const mouse = { x: 0, y: 0 };
  addEventListener('pointermove', (e) => {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = (e.clientY / innerHeight) * 2 - 1;
  });

  const resize = () => {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize(); addEventListener('resize', resize);

  const clock = new THREE.Clock(); let onScreen = true;
  new IntersectionObserver(([e]) => (onScreen = e.isIntersecting)).observe(host);

  (function loop() {
    requestAnimationFrame(loop);
    if (!onScreen || document.hidden) return;
    const dt = clock.getDelta(), t = clock.elapsedTime;
    mixer?.update(dt);

    if (!dragging && spinTimer <= 0) {
      targetY += (mouse.x * 0.45 - targetY) * 0.03;
    }
    if (spinTimer > 0) spinTimer = Math.max(0, spinTimer - 0.025);
    pivot.rotation.y += (targetY - pivot.rotation.y) * 0.1;

    if (waveTimer > 0) {
      waveTimer = Math.max(0, waveTimer - 0.025);
      pivot.position.y = Math.sin((1 - waveTimer) * Math.PI) * 0.35;
    } else {
      pivot.position.y = Math.sin(t * 2.2) * 0.05;
    }

    if (model && !mixer) {
      if (rigParts.head) {
        rigParts.head.rotation.y = mouse.x * 0.3;
        rigParts.head.rotation.x = mouse.y * 0.15;
      }
      if (rigParts.armL) rigParts.armL.rotation.x = Math.sin(t * 2.5) * 0.15;
      if (rigParts.armR) {
        rigParts.armR.rotation.x = waveTimer > 0
          ? -1.4 + Math.sin(t * 18) * 0.45
          : -Math.sin(t * 2.5) * 0.15;
      }
    }

    renderer.render(scene, camera);
  })();
}

/* =====================  CONTACT FORM  ===================== */
function setupContact() {
  const form = $('#contactForm'), status = $('#formStatus'), btn = $('#sendBtn');
  if (!form) return;
  $('#ts').value = Date.now();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const say = (msg, ok) => { status.textContent = msg; status.className = 'status ' + (ok ? 'ok' : 'err'); };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    form.querySelectorAll('input,textarea').forEach((i) => i.classList.remove('invalid'));
    const errs = [];
    if (d.name.trim().length < 2) errs.push('name');
    if (!emailRe.test(d.email.trim())) errs.push('email');
    if (d.subject.trim().length < 3) errs.push('subject');
    if (d.message.trim().length < 10) errs.push('message');
    if (errs.length) { errs.forEach((n) => form.elements[n].classList.add('invalid')); return say('Please complete all highlighted fields (minimum 10 characters for message).', false); }
    btn.disabled = true; say('Sending message...', true);
    try {
      const r = await fetch(`${API_BASE}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
      const j = await r.json().catch(() => ({}));
      if (r.status === 503) {
        const mailto = `mailto:${PROFILE.email}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(`From: ${d.name} (${d.email})\n\n${d.message}`)}`;
        window.location.href = mailto;
        say('Opening your email client to send directly to ' + PROFILE.email + '.', true);
        form.reset(); $('#ts').value = Date.now();
        return;
      }
      if (!r.ok) throw new Error(j.error || 'Something went wrong.');
      say('Message sent successfully. Thank you for reaching out.', true);
      form.reset(); $('#ts').value = Date.now();
    } catch (err) {
      say(err.message === 'Failed to fetch' ? 'Unable to reach the mail server. Please email ' + PROFILE.email + ' directly.' : err.message, false);
    } finally { btn.disabled = false; }
  });
}

/* =====================  BOOT  ===================== */
renderContent(); typedEffect(); setupUI(); setupContact();
try { setupBackground(); setupHeroModel(); } catch (e) { console.warn('WebGL unavailable', e); }
addEventListener('load', () => setTimeout(() => $('#loader').classList.add('done'), 400));