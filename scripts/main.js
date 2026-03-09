const MODULE_ID = "tile-journal-tooltips";
const TOOLTIP_ID = "tjt-tooltip";

// flags stored on the tile document
const FLAGS = {
  enabled: "enabled",
  journalId: "journalId",
  pageId: "pageId",
  cachedHtml: "cachedHtml",
  cachedTitle: "cachedTitle",
  cachedUpdated: "cachedUpdated" // timestamp (ms)
};

let tooltipEl = null;
let mouseX = 0;
let mouseY = 0;
let hideTimer = null;

// hover tracking (now layer-independent)
let _tjtHover = {
  tileId: null,
  onMove: null,
  onLeave: null
};

/* tooltip DOM */

function ensureTooltipEl() {
  if (tooltipEl) return tooltipEl;
  tooltipEl = document.createElement("div");
  tooltipEl.id = TOOLTIP_ID;
  tooltipEl.style.display = "none";
  document.body.appendChild(tooltipEl);
  return tooltipEl;
}

function positionTooltip() {
  if (!tooltipEl) return;
  const offset = 14;
  tooltipEl.style.left = `${mouseX + offset}px`;
  tooltipEl.style.top = `${mouseY + offset}px`;
}

function showTooltip(html) {
  ensureTooltipEl();

  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }

  tooltipEl.innerHTML = html;
  tooltipEl.style.display = "block";
  positionTooltip();

 
  tooltipEl.getBoundingClientRect();
  tooltipEl.classList.add("visible");
}

function hideTooltip() {
  if (!tooltipEl) return;
  tooltipEl.classList.remove("visible");
  hideTimer = setTimeout(() => {
    if (!tooltipEl) return;
    tooltipEl.style.display = "none";
    tooltipEl.innerHTML = "";
  }, 180);
}

/* journal helpers */

function getJournalPages(journalEntry) {
  const pages = journalEntry?.pages?.contents ?? journalEntry?.pages ?? [];
  return Array.isArray(pages) ? pages : [];
}

function buildJournalOptions(selectedJournalId = "") {
  return game.journal
    .map(j => ({ id: j.id, name: j.name }))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(o => ({ ...o, selected: o.id === selectedJournalId }));
}

function buildPageOptions(journalId = "", selectedPageId = "") {
  if (!journalId) return [];
  const je = game.journal.get(journalId);
  if (!je) return [];

  return getJournalPages(je)
    .map(p => ({ id: p.id, name: p.name }))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(o => ({ ...o, selected: o.id === selectedPageId }));
}

function formatCacheTimestamp(ts) {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return "";
  }
}

function isTokenControlsActive() {
  // confirm token layer is the active layer - fixes for tooltips displaying on any/all active layers (such as lighting or walls)
  if (canvas?.activeLayer && canvas?.tokens) return canvas.activeLayer === canvas.tokens;

  // fallbacks for layer detection
  const name = canvas?.activeLayer?.options?.name ?? "";
  const id = canvas?.activeLayer?.options?.layer ?? "";
  return name === "TokenLayer" || id === "tokens";
}

/* cache logic */

function getCachedTooltip(tileDoc) {
  const enabled = !!tileDoc.getFlag(MODULE_ID, FLAGS.enabled);
  if (!enabled) return null;

  const title = tileDoc.getFlag(MODULE_ID, FLAGS.cachedTitle) ?? "";
  const html = tileDoc.getFlag(MODULE_ID, FLAGS.cachedHtml) ?? "";
  if (!html?.trim()) return null;

  const safeTitle = title
    ? `<div class="tjt-title">${foundry.utils.escapeHTML(title)}</div>`
    : "";

  return `${safeTitle}${html}`;
}

async function clearCache(tileDoc) {
  await tileDoc.unsetFlag(MODULE_ID, FLAGS.cachedHtml);
  await tileDoc.unsetFlag(MODULE_ID, FLAGS.cachedTitle);
  await tileDoc.unsetFlag(MODULE_ID, FLAGS.cachedUpdated);
}

/**
 * GM-only: reads the selected journal entry/page content and caches enriched HTML onto the Tile flags
 * Players will only ever read cachedHtml/cachedTitle from the tile
 */
