import { useState } from 'react';

import LayoutSelector from './LayoutSelector';
import ElementAdder from './ElementAdder';
import FilterControls from './FilterControls';
import TabPanel from '../UI/TabPanel';

export default function EditorSidebar({ 
  activeTab, 
  onTabChange,
  selectedLayout,
  onLayoutChange,
  onAddImage,
  onAddText,
  selectedElement,
  onFilterChange,
  getSelectedElement,
  getCurrentLayout
}) {
  const [filterTab, setFilterTab] = useState('basic');

  return (
    <aside className="w-64 border-r bg-white p-4 overflow-y-auto shadow-sm">
      <div className="space-y-6">
        <TabPanel
          tabs={[
            { id: 'elements', label: 'Elementos' },
            { id: 'filters', label: 'Filtros' }
          ]}
          activeTab={activeTab}
          onChange={onTabChange}
        />

        {activeTab === 'elements' ? (
          <>
            <LayoutSelector 
              selectedLayout={selectedLayout}
              onSelect={onLayoutChange}
            />
            
            <ElementAdder 
              onAddImage={onAddImage}
              onAddText={onAddText}
            />
          </>
        ) : selectedElement ? (
          <FilterControls
            element={getSelectedElement()}
            filterTab={filterTab}
            onFilterTabChange={setFilterTab}
            onFilterChange={onFilterChange}
            availableMasks={getCurrentLayout().maskCategories.flatMap(cat => cat.masks)}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            Selecciona un elemento para editar sus filtros
          </div>
        )}
      </div>
    </aside>
  );
}