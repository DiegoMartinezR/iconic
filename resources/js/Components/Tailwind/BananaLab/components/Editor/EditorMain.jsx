import PagePreview from './PagePreview';
import PageEditor from './PageEditor';

export default function EditorMain({ 
    currentPage, 
    pages, 
    selectedElement, 
    selectedCell, // Recibe selectedCell como prop
    onSelectElement,
    onSelectCell, // Recibe setSelectedCell como prop
    onAddElement,
    onUpdateElement,
    onDeleteElement,
    getCurrentLayout,
    previewMode
  }) {
    return (
      <main className="flex-1 overflow-auto bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          {previewMode ? (
            <PagePreview 
              page={pages[currentPage]} 
              layout={getCurrentLayout()} 
            />
          ) : (
            <PageEditor
              page={pages[currentPage]}
              layout={getCurrentLayout()}
              selectedElement={selectedElement}
              selectedCell={selectedCell} // Pasa selectedCell a PageEditor
              onSelectElement={onSelectElement}
              onSelectCell={onSelectCell} // Pasa setSelectedCell a PageEditor
              onAddElement={onAddElement}
              onUpdateElement={onUpdateElement}
              onDeleteElement={onDeleteElement}
            />
          )}
        </div>
      </main>
    );
  }