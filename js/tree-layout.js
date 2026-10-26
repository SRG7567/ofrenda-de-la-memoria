/**
 * tree-layout.js — Motor de posicionamiento y conectores SVG para "Ofrenda de la Memoria"
 * 
 * Distribuye las 57 personas en tres niveles generacionales organizados por familias,
 * optimizado para llenar pantallas 1920×1080 con separación holgada y legibilidad total.
 * - Generación 2 (Arriba, Y = 220px): 12 matrimonios (24 personas)
 * - Generación 1 (Medio, Y = 720px): 5 matrimonios y 9 solteros (19 personas)
 * - Generación 0 (Abajo, Y = 1220px): 14 personas distribuidas por familias
 */

export class TreeLayout {
  constructor(dataEngine) {
    this.engine = dataEngine;
    this.nodes = new Map();
    this.coupleLinks = [];
    this.parentLinks = [];
  }

  computeLayout() {
    this.nodes.clear();
    this.coupleLinks = [];
    this.parentLinks = [];

    const Y_GEN2 = 220;
    const Y_GEN1 = 720;
    const Y_GEN0 = 1220;
    const COUPLE_HALF_GAP = 58; // Distancia del centro de la pareja a cada cónyuge (116px entre esposos)

    // Nivel 2: 12 parejas holgadamente distribuidas
    const gen2Couples = [
      // Rama Paterna Externa
      { p1: 'P002', p2: 'P006', cx: 320 },  // Roberto + Martha
      { p1: 'P004', p2: 'P007', cx: 620 },  // Elena + Gonzalo
      { p1: 'P003', p2: 'P022', cx: 920 },  // Fernando + Josefina (padres de P038, P039)
      { p1: 'P008', p2: 'P009', cx: 1220 }, // Javier + Rosaura
      
      // Pareja Central Paterna
      { p1: 'P001', p2: 'P005', cx: 1540 }, // Carlos + Carmen (padres de Alejandro, Jorge, Patricia)

      // Pareja Central Materna
      { p1: 'P010', p2: 'P015', cx: 2240 }, // Antonio + Guadalupe (padres de María Elena, Ricardo, Gabriel, etc.)

      // Rama Materna Externa
      { p1: 'P011', p2: 'P016', cx: 2560 }, // Manuel + Esperanza
      { p1: 'P012', p2: 'P023', cx: 2840 }, // Guillermo + Sara (padres de P040, P041)
      { p1: 'P013', p2: 'P017', cx: 3100 }, // Teresa + Arturo
      { p1: 'P014', p2: 'P018', cx: 3360 }, // Lucía + Esteban
      { p1: 'P020', p2: 'P024', cx: 3620 }, // Consuelo + Tomás (padres de P042, P043)
      { p1: 'P019', p2: 'P021', cx: 3880 }  // Francisco + Alicia
    ];

    // Registrar nodos y enlaces de Gen 2 (alternando altura de nombres entre cónyuges)
    for (const c of gen2Couples) {
      const p1 = this.engine.getPerson(c.p1);
      const p2 = this.engine.getPerson(c.p2);
      const x1 = c.cx - COUPLE_HALF_GAP;
      const x2 = c.cx + COUPLE_HALF_GAP;

      this.addNode(p1, x1, Y_GEN2, 58); // Primer cónyuge altura base
      this.addNode(p2, x2, Y_GEN2, 82); // Segundo cónyuge altura alternada

      this.coupleLinks.push({
        p1: c.p1,
        p2: c.p2,
        gen: 2,
        x1, y1: Y_GEN2,
        x2, y2: Y_GEN2,
        mx: c.cx,
        my: Y_GEN2
      });
    }

    // Nivel 1: Posicionamiento vertical debajo de sus familias
    // Hijos de Fernando + Josefina (cx = 920)
    this.addNode(this.engine.getPerson('P038'), 860, Y_GEN1, 58); // Esteban
    this.addNode(this.engine.getPerson('P039'), 980, Y_GEN1, 82); // Mariana

    // Hija de Carlos + Carmen (cx = 1540)
    this.addNode(this.engine.getPerson('P027'), 1260, Y_GEN1, 58); // Patricia (soltera)

    // Pareja Jorge + Claudia (cx = 1500)
    const cxJorge = 1500;
    this.addNode(this.engine.getPerson('P026'), cxJorge - COUPLE_HALF_GAP, Y_GEN1, 58);
    this.addNode(this.engine.getPerson('P028'), cxJorge + COUPLE_HALF_GAP, Y_GEN1, 82);
    this.coupleLinks.push({
      p1: 'P026', p2: 'P028',
      gen: 1,
      x1: cxJorge - COUPLE_HALF_GAP, y1: Y_GEN1,
      x2: cxJorge + COUPLE_HALF_GAP, y2: Y_GEN1,
      mx: cxJorge, my: Y_GEN1
    });

    // Pareja Central: Alejandro + María Elena (cx = 1890)
    const cxPadres = 1890;
    this.addNode(this.engine.getPerson('P025'), cxPadres - COUPLE_HALF_GAP, Y_GEN1, 58);
    this.addNode(this.engine.getPerson('P029'), cxPadres + COUPLE_HALF_GAP, Y_GEN1, 82);
    this.coupleLinks.push({
      p1: 'P025', p2: 'P029',
      gen: 1,
      x1: cxPadres - COUPLE_HALF_GAP, y1: Y_GEN1,
      x2: cxPadres + COUPLE_HALF_GAP, y2: Y_GEN1,
      mx: cxPadres, my: Y_GEN1
    });

    // Hijos de Antonio + Guadalupe (cx = 2240)
    // Pareja Ricardo + Verónica
    const cxRicardo = 2260;
    this.addNode(this.engine.getPerson('P030'), cxRicardo - COUPLE_HALF_GAP, Y_GEN1, 58);
    this.addNode(this.engine.getPerson('P035'), cxRicardo + COUPLE_HALF_GAP, Y_GEN1, 82);
    this.coupleLinks.push({
      p1: 'P030', p2: 'P035',
      gen: 1,
      x1: cxRicardo - COUPLE_HALF_GAP, y1: Y_GEN1,
      x2: cxRicardo + COUPLE_HALF_GAP, y2: Y_GEN1,
      mx: cxRicardo, my: Y_GEN1
    });

    // Pareja Gabriel + Lorena
    const cxGabriel = 2540;
    this.addNode(this.engine.getPerson('P031'), cxGabriel - COUPLE_HALF_GAP, Y_GEN1, 58);
    this.addNode(this.engine.getPerson('P036'), cxGabriel + COUPLE_HALF_GAP, Y_GEN1, 82);
    this.coupleLinks.push({
      p1: 'P031', p2: 'P036',
      gen: 1,
      x1: cxGabriel - COUPLE_HALF_GAP, y1: Y_GEN1,
      x2: cxGabriel + COUPLE_HALF_GAP, y2: Y_GEN1,
      mx: cxGabriel, my: Y_GEN1
    });

    // Pareja Beatriz + Mauricio
    const cxBeatriz = 2820;
    this.addNode(this.engine.getPerson('P033'), cxBeatriz - COUPLE_HALF_GAP, Y_GEN1, 58);
    this.addNode(this.engine.getPerson('P037'), cxBeatriz + COUPLE_HALF_GAP, Y_GEN1, 82);
    this.coupleLinks.push({
      p1: 'P033', p2: 'P037',
      gen: 1,
      x1: cxBeatriz - COUPLE_HALF_GAP, y1: Y_GEN1,
      x2: cxBeatriz + COUPLE_HALF_GAP, y2: Y_GEN1,
      mx: cxBeatriz, my: Y_GEN1
    });

    // Tíos solteros de la rama materna
    this.addNode(this.engine.getPerson('P032'), 3000, Y_GEN1, 58); // Héctor
    this.addNode(this.engine.getPerson('P034'), 3120, Y_GEN1, 82); // Adriana

    // Hijos de Guillermo + Sara (cx = 2840)
    this.addNode(this.engine.getPerson('P040'), 3280, Y_GEN1, 58); // Alfonso
    this.addNode(this.engine.getPerson('P041'), 3400, Y_GEN1, 82); // Lucía

    // Hijos de Consuelo + Tomás (cx = 3620)
    this.addNode(this.engine.getPerson('P042'), 3580, Y_GEN1, 58); // Guillermo
    this.addNode(this.engine.getPerson('P043'), 3700, Y_GEN1, 82); // Gabriela

    // Nivel 0: Generación 0 agrupada por fratría
    // Primos paternos (hijos de Jorge + Claudia)
    this.addNode(this.engine.getPerson('P047'), 1380, Y_GEN0, 58); // Diego
    this.addNode(this.engine.getPerson('P048'), 1500, Y_GEN0, 82); // Valeria
    this.addNode(this.engine.getPerson('P049'), 1620, Y_GEN0, 58); // Emilio

    // Fratría central: Mateo, Sofía y Camila
    this.addNode(this.engine.getPerson('P045'), 1770, Y_GEN0, 58); // Mateo
    this.addNode(this.engine.getPerson('P044'), 1890, Y_GEN0, 82); // Sofía
    this.addNode(this.engine.getPerson('P046'), 2010, Y_GEN0, 58); // Camila

    // Primos maternos (hijos de Ricardo + Verónica)
    this.addNode(this.engine.getPerson('P050'), 2150, Y_GEN0, 58); // Daniel
    this.addNode(this.engine.getPerson('P051'), 2260, Y_GEN0, 82); // Daniela
    this.addNode(this.engine.getPerson('P052'), 2370, Y_GEN0, 58); // Andrés

    // Primos maternos (hijos de Gabriel + Lorena)
    this.addNode(this.engine.getPerson('P053'), 2470, Y_GEN0, 58); // Rodrigo
    this.addNode(this.engine.getPerson('P054'), 2570, Y_GEN0, 82); // Natalia
    this.addNode(this.engine.getPerson('P055'), 2670, Y_GEN0, 58); // Santiago

    // Primos maternos (hijos de Beatriz + Mauricio)
    this.addNode(this.engine.getPerson('P056'), 2780, Y_GEN0, 58); // Julián
    this.addNode(this.engine.getPerson('P057'), 2900, Y_GEN0, 82); // Mariana

    // Construir aristas de filiación (padres -> hijos)
    for (const p of this.engine.getAllPersons()) {
      if (p.id_padre || p.id_madre) {
        const childNode = this.nodes.get(p.id_persona);
        if (!childNode) continue;

        let originX, originY, parentGen = 2;
        const couple = this.coupleLinks.find(
          c => (c.p1 === p.id_padre && c.p2 === p.id_madre) || (c.p1 === p.id_madre && c.p2 === p.id_padre)
        );

        if (couple) {
          originX = couple.mx;
          originY = couple.my;
          parentGen = couple.gen;
        } else {
          const parentNode = this.nodes.get(p.id_padre || p.id_madre);
          if (parentNode) {
            originX = parentNode.x;
            originY = parentNode.y;
            parentGen = parentNode.gen;
          }
        }

        if (originX !== undefined && originY !== undefined) {
          this.parentLinks.push({
            childId: p.id_persona,
            parentId: p.id_padre || p.id_madre,
            fatherId: p.id_padre || null,
            motherId: p.id_madre || null,
            parentGen,
            childGen: childNode.gen,
            x1: originX,
            y1: originY + 44, // Base de la vela / guirnalda
            x2: childNode.x,
            y2: childNode.y - 62 // Cima de la vela del hijo
          });
        }
      }
    }

    return {
      nodes: Array.from(this.nodes.values()),
      coupleLinks: this.coupleLinks,
      parentLinks: this.parentLinks
    };
  }

  addNode(person, x, y, labelOffset = 58) {
    if (!person) return;
    const shortName = person.nombre_completo.split(' ')[0];

    this.nodes.set(person.id_persona, {
      id: person.id_persona,
      person,
      x,
      y,
      gen: person.generacion,
      isDeceased: !person.vivo,
      shortName,
      labelOffset
    });
  }
}
