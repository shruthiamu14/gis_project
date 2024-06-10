import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChennaiMap from "./components/ChennaiMap";
import "./styles.css";
import AdminPage from "./components/Admin";

function App() {
  return(
    <Router>
    <div>
    <div className="map">
    <Routes>
            <Route path="/" element={<ChennaiMap/>} />
            <Route path="/admin" element={<AdminPage/>} />
    </Routes>
    </div>
    </div>
    </Router>

  );
}

export default App;
