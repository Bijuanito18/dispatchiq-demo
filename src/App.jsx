import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Wrench, Users, Package, CheckCircle2, Filter, BarChart3, Clock, Search, Upload, Download, Trash2 } from "lucide-react";

const uid = () => Math.random().toString(36).slice(2, 9);
const STORAGE_KEY = "dispatchiq-demo-v1";

function useLocalState(defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);
  return [state, setState];
}

const seed = {
  technicians: [
    { id: uid(), name: "Ana C.", skill: "HVAC/R", status: "available" },
    { id: uid(), name: "Miguel R.", skill: "Reefer", status: "busy" },
    { id: uid(), name: "James P.", skill: "Electrical", status: "available" },
  ],
  parts: [
    { id: uid(), sku: "FILTER-XL", name: "Cabin Air Filter XL", onHand: 6, min: 5, cost: 18.5 },
    { id: uid(), sku: "BELT-AC-7PK", name: "7PK A/C Belt", onHand: 2, min: 4, cost: 22.0 },
    { id: uid(), sku: "REFR-134A-30LB", name: "R-134a Cylinder 30lb", onHand: 1, min: 2, cost: 189.0 },
  ],
  workorders: [
    {
      id: uid(),
      title: "PM Service – Trailer 1827",
      customer: "DFW Grocers",
      location: "76006 Arlington, TX",
      status: "scheduled",
      technicianId: null,
      eta: "2025-10-15 09:00",
      partsUsed: [],
      photos: [],
      notes: "Oil + filter + visual inspection",
      createdAt: Date.now() - 1000 * 60 * 60 * 20,
      updatedAt: Date.now() - 1000 * 60 * 60 * 16,
      durationMin: 0,
    },
    {
      id: uid(),
      title: "No-cool Call – Truck 55",
      customer: "Lone Star Produce",
      location: "Fort Worth, TX",
      status: "in_progress",
      technicianId: null,
      eta: "2025-10-14 14:30",
      partsUsed: [],
      photos: [],
      notes: "Unit cycles off under load",
      createdAt: Date.now() - 1000 * 60 * 60 * 8,
      updatedAt: Date.now() - 1000 * 60 * 60 * 2,
      durationMin: 45,
    },
  ],
  settings: { org: "North Texas Fleet & Refrigeration", currency: "USD" },
};

