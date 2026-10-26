/**
 * data-engine.js — Motor de datos y parentescos para "Ofrenda de la Memoria"
 * 
 * Consume exclusivamente data/data.json y deriva estructuras genealógicas
 * sin alterar textos médicos ni inventar información.
 */

/**
 * Tabla de equivalencias de ciudades para unificación canónica (Filtro de Ciudad)
 */
export const CITY_CANONICAL_MAP = {
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
};

export function getCanonicalCity(name) {
  if (!name || typeof name !== 'string') return '';
  const trimmed = name.trim();
  return CITY_CANONICAL_MAP[trimmed] || trimmed;
}

export class DataEngine {
  constructor() {
    this.raw = null;
    this.personas = new Map();
  }

  async load(url = 'data/data.json') {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Error al cargar datos: ${res.statusText}`);
    }
    this.raw = await res.json();

    this.personas.clear();
    for (const p of this.raw.personas) {
      this.personas.set(p.id_persona, {
        ...p,
        // Asegurar campos limpios
        id_padre: p.id_padre || null,
        id_madre: p.id_madre || null,
        id_conyuge: p.id_conyuge || null
      });
    }

    return this;
  }

  getPerson(id) {
    return this.personas.get(id) || null;
  }

  getAllPersons() {
    return Array.from(this.personas.values());
  }

  getPersonsByGeneration(gen) {
    return this.getAllPersons().filter(p => p.generacion === gen);
  }

  getParents(id) {
    const p = this.getPerson(id);
    if (!p) return [];
    const parents = [];
    if (p.id_padre && this.personas.has(p.id_padre)) parents.push(this.getPerson(p.id_padre));
    if (p.id_madre && this.personas.has(p.id_madre)) parents.push(this.getPerson(p.id_madre));
    return parents;
  }

  getSpouse(id) {
    const p = this.getPerson(id);
    if (!p || !p.id_conyuge) return null;
    return this.getPerson(p.id_conyuge);
  }

  getChildren(id) {
    return this.getAllPersons().filter(
      other => other.id_padre === id || other.id_madre === id
    );
  }

  getSiblings(id) {
    const p = this.getPerson(id);
    if (!p || (!p.id_padre && !p.id_madre)) return [];
    return this.getAllPersons().filter(other => {
      if (other.id_persona === id) return false;
      const sharesFather = p.id_padre && other.id_padre === p.id_padre;
      const sharesMother = p.id_madre && other.id_madre === p.id_madre;
      return sharesFather && sharesMother;
    });
  }

  /**
   * Obtiene todos los ancestros recursivos de una persona (padres, abuelos, etc.)
   */
  getAncestors(id) {
    const ancestors = new Set();
    const queue = [id];

    while (queue.length > 0) {
      const currId = queue.shift();
      const curr = this.getPerson(currId);
      if (!curr) continue;

      if (curr.id_padre && !ancestors.has(curr.id_padre)) {
        ancestors.add(curr.id_padre);
        queue.push(curr.id_padre);
      }
      if (curr.id_madre && !ancestors.has(curr.id_madre)) {
        ancestors.add(curr.id_madre);
        queue.push(curr.id_madre);
      }
    }

    return ancestors;
  }

  /**
   * Obtiene todos los descendientes recursivos de una persona (hijos, nietos, etc.)
   */
  getDescendants(id) {
    const descendants = new Set();
    const queue = [id];

    while (queue.length > 0) {
      const currId = queue.shift();
      const children = this.getChildren(currId);
      for (const child of children) {
        if (!descendants.has(child.id_persona)) {
          descendants.add(child.id_persona);
          queue.push(child.id_persona);
        }
      }
    }

    return descendants;
  }

  /**
   * Obtiene el linaje completo directo (persona + ancestros + descendientes)
   */
  getLineage(id) {
    const ancestors = this.getAncestors(id);
    const descendants = this.getDescendants(id);
    const all = new Set([id, ...ancestors, ...descendants]);

    return {
      self: id,
      ancestors,
      descendants,
      all
    };
  }

  getCanonicalCity(name) {
    return getCanonicalCity(name);
  }

  getPersonCanonicalCities(person) {
    const cities = new Set();
    if (!person) return cities;
    if (person.ciudad_origen && person.ciudad_origen.trim()) {
      const c = getCanonicalCity(person.ciudad_origen);
      if (c) cities.add(c);
    }
    if (person.otras_ciudades_donde_vivio) {
      const others = person.otras_ciudades_donde_vivio.split(';').map(c => c.trim()).filter(Boolean);
      for (const o of others) {
        const c = getCanonicalCity(o);
        if (c) cities.add(c);
      }
    }
    return cities;
  }

  /**
   * Obtiene la lista ordenada de ciudades canónicas únicas (sin duplicados)
   */
  getUniqueCities() {
    const cities = new Set();
    for (const p of this.getAllPersons()) {
      const pCities = this.getPersonCanonicalCities(p);
      for (const c of pCities) {
        cities.add(c);
      }
    }
    return Array.from(cities).sort((a, b) => a.localeCompare(b, 'es'));
  }

  /**
   * Obtiene la lista ordenada de profesiones únicas registradas
   */
  getUniqueProfessions() {
    const professions = new Set();
    for (const p of this.getAllPersons()) {
      if (p.profesion && p.profesion.trim()) {
        professions.add(p.profesion.trim());
      }
    }
    return Array.from(professions).sort((a, b) => a.localeCompare(b, 'es'));
  }

  /**
   * Comprueba si una persona coincide con los filtros aplicados
   */
  matchesFilters(person, { status = 'all', city = 'all', profession = 'all', searchTerm = '' } = {}) {
    if (!person) return false;

    // Filtro de estado
    if (status === 'alive' && !person.vivo) return false;
    if (status === 'deceased' && person.vivo) return false;

    // Filtro de ciudad (unificada / canónica)
    if (city !== 'all') {
      const personCities = this.getPersonCanonicalCities(person);
      if (!personCities.has(city)) return false;
    }

    // Filtro de profesión
    if (profession !== 'all') {
      if (person.profesion !== profession) return false;
    }

    // Filtro de búsqueda por nombre
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.trim().toLowerCase();
      const fullName = (person.nombre_completo || '').toLowerCase();
      if (!fullName.includes(term)) return false;
    }

    return true;
  }

  /**
   * Cálculo de años vividos o edad actual como años cumplidos.
   * Sin etiqueta de calculado (ej: "80 años vividos" o "19 años").
   */
  calculateAge(person) {
    if (!person || !person.fecha_nacimiento) return null;
    const fn = new Date(person.fecha_nacimiento + 'T00:00:00');
    
    if (person.fecha_fallecimiento) {
      const ff = new Date(person.fecha_fallecimiento + 'T00:00:00');
      let age = ff.getFullYear() - fn.getFullYear();
      const m = ff.getMonth() - fn.getMonth();
      if (m < 0 || (m === 0 && ff.getDate() < fn.getDate())) {
        age--;
      }
      return {
        value: age,
        isDeceased: true,
        label: `${age} años vividos`
      };
    } else {
      // Persona viva: calcular edad con respecto al presente del concurso (2026)
      const now = new Date();
      let age = now.getFullYear() - fn.getFullYear();
      const m = now.getMonth() - fn.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < fn.getDate())) {
        age--;
      }
      return {
        value: age,
        isDeceased: false,
        label: `${age} años`
      };
    }
  }

  /**
   * Calcula las métricas oficiales y demográficas para el panel Resumen (Fase 3):
   * Total de personas, vivos, fallecidos, promedio global de años vividos y desglose por generación.
   */
  getSummaryMetrics() {
    const persons = this.getAllPersons();
    const total = persons.length;
    const deceased = persons.filter(p => !p.vivo);
    const alive = persons.filter(p => p.vivo);

    const byGen = {
      2: { total: 0, deceased: [] },
      1: { total: 0, deceased: [] },
      0: { total: 0, deceased: [] }
    };

    let totalLivedYears = 0;

    for (const p of persons) {
      const g = p.generacion;
      if (byGen[g] !== undefined) {
        byGen[g].total++;
        if (!p.vivo) {
          const ageInfo = this.calculateAge(p);
          const years = ageInfo ? ageInfo.value : 0;
          totalLivedYears += years;
          byGen[g].deceased.push({
            person: p,
            firstName: p.nombre_completo.trim().split(' ')[0],
            years
          });
        }
      }
    }

    const avgLivedOverall = deceased.length > 0
      ? (totalLivedYears / deceased.length).toFixed(1)
      : '0';

    return {
      total,
      aliveCount: alive.length,
      deceasedCount: deceased.length,
      avgLivedOverall,
      gen2: {
        title: "Generación 2",
        total: byGen[2].total,
        deceasedCount: byGen[2].deceased.length,
        deceasedList: byGen[2].deceased
      },
      gen1: {
        title: "Generación 1",
        total: byGen[1].total,
        deceasedCount: byGen[1].deceased.length,
        deceasedList: byGen[1].deceased
      },
      gen0: {
        title: "Generación 0",
        total: byGen[0].total,
        deceasedCount: byGen[0].deceased.length,
        deceasedList: byGen[0].deceased
      }
    };
  }

  /**
   * Formatea una fecha YYYY-MM-DD en texto largo en español:
   * Ejemplo: "1932-05-14" -> "14 de mayo de 1932"
   * No sufre desfasajes de zona horaria al procesar la cadena directamente.
   */
  formatDate(isoDate) {
    if (!isoDate || typeof isoDate !== 'string') return '—';
    const parts = isoDate.trim().split('-');
    if (parts.length !== 3) return isoDate;

    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    if (monthIndex < 0 || monthIndex > 11 || isNaN(day)) return isoDate;
    return `${day} de ${meses[monthIndex]} de ${year}`;
  }
}
