/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileDock from './components/MobileDock';
import HomePage from './pages/Home';
import DashboardPage from './pages/Dashboard';
import ProfilePage from './pages/Profile';
import ProgramsPage from './pages/Programs';
import ZakatPage from './pages/Zakat';
import WakafPage from './pages/Wakaf';
import QurbanPage from './pages/Qurban';
import GalangDanaPage from './pages/GalangDana';
import ImpactPage from './pages/Impact';
import ImpactDetailPage from './pages/ImpactDetail';
import AdvisorPage from './pages/Advisor';
import ProgramDetail from './pages/ProgramDetail';
import ArticlesPage from './pages/Articles';
import ArticleDetailPage from './pages/ArticleDetail';
import AdminApp from './admin/AdminApp';
import PenyalurApp from './penyalur/PenyalurApp';
import AnalisApp from './analis/AnalisApp';
import KetuaApp from './ketua/KetuaApp';
import LoginPage from './pages/Login';
import AdminLogin from './admin/pages/AdminLogin';
import PembayaranPage from './pages/Pembayaran';
import GoogleCallback from './pages/GoogleCallback';
import { useAppContext } from './context/AppContext';

// Wrappers for routes with dynamic URL params
function ProgramDetailRoute({ openCheckout }: { openCheckout: (id?: string) => void }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  return <ProgramDetail id={id || ''} onBack={() => navigate(-1)} openCheckout={openCheckout} />;
}

function ArticleDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  return <ArticleDetailPage id={id || ''} onBack={() => navigate('/articles')} />;
}

function ImpactDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  return <ImpactDetailPage id={id || ''} onBack={() => navigate('/impact')} />;
}