const Badge = ({ children, kind = "gray" }) => (
  <span className={`px-2 py-0.5 text-xs rounded-full border bg-white/50 ${
    kind === "green" ? "border-green-300" : kind === "yellow" ? "border-yellow-300" : kind === "blue" ? "border-blue-300" : kind === "red" ? "border-red-300" : "border-zinc-300"
  }`}>{children}</span>
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl shadow-sm border border-zinc-200 bg-white p-4 ${className}`}>{children}</div>
);

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <Icon className="w-5 h-5" />
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
    {subtitle && <div className="text-sm text-zinc-500">{subtitle}</div>}
  </div>
);

const Pill = ({ children }) => (
  <span className="px-2 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs">{children}</span>
);

function StatusChip({ status }) {
  const map = {
    scheduled: { text: "Scheduled", class: "bg-blue-50 text-blue-700 border-blue-200" },
    in_progress: { text: "In Progress", class: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    completed: { text: "Completed", class: "bg-green-50 text-green-700 border-green-200" },
    invoiced: { text: "Invoiced", class: "bg-zinc-50 text-zinc-600 border-zinc-200" },
  };
  const s = map[status] || map.scheduled;
  return <span className={`px-2 py-0.5 text-xs rounded-full border ${s.class}`}>{s.text}</span>;
}

export default function App() {
  const [db, setDb] = useLocalState(seed);
  const [query, setQuery] = useState("");
  const [showNewWO, setShowNewWO] = useState(false);
  const [newWO, setNewWO] = useState({ title: "", customer: "", location: "", eta: "" });
  const [activeTab, setActiveTab] = useState("workorders");
  const [ocrText, setOcrText] = useState("");

  const lowStock = useMemo(() => db.parts.filter(p => p.onHand <= p.min), [db.parts]);
  const filteredWOs = useMemo(() => {
    const q = query.toLowerCase();
    return db.workorders.filter(w => [w.title, w.customer, w.location, w.status].some(v => (v || "").toLowerCase().includes(q)));
  }, [db.workorders, query]);

  const metrics = useMemo(() => {
    const total = db.workorders.length;
    const inProg = db.workorders.filter(w => w.status === "in_progress").length;
    const completed = db.workorders.filter(w => w.status === "completed" || w.status === "invoiced").length;
    const withDur = db.workorders.filter(w => w.durationMin > 0);
    const avgDur = (withDur.reduce((a, b) => a + b.durationMin, 0) / Math.max(1, withDur.length)).toFixed(1);
    return { total, inProg, completed, avgDur };
  }, [db.workorders]);

  function addWO() {
    if (!newWO.title || !newWO.customer) return;
    const wo = {
      id: uid(),
      title: newWO.title,
      customer: newWO.customer,
      location: newWO.location || "",
      status: "scheduled",
      technicianId: null,
      eta: newWO.eta || "",
      partsUsed: [],
      photos: [],
      notes: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      durationMin: 0,
    };
    setDb({ ...db, workorders: [wo, ...db.workorders] });
    setShowNewWO(false);
    setNewWO({ title: "", customer: "", location: "", eta: "" });
    setActiveTab("workorders");
  }

  function assignTech(woId, techId) {
    setDb({
      ...db,
      workorders: db.workorders.map(w => w.id === woId ? { ...w, technicianId: techId, updatedAt: Date.now() } : w),
    });
  }

  function advanceStatus(woId) {
    setDb({
      ...db,
      workorders: db.workorders.map(w => {
        if (w.id !== woId) return w;
        const order = ["scheduled", "in_progress", "completed", "invoiced"];
        const idx = order.indexOf(w.status);
        const next = order[Math.min(order.length - 1, idx + 1)];
        const updates = { status: next, updatedAt: Date.now() };
        if (next === "completed" && w.durationMin === 0) updates.durationMin = Math.floor(30 + Math.random() * 90);
        return { ...w, ...updates };
      }),
    });
  }

  function addPartToWO(woId, partId) {
    const part = db.parts.find(p => p.id === partId);
    if (!part) return;
    setDb({
      ...db,
      parts: db.parts.map(p => p.id === partId ? { ...p, onHand: Math.max(0, p.onHand - 1) } : p),
      workorders: db.workorders.map(w => w.id === woId ? { ...w, partsUsed: [...w.partsUsed, { partId, qty: 1, cost: part.cost }], updatedAt: Date.now() } : w),
    });
  }

  function ocrImport(woId) {
    const lines = ocrText.split(/\n|\r/).map(s => s.trim()).filter(Boolean);
    const found = [];
    lines.forEach(line => {
      db.parts.forEach(p => {
        if (line.toLowerCase().includes(p.sku.toLowerCase()) || line.toLowerCase().includes(p.name.toLowerCase())) {
          found.push(p.id);
        }
      });
    });
    const unique = Array.from(new Set(found));
    let newDb = { ...db };
    unique.forEach(pid => {
      const part = newDb.parts.find(p => p.id === pid);
      if (part) {
        newDb = {
          ...newDb,
          parts: newDb.parts.map(p => p.id === pid ? { ...p, onHand: Math.max(0, p.onHand - 1) } : p),
          workorders: newDb.workorders.map(w => w.id === woId ? { ...w, partsUsed: [...w.partsUsed, { partId: pid, qty: 1, cost: part.cost }], updatedAt: Date.now() } : w),
        };
      }
    });
    setDb(newDb);
    setOcrText("");
  }

  function resetDemo() {
    if (confirm("Reset demo data?")) setDb(seed);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dispatchiq-demo.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJson(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { setDb(JSON.parse(reader.result)); } catch (e) { alert("Invalid JSON"); }
    };
    reader.readAsText(file);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">DispatchIQ Demo – NTFR</h1>
          <p className="text-sm text-zinc-500">Create & assign work orders, track status, manage parts, and simulate OCR.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-xl border" onClick={() => setShowNewWO(true)}><Plus className="w-4 h-4 inline-block mr-1"/>New Work Order</button>
          <label className="px-3 py-2 rounded-xl border cursor-pointer">
            <input type="file" className="hidden" accept="application/json" onChange={importJson} />
            <Upload className="w-4 h-4 inline-block mr-1"/>Import
          </label>
          <button className="px-3 py-2 rounded-xl border" onClick={exportJson}><Download className="w-4 h-4 inline-block mr-1"/>Export</button>
          <button className="px-3 py-2 rounded-xl border" onClick={resetDemo}><Trash2 className="w-4 h-4 inline-block mr-1"/>Reset</button>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        {[
          { id: "workorders", label: "Work Orders", icon: Wrench },
          { id: "technicians", label: "Technicians", icon: Users },
          { id: "parts", label: "Parts", icon: Package },
          { id: "dashboard", label: "Dashboard", icon: BarChart3 },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${activeTab === t.id ? "bg-zinc-900 text-white" : "bg-white"}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
        <div className="ml-auto relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400"/>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." className="pl-9 pr-3 py-2 rounded-xl border w-64"/>
        </div>
      </div>

      {db.parts.filter(p => p.onHand <= p.min).length > 0 && (
        <Card className="mb-4">
          <div className="flex items-center gap-2 text-amber-700"><Filter className="w-4 h-4"/> Low Stock Alerts</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {db.parts.filter(p => p.onHand <= p.min).map(p => (
              <Pill key={p.id}>{p.sku} · On hand {p.onHand} (min {p.min})</Pill>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><SectionTitle icon={Wrench} title="Total Work Orders" /><div className="text-3xl font-semibold">{metrics.total}</div></Card>
          <Card><SectionTitle icon={Clock} title="In Progress" /><div className="text-3xl font-semibold">{metrics.inProg}</div></Card>
          <Card><SectionTitle icon={CheckCircle2} title="Completed/Invoiced" /><div className="text-3xl font-semibold">{metrics.completed}</div></Card>
          <Card><SectionTitle icon={BarChart3} title="Avg. Duration (min)" /><div className="text-3xl font-semibold">{metrics.avgDur}</div></Card>
        </div>
      )}

      {activeTab === "workorders" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredWOs.map(wo => (
            <Card key={wo.id}>
              <div className="flex items-center justify-between">
                <div className="font-semibold">{wo.title}</div>
                <StatusChip status={wo.status} />
              </div>
              <div className="text-sm text-zinc-500">{wo.customer} • {wo.location || "—"}</div>
              <div className="mt-3 flex flex-wrap gap-2 items-center">
                <Badge kind="blue">ETA {wo.eta || "n/a"}</Badge>
                <Badge>{new Date(wo.createdAt).toLocaleString()}</Badge>
              </div>
              <div className="mt-3 text-sm">
                <div className="text-zinc-500">Assigned tech:</div>
                <div className="flex items-center gap-2 mt-1">
                  <select value={wo.technicianId || ""} onChange={e => assignTech(wo.id, e.target.value || null)} className="border rounded-lg px-2 py-1">
                    <option value="">Unassigned</option>
                    {db.technicians.map(t => (<option key={t.id} value={t.id}>{t.name} ({t.skill})</option>))}
                  </select>
                  <button className="px-2 py-1 rounded-lg border" onClick={() => advanceStatus(wo.id)}>Advance Status</button>
                </div>
              </div>

              <div className="mt-3 text-sm">
                <div className="text-zinc-500 mb-1">Parts used:</div>
                <div className="flex items-center gap-2">
                  <select id={`part-${wo.id}`} className="border rounded-lg px-2 py-1">
                    {db.parts.map(p => (<option key={p.id} value={p.id}>{p.sku} · {p.name}</option>))}
                  </select>
                  <button className="px-2 py-1 rounded-lg border" onClick={() => {
                    const sel = document.getElementById(`part-${wo.id}`);
                    if (sel) addPartToWO(wo.id, sel.value);
                  }}>Add Part</button>
                </div>
                <ul className="mt-2 list-disc ml-5">
                  {wo.partsUsed.length === 0 && <li className="text-zinc-400">None</li>}
                  {wo.partsUsed.map((pu, i) => {
                    const p = db.parts.find(pp => pp.id === pu.partId);
                    return <li key={i}>{p?.sku} – {p?.name} <span className="text-zinc-500">(qty {pu.qty}, ${pu.cost})</span></li>
                  })}
                </ul>
              </div>

              <div className="mt-3 text-sm">
                <div className="text-zinc-500 mb-1">Simulate OCR paste (finds SKUs or names in text):</div>
                <textarea value={ocrText} onChange={e => setOcrText(e.target.value)} placeholder="Paste receipt text here... e.g. FILTER-XL, R-134a" className="w-full border rounded-lg p-2 h-20" />
                <div className="mt-2 flex gap-2">
                  <button className="px-3 py-1 rounded-lg border" onClick={() => ocrImport(wo.id)}>Parse & Import</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "technicians" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {db.technicians.map(t => (
            <Card key={t.id}>
              <div className="flex items-center justify-between">
                <div className="font-semibold">{t.name}</div>
                <Badge kind={t.status === 'available' ? 'green' : 'yellow'}>{t.status}</Badge>
              </div>
              <div className="text-sm text-zinc-500">{t.skill}</div>
              <div className="mt-2 text-sm">Assigned WOs: {db.workorders.filter(w => w.technicianId === t.id && (w.status === 'scheduled' || w.status === 'in_progress')).length}</div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "parts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {db.parts.map(p => (
            <Card key={p.id}>
              <div className="flex items-center justify-between">
                <div className="font-semibold">{p.name}</div>
                <Pill>{p.sku}</Pill>
              </div>
              <div className="text-sm mt-1">On hand: <b>{p.onHand}</b> (min {p.min})</div>
              <div className="text-sm text-zinc-500">Unit cost: ${p.cost.toFixed(2)}</div>
              <div className="mt-3 flex gap-2">
                <button className="px-2 py-1 rounded-lg border" onClick={() => setDb({ ...db, parts: db.parts.map(x => x.id === p.id ? { ...x, onHand: x.onHand + 1 } : x) })}>+1</button>
                <button className="px-2 py-1 rounded-lg border" onClick={() => setDb({ ...db, parts: db.parts.map(x => x.id === p.id ? { ...x, onHand: Math.max(0, x.onHand - 1) } : x) })}>-1</button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showNewWO && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <Card className="w-full max-w-xl bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Create Work Order</h3>
              <button className="text-zinc-500" onClick={() => setShowNewWO(false)}>✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="text-sm">Title
                <input value={newWO.title} onChange={e => setNewWO({ ...newWO, title: e.target.value })} className="w-full border rounded-lg p-2 mt-1" />
              </label>
              <label className="text-sm">Customer
                <input value={newWO.customer} onChange={e => setNewWO({ ...newWO, customer: e.target.value })} className="w-full border rounded-lg p-2 mt-1" />
              </label>
              <label className="text-sm">Location
                <input value={newWO.location} onChange={e => setNewWO({ ...newWO, location: e.target.value })} className="w-full border rounded-lg p-2 mt-1" />
              </label>
              <label className="text-sm">ETA (local)
                <input value={newWO.eta} onChange={e => setNewWO({ ...newWO, eta: e.target.value })} placeholder="YYYY-MM-DD HH:mm" className="w-full border rounded-lg p-2 mt-1" />
              </label>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button className="px-3 py-2 rounded-xl border" onClick={() => setShowNewWO(false)}>Cancel</button>
              <button className="px-3 py-2 rounded-xl border bg-zinc-900 text-white" onClick={addWO}><Plus className="w-4 h-4 inline-block mr-1"/>Create</button>
            </div>
          </Card>
        </div>
      )}

      <div className="mt-8 text-center text-xs text-zinc-500">Demo only — a real build would use Azure Functions + SQL + Entra ID + Form Recognizer.</div>
    </div>
  );
}
