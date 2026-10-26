// Genera docs/justificacion-30-disart.pdf (Chrome headless) a partir de
// src/config/servicios-30.json. Uso: node scripts/build-justificacion-pdf.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const servicios = JSON.parse(readFileSync(resolve(root, 'src/config/servicios-30.json'), 'utf8'));
const outDir = resolve(root, 'docs');
mkdirSync(outDir, { recursive: true });

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);
if (!CHROME) throw new Error('No se encontró Chrome ni Edge');

// Ejemplo de distribución (mismos supuestos que la página)
const POWER_KW = 720, HOURS = 4, DAYS = 30, PRICE = 1800, COST = 800;
const kwh = POWER_KW * HOURS * DAYS;
const sales = kwh * PRICE, energy = kwh * COST, margin = sales - energy;
const inv = margin * 0.7, dis = margin * 0.3;
const cop = (n) => '$ ' + Math.round(n).toLocaleString('es-CO');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fases = [...new Set(servicios.map((s) => s.fase))];

const seccionesServicios = fases
  .map(
    (fase) => `
  <h3 class="fase">${esc(fase)}</h3>
  ${servicios
    .filter((s) => s.fase === fase)
    .map(
      (s) => `
    <section class="servicio">
      <h4><span class="num">${String(s.n).padStart(2, '0')}</span> ${esc(s.title)}</h4>
      <p>${esc(s.summary)}</p>
      <ul>${s.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    </section>`
    )
    .join('')}`
  )
  .join('');

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>Alcance del 30% de Disart Energy</title>
<style>
  @page { size: A4; margin: 22mm 20mm 22mm 20mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; font-size: 10.5pt; line-height: 1.5; margin: 0; }
  header.doc { border-bottom: 1.5px solid #1a1a1a; padding-bottom: 8px; margin-bottom: 22px; }
  header.doc .emp { font-size: 9pt; letter-spacing: .14em; text-transform: uppercase; color: #444; }
  h1 { font-size: 20pt; line-height: 1.2; margin: 6px 0 2px; font-weight: 700; }
  .sub { color: #555; font-style: italic; margin: 0; }
  h2 { font-size: 13pt; margin: 26px 0 8px; padding-bottom: 3px; border-bottom: 1px solid #bbb; page-break-after: avoid; }
  h3.fase { font-size: 10pt; letter-spacing: .12em; text-transform: uppercase; color: #1f5c3a; margin: 20px 0 8px; page-break-after: avoid; }
  p { margin: 0 0 8px; text-align: justify; }
  .servicio { margin: 0 0 14px; page-break-inside: avoid; }
  .servicio h4 { font-size: 11pt; margin: 0 0 3px; }
  .servicio h4 .num { color: #1f5c3a; margin-right: 6px; }
  ul { margin: 4px 0 0 0; padding-left: 18px; }
  li { margin: 0 0 2px; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0 6px; font-size: 10pt; }
  td, th { padding: 5px 8px; border-bottom: 1px solid #d5d5d5; text-align: left; }
  td.r, th.r { text-align: right; white-space: nowrap; }
  tr.tot td { border-top: 1.5px solid #1a1a1a; font-weight: 700; }
  .nota { font-size: 9pt; color: #555; }
  .chips { margin: 6px 0 0; padding-left: 18px; columns: 2; }
  footer.doc { margin-top: 30px; padding-top: 8px; border-top: 1px solid #bbb; font-size: 9pt; color: #555; }
</style></head><body>

<header class="doc">
  <div class="emp">Disart Energy &amp; Machine S.A.S.</div>
  <h1>Qué cubre el 30% de Disart Energy</h1>
  <p class="sub">Detalle del alcance de servicios dentro del esquema 70% inversionista / 30% Disart</p>
</header>

<h2>1. El esquema en pocas palabras</h2>
<p>El inversionista aporta el capital de <strong>$ 660.000.000 COP</strong> para desarrollar una electrolinera de 720 kW (tres cargadores DC de 240 kW). A cambio es dueño del <strong>70%</strong> de los equipos y de la infraestructura y recibe el <strong>70%</strong> del resultado distribuible. Disart Energy conserva el <strong>30%</strong> restante.</p>
<p>El resultado distribuible se calcula tomando los ingresos por venta de energía y descontando el costo de la energía comprada y los impuestos aplicables. Sobre ese resultado se aplica el reparto 70/30.</p>
<p>Ese 30% no es una participación pasiva: es la remuneración por asumir, de principio a fin, todo el trabajo que hace falta para que la electrolinera exista, funcione y se mantenga segura. Un inversionista que quisiera armar esto por su cuenta tendría que contratar por separado a un importador, un gestor de permisos, un constructor, un proveedor de software, una pasarela de pagos, un centro de monitoreo, técnicos de mantenimiento y un equipo de seguridad informática, y además coordinarlos entre sí. Con Disart es un solo responsable y un solo reparto.</p>

<h2>2. Alcance detallado de los servicios</h2>
<p>A continuación se describe, área por área, lo que Disart Energy hace y asume con su 30%.</p>
${seccionesServicios}

<h2>3. Lo que el inversionista no paga aparte</h2>
<p>Con su 70% del resultado distribuible el inversionista no recibe cobros adicionales de Disart por ninguno de los servicios descritos: el software y la aplicación, la pasarela de pagos y el cobro, la administración, el monitoreo 24/7, el soporte a los conductores y el mantenimiento ordinario están cubiertos por el 30%. Tampoco hay un porcentaje adicional por el uso de la plataforma.</p>

<h2>4. Gastos extraordinarios</h2>
<p>Quedan para regularse expresamente en el contrato la reposición de equipos principales, las ampliaciones de infraestructura y los daños que no estén cubiertos por garantía.</p>

<h2>5. Ejemplo ilustrativo de distribución</h2>
<p>Escenario de ${HOURS} horas diarias de utilización equivalente a plena potencia (${POWER_KW} kW), 30 días al mes, venta a $ ${PRICE.toLocaleString('es-CO')} por kWh y compra a $ ${COST.toLocaleString('es-CO')} por kWh.</p>
<table>
  <tr><th>Concepto</th><th class="r">Valor mensual (COP)</th></tr>
  <tr><td>Energía comercializada: ${POWER_KW} kW × ${HOURS} h × ${DAYS} días = ${kwh.toLocaleString('es-CO')} kWh</td><td class="r"></td></tr>
  <tr><td>Ventas de energía</td><td class="r">${cop(sales)}</td></tr>
  <tr><td>Compra de energía</td><td class="r">− ${cop(energy)}</td></tr>
  <tr class="tot"><td>Resultado distribuible</td><td class="r">${cop(margin)}</td></tr>
  <tr><td>Inversionista (70%)</td><td class="r">${cop(inv)}</td></tr>
  <tr><td>Disart Energy (30%)</td><td class="r">${cop(dis)}</td></tr>
</table>
<p class="nota">Proyección ilustrativa. No constituye una garantía de ingresos ni de rentabilidad. Los resultados dependen de la demanda real, de la potencia efectivamente entregada, de la disponibilidad de los equipos, de los impuestos aplicables y de los costos del proyecto.</p>

<footer class="doc">Disart Energy &amp; Machine S.A.S. &middot; comercial@disartenergy.com &middot; disartenergy.com</footer>
</body></html>`;

const htmlPath = resolve(outDir, '_justificacion.html');
const pdfPath = resolve(outDir, 'justificacion-30-disart.pdf');
writeFileSync(htmlPath, html, 'utf8');
execFileSync(
  CHROME,
  ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${pdfPath}`, pathToFileURL(htmlPath).href],
  { stdio: 'inherit' }
);
rmSync(htmlPath);
console.log('PDF:', pdfPath);
