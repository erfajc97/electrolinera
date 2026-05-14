#!/usr/bin/env node
// Disart Energy investor pitch deck generator (PPTX, 16:9).
// Output: ./disart-investor-pitch.pptx
// Edit later in PowerPoint, Google Slides, or Keynote.

import PptxGenJS from 'pptxgenjs';
import { existsSync } from 'node:fs';

// ============================================================================
// Brand palette (hex, derived from src/styles/global.css OKLCH tokens)
// ============================================================================
const C = {
  DARK:        '0B1F14',  // ink-950
  DEEP_GREEN:  '0D3A23',  // theme-color (header bg)
  BRAND:       '1A7B4C',  // brand-600 primary
  BRAND_DARK:  '145E3A',  // brand-700
  BRAND_DEEP:  '0D4329',  // brand-800
  BRAND_LIGHT: 'C8E0D3',  // brand-200
  LIME:        'C9EE5F',  // lime-glow accent
  WHITE:       'FFFFFF',
  INK_900:     '131D19',
  INK_700:     '4F5C55',
  INK_500:     '8A9590',
  INK_300:     'B7C0BB',
  INK_100:     'EAEEEC',
  INK_50:      'F7F9F8',
};

const FONT_DISPLAY = 'Manrope';
const FONT_BODY    = 'Inter';

const HERO_IMG = 'public/img/electrolinera/station-real.jpg';
const CHARGER_IMG = 'public/img/electrolinera/station-hero.png';

// ============================================================================
// Deck setup
// ============================================================================
const pres = new PptxGenJS();
pres.author = 'Disart Energy';
pres.company = 'Disart Energy';
pres.title = 'Electrolineras Disart Energy — Oportunidad de Inversión 2026';
pres.subject = 'Pitch deck investor presentation';
pres.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 in (16:9)

// Master slide with footer + page number
pres.defineSlideMaster({
  title: 'DISART_MASTER',
  background: { color: C.WHITE },
  objects: [
    // Top-left brand mark
    { rect: { x: 0.5, y: 0.35, w: 0.32, h: 0.32, fill: { color: C.BRAND }, line: { type: 'none' } } },
    { text: {
        text: 'DISART ENERGY',
        options: { x: 0.92, y: 0.32, w: 4, h: 0.4, fontSize: 11, bold: true, color: C.DARK, fontFace: FONT_DISPLAY, charSpacing: 4 },
    } },
    // Bottom footer
    { line: { x: 0.5, y: 7.05, w: 12.33, h: 0, line: { color: C.INK_100, width: 0.75 } } },
    { text: {
        text: 'disartenergy.com · comercial@disartenergy.com',
        options: { x: 0.5, y: 7.1, w: 8, h: 0.3, fontSize: 9, color: C.INK_500, fontFace: FONT_BODY },
    } },
  ],
  slideNumber: { x: 12.6, y: 7.12, w: 0.5, h: 0.25, fontSize: 9, color: C.INK_500, align: 'right', fontFace: FONT_BODY },
});

// Master for dark slides
pres.defineSlideMaster({
  title: 'DISART_DARK',
  background: { color: C.DARK },
  objects: [
    { rect: { x: 0.5, y: 0.35, w: 0.32, h: 0.32, fill: { color: C.LIME }, line: { type: 'none' } } },
    { text: {
        text: 'DISART ENERGY',
        options: { x: 0.92, y: 0.32, w: 4, h: 0.4, fontSize: 11, bold: true, color: C.WHITE, fontFace: FONT_DISPLAY, charSpacing: 4 },
    } },
    { line: { x: 0.5, y: 7.05, w: 12.33, h: 0, line: { color: '3A4F45', width: 0.75 } } },
    { text: {
        text: 'disartenergy.com',
        options: { x: 0.5, y: 7.1, w: 8, h: 0.3, fontSize: 9, color: C.INK_300, fontFace: FONT_BODY },
    } },
  ],
  slideNumber: { x: 12.6, y: 7.12, w: 0.5, h: 0.25, fontSize: 9, color: C.INK_300, align: 'right', fontFace: FONT_BODY },
});

// ============================================================================
// Helpers
// ============================================================================
function addKicker(slide, text, opts = {}) {
  slide.addText(text, {
    x: opts.x ?? 0.5, y: opts.y ?? 1.0, w: opts.w ?? 12, h: 0.4,
    fontSize: 11, bold: true, color: opts.color ?? C.BRAND, fontFace: FONT_DISPLAY, charSpacing: 4,
  });
}

function addTitle(slide, text, opts = {}) {
  slide.addText(text, {
    x: opts.x ?? 0.5, y: opts.y ?? 1.4, w: opts.w ?? 12, h: opts.h ?? 1.1,
    fontSize: opts.fontSize ?? 36, bold: true, color: opts.color ?? C.DARK, fontFace: FONT_DISPLAY,
  });
}

function addSubtitle(slide, text, opts = {}) {
  slide.addText(text, {
    x: opts.x ?? 0.5, y: opts.y ?? 2.5, w: opts.w ?? 12, h: opts.h ?? 0.8,
    fontSize: 16, color: opts.color ?? C.INK_700, fontFace: FONT_BODY,
  });
}

function addCard(slide, { x, y, w, h, fill = C.WHITE, border = C.INK_100, radius = 0.15 }) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: fill },
    line: { color: border, width: 0.75 },
    rectRadius: radius,
  });
}

