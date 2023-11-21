import './App.scss';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer';
import Home from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import MyMedicationsPage from './pages/MyMedicationsPage/MyMedicationsPage';
import InteractionCheckPage from './pages/InteractionCheckPage/InteractionCheckPage';
import MedicationHistoryPage from './pages/MedicationHistoryPage/MedicationHistoryPage';
import NotFound from './pages/NotFound/NotFound';


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/mymedications" element={<MyMedicationsPage/>} />
        <Route path="/interactioncheck" element={<InteractionCheckPage/>} />
        <Route path="/medicationhistory" element={<MedicationHistoryPage/>} />
        <Route element={NotFound} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;