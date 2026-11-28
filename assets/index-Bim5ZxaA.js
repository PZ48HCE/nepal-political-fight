import{G as In,M as On,c as Hn,a as re,S as xe,b as he,d as j,e as ee,C as vo,f as ke,g as K,V as se,Q as yt,T as po,h as at,B as Dn,F as Ho,D as ze,R as ko,E as Nn,P as Mo,I as fo,i as _o,O as Qo,j as Wn,k as Fn,A as Zo,l as So,m as Ye,n as $e,o as Un,p as ho,q as To,r as en,s as Yt,t as tn,u as Gn,v as ot,w as on,x as nn,W as sn,y as an,H as rn,z as cn,J as Bn,K as jn,L as qn,N as zn,U as Yn,X as $n}from"./three-BUUtjSaD.js";import{createP2PRoomBridge,sanitizeText as _p2pSanitize}from"./net-p2p.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();function Kn({keys:e,press:o,enabled:t}){const n=new Map,i=document.getElementById("fight-stick"),s=i?i.querySelector(".stick-knob"):null;let a=null;const c={ArrowLeft:"a",ArrowRight:"d",ArrowUp:"w",ArrowDown:"s"," ":"w",Space:"w",Spacebar:"w",Shift:"q",ShiftLeft:"q",ShiftRight:"q",z:"j",x:"k",c:"l",f:"j",g:"k",r:"l",i:"e"},l=u=>c[u]||u.toLowerCase();function updateControlHud(){const bar=document.getElementById("control-bar");if(!bar)return;const hasA=e.has("a"),hasD=e.has("d"),hasW=e.has("w"),hasS=e.has("s");const mEl=bar.querySelector('[data-key="move"]');if(mEl)mEl.classList.toggle("active",hasA||hasD);const spEl=bar.querySelector('[data-key="space"]');if(spEl)spEl.classList.toggle("active",hasW);const wEl=bar.querySelector('[data-key="w"]');if(wEl)wEl.classList.toggle("active",hasW);const sEl=bar.querySelector('[data-key="s"]');if(sEl)sEl.classList.toggle("active",hasS);const jEl=bar.querySelector('[data-key="j"]');if(jEl)jEl.classList.toggle("active",e.has("j"));const kEl=bar.querySelector('[data-key="k"]');if(kEl)kEl.classList.toggle("active",e.has("k"));const eEl=bar.querySelector('[data-key="e"]');if(eEl)eEl.classList.toggle("active",e.has("e"));const shEl=bar.querySelector('[data-key="shift"]');if(shEl)shEl.classList.toggle("active",e.has("q"));const lEl=bar.querySelector('[data-key="l"]');if(lEl)lEl.classList.toggle("active",e.has("l"));}function r(u,v){const h=n.get(u)||new Set;v.length?n.set(u,new Set(v)):n.delete(u);for(const R of h)!v.includes(R)&&![...n.values()].some(D=>D.has(R))&&e.delete(R);for(const R of v)h.has(R)||o(R);updateControlHud();}function d(){n.clear(),e.clear(),a=null,s&&(s.style.transform=""),i&&i.classList.remove("active"),document.querySelectorAll("#touch .held").forEach(u=>u.classList.remove("held")),updateControlHud();}window.addEventListener("keydown",u=>{document.querySelector("dialog[open]")||(u.target?.closest?.("input,textarea,select,dialog"))||(u.target?.closest?.("button")&&["Enter"," "].includes(u.key))||([" ","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(u.key)&&u.preventDefault(),u.repeat||r("keyboard:"+u.code,[l(u.key)]))});window.addEventListener("keyup",u=>r("keyboard:"+u.code,[]));window.addEventListener("mousedown",u=>{if(document.querySelector("dialog[open]")||u.target?.closest?.("button,select,input,textarea,a,dialog,.modal"))return;if(!t())return;if(u.button===0)r("mouse:0",["j"]);else if(u.button===2)r("mouse:2",["k"]);else if(u.button===1)r("mouse:1",["e"]);});window.addEventListener("mouseup",u=>{if(u.button===0)r("mouse:0",[]);if(u.button===2)r("mouse:2",[]);if(u.button===1)r("mouse:1",[]);});window.addEventListener("contextmenu",u=>{if(!document.querySelector("dialog[open]")&&!u.target?.closest?.("button,select,input,textarea,a,dialog,.modal")){u.preventDefault();}});window.addEventListener("blur",d);document.addEventListener("visibilitychange",()=>{document.hidden&&d();});function S(u){if(!t()||!i||!s){d();return;}const v=i.getBoundingClientRect(),h=v.width*.32;let R=u.clientX-v.left-v.width/2,D=u.clientY-v.top-v.height/2;const b=Math.hypot(R,D);b>h&&(R*=h/b,D*=h/b),s.style.transform=`translate(${R}px,${D}px)`,i.classList.toggle("active",b>h*.2);const G=[];R/h<-.35&&G.push("a"),R/h>.35&&G.push("d"),D/h<-.55&&G.push("w"),D/h>.5&&G.push("s"),r("stick",G)}if(i){i.addEventListener("pointerdown",u=>{a!==null||!t()||(u.preventDefault(),a=u.pointerId,i.setPointerCapture(u.pointerId),S(u))});i.addEventListener("pointermove",u=>{u.pointerId===a&&S(u)});}function T(u){u.pointerId===a&&(r("stick",[]),a=null,s&&(s.style.transform=""),i&&i.classList.remove("active"))}if(i){for(const u of["pointerup","pointercancel","lostpointercapture"])i.addEventListener(u,T);}for(const u of document.querySelectorAll("#touch [data-key]")){const k=u.dataset.key;const onDown=h=>{if(!t()||u.disabled)return;h.preventDefault();try{if(h.pointerId!=null)u.setPointerCapture(h.pointerId)}catch(err){}r("pointer:"+(h.pointerId||"touch"),[k]);u.classList.add("held")};u.addEventListener("pointerdown",onDown);u.addEventListener("touchstart",onDown,{passive:!1});const onUp=h=>{r("pointer:"+(h.pointerId||"touch"),[]);u.classList.toggle("held",[...n.values()].some(R=>R.has(k)))};for(const h of["pointerup","pointercancel","lostpointercapture","touchend","touchcancel"])u.addEventListener(h,onUp);u.addEventListener("click",h=>{if(t()&&!u.disabled){o(k);e.delete(k);}});}return new MutationObserver(()=>{t()||d();}).observe(document.body,{attributes:!0,attributeFilter:["class"]}),d;}function Xn({userAgent:e="",platform:o="",touchPoints:t=0,mobileHint:n=!1,coarse:i=!1,screenWidth:s=1920,screenHeight:a=1080}={}){return n||/Android|iPhone|iPad|iPod/i.test(e)||o==="MacIntel"&&t>1||i&&t>0&&Math.min(s,a)<=1024}const Ct=globalThis.navigator,ae=Xn({userAgent:Ct?.userAgent,platform:Ct?.platform,touchPoints:Ct?.maxTouchPoints,mobileHint:Ct?.userAgentData?.mobile===!0,coarse:globalThis.matchMedia?.("(pointer: coarse)").matches,screenWidth:globalThis.screen?.width,screenHeight:globalThis.screen?.height}),Ee=Object.freeze({mobile:ae,pixelRatio:ae?1.15:1.5,previewPixelRatio:ae?1:1.5,previewFPS:ae?20:30,shadowSize:ae?512:1024,antialias:!ae,previewAntialias:!0,banknotes:ae?90:180});function Do(e,o=ae){return`models/${o?"mobile/":""}new-${e}-rigged.glb`}function Vn(e,o=ae){return o?e.replace("audio/","audio/mobile/").replace(/\.mp3$/,".m4a"):e}function No(e=ae){return e?"textures/nepal-money-mobile.webp":"textures/nepal-money.jpg"}const bt=document.getElementById("disclaimer-dialog"),ln="npf-disclaimer-v1";function dn(){bt.open||(bt.showModal(),bt.scrollTop=0)}document.getElementById("accept-disclaimer").addEventListener("click",()=>bt.close());document.getElementById("view-disclaimer").addEventListener("click",dn);bt.addEventListener("close",()=>{try{sessionStorage.setItem(ln,"seen")}catch{}});
if(bt){
  bt.addEventListener("click",(e)=>{
    const r=bt.getBoundingClientRect();
    if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom){
      bt.close();
      try{localStorage.setItem(ln,"seen");sessionStorage.setItem(ln,"seen")}catch{}
    }
  });
}
document.getElementById("accept-disclaimer")?.addEventListener("click",()=>{
  try{localStorage.setItem(ln,"seen");sessionStorage.setItem(ln,"seen")}catch{}
});
let un=!1;
try{un=localStorage.getItem(ln)==="seen"||sessionStorage.getItem(ln)==="seen"}catch{}
un||dn();
const Ne=Object.freeze({format:"auto",minMatches:1,roundSeconds:60,roundWins:2,finalWins:2,startingHealth:80,startingEnergy:0,superPowers:!0,breakSeconds:6}),Jn={format:["auto","roundRobin","groups"],minMatches:[1,2,3,4,5,6],roundSeconds:[30,45,60,90],roundWins:[1,2,3],finalWins:[1,2,3],startingHealth:[80,100,150],startingEnergy:[0,50,100],superPowers:[!0,!1],breakSeconds:[3,6,10,15]},pn={quick:{...Ne,roundSeconds:30,roundWins:1,breakSeconds:3},balanced:{...Ne},marathon:{...Ne,minMatches:3,finalWins:3,breakSeconds:10}};function _n(e){return!!e&&typeof e=="object"&&!Array.isArray(e)&&Object.keys(e).length===Object.keys(Ne).length&&Object.entries(Jn).every(([o,t])=>t.includes(e[o]))}function fn(e){return{...Ne,...e}}function Qn(e,o=Ne){const t=fn(o);if(e<2)return{format:"Waiting for at least 2 players",groupSizes:[],cycles:[],qualifyingMatches:0,playoffMatches:0,totalMatches:0,guaranteedMatches:0};const n=e>=6&&t.format!=="roundRobin",i=n?[Math.ceil(e/2),Math.floor(e/2)]:[e],s=e===2&&t.minMatches===1,a=i.map(r=>Math.ceil(t.minMatches/(r-1))),c=s?0:i.reduce((r,d,S)=>r+d*(d-1)/2*a[S],0),l=e>5?3:1;return{format:s?"Head-to-head final":n?"Two groups, top 2 from each, semifinals and final":e>5?"Full round robin, top 4, semifinals and final":"Full round robin, top 2 play the final",groupSizes:i,cycles:s?[0]:a,qualifyingMatches:c,playoffMatches:l,totalMatches:c+l,guaranteedMatches:s?1:Math.min(...i.map((r,d)=>(r-1)*a[d]))}}function hn(e){const o=fn(e);return`${o.roundSeconds}s rounds / first to ${o.roundWins} round${o.roundWins===1?"":"s"} / final first to ${o.finalWins} / ${o.startingHealth} HP / supers ${o.superPowers?"on":"off"} / ${o.superPowers?o.startingEnergy:0}% starting meter / ${o.breakSeconds}s breaks`}const ge=e=>document.getElementById(e),Co=[["format","Competition format","Auto picks groups for 6-8 players. Full round robin keeps everyone in one table.",[["auto","Automatic (recommended)"],["roundRobin","Full round robin"],["groups","Groups (used with 6+ players)"]]],["minMatches","Minimum matches per player","Qualifying 1v1 matches before elimination. Full cycles can give extra matches.",[1,2,3,4,5,6].map(e=>[e,e+" minimum"])],["roundSeconds","Round length","Timer pauses during super animations.",[30,45,60,90].map(e=>[e,e+" seconds"])],["roundWins","Rounds to win a match","Qualifiers, tiebreaks and semifinals. First to 2 means best of 3.",[[1,"First to 1 (one round)"],[2,"First to 2 (best of 3)"],[3,"First to 3 (best of 5)"]]],["finalWins","Rounds to win the final","Give the championship match its own length.",[[1,"First to 1 (one round)"],[2,"First to 2 (best of 3)"],[3,"First to 3 (best of 5)"]]],["startingHealth","Starting health","Applies equally to both fighters, every round.",[[80,"80 HP / faster"],[100,"100 HP / standard"],[150,"150 HP / longer"]]],["superPowers","Super powers","Turn cinematic super attacks on or off for everyone.",[[!0,"On"],[!1,"Off"]]],["startingEnergy","Starting super meter","Resets each round. Ignored when supers are off.",[[0,"0% / build it up"],[50,"50% / halfway"],[100,"100% / ready immediately"]]],["breakSeconds","Break between matches","Time to view results before the next fight starts.",[3,6,10,15].map(e=>[e,e+" seconds"])]];let mn=null,vt=null,Re=!1,At=null,$t=!1;const de=document.createElement("dialog");de.id="room-settings-dialog";de.setAttribute("aria-labelledby","room-settings-title");de.innerHTML=`<button class="settings-close" aria-label="Close settings" type="button">&times;</button><p class="settings-eyebrow">PLAY WITH FRIENDS</p><h2 id="room-settings-title">GAME SETTINGS</h2><p id="settings-permission"></p><form id="room-settings-form"><div class="settings-presets segmented" aria-label="Settings presets"><button type="button" data-preset="quick">QUICK</button><button type="button" data-preset="balanced">BALANCED</button><button type="button" data-preset="marathon">EXTENDED</button></div><fieldset id="settings-fields"><div class="settings-grid">${Co.map(([e,o,t,n])=>`<label for="rule-${e}"><span>${o}</span><select id="rule-${e}" name="${e}" aria-describedby="help-${e}">${n.map(([i,s])=>`<option value="${i}">${s}</option>`).join("")}</select><small id="help-${e}">${t}</small></label>`).join("")}</div></fieldset><section class="settings-preview" aria-live="polite"><strong>YOUR TOURNAMENT PLAN</strong><p id="settings-plan"></p><p id="settings-plan-rules"></p></section><p class="settings-warning">Applying changes resets everyone’s Ready status. Rules lock once a tournament starts. Qualification ties may add playoff matches.</p><button id="save-room-settings" class="btn-primary" type="submit">APPLY SETTINGS</button></form>`;document.body.append(de);function gn(){return Object.fromEntries(Co.map(([e])=>{const o=ge("rule-"+e).value;return[e,e==="format"?o:e==="superPowers"?o==="true":Number(o)]}))}function Ao(e){for(const[o]of Co)ge("rule-"+o).value=String(e[o]);$t=!1,Ro()}function Ro(){const e=gn(),o=Qn(vt?.playerCount||0,e);ge("settings-plan").textContent=o.totalMatches?`${o.format}. ${o.totalMatches} scheduled matches. At least ${o.guaranteedMatches} match${o.guaranteedMatches===1?"":"es"} per player before elimination.`:"Invite at least two players to see your schedule.",ge("settings-plan-rules").textContent=hn(e),ge("rule-startingEnergy").disabled=!Re||!e.superPowers;for(const t of de.querySelectorAll("[data-preset]"))t.setAttribute("aria-pressed",String(Object.keys(Ne).every(n=>e[n]===pn[t.dataset.preset][n])))}function yn(){const e=vt?.status==="running";ge("settings-fields").disabled=!Re,ge("save-room-settings").hidden=!Re,de.querySelectorAll("[data-preset]").forEach(o=>o.disabled=!Re),ge("settings-permission").textContent=e?"These rules are locked until the tournament finishes.":Re?"Host controls. Changes are shared with everyone in this room.":"Room rules. Only the host can change these settings."}ge("advanced-settings").addEventListener("click",()=>{vt&&(yn(),Ao(vt.settings),de.showModal(),de.scrollTop=0)});de.querySelector(".settings-close").addEventListener("click",()=>de.close());de.addEventListener("click",e=>{if(e.target!==de)return;const o=de.getBoundingClientRect();(e.clientX<o.left||e.clientX>o.right||e.clientY<o.top||e.clientY>o.bottom)&&de.close()});ge("room-settings-form").addEventListener("input",()=>{$t=!0,Ro()});de.querySelectorAll("[data-preset]").forEach(e=>e.addEventListener("click",()=>{Ao(pn[e.dataset.preset]),$t=!0}));ge("room-settings-form").addEventListener("submit",e=>{e.preventDefault();const o=gn();Re&&_n(o)&&(mn?.(o),de.close())});function Zn(e){mn=e}function es(e,o){const t=Re;if(vt=e,Re=!!e&&e.host===o&&e.status!=="running",!e){At=null,ge("room-rules-notice").textContent="",de.open&&de.close();return}ge("advanced-settings").textContent=Re?"ADVANCED SETTINGS":"VIEW RULES";const n=e.plan;ge("room-rules-summary").textContent=hn(e.settings)+(n.totalMatches?` / ${n.totalMatches} scheduled matches / minimum ${n.guaranteedMatches} per player`:""),At!==null&&At!==e.settingsRevision&&(ge("room-rules-notice").textContent="The host updated the rules. Ready statuses have been reset."),At=e.settingsRevision,de.open&&(yn(),!$t||t!==Re?Ao(e.settings):Ro())}function bn(e){return _p2pSanitize(e,18)}const le=e=>document.getElementById(e);let Oe="",oo=null;try{Oe=bn(localStorage.getItem("npf-nickname"))}catch{}function wn(){return Oe}function ts(e){for(const o of["nickname","invite-nickname"]){const t=le(o);t.value=Oe,t.addEventListener("input",()=>{Oe=bn(t.value),t.value!==Oe&&!/\s$/.test(t.value)&&(t.value=Oe);for(const n of["nickname","invite-nickname"])n!==o&&(le(n).value=Oe);try{localStorage.setItem("npf-nickname",Oe)}catch{}}),t.addEventListener("change",()=>{t.value=Oe,e(Oe)})}}const Wo={"round-robin":"ROUND ROBIN",group:"GROUP STAGE",semifinal:"SEMIFINAL",final:"FINAL",tiebreak:"QUALIFICATION PLAYOFF"};function os(e){const o=document.createElement("table");o.className="league-table";const t=o.createTHead().insertRow();for(const a of["PLAYER","FIGHTER","STATUS","W","RDS"]){const c=document.createElement("th");c.textContent=a,t.append(c)}const n=o.createTBody(),i=e.status==="running",s=[...e.standings].sort((a,c)=>a.group-c.group||c.wins-a.wins||c.roundsFor-c.roundsAgainst-(a.roundsFor-a.roundsAgainst)||a.slot-c.slot);for(const a of s){const c=n.insertRow();e.champion===a.slot&&(c.className="league-champion");const l=a.group>=0&&e.groups.length>1?" / "+String.fromCharCode(65+a.group):"";c.insertCell().textContent=a.nickname+(a.host?" / HOST":""),c.insertCell().textContent=a.character.toUpperCase()+l;const r=c.insertCell();r.textContent=i?e.pair?.includes(a.slot)?"PLAYING":"WATCHING":a.ready?"READY":"NOT READY",r.className=a.ready&&!i?"ready-yes":"ready-no",c.insertCell().textContent=String(a.wins),c.insertCell().textContent=a.roundsFor+"-"+a.roundsAgainst}return o}function Je(e,{spectating:o=!1,names:t=[],selfSlot:n=oo}={}){if(oo=n,es(e,n),le("league-panel").hidden=!e,le("league-live").hidden=!e,!e){document.body.classList.remove("league-mode"),le("nickname").disabled=!1,le("invite-nickname").disabled=!1,le("host-start").hidden=!0;return}document.body.classList.add("league-mode");const i=e.standings.find(c=>c.slot===e.champion),s=Wo[e.stage]||"FRIENDS ROOM";le("league-title").textContent=i?i.nickname+" IS THE CHAMPION":e.status==="lobby"?e.playerCount+" / 8 FRIENDS":s+" / MATCH "+e.matchNumber,le("league-info").textContent=e.status==="lobby"?e.format+(e.playerCount<2?".":". The host can start anytime.")+" Ready is optional: it just shows you are set.":e.status==="finished"?"Tournament complete. The host can start a new draw with everyone in the room.":e.nextIn>0?"Next match starts in a few seconds.":e.format+". "+(o?"You are watching.":"First to "+e.settings.roundWins+" rounds."),e.adjustedSlot!==null&&e.status==="running"&&!e.nextIn&&(le("league-info").textContent+=" Matching picks: "+e.standings.find(c=>c.slot===e.adjustedSlot)?.nickname+" uses an alternate fighter this match."),le("host-start").hidden=e.host!==oo,le("host-start").disabled=e.playerCount<2||e.status==="running",le("host-start").textContent=e.status==="running"?"TOURNAMENT RUNNING":e.playerCount<2?"WAITING FOR PLAYERS":"START · "+e.playerCount+" PLAYERS";for(const c of["league-table","league-live-table"])le(c).replaceChildren(os(e));le("league-watch-label").textContent=(o?"WATCHING":"FRIENDS")+" / "+s+" / "+e.matchNumber,le("league-current").textContent=t.length?t.join(" vs "):"The host starts with 2 to 8 players";const a=le("league-results");a.replaceChildren();for(const c of e.results){const l=document.createElement("p"),r=d=>e.standings.find(S=>S.slot===d)?.nickname||"Player";l.textContent=(Wo[c.stage]||"MATCH")+" / "+c.pair.map(r).join(" vs ")+" / "+c.score.join("-")+" / "+r(c.winner)+" wins",a.append(l)}le("nickname").disabled=e.status==="running",le("invite-nickname").disabled=e.status==="running"}let mo=0.55;const ns=.05,registeredSuperAudios=[];try{const sv=localStorage.getItem("npf-sfx-vol");if(sv!==null){const nv=parseFloat(sv);if(!Number.isNaN(nv))mo=Math.max(0,Math.min(1,nv))}}catch{}
let activeVoiceAudio=null,activeSfxAudio=null,activeSfxPriority=0,lastVoiceTime=0,lastSwingTime=0,Fe=null,FeBus=null,FeNoise=null;
function ensureAudioCtx(){
  try{
    if(!Fe)Fe=new(window.AudioContext||window.webkitAudioContext);
    if(Fe.state==="suspended")Fe.resume().catch(()=>{});
    if(!FeBus){
      const comp=Fe.createDynamicsCompressor();
      comp.threshold.setValueAtTime(-16,Fe.currentTime);
      comp.knee.setValueAtTime(18,Fe.currentTime);
      comp.ratio.setValueAtTime(6,Fe.currentTime);
      comp.attack.setValueAtTime(0.003,Fe.currentTime);
      comp.release.setValueAtTime(0.14,Fe.currentTime);
      const master=Fe.createGain();
      master.gain.setValueAtTime(0.9,Fe.currentTime);
      comp.connect(master);master.connect(Fe.destination);
      FeBus=comp;
    }
    return Fe;
  }catch{return null}
}
function getNoiseBuf(ctx){
  if(FeNoise&&FeNoise.sampleRate===ctx.sampleRate)return FeNoise;
  const len=Math.floor(ctx.sampleRate*0.18),buf=ctx.createBuffer(1,len,ctx.sampleRate),ch=buf.getChannelData(0);
  for(let i=0;i<len;i++)ch[i]=(Math.random()*2-1)*Math.sin(Math.PI*(i/len));
  FeNoise=buf;return buf;
}
function syncAudioUI(){const btn=document.getElementById("audio-toggle");if(!btn)return;const muted=mo<=0.001;btn.textContent=muted?"🔇 SFX: MUTE":`🔊 SFX: ${Math.round(mo*100)}%`;btn.setAttribute("aria-pressed",muted?"true":"false");btn.classList.toggle("muted",muted)}
let battleBgmAudio=null;
function playBattleBgm(){if(typeof mo!=="undefined"&&mo<=0.001)return;try{if(!battleBgmAudio){battleBgmAudio=new Audio("audio/fightkaro_battle.mp3");battleBgmAudio.loop=!0;battleBgmAudio.preload="auto"}battleBgmAudio.volume=Math.max(0,Math.min(1,.32*(typeof mo!=="undefined"?mo:1)));battleBgmAudio.play().catch(()=>{})}catch{}}
function duckBattleBgm(duck=!0){if(!battleBgmAudio)return;try{const target=duck?.08:.32;battleBgmAudio.volume=Math.max(0,Math.min(1,target*(typeof mo!=="undefined"?mo:1)))}catch{}}
function stopBattleBgm(){if(!battleBgmAudio)return;try{battleBgmAudio.pause();battleBgmAudio.currentTime=0}catch{}}
window.playBattleBgm=playBattleBgm;window.duckBattleBgm=duckBattleBgm;window.stopBattleBgm=stopBattleBgm;
function setAudioVolume(v){mo=Math.max(0,Math.min(1,v));try{localStorage.setItem("npf-sfx-vol",String(mo))}catch{}for(const a of registeredSuperAudios){a.volume=mo;a.muted=mo<=0.001}if(activeVoiceAudio){activeVoiceAudio.volume=Math.max(0,Math.min(1,0.40*mo));if(mo<=0.001)activeVoiceAudio.pause()}if(activeSfxAudio){activeSfxAudio.volume=Math.max(0,Math.min(1,0.42*mo));if(mo<=0.001)activeSfxAudio.pause()}if(battleBgmAudio){battleBgmAudio.volume=Math.max(0,Math.min(1,.32*mo));if(mo<=0.001)battleBgmAudio.pause();else if(typeof z!=="undefined"&&z==="fight")battleBgmAudio.play().catch(()=>{})}syncAudioUI()}
function initAudioToggle(){syncAudioUI();const btn=document.getElementById("audio-toggle");if(btn&&!btn.dataset.wired){btn.dataset.wired="1";btn.addEventListener("click",()=>{const steps=[0.55,0.25,0,0.85];const idx=steps.findIndex(x=>Math.abs(x-mo)<0.06);setAudioVolume(steps[(idx+1)%steps.length])})}}
if(typeof document!=="undefined"){if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initAudioToggle,{once:!0});else queueMicrotask(initAudioToggle)}
window.__setAudioVolume=setAudioVolume;
function Kt(e){const o=Vn(e),t=new Audio(o);return t.volume=mo,t.muted=mo<=0.001,t.preload=ae?"metadata":"auto",o!==e&&t.addEventListener("error",()=>{t.src=e,t.load()},{once:!0}),registeredSuperAudios.push(t),t.load(),t}
const voiceClips={
  balen:{punch:["audio/balen-punch-1.m4a","audio/balen-punch-2.m4a"],kick:["audio/balen-kick.m4a"],block:["audio/balen-block.m4a"],hurt:["audio/balen-hurt.m4a"]},
  kp:{punch:["audio/kp-punch-1.m4a","audio/kp-punch-2.m4a"],kick:["audio/kp-kick.m4a"],block:["audio/kp-block.m4a"],hurt:["audio/kp-hurt.m4a"]},
  prachanda:{punch:["audio/kp-punch-1.m4a","audio/sfx-nepali-1.m4a"],kick:["audio/kp-kick.m4a","audio/sfx-arey.m4a"],block:["audio/kp-block.m4a"],hurt:["audio/kp-hurt.m4a","audio/sfx-kehna.m4a"]},
  rabi:{punch:["audio/rabi-punch-1.m4a","audio/rabi-punch-2.m4a"],kick:["audio/rabi-kick.m4a"],block:["audio/rabi-block.m4a"],hurt:["audio/rabi-hurt.m4a"]},
  punya:{punch:["audio/punya-punch-1.m4a","audio/punya-punch-2.m4a"],kick:["audio/punya-kick.m4a"],block:["audio/punya-block.m4a"],hurt:["audio/punya-hurt.m4a"]},
  deuba:{punch:["audio/punya-punch-1.m4a","audio/sfx-nepali-2.m4a"],kick:["audio/punya-kick.m4a","audio/aye-haye.m4a"],block:["audio/punya-block.m4a"],hurt:["audio/punya-hurt.m4a","audio/bruh.m4a"]},
  harka:{punch:["audio/harka-punch-1.m4a","audio/harka-punch-2.m4a"],kick:["audio/harka-kick.m4a"],block:["audio/harka-block.m4a"],hurt:["audio/harka-hurt.m4a"]},
  raja:{punch:["audio/balen-punch-1.m4a","audio/sfx-nepali-1.m4a"],kick:["audio/kp-kick.m4a","audio/anime-punch.m4a"],block:["audio/balen-block.m4a"],hurt:["audio/balen-hurt.m4a","audio/aye-haye.m4a"]},
  madhesh:{punch:["audio/harka-punch-1.m4a","audio/sfx-hit-1.m4a"],kick:["audio/harka-kick.m4a","audio/sfx-hit-2.m4a"],block:["audio/harka-block.m4a"],hurt:["audio/harka-hurt.m4a","audio/sfx-arey.m4a"]},
  nepal:{punch:["audio/punya-punch-2.m4a","audio/nepal-laugh.m4a"],kick:["audio/punya-kick.m4a","audio/sfx-slap.m4a"],block:["audio/punya-block.m4a"],hurt:["audio/punya-hurt.m4a","audio/aye-haye.m4a"]},
  ashika:{punch:["audio/ashika-punch-1.m4a","audio/ashika-punch-2.m4a"],kick:["audio/ashika-kick.m4a"],block:["audio/ashika-block.m4a"],hurt:["audio/ashika-hurt.m4a"]}
};
const FIGHT_SFX_MAP = {"whoosh":"data:audio/mp3;base64,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","hit_1":"data:audio/mp3;base64,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","hit_2":"data:audio/mp3;base64,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","hit_3":"data:audio/mp3;base64,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","block":"data:audio/mp3;base64,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","thud":"data:audio/mp3;base64,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7USYNc6CEVsQ06D6D5oMnBgxvyP078Z0IP/v//dfru5t/zv39n7pffx3FUaNz+YaDDVrJ/2/tmuhnGb/+1LEvYIG0A8bLRkgIT8E4QHEjAlOAAwgCAzHrfRNAZOZRXzY0oiL8tj+GZcUSXbnwd8u9WVuHyQiTU3LIaL0QcxaB2p31qvvCw4YIrmmUO07NaRW56ZqmRlKf/kv/zK+ZdMp+RzM4RdznZ9jnxxS4acTtUZDAACABTlCVicPTtu9hvPLWsu6/fGh+ua0tjrGtp9KiYT7HylgV6V2t3zLCQOmii1odhFhZXMq6K8NAkoO/9Ln+dH39/+18vVc3+Y7bzNgv8ovbr9+wzm+PxD7uf/7UsTYAgoEFQgNmEBJPhthYbMMCCPGGP6Y2HrOCS9mwDEkk5bZsYsskdSvzJrEga7kAwm0cWa2CHaO+Icbo9rPD2ocYuocadcfPmihosPiJ1zYiJ3UT0z7U0yeqmo9GDyTzRakLhF5Y00KUoh0sbUTfPW+NSs/FMOfc/PHxPJ/Z3vo5L5fn4ZDYi93XxER1Eb73v/98UxFd971NBsasRf////////Xf///////+fD1OEFjIRYzgFcapRg0FAoFM17ml3oO87TWhBQHSShfSRD4//tSxOYACqRvCs0IYAl/sGElowwpEVGIPVBTUgqwnwXoXWUt0kniXD+MCPomJyaqZbaQ0DhLhSJIYZ30lbKXGKPYmkqSI5Spa1Vqf15iTjYkiWJpkTT1JWy76/yRJUnGpONzI+SKRN1V1//81LpqXkTI+ZHzGXTAxPP+32//8yYvJ//0Ao0aKIMLkXJygvdBwGjwKgqsFToNBwRA0sFXgqdLBz+txU7BqHZU6VOwa/90s9WCvU////g1BqVOrDUGlUxBTUU0LjBVVVVVVVVVVVX/+1LE6YAL5PUHFbGAClnBYQM2sAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7UsTMgBIFoQYZtoAA8IIaS54wAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV","slap":"data:audio/mp3;base64,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"};
const fightSfxPool = new Map();
function playFightkaroSfx(name, vol = 0.50) {
  if (typeof mo !== "undefined" && mo <= 0.001) return;
  try {
    let pool = fightSfxPool.get(name);
    if (!pool) {
      pool = [];
      const primary = "audio/sfx/" + name + ".mp3";
      for (let i = 0; i < 4; i++) {
        const audio = new Audio(primary);
        audio.preload = "auto";
        audio.addEventListener("error", () => {
          const fallback = "audio/" + name + ".mp3";
          if (audio.src !== fallback) {
            audio.src = fallback;
          }
        }, { once: true });
        pool.push(audio);
      }
      fightSfxPool.set(name, pool);
    }
    const a = pool.find(item => item.paused || item.ended) || pool[0];
    const isVoice = ["round_1", "round_2", "final_round", "fight", "ko", "time_up", "you_win", "you_lose", "jingle_win", "jingle_lose"].includes(name);
    a.playbackRate = isVoice ? 1.0 : (0.96 + Math.random() * 0.08);
    a.volume = Math.max(0, Math.min(1, vol * (typeof mo !== "undefined" ? mo : 1)));
    a.currentTime = 0;
    a.play().catch(() => {});
  } catch (_) {}
}
window.playFightkaroSfx = playFightkaroSfx;
window.fightSfxPool = fightSfxPool;

