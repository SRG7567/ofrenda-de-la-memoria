# Ofrenda de la Memoria · Dashboard Interactivo

[![Concurso](https://img.shields.io/badge/Concurso-De_los_Datos_a_la_Memoria-ff5722.svg)](https://aejm.github.io/diademuertos/)
[![Facultad](https://img.shields.io/badge/Facultad-Computación_y_Ciencia_de_Datos-7c4dff.svg)](#)
[![GitHub Pages](https://img.shields.io/badge/Deployment-GitHub_Pages-00e5ff.svg)](#)
[![Licencia](https://img.shields.io/badge/Licencia-Original_/_Sin_derechos_de_terceros-ffb300.svg)](#)

Tablero interactivo del árbol genealógico familiar presentado como una **ofrenda nocturna de Día de Muertos con una vela por persona**, desarrollado para el concurso académico *"De los Datos a la Memoria"* (Facultad de Computación y Ciencia de Datos).

El proyecto materializa el **Componente A** de la convocatoria, permitiendo explorar 57 vidas distribuidas en tres generaciones (24 abuelos y tíos abuelos, 19 padres y tíos, y 14 hijos y primos), honrando la memoria de los difuntos y celebrando la presencia de quienes siguen con nosotros.

---

## 🕯️ Metáfora visual y semántica de las velas

El árbol genealógico se representa como un altar tradicional nocturno escalonado:
- **Velas encendidas (Vivos):** 43 integrantes con llama viva artesanal de tres capas superpuestas (exterior cempasúchil, media naranja y núcleo blanco-amarillo cálido), dotadas de parpadeo orgánico individual asíncrono.
- **Velas apagadas con halo violeta (Difuntos):** 14 seres queridos que han trascendido; se distinguen a simple vista en la vista panorámica por un halo espectral violeta y una tenue brasa en el pábilo.
- **Ritual de encendido:** al seleccionar a un ser querido fallecido, su vela se enciende temporalmente con una llama violeta pulsante durante 2.2 segundos antes de disiparse suavemente, abriendo su ficha biográfica en señal de memoria y respeto.
- **Guirnaldas de cempasúchil y filiación:** las parejas conyugales se unen mediante guirnaldas doradas punteadas, mientras que los lazos de filiación (padres a hijos) fluyen en suaves curvas Bézier violetas.

---

## 🚀 Características y funcionalidades clave

1. **Navegación generacional fluida (Generaciones 2, 1 y 0):**
   - Lienzo panorámico optimizado para pantallas 1920×1080 centrado en el ~90% del ancho útil mediante `fitToBox()`.
   - Navegación táctil y con mouse (arrastre con inercia, zoom suave centrado en cursor, doble clic y atajos).
   - Botones generacionales (`Generación 2`, `Generación 1`, `Generación 0`): aplican un foco suave iluminando el nivel seleccionado y atenuando el resto sin desorientar la vista.
2. **Resaltado simétrico de linaje:**
   - Al pulsar *"Linaje"* sobre cualquier pariente, se iluminan exclusivamente sus ancestros directos, sus descendientes y su cónyuge, atenuando el resto al 25%. Funciona de forma 100% simétrica sin importar a qué miembro de una pareja se seleccione.
3. **Filtros combinados dinámicos en tiempo real:**
   - **Estado vital:** Todos, Solo vivos o Solo fallecidos.
   - **Ciudad canónica:** 11 ciudades normalizadas (*Puebla, Oaxaca de Juárez, CDMX, Huajuapan de León, Veracruz, Querétaro, Xalapa, Tehuacán, Atlixco, La Paz, Pachuca*), resolviendo las abreviaturas de las trayectorias y contando cada persona una sola vez.
   - **Profesión:** filtro por las diversas ocupaciones históricas registradas.
   - **Buscador interactivo:** búsqueda por nombre con autocompletado en vivo que centra y selecciona la vela del pariente.
   - **Contador en vivo:** indicador visual `N / 57` de integrantes coincidentes.
4. **Ficha biográfica lateral responsiva:**
   - En laptop y desktop se despliega como panel lateral deslizante; en dispositivos móviles se convierte en un cajón inferior (*bottom-sheet*) táctil.
   - Despliega trayectoria completa (ciudad de origen, otras ciudades donde vivió, profesión), fechas en formato largo en español, años vividos o cumplidos calculados, historia personal, información médica textual y enlaces interactivos a parientes directos (padres, cónyuge, hijos y hermanos).
5. **Panel "Resumen de la Memoria":**
   - Tarjeta flotante con efecto vidrio (*glassmorphism*) accesible mediante el botón `📊 Resumen`.
   - Métricas demográficas calculadas en tiempo de ejecución: total de personas (57), vivos (43), fallecidos (14), promedio global de años vividos (73.1 años) y desglose generacional con datos específicos para Generación 1 y Generación 0.

---

## 🛠️ Arquitectura técnica

El proyecto se diseñó como una **aplicación web estática pura (JAMstack sin backend)**, lista para GitHub Pages, sin dependencias externas pesadas ni empaquetadores complejos:

- **HTML5 Semántico:** estructura accesible con roles ARIA, regiones semánticas y soporte de lectura de pantalla.
- **CSS3 Moderno:** variables CSS para diseño temático, efectos de vidrio translúcido (`backdrop-filter`), animaciones aceleradas por GPU (`transform` y `opacity` a 60 FPS) y soporte estricto de `prefers-reduced-motion`.
- **JavaScript Modular (ES Modules):**
  - `js/data-engine.js`: motor de carga, derivación de grafos familiares, linajes simétricos, métricas demográficas y normalización canónica de ciudades.
  - `js/tree-layout.js`: cálculo espacial de coordenadas (X, Y) por generaciones holgadamente distribuidas sin cruces de filiación.
  - `js/app.js`: controlador principal de eventos, ciclo de vida, transformación SVG de 60 FPS (`fitToBox`), filtros combinados y drawer responsivo.
- **SVG Vectorial:** velas artesanales reutilizables mediante `<defs>` y `<use>`, filtros de resplandor y curvas matemáticas de parentesco.
- **Sin datos inventados:** la única fuente de verdad es `data/data.json`, la cual, utiliza los mismos datos que `Dataset_Genealógico_México_Concurso.xlsx`. No se modifican textos médicos ni se alteran historias.

---

## 📋 Mapeo de Requisitos de la Convocatoria (R1 – R9)

| ID | Requisito Oficial | Implementación en la Ofrenda |
|---|---|---|
| **R1** | Navegación por generaciones 2, 1 y 0 | Tres niveles de altar (Gen 2 arriba, Gen 1 centro, Gen 0 abajo) con botones de salto, foco visual y navegación fluida por zoom y arrastre. |
| **R2** | Identificación de parentescos | Guirnaldas de cempasúchil para parejas, curvas de filiación para descendencia y ficha con vínculos familiares directos interactivos. |
| **R3** | Resaltado de fallecidos y trayectorias | Velas apagadas con halo violeta, ritual de encendido de 2.2 s con llama violeta, filtro de estado y bloque de trayectoria vital en la ficha. |
| **R4** | Usabilidad y claridad de linajes (30% rúbrica) | Resaltado simétrico de ancestros y descendientes, buscador por nombre, filtros combinados, tooltips flotantes y leyenda permanente. |
| **R5** | Apego estricto al dataset | Carga exclusiva desde `data/data.json`, textos médicos textuales, fechas en formato largo y cálculo exacto de años cumplidos. |
| **R6** | Enlace público y documentación | Publicado en GitHub Pages con acceso público sin inicio de sesión y con este `README.md` detallado. |
| **R7** | Apto para el video explicativo | Panel *"Resumen de la Memoria"* calculado en tiempo real y vista a 1920×1080 pensada para grabación audiovisual fluida. |
| **R8** | Declaración de Prompts | Registro exhaustivo, textual y cronológico de cada instrucción en `docs/PROMPTS.md`. |
| **R9** | Restricciones y originalidad | Dataset sintético autorizado, página estática sin backend, y diseño artístico 100% original sin recursos protegidos por derechos. |

---

## 💻 Instrucciones para ejecución en local

Dado que la aplicación carga `data/data.json` mediante `fetch()`, las políticas de seguridad del navegador (*CORS*) requieren ejecutarla a través de un servidor web local (no abriendo el archivo `.html` con doble clic).

### 1. Iniciar el servidor local

Abre una terminal en la carpeta raíz del proyecto y ejecuta:

```bash
# Con Python 3:
python -m http.server 8000
```

*(O con Node.js si lo prefieres: `npx serve .`)*

### 2. Abrir la aplicación

Ingresa en tu navegador web a:
```
http://localhost:8000
```

### 3. Ejecutar la auditoría y validación de datos

Para verificar la integridad del dataset, reciprocidad de relaciones, consistencia cronológica, métricas oficiales y unificación de ciudades, ejecuta:

```bash
python tests/validate_data.py
```

Deberás obtener:
```
✓ Conteo total de personas: 57
✓ Conteo total de relaciones: 200
✓ Distribución por generación correcta: Gen 2 = 24, Gen 1 = 19, Gen 0 = 14
✓ 14 fallecidos coinciden exactamente con la lista oficial (43 vivos)
✓ Reciprocidad de cónyuges verificada
✓ Distribución de relaciones correcta: 108 HERMANO_DE, 34 CONYUGE_DE, 29 PADRE_DE, 29 MADRE_DE
✓ Coherencia cronológica validada
✓ P044 Sofía Martínez Rojas (Generación 0) verificada
✓ Unificación canónica de ciudades validada
¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE! Dataset 100% íntegro y validado.
```

---

## 📁 Estructura del repositorio

```
├── index.html                # Interfaz principal semántica con lienzos SVG y contenedores
├── css/
│   └── styles.css            # Estilos, variables temáticas de ofrenda, animaciones y glassmorphism
├── js/
│   ├── app.js                # Controlador principal de vista, pan/zoom, filtros y cajón responsivo
│   ├── data-engine.js        # Motor de grafo genealógico, cálculo demográfico y canonización de ciudades
│   └── tree-layout.js        # Posicionamiento espacial y generador de conectores familiares SVG
├── assets/
│   └── fondo-ofrenda.jpg     # Ilustración nocturna original con arcos neón, cempasúchil y calaveras
├── data/
│   ├── data.json             # ÚNICA fuente de datos de la aplicación (personas y relaciones)
│   ├── personas.csv          # Respaldo tabular de personas para auditoría
│   └── relaciones.csv        # Respaldo tabular de relaciones para auditoría
├── tests/
│   ├── validate_data.py      # Script oficial de validación demográfica y canónica
│   └── test_lineage.mjs      # Prueba automatizada de simetría y reciprocidad en linajes
└── docs/
    ├── PROMPTS.md            # Declaración de Prompts exigida por la convocatoria
    ├── MEMORIA.md            # Memoria técnica del proyecto, decisiones y bitácora
    ├── REQUISITOS.md         # Requisitos oficiales y rúbrica del concurso
    ├── DISENO.md             # Guía visual, semántica de colores y especificaciones de interacción
    └── datos.md              # Diccionario de datos y reglas de consistencia
```

---

*Proyecto desarrollado con respeto, dedicación y apego a las tradiciones mexicanas para el concurso "De los Datos a la Memoria" (2026).*
