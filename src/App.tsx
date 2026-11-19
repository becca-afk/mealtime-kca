import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { StatusBanner } from './components/StatusBanner';
import { BottomNav } from './components/BottomNav';
import { FloatingTrayBar } from './components/FloatingTrayBar';
import { StudentHome } from './components/StudentHome';
import { MenuGrid } from './components/MenuGrid';
import { OrdersView } from './components/OrdersView';
import { KdsBoard } from './components/KdsBoard';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SmartCardProfile } from './components/SmartCardProfile';
import { LoginScreen } from './components/LoginScreen';
import { StudentRegistrationModal } from './components/StudentRegistrationModal';
import { CartModal } from './components/modals/CartModal';
import { MpesaStkModal } from './components/modals/MpesaStkModal';
import { WalletTopupModal } from './components/modals/WalletTopupModal';
import { QrPassModal } from './components/modals/QrPassModal';
import { FeedbackModal } from './components/modals/FeedbackModal';
import { ItemDetailModal } from './components/modals/ItemDetailModal';
import { NotificationDrawer } from './components/modals/NotificationDrawer';
import { ToastContainer } from './components/modals/ToastContainer';

export const App: React.FC = () => {
  const { isLoggedIn, currentPage, role, isOnline } = useApp();

  return (
    <div id="root-container">
      {/* Show Login Screen when signed out; unmount active dashboard cleanly */}
      {!isLoggedIn ? (
        <LoginScreen />
      ) : (
        <div id="app" style={{ display: 'block' }}>
          <Header />

          {/* Global Network Connectivity Warning (Strict Online-Only Requirement) */}
          {!isOnline && (
            <div
              style={{
                background: '#DC2626',
                color: '#FFF',
                padding: '10px 16px',
                textAlign: 'center',
                fontSize: '0.84rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.35)',
                position: 'sticky',
                top: '56px',
                zIndex: 9999,
              }}
            >
              <span>⚠️</span>
              <span>
                <strong>Internet Connection Lost:</strong> MealTime requires an active online connection to communicate with KCA Cafeteria servers.
              </span>
            </div>
          )}

          {/* Status banner is ONLY for students viewing the queue wait time */}
          {role === 'student' && <StatusBanner />}

          <main className="app-main" style={role !== 'student' ? { paddingBottom: '24px' } : undefined}>
            {role === 'staff' ? (
              <KdsBoard />
            ) : role === 'admin' ? (
              <AnalyticsDashboard />
            ) : (
              <>
                {currentPage === 'menu' ? (
                  <MenuGrid />
                ) : currentPage === 'orders' ? (
                  <OrdersView />
                ) : currentPage === 'profile' ? (
                  <SmartCardProfile />
                ) : (
                  <StudentHome />
                )}
              </>
            )}
          </main>

          {/* Floating Tray and Bottom Tabs ONLY for Students */}
          {role === 'student' && <FloatingTrayBar />}
          {role === 'student' && <BottomNav />}

          {/* Logged-in Modals & Overlays */}
          <CartModal />
          <MpesaStkModal />
          <WalletTopupModal />
          <QrPassModal />
          <FeedbackModal />
          <ItemDetailModal />
          <NotificationDrawer />
        </div>
      )}

      {/* Auth / Global Overlays */}
      <StudentRegistrationModal />
      <ToastContainer />
    </div>
  );
};
