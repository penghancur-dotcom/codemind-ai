(() => {
  "use strict";

  const sidebar = document.querySelector("#sidebar");
  const menuBtn = document.querySelector("#menuBtn");
  const profileBtn = document.querySelector("#profileBtn");
  const profileMenu = document.querySelector("#profileMenu");

  // Mobile sidebar: use a normal script so it also runs in Acode local preview.
  menuBtn?.addEventListener("click", () => {
    const isOpen = sidebar?.classList.toggle("open") ?? false;
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  // Expand/collapse sidebar groups.
  document.querySelectorAll("[data-toggle]").forEach((button) => {
    const target = document.getElementById(button.dataset.toggle);
    button.setAttribute("aria-expanded", String(Boolean(target?.classList.contains("open"))));
    button.addEventListener("click", () => {
      if (!target) return;
      const isOpen = target.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });

  // Close the mobile sidebar after choosing a destination.
  sidebar?.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("open");
      menuBtn?.setAttribute("aria-expanded", "false");
      menuBtn?.setAttribute("aria-label", "Open menu");
    });
  });

  // Profile dropdown.
  const closeProfile = () => {
    if (!profileMenu || !profileBtn) return;
    profileMenu.hidden = true;
    profileBtn.setAttribute("aria-expanded", "false");
  };
  profileBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!profileMenu) return;
    const willOpen = profileMenu.hidden;
    profileMenu.hidden = !willOpen;
    profileBtn.setAttribute("aria-expanded", String(willOpen));
  });
  profileMenu?.addEventListener("click", (event) => event.stopPropagation());
  document.addEventListener("click", closeProfile);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeProfile();
      sidebar?.classList.remove("open");
      menuBtn?.setAttribute("aria-expanded", "false");
    }
  });

  // Global quick search.
  const search = document.querySelector("#globalSearch");
  search?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const query = search.value.trim().toLowerCase();
    const destinations = [
      ["ai", "pages/ai-chat.html"], ["chat", "pages/ai-chat.html"],
      ["json", "pages/json-formatter.html"], ["html", "pages/html-formatter.html"],
      ["css", "pages/css-formatter.html"], ["javascript", "pages/js-formatter.html"],
      ["js formatter", "pages/js-formatter.html"], ["regex", "pages/regex-tester.html"],
      ["playground", "pages/playground.html"], ["project", "pages/project-generator.html"],
      ["generator", "pages/code-generator.html"], ["debug", "pages/debugger.html"],
      ["history", "pages/history.html"], ["documentation", "pages/documentation.html"],
      ["settings", "pages/settings.html"]
    ];
    const match = destinations.find(([key]) => query.includes(key));
    if (match) window.location.href = match[1];
    else if (query) window.alert(`Belum ada hasil untuk “${search.value}”. Coba: AI, JSON, HTML, CSS, Playground, History, atau Settings.`);
  });

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      search?.focus();
    }
  });
})();
