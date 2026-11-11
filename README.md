# 🇳🇵 Nepal Political Fight — Ultra 3D Arcade Edition

> Created & Modded by **[PZ48HCE](https://github.com/PZ48HCE)** | 🎮 **[Play Live](https://pz48hce.github.io/nepal-political-fight/)**
>
> An upgraded 3D satirical arcade fighting game featuring **6 rigged 3D fighters**, **denoised character voices + SFX**, **choreographed multi-beat Super animations**, **live P2P online multiplayer**, and **strict client/P2P security hardening**.

---

## ⚡ Features & Upgrades

1. **6 Authentic Rigged 3D Characters**:
   - Skeletal-rigged `.glb` models (`models/new-*-rigged.glb` + mobile variants) with `EXT_meshopt_compression` and inverse kinematics:
     - 🏗️ **Balen Shah** (`models/new-balen-rigged.glb`): *Dozer Shakti* (`6.85s` multi-beat slam) & floating currency particles
     - 🚢 **KP Sharma Oli** (`models/new-kp-rigged.glb`): *Jahaj (Ship) Shakti* (`6.85s` animated flyover)
     - 🪨 **Harka Sampang** (`models/new-harka-rigged.glb`): *Dharan Stone & Water Shakti*
     - 🎙️ **Ashika Tamang** (`models/new-ashika-rigged.glb`): *Live Stream & Mic Shakti*
     - 🔔 **Rabi Lamichhane** (`models/new-rabi-rigged.glb`): *Ghanti Shakti* (`7.2s` 3-hit gong barrage)
     - 🔥 **Punya Gautam** (`models/new-punya-rigged.glb`): *Viral Shakti* (`7.2s` 3-hit breaking billboard & mic barrage)
   - Dual-slot animated 3D preview stages during fighter selection with dynamic lighting and shadows.

2. **Clean Denoised Audio & Dynamics Bus**:
   - Studio-cleaned (`highpass`/`lowpass`/`afftdn`/`loudnorm`), trimmed combat voice clips & meme/impact SFX with zero background hiss or clipping.
   - Single-channel SFX priority gating, `620ms` voice cooldown, WebAudio `DynamicsCompressorNode`, and a live top-bar `🔊 SFX` volume toggle so rapid combos stay crisp.

3. **Live Online P2P Multiplayer (`assets/net-p2p.js`)**:
   - Serverless **WebRTC DTLS DataChannel** P2P rooms using **WSS MQTT signaling** (`wss://broker.emqx.io:8084/mqtt`) — works directly on GitHub Pages with no backend required:
     - 🌐 **Public Arenas & 1-Click Quick Match**: Browse live open rooms or auto-join/host immediately.
     - 🔒 **Private Friend Rooms & Shareable Invite Links**: Share a 4-character room code or direct `?room=CODE` invite URL for 2–8 player matches and tournaments.
     - 🛡️ **Host-Authoritative Simulation**: Only the host runs match physics and validates rules/settings/inputs.

4. **Security Hardening**:
   - Strict **Content Security Policy (CSP)** locking down `script-src`, `worker-src`, `connect-src`, `object-src 'none'`, and `base-uri 'self'`.
   - Nickname/DOM XSS sanitization via `textContent`/`replaceChildren`, input whitelisting (`ALLOWED_CHARS`, `ALLOWED_ACTIONS`), `4KB` packet size cap, and `55 msg/sec` per-peer P2P rate limiting.

5. **Modern PC Gamer Control Panel (`WASD` + `Space` + Mouse)**:
   - Visual keyboard & mouse diagram modal accessible via **`🎮 CONTROLS`** in the top menu.
   - Dedicated jump via **`Spacebar`** (or `W`), dash/evade via **`Shift`** (or `Q`).
   - Full mouse combat: **Left Mouse Click (LMB)** for Punch, **Right Mouse Click (RMB)** for Kick, **Middle Mouse Click** for Guard.
   - Persistent reactive bottom HUD bar (`#control-bar`) that highlights pressed keys in real time.

---

## 🎮 Controls

| Action | Keyboard | Alternate / Mouse |
| :--- | :--- | :--- |
| **Move Left / Right** | <kbd>A</kbd> / <kbd>D</kbd> | <kbd>←</kbd> / <kbd>→</kbd> |
| **Jump** | <kbd>SPACEBAR</kbd> | <kbd>W</kbd> / <kbd>↑</kbd> |
| **Crouch / Duck** | <kbd>S</kbd> | <kbd>↓</kbd> |
| **Dash / Evade** | <kbd>SHIFT</kbd> | <kbd>Q</kbd> |
| **Punch** | <kbd>J</kbd> | **Left Click (LMB)** / <kbd>F</kbd> |
| **Kick** | <kbd>K</kbd> | **Right Click (RMB)** / <kbd>G</kbd> |
| **Guard / Parry** | <kbd>E</kbd> | **Middle Click (MMB)** / <kbd>I</kbd> |
| **Super Move** | <kbd>L</kbd> | <kbd>R</kbd> (100% Super Meter) |

---

## 🚀 Running Locally

```bash
python3 -m http.server 3000
```
Then open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 👤 Author

- **GitHub**: [@PZ48HCE](https://github.com/PZ48HCE)
- **Instagram**: [@sandesh_pz](https://www.instagram.com/sandesh_pz/)
