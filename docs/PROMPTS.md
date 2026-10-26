# Registro de prompts

Este archivo se entrega en el formulario ("Declaración de Prompts"). El agente registra aquí cada prompt del usuario, **textual**, al inicio del turno, y completa el resultado al terminar. No se borran entradas.

## Formato de cada entrada

```
### P-001 · AAAA-MM-DD HH:MM · Fase N
**Prompt (textual):**
> ...
**Resultado:** resumen breve de lo hecho.
**Archivos modificados:** lista.
**Observaciones:** correcciones, problemas o ideas (opcional).
```

## 1. Preparación del proyecto (Claude)

Herramienta: Claude (Anthropic), en una conversación previa al desarrollo del dashboard. Uso: orientación sobre contenidos y estética, conversión del dataset a CSV y JSON, y redacción de `AGENTS.md`. Fecha de todos los prompts: 23 de octubre de 2026 (hora no registrada). Los prompts se copian textuales.

### C-01 · 2026-10-23 · Claude
**Prompt (textual):**
> Quiero que me recomiendes qué podría hacer o cómo podría hacer los contenidos de este concurso. Dame ideas y herramientas que podría usar.
**Resultado:** Consulta de orientación sobre ideas y herramientas para los contenidos del concurso. No generó archivos.

### C-02 · 2026-10-23 · Claude
**Prompt (textual):**
> Mira, el dashboard puede ser generado por IA, lo que evalúan es la usabilidad, la estética y el apego a los datos del dataset. Para esto, estaba pensando en usar un agente de CLI (Antigravity). ¿Qué opinas? ¿Es buena idea hacerlo así?
**Resultado:** Consulta sobre usar un agente de CLI (Antigravity) para construir el dashboard. Se optó por Antigravity CLI para la sección 2. No generó archivos.

### C-03 · 2026-10-23 · Claude
**Prompt (textual):**
> Antes de eso, quiero explorar páginas relacionadas a Día de Muertos u otros contenidos visuales que pueda usar como referencia para definir una estética para mi dashboard
**Resultado:** Exploración de referencias visuales de Día de Muertos para definir la estética del dashboard. No generó archivos.

### C-04 · 2026-10-23 · Claude
**Prompt (textual):**
> ¿Crees que una estética de colores neón usando la paleta de colores que recomendaste se vería bien?
**Resultado:** Consulta sobre una estética neón con la paleta propuesta. Sirvió de base para `docs/DISENO.md` ("ofrenda neón cálida"). No generó archivos.

### C-05 · 2026-10-23 · Claude
**Prompt (textual):**
> ¿Para el árbol genealógico, cómo podría representarlo?
**Resultado:** Consulta sobre cómo representar el árbol genealógico. No generó archivos.

### C-06 · 2026-10-23 · Claude
**Prompt (textual):**
> ¿Sería buena idea representar el árbol genealógico como una ofrenda o algún otro fondo llamativo y característico con una vela por cada persona representada con la llama encendida si la persona está viva y apagada si ya falleció? Te comparto un pequeño bosquejo de algo similar a mi idea:
> Imagen generada con Gemini usando el siguiente prompt: Crea una imagen que representé a un árbol genealógico con temática de día de muertos y uso de colores neón con la siguiente paleta de colores:
>
> cempasúchil #FFB300, rosa neón #FF2D95, violeta #B388FF, y un cian #00E5FF solo como acento puntual. El fondo puede quedarse en #1A1033 o irse a un tono aún más oscuro para que el brillo resalte.
>
> Quiero que la representación del árbol sea mediante velas por cada persona representada de modo que se repreenten 3 generaciones: abuelos, padres e hijos. Estas velas estarán encendidas o apagadas dependiendo de si la persona está viva o ya falleció. Manten una temática tradicional de día de Muertos conservando la estética de la tradición adoptando la paleta de colores mencionada y los otros requisitos.
> [Imagen de referencia generada con Gemini; no se incluye en este archivo.]
**Resultado:** Se definió representar el árbol como una ofrenda nocturna con una vela por persona (llama encendida = vive, vela apagada = falleció). El bosquejo de referencia se generó con Gemini usando el prompt incluido arriba.

### C-07 · 2026-10-23 · Claude
**Prompt (textual):**
> Basándote exclusivamente en  Dataset_Genealógico_México_Concurso.xlsx, crea un archivo .csv correspondiente a la hoja "personas" y otro a la hoja "relaciones". En base a esto, genera un archivo .json que contenga los datos de cada uno de los integrantes del árbol familiar para que pueda enviárselo al agente.
**Resultado:** Se generaron `data/personas.csv`, `data/relaciones.csv` y `data/data.json` a partir del Excel original.

### C-08 · 2026-10-23 · Claude
**Prompt (textual):**
> Ahora, quiero un documento .md que sirva como guía (AGENTS.md) para poder indicarle específicamente los requerimientos de la página oficial del concurso que ya revisamos y los detalles de la estética, diseño y paleta de colores que propusimos, de manera que se cumplan con cada una de las funcionalidades solicitadas dentro de la convocatoria, además, indicándole al agente que documente los prompts realizados en otro archivo .md e indicándole la relación y función de los archivos que creaste antes, mostrándole como usarlos para la creación de un plan para la elaboración del dashboard interactivo. Finalmente, indicarle que cree otro documento .md que sirva como memoria para indicar el avance del proyecto y las correcciones o aclaraciones que se hayan hecho.
**Resultado:** Se generó `AGENTS.md`, la guía con la que se instruye al agente (requisitos del concurso, estética, mapa de archivos, registro de prompts y memoria del proyecto).

## 2. Desarrollo del dashboard (Antigravity CLI)

Herramienta: Antigravity CLI. Nota: Algunos de los prompts de esta sección se redactaron con asistencia de Claude, que también ayudó a diagnosticar errores a partir de capturas de pantalla y a revisar los datos. Las entradas son las registradas por el agente, sin cambios.

### P-001 · 2026-10-23 23:14 · Fase 0
**Prompt (textual):**
> /plan Lee AGENTS.md y docs/. Propón el plan de la Fase 0 siguiendo la sección 5 de AGENTS.md: auditoría de datos, estructuras derivadas, layout por generaciones y una tabla que mapee R1 a R9 con archivos y fases. No escribas la página todavía.
**Resultado:** Se creó y ejecutó con éxito `tests/validate_data.py` (validando las 57 personas, 200 relaciones, 14 difuntos, 24/19/14 por generación y reciprocidad). Se derivaron las estructuras genealógicas y el diseño del layout por generaciones. Se estructuró la matriz de mapeo R1-R9 y se redactó el plan en `docs/MEMORIA.md` y en el artefacto de implementación, quedando a la espera de aprobación antes de codificar la página.
**Archivos modificados:** `tests/validate_data.py`, `docs/MEMORIA.md`, `docs/PROMPTS.md`
**Observaciones:** Dataset 100% íntegro. No se ha escrito código de la página web todavía.

### P-002 · 2026-10-23 23:31 · Fase 0
**Prompt (textual):**
> El plan está aprobado, con estos ajustes: (1) en la Fase 1 la ficha debe incluir ya la trayectoria y ser responsiva (panel lateral en laptop, cajón inferior en celular); (2) antes de usar el parentesco, genera una tabla con las 57 personas, su rol_en_arbol y el parentesco en español, para que yo la revise; (3) reemplaza "tasa de supervivencia" por fallecidos por generación y años vividos promedio; (4) la Fase 3 es opcional y se recorta primero si falta tiempo. No empieces la Fase 1 ni crees la página. Guarda el plan ajustado en la sección "Plan" de docs/MEMORIA.md, crea y ejecuta tests/validate_data.py, anota el resultado en MEMORIA.md y detente.
**Resultado:** Se actualizaron `docs/MEMORIA.md` y el plan con los 4 ajustes requeridos. Se generó y documentó la tabla completa de las 57 personas con `rol_en_arbol` y parentesco en español relativo a Ego (P044). Se amplió `tests/validate_data.py` para calcular y validar las métricas demográficas (fallecidos por generación y años vividos promedio), ejecutándose con éxito total y registrando el resultado en `MEMORIA.md`. No se inició la Fase 1 ni se creó la página web.
**Archivos modificados:** `tests/validate_data.py`, `docs/MEMORIA.md`, `docs/PROMPTS.md`
**Observaciones:** Esperando revisión del usuario sobre la tabla de parentesco de las 57 personas antes de codificar la Fase 1.

### P-003 · 2026-10-23 23:46 · Fase 0
**Prompt (textual):**
> Tabla de parentescos aprobada con una corrección: para P038 a P043, reemplaza "primo segundo" por "tío segundo" o "tía segunda" (paterno o materno según corresponda), y muestra en la ficha el detalle entre paréntesis, por ejemplo "primo hermano de tu padre". Calcula el parentesco desde id_padre, id_madre e id_conyuge usando el grafo (el sufijo numérico de rol_en_arbol no es por padre), y conserva rol_en_arbol solo como código visible. Registra esta corrección en "Correcciones y aclaraciones" de MEMORIA.md.
**Resultado:** Se actualizó la tabla de parentesco en `docs/MEMORIA.md` y en el artefacto del plan sustituyendo "primo segundo" por "tío segundo / tía segunda" con el detalle explicativo entre paréntesis ("primo hermano de tu padre/madre") para P038 a P043. Se documentó la regla arquitectónica de calcular el parentesco dinámicamente mediante el grafo (`id_padre`, `id_madre`, `id_conyuge`) y conservar `rol_en_arbol` como código visible. Se registró la corrección en "Correcciones y aclaraciones" de `MEMORIA.md`.
**Archivos modificados:** `docs/MEMORIA.md`, `docs/PROMPTS.md`
**Observaciones:** Fase 0 formalmente cerrada y aprobada. Listo para arrancar la Fase 1.

