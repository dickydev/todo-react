import React from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-blue-600 text-white p-4 fixed w-full top-0 flex justify-between items-center">
      <h1 className="text-lg font-bold">Todo List App</h1>
      <button onClick={toggleSidebar} className="sidebar-toggle bg-white text-blue-600 p-2 rounded">
        Toggle Sidebar
      </button>
    </header>
  );
};

export default Header;
