// Procedural GLSL materials: noise library + sky, solar surface, plasma,
// liquids (lava / water / acid / swamp / rift), gas-giant cloud seas,
// and the chase-level hazard wall. All animated through a shared `t` uniform.
import * as THREE from 'three';

export const NOISE = /* glsl */`
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){ float a=0.5, s=0.0; for(int i=0;i<5;i++){ s+=a*snoise(p); p=p*2.03+vec3(1.7,9.2,3.1); a*=0.5; } return s; }
float fbm3(vec3 p){ float a=0.5, s=0.0; for(int i=0;i<3;i++){ s+=a*snoise(p); p=p*2.03+vec3(1.7,9.2,3.1); a*=0.5; } return s; }
vec2 hash22(vec2 p){ p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))); return fract(sin(p)*43758.5453); }
float hash13(vec3 p){ p=fract(p*0.1031); p+=dot(p,p.zyx+31.32); return fract((p.x+p.y)*p.z); }
// animated 2D cellular noise: returns (F1, F2)
vec2 worley(vec2 p, float t){
  vec2 n=floor(p), f=fract(p); float f1=8.0, f2=8.0;
  for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){
    vec2 g=vec2(float(i),float(j)); vec2 o=hash22(n+g); o=0.5+0.45*sin(t+6.2831*o);
    float d=length(g+o-f);
    if(d<f1){ f2=f1; f1=d; } else if(d<f2){ f2=d; }
  }
  return vec2(f1,f2);
}
`;

const FOG_V = '#include <fog_pars_vertex>';
const FOG_F = '#include <fog_pars_fragment>';

const timeUniforms = new Set();
export function tickShaders(t) { for (const u of timeUniforms) u.value = t; }
function timed(uniforms) { timeUniforms.add(uniforms.t); return uniforms; }
export function releaseShader(mat) { if (mat && mat.uniforms && mat.uniforms.t) timeUniforms.delete(mat.uniforms.t); }

const worldVert = /* glsl */`
${FOG_V}
varying vec3 vW; varying vec3 vN; varying vec3 vView; varying vec2 vUv;
void main(){
  vec4 wp = modelMatrix*vec4(position,1.0);
  vW = wp.xyz; vUv = uv;
  vN = normalize(mat3(modelMatrix)*normal);
  vView = cameraPosition - wp.xyz;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`;

