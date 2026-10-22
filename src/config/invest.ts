// Precios de la franquicia fijos en COP (negocio en Colombia).
// El USD es solo referencia y se recalcula con la TRM en vivo (/api/fx).
export const CAPEX_COP = 660_000_000;
export const FALLBACK_FX = 3200;
// Facturación mínima mensual (escenario 6 h/día) en COP.
export const REVENUE_MONTH_COP = 62_500_000;

export const fmtCopFull = (n: number) =>
  '$ ' + Math.round(n).toLocaleString('es-CO').replace(/,/g, '.') + ' COP';

// 660_000_000 -> "$ 660 M COP"; 6_250_000 -> "$ 6,25 M COP"
export const fmtCopM = (n: number) => {
  const m = n / 1_000_000;
  const txt = Number.isInteger(m) ? String(m) : String(Math.round(m * 100) / 100).replace('.', ',');
  return `$ ${txt} M COP`;
};

export const fmtUsd = (n: number) => 'USD ' + Math.round(n).toLocaleString('en-US');

// USD abreviado: 206250 -> "USD 206k"
export const fmtUsdShort = (n: number) =>
  n >= 1000 ? `USD ${Math.round(n / 1000)}k` : fmtUsd(n);
