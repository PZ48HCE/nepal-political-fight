/**
 * Nepal Political Fight - Characters & 3D Fighter Rig
 * Defines all political fighters, their accessories, stats,
 * and procedural 3D articulated brawler skeletons with IK limbs.
 */

import * as THREE from '../assets/three.module.js';

export const CHARACTERS = {
  balen: {
    id: 'balen',
    name: 'BALEN',
    fullName: 'Balendra Shah (Balen)',
    title: 'MAYOR OF KATHMANDU',
    superName: 'DOZER SHAKTI',
    quote: 'Garxa garxa Balen le garxa!',
    portrait: 'portraits/balen.png',
    color: '#00e5ff',
    suitColor: 0x1a1c23, // Sharp black blazer
    pantColor: 0x111317,
    skinColor: 0xd4a373,
    hairColor: 0x111111,
    stats: { speed: 85, power: 90, defense: 75 }
  },
  kp: {
    id: 'kp',
    name: 'KP',
    fullName: 'KP Sharma Oli',
    title: 'CHAIRMAN OF CPN-UML',
    superName: 'JAHAJ SHAKTI',
    quote: 'Pani jahaj ma ticket katera basnus!',
    portrait: 'portraits/kp.png',
    color: '#ff3d50',
    suitColor: 0x7c2d12, // Traditional Daura Suruwal coat
    pantColor: 0x334155,
    skinColor: 0xe0a97b,
    hairColor: 0xe2e8f0, // Silver hair
    stats: { speed: 65, power: 85, defense: 95 }
  },
  harka: {
    id: 'harka',
    name: 'HARKA',
    fullName: 'Harka Sampang',
    title: 'MAYOR OF DHARAN',
    superName: 'SHRAM SHAKTI',
    quote: 'Shramdaan garnuparchha, dhunga bokne ho!',
    portrait: 'portraits/harka.png',
    color: '#ffc53d',
    suitColor: 0x2563eb, // Rugged blue denim work jacket
    pantColor: 0x1e293b,
    skinColor: 0xc89666,
    hairColor: 0x1a1a1a,
    stats: { speed: 90, power: 75, defense: 85 }
  },
  ashika: {
    id: 'ashika',
    name: 'ASHIKA',
    fullName: 'Ashika Tamang',
    title: 'ACTIVIST & CRUSADER',
    superName: 'DHAN SHAKTI',
    quote: 'Paisa ko khel sabai khattam parchhu!',
    portrait: 'portraits/ashika.png',
    color: '#10b981',
    suitColor: 0xbe123c, // Vibrant red & black traditional dress
    pantColor: 0x0f172a,
    skinColor: 0xe2b488,
    hairColor: 0x0f172a,
    stats: { speed: 92, power: 82, defense: 68 }
  },
  rabi: {
    id: 'rabi',
    name: 'RABI',
    fullName: 'Rabi Lamichhane',
    title: 'PRESIDENT OF RSP',
    superName: 'GHANTI SHAKTI',
    quote: 'Sidha kura janata sanga, bhrastachar mukta!',
    portrait: 'portraits/rabi.png',
    color: '#3b82f6',
    suitColor: 0x1e3a8a, // Navy blue modern suit
    pantColor: 0x172554,
    skinColor: 0xdba878,
    hairColor: 0x1f2937,
    stats: { speed: 82, power: 82, defense: 80 }
  }
};

// Texture Loader for Head photo & accessories
const texLoader = new THREE.TextureLoader();
let headTexture = null;
try {
  headTexture = texLoader.load('assets/photo-head.png');
} catch (e) {
  console.warn("Head texture fallback:", e);
}

/**
 * Builds a 3D brawler character with procedural limbs, torso, and customized head/accessories
 */
