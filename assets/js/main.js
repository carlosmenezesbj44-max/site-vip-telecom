const CONTACTS = {
  whatsappText: "0800 200 9056",
  whatsappUrl: "https://wa.me/558002009056?text=Ol%C3%A1%2C%20quero%20consultar%20planos%20da%20VIP%20Telecom",
  email: "atendimento@viptelecom.com.br"
};

const QUICK_LINKS = {
  clientArea: "https://agilitytelecomudp.com.br/central_assinante_web/login",
  speedTest: "https://fast.com/"
};

const menuButton = document.querySelector("[data-menu-button]");
const siteNav = document.querySelector("[data-site-nav]");
const navLinks = document.querySelectorAll(".site-nav a");
const contactLinks = document.querySelectorAll("[data-contact]");
const clientLinks = document.querySelectorAll("[data-client-area]");
const speedTestLinks = document.querySelectorAll("[data-speed-test]");
const planTabs = document.querySelectorAll("[data-plan-tab]");
const planPanels = document.querySelectorAll("[data-plan-panel]");
const plansSection = document.querySelector("#planos");
const plansTrigger = document.querySelector("[data-plans-trigger]");
const plansMenu = document.querySelector("[data-plans-menu]");
const tabJumpLinks = document.querySelectorAll("[data-tab-jump]");
const planTabNames = Array.from(planTabs).map((tab) => tab.dataset.planTab);
const params = new URLSearchParams(window.location.search);

if (params.get("planos") === "1") {
  document.body.classList.add("plans-only");
}

contactLinks.forEach((link) => {
  const contactType = link.dataset.contact;

  if (contactType === "whatsapp") {
    link.href = CONTACTS.whatsappUrl;
    link.target = "_blank";
    link.rel = "noopener";

    if (link.dataset.contactLabel === "phone") {
      link.textContent = CONTACTS.whatsappText;
    }
  }

  if (contactType === "email") {
    link.href = `mailto:${CONTACTS.email}`;

    if (link.dataset.contactLabel === "email") {
      link.textContent = CONTACTS.email;
    }
  }
});

clientLinks.forEach((link) => {
  link.href = QUICK_LINKS.clientArea;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

speedTestLinks.forEach((link) => {
  link.href = QUICK_LINKS.speedTest;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

function closePlansMenu() {
  if (!plansTrigger || !plansMenu) return;

  plansTrigger.setAttribute("aria-expanded", "false");
  plansMenu.classList.remove("is-open");
}

function closeMenu() {
  if (!menuButton || !siteNav) return;

  menuButton.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  closePlansMenu();
}

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });
}

if (plansTrigger && plansMenu) {
  plansTrigger.addEventListener("click", () => {
    const isOpen = plansTrigger.getAttribute("aria-expanded") === "true";
    plansTrigger.setAttribute("aria-expanded", String(!isOpen));
    plansMenu.classList.toggle("is-open", !isOpen);
  });
}

function getPlanFromHash() {
  const hash = window.location.hash.replace("#", "");
  return planTabNames.includes(hash) ? hash : "";
}

function scrollToPlansSection() {
  if (!plansSection) return;
  plansSection.scrollIntoView({ block: "start" });
}

function activatePlanTab(tabName, options = {}) {
  if (!planTabNames.includes(tabName)) return;

  planTabs.forEach((tab) => {
    const isActive = tab.dataset.planTab === tabName;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  planPanels.forEach((panel) => {
    const isActive = panel.dataset.planPanel === tabName;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });

  if (options.updateHash && window.location.hash !== `#${tabName}`) {
    history.pushState(null, "", `#${tabName}`);
  }

  if (options.scroll) {
    requestAnimationFrame(scrollToPlansSection);
  }
}

function activatePlanFromHash(options = {}) {
  const tabName = getPlanFromHash();
  if (tabName) {
    activatePlanTab(tabName, options);
  }
}

planTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activatePlanTab(tab.dataset.planTab, { updateHash: true });
  });
});

tabJumpLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.target === "_blank") {
      closeMenu();
      return;
    }

    event.preventDefault();
    activatePlanTab(link.dataset.tabJump, { updateHash: true, scroll: true });
    closeMenu();
  });
});

window.addEventListener("hashchange", () => activatePlanFromHash({ scroll: true }));
window.addEventListener("popstate", () => activatePlanFromHash({ scroll: true }));
activatePlanFromHash({ scroll: true });

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

document.querySelectorAll(".faq-list details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;

    document.querySelectorAll(".faq-list details").forEach((otherDetail) => {
      if (otherDetail !== detail) {
        otherDetail.open = false;
      }
    });
  });
});

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function iconSvg(paths) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

