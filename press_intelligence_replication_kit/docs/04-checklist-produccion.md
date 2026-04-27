# 04 - Checklist de produccion diaria

## Antes de editar

- Confirmar fecha de edicion.
- Confirmar paises incluidos.
- Confirmar cantidad de paginas del PDF.
- Confirmar que el orden del PDF coincide con el orden editorial de `covers`.

## Produccion

1. Copiar PDF a `source/portadas.pdf`.
2. Extraer portadas a `assets/covers/YYYY-MM-DD/`.
3. Completar `data.js`.
4. Validar consistencia.
5. Revisar localmente las tres tabs.
6. Confirmar que el lightbox abre todas las portadas.
7. Confirmar que los links de medios abren en nueva pestana.
8. Confirmar filtros por pais, filtros por tema y busqueda.
9. Confirmar responsive mobile.
10. Publicar.

## QA obligatorio

- Header: contadores correctos.
- Ticker: sin titulares duplicados accidentales en `data.js`.
- Noticias: sin `id` repetido.
- Portadas: ninguna imagen rota.
- Resumen: cada pais con temas coherentes.
- GitHub: commit pequeno y auditable.

## Anti-patrones

- Editar tarjetas directamente en `index.html`.
- Pegar imagenes base64.
- Subir multiples PDFs para una misma edicion.
- Cambiar CSS para corregir datos.
- Usar nombres de imagen no deterministas como `image1.jpg` sin fecha ni orden.
