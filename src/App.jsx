import { useState } from 'react';
import './app.css';

const INITIAL_WORK_ORDERS = [
  {
    id: 'RO-2417',
    customer: 'DFW Grocery Distribution',
    unitId: 'Trailer 408',
    status: 'In Progress',
    stage: 'Diagnostics',
    eta: 'Today, 3:15 PM',
    lastUpdate: 'Tech on site, checking compressor',
    assignedTech: 'Javier M',
    priority: 'High',
  },
  {
    id: 'RO-2423',
    customer: 'North Texas Produce',
    unitId: 'Truck 17',
    status: 'Completed',
    stage: 'Closed',
    eta: 'Completed 10:05 AM',
    lastUpdate: 'PM complete, signed by customer',
    assignedTech: 'Ashley R',
    priority: 'Normal',
  },
  {
    id: 'RO-2430',
    customer: 'Metro Delivery Co',
    unitId: 'Dock Unit #3',
    status: 'Open',
    stage: 'Waiting to Dispatch',
    eta: 'Tomorrow, 9:00 AM',
    lastUpdate: 'Assigned to Javier, parts verified in stock',
    assignedTech: 'Unassigned',
    priority: 'Normal',
  },
];

const INITIAL_TECHS = [
  {
    id: 'TECH-01',
    name: 'Javier Martinez',
    status: 'On Job',
    currentOrder: 'RO-2417',
    location: 'DFW – Grocery DC',
  },
  {
    id: 'TECH-02',
    name: 'Ashley Ramirez',
    status: 'Available',
    currentOrder: null,
    location: 'Shop',
  },
  {
    id: 'TECH-03',
    name: 'Mike Johnson',
    status: 'On Job',
    currentOrder: 'RO-2430',
    location: 'Metro Delivery Co',
  },
];

const INITIAL_PARTS = [
  {
    id: 'P-1001',
    name: 'Compressor – Standard Reefer',
    inStock: 3,
    minStock: 2,
  },
  {
    id: 'P-1002',
    name: 'Evaporator Fan Motor',
    inStock: 1,
    minStock: 4,
  },
  {
    id: 'P-1003',
    name: 'Door Seal Kit – Trailer',
    inStock: 8,
    minStock: 5,
  },
  {
    id: 'P-1004',
    name: 'Thermostat Sensor',
    inStock: 0,
    minStock: 3,
  },
];

function findJobByQuery(jobs, query) {
  if (!query) return null;
  const normalized = query.trim().toLowerCase();
  return (
    jobs.find(
      (job) =>
        job.id.toLowerCase() === normalized ||
        job.unitId.toLowerCase() === normalized
    ) || null
  );
}

