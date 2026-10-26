# Memoria del proyecto

El agente actualiza este archivo al cerrar cada fase y cada vez que el usuario corrige o aclara algo. Las secciones de **Correcciones y aclaraciones** y **Decisiones** solo se amplían, no se reescriben.

## Estado actual

- **Fase actual:** Fase 4 (Cierre) completada exitosamente. Dashboard 100% finalizado, auditado y documentado.
- **Última actualización:** 2026-10-25
- **Entrega límite del concurso:** 2026-10-26, 23:59 hrs
- **Siguiente paso:** el usuario publica el repositorio en GitHub Pages y procede con el Componente B (video de 30 s con IA y video explicativo de 3 min).

## Plan (Aprobado con ajustes)

### 1. Auditoría de datos (`tests/validate_data.py`)
- Script automatizado que valida: 57 personas, 200 relaciones (108 HERMANO_DE, 34 CONYUGE_DE, 29 PADRE_DE, 29 MADRE_DE), 14 fallecidos oficiales (43 vivos), distribución 24 (Gen 2) / 19 (Gen 1) / 14 (Gen 0), reciprocidad conyugal, consistencia temporal (padres mayores que hijos) y existencia de Ego (P044).
- **Resultado de la validación (2026-10-23):** Todas las pruebas pasaron exitosamente.
  - Fallecidos por generación: Gen 2 = 12/24, Gen 1 = 1/19, Gen 0 = 1/14.
  - Años vividos promedio global (14 difuntos): 73.1 años.
  - Años vividos promedio por generación: Gen 2 = 79.4
   años | Gen 1 = 48.0 años (P037) | Gen 0 = 22.0 años (P053).

### 2. Estructuras derivadas (`js/data-engine.js`)
- Unidades familiares: 12 parejas en Gen 2; 5 parejas y 9 solteros en Gen 1; 14 descendientes (solteros) en Gen 0.
- Índices de parentesco directo: padres, cónyuge, hijos, hermanos.
- Algoritmo de linaje: cálculo recursivo de ancestros y descendientes.
- Cálculo dinámico de parentesco: se calcula mediante recorrido del grafo sobre `id_padre`, `id_madre` e `id_conyuge` relativo a Ego (P044), dado que el sufijo numérico de `rol_en_arbol` no es por padre. El campo `rol_en_arbol` se preserva exclusivamente como código visible en la UI/ficha.
- Métricas demográficas (ajuste 3): fallecidos por generación y años vividos promedio (global y por generación).

### 3. Diseño del Layout por Generaciones (`js/tree-layout.js`)
- Estructura vertical de ofrenda de 3 niveles: Gen 2 arriba (Y≈150px, 24 velas), Gen 1 centro (Y≈450px, 19 velas), Gen 0 abajo (Y≈750px, 14 velas).
- Agrupación por familias de origen con distribución holgada horizontal.
- Conexiones SVG: guirnaldas de cempasúchil punteadas para matrimonios; curvas Bézier en violeta tenue para filiación desde el centro de la pareja a los hijos.
- Resaltado de linaje en cempasúchil brillante y atenuación al 25% del resto.
- Navegación con paneo, zoom suave y saltos rápidos por generación.

### 4. Tabla de Parentesco de las 57 Personas (Revisión Ajuste 2 y Corrección P038–P043)

