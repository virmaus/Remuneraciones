
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MENU_ITEMS } from '../constants.tsx';
import { ChevronDown, ChevronRight, Menu, Download, Github, RefreshCw } from 'lucide-react';
import { usePayroll } from '../App.tsx';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
  const location = useLocation();
  const { updateAvailable, checkUpdates, appVersion } = usePayroll();
  const [expandedItems, setExpandedItems] = useState<string[]>(['archivo', 'movimientos']);
  const [isChecking, setIsChecking] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleManualCheck = async () => {
    setIsChecking(true);
    await checkUpdates();
    setTimeout(() => setIsChecking(false), 1000);
  };

  return (
    <>
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
          <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white font-bold shrink-0 shadow-lg">
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
          {updateAvailable && isOpen && (
            <a 
              href="https://github.com/virmaus/Remuneraciones"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg text-xs font-bold transition-all shadow-lg animate-bounce"
            >
              <Download size={16} />
              Bajar Nueva Versión
            </a>
          )}
          
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Versión Actual</span>
              <button 
                onClick={handleManualCheck}
                disabled={isChecking}
                className="text-gray-400 hover:text-emerald-600 transition-colors"
              >
                <RefreshCw size={12} className={isChecking ? 'animate-spin' : ''} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Github size={14} className="text-gray-400" />
              <span className="text-xs font-bold text-gray-700">v{appVersion} - Estable</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
