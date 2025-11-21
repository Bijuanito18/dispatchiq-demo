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
  // which main page we are on
  const [view, setView] = useState('customer'); // 'customer' | 'ops' | 'tech';

  // data for work orders, techs, and parts
  const [workOrders, setWorkOrders] = useState(INITIAL_WORK_ORDERS);
  const [techs] = useState(INITIAL_TECHS);
  const [parts, setParts] = useState(INITIAL_PARTS);

  // customer status search
  const [statusQuery, setStatusQuery] = useState('');
  const [statusResult, setStatusResult] = useState(null);
  const [statusSearched, setStatusSearched] = useState(false);

  // tech portal tab
  const [techTab, setTechTab] = useState('dashboard'); // 'dashboard' | 'workorders' | 'technicians' | 'parts';

  // new work order form
  const [newOrder, setNewOrder] = useState({
    customer: '',
    unitId: '',
    eta: '',
    assignedTech: '',
    priority: 'Normal',
  });

  // computed dashboard numbers
  const openCount = workOrders.filter((w) => w.status === 'Open').length;
  const inProgressCount = workOrders.filter(
    (w) => w.status === 'In Progress'
  ).length;
  const completedCount = workOrders.filter(
    (w) => w.status === 'Completed'
  ).length;
  const lowStockCount = parts.filter((p) => p.inStock < p.minStock).length;

  // handlers
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

            {/* CUSTOMER STATUS CARD */}
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

          {/* ABOUT NTFR (short version) */}
          <section className="section">
            <h2>About North Texas Fleet &amp; Refrigeration</h2>
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
          </section>

          {/* SERVICE PROMISE (still on homepage, no nav link) */}
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
            <h1>Operations &amp; Data with DispatchIQ</h1>
            <p className="section-intro">
              Behind the scenes, NTFR uses DispatchIQ to track work orders,
              response times, and repeat issues. That data helps us keep your
              fleet on the road.
            </p>

            <div className="grid">
              <div className="card">
                <h3>Data-Backed Operations</h3>
                <p>
                  We track jobs, response times, and repeat failures so we can
                  constantly improve how we serve your fleet.
                </p>
              </div>
              <div className="card">
                <h3>Visibility for Dispatch &amp; Office</h3>
                <p>
                  Dispatchers, techs, and office staff all work from the same
                  real-time job board and history.
                </p>
              </div>
              <div className="card">
                <h3>Better Planning for Your Units</h3>
                <p>
                  By seeing which units fail most often and why, we can plan PMs
                  and repairs when they impact you the least.
                </p>
              </div>
            </div>
          </main>

          <footer className="footer">
            <p>Internal operations page for NTFR (demo).</p>
          </footer>
        </>
      )}

      {/* TECH & PARTS PORTAL */}
      {view === 'tech' && (
        <>
          <main className="section tech-section">
            <h1>Technician &amp; Parts Portal</h1>
            <p className="section-intro">
              Internal tooling for technicians, dispatch, and parts coordinators.
              This demo shows how DispatchIQ could organize daily work.
            </p>

            {/* TABS */}
            <div className="tech-tabs">
              <button
                className={`tab-button ${
                  techTab === 'dashboard' ? 'active' : ''
                }`}
                onClick={() => setTechTab('dashboard')}
              >
                Dashboard
              </button>
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
            </div>

            {/* DASHBOARD TAB */}
            {techTab === 'dashboard' && (
              <div className="tech-grid">
                <div className="card">
                  <h2>Work Order Overview</h2>
                  <div className="dashboard-stats">
                    <div className="stat-tile">
                      <span className="stat-label">Open</span>
                      <strong>{openCount}</strong>
                    </div>
                    <div className="stat-tile">
                      <span className="stat-label">In Progress</span>
                      <strong>{inProgressCount}</strong>
                    </div>
                    <div className="stat-tile">
                      <span className="stat-label">Completed</span>
                      <strong>{completedCount}</strong>
                    </div>
                  </div>
                </div>

                <div className="tech-side">
                  <div className="card">
                    <h3>Technician Snapshot</h3>
                    <ul className="bullet-list">
                      {techs.map((t) => (
                        <li key={t.id}>
                          <strong>{t.name}</strong> – {t.status}
                          {t.currentOrder && (
                            <>
                              {' '}
                              · RO:{' '}
                              <span className="pill pill-ro">
                                {t.currentOrder}
                              </span>
                            </>
                          )}
                          <br />
                          <small>Location: {t.location}</small>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="card">
                    <h3>Parts Summary</h3>
                    <p className="table-caption">
                      Low stock items: {lowStockCount}
                    </p>
                    <ul className="bullet-list">
                      {parts
                        .filter((p) => p.inStock < p.minStock)
                        .map((p) => (
                          <li key={p.id}>
                            <strong>{p.name}</strong> – In stock {p.inStock} /
                            Min {p.minStock}
                          </li>
                        ))}
                      {lowStockCount === 0 && (
                        <li>All critical parts are above minimum stock.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* WORK ORDERS TAB */}
            {techTab === 'workorders' && (
              <div className="tech-grid">
                <div className="card wide">
                  <h2>Active Repair Orders</h2>
                  <p className="table-caption">
                    Update status, stage, and technician assignment.
                  </p>
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>RO #</th>
                          <th>Customer</th>
                          <th>Unit</th>
                          <th>Status</th>
                          <th>Stage</th>
                          <th>Priority</th>
                          <th>Assigned Tech</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workOrders.map((wo) => (
                          <tr key={wo.id}>
                            <td>{wo.id}</td>
                            <td>{wo.customer}</td>
                            <td>{wo.unitId}</td>
                            <td>
                              <select
                                value={wo.status}
                                onChange={(e) =>
                                  handleOrderStatusChange(wo.id, e.target.value)
                                }
                              >
                                <option value="Open">Open</option>
                                <option value="In Progress">
                                  In Progress
                                </option>
                                <option value="Completed">Completed</option>
                              </select>
                            </td>
                            <td>
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
                            </td>
                            <td>{wo.priority}</td>
                            <td>
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
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="tech-side">
                  <div className="card">
                    <h3>New Work Order</h3>
                    <form
                      className="status-form"
                      onSubmit={handleNewOrderSubmit}
                    >
                      <input
                        className="status-input"
                        placeholder="Customer name"
                        value={newOrder.customer}
                        onChange={(e) =>
                          handleNewOrderChange('customer', e.target.value)
                        }
                      />
                      <input
                        className="status-input"
                        placeholder="Unit (Trailer 410, Truck 22, etc.)"
                        value={newOrder.unitId}
                        onChange={(e) =>
                          handleNewOrderChange('unitId', e.target.value)
                        }
                      />
                      <input
                        className="status-input"
                        placeholder="ETA or scheduled time"
                        value={newOrder.eta}
                        onChange={(e) =>
                          handleNewOrderChange('eta', e.target.value)
                        }
                      />
                      <select
                        className="status-input"
                        value={newOrder.assignedTech}
                        onChange={(e) =>
                          handleNewOrderChange(
                            'assignedTech',
                            e.target.value
                          )
                        }
                      >
                        <option value="">Assign technician (optional)</option>
                        {techs.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </select>
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
                      <button type="submit" className="btn primary full">
                        Add Work Order
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* TECHNICIANS TAB */}
            {techTab === 'technicians' && (
              <div className="tech-grid">
                <div className="card wide">
                  <h2>Technician Board</h2>
                  <p className="table-caption">
                    Shows which job each tech is clocked into.
                  </p>
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Tech</th>
                          <th>Status</th>
                          <th>Current RO</th>
                          <th>Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {techs.map((t) => (
                          <tr key={t.id}>
                            <td>{t.name}</td>
                            <td>{t.status}</td>
                            <td>{t.currentOrder || '-'}</td>
                            <td>{t.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="tech-side">
                  <div className="card">
                    <h3>How This Could Work Live</h3>
                    <ul className="bullet-list">
                      <li>Techs clock into jobs on their phones.</li>
                      <li>Board updates in real-time for dispatch.</li>
                      <li>Helps balance workloads and route efficiency.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* PARTS TAB */}
            {techTab === 'parts' && (
              <div className="tech-grid">
                <div className="card wide">
                  <h2>Parts Inventory</h2>
                  <p className="table-caption">
                    Track stock, see low items, and mock-order parts.
                  </p>
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Part</th>
                          <th>In Stock</th>
                          <th>Min Stock</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parts.map((p) => {
                          const isLow = p.inStock < p.minStock;
                          return (
                            <tr key={p.id}>
                              <td>{p.name}</td>
                              <td>{p.inStock}</td>
                              <td>{p.minStock}</td>
                              <td>
                                <span
                                  className={
                                    isLow ? 'pill pill-low' : 'pill pill-ok'
                                  }
                                >
                                  {isLow ? 'Low' : 'OK'}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="mini-btn"
                                  type="button"
                                  onClick={() => handlePartsOrder(p.id)}
                                >
                                  Order +1
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="tech-side">
                  <div className="card">
                    <h3>Next Steps in a Real System</h3>
                    <ul className="bullet-list">
                      <li>Connect to a real SQL or Cosmos DB inventory.</li>
                      <li>
                        Auto-create purchase orders when stock drops below min.
                      </li>
                      <li>
                        Tie usage to each RO for accurate job costing.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </main>

          <footer className="footer">
            <p>Internal NTFR tools view (demo only).</p>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
