import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

//components
import JourneyList from "./components/JourneyList";
import StationsList from "./components/StationsList";
import StationInfo from "./components/StationInfo";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
            <Route exact path="/" element={<JourneyList />}></Route>
            <Route exact path="/stations" element={<StationsList />}></Route>
            <Route exact path="/stationinfo/:name" element={<StationInfo />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
