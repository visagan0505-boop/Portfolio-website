'use client';

import React, { useState, useEffect } from 'react';
import {
  Compass,
  Layers,
  Cpu,
  Building2,
  Workflow,
  ShieldCheck,
  Award,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  FileDown,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  X,
  CheckCircle2,
  Code2,
  Boxes,
  Maximize2,
  SlidersHorizontal,
  FolderGit2,
  Send,
  Menu,
  FileSpreadsheet,
  Ruler,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  Terminal,
  Eye,
  Play,
  Rotate3d,
} from 'lucide-react';
import StructuralBimViewer, { StructuralModelType } from '../components/StructuralBimViewer';

interface Project {
  id: string;
  title: string;
  clientOrOrg: string;
  location: string;
  category: 'Commercial / Industrial' | 'High-Density Residential' | 'Housing Programmes';
  role: string;
  recognition?: string;
  headlineMetric: string;
  system: string;
  scopeSummary: string;
  deliverables: string[];
  specs: {
    software: string[];
    codes: string[];
    keyMetric: string;
    spanOrArea: string;
    sprintPace?: string;
  };
  details: string[];
}

const projectsData: Project[] = [
  {
    id: 'manor-build',
    title: 'Manor Build Prefabrication Facility',
    clientOrOrg: 'Formsteel Technologies Ltd',
    location: 'New Plymouth, Taranaki, NZ',
    category: 'Commercial / Industrial',
    role: 'Technical Project Leadership & DfMA Detailing',
    headlineMetric: '60m Clear-Span CFS Structure',
    system: 'Proprietary Light-Gauge Cold-Formed Steel (CFS) Industrial System',
    scopeSummary:
      'End-to-end technical delivery from initial client consultation through structural detailing, building consent, fabrication drawings, automated CNC rollforming output, and construction site observation.',
    deliverables: [
      '60m clear-span structural steel framing with zero internal load-bearing columns',
      'Up to 47% lower embodied carbon compared to conventional heavy hot-rolled steel',
      'Direct machine-level CNC rollforming code export for automated factory manufacturing',
      'Multidisciplinary DfMA interface between sales, engineering, fabrication, and clients',
    ],
    specs: {
      software: ['Revit 2022', 'AutoCAD 3D', 'Vertex BD', 'StrucSoft MWF', 'CNC Post-Processors'],
      codes: ['AS/NZS 4600', 'NASH Standards', 'NZS 3604', 'AS/NZS 1170', 'NZBC B1/VM1'],
      keyMetric: '-47% Embodied Carbon',
      spanOrArea: '60m Clear-Span Envelope',
    },
    details: [
      'Engineered and documented the large-span structural envelope using proprietary cold-formed structural sections with optimized member gauges.',
      'Authored the detailed technical manual, profile documentation, and fabrication assembly sequences ensuring smooth erection on site.',
      'Acted as primary constructability liaison between structural design engineers and production plant operators, eliminating fabrication rework.',
    ],
  },
  {
    id: 'greenslade-crescent',
    title: 'Greenslade Crescent Apartments',
    clientOrOrg: 'Kirk Roberts Consulting Ltd / Client: NZ Strong',
    location: 'Northcote, Auckland, NZ',
    category: 'High-Density Residential',
    role: 'Lead Structural BIM Technician',
    recognition: 'Finalist — Kirk Roberts Project of the Year 2025',
    headlineMetric: '52 Units • Fast-Track 14-Mo Programme',
    system: 'Hybrid Precast Concrete Panels + Structural Steel Framing on Deep Bored Piles',
    scopeSummary:
      'Fast-track 14-month delivery of a 5-storey plus ground commercial high-density development. Achieved Homestar 6 environmental rating and received formal published commendation from head contractor NZ Strong.',
    deliverables: [
      'Lead structural BIM coordination across multi-disciplinary federated models in ACC / BIM 360',
      'Complex foundation coordination: deep bored reinforced concrete piles in Auckland alluvial soils',
      'Precision precast concrete shear wall panels, precast floor planks, and structural steel transfer trusses',
      'Zero critical spatial clashes during construction phase via LOD400 shop drawing coordination',
    ],
    specs: {
      software: ['Revit 2024 Structure', 'Autodesk Construction Cloud (ACC)', 'Navisworks Manage', 'AutoCAD'],
      codes: ['NZS 3101 (Concrete)', 'NZS 3404 (Steel)', 'AS/NZS 1170', 'Homestar 6 Rating'],
      keyMetric: '14-Month Fast-Track',
      spanOrArea: '5-Storey + Commercial (52 Units)',
    },
    details: [
      'Managed end-to-end structural documentation from Building Consent through Tender and Construction Issue Packages.',
      'Achieved seamless integration with HVAC, hydraulic, fire, and facade services within federated cloud workspaces.',
      'Client commended the drafting and coordination quality for enabling swift procurement and zero re-work during crane installation sequences.',
    ],
  },
  {
    id: 'kainga-ora-hds',
    title: 'Kāinga Ora Housing Delivery System (HDS)',
    clientOrOrg: 'Kirk Roberts Consulting Ltd / Kāinga Ora',
    location: 'Auckland & Christchurch MBUs, NZ',
    category: 'Housing Programmes',
    role: 'HDS Project Leader — Structural Draughting & BIM',
    recognition: 'Programme-Level Operational Benchmark',
    headlineMetric: '46 Baseline Typologies • ~20% RFI Reduction',
    system: 'Standardised Modular & Panelised Typologies with Parametric Retaining Systems',
    scopeSummary:
      'Programme-level BIM coordination leadership across both Auckland and Christchurch Market Business Units. Authored and curate the 46-model KOHC Revit house-typology library operating under a strict 6-week production sprint cycle.',
    deliverables: [
      'Authored the 46 Revit house-typology production baseline models adopted across national teams',
      'Direct leadership and mentoring of 6 structural technicians across Auckland and Christchurch MBUs',
      'Achieved ~20% programme-wide RFI reduction through rigorous parametric library standardization',
      'Managed capacity and quality in a 460-minute daily time-tracked, sprint-governed delivery framework',
    ],
    specs: {
      software: ['Revit 2024/2025 Structure', 'Dynamo (Python Engine)', 'ACC / BIM 360', 'BIM Track'],
      codes: ['NZS 3604', 'NZS 3404', 'MBIE Acceptable Solutions', 'Kāinga Ora Design Standards'],
      keyMetric: '~20% RFI Reduction',
      spanOrArea: '46 Core Housing Typologies',
      sprintPace: '6-Week Sprint Cycles',
    },
    details: [
      'Engineered uniform shared parameter schemas, unified view templates, and automated model health auditing scripts using Dynamo/Python.',
      'Formulated the standardized retaining wall and subfloor packages for sloped Auckland topography, accelerating site-specific adaptations.',
      'Institutionalized peer-review protocols and LOD400 modeling standards reducing drafting delivery overhead by over 15%.',
    ],
  },
  {
    id: 'bunnings-waipapa',
    title: 'Bunnings Waipapa Retail Warehouse',
    clientOrOrg: 'Kirk Roberts Consulting Ltd / Bunnings NZ',
    location: 'Kerikeri, Northland, NZ',
    category: 'Commercial / Industrial',
    role: 'Lead Structural BIM Technician',
    headlineMetric: '8,500m² Large-Format Retail Footprint',
    system: 'Structural Steel Portal Framing with Complex Reinforced Concrete Foundations',
    scopeSummary:
      'Structural steel BIM coordination and comprehensive documentation on an 8,500m² large-format retail warehouse. Delivered through a single-vendor multidisciplinary model covering structural, civil, geotechnical, fire, and environmental engineering.',
    deliverables: [
      'Complete structural steel BIM coordination and LOD400 detailing for primary and secondary members',
      'Substructure documentation: extensive RC spread footings, continuous strips, pad footings, and retaining walls',
      'Suspended mezzanine slab detailing, composite metal decking, and specialized loading-dock floor systems',
      'Interdisciplinary conflict resolution with heavy industrial services and automated fire suppression piping',
    ],
    specs: {
      software: ['Revit Structure 2023', 'Navisworks Manage', 'AutoCAD 3D', 'ACC'],
      codes: ['NZS 3404', 'NZS 3101', 'AS/NZS 1170', 'NZBC B1 Compliance'],
      keyMetric: '8,500m² Footprint',
      spanOrArea: 'High-Bay Portal Frame Warehouse',
    },
    details: [
      'Modelled intricate steel connection node zones and foundation hold-down bolt layouts with sub-millimeter tolerances.',
      'Coordinated the structural integration with civil site drainage, perimeter fire truck aprons, and trade yard storage zones.',
      'Project completed successfully in 2023 with praise from the client engineering team for comprehensive documentation fidelity.',
    ],
  },
  {
    id: 'aalto-apartments',
    title: 'Aalto Apartments (Morningside)',
    clientOrOrg: 'Kirk Roberts Consulting Ltd / Ockham Residential',
    location: 'Morningside, Auckland, NZ',
    category: 'High-Density Residential',
    role: 'Lead Structural BIM Technician',
    recognition: 'Finalist — Kirk Roberts Project of the Year 2025',
    headlineMetric: '39 Boutique High-Density Units',
    system: 'Architecturally Expressed Precast & Steel Hybrid Structural Frame',
    scopeSummary:
      'High-density boutique residential development for award-winning developer Ockham Residential. Completed in 2023 and selected as one of only two finalist entries out of 12 company-wide submissions for KR Project of the Year 2025.',
    deliverables: [
      'High-precision structural BIM coordination with Ockham Residential’s signature architectural brick and precast finishes',
      'Multidisciplinary federated model coordination across structural, architectural, MEP, acoustic, and fire consultants',
      'Shop drawing review and fast turnaround of site RFIs for complex transfer levels and cantilevered balconies',
      'Detailed precast panel assembly drawings with embedded services conduit reservations',
    ],
    specs: {
      software: ['Revit Structure', 'ACC / BIM 360', 'Navisworks', 'Bluebeam Revu'],
      codes: ['NZS 3101', 'NZS 3404', 'NZBC B1/VM1', 'Auckland Unitary Plan Standards'],
      keyMetric: 'KR Project of the Year Finalist',
      spanOrArea: '39 Residential Apartments',
    },
    details: [
      'Addressed intricate architectural geometry requirements including exposed concrete soffits and recessed window reveals without compromising structural integrity.',
      'Maintained live clash-free models throughout the construction lifecycle, safeguarding the aesthetic goals of the developer.',
    ],
  },
  {
    id: 'retaining-wall-systems',
    title: 'KO Programme Retaining Wall Systems',
    clientOrOrg: 'Kāinga Ora HDS Programme',
    location: 'Auckland & Christchurch MBUs, NZ',
    category: 'Housing Programmes',
    role: 'Structural Documentation & BIM Lead',
    headlineMetric: 'Multi-Site Modular Retention Infrastructure',
    system: 'Reinforced Concrete (RC), Cold-Formed Steel (CFS) & Timber/Steel Soldier Pile Systems',
    scopeSummary:
      'Standardized structural documentation and BIM integration of earth-retention systems across diverse and challenging topography in regional public housing developments.',
    deliverables: [
      'Integrated retaining wall structural packages with civil drainage and geotechnical slope stability models in ACC',
      'Parametric Revit families for variable-height modular retaining components with automated rebar schedules',
      'Detailed boundary condition clearances, cantilevered surcharge considerations, and acoustic fence integrators',
      'Standardized detail sheet libraries accelerating site-specific building consent submissions',
    ],
    specs: {
      software: ['Revit Structure', 'Dynamo Automation', 'Civil 3D Interface', 'ACC'],
      codes: ['NZS 3604', 'NZS 3101', 'AS/NZS 1170.0/.1', 'MBIE Geotechnical Guidelines'],
      keyMetric: 'Zero Geotech Clashes',
      spanOrArea: 'Over 25+ Site Packages',
    },
    details: [
      'Transformed bespoke retaining design tasks into systematized parametric modules that junior technicians can quickly deploy and verify.',
      'Significantly decreased engineering turn-around time for building consent filings on steep urban infill plots.',
    ],
  },
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState<boolean>(false);
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [dossierCopied, setDossierCopied] = useState<boolean>(false);
  const [simulatorModel, setSimulatorModel] = useState<StructuralModelType>('manor-build');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    inquiryType: 'Structural BIM Leadership',
    message: '',
  });

  const openInSimulator = (modelKey: StructuralModelType) => {
    setSimulatorModel(modelKey);
    setSelectedProject(null);
    const el = document.getElementById('bim-simulator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categories = ['All', 'Commercial / Industrial', 'High-Density Residential', 'Housing Programmes'];

  const filteredProjects =
    activeCategory === 'All'
      ? projectsData
      : projectsData.filter((p) => p.category === activeCategory);

  // Close modals on Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
        setIsDossierOpen(false);
        setMoreMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      // Keep state clear after submission notice
    }, 4000);
  };

  const copyDossierText = () => {
    const text = `VISAGAN GUNARATNAM // MEngNZ-1160599
Senior Infrastructure Drafter & BIM Delivery Leader
Location: Favona, Auckland, New Zealand
Phone: +64 21 235 6282 | Email: visagan143@gmail.com | LinkedIn: linkedin.com/in/visagan

CAREER SUMMARY:
Structural BIM and technical delivery leader with 18+ years of multi-country experience across large-span steel structures, reinforced concrete, precast concrete, cold-formed steel fabrication, retaining wall systems, and high-volume residential delivery.

CURRENT ROLE:
HDS Project Leader — Structural Draughting & BIM | Kirk Roberts Consulting Ltd (Jan 2026 - Present)
Leading 6 structural technicians across Auckland & Christchurch MBUs for the Kāinga Ora Housing Delivery System (HDS). Custodian of 46-model KOHC Revit baseline typology library, LOD400 standards, and 6-week sprint cycles driving ~20% RFI reduction.

KEY METRICS & ACHIEVEMENTS:
- 18+ Years Multi-Country Delivery Experience
- 60m Clear-Span Industrial CFS Structure (Manor Build / Formsteel) — Up to 47% lower embodied carbon
- Finalist (x2): Kirk Roberts Project of the Year 2025 (Greenslade Crescent Apartments & Aalto Apartments)
- 46 Standardised KOHC House-Typology Models
- ~20% Programme RFI Reduction Achieved
- 8,500m² Bunnings Waipapa Retail Warehouse BIM Coordination

CORE SOFTWARE & CODES:
Revit 2018–2025 (Structure/Architecture), Dynamo (Python), ACC / BIM 360, Navisworks, StrucSoft FrameBuilder MWF, Vertex BD, AutoCAD 3D.
NZS 3404, NZS 3604, AS/NZS 1170, AS/NZS 4600, NASH Standards, NZBC B1/VM1, Homestar 6.`;

    navigator.clipboard?.writeText(text);
    setDossierCopied(true);
    setTimeout(() => setDossierCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-neutral-100 flex flex-col font-sans selection:bg-[#C5A880]/30 selection:text-neutral-100 relative selection:selection">
      {/* Subtle architectural background grid */}
      <div className="fixed inset-0 bg-architectural-grid pointer-events-none opacity-40 z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(197,168,128,0.12),rgba(24,24,27,0))] pointer-events-none z-0" />

      {/* 1. STICKY BLURRED NAVIGATION BAR */}
      <header
        id="navbar"
        className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md transition-all duration-200"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          {/* Brand Mark & Credential */}
          <a href="#hero" className="flex items-center gap-3 group text-left shrink-0">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-[#C5A880] group-hover:border-[#C5A880]/60 transition-colors shadow-inner shrink-0">
              <Compass className="w-5 h-5 text-[#C5A880]" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm tracking-wider text-neutral-100 uppercase group-hover:text-[#C5A880] transition-colors whitespace-nowrap">
                  VISAGAN GUNARATNAM
                </span>
                <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-zinc-800/90 text-[#C5A880] border border-zinc-700/60 font-semibold whitespace-nowrap">
                  MEngNZ-1160599
                </span>
              </div>
              <div className="text-[10px] font-mono-tech text-zinc-400 tracking-wider uppercase whitespace-nowrap hidden sm:block">
                BIM Delivery Leader // Structural
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-xs font-mono-tech uppercase tracking-wider text-zinc-300">
            <a href="#overview" className="hover:text-[#C5A880] transition-colors whitespace-nowrap py-1">
              Overview
            </a>
            <a
              href="#bim-simulator"
              className="flex items-center gap-1.5 text-[#C5A880] hover:text-[#E0CEB5] transition-colors font-bold whitespace-nowrap py-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D BIM</span>
            </a>
            <a href="#projects" className="hover:text-[#C5A880] transition-colors whitespace-nowrap py-1">
              Projects
            </a>
            <a href="#metrics" className="hover:text-[#C5A880] transition-colors whitespace-nowrap py-1">
              Metrics
            </a>
            <a href="#timeline" className="hover:text-[#C5A880] transition-colors whitespace-nowrap py-1">
              Timeline
            </a>

            {/* Dropdown for Secondary Links */}
            <div
              className="relative"
              onMouseEnter={() => setMoreMenuOpen(true)}
              onMouseLeave={() => setMoreMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className="flex items-center gap-1 hover:text-[#C5A880] transition-colors py-1 focus:outline-none whitespace-nowrap"
                aria-expanded={moreMenuOpen}
              >
                <span>More</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    moreMenuOpen ? 'rotate-180 text-[#C5A880]' : 'text-zinc-500'
                  }`}
                />
              </button>

              {moreMenuOpen && (
                <div className="absolute right-0 top-full pt-2 w-56 z-50 animate-in fade-in duration-150">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-md space-y-1 font-mono-tech text-xs tracking-wider uppercase">
                    <a
                      href="#capabilities"
                      onClick={() => setMoreMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-900/90 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>BIM Governance</span>
                    </a>
                    <a
                      href="#credentials"
                      onClick={() => setMoreMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-900/90 transition-colors"
                    >
                      <Award className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Credentials & Codes</span>
                    </a>
                    <a
                      href="#contact"
                      onClick={() => setMoreMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-900/90 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Consultation Booking</span>
                    </a>
                    <div className="border-t border-zinc-800/80 my-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setMoreMenuOpen(false);
                          setIsDossierOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[#C5A880] hover:text-white hover:bg-[#C5A880]/10 transition-colors text-left"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Curated Dossier</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Action CTA */}
          <div className="hidden sm:flex items-center shrink-0">
            <button
              id="cta-dossier-btn"
              onClick={() => setIsDossierOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#C5A880] hover:bg-[#b5966c] text-zinc-950 font-semibold text-xs tracking-wider uppercase font-mono-tech transition-all duration-150 shadow-md shadow-[#C5A880]/15 hover:shadow-[#C5A880]/25 active:scale-[0.98] shrink-0"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Request Technical Dossier</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsDossierOpen(true)}
              className="p-2 text-xs font-mono-tech rounded bg-zinc-900 border border-zinc-800 text-[#C5A880]"
              title="Dossier"
            >
              <FileDown className="w-4 h-4" />
            </button>
            <button
              id="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-300 hover:text-white rounded-md bg-zinc-900 border border-zinc-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drop */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-zinc-800 bg-zinc-950/98 px-6 py-6 space-y-4">
            <div className="flex flex-col space-y-3 font-mono-tech text-xs tracking-wider uppercase text-zinc-300">
              <a
                href="#overview"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#C5A880] py-1 border-b border-zinc-900"
              >
                Overview
              </a>
              <a
                href="#bim-simulator"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#C5A880] py-1 border-b border-zinc-900 flex items-center justify-between font-bold"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>3D BIM Structural Simulator</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C5A880]/20 text-[#C5A880]">LOD400</span>
              </a>
              <a
                href="#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#C5A880] py-1 border-b border-zinc-900"
              >
                Signature Projects
              </a>
              <a
                href="#capabilities"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#C5A880] py-1 border-b border-zinc-900"
              >
                BIM Governance
              </a>
              <a
                href="#metrics"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#C5A880] py-1 border-b border-zinc-900"
              >
                Delivery Metrics
              </a>
              <a
                href="#timeline"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#C5A880] py-1 border-b border-zinc-900"
              >
                Career Timeline
              </a>
              <a
                href="#credentials"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#C5A880] py-1 border-b border-zinc-900"
              >
                Credentials & Tools
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#C5A880] py-1"
              >
                Contact
              </a>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsDossierOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded bg-[#C5A880] text-zinc-950 font-mono-tech text-xs uppercase font-semibold"
            >
              <FileDown className="w-4 h-4" />
              Request Technical Dossier
            </button>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section
        id="hero"
        className="relative z-10 pt-12 pb-16 md:pt-20 md:pb-24 border-b border-zinc-800/80 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Col: Hero Statement & Intro */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              {/* Engineering Accreditation Badge */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-zinc-900/90 border border-zinc-700/80 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
                <span className="text-xs font-mono-tech text-zinc-300 tracking-wide">
                  MEngNZ-1160599 • Auckland, New Zealand
                </span>
                <span className="hidden sm:inline-block text-zinc-600">|</span>
                <span className="hidden sm:inline-block text-xs font-mono-tech text-[#C5A880]">
                  LOD400 Structural Delivery Lead
                </span>
              </div>

              {/* High Impact Architectural Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-display font-extrabold text-white tracking-tight leading-tight sm:leading-[1.15]">
                Engineering Precision at Scale:
                <span className="block mt-2.5 sm:mt-3 text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-neutral-200 to-[#C5A880]">
                  Programme-Level BIM Governance & Structural Delivery.
                </span>
              </h1>

              {/* Subheadline directly from resume */}
              <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed max-w-3xl">
                18+ years leading large-span structural steel, precast systems, and LOD400 BIM authoring across
                Australasia. Currently driving sprint-based BIM operations and multi-team technical governance at{' '}
                <span className="text-white font-medium underline decoration-[#C5A880]/60 underline-offset-4">
                  Kirk Roberts Consulting
                </span>
                , stewarding high-volume Kāinga Ora housing typologies and major commercial landmarks.
              </p>

              {/* Primary Actions */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-md bg-[#C5A880] hover:bg-[#b5966c] text-zinc-950 font-mono-tech font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-md shadow-[#C5A880]/15 group"
                >
                  <span>Explore Case Studies</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-zinc-900/90 hover:bg-zinc-800 text-neutral-200 border border-zinc-700/80 font-mono-tech text-xs uppercase tracking-wider transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Initiate Consultation</span>
                </a>

                <button
                  onClick={() => setIsDossierOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-md bg-zinc-900/50 hover:bg-zinc-800/80 text-zinc-300 border border-zinc-800 font-mono-tech text-xs uppercase tracking-wider transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Curated Summary</span>
                </button>
              </div>

              {/* Transferable Expertise Callout */}
              <div className="mt-6 pt-4 border-t border-zinc-800/60 text-xs font-mono-tech text-zinc-400 flex flex-wrap items-center gap-2">
                <span className="text-[#C5A880] font-semibold">✦ Target Practice Areas:</span>
                <span className="text-zinc-300">Complex Bridges, Water Retaining Tanks, Port & Wharf Structures, Heavy Civil Infrastructure</span>
              </div>
            </div>

            {/* Right Col: Technical Telemetry & BIM Coordinate HUD */}
            <div className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end">
              <div className="relative rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 backdrop-blur-md shadow-2xl space-y-5 max-w-md w-full">
                {/* HUD Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#C5A880]" />
                    <span className="font-mono-tech text-xs text-zinc-300 uppercase tracking-wider">
                      BIM Operations Telemetry
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono-tech bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE SPRINT ACTIVE
                  </span>
                </div>

                {/* HUD Technical Readout Parameters */}
                <div className="space-y-3 font-mono-tech text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/50">
                    <span className="text-zinc-400">Current Role</span>
                    <span className="text-neutral-100 font-semibold text-right">HDS Project Leader (BIM)</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/50">
                    <span className="text-zinc-400">Firm / Practice</span>
                    <span className="text-neutral-100 font-semibold">Kirk Roberts Consulting</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/50">
                    <span className="text-zinc-400">Unit Supervision</span>
                    <span className="text-[#C5A880] font-semibold">6 Structural Technicians</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/50">
                    <span className="text-zinc-400">Operating MBUs</span>
                    <span className="text-neutral-200">Auckland & Christchurch</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/50">
                    <span className="text-zinc-400">Sprint Cadence</span>
                    <span className="text-neutral-200">6-Wk Production Cycle</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-zinc-400">LOD Standard</span>
                    <span className="text-emerald-400 font-semibold">LOD400 Fabrication Ready</span>
                  </div>
                </div>

                {/* Micro Blueprint Wireframe Indicator with Real-Time Animated Truss */}
                <div className="p-3.5 rounded-lg bg-zinc-950/90 border border-zinc-800 space-y-2 relative overflow-hidden group">
                  <div className="flex items-center justify-between text-[11px] font-mono-tech text-zinc-400">
                    <span className="flex items-center gap-1.5 text-neutral-200">
                      <Rotate3d className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Parametric Truss Telemetry</span>
                    </span>
                    <a
                      href="#bim-simulator"
                      className="text-[#C5A880] text-[10px] font-bold hover:underline flex items-center gap-0.5"
                    >
                      <span>OPEN 3D</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Animated Mini Truss SVG with Laser Sweep */}
                  <div className="relative w-full h-24 bg-zinc-900/80 rounded-md border border-zinc-800/80 overflow-hidden flex items-center justify-center">
                    {/* Animated Laser Sweep Beam */}
                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#22d3ee] animate-laser-sweep pointer-events-none z-10" />

                    <svg className="w-full h-full p-2" viewBox="0 0 240 80" fill="none" stroke="currentColor">
                      {/* Foundation Ground & Piles */}
                      <line x1="20" y1="70" x2="220" y2="70" stroke="#3f3f46" strokeWidth="1.5" />
                      <line x1="40" y1="70" x2="40" y2="78" stroke="#71717a" strokeWidth="2.5" />
                      <line x1="120" y1="70" x2="120" y2="78" stroke="#71717a" strokeWidth="2.5" />
                      <line x1="200" y1="70" x2="200" y2="78" stroke="#71717a" strokeWidth="2.5" />

                      {/* Structural Columns */}
                      <line x1="40" y1="70" x2="40" y2="30" stroke="#E0CEB5" strokeWidth="2" />
                      <line x1="200" y1="70" x2="200" y2="30" stroke="#E0CEB5" strokeWidth="2" />
                      <line x1="120" y1="70" x2="120" y2="30" stroke="#E0CEB5" strokeWidth="1.5" strokeDasharray="3 3" />

                      {/* Portal Rafters / 60m Truss */}
                      <line x1="40" y1="30" x2="120" y2="12" stroke="#C5A880" strokeWidth="2" />
                      <line x1="120" y1="12" x2="200" y2="30" stroke="#C5A880" strokeWidth="2" />

                      {/* Lower Chord Tie */}
                      <line x1="40" y1="35" x2="200" y2="35" stroke="#C5A880" strokeWidth="1.2" opacity="0.7" />

                      {/* Internal Truss Web Members */}
                      <line x1="40" y1="35" x2="80" y2="21" stroke="#C5A880" strokeWidth="1" opacity="0.6" />
                      <line x1="80" y1="21" x2="80" y2="35" stroke="#C5A880" strokeWidth="1" opacity="0.6" />
                      <line x1="80" y1="35" x2="120" y2="12" stroke="#C5A880" strokeWidth="1" opacity="0.6" />
                      <line x1="120" y1="12" x2="160" y2="35" stroke="#C5A880" strokeWidth="1" opacity="0.6" />
                      <line x1="160" y1="35" x2="160" y2="21" stroke="#C5A880" strokeWidth="1" opacity="0.6" />
                      <line x1="160" y1="21" x2="200" y2="35" stroke="#C5A880" strokeWidth="1" opacity="0.6" />

                      {/* Bolted Nodes (Flashing Bronze) */}
                      <circle cx="40" cy="30" r="3" fill="#C5A880" className="animate-node-pulse" />
                      <circle cx="200" cy="30" r="3" fill="#C5A880" className="animate-node-pulse" />
                      <circle cx="120" cy="12" r="3.5" fill="#E0CEB5" />
                      <circle cx="40" cy="70" r="2.5" fill="#94a3b8" />
                      <circle cx="200" cy="70" r="2.5" fill="#94a3b8" />
                    </svg>

                    <div className="absolute bottom-1 right-2 text-[8px] font-mono-tech text-cyan-400 bg-zinc-950/80 px-1.5 py-0.5 rounded border border-cyan-800/40">
                      LiDAR SCAN: ACTIVE (0.00mm)
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] font-mono-tech text-zinc-400 pt-1">
                    <span>KOHC Typology Model Health</span>
                    <span className="text-[#C5A880]">99.4% Conformance</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#C5A880] h-1.5 rounded-full w-[99.4%]" />
                  </div>
                  <div className="text-[10px] font-mono-tech text-zinc-400 text-right">
                    Zero fatal schema errors • ACC sync verified
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LIVE METRIC BAR (4-Col Grid) */}
          <div id="metrics" className="mt-12 pt-8 border-t border-zinc-800/80">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {/* Metric 1 */}
              <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-[#C5A880]/50 transition-colors group">
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-neutral-100 group-hover:text-[#C5A880] transition-colors">
                  18+
                </div>
                <div className="mt-1 font-mono-tech text-xs uppercase tracking-wider text-[#C5A880]">
                  Years Multi-Country
                </div>
                <p className="mt-1 text-xs text-zinc-400">
                  New Zealand & international structural delivery experience across steel, concrete, and CFS.
                </p>
              </div>

              {/* Metric 2 */}
              <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-[#C5A880]/50 transition-colors group">
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-neutral-100 group-hover:text-[#C5A880] transition-colors">
                  60m
                </div>
                <div className="mt-1 font-mono-tech text-xs uppercase tracking-wider text-[#C5A880]">
                  Clear-Span Industrial CFS
                </div>
                <p className="mt-1 text-xs text-zinc-400">
                  Manor Build facility delivery with Formsteel, achieving 47% lower embodied carbon.
                </p>
              </div>

              {/* Metric 3 */}
              <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-[#C5A880]/50 transition-colors group">
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-neutral-100 group-hover:text-[#C5A880] transition-colors">
                  46
                </div>
                <div className="mt-1 font-mono-tech text-xs uppercase tracking-wider text-[#C5A880]">
                  Standardised Typologies
                </div>
                <p className="mt-1 text-xs text-zinc-400">
                  Authored & curated production-baseline Revit library for Kāinga Ora national delivery.
                </p>
              </div>

              {/* Metric 4 */}
              <div className="p-5 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-[#C5A880]/50 transition-colors group">
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-neutral-100 group-hover:text-[#C5A880] transition-colors">
                  ~20%
                </div>
                <div className="mt-1 font-mono-tech text-xs uppercase tracking-wider text-[#C5A880]">
                  Programme RFI Reduction
                </div>
                <p className="mt-1 text-xs text-zinc-400">
                  Documented site clash and request-for-information reduction through standardized LOD400 protocols.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5. INTERACTIVE 3D STRUCTURAL BIM & ASSEMBLY SIMULATOR */}
      <section id="bim-simulator" className="relative z-10 py-16 md:py-24 border-b border-zinc-800/80 bg-zinc-950/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono-tech text-[#C5A880] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive BIM Digital Twin & Structural Simulator</span>
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                3D Structural BIM & Construction Assembly Simulator
              </h2>
              <p className="mt-2 text-sm sm:text-base text-zinc-400 leading-relaxed">
                Direct browser-based 3D coordinate model viewport. Drag to orbit, wheel to zoom, click nodes to inspect moment joints, and simulate multi-phase erection timelines from foundation piles to LOD400 apex bolts. Toggle between wireframe geometry, Finite Element Analysis (FEA) stress heatmaps, and LiDAR scan sweeps.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 font-mono-tech text-xs">
              <div className="px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>LOD400 Digital Twin Active</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[#C5A880]">
                <span>Revit 2024 • Tekla • Navisworks</span>
              </div>
            </div>
          </div>

          {/* Interactive Structural BIM Viewer Component */}
          <StructuralBimViewer defaultModel={simulatorModel} />
        </div>
      </section>

      {/* 3. KEY CAPABILITIES MATRIX (BENTO GRID LAYOUT) */}
      <section id="capabilities" className="relative z-10 py-16 md:py-24 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono-tech text-[#C5A880] uppercase tracking-wider">
              Core Technical Competencies
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
              BIM Governance & Technical Capabilities Matrix
            </h2>
            <p className="mt-2 text-sm sm:text-base text-zinc-400 leading-relaxed">
              Synthesizing advanced parametric authoring, geometric automation, and multi-team QA frameworks to
              guarantee constructable, fabrication-ready documentation.
            </p>
          </div>

          {/* Bento Grid Layout (6 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Structural BIM & LOD400 */}
            <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/90 hover:border-[#C5A880]/60 transition-all hover:bg-zinc-900/70 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-[#C5A880] group-hover:scale-105 transition-transform mb-5">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-mono-tech text-[#C5A880] uppercase tracking-wider mb-1">
                  Core Specialization
                </div>
                <h3 className="text-lg font-display font-bold text-white group-hover:text-[#C5A880] transition-colors">
                  Structural BIM & LOD400 Authoring
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  End-to-end authoring across Revit 2018–2025. Authoring nested parametric family libraries, shared
                  parameter governance schemas, view template standardization, worksharing, and federated model health
                  auditing across ACC / BIM 360 environments.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-wrap gap-1.5">
                {['Revit 2018-2025', 'LOD400 Detailing', 'ACC / BIM 360', 'Shared Parameters', 'Model Health'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded bg-zinc-800/70 text-[10px] font-mono-tech text-zinc-300"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Card 2: Computational Automation & Scripting */}
            <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/90 hover:border-[#C5A880]/60 transition-all hover:bg-zinc-900/70 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-[#C5A880] group-hover:scale-105 transition-transform mb-5">
                  <Cpu className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-mono-tech text-[#C5A880] uppercase tracking-wider mb-1">
                  Efficiency Multiplier
                </div>
                <h3 className="text-lg font-display font-bold text-white group-hover:text-[#C5A880] transition-colors">
                  Computational Automation & Scripting
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Dynamo visual programming integrated with Python scripting to eliminate repetitive drafting bottlenecks.
                  Automated geometric modeling, sheet generation, parameter auditing, and rebar scheduling routines that
                  boost multi-team drafting velocity.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-wrap gap-1.5">
                {['Dynamo', 'Python Scripting', 'Drafting Automation', 'Schedule Generation', 'Error Auditing'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded bg-zinc-800/70 text-[10px] font-mono-tech text-zinc-300"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Card 3: Advanced Structural Systems */}
            <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/90 hover:border-[#C5A880]/60 transition-all hover:bg-zinc-900/70 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-[#C5A880] group-hover:scale-105 transition-transform mb-5">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-mono-tech text-[#C5A880] uppercase tracking-wider mb-1">
                  Engineering Scope
                </div>
                <h3 className="text-lg font-display font-bold text-white group-hover:text-[#C5A880] transition-colors">
                  Advanced Structural Systems
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Deep technical domain experience across large-span structural steel portal frames, light-gauge
                  cold-formed steel (CFS), multi-storey precast concrete, deep bored piles, suspended post-tensioned /
                  composite slabs, and complex civil retaining wall packages.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-wrap gap-1.5">
                {['Large-Span Steel', 'Precast Concrete', 'Light-Gauge CFS', 'Deep Bored Piles', 'Retaining Walls'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded bg-zinc-800/70 text-[10px] font-mono-tech text-zinc-300"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Card 4: DfMA & Fabrication Integration */}
            <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/90 hover:border-[#C5A880]/60 transition-all hover:bg-zinc-900/70 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-[#C5A880] group-hover:scale-105 transition-transform mb-5">
                  <Workflow className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-mono-tech text-[#C5A880] uppercase tracking-wider mb-1">
                  Manufacturing Interface
                </div>
                <h3 className="text-lg font-display font-bold text-white group-hover:text-[#C5A880] transition-colors">
                  DfMA & Fabrication Integration
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Direct translation of architectural intent into machine-readable fabrication data. Experience with CNC
                  rollforming outputs, StrucSoft MWF framing, Vertex BD, and shop-floor manufacturing coordination that
                  prevents on-site fabrication rework.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-wrap gap-1.5">
                {['CNC Rollforming', 'StrucSoft MWF', 'Vertex BD', 'DfMA Principles', 'Shop Drawings'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded bg-zinc-800/70 text-[10px] font-mono-tech text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 5: Technical Governance & Team Leadership */}
            <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/90 hover:border-[#C5A880]/60 transition-all hover:bg-zinc-900/70 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-[#C5A880] group-hover:scale-105 transition-transform mb-5">
                  <Boxes className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-mono-tech text-[#C5A880] uppercase tracking-wider mb-1">
                  Team Leadership
                </div>
                <h3 className="text-lg font-display font-bold text-white group-hover:text-[#C5A880] transition-colors">
                  Technical Governance & Team Leadership
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Supervising 6 structural technicians across Auckland and Christchurch MBUs. Managing 6-week production
                  sprints, weekly planning rhythms, capacity forecasting, and rigorous multi-stage QA peer-review
                  sign-off gates.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-wrap gap-1.5">
                {['6-Technician Team', 'Sprint Delivery', 'Multi-MBU Lead', 'QA Checklists', 'Mentorship'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded bg-zinc-800/70 text-[10px] font-mono-tech text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 6: Standards Compliance */}
            <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/90 hover:border-[#C5A880]/60 transition-all hover:bg-zinc-900/70 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-[#C5A880] group-hover:scale-105 transition-transform mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-mono-tech text-[#C5A880] uppercase tracking-wider mb-1">
                  Statutory & Codes
                </div>
                <h3 className="text-lg font-display font-bold text-white group-hover:text-[#C5A880] transition-colors">
                  Codes, Standards & Sustainability
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Rigorous adherence to the New Zealand Building Code (B1, VM1), NZS 3404 (Steel), NZS 3604 (Timber),
                  AS/NZS 1170 (Design Actions), AS/NZS 4600 (Cold-Formed Steel), NASH Standards, and Homestar 6 green
                  rating benchmarks.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-wrap gap-1.5">
                {['NZS 3404', 'NZS 3604', 'AS/NZS 1170', 'AS/NZS 4600', 'NASH', 'Homestar 6'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded bg-zinc-800/70 text-[10px] font-mono-tech text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SIGNATURE PROJECTS PORTFOLIO */}
      <section id="projects" className="relative z-10 py-16 md:py-24 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono-tech text-[#C5A880] uppercase tracking-wider">
                Case Studies & Landmark Deliveries
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                Signature Projects Portfolio
              </h2>
              <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-2xl">
                Representative structural and BIM programmes across commercial warehouses, multi-unit residential, and
                national housing delivery. Click any card to examine detailed technical specifications.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 p-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-mono-tech tracking-wider uppercase transition-all duration-150 ${
                    activeCategory === cat
                      ? 'bg-[#C5A880] text-zinc-950 font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer rounded-xl bg-zinc-900/40 border border-zinc-800/90 hover:border-[#C5A880] transition-all duration-200 hover:bg-zinc-900/70 p-6 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Accent top line on hover */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Metadata Bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono-tech uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800/90 text-[#C5A880] border border-zinc-700/60">
                      {project.category}
                    </span>
                    {project.recognition && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono-tech text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                        <Award className="w-3 h-3 text-amber-400" />
                        Finalist
                      </span>
                    )}
                  </div>

                  {/* Headline Title */}
                  <h3 className="text-lg font-display font-bold text-white group-hover:text-[#C5A880] transition-colors leading-snug">
                    {project.title}
                  </h3>

                  {/* Location & Client Subtitle */}
                  <div className="mt-1 text-xs font-mono-tech text-zinc-400 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-zinc-400" />
                    <span>{project.location}</span>
                  </div>

                  {/* Highlight Metric Pill */}
                  <div className="mt-4 p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
                    <div className="text-[10px] font-mono-tech uppercase tracking-wider text-zinc-400">
                      Key Headline Metric
                    </div>
                    <div className="text-sm font-display font-semibold text-neutral-100 mt-0.5 text-[#C5A880]">
                      {project.headlineMetric}
                    </div>
                  </div>

                  {/* CAD Technical Dimension Strip */}
                  <div className="mt-4 py-1.5 px-3 rounded bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between text-[11px] font-mono-tech text-zinc-400">
                    <span className="text-zinc-600 font-bold">|◀</span>
                    <span className="text-[#C5A880] tracking-wider font-semibold">{project.specs.spanOrArea}</span>
                    <span className="text-zinc-600 font-bold">▶|</span>
                  </div>

                  {/* Structural System Overview */}
                  <div className="mt-3 space-y-1">
                    <div className="text-[11px] font-mono-tech text-zinc-400 uppercase tracking-wider">
                      Structural System:
                    </div>
                    <p className="text-xs text-zinc-300 line-clamp-2">{project.system}</p>
                  </div>
                </div>

                {/* Footer specs preview & drawer trigger */}
                <div className="mt-5 pt-3.5 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const modelMap: Record<string, StructuralModelType> = {
                        'manor-build': 'manor-build',
                        'greenslade': 'greenslade',
                        'kainga-ora': 'kainga-ora',
                        'summit-homes': 'kainga-ora',
                        'al-fardan': 'greenslade',
                        'musanada': 'greenslade',
                      };
                      openInSimulator(modelMap[project.id] || 'manor-build');
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800/80 hover:bg-[#C5A880] hover:text-zinc-950 text-zinc-300 font-mono-tech text-[10px] uppercase tracking-wider transition-colors border border-zinc-700/60"
                  >
                    <Rotate3d className="w-3 h-3 text-[#C5A880]" />
                    <span>3D Model</span>
                  </button>

                  <div className="inline-flex items-center gap-1 text-xs font-mono-tech text-[#C5A880] group-hover:translate-x-1 transition-transform">
                    <span>Inspect Spec</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT SPECIFICATION DRAWER / MODAL */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-y-auto flex flex-col text-neutral-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-20 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 px-6 py-5 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-[11px] font-mono-tech text-[#C5A880] border border-zinc-700">
                    {selectedProject.category}
                  </span>
                  <span className="text-xs font-mono-tech text-zinc-400">{selectedProject.location}</span>
                </div>
                <h3 className="mt-1.5 text-xl sm:text-2xl font-display font-bold text-white">
                  {selectedProject.title}
                </h3>
                <p className="text-xs font-mono-tech text-zinc-400 mt-0.5">
                  Entity: {selectedProject.clientOrOrg} • Role: {selectedProject.role}
                </p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Recognition Banner if applicable */}
              {selectedProject.recognition && (
                <div className="p-3.5 rounded-lg bg-amber-950/40 border border-amber-800/40 flex items-center gap-3">
                  <Award className="w-5 h-5 text-amber-400 shrink-0" />
                  <div className="text-xs font-mono-tech text-amber-200">
                    <span className="font-bold text-amber-400">Industry Commendation:</span>{' '}
                    {selectedProject.recognition}
                  </div>
                </div>
              )}

              {/* Technical Specifications Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 font-mono-tech text-xs">
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase">Envelope / Units</span>
                  <span className="text-neutral-100 font-semibold">{selectedProject.specs.spanOrArea}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase">Primary Impact</span>
                  <span className="text-[#C5A880] font-semibold">{selectedProject.specs.keyMetric}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase">Pace / Cycle</span>
                  <span className="text-neutral-200">{selectedProject.specs.sprintPace || 'Fast-Track Tracked'}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase">BIM Delivery</span>
                  <span className="text-emerald-400 font-semibold">LOD400 Compliant</span>
                </div>
              </div>

              {/* Scope & System */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono-tech uppercase tracking-wider text-[#C5A880]">
                  Structural System Architecture
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed">{selectedProject.system}</p>
                <p className="text-xs text-zinc-400 leading-relaxed pt-1">{selectedProject.scopeSummary}</p>
              </div>

              {/* Deliverables Checklist */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono-tech uppercase tracking-wider text-[#C5A880]">
                  Key Engineering Deliverables & Leadership Actions
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                  {selectedProject.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Detailed Execution Notes */}
              <div className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800/80 space-y-2">
                <h4 className="text-xs font-mono-tech uppercase tracking-wider text-zinc-400">
                  Execution & Constructability Observations
                </h4>
                <ul className="space-y-1.5 text-xs text-zinc-400 list-disc pl-4">
                  {selectedProject.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>

              {/* Software Stack & Standards Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <h4 className="text-[11px] font-mono-tech uppercase tracking-wider text-zinc-400 mb-2">
                    Specialist Software Stack
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.specs.software.map((sw) => (
                      <span
                        key={sw}
                        className="px-2 py-1 rounded bg-zinc-800 text-[11px] font-mono-tech text-zinc-300"
                      >
                        {sw}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-mono-tech uppercase tracking-wider text-zinc-400 mb-2">
                    Governing Standards & Codes
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.specs.codes.map((code) => (
                      <span
                        key={code}
                        className="px-2 py-1 rounded bg-zinc-800 text-[11px] font-mono-tech text-zinc-300 border border-zinc-700/50"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-zinc-800 px-6 py-4 bg-zinc-950/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono-tech text-zinc-400">Visagan Gunaratnam // Project Spec</span>
                <button
                  type="button"
                  onClick={() => {
                    const modelMap: Record<string, StructuralModelType> = {
                      'manor-build': 'manor-build',
                      'greenslade': 'greenslade',
                      'kainga-ora': 'kainga-ora',
                      'summit-homes': 'kainga-ora',
                      'al-fardan': 'greenslade',
                      'musanada': 'greenslade',
                    };
                    openInSimulator(modelMap[selectedProject.id] || 'manor-build');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#C5A880] hover:bg-[#b5966c] text-zinc-950 font-mono-tech text-xs font-semibold uppercase tracking-wider transition-colors shadow-md shadow-[#C5A880]/10"
                >
                  <Rotate3d className="w-3.5 h-3.5" />
                  <span>Launch in 3D BIM Simulator</span>
                </button>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono-tech text-neutral-200 transition-colors"
              >
                Close Spec Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. TECHNICAL EXPERIENCE & LEADERSHIP TIMELINE */}
      <section id="timeline" className="relative z-10 py-16 md:py-24 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono-tech text-[#C5A880] uppercase tracking-wider">
              18+ Years Track Record
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
              Technical Experience & Leadership Timeline
            </h2>
            <p className="mt-2 text-sm sm:text-base text-zinc-400 leading-relaxed">
              Demonstrated career progression from international civil & structural engineering programmes to senior
              BIM leadership, multi-office draughting governance, and proprietary industrial systems delivery in New
              Zealand.
            </p>
          </div>

          {/* Chronological Timeline Container */}
          <div className="relative border-l border-zinc-800 ml-4 sm:ml-6 space-y-12 pl-6 sm:pl-10">
            {/* Timeline Item 1 */}
            <div className="relative group">
              {/* Timeline Pin */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-zinc-950 border-2 border-[#C5A880] group-hover:bg-[#C5A880] transition-colors" />
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-mono-tech text-[#C5A880] bg-[#C5A880]/10 px-2.5 py-0.5 rounded border border-[#C5A880]/30 font-semibold">
                  Jan 2026 – Present
                </span>
                <span className="text-xs font-mono-tech text-zinc-400">• Current Senior Leadership</span>
              </div>
              <h3 className="text-xl font-display font-bold text-white group-hover:text-[#C5A880] transition-colors">
                HDS Project Leader — Structural Draughting & BIM
              </h3>
              <div className="text-sm font-mono-tech text-zinc-300">Kirk Roberts Consulting Ltd | Auckland & Christchurch</div>
              <div className="mt-3 text-sm text-zinc-400 space-y-2 max-w-3xl">
                <p>
                  Directly manage 6 structural technicians across Auckland and Christchurch MBUs within the Kāinga Ora
                  Housing Delivery System (HDS). Lead LOD400 modeling standards, drafting governance, and quality
                  assurance frameworks.
                </p>
                <p>
                  Define and operationalize family standards, shared parameter schemas, view templates, and model-health
                  protocols across the 46-model Revit house-typology library. Orchestrate sprint-based weekly planning
                  cycles in a 460-minute daily time-tracked, capacity-managed delivery environment.
                </p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative group">
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-zinc-950 border-2 border-zinc-600 group-hover:border-[#C5A880] transition-colors" />
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-mono-tech text-zinc-400 bg-zinc-900 px-2.5 py-0.5 rounded border border-zinc-800">
                  Mar 2022 – Jan 2026
                </span>
                <span className="text-xs font-mono-tech text-amber-400/90">• KR Project of the Year Finalist (×2)</span>
              </div>
              <h3 className="text-xl font-display font-bold text-white group-hover:text-[#C5A880] transition-colors">
                Senior Structural Technician
              </h3>
              <div className="text-sm font-mono-tech text-zinc-300">Kirk Roberts Consulting Ltd | Auckland, NZ</div>
              <div className="mt-3 text-sm text-zinc-400 space-y-2 max-w-3xl">
                <p>
                  Lead structural BIM technician on major company-wide submissions, including Greenslade Crescent
                  Apartments (5-storey, 52 units, precast + steel on deep bored piles) and Aalto Apartments (39 boutique
                  units, Ockham Residential), both named finalists for Kirk Roberts Project of the Year 2025.
                </p>
                <p>
                  Delivered comprehensive structural BIM documentation on Bunnings Waipapa (8,500m² warehouse) and
                  extensive retaining wall systems for Kāinga Ora developments. Owned Building Consent, tender, and
                  construction packages with multi-disciplinary coordination.
                </p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative group">
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-zinc-950 border-2 border-zinc-600 group-hover:border-[#C5A880] transition-colors" />
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-mono-tech text-zinc-400 bg-zinc-900 px-2.5 py-0.5 rounded border border-zinc-800">
                  May 2020 – Mar 2022
                </span>
                <span className="text-xs font-mono-tech text-zinc-400">• Large-Span Industrial CFS Leadership</span>
              </div>
              <h3 className="text-xl font-display font-bold text-white group-hover:text-[#C5A880] transition-colors">
                Technical Project Manager / CAD Developer
              </h3>
              <div className="text-sm font-mono-tech text-zinc-300">Formsteel Technologies Ltd | Auckland, NZ</div>
              <div className="mt-3 text-sm text-zinc-400 space-y-2 max-w-3xl">
                <p>
                  Led in-house engineering and fabrication documentation team delivering Formsteel’s proprietary light-gauge
                  cold-formed steel (CFS) building system with clear spans up to 60m across industrial, warehousing, and
                  commercial projects nationally (e.g. Manor Build facility in New Plymouth).
                </p>
                <p>
                  Owned the complete technical delivery cycle: client consultation → structural detailing → building
                  consent documentation → fabrication drawings → direct CNC roll-forming machine outputs → site
                  monitoring. Authored CFS Revit families for public download and managed drafting resource allocation.
                </p>
              </div>
            </div>

            {/* Timeline Item 4 */}
            <div className="relative group">
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-zinc-950 border-2 border-zinc-600 group-hover:border-[#C5A880] transition-colors" />
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-mono-tech text-zinc-400 bg-zinc-900 px-2.5 py-0.5 rounded border border-zinc-800">
                  Jun 2019 – Dec 2019
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-white group-hover:text-[#C5A880] transition-colors">
                Structural CAD Designer
              </h3>
              <div className="text-sm font-mono-tech text-zinc-300">Rollforming Services Ltd / Speedfloor | Auckland, NZ</div>
              <div className="mt-2 text-sm text-zinc-400 max-w-3xl">
                Detailed cold-formed steel structures and Speedfloor composite flooring systems. Produced CNC output files
                for rollforming machinery and authored reusable parametric CFS Revit families in StrucSoft MWF and Vertex
                BD.
              </div>
            </div>

            {/* Timeline Item 5 */}
            <div className="relative group">
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-zinc-950 border-2 border-zinc-600 group-hover:border-[#C5A880] transition-colors" />
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-mono-tech text-zinc-400 bg-zinc-900 px-2.5 py-0.5 rounded border border-zinc-800">
                  Jan 2018 – Jun 2019
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-white group-hover:text-[#C5A880] transition-colors">
                Structural CAD Designer / Technician
              </h3>
              <div className="text-sm font-mono-tech text-zinc-300">Terra Group NZ Ltd | Auckland, NZ</div>
              <div className="mt-2 text-sm text-zinc-400 max-w-3xl">
                Detailed structural connections for timber, structural steel, and reinforced concrete. Produced
                preliminary and final design documentation and conducted systematic site observations for compliance.
              </div>
            </div>

            {/* Timeline Item 6: International Experience */}
            <div className="relative group">
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-zinc-950 border-2 border-zinc-600 group-hover:border-[#C5A880] transition-colors" />
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-mono-tech text-zinc-400 bg-zinc-900 px-2.5 py-0.5 rounded border border-zinc-800">
                  2006 – 2018
                </span>
                <span className="text-xs font-mono-tech text-zinc-400">• International Bilateral & UN Programmes</span>
              </div>
              <h3 className="text-xl font-display font-bold text-white group-hover:text-[#C5A880] transition-colors">
                Earlier International Engineering & Project Leadership (Sri Lanka)
              </h3>
              <div className="text-sm font-mono-tech text-zinc-300">
                High Commission of India (2013–2016) | UN / IOM (2010–2013) | Senior Civil Technician (2006–2018)
              </div>
              <div className="mt-3 text-sm text-zinc-400 space-y-2 max-w-3xl">
                <p>
                  <span className="text-neutral-200 font-semibold">Project Officer, High Commission of India:</span>{' '}
                  Technical specialist on the landmark 50,000 Housing Programme. Delivered design, planning, and project
                  management oversight across major civil construction works; achieved a 100% financial delivery rate on
                  managed public capital budgets.
                </p>
                <p>
                  <span className="text-neutral-200 font-semibold">Project Coordinator, IOM / United Nations:</span>{' '}
                  Coordinated livelihoods stabilization and post-conflict infrastructure rehabilitation projects including
                  community civil works, structural retrofitting, and infrastructure re-commissioning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EDUCATION, ACCREDITATIONS & STANDARDS BAR */}
      <section id="credentials" className="relative z-10 py-16 md:py-24 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Col: Academic & Professional Credentials */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono-tech text-[#C5A880] uppercase tracking-wider">
                  Verified Accreditations
                </div>
                <h2 className="mt-3 text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  Education & Professional Membership
                </h2>
              </div>

              {/* Engineering NZ Card */}
              <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-[#C5A880]/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-[#C5A880] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono-tech text-[#C5A880] uppercase tracking-wider">
                      Professional Membership
                    </div>
                    <h3 className="text-base font-display font-bold text-white mt-0.5">
                      Engineering New Zealand — Member (MEngNZ)
                    </h3>
                    <div className="mt-1 text-xs font-mono-tech text-zinc-300">
                      Membership ID: <span className="text-neutral-100 font-bold">1160599</span> • Registered Practice
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Timeline List */}
              <div className="space-y-3 font-mono-tech text-xs">
                {/* Degree 1 */}
                <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800/80 flex items-start gap-3">
                  <GraduationCap className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-neutral-100">
                      Graduate Diploma in Construction Project Management
                    </div>
                    <div className="text-zinc-400 mt-0.5">
                      Unitec Institute of Technology, Auckland • Completed April 2025
                    </div>
                  </div>
                </div>

                {/* Degree 2 */}
                <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800/80 flex items-start gap-3">
                  <GraduationCap className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-neutral-100">
                      Graduate Diploma in Construction Technology
                    </div>
                    <div className="text-zinc-400 mt-0.5">
                      City & Guilds London Institute • 2010
                    </div>
                  </div>
                </div>

                {/* Degree 3 */}
                <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800/80 flex items-start gap-3">
                  <GraduationCap className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-neutral-100">
                      Advanced Diploma in Construction Technology (NZQA Level 4)
                    </div>
                    <div className="text-zinc-400 mt-0.5">
                      City & Guilds London Institute • 2009
                    </div>
                  </div>
                </div>

                {/* Degree 4 */}
                <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800/80 flex items-start gap-3">
                  <GraduationCap className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-neutral-100">
                      National Certificate in Technology — Civil Engineering (NZQA Level 5)
                    </div>
                    <div className="text-zinc-400 mt-0.5">
                      Department of Technical Education, Sri Lanka • 2008
                    </div>
                  </div>
                </div>
              </div>

              {/* Language Proficiency */}
              <div className="p-4 rounded-lg bg-zinc-900/30 border border-zinc-800/60 font-mono-tech text-xs flex items-center justify-between">
                <span className="text-zinc-400">Language Fluency:</span>
                <span className="text-neutral-200">English (Professional) • Tamil (Native) • Sinhala (Fluent)</span>
              </div>
            </div>

            {/* Right Col: Tools Cloud & Standards Cloud */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono-tech text-[#C5A880] uppercase tracking-wider">
                  Technical Tooling
                </div>
                <h2 className="mt-3 text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  Software Stack & Code Compliance
                </h2>
              </div>

              {/* Specialist Software Badge Cloud */}
              <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
                <div className="text-xs font-mono-tech text-[#C5A880] uppercase tracking-wider flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  <span>Specialist Software & BIM Platforms</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { name: 'Autodesk Revit', sub: 'Structure & Arch (2018–2025)' },
                    { name: 'Dynamo + Python', sub: 'Parametric Automation' },
                    { name: 'ACC / BIM 360', sub: 'Cloud Worksharing' },
                    { name: 'Navisworks Manage', sub: 'Clash Resolution' },
                    { name: 'StrucSoft MWF', sub: 'CFS FrameBuilder' },
                    { name: 'Vertex BD', sub: 'Cold-Formed Detailing' },
                    { name: 'AutoCAD 2D/3D', sub: 'Drafting & Details' },
                    { name: 'Bluebeam Revu', sub: 'QA Review & Markup' },
                    { name: 'SketchUp Pro', sub: 'Spatial Massing' },
                  ].map((tool) => (
                    <div
                      key={tool.name}
                      className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80 hover:border-[#C5A880]/50 transition-colors"
                    >
                      <div className="text-xs font-display font-bold text-neutral-100">{tool.name}</div>
                      <div className="text-[10px] font-mono-tech text-zinc-400 mt-0.5">{tool.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Governing Standards Badges */}
              <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
                <div className="text-xs font-mono-tech text-[#C5A880] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Governing Standards & Compliance Codes</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { code: 'NZS 3404', desc: 'Steel Structures Standard' },
                    { code: 'NZS 3604', desc: 'Timber-Framed Buildings' },
                    { code: 'AS/NZS 1170', desc: 'Structural Design Actions' },
                    { code: 'AS/NZS 4600', desc: 'Cold-Formed Steel' },
                    { code: 'NASH Standards', desc: 'Residential Steel Framing' },
                    { code: 'NZBC B1/VM1', desc: 'MBIE Verification Method' },
                    { code: 'NZS 3101', desc: 'Concrete Structures' },
                    { code: 'Homestar 6', desc: 'Green Star NZ Standard' },
                    { code: 'MBIE Acceptable', desc: 'Compliance Solutions' },
                  ].map((std) => (
                    <div
                      key={std.code}
                      className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                    >
                      <div className="text-xs font-mono-tech font-bold text-[#C5A880]">{std.code}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5 leading-tight">{std.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LUXURY MINIMALIST CONTACT & DOSSIER REQUEST FOOTER */}
      <footer id="contact" className="relative z-10 pt-16 pb-12 bg-zinc-950 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-zinc-800/80">
            {/* Left Col: Direct Details & Coordinates */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono-tech text-[#C5A880] uppercase tracking-wider">
                  Direct Line & Practice Channels
                </div>
                <h2 className="mt-3 text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  Initiate Technical Consultation
                </h2>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed max-w-md">
                  Available for programme-level BIM governance consultations, large-span steel/precast advisory,
                  and senior technical draughting leadership inquiries.
                </p>
              </div>

              {/* Direct Channels List */}
              <div className="space-y-3 font-mono-tech text-xs">
                {/* Location */}
                <div className="flex items-center gap-3.5 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                  <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-[#C5A880]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase">Geographic Location</div>
                    <div className="text-neutral-100 font-semibold">Favona, Auckland, New Zealand</div>
                  </div>
                </div>

                {/* Phone */}
                <a
                  href="tel:+64212356282"
                  className="flex items-center gap-3.5 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-[#C5A880]/50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-[#C5A880] group-hover:scale-105 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase">Direct Mobile Line</div>
                    <div className="text-neutral-100 font-semibold group-hover:text-[#C5A880] transition-colors">
                      +64 21 235 6282
                    </div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:visagan143@gmail.com"
                  className="flex items-center gap-3.5 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-[#C5A880]/50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-[#C5A880] group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase">Electronic Mail</div>
                    <div className="text-neutral-100 font-semibold group-hover:text-[#C5A880] transition-colors">
                      visagan143@gmail.com
                    </div>
                  </div>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/in/visagan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-[#C5A880]/50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-[#C5A880] group-hover:scale-105 transition-transform">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-zinc-400 uppercase">Professional Network</div>
                      <div className="text-neutral-100 font-semibold group-hover:text-[#C5A880] transition-colors">
                        linkedin.com/in/visagan
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-[#C5A880]" />
                  </div>
                </a>
              </div>

              {/* Dossier Quick Trigger */}
              <div className="pt-2">
                <button
                  onClick={() => setIsDossierOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-[#C5A880]/40 text-[#C5A880] font-mono-tech text-xs uppercase tracking-wider transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                  <span>View Formatted Technical Dossier</span>
                </button>
              </div>
            </div>

            {/* Right Col: Interactive Contact Dispatch Form */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 backdrop-blur-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-display font-bold text-white">Send Direct Message</h3>
                  <span className="text-[10px] font-mono-tech text-zinc-400">Response time &lt; 24 hrs</span>
                </div>

                {contactSubmitted ? (
                  <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-center space-y-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h4 className="text-base font-display font-bold text-white">Inquiry Transmitted</h4>
                    <p className="text-xs font-mono-tech text-emerald-200">
                      Thank you for initiating contact. A technical briefing response will be dispatched to{' '}
                      <span className="text-white font-semibold">{contactForm.email || 'your address'}</span> shortly.
                    </p>
                    <button
                      onClick={() => setContactSubmitted(false)}
                      className="mt-2 text-xs font-mono-tech text-[#C5A880] underline underline-offset-4"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono-tech uppercase text-zinc-400 mb-1.5">
                          Sender Name / Organisation *
                        </label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="e.g., Kirk Roberts / Studio Lead"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] text-sm text-neutral-100 placeholder-zinc-600 outline-none transition-all font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono-tech uppercase text-zinc-400 mb-1.5">
                          Direct Contact Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="your.email@engineering.co.nz"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] text-sm text-neutral-100 placeholder-zinc-600 outline-none transition-all font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-tech uppercase text-zinc-400 mb-1.5">
                        Inquiry Scope / Practice Area
                      </label>
                      <select
                        value={contactForm.inquiryType}
                        onChange={(e) => setContactForm({ ...contactForm, inquiryType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] text-sm text-neutral-100 outline-none transition-all font-mono-tech text-xs"
                      >
                        <option value="Structural BIM Leadership">Programme-Level Structural BIM Leadership</option>
                        <option value="Large-Span Steel & CFS Consultation">Large-Span Steel & CFS Advisory</option>
                        <option value="Precast & High-Density Residential Delivery">
                          Precast & Multi-Unit Residential Detailing
                        </option>
                        <option value="Dynamo & Python Computational Scripting">
                          Dynamo / Computational Automation Implementation
                        </option>
                        <option value="Infrastructure Recruitment">Senior Practice Recruitment / Contract</option>
                        <option value="General Technical Inquiry">General Technical Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-tech uppercase text-zinc-400 mb-1.5">
                        Project Brief or Specific Query *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Detail project specifications, structural system scope, or consultation requirements..."
                        className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] text-sm text-neutral-100 placeholder-zinc-600 outline-none transition-all font-sans resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#C5A880] hover:bg-[#b5966c] text-zinc-950 font-mono-tech font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-md shadow-[#C5A880]/10"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Message</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Minimal Architectural Copyright & Coordinates Mark */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-tech text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="text-[#C5A880]">© {new Date().getFullYear()}</span>
              <span>VISAGAN GUNARATNAM • MEngNZ-1160599</span>
            </div>
            <div className="text-[11px] text-zinc-400 flex items-center gap-2">
              <span>Auckland: 36.9634° S, 174.8055° E</span>
              <span>•</span>
              <span>LOD400 Structural Governance</span>
            </div>
          </div>
        </div>
      </footer>

      {/* TECHNICAL DOSSIER MODAL */}
      {isDossierOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-y-auto flex flex-col text-neutral-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dossier Header */}
            <div className="sticky top-0 z-20 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[#C5A880]">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono-tech text-[#C5A880] uppercase tracking-wider">
                    Executive Technical Dossier
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-white">
                    Visagan Gunaratnam // MEngNZ-1160599
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyDossierText}
                  className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs font-mono-tech text-zinc-300 transition-colors flex items-center gap-1.5"
                  title="Copy formatted dossier to clipboard"
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${dossierCopied ? 'text-emerald-400' : 'text-zinc-400'}`} />
                  <span>{dossierCopied ? 'Copied' : 'Copy Text'}</span>
                </button>
                <button
                  onClick={() => setIsDossierOpen(false)}
                  className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                  aria-label="Close dossier"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Dossier Body */}
            <div className="p-6 sm:p-8 space-y-8 text-neutral-200">
              {/* Executive Summary Block */}
              <div className="p-5 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
                <h4 className="text-xs font-mono-tech uppercase tracking-wider text-[#C5A880]">
                  Professional Executive Profile
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Structural BIM and technical delivery leader with 18+ years of multi-country experience across large-span
                  steel structures, reinforced concrete, precast concrete, cold-formed steel fabrication, retaining wall
                  systems, and high-volume residential delivery. Brings programme-level BIM coordination capability —
                  Revit LOD400 authoring, Revit family library creation, Dynamo scripting (Python-driven), ACC/BIM 360 —
                  combined with hands-on technical leadership of multi-person drafting teams.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono-tech text-zinc-400">
                  <span className="text-[#C5A880]">Location:</span> Favona, Auckland, New Zealand |
                  <span className="text-[#C5A880]">Phone:</span> +64 21 235 6282 |
                  <span className="text-[#C5A880]">Email:</span> visagan143@gmail.com
                </div>
              </div>

              {/* Key Quantitative Metrics */}
              <div>
                <h4 className="text-xs font-mono-tech uppercase tracking-wider text-[#C5A880] mb-3">
                  Key Quantitative Impact Summary
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-lg bg-zinc-950/50 border border-zinc-800">
                    <div className="text-2xl font-display font-bold text-white">18+ Years</div>
                    <div className="text-[10px] font-mono-tech text-zinc-400 mt-0.5">Multi-Country Delivery</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-zinc-950/50 border border-zinc-800">
                    <div className="text-2xl font-display font-bold text-[#C5A880]">60m Clear</div>
                    <div className="text-[10px] font-mono-tech text-zinc-400 mt-0.5">Industrial CFS Span</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-zinc-950/50 border border-zinc-800">
                    <div className="text-2xl font-display font-bold text-white">46 Models</div>
                    <div className="text-[10px] font-mono-tech text-zinc-400 mt-0.5">Kāinga Ora Library</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-zinc-950/50 border border-zinc-800">
                    <div className="text-2xl font-display font-bold text-emerald-400">~20%</div>
                    <div className="text-[10px] font-mono-tech text-zinc-400 mt-0.5">Programme RFI Reduction</div>
                  </div>
                </div>
              </div>

              {/* Core NZ Experience Condensed */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono-tech uppercase tracking-wider text-[#C5A880]">
                  Senior Technical Leadership (New Zealand)
                </h4>
                <div className="space-y-3 text-xs font-mono-tech">
                  <div className="p-3.5 rounded-lg bg-zinc-950/40 border border-zinc-800/80">
                    <div className="flex justify-between text-neutral-100 font-bold">
                      <span>HDS Project Leader — Structural Draughting & BIM</span>
                      <span className="text-[#C5A880]">Jan 2026 – Present</span>
                    </div>
                    <div className="text-zinc-400 mt-0.5">Kirk Roberts Consulting Ltd | Auckland & Christchurch</div>
                    <p className="font-sans text-xs text-zinc-300 mt-2">
                      Directly manage 6 structural technicians across Auckland and Christchurch MBUs. Lead LOD400
                      modelling, drafting governance, and QA across the 46-model KOHC house-typology library under 6-week
                      sprint cycles.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-zinc-950/40 border border-zinc-800/80">
                    <div className="flex justify-between text-neutral-100 font-bold">
                      <span>Senior Structural Technician</span>
                      <span className="text-zinc-400">Mar 2022 – Jan 2026</span>
                    </div>
                    <div className="text-zinc-400 mt-0.5">Kirk Roberts Consulting Ltd | Auckland</div>
                    <p className="font-sans text-xs text-zinc-300 mt-2">
                      Lead structural BIM technician on KR Project of the Year 2025 finalist projects (Greenslade Crescent
                      Apartments, Aalto Apartments) and Bunnings Waipapa (8,500m²). Owned Building Consent, tender, and
                      construction packages.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-zinc-950/40 border border-zinc-800/80">
                    <div className="flex justify-between text-neutral-100 font-bold">
                      <span>Technical Project Manager / CAD Developer</span>
                      <span className="text-zinc-400">May 2020 – Mar 2022</span>
                    </div>
                    <div className="text-zinc-400 mt-0.5">Formsteel Technologies Ltd | Auckland</div>
                    <p className="font-sans text-xs text-zinc-300 mt-2">
                      Led in-house engineering and fabrication documentation delivering Formsteel’s proprietary light-gauge
                      CFS building system (spans up to 60m). Owned client consultation, structural detailing, CNC
                      rollforming export, and authored Revit family libraries.
                    </p>
                  </div>
                </div>
              </div>

              {/* Education & Registration Summary */}
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                <h4 className="text-xs font-mono-tech uppercase tracking-wider text-[#C5A880]">
                  Education, Accreditations & Standards
                </h4>
                <ul className="text-xs font-mono-tech space-y-1 text-zinc-300">
                  <li>• Member, Engineering New Zealand (MEngNZ No. 1160599)</li>
                  <li>• Graduate Diploma in Construction Project Management — Unitec Institute of Technology (2025)</li>
                  <li>• Graduate & Advanced Diplomas in Construction Technology — City & Guilds London Institute</li>
                  <li>• National Certificate in Technology (Civil Engineering) — Sri Lanka (NZQA Level 5)</li>
                  <li>
                    • Codes: NZS 3404, NZS 3604, AS/NZS 1170, AS/NZS 4600, NASH Standards, NZBC B1/VM1, Homestar 6
                  </li>
                </ul>
              </div>
            </div>

            {/* Dossier Footer */}
            <div className="border-t border-zinc-800 px-6 py-4 bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-3">
              <a
                href="mailto:visagan143@gmail.com?subject=Technical%20Dossier%20Consultation%20Inquiry%20-%20Visagan%20Gunaratnam"
                className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#C5A880] text-zinc-950 font-mono-tech text-xs uppercase font-bold hover:bg-[#b5966c] transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Visagan Gunaratnam</span>
              </a>
              <button
                onClick={() => setIsDossierOpen(false)}
                className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono-tech text-neutral-200 transition-colors"
              >
                Close Technical Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
