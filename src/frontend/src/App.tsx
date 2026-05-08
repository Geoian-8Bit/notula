import { Route, Routes } from 'react-router-dom';
import { RequireAuth } from './auth/RequireAuth';
import { ThemeProvider } from './theme/ThemeProvider';
import { AppShell } from './components/AppShell';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Shelf from './pages/Shelf';
import AddBook from './pages/AddBook';
import Favorites from './pages/Favorites';
import Stats from './pages/Stats';
import BookDetail from './pages/BookDetail';

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route index element={<Shelf />} />
          <Route path="add" element={<AddBook />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="stats" element={<Stats />} />
          <Route path="book/:id" element={<BookDetail />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