### P-004 · 2026-10-24 00:06 · Fase 1
**Prompt (textual):**
> ejecuta la Fase 1 según el plan aprobado y AGENTS.md: árbol por niveles con velas, líneas de parentesco, leyenda y ficha de la persona, con trayectoria y diseño responsivo. Calcula el parentesco desde id_padre, id_madre e id_conyuge, no interpretando los códigos. Sigue docs/DISENO.md. Al terminar, actualiza MEMORIA.md y detente.
**Resultado:** Se implementó completamente la Fase 1: lienzo SVG de la ofrenda nocturna con las 57 velas en 3 niveles (Gen 2, Gen 1, Gen 0), guirnaldas de cempasúchil para parejas y curvas Bézier violetas de filiación. Leyenda fija permanente. Ficha de persona responsiva (panel lateral en desktop/laptop, cajón inferior 'bottom-sheet' en móviles) con trayectoria completa (ciudad de origen, otras ciudades, profesión), fechas, edad/años vividos calculados, historia personal, información médica textual y parientes directos interactivos. Cálculo dinámico de parentesco recorriendo el grafo (`id_padre`, `id_madre`, `id_conyuge`). Botones de salto generacional, paneo y zoom interactivo. Se actualizó `docs/MEMORIA.md`.
**Archivos modificados:** `index.html`, `css/styles.css`, `js/data-engine.js`, `js/tree-layout.js`, `js/app.js`, `docs/MEMORIA.md`, `docs/PROMPTS.md`
**Observaciones:** Fase 1 concluida con éxito. Validación con `validate_data.py` e integración al 100%. Detenido para revisión del usuario antes de Fase 2.

### P-005 · 2026-10-24 00:23 · Soporte local
**Prompt (textual):**
> Cómo puedo probar el dashboard? Intenté lo que me dijiste y solo se abrió una página que  dice Directory listing for /?
**Resultado:** Se explicó la causa (la terminal se ejecutó en una carpeta superior y no dentro de la carpeta del proyecto `Concurso`) y se brindaron las instrucciones exactas para navegar a la carpeta o hacer clic en la carpeta `Concurso` desde el listado del navegador, o usar la opción `-d`.
**Archivos modificados:** `docs/PROMPTS.md`
**Observaciones:**

### P-006 · 2026-10-24 00:45 · Fase 1 (Correcciones)
**Prompt (textual):**
> Corrección de la Fase 1 (regístrala en "Correcciones y aclaraciones" de MEMORIA.md):
> 1. Encuadre: calcula "Ver todo" con el bounding box real del contenido (getBBox del grupo del árbol) más un margen pequeño, centrado en horizontal y vertical, para que el árbol use el ancho disponible. Hoy queda pequeño en la esquina superior izquierda y en las otras vistas los nodos del borde izquierdo (Rosaura, Patricia) quedan cortados.
> 2. Botones de generación: que animen suavemente (unos 400 ms) hasta encuadrar y centrar horizontalmente el nivel elegido, sin cortar nodos.
> 3. Navegación: arrastrar con el mouse para mover (cursor de mano), rueda para acercar o alejar con pasos pequeños centrados en el cursor, doble clic para acercarse, y límites para que el árbol no se pierda de vista. Hazlo fluido: aplica transform a un solo grupo, usa requestAnimationFrame y suspende filtros y animaciones costosas (brillos, parpadeo) mientras se mueve o se hace zoom.
> 4. Aprovechamiento de pantalla: aumenta la separación vertical entre niveles y el tamaño de velas y nombres para que el árbol completo llene la pantalla a 1920×1080 y los nombres se lean sin acercar.
> 5. Ficha: usa "Hija" o "Hijo" según el sexo (hoy sale "Hijo/a") y muestra las fechas como "8 de junio de 2007". No modifiques los datos de ciudades.
> 6. Refuerza el halo violeta de los fallecidos para que se distinga a simple vista en la vista completa.
> No agregues funciones de la Fase 2. Al terminar, actualiza MEMORIA.md y detente.
**Resultado:** Se implementaron las 6 correcciones solicitadas: (1) Encuadre "Ver todo" con `getBBox()` del grupo del árbol centrado horizontal y verticalmente aprovechando todo el ancho; (2) Botones de generación con transición suave de ~400ms y encuadre que no corta los nodos laterales; (3) Navegación fluida con `cursor: grab/grabbing`, rueda suave centrada en cursor, doble clic para acercar, límites perimetrales y suspensión de filtros/animaciones (`.is-navigating`) a 60 FPS con `requestAnimationFrame`; (4) Mayor separación vertical (Y = 200, 620, 1040) y aumento del tamaño de velas (38×58px) y nombres (14px negrita con halo) para lectura clara sin zoom a 1920×1080; (5) Ficha con parentescos diferenciados por sexo ("Hijo"/"Hija", eliminando "Hijo/a") y fechas en formato largo español ("8 de junio de 2007") manteniendo intactas las ciudades; (6) Halo violeta reforzado de doble anillo y resplandor visible en vista completa. Se registró en "Correcciones y aclaraciones" de `MEMORIA.md`. No se agregaron funciones de Fase 2.
**Archivos modificados:** `js/app.js`, `js/data-engine.js`, `js/tree-layout.js`, `css/styles.css`, `index.html`, `docs/MEMORIA.md`, `docs/PROMPTS.md`
**Observaciones:** Fase 1 corregida, validada y lista para revisión del usuario antes de pasar a Fase 2. 

### P-007 · 2026-10-24 01:12 · Fase 1 (Corrección 2)
**Prompt (textual):**
> Corrección 2 de la Fase 1 (regístrala en "Correcciones y aclaraciones" de MEMORIA.md). Cambio de enfoque: ya no se hace zoom por generación.
> 1. "Ver todo" y el botón de restablecer (↺) deben mostrar el árbol completo ocupando ~90% del ancho útil, centrado. Implementa UNA función fitToBox que use el bounding box real del árbol (getBBox, en coordenadas del SVG) y el tamaño real del contenedor visible (clientWidth y clientHeight, descontando encabezado y leyenda). Ejecútala al cargar, tras document.fonts.ready y al cambiar el tamaño de la ventana. En tu resumen dime qué causaba que el árbol saliera pequeño y cortado.
> 2. Los botones "Gen 2", "Gen 1" y "Gen 0" NO mueven ni acercan la vista. Al elegir una generación, sus velas y nombres quedan al 100%, con los nombres un 25% más grandes y un brillo suave, y todo lo demás baja al ~30% de opacidad. Las líneas entre esa generación y las vecinas se mantienen visibles (~40%). Transición suave de ~250 ms. Volver a pulsar el botón activo o "Ver todo" quita el resaltado. Implementa la atenuación con una clase o atributo en el contenedor (por ejemplo data-foco-gen) para reutilizarla en la Fase 2 con linajes y filtros.
> 3. Nombres bajo las velas: legibles en la vista completa a 1920×1080 (mínimo 11 px en pantalla). Si se encimean, separa más a las parejas o alterna la altura de los nombres. Aumenta el tamaño de las velas y separa más los niveles para aprovechar la pantalla.
> 4. Títulos de cada nivel: reemplaza los actuales por "Abuelos y tíos abuelos", "Padres y tíos" y "Tu generación y primos". Sin números romanos ni paréntesis, sin cantidades de personas ni parejas. Hazlos más grandes y legibles (mínimo 13 px en pantalla a 1920×1080), con buen contraste y sin competir con las velas.
> 5. Ficha: no muestres códigos técnicos (rol_en_arbol como [MZD1], ni ID como P057) en ninguna parte visible. Conserva solo el parentesco en español. Actualiza la decisión anterior en MEMORIA.md ("el código se preserva como visible") y anota que ahora queda oculto por claridad para el usuario. Usa "Hija" o "Hijo" según el sexo en lugar de "Hijo/a", y muestra las fechas como "8 de junio de 2007". No modifiques los datos de ciudades.
> 6. Mantén el arrastre, la rueda de zoom, el halo violeta, la ficha y la leyenda. No agregues funciones de la Fase 2. Al terminar, actualiza MEMORIA.md y detente.
**Resultado:** Se implementaron las 6 solicitudes de la Corrección 2: (1) Función única `fitToBox` que calcula el bounding box real del árbol (`getBBox()`) y el área visible real (`clientWidth`/`clientHeight`), ocupando ~90% del ancho útil centrado; se ejecuta al cargar, tras `document.fonts.ready` y en resize. Se identificó la causa del árbol pequeño y cortado (el atributo viewBox estático provocaba una escala compuesta duplicada y desplazamiento de coordenadas); (2) Los botones de generación ya no mueven la vista, sino que aplican foco y atenuación (`data-foco-gen`), dejando la generación elegida al 100% con nombres +25% y resplandor suave, el resto al 30% y líneas vecinas al 40%, con transición de 250ms y desactivación al repulsar o presionar "Ver todo"; (3) Legibilidad a 1920×1080 (mínimo 11px en pantalla, nombres a 26px SVG / ~12px pantalla), nombres con altura alternada (Y=58/82) y separación de parejas a 116px sin solapamientos, velas aumentadas (44×68px) y mayor separación de niveles (Y=220, 720, 1220); (4) Títulos de nivel actualizados ("Abuelos y tíos abuelos", "Padres y tíos", "Tu generación y primos") legibles (32px SVG / ~14.7px pantalla, superando 13px) en tono dorado `#FFE082`; (5) Ocultamiento completo de códigos técnicos (`rol_en_arbol` e IDs) en toda la interfaz visible, preservando parentesco natural ("Hijo" o "Hija" por sexo) y fechas en formato largo; (6) Se mantuvieron arrastre, zoom, halo violeta, ficha y leyenda sin agregar funciones de Fase 2. Se actualizó `docs/MEMORIA.md`.
**Archivos modificados:** `index.html`, `js/tree-layout.js`, `js/app.js`, `css/styles.css`, `docs/MEMORIA.md`, `docs/PROMPTS.md`
**Observaciones:** Pruebas y validaciones ejecutadas exitosamente al 100%. Fase 1 lista para revisión. 