async function buildCacheFromJournal(tileDoc) {
  if (!game.user.isGM) return;

  const enabled = !!tileDoc.getFlag(MODULE_ID, FLAGS.enabled);
  const journalId = tileDoc.getFlag(MODULE_ID, FLAGS.journalId) ?? "";
  const pageId = tileDoc.getFlag(MODULE_ID, FLAGS.pageId) ?? "";

  if (!enabled || !journalId) {
    await clearCache(tileDoc);
    return;
  }

  const je = game.journal.get(journalId);
  if (!je) {
    await clearCache(tileDoc);
    return;
  }

  const pages = getJournalPages(je);

  let title = je.name;
  let raw = "";

  // if a specific page is selected, prefer it
  if (pageId && pages.length) {
    const page = pages.find(p => p.id === pageId);
    if (page) {
      title = `${je.name}: ${page.name}`;
      raw = page.text?.content ?? "";
    }
  }

  // fallback to first page if present
  if (!raw?.trim() && pages.length) {
    const page0 = pages[0];
    title = `${je.name}: ${page0.name}`;
    raw = page0.text?.content ?? "";
  }

  // fallback to legacy entry content if needed
  if (!raw?.trim()) raw = je.content ?? "";

  if (!raw?.trim()) raw = "<p><em>(Empty Journal content)</em></p>";

  // enrich once as GM and cache the resulting HTML
  const enriched = await TextEditor.enrichHTML(raw, { async: true });

  await tileDoc.setFlag(MODULE_ID, FLAGS.cachedTitle, title);
  await tileDoc.setFlag(MODULE_ID, FLAGS.cachedHtml, enriched);
  await tileDoc.setFlag(MODULE_ID, FLAGS.cachedUpdated, Date.now());
}

function tooltipFlagsTouched(change) {
  const base = `flags.${MODULE_ID}`;
  const enabled = foundry.utils.getProperty(change, `${base}.${FLAGS.enabled}`);
  const journalId = foundry.utils.getProperty(change, `${base}.${FLAGS.journalId}`);
  const pageId = foundry.utils.getProperty(change, `${base}.${FLAGS.pageId}`);
  return enabled !== undefined || journalId !== undefined || pageId !== undefined;
}

/* tileConfig tab injection */

Hooks.once("init", async () => {
  // preload HBS
  await loadTemplates([`modules/${MODULE_ID}/templates/tile-tooltip-tab.hbs`]);
});

