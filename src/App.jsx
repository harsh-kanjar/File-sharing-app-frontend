import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from './pages';
import { Footer, Login, Navbar, Sidebar, Signup, UploadFile } from './components';
import "./App.css"
function App() {
  return (
    <Router>
      <div
       className="bg-blue-400"
         
      >

        <Navbar />
        <div className="flex">
          {/* <Sidebar /> */}
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/upload" element={<UploadFile />} />
            </Routes>
          </div>
        </div>
      </div>
      <Footer />


    </Router>
  );
}

export default App;
