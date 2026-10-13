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
       /* browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
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
        const url = ` https://www.ashford.com/catalogsearch/result/index/?p=${encodeURIComponent(
            paginate
        )}&q=${encodeURIComponent(searchQuery)}`;

        await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 });

        // Esperar a que los productos se carguen
        await page.waitForSelector(".product-item", { timeout: 30000 });

        // Extraer los datos de los productos
        const products = await page.evaluate((exchangeRate) => {
            const baseUrl = "https://www.finishline.com";
            return Array.from(document.querySelectorAll(".product-item")).map(
                (product) => {
                    let name =
                        product
                            .querySelector(".product-item-link")
                            ?.innerText?.trim() || "Sin título";

                    let price;

                    let discountText =
                        product
                            .querySelector(".special-price .price")
                            ?.innerText?.trim() || "Sin precio";

                    let discountFloat =
                        parseFloat(
                            discountText
                                .replace(/[^0-9.]/g, "")
                                .replace(/,/g, "")
                        ) || null;
                    let discount = (discountFloat * exchangeRate).toFixed(2);

                    // Extraer porcentaje de descuento
                    const discount_percentText =
                        document.querySelector(".price-box span:last-child")
                            ?.innerText || "0%";
                    const discount_percentNumber = parseInt(
                        discount_percentText.match(/\d+/)?.[0] || "0",
                        10
                    );

                    // Calcular precio original
                    const priceUSD = discount_percentNumber
                        ? discount / (1 - discount_percentNumber / 100)
                        : discount;
                    price = (priceUSD * exchangeRate).toFixed(2);
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
                        product.querySelector(".firstProductImg")?.src || "";
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
