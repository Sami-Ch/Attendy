
import Login from './pages/Login'
import Attendy from './pages/Attendy'
import './App.css'
import Register from './pages/Register'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminDashboard from './pages/AdminDashboard';


function App() {

  //!  {======================= APP STARTS HERE =========================}
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Login} />
        <Route path="/Register" Component={Register} />
        <Route path="/Attendy" Component={Attendy} />
        <Route path="/AdminDashboard" Component={AdminDashboard} />
      </Routes>
    </Router>
  );
}

export default App
