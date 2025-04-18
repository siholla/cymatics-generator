import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useMemo, useState } from 'react'

export default function App() {
  const [m, setM] = useState(9)
  const [n, setN] = useState(14)
  const [a, setA] = useState(1)
  const [b, setB] = useState(1)
  const [v, setV] = useState(0.5)

  return (
    <>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, color: 'black', background: 'white', padding: '10px', borderRadius: '8px' }}>
        <label>m: <input type="range" min="1" max="40" step="1" value={m} onChange={(e) => setM(+e.target.value)} /></label><br />
        <label>n: <input type="range" min="1" max="40" step="1" value={n} onChange={(e) => setN(+e.target.value)} /></label><br />
        <label>a: <input type="range" min="0" max="5" step="0.1" value={a} onChange={(e) => setA(+e.target.value)} /></label><br />
        <label>b: <input type="range" min="0" max="5" step="0.1" value={b} onChange={(e) => setB(+e.target.value)} /></label><br />
        <label>v: <input type="range" min="0" max="1" step="0.01" value={v} onChange={(e) => setV(+e.target.value)} /></label>
      </div>

      <Canvas camera={{ position: [0, 0, 3.5] }}>
        <CymaticPoints m={m} n={n} a={a} b={b} v={v} />
        <OrbitControls />
      </Canvas>
    </>
  )
}

function CymaticPoints({ m, n, a, b, v }) {
  const positions = useMemo(() => {
    const grid = 100
    const scale = 2 / grid
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
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="black" />
    </points>
  )
}
