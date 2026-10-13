import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { layouts } from '../constants/layouts';

export default function usePageActions(initialPages = []) {
  // Definir createPage primero
  const createPage = useCallback((layoutId = layouts[0].id) => {
    const layout = layouts.find(l => l.id === layoutId) || layouts[0];
    return {
      id: uuidv4(),
      layout: layout.id,
      cells: Array.from({ length: layout.cells }).map(() => ({
        id: uuidv4(),
        elements: []
      }))
    };
  }, []);

  const [pages, setPages] = useState(
    initialPages.length ? initialPages : [createPage()]
  );
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const addPage = useCallback((layoutId) => {
    const newPage = createPage(layoutId);
    setPages(prev => [...prev, newPage]);
    setCurrentPageIndex(prev => prev + 1);
    return newPage;
  }, [createPage]);

  const duplicatePage = useCallback((index) => {
    const pageToDuplicate = pages[index];
    const newPage = {
      ...JSON.parse(JSON.stringify(pageToDuplicate)),
      id: uuidv4(),
      cells: pageToDuplicate.cells.map(cell => ({
        ...cell,
        id: uuidv4(),
        elements: cell.elements.map(el => ({
          ...el,
          id: uuidv4()
        }))
      }))
    };
    setPages(prev => [...prev, newPage]);
    setCurrentPageIndex(pages.length);
    return newPage;
  }, [pages]);

  const deletePage = useCallback((index) => {
    if (pages.length <= 1) return;
    setPages(prev => prev.filter((_, i) => i !== index));
    setCurrentPageIndex(prev => Math.min(prev, pages.length - 2));
  }, [pages.length]);

  const changeLayout = useCallback((index, layoutId) => {
    const layout = layouts.find(l => l.id === layoutId);
    if (!layout) return;
    
    setPages(prev => prev.map((page, i) => {
      if (i !== index) return page;
      
      return {
        ...page,
        layout: layoutId,
        cells: Array.from({ length: layout.cells }).map((_, cellIndex) => {
          return page.cells[cellIndex] || { 
            id: uuidv4(), 
            elements: [] 
          };
        })
      };
    }));
  }, []);

  const getCurrentLayout = useCallback(() => 
    layouts.find(l => l.id === pages[currentPageIndex]?.layout) || layouts[0], 
    [currentPageIndex, pages]
  );

  return {
    pages,
    currentPageIndex,
    setCurrentPageIndex,
    addPage,
    duplicatePage,
    deletePage,
    changeLayout,
    currentPage: pages[currentPageIndex],
    getCurrentLayout
  };
}