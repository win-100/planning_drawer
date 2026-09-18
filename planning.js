const NS = "http://www.w3.org/2000/svg";
const LIBRARY_KEY = "planningLibrary";
const svg = document.getElementById("planning");
const editor = document.getElementById("editor");
const workspace = document.getElementById("workspace");
const saveButton = document.getElementById("btnSave");
const saveLabel = document.getElementById("saveLabel");
const addButton = document.getElementById("btnAdd");
const addOptionsButton = document.getElementById("btnAddOptions");
const addMenu = document.getElementById("addMenu");
const todayLineToggle = document.getElementById("toggleTodayLine");
const dateDependenciesToggle = document.getElementById("toggleDateDependencies");
const gridTimelineLevel = document.getElementById("gridTimelineLevel");
const timelineLocale = document.getElementById("timelineLocale");
const themeButton = document.getElementById("btnTheme");
// A theme only contains semantic colour roles.  Planning objects may reference
// one with "@primary" etc.; an ordinary #RRGGBB value is deliberately kept as
// an element-level override.
const THEME_PRESETS = {
  ocean: { name: "Océan", colors: { primary: "#22a79f", primaryStrong: "#147b75", primarySoft: "#c8ece9", secondary: "#5877c8", secondaryStrong: "#385a9f", secondarySoft: "#dfe7f7", accent: "#e8ad72", accentSoft: "#f4cfad", text: "#101820", textSecondary: "#5f6b72", textOnDark: "#ffffff", neutral: "#8c9397", neutralSoft: "#e9edef", surface: "#ffffff", surfaceAlt: "#f7fafa", border: "#cbd4d6", danger: "#ef2d20", warning: "#c96a12", success: "#168f88" } },
  indigo: { name: "Indigo", colors: { primary: "#6366f1", primaryStrong: "#4338ca", primarySoft: "#e0e7ff", secondary: "#0f8b8d", secondaryStrong: "#0f6669", secondarySoft: "#d9f2f2", accent: "#db2777", accentSoft: "#fce7f3", text: "#172033", textSecondary: "#526174", textOnDark: "#ffffff", neutral: "#94a3b8", neutralSoft: "#e8edf4", surface: "#ffffff", surfaceAlt: "#f8faff", border: "#cbd5e1", danger: "#dc2626", warning: "#b7791f", success: "#16845b" } },
  forest: { name: "Forêt", colors: { primary: "#2f855a", primaryStrong: "#166534", primarySoft: "#dcfce7", secondary: "#5c6ec0", secondaryStrong: "#3f4f95", secondarySoft: "#e2e7f7", accent: "#ca8a04", accentSoft: "#fef3c7", text: "#17221a", textSecondary: "#52635a", textOnDark: "#ffffff", neutral: "#94a3a0", neutralSoft: "#eaf0eb", surface: "#ffffff", surfaceAlt: "#f8fcf8", border: "#cbd8ce", danger: "#dc2626", warning: "#b7791f", success: "#16845b" } },
  sunset: { name: "Coucher de soleil", colors: { primary: "#ea580c", primaryStrong: "#c2410c", primarySoft: "#ffedd5", secondary: "#537fa8", secondaryStrong: "#345a80", secondarySoft: "#dfeaf2", accent: "#be185d", accentSoft: "#fce7f3", text: "#2b1b14", textSecondary: "#6f625b", textOnDark: "#fffdf9", neutral: "#a8a29e", neutralSoft: "#f1efed", surface: "#fffdf9", surfaceAlt: "#fff8f1", border: "#ded3ca", danger: "#dc2626", warning: "#b7791f", success: "#16845b" } }
};
// Roles are semantic: the palette covers content, neutral UI and status
// colours without prescribing where each one is used.
const THEME_COLOR_OPTIONS = [["primary", "Principale"], ["primaryStrong", "Principale — foncée"], ["primarySoft", "Principale — claire"], ["secondary", "Secondaire"], ["secondaryStrong", "Secondaire — foncée"], ["secondarySoft", "Secondaire — claire"], ["accent", "Accent"], ["accentSoft", "Accent — clair"], ["text", "Texte principal"], ["textSecondary", "Texte secondaire"], ["textOnDark", "Texte sur fond sombre"], ["neutral", "Gris neutre"], ["neutralSoft", "Gris neutre — clair"], ["surface", "Fond principal"], ["surfaceAlt", "Fond alternatif"], ["border", "Bordure / quadrillage"], ["danger", "Alerte / échéance critique"], ["warning", "Attention"], ["success", "Succès / validation"]];
const THEME_COLOR_GROUPS = [["Principale", ["primary", "primaryStrong", "primarySoft"]], ["Secondaire", ["secondary", "secondaryStrong", "secondarySoft"]], ["Accent", ["accent", "accentSoft"]], ["Texte", ["text", "textSecondary", "textOnDark"]], ["Neutres", ["neutral", "neutralSoft", "border"]], ["Fonds", ["surface", "surfaceAlt"]], ["États", ["danger", "warning", "success"]]];
const THEME_APPEARANCE_OPTIONS = [["timelineYear", "Frise — années"], ["timelineYearAlternate", "Frise — années alternées"], ["timelineQuarter", "Frise — trimestres"], ["timelineQuarterAlternate", "Frise — trimestres alternés"], ["timelineMonth", "Frise — mois"], ["timelineMonthAlternate", "Frise — mois alternés"], ["timelineWeek", "Frise — semaines"], ["timelineWeekAlternate", "Frise — semaines alternées"], ["timelineGrid", "Quadrillage vertical"], ["todayLine", "Ligne d’aujourd’hui"], ["dependencyIncoming", "Dépendance entrante"], ["dependencyOutgoing", "Dépendance sortante"], ["dependencyNeutral", "Dépendance neutre"]];
const DEFAULT_THEME_APPEARANCE = { timelineYear: "@primaryStrong", timelineYearAlternate: "@primary", timelineQuarter: "@primaryStrong", timelineQuarterAlternate: "@primaryStrong", timelineMonth: "@primary", timelineMonthAlternate: "@primary", timelineWeek: "@primarySoft", timelineWeekAlternate: "@primarySoft", timelineGrid: "@border", todayLine: "@danger", dependencyIncoming: "@accent", dependencyOutgoing: "@primaryStrong", dependencyNeutral: "@neutral" };
const timelineLevels = [
  { key: "year", toggle: document.getElementById("toggleYearTimeline"), h: 20, fillRole: "timelineYear", altRole: "timelineYearAlternate", cls: "year-label" },
  { key: "quarter", toggle: document.getElementById("toggleQuarterTimeline"), h: 24, fillRole: "timelineQuarter", altRole: "timelineQuarterAlternate", cls: "quarter-label" },
  { key: "month", toggle: document.getElementById("toggleMonthTimeline"), h: 40, fillRole: "timelineMonth", altRole: "timelineMonthAlternate", cls: "month-label" },
  { key: "week", toggle: document.getElementById("toggleWeekTimeline"), h: 22, fillRole: "timelineWeek", altRole: "timelineWeekAlternate", cls: "week-label" }
];
const defaultTimelineSettings = () => ({
  levels: { year: true, quarter: false, month: true, week: false },
  gridLevel: "month",
  showTodayLine: true,
  showDateDependencies: false,
  backgroundColor: "@surface",
  backgroundOpacity: 0
});
const currentPlanningName = document.getElementById("currentPlanningName");
const renamePlanButton = document.getElementById("btnRenamePlan");
const loadButton = document.getElementById("btnLoad");
const loadMenu = document.getElementById("loadMenu");
let planningData, savedPlans = [], activePlanId = null, selection = null, referencePicker = null, editorSide = "right", isDirty = false, importedVersion = false, x, geometry;
// A render-only lane for root-level items and milestones. It deliberately is
// not persisted or exposed in the editor, but uses the same geometry rules as
// a real lane.
const unlanedArea = { _y: 0, _h: 0 };
const editorSectionStates = new Map();

