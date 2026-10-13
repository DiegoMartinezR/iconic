# 📘 GUÍA TÉCNICA DEFINITIVA — CONFIGURADOR 3D PARA HAMATEX
### ¿Cómo funciona la arquitectura 3D + SVG y cómo cambia de color en tiempo real?

---

## 💡 1. LA METÁFORA PARA ENTENDERLO EN 30 SEGUNDOS

Imagina una tienda física de ropa:
1. **El Modelo 3D (`.glb`)** es el **Maniquí blanco de plástico**. Es uno solo para toda la tienda y tiene la forma del cuerpo, las mangas y el cuello con botones.
2. **El Archivo SVG** es la **Tela con el estampado**. Es el diseño plano que le pones encima al maniquí (ejemplo: las franjas rojas y blancas del Polo AirStyle).
3. **El Selector de Color** es un **plumón mágico**: cuando el cliente toca el color azul, JavaScript repinta la franja en la tela y el maniquí refleja el nuevo color al instante.

---

## 🗄️ 2. ¿QUÉ CAMPOS SE GUARDAN EN `Items.jsx` Y EN LA BASE DE DATOS?

En tu tabla `items` de Laravel solo agregamos **3 campos clave**:

| Campo en BD | Tipo | ¿Qué contiene? | Ejemplo para "Polo AirStyle" |
|---|---|---|---|
| `model_3d` | `string` (archivo) | La ruta al modelo 3D del polo (el maniquí base) | `"/models/polo_camisero_base.glb"` |
| `design_svg` | `text` o `file` | El archivo SVG con el dibujo de las franjas | `"/designs/airstyle_franjas.svg"` |
| `customization_zones` | `json` | La lista de partes que el cliente puede pintar | Ver JSON abajo 👇 |

### ¿Cómo se ve el campo `customization_zones` en la base de datos?
Es un JSON simple donde le dices al sistema cómo se llaman las capas del SVG:

```json
[
  { "id": "pecho",   "label": "Pecho Superior", "color_default": "#FFFFFF" },
  { "id": "franja",  "label": "Franja Media",    "color_default": "#DC2626" },
  { "id": "cuerpo",  "label": "Cuerpo Inferior", "color_default": "#1E3A8A" },
  { "id": "cuello",  "label": "Cuello y Rib",    "color_default": "#1E3A8A" }
]
```

---

## 🎨 3. ¿CÓMO ES EL ARCHIVO SVG POR DENTRO?

Un SVG no es una foto, **es código de texto con formas geométricas**. 

Para el Polo AirStyle, el diseñador dibuja en Illustrator y lo guarda así:

```xml
<svg viewBox="0 0 1024 1024" id="plantilla-airstyle">
  <!-- Zona 1: El pecho -->
  <rect id="pecho" width="1024" height="300" fill="#FFFFFF" />

  <!-- Zona 2: La franja roja al medio -->
  <rect id="franja" y="300" width="1024" height="200" fill="#DC2626" />

  <!-- Zona 3: El cuerpo azul abajo -->
  <rect id="cuerpo" y="500" width="1024" height="524" fill="#1E3A8A" />
</svg>
```

Cada parte tiene un `id`: `"pecho"`, `"franja"`, `"cuerpo"`.

---

## ⚙️ 4. LA PREGUNTA DEL MILLÓN: ¿CÓMO HACE PARA CAMBIAR DE COLOR EN LA WEB?

Aquí está el "truco" de programación que usan Owayo, Nike y las grandes tiendas. 
Es pura lógica de desarrollo web en **4 pasos automáticos**:

```
[ CLIENTE ELIGE COLOR AZUL ]
             ↓
1. JavaScript busca el elemento en el SVG:
   document.getElementById('franja').setAttribute('fill', '#0000FF');
             ↓
2. Ese SVG modificado se dibuja en un <canvas> invisible en memoria del navegador
             ↓
3. Le decimos a Three.js:
   textura.needsUpdate = true;
             ↓
[ EL POLO 3D EN PANTALLA CAMBIA DE COLOR EN 1 MILISEGUNDO ]
```

### El código real en React (¡Son menos de 20 líneas!):

```jsx
import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Polo3D({ colores }) {
  // 1. Cargamos el modelo 3D del polo (el maniquí base)
  const { scene } = useGLTF('/models/polo_camisero_base.glb');
  const texturaCanvasRef = useRef();

  useEffect(() => {
    // 2. Creamos un canvas con el SVG pintado con los colores actuales
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
        <rect width="1024" height="300" fill="${colores.pecho}" />
        <rect y="300" width="1024" height="200" fill="${colores.franja}" />
        <rect y="500" width="1024" height="524" fill="${colores.cuerpo}" />
      </svg>
    `;

    // 3. Convertimos el SVG a una imagen y la proyectamos sobre el 3D
    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
    img.onload = () => {
      const texture = new THREE.CanvasTexture(img);
      texture.flipY = false;

      // Le aplicamos la textura al polo
      scene.traverse((child) => {
        if (child.isMesh && child.name === 'Cuerpo_Polo') {
          child.material.map = texture;
          child.material.needsUpdate = true; // ← ¡AQUÍ OCURRE EL CAMBIO DE COLOR!
        }
      });
    };
  }, [colores]); // Cada vez que el cliente cambia un color, esto se ejecuta

  return <primitive object={scene} />;
}
```

---

## 🔄 5. EL FLUJO COMPLETO EN LA TIENDA

```
1. El cliente entra a: hamatex.pe/producto/polo-airstyle
2. Ve la foto comercial del modelo (la foto real con modelo).
3. Presiona el botón: [ 🎨 Personalizar Colores y Logo ]
4. Se abre el Visor 3D:
   - Descarga el modelo: polo_camisero_base.glb (pesa 2 MB, carga en 0.5s).
   - Lee el SVG de franjas y lo pinta con los colores iniciales.
   - ¡El cliente ve el Polo AirStyle en 3D listo para girar!
5. En el panel lateral el cliente ve los botones:
   - Pecho: [ ⚪ Blanco ]
   - Franja: [ 🔴 Rojo ]   <-- El cliente hace clic y elige AMARILLO
   - Cuerpo: [ 🔵 Azul ]
6. En 10 milisegundos la franja roja pasa a ser amarilla en el polo 3D.
7. El cliente sube su logo PNG -> Se pega en el pecho en 3D.
8. Hace clic en: [ Solicitar Cotización por WhatsApp ].
```

---

## 📌 6. RESUMEN CLAVE PARA TU CABEZA DE DESARROLLADOR

1. **`model_3d`**: Es el archivo `.glb` (el polo camisero con botones y cuello). Solo necesitas **UNO** para todos los polos camiseros.
2. **`design_svg`**: Es el dibujo de las franjas en vector. Cada modelo de tu catálogo (AirStyle, Striker, Bicolor) tiene su propio SVG.
3. **¿Cómo cambia de color?**: Con un simple `fill="#COLOR"` en el SVG que Three.js convierte en textura sobre el modelo 3D.
4. **Cero Blender para los 70 modelos**: Creas los 70 modelos en Illustrator como SVG planos. Nunca vuelves a tocar un programa 3D para sacar un nuevo diseño.
