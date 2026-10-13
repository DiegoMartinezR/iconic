const puppeteer = require("puppeteer");

// Obtener argumentos desde la línea de comandos
const args = process.argv.slice(2);
const searchQuery = args[0] || "mujer";
const offset = parseInt(args[1]) || 0;
const limit = parseInt(args[2]) || 12;
const exchangeRate = parseFloat(args[3]) || 1;
(async () => {
    let browser;
    try {
        // Configurar Puppeteer
        /* browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-web-security",
                "--disable-features=IsolateOrigins,site-per-process",

                 "--disable-gpu",
                "--disable-crashpad",
                "--disable-software-rasterizer",
                "--disable-extensions",
                "--disable-background-networking",
                "--remote-debugging-port=9222",
            ],
        });*/
        browser = await puppeteer.launch({
            executablePath: "/usr/bin/google-chrome-stable",
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",

                "--user-data-dir=/var/www/.chrome", // 🔥 Esto soluciona el problema
            ],
        });

        const page = await browser.newPage();

        // Configurar User-Agent
        /*   await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
        );*/
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
        );

        await page.mouse.move(100, 100);
        await page.mouse.move(200, 200);
        /* await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );*/
        /* await page.setExtraHTTPHeaders({
            "Accept-Language": "en-US,en;q=0.9",
            Referer: "https://www.google.com/",
        });*/

        // Construir la URL dinámica
        const url = `https://invictastores.com/search/${encodeURIComponent(
            searchQuery
        )}`;
        // Capturar logs de la consola del navegador
        /*    page.on("console", async (msg) => {
            const args = await Promise.all(
                msg.args().map((arg) => arg.jsonValue())
            );
            console.log("🖥 LOG DESDE EL NAVEGADOR:", msg.text(), ...args);
        });*/
        // Captura una captura de pantalla para depuración
        // await page.screenshot({ path: "debug.png" });
        await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
        const html = await page.content();
        console.log(html);
        // Esperar a que los productos se carguen
        await page.waitForSelector(".ProductCard", { timeout: 60000 });
        // Asegurar que todos los precios con descuento se carguen antes de continuar

        // Extraer los datos de los productos
        const products = await page.evaluate((exchangeRate) => {
            const baseUrl = "https://invictastores.com";
            return Array.from(document.querySelectorAll(".ProductCard")).map(
                (product, index) => {
                    console.log(`📌 Producto #${index + 1}`);
                    let name =
                        product
                            .querySelector(".ProductCard-Name")
                            ?.innerText?.trim() || "Sin título";

                    let priceText =
                        product
                            .querySelector(
                                ".ProductCard-Content .ProductPrice .ProductPrice-HighPrice"
                            )
                            ?.innerText?.trim() || "Sin precio";
                    let priceFloat =
                        parseFloat(priceText.match(/\d+(\.\d+)?/)?.[0]) || null;
                    let price = (priceFloat * exchangeRate).toFixed(2);

                    let discountText =
                        product
                            .querySelector(".ProductPrice-DiscountedPrice")
                            ?.innerText?.trim() || "Sin precio";

                    let discountFloat =
                        parseFloat(discountText.match(/\d+(\.\d+)?/)?.[0]) ||
                        null;
                    let discount = (discountFloat * exchangeRate).toFixed(2);

                    let discount_percent = null;

                    let final_price = 0;

                    if (price === null) {
                        price = discount;
                    }
                    if (parseFloat(discount) < parseFloat(price)) {
                        final_price = discount;
                        discount_percent = Math.round(
                            100 - (parseFloat(discount) * 100) / price
                        );
                    } else {
                        final_price = price;
                        discount = null;
                    }

                    let url =
                        product.querySelector(".ProductCard-Content a")?.href ||
                        "#";

                    let relativeSrc =
                        product.querySelector(
                            ".ProductCard-Picture .Image-Image"
                        )?.src || "Sin imagen";
                    // Construir la URL absoluta de la imagen
                    let image = relativeSrc.startsWith("http")
                        ? relativeSrc
                        : baseUrl + relativeSrc;

                    return {
                        name,
                        price,
                        discount,
                        final_price,
                        discount_percent,
                        image,
                        url,
                    };
                }
            );
        }, exchangeRate);

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