export function buildCharacterModel(charKey) {
  const char = CHARACTERS[charKey] || CHARACTERS.balen;
  const root = new THREE.Group();
  root.name = `character-${char.id}`;

  const body = new THREE.Group();
  root.add(body);

  const matSuit = new THREE.MeshStandardMaterial({ color: char.suitColor, roughness: 0.75 });
  const matPants = new THREE.MeshStandardMaterial({ color: char.pantColor, roughness: 0.8 });
  const matSkin = new THREE.MeshStandardMaterial({ color: char.skinColor, roughness: 0.65 });
  const matHair = new THREE.MeshStandardMaterial({ color: char.hairColor, roughness: 0.9 });
  const matShoe = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
  const matGold = new THREE.MeshStandardMaterial({ color: 0xffc53d, metalness: 0.8, roughness: 0.3 });

  // 1. Torso / Chest
  const torsoGeo = new THREE.BoxGeometry(0.72, 0.78, 0.42);
  const torso = new THREE.Mesh(torsoGeo, matSuit);
  torso.position.set(0, 1.48, 0);
  torso.castShadow = true;
  torso.receiveShadow = true;
  body.add(torso);

  // Shirt collar / tie / neck area
  const innerGeo = new THREE.BoxGeometry(0.24, 0.65, 0.04);
  const innerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const innerShirt = new THREE.Mesh(innerGeo, innerMat);
  innerShirt.position.set(0, 1.52, 0.22);
  body.add(innerShirt);

  if (char.id === 'balen' || char.id === 'rabi') {
    // Red / Blue Tie
    const tieGeo = new THREE.BoxGeometry(0.08, 0.45, 0.05);
    const tieMat = new THREE.MeshBasicMaterial({ color: char.id === 'balen' ? 0xdc2626 : 0x2563eb });
    const tie = new THREE.Mesh(tieGeo, tieMat);
    tie.position.set(0, 1.44, 0.23);
    body.add(tie);
  }

  // Pelvis / Hips
  const hipsGeo = new THREE.BoxGeometry(0.62, 0.28, 0.38);
  const hips = new THREE.Mesh(hipsGeo, matPants);
  hips.position.set(0, 1.02, 0);
  hips.castShadow = true;
  body.add(hips);

  // 2. Head & Character-Specific Features
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 2.05, 0);
  body.add(headGroup);

  // Head base sphere / box
  const headGeo = new THREE.BoxGeometry(0.42, 0.48, 0.42);
  const head = new THREE.Mesh(headGeo, matSkin);
  head.castShadow = true;
  headGroup.add(head);

  // Ears
  [-0.24, 0.24].forEach(x => {
    const ear = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.08), matSkin);
    ear.position.set(x, 0, 0);
    headGroup.add(ear);
  });

  // Specific Political Accessories
  if (char.id === 'balen') {
    // Balen's Iconic Dark Sunglasses (Black Aviators)
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1, metalness: 0.9 });
    const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.12, 0.12), glassMat);
    glasses.position.set(0, 0.04, 0.22);
    headGroup.add(glasses);

    // Sleek black hair
    const hair = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.16, 0.46), matHair);
    hair.position.set(0, 0.26, 0);
    headGroup.add(hair);

  } else if (char.id === 'kp') {
    // KP Oli's Traditional Dhaka Topi (Iconic Nepali geometric cap!)
    const topiCanvas = document.createElement('canvas');
    topiCanvas.width = 128;
    topiCanvas.height = 128;
    const tCtx = topiCanvas.getContext('2d');
    tCtx.fillStyle = '#1e293b';
    tCtx.fillRect(0, 0, 128, 128);
    tCtx.strokeStyle = '#dc2626';
    tCtx.lineWidth = 6;
    // Dhaka geometric zigzags
    for (let y = 10; y < 128; y += 24) {
      tCtx.beginPath();
      for (let x = 0; x <= 128; x += 16) {
        tCtx.lineTo(x, y + ((x / 16) % 2 === 0 ? 8 : -8));
      }
      tCtx.stroke();
    }
    const topiTex = new THREE.CanvasTexture(topiCanvas);
    const topiMat = new THREE.MeshStandardMaterial({ map: topiTex, roughness: 0.8 });

    const topi = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.24, 16), topiMat);
    topi.rotation.z = -0.08; // Authentic slightly tilted slant!
    topi.position.set(0.02, 0.32, 0);
    headGroup.add(topi);

    // KP's Spectacles
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6, roughness: 0.2 });
    const frames = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.09, 0.08), glassMat);
    frames.position.set(0, 0.04, 0.22);
    headGroup.add(frames);

    // Grey sideburns & moustache
    const stache = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.06), matHair);
    stache.position.set(0, -0.1, 0.22);
    headGroup.add(stache);

  } else if (char.id === 'harka') {
    // Harka Sampang's Yellow Shramdaan Construction Hardhat / Cap!
    const hardhatMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
    const hardhat = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), hardhatMat);
    hardhat.position.set(0, 0.16, 0);
    headGroup.add(hardhat);

    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.03, 16), hardhatMat);
    brim.position.set(0, 0.15, 0.04);
    headGroup.add(brim);

    // Pickaxe attached to back of torso!
    const axeHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8), new THREE.MeshStandardMaterial({ color: 0x854d0e }));
    axeHandle.rotation.z = 0.6;
    axeHandle.position.set(0, 1.45, -0.25);
    body.add(axeHandle);

    const axeHead = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.06), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 }));
    axeHead.position.set(0.3, 1.85, -0.25);
    axeHead.rotation.z = 0.6;
    body.add(axeHead);

  } else if (char.id === 'ashika') {
    // Ashika's Sunglasses & Gold Earrings
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.1, metalness: 0.8 });
    const shades = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.11, 0.1), glassMat);
    shades.position.set(0, 0.04, 0.22);
    headGroup.add(shades);

    // Gold earrings
    [-0.24, 0.24].forEach(x => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.015, 8, 12), matGold);
      ring.position.set(x, -0.06, 0);
      headGroup.add(ring);
    });

    // Hair bun / long dark hair
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), matHair);
    hair.position.set(0, 0.14, -0.08);
    headGroup.add(hair);

  } else if (char.id === 'rabi') {
    // Rabi's Golden Bell (Ghanti) lapel pin & mic
    const pin = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.08, 8), matGold);
    pin.position.set(-0.2, 1.62, 0.23);
    body.add(pin);

    const hair = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.18, 0.44), matHair);
    hair.position.set(0, 0.26, 0);
    headGroup.add(hair);
  }

  // 3. Articulated IK Arms (Left & Right)
  const arms = [];
  [-1, 1].forEach(side => {
    // Upper Arm
    const upperGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.44, 8);
    const upper = new THREE.Mesh(upperGeo, matSuit);
    upper.castShadow = true;
    body.add(upper);

    // Elbow Joint
    const elbowGeo = new THREE.SphereGeometry(0.085, 8, 8);
    const elbow = new THREE.Mesh(elbowGeo, matSuit);
    body.add(elbow);

    // Lower Arm / Forearm
    const lowerGeo = new THREE.CylinderGeometry(0.08, 0.075, 0.42, 8);
    const lower = new THREE.Mesh(lowerGeo, matSuit);
    lower.castShadow = true;
    body.add(lower);

    // Fist / Hand
    const fistGeo = new THREE.BoxGeometry(0.14, 0.15, 0.16);
    const fist = new THREE.Mesh(fistGeo, matSkin);
    fist.castShadow = true;
    body.add(fist);

    arms.push({ side, upper, lower, elbow, fist });
  });

  // 4. Articulated Legs (Left & Right)
  const legs = [];
  [-1, 1].forEach(side => {
    // Thigh
    const thighGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.5, 8);
    const thigh = new THREE.Mesh(thighGeo, matPants);
    thigh.castShadow = true;
    body.add(thigh);

    // Knee Joint
    const kneeGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const knee = new THREE.Mesh(kneeGeo, matPants);
    body.add(knee);

    // Shin
    const shinGeo = new THREE.CylinderGeometry(0.1, 0.085, 0.5, 8);
    const shin = new THREE.Mesh(shinGeo, matPants);
    shin.castShadow = true;
    body.add(shin);

    // Foot / Shoe
    const footGeo = new THREE.BoxGeometry(0.18, 0.12, 0.32);
    const foot = new THREE.Mesh(footGeo, matShoe);
    foot.castShadow = true;
    body.add(foot);

    legs.push({ side, thigh, shin, knee, foot });
  });

  return {
    char,
    root,
    body,
    headGroup,
    arms,
    legs,
    poseTime: 0,
    dir: 1 // 1 facing right, -1 facing left
  };
}

