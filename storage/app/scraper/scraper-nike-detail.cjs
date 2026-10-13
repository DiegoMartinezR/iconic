const puppeteer = require("puppeteer");

// Obtener argumentos desde la línea de comandos
const args = process.argv.slice(2);
const urlQuery = args[0] || "";

(async () => {
    let browser;
    try {
        // Configurar Puppeteer
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();

        // Configurar User-Agent
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
        );

        // Traer la URL dinámica
        const url = `${urlQuery}`;
        await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 });

        // Extraer datos del producto
        const productData = await page.evaluate(() => {
            // Función para limpiar texto
            const cleanText = (text) =>
                text ? text.replace(/\s+/g, " ").trim() : null;

            // Extraer nombre del producto
            const name = cleanText(
                document.querySelector("h1.product-text")?.innerText
            );

            // Extraer descripción corta
            const shortDescription = cleanText(
                document.querySelector(
                    '.product-text[data-product-field="shortDescription"]'
                )?.innerText
            );

            // Extraer descripción larga
            const longDescription = cleanText(
                document.querySelector(
                    '.product-text[data-product-field="longDescription"]'
                )?.innerText
            );

            // Extraer precio actual y descuento
            const priceElement = document.querySelector(".price .sales .value");
            const price = priceElement
                ? parseFloat(priceElement.getAttribute("content"))
                : null;

            const originalPriceElement = document.querySelector(
                ".price .strike-through .value"
            );
            const originalPrice = originalPriceElement
                ? parseFloat(originalPriceElement.getAttribute("content"))
                : null;

            const discountElement = document.querySelector(".pd-item-promo");
            const discount = discountElement
                ? cleanText(discountElement.innerText)
                : null;

            // Extraer imágenes
            const images = Array.from(
                document.querySelectorAll(".primary-images img")
            ).map((img) => img.src);

            // Extraer tallas disponibles
            const sizes = Array.from(
                document.querySelectorAll(
                    ".size-attribute:not(.d-none) .size-value"
                )
            ).map((size) => size.innerText.trim());

            // Extraer información de envío y devoluciones
            const shippingInfo = cleanText(
                document.querySelector(".free-shipping .content-asset p")
                    ?.innerText
            );

            // Extraer información de sostenibilidad
            const sustainabilityInfo = cleanText(
                document.querySelector(
                    ".sustainability-message-wrapper .content-asset p"
                )?.innerText
            );

            // Retornar todos los datos en un objeto
            return {
                name,
                shortDescription,
                longDescription,
                price,
                originalPrice,
                discount,
                images,
                sizes,
                shippingInfo,
                sustainabilityInfo,
            };
        });

        // Imprimir los productos en formato JSON
        console.log(JSON.stringify(productData, null, 2));
    } catch (error) {
        // Manejar errores y devolver un JSON con el error
        console.error(
            JSON.stringify({
                status: "error",
                message: "Error en el scraping",
                error: error.message,
            })
        );
    } finally {
        // Cerrar el navegador
        if (browser) {
            await browser.close();
        }
    }
})();
