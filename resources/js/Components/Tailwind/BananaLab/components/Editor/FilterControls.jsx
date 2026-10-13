import { useState } from 'react';
import TabPanel from '../UI/TabPanel';
import Slider from '../UI/Slider';
import Button from '../UI/Button';
import { 
  FlipHorizontal, 
  FlipVertical, 
  RotateCw,
  Layers,
  Blend,
  Sliders,
  Palette
} from "lucide-react";
import MaskSelector from '../Elements/MaskSelector';
import { filterPresets } from '../../constants/filters';
import { blendModes } from '../../constants/blendModes';

export default function FilterControls({
  element,
  filterTab,
  onFilterTabChange,
  onFilterChange,
  availableMasks = []
}) {
  const applyFilterPreset = (preset) => {
    onFilterChange({ filters: { ...element.filters, ...preset } });
  };

  return (
    <div className="space-y-6">
      <TabPanel
        tabs={[
          { id: 'basic', label: 'Básicos', icon: <Sliders size={16} /> },
          { id: 'transform', label: 'Transformar', icon: <RotateCw size={16} /> },
          { id: 'advanced', label: 'Avanzados', icon: <Layers size={16} /> }
        ]}
        activeTab={filterTab}
        onChange={onFilterTabChange}
      />

      {filterTab === 'basic' && (
        <>
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Filtros predefinidos
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {filterPresets.map(preset => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => applyFilterPreset(preset.filters)}
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Ajustes básicos</h3>
            <Slider
              label="Brillo"
              value={[element.filters?.brightness || 100]}
              min={0}
              max={200}
              onValueChange={(value) => 
                onFilterChange({ filters: { ...element.filters, brightness: value[0] } })
              }
            />
            <Slider
              label="Contraste"
              value={[element.filters?.contrast || 100]}
              min={0}
              max={200}
              onValueChange={(value) => 
                onFilterChange({ filters: { ...element.filters, contrast: value[0] } })
              }
            />
            <Slider
              label="Saturación"
              value={[element.filters?.saturation || 100]}
              min={0}
              max={200}
              onValueChange={(value) => 
                onFilterChange({ filters: { ...element.filters, saturation: value[0] } })
              }
            />
            <Slider
              label="Tono"
              value={[element.filters?.hue || 0]}
              min={0}
              max={360}
              unit="°"
              onValueChange={(value) => 
                onFilterChange({ filters: { ...element.filters, hue: value[0] } })
              }
            />
            <Slider
              label="Sepia"
              value={[element.filters?.tint || 0]}
              min={0}
              max={100}
              onValueChange={(value) => 
                onFilterChange({ filters: { ...element.filters, tint: value[0] } })
              }
            />
            <Slider
              label="Desenfoque"
              value={[element.filters?.blur || 0]}
              min={0}
              max={20}
              unit="px"
              onValueChange={(value) => 
                onFilterChange({ filters: { ...element.filters, blur: value[0] } })
              }
            />
          </div>
        </>
      )}

      {filterTab === 'transform' && (
        <div className="space-y-4">
          <h3 className="font-medium">Transformación</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={element.filters?.flipHorizontal ? "secondary" : "outline"}
              size="sm"
              icon={<FlipHorizontal className="h-4 w-4" />}
              onClick={() => onFilterChange({ 
                filters: { 
                  ...element.filters, 
                  flipHorizontal: !element.filters?.flipHorizontal 
                } 
              })}
            >
              Voltear H
            </Button>
            <Button
              variant={element.filters?.flipVertical ? "secondary" : "outline"}
              size="sm"
              icon={<FlipVertical className="h-4 w-4" />}
              onClick={() => onFilterChange({ 
                filters: { 
                  ...element.filters, 
                  flipVertical: !element.filters?.flipVertical 
                } 
              })}
            >
              Voltear V
            </Button>
          </div>
          <Slider
            label="Rotación"
            value={[element.filters?.rotate || 0]}
            min={0}
            max={360}
            unit="°"
            onValueChange={(value) => 
              onFilterChange({ filters: { ...element.filters, rotate: value[0] } })
            }
          />
          <Slider
            label="Escala"
            value={[(element.filters?.scale || 1) * 100]}
            min={10}
            max={200}
            onValueChange={(value) => 
              onFilterChange({ filters: { ...element.filters, scale: value[0] / 100 } })
            }
          />
        </div>
      )}

      {filterTab === 'advanced' && (
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Blend className="h-4 w-4" />
            Ajustes avanzados
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modo de mezcla
            </label>
            <select
              className="w-full border rounded-md p-2 text-sm"
              value={element.filters?.blendMode || "normal"}
              onChange={(e) => onFilterChange({ 
                filters: { ...element.filters, blendMode: e.target.value }
              })}
            >
              {blendModes.map(mode => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>
          
          <Slider
            label="Opacidad"
            value={[element.filters?.opacity || 100]}
            min={0}
            max={100}
            onValueChange={(value) => onFilterChange({ 
              filters: { ...element.filters, opacity: value[0] }
            })}
          />
        </div>
      )}

      {element.type === 'image' && (
        <MaskSelector
          selectedMask={element.mask || "none"}
          onSelect={(mask) => onFilterChange({ mask })}
          availableMasks={availableMasks}
        />
      )}
    </div>
  );
}