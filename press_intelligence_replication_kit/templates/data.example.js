/*
  data.js - Fuente unica de datos del Daily Press Brief.
  Regla ejecutiva: index.html, styles.css y app.js no se tocan en la operacion diaria.
  Para una nueva edicion solo se cambia este archivo y se agregan las imagenes extraidas del PDF.
*/
window.PRESS_DATA = {
  edition: {
    isoDate: "2026-04-22",
    dateLabel: "Miercoles 22 · Abril · 2026",
    eyebrow: "Eyewatch · Press Intelligence",
    title: "Daily Press",
    titleAccent: "Brief",
    headline: "Tapas de hoy en Panama, Paraguay, la region y el mundo",
    subheadline: "Hace click en cada portada para ampliarla · Boton para ir al sitio del medio",
    footerBrand: "NSGroup · Eyewatch Intelligence Unit",
    footerNote: "Press Intelligence Report · 22.04.2026"
  },

  countries: {
    PA: { name: "Panama", flag: "🇵🇦", color: "#00A0E3" },
    PY: { name: "Paraguay", flag: "🇵🇾", color: "#E05252" },
    UY: { name: "Uruguay", flag: "🇺🇾", color: "#22C48B" },
    AR: { name: "Argentina", flag: "🇦🇷", color: "#60A5FA" },
    BR: { name: "Brasil", flag: "🇧🇷", color: "#22C55E" },
    CL: { name: "Chile", flag: "🇨🇱", color: "#F97316" },
    BO: { name: "Bolivia", flag: "🇧🇴", color: "#F59E0B" },
    ES: { name: "Espana", flag: "🇪🇸", color: "#A78BFA" },
    UK: { name: "UK", flag: "🇬🇧", color: "#34D399" },
    US: { name: "USA", flag: "🇺🇸", color: "#FB7185" }
  },

  themes: {
    pol: { label: "Politica", className: "th-pol", color: "#E05252" },
    eco: { label: "Economia", className: "th-eco", color: "#22C48B" },
    int: { label: "Internacional", className: "th-int", color: "#60A5FA" },
    dep: { label: "Deportes", className: "th-dep", color: "#F97316" },
    jus: { label: "Justicia", className: "th-jus", color: "#A78BFA" },
    soc: { label: "Social", className: "th-soc", color: "#e8c547" }
  },

  ticker: [
    ["🇵🇾", "Paraguay: titular principal de la jornada"],
    ["🇵🇦", "Panama: segundo titular de alto impacto"]
  ],

  crossTopics: [
    {
      icon: "🕊️",
      label: "Internacional",
      text: "Tema con cobertura regional",
      flags: "🇵🇦🇵🇾🇺🇾",
      badge: "3 paises",
      action: { type: "theme", value: "int" }
    },
    {
      icon: "⚖️",
      label: "Politica",
      text: "Tema especifico para buscar",
      flags: "🇵🇾🇵🇾",
      badge: "2 medios",
      action: { type: "search", value: "palabra clave" }
    }
  ],

  news: [
    {
      id: 1,
      country: "PY",
      source: "ABC Color / Ultima Hora",
      theme: "pol",
      url: "https://www.ejemplo.com",
      headline: "Titular sintetico de la noticia",
      desc: "Bajada breve para la tarjeta. Debe explicar el hecho central en una o dos lineas.",
      detail: "Detalle ampliado para el modal. Incluir contexto, actores, implicancias y siguiente hito.",
      tags: ["paraguay", "politica", "palabra clave"]
    }
  ],

  covers: [
    {
      id: 1,
      page: 1,
      country: "PY",
      source: "ABC Color",
      headline: "Titular destacado de la portada",
      url: "https://www.abc.com.py",
      src: "assets/covers/2026-04-22/001-py-abc-color.jpg"
    }
  ],

  summary: [
    {
      country: "PY",
      topics: [
        {
          icon: "⚖️",
          theme: "pol",
          title: "Tema principal por pais",
          desc: "Resumen ejecutivo del tema, con cobertura cruzada y lectura de impacto.",
          media: "ABC Color · Ultima Hora"
        }
      ]
    }
  ]
};
