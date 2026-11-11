/**
 * Nepal Political Fight - 3D Cinematic Super Moves
 * Contains procedural 3D models and animation cutscenes for:
 * 1. Balen: DOZER SHAKTI (Giant Kathmandu Excavator Bulldozer)
 * 2. KP: JAHAJ SHAKTI (Pani Jahaj / Bullet Train on river waves)
 * 3. Harka: SHRAM SHAKTI (Mountain Shramdaan & Dharan Water Pipeline)
 * 4. Ashika: DHAN SHAKTI (Nepali Rupee Currency Tornado & Gold Coins)
 * 5. Rabi: GHANTI SHAKTI (Golden Bell & Supersonic Shockwaves)
 */

import * as THREE from '../assets/three.module.js';

export class SuperMoveController {
  constructor(scene, vfx, sound) {
    this.scene = scene;
    this.vfx = vfx;
    this.sound = sound;

    this.activeSuper = null;
    this.superGroup = new THREE.Group();
    this.superGroup.name = 'super-move-entities';
    this.scene.add(this.superGroup);

    this.bannerEl = null;
    this.initBannerDOM();

    // Build reusable 3D assets for supers
    this.buildDozerMesh();
    this.buildJahajMesh();
    this.buildMountainMesh();
    this.buildMoneyTornadoMesh();
  }

  initBannerDOM() {
    let banner = document.getElementById('super-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'super-banner';
      banner.className = 'super-cinematic-banner';
      banner.innerHTML = `
        <div class="banner-inner">
          <div class="banner-portrait-wrap">
            <img id="banner-portrait" src="" alt="Fighter" />
          </div>
          <div class="banner-text">
            <span id="banner-owner" class="banner-owner">BALEN'S SUPER</span>
            <strong id="banner-name" class="banner-name">DOZER SHAKTI</strong>
            <p id="banner-quote" class="banner-quote">"Garxa garxa Balen le garxa!"</p>
          </div>
        </div>
      `;
      document.body.appendChild(banner);
    }
    this.bannerEl = banner;
  }

