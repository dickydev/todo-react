import React, { useState } from 'react';
import './App.css';
import TodoList from './components/TodoList';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="App flex">
      <Sidebar isOpen={sidebarOpen} />
      <div className={`content flex-1 transition-transform duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header toggleSidebar={toggleSidebar} />
        <main className="p-4 mt-16">
          <div className="flex justify-center items-center h-full">
            <div className="max-w-md w-full p-4 bg-white shadow-lg rounded-lg">
              <h2 className="text-lg font-semibold mb-4 text-center">Todo List App</h2>
              <TodoList />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;
