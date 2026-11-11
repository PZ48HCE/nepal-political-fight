/**
 * Peer-to-Peer WebRTC + MQTT-over-WSS Multiplayer & Tournament Engine
 * Host-authoritative state simulation with DTLS-encrypted RTCDataChannels,
 * input/schema sanitization, rate limiting, shareable ?room=CODE invites,
 * and live Public Arenas / Quick Match discovery.
 */

const MQTT_WSS_URL = "wss://broker.emqx.io:8084/mqtt";
const TOPIC_PREFIX = "npf/pz48hce/v1";
const PUBLIC_LOBBY_TOPIC = `${TOPIC_PREFIX}/public-lobby`;
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ALLOWED_CHARS = Object.freeze(["balen", "kp", "harka", "ashika", "rabi", "punya"]);
const ALLOWED_ACTIONS = new Set(["punch", "kick", "grab", "jump", "evade", "super"]);
const ALLOWED_GUEST_MSGS = new Set(["join", "resume", "ready", "select", "nickname", "input", "leave"]);
const ALLOWED_PUBLIC_VIS = new Set(["public", "private"]);
const MAX_PACKET_BYTES = 4096;
const MAX_MSGS_PER_SEC = 55;
const PUBLIC_ROOM_TTL_MS = 10000;

const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun.cloudflare.com:3478" }
];

const SUPER_TIMINGS = Object.freeze({
  kp: { duration: 6.85, hits: [{ t: 3.65, dmg: 30 }] },
  balen: { duration: 6.85, hits: [{ t: 3.45, dmg: 30 }] },
  harka: { duration: 6.0, hits: [{ t: 1.85, dmg: 10 }, { t: 3.15, dmg: 10 }, { t: 4.45, dmg: 10 }] },
  ashika: { duration: 6.9, hits: [{ t: 2.1, dmg: 10 }, { t: 3.5, dmg: 10 }, { t: 4.9, dmg: 10 }] },
  rabi: { duration: 7.2, hits: [{ t: 2.1, dmg: 10 }, { t: 3.45, dmg: 10 }, { t: 4.75, dmg: 10 }] },
  punya: { duration: 7.2, hits: [{ t: 2.1, dmg: 10 }, { t: 3.45, dmg: 10 }, { t: 4.75, dmg: 10 }] }
});

export function sanitizeText(v, maxLen = 18) {
  return String(v || "")
    .normalize("NFKC")
    .replace(/[\p{C}<>&"']/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}

export function sanitizeRoomCode(v) {
  return String(v || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 4);
}

function randomId(len = 10) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => (b & 15).toString(16)).join("");
}

function randomRoomCode() {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}

function encodeUtf8(str) {
  return new TextEncoder().encode(str);
}

function encodeMqttStr(str) {
  const b = encodeUtf8(str);
  const out = new Uint8Array(2 + b.length);
  out[0] = (b.length >> 8) & 0xff;
  out[1] = b.length & 0xff;
  out.set(b, 2);
  return out;
}

function encodeRemLen(len) {
  const out = [];
  do {
    let byte = len % 128;
    len = Math.floor(len / 128);
    if (len > 0) byte |= 128;
    out.push(byte);
  } while (len > 0);
  return Uint8Array.from(out);
}

function concatBytes(...arrays) {
  const total = arrays.reduce((s, a) => s + a.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const a of arrays) {
    out.set(a, off);
    off += a.length;
  }
  return out;
}

/**
 * Lightweight zero-dependency MQTT 3.1.1 over WebSocket client.
 */
class MqttSignalingClient {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.connected = false;
    this.closed = false;
    this.buf = new Uint8Array(0);
    this.pingTimer = null;
    this.nextPacketId = 1;
    this.subs = new Set();
    this.onMessage = null;
    this.onDisconnect = null;
  }

  connect(timeoutMs = 8000) {
    if (this.connected && this.ws?.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }
    this.close();
    this.closed = false;
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.url, "mqtt");
      ws.binaryType = "arraybuffer";
      this.ws = ws;
      let settled = false;
      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          try { ws.close(); } catch {}
          reject(new Error("Signaling server timed out. Check your internet connection."));
        }
      }, timeoutMs);

      ws.onopen = () => {
        const cid = "npf_" + randomId(8);
        const vh = concatBytes(
          encodeMqttStr("MQTT"),
          Uint8Array.from([4, 2, 0, 25]) // v3.1.1, cleanSession=1, keepAlive=25s
        );
        const payload = encodeMqttStr(cid);
        const rem = encodeRemLen(vh.length + payload.length);
        ws.send(concatBytes(Uint8Array.from([0x10]), rem, vh, payload));
      };

      ws.onmessage = ev => {
        if (this.ws !== ws || !(ev.data instanceof ArrayBuffer)) return;
        const incoming = new Uint8Array(ev.data);
        this.buf = concatBytes(this.buf, incoming);
        this._drainPackets(
          () => {
            if (!settled) {
              settled = true;
              clearTimeout(timer);
              this.connected = true;
              this.pingTimer = setInterval(() => this._sendPing(), 18000);
              for (const topic of this.subs) this._sendSubscribe(topic);
              resolve();
            }
          },
          err => {
            if (!settled) {
              settled = true;
              clearTimeout(timer);
              reject(err);
            }
          }
        );
      };

      ws.onerror = () => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          reject(new Error("Cannot reach matchmaking relay server."));
        }
      };

      ws.onclose = () => {
        const wasConnected = this.connected;
        this.connected = false;
        clearInterval(this.pingTimer);
        this.pingTimer = null;
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          reject(new Error("Matchmaking connection closed."));
        } else if (wasConnected && !this.closed) {
          this.onDisconnect?.();
        }
      };
    });
  }

  _drainPackets(onConnAck, onConnErr) {
    while (this.buf.length >= 2) {
      let mult = 1;
      let remLen = 0;
      let pos = 1;
      let byte = 0;
      let completeHeader = false;
      while (pos < this.buf.length && pos <= 4) {
        byte = this.buf[pos++];
        remLen += (byte & 127) * mult;
        mult *= 128;
        if ((byte & 128) === 0) {
          completeHeader = true;
          break;
        }
      }
      if (!completeHeader || this.buf.length < pos + remLen) break;
      const pktType = this.buf[0] >> 4;
      const pktFlags = this.buf[0] & 0x0f;
      const body = this.buf.slice(pos, pos + remLen);
      this.buf = this.buf.slice(pos + remLen);

      if (pktType === 2) {
        // CONNACK
        const code = body[1] ?? 255;
        if (code === 0) onConnAck?.();
        else onConnErr?.(new Error("Signaling handshake refused (" + code + ")"));
      } else if (pktType === 3) {
        // PUBLISH
        if (body.length < 2) continue;
        const tLen = (body[0] << 8) | body[1];
        if (2 + tLen > body.length) continue;
        const topic = new TextDecoder().decode(body.slice(2, 2 + tLen));
        let pStart = 2 + tLen;
        const qos = (pktFlags >> 1) & 3;
        if (qos > 0) pStart += 2;
        if (pStart > body.length) continue;
        const msgStr = new TextDecoder().decode(body.slice(pStart));
        try {
          if (msgStr.length <= 16384) {
            const parsed = JSON.parse(msgStr);
            this.onMessage?.(topic, parsed);
          }
        } catch {}
      }
    }
  }

  _sendPing() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try { this.ws.send(Uint8Array.from([0xc0, 0x00])); } catch {}
    }
  }

  _sendSubscribe(topic) {
    if (!this.connected || this.ws?.readyState !== WebSocket.OPEN) return;
    const pid = this.nextPacketId++ & 0xffff || 1;
    const body = concatBytes(
      Uint8Array.from([(pid >> 8) & 0xff, pid & 0xff]),
      encodeMqttStr(topic),
      Uint8Array.from([0x00])
    );
    const hdr = concatBytes(Uint8Array.from([0x82]), encodeRemLen(body.length));
    this.ws.send(concatBytes(hdr, body));
  }

  subscribe(topic) {
    if (!this.subs.has(topic)) {
      this.subs.add(topic);
      this._sendSubscribe(topic);
    }
  }

  unsubscribe(topic) {
    if (this.subs.delete(topic) && this.connected && this.ws?.readyState === WebSocket.OPEN) {
      const pid = this.nextPacketId++ & 0xffff || 1;
      const body = concatBytes(
        Uint8Array.from([(pid >> 8) & 0xff, pid & 0xff]),
        encodeMqttStr(topic)
      );
      const hdr = concatBytes(Uint8Array.from([0xa2]), encodeRemLen(body.length));
      try { this.ws.send(concatBytes(hdr, body)); } catch {}
    }
  }

  publish(topic, obj) {
    if (!this.connected || this.ws?.readyState !== WebSocket.OPEN) return false;
    const tBytes = encodeMqttStr(topic);
    const pBytes = encodeUtf8(JSON.stringify(obj));
    if (pBytes.length > 16384) return false;
    const rem = encodeRemLen(tBytes.length + pBytes.length);
    this.ws.send(concatBytes(Uint8Array.from([0x30]), rem, tBytes, pBytes));
    return true;
  }

  close() {
    this.closed = true;
    this.connected = false;
    clearInterval(this.pingTimer);
    this.pingTimer = null;
    this.subs.clear();
    this.buf = new Uint8Array(0);
    if (this.ws) {
      try {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(Uint8Array.from([0xe0, 0x00]));
        }
        this.ws.close();
      } catch {}
      this.ws = null;
    }
  }
}

