import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

//components
import JourneyList from "./components/JourneyList";
import StationsList from "./components/StationsList";
import StationInfo from "./components/StationInfo";
import NavBar from "./components/NavBar";
import NoPage from "./components/NoPage";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
            <Route exact path="/" element={<JourneyList />}></Route>
            <Route exact path="/stations" element={<StationsList />}></Route>
            <Route exact path="/stations/:id" element={<StationInfo />}></Route>
            <Route exact path="*" element={<NoPage />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
