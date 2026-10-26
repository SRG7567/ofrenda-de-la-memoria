"""
Script de auditoría y validación de datos para el proyecto "Ofrenda de la Memoria".
Verifica la integridad de data/data.json según las especificaciones de docs/datos.md y AGENTS.md.
"""

import json
import sys
from pathlib import Path
from datetime import datetime

# Asegurar codificación UTF-8 en salida estándar para compatibilidad con Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "data.json"

EXPECTED_FALLECIDOS = {
    "P001", "P002", "P004", "P005", "P007", "P009", "P010",
    "P011", "P014", "P015", "P017", "P019", "P037", "P053"
}

def validate():
    print(f"Cargando datos desde: {DATA_PATH}")
    if not DATA_PATH.exists():
        print(f"ERROR: No se encontró el archivo {DATA_PATH}")
        sys.exit(1)

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    personas = data.get("personas", [])
    relaciones = data.get("relaciones", [])
    meta = data.get("meta", {})

    errors = []
    warnings = []

    # 1. Conteo total de personas
    if len(personas) != 57:
        errors.append(f"Se esperaban 57 personas, pero hay {len(personas)}")
    else:
        print("✓ Conteo total de personas: 57")

    # 2. Conteo total de relaciones
    if len(relaciones) != 200:
        errors.append(f"Se esperaban 200 relaciones, pero hay {len(relaciones)}")
    else:
        print("✓ Conteo total de relaciones: 200")

    # 3. Distribución por generación
    gen_counts = {0: 0, 1: 0, 2: 0}
    for p in personas:
        g = p.get("generacion")
        if g in gen_counts:
            gen_counts[g] += 1
        else:
            errors.append(f"Persona {p.get('id_persona')} tiene generación desconocida: {g}")

    if gen_counts != {0: 14, 1: 19, 2: 24}:
        errors.append(f"Distribución de generaciones incorrecta: {gen_counts} (esperado 24/19/14)")
    else:
        print("✓ Distribución por generación correcta: Gen 2 = 24, Gen 1 = 19, Gen 0 = 14")

    # 4. Estado vital (vivos y fallecidos)
    personas_dict = {p["id_persona"]: p for p in personas}
    fallecidos_actuales = set()
    vivos_actuales = set()

    for p in personas:
        pid = p["id_persona"]
        ffall = p.get("fecha_fallecimiento")
        vivo = p.get("vivo")

        if ffall is not None and str(ffall).strip() != "":
            fallecidos_actuales.add(pid)
            if vivo is not False:
                errors.append(f"Persona {pid} tiene fecha_fallecimiento pero vivo != False")
        else:
            vivos_actuales.add(pid)
            if vivo is not True:
                errors.append(f"Persona {pid} no tiene fecha_fallecimiento pero vivo != True")

    if len(fallecidos_actuales) != 14:
        errors.append(f"Se esperaban 14 fallecidos, se encontraron {len(fallecidos_actuales)}")
    elif fallecidos_actuales != EXPECTED_FALLECIDOS:
        diff = fallecidos_actuales.symmetric_difference(EXPECTED_FALLECIDOS)
        errors.append(f"Fallecidos no coinciden con la lista esperada. Diferencia: {diff}")
    else:
        print("✓ 14 fallecidos coinciden exactamente con la lista oficial (43 vivos)")

    # 5. Integridad referencial en personas
    for p in personas:
        pid = p["id_persona"]
        for ref_field in ["id_padre", "id_madre", "id_conyuge"]:
            ref_val = p.get(ref_field)
            if ref_val:
                if ref_val not in personas_dict:
                    errors.append(f"Persona {pid} referencia {ref_field}={ref_val} que no existe en personas")

    # 6. Reciprocidad de cónyuges
    for pid, p in personas_dict.items():
        conyuge_id = p.get("id_conyuge")
        if conyuge_id:
            conyuge = personas_dict.get(conyuge_id)
            if conyuge and conyuge.get("id_conyuge") != pid:
                errors.append(f"Matrimonio no recíproco: {pid} -> {conyuge_id}, pero {conyuge_id} -> {conyuge.get('id_conyuge')}")
    print("✓ Reciprocidad de cónyuges verificada")

    # 7. Tipos de relación en 'relaciones'
    rel_counts = {}
    for r in relaciones:
        tipo = r.get("tipo_relacion")
        rel_counts[tipo] = rel_counts.get(tipo, 0) + 1
        
        orig = r.get("id_persona_origen")
        dest = r.get("id_persona_destino")
        if orig not in personas_dict:
            errors.append(f"Relación {r.get('id_relacion')} origen {orig} no existe en personas")
        if dest not in personas_dict:
            errors.append(f"Relación {r.get('id_relacion')} destino {dest} no existe en personas")

    expected_rel_counts = {
        "HERMANO_DE": 108,
        "CONYUGE_DE": 34,
        "PADRE_DE": 29,
        "MADRE_DE": 29
    }
    if rel_counts != expected_rel_counts:
        errors.append(f"Distribución de relaciones inesperada: {rel_counts} vs {expected_rel_counts}")
    else:
        print("✓ Distribución de relaciones correcta: 108 HERMANO_DE, 34 CONYUGE_DE, 29 PADRE_DE, 29 MADRE_DE")

    # 8. Coherencia de fechas cronológicas
    for p in personas:
        pid = p["id_persona"]
        fnac_str = p.get("fecha_nacimiento")
        ffall_str = p.get("fecha_fallecimiento")
        
        try:
            fnac = datetime.strptime(fnac_str, "%Y-%m-%d")
        except Exception as e:
            errors.append(f"Persona {pid} tiene fecha_nacimiento inválida: {fnac_str}")
            continue

        if ffall_str:
            try:
                ffall = datetime.strptime(ffall_str, "%Y-%m-%d")
                if ffall < fnac:
                    errors.append(f"Persona {pid} falleció ({ffall_str}) antes de nacer ({fnac_str})")
            except Exception as e:
                errors.append(f"Persona {pid} tiene fecha_fallecimiento inválida: {ffall_str}")

        # Comparar con padres
        padre_id = p.get("id_padre")
        if padre_id and padre_id in personas_dict:
            fnac_padre = datetime.strptime(personas_dict[padre_id]["fecha_nacimiento"], "%Y-%m-%d")
            if fnac <= fnac_padre:
                errors.append(f"Persona {pid} nació antes o igual que su padre {padre_id}")

        madre_id = p.get("id_madre")
        if madre_id and madre_id in personas_dict:
            fnac_madre = datetime.strptime(personas_dict[madre_id]["fecha_nacimiento"], "%Y-%m-%d")
            if fnac <= fnac_madre:
                errors.append(f"Persona {pid} nació antes o igual que su madre {madre_id}")

    print("✓ Coherencia cronológica (nacimiento vs fallecimiento y padres mayores que hijos) validada")

    # 9. Verificación de P044 en personas
    if "P044" not in personas_dict:
        errors.append("P044 no existe en personas")
    else:
        p044 = personas_dict["P044"]
        if p044.get("nombre_completo") != "Sofía Martínez Rojas" or p044.get("generacion") != 0:
            errors.append(f"P044 no coincide con Sofía Martínez Rojas (Gen 0): {p044.get('nombre_completo')} (Gen {p044.get('generacion')})")
        else:
            print("✓ P044 Sofía Martínez Rojas (Generación 0) verificada")

    # 10. Métricas oficiales: fallecidos por generación y años vividos promedio
    fallecidos_por_gen = {0: 0, 1: 0, 2: 0}
    edades_fallecidos = []
    edades_por_gen = {0: [], 1: [], 2: []}

    for pid in sorted(fallecidos_actuales):
        p = personas_dict[pid]
        g = p["generacion"]
        fallecidos_por_gen[g] += 1

        fn = datetime.strptime(p["fecha_nacimiento"], "%Y-%m-%d")
        ff = datetime.strptime(p["fecha_fallecimiento"], "%Y-%m-%d")
        # Cálculo exacto de años cumplidos
        anios = ff.year - fn.year - ((ff.month, ff.day) < (fn.month, fn.day))
        edades_fallecidos.append(anios)
        edades_por_gen[g].append(anios)

    promedio_global = sum(edades_fallecidos) / len(edades_fallecidos) if edades_fallecidos else 0
    prom_gen2 = sum(edades_por_gen[2]) / len(edades_por_gen[2]) if edades_por_gen[2] else 0
    prom_gen1 = sum(edades_por_gen[1]) / len(edades_por_gen[1]) if edades_por_gen[1] else 0
    prom_gen0 = sum(edades_por_gen[0]) / len(edades_por_gen[0]) if edades_por_gen[0] else 0

    print("\n--- MÉTRICAS DEMOGRÁFICAS CALCULADAS ---")
    print(f"Fallecidos por generación: Gen 2 = {fallecidos_por_gen[2]}/24, Gen 1 = {fallecidos_por_gen[1]}/19, Gen 0 = {fallecidos_por_gen[0]}/14")
    print(f"Años vividos promedio (global, 14 difuntos): {promedio_global:.1f} años")
    print(f"Años vividos promedio por generación: Gen 2 = {prom_gen2:.1f} años | Gen 1 = {prom_gen1:.1f} años ({edades_por_gen[1][0]} años) | Gen 0 = {prom_gen0:.1f} años ({edades_por_gen[0][0]} años)")

    # 11. Validación de unificación canónica de ciudades (Filtro de Ciudad)
    CITY_CANONICAL_MAP = {
        'Puebla, Puebla': 'Puebla',
        'Puebla, Pue.': 'Puebla',
        'Oaxaca de Juárez, Oaxaca': 'Oaxaca de Juárez',
        'Oaxaca, Oax.': 'Oaxaca de Juárez',
        'Huajuapan de León, Oaxaca': 'Huajuapan de León',
        'Huajuapan de León, Oax.': 'Huajuapan de León',
        'Huajuapan, Oax.': 'Huajuapan de León',
        'Ciudad de México': 'CDMX',
        'CDMX': 'CDMX',
        'Querétaro, Querétaro': 'Querétaro',
        'Querétaro, Qro.': 'Querétaro',
        'Veracruz, Veracruz': 'Veracruz',
        'Veracruz, Ver.': 'Veracruz',
        'Xalapa, Veracruz': 'Xalapa',
        'Xalapa, Ver.': 'Xalapa',
        'Atlixco, Puebla': 'Atlixco',
        'Atlixco, Pue.': 'Atlixco',
        'Tehuacán, Pue.': 'Tehuacán',
        'La Paz, B.C.S.': 'La Paz',
        'Pachuca, Hgo.': 'Pachuca'
    }

    def canonical_city(name):
        if not name or not str(name).strip():
            return ''
        return CITY_CANONICAL_MAP.get(str(name).strip(), str(name).strip())

    expected_city_counts = {
        'Puebla': 33,
        'Oaxaca de Juárez': 24,
        'CDMX': 14,
        'Huajuapan de León': 10,
        'Veracruz': 6,
        'Querétaro': 5,
        'Xalapa': 5,
        'Tehuacán': 3,
        'Atlixco': 3,
        'La Paz': 3,
        'Pachuca': 1
    }

    actual_city_counts = {}
    for p in personas:
        p_cities = set()
        if p.get('ciudad_origen'):
            c = canonical_city(p['ciudad_origen'])
            if c:
                p_cities.add(c)
        if p.get('otras_ciudades_donde_vivio'):
            for item in str(p['otras_ciudades_donde_vivio']).split(';'):
                c = canonical_city(item)
                if c:
                    p_cities.add(c)
        for c in p_cities:
            actual_city_counts[c] = actual_city_counts.get(c, 0) + 1

    canonical_list = sorted(actual_city_counts.keys())
    if len(canonical_list) != len(set(canonical_list)):
        errors.append("Existen nombres de ciudad unificados duplicados en la lista canónica")

    if actual_city_counts != expected_city_counts:
        errors.append(f"Totales por ciudad no coinciden. Obtenido: {actual_city_counts} vs Esperado: {expected_city_counts}")
    else:
        print("✓ Unificación canónica de ciudades (11 ciudades sin duplicados y conteos exactos) validada")

    # Resumen final
    print("\n--- RESULTADO DE LA VALIDACIÓN ---")
    if warnings:
        print(f"Advertencias ({len(warnings)}):")
        for w in warnings:
            print(f"  [WARN] {w}")
    if errors:
        print(f"ERRORES ENCONTRADOS ({len(errors)}):")
        for err in errors:
            print(f"  [ERROR] {err}")
        sys.exit(1)
    else:
        print("¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE! Dataset 100% íntegro y validado.")

if __name__ == "__main__":
    validate()
