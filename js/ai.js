/**
 * Nepal Political Fight - CPU AI Controller
 * Implements 4 distinct political AI difficulty levels:
 * - Easy: Casual novice, slow reactions, generous attack openings
 * - Normal: Balanced fighter, maintains spacing, executes combos
 * - Hard: Seasoned politician, guards high/low, parries, whiff punishes
 * - Nightmare: Master Party Chairman, ruthless aggression, optimal supers
 */

export class AIController {
  constructor(fighter, opponent, difficulty = 'normal') {
    this.fighter = fighter;
    this.opponent = opponent;
    this.difficulty = difficulty;

    this.decisionTimer = 0;
    this.decisionInterval = 0.25; // seconds between decisions
    this.setDifficulty(difficulty);
  }

  setDifficulty(level) {
    this.difficulty = level;
    switch (level) {
      case 'easy':
        this.decisionInterval = 0.38;
        this.blockChance = 0.25;
        this.parryChance = 0.05;
        this.aggression = 0.45;
        break;
      case 'normal':
        this.decisionInterval = 0.22;
        this.blockChance = 0.55;
        this.parryChance = 0.15;
        this.aggression = 0.70;
        break;
      case 'hard':
        this.decisionInterval = 0.14;
        this.blockChance = 0.80;
        this.parryChance = 0.35;
        this.aggression = 0.85;
        break;
      case 'nightmare':
        this.decisionInterval = 0.08;
        this.blockChance = 0.95;
        this.parryChance = 0.55;
        this.aggression = 0.95;
        break;
    }
  }

  update(delta, triggerSuperCallback) {
    if (!this.fighter.canAct() || !this.opponent) return;

    this.decisionTimer -= delta;
    if (this.decisionTimer > 0) return;
    this.decisionTimer = this.decisionInterval + (Math.random() * 0.08 - 0.04);

    const dist = Math.abs(this.fighter.x - this.opponent.x);
    const oppAttacking = this.opponent.attackProgress > 0;
    const oppInSuper = this.opponent.energy >= 100 && Math.random() < 0.3;

    // 1. Reactive Defense (Block or Parry incoming attacks)
    if (oppAttacking && dist < 2.0) {
      if (Math.random() < this.blockChance) {
        this.fighter.startGuard();
        // Hold guard for a short duration
        setTimeout(() => {
          this.fighter.stopGuard();
        }, 320);
        return;
      } else if (Math.random() < 0.25 && this.difficulty !== 'easy') {
        // Quick backwards evade dash
        this.fighter.evade();
        return;
      }
    }

    // 2. Super Move Trigger (When energy meter is full!)
    if (this.fighter.energy >= 100 && dist < 3.2 && Math.random() < 0.85) {
      if (triggerSuperCallback) {
        triggerSuperCallback(this.fighter, this.opponent);
        return;
      }
    }

    // 3. Close Range Combat (< 1.6m)
    if (dist <= 1.6) {
      const roll = Math.random();

      if (roll < 0.35) {
        // Punch combo sequence
        this.fighter.punch(Math.random() < 0.3);
      } else if (roll < 0.65) {
        // Kick attack (sweep or roundhouse)
        if (Math.random() < 0.4) {
          this.fighter.crouch(true);
          this.fighter.kick();
          setTimeout(() => this.fighter.crouch(false), 350);
        } else {
          this.fighter.kick(Math.random() < 0.4);
        }
      } else if (roll < 0.80) {
        // Step back / Evade to bait
        this.fighter.move(-this.fighter.dir);
      } else {
        // Guard briefly
        this.fighter.startGuard();
        setTimeout(() => this.fighter.stopGuard(), 280);
      }
      return;
    }

    // 4. Mid Range (1.6m to 3.5m)
    if (dist <= 3.5) {
      if (Math.random() < this.aggression) {
        // Advance forward
        this.fighter.move(this.fighter.dir);
        // Chance to jump in
        if (Math.random() < 0.25 && this.fighter.y === 0) {
          this.fighter.jump();
        }
      } else {
        // Space defensively
        this.fighter.stopMove();
      }
      return;
    }

    // 5. Long Range (> 3.5m)
    // Run toward opponent
    this.fighter.move(this.fighter.dir);
  }
}