### P-008 · 2026-10-24 01:28 · Fase 1 (Corrección 3) y Fase 2
**Prompt (textual):**
> Corrección 3 de la Fase 1 (regístrala en "Correcciones y aclaraciones" de MEMORIA.md): en la ficha, quita la etiqueta "(calculado)" de las edades y años vividos; deben verse como "80 años vividos" o "19 años". Los años se siguen calculando como años cumplidos a partir de las fechas. Actualiza con ediciones puntuales la regla 5 de AGENTS.md y la nota de la ficha en docs/DISENO.md, que hoy piden etiquetarlos como calculados, y anota la decisión en MEMORIA.md. Marca la Fase 1 como terminada y aprobada.
> 
> Luego ejecuta la Fase 2 según el plan aprobado, sin romper lo de la Fase 1: resaltado de ancestros y descendientes de la persona seleccionada (reutiliza el mecanismo de atenuación data-foco-gen), filtros combinados (vivos/fallecidos, ciudad, profesión), búsqueda por nombre, tooltip al pasar el cursor con nombre completo y años, y ritual de encendido al hacer clic en un fallecido (la vela se enciende un momento con llama violeta y se abre su ficha). Sigue docs/DISENO.md. Al terminar, actualiza MEMORIA.md y detente.
**Resultado:** Se aplicó la Corrección 3 de la Fase 1: se retiró la etiqueta "(calculado)" de las edades y años vividos (mostrándose como "80 años vividos" o "19 años" calculados como años cumplidos a partir de las fechas); se actualizaron puntualmente la regla 5 de `AGENTS.md` y `docs/DISENO.md`, anotando la decisión en `MEMORIA.md` y marcando la Fase 1 como terminada y aprobada. A continuación se ejecutó la Fase 2 completa: (1) Resaltado de ancestros y descendientes (linaje) en cempasúchil brillante con atenuación selectiva del resto al 25% (conmutador en barra y ficha); (2) Filtros combinados dinámicos por estado (todos/vivos/difuntos), ciudad y profesión con contador en vivo ("57 / 57") y botón de limpieza; (3) Búsqueda por nombre en tiempo real con dropdown interactivo que centra y selecciona la vela; (4) Tooltips flotantes accesibles al cursor y foco de teclado con nombre, parentesco y fechas/años; (5) Ritual de encendido de difuntos: al hacer clic en un fallecido, su vela se enciende con llama violeta pulsante durante ~2.2 s y abre su ficha biográfica completa antes de apagarse suavemente.
**Archivos modificados:** `AGENTS.md`, `docs/DISENO.md`, `docs/MEMORIA.md`, `docs/PROMPTS.md`, `index.html`, `js/data-engine.js`, `js/app.js`, `css/styles.css`
**Observaciones:** Fase 1 terminada y aprobada. Fase 2 completada y validada al 100% con tests automáticos.

### P-009 · 2026-10-24 02:00 · Mini-fase "Ambientación"
**Prompt (textual):**
> Mini-fase "Ambientación" (agrégala al plan de MEMORIA.md como decisión: va después de la Fase 2 y antes de la Fase 4). Objetivo: que el dashboard se sienta como una ofrenda de Día de Muertos, siguiendo docs/DISENO.md, sin dañar la legibilidad ni el rendimiento. Es solo decoración: no cambies datos, layout, filtros ni la ficha.
> 1. Fondo: usa assets/fondo-ofrenda.* (trae arcos neón laterales, guirnaldas de papel picado arriba, luna, cementerio con velas difuminadas, humo y una fila de cempasúchil con calaveras de azúcar abajo; el centro está despejado). Colócalo como fondo fijo detrás del árbol (no se mueve ni escala con el zoom), con background-size: cover y background-position: center bottom, para que la fila de flores y calaveras no se recorte. Si pesa más de 500 KB, optimízalo o avísame. Si no existe, deja un fondo de respaldo con CSS (degradado, luna y estrellas).
> 2. Zona libre: los arcos laterales ocupan ~9% del ancho a cada lado y las flores y calaveras ~13% inferior de la altura de la imagen ya escalada. Ajusta fitToBox para que el árbol quede entre esos márgenes laterales, encima de esa franja inferior y debajo de los filtros, sin que ningún nodo ni nombre toque los arcos ni las flores. Es aceptable que el árbol se reduzca un poco. Calcula los márgenes a partir del tamaño del viewport, no con valores fijos.
> 3. Legibilidad: añade sobre el fondo un degradado oscuro radial suave en el centro para asegurar contraste AA en nombres y velas. Dale al encabezado, a la barra de filtros y a la leyenda un fondo oscuro semitransparente con desenfoque (efecto vidrio). Si la cenefa naranja actual de arriba choca con las guirnaldas del fondo, quítala o hazla más delgada.
> 4. Repisas de altar en SVG, dentro del grupo del árbol, una bajo cada generación. Su ancho y posición se calculan del bounding box real de cada fila (no valores fijos) con un margen. Estilo: franja violeta oscura con borde frontal de papel picado (patrón SVG original) y una guirnalda discreta de flores de cempasúchil a lo largo del borde superior (discreta, porque el fondo ya tiene flores abajo). Las velas y nombres quedan encima y legibles, y los títulos de nivel se mantienen.
> 5. Ambiente sutil: un par de hilos de humo violeta y cian en las esquinas inferiores y estrellas con parpadeo muy lento, solo con CSS. Se desactivan con prefers-reduced-motion y se pausan mientras se arrastra o se hace zoom.
> 6. Reglas: capas decorativas con pointer-events: none, detrás de los datos. Nada de recursos de películas ni de otras obras con derechos. Que el arrastre y la rueda sigan fluidos.
> Registra esta mini-fase en PROMPTS.md y MEMORIA.md. Al terminar, detente.
**Resultado:** Se implementó la mini-fase de ambientación con fondo nocturno, márgenes de zona libre dinámicos en `fitToBox`, efectos de vidrio, estrellas y humo en CSS.
**Archivos modificados:** `assets/fondo-ofrenda.jpg`, `css/styles.css`, `js/app.js`, `docs/MEMORIA.md`, `docs/PROMPTS.md`
**Observaciones:** La imagen quedó demasiado oscurecida por capas superpuestas y las repisas de madera no aportaron el resultado visual idóneo; se procede a su corrección en P-010.

### P-010 · 2026-10-24 02:40 · Corrección de la Ambientación
**Prompt (textual):**
> Corrección de la Ambientación (solo decoración; no toques datos, layout, filtros, ficha ni encuadre).
> 
> 1. El fondo assets/fondo-ofrenda.jpg ya carga, pero se ve casi invisible. Hazlo claramente visible:
>    - Revisa todas las capas que lo oscurecen: el degradado radial, cualquier overlay, opacity o filter aplicado al fondo, y los fondos semitransparentes de los contenedores.
>    - Baja la opacidad del degradado radial para que el fondo se aprecie bien (luna, arcos neón, papel picado, flores, calaveras, humo y velas difuminadas). Que oscurezca solo de forma suave la zona central, detrás de las velas, y deje los bordes casi sin oscurecer.
>    - Mantén contraste AA en los nombres con un text-shadow oscuro en las etiquetas, no oscureciendo todo el fondo.
>    - Mantén: background-size: cover, background-position: center bottom, fondo fijo.
> 
> 2. QUITA por completo las barras o repisas bajo cada generación (altar-shelves-layer, su SVG y su CSS). Las velas van directamente sobre el fondo. Deja los títulos de nivel y las líneas punteadas finas bajo ellos.
> 
> 3. Deja el encabezado y los filtros con efecto vidrio, pero que se vea el fondo detrás.
> 
> Verifica abriendo la página y compárala con la imagen original del fondo antes de decir que está listo. Regístralo en PROMPTS.md y en "Correcciones y aclaraciones" de MEMORIA.md. Al terminar, detente.
**Resultado:** Se corrigió por completo la ambientación: (1) Se colocó `assets/fondo-ofrenda.jpg` como fondo fijo en `#app` con `background-size: cover; background-position: center bottom;` y contenedor del lienzo transparente, eliminando las múltiples capas que lo tapaban; (2) Se redujo la opacidad del degradado radial `.viewport-radial-overlay` para que oscurezca solo de forma muy suave la zona central detrás de las velas (~35% máx) y deje los bordes transparentes (0%), haciendo 100% visibles la luna, arcos neón laterales, papel picado superior, flores y calaveras de azúcar inferiores; (3) Se aseguró contraste AA/AAA en los nombres mediante contorno y sombra oscura en `.candle-label` (`paint-order: stroke fill; stroke: rgba(10,5,22,0.95); stroke-width: 4px; text-shadow: 0 2px 6px #000;`); (4) Se eliminaron por completo las barras/repisas bajo cada generación (`altar-shelves-layer`, filtros/gradientes SVG, código JS y reglas CSS), dejando las velas directamente sobre el fondo nocturno y conservando los títulos de nivel y líneas punteadas separadoras; (5) Se implementó efecto vidrio translúcido (`backdrop-filter: blur(12px) saturate(130%)`) en el encabezado y en los controles de filtro, permitiendo ver el fondo detrás; (6) Se verificó la página abriéndola en headless Edge y comparando los canales de color con la imagen original.
**Archivos modificados:** `index.html`, `css/styles.css`, `js/app.js`, `docs/MEMORIA.md`, `docs/PROMPTS.md`
**Observaciones:** No se tocaron datos, layout, filtros, ficha ni encuadre (`fitToBox`). Validación de dataset (`tests/validate_data.py`) pasando al 100%.