| ID | Gen | Nombre completo | `rol_en_arbol` | Parentesco en español (con Ego P044) |
|---|:---:|---|---|---|
| P001 | 2 | Carlos Martínez Guerrero | `FF` | Abuelo paterno |
| P002 | 2 | Roberto Martínez Guerrero | `FFB1` | Tío abuelo paterno (hermano del abuelo Carlos) |
| P003 | 2 | Fernando Martínez Guerrero | `FFB2` | Tío abuelo paterno (hermano del abuelo Carlos) |
| P004 | 2 | Elena Martínez Guerrero | `FFZ1` | Tía abuela paterna (hermana del abuelo Carlos) |
| P005 | 2 | Carmen Vásquez Luna | `FM` | Abuela paterna |
| P006 | 2 | Martha Benítez Ortigoza | `FFB1-sp` | Tía abuela política paterna (esposa del tío abuelo Roberto) |
| P007 | 2 | Gonzalo Morales Paredes | `FFZ1-sp` | Tío abuelo político paterno (esposo de la tía abuela Elena) |
| P008 | 2 | Javier Vásquez Luna | `FMB1` | Tío abuelo paterno (hermano de la abuela Carmen) |
| P009 | 2 | Rosaura Ríos Calderón | `FMB1-sp` | Tía abuela política paterna (esposa del tío abuelo Javier) |
| P010 | 2 | Antonio Rojas Delgado | `MF` | Abuelo materno |
| P011 | 2 | Manuel Rojas Delgado | `MFB1` | Tío abuelo materno (hermano del abuelo Antonio) |
| P012 | 2 | Guillermo Rojas Delgado | `MFB2` | Tío abuelo materno (hermano del abuelo Antonio) |
| P013 | 2 | Teresa Rojas Delgado | `MFZ1` | Tía abuela materna (hermana del abuelo Antonio) |
| P014 | 2 | Lucía Rojas Delgado | `MFZ2` | Tía abuela materna (hermana del abuelo Antonio) |
| P015 | 2 | Guadalupe Soto Mendoza | `MM` | Abuela materna |
| P016 | 2 | Esperanza Fuentes Trejo | `MFB1-sp` | Tía abuela política materna (esposa del tío abuelo Manuel) |
| P017 | 2 | Arturo Bravo Peña | `MFZ1-sp` | Tío abuelo político materno (esposo de la tía abuela Teresa) |
| P018 | 2 | Esteban Cruz Méndez | `MFZ2-sp` | Tío abuelo político materno (esposo de la tía abuela Lucía) |
| P019 | 2 | Francisco Soto Mendoza | `MMB1` | Tío abuelo materno (hermano de la abuela Guadalupe) |
| P020 | 2 | Consuelo Soto Mendoza | `MMZ1` | Tía abuela materna (hermana de la abuela Guadalupe) |
| P021 | 2 | Alicia Ramírez Domínguez | `MMB1-sp` | Tía abuela política materna (esposa del tío abuelo Francisco) |
| P022 | 2 | Josefina Cordero Morales | `FFB2-sp` | Tía abuela política paterna (esposa del tío abuelo Fernando) |
| P023 | 2 | Sara Velasco Méndez | `MFB2-sp` | Tía abuela política materna (esposa del tío abuelo Guillermo) |
| P024 | 2 | Tomás Navarro Pacheco | `MMZ1-sp` | Tío abuelo político materno (esposo de la tía abuela Consuelo) |
| P025 | 1 | Alejandro Martínez Vásquez | `F` | Padre |
| P026 | 1 | Jorge Martínez Vásquez | `FB1` | Tío paterno (hermano del padre) |
| P027 | 1 | Patricia Martínez Vásquez | `FZ1` | Tía paterna (hermana del padre) |
| P028 | 1 | Claudia Orozco Peralta | `FB1-sp` | Tía política paterna (esposa del tío Jorge) |
| P029 | 1 | María Elena Rojas Soto | `M` | Madre |
| P030 | 1 | Ricardo Rojas Soto | `MB1` | Tío materno (hermano de la madre) |
| P031 | 1 | Gabriel Rojas Soto | `MB2` | Tío materno (hermano de la madre) |
| P032 | 1 | Héctor Rojas Soto | `MB3` | Tío materno (hermano de la madre) |
| P033 | 1 | Beatriz Rojas Soto | `MZ1` | Tía materna (hermana de la madre) |
| P034 | 1 | Adriana Rojas Soto | `MZ2` | Tía materna (hermana de la madre) |
| P035 | 1 | Verónica Castro Alarcón | `MB1-sp` | Tía política materna (esposa del tío Ricardo) |
| P036 | 1 | Lorena Salgado Vega | `MB2-sp` | Tía política materna (esposa del tío Gabriel) |
| P037 | 1 | Mauricio Domínguez Lara | `MZ1-sp` | Tío político materno (esposo de la tía Beatriz) |
| P038 | 1 | Esteban Martínez Cordero | `FFB2S` | Tío segundo paterno (primo hermano de tu padre, hijo del tío abuelo Fernando) |
| P039 | 1 | Mariana Martínez Cordero | `FFB2D` | Tía segunda paterna (prima hermana de tu padre, hija del tío abuelo Fernando) |
| P040 | 1 | Alfonso Rojas Velasco | `MFB2S` | Tío segundo materno (primo hermano de tu madre, hijo del tío abuelo Guillermo) |
| P041 | 1 | Lucía Rojas Velasco | `MFB2D` | Tía segunda materna (prima hermana de tu madre, hija del tío abuelo Guillermo) |
| P042 | 1 | Guillermo Navarro Soto | `MMZ1S` | Tío segundo materno (primo hermano de tu madre, hijo de la tía abuela Consuelo) |
| P043 | 1 | Gabriela Navarro Soto | `MMZ1D` | Tía segunda materna (prima hermana de tu madre, hija de la tía abuela Consuelo) |
| P044 | 0 | Sofía Martínez Rojas | `Ego` | Ego (Sujeto de referencia) |
| P045 | 0 | Mateo Martínez Rojas | `B` | Hermano |
| P046 | 0 | Camila Martínez Rojas | `Z` | Hermana |
| P047 | 0 | Diego Martínez Orozco | `FBS1` | Primo hermano paterno (hijo del tío Jorge) |
| P048 | 0 | Valeria Martínez Orozco | `FBD1` | Prima hermana paterna (hija del tío Jorge) |
| P049 | 0 | Emilio Martínez Orozco | `FBS2` | Primo hermano paterno (hijo del tío Jorge) |
| P050 | 0 | Daniel Rojas Castro | `MBS1` | Primo hermano materno (hijo del tío Ricardo) |
| P051 | 0 | Daniela Rojas Castro | `MBD1` | Prima hermana materna (hija del tío Ricardo) |
| P052 | 0 | Andrés Rojas Castro | `MBS2` | Primo hermano materno (hijo del tío Ricardo) |
| P053 | 0 | Rodrigo Rojas Salgado | `MBS3` | Primo hermano materno (hijo del tío Gabriel) |
| P054 | 0 | Natalia Rojas Salgado | `MBD2` | Prima hermana materna (hija del tío Gabriel) |
| P055 | 0 | Santiago Rojas Salgado | `MBS4` | Primo hermano materno (hijo del tío Gabriel) |
| P056 | 0 | Julián Domínguez Rojas | `MZS1` | Primo hermano materno (hijo de la tía Beatriz) |
| P057 | 0 | Mariana Domínguez Rojas | `MZD1` | Prima hermana materna (hija de la tía Beatriz) |

