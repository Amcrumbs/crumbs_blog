"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle, Vec2 } from "ogl";

const vertexShader = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointer;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;

  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.02;
    amplitude *= 0.52;
  }

  return value;
}

void main() {
  vec2 uv = vUv;
  vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
  vec2 centered = (uv - 0.5) * aspect;
  vec2 pointer = (uPointer - 0.5) * aspect;
  float time = uTime * 0.12;

  float flow = fbm(centered * 3.2 + vec2(time, -time * 0.7));
  float ripple = sin((centered.x + centered.y) * 7.0 + time * 8.0) * 0.5 + 0.5;
  float pointerGlow = exp(-6.0 * distance(centered, pointer));
  float band = smoothstep(0.22, 0.95, flow * 0.72 + ripple * 0.28);

  vec3 base = vec3(0.02, 0.02, 0.03);
  vec3 wave = vec3(0.18, 0.18, 0.2) * band;
  vec3 glow = vec3(0.22, 0.22, 0.24) * pointerGlow * 0.55;
  float vignette = smoothstep(1.18, 0.18, length(centered));

  vec3 color = base + wave + glow;
  color *= vignette;

  gl_FragColor = vec4(color, 0.92);
}
`;

export function HomeProfileShowcaseBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined" || !window.WebGLRenderingContext) {
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.className = "home-profile-showcase-canvas";
    container.appendChild(canvas);

    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      canvas,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;

    gl.clearColor(0, 0, 0, 0);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2(1, 1) },
        uPointer: { value: new Vec2(0.5, 0.45) },
      },
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height);
      program.uniforms.uResolution.value.set(width, height);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      program.uniforms.uPointer.value.set(x, y);
    };

    const handlePointerLeave = () => {
      program.uniforms.uPointer.value.set(0.5, 0.45);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);
    resize();

    let frameId = 0;

    const render = (time: number) => {
      program.uniforms.uTime.value = time * 0.001;
      renderer.render({ scene: mesh });
      frameId = window.requestAnimationFrame(render);
    };

    frameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      program.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext?.();
      canvas.remove();
    };
  }, []);

  return <div ref={containerRef} aria-hidden="true" className="home-profile-showcase-background" />;
}
