import { useCallback, useEffect, useRef, useState } from "react";
import {
  Shield,
  Cpu,
  Zap,
  Download,
  Network,
  ChevronRight,
  Layers,
  FileText,
  ExternalLink,
} from "lucide-react";
import MeshNetworkTelemetry from "./components/MeshNetworkTelemetry";

const updates = [
  {
    version: "v1.16.0",
    date: "MAY 2026",
    type: "R&D",
    status: "In Progress",
    description:
      "Project: App retooling to accommodate Voice over MeshCore transport.",
    changes: [
      "Push-to-talk voice workflow integrated into companion UI.",
      "Voice frame packetization tuned for low-bandwidth mesh links.",
      "Adaptive jitter buffer and loss concealment for unstable routes.",
      "Priority routing profile for voice traffic vs standard messages.",
    ],
  },
  {
    version: "v1.15.0",
    date: "APR 2026",
    type: "R&D",
    status: "Upcoming",
    description: "Research branch focused on adaptive route intelligence.",
    changes: [
      "Dynamic route scoring for congestion-aware forwarding.",
      "Experimental spectrum adaptation for noisy channels.",
      "Prototype telemetry export for field performance analysis.",
    ],
  },
  {
    version: "v1.14.0",
    date: "22 MAR 2026",
    type: "Major",
    description: "Multi-byte path support and routing diagnostics.",
    changes: [
      "2/3-byte path hashes for network scaling.",
      "Line of Sight (LoS) tool integration.",
      "Multi-select contact management.",
      "Repeater region remote config.",
    ],
  },
  {
    version: "v1.13.0",
    date: "05 FEB 2026",
    type: "Feature",
    description: "Off-Grid client repeat mode enhancements.",
    changes: [
      "Companion Repeat mode for sparse areas.",
      "LZW message compression protocols.",
      "Real-time RF noise floor viewer.",
    ],
  },
];

const features = [
  {
    icon: <Network size={16} />,
    title: "Structured Routing",
    desc: "Efficient path-based routing up to 64 hops.",
  },
  {
    icon: <Zap size={16} />,
    title: "Low Power",
    desc: "End-nodes optimize for maximum battery life.",
  },
  {
    icon: <Shield size={16} />,
    title: "Encrypted",
    desc: "AES-256 tactical security by default.",
  },
  {
    icon: <Layers size={16} />,
    title: "Hybrid Mesh",
    desc: "Scalable Repeater/Companion hierarchy.",
  },
];

const documents = [
  {
    id: "intro-guide",
    title: "MeshCore Introduction Guide",
    label: "Foundation",
    date: "MAR 2026",
    description:
      "Project fundamentals, architecture overview, and onboarding reference for new operators.",
    href: "/docs/meshcore-introduction-guide.pdf",
  },
  {
    id: "edition2-field-dev-guide",
    title: "MeshCore Edition2 Field Developer Guide",
    label: "Field Ops",
    date: "MAR 2026",
    description:
      "Hands-on developer procedures for field setup, diagnostics, and deployment tuning.",
    href: "/docs/meshcore-edition2-field-developer-guide.pdf",
  },
  {
    id: "device-catalog",
    title: "MeshCore Device Catalog",
    label: "Hardware",
    date: "MAR 2026",
    description:
      "Device lineup reference covering supported MeshCore boards, node classes, and deployment form factors.",
    href: "/docs/meshcore-device-catalog.pdf",
  },
];

const rndDocuments = [
  {
    id: "voice-messages-guide",
    title: "MeshCore VoiceMessages Guide",
    label: "R&D Doc",
    date: "MAR 2026",
    description:
      "Experimental reference for voice message workflows and implementation details.",
    href: "/docs/meshcore-voicemessages-guide.pdf",
  },
];

const softwareGuidePdf = "/docs/meshcore-flasher-pro-user-guide.pdf";
const softwareInstallerVersion = "0.1.0";
const softwareInstallerExe =
  "https://github.com/Enochas89/MeshCore/releases/download/v0.1.0/MeshCoreFlasher-Desktop-Setup-0.1.0.exe";

const softwareMeta = ["Windows Desktop", "USB Flashing", "Serial Console", "v1.0"];

const softwareInstallSteps = [
  "Download the official .exe installer from this page.",
  "If SmartScreen appears, click More info and then Run anyway.",
  "Finish installer prompts and launch MeshCore Flasher Pro.",
  "Connect a MeshCore-compatible device by USB and wait for detection.",
];