/**
 * Authoritative Host Match & Tournament Simulation Engine.
 * Runs in Host browser memory; guests send ONLY intents.
 */
class AuthoritativeRoomHost {
  constructor({ sim, code, hostNickname, visibility, emitLocal, broadcastAll, sendToPeer }) {
    this.sim = sim;
    this.code = code;
    this.visibility = ALLOWED_PUBLIC_VIS.has(visibility) ? visibility : "public";
    this.emitLocal = emitLocal;
    this.broadcastAll = broadcastAll;
    this.sendToPeer = sendToPeer;

    this.players = Array(8).fill(null);
    this.hostSlot = 0;
    this.settings = { ...sim.Ne };
    this.settingsRevision = 0;

    // Assign host to slot 0
    const hostToken = randomId(16);
    this.players[0] = {
      slot: 0,
      peerId: "host",
      token: hostToken,
      nickname: sanitizeText(hostNickname, 18) || "HOST",
      character: "balen",
      ready: false,
      connected: true,
      lastInput: { move: 0, block: false, crouch: false, actions: [] },
      actionQueue: []
    };

    this.status = "lobby"; // "lobby" | "running" | "finished"
    this.leagueState = null;
    this.match = null;
    this.loopTimer = null;
    this.betweenTimer = null;
    this.cinematicTimer = 0;
    this.snapAccum = 0;
    this.pendingEvents = [];
    this.cinematicSeq = 0;
  }

  getHostToken() {
    return this.players[0].token;
  }

  activePlayers() {
    return this.players.filter(Boolean);
  }

  findSlotByPeer(peerId) {
    return this.players.findIndex(p => p && p.peerId === peerId);
  }

  findSlotByToken(token) {
    if (!token || typeof token !== "string") return -1;
    return this.players.findIndex(p => p && p.token === token);
  }

  pickAvailableChar(prefer) {
    if (ALLOWED_CHARS.includes(prefer)) {
      const taken = new Set(this.activePlayers().map(p => p.character));
      if (!taken.has(prefer)) return prefer;
    }
    const taken = new Set(this.activePlayers().map(p => p.character));
    return ALLOWED_CHARS.find(c => !taken.has(c)) || ALLOWED_CHARS[0];
  }

  handlePeerJoin(peerId, nickname, resumeToken) {
    const existingByPeer = this.findSlotByPeer(peerId);
    if (existingByPeer !== -1) {
      return { ok: true, slot: existingByPeer, token: this.players[existingByPeer].token };
    }
    const existingByToken = this.findSlotByToken(resumeToken);
    if (existingByToken !== -1 && !this.players[existingByToken].connected) {
      const p = this.players[existingByToken];
      p.peerId = peerId;
      p.connected = true;
      p.nickname = sanitizeText(nickname, 18) || p.nickname;
      return { ok: true, slot: existingByToken, token: p.token, resumed: true };
    }
    if (this.status === "running") {
      return { ok: false, error: "Tournament already running in this room." };
    }
    const freeSlot = this.players.findIndex(p => p === null);
    if (freeSlot === -1) {
      return { ok: false, error: "Room is full (8/8 players)." };
    }
    const token = randomId(16);
    const char = this.pickAvailableChar();
    this.players[freeSlot] = {
      slot: freeSlot,
      peerId,
      token,
      nickname: sanitizeText(nickname, 18) || `PLAYER ${freeSlot + 1}`,
      character: char,
      ready: false,
      connected: true,
      lastInput: { move: 0, block: false, crouch: false, actions: [] },
      actionQueue: []
    };
    return { ok: true, slot: freeSlot, token };
  }

  handlePeerDisconnect(peerId, graceful = false) {
    const slot = this.findSlotByPeer(peerId);
    if (slot === -1) return;
    const p = this.players[slot];
    if (!p) return;

    const wasPlaying = this.status === "running" && this.match && this.match.pair.includes(slot);
    if (graceful || this.status !== "running") {
      this.players[slot] = null;
      if (this.status === "running") {
        this._abortTournamentBecauseLeave(p.nickname);
      } else {
        this.broadcastLobby();
      }
    } else {
      p.connected = false;
      if (wasPlaying) {
        this._abortTournamentBecauseLeave(p.nickname);
      } else {
        this.broadcastAll({ type: "playerLeft", nickname: p.nickname });
        this.emitLocal({ type: "playerLeft", nickname: p.nickname });
      }
      this.players[slot] = null;
      this.broadcastLobby();
    }
  }

  _abortTournamentBecauseLeave(nick) {
    this.stopLoops();
    this.status = "lobby";
    this.match = null;
    this.leagueState = null;
    for (const p of this.activePlayers()) p.ready = false;
    const msg = { type: "peerLeft", nickname: nick };
    this.broadcastAll(msg);
    this.emitLocal(msg);
    this.broadcastLobby();
  }

  handleClientMsg(slot, msg) {
    const player = this.players[slot];
    if (!player || !msg || typeof msg !== "object") return;
    const t = msg.type;
    if (t === "nickname") {
      if (this.status === "running") return;
      const clean = sanitizeText(msg.nickname, 18);
      if (clean) {
        player.nickname = clean;
        this.broadcastLobby();
      }
    } else if (t === "select") {
      if (this.status === "running") return;
      if (!ALLOWED_CHARS.includes(msg.character)) return;
      player.character = msg.character;
      this.broadcastLobby();
    } else if (t === "ready") {
      if (this.status === "running") return;
      player.ready = !!msg.ready;
      this.broadcastLobby();
    } else if (t === "settings") {
      if (slot !== this.hostSlot || this.status === "running") return;
      if (!this.sim._n(msg.settings)) return;
      this.settings = this.sim.fn(msg.settings);
      this.settingsRevision++;
      for (const p of this.activePlayers()) p.ready = false;
      this.broadcastLobby();
    } else if (t === "startTournament") {
      if (slot !== this.hostSlot || this.status === "running") return;
      if (this.activePlayers().length < 2) {
        this.emitLocal({ type: "error", message: "Need at least 2 players to start." });
        return;
      }
      this.startTournament();
    } else if (t === "input") {
      if (this.status !== "running" || !this.match || this.match.phase !== "fight") return;
      const roleIdx = this.match.pair.indexOf(slot);
      if (roleIdx === -1) return;
      const rawMove = Number(msg.move);
      const move = rawMove > 0 ? 1 : rawMove < 0 ? -1 : 0;
      player.lastInput.move = move;
      player.lastInput.block = !!msg.block;
      player.lastInput.crouch = !!msg.crouch;
      if (Array.isArray(msg.actions)) {
        for (const a of msg.actions.slice(0, 4)) {
          if (ALLOWED_ACTIONS.has(a) && player.actionQueue.length < 6) {
            player.actionQueue.push(a);
          }
        }
      }
    } else if (t === "leave") {
      if (slot !== this.hostSlot) {
        this.handlePeerDisconnect(player.peerId, true);
      }
    }
  }

