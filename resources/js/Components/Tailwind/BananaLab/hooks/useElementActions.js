import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function useElementActions(initialElements = []) {
  const [elements, setElements] = useState(initialElements);
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null); // Añade este estado
  
  const addElement = (type, position = { x: 10, y: 10 }) => {
    const newElement = type === 'image' 
      ? createImageElement(position)
      : createTextElement(position);
    
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
    return newElement;
  };

  const updateElement = (id, updates) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const deleteElement = (id) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  const duplicateElement = (id) => {
    const original = elements.find(el => el.id === id);
    if (!original) return;
    
    const newElement = {
      ...JSON.parse(JSON.stringify(original)),
      id: uuidv4(),
      position: {
        x: original.position.x + 10,
        y: original.position.y + 10
      }
    };
    
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
    return newElement;
  };

  const createImageElement = (position) => ({
    id: uuidv4(),
    type: "image",
    content: "",
    position,
    filters: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      tint: 0,
      hue: 0,
      blur: 0,
      scale: 1,
      rotate: 0,
      opacity: 100,
      blendMode: "normal",
      flipHorizontal: false,
      flipVertical: false
    },
    mask: "none"
  });

  const createTextElement = (position) => ({
    id: uuidv4(),
    type: "text",
    content: "Haz clic para editar",
    position,
    style: {
      fontSize: "16px",
      fontFamily: "Arial, sans-serif",
      color: "#000000",
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: "left",
      backgroundColor: "transparent",
      padding: "8px",
      borderRadius: "0px",
      border: "none",
      opacity: 1,
      textShadow: "none",
      textShadowX: 0,
      textShadowY: 0,
      textShadowBlur: 0,
      textShadowColor: "rgba(0,0,0,0.5)"
    }
  });

  return {
    elements,
    selectedElement,
    selectedCell, // Añade esto a la exportación
    setSelectedElement,
    setSelectedCell, // Añade esto a la exportación
    addElement,
    updateElement,
    deleteElement,
    duplicateElement
  };
}