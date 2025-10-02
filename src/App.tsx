import {
  NavLink,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import './App.scss';
import { PeoplePage } from './components/PeopleTable';

const HomePage = () => (
  <div className="container">
    <h1 className="title">Home Page</h1>
  </div>
);

const PageNotFound = () => (
  <div className="container">
    <h1 className="title">Page not found</h1>
  </div>
);

export const App = () => {
  const { pathname } = useLocation();

  return (
    <div data-cy="app">
      <nav
        data-cy="nav"
        className="navbar is-fixed-top has-shadow"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <NavLink
              className={`navbar-item
              ${pathname === '/' && 'has-background-grey-lighter'}`}
              to="/"
            >
              Home
            </NavLink>

            <NavLink
              className={`navbar-item
              ${pathname === '/people' && 'has-background-grey-lighter'}`}
              to="/people"
            >
              People
            </NavLink>
          </div>
        </div>
      </nav>

      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/people" element={<PeoplePage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  );
};
