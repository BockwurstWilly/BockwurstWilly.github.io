// Renders the project list from projects.js and fills in the latest
// GitHub release for each project. Without JS or without API access,
// every Download button still leads to the project's releases page.

function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    if (k === "class") el.className = v;
    else el.setAttribute(k, v);
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid == null) continue;
    el.append(kid instanceof Node ? kid : document.createTextNode(kid));
  }
  return el;
}

function formatSize(bytes) {
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(bytes >= 10485760 ? 0 : 1) + " MB";
  return Math.max(1, Math.round(bytes / 1024)) + " KB";
}

function projectRow(p) {
  const releases = `https://github.com/${GITHUB_USER}/${p.repo}/releases/latest`;

  const facts = h("dl", { class: "facts" },
    p.facts.map(([k, v]) => [h("dt", {}, k), h("dd", {}, v)]));

  let latest = null;
  if (p.asset) {
    latest = h("dd", { "data-latest": "" }, "See releases");
    facts.append(h("dt", {}, "Latest"), latest);
  }

  const actions = h("div", { class: "actions" });
  let button = null;
  if (p.asset) {
    button = h("a", { class: "btn", href: releases }, "Download");
    actions.append(button);
  }
  for (const [label, url] of p.links) {
    actions.append(h("a", { class: "link", href: url }, label));
  }

  const media = p.image
    ? h("div", { class: "shot" }, h("img", { src: p.image, alt: p.imageAlt || "", decoding: "async" }))
    : h("div", { class: "shot panel", "aria-hidden": "true" }, h("span", {}, p.title));

  const row = h("article", { class: "project", id: p.repo.toLowerCase() },
    h("div", { class: "body" },
      h("p", { class: "kind" }, p.kind),
      h("h3", {}, p.title),
      h("p", { class: "text" }, p.text),
      facts,
      actions,
      p.note ? h("p", { class: "note" }, p.note) : null),
    media);

  if (p.asset) loadRelease(p, button, latest);
  return row;
}

// Always asks GitHub for the latest release. The last answer is kept in
// localStorage only as a fallback, e.g. when the API rate limit is hit.
async function loadRelease(p, button, latest) {
  const key = "release:" + p.repo;
  const show = rel => {
    const asset = rel.assets.find(a => p.asset.test(a.name)) || rel.assets[0];
    if (!asset) return;
    button.href = asset.url;
    button.textContent = `Download ${rel.tag}`;
    latest.textContent = `${rel.tag} · ${asset.name} · ${formatSize(asset.size)}`;
  };

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${p.repo}/releases/latest`,
      { headers: { Accept: "application/vnd.github+json" }, cache: "no-cache" });
    if (!res.ok) throw new Error(res.status);
    const j = await res.json();
    const rel = {
      tag: j.tag_name,
      assets: (j.assets || []).map(a => ({ name: a.name, url: a.browser_download_url, size: a.size })),
    };
    show(rel);
    try { localStorage.setItem(key, JSON.stringify(rel)); } catch (_) {}
  } catch (_) {
    try {
      const old = JSON.parse(localStorage.getItem(key) || "null");
      if (old) show(old);
    } catch (_) {}
  }
}

let rowIndex = 0;

function render() {
  const nav = document.getElementById("catnav");
  const root = document.getElementById("projects");
  for (const c of CATEGORIES) {
    const list = PROJECTS.filter(p => p.category === c.id);
    if (!list.length) continue;
    nav.append(h("a", { href: "#" + c.id }, c.title, h("span", {}, String(list.length))));
    root.append(h("section", { class: "category", id: c.id },
      h("header", { class: "cat-head" },
        h("h2", {}, c.title),
        h("p", {}, c.blurb)),
      list.map(p => { const r = projectRow(p); if (rowIndex++ % 2 === 0) r.classList.add("flip"); return r; })));
  }
  document.getElementById("count").textContent = PROJECTS.length;
  document.getElementById("year").textContent = new Date().getFullYear();
}

render();