### 5. Mapeo de Requisitos (R1-R9)
- **R1 (Navegación 2, 1, 0):** `index.html`, `js/tree-layout.js`, `css/styles.css` -> **Fase 1**
- **R2 (Parentescos y ficha):** `js/tree-layout.js`, `js/data-engine.js`, `index.html`, `css/styles.css` -> **Fase 1**
- **R3 (Fallecidos, halos, trayectorias, ritual):** `js/data-engine.js`, `js/app.js`, `css/styles.css` -> **Fase 2** (la trayectoria ya se adelanta en la ficha en Fase 1)
- **R4 (Linajes, hover, búsqueda, filtros, accesibilidad):** `js/app.js`, `index.html`, `css/styles.css` -> **Fase 2**
- **R5 (Apego a data.json, información médica textual):** `js/data-engine.js`, `tests/validate_data.py` -> **Fases 0–4**
- **R6 (GitHub Pages y README):** `README.md`, repo -> **Fase 4**
- **R7 (Hallazgos clave calculados, vista 1920×1080):** `js/data-engine.js`, `index.html`, `css/styles.css` -> **Fase 3 (Opcional / primer recorte)**
- **R8 (Registro de prompts):** `docs/PROMPTS.md` -> **Transversal**
- **R9 (Página estática sin backend, arte original SVG/CSS):** Todo el código -> **Fases 0–4**

### 6. Fases de ejecución
- **Fase 0 (Completada):** Auditoría de datos con `tests/validate_data.py`, derivación de estructuras, layout por generaciones, tabla de 57 parentescos y plan aprobado con ajustes.
- **Fase 1 (Obligatoria):** Árbol por niveles con velas SVG, guirnaldas y filiación, leyenda fija y **ficha de la persona completa con trayectoria y diseño responsivo** (panel lateral en laptop / cajón inferior 'bottom-sheet' en móvil) (Ajuste 1). (TERMINADA Y APROBADA).
- **Fase 2 (Obligatoria):** Linajes (ancestros/descendientes con atenuación al 25%), filtros combinados (estado, ciudad, profesión), búsqueda por nombre y ritual de encendido de difuntos. (TERMINADA Y APROBADA).
- **Mini-fase Ambientación (Completada):** Decoración nocturna de ofrenda de Día de Muertos (fondo con arcos y flores, márgenes dinámicos en `fitToBox` respetando arcos laterales ~9% y franja inferior ~13%, repisas de altar SVG bajo cada nivel con papel picado y cempasúchil, degradado radial de contraste, glassmorphism en controles y ambiente sutil de estrellas y humo CSS). Ubicada entre la Fase 2 y la Fase 4.
- **Fase 3 reducida (Completada):** Panel "Resumen" flotante con cifras demográficas calculadas en tiempo real desde `data.json`: total=57 personas, 43 vivos, 14 fallecidos; promedio global 73.1 años; desglose Gen2=12/24, Gen1=1/19 (Mauricio vivió 48 años), Gen0=1/14 (Rodrigo vivió 22 años). Botón "Resumen" estilo vidrio en barra superior. Panel flotante en esquina inferior derecha (laptop, máx 340 px) y cajón inferior en móvil (máx 45% pantalla); glassmorphism; accesible con `aria-expanded`, `aria-label` y foco visible; cierra con ✕ y Esc; no interfiere con árbol, filtros ni ficha.
- **Fase 4 (Cierre):** Pulido responsivo, accesibilidad (`prefers-reduced-motion`, navegación por teclado), `README.md`, publicación en GitHub Pages y verificación contra checklist.

## Checklist de requisitos

- [x] R1 Navegar por las generaciones 2, 1 y 0 (Niveles en la ofrenda con botones de salto generacional, zoom y paneo interactivo)
- [x] R2 Identificar parentescos (Líneas de filiación, guirnaldas de cónyuge, ficha con parentescos calculados dinámicamente y enlaces a familiares)
- [x] R3 Filtrar o resaltar fallecidos y sus trayectorias (Ritual de encendido con llama violeta, halo espectral de 14 difuntos, filtro de estado y trayectoria completa en ficha)
- [x] R4 Usabilidad y claridad de linajes (Resaltado de ancestros/descendientes con atenuación al 25%, buscador por nombre en vivo, filtros combinados y tooltips accesibles)
- [x] R5 Apego al dataset (Carga exclusiva desde `data/data.json`, textos médicos textuales, datos sin inventar)
- [x] R6 Enlace público (GitHub Pages) y README (`README.md` completo e instrucciones de publicación sin autenticación)
- [x] R7 Apto para el video (Panel *"Resumen"* con hallazgos clave calculados en vivo, vista optimizada a 1920×1080)
- [x] R8 `docs/PROMPTS.md` al día (Registro cronológico y textual completo listo para entregar)
- [x] R9 Restricciones respetadas (Web estática HTML/CSS/JS/SVG sin backend ni dependencias externas pesadas, arte original)

## Decisiones tomadas

