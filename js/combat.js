/**
 * Nepal Political Fight - Fighter Combat Logic & State Machine
 * Manages fighter physics, health, guard, energy, attack combos,
 * hit detection, parrying, and damage resolution.
 */

import * as THREE from '../assets/three.module.js';
import { updateFighterAnimation } from './characters.js';

export class Fighter {
  constructor(charKey, isPlayer = true, scene, vfx, sound) {
    this.charKey = charKey;
    this.isPlayer = isPlayer;
    this.scene = scene;
    this.vfx = vfx;
    this.sound = sound;

    // Combat Stats
    this.maxHp = 100;
    this.hp = 100;
    this.energy = 0; // 0 to 100
    this.maxGuard = 100;
    this.guard = 100;
    this.roundsWon = 0;

    // Movement & Physics
    this.x = isPlayer ? -2.4 : 2.4;
    this.y = 0;
    this.vy = 0;
    this.dir = isPlayer ? 1 : -1;
    this.speed = 4.5;
    this.gravity = -24;
    this.jumpForce = 9.8;

    // State Machine Flags
    this.state = 'idle'; // idle, walk, jump, crouch, attack, guard, evade, hurt, knockedDown, victory
    this.isCrouching = false;
    this.isGuarding = false;
    this.isEvading = false;
    this.parryWindow = 0; // Perfect parry window (seconds)
    this.stunTimer = 0;
    this.hurtTimer = 0;
    this.evadeTimer = 0;

    // Attack State
    this.attackProgress = 0;
    this.attackDuration = 0.28;
    this.attackType = '';
    this.isKick = false;
    this.punchComboStep = 0;
    this.comboResetTimer = 0;
    this.hitRegistered = false;

    // 3D Visual Rig
    this.rig = null;
  }

  setRig(rig) {
    this.rig = rig;
    this.char = rig.char;
    this.rig.root.position.set(this.x, 0, 0);
    this.rig.dir = this.dir;
  }

  resetRound(xPos, dir) {
    this.hp = this.maxHp;
    this.guard = this.maxGuard;
    this.x = xPos;
    this.y = 0;
    this.vy = 0;
    this.dir = dir;
    this.state = 'idle';
    this.isCrouching = false;
    this.isGuarding = false;
    this.isEvading = false;
    this.stunTimer = 0;
    this.hurtTimer = 0;
    this.attackProgress = 0;
    this.punchComboStep = 0;

    if (this.rig) {
      this.rig.root.position.set(this.x, 0, 0);
      this.rig.dir = this.dir;
    }
  }

  canAct() {
    return (
      this.hp > 0 &&
      this.stunTimer <= 0 &&
      this.hurtTimer <= 0 &&
      this.evadeTimer <= 0 &&
      this.state !== 'knockedDown' &&
      this.state !== 'victory'
    );
  }

  // ==========================================
  // INPUT ACTIONS
  // ==========================================

  move(direction) {
    if (!this.canAct() || this.attackProgress > 0) return;
    this.walkSpeed = direction * this.speed;
    this.state = 'walk';
  }

  stopMove() {
    this.walkSpeed = 0;
    if (this.state === 'walk') this.state = 'idle';
  }

  jump() {
    if (!this.canAct() || this.y > 0 || this.attackProgress > 0) return;
    this.vy = this.jumpForce;
    this.sound.playJump();
    this.vfx.createDust(this.rig.root.position, 4);
    this.state = 'jump';
  }

  crouch(isDown) {
    if (!this.canAct() || this.y > 0 || this.attackProgress > 0) return;
    this.isCrouching = isDown;
    this.state = isDown ? 'crouch' : 'idle';
  }

  startGuard() {
    if (!this.canAct() || this.attackProgress > 0) return;
    this.isGuarding = true;
    this.parryWindow = 0.16; // 160ms window for perfect parry!
    this.walkSpeed = 0;
    this.state = 'guard';
  }

  stopGuard() {
    this.isGuarding = false;
    this.parryWindow = 0;
    if (this.state === 'guard') this.state = 'idle';
  }

  evade() {
    if (!this.canAct() || this.y > 0 || this.attackProgress > 0 || this.evadeTimer > 0) return;
    this.isEvading = true;
    this.evadeTimer = 0.32;
    this.walkSpeed = -this.dir * this.speed * 1.6; // Quick backward dash
    this.sound.playEvade();
    this.vfx.createDust(this.rig.root.position, 6);
    this.state = 'evade';
  }

