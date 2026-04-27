# 03 - Flujo para portadas desde un unico PDF

## Objetivo

Las portadas deben venir de un solo archivo PDF y transformarse en imagenes JPG dentro del repositorio. El HTML no debe cargar `data:image/jpeg;base64`.

## Ubicacion del PDF fuente

```text
source/portadas.pdf
```

## Extraccion

Ejecutar:

```bash
python scripts/extract_covers_from_pdf.py source/portadas.pdf assets/covers/2026-04-22
```

Salida esperada:

```text
assets/covers/2026-04-22/001.jpg
assets/covers/2026-04-22/002.jpg
assets/covers/2026-04-22/003.jpg
```

Luego renombrar o generar nombres finales segun `data.js`:

```text
001-py-abc-color.jpg
002-py-ultima-hora.jpg
003-pa-la-prensa.jpg
```

## Regla de correspondencia

`covers[].page` debe coincidir con la pagina del PDF. Ejemplo:

```js
{
  id: 3,
  page: 3,
  country: "PA",
  source: "La Prensa",
  src: "assets/covers/2026-04-22/003-pa-la-prensa.jpg"
}
```

## Calidad recomendada

- Formato: JPG.
- Ancho maximo recomendado: 1400 px.
- Calidad: 82 a 88.
- Fondo: blanco, sin recortes agresivos.
- Peso objetivo por portada: 150 KB a 450 KB.

## Por que no base64

Base64 dentro del HTML hace que el archivo sea pesado, dificil de revisar en GitHub y poco eficiente para cache. Las imagenes separadas permiten cache del navegador, control de version y reemplazo granular.
