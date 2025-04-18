import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useState, useRef } from 'react'

export default function App() {
  const [m, setM] = useState(9)
  const [n, setN] = useState(14)
  const [a, setA] = useState(1)
  const [b, setB] = useState(1)
  const [v, setV] = useState(0.5)

  return (
    <>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, color: 'white', background: '#111', padding: '10px', borderRadius: '8px' }}>
        <label>m: <input type="range" min="1" max="40" step="1" value={m} onChange={(e) => setM(+e.target.value)} /></label><br />
        <label>n: <input type="range" min="1" max="40" step="1" value={n} onChange={(e) => setN(+e.target.value)} /></label><br />
        <label>a: <input type="range" min="0" max="5" step="0.1" value={a} onChange={(e) => setA(+e.target.value)} /></label><br />
        <label>b: <input type="range" min="0" max="5" step="0.1" value={b} onChange={(e) => setB(+e.target.value)} /></label><br />
        <label>v: <input type="range" min="0" max="1" step="0.01" value={v} onChange={(e) => setV(+e.target.value)} /></label>
      </div>

      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ background: '#0a0a0a', height: '100vh' }}
      >
        <ambientLight intensity={0.5} />
        <Cymatics m={m} n={n} a={a} b={b} v={v} />
        <OrbitControls />
      </Canvas>
    </>
  )
}

function Cymatics({ m, n, a, b, v }) {
  const ref = useRef()
  const grid = 400
  const scale = 3 / grid

  // slight animation pulse
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ref.current) {
      ref.current.material.opacity = 0.75 + 0.25 * Math.sin(t * 1.2)
    }
  })

  const positions = useMemo(() => {
    const pos = []

    for (let y = 0; y < grid; y++) {
      for (let x = 0; x < grid; x++) {
        const px = x / grid
        const py = y / grid

        const wave =
          (Math.sin(Math.PI * m * px) * Math.sin(Math.PI * n * py) * a +
           Math.sin(Math.PI * n * px) * Math.sin(Math.PI * m * py) * b) * v

        const brightness = Math.abs(wave)
        if (brightness > 0.5) {
          pos.push([(x - grid / 2) * scale, (y - grid / 2) * scale, 0])
        }
      }
    }

    return new Float32Array(pos.flat())
  }, [m, n, a, b, v])

  return (
    <points ref={ref} rotation={[Math.PI / 8, Math.PI / 8, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#88ccff"
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
