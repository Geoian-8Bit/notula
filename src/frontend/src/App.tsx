import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { RequireAuth } from './auth/RequireAuth';
import { ThemeProvider } from './theme/ThemeProvider';
import { AppShell } from './components/AppShell';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

// Pages protegidas se code-splitean: la escena 3D arrastra three.js +
// drei + postprocessing (~700 KB). Sign-in / sign-up no lo necesitan,
// así que la primera pantalla carga instantánea. AppShell envuelve el
// <Outlet> en un <Suspense> para mostrar fallback mientras llega el chunk.
const Shelf = lazy(() => import('./pages/Shelf'));
const AddBook = lazy(() => import('./pages/AddBook'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Stats = lazy(() => import('./pages/Stats'));
const BookDetail = lazy(() => import('./pages/BookDetail'));

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