### P-011 · 2026-10-24 02:56 · Soporte local
**Prompt (textual):**
> muy bien, cómo puedo ver por mi cuenta el dashboard?
**Resultado:** Se brindaron las instrucciones exactas y opciones para iniciar el servidor local con Python y abrir el navegador en la ruta correcta.
**Archivos modificados:** `docs/PROMPTS.md`
**Observaciones:**

### P-012 · 2026-10-24 03:00 · Ajuste menor de legibilidad
**Prompt (textual):**
> C) Ajuste menor de legibilidad (solo CSS): en las etiquetas de nombre y en los títulos de nivel, refuerza el text-shadow oscuro (un halo de 2 capas, por ejemplo 0 0 4px rgba(10,5,25,.95), 0 1px 3px #000) para que se lean sobre las flores del fondo. Añade un degradado oscuro suave y localizado en la zona de la fila inferior (detrás de "Tu generación y primos"), sin oscurecer el resto del fondo ni los arcos. No cambies layout, datos ni filtros.
**Resultado:** Se ajustó la legibilidad exclusivamente en CSS: (1) Se reforzó el halo oscuro de 2 capas más contorno (`text-shadow: 0 0 4px/5px rgba(10,5,25,.95), 0 1px 3px #000; paint-order: stroke fill; stroke: rgba(10,5,25,.95);`) en `.candle-label` y en `.level-banner-text` para lectura clara sobre las flores del fondo; (2) Se añadió un degradado radial oscuro suave y localizado en la fila inferior (`radial-gradient(ellipse 72% 26% at 50% 84%, rgba(10, 5, 22, 0.48) 0%, rgba(10, 5, 22, 0.25) 45%, transparent 75%)`) detrás de "Tu generación y primos" sin afectar el resto del fondo ni los arcos.
**Archivos modificados:** `css/styles.css`, `docs/MEMORIA.md`, `docs/PROMPTS.md`
**Observaciones:** Cambio exclusivo de CSS. Layout, datos y filtros permanecen intactos. Validación con `validate_data.py` al 100%.

### P-013 · 2026-10-24 03:18 · Bug del linaje (Fase 2)
**Prompt (textual):**
> D) Bug del linaje (Fase 2): el resaltado es inconsistente según quién de la pareja se seleccione. Ejemplo: al seleccionar a Guadalupe y pulsar "Linaje", no se encienden las líneas de filiación hacia sus hijos y su esposo Antonio queda apagado; con Antonio sí se encienden las líneas, pero Guadalupe queda apagada. Corrige con estas reglas, aplicadas de forma simétrica:
>    - El linaje es: la persona seleccionada + sus ancestros + sus descendientes (por id_padre e id_madre).
>    - Una línea de filiación (de la unión de la pareja a un hijo) se enciende si el hijo está en el linaje Y al menos uno de sus padres está en el linaje. No debe depender de cuál de los dos padres sea el "ancla" del dibujo.
>    - La pareja de la persona seleccionada también se enciende, con su guirnalda. Los cónyuges de ancestros y descendientes siguen atenuados.
>    Primero explícame en 2 líneas la causa real. Luego verifica abriendo la página con estos casos: Antonio, Guadalupe, Sofía (Tú), un fallecido que sea el cónyuge de la pareja (Gonzalo), y una persona soltera sin hijos (Esteban). Confirma que el resultado es el mismo sin importar cuál de los dos de una pareja selecciones.
**Resultado:** Se corrigió el bug de asimetría en el resaltado de linaje: (1) Se diagnosticó la causa: las líneas de filiación solo almacenaban el ID del padre (`p.id_padre || p.id_madre`), evaluándose asimétricamente y fallando al seleccionar a la madre; además la pareja del sujeto no se sumaba a los nodos iluminados ni a la guirnalda; (2) Se agregaron `data-father` y `data-mother` a las líneas de filiación, activándose si el hijo y cualquiera de sus progenitores están en el linaje; (3) Se incluyó la pareja de la persona seleccionada en los nodos activos y su guirnalda de cónyuge (`isSelectedCouple`), manteniendo atenuados a los cónyuges de ancestros y descendientes; (4) Se validó simétricamente con Antonio, Guadalupe, Sofía, Gonzalo y Esteban mediante pruebas automatizadas.
**Archivos modificados:** `js/tree-layout.js`, `js/app.js`, `tests/test_lineage.mjs`, `docs/MEMORIA.md`, `docs/PROMPTS.md`
**Observaciones:** 100% simétrico entre cónyuges. Las 5 pruebas pasaron con éxito total.

### P-014 · 2026-10-24 03:35 · Fase 3 reducida (Panel "Resumen")
**Prompt (textual):**
> Fase 3 reducida: panel "Resumen". Solo agrega esto; no toques datos, layout del árbol, filtros, linaje, ficha ni el fondo.
> 
> 1. Botón "Resumen" en la barra superior, junto a los controles existentes, con el mismo estilo vidrio.
> 
> 2. Al pulsarlo se abre una tarjeta cerrable (botón ✕ y tecla Esc) con las cifras calculadas desde data.json, nada escrito a mano:
>    - Total de personas, vivos y fallecidos.
>    - Fallecidos por generación (por ejemplo "Abuelos y tíos abuelos: 12 de 24").
>    - Años vividos promedio de los fallecidos en total (años cumplidos).
>    - Para Padres y tíos y Tu generación, que tienen un solo fallecido, muestra el dato individual ("Mauricio vivió 48 años", "Rodrigo vivió 22 años") en vez de un promedio. Que el nombre y los años salgan de los datos, no del código.
>    Usa los títulos de nivel que ya existen en la interfaz, sin códigos técnicos ni etiquetas como "(calculado)".
> 
> 3. Ubicación y diseño:
>    - Panel flotante en la esquina inferior derecha en laptop, con ancho máximo de ~340 px, fondo oscuro semitransparente con desenfoque (como los filtros) y borde sutil. No debe tapar el árbol ni la leyenda.
>    - En celular, cajón inferior de ancho completo, con altura máxima de ~45% de la pantalla.
>    - Texto legible (mínimo 13 px, color --texto). Usa el cempasúchil solo para resaltar las cifras clave.
>    - Respeta prefers-reduced-motion. Accesible: aria-label, foco visible en cian y cierre con teclado.
>    - Con el panel abierto, el arrastre, el zoom y la selección de velas deben seguir funcionando.
> 
> 4. Verifica una sola vez: abre la página, confirma que las cifras coinciden con las de tests/validate_data.py (14 fallecidos, 43 vivos; 12 de 24, 1 de 19, 1 de 14; promedio global 73.1 años) y que el panel se ve bien en pantalla ancha y en vista de celular.
> 
> Registra en PROMPTS.md y MEMORIA.md. Al terminar, detente.
**Resultado:** Se implementó el panel "Resumen" (Fase 3 reducida) completo: (1) Botón "Resumen" con estilo vidrio añadido a la barra de navegación; (2) Panel flotante que muestra, calculado 100% desde `data.json`: total=57, vivos=43, fallecidos=14, promedio global=73.1 años, Gen2=12/24, Gen1=1/19 con "Mauricio vivió 48 años", Gen0=1/14 con "Rodrigo vivió 22 años"; (3) Diseño flotante esquina inferior derecha (340 px máx en laptop) y cajón inferior de ancho completo en móvil (máx 45% pantalla); cerrable con ✕ y Esc; efecto vidrio con `backdrop-filter`; texto mínimo 13 px; cifras en cempasúchil; accesible con aria-expanded, aria-label y foco en cian; arrastre, zoom y selección de velas siguen funcionando. Verificado que las cifras coinciden exactamente con las de `tests/validate_data.py`.
**Archivos modificados:** `index.html`, `js/app.js`, `js/data-engine.js`, `css/styles.css`, `docs/MEMORIA.md`, `docs/PROMPTS.md`
**Observaciones:** Métricas 100% calculadas desde datos. Sin ningún valor escrito a mano en el código. `validate_data.py` al 100%.