function App() {
  const [view, setView] = useState('customer'); // 'customer' | 'ops' | 'tech'

  const [workOrders, setWorkOrders] = useState(INITIAL_WORK_ORDERS);
  const [techs] = useState(INITIAL_TECHS);
  const [parts, setParts] = useState(INITIAL_PARTS);

  const [statusQuery, setStatusQuery] = useState('');
  const [statusResult, setStatusResult] = useState(null);
  const [statusSearched, setStatusSearched] = useState(false);

  const [techTab, setTechTab] = useState('dashboard'); // 'dashboard' | 'workorders' | 'technicians' | 'parts'

  const [newOrder, setNewOrder] = useState({
    customer: '',
    unitId: '',
    eta: '',
    assignedTech: '',
    priority: 'Normal',
  });

  const openCount = workOrders.filter((w) => w.status === 'Open').length;
  const inProgressCount = workOrders.filter(
    (w) => w.status === 'In Progress'
  ).length;
  const completedCount = workOrders.filter(
    (w) => w.status === 'Completed'
  ).length;
  const lowStockCount = parts.filter((p) => p.inStock < p.minStock).length;

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    const job = findJobByQuery(workOrders, statusQuery);
    setStatusResult(job);
    setStatusSearched(true);
  };

  const handleNewOrderChange = (field, value) => {
    setNewOrder((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewOrderSubmit = (e) => {
    e.preventDefault();
    if (!newOrder.customer || !newOrder.unitId) return;

    const nextNumber = workOrders.length + 2417;
    const id = `RO-${nextNumber}`;

    const order = {
      id,
      customer: newOrder.customer,
      unitId: newOrder.unitId,
      status: 'Open',
      stage: 'Scheduled',
      eta: newOrder.eta || 'TBD',
      lastUpdate: 'Scheduled via portal',
      assignedTech: newOrder.assignedTech || 'Unassigned',
      priority: newOrder.priority || 'Normal',
    };

    setWorkOrders((prev) => [order, ...prev]);

    setNewOrder({
      customer: '',
      unitId: '',
      eta: '',
      assignedTech: '',
      priority: 'Normal',
    });
  };

  const handleOrderStatusChange = (id, status) => {
    setWorkOrders((prev) =>
      prev.map((wo) => (wo.id === id ? { ...wo, status } : wo))
    );
  };

  const handleOrderStageChange = (id, stage) => {
    setWorkOrders((prev) =>
      prev.map((wo) => (wo.id === id ? { ...wo, stage } : wo))
    );
  };

  const handleOrderAssignTech = (id, techName) => {
    setWorkOrders((prev) =>
      prev.map((wo) =>
        wo.id === id ? { ...wo, assignedTech: techName || 'Unassigned' } : wo
      )
    );
  };

  const handlePartsOrder = (id) => {
    setParts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, inStock: p.inStock + 1 } : p
      )
    );
  };

  const handlePartsUse = (id) => {
    setParts((prev) =>
      prev.map((p) =>
        p.id === id && p.inStock > 0
          ? { ...p, inStock: p.inStock - 1 }
          : p
      )
    );
  };

  return (
    <div className="app">
      {/* TOP NAV */}
      <header className="topbar">
        <div className="logo">
          <span className="logo-mark">NTFR</span>
          <div className="logo-text">
            <span>North Texas Fleet & Refrigeration</span>
            <small>Since 2010 · DFW Metroplex</small>
          </div>
        </div>

        <nav className="nav">
          <button
            className={`nav-link ${view === 'customer' ? 'active' : ''}`}
            onClick={() => setView('customer')}
          >
            Customer Home
          </button>
          <button
            className={`nav-link ${view === 'ops' ? 'active' : ''}`}
            onClick={() => setView('ops')}
          >
            About NTFR
          </button>
          <button
            className={`nav-link ${view === 'tech' ? 'active' : ''}`}
            onClick={() => setView('tech')}
          >
            Technician &amp; Parts Portal
          </button>
        </nav>
      </header>

      {/* CUSTOMER VIEW */}
      {view === 'customer' && (
        <>
          <main className="hero">
            <div className="hero-text">
              <h1>
                Keeping Your Cold Chain Moving
                <span className="accent"> with NTFR &amp; DispatchIQ</span>
              </h1>
              <p className="hero-subtitle">
                North Texas Fleet &amp; Refrigeration specializes in refrigerated
                trailer and HVAC repair for delivery fleets across the DFW area.
              </p>

              <div className="hero-stats">
                <div>
                  <strong>24/7</strong>
                  <span>Emergency support</span>
                </div>
                <div>
                  <strong>15+ years</strong>
                  <span>Serving North Texas</span>
                </div>
                <div>
                  <strong>Fleet focus</strong>
                  <span>Trailers · Trucks · Docks</span>
                </div>
              </div>
            </div>

            <div className="status-card">
              <h2>Check Your Unit or Repair Order</h2>
              <p className="status-help">
                Enter your Repair Order # (RO-2417) or Unit ID (Trailer 408).
              </p>

              <form className="status-form" onSubmit={handleStatusSubmit}>
                <input
                  type="text"
                  className="status-input"
                  placeholder="e.g. RO-2417 or Trailer 408"
                  value={statusQuery}
                  onChange={(e) => setStatusQuery(e.target.value)}
                />
                <button type="submit" className="btn primary full">
                  View Status
                </button>
              </form>

              <div className="status-result">
                {!statusSearched && (
                  <p className="status-muted">
                    Status updates refresh frequently. For urgent loads, call
                    dispatch directly.
                  </p>
                )}

                {statusSearched && !statusResult && (
                  <div className="status-panel warning">
                    <strong>No match found yet.</strong>
                    <p>
                      Double-check the number on your paperwork or call dispatch
                      and we will look it up for you.
                    </p>
                  </div>
                )}

                {statusResult && (
                  <div className="status-panel ok">
                    <div className="status-header">
                      <div>
                        <span className="status-label">Repair Order</span>
                        <h3>{statusResult.id}</h3>
                      </div>
                      <span className="badge inprogress">
                        {statusResult.status}
                      </span>
                    </div>

                    <div className="status-grid">
                      <div>
                        <span className="status-label">Customer</span>
                        <p>{statusResult.customer}</p>
                      </div>
                      <div>
                        <span className="status-label">Unit</span>
                        <p>{statusResult.unitId}</p>
                      </div>
                      <div>
                        <span className="status-label">Current Stage</span>
                        <p>{statusResult.stage}</p>
                      </div>
                      <div>
                        <span className="status-label">Estimated Timing</span>
                        <p>{statusResult.eta}</p>
                      </div>
                    </div>

                    <div className="status-note">
                      <span className="status-label">Last Update</span>
                      <p>{statusResult.lastUpdate}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>

          <section className="section alt">
            <h2>Our Service Promise</h2>
            <div className="grid">
              <div className="card">
                <h3>Clear Communication</h3>
                <p>
                  You know when we are dispatched, on site, diagnosing, and
                  completed. No more guessing.
                </p>
              </div>
              <div className="card">
                <h3>Food Safety First</h3>
                <p>
                  Protecting temperature-sensitive cargo is our top priority on
                  every call.
                </p>
              </div>
              <div className="card">
                <h3>Long-Term Partnership</h3>
                <p>
                  We aim to be your ongoing fleet maintenance partner, not just
                  a one-time repair shop.
                </p>
              </div>
            </div>
          </section>

          <footer className="footer">
            <p>Customer portal demo for North Texas Fleet &amp; Refrigeration.</p>
          </footer>
        </>
      )}

      {/* OPS / ABOUT PAGE */}
      {view === 'ops' && (
        <>
          <main className="section">
            <h1>About North Texas Fleet &amp; Refrigeration</h1>
            <p className="section-intro">
              NTFR started as a small two-truck operation focused on keeping
              local delivery fleets running. Today we support carriers,
              distributors, and grocers across North Texas.
            </p>

            <div className="grid">
              <div className="card">
                <h3>Reefer &amp; HVAC Specialists</h3>
                <p>
                  Our techs focus on refrigerated trailers, truck units, and dock
                  equipment. That focus means faster diagnostics and less
                  downtime.
                </p>
              </div>

              <div className="card">
                <h3>Local, Family-Owned</h3>
                <p>
                  Based in North Texas, we understand the heat, traffic, and
                  schedules your fleet faces every day.
                </p>
              </div>
            </div>
          </main>
          <footer className="footer">
            <p>Learn more about the history &amp; mission of NTFR.</p>
          </footer>
        </>
      )}

      {/* TECH & PARTS PORTAL */}
      {view === 'tech' && (
        <>
          <main className="section tech-section">
            {/* Top header bar */}
            <div className="tech-header">
              <div>
                <h1>NTFR Tech Portal (test)</h1>
                <p className="section-intro small">
                  Create &amp; assign work orders, track status, manage parts, and keep your
                  cold chain moving.
                </p>
              </div>
              <div className="tech-actions">
                <button className="btn subtle">+ New Work Order</button>
                <button className="btn subtle">Import</button>
                <button className="btn subtle">Export</button>
                <button className="btn subtle">Reset</button>
              </div>
            </div>

            {/* Tabs + search */}
            <div className="tech-tabs-row">
              <div className="tech-tabs">
                <button
                  className={`tab-button ${
                    techTab === 'workorders' ? 'active' : ''
                  }`}
                  onClick={() => setTechTab('workorders')}
                >
                  Work Orders
                </button>
                <button
                  className={`tab-button ${
                    techTab === 'technicians' ? 'active' : ''
                  }`}
                  onClick={() => setTechTab('technicians')}
                >
                  Technicians
                </button>
                <button
                  className={`tab-button ${
                    techTab === 'parts' ? 'active' : ''
                  }`}
                  onClick={() => setTechTab('parts')}
                >
                  Parts
                </button>
                <button
                  className={`tab-button ${
                    techTab === 'dashboard' ? 'active' : ''
                  }`}
                  onClick={() => setTechTab('dashboard')}
                >
                  Dashboard
                </button>
              </div>

              <div className="tech-search">
                <input
                  className="status-input"
                  placeholder="Search (demo only)"
                  disabled
                />
              </div>
            </div>

            {/* Low stock alerts strip */}
            <div className="low-stock-bar">
              <span className="low-label">Low Stock Alerts</span>
              <div className="low-chips">
                {parts.filter((p) => p.inStock < p.minStock).length === 0 && (
                  <span className="chip chip-ok">No low stock items</span>
                )}
                {parts
                  .filter((p) => p.inStock < p.minStock)
                  .map((p) => (
                    <span key={p.id} className="chip chip-low">
                      {p.name} · On hand {p.inStock} (min {p.minStock})
                    </span>
                  ))}
              </div>
            </div>

            {/* DASHBOARD TAB */}
            {techTab === 'dashboard' && (
              <section className="summary-row">
                <div className="summary-card">
                  <span className="summary-label">Total Work Orders</span>
                  <strong>{workOrders.length}</strong>
                </div>
                <div className="summary-card">
                  <span className="summary-label">In Progress</span>
                  <strong>{inProgressCount}</strong>
                </div>
                <div className="summary-card">
                  <span className="summary-label">Completed</span>
                  <strong>{completedCount}</strong>
                </div>
                <div className="summary-card">
                  <span className="summary-label">Low Stock Items</span>
                  <strong>{lowStockCount}</strong>
                </div>
              </section>
            )}

            {/* WORK ORDERS TAB */}
            {techTab === 'workorders' && (
              <section className="wo-board">
                {workOrders.map((wo) => (
                  <article className="wo-card" key={wo.id}>
                    <header className="wo-header">
                      <div>
                        <h2>{wo.id}</h2>
                        <p className="wo-title">
                          {wo.customer} · {wo.unitId}
                        </p>
                      </div>
                      <div className="wo-header-right">
                        <span className="pill pill-status">{wo.status}</span>
                        <span className="pill pill-stage">{wo.stage}</span>
                      </div>
                    </header>

                    <div className="wo-meta">
                      <div>
                        <span className="summary-label">ETA</span>
                        <p>{wo.eta}</p>
                      </div>
                      <div>
                        <span className="summary-label">Priority</span>
                        <p>{wo.priority}</p>
                      </div>
                    </div>

                    <div className="wo-controls">
                      <div className="wo-control">
                        <label>Status</label>
                        <select
                          value={wo.status}
                          onChange={(e) =>
                            handleOrderStatusChange(wo.id, e.target.value)
                          }
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>

                      <div className="wo-control">
                        <label>Stage</label>
                        <select
                          value={wo.stage}
                          onChange={(e) =>
                            handleOrderStageChange(wo.id, e.target.value)
                          }
                        >
                          <option>Scheduled</option>
                          <option>On Route</option>
                          <option>On Site</option>
                          <option>Diagnostics</option>
                          <option>Repair</option>
                          <option>Closed</option>
                        </select>
                      </div>

                      <div className="wo-control">
                        <label>Technician</label>
                        <select
                          value={wo.assignedTech}
                          onChange={(e) =>
                            handleOrderAssignTech(wo.id, e.target.value)
                          }
                        >
                          <option value="Unassigned">Unassigned</option>
                          {techs.map((t) => (
                            <option key={t.id} value={t.name}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </article>
                ))}

                {/* New work order card */}
                <article className="wo-card new-wo-card">
                  <header className="wo-header">
                    <div>
                      <h2>New Work Order</h2>
                      <p className="wo-title">Schedule a unit for service</p>
                    </div>
                  </header>

                  <form className="wo-controls" onSubmit={handleNewOrderSubmit}>
                    <div className="wo-control">
                      <label>Customer</label>
                      <input
                        className="status-input"
                        value={newOrder.customer}
                        onChange={(e) =>
                          handleNewOrderChange('customer', e.target.value)
                        }
                        placeholder="Customer name"
                      />
                    </div>
                    <div className="wo-control">
                      <label>Unit</label>
                      <input
                        className="status-input"
                        value={newOrder.unitId}
                        onChange={(e) =>
                          handleNewOrderChange('unitId', e.target.value)
                        }
                        placeholder="Trailer / Truck / Dock"
                      />
                    </div>
                    <div className="wo-control">
                      <label>ETA / Scheduled</label>
                      <input
                        className="status-input"
                        value={newOrder.eta}
                        onChange={(e) =>
                          handleNewOrderChange('eta', e.target.value)
                        }
                        placeholder="e.g. Today 3:30 PM"
                      />
                    </div>
                    <div className="wo-control">
                      <label>Technician</label>
                      <select
                        className="status-input"
                        value={newOrder.assignedTech}
                        onChange={(e) =>
                          handleNewOrderChange('assignedTech', e.target.value)
                        }
                      >
                        <option value="">Unassigned</option>
                        {techs.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="wo-control">
                      <label>Priority</label>
                      <select
                        className="status-input"
                        value={newOrder.priority}
                        onChange={(e) =>
                          handleNewOrderChange('priority', e.target.value)
                        }
                      >
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>

                    <button type="submit" className="btn primary full">
                      Add Work Order
                    </button>
                  </form>
                </article>
              </section>
            )}

            {/* TECHNICIANS TAB */}
            {techTab === 'technicians' && (
              <section className="tech-card-row">
                {techs.map((t) => (
                  <article key={t.id} className="tech-card">
                    <header className="tech-card-header">
                      <h2>{t.name}</h2>
                      <span
                        className={`pill ${
                          t.status === 'On Job' ? 'pill-status' : 'pill-ok'
                        }`}
                      >
                        {t.status}
                      </span>
                    </header>
                    <p className="tech-role">Reefer / HVAC Technician</p>
                    <p className="summary-label">
                      Current RO: {t.currentOrder || 'None'}
                    </p>
                    <p className="summary-label">Location: {t.location}</p>
                  </article>
                ))}
              </section>
            )}

            {/* PARTS TAB */}
            {techTab === 'parts' && (
              <section className="part-board">
                {parts.map((p) => {
                  const isLow = p.inStock < p.minStock;
                  return (
                    <article key={p.id} className="part-card">
                      <header className="part-header">
                        <h2>{p.name}</h2>
                        <span
                          className={`pill ${
                            isLow ? 'pill-low' : 'pill-ok'
                          }`}
                        >
                          {isLow ? 'Low' : 'OK'}
                        </span>
                      </header>
                      <p className="summary-label">
                        On hand: {p.inStock} (min {p.minStock})
                      </p>
                      <div className="part-actions">
                        <button
                          type="button"
                          className="mini-btn"
                          onClick={() => handlePartsOrder(p.id)}
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          className="mini-btn"
                          onClick={() => handlePartsUse(p.id)}
                        >
                          -1
                        </button>
                      </div>
                    </article>
                  );
                })}
              </section>
            )}
          </main>

          <footer className="footer">
            <p>
              Demo only — a real build would use Azure Functions, SQL, and
              identity to secure this technician portal.
            </p>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