// detect the existing tab group from <a data-group="sheet"...> and inject tab + panel.
function addTooltipTabToTileConfig(app, html) {
  const root = html instanceof HTMLElement ? html : html?.[0];
  if (!root) return;

  
  const nav = root.querySelector('nav.sheet-tabs.tabs[data-application-part="tabs"], nav.sheet-tabs.tabs, nav.tabs');
  if (!nav) return;

  
  const firstTabAnchor = nav.querySelector('a[data-action="tab"][data-group], a[data-group]');
  const group = firstTabAnchor?.dataset?.group ?? "sheet";

  // prevent duplicates
  if (nav.querySelector(`a[data-tab="${MODULE_ID}"]`) || root.querySelector(`.tab[data-tab="${MODULE_ID}"]`)) return;

  // find existing panel for the group and use its parent as container
  const existingPanel = root.querySelector(`.tab[data-group="${group}"]`);
  const panelContainer = existingPanel?.parentElement;
  if (!panelContainer) return;

  const tileDoc = app.object ?? app.document ?? app.tile?.document;
  if (!tileDoc) return;

  const enabled = !!tileDoc.getFlag(MODULE_ID, FLAGS.enabled);
  const selectedJournalId = tileDoc.getFlag(MODULE_ID, FLAGS.journalId) ?? "";
  const selectedPageId = tileDoc.getFlag(MODULE_ID, FLAGS.pageId) ?? "";

  const journalOptions = buildJournalOptions(selectedJournalId);
  const pageOptions = buildPageOptions(selectedJournalId, selectedPageId);
  const hasJournal = !!selectedJournalId;

  const cachedHtml = tileDoc.getFlag(MODULE_ID, FLAGS.cachedHtml) ?? "";
  const hasCache = !!cachedHtml?.trim();
  const cacheUpdated = formatCacheTimestamp(tileDoc.getFlag(MODULE_ID, FLAGS.cachedUpdated));

  // add tab button use v13 format
  const a = document.createElement("a");
  a.dataset.action = "tab";
  a.dataset.group = group;
  a.dataset.tab = MODULE_ID;
  a.innerHTML = `<i class="fa-solid fa-comment-dots" inert=""></i><span>Tooltip</span>`;
  nav.appendChild(a);

  // render panel
  const tplPath = `modules/${MODULE_ID}/templates/tile-tooltip-tab.hbs`;

  renderTemplate(tplPath, {
    enabled,
    journalOptions,
    pageOptions,
    hasJournal,
    hasCache,
    cacheUpdated
  })
    .then(markup => {
      if (!markup || !markup.trim()) throw new Error("Template rendered empty markup");

      const wrapper = document.createElement("div");
      wrapper.innerHTML = markup.trim();

      const panel = wrapper.firstElementChild;
      if (!panel) throw new Error("Template produced no root element");

      panel.classList.add("tab", "scrollable");
      panel.dataset.group = group;
      panel.dataset.tab = MODULE_ID;
      panel.dataset.applicationPart = MODULE_ID;

      panelContainer.appendChild(panel);

      // live page dropdown update on journal change
      const journalSelect = panel.querySelector("select.tjt-journal");
      const pageSelect = panel.querySelector("select.tjt-page");

      if (journalSelect && pageSelect) {
        const refillPages = (journalId) => {
          pageSelect.innerHTML = "";

          const opt0 = document.createElement("option");
          opt0.value = "";
          opt0.textContent = "— First Page / Entry Content —";
          pageSelect.appendChild(opt0);

          const opts = buildPageOptions(journalId, "");
          for (const o of opts) {
            const opt = document.createElement("option");
            opt.value = o.id;
            opt.textContent = o.name;
            pageSelect.appendChild(opt);
          }

          pageSelect.disabled = !journalId;
          pageSelect.value = "";
        };

        journalSelect.addEventListener("change", (ev) => refillPages(ev.target.value ?? ""));
      }

      // rebind tab controller(s)
      try {
        if (app._tabs) {
          for (const t of Object.values(app._tabs)) t?.bind?.(root);
        }
        if (app.tabs?.bind) app.tabs.bind(root);
      } catch (e) {
        console.warn(`${MODULE_ID} | Failed to rebind tabs`, e);
      }
    })
    .catch(err => {
      console.error(`${MODULE_ID} | Failed to render template at ${tplPath}`, err);
    });
}

/* hover detection (limit to token controls layer) - fixes for tooltips diplaying on all layers */

/**
 * Point in rotated rectangle (handles rotated tiles)
 */
function pointInRotatedRect(px, py, rectX, rectY, w, h, rotDeg) {
  const cx = rectX + w / 2;
  const cy = rectY + h / 2;

  // translate point to rect center
  let dx = px - cx;
  let dy = py - cy;

  // rotate point by -rot
  const r = (-rotDeg * Math.PI) / 180;
  const cos = Math.cos(r);
  const sin = Math.sin(r);
  const rx = dx * cos - dy * sin;
  const ry = dx * sin + dy * cos;

  return Math.abs(rx) <= w / 2 && Math.abs(ry) <= h / 2;
}

/**
 * find the "topmost" tooltip-enabled tile at canvas coords (x,y).
 * use reverse iteration as a good approximation of draw order.
 */
