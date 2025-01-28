import UserDetail from './pages/UserDetail';

// Boshqa importlar...

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Boshqa yo'nalishlar */}
        <Route path="/user/:id" element={<UserDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 