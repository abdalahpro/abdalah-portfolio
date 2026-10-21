"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { simplexNoise3D } from "./noise.glsl";

/* Sphère liquide : le bruit simplex déforme une icosphère, la normale est
   recalculée par différences finies pour un éclairage net, et un liseré
   iridescent (fresnel) donne l'aspect "chrome braise". */

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform vec2 uMouse;
varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;
${simplexNoise3D}
float field(vec3 n) {
  float t = uTime * 0.2;
  float a = snoise(n * 1.1 + vec3(t, t * 0.7, -t * 0.5) + vec3(uMouse * 0.4, 0.0));
  float b = snoise(n * 2.7 + vec3(-t * 1.4, t, t * 0.45));
  return a * uAmp + b * uAmp * 0.26;
}
vec3 displaced(vec3 n) { return n * (1.0 + field(n)); }
void main() {
  vec3 n = normalize(position);
  vec3 helper = abs(n.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
  vec3 tangent = normalize(cross(n, helper));
  vec3 bitangent = normalize(cross(n, tangent));
  float e = 0.012;
  vec3 p0 = displaced(n);
  vec3 p1 = displaced(normalize(n + tangent * e));
  vec3 p2 = displaced(normalize(n + bitangent * e));
  vec3 dn = normalize(cross(p1 - p0, p2 - p0));
  if (dot(dn, n) < 0.0) dn = -dn;
  vNoise = field(n) / max(uAmp, 0.001);
  vec4 world = modelMatrix * vec4(p0, 1.0);
  vNormal = normalize(mat3(modelMatrix) * dn);
  vView = normalize(cameraPosition - world.xyz);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform vec3 uDeep;
uniform vec3 uEmber;
uniform vec3 uPeach;
uniform vec3 uViolet;
varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;
vec3 iridescence(float t) {
  return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
}
void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);
  float ndv = clamp(dot(N, V), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 2.3);

  float veins = smoothstep(0.1, 0.95, vNoise * 0.5 + 0.5);
  vec3 col = mix(uDeep, uEmber * 0.45, veins * 0.6);

  vec3 L = normalize(vec3(-0.55, 0.85, 0.6));
  col += uPeach * pow(clamp(dot(N, L), 0.0, 1.0), 3.0) * 0.16;
  vec3 H = normalize(L + V);
  col += vec3(1.0, 0.92, 0.86) * pow(clamp(dot(N, H), 0.0, 1.0), 90.0) * 1.1;

  vec3 L2 = normalize(vec3(0.9, -0.45, 0.35));
  col += uEmber * pow(clamp(dot(N, normalize(L2 + V)), 0.0, 1.0), 16.0) * 0.75;

  vec3 irid = iridescence(fres * 0.85 + vNoise * 0.18 + uTime * 0.02);
  vec3 rim = mix(uEmber, mix(uPeach, uViolet, irid.b), irid.g * 0.65);
  col += rim * fres * 1.45;

  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;

type Pointer = { x: number; y: number };

function Blob({ pointer, detail }: { pointer: React.RefObject<Pointer>; detail: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const smooth = useRef({ x: 0, y: 0, scroll: 0 });
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 0.22 },
      uMouse: { value: new THREE.Vector2() },
      uDeep: { value: new THREE.Color("#06100c") },
      uEmber: { value: new THREE.Color("#c9a96e") },
      uPeach: { value: new THREE.Color("#f1e2bd") },
      uViolet: { value: new THREE.Color("#2f8f74") },
    }),
    []
  );

  useFrame((state, delta) => {
    const m = mesh.current;
    const u = material.current?.uniforms;
    if (!m || !u) return;
    const s = smooth.current;
    const p = pointer.current;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.6);
    const k = 1 - Math.pow(0.002, delta);
    s.x += (p.x - s.x) * k;
    s.y += (p.y - s.y) * k;
    s.scroll += (scroll - s.scroll) * k;

    u.uTime.value = state.clock.elapsedTime;
    u.uMouse.value.set(s.x, s.y);
    u.uAmp.value = 0.2 + s.scroll * 0.16;

    const wide = viewport.aspect > 1.1;
    const base = wide ? Math.min(viewport.height * 0.36, viewport.width * 0.2) : viewport.width * 0.42;
    m.scale.setScalar(base * (1 + s.scroll * 0.35));
    m.position.x = (wide ? viewport.width * 0.2 : 0) + s.x * 0.25;
    m.position.y = (wide ? viewport.height * 0.06 : viewport.height * 0.16) + s.y * 0.2 + s.scroll * viewport.height * 0.18;
    m.rotation.y = state.clock.elapsedTime * 0.08 + s.x * 0.5;
    m.rotation.x = -s.y * 0.35;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1, detail]} />
      <shaderMaterial ref={material} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  );
}

/** Poussière répartie dans une coquille autour de la sphère. Générateur
 * pseudo-aléatoire à graine fixe : même nuage à chaque rendu. */
function dustPositions(count: number) {
  let seed = 1337;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 2.2 + rand() * 4.5;
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
    arr[i * 3 + 2] = r * Math.cos(phi) - 1.5;
  }
  return arr;
}

function Dust({ pointer, count }: { pointer: React.RefObject<Pointer>; count: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => dustPositions(count), [count]);

  useFrame((state) => {
    const pts = points.current;
    if (!pts) return;
    pts.rotation.y = state.clock.elapsedTime * 0.025 + pointer.current.x * 0.08;
    pts.rotation.x = pointer.current.y * 0.06;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#e7d7b1"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function HeroScene() {
  const wrapper = useRef<HTMLDivElement>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [supported] = useState(() => hasWebGL());
  const [mobile] = useState(() => window.matchMedia("(max-width: 768px)").matches);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (wrapper.current) io.observe(wrapper.current);
    return () => {
      window.removeEventListener("pointermove", move);
      io.disconnect();
    };
  }, []);

  if (!supported) {
    return (
      <div className="absolute right-[-10vw] top-[10vh] size-[60vw] rounded-full bg-[radial-gradient(circle_at_35%_30%,#f1e2bd_0%,#c9a96e_22%,#1e6b57_48%,#06100c_65%,transparent_72%)] opacity-70 blur-2xl" />
    );
  }

  return (
    <div ref={wrapper} className="absolute inset-0">
      <Canvas
        flat
        dpr={[1, mobile ? 1.5 : 1.75]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 6], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Blob pointer={pointer} detail={mobile ? 24 : 44} />
        <Dust pointer={pointer} count={mobile ? 500 : 1400} />
      </Canvas>
    </div>
  );
}