function getTopmostTooltipTileAt(x, y) {
  const tiles = canvas?.tiles?.placeables;
  if (!tiles?.length) return null;

  // create a stable list sorted by draw-ish priority
  const ordered = tiles
    .map((t, idx) => ({ t, idx, d: t.document }))
    .filter(o => !!o.d)
    .sort((a, b) => {
      const sa = a.d.sort ?? 0;
      const sb = b.d.sort ?? 0;
      if (sa !== sb) return sa - sb;      // lower first
      return a.idx - b.idx;               // stable
    });

  // iterate reverse: topmost first
  for (let i = ordered.length - 1; i >= 0; i--) {
    const { t, d } = ordered[i];

    const enabled = !!d.getFlag(MODULE_ID, FLAGS.enabled);
    if (!enabled) continue;

    const cached = d.getFlag(MODULE_ID, FLAGS.cachedHtml);
    if (!cached || !cached.trim()) continue;

    // optional: don't show hidden tiles to players
    if (d.hidden && !game.user.isGM) continue;

    // quick AABB reject
    const withinAABB =
      x >= d.x && x <= d.x + d.width &&
      y >= d.y && y <= d.y + d.height;

    const rot = d.rotation ?? 0;
    if (!withinAABB && rot === 0) continue;

    const hit = rot
      ? pointInRotatedRect(x, y, d.x, d.y, d.width, d.height, rot)
      : withinAABB;

    if (!hit) continue;

    return t;
  }

  return null;
}

function attachCanvasHoverListener() {
  if (!canvas?.stage || !canvas?.app?.view) return;

  // remove previous listeners
  if (_tjtHover.onMove) canvas.stage.off("pointermove", _tjtHover.onMove);
  if (_tjtHover.onLeave) canvas.app.view.removeEventListener("mouseleave", _tjtHover.onLeave);

  _tjtHover.tileId = null;

  // ensure stage receives pointer events everywhere (even over empty space)
  try {
    // PIXI v7: eventMode replaces "interactive"
    canvas.stage.eventMode = "static";
    // retrieve canvas dimensions for the current scene
    const w = canvas.dimensions?.width ?? canvas.scene?.dimensions?.width ?? 0;
    const h = canvas.dimensions?.height ?? canvas.scene?.dimensions?.height ?? 0;
    if (w && h) canvas.stage.hitArea = new PIXI.Rectangle(0, 0, w, h);
  } catch (e) {
    console.warn(`${MODULE_ID} | Could not set stage hitArea/eventMode`, e);
  }

  _tjtHover.onMove = (ev) => {
    // only display tooltips when Token Controls are active - previously tooltips would display regardless of active layer
    if (!isTokenControlsActive()) {
        if (_tjtHover.tileId) {
        _tjtHover.tileId = null;
        hideTooltip();
        }
    return;
    }

    // ev.global is renderer space; convert to scene/canvas space:
    // stage.toLocal accounts for pan/zoom transforms.
    
    const g = ev?.global ?? ev?.data?.global;
    if (!g) return;

    const p = canvas.stage.toLocal(g); // <-- critical fix
    const x = p.x;
    const y = p.y;

    const tile = getTopmostTooltipTileAt(x, y);
    const tileDoc = tile?.document;

    if (!tileDoc) {
      if (_tjtHover.tileId) {
        _tjtHover.tileId = null;
        hideTooltip();
      }
      return;
    }

    if (_tjtHover.tileId !== tileDoc.id) {
      _tjtHover.tileId = tileDoc.id;
      const html = getCachedTooltip(tileDoc);
      if (!html) return hideTooltip();
      showTooltip(html);
    }
  };

  _tjtHover.onLeave = () => {
    _tjtHover.tileId = null;
    hideTooltip();
  };

  canvas.stage.on("pointermove", _tjtHover.onMove);
  canvas.app.view.addEventListener("mouseleave", _tjtHover.onLeave);
}

/* hooks  */

Hooks.once("ready", () => {
  // track browser mouse for tooltip positioning near cursor
  window.addEventListener("mousemove", (ev) => {
    mouseX = ev.clientX;
    mouseY = ev.clientY;
    if (tooltipEl?.style.display === "block") positionTooltip();
  });

  // gm caching: when tooltip flags change (usually saving TileConfig), rebuild cache
  Hooks.on("updateTile", async (tileDoc, change) => {
    if (!tooltipFlagsTouched(change)) return;
    await buildCacheFromJournal(tileDoc);
  });
});

// inject tab into both core TileConfig and Monk's Active Tiles config (if present)
Hooks.on("renderTileConfig", (app, html) => addTooltipTabToTileConfig(app, html));
Hooks.on("renderActiveTileConfig", (app, html) => addTooltipTabToTileConfig(app, html));

// attach layer-independent hover detection whenever the canvas is ready
Hooks.on("canvasReady", () => {
  attachCanvasHoverListener();
});
