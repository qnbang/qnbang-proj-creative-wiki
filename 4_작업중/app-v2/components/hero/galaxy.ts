// 원본 이식: docs/research/beautified/153s5cp_0jwcv.js 11089~11378행 — r4(색 정규화 GLSL)·r5(파티클 우주)·은하 머티리얼/조립
import * as THREE from "three";

/** 원본 r4 — 오버브라이트 색(322,324,334 등)을 셰이더에서 /255로 정규화 */
const NORMALIZE_COLOR_CHUNK = `
    vec3 normalizeColor(vec3 color) {
        return vec3(color.r/255., color.g/255., color.b/255.);
    }
`;

export interface GalaxyMaterial {
  instance: THREE.MeshPhysicalMaterial;
  render: (time: number) => void;
  shader: { value: THREE.Shader | null };
}

export interface Galaxy {
  mesh: THREE.Group;
  render: (time: number) => void;
  shader: { value: THREE.Shader | null };
  startRender: () => void;
  stopRender: () => void;
  dispose: () => void;
}

/** 원본 11249~11359행 — MeshPhysicalMaterial + onBeforeCompile 셰이더 주입 */
function createGalaxyMaterial(): GalaxyMaterial {
  const instance = new THREE.MeshPhysicalMaterial();
  instance.roughness = 0.4;
  instance.metalness = 0.4;
  instance.transparent = true;
  instance.depthTest = false;
  instance.toneMapped = false;

  const shader: { value: THREE.Shader | null } = { value: null };

  instance.onBeforeCompile = (compiled) => {
    compiled.uniforms.iTime = { value: 0 };
    compiled.uniforms.resolution = {
      value: { x: window.innerWidth, y: window.innerHeight },
    };
    compiled.uniforms.baseColor = { value: { r: 0, g: 0.5, b: 0.2 } };
    compiled.uniforms.universeIn = { value: 0 };
    compiled.uniforms.universeOut = { value: 0 };
    compiled.uniforms.uCursor = { value: { x: 10, y: 10 } };
    compiled.uniforms.uAspect = { value: 1 };

    compiled.vertexShader =
      `
            uniform float iTime;
            uniform float universeIn;
            uniform vec2 uCursor;
            uniform float uAspect;

            varying vec2 vUv;
            varying vec3 vPosition;

            attribute float size;
            attribute float used;
            attribute vec3 color;

            varying float vUsed;
            varying vec3 vColor;

        ` +
      compiled.vertexShader.replace(
        "void main() {",
        `
            void main() {
                vec3 newPosition = position;
                vUv = uv;
                vNormal = normal;
                vPosition = newPosition;
                vUsed = used;
                vColor = color;
        `,
      );
    compiled.vertexShader = compiled.vertexShader.replace(
      "#include <fog_vertex>",
      `
            #include <fog_vertex>
            gl_PointSize = size;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

            // Cursor repulsion — push points away from the pointer in a small
            // screen-space radius.
            vec2 ndc = gl_Position.xy / gl_Position.w;
            vec2 cd = ndc - uCursor;
            vec2 cda = vec2(cd.x * uAspect, cd.y);
            float cdist = length(cda);
            float crad = 0.08;
            if (cdist < crad) {
                float push = pow(1.0 - cdist / crad, 2.0);
                gl_Position.xy += normalize(cd + vec2(0.0001)) * push * 0.14 * gl_Position.w;
            }
        `,
    );
    compiled.fragmentShader =
      `
            uniform float iTime;
            uniform vec3 baseColor;
            uniform float universeIn;
            uniform float universeOut;
            varying vec2 vUv;
            varying vec3 vPosition;
            varying float vUsed;
            varying vec3 vColor;

            ${NORMALIZE_COLOR_CHUNK}

        ` +
      compiled.fragmentShader.replace(
        "void main() {",
        `
            void main() {
        `,
      );
    compiled.fragmentShader = compiled.fragmentShader.replace(
      "#include <dithering_fragment>",
      `
            #include <dithering_fragment>

            vec2 pointUV = gl_PointCoord * 2.0 - 1.0;
            float d = length(pointUV);
            if (d >= 1.0) { discard; }

            float inAlpha = clamp((universeIn - .5) * 4., 0., 1.);
            float outAlpha = clamp((1. - (universeOut - .5) * 2.), 0., 1.);

            vec3 color = normalizeColor(vColor);

            // Fake bloom — a bright core blooming toward white, plus a soft halo.
            float core = 1.0 - smoothstep(0.0, 0.32, d);
            float halo = pow(1.0 - smoothstep(0.0, 1.0, d), 2.0);
            vec3 glow = color + vec3(core * 0.7);
            float alpha = max(core, halo * 0.55);

            gl_FragColor = vec4(glow, vUsed * inAlpha * outAlpha * alpha);
        `,
    );

    shader.value = compiled;
  };

  return {
    instance,
    render: (time) => {
      if (shader.value) shader.value.uniforms.iTime.value = time;
    },
    shader,
  };
}

