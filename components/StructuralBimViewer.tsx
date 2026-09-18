'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Activity,
  Maximize2,
  Sliders,
  CheckCircle2,
  Info,
  Radio,
  Sparkles,
  ShieldAlert,
  Compass,
} from 'lucide-react';

export type StructuralModelType = 'manor-build' | 'greenslade' | 'kainga-ora';

interface Node3D {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  layer: 'substructure' | 'columns' | 'trusses' | 'slabs' | 'connections';
  spec: string;
  code: string;
  stressRatio: number; // 0 to 1
}

interface Member3D {
  from: string;
  to: string;
  type: 'pile' | 'column' | 'rafter' | 'purlin' | 'truss' | 'brace' | 'slab';
  layer: 'substructure' | 'columns' | 'trusses' | 'slabs' | 'connections';
  section: string;
  stress: number; // 0 to 1
}

export default function StructuralBimViewer({
  defaultModel = 'manor-build',
  className = '',
}: {
  defaultModel?: StructuralModelType;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Model & View State
  const [activeModel, setActiveModel] = useState<StructuralModelType>(defaultModel);
  const [renderMode, setRenderMode] = useState<'wireframe' | 'stress' | 'lidar'>('wireframe');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: 22, y: -35 });
  const [zoom, setZoom] = useState<number>(1.0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Construction Sequence State
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const [constructionProgress, setConstructionProgress] = useState<number>(100); // 0 to 100%

  // Layer Visibility
  const [visibleLayers, setVisibleLayers] = useState({
    substructure: true,
    columns: true,
    trusses: true,
    slabs: true,
    connections: true,
  });

  // Selected / Hovered Node
  const [selectedNode, setSelectedNode] = useState<Node3D | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node3D | null>(null);
  const [screenNodes, setScreenNodes] = useState<Array<Node3D & { sx: number; sy: number }>>([]);

  // Generate 3D geometry based on activeModel
  const getModelData = useCallback((modelType: StructuralModelType) => {
    let nodes: Node3D[] = [];
    let members: Member3D[] = [];

    if (modelType === 'manor-build') {
      // 60m Clear-Span CFS Portal Frame & Truss (Formsteel New Plymouth)
      const bays = [-120, 0, 120];
      const halfSpan = 160; // Represents 30m each side = 60m span
      const colHeight = 110;
      const apexHeight = 175;

      bays.forEach((bz, bIndex) => {
        const p = `b${bIndex}_`;
        // Foundation pad footings
        nodes.push({
          id: `${p}fp_l`,
          name: `Pad Footing L-B${bIndex + 1}`,
          x: -halfSpan,
          y: -25,
          z: bz,
          layer: 'substructure',
          spec: '1200x1200x600 RC Pad w/ 4x M24 Hold Down Bolts',
          code: 'NZS 3101',
          stressRatio: 0.42,
        });
        nodes.push({
          id: `${p}fp_r`,
          name: `Pad Footing R-B${bIndex + 1}`,
          x: halfSpan,
          y: -25,
          z: bz,
          layer: 'substructure',
          spec: '1200x1200x600 RC Pad w/ 4x M24 Hold Down Bolts',
          code: 'NZS 3101',
          stressRatio: 0.45,
        });

        // Column bases
        nodes.push({
          id: `${p}cb_l`,
          name: `Base Plate L-B${bIndex + 1}`,
          x: -halfSpan,
          y: 0,
          z: bz,
          layer: 'connections',
          spec: '25mm Gr350 Baseplate + 4x M24 8.8/TB Bolts',
          code: 'NZS 3404',
          stressRatio: 0.61,
        });
        nodes.push({
          id: `${p}cb_r`,
          name: `Base Plate R-B${bIndex + 1}`,
          x: halfSpan,
          y: 0,
          z: bz,
          layer: 'connections',
          spec: '25mm Gr350 Baseplate + 4x M24 8.8/TB Bolts',
          code: 'NZS 3404',
          stressRatio: 0.58,
        });

        // Column tops / Eaves / Haunches
        nodes.push({
          id: `${p}haunch_l`,
          name: `Eaves Haunch Moment Joint L-B${bIndex + 1}`,
          x: -halfSpan,
          y: colHeight,
          z: bz,
          layer: 'connections',
          spec: 'Stiffened Haunch Joint • 12x M24 Gr 8.8 • 16mm Stiffeners',
          code: 'NZS 3404 / AS 4100',
          stressRatio: 0.88,
        });
        nodes.push({
          id: `${p}haunch_r`,
          name: `Eaves Haunch Moment Joint R-B${bIndex + 1}`,
          x: halfSpan,
          y: colHeight,
          z: bz,
          layer: 'connections',
          spec: 'Stiffened Haunch Joint • 12x M24 Gr 8.8 • 16mm Stiffeners',
          code: 'NZS 3404 / AS 4100',
          stressRatio: 0.86,
        });

        // Apex Ridge Joint
        nodes.push({
          id: `${p}apex`,
          name: `Apex Crown Splice B${bIndex + 1}`,
          x: 0,
          y: apexHeight,
          z: bz,
          layer: 'connections',
          spec: '60m Apex Haunch Splice • Formsteel CFS Double C-Section',
          code: 'AS/NZS 4600 / NASH',
          stressRatio: 0.74,
        });

        // Internal Truss Nodes (Pratt / Warren configuration)
        const quarters = [-halfSpan * 0.5, halfSpan * 0.5];
        quarters.forEach((qx, qIndex) => {
          const qy = colHeight + (apexHeight - colHeight) * 0.5;
          nodes.push({
            id: `${p}truss_top_${qIndex}`,
            name: `Truss Top Chord Node B${bIndex + 1}-${qIndex + 1}`,
            x: qx,
            y: qy,
            z: bz,
            layer: 'trusses',
            spec: 'Double Formsteel CFS C350/2.5 Purlin Connector',
            code: 'AS/NZS 4600',
            stressRatio: 0.65,
          });
          nodes.push({
            id: `${p}truss_bot_${qIndex}`,
            name: `Truss Bottom Chord Tie B${bIndex + 1}-${qIndex + 1}`,
            x: qx,
            y: colHeight - 20,
            z: bz,
            layer: 'trusses',
            spec: 'Continuous CFS Bottom Chord Tie',
            code: 'AS/NZS 4600',
            stressRatio: 0.52,
          });
        });

        // Members for this portal frame
        // Piles to Base
        members.push({ from: `${p}fp_l`, to: `${p}cb_l`, type: 'pile', layer: 'substructure', section: 'RC Pile Socket', stress: 0.4 });
        members.push({ from: `${p}fp_r`, to: `${p}cb_r`, type: 'pile', layer: 'substructure', section: 'RC Pile Socket', stress: 0.4 });

        // Columns
        members.push({ from: `${p}cb_l`, to: `${p}haunch_l`, type: 'column', layer: 'columns', section: 'Tapered CFS 450x90x3.0', stress: 0.75 });
        members.push({ from: `${p}cb_r`, to: `${p}haunch_r`, type: 'column', layer: 'columns', section: 'Tapered CFS 450x90x3.0', stress: 0.73 });

        // Rafter chords (60m Clear-Span)
        members.push({ from: `${p}haunch_l`, to: `${p}truss_top_0`, type: 'rafter', layer: 'trusses', section: 'Double C350 Rafter Chord', stress: 0.85 });
        members.push({ from: `${p}truss_top_0`, to: `${p}apex`, type: 'rafter', layer: 'trusses', section: 'Double C350 Rafter Chord', stress: 0.82 });
        members.push({ from: `${p}apex`, to: `${p}truss_top_1`, type: 'rafter', layer: 'trusses', section: 'Double C350 Rafter Chord', stress: 0.83 });
        members.push({ from: `${p}truss_top_1`, to: `${p}haunch_r`, type: 'rafter', layer: 'trusses', section: 'Double C350 Rafter Chord', stress: 0.86 });

        // Internal Truss Webs & Ties
        members.push({ from: `${p}haunch_l`, to: `${p}truss_bot_0`, type: 'truss', layer: 'trusses', section: 'CFS Knee Strut 150x50', stress: 0.68 });
        members.push({ from: `${p}truss_top_0`, to: `${p}truss_bot_0`, type: 'truss', layer: 'trusses', section: 'CFS Vertical Web 100x50', stress: 0.54 });
        members.push({ from: `${p}truss_bot_0`, to: `${p}apex`, type: 'truss', layer: 'trusses', section: 'CFS Diagonal Tie 120x50', stress: 0.62 });
        members.push({ from: `${p}apex`, to: `${p}truss_bot_1`, type: 'truss', layer: 'trusses', section: 'CFS Diagonal Tie 120x50', stress: 0.62 });
        members.push({ from: `${p}truss_top_1`, to: `${p}truss_bot_1`, type: 'truss', layer: 'trusses', section: 'CFS Vertical Web 100x50', stress: 0.54 });
        members.push({ from: `${p}truss_bot_1`, to: `${p}haunch_r`, type: 'truss', layer: 'trusses', section: 'CFS Knee Strut 150x50', stress: 0.68 });
        members.push({ from: `${p}truss_bot_0`, to: `${p}truss_bot_1`, type: 'truss', layer: 'trusses', section: 'CFS Lower Chord Tie', stress: 0.48 });
      });

      // Longitudinal Purlins & Wall Girts across bays
      for (let b = 0; b < bays.length - 1; b++) {
        const curr = `b${b}_`;
        const next = `b${b + 1}_`;
        // Eaves Purlins
        members.push({ from: `${curr}haunch_l`, to: `${next}haunch_l`, type: 'purlin', layer: 'trusses', section: 'Zed Purlin Z200/2.0', stress: 0.35 });
        members.push({ from: `${curr}haunch_r`, to: `${next}haunch_r`, type: 'purlin', layer: 'trusses', section: 'Zed Purlin Z200/2.0', stress: 0.35 });
        // Apex Ridge Purlin
        members.push({ from: `${curr}apex`, to: `${next}apex`, type: 'purlin', layer: 'trusses', section: 'Apex Flanged Purlin Z250', stress: 0.42 });
        // Mid-Chord Purlins
        members.push({ from: `${curr}truss_top_0`, to: `${next}truss_top_0`, type: 'purlin', layer: 'trusses', section: 'Zed Purlin Z200/1.9', stress: 0.32 });
        members.push({ from: `${curr}truss_top_1`, to: `${next}truss_top_1`, type: 'purlin', layer: 'trusses', section: 'Zed Purlin Z200/1.9', stress: 0.32 });
        // Roof Cross-Bracing (Tension Rods)
        members.push({ from: `${curr}haunch_l`, to: `${next}truss_top_0`, type: 'brace', layer: 'trusses', section: 'M16 Tension Rod Bracing', stress: 0.55 });
        members.push({ from: `${curr}truss_top_0`, to: `${next}haunch_l`, type: 'brace', layer: 'trusses', section: 'M16 Tension Rod Bracing', stress: 0.55 });
        members.push({ from: `${curr}apex`, to: `${next}truss_top_1`, type: 'brace', layer: 'trusses', section: 'M16 Tension Rod Bracing', stress: 0.55 });
        members.push({ from: `${curr}truss_top_1`, to: `${next}apex`, type: 'brace', layer: 'trusses', section: 'M16 Tension Rod Bracing', stress: 0.55 });
        // Wall Bracing
        members.push({ from: `${curr}cb_l`, to: `${next}haunch_l`, type: 'brace', layer: 'columns', section: 'Fly Braced CFS Strap 50x2', stress: 0.62 });
        members.push({ from: `${curr}haunch_l`, to: `${next}cb_l`, type: 'brace', layer: 'columns', section: 'Fly Braced CFS Strap 50x2', stress: 0.62 });
      }
    } else if (modelType === 'greenslade') {
      // Greenslade Crescent Apartments (5-Storey Precast Concrete + Steel Hybrid on Deep Bored Piles)
      const storeys = 5;
      const storeyH = 34;
      const gridX = [-90, -30, 30, 90];
      const gridZ = [-70, 70];

      // 1. Deep Bored Piles (Substructure)
      gridX.forEach((gx, ix) => {
        gridZ.forEach((gz, iz) => {
          const pileId = `pile_${ix}_${iz}`;
          nodes.push({
            id: pileId,
            name: `Bored Pile #${ix + 1}${iz === 0 ? 'A' : 'B'}`,
            x: gx,
            y: -55,
            z: gz,
            layer: 'substructure',
            spec: 'Ø750mm Deep Bored RC Pile to 14.5m Alluvial Embedment',
            code: 'NZS 3101 / Geotech',
            stressRatio: 0.48,
          });

          // Ground Beam / Cap node
          const capId = `cap_${ix}_${iz}`;
          nodes.push({
            id: capId,
            name: `Pile Cap Node #${ix + 1}${iz === 0 ? 'A' : 'B'}`,
            x: gx,
            y: 0,
            z: gz,
            layer: 'connections',
            spec: '1400x1400x800 Reinforced Pile Cap with Starter Dowels',
            code: 'NZS 3101:2006',
            stressRatio: 0.55,
          });

          members.push({ from: pileId, to: capId, type: 'pile', layer: 'substructure', section: 'Ø750 RC Bored Pile', stress: 0.45 });
        });
      });

      // Ground Tie Beams
      for (let ix = 0; ix < gridX.length - 1; ix++) {
        members.push({ from: `cap_${ix}_0`, to: `cap_${ix + 1}_0`, type: 'slab', layer: 'substructure', section: '600x500 Ground Tie Beam', stress: 0.38 });
        members.push({ from: `cap_${ix}_1`, to: `cap_${ix + 1}_1`, type: 'slab', layer: 'substructure', section: '600x500 Ground Tie Beam', stress: 0.38 });
      }
      gridX.forEach((_, ix) => {
        members.push({ from: `cap_${ix}_0`, to: `cap_${ix}_1`, type: 'slab', layer: 'substructure', section: '600x500 Ground Tie Beam', stress: 0.4 });
      });

      // 2. 5-Storey Precast Columns, Shear Walls & Composite Slabs
      for (let s = 1; s <= storeys; s++) {
        const yLevel = s * storeyH;
        const prevLevel = (s - 1) * storeyH;

        gridX.forEach((gx, ix) => {
          gridZ.forEach((gz, iz) => {
            const currId = `col_${s}_${ix}_${iz}`;
            const isTop = s === storeys;

            nodes.push({
              id: currId,
              name: `L${s} Frame Node [${ix + 1},${iz === 0 ? 'A' : 'B'}]`,
              x: gx,
              y: yLevel,
              z: gz,
              layer: isTop ? 'trusses' : s <= 2 ? 'columns' : 'slabs',
              spec: `Level ${s} Precast Column to Beam Moment Connection • M24 High-Tensile`,
              code: 'NZS 3101 / NZS 3404',
              stressRatio: 0.4 + (storeys - s) * 0.12,
            });

            const belowId = s === 1 ? `cap_${ix}_${iz}` : `col_${s - 1}_${ix}_${iz}`;
            members.push({
              from: belowId,
              to: currId,
              type: 'column',
              layer: 'columns',
              section: s <= 2 ? '400x400 Precast Column / 310UC' : '350x350 Precast Column',
              stress: 0.35 + (storeys - s) * 0.12,
            });
          });
        });

        // Perimeter Beams / Precast Floor Plank perimeter at each floor
        for (let ix = 0; ix < gridX.length - 1; ix++) {
          members.push({
            from: `col_${s}_${ix}_0`,
            to: `col_${s}_${ix + 1}_0`,
            type: 'slab',
            layer: 'slabs',
            section: 'Precast Beam / ComFlor 80 Decking',
            stress: 0.5,
          });
          members.push({
            from: `col_${s}_${ix}_1`,
            to: `col_${s}_${ix + 1}_1`,
            type: 'slab',
            layer: 'slabs',
            section: 'Precast Beam / ComFlor 80 Decking',
            stress: 0.5,
          });
        }
        gridX.forEach((_, ix) => {
          members.push({
            from: `col_${s}_${ix}_0`,
            to: `col_${s}_${ix}_1`,
            type: 'slab',
            layer: 'slabs',
            section: '200mm Precast Rib & Timber Infill Slab',
            stress: 0.48,
          });
        });

        // Cantilever Balcony Outriggers on South Façade
        if (s >= 2 && s <= 4) {
          const balL = `bal_${s}_0`;
          const balR = `bal_${s}_1`;
          nodes.push({
            id: balL,
            name: `L${s} Cantilever Balcony Outrigger L`,
            x: -30,
            y: yLevel,
            z: 110,
            layer: 'slabs',
            spec: 'Galvanised Structural Steel Balcony Frame w/ Thermal Break',
            code: 'NZS 3404 / E2 External Moisture',
            stressRatio: 0.72,
          });
          nodes.push({
            id: balR,
            name: `L${s} Cantilever Balcony Outrigger R`,
            x: 30,
            y: yLevel,
            z: 110,
            layer: 'slabs',
            spec: 'Galvanised Structural Steel Balcony Frame w/ Thermal Break',
            code: 'NZS 3404 / E2 External Moisture',
            stressRatio: 0.72,
          });
          members.push({ from: `col_${s}_1_1`, to: balL, type: 'brace', layer: 'slabs', section: '200PFC Cantilever Outrigger', stress: 0.72 });
          members.push({ from: `col_${s}_2_1`, to: balR, type: 'brace', layer: 'slabs', section: '200PFC Cantilever Outrigger', stress: 0.72 });
          members.push({ from: balL, to: balR, type: 'slab', layer: 'slabs', section: 'Perimeter Edge Channel', stress: 0.42 });
        }
      }

      // Roof Canopy Steel Frame (LOD400 details)
      const roofL = `col_${storeys}_0_0`;
      const roofApex = `roof_apex_node`;
      nodes.push({
        id: roofApex,
        name: `Roof Plantroom Screen & Truss Apex`,
        x: 0,
        y: storeys * storeyH + 30,
        z: 0,
        layer: 'trusses',
        spec: 'Lightweight Structural Steel Canopy Frame & Louvred Screen',
        code: 'NZS 3404',
        stressRatio: 0.52,
      });
      members.push({ from: roofL, to: roofApex, type: 'truss', layer: 'trusses', section: '150x150 SHS Screen Post', stress: 0.45 });
      members.push({ from: `col_${storeys}_3_1`, to: roofApex, type: 'truss', layer: 'trusses', section: '150x150 SHS Screen Post', stress: 0.45 });
    } else {
      // Kāinga Ora Housing Delivery System (HDS-46 Typology: 2-Storey Modular House & Retaining Subfloor)
      // Subfloor retaining wall on sloped ground
      const baysX = [-80, 0, 80];
      const baysZ = [-60, 60];

      // Retaining soldier piles
      baysX.forEach((bx, ix) => {
        const retPile = `ko_ret_pile_${ix}`;
        nodes.push({
          id: retPile,
          name: `Timber/Steel Retaining Soldier Pile #${ix + 1}`,
          x: bx,
          y: -40,
          z: -60,
          layer: 'substructure',
          spec: 'Ø350mm Seddon Bored Retaining Pile w/ H5 Timber Poles',
          code: 'NZS 3604 / MBIE Geotech',
          stressRatio: 0.62,
        });

        const groundPost = `ko_post_${ix}`;
        nodes.push({
          id: groundPost,
          name: `Subfloor Bearer Connection #${ix + 1}`,
          x: bx,
          y: 0,
          z: -60,
          layer: 'connections',
          spec: 'Stainless 304 12kN Joist Anchor Cleat to NZS 3604',
          code: 'NZS 3604:2011',
          stressRatio: 0.58,
        });

        members.push({ from: retPile, to: groundPost, type: 'pile', layer: 'substructure', section: 'H5 Round Pole Ø300', stress: 0.6 });
      });

      // Retaining wall walers / lagging
      members.push({ from: `ko_post_0`, to: `ko_post_1`, type: 'slab', layer: 'substructure', section: '200x50 H4 Retaining Waler', stress: 0.55 });
      members.push({ from: `ko_post_1`, to: `ko_post_2`, type: 'slab', layer: 'substructure', section: '200x50 H4 Retaining Waler', stress: 0.55 });

      // Ground Floor Framing (Level 1)
      const l1Nodes: string[] = [];
      baysX.forEach((bx, ix) => {
        baysZ.forEach((bz, iz) => {
          const l1Id = `ko_l1_${ix}_${iz}`;
          l1Nodes.push(l1Id);
          nodes.push({
            id: l1Id,
            name: `G-Floor Framing Node [${ix},${iz}]`,
            x: bx,
            y: 0,
            z: bz,
            layer: 'slabs',
            spec: '140x45 SG8 Timber Joist over 2/190x45 Bearers',
            code: 'NZS 3604',
            stressRatio: 0.44,
          });
        });
      });

      // Perimeter Floor Joists
      members.push({ from: `ko_l1_0_0`, to: `ko_l1_1_0`, type: 'slab', layer: 'slabs', section: '2/190x45 SG8 Bearer', stress: 0.42 });
      members.push({ from: `ko_l1_1_0`, to: `ko_l1_2_0`, type: 'slab', layer: 'slabs', section: '2/190x45 SG8 Bearer', stress: 0.42 });
      members.push({ from: `ko_l1_0_1`, to: `ko_l1_1_1`, type: 'slab', layer: 'slabs', section: '2/190x45 SG8 Bearer', stress: 0.42 });
      members.push({ from: `ko_l1_1_1`, to: `ko_l1_2_1`, type: 'slab', layer: 'slabs', section: '2/190x45 SG8 Bearer', stress: 0.42 });
      members.push({ from: `ko_l1_0_0`, to: `ko_l1_0_1`, type: 'slab', layer: 'slabs', section: '240x45 Engineered I-Joist', stress: 0.38 });
      members.push({ from: `ko_l1_1_0`, to: `ko_l1_1_1`, type: 'slab', layer: 'slabs', section: '240x45 Engineered I-Joist', stress: 0.4 });
      members.push({ from: `ko_l1_2_0`, to: `ko_l1_2_1`, type: 'slab', layer: 'slabs', section: '240x45 Engineered I-Joist', stress: 0.38 });

      // First Floor (Level 2)
      baysX.forEach((bx, ix) => {
        baysZ.forEach((bz, iz) => {
          const l2Id = `ko_l2_${ix}_${iz}`;
          nodes.push({
            id: l2Id,
            name: `L2 Inter-Storey Stud Wall Node [${ix},${iz}]`,
            x: bx,
            y: 55,
            z: bz,
            layer: 'columns',
            spec: '140x45 Studs @ 600 CRS • Double Top Plate • Gib Braced',
            code: 'NZS 3604 / NASH',
            stressRatio: 0.52,
          });
          members.push({
            from: `ko_l1_${ix}_${iz}`,
            to: l2Id,
            type: 'column',
            layer: 'columns',
            section: '140x45 Structural Wall Stud Framing',
            stress: 0.52,
          });
        });
      });

      // L2 Floor perimeter
      members.push({ from: `ko_l2_0_0`, to: `ko_l2_1_0`, type: 'slab', layer: 'slabs', section: 'Floor Cassette Edge Beam', stress: 0.45 });
      members.push({ from: `ko_l2_1_0`, to: `ko_l2_2_0`, type: 'slab', layer: 'slabs', section: 'Floor Cassette Edge Beam', stress: 0.45 });
      members.push({ from: `ko_l2_0_1`, to: `ko_l2_1_1`, type: 'slab', layer: 'slabs', section: 'Floor Cassette Edge Beam', stress: 0.45 });
      members.push({ from: `ko_l2_1_1`, to: `ko_l2_2_1`, type: 'slab', layer: 'slabs', section: 'Floor Cassette Edge Beam', stress: 0.45 });
      members.push({ from: `ko_l2_0_0`, to: `ko_l2_0_1`, type: 'slab', layer: 'slabs', section: 'Floor Diaphragm Tie', stress: 0.45 });
      members.push({ from: `ko_l2_2_0`, to: `ko_l2_2_1`, type: 'slab', layer: 'slabs', section: 'Floor Diaphragm Tie', stress: 0.45 });

      // Roof Gable Trusses (Level 3)
      baysX.forEach((bx, ix) => {
        baysZ.forEach((bz, iz) => {
          const l3Id = `ko_l3_${ix}_${iz}`;
          nodes.push({
            id: l3Id,
            name: `Eaves Wall Plate Node [${ix},${iz}]`,
            x: bx,
            y: 110,
            z: bz,
            layer: 'columns',
            spec: 'Top Plate Truss Tie Down Bracket (6.0kN Uplift)',
            code: 'NZS 3604 / Wind Zone High',
            stressRatio: 0.48,
          });
          members.push({
            from: `ko_l2_${ix}_${iz}`,
            to: l3Id,
            type: 'column',
            layer: 'columns',
            section: 'Upper Storey Wall Stud 90x45',
            stress: 0.48,
          });
        });

        // Ridge Apex Node for each bay
        const ridgeId = `ko_ridge_${ix}`;
        nodes.push({
          id: ridgeId,
          name: `Roof Truss Apex Ridge #${ix + 1}`,
          x: bx,
          y: 155,
          z: 0,
          layer: 'trusses',
          spec: 'Gang-Nail Prefabricated Fink Roof Truss Apex (25° Pitch)',
          code: 'NZS 3604',
          stressRatio: 0.58,
        });

        members.push({ from: `ko_l3_${ix}_0`, to: ridgeId, type: 'truss', layer: 'trusses', section: '90x45 Top Chord', stress: 0.58 });
        members.push({ from: `ko_l3_${ix}_1`, to: ridgeId, type: 'truss', layer: 'trusses', section: '90x45 Top Chord', stress: 0.58 });
        members.push({ from: `ko_l3_${ix}_0`, to: `ko_l3_${ix}_1`, type: 'truss', layer: 'trusses', section: '90x45 Bottom Chord Tie', stress: 0.42 });
      });

      // Ridge Board connecting apexes
      members.push({ from: `ko_ridge_0`, to: `ko_ridge_1`, type: 'purlin', layer: 'trusses', section: 'Continuous Ridge Board 140x35', stress: 0.35 });
      members.push({ from: `ko_ridge_1`, to: `ko_ridge_2`, type: 'purlin', layer: 'trusses', section: 'Continuous Ridge Board 140x35', stress: 0.35 });

      // Entrance Structural Steel Portal Canopy
      const canopyPost = `ko_canopy_post`;
      const canopyBeam = `ko_canopy_beam`;
      nodes.push({
        id: canopyPost,
        name: `Entrance Portal Post Node`,
        x: 120,
        y: 0,
        z: 75,
        layer: 'connections',
        spec: '100x100x5.0 SHS Galvanised Steel Entrance Canopy Post',
        code: 'NZS 3404',
        stressRatio: 0.65,
      });
      nodes.push({
        id: canopyBeam,
        name: `Entrance Cantilever Canopy Corner`,
        x: 120,
        y: 65,
        z: 75,
        layer: 'connections',
        spec: '150PFC Welded Moment Frame Cantilever',
        code: 'NZS 3404',
        stressRatio: 0.72,
      });
      members.push({ from: `ko_l1_2_1`, to: canopyPost, type: 'pile', layer: 'substructure', section: 'RC Pad Footing Embedment', stress: 0.4 });
      members.push({ from: canopyPost, to: canopyBeam, type: 'column', layer: 'columns', section: '100x100x5 SHS Post', stress: 0.65 });
      members.push({ from: `ko_l2_2_1`, to: canopyBeam, type: 'truss', layer: 'trusses', section: '150PFC Cantilever Beam', stress: 0.72 });
    }

    return { nodes, members };
  }, []);

  // 3D Matrix Projection
  const project3D = useCallback(
    (x: number, y: number, z: number, width: number, height: number) => {
      // Convert degrees to radians
      const radX = (rotation.x * Math.PI) / 180;
      const radY = (rotation.y * Math.PI) / 180;

      // Center offset
      const cx = width / 2;
      const cy = height / 2 + 35; // slightly lower center for architectural balance

      // Rotate Y (yaw)
      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      // Rotate X (pitch)
      const cosX = Math.cos(radX);
      const sinX = Math.sin(radX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      // Perspective projection
      const fov = 750;
      const scale = ((fov / (fov + z2)) * 1.6 * zoom);

      const sx = cx + x1 * scale;
      const sy = cy - y2 * scale; // invert Y so +Y is up

      return { sx, sy, scale, zDepth: z2 };
    },
    [rotation, zoom]
  );

  // Construction Layer Filter according to progress (0% to 100%)
  const isLayerConstructed = useCallback(
    (layer: Node3D['layer'], progress: number) => {
      if (progress >= 95) return true;
      if (layer === 'substructure') return progress >= 15;
      if (layer === 'columns') return progress >= 40;
      if (layer === 'trusses') return progress >= 65;
      if (layer === 'slabs') return progress >= 85;
      if (layer === 'connections') return progress >= 95;
      return true;
    },
    []
  );

  // Animation loop for Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let laserY = 0;
    let laserDir = 1;

    const render = () => {
      // Resize to container CSS size
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width;
      const height = rect.height;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Auto-rotation increment
      if (autoRotate && !isDragging) {
        setRotation((prev) => ({
          x: prev.x,
          y: (prev.y + 0.25) % 360,
        }));
      }

      // Construction progress animation step
      if (isPlayingSequence) {
        setConstructionProgress((prev) => {
          if (prev >= 100) return 0;
          return Math.min(100, prev + 0.4);
        });
      }

      // 1. Draw Architectural Coordinate Grid & Ground Plane
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 220;
      const gridSteps = 6;
      const step = gridSize / gridSteps;

      // Ground plane grid lines
      for (let i = -gridSize; i <= gridSize; i += step) {
        const p1 = project3D(i, -25, -gridSize, width, height);
        const p2 = project3D(i, -25, gridSize, width, height);
        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.stroke();

        const p3 = project3D(-gridSize, -25, i, width, height);
        const p4 = project3D(gridSize, -25, i, width, height);
        ctx.beginPath();
        ctx.moveTo(p3.sx, p3.sy);
        ctx.lineTo(p4.sx, p4.sy);
        ctx.stroke();
      }

      // 2. Fetch Model geometry
      const { nodes, members } = getModelData(activeModel);

      // Project Nodes to 2D Screen
      const nodeMap = new Map<string, Node3D & { sx: number; sy: number; scale: number; zDepth: number }>();
      const currentScreenNodes: Array<Node3D & { sx: number; sy: number }> = [];

      nodes.forEach((n) => {
        const p = project3D(n.x, n.y, n.z, width, height);
        const item = { ...n, sx: p.sx, sy: p.sy, scale: p.scale, zDepth: p.zDepth };
        nodeMap.set(n.id, item);

        if (visibleLayers[n.layer] && isLayerConstructed(n.layer, constructionProgress)) {
          currentScreenNodes.push(item);
        }
      });
      setScreenNodes(currentScreenNodes);

      // 3. Render Members / Structural Beams & Columns
      // Sort members back-to-front for clean visual layering
      const sortedMembers = [...members].sort((a, b) => {
        const za = ((nodeMap.get(a.from)?.zDepth || 0) + (nodeMap.get(a.to)?.zDepth || 0)) / 2;
        const zb = ((nodeMap.get(b.from)?.zDepth || 0) + (nodeMap.get(b.to)?.zDepth || 0)) / 2;
        return zb - za;
      });

      sortedMembers.forEach((m) => {
        if (!visibleLayers[m.layer]) return;
        if (!isLayerConstructed(m.layer, constructionProgress)) return;

        const fromNode = nodeMap.get(m.from);
        const toNode = nodeMap.get(m.to);
        if (!fromNode || !toNode) return;

        ctx.beginPath();
        ctx.moveTo(fromNode.sx, fromNode.sy);
        ctx.lineTo(toNode.sx, toNode.sy);

        // Styling based on mode
        if (renderMode === 'stress') {
          // FEA Stress Heatmap (Green -> Gold -> Red)
          if (m.stress > 0.8) {
            ctx.strokeStyle = '#ef4444'; // Red (Peak Bending Moment)
            ctx.lineWidth = 3.5;
          } else if (m.stress > 0.65) {
            ctx.strokeStyle = '#f59e0b'; // Amber
            ctx.lineWidth = 2.8;
          } else if (m.stress > 0.45) {
            ctx.strokeStyle = '#C5A880'; // Bronze
            ctx.lineWidth = 2.2;
          } else {
            ctx.strokeStyle = '#10b981'; // Green (Safe strain)
            ctx.lineWidth = 1.8;
          }
        } else if (renderMode === 'lidar') {
          // LiDAR Point-Cloud scanning mode
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)'; // Cyan wire
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
        } else {
          // Architectural Wireframe mode
          ctx.setLineDash([]);
          if (m.type === 'column') {
            ctx.strokeStyle = '#E0CEB5'; // Champagne Column
            ctx.lineWidth = 2.6;
          } else if (m.type === 'rafter') {
            ctx.strokeStyle = '#C5A880'; // Bronze Rafter
            ctx.lineWidth = 2.4;
          } else if (m.type === 'truss') {
            ctx.strokeStyle = 'rgba(197, 168, 128, 0.7)';
            ctx.lineWidth = 1.8;
          } else if (m.type === 'pile') {
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
            ctx.lineWidth = 3.0;
          } else if (m.type === 'brace') {
            ctx.strokeStyle = 'rgba(234, 179, 8, 0.6)';
            ctx.lineWidth = 1.2;
            ctx.setLineDash([3, 3]);
          } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.lineWidth = 1.6;
          }
        }

        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 4. LiDAR Laser Plane Animation
      if (renderMode === 'lidar') {
        laserY += 0.8 * laserDir;
        if (laserY > 180 || laserY < -30) laserDir *= -1;

        const scanP1 = project3D(-180, laserY, -140, width, height);
        const scanP2 = project3D(180, laserY, -140, width, height);
        const scanP3 = project3D(180, laserY, 140, width, height);
        const scanP4 = project3D(-180, laserY, 140, width, height);

        // Semi-transparent laser plane
        ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
        ctx.beginPath();
        ctx.moveTo(scanP1.sx, scanP1.sy);
        ctx.lineTo(scanP2.sx, scanP2.sy);
        ctx.lineTo(scanP3.sx, scanP3.sy);
        ctx.lineTo(scanP4.sx, scanP4.sy);
        ctx.closePath();
        ctx.fill();

        // Laser boundary lines
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.75)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Scanning Coordinate Tag
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = '#22d3ee';
        ctx.fillText(`LiDAR ELEV: ${(laserY / 10).toFixed(2)}m (Z-PLANE CLASH VALIDATION)`, scanP1.sx + 8, scanP1.sy - 6);
      }

      // 5. Draw LOD400 Bolted Nodes
      if (visibleLayers.connections && isLayerConstructed('connections', constructionProgress)) {
        nodes.forEach((n) => {
          const p = nodeMap.get(n.id);
          if (!p) return;

          const isHovered = hoveredNode?.id === n.id;
          const isSelected = selectedNode?.id === n.id;

          // Outer halo on hover
          if (isHovered || isSelected) {
            ctx.beginPath();
            ctx.arc(p.sx, p.sy, 8 * p.scale, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(197, 168, 128, 0.3)';
            ctx.fill();
            ctx.strokeStyle = '#C5A880';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          // Core node pin
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, (isSelected ? 5 : isHovered ? 4 : 2.8) * p.scale, 0, Math.PI * 2);

          if (renderMode === 'stress') {
            ctx.fillStyle = n.stressRatio > 0.8 ? '#ef4444' : n.stressRatio > 0.65 ? '#f59e0b' : '#10b981';
          } else if (n.layer === 'connections') {
            ctx.fillStyle = '#C5A880'; // Bronze bolted connection
          } else if (n.layer === 'substructure') {
            ctx.fillStyle = '#94a3b8'; // Slate footing
          } else {
            ctx.fillStyle = '#ffffff';
          }
          ctx.fill();
        });
      }

      // 6. Draw HUD Crosshair Center Marker
      ctx.strokeStyle = 'rgba(197, 168, 128, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 12, height / 2 + 35);
      ctx.lineTo(width / 2 + 12, height / 2 + 35);
      ctx.moveTo(width / 2, height / 2 + 35 - 12);
      ctx.lineTo(width / 2, height / 2 + 35 + 12);
      ctx.stroke();

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    activeModel,
    renderMode,
    autoRotate,
    rotation,
    zoom,
    visibleLayers,
    constructionProgress,
    isPlayingSequence,
    hoveredNode,
    selectedNode,
    getModelData,
    project3D,
    isLayerConstructed,
    isDragging,
  ]);

  // Mouse & Touch Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setAutoRotate(false);
    setLastMousePos({ x: e.clientX, y: e.clientY });

    // Check if clicked a node
    checkNodeClick(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;

      setRotation((prev) => ({
        x: Math.max(-85, Math.min(85, prev.x - dy * 0.45)),
        y: (prev.y + dx * 0.5) % 360,
      }));

      setLastMousePos({ x: e.clientX, y: e.clientY });
    } else {
      // Hover check
      checkNodeHover(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setZoom((prev) => Math.max(0.5, Math.min(2.5, prev - e.deltaY * 0.0012)));
  };

  // Touch controls for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setAutoRotate(false);
      setLastMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - lastMousePos.x;
      const dy = e.touches[0].clientY - lastMousePos.y;

      setRotation((prev) => ({
        x: Math.max(-85, Math.min(85, prev.x - dy * 0.45)),
        y: (prev.y + dx * 0.5) % 360,
      }));

      setLastMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Node detection helpers
  const checkNodeHover = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.x;
    const my = clientY - rect.y;

    const hit = screenNodes.find((n) => {
      const d = Math.hypot(n.sx - mx, n.sy - my);
      return d < 12;
    });

    setHoveredNode(hit || null);
  };

  const checkNodeClick = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.x;
    const my = clientY - rect.y;

    const hit = screenNodes.find((n) => {
      const d = Math.hypot(n.sx - mx, n.sy - my);
      return d < 14;
    });

    if (hit) {
      setSelectedNode(hit);
    } else {
      setSelectedNode(null);
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl bg-zinc-950/90 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col ${className}`}
    >
      {/* 1. Header Toolbar: Typology Tabs & View Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-zinc-800/80 bg-zinc-900/60 p-4 gap-3">
        {/* Left: Typology Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 text-[10px] font-mono-tech text-[#C5A880] uppercase tracking-wider border border-zinc-700/60">
            <Layers className="w-3.5 h-3.5" />
            <span>Structural System:</span>
          </div>

          <button
            onClick={() => {
              setActiveModel('manor-build');
              setSelectedNode(null);
              setConstructionProgress(100);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech uppercase tracking-wider transition-all ${
              activeModel === 'manor-build'
                ? 'bg-[#C5A880] text-zinc-950 font-bold shadow-md shadow-[#C5A880]/15'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70 border border-zinc-800'
            }`}
          >
            60m CFS Portal & Truss
          </button>

          <button
            onClick={() => {
              setActiveModel('greenslade');
              setSelectedNode(null);
              setConstructionProgress(100);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech uppercase tracking-wider transition-all ${
              activeModel === 'greenslade'
                ? 'bg-[#C5A880] text-zinc-950 font-bold shadow-md shadow-[#C5A880]/15'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70 border border-zinc-800'
            }`}
          >
            5-Storey Precast Hybrid
          </button>

          <button
            onClick={() => {
              setActiveModel('kainga-ora');
              setSelectedNode(null);
              setConstructionProgress(100);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech uppercase tracking-wider transition-all ${
              activeModel === 'kainga-ora'
                ? 'bg-[#C5A880] text-zinc-950 font-bold shadow-md shadow-[#C5A880]/15'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70 border border-zinc-800'
            }`}
          >
            Kāinga Ora Standard (HDS-46)
          </button>
        </div>

        {/* Right: Render Mode & Orbit Switcher */}
        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
          <div className="inline-flex rounded-lg bg-zinc-950 p-1 border border-zinc-800 font-mono-tech text-[11px]">
            <button
              onClick={() => setRenderMode('wireframe')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                renderMode === 'wireframe' ? 'bg-zinc-800 text-[#C5A880] font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              LOD400 BIM
            </button>
            <button
              onClick={() => setRenderMode('stress')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                renderMode === 'stress' ? 'bg-zinc-800 text-amber-400 font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              FEA Stress
            </button>
            <button
              onClick={() => setRenderMode('lidar')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                renderMode === 'lidar' ? 'bg-zinc-800 text-cyan-400 font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              LiDAR Scan
            </button>
          </div>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? 'Pause 3D Orbit' : 'Auto 3D Orbit'}
            className={`p-2 rounded-lg border text-xs font-mono-tech transition-colors ${
              autoRotate
                ? 'bg-[#C5A880]/15 text-[#C5A880] border-[#C5A880]/40'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <Compass className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '10s' }} />
          </button>

          <button
            onClick={() => {
              setRotation({ x: 22, y: -35 });
              setZoom(1.0);
            }}
            title="Reset Camera View"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Interactive 3D Canvas Stage */}
      <div className="relative w-full h-[440px] sm:h-[500px] cursor-cad select-none bg-[radial-gradient(circle_at_center,rgba(24,24,27,0.7)_0%,rgba(9,9,11,1)_100%)] overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-architectural-grid opacity-30 pointer-events-none" />

        {/* 3D Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full h-full block"
        />

        {/* Top-Left Telemetry Overlay */}
        <div className="absolute top-4 left-4 p-3 rounded-xl bg-zinc-950/85 backdrop-blur-md border border-zinc-800/90 font-mono-tech text-[10px] space-y-1.5 pointer-events-none max-w-xs shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-zinc-800">
            <span className="flex items-center gap-1.5 text-[#C5A880] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-ping" />
              BIM 3D ENGINE
            </span>
            <span className="text-zinc-500">REVIT SCHEME</span>
          </div>
          <div className="flex justify-between text-zinc-300">
            <span className="text-zinc-500">Camera Rot:</span>
            <span>
              P: {rotation.x.toFixed(0)}° / Y: {((rotation.y % 360) + 360) % 360}°
            </span>
          </div>
          <div className="flex justify-between text-zinc-300">
            <span className="text-zinc-500">LOD Grade:</span>
            <span className="text-emerald-400 font-semibold">LOD400 Fabrication</span>
          </div>
          <div className="flex justify-between text-zinc-300">
            <span className="text-zinc-500">Active Stage:</span>
            <span className="text-[#C5A880]">
              {constructionProgress < 20
                ? 'Phase 1: Substructure'
                : constructionProgress < 50
                ? 'Phase 2: Columns'
                : constructionProgress < 75
                ? 'Phase 3: Roof Trusses'
                : constructionProgress < 95
                ? 'Phase 4: Slabs/Planks'
                : 'Phase 5: LOD400 Bolted Rig'}
            </span>
          </div>
          <div className="pt-1 text-[9px] text-zinc-400 border-t border-zinc-800/60">
            Drag to Orbit • Scroll to Zoom • Click Nodes
          </div>
        </div>

        {/* Top-Right Zoom Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-1.5">
          <button
            onClick={() => setZoom((prev) => Math.min(2.5, prev + 0.2))}
            className="p-2 rounded-lg bg-zinc-900/85 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors shadow-md"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.2))}
            className="p-2 rounded-lg bg-zinc-900/85 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors shadow-md"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Node Spec Inspector HUD */}
        {selectedNode && (
          <div className="absolute bottom-4 right-4 p-4 rounded-xl bg-zinc-950/95 backdrop-blur-md border border-[#C5A880]/80 shadow-2xl max-w-sm space-y-2 z-20 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                <span className="font-mono-tech text-xs text-[#C5A880] font-bold uppercase tracking-wider">
                  LOD400 Node Callout
                </span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-zinc-500 hover:text-white text-xs font-mono-tech"
              >
                ✕
              </button>
            </div>
            <div>
              <div className="text-sm font-display font-bold text-white">{selectedNode.name}</div>
              <div className="text-xs text-zinc-300 font-mono-tech mt-1 leading-snug">
                {selectedNode.spec}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-800/80 font-mono-tech text-[10px]">
              <div>
                <span className="text-zinc-500 block">Compliance Standard:</span>
                <span className="text-neutral-200 font-semibold">{selectedNode.code}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Stress Ratio (FEA):</span>
                <span
                  className={`font-semibold ${
                    selectedNode.stressRatio > 0.8
                      ? 'text-red-400'
                      : selectedNode.stressRatio > 0.65
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {(selectedNode.stressRatio * 100).toFixed(0)}% Capacity
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Bottom Construction Sequence Animation & Layer Filters */}
      <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Play/Pause Sequence Bar */}
        <div className="w-full md:w-auto flex items-center gap-3">
          <button
            onClick={() => setIsPlayingSequence(!isPlayingSequence)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#C5A880] hover:bg-[#b5966c] text-zinc-950 font-mono-tech font-bold text-xs uppercase tracking-wider transition-colors shrink-0 shadow-sm"
          >
            {isPlayingSequence ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlayingSequence ? 'Pause Erection' : 'Simulate Erection'}</span>
          </button>

          <div className="flex-1 md:w-56 flex flex-col gap-1 font-mono-tech text-[10px]">
            <div className="flex justify-between text-zinc-400">
              <span>Construction Assembly:</span>
              <span className="text-[#C5A880] font-bold">{constructionProgress.toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={constructionProgress}
              onChange={(e) => {
                setIsPlayingSequence(false);
                setConstructionProgress(parseFloat(e.target.value));
              }}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C5A880]"
            />
          </div>
        </div>

        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2 font-mono-tech text-[11px]">
          <span className="text-zinc-500 text-[10px] uppercase hidden xl:inline">BIM Layers:</span>
          {(['substructure', 'columns', 'trusses', 'slabs', 'connections'] as const).map((layer) => (
            <button
              key={layer}
              onClick={() =>
                setVisibleLayers((prev) => ({
                  ...prev,
                  [layer]: !prev[layer],
                }))
              }
              className={`px-2.5 py-1 rounded text-[10px] uppercase tracking-wider transition-colors border ${
                visibleLayers[layer]
                  ? 'bg-zinc-800 text-zinc-200 border-zinc-700/80'
                  : 'bg-zinc-950/60 text-zinc-600 border-zinc-900'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
