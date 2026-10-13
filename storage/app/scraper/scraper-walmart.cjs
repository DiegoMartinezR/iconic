const puppeteer = require("puppeteer");

// Obtener argumentos desde la línea de comandos
const args = process.argv.slice(2);
const searchQuery = args[0] || "mujer";
const offset = parseInt(args[1]) || 0;
const limit = parseInt(args[2]) || 12;
const exchangeRate = parseFloat(args[3]) || 1;
const paginate = parseInt(args[4]) || 1;
(async () => {
    let browser;
    try {
        // Configurar Puppeteer
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        /*  browser = await puppeteer.launch({
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
        });*/
        const page = await browser.newPage();

        // Configurar User-Agent
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
        );

        // Construir la URL dinámica
        const url = `https://www.walmart.com/search?q=${encodeURIComponent(
            searchQuery
        )}&page=${encodeURIComponent(paginate)}`;
        await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 });

        // Esperar a que los productos se carguen
        await page.waitForSelector(
            ".mb0 .ph0-xl .pt0-xl .bb .b--near-white .w-25 .pb3-m .ph1",
            { timeout: 30000 }
        );

        // Extraer los datos de los productos
        const products = await page.evaluate((exchangeRate) => {
            const baseUrl = "https://www.walmart.com";
            return Array.from(
                document.querySelectorAll(
                    ".mb0 .ph0-xl .pt0-xl .bb .b--near-white .w-25 .pb3-m .ph1"
                )
            ).map((product) => {
                let name =
                    product
                        .querySelector(".ProductCard-Name")
                        ?.innerText?.trim() || "Sin título";

                let priceText =
                    product
                        .querySelector(".ProductCardPrice-HighPrice")
                        ?.innerText?.trim() || "Sin precio";
                let priceFloat =
                    parseFloat(
                        priceText.replace(/[^0-9.]/g, "").replace(/,/g, "")
                    ) || null;

                let price = (priceFloat * exchangeRate).toFixed(2);

                let discountText =
                    product
                        .querySelector(".ProductPrice-PriceValue")
                        ?.innerText?.trim() || "Sin precio";

                let discountFloat =
                    parseFloat(
                        discountText.replace(/[^0-9.]/g, "").replace(/,/g, "")
                    ) || null;
                let discount = (discountFloat * exchangeRate).toFixed(2);

                let discount_percent = null;

                let final_price = 0;

                if (price === null) {
                    price = discount;
                }
                if (discount < price) {
                    final_price = discount;
                } else {
                    final_price = price;
                    discount = null;
                }

                let relativeSrc =
                    product.querySelector(".Image-Image")?.src || "";
                // Construir la URL absoluta de la imagen
                let image = relativeSrc.startsWith("http")
                    ? relativeSrc
                    : baseUrl + relativeSrc;
                // Obtener la URL del producto
                let urlElement = product.querySelector("a");
                let url = null;

                return {
                    name,

                    price,
                    discount,
                    final_price,
                    discount_percent,
                    image,
                    url,
                };
            });
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