const characterVoiceCache = new Map();
function playCharacterFunnyVoice(charName, action = "punch", vol = 0.52) {
  if (typeof mo !== "undefined" && mo <= 0.001) return;
  const soundMap = {
    balen: ["audio/balen-punch-1.m4a", "audio/balen-punch-2.m4a", "audio/sfx-nepali-1.m4a"],
    kp: ["audio/kp-punch-1.m4a", "audio/kp-punch-2.m4a", "audio/sfx-kehna.m4a"],
    prachanda: ["audio/kp-punch-1.m4a", "audio/sfx-nepali-1.m4a", "audio/sfx-hit-1.m4a"],
    rabi: ["audio/rabi-punch-1.m4a", "audio/rabi-punch-2.m4a"],
    harka: ["audio/harka-punch-1.m4a", "audio/harka-punch-2.m4a"],
    punya: ["audio/punya-punch-1.m4a", "audio/punya-punch-2.m4a", "audio/nepal-laugh.m4a"],
    deuba: ["audio/punya-punch-1.m4a", "audio/sfx-nepali-2.m4a", "audio/aye-haye.m4a"],
    raja: ["audio/balen-punch-1.m4a", "audio/sfx-nepali-1.m4a", "audio/anime-punch.m4a"],
    madhesh: ["audio/harka-punch-1.m4a", "audio/sfx-arey.m4a", "audio/sfx-hit-2.m4a"],
    nepal: ["audio/punya-punch-2.m4a", "audio/nepal-laugh.m4a", "audio/sfx-joke.m4a"],
    ashika: ["audio/ashika-punch-1.m4a", "audio/ashika-punch-2.m4a"]
  };
  const list = soundMap[charName] || soundMap.balen;
  const file = list[Math.floor(Math.random() * list.length)];
  try {
    let audio = characterVoiceCache.get(file);
    if (!audio) {
      audio = Kt(file);
      characterVoiceCache.set(file, audio);
    }
    audio.volume = Math.min(1, (typeof mo !== "undefined" ? mo : 0.6) * vol * 1.6);
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch (_) {}
}
function playCharacterHurtVoice(charName, vol = 0.45) {
  if (typeof mo !== "undefined" && mo <= 0.001) return;
  const hurtMap = {
    balen: "audio/balen-hurt.m4a",
    kp: "audio/kp-hurt.m4a",
    prachanda: "audio/kp-hurt.m4a",
    rabi: "audio/rabi-hurt.m4a",
    punya: "audio/punya-hurt.m4a",
    deuba: "audio/punya-hurt.m4a",
    harka: "audio/harka-hurt.m4a",
    raja: "audio/balen-hurt.m4a",
    madhesh: "audio/harka-hurt.m4a",
    nepal: "audio/punya-hurt.m4a",
    ashika: "audio/ashika-hurt.m4a"
  };
  const file = hurtMap[charName] || "audio/balen-hurt.m4a";
  try {
    let audio = characterVoiceCache.get(file);
    if (!audio) {
      audio = Kt(file);
      characterVoiceCache.set(file, audio);
    }
    audio.volume = Math.min(1, (typeof mo !== "undefined" ? mo : 0.6) * vol * 1.5);
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch (_) {}
}
function playCombo9Sound() {
  if (typeof mo !== "undefined" && mo <= 0.001) return;
  try {
    const file = "audio/combo-9.m4a";
    let audio = characterVoiceCache.get("combo-9");
    if (!audio) {
      audio = Kt(file);
      characterVoiceCache.set("combo-9", audio);
    }
    audio.volume = Math.min(1, (typeof mo !== "undefined" ? mo : 0.6) * 0.9);
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch (_) {}
}
window.playCharacterFunnyVoice = playCharacterFunnyVoice;
window.playCharacterHurtVoice = playCharacterHurtVoice;
window.playCombo9Sound = playCombo9Sound;

const viralReelSounds = {
  punch: ["audio/sfx-hit-1.m4a", "audio/sfx-hit-2.m4a"],
  kick: ["audio/sfx-hit-2.m4a", "audio/anime-punch.m4a"],
  block: ["audio/sfx-hit-1.m4a"],
  super: ["audio/vine-boom.m4a"],
  ko: ["audio/sfx-nepali-1.m4a", "audio/sfx-nepali-2.m4a"]
};

function playSoundFile(url, volume = 0.38, priority = 1) {
  if (mo <= 0.001) return;
  if (activeSfxAudio && activeSfxPriority > priority) return;
  try {
    if (activeSfxAudio) {
      try { activeSfxAudio.pause(); } catch {}
      activeSfxAudio = null;
      activeSfxPriority = 0;
    }
    const src = Vn(url), a = new Audio(src);
    a.volume = Math.max(0, Math.min(1, volume * mo));
    src !== url && a.addEventListener("error", () => { a.src = url; a.play().catch(() => {}); }, { once: true });
    activeSfxAudio = a;
    activeSfxPriority = priority;
    const done = () => { if (activeSfxAudio === a) { activeSfxAudio = null; activeSfxPriority = 0; } };
    a.addEventListener("ended", done, { once: true });
    a.addEventListener("error", done, { once: true });
    setTimeout(done, 1600);
    a.play().catch(done);
  } catch {}
}

function playCharacterVoice(charName, action) {
  // Silence normal attack shouts to keep fighting audio crisp and clean like Fightkaro
  if (action === "punch" || action === "kick" || action === "hurt") return;
  if (mo <= 0.001) return;
  if (typeof pe !== "undefined" && pe.active) return;
  if (typeof z !== "undefined" && z === "cinematic") return;
  const now = performance.now();
  if (now - lastVoiceTime < 1200) return;
  lastVoiceTime = now;
  const cfg = voiceClips[charName] || voiceClips.balen;
  const list = cfg[action];
  if (!list || !list.length) return;
  const url = list[Math.floor(Math.random() * list.length)];
  try {
    if (activeVoiceAudio) { try { activeVoiceAudio.pause(); } catch {} activeVoiceAudio = null; }
    const src = Vn(url), a = new Audio(src);
    a.volume = Math.max(0, Math.min(1, 0.32 * mo));
    src !== url && a.addEventListener("error", () => { a.src = url; a.play().catch(() => {}); }, { once: true });
    activeVoiceAudio = a;
    a.addEventListener("ended", () => { if (activeVoiceAudio === a) activeVoiceAudio = null; }, { once: true });
    a.play().catch(() => {});
  } catch {}
}

function playCombatActionSound(charName, action) {
  if (action === "block") {
    playFightkaroSfx("block", 0.45);
  }
}

function playPhysicalSwing(type) {
  if (mo <= 0.001) return;
  const nowMs = performance.now();
  if (nowMs - lastSwingTime < 110) return;
  lastSwingTime = nowMs;
  playFightkaroSfx("whoosh", 0.38);
}

function ss(e) {
  if (mo <= 0.001) return;
  const ctx = ensureAudioCtx();
  if (!ctx || !FeBus) return;
  try {
    const now = ctx.currentTime;
    if (e === 160) {
      const sub = ctx.createOscillator(), sg = ctx.createGain();
      sub.type = "triangle"; sub.frequency.setValueAtTime(110, now); sub.frequency.exponentialRampToValueAtTime(36, now + 0.085);
      sg.gain.setValueAtTime(0.08 * mo, now); sg.gain.exponentialRampToValueAtTime(0.001, now + 0.095);
      sub.connect(sg); sg.connect(FeBus); sub.start(now); sub.stop(now + 0.10);
    } else if (e === 240) {
      const m1 = ctx.createOscillator(), mg = ctx.createGain();
      m1.type = "triangle"; m1.frequency.setValueAtTime(420, now); m1.frequency.exponentialRampToValueAtTime(220, now + 0.065);
      mg.gain.setValueAtTime(0.04 * mo, now); mg.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
      m1.connect(mg); mg.connect(FeBus); m1.start(now); m1.stop(now + 0.08);
    } else if (e === 420) {
      const p1 = ctx.createOscillator(), pg = ctx.createGain();
      p1.type = "sine"; p1.frequency.setValueAtTime(760, now); p1.frequency.exponentialRampToValueAtTime(1180, now + 0.16);
      pg.gain.setValueAtTime(0.075 * mo, now); pg.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
      p1.connect(pg); pg.connect(FeBus); p1.start(now); p1.stop(now + 0.20);
    } else if (e <= 90) {
      const boom = ctx.createOscillator(), bg = ctx.createGain();
      boom.type = "sine"; boom.frequency.setValueAtTime(115, now); boom.frequency.exponentialRampToValueAtTime(28, now + 0.30);
      bg.gain.setValueAtTime(0.16 * mo, now); bg.gain.exponentialRampToValueAtTime(0.001, now + 0.33);
      boom.connect(bg); bg.connect(FeBus); boom.start(now); boom.stop(now + 0.35);
    }
  } catch {}
}

function playSpecialFx(type) {
  if (mo <= 0.001) return;
  try {
    if (type === "fight") {
      playFightkaroSfx("whoosh", 0.45);
    } else if (type === "victory") {
      playFightkaroSfx("hit_3", 0.5);
    }
  } catch {}
}
function Y(){return!1}function is({onOpen:e,onClose:o}){const t=document.createElement("dialog");t.id="how-to-play-dialog",t.setAttribute("aria-labelledby","how-to-play-title"),t.innerHTML=`<button class="help-close" aria-label="Close how to play" data-close-help autofocus>&times;</button>
 <p class="help-eyebrow">THE 30-SECOND GUIDE</p><h2 id="how-to-play-title">HOW TO <em>PLAY.</em></h2>
 <p class="help-goal">Win the required rounds: two in solo, or the room's setting with friends. Knock out your rival, or lead on health when time runs out.</p>
 <div class="help-moves">
 <div><span class="help-keys"><kbd>A</kbd><kbd>D</kbd></span><p><b>MOVE</b><span>Get close to land hits. Step back to make them miss.</span></p></div>
 <div><span class="help-keys"><kbd>J</kbd></span><p><b>PUNCH</b><span>Tap for a fast jab. Land J, J, J for jab, cross, uppercut. Jab and cross are high: a crouching rival ducks them.</span></p></div>
 <div><span class="help-keys"><kbd>K</kbd></span><p><b>KICK</b><span>Longer reach, and a mid: it hits crouching rivals. K, K chains into a roundhouse (high). Forward + J / K: uppercut (mid) / roundhouse.</span></p></div>
 <div><span class="help-keys"><kbd>W</kbd></span><p><b>JUMP</b><span>W or Up to jump. J / K in the air gives an aerial attack (a mid: block it standing). One per jump.</span></p></div>
 <div><span class="help-keys"><kbd>E</kbd></span><p><b>BLOCK / PARRY</b><span>Hold E to guard highs and mids; tap just before impact to parry. Hold S to crouch: it ducks highs and guards lows, but kicks and uppercuts (mids) hit crouchers.</span></p></div>
 <div><span class="help-keys"><kbd>Q</kbd></span><p><b>EVADE</b><span>A quick backstep avoids hits. Brief cooldown between uses.</span></p></div>
 <div><span class="help-keys"><kbd>S</kbd><small>+</small><kbd>J / K</kbd></span><p><b>LOW JAB / SWEEP</b><span>Hold down and attack. Lows beat a standing guard; hold S to guard them.</span></p></div>
 <div><span class="help-keys"><kbd>E</kbd><small>+</small><kbd>J</kbd></span><p><b>GRAB</b><span>Hold guard and punch to throw. Beats both guards, but it is short range and misses jumping or evading rivals.</span></p></div>
 <div class="help-super"><span class="help-keys"><kbd>L</kbd><small>or</small><kbd>SPACE</kbd></span><p><b>SUPER POWER</b><span>Fill the gold meter by fighting, then unleash your character’s cinematic super: a guaranteed 30 damage that can’t be blocked or dodged.</span></p></div>
 </div>
 <section class="help-guard" aria-labelledby="help-guard-title"><h3 id="help-guard-title">WHAT BLOCKS WHAT</h3>
 <table><thead><tr><th scope="col">Attack</th><th scope="col">Standing guard <kbd>E</kbd></th><th scope="col">Crouch <kbd>S</kbd></th></tr></thead><tbody>
 <tr><th scope="row"><b>HIGH</b><small>Jab, cross, roundhouse</small></th><td class="safe">Blocked</td><td class="safe">Ducked</td></tr>
 <tr><th scope="row"><b>MID</b><small>Kick, uppercut, air attacks</small></th><td class="safe">Blocked</td><td class="hit">Hits you</td></tr>
 <tr><th scope="row"><b>LOW</b><small>Low jab, sweep</small></th><td class="hit">Hits you</td><td class="safe">Blocked</td></tr>
 <tr><th scope="row"><b>GRAB</b><small>Jump or evade to escape</small></th><td class="hit">Hits you</td><td class="hit">Hits you</td></tr>
 <tr><th scope="row"><b>SUPER</b><small>Always 30 damage</small></th><td class="hit">Hits you</td><td class="hit">Hits you</td></tr>
 </tbody></table></section>
 <p class="help-tip"><b>WATCH YOUR GUARD.</b> Blocked hits drain it; an empty guard leaves you stunned. It refills a moment after the last blocked hit.</p>
 <div class="help-extras"><p><b>ON MOBILE</b> Drag the circular pad to move, up to jump, down to crouch. Hold a direction and tap Punch or Kick for low or heavy moves. Use a second finger to attack while moving. Hold Guard to block highs and mids, pull down to guard lows, and tap Punch while holding Guard to grab.</p><p><b>WITH FRIENDS</b> Create or join a four-character room. Rooms hold 2-8 friends. Toggle Ready so everyone can see your status; the host can start anytime. For 3-5 players: round robin then a final. For 6-8: groups, semifinals and a final.</p><p><b>PAUSE</b> Esc pauses solo play. Online matches keep running, including while this guide is open.</p></div>
 <button class="help-done btn-primary" data-close-help>GOT IT. LET’S FIGHT.</button>`,document.body.append(t);const n=document.getElementById("how-to-play");n.addEventListener("click",()=>{t.open||(e(),t.showModal(),t.scrollTop=0)}),t.querySelectorAll("[data-close-help]").forEach(i=>i.addEventListener("click",()=>t.close())),t.addEventListener("click",i=>{if(i.target!==t)return;const s=t.getBoundingClientRect();(i.clientX<s.left||i.clientX>s.right||i.clientY<s.top||i.clientY>s.bottom)&&t.close()}),t.addEventListener("close",()=>{o(),n.focus({preventScroll:!0})})}const Ce=(e,o)=>({...e,...o}),Ke={duration:.32,impact:.13,active:.085,recovery:.11,range:1.4,damage:6,push:1.8,stun:.23,guardDamage:10,radius:.24,height:"high",hitY:2.65},Rt={duration:.5,impact:.23,active:.1,recovery:.2,range:1.62,damage:9,push:3.3,stun:.32,guardDamage:16,radius:.3,height:"mid",hitY:2},go={punch:Ce(Ke,{lunge:1.6,push:1.6,damage:5,chains:{punch:"cross",kick:"kick"}}),cross:Ce(Ke,{duration:.36,impact:.16,damage:7,push:1.8,lunge:2,chains:{punch:"uppercut",kick:"finisher"}}),uppercut:Ce(Ke,{duration:.52,impact:.23,recovery:.22,range:1.38,damage:11,push:1.4,stun:.46,launch:8,knockdown:!0,lunge:1.8,guardDamage:18,height:"mid",hitY:2.2}),kick:Ce(Rt,{lunge:1.4,push:2,damage:9,chains:{kick:"roundhouse"}}),roundhouse:Ce(Rt,{duration:.62,impact:.29,recovery:.24,range:1.5,damage:13,push:4.5,lunge:1.6,knockdown:!0,launch:5,guardDamage:22,height:"high",hitY:2.3}),finisher:Ce(Ke,{duration:.54,impact:.21,recovery:.20,range:1.45,damage:12,push:3.5,lunge:2.2,knockdown:!0,launch:5.5,guardDamage:24,height:"mid",hitY:2.2}),lowJab:Ce(Ke,{duration:.3,impact:.12,range:1.35,damage:4,push:1.2,lunge:1,guardDamage:8,height:"low",hitY:.8,crouching:!0,chains:{punch:"uppercut",kick:"sweep"}}),sweep:Ce(Rt,{duration:.56,impact:.24,range:1.65,damage:8,push:2.5,lunge:1.5,stun:.5,knockdown:!0,launch:3.2,height:"low",hitY:.8,crouching:!0}),airPunch:Ce(Ke,{duration:.34,impact:.12,damage:7,guardDamage:12,height:"mid",air:!0}),airKick:Ce(Rt,{duration:.45,impact:.17,damage:9,air:!0}),grab:Ce(Ke,{duration:.6,impact:.2,recovery:.25,range:1.18,damage:9,push:4,stun:.5,height:"mid",hitY:2,grab:!0}),super:{duration:.72,impact:.35,active:.12,recovery:.28,range:2,damage:30,push:5.8,stun:.52,guardDamage:65,radius:.4,height:"mid",hitY:2.65}},as=.12,no={hit:.065,blocked:.03,super:.12},Bt=5.5,Qe=e=>["kick","roundhouse","sweep","airKick","finisher"].includes(e);function rs(e,o,{crouch:t=!1,forward:n=!1}={}){return o!=="punch"&&o!=="kick"?o:e.y>0||e.vy>0?o==="punch"?"airPunch":"airKick":t?o==="punch"?"lowJab":"sweep":n?o==="punch"?"uppercut":"roundhouse":o}function Xt(e){Object.assign(e,{state:null,roundReaction:null,crouching:!1,airAttackUsed:!1,hp:typeof Ze!=="undefined"?Ze.startingHealth:80,energy:0,guard:100,guardDelay:0,blockTime:0,y:0,vy:0,cd:0,attack:0,attackDuration:.32,block:!1,kind:"",recoil:0,stun:0,vx:0,move:null,buffer:null,combo:0,comboTime:0,dodge:0,dodgeCooldown:0,strikePoint:null,nextHand:0}),e.modelRig&&(e.modelRig.ko=0)}function xn(e,o){let t=go[o];if(!t||e.hp<=0||e.stun>0||e.block&&!e.crouching&&!t.grab||e.dodge>0)return!1;const n=e.attack>0&&e.move?.connected&&e.move.chains?.[o];if(e.cd>0)if(n&&e.move.elapsed>=e.move.impact+e.move.active)o=n,t=go[o];else return(e.cd<.25||n)&&(e.buffer={kind:o,time:n?.4:.27}),!1;if(t.air&&e.airAttackUsed||t.grab&&e.y>0||o==="super"&&e.energy<100)return!1;o==="super"&&(e.energy=0),e.kind=o,e.attack=e.attackDuration=t.duration,e.cd=t.duration+t.recovery,e.block=!1,e.crouching=!!t.crouching,t.air&&(e.airAttackUsed=!0);if(!e.y||e.y<=0)e.vx=e.dir*(t.lunge||1.4)*2.2;const i=Qe(o)||e.nextHand++%2===0?"right":"left";if(!e._simOnly){playFightkaroSfx("whoosh",0.42);if(o.includes("punch")||o==="uppercut"){playCombatActionSound(e.character,"punch");playPhysicalSwing("punch");}else if(o.includes("kick")||o==="sweep"||o==="roundhouse"||o==="airKick"||o==="finisher"){playCombatActionSound(e.character,"kick");playPhysicalSwing("kick");}}return e.move={...t,kind:o,side:i,elapsed:0,previous:0,hit:!1,dir:e.dir},e.buffer=null,!0}function vn(e){return e.hp<=0||e.stun>0||e.attack>0||e.dodgeCooldown>0||e.y>0?!1:(e.dodge=.24,e.dodgeCooldown=.85,e.block=!1,e.buffer=null,e.vx=-e.dir*6,!0)}function cs(e,o){e.cd=Math.max(0,e.cd-o),e.attack=Math.max(0,e.attack-o),e.stun=Math.max(0,e.stun-o),e.comboTime=Math.max(0,e.comboTime-o),e.comboTime===0&&(e.combo=0),e.dodge=Math.max(0,e.dodge-o),e.dodgeCooldown=Math.max(0,e.dodgeCooldown-o),e.guardDelay=Math.max(0,e.guardDelay-o),e.blockTime=e.block?e.blockTime+o:0,e.guardDelay===0&&(e.guard=Math.min(100,e.guard+22*o)),e.y===0&&e.vy<=0&&(e.airAttackUsed=!1),e.buffer&&(e.buffer.time-=o,e.buffer.time<=0?e.buffer=null:(e.cd===0||e.attack>0&&e.move?.connected&&e.move.chains?.[e.buffer.kind]&&e.move.elapsed>=e.move.impact+e.move.active)&&xn(e,e.buffer.kind)),e.move&&(e.move.previous=e.move.elapsed,e.move.elapsed+=o)}function ls(e,o){const t=e.move;if(!t||t.hit||t.elapsed<t.impact)return null;if(t.elapsed>t.impact+t.active&&t.previous>t.impact+t.active)return t.hit=!0,null;const n=o.root.position.x-e.root.position.x;if(Math.abs(n)>t.range+.2||n*t.dir<0||o.dodge>0||t.height==="high"&&o.crouching||t.height==="low"&&o.y>.3||t.grab&&(o.y>0||o.stun>0))return null;const i={x:e.root.position.x+t.dir*(t.range-.4),y:e.y+t.hitY},s=Math.max(o.y+(t.height==="low"?.25:1.35),Math.min(o.y+(o.crouching?2.1:2.95),i.y));if(Math.hypot(i.x-o.root.position.x,i.y-s)>.36+t.radius)return null;t.hit=!0;const a=!t.grab&&o.block&&o.y===0&&o.stun===0&&o.dir===-t.dir&&(t.height==="low"?o.crouching:!o.crouching),c=!a&&!t.grab&&o.block&&o.y===0&&o.stun===0&&o.dir===-t.dir?t.height:null;if(a&&o.blockTime>0&&o.blockTime<=as)return e.stun=.26,e.move=null,e.attack=0,e.buffer=null,o.energy=Math.min(100,o.energy+12),{blocked:!0,parry:!0,damage:0,combo:0,point:i};let r=!1;a&&(o.guard=Math.max(0,o.guard-t.guardDamage),o.guardDelay=1.1,r=o.guard===0);const d=a&&!r?t.kind==="super"?6:0:t.damage;return t.connected=!a||r,o.hp=Math.max(0,o.hp-d),o.vx=t.dir*t.push*(a&&!r?.25:1),o.recoil=a?.3:1,(!a||r)&&(o.stun=r?.75:t.stun,o.block=!1,o.move=null,o.attack=0,o.buffer=null,o.combo=0,t.launch&&(o.vy=t.launch),e.combo++,e.comboTime=1.25),e.energy=Math.min(100,e.energy+(t.kind==="super"?0:a?4:13)),o.energy=Math.min(100,o.energy+6),{blocked:a&&!r,guardBreak:r,damage:d,superHit:t.kind==="super",combo:e.combo,move:t.kind,wrongGuard:c,point:i}}function ds(e,o){if(Math.abs(e.y-o.y)>1.3)return;const t=o.root.position.x-e.root.position.x,n=.9-Math.abs(t);if(n>0){const i=t>=0?1:-1;e.root.position.x-=i*n/2,o.root.position.x+=i*n/2}for(const i of[e,o])i.root.position.x=Math.max(-Bt,Math.min(Bt,i.root.position.x))}function us(e,o=30){return e.hp=Math.max(0,e.hp-o),e.guard=0,e.guardDelay=1.1,e.stun=.7,e.block=!1,e.move=null,e.attack=0,e.buffer=null,e.recoil=1,o}function Fo(e,{move:o=0,block:t=!1,crouch:n=!1},i){e.crouching=e.y===0&&e.stun===0&&(e.attack>0?!!e.move?.crouching:n),e.block=(t||n)&&e.y===0&&e.stun===0&&e.attack===0&&e.dodge===0&&e.guard>0,!e.block&&!e.crouching&&e.stun===0&&e.dodge===0&&(e.root.position.x+=o*3.5*i*(e.attack>0?.25:1)),e.root.position.x=Math.max(-3.2,Math.min(3.2,e.root.position.x))}function ps(e){return e.y!==0||e.vy!==0||e.stun!==0||e.attack!==0||e.dodge!==0?!1:(e.block=!1,e.crouching=!1,e.vy=6.3,!0)}function fs(e,o){e.root.position.x=Math.max(-Bt,Math.min(Bt,e.root.position.x+e.vx*o)),e.vx*=Math.exp(-(e.dodge>0?2:9)*o),e.vy-=17*o,e.y=Math.max(0,e.y+e.vy*o),e.y===0&&e.vy<0&&(e.vy=0)}const q=(e,o,t)=>new se(e,o,t),kn=K.clamp,Xe=e=>(e=kn(e,0,1),e*e*(3-2*e)),hs=new In().setMeshoptDecoder(On),Et=new Map;

const VICTORY_TITLES = {
  balen: "RAPPER PM: DOZER VICTORY SALUTE!",
  kp: "RAIL BAA: SAMRIDDHI MASTERCLASS!",
  prachanda: "COALITION DON: UTHAL-PUTHAL VICTORY!",
  rabi: "GHANTI BHAI: PRIME-TIME WIN!",
  punya: "BHASHAN BRO: COSMIC DEBATE KNOCKOUT!",
  deuba: "PANCH-TIME DAI: 7-TERM ASTROLOGY WIN!",
  harka: "SHRAMDAN HERO: DHARAN ROCK SOLID WIN!",
  raja: "HALO RAJA: ROYAL HERITAGE TRIUMPH!",
  madhesh: "MADHESH TIGER: TERAI THUNDER ROAR!",
  nepal: "CHIYA MANTRI: MANIFESTO REVOLUTION!",
  ashika: "CHIYA MANTRI: MANIFESTO REVOLUTION!"
};


const portraitTextureCache = new Map();
function getPortraitTexture(charId) {
  const cid = charId === "ashika" ? "nepal" : charId;
  if (portraitTextureCache.has(cid)) return portraitTextureCache.get(cid);
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#dfa175";
  ctx.fillRect(0, 0, 256, 256);
  const tex = new Yt(canvas);
  tex.colorSpace = at;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = "portraits/" + cid + ".png";
  img.onload = () => {
    ctx.clearRect(0, 0, 256, 256);
    ctx.save();
    ctx.beginPath();
    ctx.arc(128, 128, 122, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, 0, 0, 256, 256);
    ctx.restore();
    tex.needsUpdate = true;
  };
  portraitTextureCache.set(cid, tex);
  return tex;
}

async function yo(e, o = !1, t = o ? "kp" : "balen") {
  t = ["balen", "kp", "prachanda", "rabi", "punya", "deuba", "harka", "raja", "madhesh", "nepal", "ashika"].includes(t) ? t : "balen";
  const i = Do(t), s = ae ? Do(t, !1) : null;
  async function a(v, h) {
    return Et.has(v) || Et.set(v, hs.loadAsync(v).catch(async R => {
      try { if (h) return await a(h); } catch {}
      throw Et.delete(v), R;
    })), Et.get(v);
  }
  const c = await a(i, s), l = { scene: Hn(c.scene) }, r = {}, d = [];
  if (l.scene.traverse(v => {
    v.isBone && (r[v.name] = v);
    if (v.isMesh) {
      v.material = v.material.clone();
      d.push(v.material);
      v.castShadow = !0;
      v.receiveShadow = !0;
      v.frustumCulled = !1;
    }
  }), Object.keys(r).length !== 19) {
    throw new Error("Character skeleton is incomplete");
  }
  
  const S = new re;
  S.name = "round-tears";
  S.visible = !1;
  l.scene.add(S);
  const T = new xe(.028, 8, 6), u = new he({ color: 8644095, transparent: !0, opacity: .9, depthWrite: !1 });
  for (let v = 0; v < 6; v++) {
    const h = new j(T, u);
    h.scale.set(.65, 1.6, .65);
    S.add(h);
  }
  d.push(u);
  
  // Authentic human hands with fingers and skin textures
  for (const v of ["left", "right"]) {
    const R = r[v + "Hand"];
    if (R) R.scale.setScalar(1.0);
  }
  
  if (e.modelRig) {
    e.root.remove(e.modelRig.scene);
    e.modelRig.tears?.children[0]?.geometry.dispose();
    for (const v of e.modelRig.materials) v.dispose();
  }
  
  e.root.add(l.scene);
  e.body.visible = !1;
  e.character = t;
  e.isRival = o;
  e.modelRig = {
    scene: l.scene,
    bones: r,
    materials: d,
    tears: S,
    rest: Object.fromEntries(Object.entries(r).map(([v, h]) => [v, h.position.clone()])),
    time: 0,
    hipRest: r.hips.position.clone()
  };
  // Distinct visual styling and accessories for the fighters
  if (r.head) {
    for (let i = r.head.children.length - 1; i >= 0; i--) {
      const c = r.head.children[i];
      if (c.name && c.name.startsWith("npf-")) r.head.remove(c);
    }
  }
  if (r.chest) {
    for (let i = r.chest.children.length - 1; i >= 0; i--) {
      const c = r.chest.children[i];
      if (c.name && c.name.startsWith("npf-")) r.chest.remove(c);
    }
  }
  if (r.hips) {
    for (let i = r.hips.children.length - 1; i >= 0; i--) {
      const c = r.hips.children[i];
      if (c.name && c.name.startsWith("npf-")) r.hips.remove(c);
    }
  }

  if (r.neck) {
    for (let i = r.neck.children.length - 1; i >= 0; i--) {
      const c = r.neck.children[i];
      if (c.name && c.name.startsWith("npf-")) r.neck.remove(c);
    }
  }
  const isCaricatureChar = ["prachanda", "deuba", "raja", "madhesh", "nepal", "ashika"].includes(t);
  if (r.head) {
    if (isCaricatureChar) {
      r.head.scale.set(0.0001, 0.0001, 0.0001);
    } else {
      r.head.scale.set(1.0, 1.0, 1.0);
    }
  }
  if (isCaricatureChar) {
    const normChar = t === "ashika" ? "nepal" : t;
    const suitTintMap = {
      prachanda: 0x52525b,
      deuba: 0x1e293b,
      raja: 0x926116,
      madhesh: 0xe2e8f0,
      nepal: 0x78716c
    };
    const tintColor = suitTintMap[normChar];
    if (tintColor) {
      l.scene.traverse(node => {
        if (node.isMesh && node.material && node.material.map && !node.name.startsWith("npf-")) {
          node.material.color.setHex(tintColor);
        }
      });
    }
    const faceTex = getPortraitTexture(normChar);
    
    if (r.head) {
      const headGroup = new re();
      headGroup.name = "npf-caricature-head";
      
      const skinToneMap = {
        prachanda: 0xe8b896,
        deuba: 0xe6b592,
        raja: 0xdeb08a,
        madhesh: 0xc88e62,
        nepal: 0xeab894
      };
      const skinColor = skinToneMap[normChar] || 0xe2ae88;
      const craniumMat = new ee({ color: skinColor, roughness: 0.65, metalness: 0.05 });
      d.push(craniumMat);
      const cranium = new j(new xe(0.18, 16, 16), craniumMat);
      cranium.position.set(0, 0.10, -0.04);
      cranium.scale.set(0.88, 1.05, 0.90);
      headGroup.add(cranium);
      
      for (const side of [-1, 1]) {
        const ear = new j(new xe(0.045, 8, 8), craniumMat);
        ear.position.set(side * 0.18, 0.10, 0.01);
        ear.scale.set(0.35, 1.0, 0.65);
        headGroup.add(ear);
      }
      
      const faceMat = new ee({
        map: faceTex,
        roughness: 0.55,
        metalness: 0.02,
        transparent: true
      });
      d.push(faceMat);
      const faceMesh = new j(new tn(0.15, 32), faceMat);
      faceMesh.position.set(0, 0.105, 0.155);
      faceMesh.rotation.set(-0.06, 0, 0);
      faceMesh.scale.set(1.0, 1.15, 1.0);
      headGroup.add(faceMesh);
      
      if (normChar === "prachanda") {
        const topiGeo = new ko(0.19, 0.17, 0.16, 16);
        const topiMat = new ee({ color: 0x16161a, roughness: 0.95 });
        const topi = new j(topiGeo, topiMat);
        topi.position.set(0, 0.23, 0.02);
        topi.rotation.set(-0.1, 0, 0.05);
        headGroup.add(topi);
        d.push(topiMat);
        
        const specMat = new ee({ color: 0x1f2937, roughness: 0.3, metalness: 0.8 });
        for (const side of [-1, 1]) {
          const rim = new j(new vo(0.04, 0.006, 4, 12), specMat);
          rim.rotation.x = Math.PI / 2;
          rim.position.set(side * 0.065, 0.12, 0.185);
          headGroup.add(rim);
        }
        const bridge = new j(new ko(0.008, 0.008, 0.045, 4), specMat);
        bridge.rotation.z = Math.PI / 2;
        bridge.position.set(0, 0.12, 0.185);
        headGroup.add(bridge);
        d.push(specMat);
        
        const stacheMat = new ee({ color: 0x18181b, roughness: 0.9 });
        const stache = new j(new vo(0.022, 0.08, 4, 8), stacheMat);
        stache.rotation.z = Math.PI / 2;
        stache.position.set(0, 0.045, 0.185);
        headGroup.add(stache);
        d.push(stacheMat);
      } else if (normChar === "deuba") {
        const hairMat = new ee({ color: 0xc4c1be, roughness: 0.9, metalness: 0.05 });
        const hairTop = new j(new xe(0.185, 14, 12), hairMat);
        hairTop.position.set(0, 0.14, -0.01);
        hairTop.scale.set(0.98, 0.95, 1.05);
        headGroup.add(hairTop);
        for (const side of [-1, 1]) {
          const sideHair = new j(new vo(0.035, 0.12, 4, 8), hairMat);
          sideHair.position.set(side * 0.175, 0.11, 0.04);
          headGroup.add(sideHair);
        }
        d.push(hairMat);
        
        const specMat = new ee({ color: 0x334155, roughness: 0.3, metalness: 0.7 });
        for (const side of [-1, 1]) {
          const rim = new j(new vo(0.042, 0.006, 4, 12), specMat);
          rim.rotation.x = Math.PI / 2;
          rim.position.set(side * 0.068, 0.12, 0.185);
          headGroup.add(rim);
        }
        const bridge = new j(new ko(0.008, 0.008, 0.045, 4), specMat);
        bridge.rotation.z = Math.PI / 2;
        bridge.position.set(0, 0.12, 0.185);
        headGroup.add(bridge);
        d.push(specMat);
      } else if (normChar === "raja") {
        const royalTopiMat = new ee({ color: 0x3e3835, roughness: 0.9 });
        const topi = new j(new ko(0.185, 0.165, 0.15, 16), royalTopiMat);
        topi.position.set(0, 0.22, 0.02);
        topi.rotation.set(-0.06, 0, 0.04);
        headGroup.add(topi);
        d.push(royalTopiMat);
        
        const goldMat = new ee({ color: 0xf59e0b, roughness: 0.25, metalness: 0.85, emissive: 0x451a03 });
        const kalgi = new j(new Yn(0.04, 0.14, 8), goldMat);
        kalgi.position.set(0.14, 0.26, 0.10);
        kalgi.rotation.set(-0.2, 0, -0.3);
        headGroup.add(kalgi);
        d.push(goldMat);
        
        const haloMat = new he({ color: 0xffd700, transparent: true, opacity: 0.85, side: ze });
        const halo = new j(new So(0.25, 0.29, 32), haloMat);
        halo.position.set(0, 0.32, -0.06);
        halo.rotation.x = Math.PI / 2.3;
        headGroup.add(halo);
        d.push(haloMat);
      } else if (normChar === "madhesh") {
        const hairMat = new ee({ color: 0x1c1917, roughness: 0.95 });
        const hair = new j(new xe(0.182, 14, 12), hairMat);
        hair.position.set(0, 0.13, -0.01);
        hair.scale.set(0.96, 0.92, 1.02);
        headGroup.add(hair);
        d.push(hairMat);
        
        const stacheMat = new ee({ color: 0x18181b, roughness: 0.9 });
        const stache = new j(new vo(0.02, 0.07, 4, 8), stacheMat);
        stache.rotation.z = Math.PI / 2;
        stache.position.set(0, 0.04, 0.185);
        headGroup.add(stache);
        d.push(stacheMat);
        
        const specMat = new ee({ color: 0x475569, roughness: 0.4, metalness: 0.6 });
        for (const side of [-1, 1]) {
          const rim = new j(new vo(0.038, 0.006, 4, 12), specMat);
          rim.rotation.x = Math.PI / 2;
          rim.position.set(side * 0.065, 0.115, 0.185);
          headGroup.add(rim);
        }
        d.push(specMat);
      } else if (normChar === "nepal") {
        const topiMat = new ee({ color: 0x991b1b, roughness: 0.9 });
        const topi = new j(new ko(0.19, 0.15, 0.16, 16), topiMat);
        topi.position.set(0, 0.22, 0.01);
        topi.rotation.set(-0.08, 0, -0.05);
        headGroup.add(topi);
        d.push(topiMat);
      }
      
      headGroup.position.set(0, 0.22, 0.02);
      (r.neck || r.head).add(headGroup);
    }
    
    if (r.chest) {
      const chestGroup = new re();
      chestGroup.name = "npf-clothing-accessories";
      
      if (normChar === "prachanda") {
        const badgeMat = new ee({ color: 0xd90429, roughness: 0.3, emissive: 0x7f1d1d, emissiveIntensity: 0.5 });
        const badge = new j(new xe(0.042, 8, 8), badgeMat);
        badge.position.set(0.14, 0.12, 0.17);
        chestGroup.add(badge);
        d.push(badgeMat);
      } else if (normChar === "deuba") {
        const collarMat = new ee({ color: 0xffffff, roughness: 0.5 });
        const collar = new j(new ko(0.14, 0.04, 0.10, 4), collarMat);
        collar.position.set(0, 0.18, 0.12);
        chestGroup.add(collar);
        d.push(collarMat);
        
        const tieMat = new ee({ color: 0xd90429, roughness: 0.5 });
        const tie = new j(new ko(0.042, 0.024, 0.36, 4), tieMat);
        tie.position.set(0, -0.04, 0.175);
        tie.rotation.z = Math.PI;
        chestGroup.add(tie);
        d.push(tieMat);
      } else if (normChar === "raja") {
        const shawlMat = new ee({ color: 0xf59e0b, roughness: 0.65, emissive: 0x78350f, emissiveIntensity: 0.2 });
        const shawl = new j(new ko(0.08, 0.05, 0.58, 6), shawlMat);
        shawl.rotation.set(0.15, 0, 0.62);
        shawl.position.set(-0.02, 0.04, 0.14);
        chestGroup.add(shawl);
        d.push(shawlMat);
      } else if (normChar === "madhesh") {
        const gamchhaMat = new ee({ color: 0x16a34a, roughness: 0.85 });
        for (const side of [-1, 1]) {
          const strip = new j(new ko(0.042, 0.03, 0.48, 4), gamchhaMat);
          strip.position.set(side * 0.11, -0.08, 0.145);
          chestGroup.add(strip);
        }
        const neckLoop = new j(new vo(0.042, 0.26, 4, 12), gamchhaMat);
        neckLoop.rotation.x = Math.PI / 2;
        neckLoop.position.set(0, 0.16, 0.08);
        chestGroup.add(neckLoop);
        d.push(gamchhaMat);
      } else if (normChar === "nepal") {
        const mufflerMat = new ee({ color: 0xdc2626, roughness: 0.8 });
        const muffler = new j(new vo(0.042, 0.28, 4, 12), mufflerMat);
        muffler.rotation.x = Math.PI / 2;
        muffler.position.set(0, 0.16, 0.09);
        chestGroup.add(muffler);
        d.push(mufflerMat);
      }
      
      r.chest.add(chestGroup);
    }
  }

  if (o && r.hips) {
    const rivalMat = new ee({ color: 0x3b82f6, roughness: 0.5, emissive: 0x1d4ed8, emissiveIntensity: 0.3 });
    const belt = new j(new $e(0.24, 0.03, 8, 24), rivalMat);
    belt.name = "npf-rival-belt";
    belt.rotation.x = Math.PI / 2;
    belt.position.set(0, 0, 0);
    r.hips.add(belt);
    d.push(rivalMat);
  }
}

function jt(e, o, t, n) {
  o.parent.updateWorldMatrix(!0, !1);
  const s = e.root.getWorldQuaternion(new yt).multiply(new yt().setFromUnitVectors(t.clone().normalize(), n.clone().normalize()));
  o.quaternion.copy(o.parent.getWorldQuaternion(new yt).invert().multiply(s));
}

function ms(e, o) {
  return o.updateWorldMatrix(!0, !1), e.root.worldToLocal(o.getWorldPosition(new se));
}

function Uo(e, o, t, n, i, s, a) {
  const c = ms(e, o), l = s.clone().sub(c), r = n.length(), d = i.length(),
    S = kn(l.length(), Math.abs(r - d) + .001, r + d - .002),
    T = l.normalize(),
    u = (r * r - d * d + S * S) / (2 * S),
    v = Math.sqrt(Math.max(0, r * r - u * u)),
    h = a.clone().sub(c);
  h.addScaledVector(T, -h.dot(T)).normalize();
  const R = c.clone().addScaledVector(T, u).addScaledVector(h, v),
    D = c.clone().addScaledVector(T, S);
  jt(e, o, n, R.clone().sub(c));
  jt(e, t, i, D.sub(R));
}

function gs(e, o) {
  const t = e.modelRig, n = t.bones;
  t.time += o;
  const i = t.time;
  e.hitFlash = Math.max(0, (e.hitFlash || 0) - o);
  for (const p of t.materials) p.emissive?.setRGB(e.hitFlash * .6, e.hitFlash * .12, 0);
  
  const s = o ? Math.min(1, Math.abs(e.root.position.x - e.lastX) / (o * 2)) : 0;
  e.lastX = e.root.position.x;
  e.walk = K.damp(e.walk, e.superCinematic || e.roundReaction || e.attack > 0 || e.block || e.stun > 0 ? 0 : s, 16, o);
  e.recoil = Math.max(0, e.recoil - o * 5);
  
  const a = e.attack > 0 && !e.roundReaction && !e.superCinematic;
  const c = e.attackDuration || .32;
  const l = c - e.attack;
  const r = e.move?.impact || c * .46;
  const d = Qe(e.kind); // isKick
  const S = e.move?.side || "right";
  const T = S === "right" ? 1 : -1;
  const u = a ? l / r : 0;
  
  // Fightkaro snappy strike kinematics: instant responsive launch, explosive impact
  const strikeProgress = kn(u, 0, 1);
  const recoveryProgress = kn((l - r) / Math.max(0.01, c - r), 0, 1);
  const v = a ? (u < 1 ? Math.pow(strikeProgress, 0.65) : 1 - Math.pow(recoveryProgress, 1.35)) : 0;
  const punchReach = a ? (u < 1 ? Math.pow(strikeProgress, 0.58) : 1 - Math.pow(recoveryProgress, 1.25)) : 0;
  const h = a && u < .45 ? Math.sin(Math.PI * u / .45) : 0;
  const R = a ? (u < .65 ? Xe(u / .65) : 1 - Xe(recoveryProgress)) : 0;
  
  const D = (e.hp <= 0 || e.state === "ko") && !e.superCinematic ? K.damp(t.ko || 0, 1, 5, o) : 0;
  t.ko = D;
  
  const isLoss = e.roundReaction === "lose";
  const isWin = e.roundReaction === "win";
  if (t.reaction !== e.roundReaction) {
    t.reaction = e.roundReaction;
    t.reactionTime = 0;
  }
  t.reactionTime = (t.reactionTime || 0) + o;
  const F = t.reactionTime;
  const H = Xe(F / .32);
  const P = Math.pow(Math.max(0, Math.sin(F * 9)), 2);
  
  t.tears.visible = isLoss && e.state !== "ko";
  t.scene.position.y = Math.sin(i * 3) * .006;
  
  n.hips.position.copy(t.hipRest);
  n.hips.position.y -= (e.crouching ? .46 : .11) + (e.block ? .08 : 0) + D * 1.15 + (e.trainRider ? .43 : 0);
  
  // Boxer idle subtle bounce
  if (!a && !e.block && e.stun === 0 && !isWin && !isLoss && e.y === 0 && !D) {
    n.hips.position.y += Math.sin(i * 6) * 0.018;
  }
  
  // Core dynamic rotation during martial arts strike
  n.hips.position.z += v * (d ? -.07 : .09) - h * .025;
  n.hips.rotation.y = -T * v * (d ? .26 : .38);
  n.spine.rotation.x = (d ? (e.kind === "sweep" ? .32 : -.20) : -.10) * v + e.recoil * .11 + (e.block ? .08 : 0) + D * .45;
  n.spine.rotation.y = -T * v * (d ? .18 : .28);
  n.spine.rotation.z = D * .65;
  n.chest.rotation.y = -T * v * (e.kind === "roundhouse" ? .92 : d ? .42 : .48);
  n.chest.rotation.x = e.block ? .05 : 0;
  n.head.rotation.y = -n.chest.rotation.y * .45;
  n.neck.rotation.x = e.recoil * -.1;
  
  if (e.tornadoPose != null) {
    n.spine.rotation.x = -.08;
    n.chest.rotation.y = Math.sin(i * 3) * .07;
    n.head.rotation.x = -.1;
  }
  if (e.digPose) {
    n.hips.position.y -= .08 + (1 - e.digPose.lift) * .12 + (e.digPose.depth || 0) * .18;
    n.spine.rotation.x = .3 + (1 - e.digPose.lift) * .22;
    n.chest.rotation.y = 0;
    n.head.rotation.x = .15;
  } else if (e.tornadoPose == null) {
    n.head.rotation.x = 0;
  }
  
  if (isLoss) {
    n.hips.position.y -= H * (.055 + P * .008);
    n.spine.rotation.x = H * .12;
    n.chest.rotation.x = H * (.035 + P * .018);
    n.chest.rotation.y = 0;
    n.spine.rotation.z = Math.sin(F * 5) * .008 * H;
    n.head.rotation.x = H * (.17 + P * .025);
    n.head.rotation.y = Math.sin(F * 3) * .035 * H;
    n.neck.rotation.x = 0;
    
    t.tears.children.forEach((p, m) => {
      const L = m < 3 ? -1 : 1, w = (F * 1.65 + m % 3 / 3) % 1;
      const x = t.scene.worldToLocal(n.head.localToWorld(q(L * .105, .09, .3)));
      p.position.copy(x).add(q(L * w * .02, -w * w * .47, .025 * w));
      const y = H * (1 - Xe((w - .72) / .28));
      p.scale.set(.6 * y, (1 + w) * y, .6 * y);
    });
  }
  
  const char = e.character || (e.isRival ? "kp" : "balen");
  for (const [p, m] of [["left", -1], ["right", 1]]) {
    const isLeadHand = (p === S);
    
    // Natural, character-specific authentic hand stances matching Fightkaro:
    let w, x;
    if (char === "kp") {
      // KP Sharma Oli: Veteran orator and statesman rhetorical gesture
      if (p === "right") {
        w = q(0.24, 2.52 + Math.sin(i * 3.2) * 0.025, 0.62 + Math.cos(i * 2.8) * 0.02);
        x = q(0.48, 2.22, 0.35);
      } else {
        w = q(-0.26, 2.15 + Math.cos(i * 3.2) * 0.015, 0.04);
        x = q(-0.44, 2.05, -0.05);
      }
    } else if (char === "balen") {
      // Balen Shah: Cool street-swagger / hip-hop stance with low, relaxed hands
      if (p === "right") {
        w = q(0.22, 2.38 + Math.sin(i * 3.5) * 0.025, 0.65 + Math.cos(i * 3) * 0.02);
        x = q(0.46, 2.16, 0.30);
      } else {
        w = q(-0.25, 2.24 + Math.cos(i * 3.5) * 0.02, 0.32);
        x = q(-0.45, 2.08, 0.12);
      }
    } else if (char === "rabi") {
      // Rabi Lamichhane: Dynamic investigative stance, alert and agile
      if (p === "right") {
        w = q(0.22, 2.48 + Math.sin(i * 4) * 0.02, 0.68);
        x = q(0.44, 2.20, 0.28);
      } else {
        w = q(-0.18, 2.58 + Math.cos(i * 4) * 0.02, 0.42);
        x = q(-0.38, 2.25, 0.18);
      }
    } else if (char === "harka") {
      // Harka Sampang: Grounded Dharan laborer stance, firm wide hands
      w = q(m * 0.26, 2.30 + Math.sin(i * 3 + m) * 0.02, p === "right" ? 0.62 : 0.42);
      x = q(m * 0.52, 2.12, 0.26);
    } else if (char === "punya") {
      // Punya Gautam: Emphatic debate stance
      if (p === "right") {
        w = q(0.22, 2.65 + Math.sin(i * 4) * 0.03, 0.55);
        x = q(0.46, 2.26, 0.25);
      } else {
        w = q(-0.24, 2.20 + Math.cos(i * 4) * 0.02, 0.18);
        x = q(-0.44, 2.08, 0.05);
      }
    } else {
      // Ashika Tamang & default
      w = q(m * 0.22, 2.44 + Math.sin(i * 3.8 + m) * 0.02, p === "right" ? 0.64 : 0.45);
      x = q(m * 0.44, 2.20, 0.24);
    }
    
    if (e.block) {
      // Tight defensive martial arts forearm guard
      w = q(m * .14, 2.65, .50);
      x = q(m * .36, 2.35, .32);
    } else if (isLeadHand && !d && a) {
      // ACTIVE STRIKING HAND: Full Fightkaro-style punch extension
      let punchTargetZ = 1.84;
      let punchTargetY = 2.48;
      let punchTargetX = m * .06;
      
      if (e.kind === "uppercut") {
        punchTargetZ = 1.52;
        punchTargetY = 3.05;
        punchTargetX = m * .08;
      } else if (e.kind === "lowJab") {
        punchTargetZ = 1.72;
        punchTargetY = 1.82;
        punchTargetX = m * .04;
      } else if (e.kind === "super") {
        punchTargetZ = 2.05;
        punchTargetY = 2.55;
        punchTargetX = 0;
      } else if (e.kind === "grab") {
        punchTargetZ = 1.30;
        punchTargetY = 2.45;
      }
      
      w.lerp(q(punchTargetX, punchTargetY, punchTargetZ), punchReach);
      x.lerp(q(m * .40, punchTargetY - .25, punchTargetZ * .45), punchReach);
    } else if (!isLeadHand && a) {
      // OFF-HAND TIGHT GUARD PROTECTING BODY/CHEST
      w = q(m * .18, 2.45, .35);
      x = q(m * .42, 2.15, .18);
    }
    
    if (e.trainRider) {
      w = q(m * .28, 2.18, .48);
      x = q(m * .65, 2.05, .15);
    }
    if (e.mountainSeat) {
      w = q(m * .22, 1.82, .62);
      x = q(m * .42, 2.12, .3);
    }
    if (e.digPose) {
      const C = e.digPose.lift, f = (e.digPose.depth || 0) * .35;
      w = p === "left" ? q(-.08, 2.5 + C * .18 - f, .57) : q(.12, 1.84 + C * .48 - f, .78);
      x = q(m * .55, 2.12 - f, .4);
    }
    if (e.tornadoPose != null) {
      w = q(m * (.55 + .14 * e.tornadoPose), 2.45 + .25 * e.tornadoPose, .35);
      x = q(m * .65, 2.15, .3);
    }
    if (e.superVictim && !e.trainRider) {
      w = q(m * (.35 + (e.superFall || 0) * .2), 2.05 + (e.superFall || 0) * .55, .26);
      x = q(m * .65, 2.05, .15);
    }
    if (e.superRecovery != null) {
      w.lerp(q(m * .23, 2.78, .4), e.superRecovery);
      x.lerp(q(m * .63, 2.17, .28), e.superRecovery);
    }
    
    if (isLoss) {
      const C = (1 - Math.cos(F * 8)) * .5;
      const f = p === "right" ? e.root.worldToLocal(n.head.localToWorld(q(.12 + C * .035, -.12 + C * .035, .34))) : q(-.24, 2.32 + P * .012, .39);
      w.lerp(f, H);
      x.lerp(q(m * .43, p === "right" ? 2.48 : 2.06, .4), H);
    }
    
    if (isWin) {
      // SPECIAL SATIRICAL VICTORY POSES PER CHARACTER:
      const char = e.character || "balen";
      const pt = i;
      if (char === "balen") {
        // Balen: Dozer Victory Salute & Rap King Swagger
        if (p === "right") {
          w = q(.32, 3.48 + Math.sin(pt * 3) * .04, .35);
          x = q(.58, 2.95, .15);
        } else {
          w = q(-.25, 2.15, .12);
          x = q(-.48, 2.10, .05);
        }
        n.chest.rotation.x = -.14;
        n.head.rotation.x = -.12;
        n.spine.rotation.z = Math.sin(pt * 4) * .03;
      } else if (char === "kp") {
        // KP Oli: Tukka & Geopolitical Lecture Pose
        if (p === "right") {
          w = q(.24, 2.85 + Math.sin(pt * 4) * .06, .78 + Math.cos(pt * 3) * .05);
          x = q(.50, 2.45, .35);
        } else {
          w = q(-.16, 2.18, -.18);
          x = q(-.42, 2.12, -.05);
        }
        n.spine.rotation.x = -.05;
        n.head.rotation.y = Math.sin(pt * 3) * .14;
        n.head.rotation.x = .04;
      } else if (char === "rabi") {
        // Rabi Lamichhane: Ghanti Victory Bell Celebration
        const pumpL = Math.sin(pt * 7);
        const pumpR = Math.sin(pt * 7 + Math.PI);
        if (p === "left") {
          w = q(-.38, 3.42 + pumpL * .16, .22);
          x = q(-.62, 2.95, .12);
        } else {
          w = q(.38, 3.42 + pumpR * .16, .22);
          x = q(.62, 2.95, .12);
        }
        t.scene.position.y += Math.max(0, Math.sin(pt * 7)) * .12;
        n.spine.rotation.x = -.08;
        n.head.rotation.x = -.16;
      } else if (char === "harka") {
        // Harka Sampang: Dharan Shram Daan Double-Bicep Flex
        if (p === "left") {
          w = q(-.46, 3.12, .32);
          x = q(-.76, 2.52, .12);
        } else {
          w = q(.46, 3.12, .32);
          x = q(.76, 2.52, .12);
        }
        n.chest.rotation.x = -.18;
        n.spine.rotation.x = -.06;
        n.head.rotation.x = Math.sin(pt * 4) * .08;
      } else if (char === "punya") {
        // Punya Gautam: Viral Intellectual Debate Champion
        if (p === "right") {
          w = q(.20, 3.48 + Math.sin(pt * 5) * .05, .42);
          x = q(.46, 2.95, .22);
        } else {
          w = q(-.42, 2.55, .52);
          x = q(-.65, 2.25, .28);
        }
        n.spine.rotation.x = -.06;
        n.head.rotation.x = Math.sin(pt * 9) * .12;
      } else if (char === "ashika") {
        // Ashika Tamang: Revolutionary Power Fist
        if (p === "right") {
          w = q(.18, 3.68 + Math.sin(pt * 4) * .05, .18);
          x = q(.42, 3.15, .12);
        } else {
          w = q(-.24, 2.72, .38);
          x = q(-.48, 2.28, .22);
        }
        n.chest.rotation.x = -.20;
        n.head.rotation.x = -.14;
      }
    }
    
    if (D) w.lerp(q(m * .32, 1.35 - D * .75, .22), D);
    
    Uo(e, n[p + "UpperArm"], n[p + "ForeArm"], t.rest[p + "ForeArm"], t.rest[p + "Hand"], w, x);
    let handAim;
    if (isLoss && p === "right") {
      handAim = q(0, .2, .035);
    } else if (e.digPose) {
      handAim = q(0, .2, .1);
    } else if (isLeadHand && !d && a) {
      handAim = q(m * .02, 0, 1);
    } else if (char === "kp" && p === "right") {
      handAim = q(0.08, 0.22, 0.65);
    } else if (char === "balen") {
      handAim = p === "right" ? q(0.04, 0.05, 0.75) : q(-0.06, -0.10, 0.30);
    } else {
      handAim = q(m * .04, .10, .50);
    }
    jt(e, n[p + "Hand"], t.rest[p + "Fingers"], handAim);
    n[p + "Fingers"].rotation.x = (isLeadHand && !d && a) ? 0.85 : (char === "kp" && p === "right") ? 0.15 : 0.40;
    n[p + "Fingers"].rotation.z = 0;
    
    // Kicking legs kinematics
    const isKickingLeg = (p === S);
    const yWalk = Math.sin(i * 8.5 + (m === 1 ? 0 : Math.PI)) * e.walk;
    let E = q(m * .24, .19 + Math.max(0, yWalk) * .1, (m === 1 ? .29 : -.29) + yWalk * .16);
    let I = q(m * .27, .8, 1);
    
    if (e.trainRider) {
      E = q(m * .27, .68, .66);
      I = q(m * .3, 1.6, 1.1);
    }
    if (e.y > 0) {
      E = q(m * .26, .5, .2);
      I = q(m * .27, 1.4, 1);
    }
    if (e.superVictim && !e.trainRider) {
      E.y += (e.superFall || 0) * .28;
      E.z = .12;
      I = q(m * .27, 1.3, 1);
    }
    if (e.crouching) {
      E.z += .14;
      I.y = 1.3;
    }
    
    if (isKickingLeg && d && a) {
      const isAshika = e.character === "ashika";
      let kickTargetZ = 1.65;
      let kickTargetY = 1.65;
      let kickTargetX = m * .12;
      
      if (e.kind === "roundhouse") {
        kickTargetZ = 1.55;
        kickTargetY = 2.25;
        kickTargetX = -m * .15;
      } else if (e.kind === "sweep") {
        kickTargetZ = 1.58;
        kickTargetY = .24;
        kickTargetX = m * .18;
      } else if (e.kind === "airKick") {
        kickTargetZ = 1.70;
        kickTargetY = 1.95;
      }
      
      E.lerp(q(m * .2, isAshika ? .92 : 1.04, .52), R);
      E.lerp(q(kickTargetX, kickTargetY, kickTargetZ), v);
      I = q(m * .22, kickTargetY + .35, kickTargetZ * .6);
    }
    
    if (D > 0) { E.lerp(q(m * .32, .06, -.30), D); I = q(m * .32, .18, -.10); }
    Uo(e, n[p + "Thigh"], n[p + "Shin"], t.rest[p + "Shin"], t.rest[p + "Foot"], E, I);
    jt(e, n[p + "Foot"], q(0, -.03, .055), isKickingLeg && d && a ? q(0, -.03 + v * .05, .055) : q(m * .016, -.03, .055));
  }
  
  e.root.updateWorldMatrix(!0, !0);
  e.strikePoint = n[S + (d ? "Foot" : "Hand")].getWorldPosition(new se);
}
const ys="assets/photo-head-qFIVVocg.png";function bs(){const e=new po().load(ys);e.colorSpace=at;const o=[[69,119],[70,90],[80,58],[104,36],[137,22],[166,24],[194,30],[221,44],[240,67],[249,100],[248,145],[257,162],[256,190],[245,210],[238,239],[220,270],[196,291],[168,303],[142,301],[116,291],[94,272],[80,245],[73,220],[63,206],[61,181],[66,157]],t=[],n=[],i=[],s=12,a=o.length,c=.00255;for(let T=0;T<=s;T++){const u=T/s;for(const[v,h]of o){const R=159+(v-159)*u,D=166+(h-166)*u,b=.105*Math.sqrt(1-u*u)+.025*Math.exp(-(((R-158)/25)**2)-((D-180)/42)**2);t.push((R-159)*c,(303-D)*c,b),n.push(R/312,1-D/390)}}for(let T=0;T<s;T++)for(let u=0;u<a;u++){const v=T*a+u,h=T*a+(u+1)%a,R=v+a,D=h+a;i.push(v,R,h,h,R,D)}const l=new Dn;l.setAttribute("position",new Ho(t,3)),l.setAttribute("uv",new Ho(n,2)),l.setIndex(i),l.computeVertexNormals();const r=new re,d=new j(l,new he({map:e,side:ze,toneMapped:!1}));r.add(d);const S=new j(new xe(1,32,24),new ee({color:3418664,roughness:.92}));return S.scale.set(.215,.32,.18),S.position.set(0,.37,-.1),r.add(S),S.castShadow=!0,r.position.set(0,1.98,.19),r.name="Dimensional reference head",r}const ws=new se(0,1,0);function Ue(e,o=.72){return new ee({color:e,roughness:o})}function Eo(e,o,t,n=0,i=0,s=0){const a=new j(e,o);return a.position.set(n,i,s),a.castShadow=!0,a.receiveShadow=!0,t.add(a),a}function me(e,o,t,n,i,s,a,c,l=.08){return Eo(new ko(t,n,i,3,l),o,e,s,a,c)}function Ae(e,o,t,n,i,s,a,c){const l=Eo(new xe(1,20,14),o,e,t,n,i);return l.scale.set(s,a,c),l}function Pt(e,o,t,n){const i=Eo(new vo(t,n-2*t,5,12),o,e);return i.userData.length=n,i}function Lt(e,o,t){e.scale.y=o.distanceTo(t)/e.userData.length,e.position.copy(o).add(t).multiplyScalar(.5),e.quaternion.setFromUnitVectors(ws,t.clone().sub(o).normalize())}function Po(e,o,t,n){const i=new re,s=new re;e.add(i),i.add(s),s.scale.set(1,1.38,1);const a=Ue(o),c=Ue(2107702),l=Ue(t),r=Ue(1054238),d=Ue(n?12987197:13019751),S=Ue(5857643);me(s,a,.76,.78,.43,0,1.5,0,.16),me(s,c,.62,.28,.4,0,1.02,0,.1),me(s,Ue(n?14210249:2702396),.24,.68,.04,0,1.52,.225,.02);for(const h of[-1,1])me(s,a,.16,.6,.06,h*.21,1.55,.23,.025),me(s,S,.17,.025,.025,h*.23,1.3,.26,.008);me(s,r,.62,.065,.43,0,1.09,0,.015),Ae(s,l,0,1.98,0,.15,.19,.15);let T=null;if(n){T=bs(),T.scale.y=1/1.38,s.add(T),me(s,d,.59,.14,.43,0,1.92,.04,.055);for(const h of[-1,1])me(s,d,.14,h===1?.61:.8,.065,h*.23,1.55,.28,.025)}else{const h=new re;s.add(h),Ae(h,l,0,2.3,0,.28,.36,.25),Ae(h,r,0,2.55,-.015,.29,.15,.26),me(h,d,.55,.075,.46,0,2.48,.015,.025);for(const R of[-1,1])Ae(h,l,R*.28,2.29,0,.055,.09,.06),me(h,r,.12,.025,.04,R*.11,2.36,.235,.01),Ae(h,r,R*.1,2.31,.243,.025,.018,.014);Ae(h,l,0,2.25,.25,.055,.08,.065),me(h,r,.16,.025,.025,0,2.12,.225,.01);for(const R of h.children)R.position.y-=1.98;h.position.y=1.98,h.scale.set(.85,.85/1.38,.85)}const u=[],v=[];for(const h of[-1,1]){const R=Pt(s,a,.135,.4),D=Pt(s,a,.115,.39),b=Ae(s,a,0,0,0,.135,.135,.135),G=new re;s.add(G),me(G,l,.22,.22,.24,0,0,0,.075),me(G,r,.23,.1,.25,0,-.07,0,.035);for(let m=0;m<4;m++)Ae(G,l,-.075+m*.05,.07,.1,.027,.045,.035);Ae(G,l,h*.12,-.015,.03,.055,.085,.06),u.push({upper:R,lower:D,joint:b,fist:G,side:h});const F=Pt(s,c,.15,.46),H=Pt(s,c,.125,.46),P=Ae(s,c,0,0,0,.14,.14,.14),p=me(s,r,.29,.2,.5,0,0,0,.065);me(p,S,.29,.04,.48,0,-.075,0,.015),v.push({thigh:F,shin:H,knee:P,foot:p,side:h})}return{root:i,body:s,arms:u,legs:v,photoHead:T,hp:100,energy:0,attack:0,cd:0,y:0,vy:0,block:!1,dir:1,kind:"",lastX:0,walk:0,poseTime:0,recoil:0}}function ve(e,o,t){if(e.modelRig){gs(e,o);return}e.poseTime+=o;const n=e.poseTime,i=o?Math.min(1,Math.abs(e.root.position.x-e.lastX)/(o*2)):0;e.lastX=e.root.position.x,e.walk=K.damp(e.walk,i,12,o);const s=e.attack>0?Math.sin(Math.PI*(1-e.attack/(e.attackDuration||.32))):0;e.recoil=Math.max(0,e.recoil-o*5),e.body.position.y=Math.sin(n*3)*.02-(e.crouching?.35:e.block*.07),e.body.rotation.z=-e.dir*(s*.075-e.recoil*.12);const a=(c,l,r=.06)=>new se(c,l,r);e.arms.forEach((c,l)=>{const r=c.side,d=r===e.dir,S=a(r*.43,1.81),T=a(r*.58,1.47,.1),u=a(r*.43,1.76,.37);e.block?(T.set(r*.43,1.78,.25),u.set(r*.23,2.16,.44)):d&&!Qe(e.kind)&&s>0?(T.lerp(a(e.dir*.82,1.83,.12),s),u.lerp(a(e.dir*1.22,e.kind==="uppercut"?2.15:e.kind==="lowJab"?1.25:1.88,.2),s)):(u.y+=Math.sin(n*4+l)*.025,T.x+=Math.sin(n*8+l*Math.PI)*e.walk*.04),Lt(c.upper,S,T),Lt(c.lower,T,u),c.joint.position.copy(T),c.fist.position.copy(u),c.fist.rotation.z=d?-e.dir*s:0}),e.legs.forEach(c=>{const l=c.side,r=a(l*.21,1.02,0),d=a(l*.27,.57,.04),S=a(l*.34,.17,.04),T=Math.sin(n*10+l*Math.PI/2)*e.walk*.13;d.x+=T,S.x+=T,S.y+=Math.max(0,T)*.45,e.y>0&&(d.x+=l*.12,d.y+=.12,S.y+=.15),l===e.dir&&Qe(e.kind)&&(d.lerp(a(e.dir*.65,1.24,.06),s),S.lerp(a(e.dir*1.12,e.kind==="sweep"?.65:e.kind==="roundhouse"?1.85:1.49,.06),s)),Lt(c.thigh,r,d),Lt(c.shin,d,S),c.knee.position.copy(d),c.foot.position.copy(S),c.foot.rotation.z=l===e.dir&&Qe(e.kind)?e.dir*s*.9:0}),e.photoHead&&(e.photoHead.rotation.y=e.dir*.12,e.photoHead.rotation.z=e.recoil*e.dir*.06)}const so=e=>Math.max(-5.5,Math.min(5.5,e)),Go=e=>(e=Math.max(0,Math.min(1,e)),e*e*(3-2*e));function Bo(e){return e<3.65?-8+Go((e-.9)/(3.65-.9))*(8-2.64):-2.64+Go((e-3.65)/(6.85-3.65))*(15+2.64)}function xs(e,o){const t=e<=o?1:-1;let n=so(o+t*1.15),i=so(e);return(n-i)*t<1.8&&(i=so(n-t*1.8)),{actorX:i,victimX:n}}function vs(e,{height:o=0,upward:t=4.8,gravity:n=15,speed:i=4.2,bounce:s=.1}={}){const a=Math.max(0,e),c=(t+Math.sqrt(t*t+2*n*Math.max(0,o)))/n,l=a-c,r=l<0?o+t*a-n*a*a/2:l<.28?4*s*(l/.28)*(1-l/.28):0;return{y:Math.max(0,r),travel:i/1.8*(1-Math.exp(-1.8*a)),landed:l>=0,landTime:c}}const rt=new se,It=new se,ks=new se(0,1,0),Ge=e=>(e=K.clamp(e,0,1),e*e*(3-2*e));function Mn(e){const o=e.modelRig;if(o.floorSamples)return o.floorSamples;const t=[],n=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];for(const i of[-1,1])for(const s of[-1,1])for(const a of[-1,1])n.push([i,s,a]);return o.scene.traverse(i=>{if(!i.isMesh||i.parent===o.tears)return;if(!i.isSkinnedMesh){i.geometry.computeBoundingSphere(),t.push({mesh:i});return}const s=i.geometry.attributes.position,a=i.geometry.attributes.skinIndex,c=i.geometry.attributes.skinWeight,l=new Map,r=new Set;for(let d=0;d<s.count;d++){d%Math.max(1,Math.ceil(s.count/256))===0&&r.add(d);let S=0;for(let v=1;v<4;v++)c.getComponent(d,v)>c.getComponent(d,S)&&(S=v);const T=a.getComponent(d,S);let u=l.get(T);u||(u=n.map(()=>({value:-1/0,index:0})),l.set(T,u));for(let v=0;v<n.length;v++){const h=n[v],R=s.getX(d)*h[0]+s.getY(d)*h[1]+s.getZ(d)*h[2];R>u[v].value&&(u[v]={value:R,index:d})}}for(const d of l.values())for(const S of d)r.add(S.index);t.push({mesh:i,ids:[...r]})}),o.floorSamples=t}function Ms(e){e.root.updateWorldMatrix(!0,!1),e.root.updateMatrixWorld(!0);let o=1/0;for(const t of Mn(e)){const{mesh:n,ids:i}=t;if(i)for(const s of i)n.getVertexPosition(s,rt),rt.applyMatrix4(n.matrixWorld),o=Math.min(o,rt.y);else rt.copy(n.geometry.boundingSphere.center).applyMatrix4(n.matrixWorld),n.getWorldScale(It),o=Math.min(o,rt.y-n.geometry.boundingSphere.radius*Math.max(It.x,It.y,It.z))}return o}function nt(e){const o=Ms(e),t=Math.max(0,.09-o);return Number.isFinite(t)&&t>0&&(e.root.position.y+=t,e.root.updateMatrixWorld(!0)),t}function Vt(e){e.physics={landing:xs(e.ax,e.bx),scales:[e.actor.root.scale.clone(),e.victim.root.scale.clone()],recovery:null,launch:null};for(const[o,t]of[e.actor,e.victim].entries())t.crouching=!1,t.mountainSeat=!1,t.superCinematic=!0,t.superVictim=o===1,t.superFall=0,t.superRecovery=null,t.walk=0,t.recoil=0,t.y=t.vy=t.vx=0,t.roundReaction=null,Mn(t)}function Jt(e,o,t,n,i){const s=e.victim,a=e.physics;a.launch||(a.launch={position:s.root.position.clone(),quaternion:s.root.quaternion.clone()});const c=vs(o,{height:a.launch.position.y,...t});s.superFall=1-Ge((o-c.landTime)/.25);const l=(t.lateralTravel||0)*Ge(o/(t.lateralDuration||.7));s.root.position.set(K.clamp(a.launch.position.x+e.dir*c.travel,-5.5,5.5),c.landed?0:c.y,a.launch.position.z*(1-Ge(o/.7))+l);const r=new yt().setFromEuler(new Nn(-.08*Ge(o/.3),s.dir*.6,(t.rollSign||e.dir)*1.48*Ge(o/(c.landTime+.1))));s.root.quaternion.copy(a.launch.quaternion).slerp(r,Ge(o/.18)),ve(s,n),nt(s),c.landed&&c.y>0&&(s.root.position.y+=c.y,s.root.updateMatrixWorld(!0))}function _t(e,o,t,n,i){const s=Ge((o-(t-.85))/.85);if(s<=0)return!1;const a=e.physics;a.recovery||(a.recovery=[e.actor,e.victim].map(c=>({position:c.root.position.clone(),quaternion:c.root.quaternion.clone(),scale:c.root.scale.clone()})));for(const[c,l]of[e.actor,e.victim].entries()){const r=a.recovery[c],d=new se(c?a.landing.victimX:a.landing.actorX,0,0);l.mountainSeat=!1,l.trainRider=c===0&&l.character==="balen"&&s<.55,l.digPose=null,l.tornadoPose=null,l.superFall=0,l.superRecovery=s,l.root.position.copy(r.position).lerp(d,s),c===0?(l.root.position.y+=Math.sin(s*Math.PI)*.25,l.character==="balen"&&(l.root.position.z+=Math.sin(s*Math.PI)*.9)):l.root.position.y=0,l.root.quaternion.copy(r.quaternion).slerp(new yt().setFromAxisAngle(ks,l.dir*1.15),s),l.root.scale.copy(r.scale).lerp(a.scales[c],s),ve(l,n),nt(l)}return!0}function Qt(e,o,t=!1){const n=e.physics;for(const[i,s]of[e.actor,e.victim].entries())s.crouching=!1,s.mountainSeat=!1,s.trainRider=!1,s.digPose=null,s.tornadoPose=null,s.superCinematic=!1,s.superVictim=!1,s.superFall=0,s.superRecovery=null,s.root.scale.copy(n.scales[i]),s.root.rotation.set(0,s.dir*1.15,0),s.root.position.set(t?i?n.landing.victimX:n.landing.actorX:i?e.bx:e.ax,0,0),s.y=s.vy=s.vx=s.attack=s.cd=0,s.move=null,s.block=!1,s.walk=0,s.lastX=s.root.position.x,ve(s,0);e.victim.stun=t?.25:0}const st = {
  balen: { owner: "RAPPER PM", name: "KMC DOZER DROP", subtitle: "Metro Beatdown" },
  kp: { owner: "RAIL BAA", name: "PANI-JAHAJ & RAIL EXPRESS", subtitle: "Samriddhi Tactician" },
  prachanda: { owner: "COALITION DON", name: "UTHAL-PUTHAL SAMIKARAN", subtitle: "Master of Samikaran" },
  rabi: { owner: "GHANTI BHAI", name: "SIDHA KURA MEGA GHANTI", subtitle: "Prime-Time Striker" },
  punya: { owner: "BHASHAN BRO", name: "SANSAD MIC-DROP TORNADO", subtitle: "Debate Dynamo" },
  deuba: { owner: "PANCH-TIME DAI", name: "JYOTISHI 7-TERM PALM", subtitle: "Five-Term Veteran" },
  harka: { owner: "SHRAMDAN HERO", name: "KOKAHA BOULDER & PIPE", subtitle: "Dharan Powerhouse" },
  raja: { owner: "HALO RAJA", name: "ROYAL HALO CYCLONE", subtitle: "Heritage Striker" },
  madhesh: { owner: "MADHESH TIGER", name: "TERAI BIJULI TUFAN", subtitle: "Terai Thunder" },
  nepal: { owner: "CHIYA MANTRI", name: "GHOSANA PATRA & CHIYA STORM", subtitle: "Manifesto Trickster" },
  ashika: { owner: "CHIYA MANTRI", name: "GHOSANA PATRA & CHIYA STORM", subtitle: "Manifesto Trickster" }
};

const satireNewsData = {
  balen: {
    name: "Balen Shah (Rapper PM)",
    title: "Mayor of Kathmandu",
    excuses: [
      "The referee was appointed during the previous ruling alliance! We will issue a 35-day demolition notice for this ring tomorrow.",
      "My dark shades fogged up under the arena lights. A municipal budget tender has been approved for anti-fog lenses.",
      "The opponent encroached upon Bagmati public land. Legally, their punches were an unauthorized construction."
    ]
  },
  kp: {
    name: "KP Sharma Oli (Rail Baa)",
    title: "CPN-UML Chairman",
    excuses: [
      "This defeat is merely a literary metaphor. Geopolitically and theoretically, I remain undefeated.",
      "The canvas was not made of indigenous turmeric. If we had my high-speed rail running through here, the outcome would be different.",
      "The referee took unconstitutional steps to count to ten. I am filing a writ petition immediately."
    ]
  },
  prachanda: {
    name: "Pushpa Kamal Dahal (Coalition Don)",
    title: "CPN (Maoist Centre) Chairman",
    excuses: [
      "This loss was a tactical retreat! I am already forming a brand new governing coalition inside the referee's dressing room.",
      "There was an unexpected Uthal-Puthal in the balance of power during round 2. Dialectical materialism predicted this.",
      "The opponent violated the comprehensive peace accord by throwing an unscheduled right hook."
    ]
  },
  rabi: {
    name: "Rabi Lamichhane (Ghanti Bhai)",
    title: "RSP President",
    excuses: [
      "They inspected my glove citizenship and confiscated my passport during round 2! I demand a special parliamentary committee!",
      "My bell was ringing continuously during the bout, creating acoustic interference with my left hook.",
      "Give me 24 hours on Facebook Live, and I will expose every single combination they landed on me."
    ]
  },
  punya: {
    name: "Punya Gautam (Bhashan Bro)",
    title: "Senior Political Analyst & Philosopher",
    excuses: [
      "Quantum metaphysical dialectics dictate that the punches I received exist only in an alternate cosmological dimension.",
      "The microphone was not properly grounded! An orator of my caliber cannot deliver a technical knockout without surround sound.",
      "This was not a loss. It was an intellectual seminar where the opponent vigorously demonstrated physical kinetics."
    ]
  },
  deuba: {
    name: "Sher Bahadur Deuba (Panch-Time Dai)",
    title: "Nepali Congress President",
    excuses: [
      "Jyotishi le 7-term PM banne bhanya chha! A sixth term or loss in the ring cannot stop astrologer destiny.",
      "Tapai badhi bolnu bhayo! We will settle this in the central working committee next Tuesday.",
      "Coalition partners failed to coordinate guard duty. Next election, I will fight with a broader alliance."
    ]
  },
  harka: {
    name: "Harka Sampang (Shramdan Hero)",
    title: "Mayor of Dharan",
    excuses: [
      "I was exhausted after carrying 150 river stones this morning in Dharan! Real leaders fight with boulders, not boxing gloves!",
      "These Kathmandu elite arenas have no tap water! Send this opponent to Dharan for pipe-fitting labor!",
      "I did not lose; I voluntarily donated this round to the municipal labor solidarity fund."
    ]
  },
  raja: {
    name: "Gyanendra Shah (Halo Raja)",
    title: "Former King of Nepal",
    excuses: [
      "We have maintained royal restraint in the interest of national unity. Our crown remains firmly poised.",
      "The arena crowd chanting royal slogans distracted our regal footwork. History will deliver the true verdict.",
      "A royal proclamation will be issued tomorrow declaring this boxing match void from inception."
    ]
  },
  madhesh: {
    name: "Upendra Yadav (Madhesh Tiger)",
    title: "JSP Chairman",
    excuses: [
      "The Terai thunder was held back by federal constitutional boundaries! In Janakpur, this would be a clean victory.",
      "Our yellow gamchha slipped during the storm strike. We demand provincial autonomous refereeing!",
      "The 8-point demand was not fulfilled before the bell rang. We will launch an indefinite arena strike."
    ]
  },
  nepal: {
    name: "Madhav Kumar Nepal (Chiya Mantri)",
    title: "Unified Socialist Chairman",
    excuses: [
      "We were on our mandatory 4 PM Chiya break when the opponent threw that combination! Totally uncomradely.",
      "The 100-page party manifesto clearly states on page 42 that knockdowns are ideologically unsound.",
      "We will split this boxing commission into two distinct factions by tomorrow morning."
    ]
  },
  ashika: {
    name: "Madhav Kumar Nepal (Chiya Mantri)",
    title: "Unified Socialist Chairman",
    excuses: [
      "We were on our mandatory 4 PM Chiya break when the opponent threw that combination! Totally uncomradely.",
      "The 100-page party manifesto clearly states on page 42 that knockdowns are ideologically unsound."
    ]
  }
};

const satireMatchHeadlines = {
  "balen-kp": "DOZER DEMOLITION! BALEN BULLDOZES OLIS SHIP OUT OF BAGMATI",
  "balen-rabi": "KATHMANDU COURT DELIVERS VERDICT: RABI KNOCKED OUT IN CHITWAN SHOWDOWN",
  "balen-harka": "METRO DIPLOMACY CRUSHES DHARAN LABOR PROTEST IN ROUND 3",
  "balen-punya": "PUNYAS METAPHYSICAL PHILOSOPHY SILENCED BY MAYORAL RIGHT HOOK",
  "balen-ashika": "KATHMANDU METRO BUDGET OVERPOWERS SOCIAL MEDIA CASH RELIEF",

  "kp-balen": "OLIS SHIP ANCHORS IN TUNDIKHEL! BALEN SENT BACK TO RAP STUDIO",
  "kp-rabi": "VETERAN COMRADE KNOCKS RABI OUT OF PARLIAMENTARY OCTAGON",
  "kp-harka": "HIGH-LEVEL PARTY MACHINE STEAMROLLS HARKAS SHOVEL CRUSADE",
  "kp-punya": "PUNYA FAILS CRITICAL PHD ORAL EXAM AGAINST CHAIRMAN OLI",
  "kp-ashika": "SENIOR STATESMAN TEACHES HARSH LESSON IN COALITION MANAGEMENT",

  "rabi-balen": "BLUE WAVE IN CAPITAL! RABI DERAILS MAYORS UNSTOPPABLE DOZER",
  "rabi-kp": "BELL RINGS FOR OLI! RABI STORMS VICTORY WITH CITIZEN CHARGE",
  "rabi-harka": "TV AUDIENCE APPLAUDS AS RABI OUTPOINTS DHARANS WORKER HERO",
  "rabi-punya": "RABI EXPOSES PUNYA LIVE ON SCREEN: YOUR COMBINATIONS ARE FRAUDULENT",
  "rabi-ashika": "BELL EMBLEM CRUSHES CASH CAMPAIGN IN FIERCE ELECTION CLASH",

  "harka-balen": "SHRAM SHAKTI TRIUMPHS! HARKA DIGS MAYORS GRAVE WITH BARE HANDS",
  "harka-kp": "DHARAN HAMMER SMASHES HIGH-LEVEL COALITION MONOPOLY",
  "harka-rabi": "REAL SWEAT DEFEATS TV SOUNDBITES: HARKA TAKES THE CROWN",
  "harka-punya": "TALK LESS, WORK MORE! HARKA SHUTS DOWN VIRAL PODCAST WITH HEAVY PUNCH",
  "harka-ashika": "DHARAN VOLUNTEER SPIRIT CONQUERS INFLUENCER CELEBRITY FORCE",

  "punya-balen": "METAPHYSICAL TSUNAMI! PUNYA GAUTAM CLINCHES MAYORAL TITLE",
  "punya-kp": "HISTORIC UPSET! PUNYA GAUTAM BECOMES NEW DE-FACTO COMRADE",
  "punya-rabi": "YOUTUBE BROADCASTER OUT-DEBATES AND OUT-BOXES RABI IN ROUND 2",
  "punya-harka": "COSMIC GEOPOLITICS DEFEATS LABOR UNION: PUNYA CELEBRATES ON TIKTOK",
  "punya-ashika": "VIRAL INTELLECT OVERCOMES ACTIVIST BUDGET IN SPECTACULAR BOUT",

  "ashika-balen": "PEOPLES ACTIVIST OVERPOWERS KATHMANDU ADMINISTRATION",
  "ashika-kp": "DIRECT ACTION CASH FORCE KNOCKS OUT ESTABLISHED POLITICIAN",
  "ashika-rabi": "ASHIKAS REVOLUTIONARY WRATH SENDS OPPOSITION LEADER TO HOSPITAL",
  "ashika-harka": "SOCIAL RELIEF EXPEDITION STORMS PAST DHARAN DEFENSE LINE",
  "ashika-punya": "PUNYAS LECTURE CUT SHORT BY HIGH-VELOCITY ACTIVIST COMBO"
};

function hideMatchResult() {
  const el = document.getElementById("result");
  if (el) {
    el.hidden = true;
    el.classList.remove("has-paper");
    el.innerHTML = "";
  }
}

window.renderSatiricalNewspaper = renderSatiricalNewspaper; window.hideMatchResult = hideMatchResult;

const CHARACTER_SPEECH = {
  balen: {
    intro: ["35-day notice ready!", "Dozer standby chha!", "Katha le magyo!", "Bagmati safa garchhu!"],
    super: ["DOZER AAYO!! FULL BASS!!"],
    parry: ["Unauthorized punch!", "Notice padha!"]
  },
  kp: {
    intro: ["Bato ma rail aauchha!", "Geopolitically ready!", "Pani jahaj aayo!", "Mitraharu, namaste!"],
    super: ["BESAR-PANI POWER!! RAIL AAYO!!"],
    parry: ["Asambhava!", "Samvidhaan padha!"]
  },
  prachanda: {
    intro: ["Uthal-puthal hunai parchha!", "Samikaran badliyo!", "Chhalang maarnu parchha!"],
    super: ["UTHAL-PUTHAL!! NAYA GATHABANDHAN!!"],
    parry: ["Naya samjhauta!", "Peace process!"]
  },
  rabi: {
    intro: ["Siddha kura janata sanga!", "Ghanti bajyo!", "Live telecast shuru!", "Chitwan le bolyo!"],
    super: ["SIDHA KURA!! GHANTI BAJYO!!"],
    parry: ["Evidence chha?", "Karwaahi hunchha!"]
  },
  punya: {
    intro: ["Quantum metaphysics!", "Desh ma tufaan!", "Cosmic revolution!", "Astitva ko ladai!"],
    super: ["SABHAMUKHA MAHODAYA!! MIC DROP!!"],
    parry: ["Philosophical defense!", "Out of syllabus!"]
  },
  deuba: {
    intro: ["Jyotishi le 7-term bhaneko chha!", "Tapai badhi nabolnus!", "Sher Bahadur ready!"],
    super: ["TAPAI BADHI BOLNU BHAYO!! 7-TERM PALM!!"],
    parry: ["Ke bhanya tapai le?", "Arko patak ma hunchha!"]
  },
  harka: {
    intro: ["Dharane dhunga bokdai chhu!", "Shramdan garum!", "Kokaha ko paani aayo!", "Asal neta shramik ho!"],
    super: ["DHUNGA BOK!! SHRAMDAN POWER!!"],
    parry: ["Pipe phutla!", "Gaiti-bancharo ready!"]
  },
  raja: {
    intro: ["Janata nai shakti hun!", "Shahi salaam!", "Itihas le bolchha!", "Shree 5 ko aadesh!"],
    super: ["ROYAL HALO!! SHAHI CYCLONE!!"],
    parry: ["Shahi parampara!", "Rajtantra jindabaad!"]
  },
  madhesh: {
    intro: ["Terai garjan shuru!", "Madhesh ko adhikaar!", "Bijuli tufan aayo!", "Janata jaagyo!"],
    super: ["TERAI GARJAN!! BIJULI TUFAN!!"],
    parry: ["Madhesh ekata!", "Ruknus yaha!"]
  },
  nepal: {
    intro: ["Ghosana patra lera aako chu!", "Chiya break garam!", "Naya party naya josh!", "Socialist revolution!"],
    super: ["CHIYA BREAK!! GHOSANA PATRA RAIN!!"],
    parry: ["Ghosana patra hernus!", "Chiya chiso bhayo!"]
  },
  ashika: {
    intro: ["Ghosana patra lera aako chu!", "Chiya break garam!"],
    super: ["CHIYA BREAK!! GHOSANA PATRA RAIN!!"],
    parry: ["Ghosana patra hernus!"]
  }
};

const _spVec = new se();
function getHeadScreenCoords(fighter) {
  if (!fighter || !fighter.root) return { x: innerWidth / 2, y: innerHeight * 0.4 };
  _spVec.copy(fighter.root.position);
  _spVec.y += 2.95;
  _spVec.project(ne);
  return {
    x: Math.round((_spVec.x * 0.5 + 0.5) * innerWidth),
    y: Math.round((-_spVec.y * 0.5 + 0.5) * innerHeight)
  };
}

function showSpeechBubble(fighter, type = "intro", customText = "", duration = 2400) {
  if (!fighter || !document.body.classList.contains("playing")) return;
  const cfg = CHARACTER_SPEECH[fighter.character] || CHARACTER_SPEECH.balen;
  let text = customText;
  if (!text) {
    const pool = cfg[type] || cfg.intro;
    text = pool[Math.floor(Math.random() * pool.length)];
  }
  let layer = document.getElementById("speech-layer");
  if (!layer) {
    layer = document.createElement("div");
    layer.id = "speech-layer";
    document.body.appendChild(layer);
  }
  const bubble = document.createElement("div");
  bubble.className = "speech-bubble" + (type === "super" ? " super-shout" : "");
  bubble.textContent = text;
  layer.appendChild(bubble);

  const start = performance.now();
  function track() {
    if (!bubble.isConnected) return;
    const pos = getHeadScreenCoords(fighter);
    const sideOffset = (typeof O !== "undefined" && fighter === O) ? -32 : 32;
    const clampX = Math.max(70, Math.min(innerWidth - 70, pos.x + sideOffset));
    const clampY = Math.max(70, Math.min(innerHeight - 100, pos.y));
    bubble.style.left = clampX + "px";
    bubble.style.top = clampY + "px";
    if (performance.now() - start < duration) {
      requestAnimationFrame(track);
    } else {
      bubble.classList.add("fade-out");
      setTimeout(() => bubble.remove(), 350);
    }
  }
  requestAnimationFrame(track);
}

function updateDebateQuotes(leftQuote, rightQuote) {
  const l = document.getElementById("anchor-quote-left");
  const r = document.getElementById("anchor-quote-right");
  if (l && leftQuote) l.textContent = leftQuote;
  if (r && rightQuote) r.textContent = rightQuote;
}

window.showSpeechBubble = showSpeechBubble;
window.updateDebateQuotes = updateDebateQuotes;

function renderSatiricalNewspaper(playerWon, p1Char, p2Char, scoreStr) {
  const winnerKey = playerWon ? p1Char : p2Char;
  const loserKey = playerWon ? p2Char : p1Char;
  const w = satireNewsData[winnerKey] || { name: (winnerKey || "WINNER").toUpperCase(), excuses: ["I was distracted by the crowd."] };
  const l = satireNewsData[loserKey] || { name: (loserKey || "LOSER").toUpperCase(), excuses: ["The match conditions were unconstitutional."] };
  const pairKey = winnerKey + "-" + loserKey;
  const headline = satireMatchHeadlines[pairKey] || (w.name.toUpperCase() + " SCORES DECISIVE KNOCKOUT OVER " + l.name.toUpperCase() + "!");
  const excuse = l.excuses[Math.floor(Math.random() * l.excuses.length)];
  const notes = playerWon
    ? "Political commentators report the citizens have given their verdict. Sweets and victory processions are breaking out across the nation."
    : "Opposition forces celebrate an unexpected victory. Supporters of " + w.name + " are already demanding immediate cabinet reshuffles.";
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  
  const el = document.getElementById("result");
  if (!el) return;
  el.hidden = false;
  el.removeAttribute("hidden");
  el.classList.add("has-paper");
  el.innerHTML = `<div class="paper-card">
    <div class="paper-header">
      <div class="paper-kicker">NEPAL ELECTION SPECIAL · EXTRA DISPATCH</div>
      <div class="paper-title">THE KATHMANDU SATIRE</div>
      <div class="paper-meta">
        <span>DATE: ${dateStr.toUpperCase()}</span>
        <span>SCORE: ${scoreStr}</span>
        <span>PRICE: 1 VOTE</span>
      </div>
    </div>
    <div class="paper-headline">${headline}</div>
    <div class="paper-body">
      <div class="paper-photo-wrap">
        <img src="./portraits/${loserKey}.png" class="paper-mugshot" alt="${l.name}">
        <span class="paper-caption">${l.name} (Defeated Contender)</span>
      </div>
      <div class="paper-articles">
        <div class="paper-subhead">${w.name} secures total victory inside the national political ring!</div>
        <div class="paper-quote">"${excuse}"</div>
        <p class="paper-notes">${notes}</p>
      </div>
    </div>
    <div class="paper-stamp ${playerWon ? "stamp-win" : "stamp-lose"}">${playerWon ? "VICTORY" : "DEFEAT"}</div>
  </div>`;
}
function Zt(e,o){const t=st[e],n=document.createElement("div");n.id=o,n.className="special-banner";const i=document.createElement("small"),s=document.createElement("strong");return i.textContent=t.owner+"'S SUPER",s.textContent=t.name,n.append(i,s),document.body.append(n),n}function eo(e,o,t){e.querySelector("small").textContent=st[o].owner+"'S SUPER | "+(t.isRemote?"OPPONENT":t.isRival?"CPU":"YOU")}const io=[2.1,3.5,4.9],ct=e=>(e=K.clamp(e,0,1),e*e*(3-2*e));function Ss(e,o){const t=new re;e.add(t),t.visible=!1;const n=new po().load(No(),void 0,void 0,ae?()=>{new po().load(No(!1),P=>{n.image=P.image,n.needsUpdate=!0,P.dispose()})}:void 0);n.colorSpace=at,n.anisotropy=ae?2:4;const i=new Mo(.73,.293,4,1),s=i.attributes.position.array.slice(),a=new he({map:n,side:ze,transparent:!0,opacity:1,depthWrite:!1}),c=Ee.banknotes,l=new fo(i,a,c);l.instanceMatrix.setUsage(_o),l.frustumCulled=!1,t.add(l);const r=new Qo,d=[];for(let P=0;P<3;P++){const p=[];for(let L=0;L<=100;L++){const w=L/100*4.8,x=.35+w*.27,y=L/100*Math.PI*7+P*Math.PI*2/3;p.push(new se(Math.cos(y)*x,w,Math.sin(y)*x))}const m=new j(new Wn(new Fn(p),ae?80:120,.018,4,!1),new he({color:P===0?15194001:9620652,transparent:!0,opacity:.18,blending:Zo,depthWrite:!1}));t.add(m),d.push(m)}const S=new j(new So(.45,.5,64),new he({color:15125116,transparent:!0,opacity:.5,side:ze,depthWrite:!1}));S.rotation.x=-Math.PI/2,S.position.y=.03,t.add(S);const T=new Ye(16765578,0,15);e.add(T);const u=Kt("audio/ashika-super.m4a"),v=Zt("ashika","ashika-super-banner");let h=null,R=!1;function D(){u.muted=!0,u.play()?.then(()=>{h||(u.pause(),u.currentTime=0),u.muted=!1}).catch(()=>{u.muted=!1})}function b(P,p,m){if(h)return!1;h={actor:P,victim:p,onHit:m,t:0,hits:0,dir:P.root.position.x<p.root.position.x?1:-1,ax:P.root.position.x,bx:p.root.position.x},Vt(h),R=!1,t.visible=!0,P.tornadoPose=0;for(const L of[P,p])L.move=null,L.attack=0,L.block=!1;return eo(v,"ashika",P),v.classList.add("visible"),document.body.classList.add("train-cinematic"),u.currentTime=0,u.muted=!1,u.play().catch(()=>{}),!0}function G(P=!1){if(!h)return;const p=h;u.pause(),u.currentTime=0,Qt(p,o,P),t.visible=!1,T.intensity=0,v.classList.remove("visible"),document.body.classList.remove("train-cinematic"),h=null}function F(P){if(!h||R)return!1;const p=h;p.t=Math.min(6.9,!u.paused&&u.currentTime>0?Math.max(p.t,u.currentTime):p.t+P);const m=p.t,L=p.dir,w=ct((m-.4)/1),x=1-ct((m-5.85)/1.05),y=w*x;for(;p.hits<io.length&&m>=io[p.hits];)p.hits++,p.onHit(10);t.position.set(p.bx,0,0),t.scale.setScalar(.15+w*.85),a.opacity=x;const E=i.attributes.position;for(let f=0;f<E.count;f++)E.setZ(f,Math.sin(m*17+s[f*3]*10)*.035);E.needsUpdate=!0;for(let f=0;f<c;f++){const M=(f/c+m*.15)%1*4.7,k=.4+M*.27+.2*Math.sin(f*3.7),g=m*(7.4+f%5*.2)+f*2.399;r.position.set(Math.cos(g)*k,M,Math.sin(g)*k),r.rotation.set(.3*Math.sin(m*9+f),-g+Math.PI/2,Math.sin(m*6+f)*.65),r.scale.setScalar(.75+f%4*.12),r.updateMatrix(),l.setMatrixAt(f,r.matrix)}l.instanceMatrix.needsUpdate=!0;for(const[f,M]of d.entries())M.rotation.y=m*(f%2?5:-4),M.material.opacity=.18*y;if(S.scale.setScalar(1+w*3),S.material.opacity=.65*y,p.actor.tornadoPose=w,p.actor.root.position.set(K.lerp(p.ax,p.bx-L*3.05,ct(m/.7)),Math.sin(m*3)*.03*y,0),p.actor.root.rotation.set(0,L*.85,0),ve(p.actor,P),m<5.25){const f=ct((m-1.05)/1.1);p.victim.root.scale.setScalar(1-f*.25),p.victim.root.position.set(p.bx+Math.sin(m*8)*.28*f,Math.max(0,f*(1.05+.65*Math.sin(m*2))),Math.cos(m*8)*.3*f),p.victim.root.rotation.set(Math.sin(m*5)*.16*f,p.victim.dir*1.15+m*f*3,Math.sin(m*6)*.22*f),p.victim.superFall=f*.7,ve(p.victim,P),nt(p.victim)}else Jt(p,m-5.25,{upward:3.2,gravity:16,speed:3.7,bounce:.08},P);T.position.set(p.bx,2.5,2),T.intensity=35*y;const I=p.bx-L*1;return o.position.set(I+L*.8,4.35,Math.max(13.8,10/o.aspect)),o.lookAt(I,2.25,0),(p.hits?m-io[p.hits-1]:99)<.15&&(o.position.x+=Math.sin(m*110)*.08),_t(p,m,6.9,P),v.style.opacity=String(ct(m/.25)*x),m>=6.9?(G(!0),!0):!1}function H(P){R=P,P?u.pause():h&&u.play().catch(()=>{})}return{start:b,update:F,cancel:G,pause:H,unlock:D,get active(){return!!h},get elapsed(){return h?.t||0},get hits(){return h?.hits||0}}}function Ts(e){return createP2PRoomBridge(e,{go,Xt,cs,ls,ds,Fo,ps,fs,xn,vn,rs,us,Ne,Jn,_n,fn,Qn,bn})}const jo=new se(0,1,0),Ie=(e,o,t)=>new se(e,o,t),lt=e=>(e=K.clamp(e,0,1),e*e*(3-2*e));function Cs(e,o,t){const n=new re;n.name="harka-digging-crew",n.visible=!1,e.add(n);const i=new xe(1,10,8),s=new ke(1,1,1,8),a=new vo(.23,.46,4,8),c=p=>new ee({color:p,roughness:.85}),l=[c(12025173),c(13671026),c(9659203)],r=[c(2722439),c(11756866),c(5728928),c(12951886)],d=c(2700354),S=c(2433827),T=new he({color:10158034,transparent:!0,opacity:.7,depthWrite:!1,blending:Zo});function u(p,m,L){const w=new j(p,m);return w.castShadow=!ae,L.add(w),w}function v(p,m,L){const w=u(s,m,p);return w.userData.radius=L,w}function h(p,m,L){p.position.copy(m).add(L).multiplyScalar(.5),p.quaternion.setFromUnitVectors(jo,L.clone().sub(m).normalize()),p.scale.set(p.userData.radius,m.distanceTo(L),p.userData.radius)}const R=[];for(let p=0;p<8;p++){const m=new re,L=new re;n.add(m),m.add(L),m.name="summoned-digger-"+p;const w=r[p%r.length],x=l[p%l.length],y=u(a,w,L);y.position.y=1.12;const E=u(i,x,L);E.scale.set(.17,.21,.17),E.position.set(0,1.68,0);const I=u(i,d,L);I.scale.set(.18,.11,.175),I.position.set(0,1.8,-.015);const C=[],f=[];for(const g of[-1,1]){C.push([v(L,w,.085),v(L,x,.063),u(i,x,L)]),C.at(-1)[2].scale.setScalar(.075),f.push([v(L,d,.1),v(L,d,.085)]);const N=u(i,S,L);N.position.set(g*.14,.08,.09),N.scale.set(.11,.08,.19)}const M=o.clone();M.visible=!0,M.scale.setScalar(.65),L.add(M);const k=new j(new $e(.55,.022,6,40),T.clone());k.rotation.x=-Math.PI/2,k.position.y=.035,m.add(k),R.push({group:m,person:L,torso:y,head:E,hair:I,arms:C,legs:f,tool:M,ring:k})}const D=new fo(new Un(.045,0),T,64);D.instanceMatrix.setUsage(_o),D.frustumCulled=!1,n.add(D);const b=c(8941650),G=new fo(new ho(.06,0),b,48);G.frustumCulled=!1,n.add(G);const F=new Qo;function H(){n.visible=!1}function P(p,m,L){n.visible=!0,n.position.x=m,R.forEach((w,x)=>{const y=-Math.PI*.77+x*Math.PI*1.54/7,E=3.05+x%2*.18,I=L*Math.cos(y)*E,C=Math.sin(y)*E,f=p-(.2+x*.065),M=lt(f/.42),k=1-lt((p-5.35)/.55),g=M*k;w.group.position.set(I,Math.sin(M*Math.PI)*.3,C),w.group.rotation.y=Math.atan2(-I,-C),w.person.scale.setScalar(g*(.94+x%3*.04)),w.ring.visible=f>0&&f<.85||k<1,w.ring.scale.setScalar(k<1?1+(1-k)*1.5:.6+Math.max(0,f)*1.8),w.ring.material.opacity=f<.85?(1-lt(f/.85))*.8:(1-k)*.7;const N=t.find($=>p<$+.5),X=p+(x%3-1)*.045,U=N===void 0?1:X<=N?1-lt((X-(N-.5))/.5):lt((X-N)/.5),ie=1-U;w.torso.position.set(0,1.12-ie*.12,ie*.12),w.torso.rotation.x=ie*.35,w.head.position.set(0,1.68-ie*.18,ie*.2),w.hair.position.copy(w.head.position).add(Ie(0,.12,-.015));const ue=[Ie(-.035,.9+U*.65,.55),Ie(.065,.65+U*.45,.7)];for(let $=0;$<2;$++){const te=$===0?-1:1,Y=Ie(te*.24,1.36-ie*.1,ie*.1),_=Ie(te*.35,1.03-ie*.15,.35+U*.1);h(w.arms[$][0],Y,_),h(w.arms[$][1],_,ue[$]),w.arms[$][2].position.copy(ue[$]);const V=Ie(te*.13,.83-ie*.05,0),Se=Ie(te*.16,.45,.08+ie*.05),Ln=Ie(te*.14,.12,0);h(w.legs[$][0],V,Se),h(w.legs[$][1],Se,Ln)}w.tool.position.copy(ue[0]).add(ue[1]).multiplyScalar(.5),w.tool.quaternion.setFromUnitVectors(jo,ue[0].clone().sub(ue[1]).normalize());for(let $=0;$<8;$++){const te=(Math.max(0,f)*.9+$/8)%1,Y=$*2.399+p;F.position.set(I+Math.cos(Y)*(.3+te*.5),te*2.3,C+Math.sin(Y)*(.3+te*.5)),F.scale.setScalar(f>0&&f<1.25?(1-te)*M*k:0),F.updateMatrix(),D.setMatrixAt(x*8+$,F.matrix)}const ye=t.filter($=>p>=$).at(-1),ce=ye===void 0?99:p-ye;for(let $=0;$<6;$++){const te=ce-$*.015,Y=te>=0&&te<.65;F.position.set(I*.65+I*te*.5,.1+te*(2.5+$*.2)-5*te*te,C*.65+C*te*.5),F.rotation.set(te*7+$,te*4,te*3),F.scale.setScalar(Y?1-te/.65:0),F.updateMatrix(),G.setMatrixAt(x*6+$,F.matrix)}}),D.instanceMatrix.needsUpdate=!0,G.instanceMatrix.needsUpdate=!0}return{update:P,hide:H}}const dt=[1.85,3.15,4.45],ao=4.8,As=1.25,ut=e=>(e=K.clamp(e,0,1),e*e*(3-2*e));function Rs(e,o){const t=new re,n=new re;e.add(t,n),t.name="harka-mountain",t.visible=n.visible=!1;const i=new ee({color:7692363,roughness:1,flatShading:!0}),s=new ke(.72,2.55,3,28,8,!1),a=s.attributes.position;for(let C=0;C<a.count;C++){const f=a.getY(C),M=Math.atan2(a.getZ(C),a.getX(C)),k=1+.075*Math.sin(M*5+f*7)+.04*Math.cos(M*9-f*3);a.setXYZ(C,a.getX(C)*k,f+1.5,a.getZ(C)*k)}s.computeVertexNormals();const c=new j(s,i);c.castShadow=c.receiveShadow=!0,t.add(c);const l=new ke(.7,.79,.08,28),r=new j(l,new ee({color:5661769,roughness:1}));r.position.y=3,t.add(r);for(let C=0;C<24;C++){const f=C*2.399,M=.65+C%5*.36,k=Math.max(.1,Math.min(3,3*(1-(M-.72)/(2.55-.72)))),g=new j(new ho(.15+C%3*.065),new ee({color:C%2?7828840:9669493,roughness:1,flatShading:!0}));g.position.set(Math.cos(f)*M,k,Math.sin(f)*M),g.rotation.set(C*.7,C*.4,C*.3),g.castShadow=!0,t.add(g)}const d=new j(new ke(2.67,2.75,.07,40),new ee({color:4932152,roughness:1}));d.position.y=.03,e.add(d),d.visible=!1;const S=new ee({color:9856568,roughness:.8}),T=new ee({color:10004143,metalness:.8,roughness:.34}),u=new j(new ke(.027,.031,1.65,12),S);u.castShadow=!0,n.add(u);const v=new j(new ke(.04,.055,.22,12),T);v.position.y=-.8,n.add(v);const h=new To;h.moveTo(-.18,0),h.lineTo(.18,0),h.lineTo(.23,-.3),h.quadraticCurveTo(0,-.62,-.23,-.3),h.closePath();const R=new j(new en(h,{depth:.035,bevelEnabled:!0,bevelThickness:.015,bevelSize:.02,bevelSegments:2,steps:1}),T);R.position.set(0,-.86,-.02),R.castShadow=!0,n.add(R);const D=new j(new $e(.1,.024,8,20),new ee({color:2569527,roughness:.6}));D.position.y=.89,n.add(D);const b=Cs(e,n,dt),G=[];for(let C=0;C<32;C++){const f=new j(new ho(.06+C%3*.025),i);f.visible=!1,e.add(f),G.push(f)}const F=[];for(let C=0;C<10;C++){const f=new j(new xe(.2,10,8),new he({color:11707020,transparent:!0,opacity:0,depthWrite:!1}));e.add(f),F.push(f)}const H=new Ye(13493930,0,14);e.add(H);const P=Kt("audio/harka-super.m4a"),p=Zt("harka","harka-super-banner");let m=null,L=!1;function w(){P.muted=!0,P.play()?.then(()=>{m||(P.pause(),P.currentTime=0),P.muted=!1}).catch(()=>{P.muted=!1})}function x(C,f,M){if(m)return!1;m={actor:C,victim:f,onHit:M,t:0,hits:0,height:ao,dir:C.root.position.x<f.root.position.x?1:-1,ax:C.root.position.x,bx:f.root.position.x},Vt(m),L=!1,t.visible=n.visible=d.visible=!0,C.digPose={lift:1},f.trainRider=!0,f.mountainSeat=!0;for(const k of[C,f])k.move=null,k.attack=0,k.block=!1;return eo(p,"harka",C),p.classList.add("visible"),document.body.classList.add("train-cinematic"),P.currentTime=0,P.muted=!1,P.play().catch(()=>{}),!0}function y(C=!1){if(!m)return;const f=m;P.pause(),P.currentTime=0,Qt(f,o,C),t.visible=n.visible=d.visible=!1,b.hide(),G.forEach(M=>M.visible=!1),F.forEach(M=>M.material.opacity=0),H.intensity=0,p.classList.remove("visible"),document.body.classList.remove("train-cinematic"),m=null}function E(C){if(!m||L)return!1;const f=m;f.t=Math.min(6,!P.paused&&P.currentTime>0?Math.max(f.t,P.currentTime):f.t+C);const M=f.t,k=f.dir,g=ut(M/.7);for(b.update(M,f.bx,k);f.hits<dt.length&&M>=dt[f.hits];)f.hits++,f.onHit(10);f.height=K.damp(f.height,ao-f.hits*As,10,C);const N=f.height*g;t.position.set(f.bx,0,0),t.scale.set(1,N/3,1),d.position.x=f.bx;const X=dt.find(Y=>M<Y+.5),U=X===void 0?1:M<=X?1-ut((M-(X-.5))/.5):ut((M-X)/.5);f.actor.digPose={lift:U,depth:1-f.height/ao},f.actor.root.position.set(K.lerp(f.ax,f.bx-k*3.15,g),0,0),f.actor.root.rotation.set(0,k*1.35,0),f.actor.root.scale.setScalar(.9+.1*(1-g)),ve(f.actor,C),f.actor.root.updateWorldMatrix(!0,!0);const ie=f.actor.modelRig.bones,ue=ie.leftHand.getWorldPosition(new se),ye=ie.rightHand.getWorldPosition(new se),ce=ue.clone().sub(ye).normalize();if(n.position.copy(ue).add(ye).multiplyScalar(.5),n.quaternion.setFromUnitVectors(new se(0,1,0),ce),M<4.72){f.victim.root.scale.setScalar(1-g*.2),f.victim.root.position.set(f.bx,0,.58*g),f.victim.root.rotation.set(0,-k*.25,Math.sin(M*8)*.015*f.hits),ve(f.victim,C);const Y=f.victim.modelRig.bones.hips.getWorldPosition(new se);f.victim.root.position.y+=N+.18*g-Y.y,nt(f.victim)}else f.victim.trainRider=!1,f.victim.mountainSeat=!1,Jt(f,M-4.72,{upward:2.2,gravity:14,speed:3.1,bounce:.06},C);n.visible=M<5.15;const $=f.hits?M-dt[f.hits-1]:99;G.forEach((Y,_)=>{const V=$-_*.005;Y.visible=V>=0&&V<.8,Y.visible&&(Y.position.set(f.bx-k*1.35-k*V*(1+_%5*.3),.45+V*(1.8+_%4*.5)-4*V*V,Math.sin(_*4)*V),Y.rotation.set(V*4+_,V*3,V*5))}),F.forEach((Y,_)=>{const V=$-_*.016,Se=K.clamp(V/.9,0,1);Y.position.set(f.bx-k*1.1+Math.sin(_*7)*Se,.3+Se*.8,Math.cos(_*4)*Se),Y.scale.setScalar(.2+Se*2),Y.material.opacity=V>=0&&V<.9?(1-Se)*.16:0}),H.position.set(f.bx-k,3,3),H.intensity=18;const te=f.bx-k*1.05;return o.position.set(te+k*.6,6.1,Math.max(15.2,11/o.aspect)),o.lookAt(te,2.9,0),$<.16&&(o.position.y+=Math.sin(M*100)*.07),_t(f,M,6,C),p.style.opacity=M<.25?String(ut(M/.25)):M>5.2?String(1-ut((M-5.2)/.8)):"1",M>=6?(y(!0),!0):!1}function I(C){L=C,C?P.pause():m&&P.play().catch(()=>{})}return{start:x,update:E,cancel:y,pause:I,unlock:w,get active(){return!!m},get elapsed(){return m?.t||0},get height(){return m?.height||0},get hits(){return m?.hits||0}}}const ro=6.85,co=3.65,Ot=e=>(e=K.clamp(e,0,1),e*e*(3-2*e));function Es(e,o){const t=new re;t.visible=!1,e.add(t);const n=[],i=[],s=new se,a=(k,g=.25)=>new ee({color:k,metalness:g,roughness:.45}),c=a(1325911),l=a(13184320),r=a(16107367,.65),d=a(2503489,.65),S=new ee({color:8643823,emissive:1736601,emissiveIntensity:.65,metalness:.6,roughness:.2});function T(k,g,N,X,U,ie,ue,ye=t){const ce=new j(new ko(k,g,N,2,.06),X);return ce.position.set(U,ie,ue),ce.castShadow=!0,ce.receiveShadow=!0,ye.add(ce),ce}function u(k,g,N,X,U,ie,ue,ye=0){const ce=new j(new ke(k,g,N,24),X);return ce.position.set(U,ie,ue),ce.rotation.z=ye,ce.castShadow=!0,t.add(ce),ce}const v=new To;v.moveTo(-2.4,1.18),v.lineTo(2.55,1.18),v.lineTo(1.85,.38),v.quadraticCurveTo(0,-.05,-2.15,.38),v.closePath();const h=new j(new en(v,{depth:1.65,bevelEnabled:!0,bevelSize:.09,bevelThickness:.09,bevelSegments:2,steps:1}),c);h.name="oli-ship-hull",h.position.z=-.825,h.castShadow=!0,t.add(h),T(4.35,.15,1.72,r,-.15,1.19,0),T(1.75,.86,1.3,l,-.85,1.68,0),T(2.05,.15,1.58,d,-.85,2.18,0);for(const k of[-.67,.67]){for(let g=0;g<3;g++)T(.42,.38,.045,S,-1.42+g*.55,1.83,k);for(let g=0;g<5;g++){const N=new j(new $e(.11,.025,6,16),r);N.position.set(-1.65+g*.72,.82,k*1.28),t.add(N)}}T(.05,.39,1.2,S,.05,1.8,0),T(.38,.6,.4,d,-1.4,2.5,0),T(.5,.1,.48,r,-1.4,2.83,0);for(const k of[-.82,.82]){T(4.1,.035,.035,r,-.15,1.55,k);for(let g=0;g<9;g++)T(.025,.35,.025,d,-2.1+g*.48,1.37,k)}u(.055,.055,1.3,r,.75,1.88,0),T(.75,.035,.035,r,.75,2.35,0);const R=new Ye(16764547,14,7);R.position.set(2.2,1.4,0),t.add(R);const D=document.createElement("canvas");D.width=256,D.height=320;const b=D.getContext("2d");b.beginPath(),b.moveTo(16,8),b.lineTo(235,150),b.lineTo(98,150),b.lineTo(245,304),b.lineTo(16,304),b.closePath(),b.fillStyle="#003893",b.fill(),b.lineWidth=14,b.strokeStyle="#003893",b.stroke(),b.fillStyle="#dc143c",b.fill(),b.lineWidth=8,b.stroke(),b.fillStyle="white",b.beginPath(),b.arc(65,99,22,0,Math.PI),b.fill(),b.fillStyle="#dc143c",b.beginPath(),b.arc(65,91,19,0,Math.PI),b.fill(),b.fillStyle="white",b.beginPath();for(let k=0;k<24;k++){const g=k*Math.PI/12-Math.PI/2,N=k%2?13:24,X=65+Math.cos(g)*N,U=235+Math.sin(g)*N;k?b.lineTo(X,U):b.moveTo(X,U)}b.closePath(),b.fill();const G=new Yt(D);G.colorSpace=at;const F=new j(new Mo(.95,1.18,14,8),new he({map:G,transparent:!0,side:ze,depthWrite:!1}));F.position.set(-.15,3.08,.65),t.add(F),n.push(F),u(.025,.025,1.8,r,-.6,2.9,.65);for(let k=0;k<10;k++){const g=new j(new xe(.2,12,8),new he({color:14542829,transparent:!0,opacity:0,depthWrite:!1}));t.add(g),i.push(g)}const H=new re;e.add(H),H.visible=!1;const P=new j(new tn(1,48),new ee({color:1215151,transparent:!0,opacity:.48,roughness:.24,metalness:.4,depthWrite:!1}));P.rotation.x=-Math.PI/2,P.scale.set(4.3,2.2,1),P.position.y=.035,H.add(P);const p=[];for(let k=0;k<8;k++){const g=new j(new $e(1,.024,5,48),new he({color:12908543,transparent:!0,opacity:.6,depthWrite:!1}));g.rotation.x=-Math.PI/2,g.position.y=.06+k*.001,H.add(g),p.push(g)}const m=new Ye(7847935,0,18);e.add(m);const L=Kt("audio/oli-super.m4a");let w=null,x=!1;const y=Zt("kp","train-super-banner");function E(){L.muted=!0,L.play()?.then(()=>{w||(L.pause(),L.currentTime=0),L.muted=!1}).catch(()=>{L.muted=!1})}function I(k,g,N){if(w)return!1;const X=k.root.position.x<g.root.position.x?1:-1;return w={actor:k,victim:g,onHit:N,t:0,hit:!1,dir:X,ax:k.root.position.x,bx:g.root.position.x},Vt(w),x=!1,t.visible=!0,H.visible=!0,t.rotation.y=X===1?0:Math.PI,k.trainRider=!0,k.move=null,k.attack=0,g.move=null,g.attack=0,g.block=!1,eo(y,"kp",k),y.classList.add("visible"),document.body.classList.add("train-cinematic"),L.currentTime=0,L.muted=!1,L.play().catch(()=>{y.dataset.silent="true"}),!0}function C(k=!1){if(!w)return;const g=w;L.pause(),L.currentTime=0,Qt(g,o,k),t.visible=!1,H.visible=!1,m.intensity=0,y.classList.remove("visible"),document.body.classList.remove("train-cinematic"),w=null}function f(k){if(!w||x)return!1;const g=w;g.t=Math.min(ro,!L.paused&&L.currentTime>0?Math.max(g.t,L.currentTime):g.t+k);const N=g.t,X=g.dir,U=g.bx+X*Bo(N);t.position.set(U,Math.sin(N*5)*.055,0),t.rotation.z=Math.sin(N*4)*.025,t.visible=N>.45;const ie=Ot(N/.9);if(g.actor.root.scale.setScalar(K.lerp(1,.75,ie)),N<4.35)g.actor.root.position.set(K.lerp(g.ax,U-X*1.1,ie),ie*1.68+Math.sin(Math.PI*ie)*1.1,0);else{const Y=Ot((N-4.35)/.85),_=g.bx+X*(Bo(4.35)-1.1);g.actor.trainRider=!1,g.actor.root.position.set(K.lerp(_,g.physics.landing.actorX,Y),1.68*(1-Y)+Math.sin(Math.PI*Y)*.5,0)}g.actor.root.rotation.set(0,X*1.2,0),ve(g.actor,k),N>=4.35&&nt(g.actor),N>=co&&!g.hit&&(g.hit=!0,g.onHit()),g.hit?Jt(g,N-co,{upward:3.6,gravity:15,speed:4.2,rollSign:-X,lateralTravel:2.2,lateralDuration:.36},k):(g.victim.root.position.set(g.bx,0,0),g.victim.root.rotation.set(0,-X*1.15,0),ve(g.victim,k),nt(g.victim)),H.position.set(U,0,0),H.rotation.y=t.rotation.y;for(let Y=0;Y<p.length;Y++){const _=(N*.75+Y/p.length)%1,V=p[Y];V.position.x=-1.5-_*2,V.scale.set(.8+_*2.3,.65+_*.9,1),V.material.opacity=(1-_)*.5}for(const Y of n){const _=Y.geometry.attributes.position;for(let V=0;V<_.count;V++){const Se=_.getX(V);_.setZ(V,Math.sin(N*13+Se*7)*.08*(Se+.48))}_.needsUpdate=!0}i.forEach((Y,_)=>{const V=(N*1.3+_/10)%1;Y.position.set(-1.4-V*1.6,2.85+V*1.6,Math.sin(_*4)*V*.4),Y.scale.setScalar(.4+V*2.4),Y.material.opacity=(1-V)*.4}),m.position.set(U,3,3),m.intensity=25,_t(g,N,ro,k);let ue=1/0,ye=-1/0,ce=0;for(const Y of[g.actor,g.victim]){Y.root.updateWorldMatrix(!0,!1);for(const _ of[0,3.5])s.set(0,_,0).applyMatrix4(Y.root.matrixWorld),ue=Math.min(ue,s.x-.8),ye=Math.max(ye,s.x+.8),ce=Math.max(ce,s.z+.6)}const $=(ue+ye)/2,te=(ye-ue)/(2*Math.tan(K.degToRad(o.fov/2))*o.aspect)+ce;return o.position.set($,4.1,Math.max(13.8,te)),o.lookAt($,2.05,0),g.hit&&N<co+.2&&(o.position.y+=Math.sin(N*110)*.12),y.style.opacity=N<.3?String(Ot(N/.3)):N>6.05?String(1-Ot((N-6.05)/.8)):"1",N>=ro?(C(!0),!0):!1}function M(k){x=k,k?L.pause():w&&L.play().catch(()=>{})}return{start:I,update:f,cancel:C,pause:M,unlock:E,get active(){return!!w},get elapsed(){return w?.t||0}}}function Ps(e,o){let t=43,n=0;const i=()=>(t=t*1664525+1013904223>>>0,t/4294967296);function s(w){const x=document.createElement("canvas");x.width=x.height=512;const y=x.getContext("2d");if(y.fillStyle=w==="brick"?"#988279":"#bcb6a7",y.fillRect(0,0,512,512),w==="brick")for(let I=0;I<20;I++)for(let C=-1;C<9;C++)y.fillStyle=`hsl(${12+i()*8} 31% ${35+i()*15}%)`,y.fillRect(C*64+I%2*32+2,I*26+2,60,22);for(let I=0;I<18e3;I++){const C=i()>.5?255:0;y.fillStyle=`rgba(${C},${C},${C},${i()*.045})`,y.fillRect(i()*512,i()*512,1+i()*3,1+i()*3)}for(let I=0;I<25;I++)y.fillStyle=`rgba(46,40,32,${i()*.05})`,y.fillRect(i()*512,i()*512,i()*18,20+i()*180);const E=new Yt(x);return E.colorSpace=at,E.wrapS=E.wrapT=Gn,E.anisotropy=4,E}const a=s("brick"),c=s("plaster"),l=new ee({map:a,bumpMap:a,bumpScale:.018,roughness:.95}),r=new ee({map:c,bumpMap:c,bumpScale:.01,color:14998986,roughness:.95}),d=new ee({map:c,color:10854808,roughness:.98}),S=new ee({color:2634802,metalness:.45,roughness:.5}),T=new ee({color:5324081,roughness:.9}),u=new ee({color:5010045,metalness:.65,roughness:.23}),v=new ee({color:1581349,roughness:1}),h=new ee({color:6843495,metalness:.65,roughness:.6});function R(w,x,y,E,I,C,f,M){const k=new j(new ot(x,y,E),I);return k.position.set(C,f,M),k.castShadow=k.receiveShadow=!0,w.add(k),k}function D(w){return o.push({o:w,home:w.position.clone(),spin:new se((i()-.5)*3,(i()-.5)*3,(i()-.5)*3),push:new se((i()-.5)*3,1+i()*2,(i()-.5)*3)}),n++,w}function b(w,x,y,E,I,C,f){return D(R(e,w,x,y,E,I,C,f))}for(let w=0;w<3;w++){const x=.58+w*1.08;for(const y of[-1,1])for(let E=0;E<2;E++)b(.13,.96,.97,l,y*1.36,x,-.49+E*.98);for(let y=0;y<3;y++)b(.87,.96,.13,l,-.9+y*.9,x,-1);for(const y of[-1.16,0,1.16])b(y===0?.25:.3,.96,.15,w===1?l:r,y,x,1);b(2.55,.15,.15,w===1?l:r,0,x+.42,1),b(2.55,.12,.15,w===1?l:r,0,x-.43,1);for(const y of[-.66,.66]){const E=new re;E.position.set(y,x,1.025),e.add(E),D(E),R(E,.82,.78,.04,v,0,0,-.075),R(E,.65,.67,.035,w===0&&y<0?T:u,0,0,-.025);for(const I of[-1,1])R(E,.055,.78,.075,S,I*.365,0,.015);for(const I of[-1,1])R(E,.78,.055,.075,S,0,I*.37,.015);if(R(E,.035,.7,.05,S,0,0,.025),R(E,.73,.028,.05,S,0,.08,.025),R(E,.88,.055,.24,d,0,-.42,.02),R(E,.95,.065,.35,d,0,.44,.1),w===0)if(y>0)for(let I=0;I<13;I++)R(E,.64,.019,.025,h,0,-.3+I*.05,.012);else R(E,.025,.1,.025,h,.22,-.1,.016)}}for(const w of[-1.035,1.035]){for(const x of[-1.38,0,1.38])for(let y=0;y<3;y++)b(.14,1.08,.17,d,x,.57+y*1.08,w);for(let x=0;x<4;x++)b(2.92,.13,.22,d,0,.06+x*1.08,w)}const G=new re;G.position.set(.67,2.18,1.19),e.add(G),D(G),R(G,1.1,.1,.55,d,0,0,.1);for(const w of[-.51,-.34,-.17,0,.17,.34,.51])R(G,.018,.38,.018,h,w,.23,.35);R(G,1.08,.025,.025,h,0,.43,.35);for(let w=0;w<4;w++)b(.74,.14,2.22,d,-1.11+w*.74,3.36,0);for(const w of[-1.43,1.43])b(.1,.23,2.22,r,w,3.54,0);for(const w of[-1.06,1.06])for(let x=0;x<3;x++)b(.92,.23,.1,r,-.93+x*.93,3.54,w);const F=new re;F.position.set(.91,3.58,-.49),e.add(F),D(F);const H=new ee({color:2107431,roughness:.8}),P=new j(new ke(.23,.25,.51,24),H);P.position.y=.26,P.castShadow=!0,F.add(P);for(const w of[.1,.26,.43]){const x=new j(new $e(.245,.012,5,24),S);x.rotation.x=Math.PI/2,x.position.y=w,F.add(x)}const p=new j(new ke(.018,.018,.7,8),h);p.position.set(.24,-.05,0),F.add(p);const m=R(e,.58,.15,.58,T,0,3.55,0),L=R(e,.08,.65,.6,T,-.27,3.86,0);return{seat:m,back:L,parts:n}}const lo=6.85,Ht=3.45,pt=e=>(e=K.clamp(e,0,1),e*e*(3-2*e));function Ls(e,o){const t=new re,n=new re,i=[],s=[],a=[];e.add(t,n),t.visible=n.visible=!1;const c=(x,y=.2)=>new ee({color:x,metalness:y,roughness:.55}),l=c(16038195),r=c(2371644,.65),d=c(1055010),S=c(10727612,.7);c(13022106),c(8474184),c(6134959,.5);function T(x,y,E,I,C,f,M,k){const g=new j(new ko(y,E,I,2,.035),C);return g.position.set(f,M,k),g.castShadow=g.receiveShadow=!0,x.add(g),g}T(t,3.45,.48,1.6,l,0,.8,0),T(t,1.55,.9,1.3,l,.75,1.42,0),T(t,1.25,.18,1.3,r,-.72,1.26,0),T(t,.62,.18,.7,d,-.75,1.55,0),T(t,.16,.85,.75,d,-1.05,1.94,0);for(const x of[-1.27,-.1])for(const y of[-.66,.66])T(t,.07,1.75,.07,r,x,2.28,y);T(t,1.55,.16,1.6,l,-.7,3.2,0);for(const x of[-.98,.98]){T(t,3.65,.78,.38,d,0,.45,x);for(let y=0;y<6;y++){const E=new j(new ke(.27,.27,.41,20),r);E.rotation.x=Math.PI/2,E.position.set(-1.35+y*.54,.44,x),t.add(E),s.push(E);const I=new j(new $e(.16,.035,6,16),S);I.position.set(E.position.x,.44,x*1.23),t.add(I)}for(let y=0;y<17;y++)T(t,.12,.06,.46,r,-1.65+y*.2,.86,x),T(t,.12,.06,.46,r,-1.65+y*.2,.06,x)}const u=new re;t.add(u),u.position.set(2.03,.58,0),T(u,.3,1.05,2.5,l,0,0,0),T(u,.42,.13,2.65,S,.15,-.51,0);for(const x of[-1.2,1.2])T(u,.58,.85,.12,l,-.08,-.03,x);for(const x of[-.62,.62]){const y=T(t,1.8,.15,.15,r,1.1,.74,x);y.rotation.z=.14;const E=T(t,1.1,.085,.085,S,1.5,1.1,x);E.rotation.z=-.25}T(t,.13,.7,.13,r,1.13,2.14,.44),T(t,.24,.13,.24,d,1.13,2.53,.44);const v=new j(new $e(.19,.035,8,20),r);v.rotation.y=Math.PI/2,v.position.set(-.13,2.01,0),t.add(v);for(const x of[-.6,.6]){const y=new j(new xe(.1,12,8),new he({color:16774326}));y.position.set(1.5,1.65,x),t.add(y)}const{seat:h,back:R}=Ps(n,i);for(let x=0;x<18;x++){const y=new j(new xe(.25,12,8),new he({color:13220245,transparent:!0,opacity:0,depthWrite:!1}));e.add(y),a.push(y)}const D=new Ye(16757556,0,15);e.add(D);const b=Kt("audio/balen-super.mp3"),G=Zt("balen","dozer-super-banner");let F=null,H=!1;function P(){b.muted=!0,b.play()?.then(()=>{F||(b.pause(),b.currentTime=0),b.muted=!1}).catch(()=>{b.muted=!1})}function p(x,y,E){if(F)return!1;F={actor:x,victim:y,onHit:E,t:0,hit:!1,dir:x.root.position.x<y.root.position.x?1:-1,ax:x.root.position.x,bx:y.root.position.x},Vt(F),H=!1,t.visible=n.visible=!0,x.trainRider=y.trainRider=!0;for(const I of[x,y])I.move=null,I.attack=0,I.block=!1;for(const I of i)I.o.position.copy(I.home),I.o.rotation.set(0,0,0);return h.visible=R.visible=!0,eo(G,"balen",x),G.classList.add("visible"),document.body.classList.add("train-cinematic"),b.currentTime=0,b.muted=!1,b.play().catch(()=>{}),!0}function m(x=!1){if(!F)return;const y=F;b.pause(),b.currentTime=0,Qt(y,o,x),t.visible=n.visible=!1,D.intensity=0,a.forEach(E=>E.material.opacity=0),G.classList.remove("visible"),document.body.classList.remove("train-cinematic"),F=null}function L(x){if(!F||H)return!1;const y=F;y.t=Math.min(lo,!b.paused&&b.currentTime>0?Math.max(y.t,b.currentTime):y.t+x);const E=y.t,I=y.dir,C=pt(E/.8),f=Math.max(0,E-Ht),M=y.bx+I*(E<Ht?-7+pt((E-.7)/(Ht-.7))*3.6:-3.4+pt(f/2.4)*1.8);if(t.position.set(M,Math.sin(E*27)*.012,0),t.rotation.y=I===1?0:Math.PI,n.position.set(y.bx,0,0),u.rotation.z=f>0?-.2*Math.sin(Math.min(1,f)*Math.PI):-.03,y.actor.root.scale.setScalar(K.lerp(1,.66,C)),y.actor.root.position.set(K.lerp(y.ax,M-I*.7,C),.94*C+Math.sin(C*Math.PI)*.7,0),y.actor.root.rotation.set(0,I*1.4,0),ve(y.actor,x),y.hit||(y.victim.root.scale.setScalar(K.lerp(1,.64,C)),y.victim.root.position.set(y.bx,2.88*C+Math.sin(C*Math.PI)*.4,0),y.victim.root.rotation.set(0,-I*1.25,0),ve(y.victim,x)),E>=Ht&&!y.hit&&(y.hit=!0,y.victim.trainRider=!1,y.onHit(),h.visible=R.visible=!1),y.hit){for(const g of i){const N=Math.max(0,f-(3.4-g.home.y)*.045);g.o.position.set(g.home.x+I*N*1.9+g.push.x*N*.4,Math.max(.12,g.home.y+g.push.y*N-4.8*N*N),g.home.z+g.push.z*N*.65),g.o.rotation.set(g.spin.x*N,g.spin.y*N,g.spin.z*N)}Jt(y,f,{upward:1.8,gravity:13,speed:4.8,bounce:.12},x),a.forEach((g,N)=>{const X=Math.max(0,f-N*.028),U=K.clamp(X/1.9,0,1);g.position.set(y.bx+Math.sin(N*8)*(U*2.7+.2),.3+U*(.5+N%4*.3),Math.cos(N*5)*U*1.5),g.scale.setScalar(.2+U*3),g.material.opacity=X>0?(1-U)*.24:0})}for(const g of s)g.rotation.y=-E*9;D.position.set(M,3,3),D.intensity=20;const k=y.bx-I*1.6;return o.position.set(k+I*.7,4.9,Math.max(13.7,10.5/o.aspect)),o.lookAt(k,2.1,0),f>0&&f<.45&&(o.position.y+=Math.sin(E*100)*.13*(1-f/.45)),_t(y,E,lo,x),G.style.opacity=E<.25?String(pt(E/.25)):E>6.05?String(1-pt((E-6.05)/.8)):"1",E>=lo?(m(!0),!0):!1}function w(x){H=x,x?b.pause():F&&b.play().catch(()=>{})}return{start:p,update:L,cancel:m,pause:w,unlock:P,get active(){return!!F},get elapsed(){return F?.t||0}}}function qo(e="player"){const o=document.getElementById(e+"-preview"),t=o.parentElement,n=new on,i=new nn(34,1,.1,50),s=new sn({canvas:o,antialias:Ee.previewAntialias,alpha:!0});s.setPixelRatio(Math.min(devicePixelRatio,Ee.previewPixelRatio)),s.toneMapping=an,s.toneMappingExposure=1.15,s.outputColorSpace=at,n.add(new rn(15853788,2765912,2.4));const a=new cn(16770246,3.5);a.position.set(-3,5,4),n.add(a);const c=new Ye(15944535,30,12);c.position.set(2,3,-1),n.add(c);const l=new j(new So(.72,.74,80),new he({color:15944535,transparent:!0,opacity:.7,side:ze}));l.rotation.x=-Math.PI/2,l.position.y=.01,n.add(l);const r=new j(new tn(.74,80),new he({color:15944535,transparent:!0,opacity:.055,side:ze}));r.rotation.x=-Math.PI/2,n.add(r);const d=Po(n,2239029,12159340,!0);d.body.visible=!1,d.dir=1,d.hp=100;let S=1;performance.now();let T=0,u=!0,v=0;const h=Ee.previewFPS;new IntersectionObserver(([H])=>{u=H.isIntersecting}).observe(t);const R=matchMedia("(prefers-reduced-motion: reduce)").matches;function D(){const H=t.clientWidth,P=t.clientHeight;s.setSize(H,P,!1),i.aspect=H/P,i.updateProjectionMatrix()}new ResizeObserver(D).observe(t),D();async function G(H){const P=++v;t.classList.add("loading");try{if(await yo(d,e==="opponent",H),P!==v)return;d.hp=100,d.attack=0,d.kind="",d.block=!1,d.recoil=0,d.walk=0,d.lastX=0,S=R?1:0;const p=e==="opponent"?6462975:15944535;c.color.setHex(p),l.material.color.setHex(p),r.material.color.setHex(p),t.querySelector(".preview-name").textContent=st[H]?.owner||H.toUpperCase(),t.querySelector(".power-owner").textContent=st[H].owner+"'S SUPER",t.querySelector(".power-name").textContent=st[H].name,t.querySelector(".preview-role").textContent=e==="opponent"?"CPU OPPONENT":"YOUR FIGHTER",t.dataset.character=H,t.dataset.slot=e,t.classList.remove("reveal"),t.offsetWidth,t.classList.add("reveal")}finally{P===v&&t.classList.remove("loading")}}function F(H){if(requestAnimationFrame(F),document.hidden||!u||document.body.classList.contains("playing")||!d.modelRig||H-T<1e3/h)return;const P=Math.min((H-T)/1e3,.08);T=H,S=Math.min(1,S+P*1.4);const p=1-Math.pow(1-S,3);d.root.position.y=(1-p)*-.45,d.root.rotation.y=(e==="opponent"?.3:-.3)+(1-p)*(e==="opponent"?1.4:-1.4),ve(d,P),S<1&&(d.modelRig.bones.chest.rotation.y+=Math.sin(S*Math.PI)*.12);const m=Math.max(6.05,2.35/i.aspect);i.position.set(.18+(1-p)*.9,2.5,m+(1-p)*1.2),i.lookAt(0,1.77,0),l.scale.setScalar(1+(1-p)*.8),l.material.opacity=.4+(1-p)*.5,r.material.opacity=.055+(1-p)*.08,s.render(n,i)}return requestAnimationFrame(F),{show:G}}const A=e=>document.getElementById(e),fe=new on,ne=new nn(42,innerWidth/innerHeight,.05,100);window.ne=ne;ne.position.set(0,1.85,9.2);ne.lookAt(0,1.45,0);const Pe=new sn({canvas:A("game"),antialias:Ee.antialias});Pe.setSize(innerWidth,innerHeight);Pe.setPixelRatio(Math.min(devicePixelRatio,Ee.pixelRatio));Pe.shadowMap.enabled=!0;Pe.shadowMap.type=Bn;Pe.toneMapping=an;Pe.toneMappingExposure=1.18;Pe.outputColorSpace=at;fe.add(new rn(14215160,2893346,1.8));function Lo(e,o,t,n,i){if(ae&&i<60)return;const s=new Ye(e,i,25);s.position.set(o,t,n),fe.add(s)}Lo(16753749,-5,5,2,90);Lo(7853800,5,5,0,100);const to=new cn(16772570,3.2);to.position.set(-3,8,6);to.castShadow=!0;to.shadow.bias=-0.00035;to.shadow.normalBias=0.02;to.shadow.mapSize.set(Ee.shadowSize,Ee.shadowSize);if(to.shadow.camera){to.shadow.camera.near=1;to.shadow.camera.far=28;to.shadow.camera.left=-9;to.shadow.camera.right=9;to.shadow.camera.top=9;to.shadow.camera.bottom=-4}fe.add(to);const rimLight=new cn(16771016,1.5);rimLight.position.set(3,5,-6);fe.add(rimLight);const Ze={...Ne,startingHealth:80},wt=new Map;function Me(e,o,t=0,n=0,i=0){e.translate(t,n,i),wt.has(o)||wt.set(o,[]),wt.get(o).push(e)}function Z(e,o,t,n,i=0,s=0,a=0){Me(new ot(e,o,t),n,i,s,a)}function Is(){for(const[e,o]of wt){const t=new j(qn(o),new ee({color:e,roughness:.8}));t.castShadow=!ae,t.receiveShadow=!0,fe.add(t),o.forEach(n=>n.dispose())}wt.clear()}const Os=new ot(.055,.055,.055),zo={hit:new ee({color:15400811,roughness:.8}),blocked:new ee({color:9362170,roughness:.8})},Hs=new So(.07,.12,32),He=3810326,uo=1839628,bo=4860962,qe=14066238,Sn=[9191212,8074790,9849135];function Io(e,o,t,n,i,s,a,c){const l=document.createElement("canvas");l.width=e,l.height=o,i(l.getContext("2d"));const r=new Yt(l);r.colorSpace=at;const d=new j(new Mo(t,n),new he({map:r,transparent:!0,toneMapped:!1}));return d.position.set(s,a,c),fe.add(d),d}function Ds(e,o,t,n,i,s){Io(512,160,2.6,.8,a=>{a.fillStyle="#2a170e",a.fillRect(0,0,512,160),a.strokeStyle="#c99a45",a.lineWidth=8,a.strokeRect(8,8,496,144),a.textAlign="center",a.fillStyle="#f3e3c0",a.font='bold 40px "Nirmala UI", "Noto Sans Devanagari", "Mangal", sans-serif',a.fillText(e,256,62),a.fillStyle=s,a.font='900 52px Impact, "Arial Black", sans-serif',a.fillText(o,256,132)},t,n,i)}function Ns(e,o,t){Io(1024,176,6.2,1.06,n=>{n.fillStyle="#b3122e",n.fillRect(0,0,1024,176),n.strokeStyle="#1d3f9a",n.lineWidth=14,n.strokeRect(7,7,1010,162),n.strokeStyle="#e9b949",n.lineWidth=4,n.strokeRect(22,22,980,132),n.textAlign="center",n.fillStyle="#ffe7a6",n.font='800 34px Impact, "Arial Black", sans-serif',n.fillText("BUILT BY",512,66),n.fillStyle="#ffffff",n.font='900 66px Impact, "Arial Black", sans-serif',n.fillText("PZ48HCE",512,136)},e,o,t)}function Ws(){const e=Io(2048,512,170,40,o=>{const t=(i,s,a)=>{const c=[];for(let l=0;l<=2048;l+=16){const r=Math.sin(l*.004+a)*.5+Math.sin(l*.011+a*2)*.3+Math.abs(Math.sin(l*.023+a*3))*.35;c.push([l,i-r*s])}return c},n=(i,s,a)=>{o.beginPath(),o.moveTo(0,512);for(const[l,r]of i)o.lineTo(l,r);o.lineTo(2048,512),o.closePath();const c=o.createLinearGradient(0,a-90,0,a+40);c.addColorStop(0,"#f4f1f6"),c.addColorStop(.55,"#d9d6e6"),c.addColorStop(1,s),o.fillStyle=c,o.fill()};n(t(330,260,1.3),"#5d5f7e",170),n(t(420,150,4.1),"#3e3a52",300)},0,16,-42);e.material.fog=!1,e.material.depthWrite=!1,e.renderOrder=-1}function Fs(){const e=document.createElement("canvas");e.width=4,e.height=256;const o=e.getContext("2d"),t=o.createLinearGradient(0,0,0,256);t.addColorStop(0,"#0e1530"),t.addColorStop(.4,"#2e2f58"),t.addColorStop(.62,"#8a4c6c"),t.addColorStop(.78,"#e39563"),t.addColorStop(1,"#46333d"),o.fillStyle=t,o.fillRect(0,0,4,256);const n=new Yt(e);return n.colorSpace=at,n}fe.background=Fs();fe.fog=new jn("#4a3747",18,52);Ws();function Yo(e,o,t,n,i,s){const a=new Yn(e,o,4);a.rotateY(Math.PI/4),Me(a,t,n,i,s)}function Tn(e,o,t,n){for(let a=0;a<3;a++)Z((7-a*1.4)*t,.5*t,(6-a*1.2)*t,7232587,e,(.25+a*.5)*t,o);let i=1.5*t,s=3*t;for(let a=0;a<n;a++){const c=(a===0?2.4:1.2)*t;if(Z(s,c,s,Sn[1],e,i+c/2,o),a===0){Z(1*t,1.6*t,.1,qe,e,i+.8*t,o+s/2);for(const l of[-1,1])Z(.5*t,.7*t,.1,He,e+l*.95*t,i+1.3*t,o+s/2)}i+=c,Yo(s*.95+.9*t,1.1*t,bo,e,i+.45*t,o),Z(s*1.3+.6*t,.08*t,s*1.3+.6*t,qe,e,i-.05*t,o),i+=.5*t,s*=.7}return Yo(.3*t,1.2*t,qe,e,i+.7*t,o),Me(new xe(.22*t,10,8),qe,e,i+1.4*t,o),i+1.4*t}function Us(e,o){return Z(9,1.2,9,14209732,e,.6,o),Z(7,1,7,15131093,e,1.7,o),Me(new xe(3.6,24,12,0,Math.PI*2,0,Math.PI/2),15854818,e,2.2,o),Z(1.8,1.3,1.8,qe,e,6.4,o),Me(new ke(.15,1.1,3.8,4),qe,e,9,o),Me(new xe(.3,10,8),qe,e,11.1,o),11}const Gs=[2776278,16053488,14168367,3119690,15909424];function Tt(e,o,t,n){for(let i=1;i<n;i++){const s=i/n,a=new ot(.24,.3,.015);a.rotateY((Math.random()-.5)*.4),Me(a,Gs[i%5],K.lerp(e[0],o[0],s),K.lerp(e[1],o[1],s)-Math.sin(Math.PI*s)*t-.15,K.lerp(e[2],o[2],s))}}function Bs(e,o,t){const n=s=>{const a=new To;return a.moveTo(0,0),a.lineTo(.95*s,0),a.lineTo(.38*s,.55*s),a.lineTo(.9*s,.55*s),a.lineTo(0,1.3*s),a.closePath(),new $n(a)};Me(n(1),14483,e,o,t);const i=n(.84);i.translate(.07,.08,.01),Me(i,14423100,e,o,t)}Z(90,.2,60,3878954,0,-.16,0);Z(60,.12,7,6969416,0,-.02,0);for(let e=-29;e<=29;e++)Z(.03,.01,7,8679516,e,.05,0);for(const e of[-3.4,3.4])Z(60,.08,.12,10126960,0,.06,e);const $o={"-2":["चिया पसल","CHIYA PASAL","#ffb36b"],2:["मःम पसल","MOMO HOUSE","#ffe28a"],"-4":["असन बजार","ASAN BAZAAR","#9de9ed"],4:["थमेल","THAMEL","#ff9fb0"],"-6":["भक्तपुर","BHAKTAPUR","#c8f08a"],6:["पाटन","PATAN","#ffd36b"]};for(let e=-7;e<=7;e++){if(Math.abs(e)<2)continue;const o=e*3.6,t=5.6+(e*7+21)%3*.7,n=Sn[(e+21)%3];Z(3.4,t,3,n,o,t/2,-6),Z(3,1.85,.12,uo,o,.95,-4.45);for(let s=0;s<6;s++)Z(2.9,.03,.05,5913124,o,.2+s*.3,-4.37);Z(3.5,.14,.3,He,o,1.95,-4.4);for(const[s,a]of[[3.3,3],[4.7,2]])if(!(s+.6>t-.4)){for(let c=0;c<a;c++){const l=o+(c-(a-1)/2)*(a===3?1.05:1.4);Z(.78,.92,.08,He,l,s,-4.47),Z(.52,.64,.1,uo,l,s,-4.45),Z(1,.1,.16,5913122,l,s+.55,-4.43),Z(.04,.62,.12,7162412,l,s,-4.42)}Z(3.5,.1,.22,5913122,o,s-.62,-4.44)}const i=new ot(3.9,.14,1.7);i.rotateX(.42),Me(i,bo,o,t+.05,-4.25),Z(3.5,.5,2.6,bo,o,t+.2,-6.2);for(const s of[-1.4,0,1.4]){const a=new ot(.08,.9,.08);a.rotateX(-.6),Me(a,He,o+s,t-.45,-4.25)}if($o[e]){const[s,a,c]=$o[e];Ds(s,a,o,2.28,-4.22,c)}if(Math.abs(e)%2===1){Z(1.8,.08,.7,He,o,.78,-3.7);for(const s of[-.8,.8])Z(.08,.78,.6,uo,o+s,.39,-3.7);for(let s=0;s<4;s++)Me(new xe(.16,8,6),[14710831,13777450,8368188,15254855][(s+e+14)%4],o-.6+s*.4,.95,-3.7)}}const Cn=Tn(0,-9.5,1,3);Tn(15,-18,1.3,5);const An=Us(-15,-19);for(const e of[-3.6,3.6])Z(.14,6.2,.14,He,e,3.1,-4.6);Ns(0,4.55,-4.55);Bs(3.62,6.2,-4.6);Tt([-3.6,5.7,-4.6],[3.6,5.7,-4.6],.25,22);Tt([0,Cn,-9.5],[-8.6,7,-4.6],.8,18);Tt([0,Cn,-9.5],[8.6,7,-4.6],.8,18);Tt([-15,An,-19],[-22,3.2,-15],1.4,20);Tt([-15,An,-19],[-8,3.2,-15],1.4,20);for(const e of[-7,7])Z(.14,4.6,.14,He,e,2.3,-2),Z(.9,.1,.12,He,e,4.5,-2),Z(.36,.44,.36,16764794,e,4.2,-2),Lo(16756838,e,4.2,-2,45);Is();const O=Po(fe,2239029,12159340,!0),W=Po(fe,4285795,12029813,!1);window.fighterP1=O;window.fighterP2=W;O.root.position.x=-2;W.root.position.x=2;let z="intro",je=Ze.roundSeconds,we=[0,0],kt=1,wo=0,_e=0,_cMove=null,_cGuard=!1,_cCrouch=!1,_cDodgeMove=null,ft=0;function RbSuper(e,o){
  const t=new re,bell=new re;t.add(bell);e.add(t);t.visible=!1;
  const gold=new ee({color:16236612,metalness:.85,roughness:.20,emissive:4464896,emissiveIntensity:.4});
  const blue=new ee({color:1019386,metalness:.38,roughness:.28,emissive:269720,emissiveIntensity:.5});
  const skirt=new j(new ke(.52,1.42,1.34,28),gold);skirt.position.y=0;skirt.castShadow=!0;bell.add(skirt);
  const rim=new j(new $e(1.38,.12,10,28),gold);rim.rotation.x=Math.PI/2;rim.position.y=-.66;bell.add(rim);
  const topDome=new j(new xe(.55,16,12),gold);topDome.position.y=.68;bell.add(topDome);
  const ringHandle=new j(new $e(.26,.065,10,20),blue);ringHandle.position.y=1.22;bell.add(ringHandle);
  const clapper=new j(new xe(.24,14,12),blue);clapper.position.y=-.68;bell.add(clapper);
  const waveMats=[],waves=[];
  for(let k=0;k<4;k++){
    const m=new he({color:k%2?16236612:1487615,transparent:!0,opacity:0,side:ze,depthWrite:!1});
    const r=new j(new So(.85,1.22,32),m);r.rotation.x=-Math.PI/2;r.position.y=.08;r.visible=!1;
    e.add(r);waveMats.push(m);waves.push(r);
  }
  const sparks=[];
  for(let k=0;k<16;k++){
    const sp=new j(new ho(.11),k%2?gold:blue);sp.visible=!1;e.add(sp);sparks.push(sp);
  }
  const lt=new Ye(1487615,0,18);e.add(lt);
  const P=Kt("audio/rabi-super.m4a"),p=Zt("rabi","rabi-super-banner");
  const hitsAt=[2.10,3.45,4.75];
  let m=null,L=!1;
  function w(){P.muted=!0,P.play()?.then(()=>{m||(P.pause(),P.currentTime=0),P.muted=mo<=0.001}).catch(()=>{P.muted=mo<=0.001})}
  function x(C,f,M){
    if(m)return!1;
    m={actor:C,victim:f,onHit:M,t:0,hits:0,dir:C.root.position.x<f.root.position.x?1:-1,ax:C.root.position.x,bx:f.root.position.x};
    Vt(m),L=!1,t.visible=!0;
    for(const k of[C,f])k.move=null,k.attack=0,k.block=!1;
    eo(p,"rabi",C),p.classList.add("visible"),document.body.classList.add("train-cinematic");
    P.currentTime=0,P.muted=mo<=0.001,P.volume=mo,P.play().catch(()=>{});
    return!0;
  }
  function y(C=!1){
    if(!m)return;const f=m;P.pause(),P.currentTime=0,Qt(f,o,C);
    t.visible=!1,waves.forEach(u=>u.visible=!1),sparks.forEach(u=>u.visible=!1),lt.intensity=0;
    p.classList.remove("visible"),document.body.classList.remove("train-cinematic"),m=null;
  }
  function E(C){
    if(!m||L)return!1;const f=m,dur=7.2;
    f.t=Math.min(dur,!P.paused&&P.currentTime>0?Math.max(f.t,P.currentTime):f.t+C);
    const M=f.t,k=f.dir,ent=ct(M/.95);
    while(f.hits<hitsAt.length&&M>=hitsAt[f.hits]){f.hits++;f.onHit(10);}
    const lastHit=f.hits?hitsAt[f.hits-1]:-99,dtHit=M-lastHit;
    const hop1=M>1.65&&M<2.45?Math.sin(((M-1.65)/.8)*Math.PI)*.95:0;
    const hop2=M>2.95&&M<3.80?Math.sin(((M-2.95)/.85)*Math.PI)*1.15:0;
    const hop3=M>4.20&&M<5.05?Math.sin(((M-4.20)/.85)*Math.PI)*1.45:0;
    f.actor.root.position.set(K.lerp(f.ax,f.bx-k*3.05,ent),hop1+hop2+hop3,0);
    f.actor.root.rotation.set(0,k*1.32,0),ve(f.actor,C);
    let bellY=K.lerp(11.0,3.2,ct((M-.35)/1.7));
    if(M>=3.95&&M<4.75)bellY=3.2+Math.sin(((M-3.95)/.8)*Math.PI)*2.4;
    else if(M>=4.75)bellY=K.lerp(3.2,2.15,ct((M-4.75)/.35))+Math.abs(Math.sin((M-4.75)*10))*.28;
    const bellScale=M>=4.6?1.22:1.0+.14*Math.max(0,Math.sin(Math.PI*Math.min(1,dtHit/.35)));
    t.position.set(f.bx,bellY,0);t.scale.setScalar(bellScale);
    bell.rotation.z=M>1.8&&M<5.8?Math.sin(M*17)*(dtHit>=0&&dtHit<.45?.42:.16):0;
    bell.rotation.y=M*2.1;
    if(M<4.75){
      const lift=f.hits===0?0:f.hits===1?.45*ct((M-2.1)/.3):.95+Math.sin(M*9)*.18;
      f.victim.root.position.set(f.bx+Math.sin(M*24)*(dtHit>=0&&dtHit<.25?.16:0),lift,0);
      f.victim.root.rotation.set(Math.sin(M*6)*lift*.12,-k*1.15,dtHit>=0&&dtHit<.25?-k*.22:0);
      ve(f.victim,C);
    }else{
      Jt(f,M-4.75,{upward:2.9,gravity:14,speed:4.3,bounce:.14},C);
    }
    waves.forEach((wMesh,idx)=>{
      const beatT=hitsAt[idx%hitsAt.length],dtW=M-beatT-(idx===3?.18:0);
      if(dtW>=0&&dtW<1.25){wMesh.visible=!0;const pr=dtW/1.25;wMesh.position.set(f.bx,.14,0);wMesh.scale.setScalar(.5+pr*4.8);waveMats[idx].opacity=(1-pr)*.78}
      else wMesh.visible=!1;
    });
    sparks.forEach((sp,idx)=>{
      const baseT=idx<6?hitsAt[0]:idx<11?hitsAt[1]:hitsAt[2];
      const dtS=M-baseT-(idx%3)*.06;
      if(dtS>=0&&dtS<1.15){sp.visible=!0;const a=idx*.42+M*3.5,pr=dtS/1.15;sp.position.set(f.bx+Math.cos(a)*(1.0+pr*3.6),1.0+Math.sin(pr*Math.PI)*2.8,Math.sin(a)*(1.0+pr*2.4));sp.rotation.set(M*5,M*4,0)}
      else sp.visible=!1;
    });
    lt.position.set(f.bx,4.2,2.6);lt.intensity=M<6.2?(dtHit>=0&&dtHit<.25?24:15):0;
    const sweepAng=ct(M/5.2)*k*.85;
    const camX=f.bx-k*.9+sweepAng*.5,camY=4.7+Math.sin(M*.9)*.55,camZ=Math.max(13.6,9.8/o.aspect)+(M>4.75?ct((M-4.75)/1.4)*1.4:0);
    o.position.set(camX+k*.7-sweepAng,camY,camZ);
    o.lookAt(f.bx-k*.7,2.25,0);
    dtHit>=0&&dtHit<.28&&(o.position.y+=Math.sin(M*98)*.12*(1-dtHit/.28));
    _t(f,M,dur,C);
    p.style.opacity=M<.28?String(ct(M/.28)):M>6.35?String(1-ct((M-6.35)/.85)):"1";
    return M>=dur?(y(!0),!0):!1;
  }
  function I(C){L=C,C?P.pause():m&&P.play().catch(()=>{})}
  return{start:x,update:E,cancel:y,pause:I,unlock:w,get active(){return!!m},get elapsed(){return m?.t||0},get height(){return 0},get hits(){return m?.hits||0}}
}
function PgSuper(e,o){
  const t=new re,mic=new re;t.add(mic);e.add(t);t.visible=!1;
  const amber=new ee({color:16742656,metalness:.45,roughness:.26,emissive:5516288,emissiveIntensity:.55});
  const crimson=new ee({color:13377052,metalness:.32,roughness:.32,emissive:3932160,emissiveIntensity:.45});
  const chrome=new ee({color:14474460,metalness:.88,roughness:.18});
  const grip=new j(new ke(.15,.18,1.5,18),new ee({color:1710618,roughness:.6}));grip.position.y=-.55;mic.add(grip);
  const head=new j(new xe(.45,16,12),chrome);head.position.y=.35;mic.add(head);
  const flag=new j(new ke(.48,.48,.34,4),amber);flag.position.y=.04;mic.add(flag);
  const cvs=document.createElement("canvas");cvs.width=512;cvs.height=160;
  const cx=cvs.getContext("2d");
  cx.fillStyle="#c81e2b";cx.fillRect(0,0,512,160);
  cx.strokeStyle="#ffcf4a";cx.lineWidth=10;cx.strokeRect(8,8,496,144);
  cx.fillStyle="#ffffff";cx.textAlign="center";cx.font='900 58px Impact, "Arial Black", sans-serif';
  cx.fillText("BREAKING VIRAL!",256,82);
  cx.fillStyle="#ffe77a";cx.font='800 30px Impact, "Arial Black", sans-serif';
  cx.fillText("PUNYA GAUTAM LIVE",256,128);
  const tex=new Yt(cvs);tex.colorSpace=at;
  const board=new j(new Mo(4.8,1.5),new he({map:tex,transparent:!0,side:ze,toneMapped:!1}));
  board.position.set(0,1.72,-.4);t.add(board);
  const ringMats=[],rings=[];
  for(let k=0;k<4;k++){
    const rm=new he({color:k%2?16755264:14433340,transparent:!0,opacity:0,side:ze,depthWrite:!1});
    const rMesh=new j(new So(.75,1.12,32),rm);rMesh.rotation.x=-Math.PI/2;rMesh.position.y=.1;rMesh.visible=!1;
    e.add(rMesh);ringMats.push(rm);rings.push(rMesh);
  }
  const orbs=[];
  for(let k=0;k<16;k++){
    const ob=new j(new ho(.12),k%2?amber:crimson);ob.visible=!1;e.add(ob);orbs.push(ob);
  }
  const lt=new Ye(16744230,0,18);e.add(lt);
  const P=Kt("audio/punya-super.m4a"),p=Zt("punya","punya-super-banner");
  const hitsAt=[2.10,3.45,4.75];
  let m=null,L=!1;
  function w(){P.muted=!0,P.play()?.then(()=>{m||(P.pause(),P.currentTime=0),P.muted=mo<=0.001}).catch(()=>{P.muted=mo<=0.001})}
  function x(C,f,M){
    if(m)return!1;
    m={actor:C,victim:f,onHit:M,t:0,hits:0,dir:C.root.position.x<f.root.position.x?1:-1,ax:C.root.position.x,bx:f.root.position.x};
    Vt(m),L=!1,t.visible=!0;
    for(const k of[C,f])k.move=null,k.attack=0,k.block=!1;
    eo(p,"punya",C),p.classList.add("visible"),document.body.classList.add("train-cinematic");
    P.currentTime=0,P.muted=mo<=0.001,P.volume=mo,P.play().catch(()=>{});
    return!0;
  }
  function y(C=!1){
    if(!m)return;const f=m;P.pause(),P.currentTime=0,Qt(f,o,C);
    t.visible=!1,rings.forEach(u=>u.visible=!1),orbs.forEach(u=>u.visible=!1),lt.intensity=0;
    p.classList.remove("visible"),document.body.classList.remove("train-cinematic"),m=null;
  }
  function E(C){
    if(!m||L)return!1;const f=m,dur=7.2;
    f.t=Math.min(dur,!P.paused&&P.currentTime>0?Math.max(f.t,P.currentTime):f.t+C);
    const M=f.t,k=f.dir,ent=ct(M/.95);
    while(f.hits<hitsAt.length&&M>=hitsAt[f.hits]){f.hits++;f.onHit(10);}
    const lastHit=f.hits?hitsAt[f.hits-1]:-99,dtHit=M-lastHit;
    const hop1=M>1.65&&M<2.45?Math.sin(((M-1.65)/.8)*Math.PI)*.9:0;
    const hop2=M>2.95&&M<3.80?Math.sin(((M-2.95)/.85)*Math.PI)*1.1:0;
    const hop3=M>4.20&&M<5.05?Math.sin(((M-4.20)/.85)*Math.PI)*1.5:0;
    f.actor.root.position.set(K.lerp(f.ax,f.bx-k*3.05,ent),hop1+hop2+hop3,0);
    f.actor.root.rotation.set(0,k*1.32,0),ve(f.actor,C);
    const slam=ct((M-.4)/1.7);
    let propY=K.lerp(6.4,2.25,slam),propX=K.lerp(f.bx-k*3.4,f.bx,slam);
    if(M>=2.1&&M<4.1){propY=2.35+Math.sin(M*4)*.35;propX=f.bx+Math.sin((M-2.1)*3.2)*k*.65}
    else if(M>=4.1&&M<4.75){propY=2.35+Math.sin(((M-4.1)/.65)*Math.PI)*2.5;propX=f.bx}
    else if(M>=4.75){propY=2.05;propX=f.bx}
    t.position.set(propX,propY,0);
    mic.rotation.z=M*7.2;mic.rotation.y=M*3.6;
    board.rotation.y=Math.sin(M*3.5)*.22;board.scale.setScalar(.88+.16*Math.sin(M*9)+(M>=4.6?.18:0));
    if(M<4.75){
      const lift=f.hits===0?0:f.hits===1?.48*ct((M-2.1)/.3):1.05+Math.sin(M*10)*.18;
      f.victim.root.position.set(f.bx+Math.sin(M*22)*(dtHit>=0&&dtHit<.25?.18:0),lift,0);
      f.victim.root.rotation.set(Math.sin(M*5)*lift*.14,-k*1.15+(f.hits>=2?(M-3.45)*2.4:0),dtHit>=0&&dtHit<.25?-k*.22:0);
      ve(f.victim,C);
    }else{
      Jt(f,M-4.75,{upward:3.0,gravity:14.5,speed:4.4,bounce:.12},C);
    }
    rings.forEach((wMesh,idx)=>{
      const beatT=hitsAt[idx%hitsAt.length],dtW=M-beatT-(idx===3?.16:0);
      if(dtW>=0&&dtW<1.25){wMesh.visible=!0;const pr=dtW/1.25;wMesh.position.set(f.bx,.14,0);wMesh.scale.setScalar(.5+pr*4.9);ringMats[idx].opacity=(1-pr)*.8}
      else wMesh.visible=!1;
    });
    orbs.forEach((ob,idx)=>{
      const baseT=idx<6?hitsAt[0]:idx<11?hitsAt[1]:hitsAt[2];
      const dtO=M-baseT-(idx%3)*.06;
      if(dtO>=0&&dtO<1.2){ob.visible=!0;const a=idx*.42+M*4.2,pr=dtO/1.2;ob.position.set(f.bx+Math.cos(a)*(1.0+pr*3.7),1.0+Math.sin(pr*Math.PI)*2.9,Math.sin(a)*(1.0+pr*2.5));ob.rotation.set(M*5,M*4,0)}
      else ob.visible=!1;
    });
    lt.position.set(f.bx,4.0,2.8);lt.intensity=M<6.2?(dtHit>=0&&dtHit<.25?24:16):0;
    const sweep=ct(M/5.2)*k*.85;
    o.position.set(f.bx-k*.9+k*.65-sweep,4.75+Math.cos(M*.95)*.5,Math.max(13.6,9.8/o.aspect)+(M>4.75?ct((M-4.75)/1.4)*1.4:0));
    o.lookAt(f.bx-k*.7,2.25,0);
    dtHit>=0&&dtHit<.28&&(o.position.y+=Math.sin(M*98)*.12*(1-dtHit/.28));
    _t(f,M,dur,C);
    p.style.opacity=M<.28?String(ct(M/.28)):M>6.35?String(1-ct((M-6.35)/.85)):"1";
    return M>=dur?(y(!0),!0):!1;
  }
  function I(C){L=C,C?P.pause():m&&P.play().catch(()=>{})}
  return{start:x,update:E,cancel:y,pause:I,unlock:w,get active(){return!!m},get elapsed(){return m?.t||0},get height(){return 0},get hits(){return m?.hits||0}}
}
function CoalitionSuper(e, o) {
  const t = new re; t.visible = !1; e.add(t);
  const crimson = new ee({color: 14423100, metalness: .4, roughness: .3, emissive: 4456448, emissiveIntensity: .6});
  const gold = new ee({color: 16236612, metalness: .85, roughness: .22, emissive: 4464896, emissiveIntensity: .4});
  const onyx = new ee({color: 1710618, metalness: .5, roughness: .35});
  const vortexMat = new he({color: 14423100, transparent: !0, opacity: 0, side: ze, depthWrite: !1, blending: Zo});
  
  const vortexRings = [];
  for (let k = 0; k < 6; k++) {
    const r = new j(new So(.6 + k * .45, 1.0 + k * .55, 32), vortexMat);
    r.rotation.x = -Math.PI / 2; r.position.y = .1 + k * .4; t.add(r); vortexRings.push(r);
  }

  const chessPieces = [];
  function makeKing(mat) {
    const g = new re;
    const base = new j(new ke(.36, .42, .18, 16), mat); base.position.y = .09; g.add(base);
    const body = new j(new ke(.18, .28, 1.1, 16), mat); body.position.y = .73; g.add(body);
    const collar = new j(new $e(.25, .045, 8, 16), mat); collar.position.y = 1.32; g.add(collar);
    const crown = new j(new ke(.28, .22, .32, 16), mat); crown.position.y = 1.5; g.add(crown);
    const crossV = new j(new ko(.09, .26, .07), gold); crossV.position.y = 1.76; g.add(crossV);
    const crossH = new j(new ko(.24, .08, .07), gold); crossH.position.y = 1.76; g.add(crossH);
    t.add(g); return g;
  }
  function makeRook(mat) {
    const g = new re;
    const base = new j(new ke(.35, .40, .18, 16), mat); base.position.y = .09; g.add(base);
    const body = new j(new ke(.22, .28, .92, 16), mat); body.position.y = .64; g.add(body);
    const head = new j(new ke(.32, .28, .35, 16), mat); head.position.y = 1.25; g.add(head);
    for (let i = 0; i < 4; i++) {
      const tooth = new j(new ko(.12, .16, .12), mat);
      const ang = i * Math.PI / 2; tooth.position.set(Math.cos(ang) * .24, 1.48, Math.sin(ang) * .24); g.add(tooth);
    }
    t.add(g); return g;
  }
  chessPieces.push(makeKing(gold), makeKing(crimson), makeKing(onyx));
  chessPieces.push(makeRook(gold), makeRook(crimson), makeRook(onyx));

  const lt = new Ye(14423100, 0, 18); e.add(lt);
  const P = Kt("audio/prachanda-super.m4a"), p = Zt("prachanda", "coalition-super-banner");
  const hitsAt = [2.0, 3.3, 4.6];
  let m = null, L = !1;
  function w() { P.muted = !0; P.play()?.then(() => { m || (P.pause(), P.currentTime = 0); P.muted = mo <= 0.001; }).catch(() => { P.muted = mo <= 0.001; }); }
  function x(C, f, M) {
    if (m) return !1;
    m = { actor: C, victim: f, onHit: M, t: 0, hits: 0, dir: C.root.position.x < f.root.position.x ? 1 : -1, ax: C.root.position.x, bx: f.root.position.x };
    Vt(m); L = !1; t.visible = !0;
    for (const k of [C, f]) k.move = null, k.attack = 0, k.block = !1;
    eo(p, "prachanda", C); p.classList.add("visible"); document.body.classList.add("train-cinematic");
    P.currentTime = 0; P.muted = mo <= 0.001; P.play().catch(() => {});
    return !0;
  }
  function y(force = !1) {
    if (!m) return;
    const f = m; P.pause(); P.currentTime = 0; Qt(f, o, force);
    t.visible = !1; lt.intensity = 0; p.classList.remove("visible"); document.body.classList.remove("train-cinematic");
    m = null;
  }
  function E(delta) {
    if (!m || L) return !1;
    const f = m;
    f.t = Math.min(6.8, !P.paused && P.currentTime > 0 ? Math.max(f.t, P.currentTime) : f.t + delta);
    const M = f.t, dir = f.dir, dur = 6.8;
    const intro = ct(M / 1.1), fade = 1 - ct((M - 5.8) / 1.0), intensity = intro * fade;
    t.position.set(f.bx, 0, 0);

    for (; f.hits < hitsAt.length && M >= hitsAt[f.hits];) {
      f.hits++; f.onHit(10);
      playFightkaroSfx("boom", 0.85); playFightkaroSfx("hit_3", 0.7); triggerScreenFlash("super");
    }

    for (let k = 0; k < vortexRings.length; k++) {
      const vr = vortexRings[k];
      vr.rotation.z = M * (4 + k * 1.5);
      vr.scale.setScalar(1 + Math.sin(M * 5 + k) * .2 + intro * .8);
      vr.material.opacity = Math.max(0, (0.7 - k * .08) * intensity);
    }

    for (let k = 0; k < chessPieces.length; k++) {
      const cp = chessPieces[k];
      const ang = M * (5.5 + k * .8) + (k * Math.PI / 3);
      const rad = Math.max(0.6, 2.4 - intro * .8 + Math.sin(M * 4 + k) * .5);
      const height = 0.8 + Math.sin(M * 6 + k) * 1.2 + (M > 4.2 ? (k % 2 ? 2.5 : 0.5) : 0);
      cp.position.set(Math.cos(ang) * rad, height, Math.sin(ang) * rad);
      cp.rotation.set(M * 4 + k, ang + Math.PI / 2, M * 3);
      cp.scale.setScalar(0.9 + Math.sin(M * 5 + k) * .15);
    }

    lt.position.set(f.bx, 2.5, 1.5); lt.intensity = 28 * intensity;

    f.actor.root.position.set(K.lerp(f.ax, f.bx - dir * 2.8, ct(M / .8)), 0, 0);
    f.actor.root.rotation.set(0, dir * .95, 0);
    ve(f.actor, delta);

    if (M < 4.8) {
      const lift = ct((M - 1.2) / 1.2);
      f.victim.root.position.set(f.bx + Math.sin(M * 12) * .22 * lift, lift * (1.3 + Math.sin(M * 8) * .5), Math.cos(M * 12) * .25 * lift);
      f.victim.root.rotation.set(Math.sin(M * 6) * .35 * lift, f.victim.dir * 1.1 + M * 4 * lift, Math.cos(M * 6) * .3 * lift);
      f.victim.superFall = lift * .8;
      ve(f.victim, delta); nt(f.victim);
    } else {
      Jt(f, M - 4.8, { upward: 3.5, gravity: 15, speed: 3.8, bounce: .08 }, delta);
    }

    const camX = f.bx - dir * .9;
    o.position.set(camX + dir * .7, 3.8, Math.max(12.5, 9.5 / o.aspect));
    o.lookAt(camX, 2.1, 0);
    if (f.hits && M - hitsAt[f.hits - 1] < .18) o.position.x += Math.sin(M * 120) * .09;

    _t(f, M, dur, delta);
    p.style.opacity = M < .25 ? String(ct(M / .25)) : M > 5.9 ? String(1 - ct((M - 5.9) / .9)) : "1";
    return M >= dur ? (y(!0), !0) : !1;
  }
  function I(C) { L = C; C ? P.pause() : m && P.play().catch(() => {}); }
  return { start: x, update: E, cancel: y, pause: I, unlock: w, get active() { return !!m; }, get elapsed() { return m?.t || 0; }, get hits() { return m?.hits || 0; } };
}

// --- PANCH-TIME DAI: JYOTISHI 7-TERM PALM ---
function DeubaSuper(e, o) {
  const t = new re; t.visible = !1; e.add(t);
  const gold = new ee({color: 16766720, metalness: .85, roughness: .24, emissive: 6571520, emissiveIntensity: .45});
  const cyanGlow = new he({color: 4437247, transparent: !0, opacity: 0, blending: Zo, side: ze, depthWrite: !1});

  const hand = new re;
  const palm = new j(new ko(2.0, 2.4, .55, 3, .1), gold); palm.position.y = 1.2; hand.add(palm);
  const thumb = new j(new ke(.24, .20, 1.1, 14), gold); thumb.position.set(-1.18, .55, 0); thumb.rotation.z = .65; hand.add(thumb);
  const indexF = new j(new ke(.20, .17, 1.55, 14), gold); indexF.position.set(-.62, 2.85, 0); hand.add(indexF);
  const middleF = new j(new ke(.22, .18, 1.78, 14), gold); middleF.position.set(-.12, 3.02, 0); hand.add(middleF);
  const ringF = new j(new ke(.20, .17, 1.58, 14), gold); ringF.position.set(.42, 2.88, 0); hand.add(ringF);
  const pinkyF = new j(new ke(.18, .15, 1.32, 14), gold); pinkyF.position.set(.92, 2.68, 0); hand.add(pinkyF);
  const palmCircle = new j(new $e(.55, .05, 8, 24), gold); palmCircle.position.set(0, 1.2, .3); hand.add(palmCircle);
  t.add(hand);

  const stars = [];
  for (let k = 0; k < 7; k++) {
    const starG = new re;
    const core = new j(new ho(.25), gold); starG.add(core);
    const glow = new j(new xe(.38, 10, 8), cyanGlow); starG.add(glow);
    t.add(starG); stars.push(starG);
  }

  const blastRing = new j(new So(.4, 1.6, 32), cyanGlow);
  blastRing.rotation.x = -Math.PI / 2; blastRing.position.y = .05; t.add(blastRing);

  const lt = new Ye(16766720, 0, 20); e.add(lt);
  const P = Kt("audio/deuba-super.m4a"), p = Zt("deuba", "deuba-super-banner");
  const hitsAt = [1.9, 3.2, 4.5];
  let m = null, L = !1;
  function w() { P.muted = !0; P.play()?.then(() => { m || (P.pause(), P.currentTime = 0); P.muted = mo <= 0.001; }).catch(() => { P.muted = mo <= 0.001; }); }
  function x(C, f, M) {
    if (m) return !1;
    m = { actor: C, victim: f, onHit: M, t: 0, hits: 0, dir: C.root.position.x < f.root.position.x ? 1 : -1, ax: C.root.position.x, bx: f.root.position.x };
    Vt(m); L = !1; t.visible = !0;
    for (const k of [C, f]) k.move = null, k.attack = 0, k.block = !1;
    eo(p, "deuba", C); p.classList.add("visible"); document.body.classList.add("train-cinematic");
    P.currentTime = 0; P.muted = mo <= 0.001; P.play().catch(() => {});
    return !0;
  }
  function y(force = !1) {
    if (!m) return;
    const f = m; P.pause(); P.currentTime = 0; Qt(f, o, force);
    t.visible = !1; lt.intensity = 0; p.classList.remove("visible"); document.body.classList.remove("train-cinematic");
    m = null;
  }
  function E(delta) {
    if (!m || L) return !1;
    const f = m;
    f.t = Math.min(6.8, !P.paused && P.currentTime > 0 ? Math.max(f.t, P.currentTime) : f.t + delta);
    const M = f.t, dir = f.dir, dur = 6.8;
    const intro = ct(M / 1.0), fade = 1 - ct((M - 5.8) / 1.0), intensity = intro * fade;
    t.position.set(f.bx, 0, 0);

    for (; f.hits < hitsAt.length && M >= hitsAt[f.hits];) {
      f.hits++; f.onHit(10);
      playFightkaroSfx("boom", 0.9); playFightkaroSfx("hit_3", 0.75); triggerScreenFlash("super");
    }

    if (M < 4.4) {
      hand.position.set(0, 5.8 - intro * .8 + Math.sin(M * 4) * .35, 0);
      hand.rotation.set(Math.PI / 2.3, 0, Math.sin(M * 3) * .2);
      hand.scale.setScalar(1.1 + intro * .25);
    } else {
      const slamProgress = ct((M - 4.4) / .18);
      const slamY = K.lerp(5.0, 0.4, slamProgress);
      hand.position.set(0, slamY, 0);
      hand.rotation.set(Math.PI / 2, 0, 0);
      if (slamProgress > 0.8) {
        blastRing.scale.setScalar(1 + (M - 4.5) * 8);
        cyanGlow.opacity = Math.max(0, (1 - (M - 4.5) / .8) * .85);
      }
    }

    for (let k = 0; k < 7; k++) {
      const stG = stars[k];
      const ang = M * 5.8 + (k * Math.PI * 2 / 7);
      const rad = 1.8 + Math.sin(M * 6 + k) * .4;
      stG.position.set(Math.cos(ang) * rad, hand.position.y + Math.sin(ang * 2) * .6, Math.sin(ang) * rad);
      stG.rotation.set(M * 5, M * 6, k);
      stG.scale.setScalar(0.85 + Math.sin(M * 8 + k) * .25);
    }

    lt.position.set(f.bx, hand.position.y, 1.5); lt.intensity = 32 * intensity;

    f.actor.root.position.set(K.lerp(f.ax, f.bx - dir * 2.7, ct(M / .8)), 0, 0);
    f.actor.root.rotation.set(0, dir * .9, 0);
    ve(f.actor, delta);

    if (M < 4.5) {
      const wobble = ct((M - 1.2) / 1.2);
      f.victim.root.position.set(f.bx + Math.sin(M * 14) * .2 * wobble, 0, 0);
      f.victim.root.rotation.set(0, f.victim.dir * 1.15, Math.sin(M * 8) * .3 * wobble);
      f.victim.superFall = wobble * .6;
      ve(f.victim, delta); nt(f.victim);
    } else {
      Jt(f, M - 4.5, { upward: 3.4, gravity: 16, speed: 3.6, bounce: .08 }, delta);
    }

    const camX = f.bx - dir * .85;
    o.position.set(camX + dir * .65, 3.9, Math.max(12.8, 9.8 / o.aspect));
    o.lookAt(camX, 2.2, 0);
    if (f.hits && M - hitsAt[f.hits - 1] < .18) o.position.x += Math.sin(M * 110) * .09;

    _t(f, M, dur, delta);
    p.style.opacity = M < .25 ? String(ct(M / .25)) : M > 5.9 ? String(1 - ct((M - 5.9) / .9)) : "1";
    return M >= dur ? (y(!0), !0) : !1;
  }
  function I(C) { L = C; C ? P.pause() : m && P.play().catch(() => {}); }
  return { start: x, update: E, cancel: y, pause: I, unlock: w, get active() { return !!m; }, get elapsed() { return m?.t || 0; }, get hits() { return m?.hits || 0; } };
}

// --- HALO RAJA: ROYAL HALO CYCLONE ---
function RajaSuper(e, o) {
  const t = new re; t.visible = !1; e.add(t);
  const gold = new ee({color: 16766720, metalness: .9, roughness: .2, emissive: 5521408, emissiveIntensity: .5});
  const velvet = new ee({color: 8388640, roughness: .85});
  const haloMat = new he({color: 16766720, transparent: !0, opacity: 0, blending: Zo, side: ze, depthWrite: !1});

  const cycloneRings = [];
  for (let k = 0; k < 8; k++) {
    const ring = new j(new So(.4 + k * .35, .8 + k * .42, 32), haloMat);
    ring.rotation.x = -Math.PI / 2; ring.position.y = k * .65; t.add(ring); cycloneRings.push(ring);
  }

  const crown = new re;
  const crownBase = new j(new ke(1.25, 1.35, .42, 32), gold); crownBase.position.y = .21; crown.add(crownBase);
  const crownDome = new j(new xe(1.22, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2), velvet); crownDome.position.y = .38; crown.add(crownDome);
  for (let k = 0; k < 4; k++) {
    const arch = new j(new $e(1.05, .08, 6, 16), gold);
    arch.rotation.y = k * Math.PI / 4; arch.position.y = .85; crown.add(arch);
  }
  const crownOrb = new j(new xe(.24, 14, 12), gold); crownOrb.position.y = 1.95; crown.add(crownOrb);
  const crownCrossV = new j(new ko(.08, .26, .08), gold); crownCrossV.position.y = 2.18; crown.add(crownCrossV);
  const crownCrossH = new j(new ko(.22, .08, .08), gold); crownCrossH.position.y = 2.18; crown.add(crownCrossH);
  t.add(crown);

  const lt = new Ye(16766720, 0, 22); e.add(lt);
  const P = Kt("audio/raja-super.mp3"), p = Zt("raja", "raja-super-banner");
  const hitsAt = [2.0, 3.3, 4.7];
  let m = null, L = !1;
  function w() { P.muted = !0; P.play()?.then(() => { m || (P.pause(), P.currentTime = 0); P.muted = mo <= 0.001; }).catch(() => { P.muted = mo <= 0.001; }); }
  function x(C, f, M) {
    if (m) return !1;
    m = { actor: C, victim: f, onHit: M, t: 0, hits: 0, dir: C.root.position.x < f.root.position.x ? 1 : -1, ax: C.root.position.x, bx: f.root.position.x };
    Vt(m); L = !1; t.visible = !0;
    for (const k of [C, f]) k.move = null, k.attack = 0, k.block = !1;
    eo(p, "raja", C); p.classList.add("visible"); document.body.classList.add("train-cinematic");
    P.currentTime = 0; P.muted = mo <= 0.001; P.play().catch(() => {});
    return !0;
  }
  function y(force = !1) {
    if (!m) return;
    const f = m; P.pause(); P.currentTime = 0; Qt(f, o, force);
    t.visible = !1; lt.intensity = 0; p.classList.remove("visible"); document.body.classList.remove("train-cinematic");
    m = null;
  }
  function E(delta) {
    if (!m || L) return !1;
    const f = m;
    f.t = Math.min(6.8, !P.paused && P.currentTime > 0 ? Math.max(f.t, P.currentTime) : f.t + delta);
    const M = f.t, dir = f.dir, dur = 6.8;
    const intro = ct(M / 1.1), fade = 1 - ct((M - 5.8) / 1.0), intensity = intro * fade;
    t.position.set(f.bx, 0, 0);

    for (; f.hits < hitsAt.length && M >= hitsAt[f.hits];) {
      f.hits++; f.onHit(10);
      playFightkaroSfx("boom", 0.9); playFightkaroSfx("hit_3", 0.7); triggerScreenFlash("super");
    }

    for (let k = 0; k < cycloneRings.length; k++) {
      const cr = cycloneRings[k];
      cr.rotation.z = M * (6 + k * 1.5);
      cr.scale.setScalar(1 + Math.sin(M * 4 + k) * .15);
      cr.material.opacity = Math.max(0, (0.8 - k * .08) * intensity);
    }

    crown.position.set(0, 5.0 - intro * 1.2 + Math.sin(M * 3) * .25, 0);
    crown.rotation.y = M * 2.5;
    crown.scale.setScalar(1.2 + Math.sin(M * 4) * .1);

    lt.position.set(f.bx, crown.position.y, 1.8); lt.intensity = 35 * intensity;

    f.actor.root.position.set(K.lerp(f.ax, f.bx - dir * 2.8, ct(M / .8)), 0, 0);
    f.actor.root.rotation.set(0, dir * .9, 0);
    ve(f.actor, delta);

    if (M < 4.7) {
      const lift = ct((M - 1.2) / 1.2);
      f.victim.root.position.set(f.bx + Math.sin(M * 10) * .25 * lift, lift * (1.6 + Math.sin(M * 6) * .5), Math.cos(M * 10) * .28 * lift);
      f.victim.root.rotation.set(Math.sin(M * 5) * .25 * lift, f.victim.dir * 1.15 + M * 5 * lift, Math.sin(M * 6) * .25 * lift);
      f.victim.superFall = lift * .75;
      ve(f.victim, delta); nt(f.victim);
    } else {
      Jt(f, M - 4.7, { upward: 3.5, gravity: 15, speed: 3.8, bounce: .08 }, delta);
    }

    const camX = f.bx - dir * .9;
    o.position.set(camX + dir * .75, 4.0, Math.max(13.0, 9.8 / o.aspect));
    o.lookAt(camX, 2.3, 0);
    if (f.hits && M - hitsAt[f.hits - 1] < .18) o.position.x += Math.sin(M * 110) * .09;

    _t(f, M, dur, delta);
    p.style.opacity = M < .25 ? String(ct(M / .25)) : M > 5.9 ? String(1 - ct((M - 5.9) / .9)) : "1";
    return M >= dur ? (y(!0), !0) : !1;
  }
  function I(C) { L = C; C ? P.pause() : m && P.play().catch(() => {}); }
  return { start: x, update: E, cancel: y, pause: I, unlock: w, get active() { return !!m; }, get elapsed() { return m?.t || 0; }, get hits() { return m?.hits || 0; } };
}

// --- MADHESH TIGER: TERAI BIJULI TUFAN ---
function MadheshSuper(e, o) {
  const t = new re; t.visible = !1; e.add(t);
  const cloudMat = new ee({color: 2432822, roughness: .92});
  const lightningMat = new ee({color: 13382655, emissive: 11141375, emissiveIntensity: 2.5});

  const clouds = new re;
  clouds.position.set(0, 6.2, 0);
  for (let k = 0; k < 9; k++) {
    const cl = new j(new xe(1.1 + (k % 3) * .35, 12, 10), cloudMat);
    const ang = k * Math.PI * 2 / 9;
    cl.position.set(Math.cos(ang) * (1.2 + (k % 2) * .4), Math.sin(k * 2) * .3, Math.sin(ang) * 1.1);
    clouds.add(cl);
  }
  t.add(clouds);

  const lightningBolts = [];
  for (let k = 0; k < 5; k++) {
    const bolt = new re;
    let currY = 6.2, currX = (k - 2) * .4, currZ = 0;
    for (let s = 0; s < 5; s++) {
      const segH = 1.25;
      const nextY = currY - segH;
      const nextX = currX + (Math.sin(s * 3.7 + k) - .5) * .85;
      const nextZ = currZ + (Math.cos(s * 2.9 + k) - .5) * .4;
      const seg = new j(new ke(.07, .05, segH, 8), lightningMat);
      seg.position.set((currX + nextX) / 2, (currY + nextY) / 2, (currZ + nextZ) / 2);
      seg.quaternion.setFromUnitVectors(new se(0, 1, 0), new se(nextX - currX, nextY - currY, nextZ - currZ).normalize());
      bolt.add(seg);
      currX = nextX; currY = nextY; currZ = nextZ;
    }
    bolt.visible = !1;
    t.add(bolt);
    lightningBolts.push(bolt);
  }

  const lt = new Ye(11141375, 0, 30); e.add(lt);
  const P = Kt("audio/madhesh-super.m4a"), p = Zt("madhesh", "madhesh-super-banner");
  const hitsAt = [1.60, 2.35, 3.10, 3.85, 4.60];
  let m = null, L = !1;
  function w() { P.muted = !0; P.play()?.then(() => { m || (P.pause(), P.currentTime = 0); P.muted = mo <= 0.001; }).catch(() => { P.muted = mo <= 0.001; }); }
  function x(C, f, M) {
    if (m) return !1;
    m = { actor: C, victim: f, onHit: M, t: 0, hits: 0, dir: C.root.position.x < f.root.position.x ? 1 : -1, ax: C.root.position.x, bx: f.root.position.x };
    Vt(m); L = !1; t.visible = !0;
    for (const k of [C, f]) k.move = null, k.attack = 0, k.block = !1;
    eo(p, "madhesh", C); p.classList.add("visible"); document.body.classList.add("train-cinematic");
    P.currentTime = 0; P.muted = mo <= 0.001; P.play().catch(() => {});
    return !0;
  }
  function y(force = !1) {
    if (!m) return;
    const f = m; P.pause(); P.currentTime = 0; Qt(f, o, force);
    t.visible = !1; lt.intensity = 0; p.classList.remove("visible"); document.body.classList.remove("train-cinematic");
    m = null;
  }
  function E(delta) {
    if (!m || L) return !1;
    const f = m;
    f.t = Math.min(6.8, !P.paused && P.currentTime > 0 ? Math.max(f.t, P.currentTime) : f.t + delta);
    const M = f.t, dir = f.dir, dur = 6.8;
    const intro = ct(M / 1.0), fade = 1 - ct((M - 5.8) / 1.0), intensity = intro * fade;
    t.position.set(f.bx, 0, 0);

    for (; f.hits < hitsAt.length && M >= hitsAt[f.hits];) {
      const hitIdx = f.hits;
      f.hits++; f.onHit(6);
      playFightkaroSfx("thunder", 0.95); playFightkaroSfx("hit_3", 0.65); triggerScreenFlash("super");
      if (lightningBolts[hitIdx]) {
        lightningBolts[hitIdx].visible = !0;
        setTimeout(() => { if (lightningBolts[hitIdx]) lightningBolts[hitIdx].visible = !1; }, 240);
      }
    }

    clouds.rotation.y = M * .4;
    lt.position.set(f.bx, 3.2, 1.5);
    lt.intensity = (f.hits ? (M - hitsAt[Math.min(f.hits - 1, 4)] < .2 ? 45 : 8) : 8) * intensity;

    f.actor.root.position.set(K.lerp(f.ax, f.bx - dir * 2.8, ct(M / .8)), 0, 0);
    f.actor.root.rotation.set(0, dir * .9, 0);
    ve(f.actor, delta);

    if (M < 4.6) {
      const shock = ct((M - 1.2) / 1.0);
      f.victim.root.position.set(f.bx + Math.sin(M * 24) * .15 * shock, Math.sin(M * 18) * .15 * shock, 0);
      f.victim.superFall = shock * .7;
      ve(f.victim, delta); nt(f.victim);
    } else {
      Jt(f, M - 4.6, { upward: 3.6, gravity: 16, speed: 3.8, bounce: .08 }, delta);
    }

    const camX = f.bx - dir * .85;
    o.position.set(camX + dir * .7, 3.8, Math.max(12.5, 9.5 / o.aspect));
    o.lookAt(camX, 2.2, 0);
    if (f.hits && M - hitsAt[Math.min(f.hits - 1, 4)] < .18) o.position.x += Math.sin(M * 130) * .1;

    _t(f, M, dur, delta);
    p.style.opacity = M < .25 ? String(ct(M / .25)) : M > 5.9 ? String(1 - ct((M - 5.9) / .9)) : "1";
    return M >= dur ? (y(!0), !0) : !1;
  }
  function I(C) { L = C; C ? P.pause() : m && P.play().catch(() => {}); }
  return { start: x, update: E, cancel: y, pause: I, unlock: w, get active() { return !!m; }, get elapsed() { return m?.t || 0; }, get hits() { return m?.hits || 0; } };
}

// --- MAHA-KURSI: SUPREME GAVEL JUDGMENT ---

const Te=new Set,xt=[],js=Es(fe,ne),qs=Ls(fe,ne),zs=Rs(fe,ne),Ys=Ss(fe,ne),rbs=RbSuper(fe,ne),pgs=PgSuper(fe,ne),cls=CoalitionSuper(fe,ne),dbs=DeubaSuper(fe,ne),rjs=RajaSuper(fe,ne),mds=MadheshSuper(fe,ne),Oo={kp:js,balen:qs,harka:zs,ashika:Ys,rabi:rbs,punya:pgs,prachanda:cls,coalition:cls,deuba:dbs,panch:dbs,raja:rjs,king:rjs,madhesh:mds,tiger:mds,nepal:Ys,chiya:Ys},Ve=Object.values(Oo),pe={get active(){return Ve.some(e=>e.active)},get elapsed(){return Ve.find(e=>e.active)?.elapsed||0},update(e){return Ve.find(o=>o.active)?.update(e)||!1},cancel(){Ve.forEach(e=>e.cancel())},pause(e){Ve.forEach(o=>o.pause(e))},unlock(){Ve.forEach(e=>e.unlock())}};function xo(e,o){const t=Oo[e.character];return t&&e.move?.kind==="super"&&!pe.active?(showSpeechBubble(e,"super"),updateDebateQuotes("Bishal super attack unleashed!","OMG clip this right now!"),z="cinematic",Le(),A("callout").textContent="",document.body.classList.add("cinematic-mode"),t.start(e,o,(n=30)=>{J()||us(o,n),zt(e,o,{superHit:!0,combo:1,point:new se(o.root.position.x,o.root.position.y+1,.4)})}),!0):!1}function Nt(e,o,t){z==="fight"&&xn(e,t)&&xo(e,o)}let et=0,Mt=0,koSlowMo=0,koTimer=0;window.setCallout=(txt,dur=1.8)=>{A("callout").textContent=txt;Mt=dur;};let B=null,De=null,Be=0,qt=null,be=null,ht=!1,Wt=null,mt=null;const J=()=>B?.inRoom===!0;function triggerScreenFlash(t="hit"){const f=document.getElementById("flash");if(!f)return;f.className=t==="super"?"heavy-flash":t==="parry"?"parry-flash":"hit-flash";setTimeout(()=>{if(f)f.className=""},95)}function zt(e,o,t){const n=!t.superHit&&e.strikePoint||t.point;o.hitFlash=t.blocked?0:.16,ft=t.superHit?.26:.09,et=t.blocked?no.blocked:t.superHit?no.super:no.hit,ss(t.parry?420:t.blocked?240:t.superHit?90:160);if(t.blocked){playFightkaroSfx("block",0.52);}else if(t.superHit){triggerScreenFlash("super");playFightkaroSfx("boom",0.82);playFightkaroSfx("hit_3",0.68);playFightkaroSfx("thud",0.50);}else{const isHeavy=["sweep","uppercut","roundhouse","finisher","airKick"].includes(t.move)||t.combo>=3;ft=isHeavy?.18:.085;if(t.parry)triggerScreenFlash("parry");else if(isHeavy||t.combo>1)triggerScreenFlash("hit");if(o.hp<=0){koSlowMo=1.35;ft=0.48;triggerScreenFlash("super");o.state="ko";o.roundReaction="lose";o.stun=2.5;o.vx=-o.dir*4.2;o.vy=t.launch||4.5;playFightkaroSfx("boom",0.85);playFightkaroSfx("thunder",0.75);playFightkaroSfx("ko",0.95);duckBattleBgm(!0);const callout=A("callout");if(callout){callout.textContent="K.O.!";callout.classList.remove("slam-active");void callout.offsetWidth;callout.classList.add("slam-active");}Mt=2.4;}else if(isHeavy){et=no.super;playFightkaroSfx("hit_3",0.62);playFightkaroSfx("thud",0.46);}else if(t.damage>=6){et=no.hit;playFightkaroSfx("hit_2",0.56);}else{et=no.hit;playFightkaroSfx("hit_1",0.52);}
e.hitCount = (e.hitCount || 0) + 1;
if(e.hitCount % 3 === 0 || t.combo === 2 || t.combo === 3){
  playCharacterFunnyVoice(e.character, "punch", 0.55);
  if(isHeavy && Math.random() < 0.65) playCharacterHurtVoice(o.character, 0.45);
}
if(t.combo === 9 || (t.combo > 9 && t.combo % 4 === 0)){
  playCombo9Sound();
  triggerScreenFlash("super");
  ft = 0.32;
}}const i=new j(Hs,new he({color:t.blocked?7395816:15400811,transparent:!0,opacity:.9,side:ze,depthWrite:!1}));i.position.set(n?.x??o.root.position.x,n?.y??2.4,.65),fe.add(i),xt.push({m:i,v:new se,life:.22,ring:!0});const s=o===O&&t.wrongGuard?t.wrongGuard==="low"?"LOW! HOLD S":"MID! STAND TO BLOCK":"";if(o.hp>0&&(s||t.parry||t.guardBreak||t.blocked||t.combo>1||["sweep","uppercut","roundhouse","finisher","grab","airKick"].includes(t.move))){A("callout").textContent=t.combo>=9?"9 HIT ULTRA COMBO!":s||(t.parry?"PARRY":t.guardBreak?"GUARD BREAK":t.blocked?"BLOCK":t.combo>1?t.combo+" HIT COMBO":{sweep:"LOW SWEEP",uppercut:"UPPERCUT",roundhouse:"ROUNDHOUSE",finisher:"FINISHER",grab:"THROW",airKick:"AIR KICK"}[t.move]||"");Mt=t.combo>=9?1.4:(s?.9:.55);}for(let a=0;a<(t.superHit?20:8);a++){const c=new j(Os,t.blocked?zo.blocked:zo.hit);c.position.set(n?.x??o.root.position.x,n?.y??2.25+o.y,.3),c.castShadow=!ae,c.receiveShadow=!0,fe.add(c),xt.push({m:c,v:new se((Math.random()-.5)*7,Math.random()*4,Math.random()*3),life:.35})}}function $s(e,o){if(W.energy>=100&&o<2&&(e!=="easy"||Math.random()<.35))return"super";const t=i=>go[i].range+.2>=o;let n=e==="easy"?["punch","kick","lowJab"]:["punch","kick","uppercut","sweep","roundhouse","grab"];return(e==="hard"&&Math.random()<.65||e==="normal"&&Math.random()<.25)&&(O.crouching?n=["kick","uppercut","grab"]:O.block&&(n=["sweep","lowJab","grab"])),n=n.filter(t),n[Math.floor(Math.random()*n.length)]||null}function Rn(){hideMatchResult();document.body.classList.remove("game-menu-open"),pe.cancel();for(const e of[O,W])Xt(e),e.hp=Ze.startingHealth;O.root.position.x=-1.65,W.root.position.x=1.65,O.lastX=-1.65,W.lastX=1.65,Le();const d=A("difficulty").value;_e=d==="easy"?1.1:d==="hard"?.5:.75,_cMove=null,_cGuard=!1,_cCrouch=!1,_cDodgeMove=null,et=0,koSlowMo=0,koTimer=0,je=Ze.roundSeconds,z="fight",A("overlay").style.display="none",document.body.classList.add("playing");const isFinal=Math.max(...we)===Ze.roundWins-1;const roundSfx=kt===1?"round_1":isFinal?"final_round":"round_2";const roundText=kt===1?"ROUND 1":isFinal?"FINAL ROUND":"ROUND "+kt;playFightkaroSfx(roundSfx,0.85);const callout=A("callout");callout.textContent=roundText;callout.classList.remove("slam-active");void callout.offsetWidth;callout.classList.add("slam-active");Mt=1.0;setTimeout(()=>{if(z==="fight"){playFightkaroSfx("fight",0.9);playFightkaroSfx("whoosh",0.5);callout.textContent="FIGHT!";callout.classList.remove("slam-active");void callout.offsetWidth;callout.classList.add("slam-active");Mt=0.85;playBattleBgm();}},1050);setTimeout(()=>{showSpeechBubble(O,"intro")},300),setTimeout(()=>{showSpeechBubble(W,"intro")},1150),updateDebateQuotes("Fight shuru bhayo! Desh le javaaf maagchha!","Popcorn tayar chha! Chat are we live??"),A("round").textContent=String(kt).padStart(2,"0"),A("score").textContent=we.join(" - "),A("pause").innerHTML="PAUSE <kbd>ESC</kbd>"}function En(){if(!(A("start").disabled||be?.status==="running")){if(B?.enabled){if(!J()){B.message("Create or join a room first.");return}pe.unlock(),B.send({type:"ready",ready:!B.lobby?.players[B.lobbySlot]?.ready}),A("start").disabled=!0,A("start").textContent="UPDATING...";return}(pe.unlock(),we=[0,0],kt=1,Rn())}}A("start").onclick=En;let Ko="fight";function St(){if(J()){B.message("Online matches cannot pause. Use Quit Match to leave.");return}z==="fight"||z==="cinematic"?(Le(),document.body.classList.add("game-menu-open"),Ko=z,z="paused",pe.pause(!0),A("callout").textContent="PAUSED",A("pause").innerHTML="RESUME <kbd>ESC</kbd>"):z==="paused"&&(document.body.classList.remove("game-menu-open"),z=Ko,pe.pause(!1),A("callout").textContent="",A("pause").innerHTML="PAUSE <kbd>ESC</kbd>")}A("pause").onclick=St;function Ks(e){if(e==="escape"&&J()){document.body.classList.toggle("game-menu-open"),Le(),B.clear();return}if(!(J()&&document.body.classList.contains("game-menu-open"))){if(Te.add(e),(e==="j"||e==="k")&&O.crouching&&(O.block=!1),J()){const o={j:"punch",k:"kick",l:"super"," ":"super",w:"jump",q:"evade"};e==="j"&&Te.has("e")&&(o.j="grab"),o[e]&&z==="fight"&&(o[e]!=="super"||De?.rules.superPowers!==!1)&&B.action(o[e]),e==="enter"&&(z==="intro"||z==="over")&&A("start").click();return}e==="escape"&&St(),e==="q"&&z==="fight"&&vn(O),e==="w"&&z==="fight"&&ps(O),e==="enter"&&(z==="intro"||z==="over")&&A("start").click(),e==="j"&&Te.has("e")?Nt(O,W,"grab"):(e==="j"||e==="k")&&Nt(O,W,rs(O,e==="j"?"punch":"kick",{crouch:Te.has("s"),forward:Te.has(O.dir===1?"d":"a")})),(e==="l"||e===" ")&&Nt(O,W,"super")}}const Le=Kn({keys:Te,press:Ks,enabled:()=>z==="fight"&&!B?.spectating});window.addEventListener("blur",()=>{B?.clear(),!J()&&(z==="fight"||z==="cinematic")&&St()});let Dt=!1;is({onOpen(){Le(),B?.clear(),Dt=!J()&&(z==="fight"||z==="cinematic"),Dt&&St()},onClose(){Le(),Dt&&z==="paused"&&St(),Dt=!1}});(()=>{const dlg=document.getElementById("control-panel-dialog"),btn=document.getElementById("controls-btn"),tog=document.getElementById("toggle-control-hud"),bar=document.getElementById("control-bar");if(!dlg||!btn)return;let cd=!1;btn.addEventListener("click",()=>{dlg.open||(Le(),B?.clear(),cd=!J()&&(z==="fight"||z==="cinematic"),cd&&St(),dlg.showModal(),dlg.scrollTop=0)});dlg.querySelectorAll("[data-close-controls]").forEach(el=>el.addEventListener("click",()=>dlg.close()));dlg.addEventListener("click",i=>{if(i.target!==dlg)return;const s=dlg.getBoundingClientRect();(i.clientX<s.left||i.clientX>s.right||i.clientY<s.top||i.clientY>s.bottom)&&dlg.close()});dlg.addEventListener("close",()=>{Le(),cd&&z==="paused"&&St(),cd=!1,btn.focus({preventScroll:!0})});tog&&bar&&tog.addEventListener("change",()=>{bar.style.display=tog.checked?"flex":"none"})})();function Xo(){z="between",wo=2.4,O.hp>W.hp?we[0]++:W.hp>O.hp&&we[1]++,A("score").textContent=we.join(" - ");const isMatchOver=Math.max(...we)>=Ze.roundWins;const playerWonRound=O.hp>W.hp;const playerWonMatch=we[0]>we[1];const winChar=playerWonRound?O.character:W.character;if(isMatchOver){stopBattleBgm();if(playerWonMatch){playFightkaroSfx("jingle_win",0.85);setTimeout(()=>playFightkaroSfx("you_win",0.9),400);}else{playFightkaroSfx("jingle_lose",0.85);setTimeout(()=>playFightkaroSfx("you_lose",0.9),400);}A("callout").textContent=playerWonMatch?"VICTORY!":"DEFEAT!";}else{duckBattleBgm(!0);A("callout").textContent=O.hp===W.hp?"DRAW":(VICTORY_TITLES[winChar]||(playerWonRound?"ROUND WON":"ROUND LOST"));}Mt=2.2;}for(const e of[O,W])Xt(e);window.O=O;window.W=W;window.zt=zt;window.xn=xn;window.go=go;window.yo=yo;const oe={player:"balen",opponent:"kp"},Ft={player:qo("player"),opponent:qo("opponent")};let it=!1,Ut=Promise.resolve();async function Vo(){for(;it;)await Ut}function We(){
  A("energy").parentElement.title=st[oe.player].owner+"'s Super: "+st[oe.player].name+" - full meter + L / Space";
  A("player-name").textContent=J()&&B.names.length?B.names[0]:wn()||(st[oe.player]?.owner||oe.player.toUpperCase());
  A("opponent-name").textContent=J()&&B.names.length?B.names[1]:(st[oe.opponent]?.owner||oe.opponent.toUpperCase());
  (()=>{
    const _ss=A("selection-status"),_sp=document.createElement("span");
    _sp.textContent="vs";
    _ss.replaceChildren(oe.player.toUpperCase()+" ",_sp," "+oe.opponent.toUpperCase());
  })();

  const p1Role = document.querySelector(".selection.yours .preview-name");
  if (p1Role) p1Role.textContent = st[oe.player]?.owner || oe.player.toUpperCase();
  const p1Super = document.querySelector(".selection.yours .power-name");
  if (p1Super) p1Super.textContent = st[oe.player]?.name || "SUPER MOVE";
  const p2Role = document.querySelector(".selection.theirs .preview-name");
  if (p2Role) p2Role.textContent = st[oe.opponent]?.owner || oe.opponent.toUpperCase();
  const p2Super = document.querySelector(".selection.theirs .power-name");
  if (p2Super) p2Super.textContent = st[oe.opponent]?.name || "SUPER MOVE";

  for (const btn of document.querySelectorAll(".arcade-5x2-roster button[data-character], .single-roster-section button[data-character]")) {
    const char = btn.dataset.character;
    const isP1 = oe.player === char;
    const isP2 = oe.opponent === char;
    btn.classList.toggle("p1-selected", isP1);
    btn.classList.toggle("p2-selected", isP2);
    btn.classList.toggle("selected", isP1 || isP2);
    btn.setAttribute("aria-pressed", String(isP1 || isP2));
    const p1Badge = btn.querySelector(".p1-badge");
    if (p1Badge) p1Badge.style.display = isP1 ? "block" : "none";
    const p2Badge = btn.querySelector(".p2-badge");
    if (p2Badge) p2Badge.style.display = isP2 ? "block" : "none";
    btn.disabled = it;
  }

  for (const e of document.querySelectorAll("button[data-slot]")) {
    const o = oe[e.dataset.slot] === e.dataset.character;
    e.classList.toggle("selected", o);
    e.setAttribute("aria-pressed", String(o));
    const t = J() && e.dataset.character === oe[e.dataset.slot === "player" ? "opponent" : "player"];
    e.disabled = it || t || J() && (e.dataset.slot === "opponent" || be?.status === "running");
    e.classList.toggle("taken", t);
    e.title = t ? "Already picked by the other side" : (st[e.dataset.character]?.owner || e.dataset.character.toUpperCase());
    const _pl = e.querySelector(".pick-label");
    if (_pl) _pl.textContent = t ? "TAKEN" : o ? "SELECTED" : "SELECT";
  }
}
function tt(e){return it||(it=!0,Ut=Xs(e)),Ut}
async function Xs(e){
  A("start").disabled=!0;
  A("start").textContent="LOADING...";
  document.querySelectorAll("button[data-slot], .arcade-5x2-roster button[data-character]").forEach(o=>o.disabled=!0);
  try{
    (!e||e==="player")&&await yo(O,!1,oe.player);
    (!e||e==="opponent")&&await yo(W,!0,oe.opponent);
    e?await Ft[e].show(oe[e]):await Promise.all([Ft.player.show(oe.player),Ft.opponent.show(oe.opponent)]);
    We();
    A("start").onclick=En;
    A("start").textContent=B?.enabled?"READY":"PLAY";
    A("start").disabled=B?.enabled&&!J();
  }catch(o){
    console.error("Character load failed",o);
    A("selection-status").textContent="Could not load character. Try again.";
    A("start").textContent="RETRY";
    A("start").disabled=!1;
    A("start").onclick=()=>tt();
  }finally{
    it=!1;
    We();
  }
}

let currentPickSlot = "player";
function setPickSlot(slot) {
  currentPickSlot = slot;
  const tabP1 = document.getElementById("tab-p1");
  const tabP2 = document.getElementById("tab-p2");
  if (tabP1) {
    tabP1.classList.toggle("active-p1", slot === "player");
    tabP1.setAttribute("aria-selected", String(slot === "player"));
  }
  if (tabP2) {
    tabP2.classList.toggle("active-p2", slot === "opponent");
    tabP2.setAttribute("aria-selected", String(slot === "opponent"));
  }
  const stageP1 = document.querySelector(".model-stage[data-slot='player']");
  const stageP2 = document.querySelector(".model-stage[data-slot='opponent']");
  if (stageP1) stageP1.classList.toggle("picking-active", slot === "player");
  if (stageP2) stageP2.classList.toggle("picking-active", slot === "opponent");
}

const tabP1 = document.getElementById("tab-p1");
if (tabP1) tabP1.onclick = () => setPickSlot("player");
const tabP2 = document.getElementById("tab-p2");
if (tabP2) tabP2.onclick = () => setPickSlot("opponent");

const stageP1 = document.querySelector(".selection.yours .model-stage");
if (stageP1) stageP1.onclick = () => setPickSlot("player");
const stageP2 = document.querySelector(".selection.theirs .model-stage");
if (stageP2) stageP2.onclick = () => setPickSlot("opponent");

for (const btn of document.querySelectorAll(".arcade-5x2-roster button[data-character], .single-roster-section button[data-character]")) {
  btn.onclick = (ev) => {
    if (it || btn.disabled) return;
    const char = btn.dataset.character;
    const slot = currentPickSlot;
    if (J()) {
      slot === "player" && B.send({ type: "select", character: char });
      return;
    }
    if (oe[slot] === char) {
      Ft[slot].show(oe[slot]).catch(console.error);
    } else {
      oe[slot] = char;
      We();
      tt(slot);
    }
    if (slot === "player") {
      setPickSlot("opponent");
    } else {
      setPickSlot("player");
    }
  };
  btn.oncontextmenu = (ev) => {
    ev.preventDefault();
    if (it || btn.disabled) return;
    const char = btn.dataset.character;
    oe.opponent = char;
    We();
    tt("opponent");
    setPickSlot("player");
  };
}

for (const e of document.querySelectorAll("button[data-slot]")) {
  e.onclick = () => {
    const o = e.dataset.slot;
    if (!(it || e.disabled)) {
      if (J()) {
        o === "player" && B.send({ type: "select", character: e.dataset.character });
        return;
      }
      if (oe[o] === e.dataset.character) {
        Ft[o].show(oe[o]).catch(console.error);
        return;
      }
      oe[o] = e.dataset.character;
      We();
      tt(o);
    }
  };
};A("select-menu").onclick=()=>{document.body.classList.remove("game-menu-open"),J()&&(B.leave(),De=null,be=null,Je(null),document.body.classList.remove("spectating")),pe.cancel(),z="intro",Le(),et=0,Mt=0,document.body.classList.remove("playing"),A("overlay").style.display="block",A("callout").textContent="",A("start").textContent="PLAY",hideMatchResult();for(const e of[O,W])Xt(e);O.root.position.x=-2,W.root.position.x=2};function Gt(){document.body.classList.remove("game-menu-open"),Be++,A("overlay").scrollTop=0,pe.cancel(),Le(),z="intro",document.body.classList.remove("playing"),A("overlay").style.display="block",A("callout").textContent="",De=null,qt=null}function Jo(e,o=[]){if(ht){Wt={snapshot:e,events:o};return}De=e,document.querySelector(".versus span").textContent="FIRST TO "+e.rules.roundWins,je=e.remaining,kt=e.round,we=B.slot===0?e.wins:[...e.wins].reverse(),A("round").textContent=String(kt).padStart(2,"0"),A("score").textContent=we.join(" - ");for(const[t,n]of e.fighters.entries()){const i=t===B.slot?O:W;for(const s of["hp","energy","guard","crouching","block","stun","dodge","dodgeCooldown","recoil","attack","attackDuration","kind","move","combo","dir","y"])i[s]=n[s];!pe.active&&e.phase!=="cinematic"&&(e.phase!=="between"||!mt)&&(i.root.position.x=n.x)}if(e.cinematic){const t=e.cinematic;if(t.id!==qt){pe.cancel(),qt=t.id;const n=t.actor===B.slot?O:W,i=n===O?W:O;n.root.position.x=e.fighters[t.actor].x,i.root.position.x=e.fighters[1-t.actor].x,Oo[t.character].start(n,i,(s=30)=>zt(n,i,{superHit:!0,combo:1,point:new se(i.root.position.x,i.root.position.y+1,.4)}))}}else if(pe.active){pe.cancel();for(const[t,n]of e.fighters.entries()){const i=t===B.slot?O:W;i.root.position.set(n.x,n.y,0),i.root.rotation.set(0,n.dir*1.15,0),i.stun=n.stun,i.lastX=n.x}}z=e.phase;for(const t of o){if(t.type==="hit"){const n=t.actor===B.slot?O:W;zt(n,n===O?W:O,t)}else if(t.type==="action"){playCombatActionSound(t.character,t.kind);playPhysicalSwing(t.kind)}}if(e.phase==="between"&&(A("callout").textContent=O.hp===W.hp?"DRAW":B.spectating?(B.names[O.hp>W.hp?0:1]||"WINNER")+" WINS ROUND":O.hp>W.hp?"ROUND WON":"ROUND LOST"),e.phase==="fight"&&(A("callout").textContent=""),e.phase==="over"&&B.mode==="friends"){Gt(),A("start").textContent="NEXT MATCH...",A("start").disabled=!0;return}e.phase==="over"&&(document.body.classList.remove("playing"),A("overlay").style.display="block",A("result").hidden=!1,renderSatiricalNewspaper(we[0]>we[1],oe.player,oe.opponent,we.join(" - ")),A("start").textContent="REMATCH / READY",A("start").disabled=!1)}B=Ts({onMode(e){e||(document.querySelector(".versus span").textContent="BEST OF 3"),document.querySelector(".player:not(.enemy) .name .role").textContent="YOU",be=null,Je(null),document.body.classList.remove("spectating"),W.isRemote=e,Gt(),A("start").textContent=e?"READY":"PLAY",A("start").disabled=e,document.querySelector(".enemy .name .role").textContent=e?"FRIEND":"CPU",document.querySelector(".theirs .slot-label small").textContent=e?"FRIEND":"CPU",oe.player===oe.opponent&&(oe.opponent=["balen","kp","prachanda","rabi","punya","deuba","harka","raja","madhesh","nepal"].find(o=>o!==oe.player)),tt()},async onLobby(e){const o=++Be;if(await Vo(),o!==Be||!J())return;be=e.league,be?.status==="lobby"&&hideMatchResult(),Je(be,{selfSlot:B.lobbySlot});const t=e.players[B.lobbySlot],i=e.players.find((s,a)=>a!==B.lobbySlot&&s)?.character||["balen","kp","prachanda","rabi","punya","deuba","harka","raja","madhesh","nepal"].find(s=>s!==t.character);oe.player=t.character,oe.opponent=i,O.character!==t.character||W.character!==i?await tt():We(),!(!J()||o!==Be)&&(A("start").disabled=be?.status==="running",A("start").textContent=be?.status==="running"?"NEXT MATCH...":t.ready?"NOT READY":"READY",B.message("ROOM "+e.code+" / "+e.players.filter(Boolean).length+"/8 players. "+(B.lobbySlot===e.host?"You are the host. Start when you want.":"The host starts the tournament.")))},async onStart(e,o){const t=++Be;ht=!0,Wt=null,pe.cancel(),qt=null,Le(),z="loading",document.activeElement?.blur(),A("start").disabled=!0,A("start").textContent="LOADING MATCH...",be=o.league,Je(be,{spectating:B.spectating,names:B.names}),document.body.classList.toggle("spectating",B.spectating);try{if(await Vo(),!J()||t!==Be)return;const n=B.slot;if(oe.player=e.fighters[n].character,oe.opponent=e.fighters[1-n].character,await tt(),!J()||t!==Be)return;for(const s of[O,W])Xt(s);document.querySelector(".player:not(.enemy) .name .role").textContent=B.spectating?"WATCHING":"YOU",document.querySelector(".enemy .name .role").textContent=B.spectating?"WATCHING":"FRIEND",document.body.classList.add("playing"),A("overlay").style.display="none",hideMatchResult(),ht=!1;const i=Wt;Wt=null,Jo(i?.snapshot||e,i?.events||[]),We()}finally{ht=!1}},onLeague(e){be=e,Je(e,{spectating:B.spectating,names:B.names}),e.status==="finished"?(Gt(),A("result").hidden=!1,A("result").textContent=(e.standings.find(o=>o.slot===e.champion)?.nickname||"A PLAYER WHO LEFT")+" IS THE CHAMPION",A("start").textContent="READY",A("start").disabled=!1,A("overlay").scrollTop=0):e.nextIn>0&&(A("start").textContent="NEXT MATCH...",A("start").disabled=!0)},onSnapshot:Jo,onLeave(){document.querySelector(".player:not(.enemy) .name .role").textContent="YOU",be=null,ht=!1,Je(null),document.body.classList.remove("spectating"),Gt(),A("start").textContent="READY",A("start").disabled=!0,We()}});A("host-start").onclick=()=>{J()&&(pe.unlock(),B.send({type:"startTournament"}))};Zn(e=>B?.send({type:"settings",settings:e}));ts(e=>{J()&&e&&B.send({type:"nickname",nickname:e}),We()});We();tt();new MutationObserver(()=>{const e=A("callout");e.classList.remove("pop");if(e.textContent){e.offsetWidth;e.classList.add("pop");const txt=e.textContent.trim().toUpperCase();if(txt==="FIGHT!")playSpecialFx("fight");else if(txt.includes("WON")||txt.includes("VICTORY")||txt.includes("CHAMPION"))playSpecialFx("victory");}}).observe(A("callout"),{childList:!0,characterData:!0,subtree:!0});const Vs=new zn;let gt=!1;const Q={evade:document.querySelector('#touch [data-key="q"]'),guard1:A("guard1"),guard2:A("guard2"),hp1:A("hp1"),hp2:A("hp2"),energy:A("energy"),timer:A("timer"),trail1:A("trail1"),trail2:A("trail2"),pips1:A("pips1"),pips2:A("pips2"),portrait1:A("player-portrait"),portrait2:A("opponent-portrait"),superFill:document.querySelector("#touch .super-fill"),last:new Map,set(e,o,t){let n=this.last.get(e);n||this.last.set(e,n={}),n[o]!==t&&(e[o]=n[o]=t)},classes:{},toggle(e,o){this.classes[e]!==o&&document.body.classList.toggle(e,this.classes[e]=o)}};function Pn(){requestAnimationFrame(Pn);const e=Vs.getDelta(),o=Math.min(e,.04);J()&&B.tick(Te,performance.now());if(koSlowMo>0)koSlowMo=Math.max(0,koSlowMo-o);const timeScale=koSlowMo>0?.28:1;const simO=o*timeScale;const t=z==="paused"||et>0?0:simO;if(et=Math.max(0,et-o),z==="fight"&&!J()){je=Math.max(0,je-t),Mt-=t,Mt<=0&&(A("callout").textContent="");const r=(Te.has("d")?1:0)-(Te.has("a")?1:0);Fo(O,{move:r,block:Te.has("e"),crouch:Te.has("s")},t);const d=A("difficulty").value,S=Math.abs(O.root.position.x-W.root.position.x),T=O.attack>0&&O.move&&S<O.move.range+.45?O.move:null;if(O.move!==_cMove){_cMove=O.move;if(_cMove){const br=d==="easy"?.1:d==="hard"?.55:.32;_cGuard=Math.random()<br;_cCrouch=_cGuard&&(_cMove.height==="low"?Math.random()<(d==="hard"?.6:d==="normal"?.25:0):d==="hard"&&_cMove.height==="high"&&Math.random()<.25)}else _cGuard=!1,_cCrouch=!1}const u=!!T&&T.elapsed>=(d==="hard"?.06:.09)&&_cGuard&&W.attack===0&&W.guard>20,v=u&&_cCrouch;T&&d==="hard"&&W.stun===0&&Qe(O.kind)&&O.attack>.3&&S<1.9&&_cDodgeMove!==O.move&&(_cDodgeMove=O.move,Math.random()<.28&&vn(W));W.stun===0&&W.attack===0&&W.cd===0&&W.dodge===0&&!u&&(_e-=t);let h=0;W.stun===0&&W.attack===0&&W.dodge===0&&!u&&(S>1.15?h=(d==="hard"?2.65:d==="easy"?1.55:2.0)/3.5:S<.98&&(h=-1.5/3.5));Fo(W,{move:h*W.dir,block:u&&!v,crouch:v},t);if(W.stun===0&&!W.block&&W.attack===0&&W.cd===0&&W.dodge===0&&_e<=0){const R=$s(d,S);R&&(Nt(W,O,R),_e=d==="easy"?.95+Math.random()*.5:d==="hard"?.3+Math.random()*.25:.55+Math.random()*.35)}for(const R of[O,W])cs(R,t);if(!xo(O,W)&&!xo(W,O))for(const R of[O,W])fs(R,t);ds(O,W)}if(z==="between"&&!J()&&(wo-=t,wo<=0&&(Math.max(...we)>=Ze.roundWins?(z="over",document.body.classList.remove("playing"),A("overlay").style.display="block",renderSatiricalNewspaper(we[0]>we[1],oe.player,oe.opponent,we.join(" - ")),A("start").textContent="REMATCH",A("callout").textContent=""):(kt++,Rn()))),z==="between"&&!pe.active&&O.hp!==W.hp){if(!mt){const d=O.root.position.x<=W.root.position.x?O:W,S=d===O?W:O,T=Math.min(11,Math.max(2.8,S.root.position.x-d.root.position.x)),u=K.clamp((d.root.position.x+S.root.position.x)/2,-5.5+T/2,5.5-T/2);mt={left:d,right:S,leftX:u-T/2,rightX:u+T/2}}const r=mt;r.left.root.position.x=K.damp(r.left.root.position.x,r.leftX,10,t),r.right.root.position.x=K.damp(r.right.root.position.x,r.rightX,10,t)}else mt=null;if(!pe.active&&(document.body.classList.contains("playing")||!gt))for(const[r,d]of[[O,W],[W,O]]){r.roundReaction=z==="between"&&r.hp!==d.hp?r.hp>d.hp?"win":"lose":null,r.roundReaction&&(r.y=0,r.walk=0,r.block=!1),r.attack===0&&(r.dir=r.root.position.x<d.root.position.x?1:-1),r.root.position.y=r.y;const S=r.roundReaction?Math.atan2(ne.position.x-r.root.position.x,ne.position.z-r.root.position.z):r.dir*1.15;r.root.rotation.y=r.roundReaction?K.damp(r.root.rotation.y,S,12,t):S,ve(r,t)}if(z==="fight"&&!J()){for(const[r,d]of[[O,W],[W,O]]){const S=ls(r,d);S&&zt(r,d,S)}if(O.hp<=0||W.hp<=0||je<=0){if(koTimer<=0){if(je<=0&&O.hp>0&&W.hp>0){playFightkaroSfx("time_up",0.9);const callout=A("callout");if(callout){callout.textContent="TIME UP!";callout.classList.remove("slam-active");void callout.offsetWidth;callout.classList.add("slam-active");}koTimer=1.6;}else{koTimer=1.4;}}else{koTimer-=o;if(koTimer<=0){koTimer=0;Xo();}}}else{koTimer=0;}}for(let r=xt.length-1;r>=0;r--){const d=xt[r];d.life-=t,d.ring&&(d.m.scale.multiplyScalar(1+t*10),d.m.material.opacity=Math.max(0,d.life/.22)),d.m.position.addScaledVector(d.v,t),d.life<=0&&(fe.remove(d.m),d.ring&&d.m.material.dispose(),xt.splice(r,1))}const n=J()?De?.rules.startingHealth||100:Ze.startingHealth;Q.set(Q.evade,"disabled",O.dodgeCooldown>0||z!=="fight"),Q.set(Q.guard1.style,"width",O.guard+"%"),Q.set(Q.guard2.style,"width",W.guard+"%");for(const[r,d]of[O,W].entries()){const S=Math.max(0,Math.min(100,d.hp/n*100))+"%";Q.set(Q["hp"+(r+1)].style,"width",S),Q.set(Q["trail"+(r+1)].style,"width",S),Q.set(Q["hp"+(r+1)].parentElement,"className",d.hp<=n*.25?"health low":"health"),Q.set(Q["guard"+(r+1)].parentElement,"className",d.guard<30?"guard low":"guard"),d.character&&Q.set(Q["portrait"+(r+1)].dataset,"character",d.character)}const i=J()?De?.rules.roundWins||2:Ze.roundWins;for(const[r,d]of we.entries()){const S=Q["pips"+(r+1)];Q.set(S,"innerHTML",Array.from({length:i},(T,u)=>u<d?'<i class="won"></i>':"<i></i>").join("")),Q.set(S,"ariaLabel","Rounds won: "+d+" of "+i)}Q.set(Q.energy.style,"width",O.energy+"%"),Q.set(Q.superFill.style,"height",O.energy+"%"),Q.set(Q.timer,"textContent",String(Math.ceil(je)).padStart(2,"0")),Q.toggle("time-low",z==="fight"&&je<=10),Q.toggle("supers-disabled",J()&&De?.rules.superPowers===!1),Q.toggle("super-ready",O.energy>=100&&(!J()||De?.rules.superPowers!==!1)),z==="cinematic"&&pe.update(Math.min(e,.25))&&!J()&&(z="fight",document.body.classList.remove("cinematic-mode"),(O.hp<=0||W.hp<=0)&&Xo());const isRoundWin = O.roundReaction === "win" || W.roundReaction === "win";
const winnerFighter = O.roundReaction === "win" ? O : (W.roundReaction === "win" ? W : null);
const midX = (O.root.position.x + W.root.position.x) / 2;
const fDist = Math.abs(O.root.position.x - W.root.position.x);
const isPortraitMode = innerHeight > innerWidth;
const baseZ = isPortraitMode ? 14.5 : 9.2;
let targetCamX = midX;
let targetCamY = (isPortraitMode ? 2.05 : 1.85) + Math.max(O.y, W.y) * 0.35;
let targetCamZ = isPortraitMode ? Math.min(17.5, Math.max(baseZ, 10.5 + fDist * 1.65)) : Math.min(12.5, Math.max(baseZ, 7.2 + fDist * 0.95));
let targetLookY = (isPortraitMode ? 1.55 : 1.45) + Math.max(O.y, W.y) * 0.30;

if (isRoundWin && winnerFighter) {
  targetCamX = winnerFighter.root.position.x;
  targetCamY = isPortraitMode ? 1.95 : 1.80;
  targetCamZ = isPortraitMode ? 9.6 : 6.8;
  targetLookY = isPortraitMode ? 1.55 : 1.45;
}

if (!pe.active) {
  ne.position.x = K.damp(ne.position.x, targetCamX, 6, o);
  ne.position.y = K.damp(ne.position.y, targetCamY, 5, o);
  ne.position.z = K.damp(ne.position.z, targetCamZ, 5, o);
  ne.lookAt(ne.position.x, targetLookY, 0);ft=Math.max(0,ft-o),ft>0&&(ne.position.x+=(Math.random()-.5)*ft,ne.position.y+=(Math.random()-.5)*ft*.6)}!document.hidden&&document.body.classList.contains("playing")?(Pe.render(fe,ne),gt=!1):gt||(Pe.render(fe,ne),gt=!0)}Pn();window.addEventListener("resize",()=>{gt=!1,ne.aspect=innerWidth/innerHeight,ne.updateProjectionMatrix(),Pe.setPixelRatio(Math.min(devicePixelRatio,Ee.pixelRatio)),Pe.setSize(innerWidth,innerHeight)});
