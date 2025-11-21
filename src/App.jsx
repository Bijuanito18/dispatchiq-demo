import './app.css';

function App() {
  return (
    <div className="app">
      {/* Top Bar */}
      <header className="topbar">
        <div className="logo">
          <span className="logo-mark">NTFR</span>
          <div className="logo-text">
            <span>North Texas Fleet & Refrigeration</span>
            <small>Powered by DispatchIQ</small>
          </div>
        </div>
        <nav className="nav">
          <a href="#overview">Overview</a>
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <a href="#benefits">Benefits</a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="hero" id="overview">
        <div className="hero-text">
          <h1>
            Streamlined Dispatch & Maintenance
            <span className="accent"> for NTFR</span>
          </h1>
          <p className="hero-subtitle">
            DispatchIQ replaces paper logs, phone calls, and spreadsheets with a
            single web-based hub for technicians, dispatchers, and office staff.
          </p>

          <div className="hero-actions">
            <a href="#workflow" className="btn primary">
              See How It Works
            </a>
            <a href="#features" className="btn ghost">
              View Key Features
            </a>
          </div>

          <div className="hero-stats">
            <div>
              <strong>20+</strong>
              <span>Technicians & staff</span>
            </div>
            <div>
              <strong>Real-time</strong>
              <span>Job status updates</span>
            </div>
            <div>
              <strong>Less paper</strong>
              <span>More visibility</span>
            </div>
          </div>
        </div>

        {/* Simple “Dashboard” Mock */}
        <div className="hero-card">
          <div className="card-header">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
            <span className="card-title">Today&apos;s Jobs</span>
          </div>
          <div className="card-body">
            <div className="job-row">
              <span className="badge open">Assigned</span>
              <div className="job-main">
                <strong>Route 12 – Trailer 408</strong>
                <small>Reefer won&apos;t hold temp – Dispatch to Javier</small>
              </div>
              <span className="job-meta">08:30</span>
            </div>
            <div className="job-row">
              <span className="badge inprogress">In Progress</span>
              <div className="job-main">
                <strong>Store #241 – Dock Unit</strong>
                <small>Compressor diagnostics – Parts on truck</small>
              </div>
              <span className="job-meta">09:15</span>
            </div>
            <div className="job-row">
              <span className="badge complete">Completed</span>
              <div className="job-main">
                <strong>Fleet PM – Truck #17</strong>
                <small>Planned maintenance – Logged & signed</small>
              </div>
              <span className="job-meta">10:05</span>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="section">
        <h2>Key Features</h2>
        <p className="section-intro">
          DispatchIQ focuses on the real problems NTFR faces every day: lost
          paperwork, unclear job statuses, and slow communication between
          dispatch and technicians.
        </p>

        <div className="grid">
          <div className="card">
            <h3>Centralized Job Board</h3>
            <p>
              All active jobs in one place with status, assigned tech, location,
              and priority. No more digging through texts and Excel sheets.
            </p>
          </div>
          <div className="card">
            <h3>Technician View</h3>
            <p>
              Techs can see their daily schedule, job details, and log work
              performed directly from their phone or tablet.
            </p>
          </div>
          <div className="card">
            <h3>Real-Time Updates</h3>
            <p>
              Dispatch sees when a job is assigned, in progress, or completed
              instantly, reducing call-backs and “where&apos;s my tech?” calls.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="section alt">
        <h2>How DispatchIQ Fits Into NTFR&apos;s Day</h2>
        <div className="timeline">
          <div className="step">
            <div className="step-circle">1</div>
            <div className="step-body">
              <h3>Customer Call / Request</h3>
              <p>
                Office staff logs the service request into DispatchIQ instead of
                writing it on paper or in a spreadsheet.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-circle">2</div>
            <div className="step-body">
              <h3>Job Assignment</h3>
              <p>
                Dispatch assigns a technician with the right skills and
                location. The tech gets the job instantly on their device.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-circle">3</div>
            <div className="step-body">
              <h3>On-Site Work & Notes</h3>
              <p>
                The technician updates status, adds notes, and records parts
                used. Everything is stored in one system of record.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-circle">4</div>
            <div className="step-body">
              <h3>Completion & Reporting</h3>
              <p>
                Dispatch and office staff can see work completed, create
                invoices faster, and track repeat issues by customer or unit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="section">
        <h2>Why This Matters for NTFR</h2>
        <div className="grid">
          <div className="card">
            <h3>Less Chaos</h3>
            <p>
              Reduce missed jobs, duplicate work, and lost notes from paper
              tickets and separate spreadsheets.
            </p>
          </div>
          <div className="card">
            <h3>Faster Response</h3>
            <p>
              Dispatch has real-time visibility, so jobs get to the right tech
              faster with fewer phone calls.
            </p>
          </div>
          <div className="card">
            <h3>Better Customer Experience</h3>
            <p>
              Clearer communication and faster service builds trust with
              delivery fleets and store customers.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>
          Demo concept for{' '}
          <strong>North Texas Fleet & Refrigeration – DispatchIQ</strong>. Built
          as part of an Azure solution design project.
        </p>
      </footer>
    </div>
  );
}

export default App;
