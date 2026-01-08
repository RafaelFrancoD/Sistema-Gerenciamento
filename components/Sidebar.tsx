import React from 'react';
import { LayoutDashboard, Users, Calendar, FileText, X, CheckSquare, BellRing } from 'lucide-react'; // Added BellRing

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
  hasAlerts: boolean; // Added hasAlerts prop
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, onClose, hasAlerts }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, alert: hasAlerts }, // Added alert property
    { id: 'employees', label: 'Colaboradores', icon: Users },
    { id: 'vacations', label: 'Solicitações de Férias', icon: Calendar },
    { id: 'approvals', label: 'Aprovações', icon: CheckSquare },
    { id: 'reports', label: 'Relatórios', icon: FileText },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-40 h-screen w-64 bg-blue-900 text-white shadow-2xl 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        <div className="flex justify-between items-center p-6 border-b border-blue-800 bg-blue-950">
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">SGF System</h1>
            <p className="text-blue-300 text-xs mt-1 tracking-wider uppercase">Enterprise Edition</p>
          </div>
          <button onClick={onClose} className="md:hidden text-blue-300 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChangeView(item.id);
                  onClose(); // Close sidebar on mobile when item selected
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg translate-x-2'
                    : 'text-blue-100 hover:bg-blue-800 hover:translate-x-1'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {item.alert && ( // Display alert icon if item.alert is true
                  <BellRing size={16} className="text-yellow-400 animate-pulse ml-auto" />
                )}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-blue-800 text-xs text-blue-300 text-center bg-blue-950">
          v2.0.0 - SGF System
        </div>
      </aside>
    </>
  );
};