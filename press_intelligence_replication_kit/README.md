# Press Intelligence Replication Kit

Este paquete convierte el HTML original en un sistema repetible para GitHub Pages: la estructura visual queda fija y la operacion diaria se reduce a actualizar `data.js` y subir un unico PDF de portadas.

## Diagnostico ejecutivo

El HTML original funciona como snapshot: mezcla estructura, estilos, datos, JavaScript y portadas embebidas en base64 dentro del mismo archivo. Esa practica bloquea la escalabilidad: el archivo pesa demasiado, los cambios son dificiles de auditar en GitHub y cualquier edicion de datos implica tocar HTML productivo.

La solucion propuesta es separar responsabilidades:

- `index.html`: estructura estatica y contenedores.
- `assets/styles.css`: estilos originales.
- `assets/app.js`: logica de render, filtros, modal y lightbox.
- `data.js`: unica fuente editable de informacion diaria.
- `source/portadas.pdf`: unico PDF fuente.
- `assets/covers/YYYY-MM-DD/*.jpg`: portadas extraidas automaticamente del PDF.

## Estructura recomendada del repositorio

```text
repo/
  index.html
  data.js
  assets/
    styles.css
    app.js
    covers/
      2026-04-22/
        001-py-abc-color.jpg
        002-py-ultima-hora.jpg
  source/
    portadas.pdf
  scripts/
    extract_covers_from_pdf.py
    validate_data.py
  docs/
    01-arquitectura.md
    02-data-js.md
    03-pdf-portadas.md
    04-checklist-produccion.md
    05-github-pages.md
```

## Flujo diario recomendado

1. Guardar el PDF unico del dia en `source/portadas.pdf`.
2. Extraer imagenes con `python scripts/extract_covers_from_pdf.py source/portadas.pdf assets/covers/YYYY-MM-DD`.
3. Completar `data.js`: metadata, titulares, portadas, resumen por pais y temas transversales.
4. Validar con `python scripts/validate_data.py data.js`.
5. Probar localmente con `python -m http.server 8000`.
6. Publicar en GitHub Pages.

## Principio operativo clave

No se debe volver a guardar el sitio desde el navegador como HTML final. Esa accion reinyecta contenido renderizado y portadas base64. El entregable de produccion debe ser siempre el template + `data.js` + imagenes extraidas.
