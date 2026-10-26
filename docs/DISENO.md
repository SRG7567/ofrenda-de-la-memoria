# Diseño y estética: "ofrenda neón cálida", nocturna

Una ofrenda de Día de Muertos de noche, con una vela por persona. Festiva pero legible: pocos colores, cada uno con un significado claro, mucho contraste y fichas limpias. La usabilidad pesa más que la decoración.

## 1. Principio de color

El color codifica **solo** esto, y nada más (no uses el color del cuerpo de la vela para otros datos):
- **Estado:** llama cálida = vive; vela apagada con halo violeta = falleció.
- **Selección y foco:** cian.
- **Linaje resaltado:** cempasúchil brillante.
- **Atenuado:** todo lo que no está en el resaltado o filtro baja a ~25% de opacidad.

El neón se usa en nodos, líneas, bordes y hover. **Nunca** en párrafos de texto.

## 2. Paleta (definir como variables CSS)

| Variable | Valor | Uso |
|---|---|---|
| `--fondo` | `#1A1033` | Fondo nocturno (puede degradar a un tono más oscuro hacia abajo) |
| `--panel` | `#241747` | Paneles, ficha lateral, tooltips |
| `--cempasuchil` | `#FFB300` | Color principal: llama de los vivos, guirnaldas, linaje resaltado |
| `--rosa` | `#FF2D95` | Acentos y papel picado |
| `--violeta` | `#B388FF` | Fallecidos (halo, llama espectral, humo) y líneas de filiación |
| `--cian` | `#00E5FF` | Solo selección, foco de teclado y acento puntual |
| `--verde` | `#4CAF7A` | Detalles discretos (hojas, adornos) |
| `--texto` | `#F5F0E6` | Texto blanco hueso |
| `--cera` | `#F3E3C3` | Cuerpo de las velas |

Verifica que el contraste del texto sobre `--fondo` y `--panel` sea adecuado (mínimo WCAG AA).

## 3. Tipografía

- Títulos: una serif con carácter, por ejemplo **Playfair Display**.
- Datos y etiquetas: una sans limpia, por ejemplo **Inter**.
- Si no usas fuentes externas, guarda las fuentes en el proyecto o usa una pila de respaldo (`Georgia, serif` y `system-ui, sans-serif`).

## 4. Composición

- Cada generación es un **nivel de la ofrenda**: Generación 2 arriba, 1 en medio, 0 abajo, sobre un fondo nocturno con luna, un arco de cempasúchil y una cenefa de papel picado en el encabezado.
- La generación 2 es la más ancha (24 personas) y la 0 tiene 14. Agrupa las velas **por familia** (pareja + hijos), con espaciado holgado; cada nivel tiene desplazamiento horizontal y zoom.
- El papel picado es un detalle sutil (cenefa en el encabezado y separadores), **no** el fondo de todo.
- Decoración (papel picado, arcos, flores, luna) en **SVG o CSS originales**. Nada de personajes ni imágenes de películas.

## 5. La vela (nodo)

- Cuerpo en `--cera` con borde neón tenue y el nombre corto debajo o sobre la vela (el nombre completo va en el tooltip y en la ficha). Que el nombre sea legible incluso en el nivel más ancho.
- **Vivo:** llama animada (parpadeo suave) en `--cempasuchil` con brillo cálido.
- **Fallecido:** sin llama, con halo `--violeta` y un hilo de humo animado, para que destaque aunque esté apagada.
- **Ritual:** al hacer clic en un fallecido, su vela se enciende un momento con llama violeta y se abre su ficha. Después vuelve a apagarse.
- **Seleccionado:** aro `--cian`.
- Efecto de brillo con `filter: drop-shadow` o `box-shadow`; con 57 nodos no debe afectar el rendimiento.

## 6. Líneas

- **Pareja:** guirnalda de cempasúchil (línea de puntos naranjas) entre los cónyuges.
- **Filiación:** línea fina luminosa en `--violeta` (tenue) desde la unión de la pareja hacia cada hijo. Evita cruces: los hijos cuelgan de un punto bajo la pareja.
- **Linaje resaltado:** las líneas del camino de ancestros o descendientes pasan a `--cempasuchil` con brillo, y el resto se atenúa.

## 7. Interacciones

| Interacción | Comportamiento |
|---|---|
| Clic en una vela | Abre la ficha lateral con todos los campos de la persona |
| Hover o foco | Tooltip corto: nombre completo y años de nacimiento y fallecimiento |
| "Resaltar linaje" | Ilumina ancestros y descendientes de la persona seleccionada |
| Filtro de fallecidos | Atenúa los vivos y deja en primer plano las velas apagadas |
| Filtros | Por estado (vivos/fallecidos), ciudad y profesión |
| Búsqueda | Por nombre; al elegir un resultado, centra y selecciona la vela |
| Botones de generación | Llevan la vista al nivel 2, 1 o 0 |

**Ficha lateral:** nombre completo, parentesco con Ego, fechas (y años vividos o edad, presentados como "80 años vividos" o "19 años", calculados como años cumplidos a partir de las fechas), estado civil, trayectoria (ciudad de origen → otras ciudades, profesión), historia personal, información médica tal cual y las personas relacionadas (padres, cónyuge, hijos, hermanos) como enlaces que seleccionan esa vela.

**Leyenda siempre visible:** "llama encendida = vive · vela apagada = falleció · aro cian = seleccionado".

## 8. Movimiento y accesibilidad

- Animaciones suaves y discretas: parpadeo de llama, humo, encendido del ritual. Nada que distraiga al leer.
- Respeta `prefers-reduced-motion`: sin parpadeo ni humo animados, con estados estáticos equivalentes.
- Navegación con teclado (Tab y Enter sobre las velas), foco visible en cian y etiquetas accesibles (`aria-label` con nombre y estado).
- Diseño responsivo: usable en celular y vistoso en pantalla completa de laptop (se grabará a 1920×1080).

## 9. Qué evitar

- Texto largo en colores neón.
- Brillo fuerte en todo a la vez: si todo brilla, nada destaca.
- Un neón frío y agresivo que parezca Halloween o ciberpunk; el tono dominante es el cálido del cempasúchil.
- Decoración que tape la información o dificulte seguir los linajes.
- Datos inventados para "completar" el diseño.