- 2026-10-23: página estática (HTML, CSS, JS y SVG) con layout propio por generaciones, publicada en GitHub Pages.
- 2026-10-23: el árbol se presenta como una ofrenda nocturna con una vela por persona; llama encendida = vive, vela apagada con halo violeta = falleció; estética neón cálida con la paleta de `docs/DISENO.md`.
- 2026-10-23: los datos se consumen solo desde `data/data.json`; el árbol se construye con `id_padre`, `id_madre` e `id_conyuge`.
- 2026-10-23: la ficha de la persona se construye desde la Fase 1 con la trayectoria completa y con diseño responsivo (panel lateral en desktop/laptop y cajón inferior deslizante 'bottom-sheet' en móviles).
- 2026-10-23: las métricas demográficas oficiales se ajustan a: "fallecidos por generación" y "años vividos promedio" (global y por generación).
- 2026-10-23: la Fase 3 ("Hallazgos clave") se declara opcional y se recortará primero si el tiempo previo a la entrega resulta ajustado.
- 2026-10-24: el layout de 3 niveles se organiza con Ego (P044 Sofía) y sus padres en el eje central (X ≈ 1450 - 1600), la rama paterna a la izquierda y la rama materna a la derecha, logrando simetría y eliminando cruces en las curvas Bézier de filiación.
- 2026-10-24: Actualización sobre códigos técnicos: se actualiza la decisión del 2026-10-23 ("el código se preserva como visible"); `rol_en_arbol` (ej. [MZD1]) e IDs técnicos (ej. P057) quedan completamente ocultos en la interfaz y en la ficha para mayor claridad y elegancia hacia el usuario, mostrando únicamente el parentesco en español natural.
- 2026-10-24: Corrección 3 de la Fase 1: se elimina la etiqueta "(calculado)" de las edades y años vividos en la ficha y en los tooltips; se muestran como años cumplidos calculados a partir de las fechas (ej. "80 años vividos" o "19 años"). Se actualizaron la regla 5 de `AGENTS.md` y la nota de la ficha en `docs/DISENO.md`.
- 2026-10-24: Arquitectura de la Fase 2: el resaltado de linaje, los filtros combinados y el foco generacional comparten una arquitectura unificada de atributos en el contenedor (`data-foco-linaje`, `data-foco-filtro`, `data-foco-gen`) con atenuación selectiva en CSS (~20-25%) y transiciones fluidas de 250 ms a 60 FPS.
- 2026-10-24: Mini-fase "Ambientación" incorporada al plan: se sitúa después de la Fase 2 y antes de la Fase 4 para dar carácter visual de ofrenda nocturna de Día de Muertos sin tocar datos, layout, filtros ni ficha. Define fondo fijo de ofrenda con zona libre (~9% lateral y ~13% inferior más leyenda calculados dinámicamente en `fitToBox`), repisas de altar SVG bajo cada generación (`altar-shelves-layer`) con papel picado y flores de cempasúchil, degradado radial oscuro para contraste WCAG AA, glassmorphism en controles y ambiente sutil de estrellas y humo en CSS con pausa en navegación y respeto a `prefers-reduced-motion`.

## Correcciones y aclaraciones

- 2026-10-23: la hoja `readme` del Excel original tiene errores (por ejemplo, dice que P003, P012, P020, P024, P029 y P031 son solteros y todos tienen cónyuge). Se ignora; se confía en las columnas.
- 2026-10-23: los ejemplos de la hoja `diccionario` para `relaciones` no son fiables (listan a Sofía como P035, y ella es P044).
- 2026-10-23: la causa de muerte no es una columna; está dentro de `informacion_medica` y solo P007, P010, P037 y P053 la marcan explícitamente.
- 2026-10-23: se tabuló y normalizó el parentesco en español relativo a Ego (P044) para las 57 personas antes de codificar la página, garantizando concordancia antropológica y lenguaje natural.
- 2026-10-23: para P038 a P043, se reemplazó la etiqueta "primo segundo" por "tío segundo" o "tía segunda" (paterno o materno según la rama), mostrando en la ficha el detalle aclaratorio entre paréntesis (ej. "primo hermano de tu padre"). El parentesco se calcula recorriendo el grafo (`id_padre`, `id_madre`, `id_conyuge`), dado que el sufijo numérico de `rol_en_arbol` no es por padre; `rol_en_arbol` se preserva solo como código visible.
- 2026-10-24: Correcciones de la Fase 1 aplicadas tras revisión: (1) Encuadre "Ver todo" calculado dinámicamente con `getBBox()` del grupo del árbol más margen de seguridad, centrado simétricamente en horizontal y vertical sin cortes; (2) Botones de generación con animación suave (~400 ms) y encuadre horizontal holgado para que ninguna vela de los extremos quede cortada; (3) Navegación fluida con cursor de mano (`grab`/`grabbing`), zoom suave de rueda con pasos pequeños centrado en el cursor, doble clic para acercar, límites perimetrales para no perder el árbol de vista y suspensión temporal de filtros/animaciones (`.is-navigating`) a 60 FPS con `requestAnimationFrame`; (4) Mayor separación vertical entre niveles (Y = 200, 620, 1040) y escala ampliada de velas (38×58px) y nombres (14px negrita con sombra) para llenar la pantalla a 1920×1080 sin necesidad de acercar; (5) Ficha con parentescos sexo-dependientes "Hijo" o "Hija" (eliminado "Hijo/a") y fechas en formato largo en español ("8 de junio de 2007"), preservando intactos los datos de ciudades; (6) Halo violeta reforzado de doble anillo con resplandor etéreo para que los 14 difuntos se distingan a simple vista en la vista panorámica completa.
- 2026-10-24: Corrección 2 de la Fase 1 (Cambio de enfoque: ya no se hace zoom por generación):
  1. "Ver todo" y botón de restablecer (↺): función única `fitToBox` que calcula el bounding box real del árbol (`getBBox()`, en coordenadas del SVG) y el tamaño real del contenedor visible (`clientWidth` y `clientHeight`, descontando leyenda permanente y margen superior). El árbol se muestra ocupando ~90% del ancho útil, centrado simétricamente en horizontal y vertical. Se ejecuta al cargar, tras `document.fonts.ready` y en eventos de redimensionamiento de ventana (`resize`). Causa de que saliera pequeño y cortado: el SVG tenía un atributo fijo `viewBox="0 0 3950 1350"` que causaba un doble reescalamiento conflictivo con el `transform` dinámico de pantalla; al retirar el `viewBox` estático, el lienzo SVG se comporta como un espacio 1:1 con los píxeles de pantalla y `fitToBox` calcula la escala y traslación con exactitud matemática.
  2. Botones de generación ("Gen 2", "Gen 1", "Gen 0"): ya NO mueven ni acercan la vista. Al pulsar una generación, sus velas y nombres permanecen al 100% con los nombres un 25% más grandes y brillo suave, mientras que todo lo demás baja al ~30% de opacidad. Las líneas con generaciones vecinas se mantienen visibles (~40%). Transición suave de 250 ms. Volver a presionar el botón activo o "Ver todo" quita el resaltado. Implementado con el atributo `data-foco-gen` en el contenedor para reutilizarlo en la Fase 2 con linajes y filtros.
  3. Legibilidad y separación a 1920×1080: nombres bajo las velas ampliados a 26px SVG (~12px en pantalla completa, superando el mínimo de 11px). Altura de nombres alternada (Y = 58px y 82px) y separación entre cónyuges ampliada a 116px (`COUPLE_HALF_GAP = 58`) para evitar cualquier solapamiento. Velas ampliadas a 44×68px y separación entre niveles ampliada (Y = 220, 720, 1220) para llenar la pantalla.
  4. Títulos de nivel: reemplazados por "Abuelos y tíos abuelos", "Padres y tíos" y "Tu generación y primos" (sin números romanos, paréntesis ni cantidades). Tipografía `Playfair Display` en 32px (~14.7px en pantalla, superando el mínimo de 13px) en tono ámbar dorado (`#FFE082`) con excelente contraste y sin competir con las velas.
  5. Ficha: códigos técnicos (`rol_en_arbol` como [MZD1] e IDs como P057) eliminados de la interfaz visible, preservando únicamente el parentesco en español natural ("Hijo" o "Hija" por sexo) y fechas en formato largo español ("8 de junio de 2007") manteniendo intactas las ciudades.
  6. Navegación, arrastre, rueda de zoom, halo violeta, ficha y leyenda permanente conservados íntegramente. No se agregaron funciones de Fase 2.
