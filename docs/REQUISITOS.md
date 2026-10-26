# Requisitos del concurso (fuente: convocatoria oficial)

Concurso **"De los Datos a la Memoria"**, Facultad de Computación y Ciencia de Datos, con apoyo de la Mesa Directiva de Estudiantes. Participación individual. Página oficial: https://aejm.github.io/diademuertos/

## Qué hace el agente

Solo el **Componente A**: el dashboard interactivo. El Componente B (video de 30 s con IA, narrativa en primera persona de un descendiente de la Generación 0, video explicativo de 3 minutos) lo hace el usuario, pero el dashboard debe servirle para ello.

## Requisito funcional oficial (Componente A)

Construir una interfaz o tablero interactivo para explorar el árbol genealógico y sus métricas. Debe permitir:
- Navegar interactivamente por las generaciones (2, 1 y 0).
- Identificar parentescos.
- Filtrar o resaltar integrantes fallecidos y sus trayectorias.

Herramientas permitidas para la visualización: Python (Plotly, Dash, Streamlit, PyVis, Bokeh, Panel), Web/JS (D3.js, Observable, Sigma.js, Cytoscape.js), BI (Power BI, Tableau Public, Looker Studio) y R (Shiny, visNetwork, networkD3). Este proyecto usa **web estática con JS/SVG**.

## Rúbrica (cómo se evalúa)

| Criterio | Peso | Qué mira el jurado |
|---|---|---|
| Visualización e Interactividad | 30% | Usabilidad, dinamismo e interactividad; claridad de jerarquías y linajes; diseño visual efectivo; facilidad para explorar nodos y aristas |
| Storytelling y Apego al Dataset | 30% | Coherencia entre la historia y los datos reales (oficios, ciudades, causas de deceso); personaje de Generación 0; emotividad |
| Calidad y Dominio de IA Generativa | 25% | Video de 30 s y prompts (lo hace el usuario) |
| Síntesis y Comunicación | 15% | Video explicativo de 3 minutos, tiempos y presentación (lo hace el usuario) |

## Requisitos para el dashboard (R1–R9)

| ID | Requisito | Cómo se cumple en el dashboard |
|---|---|---|
| **R1** | Navegar por las generaciones 2, 1 y 0 | Un nivel de la ofrenda por generación (2 arriba, 0 abajo), con desplazamiento y zoom por nivel y botones para ir a cada generación |
| **R2** | Identificar parentescos | Líneas de filiación y guirnaldas de pareja; la ficha muestra padres, cónyuge, hijos, hermanos y el parentesco con Ego (P044) |
| **R3** | Filtrar o resaltar fallecidos y sus trayectorias | Filtro de fallecidos con velas apagadas y halo; ritual de encendido al hacer clic; en la ficha, la trayectoria: nacimiento y fallecimiento, años vividos (calculado), ciudad de origen → otras ciudades (`otras_ciudades_donde_vivio`, separadas por `;`), profesión e historia |
| **R4** | Usabilidad y claridad de jerarquías y linajes (30% de la nota) | Resaltado de ancestros y descendientes, atenuación del resto, hover con tooltip, búsqueda por nombre, filtros por ciudad y profesión, leyenda visible, lectura clara sin instrucciones |
| **R5** | Apego al dataset | Todo dato mostrado sale de `data.json`; `informacion_medica` sin reinterpretar; sin datos inventados |
| **R6** | Enlace público al dashboard o al repositorio | Publicado en GitHub Pages, sin inicio de sesión, con README |
| **R7** | Apto para el video explicativo (0:00–1:30: proceso, hallazgos clave y recorrido interactivo) | Panel "Hallazgos clave" calculado desde los datos; interfaz que se vea bien grabada a pantalla completa (1920×1080) |
| **R8** | Documentación de prompts (campo "Declaración de Prompts" del formulario) | `docs/PROMPTS.md` completo y entregable |
| **R9** | Restricciones | Datos 100% sintéticos (se pueden publicar); estática sin backend; contenido original sin recursos con derechos |

## Calendario oficial

| Fecha | Hito |
|---|---|
| 26 de octubre, 23:59 hrs | **Cierre de entregables** (formulario de Google; límite improrrogable) |
| 27 de octubre | Evaluación del jurado |
| 29 de octubre | Finalistas y premiación |

## Qué pide el formulario de entrega (referencia)

Datos del participante; identidad del proyecto (título, personaje de Generación 0 y familiares homenajeados); plataformas usadas (por ejemplo, la tecnología del dashboard y las herramientas de IA); enlaces al video explicativo, al video de 30 s y **al dashboard o repositorio**; y la declaración de prompts.

## Checklist de cierre

Antes de dar por terminado el dashboard, confirma cada punto y márcalo en `docs/MEMORIA.md`:
- [x] R1 a R9 cumplidos o con excepción registrada
- [x] `tests/validate_data.py` pasa
- [x] Probado en pantalla de laptop y en celular
- [x] Preparado para publicación en GitHub Pages con README.md e instrucciones de despliegue
- [x] `docs/PROMPTS.md` al día
