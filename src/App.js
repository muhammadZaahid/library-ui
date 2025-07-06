import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';

// Pages/Components
import Navbar from './components/Navbar';

import AuthorList from './components/authors/AuthorList';
import AuthorForm from './components/authors/AuthorForm';
import BookList from './components/books/BookList';
import BookForm from './components/books/BookForm';
import MemberList from './components/members/MemberList';
import MemberForm from './components/members/MemberForm';
import BorrowedList from './components/borrowed/BorrowedList';
import BorrowedForm from './components/borrowed/BorrowedForm';

// Styles
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './index.css';

function App() {
  return (
      <PrimeReactProvider>
        <Router>
          <Navbar />
          <div className="p-4">
            <Routes>
              {/* Books */}
              <Route path="/books" element={<BookList />} />
              <Route path="/books/new" element={<BookForm />} />
              <Route path="/books/edit/:id" element={<BookForm />} />

              {/* Authors */}
              <Route path="/authors" element={<AuthorList />} />
              <Route path="/authors/new" element={<AuthorForm />} />
              <Route path="/authors/edit/:id" element={<AuthorForm />} />

              {/* Members */}
              <Route path="/members" element={<MemberList />} />
              <Route path="/members/new" element={<MemberForm />} />
              <Route path="/members/edit/:id" element={<MemberForm />} />

              {/* Borrowed */}
              <Route path="/borrowed-books" element={<BorrowedList />} />
              <Route path="/borrowed-books/new" element={<BorrowedForm />} />
              <Route path="/borrowed-books/edit/:id" element={<BorrowedForm />} />
            </Routes>
          </div>
        </Router>
      </PrimeReactProvider>
  );
}

export default App;
