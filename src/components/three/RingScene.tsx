"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type RingDrive = { progress: number; velocity: number };

const vertexShader = /* glsl */ `
uniform float uVelocity;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 p = position;
  // Les cartes se courbent légèrement selon la vitesse de scroll.
  p.y += sin(uv.x * 3.14159) * uVelocity * 0.35;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform sampler2D uMap;
uniform float uVelocity;
varying vec2 vUv;
void main() {
  // Léger décalage RGB proportionnel à la vitesse.
  float shift = uVelocity * 0.012;
  vec4 c = texture2D(uMap, vUv);
  c.r = texture2D(uMap, vUv + vec2(shift, 0.0)).r;
  c.b = texture2D(uMap, vUv - vec2(shift, 0.0)).b;
  if (!gl_FrontFacing) c.rgb *= 0.18;
  gl_FragColor = vec4(c.rgb, 1.0);
  #include <colorspace_fragment>
}
`;

function Panel({
  texture,
  radius,
  height,
  thetaStart,
  thetaLength,
  velocity,
}: {
  texture: THREE.Texture;
  radius: number;
  height: number;
  thetaStart: number;
  thetaLength: number;
  velocity: React.RefObject<number>;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uMap: { value: texture }, uVelocity: { value: 0 } }), [texture]);
  useFrame(() => {
    const u = material.current?.uniforms;
    if (u) u.uVelocity.value = velocity.current;
  });
  return (
    <mesh>
      <cylinderGeometry args={[radius, radius, height, 40, 12, true, thetaStart, thetaLength]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Ring({ urls, drive }: { urls: string[]; drive: React.RefObject<RingDrive> }) {
  const textures = useTexture(urls, (loaded) => {
    for (const t of Array.isArray(loaded) ? loaded : [loaded]) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
    }
  });
  const group = useRef<THREE.Group>(null);
  // lastRaw/idle : la vitesse fournie par ScrollTrigger reste figée quand le
  // scroll s'arrête, on la considère donc nulle si elle ne bouge plus.
  const smooth = useRef({ rot: 0, vel: 0, lastRaw: 0, idle: 0 });
  const velocity = useRef(0);

  const radius = 3.4;
  const seg = (Math.PI * 2) / urls.length;
  const thetaLength = seg * 0.86;
  const height = radius * thetaLength * (860 / 640);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const s = smooth.current;
    const d = drive.current;
    const k = 1 - Math.pow(0.001, delta);
    const target = -d.progress * Math.PI * 1.7 - state.clock.elapsedTime * 0.05;
    s.rot += (target - s.rot) * k;
    s.idle = d.velocity === s.lastRaw ? s.idle + delta : 0;
    s.lastRaw = d.velocity;
    const raw = s.idle > 0.12 ? 0 : d.velocity;
    s.vel += (THREE.MathUtils.clamp(raw / 2500, -1, 1) - s.vel) * k;
    velocity.current = s.vel;
    g.rotation.y = s.rot;
    g.rotation.z = -0.07 + s.vel * 0.05;
  });

  return (
    <group ref={group} rotation={[0.1, 0, -0.07]}>
      {textures.map((t, i) => (
        <Panel
          key={urls[i]}
          texture={t}
          radius={radius}
          height={height}
          thetaStart={i * seg}
          thetaLength={thetaLength}
          velocity={velocity}
        />
      ))}
    </group>
  );
}

export default function RingScene({ urls, drive }: { urls: string[]; drive: React.RefObject<RingDrive> }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [mobile] = useState(() => window.matchMedia("(max-width: 768px)").matches);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "200px" });
    if (wrapper.current) io.observe(wrapper.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapper} className="absolute inset-0">
      <Canvas
        flat
        dpr={[1, mobile ? 1.5 : 2]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0.4, mobile ? 8.5 : 10], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Ring urls={urls} drive={drive} />
        </Suspense>
      </Canvas>
    </div>
  );
}
