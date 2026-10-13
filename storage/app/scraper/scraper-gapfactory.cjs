const puppeteer = require("puppeteer");

// Obtener argumentos desde la línea de comandos
const args = process.argv.slice(2);
const searchQuery = args[0] || "mujer";

(async () => {
    let browser;
    try {
        // Configurar Puppeteer
        /* browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            //executablePath: "/usr/bin/chromium-browser",
        });*/
        browser = await puppeteer.launch({
            executablePath: "/usr/bin/google-chrome-stable",
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--disable-crashpad",
                "--disable-software-rasterizer",
                "--disable-extensions",
                "--disable-background-networking",
                "--remote-debugging-port=9222",
                "--user-data-dir=/var/www/.chrome", // 🔥 Esto soluciona el problema
            ],
        });
        const page = await browser.newPage();

        // Configurar User-Agent
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
        );

        // Construir la URL dinámica
        const url = `https://www.gapfactory.com/browse/search.do?searchText=${encodeURIComponent(
            searchQuery
        )}`;
        await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

        // Esperar a que los productos se carguen
        await page.waitForSelector(".product-card", { timeout: 10000 });

        // Extraer los datos de los productos
        const products = await page.evaluate(() => {
            const baseUrl = "https://www.gapfactory.com";
            return Array.from(document.querySelectorAll(".product-card")).map(
                (product) => {
                    let name =
                        product
                            .querySelector(".sitewide-0")
                            ?.innerText?.trim() || "Sin título";
                    let price =
                        product
                            .querySelector(".product-price__highlight")
                            ?.innerText?.trim() || "Sin precio";

                    let relativeSrc =
                        product.querySelector(".cat_product-image a img")
                            ?.src || "Sin imagen";
                    // Construir la URL absoluta de la imagen
                    let image = relativeSrc.startsWith("http")
                        ? relativeSrc
                        : baseUrl + relativeSrc;

                    return { name, price, image };
                }
            );
        });

        // Imprimir los productos en formato JSON
        console.log(JSON.stringify(products, null, 2));
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
