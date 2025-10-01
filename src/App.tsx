import { Loader } from './components/Loader';
import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.scss';
import { getPeople } from './api';
import { useEffect, useState } from 'react';
import { Person } from './types';

const nomesColunas = ['Name', 'Sex', 'Born', 'Died', 'Mother', 'Father'];

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

type PersonLinkProps = {
  person: Person;
  onSelect: (slug: string) => void;
};

const PersonLink = ({ person, onSelect }: PersonLinkProps) => {
  if (!person.slug) {
    return null;
  }

  return (
    <Link
      to={`/people/${person.slug}`}
      onClick={() => onSelect(person.slug)}
      className={person.sex === 'f' ? 'has-text-danger' : ''}
    >
      {person.name}
    </Link>
  );
};

const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [seletedSlug, setSeletedSlug] = useState<string | null>(null);

  useEffect(() => {
    getPeople()
      .then(data => {
        setPeople(data);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="container">
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="box table-container">
          {isLoading && <Loader />}

          {error && (
            <p data-cy="peopleLoadingError" className="has-text-danger">
              Something went wrong
            </p>
          )}

          {!isLoading && !error && people.length === 0 && (
            <p data-cy="noPeopleMessage">There are no people on the server</p>
          )}

          {people.length > 0 && (
            <table
              data-cy="peopleTable"
              className="table is-striped is-hoverable is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  {nomesColunas.map(coluna => (
                    <th key={coluna}>{coluna}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {people.map(person => {
                  const mother = people.find(p => p.name === person.motherName);
                  const father = people.find(p => p.name === person.fatherName);

                  return (
                    <tr
                      data-cy="person"
                      key={person.slug}
                      className={
                        seletedSlug === person.slug
                          ? 'has-background-warning'
                          : ''
                      }
                    >
                      <td>
                        <PersonLink person={person} onSelect={setSeletedSlug} />
                      </td>
                      <td>{person.sex}</td>
                      <td>{person.born}</td>
                      <td>{person.died}</td>
                      <td>
                        {person.motherName ? (
                          mother ? (
                            <PersonLink
                              person={mother}
                              onSelect={setSeletedSlug}
                            />
                          ) : (
                            person.motherName
                          )
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        {person.fatherName ? (
                          father ? (
                            <PersonLink
                              person={father}
                              onSelect={setSeletedSlug}
                            />
                          ) : (
                            person.fatherName
                          )
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

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
            <Link
              className={`navbar-item
              ${pathname === '/' && 'has-background-grey-lighter'}`}
              to="/"
            >
              Home
            </Link>

            <Link
              className={`navbar-item
              ${pathname === '/people' && 'has-background-grey-lighter'}`}
              to="/people"
            >
              People
            </Link>
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
