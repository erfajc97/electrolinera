// Mapa de páginas del embudo de inversión. Lo usan el hub, la barra de subnavegación y los "siguiente".
export interface InvPage {
  id: string;
  href: string;
  nav: string;
  title: string;
  blurb: string;
}

export const INV_PAGES: InvPage[] = [
  { id: "resumen", href: "/inversion", nav: "Resumen", title: "Invertir en electrolineras", blurb: "El negocio en una página." },
  { id: "cobertura", href: "/inversion/costos-servicios", nav: "Costos y servicios", title: "Costos de nuestros servicios", blurb: "Catorce servicios incluidos, de la importación al mantenimiento 24/7." },
  { id: "modelo", href: "/inversion/modelo", nav: "Cómo funciona", title: "Cómo funciona la inversión", blurb: "Qué incluye, cómo se distribuyen las utilidades y un ejemplo mes a mes." },
  { id: "plataforma", href: "/plataforma", nav: "Plataforma", title: "App y dashboard, con pantallas reales", blurb: "La app del conductor, el dashboard del socio y el panel de operación." },
  { id: "equipos", href: "/inversion/equipos", nav: "Equipos", title: "Cargadores DC de 240 kW", blurb: "Tres equipos, seis mangueras CCS2 y la tecnología que los opera." },
  { id: "marca-blanca", href: "/marca-blanca", nav: "Marca blanca", title: "Tu propia plataforma, con tu marca", blurb: "Licencia de la app y el backoffice para operar bajo tu nombre." },
];

export const pageById = (id: string) => INV_PAGES.find((p) => p.id === id)!;
