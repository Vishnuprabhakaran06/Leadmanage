import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LeadListPage from '../pages/LeadListPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/leads" replace />} />
      <Route path="/leads" element={<LeadListPage />} />
      <Route path="*" element={<Navigate to="/leads" replace />} />
    </Routes>
  );
}