// ---------------------------------------------------------------- sky
export function skyMaterial(o) {
  const u = timed({
    t: { value: 0 },
    top: { value: new THREE.Color(o.top) }, horizon: { value: new THREE.Color(o.horizon) }, ground: { value: new THREE.Color(o.ground ?? o.horizon) },
    sunDir: { value: new THREE.Vector3(...(o.sunDir || [-0.3, 0.35, -1])).normalize() },
    sunColor: { value: new THREE.Color(o.sunColor ?? 0xfff2d0) }, sunSize: { value: o.sunSize ?? 0.02 }, sunHalo: { value: o.sunHalo ?? 1 },
    stars: { value: o.stars ?? 0 },
    nebA: { value: new THREE.Color(o.nebA ?? 0x4020a0) }, nebB: { value: new THREE.Color(o.nebB ?? 0xff4080) }, neb: { value: o.neb ?? 0 },
    clouds: { value: o.clouds ?? 0 }, cloudColor: { value: new THREE.Color(o.cloudColor ?? 0xffffff) }, cloudScale: { value: o.cloudScale ?? 1.2 },
    corona: { value: o.corona ?? 0 }, aurora: { value: o.aurora ?? 0 },
  });
  return new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false, uniforms: u,
    vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: /* glsl */`
      ${NOISE}
      uniform float t; uniform vec3 top, horizon, ground, sunDir, sunColor, nebA, nebB, cloudColor;
      uniform float sunSize, sunHalo, stars, neb, clouds, cloudScale, corona, aurora;
      varying vec3 vP;
      void main(){
        vec3 d = normalize(vP);
        float h = d.y;
        vec3 col = h > 0.0 ? mix(horizon, top, pow(smoothstep(0.0, 0.75, h), 0.7)) : mix(horizon, ground, smoothstep(0.0, -0.25, h));
        // nebula / milky way
        if (neb > 0.0) {
          float w = fbm3(d*1.6);
          float n = fbm(d*2.6 + w*0.9);
          float band = exp(-pow(dot(d, normalize(vec3(0.35, 0.8, 0.45))), 2.0) * 9.0);
          col += mix(nebA, nebB, smoothstep(-0.4, 0.6, n)) * smoothstep(-0.2, 0.7, n) * neb * (0.45 + band);
        }
        // stars
        if (stars > 0.0) {
          vec3 q = d * 260.0; vec3 id = floor(q); vec3 f = fract(q) - 0.5;
          float m = hash13(id);
          vec3 off = vec3(hash13(id+1.3), hash13(id+7.1), hash13(id+3.7)) - 0.5;
          float s = smoothstep(0.09, 0.0, length(f - off*0.7)) * step(0.965, m);
          float tw = 0.65 + 0.35*sin(t*2.0 + m*90.0);
          col += vec3(0.9,0.95,1.0) * s * tw * stars * smoothstep(-0.05, 0.15, h) * (0.5 + 2.0*fract(m*13.0));
        }
        // sun disk + glow
        float sd = max(dot(d, sunDir), 0.0);
        float disk = smoothstep(cos(sunSize), cos(sunSize*0.85), sd);
        col += sunColor * (disk * 5.0 + sunHalo * (pow(sd, 400.0)*1.2 + pow(sd, 24.0)*0.35 + pow(sd, 4.0)*0.12));
        // corona streamers (when you're standing ON a star)
        if (corona > 0.0) {
          float ang = atan(d.x, d.z);
          float streak = fbm(vec3(ang*5.0, h*1.5, t*0.04)) * 0.5 + 0.5;
          float glow = pow(1.0 - clamp(h, 0.0, 1.0), 5.0);
          col += vec3(1.0, 0.42, 0.08) * glow * (0.5 + streak) * corona;
          col += vec3(1.0, 0.75, 0.35) * pow(1.0 - clamp(h, 0.0, 1.0), 18.0) * corona * 1.5;
        }
        // aurora curtains
        if (aurora > 0.0 && h > 0.0) {
          float a = fbm3(vec3(d.x*3.0, t*0.05, d.z*3.0));
          float curtain = smoothstep(0.15, 0.0, abs(h - 0.35 - a*0.15)) * (0.5 + 0.5*sin(d.x*20.0 + a*8.0 + t*0.3));
          col += mix(vec3(0.1,1.0,0.6), vec3(0.6,0.2,1.0), smoothstep(-0.3,0.3,a)) * curtain * aurora;
        }
        // clouds
        if (clouds > 0.0 && h > -0.02) {
          vec2 uv = d.xz / (h + 0.12) * cloudScale;
          float c = fbm(vec3(uv*0.8 + vec2(t*0.004, 0.0), t*0.01));
          float cov = smoothstep(0.05, 0.55, c) * smoothstep(-0.02, 0.18, h);
          vec3 cc = cloudColor * (0.75 + 0.35*c) + sunColor * pow(sd, 6.0) * 0.4;
          col = mix(col, cc, cov * clouds);
        }
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
}

// ---------------------------------------------------------------- photosphere
export function sunSurfaceMaterial() {
  const u = timed(THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { t: { value: 0 } }]));
  return new THREE.ShaderMaterial({
    fog: true, uniforms: u, vertexShader: worldVert,
    fragmentShader: /* glsl */`
      ${FOG_F}
      ${NOISE}
      uniform float t; varying vec3 vW; varying vec3 vView;
      void main(){
        vec2 p = vW.xz;
        float dist = length(vView);
        vec2 warp = vec2(fbm3(vec3(p*0.03, t*0.05)), fbm3(vec3(p*0.03+7.0, t*0.05)));
        vec2 w = worley(p*1.1 + warp*2.5, t*0.35);
        float gran = 1.0 - smoothstep(0.0, 0.85, w.x);           // bright cell centres
        float lane = smoothstep(0.0, 0.18, w.y - w.x);           // dark intergranular lanes
        float big = fbm3(vec3(p*0.012, t*0.02));
        float spot = smoothstep(0.42, 0.62, fbm3(vec3(p*0.004 + 11.0, t*0.004)));
        float pen = smoothstep(0.3, 0.45, fbm3(vec3(p*0.004 + 11.0, t*0.004)));
        vec3 hot = vec3(1.0, 0.68, 0.26), mid = vec3(0.9, 0.3, 0.03), cool = vec3(0.35, 0.05, 0.0);
        vec3 c = mix(mid, hot, gran) * mix(0.5, 1.0, lane);
        c *= 0.8 + 0.4 * big;
        c = mix(c, c * vec3(0.65, 0.4, 0.25), pen * 0.7);         // penumbra
        c = mix(c, cool * 0.35, spot);                            // umbra
        // far away the granules blur into a smooth bright field
        c = mix(c, vec3(0.95, 0.42, 0.07) * (0.8 + 0.35*big), smoothstep(35.0, 170.0, dist));
        // faculae flicker
        c += vec3(1.0, 0.85, 0.5) * pow(gran, 6.0) * 0.25 * (0.5 + 0.5*sin(t*2.0 + w.x*20.0));
        gl_FragColor = vec4(c * 1.35, 1.0);
        #include <fog_fragment>
      }`,
  });
}

// ---------------------------------------------------------------- plasma prominences
export function plasmaMaterial(hue = 0) {
  const u = timed({ t: { value: 0 }, seed: { value: Math.random() * 100 }, hue: { value: hue } });
  return new THREE.ShaderMaterial({
    uniforms: u, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
    vertexShader: worldVert.replace(FOG_V, '').replace('#include <fog_vertex>', ''),
    fragmentShader: /* glsl */`
      ${NOISE}
      uniform float t, seed, hue; varying vec2 vUv; varying vec3 vN; varying vec3 vView;
      void main(){
        float n = fbm(vec3(vUv.x*10.0 - t*0.35 + seed, vUv.y*3.0, t*0.15 + seed));
        float strands = smoothstep(0.0, 0.7, n + 0.25);
        float fres = pow(1.0 - abs(dot(normalize(vN), normalize(vView))), 1.4);
        float ends = smoothstep(0.0, 0.08, vUv.x) * smoothstep(1.0, 0.92, vUv.x);
        vec3 a = mix(vec3(1.0, 0.25, 0.04), vec3(1.0, 0.1, 0.25), hue);
        vec3 c = mix(a, vec3(1.0, 0.85, 0.45), smoothstep(0.1, 0.8, n));
        float alpha = strands * (0.25 + fres * 0.9) * ends;
        gl_FragColor = vec4(c * 1.7 * alpha, alpha);
      }`,
  });
}

// ---------------------------------------------------------------- liquids & cloud seas
const LIQUID_FRAG = /* glsl */`
  ${FOG_F}
  ${NOISE}
  uniform float t; uniform int mode; uniform vec3 colA, colB, sky, sunCol; uniform vec2 swirl; uniform float swirlR;
  varying vec3 vW; varying vec3 vView;
  float hgt(vec2 p){ return fbm3(vec3(p*0.18, t*0.35)) + 0.5*snoise(vec3(p*0.6, t*0.8)); }
  void main(){
    vec2 p = vW.xz;
    float dist = length(vView);
    vec3 V = normalize(vView);
    vec3 c;
    if (mode == 0) {                      // lava: cooling crust plates over glowing cracks
      vec2 flow = p + vec2(t*0.25, t*0.08);
      vec2 w = worley(flow*0.35 + fbm3(vec3(flow*0.05, t*0.05))*1.2, t*0.2);
      float crack = 1.0 - smoothstep(0.0, 0.16, w.y - w.x);
      float heat = fbm3(vec3(p*0.04, t*0.1))*0.5 + 0.5;
      vec3 crust = vec3(0.09, 0.03, 0.02) * (0.6 + heat);
      c = mix(crust, mix(colA, colB, heat) * 2.2, max(crack, smoothstep(0.55, 0.9, heat)*0.6));
      c = mix(c, colA * 1.2, smoothstep(80.0, 280.0, dist));
    } else if (mode == 1 || mode == 2) {  // water (1) / acid (2): normals from a height field
      float e = 0.35;
      float h0 = hgt(p), hx = hgt(p + vec2(e, 0.0)), hz = hgt(p + vec2(0.0, e));
      vec3 N = normalize(vec3(-(hx - h0) / e * 0.9, 1.0, -(hz - h0) / e * 0.9));
      float fres = 0.04 + 0.96 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
      vec3 R = reflect(-V, N);
      vec3 L = normalize(vec3(-0.3, 0.6, -0.8));
      float spec = pow(max(dot(R, L), 0.0), 120.0);
      vec3 deep = mix(colA, colB, h0*0.5 + 0.5);
      c = mix(deep, sky, fres) + sunCol * spec * 2.5;
      if (mode == 2) {
        vec2 b = worley(p*0.8 + vec2(0.0, t*0.3), t*2.0);
        c += colB * smoothstep(0.12, 0.0, b.x) * 1.5;           // bubbles
        c += colB * 0.25;
      }
    } else if (mode == 3) {               // gas giant cloud sea: domain-warped flowing bands
      vec2 q = p;
      if (swirlR > 0.0) {                 // Great Red Spot vortex
        vec2 d = q - swirl; float r = length(d);
        float a = (1.0 - smoothstep(0.0, swirlR, r)) * 4.0 + t*0.1*(1.0 - smoothstep(0.0, swirlR, r));
        q = swirl + mat2(cos(a), -sin(a), sin(a), cos(a)) * d;
      }
      vec2 warp = vec2(fbm3(vec3(q*0.012, t*0.02)), fbm3(vec3(q*0.012 + 5.2, t*0.02)));
      float bands = sin(q.y*0.05 + warp.x*6.0) * 0.5 + 0.5;
      float detail = fbm(vec3(q.x*0.02 + t*0.15 + warp.y*3.0, q.y*0.06, t*0.03));
      c = mix(colA, colB, bands);
      c = mix(c, sky, smoothstep(0.1, 0.7, detail) * 0.55);
      c *= 0.85 + 0.3*detail;
      if (swirlR > 0.0) c = mix(c, vec3(0.75, 0.25, 0.12), (1.0 - smoothstep(swirlR*0.4, swirlR, length(p - swirl))) * 0.7);
    } else if (mode == 4) {               // swamp: dark water with drifting bioluminescent blooms
      float n = fbm(vec3(p*0.06, t*0.05));
      vec2 w = worley(p*0.25, t*0.5);
      c = colA * (0.6 + 0.4*n) + colB * smoothstep(0.25, 0.0, w.x) * (0.5 + 0.5*sin(t*1.5 + p.x)) * 0.9;
      c += colB * smoothstep(0.35, 0.8, n) * 0.4;
    } else {                              // rift: rising time/energy flood
      float n = fbm(vec3(p*0.08, t*0.4));
      float s = sin(p.x*0.3 + n*6.0 + t*2.0)*0.5 + 0.5;
      c = mix(colA, colB, s) * (1.2 + n);
    }
    gl_FragColor = vec4(c, 1.0);
    #include <fog_fragment>
  }`;

export function liquidMaterial(mode, o = {}) {
  const modes = { lava: 0, water: 1, acid: 2, gas: 3, swamp: 4, rift: 5 };
  const u = timed(THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
    t: { value: 0 }, mode: { value: modes[mode] },
    colA: { value: new THREE.Color(o.a ?? 0xd02800) }, colB: { value: new THREE.Color(o.b ?? 0xffb030) },
    sky: { value: new THREE.Color(o.sky ?? 0x88aacc) }, sunCol: { value: new THREE.Color(o.sun ?? 0xfff2d0) },
    swirl: { value: new THREE.Vector2(...(o.swirl || [0, 0])) }, swirlR: { value: o.swirlR ?? 0 },
  }]));
  return new THREE.ShaderMaterial({ fog: true, uniforms: u, vertexShader: worldVert, fragmentShader: LIQUID_FRAG });
}

// ---------------------------------------------------------------- chaser wall
export function chaserMaterial(a, b) {
  const u = timed({ t: { value: 0 }, colA: { value: new THREE.Color(a) }, colB: { value: new THREE.Color(b) } });
  return new THREE.ShaderMaterial({
    uniforms: u, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
    vertexShader: worldVert.replace(FOG_V, '').replace('#include <fog_vertex>', ''),
    fragmentShader: /* glsl */`
      ${NOISE}
      uniform float t; uniform vec3 colA, colB; varying vec2 vUv; varying vec3 vW;
      void main(){
        float n = fbm3(vec3(vW.x*0.25 - t*1.5, vW.y*0.12 - t*0.6, t*0.4));   // 3 octaves: same look, ~40% cheaper over a big area
        float edge = pow(vUv.x, 3.0);                          // brightest at the leading edge
        float tongues = smoothstep(0.0, 0.6, n + vUv.x - 0.5);
        vec3 c = mix(colA, colB, smoothstep(-0.2, 0.6, n));
        float alpha = clamp(tongues * (0.35 + edge * 1.6), 0.0, 1.0);
        gl_FragColor = vec4(c * 2.2 * alpha, alpha);
      }`,
  });
}

// Generic flickering additive material (spicules, energy columns).
export function flickerMaterial(color) {
  const u = timed({ t: { value: 0 }, col: { value: new THREE.Color(color) }, seed: { value: Math.random() * 50 } });
  return new THREE.ShaderMaterial({
    uniforms: u, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
    vertexShader: worldVert.replace(FOG_V, '').replace('#include <fog_vertex>', ''),
    fragmentShader: /* glsl */`
      ${NOISE}
      uniform float t, seed; uniform vec3 col; varying vec2 vUv; varying vec3 vW;
      void main(){
        float n = snoise(vec3(vW.x*0.5 + seed, vUv.y*4.0 - t*3.0, t*0.7));
        float a = smoothstep(1.0, 0.0, vUv.y) * (0.5 + 0.5*n);
        gl_FragColor = vec4(col * 2.0 * a, a);
      }`,
  });
}

// A star seen from space: 3D granulation, sunspots and limb darkening.
export function starMaterial() {
  const u = timed({ t: { value: 0 } });
  return new THREE.ShaderMaterial({
    uniforms: u, fog: false,
    vertexShader: 'varying vec3 vP; varying vec3 vN; varying vec3 vV; void main(){ vP = position; vec4 wp = modelMatrix*vec4(position,1.0); vN = normalize(mat3(modelMatrix)*normal); vV = cameraPosition - wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp; }',
    fragmentShader: /* glsl */`
      ${NOISE}
      uniform float t; varying vec3 vP; varying vec3 vN; varying vec3 vV;
      void main(){
        vec3 d = normalize(vP);
        float gran = fbm(d*38.0 + vec3(0.0, t*0.05, 0.0));
        float big = fbm3(d*5.0 + t*0.01);
        float spots = smoothstep(0.45, 0.6, fbm3(d*3.0 + 9.0));
        float mu = max(dot(normalize(vN), normalize(vV)), 0.0);
        vec3 c = mix(vec3(1.0, 0.45, 0.05), vec3(1.0, 0.85, 0.45), smoothstep(-0.4, 0.5, gran)) * (0.8 + 0.4*big);
        c = mix(c, vec3(0.3, 0.06, 0.0), spots * 0.85);
        c *= 0.35 + 0.65 * pow(mu, 0.45);            // limb darkening
        c += vec3(1.0, 0.5, 0.1) * pow(1.0 - mu, 3.0) * 0.6;
        gl_FragColor = vec4(c * 1.6, 1.0);
      }`,
  });
}

// Accretion disk around a black hole: hot swirling plasma, white-hot inner edge.
export function accretionMaterial() {
  const u = timed({ t: { value: 0 } });
  return new THREE.ShaderMaterial({
    uniforms: u, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
    vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: /* glsl */`
      ${NOISE}
      uniform float t; varying vec3 vP;
      void main(){
        float r = length(vP.xy);
        float a = atan(vP.y, vP.x);
        // normalised radius 0 (inner) → 1 (outer), from the ring geometry's 1.25R..3.4R span
        float rr = r;
        float swirl = a + t * 0.6 + 6.0 / (0.15 + rr * 0.004);
        float n = fbm(vec3(cos(swirl) * 2.0, sin(swirl) * 2.0, rr * 0.01 + t * 0.05));
        float bands = 0.6 + 0.4 * sin(rr * 0.08 - t * 2.0 + n * 3.0);
        float inner = exp(-pow(rr * 0.0045, 2.0));
        vec3 hot = vec3(1.0, 0.95, 0.85), mid = vec3(1.0, 0.55, 0.15), cool = vec3(0.6, 0.12, 0.25);
        vec3 c = mix(cool, mid, smoothstep(0.2, 0.8, inner + n * 0.3));
        c = mix(c, hot, smoothstep(0.75, 1.0, inner));
        float alpha = clamp((0.35 + 0.65 * n) * bands * (0.4 + inner), 0.0, 1.0);
        gl_FragColor = vec4(c * 1.8 * alpha, alpha);
      }`,
  });
}

// Synthwave neon grid floor (Velocitar): glowing lines scrolling toward you.
export function gridMaterial(a = 0xff3ad8, b = 0x3ad8ff) {
  const u = timed(THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { t: { value: 0 }, colA: { value: new THREE.Color(a) }, colB: { value: new THREE.Color(b) } }]));
  return new THREE.ShaderMaterial({
    fog: true, uniforms: u, vertexShader: worldVert,
    fragmentShader: /* glsl */`
      ${FOG_F}
      uniform float t; uniform vec3 colA, colB; varying vec3 vW; varying vec3 vView;
      void main(){
        vec2 p = vW.xz * 0.25 + vec2(0.0, t * 1.5);
        vec2 g = abs(fract(p - 0.5) - 0.5) / fwidth(p);
        float line = 1.0 - min(min(g.x, g.y), 1.0);
        float dist = length(vView);
        vec3 c = vec3(0.02, 0.0, 0.06) + mix(colA, colB, 0.5 + 0.5 * sin(vW.x * 0.02 + t * 0.3)) * line * 1.8 * (1.0 - smoothstep(60.0, 260.0, dist));
        c += colA * 0.15 * (1.0 - smoothstep(0.0, 300.0, dist));
        gl_FragColor = vec4(c, 1.0);
        #include <fog_fragment>
      }`,
  });
}
