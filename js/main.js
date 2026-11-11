/**
 * Nepal Political Fight - Main Game Orchestrator
 * Connects 3D rendering, fighters, arena, audio, visual effects,
 * input handling, game modes, and user interface.
 */

import * as THREE from '../assets/three.module.js';
import { CHARACTERS, buildCharacterModel } from './characters.js';
import { Arena } from './arena.js';
import { Fighter } from './combat.js';
import { VFXEngine } from './vfx-engine.js';
import { sound } from './sound-engine.js';
import { SuperMoveController } from './super-moves.js';
import { AIController } from './ai.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('game');
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Game Mode & Selection
    this.mode = 'cpu'; // 'cpu', 'pvp', 'ladder', 'training'
    this.p1CharKey = 'balen';
    this.p2CharKey = 'kp';
    this.difficulty = 'normal';

    // Ladder Mode tracking
    this.ladderRoster = ['kp', 'harka', 'ashika', 'rabi'];
    this.ladderIndex = 0;

    // Match & Round State
    this.gameState = 'menu'; // 'menu', 'intro', 'fighting', 'super', 'roundOver', 'matchOver', 'paused'
    this.roundNumber = 1;
    this.maxRounds = 2; // Best of 3 (first to 2 wins)
    this.roundTime = 60;
    this.timerInterval = null;

    // Setup Three.js Engine
    this.initThree();

    // Setup Game Systems
    this.arena = new Arena(this.scene);
    this.vfx = new VFXEngine(this.scene, this.camera);
    this.superMoves = new SuperMoveController(this.scene, this.vfx, sound);

    // Fighter Entities
    this.p1 = null;
    this.p2 = null;
    this.ai = null;

    // Input States
    this.keys = {};
    this.touchStick = { active: false, startX: 0, startY: 0, curX: 0, curY: 0 };

    // Setup Previews & UI
    this.initUI();
    this.initInputs();
    this.initTouchControls();
    this.setupCharacterPreviews();

    // Window Resize
    window.addEventListener('resize', () => this.onResize());

    // Game Loop
    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0c1021, 0.015);

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 2.2, 5.8);
    this.camera.lookAt(0, 1.8, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  // ==========================================
  // CHARACTER PREVIEWS (3D Live Spinning Previews)
  // ==========================================

  setupCharacterPreviews() {
    this.p1Preview = this.createPreviewStage('player-preview', this.p1CharKey);
    this.p2Preview = this.createPreviewStage('opponent-preview', this.p2CharKey);
  }

  createPreviewStage(canvasId, charKey) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const w = canvas.clientWidth || 320;
    const h = canvas.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 20);
    camera.position.set(0, 1.7, 3.8);
    camera.lookAt(0, 1.45, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // Lighting
    const amb = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffedd5, 1.5);
    dir.position.set(3, 5, 4);
    scene.add(dir);

    // Build Model
    const rig = buildCharacterModel(charKey);
    scene.add(rig.root);

    return {
      canvas,
      scene,
      camera,
      renderer,
      rig,
      charKey,
      time: 0
    };
  }

  updatePreviewCharacter(slot, charKey) {
    const preview = (slot === 'player') ? this.p1Preview : this.p2Preview;
    if (!preview) return;

    preview.scene.remove(preview.rig.root);
    preview.rig = buildCharacterModel(charKey);
    preview.charKey = charKey;
    preview.scene.add(preview.rig.root);

    const char = CHARACTERS[charKey];
    if (slot === 'player') {
      this.p1CharKey = charKey;
      document.querySelector('.selection.yours .preview-name').textContent = char.name;
      document.querySelector('.selection.yours .power-owner').textContent = `${char.name}'S SUPER`;
      document.querySelector('.selection.yours .power-name').textContent = char.superName;
    } else {
      this.p2CharKey = charKey;
      document.querySelector('.selection.theirs .preview-name').textContent = char.name;
      document.querySelector('.selection.theirs .power-owner').textContent = `${char.name}'S SUPER`;
      document.querySelector('.selection.theirs .power-name').textContent = char.superName;
    }

    const statusEl = document.getElementById('selection-status');
    if (statusEl) {
      statusEl.innerHTML = `${CHARACTERS[this.p1CharKey].name} <span>vs</span> ${CHARACTERS[this.p2CharKey].name}`;
    }
  }

  // ==========================================
  // MATCH LIFECYCLE & ROUND MANAGEMENT
  // ==========================================

  startMatch() {
    sound.init();

    // Clean up previous fighters
    if (this.p1 && this.p1.rig) this.scene.remove(this.p1.rig.root);
    if (this.p2 && this.p2.rig) this.scene.remove(this.p2.rig.root);

    // Create P1 Fighter
    this.p1 = new Fighter(this.p1CharKey, true, this.scene, this.vfx, sound);
    const p1Rig = buildCharacterModel(this.p1CharKey);
    this.scene.add(p1Rig.root);
    this.p1.setRig(p1Rig);

    // Create P2 Fighter
    this.p2 = new Fighter(this.p2CharKey, false, this.scene, this.vfx, sound);
    const p2Rig = buildCharacterModel(this.p2CharKey);
    this.scene.add(p2Rig.root);
    this.p2.setRig(p2Rig);

    // Setup AI for P2 if not 2-player local
    if (this.mode === 'pvp') {
      this.ai = null;
    } else {
      this.ai = new AIController(this.p2, this.p1, this.difficulty);
    }

    // Reset rounds
    this.roundNumber = 1;
    this.p1.roundsWon = 0;
    this.p2.roundsWon = 0;

    // Hide Menu Overlay & Show HUD
    document.getElementById('overlay').style.display = 'none';
    document.querySelector('.hud').style.display = 'flex';

    // Update HUD Names & Portraits
    this.updateHUDStatic();

    // Start Round 1
    this.startRound();
  }

  updateHUDStatic() {
    const p1Char = CHARACTERS[this.p1CharKey];
    const p2Char = CHARACTERS[this.p2CharKey];

    document.getElementById('player-name').textContent = p1Char.name;
    document.getElementById('opponent-name').textContent = p2Char.name;

    const p1Port = document.getElementById('player-portrait');
    const p2Port = document.getElementById('opponent-portrait');
    if (p1Port) p1Port.style.backgroundImage = `url(${p1Char.portrait})`;
    if (p2Port) p2Port.style.backgroundImage = `url(${p2Char.portrait})`;
  }

  startRound() {
    this.gameState = 'intro';
    this.roundTime = 60;

    // Reset fighter positions
    this.p1.resetRound(-2.4, 1);
    this.p2.resetRound(2.4, -1);

    // Reset HUD
    this.updateHUD();
    document.getElementById('round').textContent = `0${this.roundNumber}`;
    document.getElementById('timer').textContent = `${this.roundTime}`;

    // Announcer Callout
    sound.startBGM(false);
    this.showCallout(`ROUND ${this.roundNumber}`, () => {
      this.showCallout('FIGHT!', () => {
        this.gameState = 'fighting';
        this.startTimer();
      }, 0.7);
    }, 1.0);
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.gameState !== 'fighting') return;

      this.roundTime--;
      document.getElementById('timer').textContent = `${this.roundTime}`;

      // Check Low Health or Time Danger Music
      const p1Low = this.p1.hp <= 30;
      const p2Low = this.p2.hp <= 30;
      sound.setDangerBGM(p1Low || p2Low || this.roundTime <= 15);

      if (this.roundTime <= 0) {
        clearInterval(this.timerInterval);
        this.handleTimeUp();
      }
    }, 1000);
  }

  handleTimeUp() {
    this.gameState = 'roundOver';
    if (this.p1.hp > this.p2.hp) {
      this.handleRoundWin(this.p1, 'TIME UP!');
    } else if (this.p2.hp > this.p1.hp) {
      this.handleRoundWin(this.p2, 'TIME UP!');
    } else {
      this.showCallout('DRAW!', () => this.startRound());
    }
  }

  handleRoundWin(winner, reason = 'K.O.!') {
    this.gameState = 'roundOver';
    if (this.timerInterval) clearInterval(this.timerInterval);

    winner.roundsWon++;
    this.updateHUD();

    sound.speakAnnouncer(reason === 'K.O.!' ? 'KNOCKOUT!' : 'TIME UP!');
    this.showCallout(reason, () => {
      const winnerName = winner.char.name;
      this.showCallout(`${winnerName} WINS!`, () => {
        // Check Match Winner
        if (winner.roundsWon >= this.maxRounds) {
          this.handleMatchVictory(winner);
        } else {
          this.roundNumber++;
          setTimeout(() => this.startRound(), 1200);
        }
      }, 1.2);
    }, 1.2);
  }

  handleMatchVictory(winner) {
    this.gameState = 'matchOver';
    sound.playVictoryJingle();

    const isPlayerWin = (winner === this.p1);
    const text = isPlayerWin ? 'GOVERNMENT FORMED! YOU WIN!' : 'DEFEATED! OPPOSITION PREVAILS!';

    this.showCallout(text, () => {
      // Show Match Over Result Modal
      const res = document.getElementById('result');
      if (res) {
        res.hidden = false;
        res.innerHTML = `
          <h2>${winner.char.name} WINS THE ELECTION!</h2>
          <p class="winner-quote">"${winner.char.quote}"</p>
          <div class="result-actions">
            <button id="rematch-btn" class="btn-primary">PLAY AGAIN</button>
            <button id="menu-btn" class="btn-secondary">MAIN MENU</button>
          </div>
        `;
        document.getElementById('rematch-btn')?.addEventListener('click', () => {
          res.hidden = true;
          this.startMatch();
        });
        document.getElementById('menu-btn')?.addEventListener('click', () => {
          res.hidden = true;
          this.returnToMenu();
        });
      }
    }, 2.0);
  }

  returnToMenu() {
    this.gameState = 'menu';
    if (this.timerInterval) clearInterval(this.timerInterval);
    sound.stopBGM();

    document.getElementById('overlay').style.display = 'block';
    document.querySelector('.hud').style.display = 'none';

    // Clean up combat entities
    if (this.p1 && this.p1.rig) this.scene.remove(this.p1.rig.root);
    if (this.p2 && this.p2.rig) this.scene.remove(this.p2.rig.root);
    this.p1 = null;
    this.p2 = null;
  }

  showCallout(text, onComplete, durationSec = 1.0) {
    const el = document.getElementById('callout');
    if (!el) {
      if (onComplete) onComplete();
      return;
    }

    el.textContent = text;
    el.style.opacity = '1';
    el.style.transform = 'translate(-50%, -50%) scale(1.15)';

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, -50%) scale(0.85)';
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 250);
    }, durationSec * 1000);
  }

  updateHUD() {
    if (!this.p1 || !this.p2) return;

    // HP Bars
    const hp1El = document.getElementById('hp1');
    const hp2El = document.getElementById('hp2');
    const trail1El = document.getElementById('trail1');
    const trail2El = document.getElementById('trail2');

    const p1Pct = Math.max(0, (this.p1.hp / this.p1.maxHp) * 100);
    const p2Pct = Math.max(0, (this.p2.hp / this.p2.maxHp) * 100);

    if (hp1El) hp1El.style.width = `${p1Pct}%`;
    if (hp2El) hp2El.style.width = `${p2Pct}%`;
    if (trail1El) trail1El.style.width = `${p1Pct}%`;
    if (trail2El) trail2El.style.width = `${p2Pct}%`;

    // Guard Bars
    const g1El = document.getElementById('guard1');
    const g2El = document.getElementById('guard2');
    if (g1El) g1El.style.width = `${Math.max(0, (this.p1.guard / this.p1.maxGuard) * 100)}%`;
    if (g2El) g2El.style.width = `${Math.max(0, (this.p2.guard / this.p2.maxGuard) * 100)}%`;

    // Super Energy Meter
    const energyEl = document.getElementById('energy');
    if (energyEl) {
      const ePct = Math.min(100, this.p1.energy);
      energyEl.style.width = `${ePct}%`;
      const superBtn = document.querySelector('.action-super');
      if (superBtn) {
        if (ePct >= 100) {
          superBtn.classList.add('ready');
        } else {
          superBtn.classList.remove('ready');
        }
      }
    }

    // Round Pips
    const pips1 = document.getElementById('pips1');
    const pips2 = document.getElementById('pips2');
    if (pips1) pips1.innerHTML = '<i></i>'.repeat(this.p1.roundsWon);
    if (pips2) pips2.innerHTML = '<i></i>'.repeat(this.p2.roundsWon);
  }

  // ==========================================
  // INPUT CONTROLS & TOUCH
  // ==========================================

  initInputs() {
    // Helper to light up HUD badges
    const setBadgeActive = (badgeKey, active) => {
      const badge = document.querySelector(`.ctrl-badge[data-key="${badgeKey}"]`);
      if (badge) {
        if (active) badge.classList.add('active');
        else badge.classList.remove('active');
      }
    };

    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      const code = e.code;
      this.keys[key] = true;
      this.keys[code] = true;

      if (key === 'escape') {
        this.togglePause();
        return;
      }

      if (this.gameState !== 'fighting') return;

      // P1 Modern PC Controls (WASD + Space + Shift + J/K/E/L/R/Mouse)
      if (this.p1 && this.p1.canAct()) {
        // 1. Jump (Spacebar or W)
        if (code === 'Space' || key === ' ' || key === 'w') {
          this.p1.jump();
          setBadgeActive('space', true);
          if (key === 'w') setBadgeActive('w', true);
        }

        // 2. Crouch (S)
        if (key === 's') {
          this.p1.crouch(true);
          setBadgeActive('s', true);
        }

        // 3. Movement Badges
        if (key === 'a' || key === 'd') {
          setBadgeActive('move', true);
        }

        // 4. Punch (J or F)
        if (key === 'j' || key === 'f') {
          this.p1.punch(this.keys['d'] || this.keys['a']);
          setBadgeActive('j', true);
        }

        // 5. Kick (K or G)
        if (key === 'k' || key === 'g') {
          this.p1.kick(this.keys['d'] || this.keys['a']);
          setBadgeActive('k', true);
        }

        // 6. Dash / Evade (Shift or Q or U)
        if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift' || key === 'q' || key === 'u') {
          this.p1.evade();
          setBadgeActive('shift', true);
        }

        // 7. Guard / Block (E or I or C)
        if (key === 'e' || key === 'i' || key === 'c') {
          this.p1.startGuard();
          setBadgeActive('e', true);
        }

        // 8. Super Shakti (L or R)
        if (key === 'l' || key === 'r') {
          setBadgeActive('l', true);
          if (this.p1.energy >= 100) {
            this.p1.energy = 0;
            this.superMoves.triggerSuper(this.p1, this.p2, (dmg) => {
              this.p2.receiveAttack({ damage: dmg, isHeavy: true, attackType: 'super' }, this.p1);
            });
          }
        }
      }

      // P2 Local PVP Controls (Arrow Keys + Numpad / UI keys)
      if (this.mode === 'pvp' && this.p2 && this.p2.canAct()) {
        if (e.key === 'ArrowUp') this.p2.jump();
        if (e.key === 'ArrowDown') this.p2.crouch(true);
        if (key === '1' || key === 'num1') this.p2.punch(this.keys['arrowright'] || this.keys['arrowleft']);
        if (key === '2' || key === 'num2') this.p2.kick(this.keys['arrowright'] || this.keys['arrowleft']);
        if (key === '4' || key === 'num4') this.p2.evade();
        if (key === '5' || key === 'num5') this.p2.startGuard();
        if (key === '3' || key === 'num3') {
          if (this.p2.energy >= 100) {
            this.p2.energy = 0;
            this.superMoves.triggerSuper(this.p2, this.p1, (dmg) => {
              this.p1.receiveAttack({ damage: dmg, isHeavy: true, attackType: 'super' }, this.p2);
            });
          }
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      const code = e.code;
      this.keys[key] = false;
      this.keys[code] = false;

      // Unhighlight HUD badges
      if (code === 'Space' || key === ' ') setBadgeActive('space', false);
      if (key === 'w') setBadgeActive('w', false);
      if (key === 's') {
        setBadgeActive('s', false);
        if (this.p1) this.p1.crouch(false);
      }
      if (key === 'a' || key === 'd') {
        if (!this.keys['a'] && !this.keys['d']) {
          setBadgeActive('move', false);
          if (this.p1) this.p1.stopMove();
        }
      }
      if (key === 'j' || key === 'f') setBadgeActive('j', false);
      if (key === 'k' || key === 'g') setBadgeActive('k', false);
      if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift' || key === 'q' || key === 'u') {
        setBadgeActive('shift', false);
      }
      if (key === 'e' || key === 'i' || key === 'c') {
        setBadgeActive('e', false);
        if (this.p1) this.p1.stopGuard();
      }
      if (key === 'l' || key === 'r') setBadgeActive('l', false);

      // P2 Keyup
      if (this.mode === 'pvp' && this.p2) {
        if (e.key === 'ArrowDown') this.p2.crouch(false);
        if (key === '5' || key === 'num5') this.p2.stopGuard();
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          if (!this.keys['arrowleft'] && !this.keys['arrowright']) this.p2.stopMove();
        }
      }
    });

    // Mouse Controls (LMB = Punch, RMB = Kick)
    window.addEventListener('mousedown', (e) => {
      // Ignore if clicking UI buttons or dialogs
      if (e.target.closest('button') || e.target.closest('dialog') || e.target.closest('select')) return;
      if (this.gameState !== 'fighting' || !this.p1 || !this.p1.canAct()) return;

      if (e.button === 0) {
        // Left Click: Punch
        this.p1.punch(this.keys['d'] || this.keys['a']);
        setBadgeActive('j', true);
      } else if (e.button === 2) {
        // Right Click: Kick
        this.p1.kick(this.keys['d'] || this.keys['a']);
        setBadgeActive('k', true);
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) setBadgeActive('j', false);
      if (e.button === 2) setBadgeActive('k', false);
    });

    // Prevent default right-click context menu during battle
    window.addEventListener('contextmenu', (e) => {
      if (this.gameState === 'fighting') {
        e.preventDefault();
      }
    });

    // Toggle on-screen control HUD bar
    const toggleHudCheck = document.getElementById('toggle-control-hud');
    if (toggleHudCheck) {
      toggleHudCheck.addEventListener('change', (e) => {
        const bar = document.getElementById('control-bar');
        if (bar) bar.style.display = e.target.checked ? 'flex' : 'none';
      });
    }
  }

  initTouchControls() {
    const stick = document.getElementById('fight-stick');
    const knob = document.querySelector('.stick-knob');
    if (!stick || !knob) return;

    const onTouchStart = (e) => {
      const touch = e.touches ? e.touches[0] : e;
      const rect = stick.getBoundingClientRect();
      this.touchStick.active = true;
      this.touchStick.startX = rect.left + rect.width / 2;
      this.touchStick.startY = rect.top + rect.height / 2;
      onTouchMove(e);
    };

    const onTouchMove = (e) => {
      if (!this.touchStick.active || !this.p1 || !this.p1.canAct()) return;
      const touch = e.touches ? e.touches[0] : e;
      const dx = touch.clientX - this.touchStick.startX;
      const dy = touch.clientY - this.touchStick.startY;

      const dist = Math.min(45, Math.hypot(dx, dy));
      const angle = Math.atan2(dy, dx);

      const kx = Math.cos(angle) * dist;
      const ky = Math.sin(angle) * dist;
      knob.style.transform = `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`;

      // Horizontal movement
      if (dx > 18) {
        this.p1.move(1);
      } else if (dx < -18) {
        this.p1.move(-1);
      } else {
        this.p1.stopMove();
      }

      // Vertical (Jump / Crouch)
      if (dy < -25) {
        this.p1.jump();
      } else if (dy > 25) {
        this.p1.crouch(true);
      } else {
        this.p1.crouch(false);
      }
    };

    const onTouchEnd = () => {
      this.touchStick.active = false;
      knob.style.transform = 'translate(-50%, -50%)';
      if (this.p1) {
        this.p1.stopMove();
        this.p1.crouch(false);
      }
    };

    stick.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    // Touch Action Buttons
    const bindBtn = (selector, onDown, onUp) => {
      const btn = document.querySelector(selector);
      if (!btn) return;
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        onDown();
      });
      if (onUp) {
        btn.addEventListener('touchend', (e) => {
          e.preventDefault();
          onUp();
        });
      }
    };

    bindBtn('.action-punch', () => this.p1?.punch());
    bindBtn('.action-kick', () => this.p1?.kick());
    bindBtn('.action-guard', () => this.p1?.startGuard(), () => this.p1?.stopGuard());
    bindBtn('.action-evade', () => this.p1?.evade());
    bindBtn('.action-super', () => {
      if (this.p1 && this.p1.energy >= 100) {
        this.p1.energy = 0;
        this.superMoves.triggerSuper(this.p1, this.p2, (dmg) => {
          this.p2.receiveAttack({ damage: dmg, isHeavy: true, attackType: 'super' }, this.p1);
        });
      }
    });
  }

  togglePause() {
    if (this.gameState === 'fighting') {
      this.gameState = 'paused';
      this.showCallout('PAUSED', null, 9999);
    } else if (this.gameState === 'paused') {
      this.gameState = 'fighting';
      document.getElementById('callout').style.opacity = '0';
    }
  }

  // ==========================================
  // UI INITIALIZATION & EVENT BINDINGS
  // ==========================================

  initUI() {
    // Character Grid Buttons (Player & Opponent Select)
    document.querySelectorAll('.character-grid button.character').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slot = btn.dataset.slot;
        const charKey = btn.dataset.character;

        // Update selected class
        document.querySelectorAll(`.character-grid button.character[data-slot="${slot}"]`).forEach(b => {
          b.classList.remove('selected');
          b.setAttribute('aria-pressed', 'false');
          b.querySelector('.pick-label').textContent = 'SELECT';
        });

        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');
        btn.querySelector('.pick-label').textContent = 'SELECTED';

        this.updatePreviewCharacter(slot, charKey);
        sound.playWhoosh(false);
      });
    });

    // CPU Level Select
    const diffSelect = document.getElementById('difficulty');
    if (diffSelect) {
      diffSelect.addEventListener('change', (e) => {
        this.difficulty = e.target.value;
      });
    }

    // Play Mode Buttons (CPU vs PvP)
    const cpuBtn = document.getElementById('cpu-mode');
    const pvpBtn = document.getElementById('online-mode');
    if (cpuBtn && pvpBtn) {
      cpuBtn.addEventListener('click', () => {
        this.mode = 'cpu';
        cpuBtn.classList.add('active');
        pvpBtn.classList.remove('active');
        document.querySelector('.selection.theirs .slot-label small').textContent = 'CPU';
      });
      pvpBtn.addEventListener('click', () => {
        this.mode = 'pvp';
        pvpBtn.classList.add('active');
        cpuBtn.classList.remove('active');
        document.querySelector('.selection.theirs .slot-label small').textContent = 'P2 LOCAL';
      });
    }

    // Start Fight Button
    const startBtn = document.getElementById('start');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.startMatch();
      });
    }

    // Top Header Buttons
    document.getElementById('pause')?.addEventListener('click', () => this.togglePause());
    document.getElementById('select-menu')?.addEventListener('click', () => this.returnToMenu());
    document.getElementById('accept-disclaimer')?.addEventListener('click', () => {
      document.getElementById('disclaimer-dialog')?.close();
    });
    document.getElementById('view-disclaimer')?.addEventListener('click', () => {
      document.getElementById('disclaimer-dialog')?.showModal();
    });
  }

  // ==========================================
  // MAIN ANIMATION & GAME LOOP
  // ==========================================

  loop(timestamp) {
    requestAnimationFrame(this.loop);

    const delta = Math.min(0.1, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;

    // 1. Update Character Preview Canvases
    if (this.p1Preview) {
      this.p1Preview.time += delta;
      this.p1Preview.rig.root.rotation.y = Math.sin(this.p1Preview.time * 1.5) * 0.25;
      this.p1Preview.renderer.render(this.p1Preview.scene, this.p1Preview.camera);
    }
    if (this.p2Preview) {
      this.p2Preview.time += delta;
      this.p2Preview.rig.root.rotation.y = -Math.sin(this.p2Preview.time * 1.5) * 0.25;
      this.p2Preview.renderer.render(this.p2Preview.scene, this.p2Preview.camera);
    }

    // 2. Update 3D Stage Environment
    this.arena.update(delta);

    // 3. Skip Physics if Hit Stopped (Frame freeze)
    if (this.vfx.isFrozen()) {
      this.vfx.update(delta);
      this.renderer.render(this.scene, this.camera);
      return;
    }

    // 4. Update Combat Simulation
    if (this.gameState === 'fighting' || this.gameState === 'intro' || this.gameState === 'roundOver') {
      // Continuous keyboard movement
      if (this.gameState === 'fighting' && this.p1) {
        if (this.keys['d']) this.p1.move(1);
        else if (this.keys['a']) this.p1.move(-1);
      }

      if (this.p1) this.p1.update(delta, this.p2);
      if (this.p2) this.p2.update(delta, this.p1);

      // AI Logic
      if (this.ai && this.gameState === 'fighting') {
        this.ai.update(delta, (actor, victim) => {
          actor.energy = 0;
          this.superMoves.triggerSuper(actor, victim, (dmg) => {
            victim.receiveAttack({ damage: dmg, isHeavy: true, attackType: 'super' }, actor);
          });
        });
      }

      // Check Strike Hits
      if (this.gameState === 'fighting') {
        this.checkStrikeCollision(this.p1, this.p2);
        this.checkStrikeCollision(this.p2, this.p1);
      }

      // Update Super Moves Animation
      this.superMoves.update(delta);

      // Update HUD Health & Meters
      this.updateHUD();

      // Check Knockout Condition
      if (this.gameState === 'fighting') {
        if (this.p1.hp <= 0) {
          this.handleRoundWin(this.p2, 'K.O.!');
        } else if (this.p2.hp <= 0) {
          this.handleRoundWin(this.p1, 'K.O.!');
        }
      }
    }

    // 5. Update Visual Effects & Camera Shake
    this.vfx.update(delta);

    // 6. Render 3D Scene
    this.renderer.render(this.scene, this.camera);
  }

  checkStrikeCollision(attacker, defender) {
    const strike = attacker.getStrikeData();
    if (!strike) return;

    // Check hit distance & overlap
    const dist = Math.abs(strike.x - defender.x);
    if (dist <= 1.15) {
      attacker.hitRegistered = true;
      defender.receiveAttack(strike, attacker);
    }
  }
}

// Initialize Game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.gameInstance = new Game();
});