export default function App() {
  const { userRole, setUserRole, logout, campaigns } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);

  const isLoggedIn = userRole !== 'guest';
  const pathname = location.pathname;

  // Satukan alur donasi ke URL resmi /pembayaran (Wajib Login sebelum donasi)
  const openCheckout = (progId?: string | number, amount?: number) => {
    let targetCampaign = campaigns[0];
    const targetId = progId || selectedProgramId;
    if (targetId) {
      const found = campaigns.find((c) => String(c.id) === String(targetId));
      if (found) targetCampaign = found;
    }

    const checkoutState = {
      campaignId: targetCampaign?.id || 1,
      programTitle: targetCampaign?.title || 'Infaq & Zakat Yayasan Semarang Infak',
      amount: amount || 50000,
    };

    if (!isLoggedIn) {
      navigate('/login', {
        state: {
          redirect: '/pembayaran',
          checkoutState,
          message: 'Silakan masuk ke akun Anda terlebih dahulu sebelum melanjutkan donasi.',
        },
      });
      return;
    }

    navigate('/pembayaran', {
      state: checkoutState,
    });
  };

  // Helper legacy navigation
  const handleNavigatePage = (page: string) => {
    const routeMap: Record<string, string> = {
      home: '/',
      dashboard: '/dashboard',
      programs: '/programs',
      'program-detail': selectedProgramId ? `/programs/${selectedProgramId}` : '/programs',
      zakat: '/zakat',
      wakaf: '/wakaf',
      qurban: '/qurban',
      'galang-dana': '/galang-dana',
      impact: '/impact',
      'impact-detail': '/impact',
      articles: '/articles',
      'article-detail': '/articles',
      advisor: '/advisor',
      profile: '/profile',
      login: '/login',
      admin: '/admin',
      penyalur: '/penyalur',
      analis: '/analis',
      ketua: '/ketua',
    };
    navigate(routeMap[page] || `/${page}`);
  };

  const handleSelectProgram = (id: string) => {
    setSelectedProgramId(id);
    navigate(`/programs/${id}`);
  };

  const handleSelectArticle = (id: string) => {
    navigate(`/articles/${id}`);
  };

  const handleSelectImpact = (id: string) => {
    navigate(`/impact/${id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getActivePageName = () => {
    if (pathname === '/' || pathname === '') return 'home';
    const firstSegment = pathname.replace(/^\//, '').split('/')[0];
    return firstSegment || 'home';
  };
  const activePage = getActivePageName();

  // Full-screen Standalone Role Portals (Admin, Penyalur, Analis, Ketua, Login)
  if (pathname === '/admin/login') {
    return <AdminLogin />;
  }

  if (pathname.startsWith('/admin')) {
    const isStaff = ['admin', 'analis', 'penyalur', 'ketua'].includes(userRole);
    if (!isStaff) {
      return <Navigate to="/admin/login" replace />;
    }
    return <AdminApp onExitAdmin={() => { setUserRole('guest'); navigate('/'); }} />;
  }

  if (pathname.startsWith('/penyalur')) {
    return <PenyalurApp />;
  }

  if (pathname.startsWith('/analis')) {
    return <AnalisApp />;
  }

  if (pathname.startsWith('/ketua')) {
    return <KetuaApp />;
  }

  if (pathname === '/auth/google/callback') {
    return <GoogleCallback />;
  }

  if (pathname === '/login') {
    return (
      <LoginPage
        onBack={() => navigate('/')}
        onSuccess={() => navigate('/dashboard')}
      />
    );
  }

  const hideGlobalHeader = [
    '/advisor',
    '/zakat',
    '/wakaf',
    '/qurban',
    '/galang-dana',
    '/articles',
    '/impact',
    '/profile',
    '/pembayaran',
  ].some((prefix) => pathname.startsWith(prefix)) ||
    pathname.startsWith('/programs');

  const hideBottomNav = [
    '/advisor',
    '/zakat',
    '/wakaf',
    '/qurban',
    '/galang-dana',
    '/pembayaran',
  ].some((prefix) => pathname.startsWith(prefix)) ||
    pathname.startsWith('/programs/') ||
    pathname.startsWith('/impact/') ||
    pathname.startsWith('/articles/') ||
    pathname === '/' ||
    pathname === '';

  return (
    <div className={`min-h-screen bg-white font-sans flex flex-col ${isLoggedIn && !hideBottomNav ? 'pb-[64px] md:pb-0' : ''}`}>
      {!hideGlobalHeader && (
        <Header
          activePage={activePage}
          setActivePage={handleNavigatePage}
          openCheckout={openCheckout}
          isLoggedIn={isLoggedIn}
          onLogin={() => navigate('/login')}
          onLogout={handleLogout}
        />
      )}

      <main className="flex-1 flex flex-col bg-white" id="mainContent">
        <Routes>
          <Route path="/" element={<HomePage openCheckout={openCheckout} setActivePage={handleNavigatePage} />} />
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <DashboardPage openCheckout={openCheckout} setActivePage={handleNavigatePage} onSelectProgram={handleSelectProgram} />
              ) : (
                <Navigate
                  to="/login"
                  replace
                  state={{
                    redirect: '/dashboard',
                    message: 'Silakan masuk untuk melihat ringkasan akun dan riwayat donasi Anda.',
                  }}
                />
              )
            }
          />
          <Route path="/programs" element={<ProgramsPage onSelectProgram={handleSelectProgram} onBack={() => navigate(isLoggedIn ? '/dashboard' : '/')} />} />
          <Route path="/programs/:id" element={<ProgramDetailRoute openCheckout={openCheckout} />} />
          <Route path="/zakat" element={<ZakatPage onBack={() => navigate(isLoggedIn ? '/dashboard' : '/')} openCheckout={openCheckout} />} />
          <Route
            path="/pembayaran"
            element={
              isLoggedIn ? (
                <PembayaranPage />
              ) : (
                <Navigate
                  to="/login"
                  replace
                  state={{
                    redirect: '/pembayaran',
                    message: 'Silakan masuk ke akun Anda terlebih dahulu sebelum melanjutkan donasi.',
                  }}
                />
              )
            }
          />
          <Route path="/wakaf" element={<WakafPage onBack={() => navigate(isLoggedIn ? '/dashboard' : '/')} />} />
          <Route path="/qurban" element={<QurbanPage onBack={() => navigate(isLoggedIn ? '/dashboard' : '/')} />} />
          <Route path="/galang-dana" element={<GalangDanaPage onBack={() => navigate(isLoggedIn ? '/dashboard' : '/')} />} />
          <Route path="/impact" element={<ImpactPage onSelectImpact={handleSelectImpact} />} />
          <Route path="/impact/:id" element={<ImpactDetailRoute />} />
          <Route path="/articles" element={<ArticlesPage onSelectArticle={handleSelectArticle} />} />
          <Route path="/articles/:id" element={<ArticleDetailRoute />} />
          <Route path="/advisor" element={<AdvisorPage onBack={() => navigate(isLoggedIn ? '/dashboard' : '/')} />} />
          <Route
            path="/profile"
            element={
              isLoggedIn ? (
                <ProfilePage onLogout={handleLogout} onEnterAdmin={() => { setUserRole('admin'); navigate('/admin'); }} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {pathname === '/' && <Footer />}
      {isLoggedIn && !hideBottomNav && (
        <MobileDock />
      )}
    </div>
  );
}