// ============================================================================
// SLIDE 1 — Cover
// ============================================================================
{
  const s = pres.addSlide({ masterName: 'DISART_DARK' });

  if (existsSync(HERO_IMG)) {
    s.addImage({ path: HERO_IMG, x: 0, y: 0, w: 13.33, h: 7.5, sizing: { type: 'cover', w: 13.33, h: 7.5 } });
  }
  // Dark overlay
  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.DARK, transparency: 30 }, line: { type: 'none' } });
  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5,
    fill: { type: 'gradient', stops: [
      { color: C.DARK, position: 0, transparency: 10 },
      { color: C.DARK, position: 100, transparency: 70 },
    ]},
    line: { type: 'none' },
  });

  // Eyebrow
  s.addShape(pres.ShapeType.roundRect, { x: 0.7, y: 2.0, w: 3.2, h: 0.45, fill: { color: 'FFFFFF', transparency: 80 }, line: { color: C.LIME, width: 0.75 }, rectRadius: 0.22 });
  s.addText('● RONDA DE INVERSIÓN 2026', {
    x: 0.7, y: 2.0, w: 3.2, h: 0.45, fontSize: 10, bold: true, color: C.LIME, fontFace: FONT_DISPLAY, align: 'center', valign: 'middle', charSpacing: 2,
  });

  s.addText([
    { text: 'Electrolineras\n', options: { color: C.WHITE } },
    { text: 'Disart Energy', options: { color: C.LIME } },
  ], {
    x: 0.7, y: 2.7, w: 11.5, h: 2.3, fontSize: 64, bold: true, fontFace: FONT_DISPLAY,
  });

  s.addText('Oportunidad de inversión en movilidad eléctrica · Colombia', {
    x: 0.7, y: 5.1, w: 11.5, h: 0.6, fontSize: 20, color: C.INK_300, fontFace: FONT_BODY,
  });

  // 3 KPI cards on bottom-right
  const kpis = [
    { v: 'USD 190k', l: 'Franquicia completa' },
    { v: '8.6 meses', l: 'Payback objetivo' },
    { v: '720 kW',    l: 'Potencia instalada' },
  ];
  kpis.forEach((k, i) => {
    const x = 0.7 + i * 3.3;
    s.addShape(pres.ShapeType.roundRect, { x, y: 6.0, w: 3.0, h: 0.85, fill: { color: 'FFFFFF', transparency: 88 }, line: { color: 'FFFFFF', width: 0.75 }, rectRadius: 0.12 });
    s.addText(k.l, { x: x + 0.2, y: 6.05, w: 2.6, h: 0.3, fontSize: 8, bold: true, color: C.INK_300, fontFace: FONT_DISPLAY, charSpacing: 2 });
    s.addText(k.v, { x: x + 0.2, y: 6.32, w: 2.6, h: 0.5, fontSize: 22, bold: true, color: C.WHITE, fontFace: FONT_DISPLAY });
  });
}

// ============================================================================
// SLIDE 2 — Problema
// ============================================================================
{
  const s = pres.addSlide({ masterName: 'DISART_MASTER' });
  addKicker(s, '01 · CONTEXTO DE MERCADO');
  addTitle(s, 'Colombia avanza hacia la movilidad eléctrica.\nLa infraestructura de carga no.');

  const items = [
    { t: 'Mercado en aceleración', d: 'La adopción de vehículos eléctricos en Colombia crece de forma exponencial, impulsada por incentivos fiscales y normativa pro-EV.' },
    { t: 'Infraestructura escasa',  d: 'Pocas estaciones de carga rápida disponibles para una flota EV que se duplica cada 12-18 meses.' },
    { t: 'Tiempos limitan adopción', d: 'La carga AC tradicional toma 6-8 horas; la carga rápida DC reduce el tiempo a 20-40 minutos y desbloquea adopción masiva.' },
  ];
  items.forEach((it, i) => {
    const y = 3.3 + i * 1.0;
    addCard(s, { x: 0.5, y, w: 12.3, h: 0.85 });
    s.addText(it.t, { x: 0.8, y: y + 0.12, w: 4, h: 0.4, fontSize: 14, bold: true, color: C.DARK, fontFace: FONT_DISPLAY });
    s.addText(it.d, { x: 5.0,  y: y + 0.12, w: 7.5, h: 0.65, fontSize: 12, color: C.INK_700, fontFace: FONT_BODY });
  });
}

// ============================================================================
// SLIDE 3 — Solución
// ============================================================================
{
  const s = pres.addSlide({ masterName: 'DISART_MASTER' });
  addKicker(s, '02 · NUESTRA PROPUESTA');
  addTitle(s, 'Electrolineras llave en mano de 720 kW.');
  addSubtitle(s, 'Disart Energy diseña, importa, instala y opera la electrolinera completa. El inversionista aporta el capital. Nosotros entregamos el activo operando.');

  const bullets = [
    { v: '3', l: 'cargadores DC',  k: '× 240 kW c/u' },
    { v: '720', l: 'kW totales',    k: 'potencia instalada' },
    { v: '6', l: 'mangueras',       k: 'CCS2 simultáneas' },
    { v: '600', l: 'kWh / hora',    k: 'capacidad efectiva' },
  ];
  bullets.forEach((b, i) => {
    const x = 0.5 + i * 3.13;
    addCard(s, { x, y: 4.0, w: 2.95, h: 2.4, fill: C.INK_50, border: C.INK_100 });
    s.addText(b.v, { x: x + 0.2, y: 4.2, w: 2.5, h: 1.0, fontSize: 56, bold: true, color: C.BRAND, fontFace: FONT_DISPLAY });
    s.addText(b.l, { x: x + 0.2, y: 5.25, w: 2.5, h: 0.4, fontSize: 14, bold: true, color: C.DARK, fontFace: FONT_DISPLAY });
    s.addText(b.k, { x: x + 0.2, y: 5.65, w: 2.5, h: 0.4, fontSize: 11, color: C.INK_700, fontFace: FONT_BODY });
  });
}

