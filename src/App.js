import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UsersAndRooms from './UsersAndRoomsList';
import Chat from './Chat';       
 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/messages" element={<Chat/>}/>
        <Route path="/messages/user/:userId" element={<Chat />} /> ;  
      </Routes>
    </Router>
  );
}

export default App;
