import { useCallback, useEffect, useRef, useState } from "react";
import {
  Shield,
  Cpu,
  Zap,
  Download,
  Network,
  ChevronRight,
  Layers,
  GitBranch,
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
          onClick={() => setActiveTab("video")}
          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
            activeTab === "video"
              ? "bg-slate-100 text-blue-600"
              : guidedTab === "video"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Video
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
        <a
          href="https://github.com/Enochas89/MeshCore"
          target="_blank"
          rel="noreferrer"
          className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-lg font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <GitBranch size={14} /> GitHub
        </a>
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

const VideoView = () => (
  <div className="w-full pt-32 pb-20 px-6 md:px-10 lg:px-14 animate-in fade-in duration-500">
    <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          MeshCore Video Walkthrough
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Quick overview and demo video for setup and operation.
        </p>
      </div>
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 aspect-video mb-4">
        <iframe
          title="MeshCore Video Walkthrough"
          src="https://www.youtube.com/embed/PeThXmxLE4k?rel=0"
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <a
        href="https://www.youtube.com/watch?v=PeThXmxLE4k"
        target="_blank"
        rel="noreferrer"
        className="inline-flex bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-xs hover:bg-slate-50 transition-all"
      >
        Open On YouTube
      </a>
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
      setTimeout(() => setGuidedTab("video"), 780),
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
        ) : activeTab === "video" ? (
          <VideoView />
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
            <a
              href="https://github.com/Enochas89/MeshCore"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              GitHub
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
