/**
 * muerzy.com — React 组件中使用 GSAP 动画示例
 *
 * 在 Next.js / React 项目中集成动画的最佳实践
 */

"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initAllAnimations } from "./index";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ─── 方式 1：useGSAP 一键初始化（推荐） ───

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      initAllAnimations(containerRef.current);
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="animation-root">
      {children}
    </div>
  );
}

// ─── 方式 2：独立 Hero 组件 ───

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

      tl.from(".hero-title", { y: 80, opacity: 0, duration: 0.8 })
        .from(".hero-subtitle", { y: 40, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(".hero-cta", { scale: 0, stagger: 0.15, duration: 0.5, ease: "back.out(1.7)" }, "-=0.2");

      // 浮动装饰
      gsap.utils.toArray<HTMLElement>(".hero-float").forEach((el, i) => {
        gsap.to(el, {
          y: `+=${15 + i * 5}`,
          rotation: (i % 2 === 0 ? 3 : -3),
          duration: 2.5 + i * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { scope: heroRef }
  );

  return (
    <section ref={heroRef} className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 粒子背景层 */}
      <div className="particles-bg absolute inset-0 pointer-events-none" />

      {/* 内容 */}
      <div className="hero-content text-center z-10">
        <h1 className="hero-title text-6xl font-bold text-white mb-4">Muerzy</h1>
        <p className="hero-subtitle text-xl text-gray-400 mb-8">
          Full-Stack · Game Dev · Web3 · AI Educator
        </p>
        <div className="flex gap-4 justify-center">
          <a href="#projects" className="hero-cta magnetic-target px-6 py-3 bg-[#58a6ff] rounded-lg text-black font-semibold">
            View Projects
          </a>
          <a href="#contact" className="hero-cta magnetic-target px-6 py-3 border border-[#58a6ff] rounded-lg text-[#58a6ff]">
            Contact Me
          </a>
        </div>
      </div>

      {/* 浮动装饰 */}
      <div className="hero-float absolute top-20 left-20 w-3 h-3 bg-[#58a6ff] rounded-full opacity-40" />
      <div className="hero-float absolute top-40 right-32 w-4 h-4 bg-purple-500 rounded-full opacity-30" />
      <div className="hero-float absolute bottom-32 left-40 w-2 h-2 bg-[#58a6ff] rounded-full opacity-50" />
    </section>
  );
}

// ─── 方式 3：技能图标波浪入场 ───

const SKILLS = [
  "C", "C++", "Rust", "Go", "Python", "TypeScript",
  "React", "Vue", "Next.js", "Unity", "Unreal", "Blender",
];

export function SkillsSection() {
  const skillsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.batch(".skill-icon", {
        interval: 0.1,
        batchMax: 6,
        onEnter: (batch) => {
          gsap.from(batch, {
            scale: 0,
            rotation: () => (Math.random() - 0.5) * 60,
            opacity: 0,
            stagger: { each: 0.06, from: "random" },
            duration: 0.5,
            ease: "back.out(1.7)",
          });
        },
        start: "top 90%",
        once: true,
      });
    },
    { scope: skillsRef }
  );

  return (
    <section ref={skillsRef} className="py-20 px-8">
      <h2 className="section-title text-4xl font-bold text-center mb-12">Tech Stack</h2>
      <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
        {SKILLS.map((skill) => (
          <div key={skill} className="skill-icon px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-[#c9d1d9]">
            {skill}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 方式 4：项目卡片 3D Tilt + 交错入场 ───

const PROJECTS = [
  { name: "sbit", desc: "Open source project" },
  { name: "plico", desc: "Open source project" },
  { name: "ztools-plugin-plain-text", desc: "Open source plugin" },
];

export function ProjectsSection() {
  const projectsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 3D tilt
      const cards = gsap.utils.toArray<HTMLElement>(".tilt-card");
      cards.forEach((card) => {
        card.style.transformStyle = "preserve-3d";

        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          gsap.to(card, {
            rotateX: (0.5 - y) * 15,
            rotateY: (x - 0.5) * 15,
            duration: 0.3,
            ease: "power1.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power3.inOut" });
        });
      });
    },
    { scope: projectsRef }
  );

  return (
    <section ref={projectsRef} className="py-20 px-8">
      <h2 className="section-title text-4xl font-bold text-center mb-12">Featured Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {PROJECTS.map((project) => (
          <div
            key={project.name}
            className="tilt-card project-card p-6 bg-[#161b22] border border-[#30363d] rounded-xl cursor-pointer hover:border-[#58a6ff] transition-colors"
            style={{ perspective: "1000px" }}
          >
            <div className="card-glare absolute inset-0 rounded-xl pointer-events-none" />
            <h3 className="text-xl font-semibold text-[#58a6ff] mb-2">{project.name}</h3>
            <p className="text-[#8b949e]">{project.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