const clone = value => JSON.parse(JSON.stringify(value));
function emptyPlanning() {
  const year = new Date().getFullYear();
  return {
    range: { start: `${year}-01-01`, end: `${year}-12-31` },
    layout: { width: 1500, left: 86, right: 16, topMonths: 8, monthHeight: 40, timelineTop: 58, lanesTop: 160, laneGap: 5, lanePaddingBottom: 10, defaultItemHeight: 30 },
    monthLocale: "fr-FR", items: [], milestones: [], lanes: [], overlays: [], timeline: defaultTimelineSettings(),
    theme: { preset: "ocean", colors: clone(THEME_PRESETS.ocean.colors), appearance: clone(DEFAULT_THEME_APPEARANCE) },
    itemTypes: { task: { fill: "@surface", stroke: "@primary", textColor: "@text", strokeWidth: 1.4, shape: "chevron", h: 30, textClass: "task-label" } }
  };
}
function el(name, attrs = {}, text = "") { const node = document.createElementNS(NS, name); Object.entries(attrs).forEach(([k, v]) => v != null && node.setAttribute(k, v)); if (text !== "") node.textContent = text; return node; }
function textLines(parent, lines, cx, y, cls, lineHeight = 13, fill) {
  (Array.isArray(lines) ? lines : [lines]).forEach((line, i) => {
    const node = el("text", { x: cx, y: y + i * lineHeight, "text-anchor": "middle", class: cls }, line);
    // A CSS class supplies the default label color; inline style must win when
    // a shared style explicitly supplies a textColor.
    if (fill) node.style.fill = fill;
    parent.appendChild(node);
  });
}
function ids(data) { data.items ||= []; data.milestones ||= []; data.lanes ||= []; data.overlays ||= []; data.items.forEach((v, i) => v.id ||= `item-${i}`); data.milestones.forEach((v, i) => v.id ||= `global-milestone-${i}`); data.overlays.forEach((v, i) => v.id ||= `overlay-${i}`); data.lanes.forEach((lane, i) => { lane.id ||= `lane-${lane.key || i}`; lane.items ||= []; lane.milestones ||= []; lane.items.forEach((v, n) => v.id ||= `${lane.id}-item-${n}`); lane.milestones.forEach((v, n) => v.id ||= `${lane.id}-milestone-${n}`); }); }
function newId(prefix) { return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`; }
function clampDate(value) { return value < planningData.range.start ? planningData.range.start : value > planningData.range.end ? planningData.range.end : value; }
function defaultDate() { return clampDate(dateIso()); }
function dateAtX(localX) {
  const rangeStart = new Date(`${planningData.range.start}T12:00:00`);
  const rangeEnd = new Date(`${planningData.range.end}T12:00:00`);
  const ratio = Math.max(0, Math.min(1, (localX - geometry.left) / geometry.timelineW));
  return dateIso(new Date(rangeStart.getTime() + (rangeEnd - rangeStart) * ratio));
}
function selectedLane() {
  const found = current();
  return found?.lane || planningData.lanes[0] || null;
}
function finishAdd(type, object, lane) {
  selection = { type, itemId: object.id, laneId: lane?.id };
  referencePicker = null;
  isDirty = true;
  importedVersion = false;
  status();
  render();
  renderEditor();
}
function addPlanningObject(type, context = {}) {
  const start = context.date || defaultDate();
  if (type === "lane") {
    const lane = { id: newId("lane"), key: newId("lane"), label: ["Nouvelle lane"], labelColor: "@primaryStrong", backgroundColor: "@surface", backgroundOpacity: 0.2, items: [], milestones: [] };
    planningData.lanes.push(lane);
    finishAdd("lane", lane, lane);
    return;
  }
  if (type === "milestone") {
    const milestone = { id: newId("global-milestone"), title: ["Nouveau jalon"], date: start, color: "@text" };
    planningData.milestones.push(milestone);
    finishAdd("global-milestone", milestone);
    return;
  }
  if (type === "overlay") {
    const overlay = { id: newId("overlay"), label: "Nouvel overlay", start, end: addDays(start, 14), color: "@neutral", opacity: 0.22 };
    if (overlay.end > planningData.range.end) overlay.end = planningData.range.end;
    planningData.overlays.push(overlay);
    finishAdd("overlay", overlay);
    return;
  }
  const lane = context.lane;
  const item = { id: newId(lane ? `${lane.id}-item` : "item"), label: "Nouvel élément", start, end: addDays(start, 14), yOffset: Math.max(0, Math.round(context.yOffset || 0)), h: planningData.layout.defaultItemHeight ?? 30, type: "task" };
  if (item.end > planningData.range.end) item.end = planningData.range.end;
  (lane ? lane.items : planningData.items).push(item);
  finishAdd("task", item, lane);
}
function objectTitle(object) {
  const value = object.label ?? object.title;
  return Array.isArray(value) ? value.join(" ") : value || "cet objet";
}
function deletionTargets() {
  const found = current();
  if (!found?.object) return [];
  if (selection.type !== "lane") return [{ item: found.object, lane: found.lane }];
  return [
    { item: found.lane, lane: found.lane },
    ...found.lane.items.map(item => ({ item, lane: found.lane })),
    ...found.lane.milestones.map(item => ({ item, lane: found.lane }))
  ];
}
function dateReferenceBase(object, key, offset = 0, seen = new Set()) {
  const node = `${object.id}:${key}`;
  if (seen.has(node)) return null;
  const next = new Set(seen); next.add(node);
  const dependency = dateDependency(object, key);
  const target = dependency && objectById(dependency.objectId);
  if (target) return dateReferenceBase(target.item, dependency.dateKey, offset + (Number(dependency.offsetDays) || 0), next);
  const duration = dateDuration(object, key);
  if (duration != null && dateKeys(object).length === 2) {
    const otherKey = key === "start" ? "end" : "start";
    return dateReferenceBase(object, otherKey, offset + (key === "start" ? -duration : duration), next);
  }
  return { objectId: object.id, dateKey: key, offsetDays: offset };
}
function positionReferenceBase(item) {
  // Reconnect to the reference used by the deleted item itself. That reference
  // remains variable if it is part of a longer chain, while preserving the
  // deleted item's positioning mode (below, centered, or aligned).
  return relativeMode(item) !== "absolute" && item.relativeTo ? itemById(item.relativeTo) : null;
}
function deletionDependencyPlan(targets) {
  const targetIds = new Set(targets.map(target => target.item.id));
  const targetItemIds = new Set(targets.filter(target => "start" in target.item && "end" in target.item).map(target => target.item.id));
  const dateFixes = [];
  const positionFixes = [];
  const outgoing = [];
  allPlanningObjects().forEach(entry => {
    if (targetIds.has(entry.item.id)) {
      dateKeys(entry.item).forEach(key => { if (dateDependency(entry.item, key) && !targetIds.has(dateDependency(entry.item, key).objectId)) outgoing.push("date"); });
      if (entry.item.relativeTo && !targetItemIds.has(entry.item.relativeTo)) outgoing.push("position");
      return;
    }
    dateKeys(entry.item).forEach(key => {
      const dependency = dateDependency(entry.item, key);
      if (dependency && targetIds.has(dependency.objectId)) {
        const target = objectById(dependency.objectId)?.item;
        const base = target && dateReferenceBase(target, dependency.dateKey, Number(dependency.offsetDays) || 0);
        dateFixes.push({ entry, key, value: resolvedDate(entry.item, key), base: base && !targetIds.has(base.objectId) ? base : null });
      }
    });
  });
  allItems().forEach(entry => {
    if (!targetItemIds.has(entry.item.id) && entry.item.relativeTo && targetItemIds.has(entry.item.relativeTo)) {
      const target = itemById(entry.item.relativeTo)?.item;
      const base = target && positionReferenceBase(target);
      positionFixes.push({ entry, yOffset: itemTop(entry.item, entry.lane) - (entry.lane?._y ?? unlanedArea._y), base: base && !targetItemIds.has(base.item.id) ? base : null, mode: target ? relativeMode(target) : "absolute", top: itemTop(entry.item, entry.lane) });
    }
  });
  return { dateFixes, positionFixes, outgoing };
}
function applyDeletionDependencyPlan(plan) {
  plan.dateFixes.forEach(({ entry, key, value, base }) => {
    if (base) {
      entry.item.dateDependencies ||= {};
      entry.item.dateDependencies[key] = base;
    } else {
      entry.item[key] = value;
      delete entry.item.dateDependencies[key];
      if (!Object.keys(entry.item.dateDependencies).length) delete entry.item.dateDependencies;
    }
  });
  plan.positionFixes.forEach(({ entry, yOffset, base, mode, top }) => {
    if (base) {
      entry.item.relativeTo = base.item.id;
      entry.item.yOffsetMode = mode;
      const baseTop = itemTop(base.item, base.lane);
      const anchor = mode === "below" ? baseTop + itemHeight(base.item) : mode === "center" ? baseTop + (itemHeight(base.item) - itemHeight(entry.item)) / 2 : baseTop;
      entry.item.yOffset = Math.round((top - anchor) * 100) / 100;
    } else {
      entry.item.yOffset = Math.max(0, Math.round(yOffset * 100) / 100);
      entry.item.yOffsetMode = "absolute";
      delete entry.item.relativeTo;
    }
  });
}
function removeSelectedObject() {
  const found = current();
  if (!found?.object) return;
  setup();
  const targets = deletionTargets();
  const plan = deletionDependencyPlan(targets);
  const laneContents = selection.type === "lane" ? found.lane.items.length + found.lane.milestones.length : 0;
  const incomingCount = plan.dateFixes.length + plan.positionFixes.length;
  const warnings = [];
  if (laneContents) warnings.push(`Cette lane contient ${laneContents} objet${laneContents > 1 ? "s" : ""} ; ils seront également supprimés.`);
  if (incomingCount) warnings.push(`${incomingCount} dépendance${incomingCount > 1 ? "s" : ""} ${incomingCount > 1 ? "seront raccordées à leur référence de base" : "sera raccordée à sa référence de base"}, avec les offsets cumulés.`);
  if (plan.outgoing.length) warnings.push(`${plan.outgoing.length} dépendance${plan.outgoing.length > 1 ? "s" : ""} portée${plan.outgoing.length > 1 ? "s" : ""} par l’objet supprimé ${plan.outgoing.length > 1 ? "disparaîtront" : "disparaîtra"}.`);
  const message = [`Supprimer définitivement « ${objectTitle(found.object)} » ?`, ...warnings, "Cette action est irréversible."].join("\n\n");
  if (!confirm(message)) return;
  applyDeletionDependencyPlan(plan);
  if (selection.type === "lane") planningData.lanes = planningData.lanes.filter(lane => lane.id !== found.lane.id);
  else if (selection.type === "global-milestone") planningData.milestones = planningData.milestones.filter(item => item.id !== found.object.id);
  else if (selection.type === "overlay") planningData.overlays = planningData.overlays.filter(item => item.id !== found.object.id);
  else if (selection.type === "lane-milestone") found.lane.milestones = found.lane.milestones.filter(item => item.id !== found.object.id);
  else if (found.lane) found.lane.items = found.lane.items.filter(item => item.id !== found.object.id);
  else planningData.items = planningData.items.filter(item => item.id !== found.object.id);
  selection = null;
  referencePicker = null;
  isDirty = true;
  importedVersion = false;
  status();
  render();
  renderEditor();
}
function themeColors() { return planningData.theme?.colors || THEME_PRESETS.ocean.colors; }
function themeAppearance(role) { return planningData.theme?.appearance?.[role] || DEFAULT_THEME_APPEARANCE[role] || "@text"; }
function resolveColor(value, fallback = "#000000") {
  const token = typeof value === "string" && value.match(/^@([A-Za-z][A-Za-z0-9]*)$/);
  const result = token ? themeColors()[token[1]] : value;
  // Preserve CSS colours from older imported files (for example rgb(...)).
  // Theme entries themselves are validated as hexadecimal during normalisation.
  return typeof result === "string" && result.trim() ? result : fallback;
}
function applyThemeToApp() {
  const colors = themeColors();
  Object.entries(colors).forEach(([name, value]) => document.documentElement.style.setProperty(`--theme-${name}`, value));
  document.documentElement.style.setProperty("--teal", colors.primary);
  document.documentElement.style.setProperty("--teal-line", colors.primary);
  document.documentElement.style.setProperty("--teal-light", colors.primarySoft);
}
function style(item) { return { ...(planningData.itemTypes?.[item.type] || {}), ...item }; }
function allLaneItems() { return planningData.lanes.flatMap(lane => lane.items.map(item => ({ item, lane }))); }
function allItems() { return [...planningData.items.map(item => ({ item, lane: null })), ...allLaneItems()]; }
function itemById(id) { return allItems().find(entry => entry.item.id === id); }
function allPlanningObjects() {
  return [
    ...allItems(),
    ...planningData.lanes.flatMap(lane => lane.milestones.map(item => ({ item, lane }))),
    ...planningData.milestones.map(item => ({ item, lane: null })),
    ...planningData.overlays.map(item => ({ item, lane: null }))
  ];
}
function objectById(id) { return allPlanningObjects().find(entry => entry.item.id === id); }
function dateKeys(object) { return "date" in object ? ["date"] : ["start", "end"]; }
function dateKeyLabel(key) { return key === "start" ? "Date de début" : key === "end" ? "Date de fin" : "date"; }
function dateDependency(object, key) { return object.dateDependencies?.[key] || null; }
function dateDuration(object, key) { return Number.isFinite(Number(object.dateDurations?.[key])) ? Number(object.dateDurations[key]) : null; }
function addDays(date, days) { const result = new Date(`${date}T12:00:00`); result.setDate(result.getDate() + (Number(days) || 0)); return dateIso(result); }
function daysBetweenDates(from, to) {
  if (!from || !to) return 0;
  return Math.round((new Date(`${to}T12:00:00`) - new Date(`${from}T12:00:00`)) / 86400000);
}
function currentDateSpan(object) {
  const start = resolvedDate(object, "start"), end = resolvedDate(object, "end");
  if (!start || !end) return 0;
  return Math.max(0, Math.round((new Date(`${end}T12:00:00`) - new Date(`${start}T12:00:00`)) / 86400000));
}
function resolvedDate(object, key, visiting = new Set()) {
  const fallback = object[key];
  const dependency = dateDependency(object, key);
  const duration = dateDuration(object, key);
  const target = dependency && objectById(dependency.objectId);
  const targetKey = dependency?.dateKey;
  const node = `${object.id}:${key}`;
  if (visiting.has(node)) return fallback;
  const next = new Set(visiting); next.add(node);
  if (target && dateKeys(target.item).includes(targetKey)) {
    const base = resolvedDate(target.item, targetKey, next);
    return base ? addDays(base, dependency.offsetDays) : fallback;
  }
  if (duration != null && dateKeys(object).length === 2) {
    const otherKey = key === "start" ? "end" : "start";
    const base = resolvedDate(object, otherKey, next);
    return base ? addDays(base, key === "start" ? -duration : duration) : fallback;
  }
  return fallback;
}
function dateDependencyCreatesCycle(sourceId, sourceKey, targetId, targetKey, visiting = new Set()) {
  const node = `${targetId}:${targetKey}`, source = `${sourceId}:${sourceKey}`;
  if (node === source) return true;
  if (visiting.has(node)) return false;
  const target = objectById(targetId)?.item, dependency = target && dateDependency(target, targetKey);
  if (!dependency) return false;
  const next = new Set(visiting); next.add(node);
  return dateDependencyCreatesCycle(sourceId, sourceKey, dependency.objectId, dependency.dateKey, next);
}
function objectLabel(entry) {
  const object = entry.item;
  const text = object.label ?? object.title;
  return Array.isArray(text) ? text.join(" ") : text || "Sans libellé";
}
function createsReferenceCycle(sourceId, targetId) { let current = itemById(targetId)?.item; const seen = new Set(); while (current?.relativeTo && !seen.has(current.id)) { if (current.id === sourceId) return true; seen.add(current.id); current = itemById(current.relativeTo)?.item; } return current?.id === sourceId; }
function itemHeight(item) { return style(item).h ?? planningData.layout.defaultItemHeight ?? 30; }
function relativeMode(item) { return ["below", "center", "align"].includes(item.yOffsetMode) ? item.yOffsetMode : "absolute"; }
function itemTop(item, lane, visiting = new Set()) {
  const raw = Number(item.yOffset) || 0;
  const mode = relativeMode(item), reference = mode !== "absolute" && item.relativeTo ? itemById(item.relativeTo) : null;
  const container = lane || unlanedArea;
  if (!reference || visiting.has(item.id)) return container._y + raw;
  const next = new Set(visiting); next.add(item.id);
  const referenceTop = itemTop(reference.item, reference.lane, next);
  if (mode === "below") return referenceTop + itemHeight(reference.item) + raw;
  if (mode === "center") return referenceTop + (itemHeight(reference.item) - itemHeight(item)) / 2 + raw;
  return referenceTop + raw;
}
function relativeYOffsetForTop(item, reference, top) {
  const referenceTop = itemTop(reference.item, reference.lane);
  if (relativeMode(item) === "below") return top - referenceTop - itemHeight(reference.item);
  if (relativeMode(item) === "center") return top - referenceTop - (itemHeight(reference.item) - itemHeight(item)) / 2;
  return top - referenceTop;
}
function laneContentHeight(items, milestones, lane, milestoneTopInset = 0) {
  const bottoms = [0, ...items.map(item => itemTop(item, lane) - lane._y + itemHeight(item)), ...milestones.map(item => milestoneTopInset + (Number(item.yOffset) || 0) + milestoneHeight(item))];
  return Math.max(...bottoms) + (planningData.layout.lanePaddingBottom ?? 10);
}
function visibleLevels() { return timelineLevels.filter(v => v.toggle.checked).map(v => ({ ...v, height: planningData.layout[`${v.key}Height`] ?? v.h })); }
function setup() { const c = planningData.layout, levels = visibleLevels(), header = levels.reduce((n, v, i) => n + v.height + (i ? 2 : 0), 0), width = c.width ?? 1500, left = c.left ?? 86, right = c.right ?? 16, start = new Date(`${planningData.range.start}T00:00:00`), end = new Date(`${planningData.range.end}T00:00:00`); x = date => left + ((new Date(`${date}T00:00:00`) - start) / (end - start)) * (width - left - right);
  // Unassigned items use the same vertical positioning model as lane items:
  // start just below the timeline, then apply their yOffset.
  unlanedArea._y = Math.max((c.timelineTop ?? 58), (c.topMonths ?? 8) + header) + (c.laneGap ?? 5);
  const hasUnlanedContent = planningData.items.length || planningData.milestones.length;
  // Global milestones retain their existing visual offset below the timeline;
  // account for that offset while the virtual lane reserves their height.
  const globalMilestoneInset = Math.max(0, 22 - (c.laneGap ?? 5));
  unlanedArea._h = hasUnlanedContent ? laneContentHeight(planningData.items, planningData.milestones, unlanedArea, globalMilestoneInset) : 0;
  // The first lane immediately follows the timeline, unless unassigned items
  // above it require additional space.
  let firstY = unlanedArea._y + unlanedArea._h + (hasUnlanedContent ? c.laneGap ?? 5 : 0), y = firstY;
  planningData.lanes.forEach(lane => { lane._y = y; lane._h = laneContentHeight(lane.items, lane.milestones, lane); y += lane._h + (c.laneGap ?? 5); });
  // A few passes let references work across lanes whose height is itself dynamic.
  for (let pass = 0; pass < 4; pass++) { unlanedArea._h = hasUnlanedContent ? laneContentHeight(planningData.items, planningData.milestones, unlanedArea, globalMilestoneInset) : 0; firstY = unlanedArea._y + unlanedArea._h + (hasUnlanedContent ? c.laneGap ?? 5 : 0); y = firstY; planningData.lanes.forEach(lane => { lane._y = y; lane._h = laneContentHeight(lane.items, lane.milestones, lane); y += lane._h + (c.laneGap ?? 5); }); }
  geometry = { W: width, H: Math.ceil(y + 15), left, timelineW: width - left - right, top: c.topMonths ?? 8, header, timelineTop: Math.max(c.timelineTop ?? 58, (c.topMonths ?? 8) + header), timelineBottom: y - (c.laneGap ?? 5) }; svg.setAttribute("viewBox", `0 0 ${geometry.W} ${geometry.H}`); }
function dateIso(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function week(date) { const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())); d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7)); return Math.ceil(((d - new Date(Date.UTC(d.getUTCFullYear(), 0, 1))) / 86400000 + 1) / 7); }
function timelineLocaleValue() { return planningData.monthLocale || "fr-FR"; }
function quarterLabel(date) { const language = new Intl.Locale(timelineLocaleValue()).language; return `${language === "fr" ? "T" : "Q"}${Math.floor(date.getMonth() / 3) + 1}`; }
function weekLabel(date) { const language = new Intl.Locale(timelineLocaleValue()).language; return `${language === "fr" ? "S" : "W"}${week(date)}`; }
function periods(level) { const start = new Date(`${planningData.range.start}T00:00:00`), end = new Date(`${planningData.range.end}T00:00:00`), output = []; let d, next; if (level === "year") { d = new Date(start.getFullYear(), 0, 1); next = v => new Date(v.getFullYear() + 1, 0, 1); } else if (level === "quarter") { d = new Date(start.getFullYear(), Math.floor(start.getMonth() / 3) * 3, 1); next = v => new Date(v.getFullYear(), v.getMonth() + 3, 1); } else if (level === "week") { d = new Date(start); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); next = v => new Date(v.getFullYear(), v.getMonth(), v.getDate() + 7); } else { d = new Date(start.getFullYear(), start.getMonth(), 1); next = v => new Date(v.getFullYear(), v.getMonth() + 1, 1); } const fmt = new Intl.DateTimeFormat(timelineLocaleValue(), { month: "short" }); const boundedDate = value => { const iso = dateIso(value); return iso < planningData.range.start ? planningData.range.start : iso > planningData.range.end ? planningData.range.end : iso; }; while (d <= end) { output.push([level === "year" ? String(d.getFullYear()) : level === "quarter" ? quarterLabel(d) : level === "week" ? weekLabel(d) : fmt.format(d).replace(/^./, c => c.toUpperCase()), boundedDate(d)]); d = next(d); } output.push(["", boundedDate(d)]); return output; }
function selected(type, id) { return selection?.type === type && selection.itemId === id; }
function group(type, object, lane, center) {
  const selectedItem = selection && ["phase", "task"].includes(selection.type) ? itemById(selection.itemId)?.item : null;
  const selectedObject = current()?.object;
  const dateSource = referencePicker?.kind === "date" ? objectById(referencePicker.sourceId) : null;
  const positionSource = referencePicker?.kind !== "date" ? itemById(referencePicker?.itemId) : null;
  const eligiblePositionReference = positionSource?.lane === lane;
  const dateCandidate = Boolean(dateSource && type !== "lane" && object.id !== dateSource.item.id);
  const positionReference = Boolean(selectedItem?.relativeTo === object.id && editorSectionOpen("Position et dimensions", false));
  const dateReference = Boolean(editorSectionOpen("Informations") && Object.values(selectedObject?.dateDependencies || {}).some(dependency => dependency?.objectId === object.id));
  const pickerReference = referencePicker?.itemId === object.id || dateDependency(dateSource?.item || {}, referencePicker?.key)?.objectId === object.id;
  const candidate = referencePicker?.kind === "date" ? dateCandidate : referencePicker && eligiblePositionReference && ["phase", "task"].includes(type);
  const g = el("g", { class: "planning-item" + (selected(type, object.id) ? " selected" : "") + (positionReference ? " position-reference" : "") + (dateReference ? " date-reference" : "") + (pickerReference ? " relative-reference" : "") + (candidate ? " reference-candidate" : "") });
  g.addEventListener("click", event => {
    event.stopPropagation();
    if (referencePicker?.kind === "date" && type !== "lane") {
      const { sourceId, key } = referencePicker;
      if (sourceId === object.id) return alert("Un objet ne peut pas être sa propre référence de date.");
      const targetKey = dateKeys(object)[0];
      if (dateDependencyCreatesCycle(sourceId, key, object.id, targetKey)) return alert("Cette dépendance créerait une boucle de dates.");
      const source = objectById(sourceId)?.item;
      if (source) {
        const sourceDate = referencePicker.sourceDate ?? resolvedDate(source, key);
        const targetDate = resolvedDate(object, targetKey);
        source.dateDependencies ||= {};
        source.dateDependencies[key] = { objectId: object.id, dateKey: targetKey, offsetDays: daysBetweenDates(targetDate, sourceDate) };
        isDirty = true; importedVersion = false; status();
      }
      referencePicker = null; render(); renderEditor(); return;
    }
    if (referencePicker && ["phase", "task"].includes(type)) {
      if (!eligiblePositionReference) return alert("Choisissez un élément dans la même lane.");
      if (referencePicker.itemId === object.id) return alert("Un élément ne peut pas être sa propre référence.");
      if (createsReferenceCycle(referencePicker.itemId, object.id)) return alert("Cette référence créerait une boucle de positionnement.");
      const source = itemById(referencePicker.itemId);
      if (source) {
        // Capture the on-screen position before adding the reference, then use
        // the corresponding relative offset so choosing a reference is stable.
        const currentTop = itemTop(source.item, source.lane);
        source.item.relativeTo = object.id;
        source.item.yOffset = relativeYOffsetForTop(source.item, { item: object, lane }, currentTop);
        isDirty = true; importedVersion = false; status();
      }
      referencePicker = null; render(); renderEditor(); return;
    }
    selection = { type, itemId: object.id, laneId: lane?.id };
    if (center != null) editorSide = center < geometry.W / 2 ? "right" : "left";
    render(); renderEditor();
  });
  return g;
}
function chevron(x1, y, w, h) { const x2 = x1 + w; return `M ${x1} ${y} L ${x2 - 11} ${y} L ${x2} ${y + h / 2} L ${x2 - 11} ${y + h} L ${x1} ${y + h} Z`; }
function drawItem(lane, item) { const resolvedStart = resolvedDate(item, "start"), resolvedEnd = resolvedDate(item, "end"); if (resolvedEnd <= planningData.range.start || resolvedStart >= planningData.range.end) return; const s = style(item), start = resolvedStart < planningData.range.start ? planningData.range.start : resolvedStart, end = resolvedEnd > planningData.range.end ? planningData.range.end : resolvedEnd, x1 = x(start), w = Math.max(4, x(end) - x1), h = itemHeight(item), y = itemTop(item, lane), type = item.type?.startsWith("task") ? "task" : "phase", g = group(type, item, lane, x1 + w / 2), attrs = { fill: resolveColor(s.fill, resolveColor("@primarySoft")), stroke: s.stroke === "none" ? "none" : resolveColor(s.stroke), "stroke-width": s.strokeWidth ?? 0, "fill-opacity": s.fillOpacity, class: "planning-shape" }, shape = s.shape === "chevron" ? el("path", { ...attrs, d: chevron(x1, y, w, h) }) : el("rect", { ...attrs, x: x1, y, width: w, height: h }); if (s.strokeDasharray) shape.setAttribute("stroke-dasharray", s.strokeDasharray); g.appendChild(shape); const lines = (item.label || "").split("\n"); textLines(g, lines, x1 + w / 2, y + h / 2 - (lines.length - 1) * 6 + 4, s.textClass || "item-label", s.lineHeight ?? 12, s.textColor && resolveColor(s.textColor)); svg.appendChild(g); }
function milestoneLines(item, key, fallbackKey) { const value = item[key] ?? (fallbackKey ? item[fallbackKey] : undefined); if (value == null || value === "") return []; return Array.isArray(value) ? value : String(value).split("\n"); }
function milestoneHeight(item) { return Math.max(10, milestoneLines(item, "label", "title").length * 14 + milestoneLines(item, "sub").length * 12 - 5); }
function drawMilestone(item, lane) { const global = !lane, lines = milestoneLines(item, global ? "title" : "label", global ? undefined : "title"), sub = milestoneLines(item, "sub"), color = resolveColor(item.color, resolveColor("@text")), top = global ? geometry.timelineTop + 22 + (item.yOffset || 0) : lane._y + (item.yOffset || 0) - 15, cx = x(resolvedDate(item, "date")), g = group(global ? "global-milestone" : "lane-milestone", item, lane, cx); textLines(g, lines, cx, top, "milestone-label", 14, color); const starY = top + lines.length * 14 + sub.length * 12 + 5; if (sub.length) textLines(g, sub, cx, top + lines.length * 14 + 1, "milestone-sub", 12, color); g.appendChild(el("text", { x: cx, y: starY, "text-anchor": "middle", "font-size": 24, "font-weight": 700, fill: color, class: "planning-shape milestone-star" }, "★")); svg.appendChild(g); }
function overlayBounds(overlay) { const start = resolvedDate(overlay, "start"), end = resolvedDate(overlay, "end"), x1 = x(start); return { x1, width: x(end) - x1 }; }
function drawOverlayHandle(overlay) { const { x1, width } = overlayBounds(overlay), g = group("overlay", overlay, null, x1 + width / 2); g.appendChild(el("rect", { x: x1, y: geometry.timelineTop, width, height: 12, fill: "transparent", "pointer-events": "all" })); svg.appendChild(g); }
function drawOverlay(overlay) { const { x1, width } = overlayBounds(overlay), g = el("g", { class: "planning-item" + (selected("overlay", overlay.id) ? " selected" : "") }); g.appendChild(el("rect", { x: x1, y: geometry.timelineTop, width, height: geometry.timelineBottom - geometry.timelineTop, fill: resolveColor(overlay.color, resolveColor("@neutral")), opacity: overlay.opacity, class: "planning-shape", "pointer-events": "none" })); svg.appendChild(g); }
function dateAnchor(entry, key) {
  const { item, lane } = entry, date = resolvedDate(item, key);
  if (!date) return null;
  const xPos = x(clampDate(date));
  if (key === "date") {
    const global = !lane, lines = milestoneLines(item, global ? "title" : "label", global ? undefined : "title"), sub = milestoneLines(item, "sub");
    const top = global ? geometry.timelineTop + 22 + (item.yOffset || 0) : lane._y + (item.yOffset || 0) - 15;
    return { x: xPos, y: top + lines.length * 14 + sub.length * 12 + 5 };
  }
  if (item.start != null && item.end != null && !lane && planningData.overlays.includes(item)) return { x: xPos, y: geometry.timelineTop + 8 };
  return { x: xPos, y: itemTop(item, lane) + itemHeight(item) / 2 };
}
function roundedOrthogonalPath(points) {
  const route = points.filter((point, index) => !index || point.x !== points[index - 1].x || point.y !== points[index - 1].y);
  let path = `M ${route[0].x} ${route[0].y}`;
  for (let index = 1; index < route.length - 1; index++) {
    const previous = route[index - 1], corner = route[index], next = route[index + 1];
    const incomingX = Math.sign(corner.x - previous.x), incomingY = Math.sign(corner.y - previous.y);
    const outgoingX = Math.sign(next.x - corner.x), outgoingY = Math.sign(next.y - corner.y);
    // A straight continuation does not need a rounded corner.
    if ((incomingX === outgoingX && incomingY === outgoingY) || (!incomingX && !outgoingX) || (!incomingY && !outgoingY)) { path += ` L ${corner.x} ${corner.y}`; continue; }
    const radius = Math.min(7, Math.hypot(corner.x - previous.x, corner.y - previous.y) / 2, Math.hypot(next.x - corner.x, next.y - corner.y) / 2);
    path += ` L ${corner.x - incomingX * radius} ${corner.y - incomingY * radius} Q ${corner.x} ${corner.y} ${corner.x + outgoingX * radius} ${corner.y + outgoingY * radius}`;
  }
  const last = route.at(-1);
  return `${path} L ${last.x} ${last.y}`;
}
function roundedDependencyPath(from, to, fromKey, toKey) {
  const sideForDate = key => key === "start" ? -1 : 1;
  const departureSide = sideForDate(fromKey), arrivalSide = sideForDate(toKey), offset = 18;
  const fromPort = { x: from.x + departureSide * offset, y: from.y };
  const toPort = { x: to.x + arrivalSide * offset, y: to.y };
  // A single vertical is enough when the departure channel is already on the
  // correct outside of the destination. Keep the second vertical only when
  // moving to the destination's preferred side is actually required.
  const canUseSingleVertical = arrivalSide < 0 ? fromPort.x <= toPort.x : fromPort.x >= toPort.x;
  if (canUseSingleVertical) return roundedOrthogonalPath([from, fromPort, { x: fromPort.x, y: to.y }, to]);
  const middleY = (from.y + to.y) / 2;
  return roundedOrthogonalPath([from, fromPort, { x: fromPort.x, y: middleY }, { x: toPort.x, y: middleY }, toPort, to]);
}
function drawDateDependencies(relatedOnly = false) {
  const selectedObject = current()?.object;
  const highlightDependencies = Boolean(selectedObject && editorSectionOpen("Informations"));
  const colors = { incoming: resolveColor(themeAppearance("dependencyIncoming")), outgoing: resolveColor(themeAppearance("dependencyOutgoing")), neutral: resolveColor(themeAppearance("dependencyNeutral")) };
  const defs = el("defs");
  Object.entries(colors).forEach(([direction, fill]) => {
    const marker = el("marker", { id: `date-dependency-arrow-${direction}`, viewBox: "0 0 7 7", refX: 6.2, refY: 3.5, markerWidth: 5, markerHeight: 5, orient: "auto-start-reverse" });
    marker.appendChild(el("path", { d: "M 0 0 L 7 3.5 L 0 7 z", fill })); defs.appendChild(marker);
  });
  svg.appendChild(defs);
  allPlanningObjects().forEach(entry => dateKeys(entry.item).forEach(key => {
    const dependency = dateDependency(entry.item, key), target = dependency && objectById(dependency.objectId);
    if (!target || !dateKeys(target.item).includes(dependency.dateKey)) return;
    const relatedToSelection = selectedObject && (entry.item.id === selectedObject.id || target.item.id === selectedObject.id);
    if (relatedOnly && !relatedToSelection) return;
    const from = dateAnchor(target, dependency.dateKey), to = dateAnchor(entry, key);
    if (!from || !to) return;
    const direction = highlightDependencies && (entry.item.id === selectedObject.id || target.item.id === selectedObject.id)
      ? entry.item.id === selectedObject.id ? "incoming" : "outgoing"
      : "neutral";
    svg.appendChild(el("path", { d: roundedDependencyPath(from, to, dependency.dateKey, key), fill: "none", stroke: colors[direction], "stroke-width": direction === "neutral" ? 1.15 : 2.8, "stroke-linecap": "round", "stroke-linejoin": "round", "marker-end": `url(#date-dependency-arrow-${direction})`, "pointer-events": "none", class: `date-dependency-link ${direction}` }));
  }));
}
function render() { setup(); svg.innerHTML = ""; const timeline = planningData.timeline, exportOpacity = Math.max(0, Math.min(1, Number(timeline.backgroundOpacity) || 0)); svg.appendChild(el("rect", { x: 0, y: 0, width: geometry.W, height: geometry.H, fill: resolveColor(timeline.backgroundColor, resolveColor("@surface")), "fill-opacity": 1, "data-export-opacity": exportOpacity, class: "planning-background", "pointer-events": "none" })); let y = geometry.top; visibleLevels().forEach((level, n) => { const p = periods(level.key); p.slice(0, -1).forEach((v, i) => { const x1 = x(v[1]), x2 = x(p[i + 1][1]); svg.append(el("rect", { x: x1, y, width: x2 - x1, height: level.height, fill: resolveColor(themeAppearance(level.altRole && i % 2 ? level.altRole : level.fillRole)), stroke: "#fff" }), el("text", { x: (x1 + x2) / 2, y: y + level.height / 2, "dominant-baseline": "middle", "text-anchor": "middle", class: level.cls }, v[0])); }); y += level.height + (n < visibleLevels().length - 1 ? 2 : 0); }); const gp = gridTimelineLevel.disabled ? [] : periods(gridTimelineLevel.value); gp.slice(0, -1).forEach(v => svg.appendChild(el("line", { x1: x(v[1] < planningData.range.start ? planningData.range.start : v[1]), y1: geometry.timelineTop, x2: x(v[1] < planningData.range.start ? planningData.range.start : v[1]), y2: geometry.timelineBottom, stroke: resolveColor(themeAppearance("timelineGrid")) }))); planningData.overlays.forEach(drawOverlayHandle); planningData.milestones.forEach(m => drawMilestone(m)); planningData.items.forEach(item => drawItem(null, item)); planningData.lanes.forEach(lane => { const bg = lane.backgroundColor ?? lane.background; if (bg && (lane.backgroundOpacity ?? 1) > 0) svg.appendChild(el("rect", { x: geometry.left, y: lane._y, width: geometry.timelineW, height: lane._h, fill: resolveColor(bg), "fill-opacity": lane.backgroundOpacity ?? 1, "pointer-events": "none" })); if (lane.key !== "change") { const g = group("lane", lane, null, 43); g.appendChild(el("rect", { x: 14, y: lane._y, width: 58, height: lane._h, fill: resolveColor(lane.labelColor, resolveColor("@primaryStrong")), class: "planning-shape" })); const label = el("g", { transform: `translate(44 ${lane._y + lane._h / 2}) rotate(-90)` }); textLines(label, lane.label, 0, -4, "lane-label", 18); g.appendChild(label); svg.appendChild(g); } lane.items.forEach(i => drawItem(lane, i)); lane.milestones.forEach(m => drawMilestone(m, lane)); }); planningData.overlays.forEach(drawOverlay); const showSelectedDateDependencies = Boolean(selection && ["phase", "task", "global-milestone", "lane-milestone"].includes(selection.type) && editorSectionOpen("Informations")); if (dateDependenciesToggle.checked || showSelectedDateDependencies) drawDateDependencies(!dateDependenciesToggle.checked); const today = dateIso(); if (todayLineToggle.checked && today >= planningData.range.start && today <= planningData.range.end) svg.appendChild(el("line", { x1: x(today), y1: 0, x2: x(today), y2: geometry.H, stroke: resolveColor(themeAppearance("todayLine")), "stroke-width": 2, "pointer-events": "none" })); }

