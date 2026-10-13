  const highlightText = (desc) => {
    const parts = desc.split(/(\*[^*]+\*)/g);
    return parts.map((part, i) =>
      part.startsWith("*") && part.endsWith("*") ? (
        <span key={i} className="font-bold text-primary-700">
          {part.slice(2, -2)}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  export default highlightText;