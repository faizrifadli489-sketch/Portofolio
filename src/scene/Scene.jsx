import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../scroll'

const diskVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const diskFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uInner;
  uniform float uOuter;
  uniform float uOpacity;
  uniform float uSpeed;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = (vUv - 0.5) * 2.0 * uOuter * 1.15;
    float r = length(p);
    if (r < uInner || r > uOuter) discard;

    float t = clamp((r - uInner) / (uOuter - uInner), 0.0, 1.0);
    float a = atan(p.y, p.x);

    // rotasi diferensial: bagian dalam berputar jauh lebih cepat
    float spin = uTime * uSpeed * (1.7 / (0.28 + t));
    float sw = a * 2.0 + spin + t * 9.0;

    float n = fbm(vec2(sw * 0.55 + t * 5.5, t * 2.1));
    float bands = smoothstep(0.22, 0.88, n + 0.32 * sin(a * 6.0 + spin * 0.65));

    vec3 hot = vec3(1.0, 0.96, 0.90);
    vec3 warm = vec3(1.0, 0.60, 0.22);
    vec3 ember = vec3(0.68, 0.17, 0.05);

    vec3 col = mix(hot, warm, smoothstep(0.0, 0.42, t));
    col = mix(col, ember, smoothstep(0.42, 1.0, t));

    // doppler beaming: satu sisi tampak lebih terang
    float doppler = 0.55 + 0.7 * smoothstep(-1.0, 1.0, sin(a) * 0.9);

    float edge = smoothstep(0.0, 0.07, t) * (1.0 - smoothstep(0.68, 1.0, t));
    float intensity = edge * (0.32 + 0.85 * bands) * doppler;

    if (intensity < 0.002) discard;
    gl_FragColor = vec4(col * intensity * 2.0, intensity * uOpacity);
  }
`

const ringFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uHalf;
  uniform float uRing;

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float rr = length(p) * uHalf;
    float d = rr - uRing;

    // pusat cincin + dua lapis glow (tanpa pow negatif → aman di semua GPU)
    float core = 1.0 - smoothstep(0.0, 0.06, abs(d));
    float q1 = (d + 0.11) * 6.0;
    float innerGlow = exp(-q1 * q1) * 0.32;
    float q2 = max(d, 0.0) * 1.7;
    float outerGlow = exp(-q2 * q2) * 0.30 * smoothstep(-0.02, 0.22, d);

    float flicker = 0.93 + 0.07 * sin(uTime * 1.7);
    float alpha = (core + innerGlow + outerGlow) * flicker;
    if (alpha < 0.004) discard;

    vec3 col = mix(vec3(1.0, 0.94, 0.84), vec3(0.96, 0.60, 0.32), smoothstep(0.0, 0.45, abs(d)));
    gl_FragColor = vec4(col * (1.0 + core * 0.5), alpha * uOpacity);
  }
`

function AccretionDisk({ inner = 1.45, outer = 4.9, tilt = 0.15, opacity = 1, speed = 1, scale = 1 }) {
  const matRef = useRef()
  const size = outer * 2.35

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uInner: { value: inner },
      uOuter: { value: outer },
      uOpacity: { value: opacity },
      uSpeed: { value: speed },
    }),
    [inner, outer, opacity, speed]
  )

  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh rotation={[-Math.PI / 2 + tilt, 0, tilt * 1.8]} scale={scale}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={diskVertex}
        fragmentShader={diskFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function PhotonRing({ radius = 1.17, opacity = 1 }) {
  const meshRef = useRef()
  const matRef = useRef()
  const { camera } = useThree()
  const half = 4

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uHalf: { value: half },
      uRing: { value: radius },
    }),
    [radius, opacity]
  )

  useFrame((state) => {
    if (meshRef.current) meshRef.current.quaternion.copy(camera.quaternion)
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[half * 2, half * 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={diskVertex}
        fragmentShader={ringFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function StarLayer({ count = 1800, size = 0.5, spread = 90, speed = 0.006, opacity = 0.9 }) {
  const ref = useRef()
  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const cool = new THREE.Color('#cfe0ff')
    const warm = new THREE.Color('#ffd7b0')

    for (let i = 0; i < count; i++) {
      const radius = 34 + Math.random() * spread
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.cos(phi) * 0.55
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

      const c = cool.clone().lerp(warm, Math.random() ** 2.2)
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return g
  }, [count, spread])

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * speed
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={size}
        sizeAttenuation
        vertexColors
        transparent
        opacity={opacity}
        depthWrite={false}
        fog={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function Planet({ position, radius, color, ring = false, emissive = 0.05 }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 32, 24]} />
        <meshStandardMaterial
          color={color}
          roughness={0.9}
          metalness={0.12}
          emissive={color}
          emissiveIntensity={emissive}
        />
      </mesh>
      {ring && (
        <mesh rotation={[Math.PI / 2 - 0.55, 0.35, 0.2]}>
          <ringGeometry args={[radius * 1.55, radius * 2.35, 72]} />
          <meshBasicMaterial color="#d9c5a8" transparent opacity={0.22} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}
    </group>
  )
}

const camTarget = new THREE.Vector3()

function Rig({ reduced }) {
  const { camera } = useThree()

  useFrame((_, dt) => {
    const p = scrollState.progress
    const px = reduced ? 0 : scrollState.pointer.x
    const py = reduced ? 0 : scrollState.pointer.y

    camTarget.set(px * 0.85, 1.35 - p * 2.7 + py * 0.4, 6.5 + p * 4.4)
    const k = Math.min(1, 1 - Math.pow(0.0016, Math.min(dt, 0.05)))
    camera.position.lerp(camTarget, k)
    camera.lookAt(0, 0.15 - p * 0.45, 0)
  })

  return null
}

function BlackHole({ reduced }) {
  return (
    <group>
      {/* cakrawala peristiwa: bola hitam yang menutupi cahaya di belakangnya */}
      <mesh>
        <sphereGeometry args={[1.0, 48, 48]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      <AccretionDisk inner={1.42} outer={5.0} tilt={0.17} speed={1} />
      {/* lapisan tipis dengan kemiringan lain → kesan cahaya yang terlipat gravitasi */}
      <AccretionDisk inner={1.3} outer={3.4} tilt={1.02} speed={-0.65} opacity={0.22} scale={1.06} />
      <PhotonRing radius={1.19} opacity={0.95} />
    </group>
  )
}

export default function Scene({ reduced = false }) {
  return (
    <div className="scene">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.35, 6.5], fov: 45, near: 0.1, far: 400 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={reduced ? 'demand' : 'always'}
      >
        <color attach="background" args={['#05060a']} />
        <fog attach="fog" args={['#05060a', 26, 120]} />

        <ambientLight intensity={0.5} color="#16203a" />
        <pointLight position={[0, 0.3, 2.2]} intensity={26} distance={26} decay={2} color="#ffab6b" />
        <pointLight position={[-6, -2, 4]} intensity={8} distance={30} decay={2} color="#5b7cff" />

        <Suspense fallback={null}>
          <BlackHole />
          <StarLayer count={1400} size={0.62} speed={0.004} />
          <StarLayer count={900} size={0.32} speed={0.011} opacity={0.75} />
          <Planet position={[-5.2, 1.8, -4.5]} radius={0.42} color="#9aa6c4" ring />
          <Planet position={[4.6, -2.1, -6.5]} radius={0.3} color="#c98c6b" />
          <Planet position={[6.4, 2.9, -9]} radius={0.22} color="#8fb4c9" emissive={0.12} />
        </Suspense>

        <Rig reduced={reduced} />
      </Canvas>
    </div>
  )
}