// ============================================================================
// SLIDE 4 — Modelo de negocio
// ============================================================================
{
  const s = pres.addSlide({ masterName: 'DISART_MASTER' });
  addKicker(s, '03 · UNIDAD ECONÓMICA');
  addTitle(s, 'Cobramos el doble de lo que pagamos.\nPor cada kWh.');

  // 3 columns: compra · venta · margen
  const cols = [
    { tag: 'COMPRA',  v: '$ 800',  u: 'COP / kWh', sub: 'a la empresa de energía',         fill: C.INK_50,   color: C.DARK,    accent: C.INK_700 },
    { tag: 'VENTA',   v: '$ 1.600', u: 'COP / kWh', sub: 'al conductor del vehículo',        fill: C.BRAND_LIGHT, color: C.DARK, accent: C.BRAND_DARK },
    { tag: 'MARGEN',  v: '$ 800',  u: 'COP / kWh', sub: 'bruto por cada kWh entregado',     fill: C.LIME,     color: C.DARK,    accent: C.BRAND_DEEP },
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 4.18;
    addCard(s, { x, y: 3.4, w: 4.0, h: 3.2, fill: c.fill, border: c.fill });
    s.addText(c.tag,   { x: x + 0.3, y: 3.55, w: 3.5, h: 0.4, fontSize: 11, bold: true, color: c.accent, fontFace: FONT_DISPLAY, charSpacing: 4 });
    s.addText(c.v,     { x: x + 0.3, y: 4.0,  w: 3.5, h: 1.0, fontSize: 56, bold: true, color: c.color,  fontFace: FONT_DISPLAY });
    s.addText(c.u,     { x: x + 0.3, y: 5.05, w: 3.5, h: 0.4, fontSize: 14, bold: true, color: c.color,  fontFace: FONT_DISPLAY });
    s.addText(c.sub,   { x: x + 0.3, y: 5.55, w: 3.5, h: 0.6, fontSize: 12, color: c.accent, fontFace: FONT_BODY });
  });

  // Footnote
  s.addText('A capacidad plena (600 kWh/hora), el margen bruto por hora de operación es de $480.000 COP.',
    { x: 0.5, y: 6.65, w: 12.3, h: 0.3, fontSize: 11, italic: true, color: C.INK_500, fontFace: FONT_BODY, align: 'center' });
}

// ============================================================================
// SLIDE 5 — Infraestructura visual + CAPEX
// ============================================================================
{
  const s = pres.addSlide({ masterName: 'DISART_MASTER' });
  addKicker(s, '04 · CAPEX');
  addTitle(s, 'USD 190.000 entrega la franquicia completa.');
  addSubtitle(s, 'Todo incluido — hardware, obra civil, transformador, permisos y legalización.');

  const capex = [
    { k: 'Cargadores rápidos (3 × 240 kW)',       pct: 41, cop: '$ 270 M COP' },
    { k: 'Transformador 1000 kVA',                pct: 21, cop: '$ 140 M COP' },
    { k: 'Obras civiles (excavación, placa, bases)', pct: 24, cop: '$ 160 M COP' },
    { k: 'Sistema eléctrico y conexión',          pct: 11, cop: '$ 70 M COP'  },
    { k: 'Trámites, diseño y legalización',       pct:  3, cop: '$ 20 M COP'  },
  ];
  capex.forEach((c, i) => {
    const y = 3.7 + i * 0.6;
    s.addText(c.k, { x: 0.5, y, w: 5.5, h: 0.4, fontSize: 12, color: C.DARK, bold: true, fontFace: FONT_BODY });
    // bar background
    s.addShape(pres.ShapeType.roundRect, { x: 6.0, y: y + 0.1, w: 5.0, h: 0.2, fill: { color: C.INK_100 }, line: { type: 'none' }, rectRadius: 0.1 });
    // bar fill
    s.addShape(pres.ShapeType.roundRect, { x: 6.0, y: y + 0.1, w: (c.pct / 50) * 5.0, h: 0.2, fill: { color: C.BRAND }, line: { type: 'none' }, rectRadius: 0.1 });
    s.addText(`${c.pct}%`,  { x: 11.1, y, w: 0.8, h: 0.4, fontSize: 12, bold: true, color: C.BRAND_DARK, fontFace: FONT_DISPLAY, align: 'left' });
    s.addText(c.cop, { x: 11.7, y, w: 1.2, h: 0.4, fontSize: 11, color: C.INK_700, fontFace: FONT_BODY, align: 'right' });
  });

  // Total card
  addCard(s, { x: 0.5, y: 6.85, w: 12.3, h: 0.0, border: 'FFFFFF', fill: 'FFFFFF' }); // spacer
}

