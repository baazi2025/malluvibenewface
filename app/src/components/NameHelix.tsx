import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const communityNames = [
  'Amina', 'Rahul', 'Diya', 'Karthik', 'Priya', 'Vivek',
  'Meera', 'Arjun', 'Sana', 'Rohan', 'Anjali', 'Naveen',
  'Fatima', 'Kiran', 'Lakshmi', 'Deepak', 'Zara', 'Manoj',
  'Sneha', 'Harish', 'Aisha', 'Pradeep', 'Nisha', 'Siddharth',
]

const HELIX_COLS = 12
const HELIX_ROWS = 48
const TOTAL_INSTANCES = HELIX_COLS * HELIX_ROWS
const RADIUS = 7.5
const HEIGHT = 15

// Create text textures from names
function createTextTextures(names: string[]): THREE.CanvasTexture[] {
  return names.map((name) => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, 256, 64)
    ctx.fillStyle = '#D4A843'
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(name, 128, 32)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  })
}

const vertexShader = `
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * instanceMatrix * vec4(position, 1.0);
    float depth = length(worldPos.xyz - cameraPosition);
    vDepth = depth;
    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uOpacity;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vec4 texColor = texture2D(uTexture, vUv);
    float radial = 1.0 - smoothstep(0.0, 10.0, vDepth);
    vec3 finalColor = uColor * radial * texColor.a;
    float alpha = radial * uOpacity * texColor.a;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(finalColor, alpha);
  }
`

function HelixMesh() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const scrollRef = useRef(0)
  const rotationRef = useRef(0)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Create text textures
  const textures = useMemo(() => createTextTextures(communityNames), [])

  // Create position data
  const positionData = useMemo(() => {
    const data: {
      idx: number
      x: number
      y: number
      z: number
      phi: number
      nameIdx: number
    }[] = []

    for (let col = 0; col < HELIX_COLS; col++) {
      const phi = (col / HELIX_COLS) * Math.PI * 2
      for (let row = 0; row < HELIX_ROWS; row++) {
        const y = (row / HELIX_ROWS) * HEIGHT - HEIGHT / 2
        const idx = col * HELIX_ROWS + row
        const nameIdx = (col + row) % communityNames.length
        data.push({ idx, x: Math.cos(phi) * RADIUS, y, z: Math.sin(phi) * RADIUS, phi, nameIdx })
      }
    }
    return data
  }, [])

  // Create shared material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: textures[0] },
        uOpacity: { value: 0.85 },
        uColor: { value: new THREE.Color('#D4A843') },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  }, [textures])

  // Track scroll
  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Create geometry
  const geometry = useMemo(() => new THREE.PlaneGeometry(2, 0.5), [])

  // Track which texture each instance uses
  const nameIndices = useMemo(() => {
    return positionData.map((p) => p.nameIdx)
  }, [positionData])

  useFrame(() => {
    if (!meshRef.current) return

    const speed = Math.max(0.001, scrollRef.current * 0.0005)
    rotationRef.current += speed * 0.3
    const rotX = rotationRef.current

    // Update instance matrices
    positionData.forEach((item, i) => {
      const nameIdx = (item.nameIdx + Math.floor(rotX * 2)) % communityNames.length
      const phi = item.phi

      // Apply helix rotation
      const cosR = Math.cos(rotX)
      const sinR = Math.sin(rotX)
      const baseY = item.y
      const baseZ = Math.sin(phi) * RADIUS
      const baseX = Math.cos(phi) * RADIUS

      // Rotate around X axis
      const rotatedY = baseY * cosR - baseZ * sinR
      const rotatedZ = baseY * sinR + baseZ * cosR

      dummy.position.set(baseX, rotatedY, rotatedZ)
      dummy.rotation.set(rotX, -phi - Math.PI / 2, 0)
      dummy.updateMatrix()

      meshRef.current!.setMatrixAt(i, dummy.matrix)

      // Update name index tracking
      if (nameIndices[i] !== nameIdx) {
        nameIndices[i] = nameIdx
      }
    })

    // Cycle texture based on rotation
    const textureIdx = Math.abs(Math.floor(rotX * 2) % textures.length)
    material.uniforms.uTexture.value = textures[textureIdx]

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, TOTAL_INSTANCES]}
        frustumCulled={false}
      />
    </group>
  )
}

// Fallback: Simple animated particles helix
function SimpleHelix() {
  const pointsRef = useRef<THREE.Points>(null)
  const scrollRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(TOTAL_INSTANCES * 3)
    const colorArr = new Float32Array(TOTAL_INSTANCES * 3)
    const goldColor = new THREE.Color('#D4A843')

    for (let c = 0; c < HELIX_COLS; c++) {
      const phi = (c / HELIX_COLS) * Math.PI * 2
      for (let row = 0; row < HELIX_ROWS; row++) {
        const y = (row / HELIX_ROWS) * HEIGHT - HEIGHT / 2
        const idx = (c * HELIX_ROWS + row) * 3
        pos[idx] = Math.cos(phi) * RADIUS
        pos[idx + 1] = y
        pos[idx + 2] = Math.sin(phi) * RADIUS

        const vary = 0.8 + Math.random() * 0.2
        colorArr[idx] = goldColor.r * vary
        colorArr[idx + 1] = goldColor.g * vary
        colorArr[idx + 2] = goldColor.b * vary
      }
    }
    return { positions: pos, colors: colorArr }
  }, [])

  const rotationRef = useRef(0)

  useFrame(() => {
    if (!pointsRef.current) return
    const speed = Math.max(0.001, scrollRef.current * 0.0005)
    rotationRef.current += speed * 0.3
    pointsRef.current.rotation.x = rotationRef.current
  })

  const posAttr = useMemo(() => new THREE.BufferAttribute(positions, 3), [positions])
  const colAttr = useMemo(() => new THREE.BufferAttribute(colors, 3), [colors])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <primitive object={posAttr} attach="attributes-position" />
        <primitive object={colAttr} attach="attributes-color" />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export default function NameHelix() {
  const [useSimple, setUseSimple] = useState(false)

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 20], fov: 45, near: 1, far: 1000 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
        onError={() => setUseSimple(true)}
        style={{ width: '100%', height: '100%' }}
      >
        {useSimple ? <SimpleHelix /> : <HelixMesh />}
      </Canvas>
    </div>
  )
}