  buildLeagueSummary() {
    const active = this.activePlayers();
    const plan = this.sim.Qn(active.length, this.settings);
    if (!this.leagueState) {
      const standings = active.map(p => ({
        slot: p.slot,
        nickname: p.nickname,
        character: p.character,
        ready: p.ready,
        host: p.slot === this.hostSlot,
        group: -1,
        wins: 0,
        roundsFor: 0,
        roundsAgainst: 0
      }));
      return {
        status: this.status,
        host: this.hostSlot,
        playerCount: active.length,
        format: plan.format,
        plan,
        settings: this.settings,
        settingsRevision: this.settingsRevision,
        groups: [],
        stage: "lobby",
        matchNumber: 0,
        nextIn: 0,
        pair: null,
        adjustedSlot: null,
        champion: null,
        standings,
        results: []
      };
    }
    const ls = this.leagueState;
    const standings = active.map(p => {
      const rec = ls.records.get(p.slot) || { group: -1, wins: 0, roundsFor: 0, roundsAgainst: 0 };
      return {
        slot: p.slot,
        nickname: p.nickname,
        character: p.character,
        ready: p.ready,
        host: p.slot === this.hostSlot,
        group: rec.group,
        wins: rec.wins,
        roundsFor: rec.roundsFor,
        roundsAgainst: rec.roundsAgainst
      };
    });
    return {
      status: ls.status,
      host: this.hostSlot,
      playerCount: active.length,
      format: plan.format,
      plan,
      settings: this.settings,
      settingsRevision: this.settingsRevision,
      groups: ls.groups,
      stage: ls.stage,
      matchNumber: ls.matchNumber,
      nextIn: ls.nextIn,
      pair: this.match ? [...this.match.pair] : null,
      adjustedSlot: this.match ? this.match.adjustedSlot : null,
      champion: ls.champion,
      standings,
      results: ls.results
    };
  }

  buildLobbyPayload() {
    return {
      type: "lobby",
      code: this.code,
      host: this.hostSlot,
      mode: "friends",
      players: this.players.map(p =>
        p ? { character: p.character, ready: p.ready, nickname: p.nickname } : null
      ),
      league: this.buildLeagueSummary()
    };
  }

  broadcastLobby() {
    const payload = this.buildLobbyPayload();
    this.broadcastAll(payload);
    this.emitLocal(payload);
  }

  startTournament() {
    this.stopLoops();
    const active = this.activePlayers();
    const n = active.length;
    const plan = this.sim.Qn(n, this.settings);
    const records = new Map();
    const useGroups = n >= 6 && this.settings.format !== "roundRobin";
    const groupA = [];
    const groupB = [];
    active.forEach((p, idx) => {
      const grp = useGroups ? (idx % 2) : -1;
      if (grp === 0) groupA.push(p.slot);
      else if (grp === 1) groupB.push(p.slot);
      records.set(p.slot, { group: grp, wins: 0, roundsFor: 0, roundsAgainst: 0 });
    });

    const queue = [];
    if (n === 2 && this.settings.minMatches === 1) {
      queue.push({ stage: "final", pair: [active[0].slot, active[1].slot], winsNeeded: this.settings.finalWins });
    } else if (useGroups) {
      const cyclesA = plan.cycles[0] || 1;
      const cyclesB = plan.cycles[1] || 1;
      for (let c = 0; c < cyclesA; c++) {
        for (let i = 0; i < groupA.length; i++) {
          for (let j = i + 1; j < groupA.length; j++) {
            queue.push({ stage: "group", pair: [groupA[i], groupA[j]], winsNeeded: this.settings.roundWins });
          }
        }
      }
      for (let c = 0; c < cyclesB; c++) {
        for (let i = 0; i < groupB.length; i++) {
          for (let j = i + 1; j < groupB.length; j++) {
            queue.push({ stage: "group", pair: [groupB[i], groupB[j]], winsNeeded: this.settings.roundWins });
          }
        }
      }
    } else {
      const cycles = plan.cycles[0] || 1;
      const slots = active.map(p => p.slot);
      for (let c = 0; c < cycles; c++) {
        for (let i = 0; i < slots.length; i++) {
          for (let j = i + 1; j < slots.length; j++) {
            queue.push({ stage: "round-robin", pair: [slots[i], slots[j]], winsNeeded: this.settings.roundWins });
          }
        }
      }
    }

    this.status = "running";
    this.leagueState = {
      status: "running",
      records,
      groups: useGroups ? [groupA, groupB] : [],
      queue,
      playoffsScheduled: n === 2 && this.settings.minMatches === 1,
      stage: queue[0]?.stage || "final",
      matchNumber: 0,
      nextIn: 0,
      champion: null,
      results: []
    };

    this._launchNextMatch();
  }

  _schedulePlayoffsIfNeeded() {
    const ls = this.leagueState;
    if (ls.playoffsScheduled || ls.queue.length > 0) return;
    ls.playoffsScheduled = true;
    const sorted = Array.from(ls.records.entries()).sort((a, b) => {
      const ra = a[1], rb = b[1];
      return rb.wins - ra.wins || (rb.roundsFor - rb.roundsAgainst) - (ra.roundsFor - ra.roundsAgainst) || a[0] - b[0];
    });
    if (ls.groups.length === 2) {
      const g0 = sorted.filter(([, r]) => r.group === 0).slice(0, 2).map(([s]) => s);
      const g1 = sorted.filter(([, r]) => r.group === 1).slice(0, 2).map(([s]) => s);
      ls.queue.push({ stage: "semifinal", pair: [g0[0], g1[1] ?? g0[1]], winsNeeded: this.settings.roundWins });
      ls.queue.push({ stage: "semifinal", pair: [g1[0], g0[1] ?? g1[1]], winsNeeded: this.settings.roundWins });
      ls.queue.push({ stage: "final", pair: null, winsNeeded: this.settings.finalWins, fromSemis: true });
    } else if (sorted.length >= 2) {
      ls.queue.push({ stage: "final", pair: [sorted[0][0], sorted[1][0]], winsNeeded: this.settings.finalWins });
    }
  }

  _launchNextMatch() {
    const ls = this.leagueState;
    if (!ls) return;
    if (ls.queue.length === 0) {
      this._schedulePlayoffsIfNeeded();
    }
    if (ls.queue.length === 0) {
      this._finishTournament();
      return;
    }
    const next = ls.queue.shift();
    if (next.fromSemis) {
      const semiWinners = ls.results.slice(-2).map(r => r.winner);
      if (semiWinners.length < 2) {
        this._finishTournament();
        return;
      }
      next.pair = [semiWinners[0], semiWinners[1]];
    }

    const p0 = this.players[next.pair[0]];
    const p1 = this.players[next.pair[1]];
    if (!p0 || !p1) {
      this._launchNextMatch();
      return;
    }

    ls.matchNumber++;
    ls.stage = next.stage;
    ls.nextIn = 0;

    let char0 = p0.character;
    let char1 = p1.character;
    let adjustedSlot = null;
    if (char0 === char1) {
      char1 = ALLOWED_CHARS.find(c => c !== char0) || "kp";
      adjustedSlot = p1.slot;
    }

    const f0 = this._makeSimFighter(char0, -2, 1);
    const f1 = this._makeSimFighter(char1, 2, -1);
    this.match = {
      pair: [p0.slot, p1.slot],
      adjustedSlot,
      winsNeeded: next.winsNeeded,
      wins: [0, 0],
      round: 1,
      remaining: this.settings.roundSeconds,
      phase: "fight",
      betweenTimer: 0,
      cinematic: null,
      cinematicHitsDone: 0,
      fighters: [f0, f1]
    };

    const names = [p0.nickname, p1.nickname];
    const snap = this._buildSnapshot();
    const league = this.buildLeagueSummary();
    const startMsg = {
      type: "start",
      snapshot: snap,
      league,
      participants: [...this.match.pair],
      names
    };
    this.broadcastAll(startMsg);
    this.emitLocal(startMsg);
    this.startMatchLoop();
  }

