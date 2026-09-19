const vertexShaderSource = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`

const fragmentShaderSource = `
precision highp float;
varying vec2 v_uv;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  mat2 r = mat2(0.80, -0.60, 0.60, 0.80);
  for (int i = 0; i < 4; i++) {
    value += noise(p) * amp;
    p = r * p * 2.03 + 7.17;
    amp *= 0.5;
  }
  return value;
}

float gaussian(vec2 p, vec2 c, float radius) {
  vec2 q = (p - c) / radius;
  return exp(-dot(q, q) * 2.15);
}

float metalField(vec2 p, float t) {
  vec2 mouse = (u_mouse - 0.5) * 2.0;
  vec2 c0 = vec2(0.00, 0.02) + 0.035 * vec2(sin(t * 0.57), cos(t * 0.43));
  vec2 c1 = vec2(-0.29, 0.17) + 0.105 * vec2(sin(t * 0.73 + 1.4), cos(t * 0.61 + 2.1));
  vec2 c2 = vec2(0.31, -0.14) + 0.095 * vec2(cos(t * 0.66 + 0.4), sin(t * 0.82 + 1.8));
  vec2 c3 = vec2(0.15, 0.31) + 0.085 * vec2(sin(t * 0.49 + 3.0), cos(t * 0.77 + 0.2));
  vec2 c4 = vec2(-0.14, -0.32) + 0.075 * vec2(cos(t * 0.88 + 2.4), sin(t * 0.58 + 4.1));
  c2 += mouse * 0.065;

  float f = 0.0;
  f += 1.25 * gaussian(p, c0, 0.72);
  f += 0.72 * gaussian(p, c1, 0.48);
  f += 0.74 * gaussian(p, c2, 0.50);
  f += 0.56 * gaussian(p, c3, 0.43);
  f += 0.50 * gaussian(p, c4, 0.44);

  float wobble = (fbm(p * 2.25 + vec2(t * 0.055, -t * 0.045)) - 0.5) * 0.15;
  return f + wobble;
}

float surfaceHeight(vec2 p, float t) {
  float f = metalField(p, t);
  float h = smoothstep(0.49, 1.58, f);
  return pow(h, 0.58);
}

