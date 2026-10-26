# AGENTS.md — Dashboard "Ofrenda de la Memoria"

> Lee este archivo al inicio de cada sesión. Es corto a propósito: el detalle vive en `docs/`.

## 1. Misión y alcance

Construyes el **Componente A** del concurso "De los Datos a la Memoria" (Día de Muertos, Facultad de Computación y Ciencia de Datos): un dashboard interactivo del árbol genealógico, presentado como una **ofrenda nocturna con una vela por persona**. El video con IA, el guion y los prompts del video los hace el usuario; tú solo haces el dashboard.

- Fecha límite de entrega del concurso: **26 de octubre de 2026, 23:59 hrs**. Termina y publica primero lo obligatorio; los extras van después.
- Idioma: español para la interfaz, los documentos y tus mensajes.

## 2. Mapa de archivos

| Archivo | Función | Cuándo usarlo |
|---|---|---|
| `AGENTS.md` | Reglas y método de trabajo (este archivo) | Siempre |
| `docs/REQUISITOS.md` | Requisitos de la convocatoria, rúbrica y checklist R1–R9 | Al planear y antes de cerrar cada fase |
| `docs/DISENO.md` | Estética, paleta, semántica de las velas, interacciones | Al diseñar o implementar la interfaz |
| `docs/datos.md` | Reglas de uso de los datos, diccionario y validaciones esperadas | Antes de tocar cualquier dato |
| `data/data.json` | **Única fuente de datos de la página** (personas, relaciones, campo `vivo`) | La página lee solo este archivo |
| `data/personas.csv`, `data/relaciones.csv` | Los mismos datos en CSV | Para auditar y probar; la página no los carga |
| `docs/PROMPTS.md` | Registro de los prompts del usuario | Al inicio de cada turno (sección 7) |
| `docs/MEMORIA.md` | Memoria del proyecto: plan, avance, decisiones y correcciones | Al inicio y al cierre de cada sesión o fase (sección 8) |

## 3. Al iniciar cada sesión

1. Lee este archivo y `docs/MEMORIA.md` (estado actual, decisiones y pendientes).
2. Lee `docs/REQUISITOS.md`, `docs/DISENO.md` y `docs/datos.md` cuando la tarea lo pida (la primera vez, los tres completos).
3. Registra el prompt del usuario en `docs/PROMPTS.md`.

## 4. Reglas no negociables

**Datos**
1. `data/data.json` es la única fuente de la página. No escribas a mano en el código nombres, fechas, ciudades, oficios ni historias.
2. Una persona está viva si `fecha_fallecimiento` es nula (el campo `vivo` ya viene calculado).
3. El árbol se construye solo con `id_padre`, `id_madre` e `id_conyuge`. No dibujes las aristas `HERMANO_DE`.
4. La causa de muerte está dentro de `informacion_medica`. Muéstrala tal cual, sin inventarla ni interpretarla. "Sin información médica registrada" es un dato válido.
5. Las cifras (fallecidos, promedios, conteos) se calculan desde `data.json`, nunca se escriben a mano. Las edades y los años vividos se calculan a partir de las fechas como años cumplidos (mostrándose como 'X años' o 'X años vividos', sin la etiqueta de calculados).
6. Ignora la hoja `readme` original y sus ejemplos: tienen errores (detalle en `docs/datos.md`).

**Técnicas**
7. Página estática (HTML, CSS, JS y SVG), sin backend ni servicios externos, lista para GitHub Pages. Sin frameworks pesados; si usas una librería (por ejemplo D3.js), guarda una copia local en `vendor/`. El layout es propio, por generaciones, no un layout de fuerzas.
8. Para probar en local usa un servidor (`python -m http.server`), porque `fetch` no funciona abriendo el HTML con doble clic. Documenta el comando en el README.

**Diseño y calidad**
9. Sigue `docs/DISENO.md`. Todo debe ser original: no uses personajes, imágenes ni recursos de películas ni de otras obras con derechos.
10. Debe ser legible y usable: leyenda visible, diseño responsivo, buen contraste, navegación con teclado y respeto de `prefers-reduced-motion`.
11. Todo requisito de `docs/REQUISITOS.md` debe quedar cubierto. Si algo no se puede cumplir, dilo y regístralo en memoria en lugar de omitirlo en silencio.

## 5. Cómo elaborar el plan (Fase 0)

Antes de escribir la página, produce un plan y **espera la aprobación del usuario**:

1. **Auditar los datos.** Crea `tests/validate_data.py` que verifique las cifras de `docs/datos.md` (57 personas, 200 relaciones, 14 fallecidos, 24/19/14 por generación, ID existentes, cónyuges recíprocos). Ejecútalo y anota el resultado.
2. **Derivar estructuras** desde `data.json`: unidades familiares (pareja + hijos), padres, cónyuge, hijos, hermanos (por padres compartidos), ancestros y descendientes de cada persona, y el parentesco con Ego (P044) a partir de `rol_en_arbol`. Si algún código es ambiguo, muéstralo tal cual y regístralo en memoria.
3. **Diseñar el layout:** un nivel por generación (2 arriba, 0 abajo), velas agrupadas por familia, con desplazamiento y zoom por nivel. La generación 2 es la más ancha (24 personas) y la 0 tiene 14.
4. **Mapear requisitos:** tabla `R1…R9` (de `docs/REQUISITOS.md`) → módulo o archivo → fase.
5. **Ordenar el trabajo** según las fases de la sección 6.

Guarda el plan en la sección "Plan" de `docs/MEMORIA.md` y presenta al usuario un resumen de máximo 15 líneas.

## 6. Fases

- **Fase 1 (obligatoria):** árbol por niveles con velas, líneas de parentesco, leyenda y ficha de la persona (R1, R2, R5).
- **Fase 2 (obligatoria):** resaltado de ancestros y descendientes, filtros (vivos/fallecidos, ciudad, profesión), búsqueda por nombre, tooltip, ritual de encendido y trayectorias (R3, R4).
- **Fase 3 (valor añadido):** línea de vidas por generación y panel "Hallazgos clave", todo calculado desde los datos (R7).
- **Fase 4 (cierre):** pulido, pruebas con la validación, README, publicación en GitHub Pages y revisión final contra el checklist de `docs/REQUISITOS.md` (R6, R8).

**Al terminar cada fase:** actualiza `docs/MEMORIA.md`, resume en pocas líneas lo hecho y qué falta, y **detente** para que el usuario revise.

## 7. Documentación de prompts

Registra cada prompt del usuario en `docs/PROMPTS.md`, al inicio del turno y **textual** (sin reescribirlo). Al terminar el turno completa el resultado: resumen breve, archivos modificados y observaciones. No borres entradas anteriores. Sigue el formato que ya está en ese archivo.

## 8. Memoria del proyecto

`docs/MEMORIA.md` es tu memoria entre sesiones. Actualízala al cerrar cada fase y cada vez que el usuario corrija o aclare algo. Mantiene: estado actual, plan, checklist de requisitos, decisiones, correcciones y aclaraciones (con fecha y motivo; solo se agregan, no se reescriben), pendientes y cómo ejecutar el proyecto.

## 9. Forma de trabajar (la cuota del agente es limitada)

- Haz cambios pequeños con ediciones puntuales; no reescribas archivos completos para ajustarlos.
- Lee solo los archivos que necesites y no repitas explicaciones largas.
- Pregunta antes de cambiar decisiones de diseño ya acordadas en `docs/DISENO.md` o en la memoria.
- Un cambio, una verificación: después de modificar, ejecuta la validación o abre la página y confirma que funciona antes de continuar.