const softwareWorkflowSteps = [
  "Connect one device first to avoid COM-port ambiguity.",
  "Select the active device card in the left panel.",
  "Choose firmware role: Companion BLE, Companion USB, Repeater, or Room Server.",
  "Review firmware version entry (version + exact file name + release tag).",
  "Press START FLASHING and monitor the Operation Log stages.",
  "Wait for ready/complete before disconnecting the device.",
];

const firmwareSelectionModes = [
  {
    title: "Recognized Board",
    detail:
      "Loads board-compatible firmware options for the selected role and defaults to the newest compatible entry.",
  },
  {
    title: "Unknown Board",
    detail:
      "Shows the full role catalog, flags catalog-wide selection, and requires manual compatibility verification before flashing.",
  },
];

const flashFieldReference = [
  {
    field: "Firmware Role",
    description:
      "Sets transport and capability profile (Companion BLE/USB, Repeater, Room Server).",
  },
  {
    field: "Firmware Version",
    description:
      "Auto-populated by catalog and displayed with version, file name, and release tag.",
  },
  {
    field: "Auto-apply post-flash settings",
    description:
      "Runs post-flash checks/configuration automatically before marking the device ready.",
  },
  {
    field: "START FLASHING",
    description:
      "Begins flash sequence. Operation Log is the authoritative status source.",
  },
  {
    field: "Automatic Match",
    description:
      "Live target summary (board, COM port, role) with explicit warning for unknown boards.",
  },
  {
    field: "Live Link Topology",
    description:
      "Visual host-to-node transport diagram shown at the bottom of the flash tab.",
  },
];

const settingsStatus = [
  {
    feature: "Regular / Advanced mode toggle",
    status: "ACTIVE",
    notes: "Switches between standard and advanced UI views.",
  },
  {
    feature: "TX power slider label",
    status: "ACTIVE",
    notes: "UI label is active; backend power control is still in progress.",
  },
  {
    feature: "Custom Firmware selector / Clear",
    status: "ACTIVE",
    notes: "Fully functional local firmware select and clear workflow.",
  },
  {
    feature: "API field persistence",
    status: "ACTIVE",
    notes: "Fields persist; desktop mode keeps them non-required.",
  },
  {
    feature: "Device name / region / channel / role",
    status: "ACTIVE",
    notes:
      "Applied through the settings workflow and used by the production flashing flow.",
  },
  {
    feature: "Quick Presets / Save & Apply / Backup / Restore",
    status: "ACTIVE",
    notes:
      "Preset selection and save/restore workflows are available for production operators.",
  },
  {
    feature: "Factory Reset / Recovery Mode / Diagnostics export",
    status: "ACTIVE",
    notes:
      "Advanced maintenance controls are exposed in-app for recovery and support use.",
  },
];

const runtimeLogFiles = [
  {
    file: "state.json",
    detail:
      "Persisted application state, including last-used settings and selections.",
  },
  {
    file: "verity.log",
    detail: "Structured flash/runtime error telemetry for failure analysis.",
  },
  {
    file: "startup.log",
    detail: "Startup and runtime initialization events.",
  },
];

const troubleshootingSteps = [
  "Device not detected: replug USB, wait 5 seconds, then click Rescan.",
  "Unknown board warning: verify firmware entry manually or use custom local firmware.",
  "Flash fails immediately: check Operation Log and validate chip-family file type (.bin/.zip/.uf2).",
  "Flash blocked: disconnect Serial Console first because port lock is active during serial sessions.",
  "No firmware options: verify catalog/network availability or flash using local custom firmware.",
];

const operatorBestPractices = [
  "Select the intended device card before role/version changes.",
  "Reconfirm firmware role before every flash.",
  "Use Operation Log as source of truth, not UI colors alone.",
  "Never flash first catalog entry on unknown boards without validation.",
  "Keep a known-good recovery firmware image stored locally.",
];

const Navbar = ({ activeTab, setActiveTab, guidedTab }) => (
  <nav className="fixed top-6 left-6 z-50">
    <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl p-1.5 flex items-center gap-2 shadow-sm">
      <div
        className="bg-blue-600 p-1.5 rounded-lg cursor-pointer"
        onClick={() => setActiveTab("home")}
      >
        <Cpu className="text-white w-4 h-4" />
      </div>

      <div className="flex items-center px-1">
        <button
          onClick={() => setActiveTab("home")}
          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
            activeTab === "home"
              ? "bg-slate-100 text-blue-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab("rnd")}
          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
            activeTab === "rnd"
              ? "bg-slate-100 text-blue-600"
              : guidedTab === "rnd"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-500 hover:text-slate-800"
          }`}
        >
          R&D
        </button>
        <button
          onClick={() => setActiveTab("software")}
          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
            activeTab === "software"
              ? "bg-slate-100 text-blue-600"
              : guidedTab === "software"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-500 hover:text-slate-800"
          } whitespace-nowrap`}
        >
          MeshCore Flasher Pro
        </button>
        <button
          onClick={() => setActiveTab("docs")}
          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
            activeTab === "docs"
              ? "bg-slate-100 text-blue-600"
              : guidedTab === "docs"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Docs
        </button>
      </div>
    </div>
  </nav>
);