// Helpers for Two-Bone IK positioning
const UP_VEC = new THREE.Vector3(0, 1, 0);

function solveTwoBoneIK(upper, lower, joint, startPos, targetPos, len1, len2) {
  const dir = targetPos.clone().sub(startPos);
  const dist = Math.min(len1 + len2 - 0.01, dir.length());

  // Calculate elbow/knee joint position using triangle law
  const cosAngle = (len1 * len1 + dist * dist - len2 * len2) / (2 * len1 * dist);
  const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle)));

  dir.normalize();
  const normal = new THREE.Vector3(0, 0, 1);
  const jointDir = dir.clone().applyAxisAngle(normal, angle);
  const midPos = startPos.clone().add(jointDir.multiplyScalar(len1));

  // Position & rotate upper bone
  positionBone(upper, startPos, midPos, len1);
  joint.position.copy(midPos);

  // Position & rotate lower bone
  positionBone(lower, midPos, targetPos, len2);
}

function positionBone(mesh, p1, p2, originalLength) {
  mesh.position.copy(p1).add(p2).multiplyScalar(0.5);
  mesh.scale.y = p1.distanceTo(p2) / originalLength;
  mesh.quaternion.setFromUnitVectors(UP_VEC, p2.clone().sub(p1).normalize());
}

