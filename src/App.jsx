import { useState } from 'react';
import './app.css';

const MOCK_JOBS = [
  {
    id: 'RO-2417',
    customer: 'DFW Grocery Distribution',
    unitId: 'Trailer 408',
    status: 'In Progress',
    stage: 'Diagnostics',
    eta: 'Today, 3:15 PM',
    lastUpdate: 'Tech on site, checking compressor',
  },
  {
    id: 'RO-2423',
    customer: 'North Texas Produce',
    unitId: 'Truck 17',
    status: 'Completed',
    stage: 'Closed',
    eta: 'Completed 10:05 AM',
    lastUpdate: 'PM complete, signed by customer',
  },
  {
    id: 'RO-2430',
    customer: 'Metro Delivery Co',
    unitId: 'Dock Unit #3',
    status: 'Scheduled',
    stage: 'Waiting to Dispatch',
    eta: 'Tomorrow, 9:00 AM',
    lastUpdate: 'Assigned to Javier, parts verified in stock',
  },
];

function findJob(query) {
  if (!query) return null;
  const normalized = query.trim().toLowerCase();
  return (
    MOCK_JOBS.find(
      (job) =>
        job.id.toLowerCase() === normalized ||
        job.unitId.toLowerCase() === normalized
    ) || null
  );
}

function App() {
  const [view, setView] = useState('customer'); // 'customer' | 'tech'
  const [statusQuery, setStatusQuery] = useState('');
  const [statusResult, setStatusResult] = useState(null);
  const [statusSearched, setStatusSearched] = useState(false);

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    const job = findJob(statusQuery);
    setStatusResult(job);
    setStatusSearched(true);
  };

  return (
    <div className="app">
      {/* Top Bar */}
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
          <a href="#about" className="nav-link">
            About NTFR
          </a>
          <a href="#service" className="nav-link">
            Service Promise
          </a>
          <button
            className={`nav-link ${view === 'tech' ? 'active' : ''}`}
            onClick={() => setView('tech')}
          >
            Technician & Parts Portal
          </button>
        </nav>
      </header>

      {view === 'customer' ? (
        <>
          {/* Hero + Status Panel */}
          <main className="hero" id="overview">
            <div className="hero-text">
              <h1>
                Keeping Your Cold Chain Moving
                <span className="accent"> with NTFR & DispatchIQ</span>
              </h1>
              <p className="hero-subtitle">
                North Texas Fleet & Refrigeration specializes in refrigerated
                trailer and HVAC repair for delivery fleets across the DFW
                area. Use this portal to check the status of your unit and see
                how we keep your loads protected.
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

            {/* Customer Status Card */}
            <div className="status-card">
              <h2>Check Your Unit or Repair Order</h2>
              <p className="status-help">
                Enter your <strong>Repair Order #</strong> (RO-2417) or{' '}
                <strong>Unit ID</strong> (e.g. Trailer 408).
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
                    Status updates are near real-time. For urgent issues, please
                    call our dispatch line.
                  </p>
                )}

                {statusSearched && !statusResult && (
                  <div className="status-panel warning">
                    <strong>We couldn&apos;t find that order yet.</strong>
                    <p>
                      Please verify the Repair Order or Unit ID on your
                      paperwork. If you still can&apos;t find it, call dispatch
                      and we&apos;ll look it up for you.
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

          {/* About Section */}
          <section id="about" className="section">
            <h2>About North Texas Fleet & Refrigeration</h2>
            <p className="section-intro">
              NTFR started as a small, two-truck operation focused on keeping
              local delivery fleets moving, no matter the weather. Today, we
              support regional carriers, grocers, and distributors across the
              DFW metroplex with fast, reliable refrigerated unit repair.
            </p>

            <div className="grid">
              <div className="card">
                <h3>Reefer & HVAC Specialists</h3>
                <p>
                  Our technicians focus on refrigerated trailers, truck-mounted
                  units, and dock equipment. That focus means faster
                  diagnostics, better repairs, and less downtime.
                </p>
              </div>
              <div className="card">
                <h3>Local, Family-Owned</h3>
                <p>
                  Based in North Texas, we understand the demands of regional
                  delivery schedules, traffic, and heat. We treat every load
                  like it&apos;s our own.
                </p>
              </div>
              <div className="card">
                <h3>Data-Backed Operations</h3>
                <p>
                  With DispatchIQ, we track jobs, response times, and repeat
                  issues so we can continually improve how we serve your fleet.
                </p>
              </div>
            </div>
          </section>

          {/* Service Promise Section */}
          <section id="service" className="section alt">
            <h2>Our Service Promise to Your Fleet</h2>
            <div className="grid">
              <div className="card">
                <h3>Clear Communication</h3>
                <p>
                  You&apos;ll always know what&apos;s happening with your unit:
                  when we&apos;re dispatched, on site, diagnosing, and
                  completed—no more guessing or chasing updates.
                </p>
              </div>
              <div className="card">
                <h3>Safety & Food Integrity</h3>
                <p>
                  We understand how critical temperature control is. Our
                  priority is protecting your loads and keeping your equipment
                  operating within spec.
                </p>
              </div>
              <div className="card">
                <h3>Partnership Mindset</h3>
                <p>
                  We&apos;re not just a one-off repair shop. We aim to be your
                  long-term maintenance partner, helping prevent breakdowns
                  before they happen.
                </p>
              </div>
            </div>
          </section>

          <footer className="footer">
            <p>
              Customer portal demo for{' '}
              <strong>North Texas Fleet & Refrigeration</strong>. For real-time
              assistance, please contact our dispatch line.
            </p>
          </footer>
        </>
      ) : (
        <>
          {/* Technician & Parts Portal View */}
          <main className="section tech-section">
            <h1>Technician &amp; Parts Portal</h1>
            <p className="section-intro">
              Internal view for NTFR technicians and parts coordinators. This
              demo shows how repair orders, unit details, and parts status could
              be tracked inside DispatchIQ.
            </p>

            <div className="tech-grid">
              <div className="card wide">
                <h2>Active Repair Orders</h2>
                <p className="table-caption">
                  Filter by status to prioritize emergency calls and in-progress
                  jobs.
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
                        <th>ETA / Target</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_JOBS.map((job) => (
                        <tr key={job.id}>
                          <td>{job.id}</td>
                          <td>{job.customer}</td>
                          <td>{job.unitId}</td>
                          <td>{job.status}</td>
                          <td>{job.stage}</td>
                          <td>{job.eta}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="tech-side">
                <div className="card">
                  <h3>Parts &amp; Inventory Notes</h3>
                  <ul className="bullet-list">
                    <li>Common reefer compressors stocked in main warehouse.</li>
                    <li>
                      Critical seals, filters, and belts pre-kitted for PM
                      services.
                    </li>
                    <li>
                      Backordered or special-order parts flagged and tied to RO
                      for follow-up.
                    </li>
                  </ul>
                </div>

                <div className="card">
                  <h3>Technician Workflow (High Level)</h3>
                  <ol className="step-list">
                    <li>Review assigned ROs and confirm parts on hand.</li>
                    <li>Update status to On Route / On Site from mobile.</li>
                    <li>Capture diagnostics, temperature readings, and photos.</li>
                    <li>Record parts used and recommendations for follow-up.</li>
                    <li>Mark job as Completed and notify dispatch.</li>
                  </ol>
                </div>
              </div>
            </div>
          </main>

          <footer className="footer">
            <p>
              Internal tools view for NTFR staff. Not for customer use. Access
              can be restricted with authentication in a production system.
            </p>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
