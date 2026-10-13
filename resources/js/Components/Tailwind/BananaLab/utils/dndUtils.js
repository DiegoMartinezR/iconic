export const ItemTypes = {
    IMAGE_FILE: 'IMAGE_FILE',
    IMAGE_ELEMENT: 'IMAGE_ELEMENT',
    TEXT_ELEMENT: 'TEXT_ELEMENT'
  };
  
  export const handleImageDrop = (item, addImageElement) => {
    if (item.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          addImageElement({
            content: e.target.result,
            position: { x: 10, y: 10 }
          });
        }
      };
      reader.readAsDataURL(item.files[0]);
    }
  };
  
  export const moveElement = (elementId, newPosition, elements, updateElement) => {
    const element = elements.find(el => el.id === elementId);
    if (element) {
      updateElement(elementId, { position: newPosition });
    }
  };