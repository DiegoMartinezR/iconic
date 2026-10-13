import { useState } from 'react';

export default function ContextMenu({ items }) {
  const [position, setPosition] = useState(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleClose = () => {
    setPosition(null);
  };

  return (
    <div onContextMenu={handleContextMenu}>
      {position && (
        <div 
          className="fixed bg-white shadow-lg rounded-md z-50 py-1 w-48"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, index) => (
            <button 
              key={index}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              onClick={() => {
                item.action();
                handleClose();
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}