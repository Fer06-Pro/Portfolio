// ===== NAVEGAÇÃO E TEMA =====
(() => {
  const themeButton = document.querySelector(".theme-toggle");
  const systemTheme = matchMedia("(prefers-color-scheme: dark)");
  function setTheme(theme) {
    const dark = theme === "dark";
    document.documentElement.dataset.theme = theme;
    themeButton.setAttribute("aria-pressed", String(dark));
    themeButton.setAttribute(
      "aria-label",
      dark ? "Ativar modo claro" : "Ativar modo escuro",
    );
    themeButton.querySelector(".theme-label").textContent = dark
      ? "Tema claro"
      : "Tema escuro";
  }
  setTheme(
    document.documentElement.dataset.theme ||
      (systemTheme.matches ? "dark" : "light"),
  );
  themeButton.addEventListener("click", () => {
    const theme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(theme);
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {}
  });
  systemTheme.addEventListener("change", (event) => {
    let saved;
    try {
      saved = localStorage.getItem("portfolio-theme");
    } catch {}
    if (saved !== "dark" && saved !== "light")
      setTheme(event.matches ? "dark" : "light");
  });
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("main-nav");
  function menu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }
  toggle.addEventListener("click", () =>
    menu(!nav.classList.contains("is-open")),
  );
  nav
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", () => menu(false)));
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".site-header")) menu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      menu(false);
      toggle.focus();
    }
  });
  matchMedia("(max-width:800px)").addEventListener("change", () => menu(false));
  document.getElementById("year").textContent = new Date().getFullYear();
  // ===== ORÇAMENTOS NO WHATSAPP =====
  document.querySelectorAll("[data-budget]").forEach((link) => {
    const message = `Olá, Fernando! Vi seu portfólio e gostaria de conversar sobre um projeto de ${link.dataset.budget}.`;
    link.href = `https://wa.me/5511934096093?text=${encodeURIComponent(message)}`;
  });
  // ===== VÍDEOS: SOMENTE POR AÇÃO DO VISITANTE =====
  const videos = [...document.querySelectorAll("video")];
  videos.forEach((video) => {
    const button = document.querySelector(`[data-video="${video.id}"]`);
    button.addEventListener("click", async () => {
      button.hidden = true;
      try {
        await video.play();
      } catch {
        button.hidden = false;
      }
    });
    video.addEventListener("play", () => {
      button.hidden = true;
      videos.forEach((other) => {
        if (other !== video) other.pause();
      });
    });
    video.addEventListener("ended", () => {
      button.hidden = false;
    });
    video.addEventListener("error", () => {
      button.hidden = true;
    });
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) videos.forEach((v) => v.pause());
  });
  // Estado da seção na navegação, sem interferir nos links nativos.
  if ("IntersectionObserver" in window) {
    const links = [...nav.querySelectorAll("a")];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            links.forEach((a) => {
              if (a.hash === "#" + entry.target.id)
                a.setAttribute("aria-current", "location");
              else a.removeAttribute("aria-current");
            });
        });
      },
      { rootMargin: "-10% 0px -55% 0px", threshold: 0 },
    );
    ["projetos", "sobre", "processo", "contato"].forEach((id) =>
      observer.observe(document.getElementById(id)),
    );
  }
})();