  punch(forward = false) {
    if (!this.canAct() || this.attackProgress > 0) return;

    this.walkSpeed = 0;
    this.hitRegistered = false;
    this.isKick = false;

    if (this.isCrouching) {
      this.attackType = 'lowJab';
      this.attackDuration = 0.22;
    } else if (forward || this.punchComboStep === 2) {
      this.attackType = 'uppercut';
      this.attackDuration = 0.36;
      this.punchComboStep = 0;
    } else if (this.punchComboStep === 1) {
      this.attackType = 'cross';
      this.attackDuration = 0.26;
      this.punchComboStep = 2;
    } else {
      this.attackType = 'jab';
      this.attackDuration = 0.22;
      this.punchComboStep = 1;
    }

    this.comboResetTimer = 0.65;
    this.attackProgress = 0.01;
    this.sound.playWhoosh(this.attackType === 'uppercut');
    this.state = 'attack';
  }

  kick(forward = false) {
    if (!this.canAct() || this.attackProgress > 0) return;

    this.walkSpeed = 0;
    this.hitRegistered = false;
    this.isKick = true;

    if (this.isCrouching) {
      this.attackType = 'sweep';
      this.attackDuration = 0.38;
    } else if (forward) {
      this.attackType = 'roundhouse';
      this.attackDuration = 0.42;
    } else {
      this.attackType = 'midKick';
      this.attackDuration = 0.32;
    }

    this.attackProgress = 0.01;
    this.sound.playWhoosh(this.attackType === 'roundhouse' || this.attackType === 'sweep');
    this.state = 'attack';
  }

  // Get Strike Point & Reach Box
  getStrikeData() {
    if (this.attackProgress <= 0 || this.hitRegistered) return null;

    // Peak strike frame window (40% to 75% of attack duration)
    if (this.attackProgress < 0.35 || this.attackProgress > 0.75) return null;

    let reach = 1.35;
    let height = 1.6;
    let damage = 8;
    let isHeavy = false;
    let isLow = false;

    switch (this.attackType) {
      case 'jab':
        reach = 1.35; height = 1.75; damage = 7; break;
      case 'cross':
        reach = 1.45; height = 1.65; damage = 11; break;
      case 'uppercut':
        reach = 1.25; height = 2.1; damage = 16; isHeavy = true; break;
      case 'lowJab':
        reach = 1.25; height = 1.15; damage = 8; isLow = true; break;
      case 'midKick':
        reach = 1.65; height = 1.4; damage = 12; break;
      case 'roundhouse':
        reach = 1.75; height = 1.85; damage = 18; isHeavy = true; break;
      case 'sweep':
        reach = 1.55; height = 0.45; damage = 14; isLow = true; isHeavy = true; break;
    }

    const strikeX = this.x + this.dir * reach;
    return {
      x: strikeX,
      y: height,
      damage,
      isHeavy,
      isLow,
      attackType: this.attackType
    };
  }

