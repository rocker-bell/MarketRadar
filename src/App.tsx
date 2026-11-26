import { Routes, Route } from "react-router-dom";
import Landing_page from './Components/Landing_page';
import Dashboard from './dashboard/Dashboard';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing_page />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
