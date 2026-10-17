import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas=document.getElementById('world');
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:false,alpha:true,powerPreference:'high-performance'})}catch(e){canvas.remove()}
if(renderer){
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(55,1,.1,100);
  camera.position.set(0,0,7);
  const mobile=innerWidth<760;
  const N=mobile?9000:22000;
  const sphere=new Float32Array(N*3), terrain=new Float32Array(N*3), rnd=new Float32Array(N);
  const side=Math.ceil(Math.sqrt(N));
  for(let i=0;i<N;i++){
    // sphère (distribution Fibonacci)
    const phi=Math.acos(1-2*(i+.5)/N), th=Math.PI*(1+Math.sqrt(5))*i, r=2.35;
    sphere[i*3]=Math.cos(th)*Math.sin(phi)*r; sphere[i*3+1]=Math.sin(th)*Math.sin(phi)*r; sphere[i*3+2]=Math.cos(phi)*r;
    // paysage (grille)
    const gx=(i%side)/side-.5, gz=Math.floor(i/side)/side-.5;
    terrain[i*3]=gx*22; terrain[i*3+1]=-2.4; terrain[i*3+2]=gz*22-4;
    rnd[i]=Math.random();
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(sphere,3));
  geo.setAttribute('aTerrain',new THREE.BufferAttribute(terrain,3));
  geo.setAttribute('aRnd',new THREE.BufferAttribute(rnd,1));
  const uniforms={uTime:{value:0},uMorph:{value:0},uMouse:{value:new THREE.Vector2()},uBurst:{value:0},uPx:{value:renderer.getPixelRatio()},
    uEmber:{value:new THREE.Color('#ff4a1c')},uBone:{value:new THREE.Color('#ece8e1')}};
  const noise=`
  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
  float snoise(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}`;
  const mat=new THREE.ShaderMaterial({uniforms,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:noise+`
    uniform float uTime,uMorph,uBurst,uPx;uniform vec2 uMouse;
    attribute vec3 aTerrain;attribute float aRnd;varying float vGlow;varying float vA;
    void main(){
      vec3 s=position;
      float n=snoise(s*.55+vec3(uTime*.12));
      s*=1.+n*.22+uBurst*aRnd*1.5;
      // rotation lente + influence souris
      float a=uTime*.06+uMouse.x*.6;mat2 R=mat2(cos(a),-sin(a),sin(a),cos(a));s.xz=R*s.xz;
      float b=uMouse.y*.4;mat2 R2=mat2(cos(b),-sin(b),sin(b),cos(b));s.yz=R2*s.yz;
      vec3 t=aTerrain;
      float w=snoise(vec3(t.x*.18,t.z*.18-uTime*.15,uTime*.05));
      t.y+=w*1.4+sin(t.x*.5+uTime*.4)*.15;
      float m=smoothstep(0.,1.,clamp(uMorph*1.2-aRnd*.2,0.,1.));
      vec3 p=mix(s,t,m);
      vec4 mv=modelViewMatrix*vec4(p,1.);
      gl_Position=projectionMatrix*mv;
      float size=mix(1.6,1.3,m)+aRnd*1.6;
      gl_PointSize=size*uPx*(7./-mv.z);
      vGlow=mix(n*.5+.5,w*.5+.5,m);
      vA=mix(1.,smoothstep(14.,3.,-mv.z),m);
    }`,
    fragmentShader:`uniform vec3 uEmber,uBone;varying float vGlow;varying float vA;
    void main(){vec2 c=gl_PointCoord-.5;float d=length(c);if(d>.5)discard;
      float alpha=smoothstep(.5,0.,d)*vA;
      vec3 col=mix(uEmber*.65,mix(uEmber,uBone,.55),pow(vGlow,2.2));
      gl_FragColor=vec4(col,alpha*.75);}`
  });
  const points=new THREE.Points(geo,mat);
  points.position.set(0,.35,-1.5);
  scene.add(points);

  function size(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
    points.position.x=0; points.scale.setScalar(w<760?.72:1);}
  size();addEventListener('resize',size);

  let target=0,morph=0,mx=0,my=0,tmx=0,tmy=0,burst=0,tb=0;
  addEventListener('pointermove',e=>{tmx=e.clientX/innerWidth-.5;tmy=e.clientY/innerHeight-.5},{passive:true});
  window.__world={scroll:v=>{target=Math.min(1,Math.max(0,v*.9))},burst:()=>{tb=1;burst=1.2}};
  window.__world.scroll(scrollY/innerHeight);
  let visible=true;document.addEventListener('visibilitychange',()=>visible=!document.hidden);
  const clock=new THREE.Clock();
  function tick(){
    const t=clock.getElapsedTime();
    morph+=(target-morph)*.05; mx+=(tmx-mx)*.04; my+=(tmy-my)*.04;
    burst+=(0-burst)*.04;
    uniforms.uTime.value=reduced?0:t; uniforms.uMorph.value=morph; uniforms.uMouse.value.set(mx,my); uniforms.uBurst.value=burst;
    camera.position.y=morph*1.1; camera.lookAt(0,-morph*1.4,-3);
    if(visible)renderer.render(scene,camera);
    if(!reduced)requestAnimationFrame(tick);
  }
  tick();
}