// ============================================================================
// SLIDE 6 — Escenarios de operación
// ============================================================================
{
  const s = pres.addSlide({ masterName: 'DISART_MASTER' });
  addKicker(s, '05 · ESCENARIOS DE OPERACIÓN');
  addTitle(s, 'Tres escenarios. Payback desde 5.5 meses.');

  const scenarios = [
    { tag: 'BAJO',     hours: '3 h/día',  monthly: '$ 33.2 M', annual: '$ 398.4 M',  payback: '20 meses', highlight: false },
    { tag: 'OBJETIVO', hours: '6 h/día',  monthly: '$ 76.4 M', annual: '$ 916.8 M',  payback: '8.6 meses',  highlight: true  },
    { tag: 'ALTO',     hours: '9 h/día',  monthly: '$ 119.6 M', annual: '$ 1.435 M', payback: '5.5 meses',  highlight: false },
  ];
  scenarios.forEach((sc, i) => {
    const x = 0.5 + i * 4.18;
    const fill = sc.highlight ? C.DARK : C.WHITE;
    const txt  = sc.highlight ? C.WHITE : C.DARK;
    const accent = sc.highlight ? C.LIME : C.BRAND;
    const sub = sc.highlight ? C.INK_300 : C.INK_700;
    const border = sc.highlight ? C.DARK : C.INK_100;
    addCard(s, { x, y: 3.3, w: 4.0, h: 3.6, fill, border, radius: 0.18 });
    s.addText(sc.tag,    { x: x + 0.3, y: 3.5,  w: 3.5, h: 0.4, fontSize: 11, bold: true, color: accent, fontFace: FONT_DISPLAY, charSpacing: 3 });
    s.addText(sc.hours,  { x: x + 0.3, y: 3.85, w: 3.5, h: 0.5, fontSize: 26, bold: true, color: txt, fontFace: FONT_DISPLAY });
    s.addText('Utilidad mensual',   { x: x + 0.3, y: 4.55, w: 3.5, h: 0.3, fontSize: 10, bold: true, color: sub, fontFace: FONT_DISPLAY, charSpacing: 2 });
    s.addText(`${sc.monthly} COP`,  { x: x + 0.3, y: 4.85, w: 3.5, h: 0.4, fontSize: 16, bold: true, color: txt, fontFace: FONT_DISPLAY });
    s.addText('Utilidad anual',     { x: x + 0.3, y: 5.35, w: 3.5, h: 0.3, fontSize: 10, bold: true, color: sub, fontFace: FONT_DISPLAY, charSpacing: 2 });
    s.addText(`${sc.annual} COP`,   { x: x + 0.3, y: 5.65, w: 3.5, h: 0.4, fontSize: 16, bold: true, color: txt, fontFace: FONT_DISPLAY });
    s.addText('Payback',            { x: x + 0.3, y: 6.1,  w: 3.5, h: 0.3, fontSize: 10, bold: true, color: sub, fontFace: FONT_DISPLAY, charSpacing: 2 });
    s.addText(sc.payback,           { x: x + 0.3, y: 6.4,  w: 3.5, h: 0.4, fontSize: 18, bold: true, color: accent, fontFace: FONT_DISPLAY });
  });
  s.addText('Supuestos: capacidad 600 kWh/h · margen $ 800/kWh · costos administrativos $ 10 M COP/mes.',
    { x: 0.5, y: 7.0, w: 12.3, h: 0.3, fontSize: 10, italic: true, color: C.INK_500, fontFace: FONT_BODY, align: 'center' });
}

// ============================================================================
// SLIDE 7 — Tabla de participación
// ============================================================================
{
  const s = pres.addSlide({ masterName: 'DISART_MASTER' });
  addKicker(s, '06 · MODELO DE INVERSIÓN');
  addTitle(s, 'Elige cuánto quieres ser dueño.');
  addSubtitle(s, 'Cada inversionista adquiere un porcentaje real de la electrolinera. Utilidades, valorización y propiedad del activo proporcionales al aporte.');

  // Table
  const tableHeader = [
    { text: 'Inversión USD',   options: { bold: true, fill: { color: C.DARK }, color: C.WHITE, fontSize: 12, fontFace: FONT_DISPLAY, align: 'left',   valign: 'middle' } },
    { text: 'Participación',   options: { bold: true, fill: { color: C.DARK }, color: C.WHITE, fontSize: 12, fontFace: FONT_DISPLAY, align: 'center', valign: 'middle' } },
    { text: 'Retorno mensual proyectado', options: { bold: true, fill: { color: C.DARK }, color: C.WHITE, fontSize: 12, fontFace: FONT_DISPLAY, align: 'right',  valign: 'middle' } },
  ];
  const tableRows = [
    [
      { text: 'USD 19.000',  options: { color: C.DARK, fontSize: 14, bold: true, fontFace: FONT_DISPLAY } },
      { text: '10%',         options: { color: C.INK_700, fontSize: 14, fontFace: FONT_BODY, align: 'center' } },
      { text: '≈ USD 1.800', options: { color: C.BRAND_DARK, fontSize: 14, bold: true, fontFace: FONT_DISPLAY, align: 'right' } },
    ],
    [
      { text: 'USD 38.000',  options: { color: C.DARK, fontSize: 14, bold: true, fontFace: FONT_DISPLAY } },
      { text: '20%',         options: { color: C.INK_700, fontSize: 14, fontFace: FONT_BODY, align: 'center' } },
      { text: '≈ USD 3.600', options: { color: C.BRAND_DARK, fontSize: 14, bold: true, fontFace: FONT_DISPLAY, align: 'right' } },
    ],
    [
      { text: 'USD 57.000',  options: { color: C.DARK, fontSize: 14, bold: true, fontFace: FONT_DISPLAY } },
      { text: '30%',         options: { color: C.INK_700, fontSize: 14, fontFace: FONT_BODY, align: 'center' } },
      { text: '≈ USD 5.400', options: { color: C.BRAND_DARK, fontSize: 14, bold: true, fontFace: FONT_DISPLAY, align: 'right' } },
    ],
    [
      { text: 'USD 95.000  ★ recomendado', options: { color: C.WHITE, fill: { color: C.BRAND }, fontSize: 14, bold: true, fontFace: FONT_DISPLAY } },
      { text: '50%',          options: { color: C.WHITE, fill: { color: C.BRAND }, fontSize: 14, bold: true, fontFace: FONT_DISPLAY, align: 'center' } },
      { text: '≈ USD 9.000',  options: { color: C.LIME,  fill: { color: C.BRAND }, fontSize: 14, bold: true, fontFace: FONT_DISPLAY, align: 'right' } },
    ],
    [
      { text: 'USD 190.000', options: { color: C.DARK, fontSize: 14, bold: true, fontFace: FONT_DISPLAY } },
      { text: '100%',        options: { color: C.INK_700, fontSize: 14, fontFace: FONT_BODY, align: 'center' } },
      { text: '≈ USD 18.000',options: { color: C.BRAND_DARK, fontSize: 14, bold: true, fontFace: FONT_DISPLAY, align: 'right' } },
    ],
  ];
  s.addTable([tableHeader, ...tableRows], {
    x: 0.5, y: 3.6, w: 12.3, h: 3.0,
    colW: [4.1, 3.1, 5.1],
    rowH: 0.55,
    border: { type: 'solid', pt: 0.5, color: C.INK_100 },
    valign: 'middle',
  });

  s.addText('Retornos proyectados sobre facturación mínima estimada de USD 18.000/mes (escenario objetivo 6 h/día). Valores brutos antes de costos operativos y fiscales.',
    { x: 0.5, y: 6.7, w: 12.3, h: 0.4, fontSize: 10, italic: true, color: C.INK_500, fontFace: FONT_BODY });
}

