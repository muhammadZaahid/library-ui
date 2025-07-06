// src/components/Navbar.jsx
import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const items = [
    {
      label: 'Authors',
      icon: 'pi pi-users',
      command: () => navigate('/authors'),
    },
    {
      label: 'Books',
      icon: 'pi pi-book',
      command: () => navigate('/books'),
    },
    {
      label: 'Members',
      icon: 'pi pi-id-card',
      command: () => navigate('/members'),
    },
    {
      label: 'Borrowed',
      icon: 'pi pi-inbox',
      command: () => navigate('/borrowed'),
    },
  ];

  const start = (
    <div className="flex align-items-center gap-2">
      <i className="pi pi-book mr-2 text-2xl text-primary"></i>
      <span className="text-xl font-semibold text-primary">Library UI</span>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-3">
      <span className="font-medium">Admin</span>
      <Avatar icon="pi pi-user" shape="circle" />
    </div>
  );

  return (
    <div className="card shadow-2 sticky top-0 z-5">
      <Menubar model={items} start={start} end={end} />
    </div>
  );
};

export default Navbar;
