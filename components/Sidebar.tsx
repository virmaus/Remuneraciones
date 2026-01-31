
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MENU_ITEMS } from '../constants.tsx';
import { ChevronDown, ChevronRight, Menu, MonitorDown } from 'lucide-react';
import { usePayroll } from '../App.tsx';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
  const location = useLocation();
  const { isInstallable, installApp } = usePayroll();
  const [expandedItems, setExpandedItems] = useState<string[]>(['archivo', 'movimientos']);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={toggle}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className={`
        ${isOpen ? 'w-64' : 'w-0 lg:w-20'} 
        bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-40 h-full overflow-hidden
      `}>
        <div className="p-6 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white font-bold shrink-0">
            T
          </div>
          {isOpen && <span className="font-bold text-emerald-800 text-lg tracking-tight">TRANSTECNIA</span>}
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const isExpanded = expandedItems.includes(item.id);
            const isActive = location.pathname.includes(item.id);

            return (
              <div key={item.id}>
                <div 
                  onClick={() => item.subItems ? toggleExpand(item.id) : null}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors
                    ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'}
                  `}
                >
                  {item.subItems ? (
                    <div className="flex items-center gap-3 flex-1">
                      {item.icon}
                      {isOpen && <span className="font-medium text-sm">{item.label}</span>}
                    </div>
                  ) : (
                    <Link to={`/${item.id}`} className="flex items-center gap-3 flex-1">
                      {item.icon}
                      {isOpen && <span className="font-medium text-sm">{item.label}</span>}
                    </Link>
                  )}
                  {item.subItems && isOpen && (
                    isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                  )}
                </div>

                {item.subItems && isExpanded && isOpen && (
                  <div className="ml-9 mt-1 space-y-1">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.id}
                        to={`/${item.id}/${sub.id}`}
                        className={`
                          block px-3 py-2 text-sm rounded-md transition-colors
                          ${location.pathname === `/${item.id}/${sub.id}` 
                            ? 'text-emerald-700 font-medium' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                        `}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-3 shrink-0">
          {isInstallable && isOpen && (
            <button 
              onClick={installApp}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-500/20 mb-2"
            >
              <MonitorDown size={16} />
              Instalar Localmente
            </button>
          )}
          
          <div className="bg-emerald-600 p-3 rounded-lg text-white text-center">
            <p className="text-xs opacity-80 uppercase font-semibold">Soporte 24/7</p>
            <p className="text-sm font-bold">Remuneraciones Digital</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