// ============================================================================
// SLIDE 8 — Diferenciales vs competencia
// ============================================================================
{
  const s = pres.addSlide({ masterName: 'DISART_MASTER' });
  addKicker(s, '07 · POR QUÉ DISART');
  addTitle(s, 'Lo que otros tercerizan,\nnosotros ya lo resolvimos.');

  const rows = [
    ['Importación de equipos sin retención aduanera', 'incluida',           'el inversor asume'],
    ['Permisos CREG / operador de red en Colombia',   'ya obtenidos',       'trámite + meses'],
    ['Certificaciones eléctricas e IEC 61851',        'incluidas',          'a cuenta del inversor'],
    ['Negociación con empresa de energía',            'establecida',        'el inversor inicia'],
    ['Obra civil + transformador 1000 kVA',           'llave en mano',      'contratista externo'],
    ['App white-label para conductores',              'setup + suscripción','no disponible / contrato externo'],
    ['Dashboard de operación y BI',                   'suscripción SaaS',   'licencia separada cara'],
    ['Soporte y monitoreo 24/7',                      'incluido',           'contrato adicional'],
    ['Mantenimiento preventivo y correctivo',         'operado por Disart', 'el inversor coordina'],
  ];
  const headers = [
    { text: 'Capacidad',    options: { bold: true, color: C.INK_700, fontSize: 10, fill: { color: C.INK_50 }, fontFace: FONT_DISPLAY, charSpacing: 2 } },
    { text: 'DISART ENERGY', options: { bold: true, color: C.WHITE,  fontSize: 10, fill: { color: C.BRAND }, fontFace: FONT_DISPLAY, charSpacing: 2, align: 'center' } },
    { text: 'OTRAS OPCIONES', options: { bold: true, color: C.INK_700, fontSize: 10, fill: { color: C.INK_50 }, fontFace: FONT_DISPLAY, charSpacing: 2, align: 'center' } },
  ];
  const body = rows.map((r) => [
    { text: r[0], options: { color: C.DARK,    fontSize: 11, fontFace: FONT_BODY, valign: 'middle' } },
    { text: `✓ ${r[1]}`, options: { color: C.BRAND_DARK, fontSize: 11, bold: true, fontFace: FONT_DISPLAY, valign: 'middle', align: 'center', fill: { color: 'EFF7F1' } } },
    { text: `✗ ${r[2]}`, options: { color: C.INK_700, fontSize: 11, fontFace: FONT_BODY, valign: 'middle', align: 'center' } },
  ]);

  s.addTable([headers, ...body], {
    x: 0.5, y: 3.2, w: 12.3, h: 3.6,
    colW: [5.5, 3.4, 3.4],
    rowH: 0.36,
    border: { type: 'solid', pt: 0.5, color: C.INK_100 },
    valign: 'middle',
  });
}

