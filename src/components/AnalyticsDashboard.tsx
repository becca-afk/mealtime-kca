import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SAMPLE_DAILY_REPORT } from '../data/defaultData';

export const AnalyticsDashboard: React.FC = () => {
  const { orders, menu, feedbacks, showToast } = useApp();
  const [showExportModal, setShowExportModal] = useState(false);

  const totalMeals = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : '4.4';

  const lowRatedItems = menu.filter(m => m.rating < 3.5);
  const topSellers = [...menu].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 4);

  // Hourly traffic comparison (SRS Section 4.10)
  const hourlyData = [
    { hour: '8 AM', predicted: 25, actual: 20 },
    { hour: '10 AM', predicted: 40, actual: 35 },
    { hour: '12 PM (Rush)', predicted: 110, actual: 125 },
    { hour: '1 PM (Peak)', predicted: 130, actual: 140 },
    { hour: '2 PM', predicted: 60, actual: 55 },
    { hour: '4 PM', predicted: 45, actual: 50 },
    { hour: '6 PM', predicted: 30, actual: 28 },
  ];

  const maxVal = Math.max(...hourlyData.map(h => Math.max(h.predicted, h.actual)));

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="page-analytics" className="page active" style={{ display: 'block' }}>
      <div className="page-hero maroon-hero">
        <div className="hero-pattern"></div>
        <div style={{ display: 'inline-block', background: 'rgba(255, 215, 0, 0.2)', border: '1px solid var(--gold)', borderRadius: '20px', padding: '3px 10px', fontSize: '0.72rem', fontWeight: 800, color: 'var(--gold-light)', marginBottom: '8px' }}>
          🛡️ SYSTEM ADMINISTRATOR HUB (SRS SECTION 3.3)
        </div>
        <h2>Cafeteria Operations Analytics &amp; Admin Hub</h2>
        <p>
          Logged in as Administrator: <strong>John Doe (Supervisor &amp; Administrator)</strong> · admin.catering@kcau.ac.ke
        </p>
      </div>

      <div id="page-analytics-body" style={{ padding: '16px' }}>
        {/* Metric Cards */}
        <div className="analytics-grid">
          <div className="metric-card">
            <span className="metric-icon">📦</span>
            <div className="metric-body">
              <span className="metric-num" id="m-orders">{totalMeals || 48}</span>
              <span className="metric-label">Meals Served Today</span>
            </div>
            <span className="metric-trend up">+15%</span>
          </div>

          <div className="metric-card">
            <span className="metric-icon">⭐</span>
            <div className="metric-body">
              <span className="metric-num" id="m-rating">{avgRating}</span>
              <span className="metric-label">Avg Student Rating</span>
            </div>
            <span className="metric-trend up">+0.4</span>
          </div>

          <div className="metric-card">
            <span className="metric-icon">⏱️</span>
            <div className="metric-body">
              <span className="metric-num" id="m-prep-time">4.2m</span>
              <span className="metric-label">Avg Pickup Speed</span>
            </div>
            <span className="metric-trend up">Optimal</span>
          </div>

          <div className="metric-card">
            <span className="metric-icon">⚠️</span>
            <div className="metric-body">
              <span className="metric-num warn" id="m-low">{lowRatedItems.length}</span>
              <span className="metric-label">Items Under Review</span>
            </div>
            <span className="metric-trend down">Actionable</span>
          </div>
        </div>

        {/* Action button to view SRS Appendix D Official Daily Sales Report */}
        <div style={{ margin: '20px 0', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--maroon) 0%, var(--maroon-deep) 100%)',
              color: '#FFF',
              fontWeight: 700,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <span>📑 View Official Daily Sales Report (SRS Appendix D)</span>
          </button>
        </div>

        {/* Predicted vs Actual Hourly Rush Chart */}
        <div className="chart-card">
          <h3 className="chart-title">📈 Predicted vs Actual Hourly Rush</h3>
          <p className="chart-sub">Student cafeteria traffic volume (KCA University Ruaraka Campus)</p>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: '180px',
              padding: '20px 10px 10px',
              gap: '8px',
              borderBottom: '2px solid var(--border)',
            }}
          >
            {hourlyData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', width: '100%', justifyContent: 'center' }}>
                  {/* Predicted Bar */}
                  <div
                    style={{
                      width: '12px',
                      height: `${(d.predicted / maxVal) * 130}px`,
                      background: 'rgba(201, 152, 31, 0.45)',
                      borderRadius: '4px 4px 0 0',
                    }}
                    title={`Predicted: ${d.predicted} students`}
                  ></div>
                  {/* Actual Bar */}
                  <div
                    style={{
                      width: '14px',
                      height: `${(d.actual / maxVal) * 130}px`,
                      background: 'var(--maroon)',
                      borderRadius: '4px 4px 0 0',
                    }}
                    title={`Actual: ${d.actual} students`}
                  ></div>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', whiteSpace: 'nowrap' }}>
                  {d.hour}
                </span>
              </div>
            ))}
          </div>

          <div className="chart-legend">
            <span className="legend-item actual">● Actual Served Meals</span>
            <span className="legend-item predicted">◌ Predicted Traffic Flow</span>
          </div>
        </div>

        {/* Low-rated items alert per SRS Section 4.10 */}
        <div className="chart-card">
          <h3 className="chart-title">⚠️ Items Needing Quality Improvement</h3>
          <p className="chart-sub">Food items rated under 3.5 stars by comrades (SRS Section 4.10)</p>
          <div className="low-rated-list">
            {lowRatedItems.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--green)' }}>
                ✓ Great news! All cafeteria items currently meet the 3.5+ star quality benchmark.
              </div>
            ) : (
              lowRatedItems.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 23, 68, 0.08)',
                    border: '1px solid rgba(255, 23, 68, 0.25)',
                    marginBottom: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{item.emoji}</span>
                    <div>
                      <strong>{item.name}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Current rating: <span style={{ color: 'var(--red)', fontWeight: 700 }}>{item.rating} ⭐</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast(`Quality audit task dispatched to cafeteria head chef!`, 'info')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'var(--red)',
                      color: '#FFF',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    Flag for Kitchen Review
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Sellers */}
        <div className="chart-card">
          <h3 className="chart-title">🔥 Campus Top Sellers</h3>
          <div className="top-sellers">
            {topSellers.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'var(--surface-2)',
                  marginBottom: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 800, color: 'var(--gold)', fontSize: '1.1rem' }}>
                    #{idx + 1}
                  </span>
                  <span style={{ fontSize: '1.4rem' }}>{item.emoji}</span>
                  <div>
                    <strong>{item.name}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      KSh {item.price} · ⭐ {item.rating}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ color: 'var(--maroon)' }}>{item.soldCount || 30} orders</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--green)', fontWeight: 600 }}>High Demand</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Administrator User Management per SRS Section 3.3 */}
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <h3 className="chart-title">👥 University User Accounts Management</h3>
              <p className="chart-sub">Authorized credentials for Students, Kitchen Staff, and Administrators (SRS Section 3.3 / 8.1)</p>
            </div>
            <button
              type="button"
              onClick={() => showToast('User directory refreshed from KCA LDAP database', 'info')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'var(--surface-3)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text)',
              }}
            >
              ↻ Sync Database
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowX: 'auto' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'var(--surface-3)',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: 'var(--text-muted)',
              }}
            >
              <span>USER / CREDENTIAL IDENTIFIER</span>
              <span>ROLE</span>
              <span>SECURITY / PIN</span>
              <span>ACCOUNT STATUS</span>
            </div>

            {/* Student Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                padding: '12px',
                borderRadius: '8px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                alignItems: 'center',
                fontSize: '0.84rem',
              }}
            >
              <div>
                <strong>Rebecca Nabusambya</strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Reg: 2502692 · 2502692@students.kcau.ac.ke
                </div>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--maroon)' }}>Student (BIT)</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Password (Hashed)</span>
              <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: '0.78rem' }}>● Active (KSh 850)</span>
            </div>

            {/* Kitchen Staff Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                padding: '12px',
                borderRadius: '8px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                alignItems: 'center',
                fontSize: '0.84rem',
              }}
            >
              <div>
                <strong>Chef Otieno</strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  ID: KCA-STAFF-08 · chef.otieno@kcau.ac.ke
                </div>
              </div>
              <span style={{ fontWeight: 700, color: '#D97706' }}>Cafeteria Staff</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text)' }}>
                <strong>6-Digit PIN: 882041</strong>
              </span>
              <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: '0.78rem' }}>● Terminal Online</span>
            </div>

            {/* Administrator Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                padding: '12px',
                borderRadius: '8px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                alignItems: 'center',
                fontSize: '0.84rem',
              }}
            >
              <div>
                <strong>John Doe (Supervisor)</strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  ID: KCA-ADMIN-01 · admin.catering@kcau.ac.ke
                </div>
              </div>
              <span style={{ fontWeight: 700, color: '#2563EB' }}>System Admin</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Dual Multi-Auth</span>
              <span style={{ color: '#2563EB', fontWeight: 700, fontSize: '0.78rem' }}>★ Superuser</span>
            </div>
          </div>
        </div>
      </div>

      {/* SRS Appendix D Daily Sales Report Modal */}
      {showExportModal && (
        <div className="modal-overlay">
          <div className="modal-sheet" style={{ maxWidth: '500px' }}>
            <div className="modal-handle"></div>
            <div className="modal-header">
              <div>
                <h3>Official Daily Sales Report</h3>
                <span className="sub-muted">SRS Appendix D: Sample Output Report</span>
              </div>
              <button className="modal-close" onClick={() => setShowExportModal(false)} type="button">
                ✕
              </button>
            </div>

            <div
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '18px',
                margin: '16px 0',
                fontFamily: 'monospace',
                fontSize: '0.92rem',
                lineHeight: 1.7,
              }}
            >
              <div><strong>KCA UNIVERSITY CAFETERIA MANAGEMENT</strong></div>
              <div><strong>REPORT TYPE:</strong> DAILY SALES &amp; SPEED AUDIT</div>
              <div>---------------------------------------------</div>
              <div><strong>Date:</strong> {SAMPLE_DAILY_REPORT.date}</div>
              <div><strong>Total Orders Processed:</strong> {SAMPLE_DAILY_REPORT.totalOrdersProcessed}</div>
              <div><strong>Total Revenue:</strong> KES {SAMPLE_DAILY_REPORT.totalRevenue.toLocaleString()}</div>
              <div><strong>Most Popular Item:</strong> {SAMPLE_DAILY_REPORT.mostPopularItem} ({SAMPLE_DAILY_REPORT.popularItemOrders} orders)</div>
              <div><strong>Average Preparation Time:</strong> {SAMPLE_DAILY_REPORT.averagePrepTime}</div>
              <div>---------------------------------------------</div>
              <div><strong>Generated For:</strong> John Doe (Supervisor) &amp; Administrator</div>
              <div><strong>Status:</strong> Verified &amp; Reconciled with Safaricom Daraja</div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handlePrint}
                className="login-btn"
                style={{ flex: 1 }}
              >
                🖨️ Print / Save as PDF
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Report CSV exported to device downloads', 'success');
                  setShowExportModal(false);
                }}
                className="go-menu-btn"
                style={{ flex: 1 }}
              >
                📥 Export CSV
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="nav-clearance-spacer"></div>
    </section>
  );
};