### P-015 · 2026-10-24 12:21 · Mejora visual de velas (SVG y CSS)
**Prompt (textual):**
> Mejora visual de las velas (solo el SVG y CSS del nodo; no toques datos, layout, tamaño de las velas, filtros, linaje, ficha, ritual ni el fondo). Objetivo: que al hacer zoom las velas se vean como ilustraciones artesanales y no como un rectángulo blanco, sin ocupar más espacio.
> 
> 1. Llama de los vivos: 3 capas superpuestas (exterior cempasúchil, media naranja, núcleo blanco-amarillo), con parpadeo orgánico: animación CSS con transform/opacity, duración y retraso distintos por vela (derivados del id, p. ej. entre 1.8 s y 3 s). Brillo cálido sutil con drop-shadow, que no domine el fondo.
> 
> 2. Cuerpo de la vela (conserva --cera como color base), con detalle que se aprecie al hacer zoom:
>    - Degradado vertical y brillo lateral suave (luz a un lado, sombra al otro) para dar volumen.
>    - 2 o 3 vetas verticales sutiles de cera, de baja opacidad.
>    - Borde superior ondulado con 1 o 2 goteos de cera de longitud irregular y un pequeño charco de cera en la base.
>    - Pabilo oscuro con la punta quemada, visible bajo la llama; en las velas apagadas, el pabilo con un hilo de brasa tenue.
>    El diseño del cuerpo debe ser idéntico en las 57 velas: el color del cuerpo no codifica ningún dato.
> 
> 3. Fallecidos: sin llama, con halo violeta y humo como hasta ahora; no los hagas más tenues. El ritual (llama violeta temporal) y el aro cian de selección siguen igual.
> 
> 4. Rendimiento: define los degradados y formas una sola vez en <defs> y reutilízalos (<use> o referencias), no los dupliques por vela. Anima solo con transform y opacity. Respeta prefers-reduced-motion (llama estática, sin humo animado).
> 
> 5. Mantén legibles los nombres y el tamaño actual de las velas.
> 
> Verifica una sola vez: "Ver todo", un zoom fuerte sobre una vela viva y una apagada, y con el filtro de fallecidos activo. Registra en PROMPTS.md y MEMORIA.md. Al terminar, detente.
**Resultado:** Se implementó la mejora visual artesanal de las 57 velas mediante SVG puro y animaciones CSS de alto rendimiento: (1) Se declararon las formas y gradientes reutilizables una sola vez en `<defs>` (`#candle-artistic-body` y `#flame-artistic-layers`), siendo consumidos vía `<use>` sin duplicación en el DOM; (2) La llama viva consta de 3 capas superpuestas (exterior cempasúchil, media naranja y núcleo blanco-amarillo) con `@keyframes organicFlicker` mediante transform y opacity, y duración/retraso escalonados derivados del ID de cada persona (1.8 s a 2.9 s); (3) El cuerpo cilíndrico de cera artesanal conserva el color base `--cera`, agregando degradado vertical y brillo lateral para volumen, vetas verticales sutiles, borde superior ondulado con 2 gotas de cera en relieve, charco de cera en la base y pábilo oscuro visible bajo la llama; (4) En las velas apagadas de difuntos se añadió un hilo de brasa tenue en la punta del pábilo, manteniendo intactos el halo violeta espectral, el humo, el ritual de encendido y el aro de selección cian; (5) Sin alterar datos, layout, dimensiones, filtros, linaje, ficha ni fondo; (6) Se verificó de una sola vez con captura automatizada en Edge headless de: "Ver todo", zoom fuerte sobre vela viva (P044), zoom fuerte sobre vela apagada (P007) y filtro de fallecidos activo.
**Archivos modificados:** `index.html`, `js/app.js`, `css/styles.css`, `tests/verify_visual.mjs`, `docs/PROMPTS.md`, `docs/MEMORIA.md`
**Observaciones:** Cero duplicación en el DOM; fluidez a 60 FPS conservada con transform/opacity; `prefers-reduced-motion` respetado; dataset 100% íntegro validado con `validate_data.py`.

### P-016 · 2026-10-24 12:41 · Revisión visual de velas / Caché
**Prompt (textual):**
> Oye, pero, se siguen viendo igual las velas
**Resultado:** Se identificó que el navegador mantenía en caché las versiones previas de `styles.css` y `app.js`. Se incorporaron parámetros de control de versión (`?v=2`) en los enlaces de [index.html] para evitar que el navegador use recursos cacheados.
**Archivos modificados:** `index.html`, `docs/PROMPTS.md`
**Observaciones:** Resuelto al recargar el navegador.

### P-017 · 2026-10-24 12:46 · Confirmación de visualización
**Prompt (textual):**
> Ya recargué bien la pagina, ya se aprecían los cambios
**Resultado:** Se confirmó por parte del usuario la correcta apreciación de las nuevas velas artesanales y sus animaciones multicapa. No se requirieron cambios adicionales de código.
**Archivos modificados:** `docs/PROMPTS.md`
**Observaciones:** Visualización validada y aprobada por el usuario.

### P-018 · 2026-10-24 20:06 · Fondo animado sutil
**Prompt (textual):**
> Fondo animado sutil (solo decoración; no toques datos, layout del árbol, velas, filtros, linaje, ficha ni el resumen).
> 
> Mantén assets/fondo-ofrenda.jpg como base y agrega encima, detrás del árbol y de la interfaz, una capa decorativa con pointer-events: none y aria-hidden="true". Para que los efectos queden alineados con la imagen en cualquier pantalla, colócalos dentro de un contenedor con la misma proporción que la imagen (1376×768) y el mismo anclaje que el fondo (cover, centrado abajo).
> 
> Efectos, todos con CSS (transform y opacity únicamente):
> 1. Estrellas: 8 a 10 puntos pequeños sobre las estrellas visibles de la imagen, con parpadeo suave y retrasos distintos.
> 2. Luna: un halo suave sobre la luna (arriba a la derecha) que pulsa lentamente, entre 6 y 8 s.
> 3. Humo: dos hilos translúcidos sobre los inciensos (esquinas inferiores), que suben y se desvanecen en bucle; violeta a la izquierda y cian tenue a la derecha, como en la imagen.
> 4. Destellos: 6 a 8 brillos cálidos pequeños sobre las velas borrosas del fondo, con parpadeo desfasado.
> 5. Pétalos: 10 a 12 pétalos de cempasúchil (color --cempasuchil) que caen lentamente por los costados, con opacidad baja (máx. 0.5), tamaño y velocidad variables. Que no pasen por la zona central donde están los nombres.
> 6. Respiración: zoom casi imperceptible del fondo (100% a 103%, ~30 s).
> 
> Todo debe ser sutil: el árbol sigue siendo lo que destaca y los nombres deben seguir legibles. Respeta prefers-reduced-motion (sin animaciones, fondo estático). Pausa las animaciones si la pestaña no está visible. Sin librerías externas.
> 
> Verifica una sola vez en "Ver todo" a pantalla completa y en vista de celular. Registra en PROMPTS.md y MEMORIA.md. Al terminar, detente.
**Resultado:** Se implementó la capa decorativa de ambientación y fondo animado sutil: (1) Se encapsuló la base `assets/fondo-ofrenda.jpg` y los efectos en un contenedor `.bg-stage-frame` con la proporción idéntica de la imagen (1376×768) y anclaje cover centrado abajo (`bottom: 0`, `left: 50%`, `transform: translateX(-50%)`), con `pointer-events: none` y `aria-hidden="true"`; (2) Los 6 efectos se realizaron exclusivamente con CSS animando únicamente `transform` y `opacity`: 10 puntos de estrellas sobre estrellas reales de la imagen con parpadeo suave y desfase; halo pulsante sobre la luna (arriba a la derecha, 7 s); dos hilos translúcidos de incienso en bucle en las esquinas inferiores (violeta a la izquierda, cian a la derecha); 7 destellos cálidos pequeños sobre las velas borrosas del fondo; 12 pétalos de cempasúchil cayendo por los costados con opacidad máx. < 0.45 sin cruzar el centro donde se ubican los nombres; respiración con zoom imperceptible (100% a 103%, 30 s) sincronizado con el fondo; (3) Pausa automática de animaciones al perder visibilidad de pestaña con `visibilitychange` (`.is-tab-hidden`) y durante navegación/paneo (`.is-navigating`); (4) Soporte completo para `prefers-reduced-motion` manteniendo el fondo estático sin animaciones; (5) Sin alterar datos, layout, velas, filtros, linaje, ficha ni resumen; (6) Verificado de una sola vez mediante captura automatizada en "Ver todo" a pantalla completa (1920×1080) y vista de celular (390×844), confirmando legibilidad y alineación perfecta; validación con `validate_data.py` al 100%.
**Archivos modificados:** `index.html`, `css/styles.css`, `js/app.js`, `tests/verify_background.mjs`, `docs/PROMPTS.md`, `docs/MEMORIA.md`
**Observaciones:** Cero librerías externas. Fluidez absoluta a 60 FPS con aceleración por hardware (`will-change`, transform/opacity). Legibilidad y contraste AA del árbol completamente preservados. 

### P-019 · 2026-10-24 20:35 · Corrección del ícono de la luna en encabezado
**Prompt (textual):**
> Corrige el ícono de la luna en el encabezado: hoy es un círculo oscuro sobre uno crema, y sobre el degradado del encabezado se nota como dos círculos encimados. Sustitúyelo por una luna creciente dibujada como una sola forma SVG (path), relleno --cera, con un resplandor suave (drop-shadow), sin círculos que oculten parte de otro. Debe verse limpia con zoom y sobre cualquier fondo.
**Resultado:** Se corrigió el ícono de la luna en el encabezado sustituyendo los dos círculos encimados por un único `<path>` SVG con geometría matemática pura (`M 35 21.32 A 15 15 0 1 1 18.68 5 A 11.67 11.67 0 0 0 35 21.32 Z`), relleno con `var(--cera)` (`#F3E3C3`) y resplandor suave `filter: drop-shadow(0 0 7px rgba(255, 235, 175, 0.65))` con `overflow: visible`. El recorte interior es 100% transparente, eliminando el artefacto de círculos superpuestos sobre el degradado y fondo translúcido del encabezado. Se verificó con captura en alta resolución mediante Edge headless.
**Archivos modificados:** `index.html`, `css/styles.css`, `tests/verify_moon.mjs`, `docs/PROMPTS.md`, `docs/MEMORIA.md`
**Observaciones:** Luna limpia, nítida y escalable al 100% bajo cualquier nivel de zoom y sobre cualquier fondo o transparencia. Dataset 100% íntegro validado con `validate_data.py`. 