interface PointsUniverse {
  points: THREE.Points;
  render: (time: number) => void;
  startRender: () => void;
  stopRender: () => void;
  dispose: () => void;
}

/**
 * 원본 r5(11095~11217행) — 파티클 우주 하나.
 * 원본 배열 매핑: c=sizes, u=basePositions, d=currentPositions, p=unusedSeeds(잔재),
 * f=used, m=unusedDrift(잔재), g=angles, _=radii, v=velocities, x=growing, M=colors, y=running, E=spawnAngle
 */
function createPointsUniverse({ material }: { material: GalaxyMaterial }): PointsUniverse {
  const geometry = new THREE.BufferGeometry();
  const width = window.innerWidth;
  const { universeDensity, universeInitialRadius, universeMinPointSize, universeMaxPointSize } =
    width <= 576
      ? { universeDensity: 5000, universeInitialRadius: 2.5, universeMinPointSize: 0.1, universeMaxPointSize: 4 }
      : width <= 1440
        ? { universeDensity: 5000, universeInitialRadius: 2.5, universeMinPointSize: 0.5, universeMaxPointSize: 8 }
        : { universeDensity: 10000, universeInitialRadius: 2.5, universeMinPointSize: 0.5, universeMaxPointSize: 8 };

  const palette = [
    { r: 322, g: 324, b: 334 },
    { r: 202, g: 204, b: 214 },
    { r: 118, g: 120, b: 130 },
  ];

  const sizes: number[] = [];
  const basePositions: number[] = [];
  const currentPositions: number[] = [];
  const unusedSeeds: number[] = []; // 원본 p — 계산만 하고 읽지 않는 잔재(그대로 유지)
  const usedInit: number[] = [];
  const unusedDrift: number[] = []; // 원본 m — 계산만 하고 읽지 않는 잔재(그대로 유지)
  const angles: number[] = [];
  const radii: number[] = [];
  const velocities: number[] = [];
  const growing: boolean[] = [];
  const colors: number[] = [];
  const running = { value: false };

  for (let i = 0; i < universeDensity; i++) {
    // 구면 균일 샘플 × 반경 pow(.4*rand, 1), 30% 확률로 rand×4 → 외곽 희소
    const { x, y, z } = (() => {
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const sx = Math.sin(phi) * Math.cos(theta);
      const sy = Math.sin(phi) * Math.sin(theta);
      const sz = Math.cos(phi);
      let a = Math.random();
      if (Math.random() < 0.3) a *= 4;
      const radius = Math.pow(0.4 * a, 1);
      return { x: sx * radius, y: sy * radius, z: sz * radius };
    })();
    basePositions.push(x, y, z);
    currentPositions.push(x, y, z);
    sizes.push(universeMinPointSize + Math.random() * (universeMaxPointSize - universeMinPointSize));
    unusedSeeds.push(Math.pow(0.9 * Math.random() + 0.1, 0.9));
    usedInit.push(0);
    angles.push(0);
    radii.push(0);
    velocities.push(0.012);
    growing.push(false);
    unusedDrift.push(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    // 계단식 가중(1/t) 랜덤 색 선택: palette[2]≈1/3, palette[1]≈1/6, palette[0]≈1/2
    const picked = (() => {
      const roll = Math.random();
      for (let t = palette.length; t > 1; t--) {
        if (roll < 1 / t) return palette[t - 1];
      }
      return palette[0];
    })();
    colors.push(picked.r, picked.g, picked.b);
  }

  const positionAttribute = new THREE.Float32BufferAttribute(basePositions, 3);
  const sizeAttribute = new THREE.Float32BufferAttribute(sizes, 1);
  const usedAttribute = new THREE.Float32BufferAttribute(usedInit, 1);
  const colorAttribute = new THREE.Float32BufferAttribute(colors, 3);
  geometry.setAttribute("position", positionAttribute);
  geometry.setAttribute("size", sizeAttribute);
  geometry.setAttribute("used", usedAttribute);
  geometry.setAttribute("color", colorAttribute);

  const points = new THREE.Points(geometry, material.instance);
  points.visible = false;

  const spawnAngle = { value: 0 }; // 원본 E

  return {
    points,
    render: (time) => {
      if (!running.value) return;
      const positions = positionAttribute.array;
      const used = usedAttribute.array;
      material.render(time);
      const center = new THREE.Vector3(universeInitialRadius, 0, 0);
      let activated = 0;
      spawnAngle.value += 0.02;
      for (let e = 0; e < basePositions.length; e += 3) {
        const p = e / 3;
        // xz 평면에서 (universeInitialRadius, 0, 0) 기준 거리 — 나선의 반경으로 쓰임
        const dist = new THREE.Vector3(basePositions[e], 0, basePositions[e + 2]).sub(center).length();
        // 1) 활성화 — 미사용 포인트를 프레임당 최대 20개, 현재 나선각(E) 위치에 배치
        if (used[p] === 0 && activated < 20) {
          const px = Math.cos(spawnAngle.value) * dist * 0.8;
          const pz = Math.sin(spawnAngle.value) * dist;
          currentPositions[e] = positions[e] = px;
          currentPositions[e + 1] = positions[e + 1] = basePositions[e + 1];
          currentPositions[e + 2] = positions[e + 2] = pz;
          activated++;
          used[p] = 1e-4;
          angles[p] = spawnAngle.value;
          radii[p] = dist;
          growing[p] = true;
          velocities[p] = 0.012;
        }
        // 2) 알파 상승(+.01, 최대 1) — 1 도달 시 성장 종료
        if (growing[p]) {
          used[p] = Math.min(used[p] + 0.01, 1);
          if (used[p] === 1) growing[p] = false;
        }
        // 3) 반경 팽창(v 감속, 최소 .002)으로 바깥으로 감김 + 성장 끝나면 알파 감쇠(−.003) 명멸
        if (used[p] > 0) {
          radii[p] += velocities[p];
          velocities[p] = Math.max(velocities[p] - 2e-5, 0.002);
          currentPositions[e] = positions[e] = Math.cos(angles[p]) * radii[p] * 0.8;
          currentPositions[e + 1] = positions[e + 1] = basePositions[e + 1];
          currentPositions[e + 2] = positions[e + 2] = Math.sin(angles[p]) * radii[p];
          if (!growing[p]) used[p] = Math.max(used[p] - 0.003, 0);
        }
      }
      positionAttribute.needsUpdate = true;
      usedAttribute.needsUpdate = true;
    },
    startRender: () => {
      running.value = true;
      points.visible = true;
    },
    stopRender: () => {
      spawnAngle.value = 0;
      const positions = positionAttribute.array;
      const used = usedAttribute.array;
      for (let e = 0; e < basePositions.length; e += 3) {
        used[e / 3] = 0;
        growing[e / 3] = false;
        positions[e] = basePositions[e];
        positions[e + 1] = basePositions[e + 1];
        positions[e + 2] = basePositions[e + 2];
      }
      positionAttribute.needsUpdate = true;
      usedAttribute.needsUpdate = true;
      running.value = false;
      points.visible = false;
    },
    dispose: () => {
      geometry.dispose();
    },
  };
}

/** 원본 11359~11378행 — 우주 2개(두 번째 rotation.y=π)를 Group으로 조립, rotation(1,-1.2,.5) */
export function createGalaxy(): Galaxy {
  const material = createGalaxyMaterial();
  const first = createPointsUniverse({ material });
  const second = createPointsUniverse({ material });
  const mesh = new THREE.Group();
  mesh.add(first.points);
  mesh.add(second.points);
  second.points.rotation.y = Math.PI;
  mesh.rotation.set(1, -1.2, 0.5);
  return {
    mesh,
    render: (time) => {
      first.render(time);
      second.render(time);
    },
    shader: material.shader,
    startRender: () => {
      first.startRender();
      second.startRender();
    },
    stopRender: () => {
      first.stopRender();
      second.stopRender();
    },
    dispose: () => {
      first.dispose();
      second.dispose();
      material.instance.dispose();
    },
  };
}
