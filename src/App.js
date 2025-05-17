import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, Layout, theme } from 'antd';
import EventsList from './pages/Events/EventsList';
import EventDetail from './pages/Events/EventDetail';
import AddEvent from './pages/Events/AddEvent';
import EditEvent from './pages/Events/EditEvent';
import ThemeSwitch from './components/ThemeSwitch';
import { ThemeProvider, useTheme } from './utils/ThemeContext';
import './App.css';

const { Header, Content, Footer } = Layout;
const { darkAlgorithm, defaultAlgorithm } = theme;

// Create a client for React Query
const queryClient = new QueryClient();

// App content with theme-aware configuration
const AppContent = () => {
  const { darkMode } = useTheme();
  
  // Load Jost font
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
          fontFamily: "'Jost', sans-serif",
        },
        components: {
          Layout: {
            colorBgHeader: darkMode ? '#141414' : '#1677ff',
            colorBgBody: darkMode ? '#000000' : '#f0f2f5',
            colorBgContainer: darkMode ? '#141414' : '#ffffff',
          },
        },
        algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{ 
            position: 'sticky', 
            top: 0, 
            zIndex: 1, 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            color: '#fff',
            fontFamily: "'Jost', sans-serif",
          }}>
            <div style={{ fontSize: '18px', fontWeight: '600' }}>
              Technical Test - Event Management - Jesus Palacios
            </div>
            <ThemeSwitch />
          </Header>
          
          <Content style={{ padding: '0 24px', marginTop: 16 }}>
            <div style={{ 
              minHeight: 280, 
              padding: 24, 
              borderRadius: 8 
            }}>
              <Routes>
                <Route path="/" element={<Navigate to="/events" />} />
                <Route path="/events" element={<EventsList />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/events/add" element={<AddEvent />} />
                <Route path="/events/edit/:id" element={<EditEvent />} />
              </Routes>
            </div>
          </Content>
          
          <Footer style={{ 
            textAlign: 'center',
          }}>
 Technical Test - Event Management - Jesus Palacios {new Date().getFullYear()}
          </Footer>
        </Layout>
      </Router>
    </ConfigProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
