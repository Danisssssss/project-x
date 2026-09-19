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

  #define PI 3.14159265359

  float hash(vec2 p){
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    f = f*f*(3.0-2.0*f);
    float a = hash(i);
    float b = hash(i + vec2(1.0,0.0));
    float c = hash(i + vec2(0.0,1.0));
    float d = hash(i + vec2(1.0,1.0));
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
  }

  float fbm(vec2 p){
    float v = 0.0;
    float a = 0.5;
    mat2 r = mat2(0.8,-0.6,0.6,0.8);
    for(int i=0;i<4;i++){
      v += a * noise(p);
      p = r * p * 2.03 + 13.7;
      a *= 0.5;
    }
    return v;
  }

  vec3 film(float x){
    vec3 c = 0.52 + 0.48*cos(6.28318*(vec3(0.00,0.34,0.68)+x));
    return c;
  }

  void main(){
    vec2 uv = v_uv;
    vec2 p = uv - 0.5;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    p.x *= aspect;

    float t = u_time * 0.17;
    vec2 mp = (u_mouse - 0.5) * vec2(aspect, 1.0);

    // Smooth stretched drop — intentionally low-frequency, no lumpy surface.
    p.x -= 0.03*sin(t*0.55);
    p.y += 0.02*cos(t*0.47);
    float ang = atan(p.y, p.x);
    vec2 ep = vec2(p.x/0.78, p.y/0.62);
    float r = length(ep);
    float boundary = 0.665;
    boundary += 0.013*sin(ang*2.0 + t*0.8);
    boundary += 0.009*sin(ang*3.0 - t*0.52 + 0.8);
    boundary += 0.006*sin(ang*5.0 + t*0.34);
    boundary += 0.006*(fbm(ep*1.8 + vec2(t*0.08,-t*0.06)) - 0.5);

    float rr = r / boundary;
    float aa = max(fwidth(rr)*1.6, 0.0015);
    float alpha = 1.0 - smoothstep(1.0-aa, 1.0+aa, rr);
    if(alpha <= 0.001){ fragColor = vec4(0.0); return; }

    // Domed height field with subtle liquid movement.
    float dome = sqrt(max(0.0, 1.0 - rr*rr));
    float flow = sin(ep.x*3.2 + t*0.9) * sin(ep.y*2.4 - t*0.55);
    flow += 0.42*sin((ep.x+ep.y)*4.1 - t*0.38);
    float h = dome + flow * 0.018 * pow(max(dome,0.0), 1.8);

    float dx = dFdx(h);
    float dy = dFdy(h);
    vec3 n = normalize(vec3(-dx*30.0, -dy*30.0, 1.0));

    // Environment stripes: broad black / silver / white zones like polished chrome.
    float cursorInfluence = dot(mp, vec2(0.20,-0.12));
    float env = n.x*0.58 + n.y*0.28 + 0.16*n.z;
    env += 0.075*sin(t*0.52 + ep.y*1.8) + cursorInfluence*0.12;
    float b1 = 0.5 + 0.5*sin(env*7.2 + 0.9);
    float b2 = 0.5 + 0.5*sin((n.y*0.70 - n.x*0.22 + ep.x*0.08)*4.2 - 1.1);
    float b3 = 0.5 + 0.5*sin((n.x*0.34 + n.z*0.55)*3.4 + 2.4);

    b1 = smoothstep(0.16,0.86,b1);
    b2 = smoothstep(0.12,0.92,b2);
    b3 = smoothstep(0.22,0.94,b3);

    float chrome = clamp(0.08 + 0.78*b1 + 0.31*b2 - 0.26*(1.0-b3), 0.0, 1.0);
    chrome = pow(chrome, 0.9);

    vec3 dark = vec3(0.018,0.020,0.028);
    vec3 silver = vec3(0.90,0.92,0.97);
    vec3 col = mix(dark, silver, chrome);

    // Clean high-frequency glints, rather than soft cloudy shading.
    vec3 L1 = normalize(vec3(-0.55,-0.55,1.0));
    vec3 L2 = normalize(vec3(0.68,0.12,0.75));
    float spec1 = pow(max(dot(n,L1),0.0), 56.0);
    float spec2 = pow(max(dot(n,L2),0.0), 90.0);
    col += vec3(1.0) * (0.78*spec1 + 0.62*spec2);

    // Slight cool reflections from the site's violet-blue accent.
    float cool = pow(max(0.0, n.y*0.55 - n.x*0.18 + 0.15), 3.0);
    col += vec3(0.17,0.16,0.42) * cool * 0.48;

    // Thin prismatic edge, mostly visible on the lower / left rim.
    float rim = pow(clamp(1.0-n.z,0.0,1.0), 4.2);
    float sideMask = smoothstep(-0.95,0.25,-ep.x) * smoothstep(-0.8,0.45,-ep.y);
    vec3 prism = film(ang/(2.0*PI) + t*0.025);
    col = mix(col, prism*1.15, rim*sideMask*0.34);

    // Fresnel bright line for a crisp premium silhouette.
    float fresnel = pow(1.0-max(n.z,0.0), 2.2);
    col += vec3(0.86,0.88,0.98) * fresnel * 0.18;

    // Keep highlights photographic, not blown-out white.
    col = col / (0.82 + 0.18*col);
    col = pow(max(col,0.0), vec3(0.96));

    fragColor = vec4(col, alpha * 0.98);
  }`;

  function init(canvas){
    let gl;
    try {
      gl = canvas.getContext('webgl2', { alpha:true, antialias:true, premultipliedAlpha:true, powerPreference:'high-performance' });
      if(!gl) return false;

      const compile = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader compile failed');
        return s;
      };
      const program = gl.createProgram();
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vert));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, frag));
      gl.linkProgram(program);
      if(!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'shader link failed');
      gl.useProgram(program);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
      const pos = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

      const uRes = gl.getUniformLocation(program, 'u_resolution');
      const uTime = gl.getUniformLocation(program, 'u_time');
      const uMouse = gl.getUniformLocation(program, 'u_mouse');
      let mouse = {x:.58,y:.42}, target = {...mouse};
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      let visible = true;

      const ro = new ResizeObserver(() => resize());
      ro.observe(canvas);
      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(devicePixelRatio || 1, 1.6);
        const w = Math.max(2, Math.round(rect.width*dpr));
        const h = Math.max(2, Math.round(rect.height*dpr));
        if(canvas.width!==w || canvas.height!==h){ canvas.width=w; canvas.height=h; gl.viewport(0,0,w,h); }
      };
      resize();

      const onPointer = e => {
        const r = canvas.getBoundingClientRect();
        target.x = Math.min(1,Math.max(0,(e.clientX-r.left)/Math.max(r.width,1)));
        target.y = 1-Math.min(1,Math.max(0,(e.clientY-r.top)/Math.max(r.height,1)));
      };
      window.addEventListener('pointermove', onPointer, {passive:true});
      document.addEventListener('visibilitychange',()=>visible=!document.hidden);

      const start = performance.now();
      function draw(now){
        requestAnimationFrame(draw);
        if(!visible) return;
        resize();
        mouse.x += (target.x-mouse.x)*0.035;
        mouse.y += (target.y-mouse.y)*0.035;
        gl.useProgram(program);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, reduce ? 2.4 : (now-start)*0.001);
        gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.clearColor(0,0,0,0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES,0,6);
      }
      requestAnimationFrame(draw);
      canvas.classList.add('is-ready');
      return true;
    } catch(err){
      console.warn('Liquid metal disabled:', err);
      canvas.classList.add('is-fallback');
      return false;
    }
  }

  const boot = () => document.querySelectorAll('.liquid-metal-canvas').forEach(init);
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true}); else boot();
})();