### P-020 · 2026-10-24 20:51 · Consulta sobre carpeta temporal .tmp_edge_profile_moon
**Prompt (textual):**
> para qué sirve la carpeta .tmp_edge_profile_moon? Es necesaria para el proyecto?
**Resultado:** Se explicó que es un directorio temporal de sesión creado automáticamente por Microsoft Edge al ejecutar la prueba automatizada `tests/verify_moon.mjs` en modo headless, que no es necesaria para el proyecto, no afecta la web y puede eliminarse con total seguridad (así como incluirse en `.gitignore`).
**Archivos modificados:** `docs/PROMPTS.md`
**Observaciones:** Consulta aclaratoria sin impacto en código de producción.

### P-021 · 2026-10-24 23:32 · Correcciones (Ego/referencia, Filtro ciudad, Estado vivas)
**Prompt (textual):**
> Tres correcciones en un solo turno. Son cambios acotados: no toques datos, layout del árbol, diseño de las velas, fondo, linaje, encabezado ni el panel Resumen más allá de lo indicado. Hazlas en este orden y detente al final.
> 
> A) Aclaración del organizador del concurso (24-oct-2026): el dashboard no debe destacar a ninguna persona como referencia (ni Sofía/Ego). Debe mostrar el árbol completo y sus relaciones de forma general.
> 1. Quita la etiqueta "(Tú)": el nombre de P044 se muestra como el de cualquier otra persona.
> 2. Al abrir la página no debe haber ninguna persona seleccionada ni aro cian.
> 3. Renombra los niveles en todos los lugares donde aparezcan (títulos de nivel, botones de la barra superior y panel Resumen): "Generación 2", "Generación 1" y "Generación 0". Quita "Tu generación", "Tu Generación" y cualquier referencia a "Tú".
> 4. En la ficha lateral, ELIMINA por completo la línea de parentesco bajo el nombre (hoy, por ejemplo, "Primo hermano materno (Hijo del tío Ricardo)"), porque está redactada desde la perspectiva de Ego y la información ya aparece en "Vínculos familiares directos". No la sustituyas por nada. Conserva la insignia de estado ("Vive con nosotros"), el botón "Resaltar linaje de esta persona" y la sección "Vínculos familiares directos" tal como están.
> 5. En el tooltip que aparece al pasar el cursor (o enfocar con teclado) sobre una vela, ELIMINA también la línea de parentesco. El tooltip debe mostrar solo: el indicador de estado, el nombre completo y las fechas con los años cumplidos (por ejemplo "Nac. 1998 (27 años)"; para fallecidos, nacimiento, fallecimiento y años vividos, calculados desde data.json). Revisa también el aria-label de cada vela: solo nombre y estado, sin parentesco con Ego.
> 6. Quita cualquier otra mención a Ego, a parentescos relativos a Sofía ("tío", "primo", "sobrino") y a los códigos de rol_en_arbol, y cualquier lógica que use P044 como referencia.
> 
> B) Filtro de Ciudad (solo el filtro y la lista de opciones; no toques la ficha, el árbol, el rótulo del filtro ni el resto de la interfaz).
> Problema: ciudad_origen usa formato completo ("Puebla, Puebla") y otras_ciudades_donde_vivio usa abreviaturas y variantes ("Puebla, Pue.", "CDMX", "Huajuapan, Oax."), así que el menú muestra la misma ciudad varias veces y cada opción resalta un número distinto de personas.
> 1. Crea una función que unifique cada nombre de ciudad a un nombre canónico, con una tabla de equivalencias pequeña en el código (solo para unificar variantes; no edites data.json):
>    - Puebla: "Puebla, Puebla" y "Puebla, Pue."
>    - Oaxaca de Juárez: "Oaxaca de Juárez, Oaxaca" y "Oaxaca, Oax."
>    - Huajuapan de León: "Huajuapan de León, Oaxaca", "Huajuapan de León, Oax." y "Huajuapan, Oax."
>    - CDMX: "Ciudad de México" y "CDMX"
>    - Querétaro: "Querétaro, Querétaro" y "Querétaro, Qro."
>    - Veracruz: "Veracruz, Veracruz" y "Veracruz, Ver."
>    - Xalapa: "Xalapa, Veracruz" y "Xalapa, Ver."
>    - Atlixco: "Atlixco, Puebla" y "Atlixco, Pue."
>    - Tehuacán, La Paz y Pachuca: cada una con su única variante.
>    Cualquier ciudad que no esté en la tabla debe mostrarse tal cual, sin perderse.
> 2. El menú muestra una sola lista con los nombres canónicos, ordenada alfabéticamente, sin conteos y manteniendo el rótulo actual del filtro ("Ciudad: Todas").
> 3. Una persona coincide con una ciudad si esa ciudad (unificada) es su ciudad de origen O está entre las otras ciudades donde vivió. Cada persona cuenta una sola vez por ciudad.
> 4. El contador "N / 57" y el resaltado deben reflejar ese criterio. Los filtros combinados (estado, profesión) siguen funcionando.
> 5. Añade a tests/validate_data.py una verificación de que ningún nombre unificado aparece duplicado y que los totales por ciudad son: Puebla 33, Oaxaca de Juárez 24, CDMX 14, Huajuapan de León 10, Veracruz 6, Querétaro 5, Xalapa 5, Tehuacán 3, Atlixco 3, La Paz 3, Pachuca 1.
> 
> C) Ficha, bloque "Línea de tiempo": para las personas vivas, la celda "Estado" muestra "Presente en la ofrenda", que es incoherente con la tradición (en la ofrenda se recuerda a quienes fallecieron). Mantén la estructura y la etiqueta "Estado", pero sustituye ese valor por "Vive". No cambies lo que se muestra para los fallecidos. Busca la frase "Presente en la ofrenda" en todo el código (ficha, tooltip, aria-label, panel Resumen, README) y reemplázala o elimínala para que no quede en ningún otro lugar.
> 
> Verificación (una sola vez): abre la página recién cargada y confirma que no hay selección ni "(Tú)"; revisa la ficha y el tooltip de una persona viva (la celda de estado dice "Vive"), un fallecido y uno de la Generación 2 (sin palabras como "primo", "tío" o "sobrino"); abre el menú de ciudades (11 opciones, sin duplicados) y prueba Puebla y Huajuapan de León; ejecuta tests/validate_data.py.
> Registra en MEMORIA.md (sección "Correcciones y aclaraciones", con fecha y motivo: respuesta del organizador sobre Ego; línea de parentesco eliminada porque los vínculos directos ya la cubren; tabla de equivalencias de ciudades como decisión; "Presente en la ofrenda" sustituido por "Vive" por coherencia con la tradición) y en PROMPTS.md. Al terminar, detente.
**Resultado:** Se aplicaron rigurosamente las tres correcciones solicitadas en un solo turno:
1. **Aclaración del organizador (descentralización de Ego):** se retiró la etiqueta "(Tú)" de P044 mostrando su nombre regular ("Sofía"); se eliminó la selección automática al inicio (abriendo sin selección ni aro cian); se renombraron todos los niveles a "Generación 2", "Generación 1" y "Generación 0" en títulos SVG, botones superiores y panel Resumen; se eliminó la línea de parentesco relativo bajo el nombre en la ficha lateral y en el tooltip (manteniendo insignia de estado, botón de linaje y vínculos familiares directos); se limpió el `aria-label` a solo nombre y estado; y se removió cualquier lógica que use a P044 como referencia.
2. **Filtro de Ciudad unificado:** se implementó `CITY_CANONICAL_MAP` y la función de canonización que unifica variantes y abreviaturas sin tocar `data.json` ni la ficha; el menú presenta 11 opciones canónicas ordenadas alfabéticamente sin conteos bajo el rótulo "Ciudad: Todas"; cada persona coincide si la ciudad es su origen o residencia previa (contando una sola vez); el badge "N / 57" y el resaltado reflejan con exactitud los totales; y se agregó la verificación en `tests/validate_data.py`.
3. **Tradición en ficha de personas vivas:** se sustituyó "Presente en la ofrenda" por "Vive" en la celda "Estado" de la ficha para personas vivas, manteniendo las fechas de fallecimiento para difuntos, eliminando la frase en todo el proyecto.
Verificado con tests automatizados en navegador y suite de datos pasando al 100%.
**Archivos modificados:** `index.html`, `js/data-engine.js`, `js/tree-layout.js`, `js/app.js`, `tests/validate_data.py`, `docs/MEMORIA.md`, `docs/PROMPTS.md`
**Observaciones:** Dataset 100% íntegro; simetría y legibilidad impecables sin alterar datos, layout, fondo ni diseño de velas.

