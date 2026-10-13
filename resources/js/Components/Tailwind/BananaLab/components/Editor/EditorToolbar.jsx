import Button from '../UI/Button';
import { Undo2, Redo2, ImageIcon, Type, Trash2 } from "lucide-react";

export default function EditorToolbar({
  onUndo,
  onRedo,
  onAddImage,
  onAddText,
  onDeleteElement,
  canUndo,
  canRedo,
  hasSelectedElement
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onUndo}
        disabled={!canUndo}
      >
        <Undo2 className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRedo}
        disabled={!canRedo}
      >
        <Redo2 className="h-5 w-5" />
      </Button>
      <div className="h-6 border-l"></div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onAddImage}
      >
        <ImageIcon className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onAddText}
      >
        <Type className="h-5 w-5" />
      </Button>
      <div className="h-6 border-l"></div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDeleteElement}
        disabled={!hasSelectedElement}
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}