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
import { InstallAppModal } from './components/modals/InstallAppModal';

export const App: React.FC = () => {
  const { isLoggedIn, currentPage, role } = useApp();

  return (
    <div id="root-container">
      {/* If not logged in, show Login Screen */}
      {!isLoggedIn && <LoginScreen />}

      {/* Main App Container */}
      <div id="app" style={{ display: 'block' }}>
        <Header />
        <StatusBanner />

        <main className="app-main">
          {currentPage === 'home' && <StudentHome />}
          {currentPage === 'menu' && <MenuGrid />}
          {currentPage === 'orders' && <OrdersView />}
          {currentPage === 'kds' && <KdsBoard />}
          {currentPage === 'analytics' && <AnalyticsDashboard />}
          {currentPage === 'profile' && <SmartCardProfile />}
        </main>

        <FloatingTrayBar />
        <BottomNav />
      </div>

      {/* Modals & Overlays */}
      <StudentRegistrationModal />
      <CartModal />
      <MpesaStkModal />
      <WalletTopupModal />
      <QrPassModal />
      <FeedbackModal />
      <ItemDetailModal />
      <NotificationDrawer />
      <ToastContainer />
      <InstallAppModal />
    </div>
  );
};
