export default function PagePreview({ page, layout }) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg page-preview">
        <div className={`grid ${layout.template} gap-6 aspect-[4/3]`}>
          {page.cells.map((cell) => (
            <div
              key={cell.id}
              className="relative bg-gray-50 rounded-lg overflow-hidden"
            >
              {cell.elements.map((element) =>
                element.type === "image" ? (
                  <ImagePreview key={element.id} element={element} />
                ) : (
                  <TextPreview key={element.id} element={element} />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  function ImagePreview({ element }) {
    const mask = imageMasks.find((m) => m.id === element.mask) || imageMasks[0];
    
    return (
      <div
        className={`absolute ${mask.class}`}
        style={{
          left: `${element.position.x}px`,
          top: `${element.position.y}px`,
          width: "100%",
          height: "100%",
        }}
      >
        <img
          src={element.content}
          alt=""
          className="w-full h-full object-cover"
          style={{
            filter: `
              brightness(${(element.filters?.brightness || 100) / 100})
              contrast(${(element.filters?.contrast || 100) / 100})
              saturate(${(element.filters?.saturation || 100) / 100})
              sepia(${(element.filters?.tint || 0) / 100})
              hue-rotate(${(element.filters?.hue || 0) * 3.6}deg)
              blur(${element.filters?.blur || 0}px)
            `,
            transform: `scale(${element.filters?.scale || 1}) rotate(${
              element.filters?.rotate || 0
            }deg) ${element.filters?.flipHorizontal ? "scaleX(-1)" : ""} ${
              element.filters?.flipVertical ? "scaleY(-1)" : ""
            }`,
            mixBlendMode: element.filters?.blendMode || "normal",
            opacity: (element.filters?.opacity || 100) / 100
          }}
        />
      </div>
    );
  }
  
  function TextPreview({ element }) {
    return (
      <div
        className="absolute"
        style={{
          left: `${element.position.x}px`,
          top: `${element.position.y}px`,
          fontFamily: element.style?.fontFamily,
          fontSize: element.style?.fontSize,
          fontWeight: element.style?.fontWeight,
          fontStyle: element.style?.fontStyle,
          textDecoration: element.style?.textDecoration,
          color: element.style?.color,
          textAlign: element.style?.textAlign,
          backgroundColor: element.style?.backgroundColor || "transparent",
          padding: element.style?.padding || "8px",
          borderRadius: element.style?.borderRadius || "0px",
          border: element.style?.border || "none",
          opacity: element.style?.opacity || 1
        }}
      >
        {element.content}
      </div>
    );
  }