const PLAN_BENEFIT_ICONS = {
  check: iconSvg('<path d="M20 6 9 17l-5-5"/>'),
  wifi: iconSvg('<path d="M5 9a11 11 0 0 1 14 0"/><path d="M8.5 12.5a6 6 0 0 1 7 0"/><path d="M12 16h0"/><circle cx="12" cy="18" r="1.5"/>'),
  book: iconSvg('<path d="M12 21V5"/><path d="M12 5c-3-2-6-2-9 0v14c3-2 6-2 9 0"/><path d="M12 5c3-2 6-2 9 0v14c-3-2-6-2-9 0"/>'),
  headset: iconSvg('<path d="M4 13a8 8 0 0 1 16 0"/><path d="M4 13v4a2 2 0 0 0 2 2h1"/><path d="M20 13v4a2 2 0 0 1-2 2h-1"/><path d="M7 17v-3"/><path d="M17 17v-3"/><path d="M9 19h6"/>'),
  tv: iconSvg('<rect x="3" y="6" width="18" height="11" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>'),
  upload: iconSvg('<path d="M12 18V6"/><path d="m7 11 5-5 5 5"/><path d="M5 20h14"/>'),
  shield: iconSvg('<path d="M12 3 20 6v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V6z"/>'),
  home: iconSvg('<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V20h14v-9.5"/>'),
  payment: iconSvg('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/><path d="M7 15h4"/>'),
  chart: iconSvg('<path d="M4 19V5"/><path d="M4 19h16"/><path d="m7 15 3-3 3 2 5-6"/>'),
  users: iconSvg('<path d="M17 21v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1"/><circle cx="11.5" cy="8" r="3"/><path d="M21 21v-1a3 3 0 0 0-2-2.8"/><path d="M16.5 5.8a3 3 0 0 1 0 4.4"/>'),
  camera: iconSvg('<path d="M4 7h4l2-2h4l2 2h4v12H4z"/><circle cx="12" cy="13" r="3.5"/>'),
  router: iconSvg('<rect x="4" y="10" width="16" height="8" rx="2"/><path d="M8 10V6"/><path d="M12 10V5"/><path d="M16 10V7"/><path d="M9 15h0"/><path d="M15 15h0"/>'),
  network: iconSvg('<circle cx="12" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M11 8 7 16"/><path d="M13 8 17 16"/><path d="M8.5 18h7"/>'),
  educa: iconSvg('<rect x="4" y="6" width="13" height="9" rx="2"/><path d="M13 9h4"/><path d="m14 6 3 3-3 3"/><path d="M9 19h6"/>'),
  target: iconSvg('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 4v4"/><path d="M20 12h-4"/>'),
  star: iconSvg('<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.8-5.4 2.8 1-6.1-4.4-4.3 6.1-.9z"/>'),
  briefcase: iconSvg('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2"/><path d="M3 12h18"/>'),
  wrench: iconSvg('<path d="M21 2a6 6 0 0 1-7.7 5.7L6 15l3 3 7.3-7.3A6 6 0 0 1 21 2Z"/><path d="m8 16-4 4"/>')
};

function pickBenefitIcon(text) {
  const value = text.toLowerCase();

  if (value.includes("instala")) return "check";
  if (value.includes("roteador") || value.includes("wi-fi") || value.includes("wifi")) return "wifi";
  if (value.includes("pagbank") || value.includes("maquininha")) return "payment";
  if (value.includes("controle de banda") || value.includes("tráfego") || value.includes("trafego") || value.includes("performance")) return "chart";
  if (value.includes("usuários") || value.includes("usuarios")) return "users";
  if (value.includes("câmera") || value.includes("cameras") || value.includes("câmeras") || value.includes("camera")) return "camera";
  if (value.includes("rb3011") || value.includes("rb750gr3") || value.includes("roteador")) return "router";
  if (value.includes("rede") || value.includes("monitoramento") || value.includes("dimensionamento") || value.includes("infraestrutura")) return "network";
  if (value.includes("educa")) return "educa";
  if (value.includes("operação") || value.includes("operacao") || value.includes("empresa") || value.includes("negócio") || value.includes("negocio")) return "target";
  if (value.includes("leitura") || value.includes("ebook") || value.includes("audiobook") || value.includes("conteúd") || value.includes("conteud")) return "book";
  if (value.includes("tv") || value.includes("streaming") || value.includes("max") || value.includes("disney") || value.includes("deezer")) return "tv";
  if (value.includes("upload")) return "upload";
  if (value.includes("ip público fixo") || value.includes("ip publico fixo") || value.includes("security") || value.includes("prioridade")) return "shield";
  if (value.includes("mudança") || value.includes("mudanca")) return "home";
  if (value.includes("gestor") || value.includes("empresa") || value.includes("consultor")) return "briefcase";
  if (value.includes("visita técnica") || value.includes("visita tecnica") || value.includes("manutenção") || value.includes("manutencao") || value.includes("rede interna") || value.includes("computadores")) return "wrench";
  if (value.includes("clube") || value.includes("vantagens") || value.includes("benefício") || value.includes("beneficio")) return "star";
  return "headset";
}
function decoratePlanItems() {
  document.querySelectorAll(".plan-card li").forEach((item) => {
    if (item.dataset.iconDecorated === "true") return;

    const text = item.textContent.trim();
    const iconName = pickBenefitIcon(text);
    item.dataset.iconDecorated = "true";
    item.classList.add("plan-benefit");
    item.innerHTML = `
      <span class="plan-benefit-icon" aria-hidden="true">${PLAN_BENEFIT_ICONS[iconName] || PLAN_BENEFIT_ICONS.check}</span>
      <span class="plan-benefit-text">${escapeHtml(text)}</span>
    `;
  });
}

decoratePlanItems();