function current() { if (!selection) return null; if (selection.type === "global-milestone") return { object: planningData.milestones.find(v => v.id === selection.itemId) }; if (selection.type === "overlay") return { object: planningData.overlays.find(v => v.id === selection.itemId) }; if (["phase", "task"].includes(selection.type) && !selection.laneId) return { object: planningData.items.find(v => v.id === selection.itemId), lane: null }; const lane = planningData.lanes.find(v => v.id === (selection.laneId || selection.itemId)); if (!lane) return null; if (selection.type === "lane") return { object: lane, lane }; return { object: (selection.type === "lane-milestone" ? lane.milestones : lane.items).find(v => v.id === selection.itemId), lane }; }
function color(v) { return resolveColor(v); }
function hasOutline(value) { return Boolean(value && value !== "none"); }
function input(label, key, value, type = "text", options) { const wrap = document.createElement("label"); wrap.className = type === "checkbox" ? "editor-check" : "editor-field"; const field = type === "textarea" ? document.createElement("textarea") : document.createElement(type === "select" ? "select" : "input"); field.dataset.key = key; if (type === "checkbox") { field.type = "checkbox"; field.checked = !!value; wrap.append(field, document.createTextNode(label)); } else { wrap.append(label, field); field.value = value ?? ""; if (type !== "textarea" && type !== "select") field.type = type; if (options) options.forEach(([v, title]) => field.add(new Option(title, v, false, v === value))); } return wrap; }
function palettePicker(label, value, options, onChange, { customLabel } = {}) {
  const wrap = document.createElement("div"); wrap.className = "palette-picker";
  wrap.append(document.createTextNode(label));
  const button = document.createElement("button"); button.type = "button"; button.className = "palette-picker-button"; button.setAttribute("aria-haspopup", "listbox"); button.setAttribute("aria-expanded", "false");
  const list = document.createElement("div"); list.className = "palette-picker-list"; list.hidden = true; list.setAttribute("role", "listbox");
  const optionFor = key => options.find(([candidate]) => candidate === key);
  const paintButton = key => {
    const option = optionFor(key), isCustom = !option;
    button.replaceChildren();
    const swatch = document.createElement("span"); swatch.className = "palette-swatch";
    swatch.style.background = isCustom ? "linear-gradient(135deg, #fff 45%, #94a3b8 46%, #94a3b8 54%, #fff 55%)" : resolveColor(`@${key}`);
    button.append(swatch, document.createTextNode(option?.[1] || customLabel || "Couleur personnalisée"));
  };
  const close = () => { list.hidden = true; button.setAttribute("aria-expanded", "false"); };
  const choose = key => { paintButton(key); close(); onChange(key); };
  options.forEach(([key, title]) => {
    const option = document.createElement("button"); option.type = "button"; option.className = "palette-picker-option"; option.setAttribute("role", "option"); option.setAttribute("aria-selected", String(key === value));
    const swatch = document.createElement("span"); swatch.className = "palette-swatch"; swatch.style.background = resolveColor(`@${key}`);
    option.append(swatch, document.createTextNode(title)); option.onclick = () => choose(key); list.appendChild(option);
  });
  if (customLabel) {
    const custom = document.createElement("button"); custom.type = "button"; custom.className = "palette-picker-option"; custom.setAttribute("role", "option");
    const swatch = document.createElement("span"); swatch.className = "palette-swatch"; swatch.style.background = "linear-gradient(135deg, #fff 45%, #94a3b8 46%, #94a3b8 54%, #fff 55%)";
    custom.append(swatch, document.createTextNode(customLabel)); custom.onclick = () => choose("custom"); list.appendChild(custom);
  }
  paintButton(value); button.onclick = event => { event.stopPropagation(); const opening = list.hidden; document.querySelectorAll(".palette-picker-list").forEach(menu => menu.hidden = true); list.hidden = !opening; button.setAttribute("aria-expanded", String(opening)); };
  wrap.append(button, list); return wrap;
}
function colorPicker(label, value, onChange, linkTheme = true) {
  const wrap = document.createElement("div"); wrap.className = "color-picker";
  const token = /^@([A-Za-z][A-Za-z0-9]*)$/.exec(value || "")?.[1];
  const optionFor = name => THEME_COLOR_OPTIONS.find(([candidate]) => candidate === name);
  const button = document.createElement("button"); button.type = "button"; button.className = "color-picker-button"; button.setAttribute("aria-haspopup", "dialog"); button.setAttribute("aria-expanded", "false");
  const menu = document.createElement("div"); menu.className = "color-picker-menu"; menu.hidden = true;
  const caption = document.createElement("span"); caption.className = "color-picker-caption"; caption.textContent = label;
  const swatch = document.createElement("span"); swatch.className = "palette-swatch"; swatch.style.background = resolveColor(value);
  const name = document.createElement("span"); name.textContent = optionFor(token)?.[1] || "Personnalisée";
  button.append(swatch, name);
  const choose = next => { swatch.style.background = resolveColor(next); name.textContent = optionFor(/^@(.+)$/.exec(next)?.[1])?.[1] || "Personnalisée"; menu.hidden = true; button.setAttribute("aria-expanded", "false"); onChange(next); };
  const palette = document.createElement("div"); palette.className = "color-picker-palette";
  THEME_COLOR_OPTIONS.forEach(([name, title]) => {
    const option = document.createElement("button"); option.type = "button"; option.className = "color-picker-swatch" + (token === name ? " is-selected" : ""); option.style.background = resolveColor(`@${name}`); option.title = title; option.setAttribute("aria-label", title); option.onclick = () => choose(linkTheme ? `@${name}` : resolveColor(`@${name}`)); palette.appendChild(option);
  });
  const custom = document.createElement("label"); custom.className = "color-picker-custom"; custom.append("Personnalisée");
  const customInput = document.createElement("input"); customInput.type = "color"; customInput.value = color(value); customInput.setAttribute("aria-label", `${label} personnalisée`); customInput.oninput = () => choose(customInput.value); custom.appendChild(customInput);
  menu.append(palette, custom);
  button.onclick = event => { event.stopPropagation(); const opening = menu.hidden; document.querySelectorAll(".color-picker-menu, .palette-picker-list").forEach(popover => popover.hidden = true); if (opening) { menu.hidden = false; const anchor = button.getBoundingClientRect(), bounds = menu.getBoundingClientRect(); const left = Math.max(12, Math.min(anchor.right - bounds.width, window.innerWidth - bounds.width - 12)); const top = anchor.bottom + bounds.height + 2 <= window.innerHeight - 12 ? anchor.bottom + 2 : Math.max(12, anchor.top - bounds.height - 2); menu.style.left = `${left}px`; menu.style.top = `${top}px`; } else menu.hidden = true; button.setAttribute("aria-expanded", String(opening)); };
  wrap.append(caption, button, menu); return wrap;
}
function fieldGrid(...fields) { const grid = document.createElement("div"); grid.className = "editor-grid"; grid.append(...fields); return grid; }
function editorSectionType() {
  if (selection?.type?.includes("milestone")) return "milestone";
  if (["phase", "task"].includes(selection?.type)) return "item";
  return selection?.type ?? "timeline";
}
function editorSectionOpen(title, defaultOpen = true) { return editorSectionStates.get(`${editorSectionType()}:${title}`) ?? defaultOpen; }
function section(title, children, open = true) { const details = document.createElement("details"); const stateKey = `${editorSectionType()}:${title}`; details.className = "editor-section"; details.open = editorSectionOpen(title, open); details.addEventListener("toggle", () => { editorSectionStates.set(stateKey, details.open); render(); }); const summary = document.createElement("summary"); summary.textContent = title; const body = document.createElement("div"); body.className = "editor-section-body"; body.append(...children); details.append(summary, body); return details; }
function laneOptions(includeNone = false) {
  const options = planningData.lanes.map(lane => [lane.id, Array.isArray(lane.label) ? lane.label.join(" · ") : lane.label || "Sans libellé"]);
  return includeNone ? [["", "Aucune lane"], ...options] : options;
}
function moveSelectedToLane(laneId) {
  const found = current();
  if (!found?.object || !["phase", "task", "global-milestone", "lane-milestone"].includes(selection?.type)) return;
  const isMilestone = selection.type.includes("milestone");
  const destination = laneId ? planningData.lanes.find(lane => lane.id === laneId) : null;
  if (found.lane === destination) return;
  const sourceCollection = isMilestone ? (found.lane ? found.lane.milestones : planningData.milestones) : (found.lane ? found.lane.items : planningData.items);
  sourceCollection.splice(sourceCollection.indexOf(found.object), 1);
  if (isMilestone) (destination ? destination.milestones : planningData.milestones).push(found.object);
  else {
    (destination ? destination.items : planningData.items).push(found.object);
    if (found.object.relativeTo && itemById(found.object.relativeTo)?.lane !== destination) {
      delete found.object.relativeTo;
      found.object.yOffsetMode = "absolute";
    }
  }
  selection = { type: isMilestone ? (destination ? "lane-milestone" : "global-milestone") : selection.type, itemId: found.object.id, laneId: destination?.id };
  referencePicker = null;
  isDirty = true; importedVersion = false; status(); render(); renderEditor();
}
function laneAssignmentSection(found, allowNone = false) {
  const control = input("Lane", "laneId", found.lane?.id ?? "", "select", laneOptions(allowNone));
  control.querySelector("select").onchange = event => moveSelectedToLane(event.target.value);
  return section("Lane", [control], false);
}
function changeDateDependency(object, key, dependency) {
  if (dependency && dateDependencyCreatesCycle(object.id, key, dependency.objectId, dependency.dateKey)) return alert("Cette dépendance créerait une boucle de dates.");
  const previous = dateDependency(object, key);
  object.dateDependencies ||= {};
  if (dependency) object.dateDependencies[key] = dependency;
  else delete object.dateDependencies[key];
  if (dateKeys(object).length === 2 && resolvedDate(object, "start") > resolvedDate(object, "end")) {
    if (previous) object.dateDependencies[key] = previous;
    else delete object.dateDependencies[key];
    if (!Object.keys(object.dateDependencies).length) delete object.dateDependencies;
    return alert("La date de début doit être antérieure ou égale à la date de fin.");
  }
  if (!Object.keys(object.dateDependencies).length) delete object.dateDependencies;
  referencePicker = null; isDirty = true; importedVersion = false; status(); render(); renderEditor();
}
function changeDateDuration(object, key, duration) {
  const otherKey = key === "start" ? "end" : "start";
  object.dateDependencies && delete object.dateDependencies[key];
  if (object.dateDependencies && !Object.keys(object.dateDependencies).length) delete object.dateDependencies;
  object.dateDurations ||= {};
  delete object.dateDurations[otherKey];
  object.dateDurations[key] = Math.max(0, Number(duration) || 0);
  referencePicker = null; isDirty = true; importedVersion = false; status(); render(); renderEditor();
}
function setDateFixed(object, key) {
  object.dateDependencies && delete object.dateDependencies[key];
  object.dateDurations && delete object.dateDurations[key];
  if (object.dateDependencies && !Object.keys(object.dateDependencies).length) delete object.dateDependencies;
  if (object.dateDurations && !Object.keys(object.dateDurations).length) delete object.dateDurations;
  referencePicker = null; isDirty = true; importedVersion = false; status(); render(); renderEditor();
}
function dateDependencyControl(object, key, label) {
  const wrap = document.createElement("div"); wrap.className = "date-dependency-control";
  const dependency = dateDependency(object, key), target = dependency && objectById(dependency.objectId);
  const duration = dateDuration(object, key);
  const picking = referencePicker?.kind === "date" && referencePicker.sourceId === object.id && referencePicker.key === key;
  const row = document.createElement("div"); row.className = "date-dependency-row";
  const date = input(label, key, resolvedDate(object, key), "date");
  const dateField = date.querySelector("input"); dateField.disabled = Boolean(dependency || duration != null || picking);
  dateField.oninput = () => update(key, dateField.value);
  const modes = [["fixed", "Fixe"], ["variable", "Variable"]];
  if (dateKeys(object).length === 2) modes.push(["duration", "Durée"]);
  const mode = input("Type", "date-mode", duration != null ? "duration" : dependency || picking ? "variable" : "fixed", "select", modes);
  mode.querySelector("select").onchange = event => {
    if (event.target.value === "fixed") setDateFixed(object, key);
    else if (event.target.value === "duration") changeDateDuration(object, key, duration ?? currentDateSpan(object));
    else if (target) renderEditor();
    else {
      // Keep the choice visible while the user is picking the reference on the planning.
      // An incomplete dependency simply falls back to the fixed date until it is completed.
      const sourceDate = resolvedDate(object, key);
      object.dateDurations && delete object.dateDurations[key];
      if (object.dateDurations && !Object.keys(object.dateDurations).length) delete object.dateDurations;
      object.dateDependencies ||= {};
      object.dateDependencies[key] = { objectId: "", dateKey: "", offsetDays: 0 };
      referencePicker = { kind: "date", sourceId: object.id, key, sourceDate };
      isDirty = true; importedVersion = false; status(); render(); renderEditor();
    }
  };
  row.append(date, mode); wrap.appendChild(row);
  if (duration != null) {
    const durationField = input("Durée (jours)", "date-duration", duration, "number");
    durationField.querySelector("input").min = "0";
    durationField.querySelector("input").onchange = event => changeDateDuration(object, key, event.target.value);
    wrap.appendChild(durationField);
    return wrap;
  }
  if (!dependency && !picking) return wrap;
  const reference = document.createElement("div"); reference.className = "relative-reference-field";
  const description = document.createElement("span"); description.className = "relative-reference-label";
  description.textContent = picking ? "Cliquez sur l’objet de référence dans le planning…" : target ? objectLabel(target) : "Référence introuvable";
  const pick = document.createElement("button"); pick.type = "button"; pick.className = "pick-reference"; pick.textContent = "✎"; pick.title = "Sélectionner l’objet de référence dans le planning";
  pick.onclick = event => { event.preventDefault(); event.stopPropagation(); referencePicker = referencePicker?.kind === "date" && referencePicker.sourceId === object.id && referencePicker.key === key ? null : { kind: "date", sourceId: object.id, key, sourceDate: resolvedDate(object, key) }; render(); renderEditor(); };
  reference.append(description, pick); wrap.appendChild(reference);
  if (target) {
    const anchor = input("Référence", "date-anchor", dependency.dateKey, "select", dateKeys(target.item).map(value => [value, dateKeyLabel(value)]));
    anchor.querySelector("select").onchange = event => {
      const currentDate = resolvedDate(object, key);
      const targetDate = resolvedDate(target.item, event.target.value);
      changeDateDependency(object, key, { ...dependency, dateKey: event.target.value, offsetDays: daysBetweenDates(targetDate, currentDate) });
    };
    const offset = input("Décalage (jours)", "date-offset", dependency.offsetDays ?? 0, "number");
    offset.querySelector("input").onchange = event => changeDateDependency(object, key, { ...dependency, offsetDays: Number(event.target.value) || 0 });
    wrap.append(fieldGrid(anchor, offset));
  }
  return wrap;
}
function renderEditor() { editor.innerHTML = ""; const found = current(); if (!found?.object) return; const o = found.object, card = document.createElement("div"); card.className = "editor-card"; const top = document.createElement("div"); top.className = "editor-heading"; top.appendChild(document.createTextNode(selection.type === "lane" ? "Lane" : selection.type === "overlay" ? "Overlay" : selection.type.includes("milestone") ? "Jalon" : selection.type === "task" ? "Tâche" : "Phase")); const close = document.createElement("button"); close.textContent = "×"; close.title = "Fermer"; close.setAttribute("aria-label", "Fermer le panneau"); close.onclick = clear; top.appendChild(close); card.appendChild(top); if (selection.type === "lane") { card.append(section("Informations", [input("Libellé (une ligne par ligne)", "label", o.label.join("\n"), "textarea")]), section("Apparence", [input("Couleur du bandeau", "labelColor", color(o.labelColor), "color"), fieldGrid(input("Fond", "backgroundColor", color(o.backgroundColor), "color"), input("Opacité du fond (0 à 1)", "backgroundOpacity", o.backgroundOpacity ?? 1, "number"))], false)); } else if (selection.type === "overlay") { card.append(section("Informations", [input("Libellé", "label", o.label, "text"), dateDependencyControl(o, "start", "Début"), dateDependencyControl(o, "end", "Fin")]), section("Apparence", [fieldGrid(input("Couleur", "color", color(o.color), "color"), input("Opacité (0 à 1)", "opacity", o.opacity ?? 1, "number"))], false)); } else if (selection.type.includes("milestone")) { const key = selection.type === "global-milestone" ? "title" : "label"; card.append(section("Informations", [input("Libellé (une ligne par ligne)", key, (Array.isArray(o[key]) ? o[key] : String(o[key] || "").split("\n")).join("\n"), "textarea"), dateDependencyControl(o, "date", "Date")]), laneAssignmentSection(found, true), section("Position et apparence", [fieldGrid(input("Décalage vertical", "yOffset", o.yOffset ?? 0, "number"), input("Couleur", "color", color(o.color), "color"))], false)); } else { card.append(section("Informations", [input("Libellé", "label", o.label, "textarea"), dateDependencyControl(o, "start", "Début"), dateDependencyControl(o, "end", "Fin")]), section("Position et dimensions", [fieldGrid(input("Décalage vertical", "yOffset", o.yOffset ?? 0, "number"), input("Hauteur", "h", o.h ?? style(o).h ?? planningData.layout.defaultItemHeight ?? 30, "number"))], false), section("Style", [fieldGrid(input("Couleur de fond", "fill", color(o.fill ?? style(o).fill), "color"), input("Couleur du texte", "textColor", color(o.textColor ?? style(o).textColor), "color")), input("Forme", "shape", o.shape ?? style(o).shape ?? "rect", "select", [["chevron", "Chevron"], ["rect", "Rectangle"]]), fieldGrid(input("Contour", "outline", !!(o.stroke ?? style(o).stroke), "checkbox"), input("Pointillés", "dashed", !!(o.strokeDasharray ?? style(o).strokeDasharray), "checkbox")), input("Couleur du contour", "stroke", color(o.stroke ?? style(o).stroke), "color")], false)); } card.querySelectorAll("input,textarea,select").forEach(n => { if (!n.oninput && !n.onchange) n.oninput = () => update(n.dataset.key, n.type === "checkbox" ? n.checked : n.value); }); const actions = document.createElement("div"); actions.className = "editor-actions"; const move = document.createElement("button"); move.type = "button"; move.className = "move-editor"; move.textContent = "↔"; move.title = editorSide === "left" ? "Déplacer le panneau à droite" : "Déplacer le panneau à gauche"; move.setAttribute("aria-label", move.title); move.onclick = () => { editorSide = editorSide === "left" ? "right" : "left"; layout(); renderEditor(); }; const remove = document.createElement("button"); remove.type = "button"; remove.className = "delete-object"; remove.textContent = "Supprimer"; remove.title = "Supprimer cet objet"; remove.onclick = removeSelectedObject; actions.append(move, remove); card.appendChild(actions); editor.appendChild(card); layout(); }
function layout() { workspace.classList.toggle("editor-left", editorSide === "left"); workspace.classList.toggle("editor-right", editorSide !== "left"); }
function moveLane(direction) {
  const found = current();
  if (selection?.type !== "lane" || !found?.lane) return;
  const index = planningData.lanes.indexOf(found.lane), target = index + direction;
  if (index < 0 || target < 0 || target >= planningData.lanes.length) return;
  [planningData.lanes[index], planningData.lanes[target]] = [planningData.lanes[target], planningData.lanes[index]];
  isDirty = true;
  importedVersion = false;
  status();
  render();
  renderEditor();
}
function update(key, value) { const found = current(); if (!found?.object) return; const o = found.object, previous = o[key]; if (["yOffset", "h", "backgroundOpacity", "opacity"].includes(key)) value = value === "" ? 0 : Number(value); if (key === "label" && selection.type === "lane") o.label = value.split("\n"); else if (key === "title") o.title = value.split("\n"); else if (key === "outline") { o.stroke = value ? (o.stroke === "none" ? "#1aa79f" : o.stroke || "#1aa79f") : "none"; o.strokeWidth = value ? (o.strokeWidth || 1.4) : 0; } else if (key === "dashed") o.strokeDasharray = value ? "5 4" : ""; else o[key] = value; if (["start", "end"].includes(key) && resolvedDate(o, "start") > resolvedDate(o, "end")) { o[key] = previous; return alert("La date de début doit être antérieure ou égale à la date de fin."); } isDirty = true; importedVersion = false; status(); render(); }
function clear() { referencePicker = null; selection = null; editor.innerHTML = ""; render(); }
function status() {
  const plan = savedPlans.find(candidate => candidate.id === activePlanId);
  const message = importedVersion ? "Planning importé à enregistrer" : "Modifications à enregistrer";
  saveButton.classList.toggle("is-dirty", isDirty);
  saveLabel.textContent = "Enregistrer";
  saveButton.title = isDirty ? message : "Enregistrer le planning dans ce navigateur";
  currentPlanningName.textContent = plan?.name || "Planning non enregistré";
  currentPlanningName.title = plan?.name || "Planning non enregistré";
  renamePlanButton.title = plan ? `Renommer « ${plan.name} »` : "Donner un nom au planning";
}
function valid(data) { return data && data.range && data.layout && (data.lanes == null || Array.isArray(data.lanes)) && (data.items == null || Array.isArray(data.items)); }
function normalise(data) {
  data.items ||= []; data.lanes ||= []; data.milestones ||= []; data.overlays ||= []; data.itemTypes ||= {};
  const requestedPreset = data.theme?.preset;
  const preset = THEME_PRESETS[requestedPreset] || THEME_PRESETS.ocean;
  const presetId = THEME_PRESETS[requestedPreset] ? requestedPreset : data.theme ? "custom" : "ocean";
  const requestedColors = data.theme?.colors || {};
  // Keep only the current semantic roles. Older role names are intentionally
  // discarded instead of being carried as hidden aliases in the palette.
  const colors = Object.fromEntries(Object.keys(preset.colors).map(key => [key, requestedColors[key] ?? preset.colors[key]]));
  data.theme = { preset: presetId, colors, appearance: { ...DEFAULT_THEME_APPEARANCE, ...(data.theme?.appearance || {}) } };
  Object.keys(data.theme.colors).forEach(key => { if (!/^#[0-9a-f]{6}$/i.test(data.theme.colors[key])) data.theme.colors[key] = preset.colors[key] || "#000000"; });
  Object.keys(data.theme.appearance).forEach(key => {
    const value = data.theme.appearance[key], token = typeof value === "string" ? value.slice(1) : "";
    const isThemeColor = /^@[A-Za-z][A-Za-z0-9]*$/.test(value || "") && data.theme.colors[token];
    const isCustomColor = /^#[0-9a-f]{6}$/i.test(value || "");
    if (!isThemeColor && !isCustomColor) data.theme.appearance[key] = DEFAULT_THEME_APPEARANCE[key] || "@text";
  });
  if (typeof data.monthLocale !== "string" || !data.monthLocale) data.monthLocale = "fr-FR";
  const defaults = defaultTimelineSettings();
  data.timeline ||= {};
  data.timeline.levels = { ...defaults.levels, ...data.timeline.levels };
  data.timeline.gridLevel ||= defaults.gridLevel;
  if (typeof data.timeline.showTodayLine !== "boolean") data.timeline.showTodayLine = defaults.showTodayLine;
  if (typeof data.timeline.showDateDependencies !== "boolean") data.timeline.showDateDependencies = defaults.showDateDependencies;
  if (!/^#[0-9a-f]{6}$/i.test(data.timeline.backgroundColor || "") && !/^@[A-Za-z][A-Za-z0-9]*$/.test(data.timeline.backgroundColor || "")) data.timeline.backgroundColor = defaults.backgroundColor;
  data.timeline.backgroundOpacity = Math.max(0, Math.min(1, Number.isFinite(Number(data.timeline.backgroundOpacity)) ? Number(data.timeline.backgroundOpacity) : defaults.backgroundOpacity));
  if (!data.itemTypes.task) data.itemTypes.task = clone(emptyPlanning().itemTypes.task);
  data.lanes.forEach(lane => { lane.items ||= []; lane.milestones ||= []; });
  ids(data);
  return data;
}
function readSavedPlans() {
  try {
    const library = JSON.parse(localStorage.getItem(LIBRARY_KEY));
    if (library?.version === 1 && Array.isArray(library.plans)) {
      savedPlans = library.plans.filter(plan => plan?.id && plan?.name && valid(plan.data));
      activePlanId = savedPlans.some(plan => plan.id === library.activePlanId) ? library.activePlanId : null;
    }
  } catch (_) {}
}
function writeSavedPlans() {
  localStorage.setItem(LIBRARY_KEY, JSON.stringify({ version: 1, activePlanId, plans: savedPlans }));
}
function closeLoadMenu() { loadMenu.hidden = true; loadButton.setAttribute("aria-expanded", "false"); }
function refreshSavedPlanList() {
  loadMenu.innerHTML = "";
  savedPlans.forEach(plan => {
    const option = document.createElement("button");
    option.type = "button"; option.role = "menuitem"; option.dataset.planId = plan.id;
    option.textContent = plan.name; option.title = `Charger « ${plan.name} »`;
    loadMenu.appendChild(option);
  });
  loadButton.disabled = !savedPlans.length;
  document.getElementById("btnDeletePlan").disabled = !activePlanId;
  closeLoadMenu();
}
function askPlanName(message, suggested = "") {
  const name = prompt(message, suggested);
  return name === null ? null : name.trim();
}
function applyPlanning(data, { activeId = null, dirty = false, imported = false } = {}) {
  planningData = normalise(clone(data)); activePlanId = activeId;
  applyThemeToApp();
  restoreTimelineSettings();
  referencePicker = null; selection = null; isDirty = dirty; importedVersion = imported;
  refreshSavedPlanList(); gridChoices(); render(); renderEditor(); status();
}
function save() {
  let plan = savedPlans.find(candidate => candidate.id === activePlanId);
  if (!plan) {
    const name = askPlanName("Nom de ce planning :", importedVersion ? "Planning importé" : "Nouveau planning");
    if (name === null) return;
    if (!name) return alert("Donnez un nom au planning pour l’enregistrer.");
    plan = { id: newId("plan"), name, updatedAt: "", data: null };
    savedPlans.push(plan); activePlanId = plan.id;
  }
  try {
    plan.data = clone(planningData); plan.updatedAt = new Date().toISOString();
    writeSavedPlans(); isDirty = false; importedVersion = false; refreshSavedPlanList(); status();
  } catch (_) { alert("La sauvegarde locale est indisponible. Exportez les données JSON pour conserver votre travail."); }
}
function createNewPlanning() {
  if (isDirty && !confirm("Les modifications non enregistrées seront perdues. Créer quand même un nouveau planning vide ?")) return;
  applyPlanning(emptyPlanning(), { dirty: false });
}
function loadSavedPlanning(id) {
  const plan = savedPlans.find(candidate => candidate.id === id);
  if (!plan) return;
  if (isDirty && !confirm("Les modifications non enregistrées seront perdues. Charger ce planning ?")) return;
  applyPlanning(plan.data, { activeId: plan.id });
}
function deleteSavedPlanning() {
  const plan = savedPlans.find(candidate => candidate.id === activePlanId);
  if (!plan || !confirm(`Supprimer définitivement « ${plan.name} » de ce navigateur ? Cette action ne supprime aucun fichier exporté.`)) return;
  savedPlans = savedPlans.filter(candidate => candidate.id !== plan.id);
  activePlanId = null;
  try { writeSavedPlans(); } catch (_) {}
  applyPlanning(emptyPlanning());
}
function renameCurrentPlanning() {
  const plan = savedPlans.find(candidate => candidate.id === activePlanId);
  const name = askPlanName(plan ? "Nouveau nom du planning :" : "Nom de ce planning :", plan?.name || "Nouveau planning");
  if (name === null) return;
  if (!name) return alert("Donnez un nom au planning.");
  if (!plan) { saveWithName(name); return; }
  plan.name = name; plan.updatedAt = new Date().toISOString();
  try { writeSavedPlans(); refreshSavedPlanList(); status(); } catch (_) { alert("Le renommage n’a pas pu être enregistré dans ce navigateur."); }
}
function download(blob, filename) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click(); URL.revokeObjectURL(a.href); }
function xml() { const out = svg.cloneNode(true); out.setAttribute("xmlns", NS); out.setAttribute("font-family", getComputedStyle(svg).fontFamily); out.querySelectorAll(".selected").forEach(n => n.classList.remove("selected")); out.querySelectorAll("[data-export-opacity]").forEach(n => { n.setAttribute("fill-opacity", n.dataset.exportOpacity); n.removeAttribute("data-export-opacity"); }); svg.querySelectorAll("text").forEach((source, i) => { const target = out.querySelectorAll("text")[i], c = getComputedStyle(source); ["fill", "font-family", "font-size", "font-weight", "font-style", "letter-spacing"].forEach(k => target.style.setProperty(k, c.getPropertyValue(k))); }); return new XMLSerializer().serializeToString(out); }
function importData(file) { if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const data = JSON.parse(reader.result); if (!valid(data)) throw 0; if (isDirty && !confirm("Les modifications non enregistrées seront perdues. Importer ce fichier ?")) return; const suggestion = file.name.replace(/\.json$/i, "") || "Planning importé"; applyPlanning(data, { dirty: true, imported: true }); const name = askPlanName("Nom du planning importé (il sera enregistré dans ce navigateur) :", suggestion); if (name === null) return; if (!name) return alert("L’import est chargé mais non enregistré. Cliquez sur Enregistrer lorsque vous aurez choisi un nom."); saveWithName(name); } catch (_) { alert("Le fichier sélectionné n’est pas un planning valide."); } }; reader.readAsText(file); }
function saveWithName(name) { const plan = { id: newId("plan"), name, updatedAt: new Date().toISOString(), data: clone(planningData) }; savedPlans.push(plan); activePlanId = plan.id; try { writeSavedPlans(); isDirty = false; importedVersion = false; refreshSavedPlanList(); status(); } catch (_) { alert("L’import est chargé, mais n’a pas pu être enregistré dans ce navigateur."); } }
function gridChoices() { const keys = new Set(visibleLevels().map(v => v.key)); [...gridTimelineLevel.options].forEach(v => v.disabled = !keys.has(v.value)); if (!keys.has(gridTimelineLevel.value)) gridTimelineLevel.value = visibleLevels()[0]?.key || ""; gridTimelineLevel.disabled = !keys.size; }
function restoreTimelineSettings() {
  const settings = planningData.timeline;
  todayLineToggle.checked = settings.showTodayLine;
  dateDependenciesToggle.checked = settings.showDateDependencies;
  timelineLevels.forEach(level => { level.toggle.checked = settings.levels[level.key]; });
  gridTimelineLevel.value = settings.gridLevel;
  timelineLocale.value = timelineLocaleValue();
}
function markTimelineChange() {
  isDirty = true;
  importedVersion = false;
  status();
}

// The item editor is extended here rather than changing the planning data model:
// a style remains a shared entry in itemTypes, while an item only stores its type.
function styleUsageCount(type) { return planningData.items.filter(item => item.type === type).length + planningData.lanes.reduce((total, lane) => total + lane.items.filter(item => item.type === type).length, 0); }
let editingStyleName = null;
function markStyleChange() { isDirty = true; importedVersion = false; status(); render(); }
function updateSharedStyle(type, key, value) {
  const shared = planningData.itemTypes[type];
  if (!shared) return;
  if (key === "outline") { shared.stroke = value ? (shared.stroke === "none" ? "#1aa79f" : shared.stroke || "#1aa79f") : "none"; shared.strokeWidth = value ? (shared.strokeWidth || 1.4) : 0; }
  else if (key === "dashed") shared.strokeDasharray = value ? "5 4" : "";
  else shared[key] = value;
  markStyleChange();
}
function relativePositionControls(item) {
  const wrap = document.createElement("div"); wrap.className = "relative-position-controls";
  const mode = input("Positionnement vertical", "yOffsetMode", relativeMode(item), "select", [["absolute", "Absolu (haut de la lane)"], ["below", "Sous un élément"], ["center", "Centré sur un élément"], ["align", "Aligné en haut d’un élément"]]);
  const modeField = mode.querySelector("select");
  modeField.onchange = () => {
    item.yOffsetMode = modeField.value;
    if (modeField.value === "absolute") {
      delete item.relativeTo;
      referencePicker = null;
    } else if (!itemById(item.relativeTo)) {
      // A relative mode is incomplete without a reference: immediately let the
      // user choose one on the planning instead of requiring the pencil click.
      referencePicker = { itemId: item.id };
    }
    isDirty = true; importedVersion = false; status(); render(); renderEditor();
  };
  wrap.appendChild(mode);
  if (relativeMode(item) === "absolute") return wrap;
  const reference = item.relativeTo ? itemById(item.relativeTo) : null;
  const referenceLine = document.createElement("div"); referenceLine.className = "relative-reference-field";
  const description = document.createElement("span"); description.className = "relative-reference-label";
  description.textContent = referencePicker?.itemId === item.id ? "Sélectionnez un élément dans la même lane…" : reference ? (Array.isArray(reference.item.label) ? reference.item.label.join(" ") : reference.item.label || "Sans libellé") : "Aucun élément sélectionné";
  const pick = document.createElement("button"); pick.type = "button"; pick.className = "pick-reference"; pick.textContent = "✎"; pick.title = reference ? "Modifier l’élément de comparaison" : "Sélectionner un élément de comparaison"; pick.setAttribute("aria-label", pick.title);
  pick.onclick = () => { referencePicker = referencePicker?.itemId === item.id ? null : { itemId: item.id }; render(); renderEditor(); };
  referenceLine.append(description, pick); wrap.appendChild(referenceLine);
  return wrap;
}
function compactColorInputs(source, change) {
  const found = current();
  if (!found?.object) return;
  editor.querySelectorAll('input[type="color"]').forEach(field => {
    const key = field.dataset.key;
    if (!key) return;
    const label = field.closest("label")?.childNodes[0]?.textContent || "Couleur";
    const value = source?.[key] ?? found.object[key] ?? field.value;
    const picker = colorPicker(label, value, next => (change || update)(key, next));
    field.closest("label")?.replaceWith(picker);
  });
}
const originalBaseRenderEditor = renderEditor;
const baseRenderEditor = () => { originalBaseRenderEditor(); compactColorInputs(); };
renderEditor = function () {
  if (selection?.type === "timeline") return renderTimelineEditor();
  if (selection?.type === "theme") return renderThemeEditor();
  restoreTimelineControls();
  const found = current();
  if (!found?.object || !["phase", "task"].includes(selection.type)) return baseRenderEditor();
  const item = found.object;
  const styleNames = Object.keys(planningData.itemTypes || {});
  const activeStyle = planningData.itemTypes[item.type] ? item.type : styleNames[0];
  const shared = planningData.itemTypes[activeStyle] || {};
  editor.innerHTML = "";
  const card = document.createElement("div"); card.className = "editor-card";
  const top = document.createElement("div"); top.className = "editor-heading";
  top.append(document.createTextNode(selection.type === "task" ? "Tâche" : "Phase"));
  const close = document.createElement("button"); close.textContent = "×"; close.title = "Fermer"; close.onclick = clear; top.appendChild(close); card.appendChild(top);
  const offsetLabel = relativeMode(item) === "absolute" ? "Décalage vertical" : "Offset supplémentaire";
  card.append(section("Informations", [input("Libellé", "label", item.label, "textarea"), dateDependencyControl(item, "start", "Début"), dateDependencyControl(item, "end", "Fin")]), laneAssignmentSection(found, true), section("Position et dimensions", [relativePositionControls(item), fieldGrid(input(offsetLabel, "yOffset", item.yOffset ?? 0, "number"), input("Hauteur", "h", item.h ?? shared.h ?? planningData.layout.defaultItemHeight ?? 30, "number"))], false));
  const basicFields = [...card.querySelectorAll("input,textarea")].filter(node => ["label", "start", "end", "yOffset", "h"].includes(node.dataset.key));
  basicFields.forEach(node => node.oninput = () => update(node.dataset.key, node.value));
  const picker = input("Style appliqué", "type", activeStyle, "select", styleNames.map(name => [name, name]));
  const pickerControl = picker.querySelector("select");
  pickerControl.onchange = () => { item.type = pickerControl.value; editingStyleName = null; markStyleChange(); renderEditor(); };
  const styleActions = document.createElement("div"); styleActions.className = "style-picker-actions";
  styleActions.appendChild(picker);
  const addStyle = document.createElement("button"); addStyle.type = "button"; addStyle.className = "style-action"; addStyle.textContent = "+"; addStyle.title = "Créer un nouveau style"; addStyle.setAttribute("aria-label", addStyle.title);
  addStyle.onclick = () => { const newName = prompt("Nom du nouveau style :"); if (newName === null) return; const name = newName.trim(); if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(name)) return alert("Utilisez un nom de style commençant par une lettre (lettres, chiffres, - ou _)."); if (planningData.itemTypes[name]) return alert("Ce nom de style existe déjà."); planningData.itemTypes[name] = clone(shared); item.type = name; editingStyleName = name; markStyleChange(); renderEditor(); };
  const editStyle = document.createElement("button"); editStyle.type = "button"; editStyle.className = "style-action"; editStyle.textContent = "✎"; editStyle.title = "Modifier ce style"; editStyle.setAttribute("aria-label", editStyle.title);
  editStyle.onclick = () => { editingStyleName = activeStyle; renderEditor(); };
  styleActions.append(addStyle, editStyle);
  const styleContent = [styleActions];
  if (editingStyleName === activeStyle) {
    const impact = document.createElement("p"); impact.className = "impact-note"; impact.textContent = styleUsageCount(activeStyle) + " élément" + (styleUsageCount(activeStyle) > 1 ? "s seront" : " sera") + " impacté" + (styleUsageCount(activeStyle) > 1 ? "s" : "") + " par la modification de ce style.";
    styleContent.push(impact, fieldGrid(input("Couleur de fond", "fill", color(shared.fill), "color"), input("Couleur du texte", "textColor", color(shared.textColor), "color")), input("Forme", "shape", shared.shape ?? "rect", "select", [["chevron", "Chevron"], ["rect", "Rectangle"]]), fieldGrid(input("Contour", "outline", hasOutline(shared.stroke), "checkbox"), input("Pointillés", "dashed", Boolean(shared.strokeDasharray), "checkbox")), input("Couleur du contour", "stroke", color(shared.stroke), "color"));
  }
  const sharedStyle = section("Style", styleContent, false);
  card.appendChild(sharedStyle);
  const styleFields = [...sharedStyle.querySelectorAll("input,select")].filter(node => ["fill", "textColor", "shape", "outline", "dashed", "stroke"].includes(node.dataset.key));
  styleFields.forEach(node => { const listener = () => updateSharedStyle(activeStyle, node.dataset.key, node.type === "checkbox" ? node.checked : node.value); node.oninput = listener; node.onchange = listener; });
  const actions = document.createElement("div"); actions.className = "editor-actions";
  const move = document.createElement("button"); move.type = "button"; move.className = "move-editor"; move.textContent = "↔"; move.title = editorSide === "left" ? "Déplacer le panneau à droite" : "Déplacer le panneau à gauche"; move.setAttribute("aria-label", move.title); move.onclick = () => { editorSide = editorSide === "left" ? "right" : "left"; layout(); renderEditor(); };
  const remove = document.createElement("button"); remove.type = "button"; remove.className = "delete-object"; remove.textContent = "Supprimer"; remove.title = "Supprimer cet élément"; remove.onclick = removeSelectedObject;
  actions.append(move, remove); card.appendChild(actions);
  editor.appendChild(card); layout();
};

