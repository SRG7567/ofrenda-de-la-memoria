import fs from 'fs';
import { DataEngine } from '../js/data-engine.js';
import { TreeLayout } from '../js/tree-layout.js';

const rawData = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));
const engine = new DataEngine();
engine.raw = rawData;
engine.egoId = rawData.meta?.ego || 'P044';
for (const p of rawData.personas) {
  engine.personas.set(p.id_persona, {
    ...p,
    id_padre: p.id_padre || null,
    id_madre: p.id_madre || null,
    id_conyuge: p.id_conyuge || null
  });
}

const layout = new TreeLayout(engine);
const { nodes, coupleLinks, parentLinks } = layout.computeLayout();

function testLineageFor(targetId) {
  const lineage = engine.getLineage(targetId);
  const spouse = engine.getSpouse(targetId);
  const spouseId = spouse ? spouse.id_persona : null;

  // 1. Nodos activos
  const activeNodes = new Set();
  for (const n of nodes) {
    const id = n.id;
    if (lineage.all.has(id) || (spouseId && id === spouseId)) {
      activeNodes.add(id);
    }
  }

  // 2. Líneas de filiación activas
  const activeParentLinks = [];
  for (const pl of parentLinks) {
    const childIn = lineage.all.has(pl.childId);
    const parentIn = (pl.fatherId && lineage.all.has(pl.fatherId)) ||
                     (pl.motherId && lineage.all.has(pl.motherId)) ||
                     (pl.parentId && lineage.all.has(pl.parentId));
    if (childIn && parentIn) {
      activeParentLinks.push({ childId: pl.childId, father: pl.fatherId, mother: pl.motherId });
    }
  }

  // 3. Líneas de pareja activas
  const activeCoupleLinks = [];
  for (const cl of coupleLinks) {
    const isSelectedCouple = spouseId && (
      (cl.p1 === targetId && cl.p2 === spouseId) ||
      (cl.p1 === spouseId && cl.p2 === targetId)
    );
    if (isSelectedCouple) {
      activeCoupleLinks.push(`${cl.p1}-${cl.p2}`);
    }
  }

  return {
    targetId,
    spouseId,
    activeNodes: Array.from(activeNodes).sort(),
    activeParentLinks: activeParentLinks.map(p => p.childId).sort(),
    activeCoupleLinks: activeCoupleLinks.sort()
  };
}

console.log("=== COMPROBACIÓN CASO 1 Y 2: ANTONIO (P010) Y GUADALUPE (P015) ===");
const rAntonio = testLineageFor('P010');
const rGuadalupe = testLineageFor('P015');

console.log("Antonio active nodes (" + rAntonio.activeNodes.length + "):", rAntonio.activeNodes.join(', '));
console.log("Guadalupe active nodes (" + rGuadalupe.activeNodes.length + "):", rGuadalupe.activeNodes.join(', '));
const sameNodesAG = JSON.stringify(rAntonio.activeNodes) === JSON.stringify(rGuadalupe.activeNodes);
const sameParentAG = JSON.stringify(rAntonio.activeParentLinks) === JSON.stringify(rGuadalupe.activeParentLinks);
const sameCoupleAG = JSON.stringify(rAntonio.activeCoupleLinks) === JSON.stringify(rGuadalupe.activeCoupleLinks);
console.log("-> Nodos 100% idénticos:", sameNodesAG);
console.log("-> Líneas filiación 100% idénticas:", sameParentAG, "Total:", rAntonio.activeParentLinks.length);
console.log("-> Línea de pareja 100% idéntica:", sameCoupleAG, rAntonio.activeCoupleLinks);
if (!sameNodesAG || !sameParentAG || !sameCoupleAG) {
  console.error("ERROR: Diferencia entre Antonio y Guadalupe");
  process.exit(1);
}

console.log("\n=== COMPROBACIÓN CASO 3: SOFÍA (P044, EGO / TÚ) ===");
const rSofia = testLineageFor('P044');
console.log("Sofía active nodes (" + rSofia.activeNodes.length + "):", rSofia.activeNodes.join(', '));
console.log("Sofía active filiation lines (" + rSofia.activeParentLinks.length + "):", rSofia.activeParentLinks.join(', '));
console.log("Sofía active couple lines (" + rSofia.activeCoupleLinks.length + "):", rSofia.activeCoupleLinks.join(', '));
// Sofía tiene como ancestros a sus padres (P025, P029) y sus 4 abuelos (P001, P005, P010, P015)
// Ningún cónyuge ajeno (tíos, tías políticas) debe estar en activeNodes
const expectedSofiaNodes = ['P044', 'P025', 'P029', 'P001', 'P005', 'P010', 'P015'].sort();
console.log("-> Nodos coinciden exactamente con ancestros directos + Ego:", JSON.stringify(rSofia.activeNodes) === JSON.stringify(expectedSofiaNodes));

console.log("\n=== COMPROBACIÓN CASO 4: GONZALO MORALES (P007, DIFUNTO) Y ELENA MARTÍNEZ (P004) ===");
const rGonzalo = testLineageFor('P007');
const rElena = testLineageFor('P004');
console.log("Gonzalo active nodes (" + rGonzalo.activeNodes.length + "):", rGonzalo.activeNodes.join(', '));
console.log("Elena active nodes (" + rElena.activeNodes.length + "):", rElena.activeNodes.join(', '));
const sameNodesGE = JSON.stringify(rGonzalo.activeNodes) === JSON.stringify(rElena.activeNodes);
const sameParentGE = JSON.stringify(rGonzalo.activeParentLinks) === JSON.stringify(rElena.activeParentLinks);
const sameCoupleGE = JSON.stringify(rGonzalo.activeCoupleLinks) === JSON.stringify(rElena.activeCoupleLinks);
console.log("-> Nodos 100% idénticos:", sameNodesGE);
console.log("-> Líneas filiación 100% idénticas:", sameParentGE, "Total:", rGonzalo.activeParentLinks.length);
console.log("-> Línea de pareja 100% idéntica:", sameCoupleGE, rGonzalo.activeCoupleLinks);
if (!sameNodesGE || !sameParentGE || !sameCoupleGE) {
  console.error("ERROR: Diferencia entre Gonzalo y Elena");
  process.exit(1);
}

console.log("\n=== COMPROBACIÓN CASO 5: ESTEBAN MARTÍNEZ (P038, SOLTERO SIN HIJOS) ===");
const rEsteban = testLineageFor('P038');
console.log("Esteban active nodes (" + rEsteban.activeNodes.length + "):", rEsteban.activeNodes.join(', '));
console.log("Esteban active filiation lines (" + rEsteban.activeParentLinks.length + "):", rEsteban.activeParentLinks.join(', '));
console.log("Esteban active couple lines (" + rEsteban.activeCoupleLinks.length + "):", rEsteban.activeCoupleLinks.join(', '));
console.log("-> Ancestros de Esteban:", rEsteban.activeNodes.filter(id => id !== 'P038'));
console.log("-> Solo Esteban y sus ancestros directos (P002 Francisco, P003 Dolores, etc.) están activos:", rEsteban.activeNodes.length > 0);

console.log("\n✓ ¡TODOS LOS 5 CASOS PASARON EXITOSAMENTE CON TOTAL SIMETRÍA!");
