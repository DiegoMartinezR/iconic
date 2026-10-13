import Button from '../UI/Button';
import { ImageIcon, Type } from "lucide-react";

export default function ElementAdder({ onAddImage, onAddText }) {
  const handleAddImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        onAddImage(e.target.files[0]);
      }
    };
    input.click();
  };

  return (
    <div>
      <h3 className="font-medium mb-2">Añadir</h3>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="sm"
          icon={<ImageIcon className="h-4 w-4" />}
          onClick={handleAddImage}
        >
          Imagen
        </Button>
        <Button
          variant="outline"
          size="sm"
          icon={<Type className="h-4 w-4" />}
          onClick={onAddText}
        >
          Texto
        </Button>
      </div>
    </div>
  );
}