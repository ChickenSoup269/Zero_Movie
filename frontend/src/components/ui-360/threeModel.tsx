"use client"

import { useEffect, useState, useRef } from "react"
import * as THREE from "three"
import { Canvas, useFrame, useThree } from "@react-three/fiber"

// Props cho component
interface ThreeModelProps {
  modelPath: string
  targetPosition: [number, number, number]
  controlsEnabled: boolean
}

const ThreeModel: React.FC<ThreeModelProps> = ({
  modelPath,
  targetPosition,
}) => {
  const [model, setModel] = useState<THREE.Object3D | null>(null)
  const [cameraPosition, setCameraPosition] = useState<
    [number, number, number]
  >([0, 3.3, -4.9])

  useEffect(() => {
    const loader = new THREE.ObjectLoader()
    loader.load(
      modelPath,
      (obj) => setModel(obj),
      undefined,
      (error) => console.error("Error loading model:", error)
    )
  }, [modelPath])

  useEffect(() => {
    setCameraPosition(targetPosition)
  }, [targetPosition])

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: cameraPosition, fov: 70 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} />

        {model && <primitive object={model} />}
        <CameraAnimation targetPosition={targetPosition} />
        <MouseLookControls />
      </Canvas>
    </div>
  )
}

// Di chuyển tới vị trí target (không thay đổi)
const CameraAnimation = ({
  targetPosition,
}: {
  targetPosition: [number, number, number]
}) => {
  const [hasMoved, setHasMoved] = useState(false)

  useFrame((state) => {
    const target = new THREE.Vector3(...targetPosition)

    if (!hasMoved) {
      state.camera.position.lerp(target, 0.1)
      if (state.camera.position.distanceTo(target) < 0.01) {
        setHasMoved(true)
      }
    }
  })

  useEffect(() => {
    setHasMoved(false)
  }, [targetPosition])

  return null
}

// Chỉ điều khiển góc nhìn bằng chuột
const MouseLookControls = () => {
  const { camera } = useThree()
  const isMouseDown = useRef(false)
  const lastMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const pitch = useRef(0)
  const yaw = useRef(Math.PI)

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) isMouseDown.current = true
      lastMouse.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseUp = () => (isMouseDown.current = false)

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown.current) return
      const deltaX = e.clientX - lastMouse.current.x
      const deltaY = e.clientY - lastMouse.current.y
      lastMouse.current = { x: e.clientX, y: e.clientY }

      const sensitivity = 0.002
      yaw.current -= deltaX * sensitivity
      pitch.current -= deltaY * sensitivity

      const maxPitch = Math.PI / 2 - 0.01
      const minPitch = -Math.PI / 2 + 0.01
      pitch.current = Math.max(minPitch, Math.min(maxPitch, pitch.current))
    }

    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  useFrame(() => {
    camera.rotation.set(pitch.current, yaw.current, 0, "YXZ")
  })

  return null
}

export default ThreeModel