/**
 * Animate procedural rig for idle, walk, attacks, jumps, crouching, blocks, hurt
 */
export function updateFighterAnimation(rig, state, delta) {
  rig.poseTime += delta;
  const t = rig.poseTime;
  const dir = rig.dir;

  // Root direction facing
  rig.root.rotation.y = dir === 1 ? 0 : Math.PI;

  const isAttacking = state.attackProgress > 0;
  const attackP = isAttacking ? Math.sin(state.attackProgress * Math.PI) : 0;
  const isCrouching = state.isCrouching;
  const isGuarding = state.isGuarding;
  const isWalking = Math.abs(state.walkSpeed) > 0.05;
  const isHurt = state.hurtTimer > 0;

  // 1. Torso Breathing & Crouch Displacement
  const breathe = Math.sin(t * 3.5) * 0.02;
  const crouchY = isCrouching ? -0.42 : 0;
  const jumpY = state.y || 0;

  rig.body.position.y = breathe + crouchY + jumpY;
  rig.body.position.x = 0;

  // Torso tilt during walk/attacks/hurt
  if (isHurt) {
    rig.body.rotation.z = -0.22;
    rig.body.position.x = -0.15;
  } else if (isAttacking) {
    rig.body.rotation.z = (state.attackType === 'uppercut' ? -0.15 : 0.12);
  } else if (isWalking) {
    rig.body.rotation.z = Math.sin(t * 8) * 0.05;
  } else {
    rig.body.rotation.z = 0;
  }

  // 2. Arms Animation (IK Target Solving)
  rig.arms.forEach(arm => {
    const isFrontArm = (arm.side === 1);
    const shoulderPos = new THREE.Vector3(
      arm.side * 0.42,
      1.78 + crouchY,
      0
    );

    let handTarget = new THREE.Vector3();

    if (isHurt) {
      // Flinch guard
      handTarget.set(arm.side * 0.35, 1.85 + crouchY, 0.35);

    } else if (isGuarding) {
      // Crossed guard shield in front of face
      handTarget.set(arm.side * 0.22, 1.95 + crouchY, 0.45);

    } else if (isAttacking && isFrontArm) {
      // Specific attack punch extensions
      if (state.attackType === 'jab' || state.attackType === 'cross') {
        const reach = 0.5 + attackP * 0.95;
        handTarget.set(0.1, 1.78 + crouchY, reach);
      } else if (state.attackType === 'lowJab') {
        const reach = 0.4 + attackP * 0.85;
        handTarget.set(0.1, 1.25 + crouchY, reach);
      } else if (state.attackType === 'uppercut') {
        const reach = 0.3 + attackP * 0.7;
        const up = 1.6 + attackP * 0.9;
        handTarget.set(0.05, up + crouchY, reach);
      } else {
        // Kick attack: arm pulls back for torque
        handTarget.set(arm.side * 0.45, 1.55 + crouchY, -0.2);
      }

    } else if (isWalking) {
      // Natural walking swing
      const swing = Math.sin(t * 8 + (arm.side === 1 ? 0 : Math.PI)) * 0.35;
      handTarget.set(arm.side * 0.42, 1.35 + crouchY, swing);

    } else {
      // Idle boxer guard ready stance
      const bob = Math.sin(t * 3.5 + arm.side) * 0.03;
      handTarget.set(
        arm.side * 0.38,
        1.58 + bob + crouchY,
        0.38 + (isFrontArm ? 0.08 : 0)
      );
    }

    solveTwoBoneIK(arm.upper, arm.lower, arm.elbow, shoulderPos, handTarget, 0.44, 0.42);
    arm.fist.position.copy(handTarget);
  });

  // 3. Legs Animation (IK Target Solving)
  rig.legs.forEach(leg => {
    const isFrontLeg = (leg.side === 1);
    const hipPos = new THREE.Vector3(leg.side * 0.22, 1.02 + crouchY, 0);
    let footTarget = new THREE.Vector3();

    if (isAttacking && state.isKick && isFrontLeg) {
      // Kick attacks
      if (state.attackType === 'sweep') {
        // Low sweep kick sliding across the ground
        const reach = 0.4 + attackP * 1.1;
        footTarget.set(0.1, 0.12, reach);
      } else if (state.attackType === 'roundhouse') {
        // High head-level roundhouse kick!
        const reach = 0.5 + attackP * 1.05;
        const height = 1.1 + attackP * 0.85;
        footTarget.set(0.1, height, reach);
      } else {
        // Standard mid body kick
        const reach = 0.4 + attackP * 0.95;
        const height = 0.75 + attackP * 0.55;
        footTarget.set(0.1, height, reach);
      }

    } else if (jumpY > 0) {
      // Airborne feet tuck
      footTarget.set(leg.side * 0.22, 0.35, -0.15);

    } else if (isCrouching) {
      // Deep crouch base
      footTarget.set(leg.side * 0.32, 0.06, leg.side * 0.18);

    } else if (isWalking) {
      // Walking stride cycle
      const stride = Math.sin(t * 8 + (leg.side === 1 ? Math.PI : 0)) * 0.42;
      const lift = Math.max(0, Math.cos(t * 8 + (leg.side === 1 ? Math.PI : 0))) * 0.16;
      footTarget.set(leg.side * 0.24, 0.06 + lift, stride);

    } else {
      // Idle fight stance: feet staggered for stability
      const stagger = isFrontLeg ? 0.22 : -0.22;
      footTarget.set(leg.side * 0.26, 0.06, stagger);
    }

    solveTwoBoneIK(leg.thigh, leg.shin, leg.knee, hipPos, footTarget, 0.5, 0.5);
    leg.foot.position.copy(footTarget);
  });
}