  // 1. BALEN: 3D EXCAVATOR BULLDOZER
  buildDozerMesh() {
    const dozer = new THREE.Group();
    dozer.name = 'dozer-entity';
    dozer.visible = false;

    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.45, metalness: 0.2 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.7, metalness: 0.6 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, transparent: true, opacity: 0.6 });

    // Chassis body
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.2, 2.0), yellowMat);
    body.position.set(0, 1.2, 0);
    body.castShadow = true;
    dozer.add(body);

    // Operator Cabin
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.3, 1.6), darkMat);
    cabin.position.set(-0.6, 2.3, 0);
    cabin.castShadow = true;
    dozer.add(cabin);

    // Cabin Windows
    const win = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.7, 1.62), glassMat);
    win.position.set(-0.6, 2.45, 0);
    dozer.add(win);

    // Twin Caterpillar Crawler Tracks (Left & Right)
    [-1.2, 1.2].forEach(z => {
      const track = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.7, 0.45), darkMat);
      track.position.set(0, 0.4, z);
      track.castShadow = true;
      dozer.add(track);

      // Track Wheels
      for (let x = -1.4; x <= 1.4; x += 0.7) {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.48, 12), metalMat);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(x, 0.38, z);
        dozer.add(wheel);
      }
    });

    // Hydraulic Boom Arm & Scoop Bucket
    const boomGroup = new THREE.Group();
    boomGroup.position.set(1.4, 1.4, 0);

    const boomArm = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 0.35), yellowMat);
    boomArm.position.set(1.0, 0.7, 0);
    boomArm.rotation.z = 0.4;
    boomGroup.add(boomArm);

    // Excavator Scoop Bucket
    const bucket = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 1.5), metalMat);
    bucket.position.set(2.2, 0.3, 0);
    bucket.castShadow = true;
    boomGroup.add(bucket);

    dozer.add(boomGroup);
    dozer.userData.boomGroup = boomGroup;

    // Headlight Beams
    const light = new THREE.SpotLight(0xffedd5, 3.5, 12, Math.PI / 5, 0.3);
    light.position.set(1.9, 1.3, 0);
    light.target.position.set(6.0, 0.5, 0);
    dozer.add(light);
    dozer.add(light.target);

    this.superGroup.add(dozer);
    this.dozer = dozer;
  }

  // 2. KP OLI: 3D PANI JAHAJ (STEAMSHIP / BULLET TRAIN)
  buildJahajMesh() {
    const jahaj = new THREE.Group();
    jahaj.name = 'jahaj-entity';
    jahaj.visible = false;

    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });

    // Ship Hull / Train Body
    const hull = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.1, 1.8), whiteMat);
    hull.position.set(0, 0.85, 0);
    hull.castShadow = true;
    jahaj.add(hull);

    // Red Keel stripe
    const keel = new THREE.Mesh(new THREE.BoxGeometry(4.85, 0.3, 1.85), redMat);
    keel.position.set(0, 0.3, 0);
    jahaj.add(keel);

    // Pointed Ship Bow / Streamlined Bullet Nose
    const bow = new THREE.Mesh(new THREE.ConeGeometry(1.0, 1.6, 4), whiteMat);
    bow.rotation.z = -Math.PI / 2;
    bow.rotation.y = Math.PI / 4;
    bow.position.set(3.1, 0.85, 0);
    jahaj.add(bow);

    // Twin Smokestacks / Exhaust Funnels
    [-0.4, 0.8].forEach(x => {
      const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.8, 12), redMat);
      funnel.position.set(x, 1.8, 0);
      jahaj.add(funnel);
    });

    // Nepali Double-Triangle Flag on the Mast!
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4, 6), darkMat);
    mast.position.set(-1.4, 2.0, 0);
    jahaj.add(mast);

    const flagGeo = new THREE.BufferGeometry();
    const flagPos = new Float32Array([
      0, 0.5, 0,   0.5, 0.3, 0,   0, 0.1, 0,   // Upper triangle
      0, 0.1, 0,   0.5, -0.1, 0,  0, -0.3, 0   // Lower triangle
    ]);
    flagGeo.setAttribute('position', new THREE.BufferAttribute(flagPos, 3));
    const flagMat = new THREE.MeshBasicMaterial({ color: 0xdc2626, side: THREE.DoubleSide });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(-1.4, 2.0, 0.02);
    jahaj.add(flag);

    // Frothing Water Waves below ship
    const waveGeo = new THREE.PlaneGeometry(5.4, 2.6, 12, 6);
    const waveMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      transparent: true,
      opacity: 0.75
    });
    const waves = new THREE.Mesh(waveGeo, waveMat);
    waves.rotation.x = -Math.PI / 2;
    waves.position.set(0, 0.1, 0);
    jahaj.add(waves);

    this.superGroup.add(jahaj);
    this.jahaj = jahaj;
  }

  // 3. HARKA: MOUNTAIN & WATER PIPELINE
  buildMountainMesh() {
    const mountain = new THREE.Group();
    mountain.name = 'mountain-entity';
    mountain.visible = false;

    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.95,
      flatShading: true
    });
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.6, roughness: 0.3 });

    // Rocky Mountain Peak Rising
    const peakGeo = new THREE.ConeGeometry(2.4, 4.2, 7);
    const peak = new THREE.Mesh(peakGeo, rockMat);
    peak.position.set(0, 2.1, 0);
    peak.castShadow = true;
    mountain.add(peak);

    // Dharan Black & Blue Poly Drinking Water Pipes winding down
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 3.8, 0.6),
      new THREE.Vector3(0.8, 2.6, 1.1),
      new THREE.Vector3(-0.4, 1.4, 1.4),
      new THREE.Vector3(1.2, 0.3, 1.8)
    ]);
    const pipeGeo = new THREE.TubeGeometry(curve, 30, 0.09, 8, false);
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    mountain.add(pipe);

    // Water Splash Jets at pipe outlet
    const jetGeo = new THREE.ConeGeometry(0.4, 1.6, 8);
    const jetMat = new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.8 });
    const jet = new THREE.Mesh(jetGeo, jetMat);
    jet.position.set(1.4, 0.5, 2.0);
    jet.rotation.x = Math.PI / 3;
    mountain.add(jet);
    mountain.userData.jet = jet;

    this.superGroup.add(mountain);
    this.mountain = mountain;
  }

  // 4. ASHIKA: MONEY TORNADO
  buildMoneyTornadoMesh() {
    const tornado = new THREE.Group();
    tornado.name = 'money-tornado';
    tornado.visible = false;

    // Banknote instanced mesh
    const noteGeo = new THREE.PlaneGeometry(0.45, 0.22);
    const noteMat = new THREE.MeshBasicMaterial({
      color: 0x86efac,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });

    const count = 45;
    const instancedNotes = new THREE.InstancedMesh(noteGeo, noteMat, count);
    const dummy = new THREE.Object3D();

    tornado.userData.noteData = [];
    for (let i = 0; i < count; i++) {
      const height = (i / count) * 4.5;
      const radius = 0.6 + (i / count) * 1.6;
      const angle = (i * 0.75);

      dummy.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      dummy.updateMatrix();
      instancedNotes.setMatrixAt(i, dummy.matrix);

      tornado.userData.noteData.push({
        radius,
        height,
        angle,
        speed: 4.0 + Math.random() * 2.0
      });
    }
    instancedNotes.instanceMatrix.needsUpdate = true;
    tornado.add(instancedNotes);
    tornado.userData.instancedNotes = instancedNotes;
    tornado.userData.dummy = dummy;

    this.superGroup.add(tornado);
    this.tornado = tornado;
  }

  // Trigger super move execution
  triggerSuper(actor, victim, onHitCallback) {
    if (this.activeSuper) return false;

    const charKey = actor.char.id;
    const dir = actor.root.position.x < victim.root.position.x ? 1 : -1;

    this.activeSuper = {
      actor,
      victim,
      charKey,
      dir,
      time: 0,
      duration: 3.2,
      hitDone: false,
      onHit: onHitCallback
    };

    // 1. Play Audio & Voice
    this.sound.playSuperActivate(charKey);

    // 2. Show Cinematic UI Banner
    this.showBanner(actor.char);

    // 3. Freeze & Position Super Entity
    if (charKey === 'balen') {
      this.dozer.visible = true;
      this.dozer.position.set(actor.root.position.x - dir * 5.0, 0, 0);
      this.dozer.rotation.y = dir === 1 ? 0 : Math.PI;

    } else if (charKey === 'kp') {
      this.jahaj.visible = true;
      this.jahaj.position.set(actor.root.position.x - dir * 6.5, 0, 0);
      this.jahaj.rotation.y = dir === 1 ? 0 : Math.PI;

    } else if (charKey === 'harka') {
      this.mountain.visible = true;
      this.mountain.position.set(victim.root.position.x, -4.5, 0); // Rises from underground

    } else if (charKey === 'ashika') {
      this.tornado.visible = true;
      this.tornado.position.set(victim.root.position.x, 0, 0);

    } else if (charKey === 'rabi') {
      // Rabi: Shockwave burst
      this.vfx.createHitSparks(victim.root.position, dir, true);
    }

    return true;
  }

  showBanner(char) {
    if (!this.bannerEl) return;

    const img = document.getElementById('banner-portrait');
    const owner = document.getElementById('banner-owner');
    const name = document.getElementById('banner-name');
    const quote = document.getElementById('banner-quote');

    if (img) img.src = char.portrait;
    if (owner) owner.textContent = `${char.name}'S SUPER`;
    if (name) name.textContent = char.superName;
    if (quote) quote.textContent = `"${char.quote}"`;

    this.bannerEl.style.setProperty('--banner-accent', char.color);
    this.bannerEl.classList.add('visible');

    setTimeout(() => {
      this.bannerEl.classList.remove('visible');
    }, 1800);
  }

  update(delta) {
    if (!this.activeSuper) return;

    const s = this.activeSuper;
    s.time += delta;

    // 1. DOZER ANIMATION
    if (s.charKey === 'balen') {
      const t = s.time;
      if (t < 2.0) {
        // Bulldozer charges forward toward victim
        const targetX = s.victim.root.position.x;
        s.actor.root.position.x += s.dir * delta * 1.5;
        this.dozer.position.x += s.dir * delta * 5.5;

        // Boom arm raises then slams
        if (this.dozer.userData.boomGroup) {
          const arm = this.dozer.userData.boomGroup;
          arm.rotation.z = Math.sin(t * 3.5) * 0.4;
        }

        // Check impact
        if (!s.hitDone && Math.abs(this.dozer.position.x - targetX) < 1.2) {
          s.hitDone = true;
          this.vfx.createHitSparks(s.victim.root.position, s.dir, true);
          this.vfx.createDebris(s.victim.root.position, 20);
          this.vfx.showComicText(s.victim.root.position, 'DOZER SMASH!', 'super');
          this.sound.playHit('heavy');
          if (s.onHit) s.onHit(38);
        }
      }
    }

    // 2. JAHAJ ANIMATION
    else if (s.charKey === 'kp') {
      const t = s.time;
      if (t < 2.2) {
        // Steamship surges across stage with speed
        this.jahaj.position.x += s.dir * delta * 7.5;
        this.jahaj.position.y = Math.sin(t * 8) * 0.08;

        // Impact
        if (!s.hitDone && Math.abs(this.jahaj.position.x - s.victim.root.position.x) < 1.5) {
          s.hitDone = true;
          this.vfx.createHitSparks(s.victim.root.position, s.dir, true);
          this.vfx.createDust(s.victim.root.position, 12);
          this.vfx.showComicText(s.victim.root.position, 'PANI JAHAJ!', 'super');
          this.sound.playHit('uppercut');
          if (s.onHit) s.onHit(38);
        }
      }
    }

    // 3. HARKA MOUNTAIN ANIMATION
    else if (s.charKey === 'harka') {
      const t = s.time;
      if (t < 1.0) {
        // Mountain rises out of the ground
        this.mountain.position.y = THREE.MathUtils.lerp(-4.5, 0, t / 1.0);
      } else if (t < 2.2) {
        // Water jet bursts
        if (!s.hitDone) {
          s.hitDone = true;
          this.vfx.createDebris(s.victim.root.position, 25);
          this.vfx.createHitSparks(s.victim.root.position, s.dir, true);
          this.vfx.showComicText(s.victim.root.position, 'SHRAMDAAN!', 'super');
          this.sound.playHit('heavy');
          if (s.onHit) s.onHit(38);
        }
      }
    }

    // 4. ASHIKA MONEY TORNADO ANIMATION
    else if (s.charKey === 'ashika') {
      const t = s.time;
      const notes = this.tornado.userData.instancedNotes;
      const dummy = this.tornado.userData.dummy;
      const data = this.tornado.userData.noteData;

      if (notes && data) {
        for (let i = 0; i < data.length; i++) {
          data[i].angle += delta * data[i].speed;
          const r = data[i].radius;
          const h = data[i].height;
          const a = data[i].angle;

          dummy.position.set(Math.cos(a) * r, h, Math.sin(a) * r);
          dummy.rotation.set(a * 2, a * 3, 0);
          dummy.updateMatrix();
          notes.setMatrixAt(i, dummy.matrix);
        }
        notes.instanceMatrix.needsUpdate = true;
      }

      // Money shower
      if (t > 0.6 && !s.hitDone) {
        s.hitDone = true;
        this.vfx.createMoneyRain(s.victim.root.position, 35);
        this.vfx.createHitSparks(s.victim.root.position, s.dir, true);
        this.vfx.showComicText(s.victim.root.position, 'DHAN TORNADO!', 'super');
        this.sound.playHit('heavy');
        if (s.onHit) s.onHit(38);
      }
    }

    // End super after duration
    if (s.time >= s.duration) {
      this.cleanup();
    }
  }

  cleanup() {
    if (this.dozer) this.dozer.visible = false;
    if (this.jahaj) this.jahaj.visible = false;
    if (this.mountain) this.mountain.visible = false;
    if (this.tornado) this.tornado.visible = false;
    this.activeSuper = null;
  }
}
