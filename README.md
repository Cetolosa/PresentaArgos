# Programa Argos — El Díptico

## Estructura de archivos

```
argos/
├── index.html          ← HTML estructural. Rara vez necesitas tocarlo.
├── argos.css           ← Todos los estilos (shell, paneles, diagramas, animaciones).
├── data-capitulos.js   ← ★ EDITAR AQUÍ: datos de los capítulos (textos, colores, tags)
├── data-diagramas.js   ← ★ EDITAR AQUÍ: HTML de los diagramas interactivos por capítulo
├── helpers.js          ← Estado global, helpers SVG, Rolando logic. No tocar si no es necesario.
└── app.js              ← Render, navegación, modos, beats. Tocar solo para nuevas features.
```

## ¿Qué archivo debo editar?

| Tarea | Archivo |
|-------|---------|
| Cambiar texto de un capítulo | `data-capitulos.js` |
| Cambiar colores / emo de un capítulo | `data-capitulos.js` |
| Agregar/editar tags de capacidades, principios u objetivos | `data-capitulos.js` |
| Agregar un capítulo nuevo | `data-capitulos.js` (agregar objeto al array CHAPTERS) |
| Modificar el diagrama de un capítulo | `data-diagramas.js` |
| Agregar un diagrama custom nuevo | `data-diagramas.js` (agregar CHN: \`...\`) |
| Cambiar estilos de colores, layout, animaciones | `argos.css` |
| Nueva feature de navegación o interacción | `app.js` |

## Cómo servir localmente

```bash
# Opción 1: Python (sin instalar nada)
python3 -m http.server 8000
# Abrir http://localhost:8000

# Opción 2: Node (si tienes npx)
npx serve .
```

> ⚠️ No abrir index.html directamente con file:// — los scripts externos no cargan.
> Necesita un servidor HTTP (aunque sea local).

## Sintaxis especial en los textos

- `[[texto]]` → resaltado visual en la presentación

## Agregar un capítulo nuevo

1. Agregar un objeto al array `CHAPTERS` en `data-capitulos.js`  
2. Si el capítulo necesita un diagrama custom, agregar `,CHN: \`...\`` en `data-diagramas.js`  
3. Si el diagrama tiene nodos clicables, agregar `det: {...}` en el array `nodes` del capítulo en `data-capitulos.js`

