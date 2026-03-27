import { useState } from "react";
import {
  Shield,
  Cpu,
  Zap,
  Download,
  Network,
  ChevronRight,
  Layers,
  Activity,
  GitBranch,
  Image as ImageIcon,
} from "lucide-react";

const updates = [
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

const Navbar = ({ activeTab, setActiveTab }) => (
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
          onClick={() => setActiveTab("updates")}
          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
            activeTab === "updates"
              ? "bg-slate-100 text-blue-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Updates
        </button>
        <div className="w-px h-3 bg-slate-200 mx-1" />
        <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-all flex items-center gap-1">
          <Download size={10} /> Flash
        </button>
      </div>
    </div>
  </nav>
);

const HomeView = ({ featureList }) => (
  <div className="pt-32 pb-20 px-6 max-w-4xl animate-in fade-in duration-500">
    <section className="mb-24">
      <div className="w-full h-48 md:h-64 bg-slate-100 rounded-3xl mb-12 border border-slate-200 overflow-hidden relative group">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-3">
          <div className="p-4 rounded-full bg-white shadow-sm border border-slate-100 text-slate-300 group-hover:scale-110 transition-transform duration-500">
            <ImageIcon size={32} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            Hardware Visualization
          </span>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-slate-300" />
          <div className="w-2 h-2 rounded-full bg-slate-300" />
        </div>
      </div>

      <div className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
        <Activity size={12} /> Protocol v1.14
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
        MeshCore
      </h1>
      <p className="text-base text-slate-600 mb-8 max-w-lg leading-relaxed">
        Structured routing for autonomous LoRa grids. High-reliability
        communication designed for dense environments and tactical field use.
      </p>
      <div className="flex gap-3">
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold text-xs hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200">
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

    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

const UpdatesView = ({ updateList }) => (
  <div className="pt-32 pb-20 px-6 max-w-3xl animate-in slide-in-from-left-4 duration-500">
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Releases</h2>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
        MeshCore Technical Logs
      </p>
    </div>

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

          <p className="text-slate-600 text-xs leading-relaxed max-w-xl">
            {update.description}
          </p>

          <ul className="grid gap-2">
            {update.changes.map((change, i) => (
              <li
                key={i}
                className="text-slate-500 text-[10px] flex gap-2 items-start"
              >
                <span className="text-blue-600/50 mt-0.5">•</span>
                {change}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 font-sans antialiased">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="relative">
        <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30 -z-10" />
        {activeTab === "home" ? (
          <HomeView featureList={features} />
        ) : (
          <UpdatesView updateList={updates} />
        )}
      </main>

      <footer className="py-12 px-6 border-t border-slate-100 mt-20 bg-white/50">
        <div className="max-w-4xl flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
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
            <a href="#" className="hover:text-blue-600 transition-colors">
              Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