- 2026-10-24: Corrección 3 de la Fase 1: remoción de la etiqueta "(calculado)" de las edades y años vividos en la ficha y tooltips para mayor naturalidad ("80 años vividos" o "19 años"). Se calculan como años cumplidos a partir de las fechas de `data.json`. La Fase 1 queda formalmente terminada y aprobada.
- 2026-10-24: Ejecución de la Fase 2 (Aprobada y completada sin romper la Fase 1):
  1. Resaltado de linaje recursivo: cálculo dinámico de ancestros y descendientes de la persona seleccionada; líneas de filiación y pareja pertenecientes a la rama se encienden en cempasúchil brillante (`#FFB300`) y el resto se atenúa al ~25%. Botón de activación en barra superior y en la ficha.
  2. Filtros combinados: selectores dinámicos por estado (todos/vivos/difuntos), ciudad (origen y residencia) y profesión, con contador de personas coincidentes en vivo (ej. "57 / 57") y botón de limpieza inmediata.
  3. Búsqueda por nombre: campo de búsqueda en vivo con dropdown de autocompletado y selección que centra suavemente la cámara en la vela elegida.
  4. Tooltip al pasar el cursor o hacer foco con teclado: tarjeta flotante con nombre completo, parentesco antropológico con Ego y fechas con años cumplidos.
  5. Ritual de encendido de difuntos: al hacer clic sobre una vela apagada (fallecido), cobra vida con una llama violeta espectral pulsante durante ~2.2 s antes de volver a descansar en paz, abriendo su ficha biográfica completa con trayectoria vital intacta.
- 2026-10-24: Mini-fase "Ambientación" ejecutada y completada:
  1. Fondo: soporte de `assets/fondo-ofrenda.*` fijo detrás del árbol (`background-size: cover; background-position: center bottom; background-attachment: fixed;`), con respaldo decorativo en CSS puro.
  2. Zona libre en `fitToBox`: cálculo dinámico basado en las dimensiones reales del viewport, respetando márgenes laterales del ~9% (arcos) y margen inferior del ~13% (flores y calaveras de azúcar) más despeje de la leyenda y filtros.
  3. Legibilidad y efecto vidrio: capa de degradado radial oscuro para contraste WCAG AA; `backdrop-filter: blur(...)` en encabezado, barra de filtros y leyenda; cenefa superior de papel picado adelgazada para evitar colisión visual.
  4. Repisas de altar SVG (`altar-shelves-layer`): renderizadas dentro del grupo del árbol bajo cada nivel generacional (Gen 2, 1, 0) con anchura calculada del bounding box de los nodos de la fila, tablón con textura púrpura, flores de cempasúchil discretas en el borde superior y festón de papel picado frontal. Las velas y etiquetas quedan encima y totalmente legibles.
  5. Ambiente sutil: estrellas con parpadeo suave y un par de hilos de humo violeta y cian en las esquinas inferiores con CSS puro, pausados durante la navegación (`.is-navigating`) y desactivados con `prefers-reduced-motion`.
  6. Capas decorativas con `pointer-events: none` y fluidez a 60 FPS garantizada.

