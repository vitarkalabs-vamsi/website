import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import ArcNodePage from './pages/ArcNodePage.jsx';
import OrganoidIntelligencePage from './pages/OrganoidIntelligencePage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="arc-node" element={<ArcNodePage />} />
        <Route path="organoid-intelligence" element={<OrganoidIntelligencePage />} />
      </Route>
    </Routes>
  );
}