const HomeView = ({
  featureList,
  onGetStarted,
  telemetryStartSignal,
  telemetryAutoTransmitSignal,
  onTransmissionScrollComplete,
}) => (
  <div className="w-full pt-32 pb-20 px-6 md:px-10 lg:px-14 animate-in fade-in duration-500">
    <section className="mb-24">
      <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
        MeshCore
      </h1>
      <p className="text-base text-slate-600 mb-8 max-w-2xl leading-relaxed">
        Structured routing for autonomous LoRa grids. High-reliability
        communication designed for dense environments and tactical field use.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onGetStarted}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold text-xs hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
        >
          Get Started <ChevronRight size={14} />
        </button>
      </div>
    </section>

    <section id="mesh-network-section" className="mb-16 scroll-mt-28">
      <MeshNetworkTelemetry
        startSignal={telemetryStartSignal}
        autoTransmitSignal={telemetryAutoTransmitSignal}
        onTransmissionScrollComplete={onTransmissionScrollComplete}
      />
    </section>

    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {featureList.map((f, i) => (
        <div
          key={i}
          className="p-6 rounded-2xl bg-white border border-slate-100 group hover:border-blue-200 transition-all shadow-sm"
        >
          <div className="text-blue-600 mb-4">{f.icon}</div>
          <h3 className="text-sm font-bold text-slate-900 mb-1 uppercase tracking-wider">
            {f.title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </section>
  </div>
);

const SoftwareView = () => (
  <div className="w-full pt-32 pb-20 px-6 md:px-10 lg:px-14 animate-in fade-in duration-500">
    <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">MeshCore Flasher Pro</h2>
          <p className="text-slate-500 text-sm mt-2 max-w-3xl leading-relaxed">
            This page is built from the official MeshCore Flasher Pro PDF guide and
            summarizes install, workflow, firmware selection, settings behavior,
            troubleshooting, and operator best practices.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={softwareInstallerExe}
            download
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-[11px] hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Download size={12} /> Download Installer (.exe)
          </a>
          <a
            href={softwareGuidePdf}
            download
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-[11px] hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Download size={12} /> Download Guide
          </a>
          <a
            href={softwareGuidePdf}
            target="_blank"
            rel="noreferrer"
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-[11px] hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <ExternalLink size={12} /> Open PDF
          </a>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {softwareMeta.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-1 rounded"
          >
            {tag}
          </span>
        ))}
        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded">
          Installer v{softwareInstallerVersion}
        </span>
      </div>
    </section>

    <section className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Install & Launch</h3>
        <ol className="space-y-2">
          {softwareInstallSteps.map((step, index) => (
            <li key={step} className="text-sm text-slate-600 leading-relaxed flex gap-3">
              <span className="text-blue-600 font-black text-xs mt-0.5">{index + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Normal Flash Workflow</h3>
        <ol className="space-y-2">
          {softwareWorkflowSteps.map((step, index) => (
            <li key={step} className="text-sm text-slate-600 leading-relaxed flex gap-3">
              <span className="text-blue-600 font-black text-xs mt-0.5">{index + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </article>
    </section>

    <section className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
      {firmwareSelectionModes.map((mode) => (
        <article
          key={mode.title}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-base font-bold text-slate-900 mb-2">{mode.title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{mode.detail}</p>
        </article>
      ))}
    </section>

    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Flash Tab Field Reference</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {flashFieldReference.map((item) => (
          <article
            key={item.field}
            className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"
          >
            <h4 className="text-sm font-bold text-slate-900 mb-1">{item.field}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Settings Status</h3>
        <div className="space-y-3">
          {settingsStatus.map((row) => (
            <div key={row.feature} className="rounded-xl border border-slate-100 p-4">
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <h4 className="text-sm font-bold text-slate-900">{row.feature}</h4>
                <span
                  className={`text-[9px] font-black px-2 py-1 rounded tracking-wider ${
                    row.status === "ACTIVE"
                      ? "text-emerald-700 bg-emerald-100"
                      : "text-amber-700 bg-amber-100"
                  }`}
                >
                  {row.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{row.notes}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Logs & Data Files</h3>
        <div className="space-y-3">
          {runtimeLogFiles.map((item) => (
            <div key={item.file} className="rounded-xl border border-slate-100 p-4">
              <h4 className="text-sm font-bold text-slate-900 mb-1">{item.file}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </article>
    </section>

    <section className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Troubleshooting</h3>
        <ul className="space-y-2">
          {troubleshootingSteps.map((item) => (
            <li key={item} className="text-sm text-slate-600 leading-relaxed flex gap-2">
              <span className="text-blue-600/60 mt-1">*</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Operator Best Practices</h3>
        <ul className="space-y-2">
          {operatorBestPractices.map((item) => (
            <li key={item} className="text-sm text-slate-600 leading-relaxed flex gap-2">
              <span className="text-blue-600/60 mt-1">*</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  </div>
);

const UpdatesView = ({ updateList, title, subtitle, researchDocs = [] }) => (
  <div className="w-full pt-32 pb-20 px-6 md:px-10 lg:px-14 animate-in slide-in-from-left-4 duration-500">
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
        {subtitle}
      </p>
    </div>

    {researchDocs.length > 0 ? (
      <section className="mb-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {researchDocs.map((doc) => (
          <article
            key={doc.id}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="relative h-72 mb-6">
              <div className="absolute inset-x-8 top-3 bottom-2 bg-slate-200/80 rounded-lg rotate-[3deg]" />
              <div className="absolute inset-x-7 top-2 bottom-3 bg-slate-300/60 rounded-lg -rotate-[2deg]" />
              <div className="absolute inset-x-6 top-0 bottom-6 bg-white rounded-xl border border-slate-300 shadow-lg overflow-hidden">
                <div className="h-8 bg-gradient-to-r from-slate-100 to-white border-b border-slate-200 px-3 flex items-center gap-2">
                  <FileText size={12} className="text-blue-600" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                    R&D PDF PREVIEW
                  </span>
                </div>
                <div className="h-[calc(100%-2rem)] bg-slate-50">
                  <iframe
                    title={`${doc.title} preview`}
                    src={`${doc.href}#page=1&zoom=page-fit`}
                    className="h-full w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-[9px] font-black text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded tracking-tighter">
                {doc.label}
              </span>
              <span className="text-[9px] font-black text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded tracking-tighter">
                {doc.date}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2">
              {doc.title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-5">
              {doc.description}
            </p>

            <div className="flex gap-2">
              <a
                href={doc.href}
                download
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-[11px] hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <Download size={12} /> Download PDF
              </a>
              <a
                href={doc.href}
                target="_blank"
                rel="noreferrer"
                className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-[11px] hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <ExternalLink size={12} /> Open
              </a>
            </div>
          </article>
        ))}
      </section>
    ) : null}

    <div className="space-y-12">
      {updateList.map((update, idx) => (
        <div
          key={idx}
          className="flex flex-col gap-4 border-l border-slate-200 pl-6 relative"
        >
          <div className="absolute -left-[5px] top-0 w-[9px] h-[9px] rounded-full bg-white border border-slate-300" />

          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-slate-900 font-mono">
              {update.version}
            </span>
            <span className="text-[9px] font-black text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded tracking-tighter">
              {update.date}
            </span>
            <span className="text-[9px] font-black text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded tracking-tighter">
              {update.type}
            </span>
            {update.status ? (
              <span className="text-[9px] font-black text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded tracking-tighter">
                {update.status}
              </span>
            ) : null}
          </div>

          <p className="text-slate-600 text-xs leading-relaxed max-w-3xl">
            {update.description}
          </p>

          <ul className="grid gap-2">
            {update.changes.map((change, i) => (
              <li
                key={i}
                className="text-slate-500 text-[10px] flex gap-2 items-start"
              >
                <span className="text-blue-600/50 mt-0.5">*</span>
                {change}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

const DocumentationView = ({ docs }) => (
  <div className="w-full pt-32 pb-20 px-6 md:px-10 lg:px-14 animate-in fade-in duration-500">
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Documentation</h2>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
        Downloadable PDF Guides
      </p>
    </div>

    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {docs.map((doc) => (
        <article
          key={doc.id}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
        >
          <div className="relative h-72 mb-6">
            <div className="absolute inset-x-8 top-3 bottom-2 bg-slate-200/80 rounded-lg rotate-[3deg]" />
            <div className="absolute inset-x-7 top-2 bottom-3 bg-slate-300/60 rounded-lg -rotate-[2deg]" />
            <div className="absolute inset-x-6 top-0 bottom-6 bg-white rounded-xl border border-slate-300 shadow-lg overflow-hidden">
              <div className="h-8 bg-gradient-to-r from-slate-100 to-white border-b border-slate-200 px-3 flex items-center gap-2">
                <FileText size={12} className="text-blue-600" />
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                  PDF PAGE PREVIEW
                </span>
              </div>
              <div className="h-[calc(100%-2rem)] bg-slate-50">
                <iframe
                  title={`${doc.title} preview`}
                  src={`${doc.href}#page=1&zoom=page-fit`}
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-[9px] font-black text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded tracking-tighter">
              {doc.label}
            </span>
            <span className="text-[9px] font-black text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded tracking-tighter">
              {doc.date}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 mb-2">{doc.title}</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-5">
            {doc.description}
          </p>

          <div className="flex gap-2">
            <a
              href={doc.href}
              download
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-[11px] hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <Download size={12} /> Download PDF
            </a>
            <a
              href={doc.href}
              target="_blank"
              rel="noreferrer"
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-[11px] hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <ExternalLink size={12} /> Open
            </a>
          </div>
        </article>
      ))}
    </section>
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [telemetryStartSignal, setTelemetryStartSignal] = useState(0);
  const [telemetryAutoTransmitSignal, setTelemetryAutoTransmitSignal] =
    useState(0);
  const [guidedTab, setGuidedTab] = useState(null);
  const guidedTimersRef = useRef([]);
  const rndUpdates = updates.filter((update) => update.type === "R&D");

  const clearGuidedTimers = useCallback(() => {
    guidedTimersRef.current.forEach((timer) => clearTimeout(timer));
    guidedTimersRef.current = [];
  }, []);

  const runGuidedNavSequence = useCallback(() => {
    clearGuidedTimers();
    setGuidedTab(null);
    guidedTimersRef.current.push(
      setTimeout(() => setGuidedTab("rnd"), 180),
      setTimeout(() => setGuidedTab("software"), 780),
      setTimeout(() => setGuidedTab("docs"), 1380),
      setTimeout(() => setGuidedTab(null), 2380),
    );
  }, [clearGuidedTimers]);

  useEffect(() => {
    return () => {
      clearGuidedTimers();
    };
  }, [clearGuidedTimers]);

  const handleGetStarted = () => {
    setActiveTab("home");
    setTelemetryStartSignal((value) => value + 1);
    setTelemetryAutoTransmitSignal((value) => value + 1);
    clearGuidedTimers();
    setGuidedTab(null);
    document
      .getElementById("mesh-network-section")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 font-sans antialiased">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        guidedTab={guidedTab}
      />

      <main className="relative">
        <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30 -z-10" />
        {activeTab === "home" ? (
          <HomeView
            featureList={features}
            onGetStarted={handleGetStarted}
            telemetryStartSignal={telemetryStartSignal}
            telemetryAutoTransmitSignal={telemetryAutoTransmitSignal}
            onTransmissionScrollComplete={runGuidedNavSequence}
          />
        ) : activeTab === "software" ? (
          <SoftwareView />
        ) : activeTab === "docs" ? (
          <DocumentationView docs={documents} />
        ) : activeTab === "rnd" ? (
          <UpdatesView
            updateList={rndUpdates}
            title="R&D Pipeline"
            subtitle="Upcoming Research And Development"
            researchDocs={rndDocuments}
          />
        ) : (
          <HomeView
            featureList={features}
            onGetStarted={handleGetStarted}
            telemetryStartSignal={telemetryStartSignal}
            telemetryAutoTransmitSignal={telemetryAutoTransmitSignal}
            onTransmissionScrollComplete={runGuidedNavSequence}
          />
        )}
      </main>

      <footer className="py-12 px-6 md:px-10 lg:px-14 border-t border-slate-100 mt-20 bg-white/50">
        <div className="w-full flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
          <div className="flex items-center gap-2">
            <Cpu size={12} className="text-blue-600/40" /> MeshCore Project
          </div>
          <div className="flex gap-6">
            <a
              href="https://discord.com/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              Discord
            </a>
            <button
              onClick={() => setActiveTab("docs")}
              className="hover:text-blue-600 transition-colors"
            >
              Docs
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