  // Receive Incoming Strike
  receiveAttack(strike, attacker) {
    if (this.hp <= 0 || this.isEvading) return false;

    const hitPos = new THREE.Vector3(this.x, strike.y, 0);

    // 1. Check Perfect Parry!
    if (this.isGuarding && this.parryWindow > 0) {
      this.sound.playParry();
      this.vfx.triggerHitStop(80);
      this.vfx.createHitSparks(hitPos, attacker.dir, true);
      this.vfx.showComicText(hitPos, 'PERFECT PARRY!', 'super');
      // Gain super energy bonus on parry
      this.energy = Math.min(100, this.energy + 25);
      // Stun the attacker briefly
      attacker.stunTimer = 0.45;
      attacker.walkSpeed = -attacker.dir * 3.0;
      return true;
    }

    // 2. Check Standard Guard
    if (this.isGuarding && !strike.isLow) {
      this.sound.playBlock();
      this.guard = Math.max(0, this.guard - strike.damage * 1.5);
      // Chip damage only
      const chip = Math.floor(strike.damage * 0.15);
      this.hp = Math.max(0, this.hp - chip);
      this.energy = Math.min(100, this.energy + 5);

      this.vfx.createHitSparks(hitPos, attacker.dir, false);
      this.vfx.showComicText(hitPos, 'BLOCK!', 'normal');
      this.x += attacker.dir * 0.25; // Block pushback

      // Guard Break Check!
      if (this.guard <= 0) {
        this.stunTimer = 0.8;
        this.vfx.showComicText(hitPos, 'GUARD BREAK!', 'heavy');
        this.sound.playHit('heavy');
      }
      return true;
    }

    // 3. Full Hit Landed!
    this.hp = Math.max(0, this.hp - strike.damage);
    this.energy = Math.min(100, this.energy + Math.floor(strike.damage * 0.8));
    attacker.energy = Math.min(100, attacker.energy + Math.floor(strike.damage * 1.2));

    this.hurtTimer = strike.isHeavy ? 0.38 : 0.22;
    this.stunTimer = strike.isHeavy ? 0.42 : 0.25;

    // Hit sounds & Juice
    if (strike.isHeavy) {
      this.sound.playHit(strike.attackType === 'uppercut' ? 'uppercut' : 'heavy');
      this.vfx.triggerHitStop(60);
      this.vfx.createHitSparks(hitPos, attacker.dir, true);
      this.vfx.createDust(this.rig.root.position, 6);
      this.vfx.showComicText(hitPos, strike.attackType === 'sweep' ? 'SWEEP!' : 'DHUKK!', 'heavy');
      this.x += attacker.dir * 0.65; // Heavy knockback
    } else {
      this.sound.playHit('medium');
      this.vfx.triggerHitStop(30);
      this.vfx.createHitSparks(hitPos, attacker.dir, false);
      this.vfx.showComicText(hitPos, 'POW!', 'normal');
      this.x += attacker.dir * 0.35;
    }

    // Knockdown on Sweep or KO
    if (strike.attackType === 'sweep' || this.hp <= 0) {
      this.state = 'knockedDown';
      this.stunTimer = 1.0;
      this.vy = 4.5;
    }

    return true;
  }

  // ==========================================
  // PHYSICS & UPDATE LOOP
  // ==========================================

  update(delta, opponent) {
    // 1. Combo Reset Timer
    if (this.comboResetTimer > 0) {
      this.comboResetTimer -= delta;
      if (this.comboResetTimer <= 0) this.punchComboStep = 0;
    }

    // 2. Guard Recovery
    if (!this.isGuarding && this.guard < this.maxGuard) {
      this.guard = Math.min(this.maxGuard, this.guard + delta * 15);
    }
    if (this.parryWindow > 0) {
      this.parryWindow -= delta;
    }

    // 3. Stun & Hurt Timers
    if (this.hurtTimer > 0) this.hurtTimer -= delta;
    if (this.stunTimer > 0) this.stunTimer -= delta;
    if (this.evadeTimer > 0) {
      this.evadeTimer -= delta;
      if (this.evadeTimer <= 0) {
        this.isEvading = false;
        this.walkSpeed = 0;
      }
    }

    // 4. Attack Animation Progress
    if (this.attackProgress > 0) {
      this.attackProgress += delta / this.attackDuration;
      if (this.attackProgress >= 1.0) {
        this.attackProgress = 0;
        this.attackType = '';
        if (this.state === 'attack') this.state = 'idle';
      }
    }

    // 5. Jump / Vertical Physics
    if (this.y > 0 || this.vy !== 0) {
      this.vy += this.gravity * delta;
      this.y += this.vy * delta;
      if (this.y <= 0) {
        this.y = 0;
        this.vy = 0;
        this.sound.playLand();
        this.vfx.createDust(this.rig.root.position, 5);
        if (this.state === 'jump') this.state = 'idle';
      }
    }

    // 6. Horizontal Movement & Arena Bounds (-6.8 to 6.8)
    if (this.walkSpeed) {
      this.x += this.walkSpeed * delta;
    }
    this.x = Math.max(-6.8, Math.min(6.8, this.x));

    // Dynamic Facing Direction (Face Opponent)
    if (opponent && this.attackProgress <= 0 && this.state !== 'knockedDown') {
      this.dir = this.x < opponent.x ? 1 : -1;
    }

    // 7. Update 3D Visual Mesh
    if (this.rig) {
      this.rig.root.position.set(this.x, 0, 0);
      this.rig.dir = this.dir;

      updateFighterAnimation(
        this.rig,
        {
          y: this.y,
          walkSpeed: this.walkSpeed || 0,
          isCrouching: this.isCrouching,
          isGuarding: this.isGuarding,
          attackProgress: this.attackProgress,
          attackType: this.attackType,
          isKick: this.isKick,
          hurtTimer: this.hurtTimer
        },
        delta
      );
    }
  }
}
