import { useEffect } from 'react'

export default function WebGLShader() {
  useEffect(() => {
    if (document.querySelector('script[data-webgl-shader]')) return
    const script = document.createElement('script')
    script.src = './webgl-shader.js'
    script.dataset.webglShader = 'true'
    script.defer = true
    document.body.appendChild(script)
  }, [])

  return (
    <div className="webgl-shader-stage" aria-hidden="true">
      <div className="webgl-shader-fallback" />
      <canvas className="webgl-shader-canvas" />
    </div>
  )
}
