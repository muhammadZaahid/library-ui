import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';

import AuthorList from './components/authors/AuthorList';
import AuthorForm from './components/authors/AuthorForm';
import BookList from './components/books/BookList';
import BookForm from './components/books/BookForm';
import MemberList from './components/members/MemberList';
import MemberForm from './components/members/MemberForm';
import BorrowedList from './components/borrowed/BorrowedList';
import BorrowedForm from './components/borrowed/BorrowedForm';

import 'primereact/resources/themes/lara-light-blue/theme.css';  
import 'primereact/resources/primereact.min.css';                 
import 'primeicons/primeicons.css';                              
import 'primeflex/primeflex.css';                                
import './index.css';

const AppNavbar = () => {
  const navigate = useNavigate();

  const items = [
    { label: 'Books', icon: 'pi pi-book', command: () => navigate('/books') },
    { label: 'Authors', icon: 'pi pi-users', command: () => navigate('/authors') },
    { label: 'Members', icon: 'pi pi-id-card', command: () => navigate('/members') },
    { label: 'Borrowed', icon: 'pi pi-inbox', command: () => navigate('/borrowed-books') },
  ];

  const start = (
    <div className="flex align-items-center gap-2">
      <i className="pi pi-book mr-2 text-xl"></i>
      <span style={{ fontFamily: 'SamsungSharpSansBold', color: '#000000' }} className="text-xl font-bold text-primary">
        Library App
      </span>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-3">
      <span className="font-medium text-sm">Admin</span>
      <Avatar icon="pi pi-user" shape="circle" size="small" />
    </div>
  );

  return (
    <div className="sticky top-0 z-5 shadow-1">
      <Menubar model={items} start={start} end={end} />
    </div>
  );
};

function App() {
  return (
    <PrimeReactProvider>
      <Router>
        <AppNavbar />
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
