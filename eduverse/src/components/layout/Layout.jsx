import React from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from '../header/Header';
import Footer from '../footer';

const Layout = () => {
  const location = useLocation();

  const hideFooterRoutes = [
    "/student/chat-room",
    "/teacher-chat",
    "/teacher/chat",
    "/merged-chat-room"
  ];

  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default Layout;
