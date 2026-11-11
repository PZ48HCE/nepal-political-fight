/**
 * Nepal Political Fight - 3D Arena & Environment
 * Modeled after Kathmandu's historic Durbar Square / Singha Durbar courtyard
 * featuring traditional pagoda architecture, carved wooden pillars,
 * fluttering Buddhist prayer flags (Lungta), and Himalayan mountain peaks.
 */

import * as THREE from '../assets/three.module.js';

export class Arena {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'nepal-arena';
    this.scene.add(this.group);

    this.prayerFlags = [];
    this.time = 0;

    this.buildStage();
    this.buildPrayerFlags();
    this.buildHimalayas();
    this.setupLighting();
  }

  buildStage() {
    // 1. Main Fight Floor (Paved Stone / Terracotta courtyard)
    const floorGeo = new THREE.BoxGeometry(22, 1.0, 10);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1f232d,
      roughness: 0.85,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -0.5, 0);
    floor.receiveShadow = true;
    this.group.add(floor);

    // Arena Platform Red Border (Traditional Nepali Brick / Timber trim)
    const borderMat = new THREE.MeshStandardMaterial({ color: 0x8b2522, roughness: 0.7 });
    const borderGeo = new THREE.BoxGeometry(20, 0.08, 0.4);
    const frontBorder = new THREE.Mesh(borderGeo, borderMat);
    frontBorder.position.set(0, 0.04, 2.2);
    this.group.add(frontBorder);

    const backBorder = new THREE.Mesh(borderGeo, borderMat);
    backBorder.position.set(0, 0.04, -2.2);
    this.group.add(backBorder);

    // Decorative Center Ring (Circle Emblem with Nepali sun/moon motif)
    const ringGeo = new THREE.RingGeometry(1.6, 1.75, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xd4af37, side: THREE.DoubleSide });
    const centerRing = new THREE.Mesh(ringGeo, ringMat);
    centerRing.rotation.x = -Math.PI / 2;
    centerRing.position.set(0, 0.015, 0);
    this.group.add(centerRing);

    // Subtle fight bounds markings (-6.5 to +6.5)
    for (const x of [-6.5, 6.5]) {
      const lineGeo = new THREE.PlaneGeometry(0.12, 4.0);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0xff3b30, transparent: true, opacity: 0.6 });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(x, 0.015, 0);
      this.group.add(line);
    }

    // 2. Pagoda Columns & Temple Architecture (Left & Right Flanks)
    this.buildTemplePillars(-8.5);
    this.buildTemplePillars(8.5);
  }

  buildTemplePillars(xPos) {
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.85 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffc53d, roughness: 0.3, metalness: 0.7 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x993d2e, roughness: 0.6 });

    // Main Pillar Column
    const pillarGeo = new THREE.BoxGeometry(0.55, 4.8, 0.55);
    const pillar = new THREE.Mesh(pillarGeo, woodMat);
    pillar.position.set(xPos, 2.4, -0.8);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    this.group.add(pillar);

    // Stone Base
    const baseGeo = new THREE.BoxGeometry(1.1, 0.6, 1.1);
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x4a4f5c, roughness: 0.9 });
    const base = new THREE.Mesh(baseGeo, stoneMat);
    base.position.set(xPos, 0.3, -0.8);
    base.castShadow = true;
    this.group.add(base);

    // Carved Capital (Newari Tudal bracket)
    const capGeo = new THREE.BoxGeometry(1.4, 0.3, 0.9);
    const cap = new THREE.Mesh(capGeo, woodMat);
    cap.position.set(xPos, 4.8, -0.8);
    this.group.add(cap);

    // Pagoda Eave Roof overhang
    const roofGeo = new THREE.ConeGeometry(1.6, 0.9, 4);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.set(xPos, 5.4, -0.8);
    roof.castShadow = true;
    this.group.add(roof);

    // Golden Finial (Gajur) on top
    const gajurGeo = new THREE.ConeGeometry(0.18, 0.65, 8);
    const gajur = new THREE.Mesh(gajurGeo, goldMat);
    gajur.position.set(xPos, 6.1, -0.8);
    this.group.add(gajur);

    // Hanging Brass Bell (Ghanti)
    const bellGeo = new THREE.CylinderGeometry(0.08, 0.22, 0.3, 12);
    const bell = new THREE.Mesh(bellGeo, goldMat);
    bell.position.set(xPos + (xPos > 0 ? -0.7 : 0.7), 4.3, -0.8);
    this.group.add(bell);
  }

  buildPrayerFlags() {
    // 5 Traditional Buddhist Prayer Flag Colors:
    // Blue (Sky), White (Air), Red (Fire), Green (Water), Yellow (Earth)
    const colors = [0x2563eb, 0xf8fafc, 0xdc2626, 0x16a34a, 0xeab308];
    const flagGeo = new THREE.PlaneGeometry(0.38, 0.48);

    const flagCount = 38;
    const startX = -8.2;
    const endX = 8.2;
    const startY = 4.7;
    const endY = 4.7;

    for (let i = 0; i < flagCount; i++) {
      const t = i / (flagCount - 1);
      const x = THREE.MathUtils.lerp(startX, endX, t);
      // Catenary sag curve
      const sag = Math.sin(t * Math.PI) * 1.1;
      const y = startY - sag;

      const mat = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        side: THREE.DoubleSide,
        roughness: 0.8,
        transparent: true,
        opacity: 0.92
      });

      const flag = new THREE.Mesh(flagGeo, mat);
      flag.position.set(x, y - 0.24, -1.8 + Math.sin(t * Math.PI * 2) * 0.2);
      this.group.add(flag);

      this.prayerFlags.push({
        mesh: flag,
        baseY: y - 0.24,
        phase: i * 0.38
      });
    }

    // Flag Rope Line
    const curvePoints = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      const x = THREE.MathUtils.lerp(startX, endX, t);
      const y = startY - Math.sin(t * Math.PI) * 1.1;
      curvePoints.push(new THREE.Vector3(x, y, -1.8));
    }
    const ropeCurve = new THREE.CatmullRomCurve3(curvePoints);
    const ropeGeo = new THREE.TubeGeometry(ropeCurve, 40, 0.015, 6, false);
    const ropeMat = new THREE.MeshBasicMaterial({ color: 0x475569 });
    const rope = new THREE.Mesh(ropeGeo, ropeMat);
    this.group.add(rope);
  }

  buildHimalayas() {
    // Backdrop mountain silhouette (Himalayan snow peaks)
    const mtGroup = new THREE.Group();
    mtGroup.position.set(0, -1.0, -18);

    // Layer 1: Distant snow peaks
    const peakColors = [0xe2e8f0, 0xcfd8dc, 0x90a4ae];
    for (let i = -7; i <= 7; i++) {
      const height = 9 + Math.abs(Math.sin(i * 1.7)) * 7;
      const width = 6.5 + Math.random() * 4.0;
      const geo = new THREE.ConeGeometry(width, height, 5);
      const mat = new THREE.MeshStandardMaterial({
        color: peakColors[Math.abs(i) % peakColors.length],
        roughness: 0.9,
        flatShading: true
      });
      const peak = new THREE.Mesh(geo, mat);
      peak.position.set(i * 3.8 + (Math.random() - 0.5) * 1.5, height * 0.5, -2 + Math.random() * 3);
      peak.rotation.y = Math.random() * Math.PI;
      mtGroup.add(peak);
    }

    // Layer 2: Sunset horizon gradient backdrop
    const skyGeo = new THREE.PlaneGeometry(60, 30);
    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 128;
    skyCanvas.height = 256;
    const ctx = skyCanvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#0c1021'); // Deep navy night sky
    grad.addColorStop(0.55, '#3b1c32'); // Twilight plum
    grad.addColorStop(0.85, '#bf360c'); // Radiant Himalayan sunset orange
    grad.addColorStop(1, '#ff8a65'); // Warm golden horizon glow
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 256);

    const skyTex = new THREE.CanvasTexture(skyCanvas);
    const skyMat = new THREE.MeshBasicMaterial({ map: skyTex });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    sky.position.set(0, 10, -26);
    this.group.add(sky);
    this.group.add(mtGroup);
  }

  setupLighting() {
    // Ambient light
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambient);

    // Directional Key Sunlight (Dramatic Sunset Rim)
    const sun = new THREE.DirectionalLight(0xffecd2, 1.4);
    sun.position.set(5, 9, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 25;
    sun.shadow.camera.left = -9;
    sun.shadow.camera.right = 9;
    sun.shadow.camera.top = 7;
    sun.shadow.camera.bottom = -2;
    sun.shadow.bias = -0.001;
    this.scene.add(sun);

    // Cyan/Blue fill light for crisp arcade shadows
    const fill = new THREE.DirectionalLight(0x60a5fa, 0.6);
    fill.position.set(-8, 5, 4);
    this.scene.add(fill);

    // Dynamic Arena Center Spotlight
    this.spotlight = new THREE.SpotLight(0xffffff, 1.8, 20, Math.PI / 4, 0.4);
    this.spotlight.position.set(0, 8.5, 3.5);
    this.spotlight.target.position.set(0, 1.0, 0);
    this.scene.add(this.spotlight);
    this.scene.add(this.spotlight.target);
  }

  // Update fluttering prayer flags with gentle breeze wave
  update(delta) {
    this.time += delta;
    for (const flag of this.prayerFlags) {
      const wave = Math.sin(this.time * 4.2 + flag.phase);
      const flutter = Math.cos(this.time * 6.5 + flag.phase * 1.5) * 0.15;
      flag.mesh.rotation.x = wave * 0.28 + flutter;
      flag.mesh.rotation.y = Math.sin(this.time * 2.8 + flag.phase) * 0.12;
      flag.mesh.position.y = flag.baseY + Math.sin(this.time * 3.5 + flag.phase) * 0.04;
    }
  }
}