## Correcciones y aclaraciones (Mini-fase Ambientación)

- 2026-10-24: **Fix de ruta de imagen de fondo.** El archivo existía en la raíz como `assetsfondo-ofrenda.jpg` (sin barra). El CSS buscaba `../assets/fondo-ofrenda.jpg` (ruta correcta pero directorio inexistente). Se creó `assets/` y se optimizó el archivo con Pillow quality=82 (132 KB, dentro del límite de 500 KB) guardándolo como `assets/fondo-ofrenda.jpg`. No se modificó ninguna ruta del CSS.
- 2026-10-24: **Corrección de la Ambientación (P-010):**
  1. **Visibilidad clara del fondo `assets/fondo-ofrenda.jpg`:** se colocó el fondo fijo en `#app` con `background-size: cover; background-position: center bottom; background-repeat: no-repeat; background-attachment: fixed;` y contenedor del viewport transparente (`background: transparent`), eliminando la pila de gradientes densos que opacaban la imagen.
  2. **Degradado radial suave centralizado:** `.viewport-radial-overlay` se ajustó a `radial-gradient(ellipse 65% 55% at 50% 48%, rgba(13, 7, 26, 0.35) 0%, rgba(13, 7, 26, 0.18) 50%, rgba(13, 7, 26, 0.02) 80%, transparent 100%)`. Oscurece de forma muy suave (~35% máx) solo el área central donde habitan las velas, dejando los bordes exteriores al 0% (transparentes) para exhibir en todo su esplendor la luna, los arcos neón, el papel picado superior, las flores y las calaveras inferiores.
  3. **Contraste AA/AAA en nombres:** asegurado mediante contorno y sombra profunda en `.candle-label` (`paint-order: stroke fill; stroke: rgba(10, 5, 22, 0.95); stroke-width: 4px; text-shadow: 0 2px 6px rgba(0, 0, 0, 0.95), 0 0 12px rgba(0, 0, 0, 0.9); fill: #FFFFFF;`), garantizando lectura nítida sobre cualquier zona sin necesidad de oscurecer el lienzo general.
  4. **Retiro total de repisas de altar:** se eliminaron por completo `altar-shelves-layer`, sus definiciones SVG (`#shelf-shadow`, `#shelf-wood-grad`), el código de dibujado en `js/app.js` y todos los selectores CSS asociados (`.altar-shelf`, `.shelf-wood`, `.shelf-papel-picado`). Las velas flotan limpiamente sobre la ofrenda. Se conservaron los títulos de nivel ("Abuelos y tíos abuelos", "Padres y tíos", "Tu generación y primos") y las líneas punteadas finas (`level-separator-line`) bajo ellos.
  5. **Efecto vidrio auténtico en encabezado y filtros:** `.site-header`, `.btn-group`, `.search-input` y `.filter-select` pasaron a fondos semitransparentes con `backdrop-filter: blur(12px) saturate(130%)`, revelando la continuidad del fondo nocturno por detrás.
  6. **Integridad:** no se alteraron datos, layout de árbol, lógica de filtros, ficha biográfica ni cálculo de encuadre (`fitToBox`). Verificado mediante renderizado con Edge headless y comparación de perfiles de color contra la ilustración original.