const itemRenderEditor = renderEditor;
renderEditor = function () {
  itemRenderEditor();
  if (selection && ["phase", "task"].includes(selection.type)) {
    const activeStyle = planningData.itemTypes[current()?.object?.type];
    if (activeStyle) compactColorInputs(activeStyle, (key, value) => updateSharedStyle(current().object.type, key, value));
  }
};

const timelineControls = document.getElementById("timelineControls");
const todayControl = todayLineToggle.closest(".today-toggle");
const timelineControlStaging = document.getElementById("timelineControlStaging");
const toolbar = document.querySelector(".toolbar");
function restoreTimelineControls() { if (todayControl.parentElement !== timelineControlStaging) timelineControlStaging.appendChild(todayControl); if (timelineControls.parentElement !== toolbar) toolbar.appendChild(timelineControls); }
function planningDateBounds() {
  const dates = [];
  const add = value => value && dates.push(value);
  planningData.items.forEach(item => { add(resolvedDate(item, "start")); add(resolvedDate(item, "end")); });
  planningData.lanes.forEach(lane => { lane.items.forEach(item => { add(resolvedDate(item, "start")); add(resolvedDate(item, "end")); }); lane.milestones.forEach(item => add(resolvedDate(item, "date"))); });
  planningData.milestones.forEach(item => add(resolvedDate(item, "date")));
  planningData.overlays.forEach(item => { add(resolvedDate(item, "start")); add(resolvedDate(item, "end")); });
  return { first: dates.length ? dates.sort()[0] : planningData.range.start, last: dates.length ? dates.sort().at(-1) : planningData.range.end };
}
function updateRange(key, value) {
  if (!value) return;
  const other = key === "start" ? planningData.range.end : planningData.range.start;
  if ((key === "start" && value > other) || (key === "end" && value < other)) return alert("La date de début doit être antérieure ou égale à la date de fin.");
  planningData.range[key] = value; isDirty = true; importedVersion = false; status(); gridChoices(); render();
}
function updateTimelineBackground(key, value) {
  planningData.timeline[key] = key === "backgroundOpacity" ? Math.max(0, Math.min(1, Number(value) || 0)) : value;
  markTimelineChange();
  render();
}
function renderTimelineEditor() {
  editor.innerHTML = "";
  const card = document.createElement("div"); card.className = "editor-card";
  const top = document.createElement("div"); top.className = "editor-heading"; top.append(document.createTextNode("Frise temporelle"));
  const close = document.createElement("button"); close.textContent = "×"; close.title = "Fermer"; close.onclick = clear; top.appendChild(close); card.appendChild(top);
  const intro = document.createElement("p"); intro.className = "impact-note"; intro.textContent = "Réglez l’affichage et la période du planning.";
  const dates = document.createElement("div"); dates.className = "timeline-dates";
  const start = input("Début du planning", "start", planningData.range.start, "date"); const end = input("Fin du planning", "end", planningData.range.end, "date");
  start.querySelector("input").onchange = event => updateRange("start", event.target.value); end.querySelector("input").onchange = event => updateRange("end", event.target.value);
  const bounds = planningDateBounds();
  const earliest = document.createElement("button"); earliest.type = "button"; earliest.textContent = "Au plus tôt"; earliest.title = "Définir le début sur « " + bounds.first + " »"; earliest.onclick = () => { updateRange("start", bounds.first); renderTimelineEditor(); };
  const latest = document.createElement("button"); latest.type = "button"; latest.textContent = "Au plus tard"; latest.title = "Définir la fin sur « " + bounds.last + " »"; latest.onclick = () => { updateRange("end", bounds.last); renderTimelineEditor(); };
  const startRow = document.createElement("div"); startRow.className = "timeline-date-row"; startRow.append(start, earliest);
  const endRow = document.createElement("div"); endRow.className = "timeline-date-row"; endRow.append(end, latest);
  dates.append(startRow, endRow);
  card.append(section("Période", [intro, dates]));
  card.appendChild(section("Ligne d’aujourd’hui", [todayControl], false));
  card.appendChild(section("Affichage", [timelineControls], false));
  const actions = document.createElement("div"); actions.className = "editor-actions"; const move = document.createElement("button"); move.textContent = editorSide === "left" ? "Déplacer à droite →" : "← Déplacer à gauche"; move.onclick = () => { editorSide = editorSide === "left" ? "right" : "left"; layout(); renderTimelineEditor(); }; actions.appendChild(move); card.appendChild(actions);
  editor.appendChild(card); layout(); pinEditorActions();
}
function setThemePreset(id) {
  if (!THEME_PRESETS[id]) return;
  planningData.theme = { preset: id, colors: clone(THEME_PRESETS[id].colors), appearance: clone(planningData.theme.appearance || DEFAULT_THEME_APPEARANCE) };
  applyThemeToApp();
  isDirty = true; importedVersion = false; status(); render();
}
function updateThemeColor(key, value) {
  if (!/^#[0-9a-f]{6}$/i.test(value)) return;
  planningData.theme.colors[key] = value;
  planningData.theme.preset = "custom";
  applyThemeToApp();
  isDirty = true; importedVersion = false; status(); render();
}
function updateThemeAppearance(key, value) {
  const isThemeColor = /^@([A-Za-z][A-Za-z0-9]*)$/.exec(value || "")?.[1];
  if ((isThemeColor && !themeColors()[isThemeColor]) || (!isThemeColor && !/^#[0-9a-f]{6}$/i.test(value || ""))) return;
  planningData.theme.appearance[key] = value;
  isDirty = true; importedVersion = false; status(); render();
}
function renderThemeEditor() {
  editor.innerHTML = "";
  const card = document.createElement("div"); card.className = "editor-card";
  const top = document.createElement("div"); top.className = "editor-heading"; top.append(document.createTextNode("Thème"));
  const close = document.createElement("button"); close.textContent = "×"; close.title = "Fermer"; close.onclick = clear; top.appendChild(close); card.appendChild(top);
  const note = document.createElement("p"); note.className = "impact-note"; note.textContent = "Le nuancier distingue les couleurs de contenu, les neutres (texte, fonds et bordures) et les états. Leur usage dans le planning se règle séparément plus bas. Les couleurs choisies directement sur un élément restent intactes.";
  const preset = input("Palette de départ", "theme-preset", planningData.theme.preset, "select", [...Object.entries(THEME_PRESETS).map(([id, theme]) => [id, theme.name]), ["custom", "Personnalisé"]]);
  preset.querySelector("select").onchange = event => { if (event.target.value !== "custom") { setThemePreset(event.target.value); renderThemeEditor(); } };
  const labels = Object.fromEntries(THEME_COLOR_OPTIONS);
  const groups = document.createElement("div"); groups.className = "theme-color-groups";
  THEME_COLOR_GROUPS.forEach(([title, keys]) => {
    const group = document.createElement("div"); group.className = "theme-color-group";
    const heading = document.createElement("span"); heading.className = "theme-color-group-title"; heading.textContent = title;
    const controls = document.createElement("div"); controls.className = "theme-color-group-controls";
    keys.forEach(key => {
      const control = document.createElement("label"); control.className = "theme-color-control";
      const caption = document.createElement("span"); caption.textContent = labels[key];
      const picker = document.createElement("input"); picker.type = "color"; picker.value = planningData.theme.colors[key]; picker.title = `Choisir « ${labels[key]} »`; picker.setAttribute("aria-label", `Choisir « ${labels[key]} »`); picker.oninput = () => updateThemeColor(key, picker.value);
      control.append(caption, picker); controls.appendChild(control);
    });
    group.append(heading, controls); groups.appendChild(group);
  });
  card.append(section("Nuancier", [note, preset, groups], true));
  const backgroundColor = colorPicker("Couleur de fond", planningData.timeline.backgroundColor, value => updateTimelineBackground("backgroundColor", value));
  const backgroundOpacity = input("Opacité à l’export (0 à 1)", "backgroundOpacity", planningData.timeline.backgroundOpacity, "number");
  const backgroundOpacityField = backgroundOpacity.querySelector("input"); backgroundOpacityField.min = "0"; backgroundOpacityField.max = "1"; backgroundOpacityField.step = "0.01";
  backgroundOpacityField.oninput = event => updateTimelineBackground("backgroundOpacity", event.target.value);
  const backgroundNote = document.createElement("p"); backgroundNote.className = "impact-note"; backgroundNote.textContent = "La couleur reste pleinement visible dans l’éditeur. Son opacité est appliquée aux exports SVG et PNG ; 0 produit un fond transparent.";
  card.append(section("Fond du planning", [fieldGrid(backgroundColor, backgroundOpacity), backgroundNote], false));
  const appearanceFields = THEME_APPEARANCE_OPTIONS.map(([key, label]) => colorPicker(label, themeAppearance(key), value => updateThemeAppearance(key, value)));
  const appearanceNote = document.createElement("p"); appearanceNote.className = "hint"; appearanceNote.textContent = "Choisissez une couleur du nuancier ou une couleur personnalisée pour chaque partie du rendu.";
  card.append(section("Attribution au planning", [appearanceNote, fieldGrid(...appearanceFields)], false));
  editor.appendChild(card); layout();
}
function pinEditorActions() {
  const panelHeader = editor.querySelector(".editor-heading");
  const actions = editor.querySelector(".editor-actions");
  if (panelHeader && actions) panelHeader.appendChild(actions);
}
const renderEditorWithPinnedActions = renderEditor;
renderEditor = function () { renderEditorWithPinnedActions(); pinEditorActions(); };
const renderEditorWithLaneOrderControls = renderEditor;
renderEditor = function () {
  renderEditorWithLaneOrderControls();
  if (selection?.type !== "lane") return;
  const found = current(), card = editor.querySelector(".editor-card"), heading = card?.querySelector(".editor-heading");
  if (!found?.lane || !heading) return;
  const laneIndex = planningData.lanes.indexOf(found.lane);
  const controls = document.createElement("div");
  controls.className = "lane-order-controls";
  const up = document.createElement("button"), down = document.createElement("button");
  up.type = down.type = "button";
  up.textContent = "↑ Monter la lane";
  down.textContent = "↓ Descendre la lane";
  up.title = "Monter cette lane";
  down.title = "Descendre cette lane";
  up.disabled = laneIndex <= 0;
  down.disabled = laneIndex >= planningData.lanes.length - 1;
  up.onclick = () => moveLane(-1);
  down.onclick = () => moveLane(1);
  controls.append(up, down);
  heading.insertAdjacentElement("afterend", controls);
};
const originalClear = clear;
clear = function () { restoreTimelineControls(); originalClear(); };

svg.onclick = clear; document.getElementById("btnSave").onclick = save; document.getElementById("btnNew").onclick = createNewPlanning; document.getElementById("btnDeletePlan").onclick = deleteSavedPlanning; renamePlanButton.onclick = renameCurrentPlanning; loadButton.onclick = event => { event.stopPropagation(); const opening = loadMenu.hidden; loadMenu.hidden = !opening; loadButton.setAttribute("aria-expanded", String(opening)); }; loadMenu.onclick = event => { const option = event.target.closest("[data-plan-id]"); if (!option) return; closeLoadMenu(); loadSavedPlanning(option.dataset.planId); }; document.getElementById("btnData").onclick = () => download(new Blob([JSON.stringify(planningData, null, 2)], { type: "application/json" }), "planning-data.json"); document.getElementById("btnImport").onclick = () => document.getElementById("importFile").click(); document.getElementById("importFile").onchange = e => { importData(e.target.files[0]); e.target.value = ""; }; document.getElementById("btnSvg").onclick = () => download(new Blob([xml()], { type: "image/svg+xml;charset=utf-8" }), "planning.svg"); document.getElementById("btnPng").onclick = () => { const url = URL.createObjectURL(new Blob([xml()], { type: "image/svg+xml;charset=utf-8" })), image = new Image(); image.onload = () => { const c = document.createElement("canvas"), scale = 2; c.width = geometry.W * scale; c.height = geometry.H * scale; const ctx = c.getContext("2d"); ctx.drawImage(image, 0, 0, c.width, c.height); c.toBlob(b => { URL.revokeObjectURL(url); if (!b) return alert("L’export PNG a échoué."); download(b, "planning.png"); }, "image/png"); }; image.onerror = () => { URL.revokeObjectURL(url); alert("L’export PNG a échoué."); }; image.src = url; }; todayLineToggle.onchange = () => { planningData.timeline.showTodayLine = todayLineToggle.checked; markTimelineChange(); render(); }; dateDependenciesToggle.onchange = () => { planningData.timeline.showDateDependencies = dateDependenciesToggle.checked; markTimelineChange(); render(); }; timelineLevels.forEach(level => level.toggle.onchange = () => { planningData.timeline.levels[level.key] = level.toggle.checked; gridChoices(); planningData.timeline.gridLevel = gridTimelineLevel.value; markTimelineChange(); render(); }); gridTimelineLevel.onchange = () => { planningData.timeline.gridLevel = gridTimelineLevel.value; markTimelineChange(); render(); }; timelineLocale.onchange = () => { planningData.monthLocale = timelineLocale.value; markTimelineChange(); render(); }; window.addEventListener("beforeunload", e => { if (isDirty) { e.preventDefault(); e.returnValue = ""; } });

function closeAddMenu() { addMenu.hidden = true; addOptionsButton.setAttribute("aria-expanded", "false"); }
addButton.addEventListener("click", () => addPlanningObject("item"));
addOptionsButton.addEventListener("click", event => {
  event.stopPropagation();
  const opening = addMenu.hidden;
  addMenu.hidden = !opening;
  addOptionsButton.setAttribute("aria-expanded", String(opening));
});
addMenu.onclick = event => {
  const action = event.target.closest("[data-add-type]");
  if (!action) return;
  addPlanningObject(action.dataset.addType);
  closeAddMenu();
};
document.addEventListener("click", event => { if (!event.target.closest(".add-menu")) closeAddMenu(); if (!event.target.closest(".load-menu")) closeLoadMenu(); if (!event.target.closest(".palette-picker")) document.querySelectorAll(".palette-picker-list").forEach(menu => menu.hidden = true); if (!event.target.closest(".color-picker")) document.querySelectorAll(".color-picker-menu").forEach(menu => menu.hidden = true); });
document.addEventListener("keydown", event => { if (event.key === "Escape") { closeAddMenu(); closeLoadMenu(); } });

// The most frequent creation path: double-click an empty area of a lane.
svg.ondblclick = event => {
  if (event.target.closest?.(".planning-item")) return;
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  const local = point.matrixTransform(svg.getScreenCTM().inverse());
  if (local.x < geometry.left || local.x > geometry.left + geometry.timelineW || local.y < geometry.timelineTop || local.y > geometry.timelineBottom) return;
  const lane = planningData.lanes.find(candidate => local.y >= candidate._y && local.y <= candidate._y + candidate._h);
  if (!lane) return;
  event.preventDefault();
  addPlanningObject("item", { lane, date: dateAtX(local.x), yOffset: local.y - lane._y });
};
themeButton.onclick = () => { selection = { type: "theme" }; renderEditor(); };
readSavedPlans();
const startingPlan = savedPlans.find(plan => plan.id === activePlanId);
applyPlanning(startingPlan?.data || emptyPlanning(), { activeId: startingPlan?.id || null });

// Clicking the timeline header opens its contextual controls instead of closing
// the current editor. Selectable planning elements still stop propagation.
svg.onclick = event => {
  const point = svg.createSVGPoint(); point.x = event.clientX; point.y = event.clientY;
  const local = point.matrixTransform(svg.getScreenCTM().inverse());
  if (local.y >= 0 && local.y <= geometry.timelineTop) { selection = { type: "timeline" }; renderEditor(); }
  else clear();
};
