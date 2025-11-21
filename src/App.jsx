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
    clockStatus: 'On Job',
    internalNotes: 'Customer reports intermittent warm temps at dock.',
    photos: 2,
    partsUsed: ['P-1001'],
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
    clockStatus: 'Completed',
    internalNotes: 'Full PM service, no follow-up needed.',
    photos: 1,
    partsUsed: [],
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
    clockStatus: 'Not Started',
    internalNotes: '',
    photos: 0,
    partsUsed: [],
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

  const [techTab, setTechTab] = useState('workorders'); // 'dashboard' | 'workorders' | 'technicians' | 'parts'
  const [selectedOrderId, setSelectedOrderId] = useState(
    INITIAL_WORK_ORDERS[0]?.id || null
  );

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

  const dispatchQueue = workOrders.filter(
    (w) => w.status === 'Open' && (!w.assignedTech || w.assignedTech === 'Unassigned')
  );

  const selectedOrder =
    workOrders.find((w) => w.id === selectedOrderId) || null;

  // Handlers
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
      clockStatus: 'Not Started',
      internalNotes: '',
      photos: 0,
      partsUsed: [],
    };

    setWorkOrders((prev) => [order, ...prev]);
    setNewOrder({
      customer: '',
      unitId: '',
      eta: '',
      assignedTech: '',
      priority: 'Normal',
    });
    setSelectedOrderId(order.id);
  };

  const updateOrder = (id, patchFn) => {
    setWorkOrders((prev) =>
      prev.map((wo) => (wo.id === id ? patchFn(wo) : wo))
    );
  };

  const handleOrderStatusChange = (id, status) => {
    updateOrder(id, (wo) => ({
      ...wo,
      status,
      lastUpdate: `Status updated to ${status} via portal`,
    }));
  };

  const handleOrderStageChange = (id, stage) => {
    updateOrder(id, (wo) => ({
      ...wo,
      stage,
      lastUpdate: `Stage changed to ${stage} via portal`,
    }));
  };

  const handleOrderAssignTech = (id, techName) => {
    updateOrder(id, (wo) => ({
      ...wo,
      assignedTech: techName || 'Unassigned',
      lastUpdate: techName
        ? `Assigned to ${techName}`
        : 'Unassigned from technician',
    }));
  };

  const handleOrderNotesChange = (id, notes) => {
    updateOrder(id, (wo) => ({ ...wo, internalNotes: notes }));
  };

  const handleToggleClock = (id) => {
    updateOrder(id, (wo) => {
      const next =
        wo.clockStatus === 'On Job' || wo.clockStatus === 'Completed'
          ? 'Not Started'
          : 'On Job';
      return {
        ...wo,
        clockStatus: next,
        lastUpdate:
          next === 'On Job'
            ? 'Tech clocked in via portal'
            : 'Tech clocked out via portal',
      };
    });
  };

  const handleMockPhotoUpload = (id) => {
    updateOrder(id, (wo) => ({
      ...wo,
      photos: (wo.photos || 0) + 1,
      lastUpdate: 'Photo attached (demo)',
    }));
  };

  const handlePartsOrder = (id) => {
    setParts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: p.inStock + 1 } : p))
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

  const handleUsePartForOrder = (orderId, partId) => {
    handlePartsUse(partId);
    updateOrder(orderId, (wo) => ({
      ...wo,
      partsUsed: [...(wo.partsUsed || []), partId],
      lastUpdate: 'Part usage logged on this RO',
    }));
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

          {/* SERVICE PROMISE */}
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
            {/* Header */}
            <div className="tech-header">
              <div>
                <h1>DispatchIQ Demo – NTFR</h1>
                <p className="section-intro small">
                  Internal tools for managing work orders, technicians, and parts.
                </p>
              </div>
              <div className="tech-actions">
                <button className="btn subtle">Import</button>
                <button className="btn subtle">Export</button>
                <button className="btn subtle">Reset</button>
              </div>
            </div>

            {/* Tabs */}
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
                  <span className="summary-label">Open</span>
                  <strong>{openCount}</strong>
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
                  <span className="summary-label">Low Stock Parts</span>
                  <strong>{lowStockCount}</strong>
                </div>

                <div className="summary-card">
                  <span className="summary-label">Dispatch Queue</span>
                  <strong>{dispatchQueue.length}</strong>
                  <small>Open ROs with no tech</small>
                </div>
              </section>
            )}

            {/* WORK ORDERS TAB – COLUMN LAYOUT */}
            {techTab === 'workorders' && (
              <section className="tech-grid">
                {/* LEFT: Work order list + new form */}
                <div className="card">
                  <h2>Repair Orders</h2>
                  <p className="table-caption">
                    Tap a row to view details, notes, and parts usage.
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
                          <th>Tech</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workOrders.map((wo) => (
                          <tr
                            key={wo.id}
                            className={
                              wo.id === selectedOrderId ? 'row-selected' : ''
                            }
                            onClick={() => setSelectedOrderId(wo.id)}
                          >
                            <td>{wo.id}</td>
                            <td>{wo.customer}</td>
                            <td>{wo.unitId}</td>
                            <td>
                              <select
                                value={wo.status}
                                onChange={(e) =>
                                  handleOrderStatusChange(
                                    wo.id,
                                    e.target.value
                                  )
                                }
                              >
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </td>
                            <td>
                              <select
                                value={wo.stage}
                                onChange={(e) =>
                                  handleOrderStageChange(
                                    wo.id,
                                    e.target.value
                                  )
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
                            <td>
                              <select
                                value={wo.assignedTech}
                                onChange={(e) =>
                                  handleOrderAssignTech(
                                    wo.id,
                                    e.target.value
                                  )
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

                  <div className="card" style={{ marginTop: '1.5rem' }}>
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
                        placeholder="ETA / Scheduled time"
                        value={newOrder.eta}
                        onChange={(e) =>
                          handleNewOrderChange('eta', e.target.value)
                        }
                      />
                      <select
                        className="status-input"
                        value={newOrder.assignedTech}
                        onChange={(e) =>
                          handleNewOrderChange('assignedTech', e.target.value)
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

                {/* RIGHT: Details panel */}
                <div className="card">
                  <h2>Order Details</h2>
                  {!selectedOrder && (
                    <p className="table-caption">
                      Select a repair order on the left to see details.
                    </p>
                  )}

                  {selectedOrder && (
                    <>
                      <div className="status-header">
                        <div>
                          <span className="status-label">Repair Order</span>
                          <h3>{selectedOrder.id}</h3>
                        </div>
                        <span className="badge inprogress">
                          {selectedOrder.status}
                        </span>
                      </div>

                      <div className="status-grid">
                        <div>
                          <span className="status-label">Customer</span>
                          <p>{selectedOrder.customer}</p>
                        </div>
                        <div>
                          <span className="status-label">Unit</span>
                          <p>{selectedOrder.unitId}</p>
                        </div>
                        <div>
                          <span className="status-label">Stage</span>
                          <p>{selectedOrder.stage}</p>
                        </div>
                        <div>
                          <span className="status-label">ETA</span>
                          <p>{selectedOrder.eta}</p>
                        </div>
                      </div>

                      <div className="status-grid">
                        <div>
                          <span className="status-label">Technician</span>
                          <p>{selectedOrder.assignedTech}</p>
                        </div>
                        <div>
                          <span className="status-label">Priority</span>
                          <p>{selectedOrder.priority}</p>
                        </div>
                        <div>
                          <span className="status-label">Clock Status</span>
                          <p>{selectedOrder.clockStatus || 'Not Started'}</p>
                        </div>
                        <div>
                          <button
                            type="button"
                            className="btn subtle full"
                            onClick={() => handleToggleClock(selectedOrder.id)}
                          >
                            {selectedOrder.clockStatus === 'On Job'
                              ? 'Clock Out'
                              : 'Clock In (demo)'}
                          </button>
                        </div>
                      </div>

                      <div className="status-note">
                        <span className="status-label">Internal Notes</span>
                        <textarea
                          className="status-input"
                          rows={4}
                          value={selectedOrder.internalNotes || ''}
                          onChange={(e) =>
                            handleOrderNotesChange(
                              selectedOrder.id,
                              e.target.value
                            )
                          }
                          placeholder="Tech / dispatcher notes for this RO..."
                        />
                      </div>

                      <div className="status-note">
                        <span className="status-label">
                          Photos (demo only)
                        </span>
                        <p>{selectedOrder.photos || 0} attached</p>
                        <button
                          type="button"
                          className="btn subtle"
                          onClick={() => handleMockPhotoUpload(selectedOrder.id)}
                        >
                          Attach Photo (demo)
                        </button>
                      </div>

                      <div className="status-note">
                        <span className="status-label">Timeline (demo)</span>
                        <ul className="bullet-list">
                          <li>RO created & scheduled</li>
                          <li>Stage: {selectedOrder.stage}</li>
                          <li>Status: {selectedOrder.status}</li>
                          <li>Last update: {selectedOrder.lastUpdate}</li>
                        </ul>
                      </div>

                      <div className="status-note">
                        <span className="status-label">Parts Used</span>
                        <p className="table-caption">
                          Log parts against this RO (also reduces inventory).
                        </p>
                        <div className="part-actions">
                          {parts.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              className="mini-btn"
                              onClick={() =>
                                handleUsePartForOrder(selectedOrder.id, p.id)
                              }
                            >
                              Use {p.name}
                            </button>
                          ))}
                        </div>
                        <ul className="bullet-list">
                          {(selectedOrder.partsUsed || []).length === 0 && (
                            <li>No parts logged yet.</li>
                          )}
                          {(selectedOrder.partsUsed || []).map(
                            (pid, index) => {
                              const part = parts.find((p) => p.id === pid);
                              return (
                                <li key={`${pid}-${index}`}>
                                  {part ? part.name : pid}
                                </li>
                              );
                            }
                          )}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </section>
            )}

            {/* TECHNICIANS TAB – LIST STYLE */}
            {techTab === 'technicians' && (
              <section className="tech-grid">
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
                    <h3>Dispatch Queue</h3>
                    <p className="table-caption">
                      Open jobs with no technician assigned.
                    </p>
                    <ul className="bullet-list">
                      {dispatchQueue.length === 0 && (
                        <li>All open jobs are assigned.</li>
                      )}
                      {dispatchQueue.map((wo) => (
                        <li key={wo.id}>
                          <strong>{wo.id}</strong> – {wo.customer} (
                          {wo.unitId})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* PARTS TAB – CARD GRID (STYLE B) */}
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
              Internal NTFR tools view (demo only). A real build would use Azure
              Functions, SQL, and identity to secure this portal.
            </p>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
