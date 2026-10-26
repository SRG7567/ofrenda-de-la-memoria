/**
 * app.js — Controlador principal del árbol genealógico "Ofrenda de la Memoria"
 * 
 * Gestiona el ciclo de vida, renderizado SVG, interacción pan/zoom con 60 FPS,
 * encuadre preciso con fitToBox (~90% ancho útil), atenuación por generación,
 * resaltado de linaje (ancestros y descendientes), filtros combinados (estado,
 * ciudad, profesión), búsqueda en tiempo real, tooltips flotantes y el ritual
 * de encendido de difuntos.
 */

import { DataEngine } from './data-engine.js';
import { TreeLayout } from './tree-layout.js';

class App {
  constructor() {
    this.engine = new DataEngine();
    this.layout = new TreeLayout(this.engine);

    // Estado de navegación y transformación
    this.selectedPersonId = null;
    this.activeGenFocus = null; // null | '2' | '1' | '0'
    this.activeLineagePersonId = null;
    this.ritualTimeout = null;
    this.filters = {
      status: 'all',
      city: 'all',
      profession: 'all',
      searchTerm: ''
    };

    this.transform = {
      x: 0,
      y: 0,
      k: 1
    };
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.navigatingTimeout = null;
    this.rafPending = false;

    // Elementos DOM principales
    this.appContainer = document.getElementById('app');
    this.viewportContainer = document.getElementById('viewport-container');
    this.treeCanvas = document.getElementById('tree-canvas');
    this.viewportGroup = document.getElementById('viewport-group');
    this.levelGuidesLayer = document.getElementById('level-guides-layer');
    this.coupleLinksLayer = document.getElementById('couple-links-layer');
    this.parentLinksLayer = document.getElementById('parent-links-layer');
    this.nodesLayer = document.getElementById('nodes-layer');
    
    // Ficha
    this.drawer = document.getElementById('person-drawer');
    this.btnCloseDrawer = document.getElementById('btn-close-drawer');
    this.btnDrawerLineage = document.getElementById('btn-drawer-lineage');

    // Botones de Generación y Zoom
    this.btnGenAll = document.getElementById('btn-gen-all');
    this.btnGen2 = document.getElementById('btn-gen-2');
    this.btnGen1 = document.getElementById('btn-gen-1');
    this.btnGen0 = document.getElementById('btn-gen-0');
    this.btnZoomIn = document.getElementById('btn-zoom-in');
    this.btnZoomOut = document.getElementById('btn-zoom-out');
    this.btnZoomReset = document.getElementById('btn-zoom-reset');

    // Herramientas de Fase 2 (Búsqueda, Filtros, Linaje, Tooltip)
    this.inputSearch = document.getElementById('input-search');
    this.btnClearSearch = document.getElementById('btn-clear-search');
    this.searchDropdown = document.getElementById('search-dropdown');
    this.filterStatus = document.getElementById('filter-status');
    this.filterCity = document.getElementById('filter-city');
    this.filterProfession = document.getElementById('filter-profession');
    this.btnToggleLineage = document.getElementById('btn-toggle-lineage');
    this.btnClearAllFilters = document.getElementById('btn-clear-all-filters');
    this.filterCountBadge = document.getElementById('filter-count-badge');
    this.tooltip = document.getElementById('candle-tooltip');

    // Panel de Resumen Demográfico y Memoria Familiar (Fase 3 reducida)
    this.btnToggleSummary = document.getElementById('btn-toggle-summary');
    this.summaryPanel = document.getElementById('summary-panel');
    this.btnCloseSummary = document.getElementById('btn-close-summary');
    this.sumTotalPersons = document.getElementById('sum-total-persons');
    this.sumAlivePersons = document.getElementById('sum-alive-persons');
    this.sumDeceasedPersons = document.getElementById('sum-deceased-persons');
    this.sumAvgYears = document.getElementById('sum-avg-years');
    this.sumGen2Stat = document.getElementById('sum-gen2-stat');
    this.sumGen1Stat = document.getElementById('sum-gen1-stat');
    this.sumGen1Detail = document.getElementById('sum-gen1-detail');
    this.sumGen0Stat = document.getElementById('sum-gen0-stat');
    this.sumGen0Detail = document.getElementById('sum-gen0-detail');
  }

