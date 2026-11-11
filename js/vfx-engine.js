/**
 * Nepal Political Fight - Visual Effects & Particle Engine
 * Handles screen trauma shake, hit stop, 3D sparks, shockwaves,
 * dust clouds, money rain, and comic impact typography.
 */

import * as THREE from '../assets/three.module.js';

export class VFXEngine {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.initialCameraPos = new THREE.Vector3(0, 2.2, 5.8);

    // Screen Shake Trauma
    this.trauma = 0;
    this.shakeDecay = 1.6;
    this.maxShakeOffset = 0.28;
    this.maxShakeAngle = 0.05;

    // Hit Stop (Frame Freeze)
    this.hitStopTimer = 0;

    // 3D Particles
    this.particles = [];
    this.particleGroup = new THREE.Group();
    this.particleGroup.name = 'vfx-particles';
    this.scene.add(this.particleGroup);

    // Shared Geometries & Materials
    this.sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array([
      -0.08, 0, 0,  0.08, 0, 0,
      0, -0.08, 0,  0, 0.08, 0
    ]);
    this.sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    this.sparkMat = new THREE.LineBasicMaterial({ color: 0xffd23d, transparent: true, opacity: 0.9 });

    this.ringGeo = new THREE.RingGeometry(0.1, 0.16, 24);
    this.ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });

    this.dustGeo = new THREE.SphereGeometry(0.12, 6, 6);
    this.dustMat = new THREE.MeshBasicMaterial({ color: 0x9e988b, transparent: true, opacity: 0.5 });

    // 2D Comic Impact Overlay Container
    this.initOverlay();
  }

  initOverlay() {
    let overlay = document.getElementById('vfx-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'vfx-overlay';
      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
        z-index: 80;
      `;
      document.body.appendChild(overlay);
    }
    this.overlay = overlay;
  }

  // Add trauma for screen shake
  addTrauma(amount) {
    this.trauma = Math.min(1.0, this.trauma + amount);
  }

  // Trigger hit stop (freeze frame for micro-seconds)
  triggerHitStop(durationMs) {
    this.hitStopTimer = durationMs / 1000;
  }

  isFrozen() {
    return this.hitStopTimer > 0;
  }

  // Create 3D Hit Sparks at strike location
  createHitSparks(position, direction = 1, isHeavy = false) {
    const count = isHeavy ? 18 : 10;
    const color = isHeavy ? 0xff3b30 : 0xffcc00;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI / 4) * (Math.random() - 0.5) + (direction > 0 ? 0 : Math.PI);
      const speed = (isHeavy ? 4.5 : 3.0) * (0.6 + Math.random() * 0.8);
      const vel = new THREE.Vector3(
        Math.cos(angle) * speed,
        (Math.random() * 2.5 - 0.5),
        (Math.random() - 0.5) * 1.5
      );

      const mat = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 1.0,
        linewidth: 2
      });
      const spark = new THREE.LineSegments(this.sparkGeo, mat);
      spark.position.copy(position);
      spark.scale.setScalar(0.7 + Math.random() * 0.8);

      this.particleGroup.add(spark);
      this.particles.push({
        mesh: spark,
        vel: vel,
        gravity: -7.0,
        life: 1.0,
        decay: 3.5 + Math.random() * 2.0,
        type: 'spark'
      });
    }

    // Shockwave expansion ring
    const ringMat = this.ringMat.clone();
    ringMat.color.setHex(isHeavy ? 0xff4d4d : 0xffffff);
    const ring = new THREE.Mesh(this.ringGeo, ringMat);
    ring.position.copy(position);
    ring.rotation.y = Math.PI / 2;
    this.particleGroup.add(ring);
    this.particles.push({
      mesh: ring,
      vel: new THREE.Vector3(0, 0, 0),
      life: 1.0,
      decay: 4.5,
      type: 'ring'
    });

    // Screen Shake
    this.addTrauma(isHeavy ? 0.35 : 0.15);
  }

  // Dust cloud at feet on jump/landing/dash
  createDust(position, count = 5) {
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(this.dustGeo, this.dustMat.clone());
      mesh.position.set(
        position.x + (Math.random() - 0.5) * 0.4,
        0.08,
        position.z + (Math.random() - 0.5) * 0.3
      );
      const scale = 0.5 + Math.random() * 0.7;
      mesh.scale.setScalar(scale);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 1.2,
        0.5 + Math.random() * 0.8,
        (Math.random() - 0.5) * 0.8
      );

      this.particleGroup.add(mesh);
      this.particles.push({
        mesh: mesh,
        vel: vel,
        life: 1.0,
        decay: 2.2,
        type: 'dust'
      });
    }
  }

  // Money bill fountain for Ashika's super or critical hits
  createMoneyRain(position, count = 25) {
    const billGeo = new THREE.PlaneGeometry(0.35, 0.18);
    const billMat = new THREE.MeshBasicMaterial({
      color: 0x48bb78,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(billGeo, billMat.clone());
      mesh.position.set(
        position.x + (Math.random() - 0.5) * 2.0,
        position.y + 1.5 + Math.random() * 2.5,
        position.z + (Math.random() - 0.5) * 1.5
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 2.5,
        -1.0 - Math.random() * 2.0,
        (Math.random() - 0.5) * 2.0
      );
      const rotSpeed = new THREE.Vector3(
        Math.random() * 8 - 4,
        Math.random() * 8 - 4,
        Math.random() * 8 - 4
      );

      this.particleGroup.add(mesh);
      this.particles.push({
        mesh: mesh,
        vel: vel,
        rotSpeed: rotSpeed,
        life: 1.0,
        decay: 0.65,
        type: 'money'
      });
    }
  }

  // Debris & Rocks for Harka / Balen Super
  createDebris(position, count = 15) {
    const rockGeo = new THREE.DodecahedronGeometry(0.12);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x6e6b66, roughness: 0.9 });

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(rockGeo, rockMat);
      mesh.position.copy(position);
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 4.5,
        2.5 + Math.random() * 3.5,
        (Math.random() - 0.5) * 3.0
      );

      this.particleGroup.add(mesh);
      this.particles.push({
        mesh: mesh,
        vel: vel,
        gravity: -9.8,
        life: 1.0,
        decay: 1.0,
        type: 'rock'
      });
    }
  }

  // Comic text badges popups on screen in screen coordinates
  showComicText(worldPos, text, type = 'normal') {
    if (!this.overlay) return;

    // Convert 3D world pos to screen coordinates
    const v = worldPos.clone().project(this.camera);
    const x = (v.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-(v.y * 0.5) + 0.5) * window.innerHeight;

    const el = document.createElement('div');
    el.className = `comic-text comic-${type}`;
    el.textContent = text;

    const angle = (Math.random() * 24 - 12);
    el.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -50%) rotate(${angle}deg) scale(0.6);
      font-family: var(--display, 'Barlow Condensed', sans-serif);
      font-weight: 900;
      font-style: italic;
      text-transform: uppercase;
      font-size: ${type === 'heavy' || type === 'super' ? '2.4rem' : '1.7rem'};
      color: ${type === 'heavy' ? '#ff3d50' : type === 'super' ? '#ffc53d' : '#ffffff'};
      text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 4px 12px rgba(0,0,0,0.8);
      pointer-events: none;
      z-index: 100;
      transition: transform 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity 0.35s ease-out;
      opacity: 1;
    `;

    this.overlay.appendChild(el);

    // Trigger animate pop
    requestAnimationFrame(() => {
      el.style.transform = `translate(-50%, -120%) rotate(${angle * 1.5}deg) scale(1.15)`;
    });

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = `translate(-50%, -160%) rotate(${angle * 2}deg) scale(1.3)`;
      setTimeout(() => {
        el.remove();
      }, 400);
    }, 450);
  }

  // Update screen shake, freeze frame, and 3D particles
  update(delta) {
    // 1. Hit Stop Countdown
    if (this.hitStopTimer > 0) {
      this.hitStopTimer -= delta;
      if (this.hitStopTimer < 0) this.hitStopTimer = 0;
    }

    // 2. Screen Shake Trauma Update
    if (this.trauma > 0) {
      this.trauma = Math.max(0, this.trauma - delta * this.shakeDecay);
      const shakePower = this.trauma * this.trauma;

      const offsetX = (Math.random() * 2 - 1) * this.maxShakeOffset * shakePower;
      const offsetY = (Math.random() * 2 - 1) * this.maxShakeOffset * shakePower;
      const angle = (Math.random() * 2 - 1) * this.maxShakeAngle * shakePower;

      this.camera.position.x = this.initialCameraPos.x + offsetX;
      this.camera.position.y = this.initialCameraPos.y + offsetY;
      this.camera.rotation.z = angle;
    } else {
      this.camera.position.x = this.initialCameraPos.x;
      this.camera.position.y = this.initialCameraPos.y;
      this.camera.rotation.z = 0;
    }

    // 3. 3D Particles Update
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= delta * p.decay;

      if (p.life <= 0) {
        this.particleGroup.remove(p.mesh);
        this.particles.splice(i, 1);
        continue;
      }

      // Physics
      if (p.gravity) {
        p.vel.y += p.gravity * delta;
      }
      p.mesh.position.addScaledVector(p.vel, delta);

      // Rotations
      if (p.rotSpeed) {
        p.mesh.rotation.x += p.rotSpeed.x * delta;
        p.mesh.rotation.y += p.rotSpeed.y * delta;
        p.mesh.rotation.z += p.rotSpeed.z * delta;
      }

      // Scaling & Fading
      if (p.type === 'ring') {
        const scale = 1.0 + (1.0 - p.life) * 3.5;
        p.mesh.scale.set(scale, scale, scale);
        p.mesh.material.opacity = p.life * 0.9;
      } else if (p.type === 'dust') {
        const scale = (1.0 - p.life * 0.5) * 1.6;
        p.mesh.scale.set(scale, scale, scale);
        p.mesh.material.opacity = p.life * 0.5;
      } else if (p.type === 'spark') {
        p.mesh.material.opacity = p.life;
      } else if (p.type === 'money') {
        p.mesh.material.opacity = Math.min(1.0, p.life * 1.5);
      }
    }
  }
}
