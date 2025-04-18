import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState } from 'react'

export default function App() {
  const [n, setN] = useState(9)
  const [m, setM] = useState(14)
  const [v, setV] = useState(0.5)
  const [pointSize, setPointSize] = useState(1.5)

  return (
    <>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, color: 'white' }}>
        <label>n: <input type="range" min="1" max="40" step="0.1" value={n} onChange={(e) => setN(+e.target.value)} /></label><br />
        <label>m: <input type="range" min="1" max="40" step="0.1" value={m} onChange={(e) => setM(+e.target.value)} /></label><br />
        <label>v: <input type="range" min="0" max="1" step="0.01" value={v} onChange={(e) => setV(+e.target.value)} /></label><br />
        <label>Point Size: <input type="range" min="0.5" max="5" step="0.1" value={pointSize} onChange={(e) => setPointSize(+e.target.value)} /></label>
      </div>

      <Canvas camera={{ position: [0, 0, 4] }}>
        <Cymatics n={n} m={m} v={v} pointSize={pointSize} />
        <OrbitControls />
      </Canvas>
    </>
  )
}

function Cymatics({ n, m, v, pointSize }) {
  const positions = []

  const grid = 100
  const scale = 2 / grid

  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      const px = x / grid
      const py = y / grid
      const wave =
        (Math.sin(Math.PI * m * px) * Math.sin(Math.PI * n * py) +
         Math.sin(Math.PI * n * px) * Math.sin(Math.PI * m * py)) * v

      const bright = Math.abs(wave)
      if (bright > 0.5) {
        positions.push([(x - grid / 2) * scale, (y - grid / 2) * scale, 0])
      }
    }
  }

  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={positions.length}
          array={new Float32Array(positions.flat())}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial attach="material" color="white" size={pointSize} sizeAttenuation />
    </points>
  )
}
