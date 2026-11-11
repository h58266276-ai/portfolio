import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

// Повноекранна «ріка»: шейдер з потоком (domain-warped fbm), що розходиться під курсором.
const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uAspect;
  uniform vec3 uMist, uLilac, uIce, uPeach, uInk;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++){ v += a*noise(p); p = p*2.03 + 7.1; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv; uv.x *= uAspect;
    vec2 m = uMouse; m.x *= uAspect;
    float t = uTime * 0.06;

    // течія зліва направо, з легким вигином як у русла
    vec2 p = uv * vec2(1.6, 2.4);
    p.x -= t * 2.0;
    p.y += sin(uv.x * 1.3 + t) * 0.35;

    // курсор розштовхує воду
    float d = distance(uv, m);
    float push = exp(-d * 6.0);
    // плавне розходження: біля самого курсора сила спадає до нуля, без «воронки»
    p += (uv - m) / (d + 0.12) * push * 0.18;

    vec2 q = vec2(fbm(p), fbm(p + vec2(5.2, 1.3)));
    vec2 r = vec2(fbm(p + 2.0*q + vec2(1.7, 9.2) + t), fbm(p + 2.0*q + vec2(8.3, 2.8) - t));
    float f = fbm(p + 2.5*r);

    vec3 col = uMist;
    col = mix(col, uIce, smoothstep(0.35, 0.75, f));
    col = mix(col, uLilac, smoothstep(0.55, 0.95, length(r)) * 0.85);
    col = mix(col, uPeach, smoothstep(0.62, 0.9, q.y) * 0.45);
    // відблиски на поверхні
    float sheen = pow(smoothstep(0.55, 1.0, f + push * 0.4), 6.0);
    col += sheen * 0.35;
    // тінь знизу, щоб текст читався
    col = mix(col, uMist, smoothstep(0.55, 0.0, vUv.y) * 0.55);
    gl_FragColor = vec4(col, 1.0);
  }
`

function Water({ still }: { still: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const mouse = useRef(new THREE.Vector2(0.7, 0.6))
  const target = useRef(new THREE.Vector2(0.7, 0.6))
  const { size } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 8 },
      uMouse: { value: new THREE.Vector2(0.7, 0.6) },
      uAspect: { value: 1 },
      uMist: { value: new THREE.Color('#E8EBF4') },
      uLilac: { value: new THREE.Color('#8B7BF0') },
      uIce: { value: new THREE.Color('#A3D9E8') },
      uPeach: { value: new THREE.Color('#F4B6A2') },
      uInk: { value: new THREE.Color('#1D1B3B') },
    }),
    [],
  )

  useFrame((state, delta) => {
    if (!mat.current) return
    const u = mat.current.uniforms
    u.uAspect.value = size.width / size.height
    target.current.set(state.pointer.x * 0.5 + 0.5, state.pointer.y * 0.5 + 0.5)
    mouse.current.lerp(target.current, 0.06)
    u.uMouse.value.copy(mouse.current)
    if (!still) u.uTime.value += delta
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </mesh>
  )
}

export default function River() {
  const still =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return (
    <Canvas
      className="river"
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      eventSource={typeof document !== 'undefined' ? document.body : undefined}
      aria-hidden="true"
    >
      <Water still={still} />
    </Canvas>
  )
}
