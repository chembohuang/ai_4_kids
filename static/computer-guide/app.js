(() => {
  "use strict";

  /* ---------- Part encyclopedia ---------- */
  const PARTS = {
    case: {
      title: "机箱 Chassis",
      metaphor: "机箱是电脑的「房子」：保护零件、理顺风道，还让你能把显示器、键盘接进来。",
      body: [
        "机箱本身不算「运算零件」，但它决定了散热好不好、能装多长的显卡、好不好升级。",
        "侧透玻璃让你看见内部；前面板常有电源键、USB 口、耳机孔。",
      ],
      facts: [
        ["材质", "钢材 / 铝材 / 钢化玻璃"],
        ["关键接口", "电源、重启、USB、音频"],
        ["选购提示", "先量显卡长度和散热器高度"],
      ],
    },
    motherboard: {
      title: "主板 Motherboard",
      metaphor: "主板是城市的道路与立交桥——所有零件都插在它上面，靠它互通消息。",
      body: [
        "主板上有 CPU 插槽、内存插槽、显卡 PCIe 槽、M.2 硬盘位、芯片组，以及各种接口。",
        "选主板要和 CPU 插座匹配（比如 AMD AM5、Intel LGA1700），还要看能上几条内存、有没有足够的接口。",
      ],
      facts: [
        ["别名", "mobos / 系统板"],
        ["关键总线", "PCIe、SATA、USB"],
        ["小知识", "BIOS/UEFI 固件就住在主板上"],
      ],
    },
    cpu: {
      title: "CPU 中央处理器",
      metaphor: "CPU 是「大脑」或「市长」：负责理解指令、做判断、指挥其他部件。",
      body: [
        "程序再花哨，最终都变成 CPU 能执行的指令。它不停做：取指 → 译码 → 执行。",
        "核心数 ≈ 能同时雇几个工人；频率（GHz）≈ 每个人干活的节奏。缓存则是身边的小抽屉。",
        "常见品牌：Intel、AMD。笔记本里的 CPU 往往和主板焊在一起，不好更换。",
      ],
      facts: [
        ["计量", "核心数 / 线程数 / GHz"],
        ["怕什么", "过热——所以要散热器"],
        ["比喻升级", "换更聪明的市长，整座城更快"],
      ],
    },
    cooler: {
      title: "散热器 Cooler",
      metaphor: "散热器是空调系统：把 CPU（有时还有显卡）的热量带走，防止「中暑降频」。",
      body: [
        "风冷：金属鳍片 + 风扇。水冷：液体把热带到排热排，再由风扇吹走。",
        "温度太高时，CPU 会自动降低速度保护自己，游戏和程序就会变卡。",
      ],
      facts: [
        ["类型", "风冷 / 一体式水冷"],
        ["涂什么", "硅脂帮助导热"],
        ["听声辨位", "风扇狂转常常是在努力散热"],
      ],
    },
    ram: {
      title: "内存 RAM",
      metaphor: "内存是办公桌：正在打开的网页、游戏、文档都摊在这里，关机就收拾干净。",
      body: [
        "RAM（Random Access Memory）读写极快，但断电丢失。和硬盘完全不是一回事。",
        "内存不够时，系统会把一部分数据临时放到硬盘（虚拟内存），速度会明显变慢。",
        "台式机常可插 2～4 条；很多轻薄本内存焊死，不能加。",
      ],
      facts: [
        ["常见容量", "16GB / 32GB"],
        ["速度单位", "MHz / MT/s"],
        ["口诀", "桌子（RAM）≠ 书架（SSD）"],
      ],
    },
    gpu: {
      title: "显卡 / GPU",
      metaphor: "显卡是特效与渲染工厂：负责把画面算漂亮，也擅长大量并行计算（包括 AI）。",
      body: [
        "GPU 有成百上千个小核心，特别适合同时计算很多像素或矩阵。",
        "独立显卡 = GPU 芯片 + 显存（VRAM）+ 供电 + 强力散热，插在主板 PCIe 槽上。",
        "核显够上网和轻度创作；玩 3D 游戏、训练 AI、剪 4K 视频时，独显优势明显。",
      ],
      facts: [
        ["常见品牌", "NVIDIA / AMD / Intel"],
        ["关键指标", "显存容量、带宽、功耗"],
        ["接口", "HDMI / DisplayPort"],
      ],
    },
    ssd: {
      title: "固态硬盘 SSD",
      metaphor: "SSD 是高速图书馆：游戏、系统、作业长期存放在这里，关机也不会丢。",
      body: [
        "SSD 用闪存芯片，没有机械硬盘那种转盘，所以更抗震、更安静、开机更快。",
        "还有机械硬盘 HDD：更便宜、容量大，但慢一些，适合存电影备份。",
        "系统盘建议 SSD；大容量冷数据可以再加一块 HDD。",
      ],
      facts: [
        ["接口", "NVMe M.2 / SATA"],
        ["单位", "GB / TB"],
        ["体验", "换 SSD 往往比换 CPU 更「体感明显」"],
      ],
    },
    psu: {
      title: "电源 PSU",
      metaphor: "电源是发电厂：把墙上的交流电转换成主板、CPU、显卡需要的稳定直流电。",
      body: [
        "功率不够或品质差，可能导致死机、重启，甚至危险。高功耗显卡尤其吃电源。",
        "看额定功率、80 PLUS 认证、以及是否有显卡需要的供电接口。",
      ],
      facts: [
        ["单位", "瓦特 W"],
        ["认证", "80 PLUS 铜/银/金…"],
        ["安全", "切勿在开机时徒手乱摸内部"],
      ],
    },
    fan: {
      title: "机箱风扇",
      metaphor: "风扇是城市通风系统：进风、出风形成风道，让热空气离开机箱。",
      body: [
        "常见布局：前面进冷风，后面/上面排出热风。走线干净也能让风更顺。",
        "RGB 灯好看，但散热才是风扇的本职工作。",
      ],
      facts: [
        ["尺寸", "120mm / 140mm 常见"],
        ["控制", "可随温度自动调速"],
        ["噪音", "低转速通常更安静"],
      ],
    },
  };

  const PART_ORDER = [
    "case",
    "motherboard",
    "cpu",
    "cooler",
    "ram",
    "gpu",
    "ssd",
    "psu",
    "fan",
  ];

  /* ---------- DOM refs ---------- */
  const rig = document.getElementById("pc-rig");
  const viewport = document.getElementById("pc-viewport");
  const titleEl = document.getElementById("part-title");
  const metaphorEl = document.getElementById("part-metaphor");
  const bodyEl = document.getElementById("part-body");
  const factsEl = document.getElementById("part-facts");
  const quickEl = document.getElementById("part-quick");
  const btnAssemble = document.getElementById("btn-assemble");
  const btnExplode = document.getElementById("btn-explode");
  const btnReset = document.getElementById("btn-reset-cam");

  let rotX = 18;
  let rotY = -32;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let activePart = "motherboard";

  function applyRotation() {
    if (!rig) return;
    const explode = rig.classList.contains("explode");
    // base transform set via JS; explode offsets remain in CSS on children
    rig.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    void explode;
  }

  function selectPart(key) {
    if (!PARTS[key]) return;
    activePart = key;
    const data = PARTS[key];

    document.querySelectorAll(".part").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.part === key);
    });
    document.querySelectorAll(".part-chip-btn").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.part === key);
    });

    titleEl.textContent = data.title;
    metaphorEl.textContent = data.metaphor;
    bodyEl.innerHTML = data.body.map((p) => `<p>${p}</p>`).join("");
    factsEl.innerHTML = data.facts
      .map(([k, v]) => `<li><strong>${k}</strong>${v}</li>`)
      .join("");
  }

  function buildQuickChips() {
    if (!quickEl) return;
    quickEl.innerHTML = PART_ORDER.map((key) => {
      const label = PARTS[key].title.split(" ")[0];
      return `<button type="button" class="part-chip-btn" data-part="${key}">${label}</button>`;
    }).join("");
    quickEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-part]");
      if (btn) selectPart(btn.dataset.part);
    });
  }

  /* Part clicks */
  document.querySelectorAll(".part").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      selectPart(el.dataset.part);
    });
  });

  document.getElementById("mb-map")?.addEventListener("click", (e) => {
    const zone = e.target.closest("[data-part]");
    if (zone) selectPart(zone.dataset.part);
  });

  /* Toolbar */
  btnAssemble?.addEventListener("click", () => {
    rig?.classList.remove("explode");
    btnAssemble.classList.add("is-active");
    btnExplode?.classList.remove("is-active");
  });
  btnExplode?.addEventListener("click", () => {
    rig?.classList.add("explode");
    btnExplode.classList.add("is-active");
    btnAssemble?.classList.remove("is-active");
  });
  // 默认打开爆炸视图，方便第一次讲解时看清零件
  btnExplode?.click();
  btnReset?.addEventListener("click", () => {
    rotX = 18;
    rotY = -32;
    applyRotation();
  });

  /* Drag to rotate */
  function onPointerDown(e) {
    if (e.target.closest(".part")) return;
    dragging = true;
    viewport.classList.add("is-dragging");
    lastX = e.clientX;
    lastY = e.clientY;
    viewport.setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e) {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    rotY += dx * 0.45;
    rotX = Math.max(-20, Math.min(70, rotX - dy * 0.35));
    applyRotation();
  }
  function onPointerUp(e) {
    dragging = false;
    viewport?.classList.remove("is-dragging");
    try {
      viewport?.releasePointerCapture?.(e.pointerId);
    } catch (_) {
      /* ignore */
    }
  }

  if (viewport) {
    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", onPointerUp);
    viewport.addEventListener("pointercancel", onPointerUp);
  }

  buildQuickChips();
  selectPart(activePart);
  applyRotation();

  /* ---------- Binary demo ---------- */
  const binInput = document.getElementById("bin-input");
  const binOutput = document.getElementById("bin-output");
  const binNote = document.getElementById("bin-note");

  function updateBinary() {
    if (!binInput || !binOutput) return;
    const ch = (binInput.value || " ").slice(0, 1);
    const code = ch.codePointAt(0) ?? 32;
    const binary = code.toString(2).padStart(8, "0");
    binOutput.textContent = binary;
    if (binNote) {
      binNote.textContent = `字符「${ch}」的 Unicode/ASCII 码是 ${code}，转成二进制就是 ${binary}`;
    }
  }
  binInput?.addEventListener("input", updateBinary);
  updateBinary();

  /* ---------- Quiz ---------- */
  const QUIZ = [
    {
      q: "内存（RAM）和固态硬盘（SSD）最大的差别是？",
      options: [
        "它们其实是同一种东西",
        "RAM 像办公桌，关机清空；SSD 像书架，关机还在",
        "SSD 只给苹果电脑用",
      ],
      answer: 1,
      explain: "记住：桌子（正在用）≠ 书架（长期存）。",
    },
    {
      q: "操作系统最像下面哪一个角色？",
      options: ["游戏里的一把剑", "交通规则 + 大管家", "机箱上的电源键"],
      answer: 1,
      explain: "OS 协调硬件与软件，没有它 App 很难直接工作。",
    },
    {
      q: "GPU 相比 CPU，更擅长什么？",
      options: [
        "一次只做一件超复杂的逻辑判断",
        "同时做大量相似的计算（比如很多像素）",
        "专门负责供电",
      ],
      answer: 1,
      explain: "GPU 的「人海战术」很适合图形和 AI 计算。",
    },
    {
      q: "关于 Windows 和苹果 Mac，哪句更准确？",
      options: [
        "Mac 绝对不会有安全问题",
        "Windows 一定比 Mac 慢",
        "没有绝对更好，要看游戏、预算、生态和你想做什么",
      ],
      answer: 2,
      explain: "选工具看任务：游戏与改装偏 Windows；影像与苹果生态偏 Mac。",
    },
    {
      q: "按下台式机电源键后，第一步大致是？",
      options: [
        "立刻打开微信",
        "电源供电并做硬件自检，再引导加载操作系统",
        "先下载最新游戏",
      ],
      answer: 1,
      explain: "先自检与引导，桌面出现后你才能登录使用。",
    },
  ];

  const quizRoot = document.getElementById("quiz-root");
  if (quizRoot) {
    quizRoot.innerHTML = QUIZ.map((item, qi) => `
      <article class="quiz-item" data-quiz="${qi}">
        <h3>${qi + 1}. ${item.q}</h3>
        <div class="quiz-options">
          ${item.options
            .map(
              (opt, oi) =>
                `<button type="button" data-opt="${oi}">${opt}</button>`
            )
            .join("")}
        </div>
        <p class="quiz-feedback" aria-live="polite"></p>
      </article>
    `).join("");

    quizRoot.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-opt]");
      if (!btn) return;
      const card = btn.closest(".quiz-item");
      const qi = Number(card.dataset.quiz);
      const oi = Number(btn.dataset.opt);
      const item = QUIZ[qi];
      const feedback = card.querySelector(".quiz-feedback");
      const buttons = card.querySelectorAll("button[data-opt]");

      buttons.forEach((b) => {
        b.disabled = true;
        const idx = Number(b.dataset.opt);
        if (idx === item.answer) b.classList.add("is-correct");
        if (idx === oi && oi !== item.answer) b.classList.add("is-wrong");
      });

      feedback.textContent =
        oi === item.answer ? `答对了！${item.explain}` : `再想想～ ${item.explain}`;
    });
  }

  /* ---------- Mobile nav ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  toggle?.addEventListener("click", () => {
    const open = links?.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links?.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      links.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(
    ".section-head, .workshop, .city-map, .compare-3d, .stack-3d, .os-grid, .soft-diagram, .gpu-lab, .vs-hero, .bonus-card, .quiz-item, .teach-steps li"
  );
  revealEls.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
})();
