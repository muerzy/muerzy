/**
 * muerzy.com GSAP 动画系统
 *
 * 基于 GSAP + ScrollTrigger + SplitText 打造沉浸式个人网站动效
 * 适用于 React + Next.js 项目，使用 useGSAP hook 管理生命周期
 *
 * 安装: npm install gsap @gsap/react
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin);

// ─── 主题色彩 ───
const THEME = {
  primary: "#58a6ff",
  accent: "#1a1a2e",
  bg: "#0d1117",
  text: "#c9d1d9",
};

// ─── 默认缓动 ───
const EASE = {
  smooth: "power3.inOut",
  bounce: "back.out(1.7)",
  snap: "power4.out",
  elastic: "elastic.out(1, 0.3)",
  gentle: "power1.out",
};

// ─── 工具函数 ───
function getRandomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// ═══════════════════════════════════════════════
// 1. HERO 入场动画 — Timeline 序列
// ═══════════════════════════════════════════════

export function heroEntrance(container: HTMLElement) {
  const tl = gsap.timeline({
    defaults: { ease: EASE.smooth, duration: 0.8 },
  });

  // SplitText 拆分标题，逐字符入场
  const titleSplit = SplitText.create(".hero-title", {
    type: "chars, words",
    mask: "chars",
    onSplit(self) {
      return gsap.from(self.chars, {
        opacity: 0,
        y: 80,
        rotationX: -90,
        stagger: 0.03,
        duration: 0.6,
        ease: EASE.snap,
      });
    },
  });

  // 副标题从下方滑入
  tl.from(".hero-subtitle", {
    opacity: 0,
    y: 40,
    duration: 0.6,
  }, "-=0.3");

  // 打字效果替换文字
  tl.from(".hero-tagline", {
    opacity: 0,
    y: 20,
    duration: 0.5,
  }, "-=0.2");

  // CTA 按钮弹入
  tl.from(".hero-cta", {
    scale: 0,
    rotation: -10,
    ease: EASE.bounce,
    duration: 0.6,
    stagger: 0.15,
  }, "-=0.3");

  // 装饰元素漂浮
  gsap.utils.toArray<HTMLElement>(".hero-float").forEach((el) => {
    gsap.to(el, {
      y: `+=${getRandomFloat(10, 30)}`,
      rotation: getRandomFloat(-5, 5),
      duration: getRandomFloat(2, 4),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: getRandomFloat(0, 2),
    });
  });

  return { timeline: tl, titleSplit };
}

// ═══════════════════════════════════════════════
// 2. 磁性光标效果
// ═══════════════════════════════════════════════

export function magneticCursor(container: HTMLElement) {
  const cursor = container.querySelector(".magnetic-cursor") as HTMLElement;
  const targets = container.querySelectorAll<HTMLElement>(".magnetic-target");

  const xTo = gsap.quickTo(cursor, "x", { duration: 0.3, ease: EASE.gentle });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.3, ease: EASE.gentle });

  container.addEventListener("mousemove", (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });

  targets.forEach((target) => {
    const xShift = gsap.quickTo(target, "x", { duration: 0.4, ease: EASE.gentle });
    const yShift = gsap.quickTo(target, "y", { duration: 0.4, ease: EASE.gentle });

    target.addEventListener("mousemove", (e) => {
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      xShift(x * 0.3);
      yShift(y * 0.3);
    });

    target.addEventListener("mouseleave", () => {
      xShift(0);
      yShift(0);
    });
  });

  return () => {
    xTo(0);
    yTo(0);
  };
}

// ═══════════════════════════════════════════════
// 3. 3D 卡片倾斜效果
// ═══════════════════════════════════════════════

export function card3DTilt(cards: HTMLElement[]) {
  cards.forEach((card) => {
    card.style.transformStyle = "preserve-3d";
    card.style.perspective = "1000px";

    const q = gsap.utils.selector(card);

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * 20;
      const rotateY = (x - 0.5) * 20;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.4,
        ease: EASE.gentle,
      });

      // 高光跟随
      gsap.to(q(".card-glare"), {
        opacity: 0.15,
        background: `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(88,166,255,0.3), transparent 60%)`,
        duration: 0.3,
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: EASE.smooth });
      gsap.to(q(".card-glare"), { opacity: 0, duration: 0.4 });
    });
  });
}

// ═══════════════════════════════════════════════
// 4. ScrollTrigger 滚动动画
// ═══════════════════════════════════════════════

export function scrollAnimations() {
  // Section 标题划入
  gsap.utils.toArray<HTMLElement>(".section-title").forEach((title) => {
    const split = SplitText.create(title, {
      type: "words",
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.words, {
          y: 60,
          opacity: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: EASE.snap,
          scrollTrigger: {
            trigger: title,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      },
    });
    return split;
  });

  // 技能图标波浪入场
  ScrollTrigger.batch(".skill-icon", {
    interval: 0.1,
    batchMax: 6,
    onEnter: (batch) => {
      gsap.from(batch, {
        scale: 0,
        rotation: getRandomFloat(-30, 30),
        opacity: 0,
        stagger: { each: 0.06, from: "random" },
        duration: 0.5,
        ease: EASE.bounce,
      });
    },
    start: "top 90%",
    once: true,
  });

  // 项目卡片交错入场
  ScrollTrigger.batch(".project-card", {
    interval: 0.15,
    batchMax: 3,
    onEnter: (batch) => {
      gsap.from(batch, {
        y: 100,
        opacity: 0,
        scale: 0.9,
        stagger: 0.12,
        duration: 0.7,
        ease: EASE.smooth,
      });
    },
    start: "top 85%",
    once: true,
  });

  // 数字统计计数器
  gsap.utils.toArray<HTMLElement>(".stat-number").forEach((el) => {
    const target = parseInt(el.dataset.value || "0", 10);
    const counter = { value: 0 };

    gsap.to(counter, {
      value: target,
      duration: 2,
      ease: EASE.smooth,
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        once: true,
      },
      onUpdate() {
        el.textContent = Math.floor(counter.value).toLocaleString();
      },
    });
  });
}

// ═══════════════════════════════════════════════
// 5. 视差效果
// ═══════════════════════════════════════════════

export function parallaxSections() {
  gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
    const speed = parseFloat(el.dataset.speed || "0.5");

    gsap.to(el, {
      yPercent: speed * 30,
      ease: "none",
      scrollTrigger: {
        trigger: el.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  });

  // Hero 背景视差
  gsap.to(".hero-bg", {
    yPercent: 30,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}

// ═══════════════════════════════════════════════
// 6. 粒子/星空背景
// ═══════════════════════════════════════════════

export function particleBackground(container: HTMLElement, count = 50) {
  const particles: HTMLElement[] = [];

  for (let i = 0; i < count; i++) {
    const dot = document.createElement("div");
    dot.className = "particle";
    dot.style.cssText = `
      position: absolute;
      width: ${getRandomFloat(2, 5)}px;
      height: ${getRandomFloat(2, 5)}px;
      background: ${THEME.primary};
      border-radius: 50%;
      opacity: ${getRandomFloat(0.1, 0.5)};
      left: ${getRandomFloat(0, 100)}%;
      top: ${getRandomFloat(0, 100)}%;
    `;
    container.appendChild(dot);
    particles.push(dot);
  }

  particles.forEach((p) => {
    gsap.to(p, {
      y: `+=${getRandomFloat(-40, 40)}`,
      x: `+=${getRandomFloat(-20, 20)}`,
      opacity: getRandomFloat(0.1, 0.6),
      duration: getRandomFloat(3, 8),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });

  return () => particles.forEach((p) => p.remove());
}

// ═══════════════════════════════════════════════
// 7. 导航栏平滑滚动
// ═══════════════════════════════════════════════

export function smoothNavScroll() {
  const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href")!);
      if (target) {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: target, offsetY: 80 },
          ease: EASE.smooth,
        });
      }
    });
  });

  // 滚动时导航栏背景变化
  ScrollTrigger.create({
    start: "top -80",
    onUpdate: (self) => {
      const nav = document.querySelector(".navbar");
      if (!nav) return;
      if (self.direction === 1 && self.scroll() > 100) {
        gsap.to(nav, { y: 0, opacity: 1, backdropFilter: "blur(12px)", duration: 0.3 });
      }
    },
  });
}

// ═══════════════════════════════════════════════
// 8. 文字扰乱效果（ScrambleText）
// ═══════════════════════════════════════════════

export function textScramble(elements: HTMLElement[]) {
  elements.forEach((el) => {
    const original = el.textContent || "";

    el.addEventListener("mouseenter", () => {
      gsap.to(el, {
        duration: 0.8,
        scrambleText: {
          text: original,
          chars: "01<>{}[]",
          revealDelay: 0.3,
          speed: 0.4,
        },
        ease: "none",
      });
    });
  });
}

// ═══════════════════════════════════════════════
// 9. 水平滚动展示（项目/作品集）
// ═══════════════════════════════════════════════

export function horizontalScroll(section: HTMLElement) {
  const panels = section.querySelector<HTMLElement>(".horizontal-panels");
  if (!panels) return;

  const scrollWidth = panels.scrollWidth - window.innerWidth;

  gsap.to(panels, {
    x: -scrollWidth,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      pin: true,
      scrub: 1,
      end: () => `+=${scrollWidth}`,
    },
  });
}

// ═══════════════════════════════════════════════
// 10. 初始化（在 useGSAP 或 useEffect 中调用）
// ═══════════════════════════════════════════════

export function initAllAnimations(container: HTMLElement) {
  const ctx = gsap.context(() => {
    heroEntrance(container);
    magneticCursor(container);
    card3DTilt(gsap.utils.toArray<HTMLElement>(".tilt-card"));
    scrollAnimations();
    parallaxSections();
    particleBackground(container.querySelector(".particles-bg")!, 60);
    smoothNavScroll();
    textScramble(gsap.utils.toArray<HTMLElement>(".scramble-text"));
    horizontalScroll(container.querySelector(".horizontal-section")!);
  }, container);

  return () => ctx.revert();
}
