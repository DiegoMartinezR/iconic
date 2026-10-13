import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

export const exportPageToImage = async (elementId, fileName = 'diseño-pagina') => {
  const pageElement = document.getElementById(elementId);
  if (!pageElement) return;

  const canvas = document.createElement("canvas");
  const width = pageElement.offsetWidth;
  const height = pageElement.offsetHeight;
  canvas.width = width * 2;
  canvas.height = height * 2;

  const context = canvas.getContext("2d");
  context.scale(2, 2);
  context.fillStyle = "white";
  context.fillRect(0, 0, width, height);

  try {
    const canvasResult = await html2canvas(pageElement, {
      scale: 2,
      backgroundColor: null,
      canvas,
      logging: false,
      useCORS: true
    });

    canvasResult.toBlob((blob) => {
      saveAs(blob, `${fileName}.png`);
    });
  } catch (error) {
    console.error("Error al exportar la página:", error);
  }
};

export const exportProjectToJSON = (projectData) => {
  const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
  saveAs(blob, 'proyecto-editor.json');
};

export const importProjectFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error("El archivo no es un proyecto válido"));
      }
    };
    reader.onerror = () => reject(new Error("Error al leer el archivo"));
    reader.readAsText(file);
  });
};