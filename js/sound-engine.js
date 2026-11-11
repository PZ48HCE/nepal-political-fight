/**
 * Nepal Political Fight - Sound & Music Engine
 * Combines high-fidelity Web Audio API procedural synthesis,
 * authentic voice line playback, speech synthesis arcade announcer,
 * and dynamic Nepali folk-arcade battle background music!
 */

export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.musicGain = null;
    this.voiceGain = null;

    this.isMuted = false;
    this.masterVolume = 0.85;
    this.sfxVolume = 0.9;
    this.musicVolume = 0.6;
    this.voiceVolume = 1.0;

    this.voiceClips = {};
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.bgmBeat = 0;
    this.bgmBpm = 130;
    this.bgmDanger = false;

    this.announcerQueue = [];
    this.isAnnouncing = false;

    // Load available voice audio clips
    this.loadVoiceClips();
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master bus
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // SFX Bus
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Music Bus
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // Voice Bus
      this.voiceGain = this.ctx.createGain();
      this.voiceGain.gain.setValueAtTime(this.voiceVolume, this.ctx.currentTime);
      this.voiceGain.connect(this.masterGain);
    } catch (e) {
      console.warn("Web Audio API not supported or blocked:", e);
    }
  }

  loadVoiceClips() {
    const clips = {
      balen: ['audio/balen-super.wav', 'audio/balen-super.mp3'],
      kp: ['audio/oli-super.wav', 'audio/oli-super.m4a'],
      harka: ['audio/harka-super.wav', 'audio/harka-super.m4a'],
      ashika: ['audio/ashika-super.wav', 'audio/ashika-super.m4a']
    };

    for (const [key, paths] of Object.entries(clips)) {
      const audio = new Audio();
      audio.preload = 'auto';
      // Try primary format, fallback if error
      audio.src = paths[0];
      audio.onerror = () => {
        if (paths[1] && audio.src !== paths[1]) {
          audio.src = paths[1];
        }
      };
      this.voiceClips[key] = audio;
    }
  }

  setMute(mute) {
    this.isMuted = mute;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
    if (this.isMuted) {
      for (const audio of Object.values(this.voiceClips)) {
        audio.pause();
      }
    }
  }

  toggleMute() {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }

  setVolumes(master, sfx, music, voice) {
    if (master !== undefined) this.masterVolume = master;
    if (sfx !== undefined) this.sfxVolume = sfx;
    if (music !== undefined) this.musicVolume = music;
    if (voice !== undefined) this.voiceVolume = voice;

    if (this.ctx && !this.isMuted) {
      const now = this.ctx.currentTime;
      if (this.masterGain) this.masterGain.gain.setValueAtTime(this.masterVolume, now);
      if (this.sfxGain) this.sfxGain.gain.setValueAtTime(this.sfxVolume, now);
      if (this.musicGain) this.musicGain.gain.setValueAtTime(this.musicVolume, now);
      if (this.voiceGain) this.voiceGain.gain.setValueAtTime(this.voiceVolume, now);
    }
  }

  // ==========================================
  // PROCEDURAL COMBAT SOUND SYNTHESIZERS
  // ==========================================

  playWhoosh(isHeavy = false) {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const dur = isHeavy ? 0.22 : 0.14;

    // Filtered white noise for realistic air slice
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.7;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = isHeavy ? 3.5 : 2.5;
    filter.frequency.setValueAtTime(isHeavy ? 300 : 500, t);
    filter.frequency.exponentialRampToValueAtTime(isHeavy ? 1400 : 2200, t + dur * 0.5);
    filter.frequency.exponentialRampToValueAtTime(isHeavy ? 200 : 350, t + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(isHeavy ? 0.45 : 0.35, t + dur * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + dur);
  }

  playHit(type = 'light') {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;

    if (type === 'light') {
      // Snappy light jab impact
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.1);

      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

      // Click snap
      const snap = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snap.type = 'square';
      snap.frequency.setValueAtTime(900, t);
      snap.frequency.exponentialRampToValueAtTime(100, t + 0.03);
      snapGain.gain.setValueAtTime(0.3, t);
      snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      snap.connect(snapGain);
      snapGain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.11);
      snap.start(t);
      snap.stop(t + 0.04);

    } else if (type === 'medium') {
      // Solid body blow (cross punch / mid kick)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(190, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.16);

      // Lowpass for meaty body thump
      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(800, t);
      lp.frequency.exponentialRampToValueAtTime(150, t + 0.15);

      gain.gain.setValueAtTime(0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      osc.connect(lp);
      lp.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.17);

    } else if (type === 'heavy' || type === 'uppercut' || type === 'roundhouse') {
      // Exploding sub-bass heavy crunch!
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(type === 'uppercut' ? 140 : 180, t);
      osc.frequency.exponentialRampToValueAtTime(25, t + 0.28);

      gain.gain.setValueAtTime(0.9, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      // Distortion/crunch noise transient
      const dur = 0.08;
      const bSize = Math.floor(this.ctx.sampleRate * dur);
      const buf = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bSize; i++) d[i] = (Math.random() * 2 - 1) * 0.8;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;

      const nFilter = this.ctx.createBiquadFilter();
      nFilter.type = 'bandpass';
      nFilter.frequency.setValueAtTime(650, t);
      nFilter.Q.value = 1.8;

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.6, t);
      nGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      noise.connect(nFilter);
      nFilter.connect(nGain);
      nGain.connect(this.sfxGain);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.29);
      noise.start(t);
      noise.stop(t + dur);

    } else if (type === 'sweep') {
      // Low friction scrape and floor thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, t);
      osc.frequency.exponentialRampToValueAtTime(30, t + 0.22);

      gain.gain.setValueAtTime(0.65, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.23);
    }
  }

  playBlock() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Dull metallic deflection clank
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.12);

    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(800, t);
    bp.Q.value = 3.0;

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(bp);
    bp.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.13);
  }

  playParry() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Crystalline high-frequency ringing chime
    const freqs = [1200, 1850, 2400];
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.exponentialRampToValueAtTime(f * 1.05, t + 0.4);

      const amp = (0.35 / (idx + 1));
      gain.gain.setValueAtTime(amp, t);
      gain.gain.exponentialRampToValueAtTime(0.0005, t + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.46);
    });
  }

  playEvade() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Fast pneumatic slipstream dash
    const dur = 0.16;
    const bSize = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bSize; i++) d[i] = (Math.random() * 2 - 1);
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.frequency.exponentialRampToValueAtTime(400, t + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + dur);
  }

  playJump() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.14);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  playLand() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.1);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.11);
  }

  playSuperReady() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Power surge ascending arpeggio
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startT = t + idx * 0.06;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startT);

      gain.gain.setValueAtTime(0.25, startT);
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(startT);
      osc.stop(startT + 0.21);
    });
  }

  playSuperActivate(character) {
    this.init();
    if (!this.ctx) return;

    // Cinematic deep bass drop
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + 0.6);

    gain.gain.setValueAtTime(0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.62);

    // Play concept voice clip
    this.playCharacterVoice(character);

    // Play concept-specific Foley
    if (character === 'balen') {
      this.playDozerEngine();
    } else if (character === 'kp') {
      this.playJahajHorn();
    } else if (character === 'harka') {
      this.playShramPickaxe();
    } else if (character === 'ashika') {
      this.playDhanCash();
    } else if (character === 'rabi') {
      this.playGhantiRinging();
    }
  }

  playCharacterVoice(character) {
    const audio = this.voiceClips[character];
    if (audio && !this.isMuted) {
      try {
        audio.currentTime = 0;
        audio.volume = Math.min(1.0, this.voiceVolume * this.masterVolume);
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.warn(`Voice playback prevented for ${character}:`, err);
            // Fallback to speech synthesizer if audio tag fails
            this.speakAnnouncer(this.getCharacterVoiceLine(character));
          });
        }
      } catch (e) {
        console.warn("Audio play exception:", e);
      }
    } else {
      this.speakAnnouncer(this.getCharacterVoiceLine(character));
    }
  }

  getCharacterVoiceLine(character) {
    const lines = {
      balen: "DOZER SHAKTI! Garxa Balen le garxa!",
      kp: "JAHAJ SHAKTI! Pani jahaj ko ticket katinus!",
      harka: "SHRAM SHAKTI! Dharan ma shramdaan garnuparchha!",
      ashika: "DHAN SHAKTI! Paisa ko barsaat!",
      rabi: "GHANTI SHAKTI! Sidha kura janata sanga!"
    };
    return lines[character] || "SUPER SHAKTI!";
  }

  // ==========================================
  // CONCEPT-SPECIFIC FOLEY & SOUND GENERATORS
  // ==========================================

  playDozerEngine() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Low grumbling diesel engine rumble with sawtooth modulation
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(55, t);
    osc.frequency.linearRampToValueAtTime(80, t + 0.8);
    osc.frequency.linearRampToValueAtTime(45, t + 2.0);

    // Motor cylinder rhythm (LFO)
    lfo.type = 'square';
    lfo.frequency.setValueAtTime(14, t);
    lfoGain.gain.setValueAtTime(25, t);
    lfo.connect(osc.frequency);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.6, t + 0.2);
    gain.gain.setValueAtTime(0.55, t + 1.6);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 2.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    lfo.start(t);
    osc.stop(t + 2.5);
    lfo.stop(t + 2.5);
  }

  playJahajHorn() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Rich two-tone steamboat foghorn
    [145, 182].forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.linearRampToValueAtTime(freq - 4, t + 1.8);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.45, t + 0.15);
      gain.gain.setValueAtTime(0.42, t + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 2.0);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 2.1);
    });
  }

  playShramPickaxe() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Rapid rhythmic metal pickaxe strikes against stone
    [0, 0.28, 0.58, 0.9].forEach((offset) => {
      const hitT = t + offset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1450 + Math.random() * 200, hitT);
      osc.frequency.exponentialRampToValueAtTime(300, hitT + 0.1);

      gain.gain.setValueAtTime(0.5, hitT);
      gain.gain.exponentialRampToValueAtTime(0.001, hitT + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(hitT);
      osc.stop(hitT + 0.13);
    });
  }

  playDhanCash() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Classic mechanical cash register "Ka-Ching!"
    const bell = this.ctx.createOscillator();
    const bGain = this.ctx.createGain();
    bell.type = 'sine';
    bell.frequency.setValueAtTime(1975, t); // B6 high ringing note
    bGain.gain.setValueAtTime(0.6, t);
    bGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    bell.connect(bGain);
    bGain.connect(this.sfxGain);
    bell.start(t);
    bell.stop(t + 0.85);

    // Coin rattle shower
    for (let i = 0; i < 7; i++) {
      const coinT = t + 0.08 + i * 0.06;
      const cOsc = this.ctx.createOscillator();
      const cGain = this.ctx.createGain();
      cOsc.type = 'triangle';
      cOsc.frequency.setValueAtTime(2800 + Math.random() * 800, coinT);
      cGain.gain.setValueAtTime(0.25, coinT);
      cGain.gain.exponentialRampToValueAtTime(0.001, coinT + 0.05);

      cOsc.connect(cGain);
      cGain.connect(this.sfxGain);
      cOsc.start(coinT);
      cOsc.stop(coinT + 0.06);
    }
  }

  playGhantiRinging() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Temple / Political Bell (Ghanti) resonance
    const partials = [440, 880, 1320, 1760];
    partials.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);

      const amp = 0.5 / (idx + 1);
      gain.gain.setValueAtTime(amp, t);
      gain.gain.exponentialRampToValueAtTime(0.0005, t + 1.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 1.45);
    });
  }

  // ==========================================
  // ARCADE ANNOUNCER (VOICE SYNTHESIS)
  // ==========================================

  speakAnnouncer(text) {
    if (this.isMuted || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.15;
      utterance.pitch = 0.9;
      utterance.volume = Math.min(1.0, this.voiceVolume * this.masterVolume);

      // Try to find a punchy English/Nepali voice
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Male') || v.name.includes('Natural') || v.name.includes('Daniel') || v.name.includes('Alex')));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }

  // ==========================================
  // DYNAMIC NEPALI BATTLE BGM (PROCEDURAL AUDIO)
  // ==========================================

  startBGM(danger = false) {
    this.init();
    if (!this.ctx) return;

    this.bgmPlaying = true;
    this.bgmDanger = danger;
    this.bgmBeat = 0;
    this.bgmBpm = danger ? 152 : 130;

    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
    }

    const intervalMs = (60 / this.bgmBpm / 4) * 1000; // 16th notes
    this.bgmTimer = setInterval(() => {
      this.tickBGM();
    }, intervalMs);
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  setDangerBGM(danger) {
    if (this.bgmDanger !== danger) {
      this.bgmDanger = danger;
      if (this.bgmPlaying) {
        this.startBGM(danger);
      }
    }
  }

  tickBGM() {
    if (!this.ctx || this.isMuted || !this.bgmPlaying) return;

    const t = this.ctx.currentTime;
    const step = this.bgmBeat % 16;
    this.bgmBeat = (this.bgmBeat + 1) % 64;

    // 1. Authentic Nepali Madal Percussion Track
    // Classical Madal rhythmic pattern: Dhing (0), Kaa (4), Tang (8), Thin (12)
    if (step === 0 || step === 8) {
      // Dhing (Deep Bass Drum Stroke)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(step === 0 ? 95 : 110, t);
      osc.frequency.exponentialRampToValueAtTime(38, t + 0.14);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(t);
      osc.stop(t + 0.15);

    } else if (step === 4 || step === 12) {
      // Tang (Rim Treble Snare/Slap)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(380, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.08);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(600, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);
      osc.start(t);
      osc.stop(t + 0.09);

    } else if (step % 2 === 0) {
      // Shaker / Chi-chi 16th groove
      const dur = 0.035;
      const bSize = Math.floor(this.ctx.sampleRate * dur);
      const buf = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bSize; i++) d[i] = (Math.random() * 2 - 1) * 0.4;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;

      const hp = this.ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(4500, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.07, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      noise.connect(hp);
      hp.connect(gain);
      gain.connect(this.musicGain);
      noise.start(t);
      noise.stop(t + dur);
    }

    // 2. Driving 16-bit Synth Bassline (Nepali modal bass in D minor / Bhairavi)
    if (step % 4 === 0 || step % 4 === 2) {
      const bassNotes = [73.42, 73.42, 87.31, 98.00, 73.42, 110.00, 98.00, 82.41]; // D2, F2, G2, A2
      const noteIdx = Math.floor(this.bgmBeat / 4) % bassNotes.length;
      const freq = bassNotes[noteIdx];

      const bOsc = this.ctx.createOscillator();
      const bFilter = this.ctx.createBiquadFilter();
      const bGain = this.ctx.createGain();

      bOsc.type = this.bgmDanger ? 'sawtooth' : 'triangle';
      bOsc.frequency.setValueAtTime(freq, t);

      bFilter.type = 'lowpass';
      bFilter.frequency.setValueAtTime(this.bgmDanger ? 650 : 420, t);
      bFilter.frequency.exponentialRampToValueAtTime(120, t + 0.18);

      bGain.gain.setValueAtTime(0.24, t);
      bGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      bOsc.connect(bFilter);
      bFilter.connect(bGain);
      bGain.connect(this.musicGain);
      bOsc.start(t);
      bOsc.stop(t + 0.19);
    }

    // 3. Arpeggio Synth Melody (Nepali folk arcade pentatonic stabs)
    if (step % 2 === 0 && !this.bgmDanger) {
      const arpNotes = [293.66, 349.23, 392.00, 440.00, 523.25, 587.33]; // D4, F4, G4, A4, C5, D5
      const note = arpNotes[(this.bgmBeat * 3) % arpNotes.length];

      const sOsc = this.ctx.createOscillator();
      const sGain = this.ctx.createGain();
      sOsc.type = 'sine';
      sOsc.frequency.setValueAtTime(note, t);

      sGain.gain.setValueAtTime(0.08, t);
      sGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

      sOsc.connect(sGain);
      sGain.connect(this.musicGain);
      sOsc.start(t);
      sOsc.stop(t + 0.11);
    }
  }

  playVictoryJingle() {
    this.stopBGM();
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Triumphal brass arcade fanfare
    const fanfare = [
      { note: 293.66, delay: 0.00, dur: 0.18 }, // D4
      { note: 293.66, delay: 0.18, dur: 0.18 }, // D4
      { note: 293.66, delay: 0.36, dur: 0.18 }, // D4
      { note: 392.00, delay: 0.54, dur: 0.50 }, // G4
      { note: 349.23, delay: 1.08, dur: 0.22 }, // F4
      { note: 392.00, delay: 1.32, dur: 0.22 }, // G4
      { note: 440.00, delay: 1.56, dur: 0.22 }, // A4
      { note: 587.33, delay: 1.80, dur: 0.85 }  // D5 high finish
    ];

    fanfare.forEach(item => {
      const startT = t + item.delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.note, startT);

      gain.gain.setValueAtTime(0.35, startT);
      gain.gain.exponentialRampToValueAtTime(0.001, startT + item.dur);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(startT);
      osc.stop(startT + item.dur + 0.05);
    });
  }
}

export const sound = new SoundEngine();