  _makeSimFighter(charName, x, dir) {
    const f = {
      _simOnly: true,
      root: { position: { x } },
      character: charName,
      dir,
      hp: this.settings.startingHealth,
      energy: this.settings.superPowers ? this.settings.startingEnergy : 0,
      guard: 100,
      guardDelay: 0,
      blockTime: 0,
      y: 0,
      vy: 0,
      cd: 0,
      attack: 0,
      attackDuration: 0.32,
      block: false,
      kind: "",
      recoil: 0,
      stun: 0,
      vx: 0,
      move: null,
      buffer: null,
      combo: 0,
      comboTime: 0,
      dodge: 0,
      dodgeCooldown: 0,
      strikePoint: null,
      nextHand: 0
    };
    return f;
  }

  _resetRound() {
    if (!this.match) return;
    for (const [idx, f] of this.match.fighters.entries()) {
      this.sim.Xt(f);
      f.hp = this.settings.startingHealth;
      f.energy = this.settings.superPowers ? this.settings.startingEnergy : 0;
      f.root.position.x = idx === 0 ? -2 : 2;
      f.dir = idx === 0 ? 1 : -1;
    }
    this.match.remaining = this.settings.roundSeconds;
    this.match.phase = "fight";
    this.match.cinematic = null;
    this.match.cinematicHitsDone = 0;
  }

  _buildSnapshot() {
    const m = this.match;
    return {
      rules: {
        roundWins: m.winsNeeded,
        startingHealth: this.settings.startingHealth,
        roundSeconds: this.settings.roundSeconds,
        superPowers: this.settings.superPowers
      },
      remaining: m.remaining,
      round: m.round,
      wins: [...m.wins],
      phase: m.phase,
      cinematic: m.cinematic ? { ...m.cinematic } : null,
      fighters: m.fighters.map(f => ({
        character: f.character,
        hp: f.hp,
        energy: f.energy,
        guard: f.guard,
        crouching: !!f.crouching,
        block: !!f.block,
        stun: f.stun,
        dodge: f.dodge,
        dodgeCooldown: f.dodgeCooldown,
        recoil: f.recoil,
        attack: f.attack,
        attackDuration: f.attackDuration,
        kind: f.kind,
        move: f.move
          ? { kind: f.move.kind, side: f.move.side, elapsed: f.move.elapsed, impact: f.move.impact, duration: f.move.duration, range: f.move.range, hitY: f.move.hitY }
          : null,
        combo: f.combo,
        dir: f.dir,
        y: f.y,
        x: f.root.position.x
      }))
    };
  }

  startMatchLoop() {
    this.stopLoops();
    let lastTs = performance.now();
    this.loopTimer = setInterval(() => {
      const now = performance.now();
      let rem = Math.min(0.25, Math.max(0.001, (now - lastTs) / 1000));
      lastTs = now;
      while (rem > 0.0005 && this.status === "running" && this.match) {
        const dt = Math.min(0.02, rem);
        rem -= dt;
        const prevPhase = this.match.phase;
        this._stepMatch(dt, rem <= 0.0005, prevPhase);
      }
    }, 16);
  }

  _stepMatch(dt, allowBroadcast = true, prevPhase = null) {
    const m = this.match;
    if (!m || this.status !== "running") return;

    if (m.phase === "cinematic" && m.cinematic) {
      this.cinematicTimer += dt;
      const spec = SUPER_TIMINGS[m.cinematic.character] || SUPER_TIMINGS.rabi;
      const actor = m.fighters[m.cinematic.actor];
      const victim = m.fighters[1 - m.cinematic.actor];
      while (m.cinematicHitsDone < spec.hits.length && this.cinematicTimer >= spec.hits[m.cinematicHitsDone].t) {
        const hitInfo = spec.hits[m.cinematicHitsDone];
        m.cinematicHitsDone++;
        this.sim.us(victim, hitInfo.dmg);
      }
      if (this.cinematicTimer >= spec.duration) {
        m.cinematic = null;
        m.phase = "fight";
        victim.stun = 0.25;
        victim.y = victim.vy = victim.vx = victim.attack = victim.cd = 0;
        actor.y = actor.vy = actor.vx = actor.attack = actor.cd = 0;
        if (m.fighters[0].hp <= 0 || m.fighters[1].hp <= 0) {
          this._endRound();
        }
      }
    } else if (m.phase === "fight") {
      m.remaining = Math.max(0, m.remaining - dt);
      const [f0, f1] = m.fighters;
      const p0 = this.players[m.pair[0]];
      const p1 = this.players[m.pair[1]];
      if (!p0 || !p1) return;

      const inputs = [p0.lastInput, p1.lastInput];
      for (const [idx, f] of m.fighters.entries()) {
        const inp = inputs[idx];
        const p = idx === 0 ? p0 : p1;
        this.sim.Fo(f, { move: inp.move, block: inp.block, crouch: inp.crouch }, dt);
        while (p.actionQueue.length > 0) {
          const act = p.actionQueue.shift();
          if (act === "evade") this.sim.vn(f);
          else if (act === "jump") this.sim.ps(f);
          else if (act === "grab") this.sim.xn(f, "grab");
          else if (act === "super") {
            if (this.settings.superPowers && this.sim.xn(f, "super")) {
              m.phase = "cinematic";
              this.cinematicTimer = 0;
              m.cinematicHitsDone = 0;
              m.cinematic = {
                id: ++this.cinematicSeq,
                actor: idx,
                character: f.character
              };
              break;
            }
          } else if (act === "punch" || act === "kick") {
            const moveName = this.sim.rs(f, act, {
              crouch: inp.crouch,
              forward: inp.move === f.dir
            });
            if (this.sim.xn(f, moveName)) {
              this.pendingEvents.push({
                type: "action",
                actor: idx,
                character: f.character,
                kind: act
              });
            }
          }
        }
        if (m.phase === "cinematic") break;
      }

      if (m.phase === "fight") {
        for (const f of m.fighters) this.sim.cs(f, dt);
        for (const f of m.fighters) this.sim.fs(f, dt);
        this.sim.ds(f0, f1);
        for (const [aIdx, [atk, def]] of [[f0, f1], [f1, f0]].entries()) {
          if (atk.attack === 0) atk.dir = atk.root.position.x < def.root.position.x ? 1 : -1;
          const res = this.sim.ls(atk, def);
          if (res) {
            this.pendingEvents.push({
              type: "hit",
              actor: aIdx,
              blocked: res.blocked,
              parry: !!res.parry,
              guardBreak: !!res.guardBreak,
              damage: res.damage,
              superHit: !!res.superHit,
              combo: res.combo,
              move: res.move,
              point: { x: res.point?.x ?? def.root.position.x, y: res.point?.y ?? 2.2, z: 0.5 }
            });
          }
        }
        if (f0.hp <= 0 || f1.hp <= 0 || m.remaining <= 0) {
          this._endRound();
        }
      }
    } else if (m.phase === "between") {
      m.betweenTimer -= dt;
      if (m.betweenTimer <= 0) {
        if (Math.max(...m.wins) >= m.winsNeeded) {
          this._completeMatch();
          return;
        }
        m.round++;
        this._resetRound();
      }
    }

    this.snapAccum += dt;
    const phaseChanged = prevPhase !== null && prevPhase !== m.phase;
    if (allowBroadcast || phaseChanged || this.pendingEvents.length > 0) {
      if (this.snapAccum >= 0.032 || this.pendingEvents.length > 0 || m.phase !== "fight" || phaseChanged) {
        this.snapAccum = 0;
        const pkt = {
          type: "snapshot",
          snapshot: this._buildSnapshot(),
          events: this.pendingEvents.splice(0, 16)
        };
        this.broadcastAll(pkt);
        this.emitLocal(pkt);
      }
    }
  }

