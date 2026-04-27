# 05 - Publicacion en GitHub Pages

## Setup recomendado

1. Crear repositorio publico o privado con Pages habilitado.
2. Usar rama `main`.
3. Configurar GitHub Pages desde `Settings > Pages`.
4. Source: `Deploy from a branch`.
5. Branch: `main`, folder `/root`.

## Archivos productivos minimos

```text
index.html
data.js
assets/styles.css
assets/app.js
assets/covers/YYYY-MM-DD/*.jpg
```

## Comandos utiles

Servidor local:

```bash
python -m http.server 8000
```

Validacion:

```bash
python scripts/validate_data.py data.js
```

Commit tipo:

```bash
git add index.html data.js assets scripts docs source
git commit -m "Daily press brief YYYY-MM-DD"
git push origin main
```

## Recomendacion de versionado

Mantener historico por fecha dentro de `assets/covers/YYYY-MM-DD/`. Para nuevas ediciones, reemplazar `data.js` pero no borrar ediciones anteriores salvo necesidad de limpieza.