// ============================================================================
// SLIDE 9 — Software (App + Dashboard SaaS)
// ============================================================================
{
  const s = pres.addSlide({ masterName: 'DISART_MASTER' });
  addKicker(s, '08 · SOFTWARE');
  addTitle(s, 'App + Dashboard SaaS bajo suscripción mensual.');
  addSubtitle(s, 'Cada franquicia opera bajo la plataforma Disart. La versión marca blanca lleva un setup adicional para personalizar branding y publicar bajo el inversionista.');

  const cards = [
    { tag: 'APP DEL CONDUCTOR', title: 'Disart Drive', items: [
      'Mapa con disponibilidad en tiempo real',
      'Reserva anticipada + QR',
      'Pagos PSE, Nequi, Daviplata, tarjeta',
      'Historial, recibos y CO₂ ahorrado',
      'Programa de puntos y referidos',
      'Versión marca blanca opcional con setup',
    ], fill: C.WHITE, color: C.DARK, accent: C.BRAND },
    { tag: 'DASHBOARD DEL FRANQUICIADO', title: 'Disart Operations', items: [
      'Ingresos por sitio, conector y turno',
      'Eficiencia energética y costo / kWh',
      'Alertas y diagnóstico remoto',
      'Cierre contable y factura DIAN',
      'Tarifas dinámicas + integraciones API',
      'Suscripción SaaS mensual',
    ], fill: C.DARK, color: C.WHITE, accent: C.LIME },
  ];
  cards.forEach((c, i) => {
    const x = 0.5 + i * 6.2;
    addCard(s, { x, y: 3.4, w: 6.05, h: 3.7, fill: c.fill, border: c.fill, radius: 0.2 });
    s.addText(c.tag,   { x: x + 0.3, y: 3.55, w: 5.7, h: 0.4, fontSize: 10, bold: true, color: c.accent, fontFace: FONT_DISPLAY, charSpacing: 3 });
    s.addText(c.title, { x: x + 0.3, y: 3.9,  w: 5.7, h: 0.6, fontSize: 24, bold: true, color: c.color, fontFace: FONT_DISPLAY });
    c.items.forEach((it, j) => {
      s.addText(`✓  ${it}`, { x: x + 0.3, y: 4.6 + j * 0.36, w: 5.7, h: 0.36, fontSize: 11, color: c.color === C.DARK ? C.INK_700 : C.INK_300, fontFace: FONT_BODY });
    });
  });
}

// ============================================================================
// SLIDE 10 — Hardware YLC-KC-240
// ============================================================================
{
  const s = pres.addSlide({ masterName: 'DISART_MASTER' });
  addKicker(s, '09 · HARDWARE');
  addTitle(s, 'Cargador DISART YLC-KC-240');
  addSubtitle(s, 'El cargador insignia de nuestra franquicia. Tres unidades por estación, importadas, certificadas e integradas al ecosistema Disart.');

  // Image left
  if (existsSync(CHARGER_IMG)) {
    s.addImage({ path: CHARGER_IMG, x: 0.5, y: 3.4, w: 4.0, h: 3.7, sizing: { type: 'contain', w: 4.0, h: 3.7 } });
  } else {
    addCard(s, { x: 0.5, y: 3.4, w: 4.0, h: 3.7, fill: C.INK_50, border: C.INK_100 });
    s.addText('YLC-KC-240', { x: 0.5, y: 4.8, w: 4, h: 0.6, fontSize: 24, bold: true, color: C.DARK, align: 'center', fontFace: FONT_DISPLAY });
  }

  // Spec list right
  const specs = [
    ['Potencia nominal',   '240 kW'],
    ['Conectores',         'CCS2 × 2'],
    ['Cable',              '5 m'],
    ['Tensión de salida',  '200–1000 V'],
    ['Corriente de salida','0–250 A'],
    ['Eficiencia',         '≥ 94.5%'],
    ['Refrigeración',      'Aire forzado'],
    ['Comunicación',       'Ethernet · 2/3/4G · OCPP 1.6'],
    ['Pago',               'Tarjeta + lectura de código'],
    ['Estándares',         'IEC 61851-1, 23 · EN 61851-24'],
  ];
  specs.forEach((sp, i) => {
    const y = 3.45 + i * 0.36;
    s.addText(sp[0], { x: 5.0, y, w: 3.5, h: 0.3, fontSize: 11, color: C.INK_500, fontFace: FONT_BODY });
    s.addText(sp[1], { x: 8.6, y, w: 4.2, h: 0.3, fontSize: 12, bold: true, color: C.DARK, fontFace: FONT_DISPLAY, align: 'right' });
    s.addShape(pres.ShapeType.line, { x: 5.0, y: y + 0.3, w: 7.8, h: 0, line: { color: C.INK_100, width: 0.5, dashType: 'dash' } });
  });
}

// ============================================================================
// SLIDE 11 — Timeline 60-90 días
// ============================================================================
{
  const s = pres.addSlide({ masterName: 'DISART_MASTER' });
  addKicker(s, '10 · PUESTA EN MARCHA');
  addTitle(s, '60 a 90 días.\nDesde la firma hasta los primeros ingresos.');
  addSubtitle(s, 'Disart ejecuta todas las fases en paralelo. El inversor solo firma y recibe utilidades.');

  const phases = [
    { n: '01', t: 'Firma y due diligence', d: 'Validación de sitio, contrato de inversión y desembolso inicial.' },
    { n: '02', t: 'Ingeniería + permisos', d: 'Diseño eléctrico, trámites CREG/UPME y negociación con operador de red.' },
    { n: '03', t: 'Importación + obra',    d: 'Llegada de cargadores y transformador, obra civil y montaje eléctrico.' },
    { n: '04', t: 'Pruebas y puesta en marcha', d: 'Comisionado OCPP, certificación de carga al 100% y apertura comercial.' },
  ];
  phases.forEach((p, i) => {
    const x = 0.5 + i * 3.13;
    addCard(s, { x, y: 4.0, w: 2.95, h: 2.5 });
    // Number badge
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.25, y: 4.15, w: 0.55, h: 0.55, fill: { color: C.BRAND }, line: { type: 'none' } });
    s.addText(p.n, { x: x + 0.25, y: 4.15, w: 0.55, h: 0.55, fontSize: 12, bold: true, color: C.WHITE, fontFace: FONT_DISPLAY, align: 'center', valign: 'middle' });
    s.addText(p.t, { x: x + 0.25, y: 4.85, w: 2.5,  h: 0.5, fontSize: 14, bold: true, color: C.DARK, fontFace: FONT_DISPLAY });
    s.addText(p.d, { x: x + 0.25, y: 5.4,  w: 2.5,  h: 1.0, fontSize: 11, color: C.INK_700, fontFace: FONT_BODY });
  });
}