### P-022 · 2026-10-25 00:57 · Fase 4 (Plan de Cierre)
**Prompt (textual):**
> La fase 3 ha sido finalizado exitosamente, ahora dime: qué implica la fase 4?
**Resultado:** Se detallaron los objetivos, entregables y pasos de la Fase 4 (Cierre y Entrega): auditoría final de checklist R1–R9, creación del README.md completo para el repositorio, optimización de accesibilidad y rendimiento, procedimiento de publicación en GitHub Pages, y verificación final de los requisitos de la convocatoria.
**Archivos modificados:** `docs/PROMPTS.md`
**Observaciones:** Turno informativo y de alineación antes de ejecutar las acciones de cierre.

### P-023 · 2026-10-25 01:12 · Fase 4 (Ejecución y Cierre)
**Prompt (textual):**
> Ok, comienza con la Fase 4 como estaba establecido
**Resultado:** Se ejecutó y concluyó formalmente la Fase 4 (Cierre y Entrega): se creó el `README.md` completo con explicación temática, arquitectura técnica, instrucciones de ejecución y guía para GitHub Pages; se auditaron las rutas relativas en HTML/CSS/JS; se verificó accesibilidad y `prefers-reduced-motion`; se validó el dataset con `tests/validate_data.py` (100% de pruebas aprobadas); y se completó el checklist oficial R1–R9 en `docs/MEMORIA.md` y `docs/REQUISITOS.md`. El Componente A queda 100% terminado.
**Archivos modificados:** `README.md`, `index.html`, `docs/REQUISITOS.md`, `docs/MEMORIA.md`, `docs/PROMPTS.md`
**Observaciones:** El dashboard interactivo está completamente finalizado y listo para desplegarse en GitHub Pages. Resta que el usuario publique el repositorio y desarrolle el Componente B (videos).

## 3. Video de 30 segundos (herramientas de IA)

Imágenes, animación, voz y música usados para el video de 30 segundos: herramienta, prompt textual y qué se obtuvo.

Herramientas: Gemini (hoja de personaje, hoja de escenarios y música), ElevenLabs (voz de Mateo) y Google Vids (clips de video). Fecha de todos los prompts: 25 de octubre de 2026. Los prompts se copian textuales.

### V-01 · 2026-10-25 · Gemini · Hoja de personaje de Mateo
**Prompt (textual):**
> Usa el rostro de la imagen adjunta como referencia exacta (misma cara, mismo cabello y mismos ojos) y crea una hoja de personaje fotorrealista del mismo hombre: Mateo, mexicano de 25 años, desarrollador de software. Fotografía de estudio hiperrealista, textura de piel natural con poros y pecas leves, cabello negro corto y despeinado con flequillo, ojos cafés oscuros, expresión serena, sin lentes ni barba. Viste una sudadera azul marino lisa y jeans oscuros. Composición: tres fotografías de cuerpo completo (frente, tres cuartos y perfil) y dos retratos de primer plano (serio y con una sonrisa suave), todos con la misma persona. Fondo gris claro neutro, iluminación de estudio suave, lente de 85 mm, profundidad de campo natural. Debe parecer una fotografía real, no un dibujo: sin estilo de caricatura, sin ilustración, sin contornos, sin sombreado de dibujo animado, sin render 3D. Sin texto, sin marcas de agua, sin logotipos.

**Resultado:** Hoja de personaje fotorrealista de Mateo (dos retratos de primer plano y tres tomas de cuerpo completo: frente, tres cuartos y perfil). Se usó como referencia del rostro, el cabello y la ropa en los clips donde aparece Mateo.
**Observaciones:** El rostro de referencia es una foto de una persona ficticia generada por IA (this-person-does-not-exist.com). Un primer intento salió caricaturizado por la palabra «ilustración»; este prompt es la versión corregida, que pide fotografía y excluye el estilo de dibujo.

### V-02 · 2026-10-25 · Gemini · Hoja de escenarios
**Prompt (textual):**
> Hoja de referencia de escenarios en una cuadrícula de 4 paneles (2x2), todos con estilo de fotografía cinematográfica realista, colores naturales, grano de película sutil, lente de cine y profundidad de campo natural. Debe parecer fotografía real, no un dibujo: sin estilo de ilustración, sin caricatura, sin render 3D. Sin texto legible, sin marcas de agua, sin logotipos.
>
> El cuarto de Mateo de noche, iluminado únicamente por una tira LED azul que da un tono azulado a toda la escena: escritorio de madera color chocolate con una laptop y una pantalla conectada a ella, ambas con líneas de código en colores de editor oscuro, desenfocadas y no legibles; ventana con luces de la ciudad al fondo.
>
> Aula rural sencilla en un valle de montañas de Puebla al atardecer, con luz dorada entrando por las ventanas: pizarrón, bancas de madera y libros sobre el escritorio.
>
> Ferrocarril mexicano de la década de 1960 al amanecer, entre montañas del sur de México: una locomotora diésel-eléctrica de la época, tipo EMD F7, con nariz redondeada y pintura envejecida sin letras ni logotipos, jalando vagones de pasajeros clásicos. Al fondo, un taller ferroviario de ladrillo y techo de lámina con otra locomotora diésel en reparación, mecánicos con overol azul y gorra de la época, y algo de bruma y vapor saliendo del taller bajo la luz del sol. Aspecto de fotografía documental en color de los años 60, con colores ligeramente desaturados.
>
> Ofrenda de Día de Muertos en la sala de la casa de Mateo, iluminada por velas: mesa escalonada con cuatro velas encendidas al frente, cada una con una fotografía enmarcada detrás, ordenadas de izquierda a derecha así: un anciano, su esposa (una anciana), otra anciana y su esposo (otro anciano). Es decir, dos matrimonios de abuelos, con cada pareja junta y un pequeño espacio entre una pareja y la otra. Rodéalos de cempasúchil, papel picado, pan de muerto, calaveritas de azúcar y caña de azúcar.

**Resultado:** Cuadrícula 2x2 con el cuarto de Mateo, el aula rural, el ferrocarril y la ofrenda, usada como referencia de escenarios.
**Observaciones:** En una versión anterior la locomotora salió de vapor; se corrigió pidiendo una locomotora diésel-eléctrica. La década de 1960 del ferrocarril es una decisión visual del autor; el dataset solo dice que Antonio trabajó en Ferrocarriles Nacionales durante la «era dorada del tren». La hoja de escenarios se recortó en 4 partes para usar cada escenario individualmente dependiendo del clip.

### V-03 · 2026-10-25 · Gemini · Música
**Prompt (textual):**
> Pieza instrumental sentimental y nostálgica de 30 segundos, inspirada en la música tradicional mexicana. Guitarra acústica de nailon, vihuela y guitarrón en estilo de mariachi lento, con un violín suave que entra a mitad de la pieza. Tempo lento, alrededor de 70 BPM, compás de balada tipo bolero. Tono emotivo y íntimo, con aire de recuerdo y homenaje a los seres queridos, en tonalidad menor que se abre hacia un cierre cálido y esperanzador. Dinámica contenida y estable para acompañar una voz narrada: sin trompetas, sin solos fuertes, sin percusión marcada, sin voces ni letra. Termina con un acorde de guitarra que se sostiene y se desvanece suavemente.

**Resultado:** Pista instrumental usada como banda sonora del video.
**Observaciones:** Se añadió «sin trompetas» al prompt para que la música no compitiera con la narración.

### V-04 · 2026-10-25 · ElevenLabs · Diseño de voz
**Prompt (textual):**
> Native Spanish, español mexicano (sin rasgos de español europeo ni argentino). Male, 25–30. Very good quality. Persona: joven desarrollador reflexivo. Emotion: warm, sincere, nostalgic. Smooth, warm timbre with soft, natural intonation and close proximity. Narrates at a relaxed, measured pace with brief pauses between ideas, as if quietly remembering his grandparents.

**Resultado:** Voz «Mateo» creada con Diseño de Voz y usada para la narración.
**Observaciones:** El prompt sigue el formato y las recomendaciones de la guía de prompting de voces de ElevenLabs: idioma y variante en la primera frase, sin la palabra «accent» y sin palabras de efectos de sonido.

### V-05 · 2026-10-25 · ElevenLabs · Narración (texto a voz)
**Prompt (textual):**
> [despacio] Soy Mateo, desarrollo plataformas web accesibles. Mis abuelos Carlos, Carmen y Guadalupe fueron maestros; y mi abuelo Antonio, mecánico de locomotoras. Ellos compartieron su saber y conectaron a la gente. [despacio]Su vocación sigue viviendo en mí cuando escribo código abierto para seguir conectando a las personas. [pausa] [despacio] Esta noche[suspirando][pausa][con voz débil] enciendo una vela en su memoria.

**Resultado:** Audio de la narración (unos 27 s) generado con la voz «Mateo»; las etiquetas de audio entre corchetes controlan pausas y tono.
**Observaciones:** El texto se fue acortando y ajustando para pasar de unos 31 s a unos 27 s sin quitar las etiquetas. Ajustes de generación según el nombre del archivo exportado: velocidad 1.00, estabilidad 50, similitud 75.

### V-06 · 2026-10-25 · Google Vids · Clip del escritorio
**Prompt (textual):**
> Video fotorrealista, cine realista, fotografía cinematográfica de una persona real.Usa la imagen del escritorio como el escenario exacto: cuarto oscuro de noche, ventana con la ciudad iluminada al fondo, tira LED azul detrás del escritorio, laptop y monitor con código en pantalla. Usa la hoja de personaje solo como referencia del rostro, el cabello y la ropa de Mateo (joven de cabello negro corto con flequillo, sudadera azul marino y jeans); no reproduzcas la cuadrícula ni el fondo gris. Mateo está sentado en la silla frente al escritorio, visto en tres cuartos con el rostro visible, y escribe con calma en el teclado de la laptop; el brillo azul de las pantallas ilumina su rostro. A mitad del clip levanta la vista hacia el monitor con expresión serena y atenta; mantiene la boca cerrada y no habla. Cámara lenta, empuje de cámara muy suave hacia Mateo. Las luces de la ciudad titilan levemente al fondo. Iluminación solo de luz azul LED y el resplandor de las pantallas, sin velas. Sonido ambiente muy suave de teclas y zumbido lejano de la ciudad. Sin diálogo, sin música, sin texto legible, grano de película sutil.

