/*
 * Reads js/config.js and renders every data-driven part of the page,
 * then wires up the menu, tabs, workflow toggles and scroll behaviour.
 */

(function () {
  "use strict";

  var cfg = window.PORTFOLIO_CONFIG;
  if (!cfg) return;

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var esc = function (value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[ch];
    });
  };

  var pad = function (n) { return n < 10 ? "0" + n : String(n); };

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.documentElement.classList.add("js");

  /* ---------------- head / SEO ---------------- */

  if (cfg.profile.pageTitle) document.title = cfg.profile.pageTitle;

  function setMeta(selector, content) {
    if (!content) return;
    var el = $(selector);
    if (el) el.setAttribute("content", content);
  }

  setMeta('meta[name="description"]', cfg.profile.metaDescription);
  setMeta('meta[property="og:title"]', cfg.profile.pageTitle);
  setMeta('meta[property="og:description"]', cfg.profile.metaDescription);

  /* ---------------- simple text bindings ---------------- */

  function fill(selector, value) {
    if (!value) return;
    $$(selector).forEach(function (el) { el.textContent = value; });
  }

  fill('[data-field="profile.initials"]', cfg.profile.initials);
  fill('[data-field="profile.name"]', cfg.profile.name);
  fill('[data-field="profile.title"]', cfg.profile.title);
  fill('[data-field="profile.tagline"]', cfg.profile.tagline);
  fill('[data-field="profile.heroDescription"]', cfg.profile.heroDescription);
  fill('[data-field="about.text"]', cfg.about.text);
  fill('[data-field="contact.heading"]', cfg.contact.heading);
  fill('[data-field="contact.invitation"]', cfg.contact.invitation);

  /* ---------------- portrait ---------------- */

  var portraitFrame = $(".portrait");
  if (portraitFrame && cfg.profile.profileImage) {
    var portraitImg = document.createElement("img");
    portraitImg.className = "portrait__img";
    portraitImg.id = "portrait";
    portraitImg.setAttribute("src", cfg.profile.profileImage);
    portraitImg.setAttribute("alt", cfg.profile.profileImageAlt || cfg.profile.name);
    portraitImg.setAttribute("width", "1600");
    portraitImg.setAttribute("height", "1600");
    portraitImg.setAttribute("loading", "eager");
    portraitImg.setAttribute("fetchpriority", "high");
    portraitFrame.insertBefore(portraitImg, portraitFrame.firstChild);
  } else {
    var media = $(".hero__media");
    if (media) media.hidden = true;
  }

  /* ---------------- link helpers ---------------- */

  function externalLink(url) {
    return ' href="' + esc(url) + '" target="_blank" rel="noopener noreferrer"';
  }

  function socialTargets() {
    var links = [];
    if (cfg.profile.github) {
      links.push({ key: "github", label: "GitHub", url: cfg.profile.github, icon: true });
    }
    if (cfg.profile.linkedin) {
      links.push({ key: "linkedin", label: "LinkedIn", url: cfg.profile.linkedin });
    }
    if (cfg.profile.email) {
      links.push({ key: "email", label: "Email", url: "mailto:" + cfg.profile.email });
    }
    if (cfg.profile.resume) {
      links.push({ key: "resume", label: "Résumé", url: cfg.profile.resume });
    }
    return links;
  }

  var socials = socialTargets();

  /* sidebar + menu icon links */
  var githubSocial = socials.filter(function (s) { return s.key === "github"; })[0];

  if (githubSocial) {
    var railGithub = $("#railGithub");
    if (railGithub) {
      railGithub.setAttribute("href", githubSocial.url);
      railGithub.setAttribute("target", "_blank");
      railGithub.setAttribute("rel", "noopener noreferrer");
    }
    var menuGithub = $("#menuGithub");
    if (menuGithub) {
      menuGithub.setAttribute("href", githubSocial.url);
      menuGithub.setAttribute("target", "_blank");
      menuGithub.setAttribute("rel", "noopener noreferrer");
    }
  } else {
    var r = $("#railGithub");
    if (r) r.remove();
    var m = $("#menuGithub");
    if (m) m.closest("li").remove();
  }

  /* ---------------- hero ---------------- */

  var chips = $("#heroChips");
  if (chips && cfg.profile.heroChips.length) {
    chips.innerHTML = cfg.profile.heroChips.map(function (label) {
      return '<li class="chip">' + esc(label) + "</li>";
    }).join("");
  }

  var heroActions = $("#heroActions");
  if (heroActions) {
    var buttons = ['<a class="btn btn--primary" href="#projects">Explore My Projects</a>'];
    if (githubSocial) {
      buttons.push(
        '<a class="btn btn--outline"' + externalLink(githubSocial.url) + ">" +
        '<svg class="icon" aria-hidden="true"><use href="#icon-github"></use></svg>GitHub' +
        '<span class="sr-only"> (opens in a new tab)</span></a>'
      );
    }
    heroActions.innerHTML = buttons.join("");
  }

  /* ---------------- about: focus areas ---------------- */

  var focusList = $("#focusList");
  if (focusList) {
    if (cfg.about.focusAreas.length) {
      focusList.innerHTML = cfg.about.focusAreas.map(function (area, i) {
        return '<li><span class="focus-num" aria-hidden="true">' + pad(i + 1) +
          '</span><span class="focus-label">' + esc(area) + "</span></li>";
      }).join("");
    } else {
      focusList.closest(".about__focus").hidden = true;
    }
  }

  /* ---------------- skills tabs ---------------- */

  var tabsRoot = $("#skillsTabs");
  var skillKeys = Object.keys(cfg.skills).filter(function (k) {
    return Array.isArray(cfg.skills[k]) && cfg.skills[k].length > 0;
  });

  if (tabsRoot) {
    if (!skillKeys.length) {
      tabsRoot.closest("section").hidden = true;
    } else {
      var tabButtons = skillKeys.map(function (key, i) {
        var slug = key.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return '<button class="tab" type="button" role="tab" id="tab-' + slug + '"' +
          ' aria-controls="panel-' + slug + '" aria-selected="' + (i === 0) + '"' +
          ' tabindex="' + (i === 0 ? "0" : "-1") + '">' + esc(key) + "</button>";
      }).join("");

      var panels = skillKeys.map(function (key, i) {
        var slug = key.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        var badges = cfg.skills[key].map(function (skill) {
          return "<li>" + esc(skill) + "</li>";
        }).join("");
        return '<div class="tabpanel" role="tabpanel" id="panel-' + slug + '"' +
          ' aria-labelledby="tab-' + slug + '" tabindex="0"' + (i === 0 ? "" : " hidden") + ">" +
          '<ul class="badge-list">' + badges + "</ul></div>";
      }).join("");

      tabsRoot.innerHTML =
        '<div class="tablist" role="tablist" aria-label="Skill categories">' + tabButtons + "</div>" + panels;

      var tabs = $$('.tab', tabsRoot);
      var tabPanels = $$(".tabpanel", tabsRoot);

      function activateTab(index, moveFocus) {
        tabs.forEach(function (tab, i) {
          var selected = i === index;
          tab.setAttribute("aria-selected", String(selected));
          tab.tabIndex = selected ? 0 : -1;
          tabPanels[i].hidden = !selected;
        });
        if (moveFocus) tabs[index].focus();
      }

      tabs.forEach(function (tab, i) {
        tab.addEventListener("click", function () { activateTab(i, false); });
        tab.addEventListener("keydown", function (e) {
          var last = tabs.length - 1;
          var next = null;
          if (e.key === "ArrowRight") next = i === last ? 0 : i + 1;
          else if (e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
          else if (e.key === "Home") next = 0;
          else if (e.key === "End") next = last;
          if (next !== null) {
            e.preventDefault();
            activateTab(next, true);
          }
        });
      });
    }
  }

  /* ---------------- projects ---------------- */

  var projectList = $("#projectList");

  function projectMarkup(p, i) {
    var flip = i % 2 === 1;
    var classes = ["case"];
    if (flip) classes.push("case--flip");
    if (p.featured) classes.push("case--featured");

    var media;
    if (p.image) {
      media = '<img src="' + esc(p.image) + '" alt="Screenshot of ' + esc(p.title) + '"' +
        ' width="' + (p.imageWidth || 1600) + '" height="' + (p.imageHeight || 1000) + '"' +
        ' loading="lazy" decoding="async">';
    }

    var actions = "";
    if (p.live) {
      actions += '<a class="btn btn--primary"' + externalLink(p.live) + ">Live Demo" +
        '<svg class="icon" aria-hidden="true"><use href="#icon-external"></use></svg>' +
        '<span class="sr-only"> (opens in a new tab)</span></a>';
    }
    if (p.github) {
      actions += '<a class="btn btn--outline"' + externalLink(p.github) + ">View Source on GitHub" +
        '<span class="sr-only"> (opens in a new tab)</span></a>';
    }

    var featuredTag = p.featured ? '<span class="badge badge--featured">Featured</span>' : "";

    var workflow = "";
    if (p.workflow && p.workflow.length) {
      var panelId = "workflow-" + i;
      workflow =
        '<button class="wf-toggle" type="button" aria-expanded="false" aria-controls="' + panelId + '">' +
        'How it works<svg class="icon" aria-hidden="true"><use href="#icon-chevron"></use></svg></button>' +
        '<div class="wf-panel" id="' + panelId + '" hidden><ol class="wf-list">' +
        p.workflow.map(function (step, s) {
          return '<li><span class="wf-num" aria-hidden="true">' + pad(s + 1) + "</span>" + esc(step) + "</li>";
        }).join("") +
        "</ol></div>";
    }

    return '<article class="' + classes.join(" ") + '" data-reveal>' +
      '<div class="case__media">' +
        '<div class="browser">' +
          '<div class="browser__bar" aria-hidden="true">' +
            '<span class="browser__dot"></span><span class="browser__dot"></span><span class="browser__dot"></span>' +
          "</div>" +
          '<div class="browser__view">' + (media || "") + "</div>" +
        "</div>" +
      "</div>" +
      '<div class="case__body">' +
        '<div class="case__meta"><span class="badge">' + esc(p.type) + "</span>" + featuredTag + "</div>" +
        '<h3 class="case__title">' + esc(p.title) + "</h3>" +
        '<p class="case__desc">' + esc(p.description) + "</p>" +
        '<ul class="case__tech">' + p.tech.map(function (t) {
          return '<li class="badge badge--quiet">' + esc(t) + "</li>";
        }).join("") + "</ul>" +
        (actions ? '<div class="case__actions">' + actions + "</div>" : "") +
        workflow +
      "</div>" +
      "</article>";
  }

  if (projectList) {
    if (cfg.projects.length) {
      projectList.innerHTML = cfg.projects.map(projectMarkup).join("");

      $$(".wf-toggle", projectList).forEach(function (btn) {
        btn.addEventListener("click", function () {
          var panel = document.getElementById(btn.getAttribute("aria-controls"));
          var open = btn.getAttribute("aria-expanded") === "true";
          btn.setAttribute("aria-expanded", String(!open));
          if (panel) panel.hidden = open;
        });
      });
    } else {
      projectList.closest("section").hidden = true;
    }
  }

  /* ---------------- how I build (from the featured workflow) ---------------- */

  var buildSteps = $("#buildSteps");
  if (buildSteps) {
    var source = cfg.projects.filter(function (p) { return p.featured; })[0] || cfg.projects[0];
    var flow = source && source.workflow ? source.workflow : [];

    if (flow.length) {
      buildSteps.innerHTML = flow.map(function (step, i) {
        return '<li class="step" data-reveal>' +
          '<span class="step__num" aria-hidden="true">' + pad(i + 1) + "</span>" +
          '<p class="step__text">' + esc(step) + "</p></li>";
      }).join("");
    } else {
      buildSteps.closest("section").hidden = true;
    }
  }

  /* ---------------- experience and training ---------------- */

  var timeline = $("#experienceList");
  if (timeline) {
    var roles = cfg.experience.slice();
    if (cfg.profile.otherExperience && cfg.profile.otherExperience.length) {
      roles = roles.concat(cfg.profile.otherExperience);
    }

    if (roles.length) {
      timeline.innerHTML = roles.map(function (role) {
        var tag = role.tag ? '<span class="badge">' + esc(role.tag) + "</span>" : "";
        var org = role.organisation ? '<span class="timeline__org">' + esc(role.organisation) + "</span>" : "";
        return '<li class="timeline__item" data-reveal>' +
          '<span class="timeline__dot" aria-hidden="true"></span>' +
          '<div class="timeline__meta">' + tag + org + "</div>" +
          '<h3 class="timeline__title">' + esc(role.program) + "</h3>" +
          '<p class="timeline__text">' + esc(role.description) + "</p>" +
          "</li>";
      }).join("");
    } else {
      timeline.closest("section").hidden = true;
    }
  }

  /* ---------------- contact actions ---------------- */

  var contactActions = $("#contactActions");
  if (contactActions) {
    contactActions.innerHTML = socials.map(function (s, i) {
      var style = i === 0 ? "btn--accent" : "btn--outline";
      var icon = s.icon
        ? '<svg class="icon" aria-hidden="true"><use href="#icon-github"></use></svg>'
        : "";
      var newTab = s.url.indexOf("mailto:") === 0 ? "" :
        '<span class="sr-only"> (opens in a new tab)</span>';
      return '<a class="btn ' + style + '"' + externalLink(s.url) + ">" +
        icon + esc(s.label) + newTab + "</a>";
    }).join("");
  }

  /* contact facts: phone (tap-to-call) and location */

  var contactFacts = $("#contactFacts");
  if (contactFacts) {
    var facts = [];
    if (cfg.profile.phone) {
      facts.push({
        label: "Phone",
        value: cfg.profile.phone,
        href: "tel:" + cfg.profile.phone.replace(/[^\d+]/g, "")
      });
    }
    if (cfg.profile.location) {
      facts.push({ label: "Location", value: cfg.profile.location });
    }

    if (facts.length) {
      contactFacts.innerHTML = facts.map(function (f) {
        var value = f.href
          ? '<a class="fact__value" href="' + esc(f.href) + '">' + esc(f.value) + "</a>"
          : '<span class="fact__value">' + esc(f.value) + "</span>";
        return '<li class="fact"><span class="fact__label">' + esc(f.label) +
          "</span>" + value + "</li>";
      }).join("");
    } else {
      contactFacts.hidden = true;
    }
  }

  /* ---------------- footer year ---------------- */

  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------- mobile menu ---------------- */

  var menuToggle = $("#menuToggle");
  var mobileMenu = $("#mobileMenu");
  var content = $(".content");
  var menuOpen = false;

  function setMenu(open, restoreFocus) {
    if (!menuToggle || !mobileMenu) return;
    menuOpen = open;
    mobileMenu.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
    if (content) content.inert = open;

    if (open) {
      var first = mobileMenu.querySelector("a");
      if (first) first.focus();
    } else if (restoreFocus) {
      menuToggle.focus();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", function () { setMenu(!menuOpen, menuOpen); });
  }

  if (mobileMenu) {
    mobileMenu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false, false);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menuOpen) setMenu(false, true);
  });

  var desktopQuery = window.matchMedia("(min-width: 900px)");
  var onViewportChange = function (e) { if (e.matches && menuOpen) setMenu(false, false); };
  if (desktopQuery.addEventListener) desktopQuery.addEventListener("change", onViewportChange);
  else if (desktopQuery.addListener) desktopQuery.addListener(onViewportChange);

  /* ---------------- scroll reveal + active nav ---------------- */

  var revealEls = $$("[data-reveal]");

  function showAll() {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  if (!("IntersectionObserver" in window) || reducedMotion.matches) {
    showAll();
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  var navLinks = $$("[data-nav]");

  function setActiveNav(id) {
    navLinks.forEach(function (link) {
      var active = link.getAttribute("data-nav") === id;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window) {
    var sections = $$("main section[id]");
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActiveNav(entry.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (section) { navObserver.observe(section); });
  }
})();
