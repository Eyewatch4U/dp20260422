# 02 - Especificacion de data.js

## Regla madre

`data.js` debe declarar una sola variable global:

```js
window.PRESS_DATA = { ... };
```

No usar `export`, `import` ni `fetch` para el flujo basico de GitHub Pages. La prioridad es maxima compatibilidad y cero dependencias.

## Campos obligatorios

### edition
Controla metadata editorial y textos generales.

Campos:
- `isoDate`: fecha tecnica, formato `YYYY-MM-DD`.
- `dateLabel`: fecha visible.
- `eyebrow`: marca superior.
- `title`: titulo base.
- `titleAccent`: palabra destacada.
- `headline`: titulo de la seccion portadas.
- `subheadline`: bajada de portadas.
- `footerBrand`: marca del footer.
- `footerNote`: nota de edicion.

### countries
Diccionario de paises. La clave es el codigo usado en todo el sistema.

```js
PA: { name: "Panama", flag: "🇵🇦", color: "#00A0E3" }
```

Regla: cada `country` usado en `news`, `covers` y `summary` debe existir aqui.

### themes
Diccionario de temas.

```js
pol: { label: "Politica", className: "th-pol", color: "#E05252" }
```

Regla: cada `theme` usado en noticias y resumen debe existir aqui.

### ticker
Array de pares `[flag, text]`.

```js
["🇵🇾", "Paraguay: titular principal"]
```

### crossTopics
Tarjetas superiores de cobertura transversal.

Campos:
- `icon`
- `label`
- `text`
- `flags`
- `badge`
- `action.type`: `theme` o `search`
- `action.value`: codigo de tema o palabra clave.

### news
Array de noticias para la grilla.

Campos obligatorios:
- `id`: numero unico.
- `country`: codigo de pais.
- `source`: medio o conjunto de medios.
- `theme`: codigo de tema.
- `url`: URL del medio.
- `headline`: titular de tarjeta.
- `desc`: bajada breve.
- `detail`: texto ampliado del modal.
- `tags`: array de palabras en minuscula para busqueda.

### covers
Array de portadas. Debe respetar el orden del PDF.

Campos obligatorios:
- `id`: numero unico.
- `page`: numero de pagina en el PDF fuente.
- `country`: codigo de pais.
- `source`: nombre del medio.
- `headline`: titular destacado.
- `url`: sitio del medio.
- `src`: ruta de imagen extraida.

Ejemplo:

```js
{
  id: 1,
  page: 1,
  country: "PY",
  source: "ABC Color",
  headline: "Titular principal de portada",
  url: "https://www.abc.com.py",
  src: "assets/covers/2026-04-22/001-py-abc-color.jpg"
}
```

### summary
Resumen editorial agrupado por pais.

```js
{
  country: "PY",
  topics: [
    {
      icon: "⚖️",
      theme: "pol",
      title: "Tema principal",
      desc: "Lectura ejecutiva del tema.",
      media: "ABC Color · Ultima Hora"
    }
  ]
}
```

## Validaciones duras

- No incluir imagenes base64 en `data.js`.
- No usar rutas absolutas locales.
- No repetir `id`.
- No usar paises o temas inexistentes.
- Mantener `covers[].page` alineado con el orden real del PDF.
- Mantener `src` con nombre deterministico y versionable.
