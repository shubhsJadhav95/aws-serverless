
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import ItemDetails from "./ItemDetails";

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="*" element={<App />} />
    </Routes>
  </Router>
)