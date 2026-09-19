(() => {
  const vert = `#version 300 es
  precision highp float;
  in vec2 a_position;
  out vec2 v_uv;
  void main(){
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }`;

  const frag = `#version 300 es
  precision highp float;
  in vec2 v_uv;
  out vec4 fragColor;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;

  float hash(vec2 p){
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    float a = hash(i);
    float b = hash(i + vec2(1.0,0.0));
    float c = hash(i + vec2(0.0,1.0));
    float d = hash(i + vec2(1.0,1.0));
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
  }

  float fbm(vec2 p){
    float v = 0.0;
    float a = 0.52;
    mat2 m = mat2(0.80,-0.60,0.60,0.80);
    for(int i=0;i<5;i++){
      v += a * noise(p);
      p = m * p * 2.02 + 11.73;
      a *= 0.5;
    }
    return v;
  }

  vec3 palette(float t){
    vec3 a = vec3(0.12, 0.10, 0.24);
    vec3 b = vec3(0.30, 0.30, 0.55);
    vec3 c = vec3(1.00, 0.78, 0.68);
    vec3 d = vec3(0.08, 0.18, 0.48);
    return a + b*cos(6.28318*(c*t+d));
  }

  void main(){
    vec2 uv = v_uv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = uv - 0.5;
    p.x *= aspect;

    float t = u_time * 0.22;
    vec2 mouse = (u_mouse - 0.5) * vec2(aspect,1.0);
    mouse.y *= -1.0;

    // Large smooth domain warp: ribbons rather than noisy clouds.
    vec2 q;
    q.x = fbm(p*1.15 + vec2(0.0, t*0.28));
    q.y = fbm(p*1.15 + vec2(5.2, -t*0.22));

    vec2 r;
    r.x = fbm(p*1.45 + 2.15*q + vec2(1.7, t*0.20));
    r.y = fbm(p*1.45 + 2.15*q + vec2(8.3, -t*0.18));

    vec2 wp = p + 0.46*(r - 0.5);
    wp += mouse * 0.055 * exp(-1.8*length(p-mouse));

    float f = fbm(wp*1.65 + 1.15*r + vec2(t*0.14,-t*0.10));
    float sweep = sin(wp.y*4.0 + wp.x*1.55 + f*4.4 - t*1.35);
    float sweep2 = sin(wp.y*2.55 - wp.x*2.15 + f*3.1 + t*0.78 + 1.7);

    float bandA = pow(0.5 + 0.5*sweep, 2.0);
    float bandB = pow(0.5 + 0.5*sweep2, 3.0);
    float energy = clamp(0.20 + 0.92*bandA + 0.52*bandB + 0.38*f, 0.0, 1.7);

    vec3 blue = vec3(0.25,0.27,1.00);
    vec3 violet = vec3(0.52,0.20,1.00);
    vec3 cyan = vec3(0.10,0.56,0.96);
    vec3 col = mix(blue, violet, smoothstep(0.20,0.88,f));
    col = mix(col, cyan, 0.34*bandB);
    col += palette(f + bandA*0.12 + t*0.035) * 0.16;
    col *= 0.42 + 0.88*energy;

    // Soft bright filament edges inside the waves.
    float filament = pow(1.0-abs(sweep), 8.0) + 0.62*pow(1.0-abs(sweep2), 11.0);
    col += vec3(0.42,0.48,1.0) * filament * 0.52;

    // Keep the shader atmospheric: no rectangular edge.
    vec2 fp = vec2((uv.x-0.61)*1.18, (uv.y-0.48)*1.02);
    float radial = 1.0 - smoothstep(0.34, 0.82, length(fp));
    float leftFade = smoothstep(0.02, 0.42, uv.x);
    float topBottom = smoothstep(0.0,0.13,uv.y) * smoothstep(0.0,0.15,1.0-uv.y);
    float alpha = radial * leftFade * topBottom * (0.32 + 0.58*clamp(energy,0.0,1.0));

    // Gentle vignette keeps type readable over the left side.
    float textSafety = smoothstep(0.17, 0.56, uv.x);
    alpha *= mix(0.28,1.0,textSafety);

    col = 1.0 - exp(-col*1.28);
    fragColor = vec4(col, clamp(alpha,0.0,0.94));
  }`;

  function init(canvas){
    let gl;
    try {
      gl = canvas.getContext('webgl2', {
        alpha: true,
        antialias: false,
        premultipliedAlpha: true,
        powerPreference: 'high-performance'
      });
      if(!gl) throw new Error('WebGL2 is not available');

      const compile = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          const log = gl.getShaderInfoLog(shader);
          gl.deleteShader(shader);
          throw new Error(log || 'Shader compile error');
        }
        return shader;
      };

      const program = gl.createProgram();
      const vs = compile(gl.VERTEX_SHADER, vert);
      const fs = compile(gl.FRAGMENT_SHADER, frag);
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if(!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Shader link error');
      gl.useProgram(program);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1,-1, 1,-1, -1,1,
        -1,1, 1,-1, 1,1
      ]), gl.STATIC_DRAW);
      const pos = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

      const uResolution = gl.getUniformLocation(program, 'u_resolution');
      const uTime = gl.getUniformLocation(program, 'u_time');
      const uMouse = gl.getUniformLocation(program, 'u_mouse');
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      let mouse = {x:0.70,y:0.45};
      let target = {...mouse};
      let running = true;
      let frame = 0;

      function resize(){
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const w = Math.max(2, Math.round(rect.width*dpr));
        const h = Math.max(2, Math.round(rect.height*dpr));
        if(canvas.width !== w || canvas.height !== h){
          canvas.width = w;
          canvas.height = h;
          gl.viewport(0,0,w,h);
        }
      }

      const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
      observer?.observe(canvas);
      addEventListener('resize', resize, {passive:true});
      resize();

      const onPointer = e => {
        const rect = canvas.getBoundingClientRect();
        target.x = Math.min(1,Math.max(0,(e.clientX-rect.left)/Math.max(rect.width,1)));
        target.y = Math.min(1,Math.max(0,(e.clientY-rect.top)/Math.max(rect.height,1)));
      };
      addEventListener('pointermove', onPointer, {passive:true});
      document.addEventListener('visibilitychange', () => { running = !document.hidden; });

      const start = performance.now();
      function render(now){
        frame = requestAnimationFrame(render);
        if(!running) return;
        resize();
        mouse.x += (target.x-mouse.x)*0.028;
        mouse.y += (target.y-mouse.y)*0.028;
        gl.useProgram(program);
        gl.uniform2f(uResolution, canvas.width, canvas.height);
        gl.uniform1f(uTime, reduce ? 4.0 : (now-start)*0.001);
        gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.clearColor(0,0,0,0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES,0,6);
      }
      requestAnimationFrame(render);
      canvas.classList.add('is-ready');
      canvas.closest('.webgl-shader-stage')?.classList.add('is-ready');
      return true;
    } catch (err) {
      console.warn('WebGL shader fallback:', err);
      canvas.classList.add('is-fallback');
      return false;
    }
  }

  const boot = () => document.querySelectorAll('.webgl-shader-canvas').forEach(canvas => {
    if(canvas.dataset.shaderInit) return;
    canvas.dataset.shaderInit = '1';
    init(canvas);
  });

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();
