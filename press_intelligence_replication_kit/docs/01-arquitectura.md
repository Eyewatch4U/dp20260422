# 01 - Arquitectura del HTML

## Componentes detectados

El informe tiene una arquitectura de tres niveles:

1. Capa visual: CSS oscuro, variables `:root`, tarjetas, filtros, tabs, modal y lightbox.
2. Capa estructural: header, ticker, tabs, grillas y contenedores.
3. Capa de datos: noticias, portadas, ticker, paises, temas y resumen.

## Estructura funcional

### Header
Muestra marca, fecha, cantidad de paises, cantidad de portadas y cantidad de temas.

### Ticker
Barra animada con titulares prioritarios. Debe generarse desde `data.ticker`.

### Tab 1: Titulares y Analisis
Incluye:
- Temas con cobertura en multiples paises.
- Filtros por pais.
- Filtros por tema.
- Buscador.
- Grilla de tarjetas.
- Modal de detalle.

### Tab 2: Portadas del Dia
Incluye:
- Header editorial de portadas.
- Navegacion por pais.
- Grilla agrupada por pais.
- Lightbox con portada ampliada, navegacion anterior/siguiente y link al medio.

### Tab 3: Resumen por Pais
Incluye:
- Navegacion por pais.
- Bloques agrupados por pais.
- Tarjetas de temas con icono, tema, descripcion y cobertura.

## Decision tecnica

El template debe renderizar todo desde `window.PRESS_DATA`. No deben quedar tarjetas hardcodeadas en `index.html`, porque eso genera duplicacion, errores de mantenimiento y diffs inservibles.
