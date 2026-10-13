export const layouts = [
    {
      id: "layout-1",
      name: "Cuatro fotos",
      template: "grid-cols-2 grid-rows-2 gap-4",
      cells: 4,
      maskCategories: [
        { 
          name: "Básicas", 
          masks: ["none", "circle", "rounded", "square", "rounded-sm", "rounded-lg", "rounded-full", "rounded-rect"] 
        },
        { 
          name: "Formas", 
          masks: ["heart", "star", "hexagon", "triangle", "diamond", "badge", "speech", "burst"] 
        },
        { 
          name: "Fotográficos", 
          masks: ["polaroid", "vintage", "frame", "wave", "diagonal", "bevel", "poster", "inner-frame"] 
        },
        { 
          name: "Creativas", 
          masks: ["leaf", "cloud", "flower", "ornate", "blob1", "blob2", "blob3"] 
        }
      ]
    },
    // ... otros layouts
  ];