// ============================================================================
// SLIDE 12 — Garantías al inversionista
// ============================================================================
{
  const s = pres.addSlide({ masterName: 'DISART_MASTER' });
  addKicker(s, '11 · GARANTÍAS AL INVERSIONISTA');
  addTitle(s, 'Tu inversión está respaldada por un activo real.');

  const items = [
    { t: 'Participación accionaria', d: 'Propiedad proporcional sobre la electrolinera y todos sus activos físicos.' },
    { t: 'Contrato de inversión privada', d: 'Documento legal que formaliza condiciones, plazos y derechos del inversionista.' },
    { t: 'Distribución periódica de utilidades', d: 'Corte mensual auditable desde el dashboard, con liquidación en USD o COP.' },
    { t: 'Derecho sobre valorización del activo', d: 'El activo se aprecia con la maduración del mercado EV en Colombia.' },
    { t: 'Operación gestionada por Disart', d: 'Monitoreo 24/7, mantenimiento, atención al cliente y reportería contable a cargo nuestro.' },
    { t: 'Cobertura legal y regulatoria', d: 'Disart asume el riesgo regulatorio CREG/UPME — el inversor no.' },
  ];
  items.forEach((it, i) => {
    const x = 0.5 + (i % 2) * 6.2;
    const y = 3.3 + Math.floor(i / 2) * 1.2;
    addCard(s, { x, y, w: 6.05, h: 1.1 });
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.25, y: y + 0.3, w: 0.5, h: 0.5, fill: { color: C.LIME }, line: { type: 'none' } });
    s.addText('✓', { x: x + 0.25, y: y + 0.3, w: 0.5, h: 0.5, fontSize: 14, bold: true, color: C.BRAND_DEEP, fontFace: FONT_DISPLAY, align: 'center', valign: 'middle' });
    s.addText(it.t, { x: x + 0.95, y: y + 0.2, w: 4.9, h: 0.4, fontSize: 13, bold: true, color: C.DARK,  fontFace: FONT_DISPLAY });
    s.addText(it.d, { x: x + 0.95, y: y + 0.55, w: 4.9, h: 0.55, fontSize: 11, color: C.INK_700, fontFace: FONT_BODY });
  });
}

// ============================================================================
// SLIDE 13 — Resumen / numbers at-a-glance
// ============================================================================
{
  const s = pres.addSlide({ masterName: 'DISART_DARK' });
  s.addText('RESUMEN', { x: 0.7, y: 1.4, w: 12, h: 0.5, fontSize: 12, bold: true, color: C.LIME, charSpacing: 4, fontFace: FONT_DISPLAY });
  s.addText('Los números que importan.', { x: 0.7, y: 1.85, w: 12, h: 1.0, fontSize: 36, bold: true, color: C.WHITE, fontFace: FONT_DISPLAY });

  const blocks = [
    { v: 'USD 190.000', l: 'CAPEX por franquicia',     k: 'todo incluido' },
    { v: '720 kW',      l: 'Potencia por estación',    k: '3 × 240 kW · 6 mangueras' },
    { v: '2×',          l: 'Margen sobre el kWh',      k: 'compra 800 · venta 1.600 COP' },
    { v: '8.6 meses',   l: 'Payback objetivo',         k: 'escenario 6 h/día' },
    { v: 'USD 216k',    l: 'Facturación anual mínima', k: 'USD 18k/mes proyectados' },
    { v: '60-90 días',  l: 'Puesta en marcha',         k: 'firma → operación' },
  ];
  blocks.forEach((b, i) => {
    const x = 0.7 + (i % 3) * 4.18;
    const y = 3.4 + Math.floor(i / 3) * 1.95;
    addCard(s, { x, y, w: 4.0, h: 1.8, fill: '11241B', border: '233B2C' });
    s.addText(b.v, { x: x + 0.2, y: y + 0.2, w: 3.7, h: 0.7, fontSize: 28, bold: true, color: C.LIME, fontFace: FONT_DISPLAY });
    s.addText(b.l, { x: x + 0.2, y: y + 0.95, w: 3.7, h: 0.35, fontSize: 12, bold: true, color: C.WHITE, fontFace: FONT_DISPLAY });
    s.addText(b.k, { x: x + 0.2, y: y + 1.3, w: 3.7, h: 0.35, fontSize: 10, color: C.INK_300, fontFace: FONT_BODY });
  });
}

// ============================================================================
// SLIDE 14 — Riesgos + mitigación
// ============================================================================
{
  const s = pres.addSlide({ masterName: 'DISART_MASTER' });
  addKicker(s, '12 · GESTIÓN DE RIESGOS');
  addTitle(s, 'Riesgos identificados y cómo los mitigamos.');

  const risks = [
    { r: 'Aprobación regulatoria CREG / UPME',  m: 'Disart cuenta con permisos vigentes y relación directa con la autoridad — el inversor no entra al trámite.' },
    { r: 'Aduana e importación de cargadores',  m: 'Disart es importador certificado con histórico libre de retención.' },
    { r: 'Adopción de vehículos eléctricos',    m: 'Crecimiento del parque EV en Colombia es estructural y respaldado por incentivos fiscales.' },
    { r: 'Tarifa eléctrica al alza',            m: 'Modelo de venta al kWh transfiere variación de costo al consumidor; margen relativo se preserva.' },
    { r: 'Disponibilidad técnica del cargador', m: 'Mantenimiento preventivo y SLA operativo de Disart; repuestos en bodega local.' },
    { r: 'Liquidez del activo',                 m: 'Disart facilita la salida del inversionista mediante recompra o transferencia de participación a tercero.' },
  ];
  risks.forEach((it, i) => {
    const y = 3.2 + i * 0.6;
    addCard(s, { x: 0.5, y, w: 12.3, h: 0.5, fill: i % 2 === 0 ? C.INK_50 : C.WHITE });
    s.addText(it.r, { x: 0.7, y: y + 0.1, w: 4.5, h: 0.3, fontSize: 12, bold: true, color: C.DARK, fontFace: FONT_DISPLAY });
    s.addText(it.m, { x: 5.4, y: y + 0.1, w: 7.4, h: 0.3, fontSize: 11, color: C.INK_700, fontFace: FONT_BODY });
  });
}

