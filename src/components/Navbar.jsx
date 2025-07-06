// src/components/AppNavbar.jsx
import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; // ← import CSS khusus navbar

const AppNavbar = () => {
  const navigate = useNavigate();

  const items = [
    {
      label: <span className="navbar-item">Books</span>,
      icon: 'pi pi-book',
      command: () => navigate('/books'),
    },
    {
      label: <span className="navbar-item">Authors</span>,
      icon: 'pi pi-users',
      command: () => navigate('/authors'),
    },
    {
      label: <span className="navbar-item">Members</span>,
      icon: 'pi pi-id-card',
      command: () => navigate('/members'),
    },
    {
      label: <span className="navbar-item">Borrowed</span>,
      icon: 'pi pi-inbox',
      command: () => navigate('/borrowed-books'),
    },
  ];

  const start = (
      <div className="flex align-items-center gap-2 pl-3 mr-5">
        <i className="pi pi-book text-primary text-xl"></i>
        <span
            className="text-xl text-black"
            style={{ fontFamily: 'SamsungSharpSansBold' }}
        >
      Library App
    </span>
      </div>
  );


  const end = (
      <div className="flex align-items-center gap-3 pr-3">
        <span className="navbar-user-label">Admin</span>
        <Avatar icon="pi pi-user" shape="circle" size="small" />
      </div>
  );

  return (
      <div className="navbar-container">
        <Menubar
            model={items}
            start={start}
            end={end}
            className="rounded-none border-none bg-white"
            pt={{
              menuitem: {
                className: 'navbar-item',
              },
            }}
        />
      </div>
  );
};

export default AppNavbar;
