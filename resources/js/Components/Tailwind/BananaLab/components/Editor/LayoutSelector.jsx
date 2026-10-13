import { layouts } from '../../constants/layouts';
import Button from '../UI/Button';

export default function LayoutSelector({ selectedLayout, onSelect }) {
  return (
    <div>
      <h3 className="font-medium mb-2">Layouts</h3>
      <div className="grid grid-cols-2 gap-3">
        {layouts.map((layout) => (
          <div
            key={layout.id}
            className={`border rounded-md p-1 cursor-pointer hover:border-purple-500 ${
              selectedLayout === layout.id
                ? "border-purple-500 ring-1 ring-purple-200"
                : ""
            }`}
            onClick={() => onSelect(layout.id)}
          >
            <div
              className={`grid ${layout.template} gap-1 h-20`}
            >
              {Array.from({ length: layout.cells }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-sm flex items-center justify-center"
                >
                  <span className="text-xs text-gray-400">{i + 1}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-center mt-1 truncate">
              {layout.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}