// ============================================================================
// SLIDE 15 — Próximos pasos
// ============================================================================
{
  const s = pres.addSlide({ masterName: 'DISART_MASTER' });
  addKicker(s, '13 · PRÓXIMOS PASOS');
  addTitle(s, 'Cómo entrar a la ronda 2026.');

  const steps = [
    { n: '1', t: 'Reunión exploratoria', d: 'Compartimos contexto, validamos perfil del inversionista y resolvemos preguntas iniciales.' },
    { n: '2', t: 'Carta de intención',   d: 'Firma de Letter of Intent (LOI) reservando el cupo de la ronda con condiciones preliminares.' },
    { n: '3', t: 'Due diligence + contrato', d: 'Revisión legal y financiera. Firma de contrato de inversión privada y cronograma.' },
    { n: '4', t: 'Desembolso + ejecución',   d: 'Aporte de capital según hito acordado. Disart ejecuta obra. Operación comercial en 60-90 días.' },
  ];
  steps.forEach((st, i) => {
    const y = 3.4 + i * 0.85;
    addCard(s, { x: 0.5, y, w: 12.3, h: 0.7 });
    s.addShape(pres.ShapeType.ellipse, { x: 0.75, y: y + 0.15, w: 0.5, h: 0.5, fill: { color: C.BRAND }, line: { type: 'none' } });
    s.addText(st.n, { x: 0.75, y: y + 0.15, w: 0.5, h: 0.5, fontSize: 14, bold: true, color: C.WHITE, fontFace: FONT_DISPLAY, align: 'center', valign: 'middle' });
    s.addText(st.t, { x: 1.5, y: y + 0.1, w: 4.5, h: 0.5, fontSize: 14, bold: true, color: C.DARK, fontFace: FONT_DISPLAY, valign: 'middle' });
    s.addText(st.d, { x: 6.0, y: y + 0.1, w: 6.7, h: 0.5, fontSize: 11, color: C.INK_700, fontFace: FONT_BODY, valign: 'middle' });
  });
}

// ============================================================================
// SLIDE 16 — Cierre / contacto
// ============================================================================
{
  const s = pres.addSlide({ masterName: 'DISART_DARK' });
  if (existsSync(HERO_IMG)) {
    s.addImage({ path: HERO_IMG, x: 0, y: 0, w: 13.33, h: 7.5, sizing: { type: 'cover', w: 13.33, h: 7.5 } });
  }
  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.DARK, transparency: 20 }, line: { type: 'none' } });

  s.addShape(pres.ShapeType.roundRect, { x: 0.7, y: 2.4, w: 3.0, h: 0.45, fill: { color: 'FFFFFF', transparency: 80 }, line: { color: C.LIME, width: 0.75 }, rectRadius: 0.22 });
  s.addText('● ÚNETE A LA RONDA 2026', { x: 0.7, y: 2.4, w: 3.0, h: 0.45, fontSize: 10, bold: true, color: C.LIME, fontFace: FONT_DISPLAY, align: 'center', valign: 'middle', charSpacing: 2 });

  s.addText([
    { text: 'Construyamos\n', options: { color: C.WHITE } },
    { text: 'la red.', options: { color: C.LIME } },
  ], { x: 0.7, y: 3.0, w: 11.5, h: 2.4, fontSize: 72, bold: true, fontFace: FONT_DISPLAY });

  s.addText('Reunión exploratoria · sin compromiso', { x: 0.7, y: 5.6, w: 11.5, h: 0.4, fontSize: 18, color: C.INK_300, fontFace: FONT_BODY });

  // Contact block
  const contact = [
    { label: 'Email',     value: 'comercial@disartenergy.com' },
    { label: 'Teléfono',  value: '+57 310 4836462' },
    { label: 'Sitio web', value: 'disartenergy.com' },
    { label: 'Ciudad',    value: 'Bogotá, Colombia' },
  ];
  contact.forEach((c, i) => {
    const x = 0.7 + (i % 2) * 6.0;
    const y = 6.1 + Math.floor(i / 2) * 0.45;
    s.addText(c.label.toUpperCase(), { x, y, w: 1.4, h: 0.35, fontSize: 9, bold: true, color: C.LIME, fontFace: FONT_DISPLAY, charSpacing: 2, valign: 'middle' });
    s.addText(c.value, { x: x + 1.4, y, w: 4.5, h: 0.35, fontSize: 13, bold: true, color: C.WHITE, fontFace: FONT_DISPLAY, valign: 'middle' });
  });
}

// ============================================================================
// Write file
// ============================================================================
const outputPath = 'disart-investor-pitch.pptx';
await pres.writeFile({ fileName: outputPath });
console.log(`\n✓ Generated: ${outputPath}`);
console.log(`  Slides: 16`);
console.log(`  Edit in PowerPoint, Google Slides, or Keynote.`);
