// Modelo de inversión: precio fijo en COP (negocio en Colombia).
// El USD es solo referencia y se recalcula con la TRM en vivo (/api/fx).
export const CAPEX_COP = 660_000_000;
export const FALLBACK_FX = 3200;

// Reparto del resultado distribuible (ingresos − costo de energía − impuestos)
// y de la propiedad de los equipos.
export const INVESTOR_PCT = 70;
export const DISART_PCT = 30;

export const POWER_KW = 720;
export const PRICE_KWH_COP = 1800;
export const COST_KWH_COP = 800;
export const DAYS_PER_MONTH = 30;
export const TARGET_HOURS = 4;

export const scenario = (hours: number) => {
  const kwhMonth = POWER_KW * hours * DAYS_PER_MONTH;
  const salesMonth = kwhMonth * PRICE_KWH_COP;
  const energyCostMonth = kwhMonth * COST_KWH_COP;
  const marginMonth = salesMonth - energyCostMonth;
  const investorMonth = (marginMonth * INVESTOR_PCT) / 100;
  const disartMonth = (marginMonth * DISART_PCT) / 100;
  return {
    kwhMonth,
    salesMonth,
    energyCostMonth,
    marginMonth,
    investorMonth,
    disartMonth,
    investorYear: investorMonth * 12,
    paybackMonths: investorMonth > 0 ? CAPEX_COP / investorMonth : Infinity,
  };
};

export const TARGET = scenario(TARGET_HOURS);

export const fmtCopFull = (n: number) =>
  '$ ' + Math.round(n).toLocaleString('es-CO').replace(/,/g, '.') + ' COP';

// 660_000_000 -> "$ 660 M COP"; 60_480_000 -> "$ 60,48 M COP"
export const fmtCopM = (n: number) => {
  const m = n / 1_000_000;
  const txt = Number.isInteger(m) ? String(m) : String(Math.round(m * 100) / 100).replace('.', ',');
  return `$ ${txt} M COP`;
};

export const fmtUsd = (n: number) => 'USD ' + Math.round(n).toLocaleString('en-US');