- 2026-10-24: **Ajuste menor de legibilidad (P-012, solo CSS):**
  1. **Refuerzo de `text-shadow` en etiquetas y títulos:** se aplicó un halo oscuro de 2 capas más contorno protector (`paint-order: stroke fill; stroke: rgba(10,5,25,.95); text-shadow: 0 0 4px/5px rgba(10, 5, 25, 0.95), 0 1px 3px #000000;`) tanto en las etiquetas de los nombres ([`.candle-label`](file:///C:/UPAEP/5to%20semestre/Concurso/css/styles.css)) como en los títulos de nivel ([`.level-banner-text`](file:///C:/UPAEP/5to%20semestre/Concurso/css/styles.css)), permitiendo una lectura inmediata y cómoda sobre las flores del fondo.
  2. **Degradado suave localizado en fila inferior:** se añadió en [`.viewport-radial-overlay`](file:///C:/UPAEP/5to%20semestre/Concurso/css/styles.css) un degradado elíptico suave posicionado en `50% 84%` (`radial-gradient(ellipse 72% 26% at 50% 84%, rgba(10, 5, 22, 0.48) 0%, rgba(10, 5, 22, 0.25) 45%, transparent 75%)`) que genera una almohadilla de contraste justo detrás de la generación 0 ("Tu generación y primos") sin tocar los arcos neón laterales ni oscurecer el resto del fondo. Layout, datos y filtros intactos.
- 2026-10-24: **Corrección de simetría en el linaje (P-013, Fase 2):**
  1. **Causa real identificada:** las aristas de filiación guardaban únicamente el primer ID de padre encontrado (`p.id_padre || p.id_madre`), evaluándose de forma asimétrica solo contra el padre (Antonio) y fallando cuando se seleccionaba a la madre (Guadalupe); adicionalmente, la pareja del sujeto seleccionado no se incluía en el conjunto de nodos iluminados ni se encendía su guirnalda.
  2. **Reglas de simetría aplicadas:**
     - El linaje calcula persona + ancestros + descendientes (por `id_padre` e `id_madre`).
     - Las líneas de filiación se encienden si el hijo está en el linaje Y al menos uno de sus progenitores (`father` o `mother`) está en el linaje, sin depender del progenitor ancla.
     - La pareja de la persona seleccionada se enciende también, junto con su guirnalda de cónyuge. Los cónyuges de ancestros y descendientes continúan atenuados.
  3. **Casos verificados:** comprobado con Antonio (P010), Guadalupe (P015), Sofía (P044), Gonzalo (P007, difunto) y Esteban (P038, soltero sin hijos). Antonio y Guadalupe arrojan exactamente los mismos 19 nodos activos, 17 líneas de filiación y 1 línea de pareja. Gonzalo y Elena arrojan exactamente el mismo resultado simétrico. Sofía y Esteban se comportan sin anomalías ni errores.

- 2026-10-24: **Mejora visual artesanal de las velas (P-015):**
  1. **Llama multicapa viva:** se modeló una llama de 3 capas superpuestas (exterior cempasúchil `url(#flame-outer-grad)`, media naranja viva `url(#flame-mid-grad)` y núcleo blanco-amarillo brillante `url(#flame-core-grad)`) con animación `@keyframes organicFlicker` ejecutada únicamente mediante `transform` y `opacity`, con duración y retardo desfasados orgánicamente a partir del ID de cada persona (1.8 s a 2.9 s) y resplandor cálido `drop-shadow` sutil que no compite con el fondo.
  2. **Cuerpo de cera artesanal:** forma única reutilizable (`#candle-artistic-body` en `<defs>` invocada mediante `<use>`) manteniendo el color base `--cera`, con degradado cilíndrico lateral para volumen, sombreado vertical inferior, 3 vetas sutiles en relieve, borde superior ondulado con 2 gotas de cera de longitud irregular, charco de cera en la base y pábilo oscuro de trazo natural. Idéntico en las 57 velas sin codificar datos en el cuerpo.
  3. **Velas de fallecidos:** sin llama viva; pábilo oscuro con brasa tenue roja en la punta (`.candle-ember`); halo espectral violeta reforzado, humo animado, ritual de encendido de difuntos y aro de selección cian conservados intactos.
  4. **Rendimiento y accesibilidad:** formas y degradados definidos una sola vez en `<defs>` y reutilizados sin duplicar nodos; animaciones pausadas durante paneo/zoom (`.is-navigating`) y anuladas con `prefers-reduced-motion`.
  5. **Verificación visual automatizada:** comprobado mediante script con Edge headless en: vista panorámica ("Ver todo"), zoom 3.4x sobre vela viva (P044 Sofía), zoom 3.4x sobre vela apagada (P007 Gonzalo) y filtro de difuntos activo (`tests/verify_*.png`).

- 2026-10-24: **Fondo animado sutil y ambientación alineada (P-018):**
  1. **Contenedor con proporción fija 1376×768 y anclaje cover centrado abajo:** capa `.bg-stage-frame` detrás del árbol y de la interfaz con `pointer-events: none` y `aria-hidden="true"`, asegurando que todos los efectos queden exactamente alineados con los elementos pictóricos de `assets/fondo-ofrenda.jpg` en cualquier resolución de pantalla (desktop, laptop y móvil).
  2. **Efectos CSS puros (únicamente `transform` y `opacity`):**
     - *Estrellas:* 10 puntos pequeños sobre estrellas visibles del firmamento, con parpadeo suave (`@keyframes starSoftTwinkle`) y retardos/duraciones desfasados (3.4 s a 5.2 s).
     - *Luna:* halo suave difuminado sobre la luna superior derecha con pulsación lenta a 7 s (`@keyframes moonGlowPulse`).
     - *Humo:* dos hilos translúcidos sobre cada copalero/incienso inferior que ascienden y se disipan en bucle (`@keyframes smokeRiseLeft` y `smokeRiseRight`); violeta en la esquina izquierda y cian tenue en la esquina derecha, exactamente como en la ilustración.
     - *Destellos:* 7 brillos cálidos pequeños sobre las velas borrosas del fondo con parpadeo desfasado.
     - *Pétalos:* 12 pétalos de cempasúchil (`var(--cempasuchil)`) que caen lentamente por los costados con opacidad baja (máx. 0.44 <= 0.5) y velocidades variables, confinados exclusivamente a los flancos laterales (izquierdo < 16%, derecho > 84%) para no invadir nunca la zona central donde se ubican las velas y nombres del árbol.
     - *Respiración:* zoom casi imperceptible del fondo y de la escena decorativa completa (100% a 103%, 30 s) con `@keyframes bgBreathing` y `transform-origin: center bottom`.
  3. **Rendimiento y accesibilidad:** pausa automática de animaciones al ocultarse la pestaña del navegador mediante `visibilitychange` (`.is-tab-hidden`) y durante arrastre/navegación rápida (`.is-navigating`); desactivación total y fondo estático bajo `prefers-reduced-motion`. Sin librerías externas.
  4. **Verificación visual y de datos:** verificado una sola vez mediante capturas automatizadas en Edge headless en vista panorámica "Ver todo" (1920×1080) y vista de celular (390×844) (`tests/verify_bg_fullscreen.png` y `tests/verify_bg_mobile.png`), comprobando total nitidez y legibilidad del árbol; validación con `validate_data.py` al 100%. Layout, velas, filtros, linaje, ficha y resumen conservados intactos.

- 2026-10-24: **Corrección del ícono de la luna en el encabezado (P-019):**
  1. **Sustitución de círculos superpuestos:** se eliminó la técnica previa de un círculo oscuro tapando a uno crema (`<circle fill="#FFE5A3">` y `<circle fill="#1A1033">`) que generaba un artefacto visual de dos círculos encimados sobre el fondo degradado y translúcido (`backdrop-filter`) del encabezado.
  2. **Luna creciente en forma única SVG (path):** se implementó un único `<path>` vectorial matemáticamente balanceado (`M 35 21.32 A 15 15 0 1 1 18.68 5 A 11.67 11.67 0 0 0 35 21.32 Z`), relleno con `var(--cera)` (`#F3E3C3`) y resplandor suave cálido `filter: drop-shadow(0 0 7px rgba(255, 235, 175, 0.65))` con `overflow: visible`.
  3. **Transparencia y nitidez:** al tener un recorte interior auténticamente transparente sin ningún relleno que opaque, el degradado nocturno y el efecto vidrio se aprecian limpios a cualquier nivel de zoom y sobre cualquier fondo. Verificado mediante captura en alta resolución con Edge headless (`tests/verify_moon_header.png`).

- 2026-10-24: **Aclaración del organizador del concurso y correcciones de referencia, ciudades y tradición (P-021):**
  1. **Descentralización de Ego / Sujeto de referencia:** tras la respuesta y aclaración del organizador del concurso (24-oct-2026), el dashboard no destaca a ninguna persona como referencia (ni Sofía/Ego) y presenta el árbol completo y sus relaciones de forma general. Se retiró la etiqueta "(Tú)" de la vela de P044 (mostrándose únicamente como "Sofía"); se eliminó la selección automática al cargar la página (ahora abre sin ninguna persona seleccionada ni aro cian); y se renombraron todos los niveles en títulos SVG, botones superiores de navegación y en el panel Resumen a "Generación 2", "Generación 1" y "Generación 0", quitando cualquier mención a "Tu generación" o "Tú".
  2. **Eliminación de la línea de parentesco en ficha y tooltip:** se suprimió por completo la línea de parentesco bajo el nombre en la ficha lateral (`.drawer-kinship`) y en el tooltip flotante, así como en los resultados del buscador y en el `aria-label` de cada vela. Dicha línea estaba redactada desde la perspectiva relativa de Ego ("primo", "tío", "sobrino"), mientras que los "Vínculos familiares directos" de la ficha ya cubren objetivamente los parentescos reales (padres, cónyuge, hijos, hermanos). El tooltip muestra exclusivamente el indicador de estado, nombre completo y fechas con años cumplidos o vividos calculados desde `data.json`.
  3. **Tabla de equivalencias de ciudades (decisión):** unificación canónica mediante `CITY_CANONICAL_MAP` para evitar opciones repetidas originadas por abreviaturas en `otras_ciudades_donde_vivio` (ej. "Puebla, Pue.", "CDMX", "Huajuapan, Oax."). El menú despliega 11 opciones canónicas ordenadas alfabéticamente sin conteos y con rótulo "Ciudad: Todas". Cada persona cuenta una sola vez por ciudad, con totales validados en `tests/validate_data.py` (Puebla 33, Oaxaca de Juárez 24, CDMX 14, Huajuapan de León 10, Veracruz 6, Querétaro 5, Xalapa 5, Tehuacán 3, Atlixco 3, La Paz 3, Pachuca 1).
  4. **Coherencia con la tradición de Día de Muertos en personas vivas:** se sustituyó "Presente en la ofrenda" por "Vive" en el bloque "Línea de tiempo" de la ficha para personas vivas, manteniendo "Fallecimiento" para los difuntos, en apego a la tradición donde la ofrenda honra la memoria de los difuntos. Se erradicó la frase de todo el código del proyecto.
  5. **Verificación:** validado con pruebas automatizadas que recién cargado no hay selección ni "(Tú)"; ficha y tooltip de vivos muestran "Estado: Vive", difuntos muestran años vividos, y Generación 2 carece de palabras relativas a Ego; el menú de ciudades opera con 11 opciones canónicas y conteos precisos; y `tests/validate_data.py` pasa al 100%.

- 2026-10-25: **Cierre de la Fase 4 (README, Accesibilidad y Preparación para GitHub Pages):**
  1. Se redactó un `README.md` exhaustivo y profesional que describe la semántica de la ofrenda, arquitectura técnica nativa (HTML/CSS/JS/SVG), mapeo detallado de requisitos R1–R9, instrucciones de ejecución local y guía paso a paso para el despliegue público en GitHub Pages sin login.
  2. Se auditaron todas las rutas relativas (`css/`, `js/`, `assets/`, `data/`) asegurando portabilidad directa en GitHub Pages.
  3. Se verificó el soporte integral de accesibilidad (atajos de teclado, foco visible en cian, cierre de cajones/modales con `Esc` y anulación estricta de animaciones con `prefers-reduced-motion`).
  4. Suite de pruebas `tests/validate_data.py` ejecutada y aprobada al 100%. Checklist R1–R9 completado en su totalidad.

## Problemas conocidos

(Ninguno por ahora.)

## Cómo ejecutar el proyecto

- **Validación de datos:** `python tests/validate_data.py`
- **Servidor local para desarrollo:** `python -m http.server 8000` (abrir en `http://localhost:8000`)
- **Publicación:** GitHub Pages (se configurará en Fase 4)