  _endRound() {
    const m = this.match;
    const [f0, f1] = m.fighters;
    m.phase = "between";
    m.betweenTimer = 2.3;
    if (f0.hp > f1.hp) m.wins[0]++;
    else if (f1.hp > f0.hp) m.wins[1]++;
  }

  _completeMatch() {
    this.stopLoops();
    const m = this.match;
    const ls = this.leagueState;
    const [s0, s1] = m.pair;
    const winnerIdx = m.wins[0] >= m.wins[1] ? 0 : 1;
    const winnerSlot = m.pair[winnerIdx];
    const r0 = ls.records.get(s0);
    const r1 = ls.records.get(s1);
    if (r0) {
      r0.roundsFor += m.wins[0];
      r0.roundsAgainst += m.wins[1];
      if (winnerIdx === 0) r0.wins++;
    }
    if (r1) {
      r1.roundsFor += m.wins[1];
      r1.roundsAgainst += m.wins[0];
      if (winnerIdx === 1) r1.wins++;
    }
    ls.results.push({
      stage: ls.stage,
      pair: [...m.pair],
      score: [...m.wins],
      winner: winnerSlot
    });

    m.phase = "over";
    const finalSnap = {
      type: "snapshot",
      snapshot: this._buildSnapshot(),
      events: []
    };
    this.broadcastAll(finalSnap);
    this.emitLocal(finalSnap);

    const hasMore = ls.queue.length > 0 || !ls.playoffsScheduled;
    if (hasMore) {
      ls.nextIn = this.settings.breakSeconds;
      const lg = { type: "league", league: this.buildLeagueSummary() };
      this.broadcastAll(lg);
      this.emitLocal(lg);
      this.betweenTimer = setTimeout(() => this._launchNextMatch(), Math.max(2, this.settings.breakSeconds) * 1000);
    } else {
      ls.champion = winnerSlot;
      this._finishTournament();
    }
  }

  _finishTournament() {
    const ls = this.leagueState;
    if (!ls) return;
    if (ls.champion === null && ls.results.length > 0) {
      ls.champion = ls.results[ls.results.length - 1].winner;
    }
    ls.status = "finished";
    this.status = "finished";
    ls.nextIn = 0;
    for (const p of this.activePlayers()) p.ready = false;
    const lg = { type: "league", league: this.buildLeagueSummary() };
    this.broadcastAll(lg);
    this.emitLocal(lg);
  }

  stopLoops() {
    clearInterval(this.loopTimer);
    clearTimeout(this.betweenTimer);
    this.loopTimer = null;
    this.betweenTimer = null;
  }

  destroy() {
    this.stopLoops();
  }
}

/**
 * Main P2P Multiplayer Controller implementing the Ts(e) contract from index-Bim5ZxaA.js
 * and wiring Invite/Public Rooms/Quick Match inside #invite-dialog.
 */
