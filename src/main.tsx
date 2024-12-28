import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import Home from './components/Home';
import Playlist from './components/Playlist';
import Watch from './components/Watch.tsx';
import SignIn from './components/SignIn.tsx';
import SignUpForm from './components/SignUp.tsx';
import Tweets from './components/Tweets.tsx';
import MyContent from './components/MyContent.tsx';
import UpdateProfile from './components/UpdateProfile.tsx';
import { ChatProvider } from './Context/ChatProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChatProvider>
      <BrowserRouter>
        <Routes>
          <Route path="sign-in" element={<SignIn />} />
          <Route path="/" element={<App />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="watch" element={<Watch />} />
            <Route path="playlist" element={<Playlist />} />
            <Route path="sign-up" element={<SignUpForm />} />
            <Route path="my-content" element={<MyContent />} />
            <Route path="tweets" element={<Tweets />} />
            <Route path="update-profile" element={<UpdateProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChatProvider>
  </StrictMode>
);
