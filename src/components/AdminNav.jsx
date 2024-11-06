import { useState } from 'react';

const AdminNav = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed z-20 inset-y-0 left-0 w-64 bg-navy-blue-700 p-5 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="text-white text-xl font-bold mb-6">Admin Dashboard</div>
        <nav className="space-y-2">
          <a href="/admin/" className="flex items-center p-2 text-white hover:bg-navy-blue-600 rounded-md">
            <span>Dashboard</span>
          </a>
          <a href="/admin/manage-candidates" className="flex items-center p-2 text-white hover:bg-navy-blue-600 rounded-md">
            <span>Manage Candidates</span>
          </a>
          <a href="/admin/manage-positions" className="flex items-center p-2 text-white hover:bg-navy-blue-600 rounded-md">
            <span>Manage Positions</span>
          </a>
          <a href="/admin/manage-faculties" className="flex items-center p-2 text-white hover:bg-navy-blue-600 rounded-md">
            <span>Manage Faculties</span>
          </a>
          <a href="/admin/manage-departments" className="flex items-center p-2 text-white hover:bg-navy-blue-600 rounded-md">
            <span>Manage Departments</span>
          </a>
          <a href="/admin/settings" className="flex items-center p-2 text-white hover:bg-navy-blue-600 rounded-md">
            <span>Settings</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between bg-white p-4 shadow-md md:ml-0 w-full">
          <button
            className="text-gray-700 md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
          <div className="text-gray-700 text-lg font-semibold hidden md:block">Admin Dashboard - Overview</div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 bg-gray-200 rounded-full focus:outline-none focus:bg-gray-300 w-full max-w-xs"
            />
            <img
              src="https://th.bing.com/th/id/R.a83bc096189d4c1cd7886c837eafced2?rik=1qbkqO%2bo6eHafA&pid=ImgRaw&r=0"
              alt="User"
              className="w-10 h-10 rounded-full border-2 border-gray-300"
            />
            <span className="text-gray-700 font-medium">Admin</span>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminNav;