export function createP2PRoomBridge(callbacks, simEngine) {
  const byId = id => document.getElementById(id);
  const statusEl = byId("network-status");
  const panelEl = byId("network-panel");
  const dialogEl = byId("invite-dialog");

  let role = null; // "host" | "guest" | null
  let mqtt = null;
  let roomCode = null;
  let visibility = "public";
  let resumeToken = null;
  let lobbySlot = null;
  let activeSlot = null; // index in current match pair [0,1] or -1
  let matchNames = [];
  let lobbyState = null;
  let hostSim = null;
  let hostPeers = new Map(); // peerId -> { pc, dc, slot, msgTimes }
  let hostPubTimer = null;
  let guestPc = null;
  let guestDc = null;
  let guestPeerId = null;
  let guestHelloTimer = null;
  let guestIceQueue = [];
  let hostIceQueues = new Map();

  let enabled = false;
  let busy = false;
  let paused = false;
  let actionQueue = [];
  let lastTickMs = 0;
  let publicRooms = new Map(); // code -> { code, hostName, players, maxPlayers, status, ts }
  let publicPruneTimer = null;

  function setStatus(msg) {
    const clean = sanitizeText(msg, 120);
    if (statusEl) statusEl.textContent = clean;
    const dlgStatus = byId("room-dialog-status");
    if (dlgStatus) dlgStatus.textContent = clean;
  }

  function buildInviteLink(code) {
    const url = new URL(window.location.href);
    url.searchParams.set("room", code);
    url.hash = "";
    return url.toString();
  }

  function updateRoomChrome() {
    if (byId("room-code")) byId("room-code").textContent = roomCode || "----";
    if (byId("invite-code")) byId("invite-code").textContent = roomCode || "----";
    if (byId("copy-room-code")) byId("copy-room-code").disabled = !roomCode;
    const copyLinkBtn = byId("copy-invite-link");
    if (copyLinkBtn) copyLinkBtn.disabled = !roomCode;
    if (byId("create-room")) byId("create-room").hidden = !!roomCode;
    if (byId("invite-done")) byId("invite-done").hidden = !roomCode;
  }

  function setBusy(flag) {
    busy = flag;
    if (byId("create-room")) byId("create-room").disabled = flag;
    if (byId("join-room")) byId("join-room").disabled = flag;
    const qm = byId("quick-match-btn");
    if (qm) qm.disabled = flag;
  }

  function switchTab(tab) {
    const isCreate = tab === "create";
    const isJoin = tab === "join";
    const isPublic = tab === "public";
    if (byId("invite-create-view")) byId("invite-create-view").hidden = !isCreate;
    if (byId("invite-join-view")) byId("invite-join-view").hidden = !isJoin;
    if (byId("invite-public-view")) byId("invite-public-view").hidden = !isPublic;
    byId("invite-create-tab")?.setAttribute("aria-pressed", String(isCreate));
    byId("invite-join-tab")?.setAttribute("aria-pressed", String(isJoin));
    byId("invite-public-tab")?.setAttribute("aria-pressed", String(isPublic));
    if (isJoin) byId("join-code")?.focus();
    if (isPublic) startBrowsingPublicRooms();
  }

  function renderPublicRooms() {
    const listEl = byId("public-rooms-list");
    if (!listEl) return;
    const now = Date.now();
    for (const [c, info] of publicRooms) {
      if (now - info.ts > PUBLIC_ROOM_TTL_MS) publicRooms.delete(c);
    }
    listEl.replaceChildren();
    const rooms = Array.from(publicRooms.values()).sort((a, b) => b.players - a.players || b.ts - a.ts);
    if (rooms.length === 0) {
      const empty = document.createElement("p");
      empty.className = "public-room-empty";
      empty.textContent = "No live public arenas right now. Click CREATE ROOM (Public) or QUICK MATCH to host one!";
      listEl.append(empty);
      return;
    }
    for (const r of rooms) {
      const row = document.createElement("div");
      row.className = "public-room-row";
      row.setAttribute("role", "listitem");

      const meta = document.createElement("div");
      meta.className = "public-room-meta";

      const title = document.createElement("strong");
      title.textContent = `${r.code} · ${r.hostName}`;

      const sub = document.createElement("span");
      sub.textContent = `${r.players}/8 FIGHTERS · ${r.status === "lobby" ? "OPEN" : "IN MATCH"}`;

      meta.append(title, sub);

      const joinBtn = document.createElement("button");
      joinBtn.type = "button";
      joinBtn.className = "public-room-join";
      joinBtn.textContent = r.status === "lobby" && r.players < 8 ? "JOIN" : "FULL";
      joinBtn.disabled = busy || !!roomCode || r.status !== "lobby" || r.players >= 8;
      joinBtn.onclick = () => {
        if (byId("join-code")) byId("join-code").value = r.code;
        joinRoomByCode(r.code);
      };

      row.append(meta, joinBtn);
      listEl.append(row);
    }
  }

  async function ensureMqtt() {
    if (!mqtt) {
      mqtt = new MqttSignalingClient(MQTT_WSS_URL);
      mqtt.onMessage = handleMqttMessage;
      mqtt.onDisconnect = () => {
        if (role === "host" && hostSim) {
          setStatus(`Room ${roomCode}: signaling reconnecting...`);
          mqtt?.connect().catch(() => {});
        }
      };
    }
    if (!mqtt.connected) {
      await mqtt.connect(8000);
    }
    return mqtt;
  }

  async function startBrowsingPublicRooms() {
    try {
      const cli = await ensureMqtt();
      cli.subscribe(PUBLIC_LOBBY_TOPIC);
      renderPublicRooms();
      clearInterval(publicPruneTimer);
      publicPruneTimer = setInterval(() => {
        if (dialogEl?.open && !byId("invite-public-view")?.hidden) {
          renderPublicRooms();
        }
      }, 2000);
    } catch (err) {
      const listEl = byId("public-rooms-list");
      if (listEl) {
        listEl.replaceChildren();
        const p = document.createElement("p");
        p.className = "public-room-empty";
        p.textContent = err.message || "Could not load public arenas.";
        listEl.append(p);
      }
    }
  }

  function validateSnapshot(snap) {
    if (!snap || typeof snap !== "object" || !Array.isArray(snap.fighters) || snap.fighters.length !== 2) return null;
    for (const f of snap.fighters) {
      if (!f || typeof f !== "object" || !ALLOWED_CHARS.includes(f.character)) return null;
      if (![f.hp, f.energy, f.guard, f.x, f.y].every(Number.isFinite)) return null;
      f.hp = Math.max(0, Math.min(500, f.hp));
      f.energy = Math.max(0, Math.min(100, f.energy));
      f.guard = Math.max(0, Math.min(100, f.guard));
    }
    return snap;
  }

  function applyInboundGameMsg(msg) {
    if (!msg || typeof msg !== "object" || typeof msg.type !== "string") return;
    if (msg.type === "joined") {
      resumeToken = sanitizeText(msg.token, 40);
      roomCode = sanitizeRoomCode(msg.code);
      lobbySlot = Number.isInteger(msg.slot) ? msg.slot : 0;
      activeSlot = null;
      paused = false;
      setBusy(false);
      updateRoomChrome();
      setStatus(`ROOM ${roomCode} connected!`);
      if (role === "guest" && dialogEl?.open) dialogEl.close();
    } else if (msg.type === "error") {
      setBusy(false);
      setStatus(sanitizeText(msg.message, 120));
    } else if (msg.type === "lobby") {
      if (sanitizeRoomCode(msg.code) !== roomCode) return;
      lobbyState = msg;
      if (Array.isArray(msg.players) && msg.players.every(Boolean) && dialogEl?.open) {
        dialogEl.close();
      }
      callbacks.onLobby?.(msg);
    } else if (msg.type === "start") {
      if (!roomCode) return;
      const snap = validateSnapshot(msg.snapshot);
      if (!snap) return;
      dialogEl?.close();
      const pair = Array.isArray(msg.participants) ? msg.participants : [0, 1];
      activeSlot = pair.indexOf(lobbySlot);
      matchNames = Array.isArray(msg.names) ? msg.names.map(n => sanitizeText(n, 18)) : [];
      callbacks.onStart?.(snap, msg);
    } else if (msg.type === "league") {
      if (roomCode) callbacks.onLeague?.(msg.league);
    } else if (msg.type === "snapshot") {
      if (!roomCode) return;
      const snap = validateSnapshot(msg.snapshot);
      if (!snap) return;
      const events = Array.isArray(msg.events) ? msg.events.slice(0, 16) : [];
      callbacks.onSnapshot?.(snap, events);
    } else if (msg.type === "playerLeft") {
      setStatus(`${sanitizeText(msg.nickname, 18) || "A player"} left the room.`);
    } else if (msg.type === "peerLeft") {
      activeSlot = null;
      matchNames = [];
      setStatus("A player disconnected. Returning to room lobby.");
      callbacks.onLeave?.();
    }
  }

  function sendRawDc(dc, obj) {
    if (!dc || dc.readyState !== "open" || dc.bufferedAmount > 65536) return false;
    try {
      dc.send(JSON.stringify(obj));
      return true;
    } catch {
      return false;
    }
  }

  function handleMqttMessage(topic, msg) {
    if (!msg || typeof msg !== "object") return;
    if (topic === PUBLIC_LOBBY_TOPIC) {
      const code = sanitizeRoomCode(msg.code);
      if (code.length !== 4) return;
      if (msg.closed) {
        publicRooms.delete(code);
      } else if (msg.v === 1 && Number.isInteger(msg.players) && msg.players >= 1 && msg.players <= 8) {
        publicRooms.set(code, {
          code,
          hostName: sanitizeText(msg.hostName, 18) || "HOST",
          players: msg.players,
          maxPlayers: 8,
          status: msg.status === "running" ? "running" : "lobby",
          ts: Date.now()
        });
      }
      if (dialogEl?.open && !byId("invite-public-view")?.hidden) renderPublicRooms();
      return;
    }

    if (role === "host" && roomCode && topic === `${TOPIC_PREFIX}/sig/${roomCode}/host`) {
      handleHostSignaling(msg);
    } else if (role === "guest" && roomCode && guestPeerId && topic === `${TOPIC_PREFIX}/sig/${roomCode}/${guestPeerId}`) {
      handleGuestSignaling(msg);
    }
  }

  async function handleHostSignaling(msg) {
    const peerId = sanitizeText(msg.peerId, 24);
    if (!peerId || peerId === "host" || !hostSim) return;

    if (msg.kind === "hello") {
      if (hostPeers.size >= 10 && !hostPeers.has(peerId)) return;
      // Clean existing stale peer connection if re-helloing
      const old = hostPeers.get(peerId);
      if (old) {
        try { old.dc?.close(); } catch {}
        try { old.pc?.close(); } catch {}
        hostPeers.delete(peerId);
      }
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      const dc = pc.createDataChannel("npf", { ordered: true });
      const peerEntry = {
        pc,
        dc,
        slot: -1,
        nickname: sanitizeText(msg.nickname, 18) || "CHALLENGER",
        token: sanitizeText(msg.token, 40),
        msgTimes: []
      };
      hostPeers.set(peerId, peerEntry);
      hostIceQueues.set(peerId, []);

      pc.onicecandidate = ev => {
        if (ev.candidate && mqtt?.connected) {
          mqtt.publish(`${TOPIC_PREFIX}/sig/${roomCode}/${peerId}`, {
            v: 1,
            kind: "ice",
            candidate: ev.candidate
          });
        }
      };

      const cleanupPeer = (graceful = false) => {
        const cur = hostPeers.get(peerId);
        if (cur && cur.pc === pc) {
          hostPeers.delete(peerId);
          hostIceQueues.delete(peerId);
          hostSim?.handlePeerDisconnect(peerId, graceful);
          try { dc.close(); } catch {}
          try { pc.close(); } catch {}
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "failed" || pc.connectionState === "closed") {
          cleanupPeer(false);
        }
      };

      dc.onopen = () => {
        const joinRes = hostSim.handlePeerJoin(peerId, peerEntry.nickname, peerEntry.token);
        if (!joinRes.ok) {
          sendRawDc(dc, { type: "error", message: joinRes.error });
          setTimeout(() => cleanupPeer(true), 250);
          return;
        }
        peerEntry.slot = joinRes.slot;
        sendRawDc(dc, {
          type: "joined",
          token: joinRes.token,
          code: roomCode,
          slot: joinRes.slot,
          mode: "friends"
        });
        hostSim.broadcastLobby();
      };

      dc.onclose = () => cleanupPeer(false);
      dc.onmessage = ev => {
        if (typeof ev.data !== "string" || ev.data.length > MAX_PACKET_BYTES) return;
        const now = performance.now();
        peerEntry.msgTimes = peerEntry.msgTimes.filter(t => now - t < 1000);
        if (peerEntry.msgTimes.length >= MAX_MSGS_PER_SEC) return;
        peerEntry.msgTimes.push(now);
        let parsed;
        try { parsed = JSON.parse(ev.data); } catch { return; }
        if (!parsed || typeof parsed !== "object" || !ALLOWED_GUEST_MSGS.has(parsed.type)) return;
        if (parsed.type === "leave") {
          cleanupPeer(true);
          return;
        }
        if (peerEntry.slot >= 0) {
          hostSim.handleClientMsg(peerEntry.slot, parsed);
        }
      };

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        mqtt?.publish(`${TOPIC_PREFIX}/sig/${roomCode}/${peerId}`, {
          v: 1,
          kind: "offer",
          sdp: pc.localDescription
        });
      } catch {
        cleanupPeer(true);
      }
    } else if (msg.kind === "answer") {
      const peer = hostPeers.get(peerId);
      if (!peer || !msg.sdp) return;
      try {
        await peer.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        const q = hostIceQueues.get(peerId) || [];
        hostIceQueues.set(peerId, []);
        for (const c of q) await peer.pc.addIceCandidate(new RTCIceCandidate(c)).catch(() => {});
      } catch {}
    } else if (msg.kind === "ice" && msg.candidate) {
      const peer = hostPeers.get(peerId);
      if (!peer) return;
      if (peer.pc.remoteDescription) {
        await peer.pc.addIceCandidate(new RTCIceCandidate(msg.candidate)).catch(() => {});
      } else {
        const q = hostIceQueues.get(peerId);
        if (q && q.length < 32) q.push(msg.candidate);
      }
    }
  }

  async function handleGuestSignaling(msg) {
    if (!guestPc) return;
    if (msg.kind === "offer" && msg.sdp) {
      clearInterval(guestHelloTimer);
      try {
        await guestPc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        const ans = await guestPc.createAnswer();
        await guestPc.setLocalDescription(ans);
        mqtt?.publish(`${TOPIC_PREFIX}/sig/${roomCode}/host`, {
          v: 1,
          peerId: guestPeerId,
          kind: "answer",
          sdp: guestPc.localDescription
        });
        for (const c of guestIceQueue) {
          await guestPc.addIceCandidate(new RTCIceCandidate(c)).catch(() => {});
        }
        guestIceQueue = [];
      } catch (err) {
        setBusy(false);
        setStatus("WebRTC connection setup failed: " + (err?.message || "retry"));
      }
    } else if (msg.kind === "ice" && msg.candidate) {
      if (guestPc.remoteDescription) {
        await guestPc.addIceCandidate(new RTCIceCandidate(msg.candidate)).catch(() => {});
      } else if (guestIceQueue.length < 32) {
        guestIceQueue.push(msg.candidate);
      }
    }
  }

  function broadcastFromHost(obj) {
    for (const peer of hostPeers.values()) {
      sendRawDc(peer.dc, obj);
    }
  }

  function sendHostLobbyHeartbeat(closed = false) {
    if (!mqtt?.connected || !roomCode || role !== "host") return;
    if (visibility !== "public" && !closed) return;
    mqtt.publish(PUBLIC_LOBBY_TOPIC, closed
      ? { code: roomCode, closed: true }
      : {
          v: 1,
          code: roomCode,
          hostName: hostSim?.players?.[0]?.nickname || "HOST",
          players: hostSim?.activePlayers().length || 1,
          status: hostSim?.status === "running" ? "running" : "lobby"
        });
  }

  async function createRoom() {
    if (busy || roomCode) return;
    const nick = sanitizeText(byId("invite-nickname")?.value || byId("nickname")?.value || "", 18) || "HOST";
    visibility = byId("room-visibility-private")?.getAttribute("aria-pressed") === "true" ? "private" : "public";
    setBusy(true);
    setStatus("Creating P2P arena room...");
    try {
      const cli = await ensureMqtt();
      const code = randomRoomCode();
      role = "host";
      roomCode = code;
      lobbySlot = 0;
      activeSlot = null;

      cli.subscribe(`${TOPIC_PREFIX}/sig/${code}/host`);
      hostSim = new AuthoritativeRoomHost({
        sim: simEngine,
        code,
        hostNickname: nick,
        visibility,
        emitLocal: applyInboundGameMsg,
        broadcastAll: broadcastFromHost
      });

      clearInterval(hostPubTimer);
      sendHostLobbyHeartbeat(false);
      hostPubTimer = setInterval(() => sendHostLobbyHeartbeat(false), 3200);

      applyInboundGameMsg({
        type: "joined",
        token: hostSim.getHostToken(),
        code,
        slot: 0,
        mode: "friends"
      });
      hostSim.broadcastLobby();
      setStatus(`ROOM ${code} (${visibility.toUpperCase()}) ready — share code or invite link!`);
    } catch (err) {
      leaveRoom(false);
      setStatus(err?.message || "Failed to create room.");
    } finally {
      setBusy(false);
    }
  }

  async function joinRoomByCode(rawCode) {
    if (busy || roomCode) return;
    const code = sanitizeRoomCode(rawCode);
    if (!/^[A-Z0-9]{4}$/.test(code)) {
      setStatus("Enter a valid 4-character room code.");
      byId("join-code")?.focus();
      return;
    }
    const nick = sanitizeText(byId("invite-nickname")?.value || byId("nickname")?.value || "", 18) || "CHALLENGER";
    setBusy(true);
    setStatus(`Connecting to room ${code}...`);
    try {
      const cli = await ensureMqtt();
      role = "guest";
      roomCode = code;
      guestPeerId = "g_" + randomId(8);
      guestIceQueue = [];
      cli.subscribe(`${TOPIC_PREFIX}/sig/${code}/${guestPeerId}`);

      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      guestPc = pc;
      pc.onicecandidate = ev => {
        if (ev.candidate && mqtt?.connected) {
          mqtt.publish(`${TOPIC_PREFIX}/sig/${code}/host`, {
            v: 1,
            peerId: guestPeerId,
            kind: "ice",
            candidate: ev.candidate
          });
        }
      };

      const opened = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(`Room ${code} did not respond. Check code or host connection.`));
        }, 10500);

        pc.ondatachannel = ev => {
          const dc = ev.channel;
          guestDc = dc;
          dc.onopen = () => {
            clearTimeout(timeout);
            clearInterval(guestHelloTimer);
            resolve();
          };
          dc.onmessage = msgEv => {
            if (typeof msgEv.data !== "string" || msgEv.data.length > 32768) return;
            let parsed;
            try { parsed = JSON.parse(msgEv.data); } catch { return; }
            applyInboundGameMsg(parsed);
          };
          dc.onclose = () => {
            if (roomCode === code) {
              setStatus("Disconnected from host.");
              leaveRoom(true);
            }
          };
        };
      });

      const sendHello = () => {
        if (mqtt?.connected && guestPc === pc) {
          mqtt.publish(`${TOPIC_PREFIX}/sig/${code}/host`, {
            v: 1,
            peerId: guestPeerId,
            kind: "hello",
            nickname: nick,
            token: resumeToken
          });
        }
      };
      sendHello();
      guestHelloTimer = setInterval(sendHello, 1500);

      await opened;
      setBusy(false);
    } catch (err) {
      leaveRoom(false);
      setBusy(false);
      setStatus(err?.message || "Could not connect to room.");
    }
  }

  async function quickMatch() {
    if (busy || roomCode) return;
    setBusy(true);
    setStatus("Scanning live public arenas...");
    try {
      const cli = await ensureMqtt();
      cli.subscribe(PUBLIC_LOBBY_TOPIC);
      await new Promise(r => setTimeout(r, 1400));
      const now = Date.now();
      const open = Array.from(publicRooms.values())
        .filter(r => now - r.ts <= PUBLIC_ROOM_TTL_MS && r.status === "lobby" && r.players < 8)
        .sort((a, b) => b.players - a.players);
      setBusy(false);
      if (open.length > 0) {
        await joinRoomByCode(open[0].code);
      } else {
        if (byId("room-visibility-public")) {
          byId("room-visibility-public").setAttribute("aria-pressed", "true");
          byId("room-visibility-private")?.setAttribute("aria-pressed", "false");
        }
        await createRoom();
      }
    } catch (err) {
      setBusy(false);
      setStatus(err?.message || "Quick match unavailable.");
    }
  }

  function leaveRoom(notifyUi = true) {
    clearInterval(hostPubTimer);
    hostPubTimer = null;
    clearInterval(guestHelloTimer);
    guestHelloTimer = null;
    clearInterval(publicPruneTimer);
    publicPruneTimer = null;

    if (role === "host") {
      sendHostLobbyHeartbeat(true);
      hostSim?.destroy();
      hostSim = null;
      for (const peer of hostPeers.values()) {
        sendRawDc(peer.dc, { type: "leave" });
        try { peer.dc?.close(); } catch {}
        try { peer.pc?.close(); } catch {}
      }
      hostPeers.clear();
      hostIceQueues.clear();
      if (roomCode && mqtt) mqtt.unsubscribe(`${TOPIC_PREFIX}/sig/${roomCode}/host`);
    } else if (role === "guest") {
      if (guestDc?.readyState === "open") sendRawDc(guestDc, { type: "leave" });
      try { guestDc?.close(); } catch {}
      try { guestPc?.close(); } catch {}
      if (roomCode && guestPeerId && mqtt) mqtt.unsubscribe(`${TOPIC_PREFIX}/sig/${roomCode}/${guestPeerId}`);
    }

    guestDc = null;
    guestPc = null;
    guestPeerId = null;
    role = null;
    roomCode = null;
    resumeToken = null;
    lobbySlot = null;
    activeSlot = null;
    matchNames = [];
    lobbyState = null;
    paused = false;
    actionQueue = [];
    setBusy(false);
    updateRoomChrome();
    if (notifyUi) callbacks.onLeave?.();
  }

  function send(msg) {
    if (!msg || typeof msg !== "object" || !roomCode) return false;
    if (role === "host" && hostSim) {
      hostSim.handleClientMsg(0, msg);
      return true;
    }
    if (role === "guest" && guestDc?.readyState === "open") {
      if (msg.type === "input" && guestDc.bufferedAmount > 16384) return false;
      return sendRawDc(guestDc, msg);
    }
    return false;
  }

  function enterOnlineMode(autoTab = "create") {
    if (!enabled) {
      enabled = true;
      if (panelEl) panelEl.hidden = false;
      document.body.classList.add("online-mode");
      callbacks.onMode?.(true);
    }
    updateRoomChrome();
    switchTab(autoTab);
    setStatus("Create a Public/Private room, click Quick Match, or enter a 4-char code.");
    dialogEl && !dialogEl.open && dialogEl.showModal();
  }

  // Wire UI handlers inside #invite-dialog and header mode tabs
  byId("online-mode").onclick = () => enterOnlineMode("create");
  byId("cpu-mode").onclick = () => {
    dialogEl?.close();
    leaveRoom(false);
    enabled = false;
    if (panelEl) panelEl.hidden = true;
    document.body.classList.remove("online-mode", "league-mode", "spectating");
    callbacks.onMode?.(false);
  };
  byId("invite-friend").onclick = () => {
    updateRoomChrome();
    switchTab(roomCode ? "create" : "public");
    dialogEl && !dialogEl.open && dialogEl.showModal();
  };
  byId("close-invite").onclick = () => dialogEl?.close();
  byId("invite-done").onclick = () => dialogEl?.close();
  dialogEl?.addEventListener("click", ev => {
    if (ev.target === dialogEl) {
      const r = dialogEl.getBoundingClientRect();
      if (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom) {
        dialogEl.close();
      }
    }
  });

  byId("invite-create-tab").onclick = () => switchTab("create");
  byId("invite-join-tab").onclick = () => switchTab("join");
  const pubTab = byId("invite-public-tab");
  if (pubTab) pubTab.onclick = () => switchTab("public");

  const visPub = byId("room-visibility-public");
  const visPriv = byId("room-visibility-private");
  if (visPub && visPriv) {
    visPub.onclick = () => {
      visPub.setAttribute("aria-pressed", "true");
      visPriv.setAttribute("aria-pressed", "false");
    };
    visPriv.onclick = () => {
      visPub.setAttribute("aria-pressed", "false");
      visPriv.setAttribute("aria-pressed", "true");
    };
  }

  byId("create-room").onclick = createRoom;
  const qmBtn = byId("quick-match-btn");
  if (qmBtn) qmBtn.onclick = quickMatch;
  const refBtn = byId("refresh-public-rooms");
  if (refBtn) refBtn.onclick = startBrowsingPublicRooms;

  byId("invite-join-view").onsubmit = ev => {
    ev.preventDefault();
    joinRoomByCode(byId("join-code").value);
  };
  byId("join-code").oninput = ev => {
    ev.target.value = sanitizeRoomCode(ev.target.value);
  };
  byId("join-code").onpaste = ev => {
    ev.preventDefault();
    ev.target.value = sanitizeRoomCode(ev.clipboardData?.getData("text") || "");
  };
  byId("copy-room-code").onclick = async () => {
    if (!roomCode) return;
    try {
      await navigator.clipboard.writeText(roomCode);
      setStatus("Room code copied! Send it to your friends.");
    } catch {
      setStatus("Select the code above to copy manually.");
    }
  };
  const copyLinkBtn = byId("copy-invite-link");
  if (copyLinkBtn) {
    copyLinkBtn.onclick = async () => {
      if (!roomCode) return;
      try {
        await navigator.clipboard.writeText(buildInviteLink(roomCode));
        setStatus("Invite link copied! Share it anywhere.");
      } catch {
        setStatus("Copy link: " + buildInviteLink(roomCode));
      }
    };
  }
  byId("leave-room").onclick = () => {
    leaveRoom(true);
    setStatus("Left room.");
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && roomCode) {
      actionQueue = [];
      send({ type: "input", move: 0, block: false, crouch: false, actions: [] });
    }
  });
  window.addEventListener("beforeunload", () => leaveRoom(false));

  // Auto-open invite link if ?room=XXXX is present in URL
  queueMicrotask(() => {
    try {
      const param = new URLSearchParams(window.location.search).get("room");
      const code = sanitizeRoomCode(param);
      if (/^[A-Z0-9]{4}$/.test(code)) {
        enterOnlineMode("join");
        if (byId("join-code")) byId("join-code").value = code;
        joinRoomByCode(code);
      }
    } catch {}
  });

  return {
    get inRoom() { return roomCode !== null; },
    get enabled() { return enabled; },
    get slot() { return activeSlot === -1 ? 0 : activeSlot ?? lobbySlot; },
    get lobbySlot() { return lobbySlot; },
    get mode() { return "friends"; },
    get spectating() { return activeSlot === -1; },
    get lobby() { return lobbyState; },
    get names() { return activeSlot === 1 ? [...matchNames].reverse() : matchNames; },
    get code() { return roomCode; },
    send,
    leave: () => leaveRoom(false),
    message: setStatus,
    action(act) {
      if (!paused && roomCode && activeSlot !== null && activeSlot !== -1 && !document.hidden && actionQueue.length < 4) {
        actionQueue.push(act);
      }
    },
    tick(keysSet, nowMs) {
      if (!paused && roomCode && activeSlot !== null && activeSlot !== -1 && !document.hidden && nowMs - lastTickMs > 28) {
        lastTickMs = nowMs;
        send({
          type: "input",
          move: (keysSet.has("d") ? 1 : 0) - (keysSet.has("a") ? 1 : 0),
          block: keysSet.has("e"),
          crouch: keysSet.has("s"),
          actions: actionQueue.splice(0, 4)
        });
      }
    },
    clear() {
      actionQueue = [];
      send({ type: "input", move: 0, block: false, crouch: false, actions: [] });
    }
  };
}