**Resultado:** Clip de apertura: Mateo en su escritorio de noche, con luz azul de LED.
**Observaciones:** Referencias: imagen del escritorio (generada en Gemini) y hoja de personaje. Mateo mantiene la boca cerrada porque la voz es la narración generada aparte.

### V-07 · 2026-10-25 · Google Vids · Clip del aula y el ferrocarril
**Prompt (textual):**
> Video fotorrealista, cine realista, fotografía cinematográfica, cámara lenta. Dos escenas con un corte directo entre ellas, sin mezclar los escenarios.
>
> Escena 1 (primeros 4 segundos): aula rural de adobe en un valle de montaña, ventanas abiertas con el sol del atardecer, pupitres de madera con libros abiertos, pizarrón con gis y un globo terráqueo. No hay nadie en el aula. La cámara avanza muy despacio entre los pupitres hacia el pizarrón, mientras la luz cálida del atardecer entra por las ventanas y se ven partículas de polvo flotando en los rayos de luz.
>
> Corte directo a la escena 2 (últimos 3 segundos): locomotora diésel-eléctrica de nariz redondeada, roja y amarilla, con un tren de pasajeros detrás, junto a un taller ferroviario de ladrillo en un valle montañoso con bruma matutina. No es una locomotora de vapor y no sale humo de vapor de la locomotora; solo una ligera bruma al fondo. Tres mecánicos con overol azul trabajan cerca de la locomotora, vistos de lejos o de espaldas, sin rostros claros. La cámara se desplaza lentamente en paralelo a la locomotora.
>
> Luz cálida dorada, paleta ámbar, grano de película sutil. Sonido ambiente: viento suave y pájaros lejanos en el aula; motor diésel al ralentí y golpes metálicos lejanos en el taller. Sin diálogo, nadie habla, sin música, sin texto legible, sin logotipos.

**Resultado:** Un solo clip de 7 s que une el aula (los tres abuelos maestros) y el ferrocarril (Antonio) con un corte directo.
**Observaciones:** Los escenarios se describen en el texto del prompt. La imagen de referencia del ferrocarril mostraba humo, por lo que el prompt aclara que la locomotora no es de vapor.

### V-08 · 2026-10-25 · Google Vids · Clip del aula con el libro
**Prompt (textual):**
> Video fotorrealista, cine realista, fotografía cinematográfica, cámara lenta. Interior de un aula rural de adobe al atardecer, con ventanas abiertas hacia un valle de montaña, luz cálida dorada y partículas de polvo flotando en los rayos de luz. Primer plano de unas manos que entregan un libro abierto a otras manos que lo reciben; las páginas se mueven suavemente. La cámara se desplaza muy despacio hacia un lado y revela al fondo, desenfocadas y de espaldas, a varias personas sentadas en círculo. Sin rostros claros. Paleta ámbar, grano de película sutil. Sonido ambiente muy suave: páginas que pasan, madera que cruje, viento lejano. Sin diálogo, nadie habla, sin música, sin texto legible, sin logotipos.

**Resultado:** Clip de unos 4 s del aula, con unas manos que entregan un libro a otras, para la frase sobre compartir el saber.
**Observaciones:** Se simplificó a una sola acción y un solo movimiento de cámara para ajustarse a 4 s; la versión inicial incluía el libro pasando por varias manos y la cámara rodeando el círculo.

### V-09 · 2026-10-25 · Google Vids · Clip de la vocación (código abierto)
**Prompt (textual):**
> Video fotorrealista, cine realista, fotografía cinematográfica de una persona real, cámara lenta. Usa la imagen de referencia solo para el rostro, el cabello y la ropa de Mateo (joven de cabello negro corto con flequillo, sudadera azul marino); no reproduzcas la cuadrícula ni el fondo gris. Escena de día en un espacio comunitario luminoso, con una mesa larga de madera, laptops y luz natural cálida entrando por grandes ventanales. Mateo, visto en tres cuartos, sentado a la mesa, gira su laptop hacia unas personas a su lado, que se inclinan para ver la pantalla; ellas aparecen de espaldas o desenfocadas, sin rostros claros. En la pantalla se ve una interfaz web sencilla, sin texto legible. Mateo señala algo en la pantalla con calma, con la boca cerrada, sin hablar. La cámara avanza despacio hacia el grupo. Luz de día cálida, paleta ámbar y dorada, grano de película sutil. Sonido ambiente muy suave: teclas lejanas y un ambiente tranquilo. Sin diálogo, nadie habla, sin música, sin texto legible, sin logotipos.

**Resultado:** Clip de unos 5 s de Mateo compartiendo su laptop con otras personas, para la frase sobre su vocación y el código abierto.
**Observaciones:** Escena rediseñada (de día, en un espacio comunitario) para no repetir el clip del escritorio. Es una invención visual; el dataset solo dice que Mateo es divulgador de tecnología libre y desarrolla herramientas de código abierto. Referencia: hoja de personaje.

### V-10 · 2026-10-25 · Google Vids · Clip de la ofrenda (parte 1)
**Prompt (textual):**
> Video fotorrealista, cine realista, fotografía cinematográfica de una persona real, cámara lenta, noche de Día de Muertos. Usa la imagen del altar como escenario exacto: ofrenda en la sala de una casa, con exactamente cuatro retratos enmarcados de personas mayores, colocados en una sola fila a la altura de la mesa de la ofrenda; no hay ningún otro retrato, marco ni cuadro en la parte alta del altar ni en la pared. La parte superior solo tiene guirnaldas de flores de cempasúchil y papel picado. Sobre la mesa hay pan de muerto, calaveritas de azúcar y velas blancas ya encendidas. El plano se mantiene a la altura de la mesa y de los cuatro retratos; la parte alta del altar queda casi fuera de cuadro. Usa la hoja de personaje para el cabello y la ropa de Mateo (joven de cabello negro corto con flequillo, sudadera azul marino); no reproduzcas la cuadrícula ni el fondo gris.
>
> Mateo, visto de perfil y parcialmente de espaldas, se acerca despacio al altar sosteniendo con ambas manos una vela blanca que ya está encendida, protegiendo la llama con una mano; la llama ilumina sus manos y su perfil. No hay cerillos, encendedores ni otros objetos en sus manos, y no enciende ninguna otra vela. Hacia el segundo 2.5 coloca con cuidado la vela encendida sobre la mesa de la ofrenda, junto a las demás, frente a los retratos, y retira las manos vacías. En los últimos segundos se queda quieto frente al altar, con la cabeza ligeramente inclinada, mirando los retratos. La cámara se acerca muy despacio y al final queda casi inmóvil.
>
> Luz cálida de velas que ilumina los marcos y los pétalos de cempasúchil, paleta ámbar y violeta profundo, grano de película sutil. Sonido ambiente muy suave: el parpadeo de las flamas. Sin diálogo, sin texto legible, sin logotipos.

**Resultado:** Clip de unos 5 s de Mateo colocando una vela encendida en la ofrenda, frente a los retratos de sus abuelos.
**Observaciones:** Es la versión corregida del prompt: en la primera versión Mateo «encendía» una vela que ya estaba encendida y el cerillo desaparecía de su mano, por lo que se eliminó la acción de encender. Referencias: imagen del altar y hoja de personaje.

### V-11 · 2026-10-25 · Google Vids · Clip de la ofrenda (parte 2)
**Prompt (textual):**
> Video fotorrealista, cine realista, fotografía cinematográfica de una persona real, cámara lenta, noche. Usa la imagen de referencia solo para el rostro, el cabello y la ropa de Mateo (joven de cabello negro corto con flequillo, sudadera azul marino); no reproduzcas la cuadrícula ni el fondo gris. Primer plano cerrado del rostro de Mateo, de frente o en tres cuartos, con la mirada dirigida ligeramente hacia abajo y hacia la cámara, como si mirara un altar que está justo delante de él, fuera de cuadro. No se ve ningún altar, vela, flor ni retrato en la imagen: el fondo es la sala de una casa a oscuras, muy desenfocada, con sombras cálidas. Su rostro está iluminado únicamente por una luz cálida y parpadeante de velas que viene de frente y desde abajo, fuera de cuadro. Tiene una sonrisa muy tenue y los ojos vidriosos, y una sola lágrima brillante rueda lentamente por su mejilla. Boca casi cerrada, no habla. La cámara se acerca muy despacio y al final queda casi inmóvil. Paleta ámbar y violeta profundo, grano de película sutil. Audio: solo el crepitar leve de las llamas. Sin diálogo, sin texto legible.

**Resultado:** Segunda parte del clip final: primer plano del rostro de Mateo con una sonrisa tenue y una lágrima, para el cierre de la narración.
**Observaciones:** Se generó aparte de la parte 1 porque, en la versión de un solo clip, el altar aparecía junto a Mateo cuando debía estar frente a él y fuera de cuadro en el primer plano; esa versión también generó música no deseada al final. La sonrisa y la lágrima son una decisión visual del autor para acompañar la voz quebrada.

