import React from 'react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <div className={`sidebar bg-gray-800 text-white p-4 fixed h-full ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
      <h3 className="text-xl font-semibold mb-4">Menu</h3>
      <ul>
        <li className="mb-2 text-lg font-bold">Dashboard</li>
        <li className="mb-2">Todo List</li>
        <li className="mb-2">Settings</li>
        <li className="mb-2">Profile</li>
      </ul>
    </div>
  );
};

export default Sidebar;
