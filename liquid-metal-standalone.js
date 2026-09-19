(() => {
  const vertexShaderSource = `attribute vec2 a_position; varying vec2 v_uv; void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;
  const fragmentShaderSource = `
precision highp float;
varying vec2 v_uv;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
float hash21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);float a=hash21(i),b=hash21(i+vec2(1.,0.)),c=hash21(i+vec2(0.,1.)),d=hash21(i+vec2(1.,1.));return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 r=mat2(.8,-.6,.6,.8);for(int i=0;i<4;i++){v+=noise(p)*a;p=r*p*2.03+7.17;a*=.5;}return v;}
float gaussian(vec2 p,vec2 c,float r){vec2 q=(p-c)/r;return exp(-dot(q,q)*2.15);}
float metalField(vec2 p,float t){vec2 m=(u_mouse-.5)*2.;vec2 c0=vec2(0.,.02)+.035*vec2(sin(t*.57),cos(t*.43));vec2 c1=vec2(-.29,.17)+.105*vec2(sin(t*.73+1.4),cos(t*.61+2.1));vec2 c2=vec2(.31,-.14)+.095*vec2(cos(t*.66+.4),sin(t*.82+1.8));vec2 c3=vec2(.15,.31)+.085*vec2(sin(t*.49+3.),cos(t*.77+.2));vec2 c4=vec2(-.14,-.32)+.075*vec2(cos(t*.88+2.4),sin(t*.58+4.1));c2+=m*.065;float f=1.25*gaussian(p,c0,.72)+.72*gaussian(p,c1,.48)+.74*gaussian(p,c2,.50)+.56*gaussian(p,c3,.43)+.50*gaussian(p,c4,.44);return f+(fbm(p*2.25+vec2(t*.055,-t*.045))-.5)*.15;}
float surfaceHeight(vec2 p,float t){float f=metalField(p,t);float h=smoothstep(.49,1.58,f);return pow(h,.58);}
vec3 chromeEnvironment(vec3 r,vec2 p,float t){float y=r.y*.5+.5,x=r.x*.5+.5;float broad=smoothstep(.06,.88,y);vec3 env=mix(vec3(.012,.014,.020),vec3(.96,.975,1.),broad);float a=exp(-pow((y-.28)*8.2,2.)),b=exp(-pow((y-.70)*10.,2.)),c=exp(-pow((x-.18)*8.,2.));env=mix(env,vec3(.025,.03,.05),a*.82);env+=vec3(.62,.68,.92)*b*.32+vec3(.20,.22,.34)*c*.20;float grid=.5+.5*sin((r.x*2.4+r.y*3.1+t*.045)*3.14159);env*=.80+.24*smoothstep(.16,.92,grid);float warm=exp(-pow((r.x+r.y+.62)*6.2,2.));env+=vec3(.44,.11,.035)*warm*.34;return env;}
void main(){vec2 uv=v_uv;float aspect=u_resolution.x/max(u_resolution.y,1.);vec2 p=(uv-.5)*vec2(aspect,1.)*1.55;p.x+=.055;float t=u_time;float field=metalField(p,t);float mask=smoothstep(.455,.535,field);float eps=1.7/max(u_resolution.y,1.);float h=surfaceHeight(p,t);float hx=surfaceHeight(p+vec2(eps,0.),t)-surfaceHeight(p-vec2(eps,0.),t);float hy=surfaceHeight(p+vec2(0.,eps),t)-surfaceHeight(p-vec2(0.,eps),t);vec3 n=normalize(vec3(-hx*15.,-hy*15.,.50+h*.62));vec3 v=normalize(vec3(0.,0.,1.));vec3 refl=reflect(-v,n);vec3 color=chromeEnvironment(refl,p,t);vec2 m=(u_mouse-.5)*2.;vec3 l=normalize(vec3(-.42+m.x*.18,.52-m.y*.12,.92));float spec=pow(max(dot(n,l),0.),42.);float pin=pow(max(dot(n,normalize(vec3(.55,.72,.90))),0.),120.);float fresnel=pow(1.-max(dot(n,v),0.),3.1);color+=vec3(1.)*spec*.80+vec3(.72,.78,1.)*pin*.65+vec3(.34,.37,.62)*fresnel*.48;float rim=smoothstep(.47,.55,field)*(1.-smoothstep(.55,.70,field));float chroma=.5+.5*sin(atan(p.y,p.x)*4.+t*.16);color+=rim*mix(vec3(.08,.24,.95),vec3(.95,.20,.07),chroma)*.50;color*=.72+h*.30;color=pow(max(color,0.),vec3(.92));float alpha=smoothstep(.455,.515,field);gl_FragColor=vec4(color,alpha*mask*.96);}`;

  function shader(gl,type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){throw new Error(gl.getShaderInfoLog(s)||'shader');}return s;}
  window.mountLiquidMetalStandalone=(canvas,{reducedMotion=false}={})=>{
    if(!canvas)return()=>{};
    const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true,powerPreference:'high-performance'});
    if(!gl){canvas.classList.add('is-unavailable');return()=>{};}
    let program;
    try{const vs=shader(gl,gl.VERTEX_SHADER,vertexShaderSource),fs=shader(gl,gl.FRAGMENT_SHADER,fragmentShaderSource);program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)||'link');}catch(e){console.warn('Liquid metal shader unavailable',e);canvas.classList.add('is-unavailable');return()=>{};}
    gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const pos=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
    const rLoc=gl.getUniformLocation(program,'u_resolution'),tLoc=gl.getUniformLocation(program,'u_time'),mLoc=gl.getUniformLocation(program,'u_mouse');let w=0,h=0,raf=0,dead=false,mx=.5,my=.5,tx=.5,ty=.5,start=performance.now();
    const resize=()=>{const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.65),nw=Math.max(2,Math.round(rect.width*dpr)),nh=Math.max(2,Math.round(rect.height*dpr));if(nw!==w||nh!==h){w=nw;h=nh;canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}};
    const move=e=>{tx=Math.min(1,Math.max(0,e.clientX/Math.max(innerWidth,1)));ty=1-Math.min(1,Math.max(0,e.clientY/Math.max(innerHeight,1)));};
    const render=now=>{if(dead)return;resize();mx+=(tx-mx)*.045;my+=(ty-my)*.045;gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform2f(rLoc,w,h);gl.uniform2f(mLoc,mx,my);gl.uniform1f(tLoc,reducedMotion?1.8:(now-start)*.001);gl.drawArrays(gl.TRIANGLES,0,3);canvas.classList.add('is-ready');if(!reducedMotion)raf=requestAnimationFrame(render);};
    addEventListener('pointermove',move,{passive:true});addEventListener('resize',resize,{passive:true});raf=requestAnimationFrame(render);
    return()=>{dead=true;if(raf)cancelAnimationFrame(raf);removeEventListener('pointermove',move);removeEventListener('resize',resize);gl.deleteBuffer(buffer);gl.deleteProgram(program);};
  };
})();