vec3 chromeEnvironment(vec3 r, vec2 p, float t) {
  float y = r.y * 0.5 + 0.5;
  float x = r.x * 0.5 + 0.5;

  float broad = smoothstep(0.06, 0.88, y);
  vec3 dark = vec3(0.012, 0.014, 0.020);
  vec3 silver = vec3(0.96, 0.975, 1.0);
  vec3 env = mix(dark, silver, broad);

  float bandA = exp(-pow((y - 0.28) * 8.2, 2.0));
  float bandB = exp(-pow((y - 0.70) * 10.0, 2.0));
  float bandC = exp(-pow((x - 0.18) * 8.0, 2.0));
  env = mix(env, vec3(0.025, 0.03, 0.05), bandA * 0.82);
  env += vec3(0.62, 0.68, 0.92) * bandB * 0.32;
  env += vec3(0.20, 0.22, 0.34) * bandC * 0.20;

  float softGrid = 0.5 + 0.5 * sin((r.x * 2.4 + r.y * 3.1 + t * 0.045) * 3.14159);
  env *= 0.80 + 0.24 * smoothstep(0.16, 0.92, softGrid);

  float warm = exp(-pow((r.x + r.y + 0.62) * 6.2, 2.0));
  env += vec3(0.44, 0.11, 0.035) * warm * 0.34;
  return env;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 1.55;
  p.x += 0.055;

  float t = u_time;
  float field = metalField(p, t);
  float mask = smoothstep(0.455, 0.535, field);

  float eps = 1.7 / max(u_resolution.y, 1.0);
  float h = surfaceHeight(p, t);
  float hx = surfaceHeight(p + vec2(eps, 0.0), t) - surfaceHeight(p - vec2(eps, 0.0), t);
  float hy = surfaceHeight(p + vec2(0.0, eps), t) - surfaceHeight(p - vec2(0.0, eps), t);
  vec3 n = normalize(vec3(-hx * 15.0, -hy * 15.0, 0.50 + h * 0.62));

  vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
  vec3 refl = reflect(-viewDir, n);
  vec3 color = chromeEnvironment(refl, p, t);

  vec2 mouse = (u_mouse - 0.5) * 2.0;
  vec3 lightDir = normalize(vec3(-0.42 + mouse.x * 0.18, 0.52 - mouse.y * 0.12, 0.92));
  float spec = pow(max(dot(n, lightDir), 0.0), 42.0);
  float pin = pow(max(dot(n, normalize(vec3(0.55, 0.72, 0.90))), 0.0), 120.0);
  float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.1);

  color += vec3(1.0) * spec * 0.80;
  color += vec3(0.72, 0.78, 1.0) * pin * 0.65;
  color += vec3(0.34, 0.37, 0.62) * fresnel * 0.48;

  float rim = smoothstep(0.47, 0.55, field) * (1.0 - smoothstep(0.55, 0.70, field));
  float chroma = 0.5 + 0.5 * sin(atan(p.y, p.x) * 4.0 + t * 0.16);
  color += rim * mix(vec3(0.08, 0.24, 0.95), vec3(0.95, 0.20, 0.07), chroma) * 0.50;

  float innerShade = 0.72 + h * 0.30;
  color *= innerShade;
  color = pow(max(color, 0.0), vec3(0.92));

  float edgeAlpha = smoothstep(0.455, 0.515, field);
  gl_FragColor = vec4(color, edgeAlpha * mask * 0.96);
}`

function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(error || 'Shader compilation failed')
  }
  return shader
}

export function mountLiquidMetal(canvas, { reducedMotion = false } = {}) {
  if (!canvas) return () => {}
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: true,
    premultipliedAlpha: true,
    powerPreference: 'high-performance',
  })
  if (!gl) {
    canvas.classList.add('is-unavailable')
    return () => {}
  }

  let program
  try {
    const vertex = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    program = gl.createProgram()
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    gl.deleteShader(vertex)
    gl.deleteShader(fragment)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Program link failed')
  } catch (error) {
    console.warn('Liquid metal shader unavailable:', error)
    canvas.classList.add('is-unavailable')
    return () => {}
  }

  gl.useProgram(program)
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const position = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
  const timeLocation = gl.getUniformLocation(program, 'u_time')
  const mouseLocation = gl.getUniformLocation(program, 'u_mouse')

  let width = 0
  let height = 0
  let raf = 0
  let disposed = false
  let mouseX = 0.5
  let mouseY = 0.5
  let targetX = 0.5
  let targetY = 0.5
  const started = performance.now()

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 1.65)
    const nextW = Math.max(2, Math.round(rect.width * dpr))
    const nextH = Math.max(2, Math.round(rect.height * dpr))
    if (nextW !== width || nextH !== height) {
      width = nextW
      height = nextH
      canvas.width = width
      canvas.height = height
      gl.viewport(0, 0, width, height)
    }
  }

  const onPointerMove = (event) => {
    targetX = Math.min(1, Math.max(0, event.clientX / Math.max(window.innerWidth, 1)))
    targetY = 1 - Math.min(1, Math.max(0, event.clientY / Math.max(window.innerHeight, 1)))
  }

  const render = (now) => {
    if (disposed) return
    resize()
    mouseX += (targetX - mouseX) * 0.045
    mouseY += (targetY - mouseY) * 0.045
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.uniform2f(resolutionLocation, width, height)
    gl.uniform2f(mouseLocation, mouseX, mouseY)
    gl.uniform1f(timeLocation, reducedMotion ? 1.8 : (now - started) * 0.001)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    canvas.classList.add('is-ready')
    if (!reducedMotion) raf = requestAnimationFrame(render)
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('resize', resize, { passive: true })
  raf = requestAnimationFrame(render)

  return () => {
    disposed = true
    if (raf) cancelAnimationFrame(raf)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('resize', resize)
    gl.deleteBuffer(buffer)
    gl.deleteProgram(program)
  }
}
