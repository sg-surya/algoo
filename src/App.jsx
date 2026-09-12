import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Explorer from "./pages/Explorer";
import AlgorithmPage from "./pages/AlgorithmPage";
import Compare from "./pages/Compare";
import Onboarding from "./components/Onboarding";

export default function App(){
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FFFBF0] text-black">
        <Navbar />
        <Onboarding />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/algorithms/:id" element={<AlgorithmPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
