import { useContext} from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './containers/Home';
import Login from './containers/Login';
import UserContextProvider from "./UserContext";
import Modal from 'react-modal/lib/components/Modal';
import Register from './containers/Register'

Modal.setAppElement('#root');

function App() {
  return (
    <UserContextProvider>
    <Router>
      <Routes>
          <Route path='/login' element={<Login />}/>
          <Route path='/*' element={<Home />}/>
      </Routes>
    </Router>     
  </UserContextProvider>
  );
}

export default App;
