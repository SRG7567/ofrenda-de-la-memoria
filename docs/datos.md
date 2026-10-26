# Dataset genealógico de México: contexto de los datos

Datos 100% sintéticos y ficticios (concurso "De los Datos a la Memoria"). Todo texto en UTF-8.

## Archivos

- `data/data.json`: **fuente preferida**. Contiene `meta`, `personas` (57) y `relaciones` (200). Las fechas son `YYYY-MM-DD` y los vacíos son `null`.
- `data/personas.csv` y `data/relaciones.csv`: los mismos datos en CSV.
- El Excel original tenía el encabezado de `relaciones` desplazado y su primera columna se llamaba `C`; aquí ya está corregido y se llama `id_relacion`.

## Reglas para usar los datos

- **Vivo o fallecido:** una persona está viva si `fecha_fallecimiento` está vacía (`null`). En `data.json` cada persona trae además `vivo` (booleano), que es un campo derivado de esa regla.
- **Cómo construir el árbol:** usa solo `id_padre`, `id_madre` e `id_conyuge` de `personas`. Las relaciones de `relaciones` coinciden exactamente con esas columnas. Las 108 aristas `HERMANO_DE` se deducen de tener los mismos padres, así que no hace falta dibujarlas.
- **Generación:** `generacion` es el nivel en el árbol (0 = Ego, hermanos y primos; 1 = padres y tíos; 2 = abuelos y tíos abuelos). Los cónyuges que se casaron con la familia tienen el nivel de su pareja, por eso la generación 2 tiene 24 personas.
- **Ego:** P044, Sofía Martínez Rojas (generación 0).
- **Apellidos:** cada persona lleva el primer apellido del padre y el de la madre. Los cónyuges conservan sus propios apellidos.
- **Causa de muerte:** no es una columna. Está dentro de `informacion_medica`. Solo cuatro fallecidos la marcan explícitamente con "(causa de defunción)": P007, P010, P037 y P053. En los demás, el texto menciona enfermedades sin decir que fueron la causa, y P004 dice "Sin información médica registrada". Mostrar el texto tal cual, sin inventar ni reinterpretar causas.
- **Información incompleta a propósito:** varias personas tienen "Sin información médica registrada". Tratarlo como un dato válido, no como un error.
- **Nada fuera del dataset:** nombres, fechas, ciudades, oficios e historias deben salir siempre de los datos.

## Diccionario de campos

### Hoja `personas`

| Campo | Tipo | Descripción |
|---|---|---|
| `id_persona` | Texto (ID Alfanumérico) | Identificador único asignado a cada individuo (Formato: P001, P002, ...) |
| `nombre_completo` | Texto | Nombre(s) propio(s) seguido obligatoriamente del primer apellido paterno y primer apellido materno. |
| `sexo` | Texto (1 Carácter) | Sexo biológico de la persona: M = Masculino, F = Femenino. |
| `generacion` | Entero | Nivel jerárquico en la línea del árbol genealógico. 0 = Generación del sujeto de referencia (Ego), 1 = Padres y tíos, 2 = Abuelos y tíos abuelos. |
| `rol_en_arbol` | Texto (Código Genealógico) | Código de notación estandarizada posicional basada en Ego (F/M/B/Z) con sufijo -sp para cónyuges. |
| `fecha_nacimiento` | Fecha (YYYY-MM-DD) | Fecha oficial de nacimiento del individuo en formato ISO 8601. |
| `fecha_fallecimiento` | Fecha (YYYY-MM-DD) | Fecha oficial de fallecimiento. Se encuentra en blanco para personas vivas. |
| `estado_civil` | Texto | Estado civil histórico o actual del individuo (Soltero, Casado, Viudo). |
| `ciudad_origen` | Texto | Ciudad y Estado donde nació el individuo. |
| `profesion` | Texto | Ocupación o profesión principal desarrollada durante su etapa productiva, acorde con su época histórica. |
| `otras_ciudades_donde_vivio` | Texto | Ciudades adicionales donde residió la persona a lo largo de su vida (permite verificar coincidencia con cónyuges). |
| `historia_personal` | Texto largo | Breve resumen cualitativo, biográfico y profesional del individuo. |
| `informacion_medica` | Texto | Antecedentes de salud, tipo de sangre o enfermedades reportadas. En algunos casos intencionalmente incompleto. |
| `id_padre` | Texto (ID Alfanumérico) | ID de la persona que es el padre biológico directo del individuo. Vacío para abuelos (raíz de línea). |
| `id_madre` | Texto (ID Alfanumérico) | ID de la persona que es la madre biológica directa del individuo. Vacío para abuelos. |
| `id_conyuge` | Texto (ID Alfanumérico) | ID del cónyuge formal registrado. Vacío si la persona permaneció soltera. |

### Hoja `relaciones`

| Campo | Tipo | Descripción |
|---|---|---|
| `id_relacion` | Texto (ID Alfanumérico) | Identificador único de la arista o vínculo en el grafo de relaciones (R001, R002, ...) |
| `id_persona_origen` | Texto (ID) | ID del individuo origen en la relación. |
| `nombre_persona_origen` | Texto | Nombre completo de la persona origen para facilitar la lectura. |
| `tipo_relacion` | Texto (Categoría) | Tipo de vínculo genealógico: PADRE_DE, MADRE_DE, HERMANO_DE, CONYUGE_DE. |
| `id_persona_destino` | Texto (ID) | ID del individuo destino o receptor del vínculo. |
| `nombre_persona_destino` | Texto | Nombre completo de la persona destino para facilitar la lectura. |
| `notas` | Texto | Detalles adicionales sobre el vínculo (lugar/año de matrimonio, tipo de filiación). |

## Validaciones esperadas (ya comprobadas sobre estos archivos)

- 57 personas: 24 de generación 2, 19 de generación 1 y 14 de generación 0.
- 200 relaciones: 108 `HERMANO_DE`, 34 `CONYUGE_DE`, 29 `PADRE_DE` y 29 `MADRE_DE`.
- 14 fallecidos: P001, P002, P004, P005, P007, P009, P010, P011, P014, P015, P017, P019, P037, P053. Los otros 43 están vivos.
- Todos los ID referenciados existen, los cónyuges son recíprocos, las fechas son coherentes (nadie muere antes de nacer ni es mayor que su padre o madre) y la filiación de `relaciones` coincide con las columnas de `personas`.

## Advertencias sobre la documentación original

- La hoja `readme` del Excel tiene errores. Por ejemplo, dice que P003, P012, P020, P024, P029 y P031 son solteros, pero todos tienen cónyuge. En las generaciones 1 y 2 las únicas personas sin cónyuge son P027, P032, P034 y P038 a P043. **Confiar en las columnas, no en el README.**
- Los ejemplos de la hoja `diccionario` para `relaciones` no son fiables (por ejemplo, listan a Sofía como P035 y ella es P044). Usar solo las descripciones de los campos.
