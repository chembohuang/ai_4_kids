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

  /* ---------- Bit switch demo (三生万物) ---------- */
  const bitRow = document.getElementById("bit-row");
  const bitBinary = document.getElementById("bit-binary");
  const bitDecimal = document.getElementById("bit-decimal");

  function syncBitReadout() {
    if (!bitRow || !bitBinary || !bitDecimal) return;
    const bits = [...bitRow.querySelectorAll(".bit-sw")]
      .map((btn) => (btn.classList.contains("is-on") ? "1" : "0"))
      .join("");
    bitBinary.textContent = bits;
    bitDecimal.textContent = String(parseInt(bits, 2));
  }

  bitRow?.addEventListener("click", (e) => {
    const btn = e.target.closest(".bit-sw");
    if (!btn) return;
    btn.classList.toggle("is-on");
    btn.textContent = btn.classList.contains("is-on") ? "1" : "0";
    syncBitReadout();
  });
  syncBitReadout();

  /* ---------- Windows coach ---------- */
  const WIN_TOPICS = {
    start: {
      title: "开始菜单",
      body: [
        "点左下角 Windows 图标（或按键盘 Win 键）打开开始菜单。",
        "这里可以搜索程序、打开设置，以及睡眠 / 关机 / 重启。",
      ],
      facts: [
        ["快捷键", "Win"],
        ["小技巧", "直接打字就能搜索"],
      ],
      window: false,
      start: true,
    },
    search: {
      title: "搜索",
      body: [
        "任务栏搜索框能找应用、设置和文件。",
        "忘掉图标在哪时，搜名字往往最快。",
      ],
      facts: [
        ["举例", "搜「设置」「画图」「作业」"],
        ["快捷键", "Win 然后直接打字"],
      ],
      window: false,
      start: false,
    },
    explorer: {
      title: "文件资源管理器",
      body: [
        "资源管理器是 Windows 的「文件管家」：浏览磁盘、复制、重命名、删除。",
        "左侧是常用位置，右侧是当前文件夹里的内容。",
      ],
      facts: [
        ["快捷键", "Win + E"],
        ["任务栏", "文件夹图标也可打开"],
      ],
      window: true,
      start: false,
    },
    folder: {
      title: "文件夹",
      body: [
        "文件夹用来分类存放文件，就像书包里的隔层。",
        "建议为「语文」「数学」「兴趣」等分别建文件夹，别全堆在桌面。",
      ],
      facts: [
        ["新建", "右键空白处 → 新建 → 文件夹"],
        ["移动", "拖拽，或剪切后粘贴"],
      ],
      window: true,
      start: false,
    },
    documents: {
      title: "文档库",
      body: [
        "「文档」适合放作文、课件、报告等长期文件。",
        "养成「做完作业立刻保存到文档」的习惯，比只放桌面更稳妥。",
      ],
      facts: [
        ["后缀", ".docx / .pdf / .txt"],
        ["口诀", "桌面临时，文档长期"],
      ],
      window: true,
      start: false,
    },
    downloads: {
      title: "下载文件夹",
      body: [
        "浏览器下载的文件默认进「下载」。",
        "装软件前先看清楚是不是官网来源；装完把安装包删掉或归档，避免下载越堆越乱。",
      ],
      facts: [
        ["小心", ".exe 安装包不要乱点"],
        ["整理", "每周清一次下载"],
      ],
      window: true,
      start: false,
    },
    "this-pc": {
      title: "此电脑",
      body: [
        "「此电脑」能看到 C 盘、D 盘（如果有）和已连接的 U 盘。",
        "系统多半在 C 盘；自己的大文件可以放其它盘或「文档」。",
      ],
      facts: [
        ["C 盘", "通常装着 Windows"],
        ["空间不足", "先清下载与回收站"],
      ],
      window: true,
      start: false,
    },
    recycle: {
      title: "回收站",
      body: [
        "删除的文件会先进入回收站，还能还原。",
        "清空回收站后，一般就很难找回来了——清空前再确认一次。",
      ],
      facts: [
        ["还原", "打开回收站 → 还原"],
        ["彻底删除", "Shift + Delete（慎用）"],
      ],
      window: false,
      start: false,
    },
    edge: {
      title: "浏览器",
      body: [
        "Edge 是 Windows 自带浏览器，用来上网课、查资料、看视频。",
        "也可以安装 Chrome / Firefox。记得分辨网址是不是 https，别随便下插件。",
      ],
      facts: [
        ["新标签", "Ctrl + T"],
        ["安全", "不点陌生短链接"],
      ],
      window: false,
      start: false,
    },
    settings: {
      title: "设置",
      body: [
        "「设置」是调电脑的控制台：网络、显示、声音、更新、账号都在这里。",
        "换壁纸、连 Wi‑Fi、调亮度，几乎都能在设置里完成。",
      ],
      facts: [
        ["快捷键", "Win + I"],
        ["更新", "Windows 更新要定期检查"],
      ],
      window: false,
      start: false,
    },
    store: {
      title: "Microsoft Store",
      body: [
        "应用商店提供较安全的官方安装来源，适合装计算器、绘画、学习类应用。",
        "大型游戏也常在 Steam 等平台安装——一样要认准正版。",
      ],
      facts: [
        ["优点", "更新与卸载更省心"],
        ["习惯", "能走商店就少下不明安装包"],
      ],
      window: false,
      start: false,
    },
    taskmgr: {
      title: "任务管理器",
      body: [
        "程序卡死时，用任务管理器结束它，而不用强制拔电源。",
        "还能看到谁在吃 CPU、内存——电脑变慢时很有用。",
      ],
      facts: [
        ["快捷键", "Ctrl + Shift + Esc"],
        ["注意", "别结束你不认识的系统进程"],
      ],
      window: false,
      start: false,
    },
    power: {
      title: "电源选项",
      body: [
        "睡眠：快速休息，再开很快。关机：完全关掉。重启：很多小问题重启能好。",
        "更新有时会要求重启——保存作业后再点。",
      ],
      facts: [
        ["锁屏", "Win + L"],
        ["强制重启", "仅在完全死机时考虑"],
      ],
      window: false,
      start: false,
    },
    wifi: {
      title: "网络图标",
      body: [
        "右下角可查看 Wi‑Fi / 以太网是否连通。",
        "上不了网时，先看这里是不是断开，或是否开了飞行模式。",
      ],
      facts: [
        ["家庭网", "连对家里 Wi‑Fi 名称"],
        ["进阶", "设置 → 网络和 Internet"],
      ],
      window: false,
      start: false,
    },
    sound: {
      title: "音量",
      body: [
        "点喇叭图标可调系统音量，也能选耳机还是音箱输出。",
        "听不到声音时：看是否静音、插对接口、是否选错播放设备。",
      ],
      facts: [
        ["快捷键", "键盘音量键"],
        ["会议", "提前测麦与扬声器"],
      ],
      window: false,
      start: false,
    },
    clock: {
      title: "时间与日历",
      body: [
        "右下角显示时间，点开可看日历。",
        "时间不对会影响网站登录和证书校验——通常开着「自动设置时间」即可。",
      ],
      facts: [
        ["设置", "日期和时间"],
        ["专注", "也可在这里看通知"],
      ],
      window: false,
      start: false,
    },
  };

  const winStart = document.getElementById("win-start");
  const winWindow = document.getElementById("win-window");
  const wwTitle = document.getElementById("ww-title");
  const tbStart = document.getElementById("tb-start");
  const winCoachTitle = document.getElementById("win-coach-title");
  const winCoachBody = document.getElementById("win-coach-body");
  const winCoachFacts = document.getElementById("win-coach-facts");
  const tbClock = document.getElementById("tb-clock");

  function tickWinClock() {
    if (!tbClock) return;
    const now = new Date();
    tbClock.textContent = now.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  tickWinClock();
  setInterval(tickWinClock, 30000);

  function showWinTopic(key, { keepStart } = {}) {
    const data = WIN_TOPICS[key];
    if (!data) return;

    if (winCoachTitle) winCoachTitle.textContent = data.title;
    if (winCoachBody) {
      winCoachBody.innerHTML = data.body.map((p) => `<p>${p}</p>`).join("");
    }
    if (winCoachFacts) {
      winCoachFacts.innerHTML = data.facts
        .map(([k, v]) => `<li><strong>${k}</strong>${v}</li>`)
        .join("");
    }

    document.querySelectorAll(".win-icon").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.win === key);
    });

    const fromStartMenu = ["settings", "store", "taskmgr", "power", "edge", "explorer"];
    if (key === "start" || (keepStart && fromStartMenu.includes(key))) {
      winStart?.removeAttribute("hidden");
      tbStart?.classList.add("is-open");
    } else if (!fromStartMenu.includes(key)) {
      winStart?.setAttribute("hidden", "");
      tbStart?.classList.remove("is-open");
    }

    if (data.window || ["folder", "documents", "downloads", "this-pc", "explorer"].includes(key)) {
      winWindow?.removeAttribute("hidden");
      if (wwTitle) {
        wwTitle.textContent =
          key === "explorer" ? "文件资源管理器" : `文件资源管理器 · ${data.title}`;
      }
    } else {
      winWindow?.setAttribute("hidden", "");
    }
  }

  document.getElementById("win-desktop")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-win]");
    if (!btn) {
      if (e.target.classList.contains("win-wallpaper") || e.target.id === "win-desktop") {
        winStart?.setAttribute("hidden", "");
        tbStart?.classList.remove("is-open");
      }
      return;
    }
    const key = btn.dataset.win;
    if (key === "start") {
      const opening = winStart?.hasAttribute("hidden");
      if (opening) {
        winStart?.removeAttribute("hidden");
        tbStart?.classList.add("is-open");
        showWinTopic("start");
      } else {
        winStart?.setAttribute("hidden", "");
        tbStart?.classList.remove("is-open");
      }
      return;
    }
    const keepStart = Boolean(e.target.closest("#win-start"));
    showWinTopic(key, { keepStart });
  });

  if (winCoachTitle) winCoachTitle.textContent = "点桌面上的图标试试";
  if (winCoachBody) {
    winCoachBody.innerHTML =
      "<p>左侧是简化版 Windows 11 桌面。可以从「开始」、任务栏或桌面图标入手。</p>";
  }
  if (winCoachFacts) winCoachFacts.innerHTML = "";
  winStart?.setAttribute("hidden", "");
  tbStart?.classList.remove("is-open");
  winWindow?.setAttribute("hidden", "");

  /* ---------- Game network demo ---------- */
  const pingRange = document.getElementById("ping-range");
  const pingOut = document.getElementById("ping-out");
  const packetLayer = document.getElementById("packet-layer");
  const gameStage = document.getElementById("game-stage");
  const gameLog = document.getElementById("game-log");
  const friendStatus = document.getElementById("friend-status");
  const youAv = document.querySelector(".you-av");
  const friendAv = document.querySelector(".friend-av");
  const serverBox = document.querySelector(".server-box");

  function currentPing() {
    return Number(pingRange?.value || 60);
  }

  function syncPingLabel() {
    if (pingOut) pingOut.textContent = `${currentPing()} ms`;
  }
  pingRange?.addEventListener("input", syncPingLabel);
  syncPingLabel();

  function nodeCenter(el) {
    if (!gameStage || !el) return { x: 0, y: 0 };
    const stage = gameStage.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    return {
      x: box.left - stage.left + box.width / 2,
      y: box.top - stage.top + box.height / 2,
    };
  }

  function flyPacket(label, fromEl, toEl, delay, onDone) {
    if (!packetLayer) {
      onDone?.();
      return;
    }
    const from = nodeCenter(fromEl);
    const to = nodeCenter(toEl);
    const el = document.createElement("div");
    el.className = "fly-pkt";
    el.textContent = label;
    el.style.left = `${from.x}px`;
    el.style.top = `${from.y}px`;
    packetLayer.appendChild(el);

    const duration = Math.max(180, delay);
    const anim = el.animate(
      [
        { left: `${from.x}px`, top: `${from.y}px`, opacity: 0.2, offset: 0 },
        { opacity: 1, offset: 0.15 },
        { left: `${to.x}px`, top: `${to.y}px`, opacity: 1, offset: 1 },
      ],
      { duration, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", fill: "forwards" }
    );
    anim.onfinish = () => {
      el.remove();
      onDone?.();
    };
  }

  function flash(el) {
    if (!el) return;
    el.classList.add("is-flash");
    setTimeout(() => el.classList.remove("is-flash"), 350);
  }

  function runGameEvent(kind) {
    const ping = currentPing();
    const half = Math.round(ping / 2);
    const outbound = kind === "fire" ? "射击请求" : "移动坐标";
    const inbound = kind === "fire" ? "命中广播" : "位置同步";

    if (gameLog) {
      gameLog.textContent = `已发出「${outbound}」……（单程约 ${half} ms，往返约 ${ping} ms）`;
    }
    if (friendStatus) friendStatus.textContent = "消息飞行中…";
    flash(youAv);

    flyPacket(outbound, youAv, serverBox, half, () => {
      flash(serverBox);
      if (gameLog) {
        gameLog.textContent =
          kind === "fire"
            ? "服务器判定：命中！正在广播给所有客户端…"
            : "服务器更新世界坐标，正在同步给队友…";
      }
      flyPacket(inbound, serverBox, friendAv, half, () => {
        flash(friendAv);
        if (friendStatus) {
          friendStatus.textContent =
            kind === "fire" ? "看到你开枪 / 掉血！" : "看到你移动了";
        }
        if (gameLog) {
          gameLog.textContent =
            ping >= 180
              ? `完成。延迟 ${ping} ms 偏高——队友会感觉你「慢半拍」或瞬移。`
              : `完成。延迟 ${ping} ms，大家看到的世界比较同步。`;
        }
      });
    });
  }

  document.getElementById("btn-fire")?.addEventListener("click", () => runGameEvent("fire"));
  document.getElementById("btn-move")?.addEventListener("click", () => runGameEvent("move"));

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
    {
      q: "联机游戏里，谁通常负责判定「打没打中」更公平？",
      options: [
        "只相信你自己电脑上的结果",
        "游戏服务器当裁判，再广播给大家",
        "由网线自己决定",
      ],
      answer: 1,
      explain: "客户端–服务器模式下，服务器掌握权威世界状态，更难作弊。",
    },
    {
      q: "Ping / 延迟变高时，联机游戏常常会出现？",
      options: [
        "显卡突然升级",
        "操作更跟手、画面更清晰",
        "卡顿、瞬移、打不准等不同步现象",
      ],
      answer: 2,
      explain: "消息飞得慢，大家看到的世界就会对不齐。",
    },
    {
      q: "Windows 里想快速打开文件资源管理器，常用快捷键是？",
      options: ["Ctrl + C", "Win + E", "Alt + F4"],
      answer: 1,
      explain: "Win + E 打开资源管理器；Win + I 是设置，Win + L 是锁屏。",
    },
    {
      q: "网上下载的安装包，更稳妥的做法是？",
      options: [
        "任何 .exe 都双击安装",
        "尽量走官网或 Microsoft Store，并注意有没有捆绑软件",
        "直接删掉 System32 腾地方",
      ],
      answer: 1,
      explain: "来源不明的安装包风险很高；商店与官网更安全。",
    },
    {
      q: "电脑底层为什么常用 0 和 1，而不是一次存很多种电压？",
      options: [
        "因为工程师只会数到 1",
        "两种状态最稳、最不容易被噪声搞混，也最好大规模制造",
        "国际规定不许用别的数字",
      ],
      answer: 1,
      explain: "0/1 像阴阳两仪；组合起来就能「三生万物」，表示文字、图片和程序。",
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
    ".section-head, .workshop, .city-map, .compare-3d, .stack-3d, .os-grid, .soft-diagram, .dao-quote, .binary-why, .bit-build, .dao-map, .gpu-lab, .vs-hero, .win-lab, .win-skills, .win-shortcuts, .win-howto, .net-journey, .net-basics, .game-lab, .game-steps-grid, .net-modes, .bonus-card, .quiz-item, .teach-steps li"
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
