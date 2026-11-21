// Renders the project list from projects.js as tiles per category and fills in
// the latest GitHub release for each project. "Details" opens the long text,
// facts and links in a panel under the tile's row. Without JS or without API
// access, every Download button still leads to the project's releases page.

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

let openTile = null;

function closeDetail() {
  if (!openTile) return;
  openTile.tile.classList.remove("open");
  openTile.toggle.setAttribute("aria-expanded", "false");
  openTile.toggle.textContent = "Details";
  openTile.detail.hidden = true;
  openTile = null;
}

// the detail panel goes after the last tile of the clicked tile's row, so it spans the whole row
function placeDetail(grid, tile, detail) {
  const tiles = [...grid.querySelectorAll(".tile")];
  const top = tile.offsetTop;
  let last = tile;
  for (const t of tiles) if (t.offsetTop === top) last = t;
  last.after(detail);
}

function projectTile(p, grid) {
  const releases = `https://github.com/${GITHUB_USER}/${p.repo}/releases/latest`;
  const id = p.repo.toLowerCase();

  const facts = h("dl", { class: "facts" },
    p.facts.map(([k, v]) => [h("dt", {}, k), h("dd", {}, v)]));
  let latest = null;
  if (p.asset) {
    latest = h("dd", { "data-latest": "" }, "See releases");
    facts.append(h("dt", {}, "Latest"), latest);
  }

  let button = null;
  if (p.asset) button = h("a", { class: "btn", href: releases }, "Download");
  const toggle = h("button", { class: "more", type: "button", "aria-expanded": "false", "aria-controls": id + "-detail" }, "Details");

  const media = p.image
    ? h("div", { class: "shot" }, h("img", { src: p.image, alt: p.imageAlt || "", decoding: "async", loading: "lazy" }))
    : h("div", { class: "shot panel", "aria-hidden": "true" }, h("span", {}, p.title));

  const tile = h("article", { class: "tile", id },
    media,
    h("div", { class: "tile-body" },
      h("p", { class: "kind" }, p.kind),
      h("h3", {}, p.title),
      h("p", { class: "teaser" }, p.text),
      h("div", { class: "actions" }, button, toggle)));

  const links = h("div", { class: "actions" },
    p.links.map(([label, url]) => h("a", { class: "link", href: url }, label)));
  const detail = h("div", { class: "detail", id: id + "-detail", hidden: "" },
    h("div", { class: "detail-text" },
      h("h4", {}, p.title),
      h("p", { class: "text" }, p.text),
      links,
      p.note ? h("p", { class: "note" }, p.note) : null),
    facts);

  toggle.addEventListener("click", () => {
    const wasOpen = openTile && openTile.tile === tile;
    closeDetail();
    if (wasOpen) return;
    placeDetail(grid, tile, detail);
    detail.hidden = false;
    tile.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.textContent = "Close";
    openTile = { tile, toggle, detail, grid };
  });

  if (p.asset) loadRelease(p, button, latest);
  return tile;
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

function render() {
  const nav = document.getElementById("catnav");
  const root = document.getElementById("projects");
  for (const c of CATEGORIES) {
    const list = PROJECTS.filter(p => p.category === c.id);
    if (!list.length) continue;
    nav.append(h("a", { href: "#" + c.id }, c.title, h("span", {}, String(list.length))));
    const grid = h("div", { class: "grid" });
    for (const p of list) grid.append(projectTile(p, grid));
    root.append(h("section", { class: "category", id: c.id },
      h("header", { class: "cat-head" },
        h("h2", {}, c.title),
        h("p", {}, c.blurb)),
      grid));
  }
  document.getElementById("count").textContent = PROJECTS.length;
  document.getElementById("year").textContent = new Date().getFullYear();
  // a link to a project (#repo-name) opens its details
  const target = location.hash && document.querySelector(location.hash + ".tile .more");
  if (target) target.click();
  // the row layout changes with the window width: the open panel moves along
  addEventListener("resize", () => { if (openTile) placeDetail(openTile.grid, openTile.tile, openTile.detail); });
}

render();