  async init() {
    try {
      await this.engine.load('data/data.json');
      const layoutData = this.layout.computeLayout();

      this.renderTree(layoutData);
      this.populateFilterDropdowns();
      this.setupPanAndZoom();
      this.setupEventListeners();
      this.setupTooltips();

      // Ajuste inicial de la vista con fitToBox
      requestAnimationFrame(() => {
        this.fitToBox(false);
      });

      // Recalcular fitToBox tras asegurar carga tipográfica completa
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          this.fitToBox(false);
        });
      }
    } catch (err) {
      console.error('Error al inicializar la ofrenda:', err);
    }
  }

  populateFilterDropdowns() {
    // Ciudades únicas ordenadas
    const cities = this.engine.getUniqueCities();
    for (const city of cities) {
      const opt = document.createElement('option');
      opt.value = city;
      opt.textContent = city;
      this.filterCity.appendChild(opt);
    }

    // Profesiones únicas ordenadas
    const professions = this.engine.getUniqueProfessions();
    for (const prof of professions) {
      const opt = document.createElement('option');
      opt.value = prof;
      opt.textContent = prof;
      this.filterProfession.appendChild(opt);
    }
  }

  renderTree({ nodes, coupleLinks, parentLinks }) {
    // 1. Renderizar guías y títulos de cada nivel (requisito 4)
    const minX = 200;
    const maxX = 4000;
    this.levelGuidesLayer.innerHTML = `
      <g class="level-guide-group" data-gen="2">
        <text x="${minX}" y="110" class="level-banner-text">Generación 2</text>
        <line x1="${minX}" y1="130" x2="${maxX}" y2="130" class="level-separator-line" />
      </g>
      <g class="level-guide-group" data-gen="1">
        <text x="${minX}" y="610" class="level-banner-text">Generación 1</text>
        <line x1="${minX}" y1="630" x2="${maxX}" y2="630" class="level-separator-line" />
      </g>
      <g class="level-guide-group" data-gen="0">
        <text x="${minX}" y="1110" class="level-banner-text">Generación 0</text>
        <line x1="${minX}" y1="1130" x2="${maxX}" y2="1130" class="level-separator-line" />
      </g>
    `;

    // 2. Renderizar guirnaldas de cónyuges
    let coupleHtml = '';
    for (const c of coupleLinks) {
      coupleHtml += `
        <line class="couple-line"
              data-gen="${c.gen}"
              data-p1="${c.p1}" data-p2="${c.p2}"
              x1="${c.x1}" y1="${c.y1}"
              x2="${c.x2}" y2="${c.y2}" />
      `;
    }
    this.coupleLinksLayer.innerHTML = coupleHtml;

    // 3. Renderizar líneas de filiación (curvas Bézier suaves con atributos de generación)
    let parentHtml = '';
    for (const p of parentLinks) {
      const midY = (p.y1 + p.y2) / 2;
      const d = `M ${p.x1} ${p.y1} C ${p.x1} ${midY}, ${p.x2} ${midY}, ${p.x2} ${p.y2}`;
      parentHtml += `
        <path class="parent-line"
              data-parent-gen="${p.parentGen}"
              data-child-gen="${p.childGen}"
              data-child="${p.childId}"
              data-parent="${p.parentId}"
              data-father="${p.fatherId || ''}"
              data-mother="${p.motherId || ''}"
              d="${d}" />
      `;
    }
    this.parentLinksLayer.innerHTML = parentHtml;

    // 4. Renderizar velas (nodos) aumentadas para aprovechamiento de pantalla y lectura
    let nodesHtml = '';
    for (const n of nodes) {
      const p = n.person;
      const isDeceased = n.isDeceased;
      const ariaLabel = `${p.nombre_completo}, ${isDeceased ? 'fallecido' : 'vivo'}`;

      // Duración y desfase del parpadeo orgánico derivados del ID (entre 1.8s y 2.9s)
      const idNum = parseInt(p.id_persona.replace(/\D/g, ''), 10) || 1;
      const flameDur = (1.8 + ((idNum * 7) % 12) * 0.1).toFixed(2);
      const flameDelay = (-((idNum * 13) % 25) * 0.12).toFixed(2);

      nodesHtml += `
        <g class="candle-node ${isDeceased ? 'deceased' : 'alive'}"
           id="node-${n.id}" data-id="${n.id}" data-gen="${n.gen}"
           transform="translate(${n.x}, ${n.y})"
           tabindex="0" role="button" aria-label="${ariaLabel}">
          
          <!-- Anillo de selección neón cian / linaje cempasúchil -->
          <circle class="selection-ring" cx="0" cy="0" r="50" />

          <!-- Cuerpo de cera artesanal (forma reutilizada de defs, idéntico en las 57 velas) -->
          <g class="candle-body">
            <use href="#candle-artistic-body" />
          </g>

          ${!isDeceased ? `
            <!-- Llama viva multicapa con parpadeo orgánico individual (transform/opacity) -->
            <g class="flame" style="--flame-dur: ${flameDur}s; --flame-delay: ${flameDelay}s;">
              <use href="#flame-artistic-layers" />
            </g>
          ` : `
            <!-- Vela apagada: Hilo de brasa tenue en la punta del pábilo -->
            <circle class="candle-ember" cx="-0.8" cy="-44" r="1.4" />

            <!-- Halo espectral violeta reforzado y humo -->
            <ellipse class="ghost-halo" cx="0" cy="-45" rx="30" ry="15" filter="url(#glow-violet)" />
            <ellipse class="ghost-halo-inner" cx="0" cy="-45" rx="17" ry="8" />
            <path class="smoke-trail" d="M 0,-45 Q 8,-60 -3,-74 T 5,-90" />
            
            <!-- Llama violeta del ritual de difuntos (oculta hasta hacer clic) -->
            <path class="ritual-flame" filter="url(#glow-violet)" fill="url(#flame-violet-grad)"
                  d="M 0,-76 C 12,-62 14,-50 9,-40 C 5,-33 -5,-33 -9,-40 C -14,-50 -12,-62 0,-76 Z" />
          `}

          <!-- Etiqueta con altura alternada para evitar cualquier encimado -->
          <text class="candle-label" x="0" y="${n.labelOffset || 58}">${n.shortName}</text>
        </g>
      `;
    }
    this.nodesLayer.innerHTML = nodesHtml;
  }

  setupEventListeners() {
    // Delegación de eventos en las velas (clic y teclado)
    this.nodesLayer.addEventListener('click', (e) => {
      const node = e.target.closest('.candle-node');
      if (node) {
        const id = node.dataset.id;
        this.handleNodeClick(id, node);
      }
    });

    this.nodesLayer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const node = e.target.closest('.candle-node');
        if (node) {
          e.preventDefault();
          this.handleNodeClick(node.dataset.id, node);
        }
      }
    });

    // Cerrar ficha
    this.btnCloseDrawer.addEventListener('click', () => {
      this.closeDrawer();
    });

    // Controles de Panel de Resumen (Fase 3 reducida)
    if (this.btnToggleSummary) {
      this.btnToggleSummary.addEventListener('click', () => {
        this.toggleSummary();
      });
    }

    if (this.btnCloseSummary) {
      this.btnCloseSummary.addEventListener('click', () => {
        this.closeSummary();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDrawer();
        this.closeSearchDropdown();
        this.closeSummary();
      }
    });

    // Botón "Ver todo": restablece encuadre al 90% ancho útil y quita foco
    this.btnGenAll.addEventListener('click', () => {
      this.setGenerationFocus(null);
      this.fitToBox(true);
    });

    // Botones de generación (Requisito 2: NO mueven ni acercan la vista)
    const genButtons = [
      { btn: this.btnGen2, gen: '2' },
      { btn: this.btnGen1, gen: '1' },
      { btn: this.btnGen0, gen: '0' }
    ];

    for (const item of genButtons) {
      item.btn.addEventListener('click', () => {
        if (this.activeGenFocus === item.gen) {
          this.setGenerationFocus(null);
        } else {
          this.setGenerationFocus(item.gen);
        }
      });
    }

    // Botones de Zoom
    this.btnZoomIn.addEventListener('click', () => this.zoomStep(1.15));
    this.btnZoomOut.addEventListener('click', () => this.zoomStep(0.85));
    this.btnZoomReset.addEventListener('click', () => {
      this.setGenerationFocus(null);
      this.fitToBox(true);
    });

    // Redimensionamiento de ventana: ejecuta fitToBox
    window.addEventListener('resize', () => {
      this.fitToBox(false);
    });

    // Pausar animaciones cuando la pestaña no está visible para ahorrar CPU/batería
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        document.body.classList.add('is-tab-hidden');
      } else {
        document.body.classList.remove('is-tab-hidden');
      }
    });

    // --- Herramientas de Fase 2 ---
    // 1. Resaltado de linaje (botón barra superior y botón en ficha)
    this.btnToggleLineage.addEventListener('click', () => {
      if (this.selectedPersonId) {
        this.toggleLineage(this.selectedPersonId);
      }
    });

    if (this.btnDrawerLineage) {
      this.btnDrawerLineage.addEventListener('click', () => {
        if (this.selectedPersonId) {
          this.toggleLineage(this.selectedPersonId);
        }
      });
    }

    // 2. Filtros combinados (Estado, Ciudad, Profesión)
    this.filterStatus.addEventListener('change', () => {
      this.filters.status = this.filterStatus.value;
      this.applyFilters();
    });

    this.filterCity.addEventListener('change', () => {
      this.filters.city = this.filterCity.value;
      this.applyFilters();
    });

    this.filterProfession.addEventListener('change', () => {
      this.filters.profession = this.filterProfession.value;
      this.applyFilters();
    });

    this.btnClearAllFilters.addEventListener('click', () => {
      this.clearFilters();
    });

    // 3. Búsqueda por nombre en vivo
    this.inputSearch.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      this.filters.searchTerm = val;
      this.btnClearSearch.classList.toggle('hidden', val.length === 0);
      this.applyFilters();
      this.updateSearchDropdown(val);
    });

    this.inputSearch.addEventListener('focus', () => {
      const val = this.inputSearch.value.trim();
      if (val.length > 0) {
        this.updateSearchDropdown(val);
      }
    });

    this.btnClearSearch.addEventListener('click', () => {
      this.inputSearch.value = '';
      this.filters.searchTerm = '';
      this.btnClearSearch.classList.add('hidden');
      this.closeSearchDropdown();
      this.applyFilters();
    });

    // Cerrar dropdown de búsqueda al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        this.closeSearchDropdown();
      }
    });
  }

  /**
   * Maneja el clic en un nodo: si es fallecido, ejecuta el ritual de encendido.
   */
  handleNodeClick(id, nodeElement) {
    const person = this.engine.getPerson(id);
    if (!person) return;

    if (!person.vivo) {
      this.triggerRitual(nodeElement);
    }

    this.selectPerson(id, true);

    // Si el linaje está activo, actualizarlo con la nueva persona
    if (this.activeLineagePersonId !== null) {
      this.activeLineagePersonId = id;
      this.updateLineageVisuals();
    }
  }

  /**
   * Ritual de encendido de difuntos (docs/DISENO.md):
   * La vela se enciende un momento con llama violeta espectral y se abre su ficha.
   * Después de unos segundos, vuelve a apagarse suavemente.
   */
  triggerRitual(nodeElement) {
    if (!nodeElement) return;

    // Remover clase previa si estaba animando
    nodeElement.classList.remove('ritual-active');
    void nodeElement.offsetWidth; // Forzar reflujo para reiniciar animación
    nodeElement.classList.add('ritual-active');

    if (this.ritualTimeout) clearTimeout(this.ritualTimeout);
    this.ritualTimeout = setTimeout(() => {
      nodeElement.classList.remove('ritual-active');
    }, 2200);
  }

  /**
   * Tooltip corto al pasar el cursor o hacer foco en una vela:
   * Muestra estado, nombre completo y fechas/años cumplidos.
   */
  setupTooltips() {
    const showTooltip = (node, clientX, clientY) => {
      const id = node.dataset.id;
      const person = this.engine.getPerson(id);
      if (!person) return;

      const ageInfo = this.engine.calculateAge(person);
      const isDeceased = !person.vivo;

      let datesStr = '';
      if (isDeceased) {
        const yNac = person.fecha_nacimiento ? person.fecha_nacimiento.split('-')[0] : '—';
        const yFall = person.fecha_fallecimiento ? person.fecha_fallecimiento.split('-')[0] : '—';
        datesStr = `${yNac} – ${yFall} (${ageInfo?.label || ''})`;
      } else {
        const yNac = person.fecha_nacimiento ? person.fecha_nacimiento.split('-')[0] : '—';
        datesStr = `Nac. ${yNac} (${ageInfo?.label || ''})`;
      }

      this.tooltip.innerHTML = `
        <div class="tooltip-header">
          <span class="tooltip-dot ${isDeceased ? 'deceased' : 'alive'}"></span>
          <span class="tooltip-name">${person.nombre_completo}</span>
        </div>
        <div class="tooltip-dates">${datesStr}</div>
      `;

      this.tooltip.classList.remove('hidden');
      this.positionTooltip(clientX, clientY);
    };

    this.nodesLayer.addEventListener('pointerenter', (e) => {
      const node = e.target.closest('.candle-node');
      if (node && !this.isDragging) {
        showTooltip(node, e.clientX, e.clientY);
      }
    }, true);

    this.nodesLayer.addEventListener('pointermove', (e) => {
      if (!this.tooltip.classList.contains('hidden') && !this.isDragging) {
        this.positionTooltip(e.clientX, e.clientY);
      }
    });

    this.nodesLayer.addEventListener('pointerleave', (e) => {
      const node = e.target.closest('.candle-node');
      if (node) {
        this.hideTooltip();
      }
    }, true);

    // Soporte para foco con teclado
    this.nodesLayer.addEventListener('focusin', (e) => {
      const node = e.target.closest('.candle-node');
      if (node) {
        const rect = node.getBoundingClientRect();
        showTooltip(node, rect.left + rect.width / 2, rect.top);
      }
    });

    this.nodesLayer.addEventListener('focusout', () => {
      this.hideTooltip();
    });
  }

  positionTooltip(x, y) {
    const pad = 16;
    const tooltipW = 240;
    const tooltipH = 80;

    let posX = x + pad;
    let posY = y + pad;

    if (posX + tooltipW > window.innerWidth - 10) {
      posX = x - tooltipW - pad;
    }
    if (posY + tooltipH > window.innerHeight - 10) {
      posY = y - tooltipH - pad;
    }

    this.tooltip.style.left = `${Math.max(posX, 10)}px`;
    this.tooltip.style.top = `${Math.max(posY, 10)}px`;
  }

  hideTooltip() {
    this.tooltip.classList.add('hidden');
  }

  /**
   * Resaltado de linaje (ancestros y descendientes directos):
   * Las líneas del linaje pasan a cempasúchil brillante y el resto se atenúa.
   */
  toggleLineage(personId) {
    if (this.activeLineagePersonId === personId) {
      this.clearLineage();
    } else {
      this.activeLineagePersonId = personId;
      this.updateLineageVisuals();
    }
  }

  clearLineage() {
    this.activeLineagePersonId = null;
    this.viewportContainer.removeAttribute('data-foco-linaje');

    document.querySelectorAll('.candle-node').forEach(node => {
      node.removeAttribute('data-in-lineage');
    });
    document.querySelectorAll('.parent-line, .couple-line').forEach(link => {
      link.removeAttribute('data-in-lineage');
    });

    this.btnToggleLineage.classList.remove('active');
    this.btnToggleLineage.setAttribute('aria-pressed', 'false');
    if (this.btnDrawerLineage) {
      this.btnDrawerLineage.classList.remove('active');
    }
  }

  updateLineageVisuals() {
    if (!this.activeLineagePersonId) return;

    const targetId = this.activeLineagePersonId;
    const lineage = this.engine.getLineage(targetId);
    const spouse = this.engine.getSpouse(targetId);
    const spouseId = spouse ? spouse.id_persona : null;

    this.viewportContainer.setAttribute('data-foco-linaje', 'true');

    // 1. Nodos: la persona seleccionada + sus ancestros + sus descendientes + pareja de la seleccionada
    document.querySelectorAll('.candle-node').forEach(node => {
      const id = node.dataset.id;
      const inLineage = lineage.all.has(id) || (spouseId && id === spouseId);
      node.setAttribute('data-in-lineage', inLineage ? 'true' : 'false');
    });

    // 2. Líneas de filiación: se encienden si el hijo está en el linaje Y al menos uno de sus padres está en el linaje
    document.querySelectorAll('.parent-line').forEach(line => {
      const child = line.dataset.child;
      const father = line.dataset.father;
      const mother = line.dataset.mother;
      const parent = line.dataset.parent;

      const childIn = lineage.all.has(child);
      const parentIn = (father && lineage.all.has(father)) ||
                       (mother && lineage.all.has(mother)) ||
                       (parent && lineage.all.has(parent));
      const inLineage = childIn && parentIn;

      line.setAttribute('data-in-lineage', inLineage ? 'true' : 'false');
    });

    // 3. Líneas de pareja: la pareja de la persona seleccionada se enciende con su guirnalda.
    // Los cónyuges de ancestros y descendientes siguen atenuados.
    document.querySelectorAll('.couple-line').forEach(line => {
      const p1 = line.dataset.p1;
      const p2 = line.dataset.p2;
      const isSelectedCouple = spouseId && (
        (p1 === targetId && p2 === spouseId) ||
        (p1 === spouseId && p2 === targetId)
      );
      line.setAttribute('data-in-lineage', isSelectedCouple ? 'true' : 'false');
    });

    this.btnToggleLineage.classList.add('active');
    this.btnToggleLineage.setAttribute('aria-pressed', 'true');
    if (this.btnDrawerLineage) {
      this.btnDrawerLineage.classList.add('active');
    }
  }

  /**
   * Aplica los filtros combinados (estado, ciudad, profesión, búsqueda).
   */
  applyFilters() {
    const hasActiveFilter =
      this.filters.status !== 'all' ||
      this.filters.city !== 'all' ||
      this.filters.profession !== 'all' ||
      (this.filters.searchTerm && this.filters.searchTerm.trim() !== '');

    if (hasActiveFilter) {
      this.viewportContainer.setAttribute('data-foco-filtro', 'true');
      let count = 0;

      document.querySelectorAll('.candle-node').forEach(node => {
        const id = node.dataset.id;
        const person = this.engine.getPerson(id);
        const matches = this.engine.matchesFilters(person, this.filters);
        node.setAttribute('data-filter-match', matches ? 'true' : 'false');
        if (matches) count++;
      });

      this.filterCountBadge.textContent = `${count} / 57`;
    } else {
      this.viewportContainer.removeAttribute('data-foco-filtro');
      document.querySelectorAll('.candle-node').forEach(node => {
        node.removeAttribute('data-filter-match');
      });
      this.filterCountBadge.textContent = '57 / 57';
    }
  }

  clearFilters() {
    this.filterStatus.value = 'all';
    this.filterCity.value = 'all';
    this.filterProfession.value = 'all';
    this.inputSearch.value = '';
    this.btnClearSearch.classList.add('hidden');
    this.closeSearchDropdown();

    this.filters = {
      status: 'all',
      city: 'all',
      profession: 'all',
      searchTerm: ''
    };

    this.applyFilters();
  }

  /**
   * Actualiza el desplegable de resultados de búsqueda por nombre.
   */
  updateSearchDropdown(query) {
    if (!query) {
      this.closeSearchDropdown();
      return;
    }

    const matches = this.engine.getAllPersons().filter(p =>
      p.nombre_completo.toLowerCase().includes(query.toLowerCase())
    );

    if (matches.length === 0) {
      this.searchDropdown.innerHTML = `
        <div class="search-empty">Sin resultados para "${query}"</div>
      `;
    } else {
      let html = '';
      for (const p of matches) {
        const isDeceased = !p.vivo;
        html += `
          <div class="search-item" data-id="${p.id_persona}" role="option" tabindex="0">
            <span class="search-dot ${isDeceased ? 'deceased' : 'alive'}"></span>
            <div class="search-info">
              <div class="search-name">${p.nombre_completo}</div>
              <div class="search-meta">Generación ${p.generacion} · ${isDeceased ? 'Fallecido' : 'Vivo'}</div>
            </div>
          </div>
        `;
      }
      this.searchDropdown.innerHTML = html;

      // Eventos de selección de resultado
      this.searchDropdown.querySelectorAll('.search-item').forEach(item => {
        item.addEventListener('click', () => {
          const id = item.dataset.id;
          const node = document.getElementById(`node-${id}`);
          if (node) {
            this.handleNodeClick(id, node);
            this.centerOnNode(id);
          }
          this.closeSearchDropdown();
        });
      });
    }

    this.searchDropdown.classList.remove('hidden');
  }

  closeSearchDropdown() {
    this.searchDropdown.classList.add('hidden');
  }

  /**
   * Requisito 2: Establece u oculta el foco en una generación dada.
   * NO mueve la cámara ni acerca la vista. Transición suave vía CSS (~250ms).
   */
  setGenerationFocus(gen) {
    this.activeGenFocus = gen;

    if (gen !== null) {
      this.viewportContainer.setAttribute('data-foco-gen', gen);
    } else {
      this.viewportContainer.removeAttribute('data-foco-gen');
    }

    // Actualizar clases .active en los botones de navegación
    this.btnGenAll.classList.toggle('active', gen === null);
    this.btnGen2.classList.toggle('active', gen === '2');
    this.btnGen1.classList.toggle('active', gen === '1');
    this.btnGen0.classList.toggle('active', gen === '0');
  }

  /**
   * Requisito 1 y 2 (Mini-fase Ambientación): Función única fitToBox que muestra
   * el árbol completo dentro de la zona libre del fondo de ofrenda:
   * - Respeta los arcos laterales (~9% a cada lado calculados del viewport).
   * - Queda encima de la franja inferior de flores y calaveras (~13% de la altura).
   * - Se mantiene centrado debajo del encabezado y filtros sin tocar adornos.
   */
  fitToBox(transition = true) {
    const containerW = this.viewportContainer.clientWidth;
    const containerH = this.viewportContainer.clientHeight;
    if (!containerW || !containerH) return;

    const bbox = this.viewportGroup.getBBox();
    if (!bbox || !bbox.width || !bbox.height) return;

    // Márgenes dinámicos basados en la zona libre del fondo de ofrenda (Requisito 2):
    // Arcos laterales ocupan ~9% a cada lado del ancho
    const marginLateral = containerW * 0.09;
    const usefulW = containerW - (marginLateral * 2);

    // Franja inferior de flores y calaveras (~13% de la altura) + espacio de leyenda fija
    const legend = document.querySelector('.fixed-legend');
    const legendH = legend ? (legend.offsetHeight + 18) : 58;
    const bottomDecorH = containerH * 0.13;
    const marginBottom = Math.max(bottomDecorH, legendH);
    const topPad = 24; // Separación bajo el encabezado y barra de filtros
    const usefulH = Math.max(containerH - marginBottom - topPad, 100);

    // Escala que llena la zona libre útil sin tocar arcos laterales ni flores inferiores
    const scaleX = usefulW / bbox.width;
    const scaleY = usefulH / bbox.height;
    const k = Math.min(scaleX, scaleY);

    // Centros reales del árbol y de la zona libre visible
    const treeCenterX = bbox.x + bbox.width / 2;
    const treeCenterY = bbox.y + bbox.height / 2;

    const targetCenterX = marginLateral + (usefulW / 2);
    const targetCenterY = topPad + (usefulH / 2);

    this.transform.k = k;
    this.transform.x = targetCenterX - (treeCenterX * k);
    this.transform.y = targetCenterY - (treeCenterY * k);

    this.applyTransform(transition);
  }

  setupPanAndZoom() {
    let startX = 0;
    let startY = 0;

    const startNavigating = () => {
      this.appContainer.classList.add('is-navigating');
      if (this.navigatingTimeout) clearTimeout(this.navigatingTimeout);
    };

    const stopNavigatingDebounced = () => {
      if (this.navigatingTimeout) clearTimeout(this.navigatingTimeout);
      this.navigatingTimeout = setTimeout(() => {
        this.appContainer.classList.remove('is-navigating');
      }, 160);
    };

    const onPointerDown = (e) => {
      if (e.target.closest('.candle-node') || e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) return;
      this.isDragging = true;
      startX = e.clientX - this.transform.x;
      startY = e.clientY - this.transform.y;
      startNavigating();
    };

    const onPointerMove = (e) => {
      if (!this.isDragging) return;
      this.transform.x = e.clientX - startX;
      this.transform.y = e.clientY - startY;
      this.constrainTransform();
      this.requestRenderTransform(false);
    };

    const onPointerUp = () => {
      if (this.isDragging) {
        this.isDragging = false;
        stopNavigatingDebounced();
      }
    };

    this.viewportContainer.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    // Doble clic para acercar centrado en cursor
    this.viewportContainer.addEventListener('dblclick', (e) => {
      if (e.target.closest('.candle-node') || e.target.closest('button')) return;
      const rect = this.viewportContainer.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      this.zoomToPoint(mouseX, mouseY, 1.35, true);
    });

    // Soporte Touch
    this.viewportContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1 && !e.target.closest('.candle-node') && !e.target.closest('button')) {
        this.isDragging = true;
        startX = e.touches[0].clientX - this.transform.x;
        startY = e.touches[0].clientY - this.transform.y;
        startNavigating();
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      this.transform.x = e.touches[0].clientX - startX;
      this.transform.y = e.touches[0].clientY - startY;
      this.constrainTransform();
      this.requestRenderTransform(false);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      if (this.isDragging) {
        this.isDragging = false;
        stopNavigatingDebounced();
      }
    });

    // Zoom con rueda suave con pasos pequeños centrados en el cursor
    this.viewportContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      startNavigating();

      const zoomFactor = e.deltaY < 0 ? 1.055 : 0.948;
      const rect = this.viewportContainer.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      this.zoomToPoint(mouseX, mouseY, zoomFactor, false);
      stopNavigatingDebounced();
    }, { passive: false });
  }

  zoomToPoint(pointX, pointY, factor, transition = false) {
    const minK = 0.15;
    const maxK = 2.8;
    const newK = Math.min(Math.max(this.transform.k * factor, minK), maxK);

    this.transform.x = pointX - (pointX - this.transform.x) * (newK / this.transform.k);
    this.transform.y = pointY - (pointY - this.transform.y) * (newK / this.transform.k);
    this.transform.k = newK;

    this.constrainTransform();
    this.applyTransform(transition);
  }

  requestRenderTransform(transition = false) {
    if (this.rafPending) return;
    this.rafPending = true;
    requestAnimationFrame(() => {
      this.applyTransform(transition);
      this.rafPending = false;
    });
  }

  applyTransform(transition = false) {
    if (transition) {
      this.viewportGroup.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    } else {
      this.viewportGroup.style.transition = 'none';
    }
    this.viewportGroup.setAttribute(
      'transform',
      `translate(${this.transform.x}, ${this.transform.y}) scale(${this.transform.k})`
    );
  }

  constrainTransform() {
    const rect = this.viewportContainer.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const bbox = this.viewportGroup.getBBox();
    const treeW = (bbox?.width || 3800) * this.transform.k;
    const treeH = (bbox?.height || 1350) * this.transform.k;
    const offsetX = (bbox?.x || 0) * this.transform.k;
    const offsetY = (bbox?.y || 0) * this.transform.k;

    const marginX = rect.width * 0.85;
    const marginY = rect.height * 0.85;

    const minX = -offsetX - treeW + (rect.width - marginX);
    const maxX = -offsetX + marginX;
    const minY = -offsetY - treeH + (rect.height - marginY);
    const maxY = -offsetY + marginY;

    this.transform.x = Math.min(Math.max(this.transform.x, minX), maxX);
    this.transform.y = Math.min(Math.max(this.transform.y, minY), maxY);
  }

  zoomStep(factor) {
    const rect = this.viewportContainer.getBoundingClientRect();
    this.zoomToPoint(rect.width / 2, rect.height / 2, factor, true);
  }

  selectPerson(id, openDrawer = true) {
    this.selectedPersonId = id;
    const person = this.engine.getPerson(id);
    if (!person) return;

    // Actualizar anillo visual de selección en el SVG
    document.querySelectorAll('.candle-node').forEach(node => {
      node.classList.toggle('selected', node.dataset.id === id);
    });

    if (openDrawer) {
      this.populateDrawer(person);
      this.openDrawer();
    }
  }

  /**
   * Ficha de persona sin códigos técnicos visibles.
   * Fechas como "8 de junio de 2007" y edad/años cumplidos como "80 años vividos" o "19 años".
   */
  populateDrawer(person) {
    const isDeceased = !person.vivo;
    const ageInfo = this.engine.calculateAge(person);

    // 1. Estado y badge
    const badge = document.getElementById('drawer-status-badge');
    const badgeText = document.getElementById('drawer-status-text');
    if (isDeceased) {
      badge.className = 'drawer-status-badge deceased';
      badgeText.textContent = 'En la memoria (Fallecido)';
    } else {
      badge.className = 'drawer-status-badge alive';
      badgeText.textContent = 'Vive con nosotros';
    }

    // 2. Nombre (sin códigos técnicos ni IDs)
    document.getElementById('drawer-person-name').textContent = person.nombre_completo;

    // 3. Fechas en formato largo en español: "8 de junio de 2007"
    document.getElementById('drawer-birth-date').textContent =
      this.engine.formatDate(person.fecha_nacimiento);

    const deathLabel = document.getElementById('drawer-death-label');
    const deathValue = document.getElementById('drawer-death-date');
    if (isDeceased) {
      deathLabel.textContent = 'Fallecimiento';
      deathValue.textContent = this.engine.formatDate(person.fecha_fallecimiento);
    } else {
      deathLabel.textContent = 'Estado';
      deathValue.textContent = 'Vive';
    }

    // Años cumplidos: "80 años vividos" o "19 años" (sin la etiqueta de calculado)
    document.getElementById('drawer-calculated-age').textContent = ageInfo?.label || '—';

    // 4. Trayectoria Vital (sin modificar datos de ciudades)
    document.getElementById('drawer-origin-city').textContent = person.ciudad_origen || 'No registrada';
    document.getElementById('drawer-profession').textContent = person.profesion || 'No especificada';
    document.getElementById('drawer-civil-status').textContent = person.estado_civil || 'No registrado';

    // Otras ciudades donde vivió (mostradas intactas)
    const citiesContainer = document.getElementById('drawer-cities-list');
    citiesContainer.innerHTML = '';
    if (person.otras_ciudades_donde_vivio && person.otras_ciudades_donde_vivio.trim() !== '') {
      const cities = person.otras_ciudades_donde_vivio
        .split(';')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      for (const city of cities) {
        const chip = document.createElement('span');
        chip.className = 'city-chip';
        chip.textContent = city;
        citiesContainer.appendChild(chip);
      }
    } else {
      citiesContainer.innerHTML = '<span class="city-chip">Solo residió en su ciudad de origen</span>';
    }

    // 5. Historia Personal
    document.getElementById('drawer-bio-text').textContent =
      person.historia_personal || 'Sin historia registrada.';

    // 6. Información Médica (respetando texto textual sin interpretar)
    document.getElementById('drawer-medical-info').textContent =
      person.informacion_medica || 'Sin información médica registrada.';

    // 7. Familiares Directos Clicables (sexo-dependiente "Hijo" o "Hija", sin códigos técnicos)
    const relativesContainer = document.getElementById('drawer-relatives-list');
    relativesContainer.innerHTML = '';

    const relatives = [];
    // Padres
    for (const p of this.engine.getParents(person.id_persona)) {
      relatives.push({ person: p, role: p.sexo === 'M' ? 'Padre' : 'Madre' });
    }
    // Cónyuge
    const spouse = this.engine.getSpouse(person.id_persona);
    if (spouse) {
      relatives.push({ person: spouse, role: 'Cónyuge' });
    }
    // Hijos (clasificación estricta: Hijo o Hija, sin "Hijo/a")
    for (const c of this.engine.getChildren(person.id_persona)) {
      relatives.push({ person: c, role: c.sexo === 'M' ? 'Hijo' : 'Hija' });
    }
    // Hermanos
    for (const s of this.engine.getSiblings(person.id_persona)) {
      relatives.push({ person: s, role: s.sexo === 'M' ? 'Hermano' : 'Hermana' });
    }

    if (relatives.length === 0) {
      relativesContainer.innerHTML = '<span style="font-size:0.8rem; color:var(--texto-atenuado);">Sin parientes directos vinculados en el árbol.</span>';
    } else {
      for (const item of relatives) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'relative-btn';
        btn.innerHTML = `
          <span>${item.person.nombre_completo}</span>
          <span class="relative-btn-tag">${item.role}</span>
        `;
        btn.addEventListener('click', () => {
          const targetNode = document.getElementById(`node-${item.person.id_persona}`);
          this.handleNodeClick(item.person.id_persona, targetNode);
          this.centerOnNode(item.person.id_persona);
        });
        relativesContainer.appendChild(btn);
      }
    }

    // Actualizar estado del botón de linaje en la ficha
    if (this.btnDrawerLineage) {
      const isCurrentInLineage = this.activeLineagePersonId === person.id_persona;
      this.btnDrawerLineage.classList.toggle('active', isCurrentInLineage);
    }
  }

  centerOnNode(id) {
    const nodeData = this.layout.nodes.get(id);
    if (!nodeData) return;

    const rect = this.viewportContainer.getBoundingClientRect();
    const drawerOffset = window.innerWidth > 768 && this.drawer.classList.contains('open') ? 200 : 0;
    
    this.transform.x = ((rect.width - drawerOffset) / 2) - (nodeData.x * this.transform.k);
    this.transform.y = (rect.height / 2) - (nodeData.y * this.transform.k);

    this.constrainTransform();
    this.applyTransform(true);
  }

  openDrawer() {
    this.drawer.classList.add('open');
    this.drawer.setAttribute('aria-hidden', 'false');
  }

  closeDrawer() {
    this.drawer.classList.remove('open');
    this.drawer.setAttribute('aria-hidden', 'true');
  }

  /**
   * Fase 3 reducida: Panel de Resumen Demográfico.
   * Rellena y abre/cierra el panel con cifras calculadas desde data.json.
   */
  toggleSummary() {
    if (this.summaryPanel && !this.summaryPanel.classList.contains('hidden')) {
      this.closeSummary();
    } else {
      this.openSummary();
    }
  }

  openSummary() {
    if (!this.summaryPanel) return;

    const m = this.engine.getSummaryMetrics();

    // Totales globales
    this.sumTotalPersons.textContent = m.total;
    this.sumAlivePersons.textContent = m.aliveCount;
    this.sumDeceasedPersons.textContent = m.deceasedCount;
    this.sumAvgYears.textContent = m.avgLivedOverall;

    // Gen 2 — Abuelos y tíos abuelos
    this.sumGen2Stat.textContent = `${m.gen2.deceasedCount} de ${m.gen2.total}`;

    // Gen 1 — Padres y tíos (1 fallecido → dato individual)
    this.sumGen1Stat.textContent = `${m.gen1.deceasedCount} de ${m.gen1.total}`;
    if (m.gen1.deceasedList.length === 1) {
      const d = m.gen1.deceasedList[0];
      this.sumGen1Detail.textContent = `${d.firstName} vivió ${d.years} años`;
      this.sumGen1Detail.style.display = '';
    } else {
      this.sumGen1Detail.textContent = '';
      this.sumGen1Detail.style.display = 'none';
    }

    // Gen 0 — Tu generación y primos (1 fallecido → dato individual)
    this.sumGen0Stat.textContent = `${m.gen0.deceasedCount} de ${m.gen0.total}`;
    if (m.gen0.deceasedList.length === 1) {
      const d = m.gen0.deceasedList[0];
      this.sumGen0Detail.textContent = `${d.firstName} vivió ${d.years} años`;
      this.sumGen0Detail.style.display = '';
    } else {
      this.sumGen0Detail.textContent = '';
      this.sumGen0Detail.style.display = 'none';
    }

    this.summaryPanel.classList.remove('hidden');
    this.btnToggleSummary.classList.add('active');
    this.btnToggleSummary.setAttribute('aria-expanded', 'true');

    // Foco accesible en el botón de cierre
    requestAnimationFrame(() => {
      this.btnCloseSummary && this.btnCloseSummary.focus();
    });
  }

  closeSummary() {
    if (!this.summaryPanel) return;
    this.summaryPanel.classList.add('hidden');
    this.btnToggleSummary && this.btnToggleSummary.classList.remove('active');
    this.btnToggleSummary && this.btnToggleSummary.setAttribute('aria-expanded', 'false');
  }
}

// Iniciar aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
