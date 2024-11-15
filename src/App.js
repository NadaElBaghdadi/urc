import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UsersAndRooms from './UsersAndRoomsList';
        
 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/users-and-rooms" element={<UsersAndRooms/>}/>

      </Routes>
    </Router>
  );
}

export default App;
