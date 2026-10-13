const puppeteer = require("puppeteer");

// Obtener argumentos desde la línea de comandos
const args = process.argv.slice(2);
const searchQuery = args[0] || "mujer";
const offset = parseInt(args[1]) || 0;
const limit = parseInt(args[2]) || 12;

(async () => {
    let browser;
    try {
        /*
        browser = await puppeteer.launch({
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
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
        );

        const url = `https://www.nike.com.pe/search?q=${encodeURIComponent(
            searchQuery
        )}&start=${encodeURIComponent(offset)}&sz=${encodeURIComponent(limit)}`;

        await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 });

        // Esperar a que los productos se carguen
        await page.waitForSelector(".product", { timeout: 10000 });

        // Extraer los datos de los productos con paginación
        const products = await page.evaluate(() => {
            const baseUrl = "https://www.nike.com.pe";
            return Array.from(document.querySelectorAll(".product")).map(
                (product) => {
                    let name =
                        product
                            .querySelector(".product-title")
                            ?.innerText?.trim() || "";
                    let summary =
                        product
                            .querySelector(".product-subtitle")
                            ?.innerText?.trim() || "";
                    // Extraer precio sin denominación

                    let priceText =
                        product
                            .querySelector(".price del .value")
                            ?.innerText?.trim() || "Sin precio";
                    let price =
                        parseFloat(priceText.match(/\d+(\.\d+)?/)?.[0]) || null;

                    let discountPriceElement = product.querySelector(
                        ".price .sales .value"
                    );

                    let discount = discountPriceElement
                        ? parseFloat(
                              discountPriceElement.getAttribute("content")
                          ) || null
                        : null;

                    let discountElement = product.querySelector(".discount");
                    let discountText = discountElement?.innerText?.trim() || ""; // Usa encadenamiento opcional
                    let discountMatch = discountText.match(/\d+/);
                    let discount_percent = discountMatch
                        ? parseFloat(discountMatch[0], 10)
                        : null;
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
                        product.querySelector(".tile-image")?.src || "";
                    // Construir la URL absoluta de la imagen
                    let image = relativeSrc.startsWith("http")
                        ? relativeSrc
                        : baseUrl + relativeSrc;
                    let url =
                        product.querySelector(".price-wrapper a")?.href || "";

                    return {
                        name,
                        summary,
                        price,
                        discount,
                        final_price,
                        discount_percent,
                        image,
                        url,
                    };
                }
            );
        });

        // Imprimir los productos en formato JSON
        console.log(JSON.stringify(products, null, 2));
    } catch (error) {
        console.error(
            JSON.stringify({
                status: "error",
                message: "Error en el scraping",
                error: error.message,
            })
        );
    } finally {
        if (browser) {
            await browser.close();
        }
    }
})();
