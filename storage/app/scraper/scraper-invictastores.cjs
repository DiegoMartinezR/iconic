const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AnonymizeUAPLugin = require("puppeteer-extra-plugin-anonymize-ua");

const os = require("os");
const path = require("path");
// Obtener argumentos desde la línea de comandos
const args = process.argv.slice(2);
const searchQuery = args[0] || "mujer";
const offset = parseInt(args[1]) || 0;
const limit = parseInt(args[2]) || 12;
const exchangeRate = parseFloat(args[3]) || 1;

puppeteer.use(StealthPlugin());
puppeteer.use(AnonymizeUAPLugin());
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

                
            ],
        });*/
        // Generar un directorio temporal único para los datos del usuario
        const userDataDir = path.join(
            os.tmpdir(),
            `puppeteer-user-data-${Date.now()}`
        );

        // Configurar Puppeteer
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
                `--user-data-dir=${userDataDir}`, // Directorio temporal único
            ],
        });

        const page = await browser.newPage();

        await page.setCookie(
            {
                domain: ".invictastores.com",
                expirationDate: 1741040167,
                hostOnly: false,
                httpOnly: false,
                name: "_dc_gtm_UA-60321344-1",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                storeId: "0",
                value: "1",
                id: 1,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1741040165,
                hostOnly: false,
                httpOnly: false,
                name: "_dc_gtm_UA-60321344-3",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                storeId: "0",
                value: "1",
                id: 2,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1775600108,
                hostOnly: false,
                httpOnly: false,
                name: "_dcid",
                path: "/",
                sameSite: "lax",
                secure: true,
                session: false,
                storeId: "0",
                value: "dcid.1.1740068750073.470338420",
                id: 3,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1775600110,
                hostOnly: false,
                httpOnly: false,
                name: "_ga",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                storeId: "0",
                value: "GA1.2.1796866315.1740068749",
                id: 4,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1775600108,
                hostOnly: false,
                httpOnly: false,
                name: "_ga_0000",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                storeId: "0",
                value: "GS1.1.1741038609.11.1.1741040108.0.0.442864793",
                id: 5,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1775599885,
                hostOnly: false,
                httpOnly: false,
                name: "_ga_TWT2GF2GM1",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                storeId: "0",
                value: "GS1.1.1741038609.11.1.1741039885.0.0.0",
                id: 6,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1775600110,
                hostOnly: false,
                httpOnly: false,
                name: "_ga_XDDX13L6V6",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                storeId: "0",
                value: "GS1.1.1741038609.11.1.1741040110.58.0.0",
                id: 7,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1747844934,
                hostOnly: false,
                httpOnly: false,
                name: "_gcl_au",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                storeId: "0",
                value: "1.1.124248287.1740068934",
                id: 8,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1741126510,
                hostOnly: false,
                httpOnly: false,
                name: "_gid",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                storeId: "0",
                value: "GA1.2.1111188760.1740925680",
                id: 9,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1772576107,
                hostOnly: false,
                httpOnly: false,
                name: "_hjDonePolls",
                path: "/",
                sameSite: "no_restriction",
                secure: true,
                session: false,
                storeId: "0",
                value: "692789",
                id: 10,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1741041909,
                hostOnly: false,
                httpOnly: false,
                name: "_hjSession_643343",
                path: "/",
                sameSite: "no_restriction",
                secure: true,
                session: false,
                storeId: "0",
                value: "eyJpZCI6ImRlOTA4MjZmLTk3OWYtNGQxMS1hMDg0LTVhOTkzMThmZmUzNCIsImMiOjE3NDEwMzg2MTAzNTksInMiOjEsInIiOjEsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MX0=",
                id: 11,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1772575885,
                hostOnly: false,
                httpOnly: false,
                name: "_hjSessionUser_643343",
                path: "/",
                sameSite: "no_restriction",
                secure: true,
                session: false,
                storeId: "0",
                value: "eyJpZCI6ImFkNmMxNDgwLTJlM2ItNWE4OC04ZjQxLWVkYWVkMjkxNzhkZSIsImNyZWF0ZWQiOjE3NDAwNjg5MzQ3MzksImV4aXN0aW5nIjp0cnVlfQ==",
                id: 12,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1772575889,
                hostOnly: false,
                httpOnly: false,
                name: "_ju_dc",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                storeId: "0",
                value: "c8ab369f-efa7-11ef-adb1-47709b2a94f7",
                id: 13,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1741126284,
                hostOnly: false,
                httpOnly: false,
                name: "_ju_dm",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                storeId: "0",
                value: "cookie",
                id: 14,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1743631884,
                hostOnly: false,
                httpOnly: false,
                name: "_ju_dn",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                storeId: "0",
                value: "1",
                id: 15,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1741041686,
                hostOnly: false,
                httpOnly: false,
                name: "_ju_pn",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                storeId: "0",
                value: "3",
                id: 16,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1772575886,
                hostOnly: false,
                httpOnly: false,
                name: "_pin_unauth",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                storeId: "0",
                value: "dWlkPVpqVXlNR1ZpTWpndFltSXdOaTAwWTJFd0xXRmlOekV0TnpSaE4yUTJOVFEzWldNNQ",
                id: 17,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1774735886,
                hostOnly: false,
                httpOnly: false,
                name: "_tt_enable_cookie",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                storeId: "0",
                value: "1",
                id: 18,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1774735886,
                hostOnly: false,
                httpOnly: false,
                name: "_ttp",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                storeId: "0",
                value: "t3Snne2i7UsbLBgUQI44KAYZz3t.tt.1",
                id: 19,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1741126508,
                hostOnly: false,
                httpOnly: false,
                name: "_uetsid",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                storeId: "0",
                value: "8b7005e0f77211ef9a448f52e85103b9",
                id: 20,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1774736108,
                hostOnly: false,
                httpOnly: false,
                name: "_uetvid",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                storeId: "0",
                value: "c6dd3e90efa711efacdc5f36488a504d",
                id: 21,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1775168108,
                hostOnly: false,
                httpOnly: false,
                name: "cjConsent",
                path: "/",
                sameSite: "unspecified",
                secure: true,
                session: false,
                storeId: "0",
                value: "MHxOfDB8Tnww",
                id: 22,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1775168108,
                hostOnly: false,
                httpOnly: false,
                name: "cjUser",
                path: "/",
                sameSite: "unspecified",
                secure: true,
                session: false,
                storeId: "0",
                value: "6acfade8-a253-4b94-bc6d-5d8aa8c8e9a7",
                id: 23,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1756807886,
                hostOnly: false,
                httpOnly: false,
                name: "crisp-client%2Fsession%2F4735b150-22e1-4670-82df-2a1ae4bbb2cf",
                path: "/",
                sameSite: "lax",
                secure: false,
                session: false,
                storeId: "0",
                value: "session_5c049dd9-444e-40a6-b2ad-f3173f0f1cb1",
                id: 24,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1775203886,
                hostOnly: false,
                httpOnly: false,
                name: "cto_bundle",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                storeId: "0",
                value: "iavoiV8wJTJGenVHR3BqZnVMRmc1YWhXd2ZzNTdFWFJOUXM5YnFkNVl4ZElDcHFyb0JUQVFKcDc4UnNTcTBLeWhndk51dnZuN0V0YlpPdjBsUndrUUM5RldhSm9lNTh1VG0lMkJCMFhOSE9SMUJuOFEweXhvTnJET040TXB5d21yaG1LSjVmY1RXcFlnMG5lQUhWRkE2cVdkWG91V0ttUGRBaTdYbDBOZWV6UXRjeVhkYUMwcWZWeiUyRnN5ZDBCd05GTG94TDRsRFdIM3NSam9MeTBDUXRmWXpwVDhqb3NoMmtEcDYwVlB2ZGR2TG0lMkZZWXJoY25wWm8lMkIwUFkxT21SSWtRczJCcVRxUUc1eVNrdm1FZU1VNUlpelI2eXk2dXclM0QlM0Q",
                id: 25,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1747844931,
                hostOnly: false,
                httpOnly: false,
                name: "FPAU",
                path: "/",
                sameSite: "unspecified",
                secure: true,
                session: false,
                storeId: "0",
                value: "1.1.124248287.1740068934",
                id: 26,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1775600113,
                hostOnly: false,
                httpOnly: true,
                name: "FPID",
                path: "/",
                sameSite: "unspecified",
                secure: true,
                session: false,
                storeId: "0",
                value: "FPID2.2.K%2BoSMhFl1E5glf5aOd1sIQ41p9iySB0MjBoR03AMiYA%3D.1740068749",
                id: 27,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1741080088,
                hostOnly: false,
                httpOnly: false,
                name: "FPLC",
                path: "/",
                sameSite: "unspecified",
                secure: true,
                session: false,
                storeId: "0",
                value: "Vv1J1kjnCZ%2Fcpnb8%2FMeYUavV916XHKNt7YK%2F7fzGNj0fEojfJ7j8ZUn%2Fbz5BytHWc1qvXTT2dWyAfaLyHjYy9kGxzUkhryOqdwiCvMOLw0TWlP%2F7dbcWuwgOPqO%2Fig%3D%3D",
                id: 28,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1775598608,
                hostOnly: false,
                httpOnly: false,
                name: "GlobalE_CT_Data",
                path: "/",
                sameSite: "lax",
                secure: false,
                session: false,
                storeId: "0",
                value: "%7B%22CUID%22%3A%7B%22id%22%3A%22720689327.661041229.30000271%22%2C%22expirationDate%22%3A%22Mon%2C%2003%20Mar%202025%2022%3A20%3A08%20GMT%22%7D%2C%22CHKCUID%22%3Anull%2C%22GA4SID%22%3A549815605%2C%22GA4TS%22%3A1741038608059%2C%22Domain%22%3A%22.invictastores.com%22%7D",
                id: 29,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1741213616,
                hostOnly: false,
                httpOnly: false,
                name: "GlobalE_Data",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                storeId: "0",
                value: "%7B%22countryISO%22%3A%22US%22%2C%22currencyCode%22%3A%22USD%22%2C%22cultureCode%22%3A%22en-US%22%7D",
                id: 30,
            },
            {
                domain: ".invictastores.com",
                hostOnly: false,
                httpOnly: false,
                name: "GlobalE_Full_Redirect",
                path: "/",
                sameSite: "lax",
                secure: false,
                session: true,
                storeId: "0",
                value: "false",
                id: 31,
            },
            {
                domain: ".invictastores.com",
                hostOnly: false,
                httpOnly: false,
                name: "GlobalE_SupportThirdPartCookies",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: true,
                storeId: "0",
                value: "true",
                id: 32,
            },
            {
                domain: ".invictastores.com",
                hostOnly: false,
                httpOnly: false,
                name: "IR_26586",
                path: "/",
                sameSite: "unspecified",
                secure: true,
                session: true,
                storeId: "0",
                value: "1741039883850%7C5629448%7C1741039883850%7C%7C",
                id: 33,
            },
            {
                domain: ".invictastores.com",
                hostOnly: false,
                httpOnly: false,
                name: "IR_gbd",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: true,
                storeId: "0",
                value: "invictastores.com",
                id: 34,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1775599884,
                hostOnly: false,
                httpOnly: false,
                name: "IR_PI",
                path: "/",
                sameSite: "unspecified",
                secure: true,
                session: false,
                storeId: "0",
                value: "b0f738a6-f552-11ef-82ab-83eda9295ff8%7C1741039883850",
                id: 35,
            },
            {
                domain: ".invictastores.com",
                expirationDate: 1741043484,
                hostOnly: false,
                httpOnly: true,
                name: "PHPSESSID",
                path: "/",
                sameSite: "lax",
                secure: false,
                session: false,
                storeId: "0",
                value: "f0fc394cc2fd4027d1a11c43558cef51",
                id: 36,
            },
            {
                domain: "invictastores.com",
                expirationDate: 1773764754,
                hostOnly: true,
                httpOnly: false,
                name: "__attentive_cco",
                path: "/",
                sameSite: "unspecified",
                secure: true,
                session: false,
                storeId: "0",
                value: "1740068754643",
                id: 37,
            },
            {
                domain: "invictastores.com",
                expirationDate: 1741114806,
                hostOnly: true,
                httpOnly: false,
                name: "__attentive_dv",
                path: "/",
                sameSite: "unspecified",
                secure: true,
                session: false,
                storeId: "0",
                value: "1",
                id: 38,
            },
            {
                domain: "invictastores.com",
                expirationDate: 1774735887,
                hostOnly: true,
                httpOnly: false,
                name: "__attentive_id",
                path: "/",
                sameSite: "unspecified",
                secure: true,
                session: false,
                storeId: "0",
                value: "8e769889a12a4cb3893ed0d460f29ed6",
                id: 39,
            },
            {
                domain: "invictastores.com",
                expirationDate: 1741041907,
                hostOnly: true,
                httpOnly: false,
                name: "__attentive_pv",
                path: "/",
                sameSite: "unspecified",
                secure: true,
                session: false,
                storeId: "0",
                value: "4",
                id: 40,
            },
            {
                domain: "invictastores.com",
                expirationDate: 1741041686,
                hostOnly: true,
                httpOnly: false,
                name: "__attentive_session_id",
                path: "/",
                sameSite: "unspecified",
                secure: true,
                session: false,
                storeId: "0",
                value: "d1921e45f2224c79bd5f1b4dfeb0fab2",
                id: 41,
            },
            {
                domain: "invictastores.com",
                expirationDate: 1741041308,
                hostOnly: true,
                httpOnly: false,
                name: "__attentive_ss_referrer",
                path: "/",
                sameSite: "unspecified",
                secure: true,
                session: false,
                storeId: "0",
                value: "ORGANIC",
                id: 42,
            },
            {
                domain: "invictastores.com",
                expirationDate: 1775599883,
                hostOnly: true,
                httpOnly: false,
                name: "__kla_id",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                storeId: "0",
                value: "eyJjaWQiOiJZMlEyWWpnd05EVXROR1F3WmkwME9EQm1MV0l3WWpndE9HWTNabUV6TURGaFpHTTEiLCIkcmVmZXJyZXIiOnsidHMiOjE3NDAwNjg3MzQsInZhbHVlIjoiIiwiZmlyc3RfcGFnZSI6Imh0dHBzOi8vaW52aWN0YXN0b3Jlcy5jb20vIn0sIiRsYXN0X3JlZmVycmVyIjp7InRzIjoxNzQxMDM5ODg0LCJ2YWx1ZSI6IiIsImZpcnN0X3BhZ2UiOiJodHRwczovL2ludmljdGFzdG9yZXMuY29tL3NlYXJjaC9mcmFncmFuY2UifX0=",
                id: 43,
            },
            {
                domain: "invictastores.com",
                expirationDate: 1774736107,
                hostOnly: true,
                httpOnly: false,
                name: "_attn_",
                path: "/",
                sameSite: "strict",
                secure: true,
                session: false,
                storeId: "0",
                value: "eyJ1Ijoie1wiY29cIjoxNzQwMDY4NzU0NjM4LFwidW9cIjoxNzQwMDY4NzU0NjM4LFwibWFcIjoyMTkwMCxcImluXCI6ZmFsc2UsXCJ2YWxcIjpcIjhlNzY5ODg5YTEyYTRjYjM4OTNlZDBkNDYwZjI5ZWQ2XCJ9Iiwic2VzIjoie1widmFsXCI6XCJkMTkyMWU0NWYyMjI0Yzc5YmQ1ZjFiNGRmZWIwZmFiMlwiLFwidW9cIjoxNzQxMDM5ODg2NDkzLFwiY29cIjoxNzQxMDM5ODg2NDkzLFwibWFcIjowLjAyMDgzMzMzMzMzMzMzMzMzMn0ifQ==",
                id: 44,
            },
            {
                domain: "invictastores.com",
                expirationDate: 1771604765,
                hostOnly: true,
                httpOnly: false,
                name: "_bamls_usid",
                path: "/",
                sameSite: "unspecified",
                secure: false,
                session: false,
                storeId: "0",
                value: "6fbfec53-86e0-4453-a867-fe911bc3ce5b",
                id: 45,
            },
            {
                domain: "invictastores.com",
                expirationDate: 1741041013,
                hostOnly: true,
                httpOnly: false,
                name: "_dd_s",
                path: "/",
                sameSite: "strict",
                secure: false,
                session: false,
                storeId: "0",
                value: "logs=1&id=8143d925-7049-41df-a613-3768e6f2499e&created=1741038606226&expire=1741041007444",
                id: 46,
            },
            {
                domain: "invictastores.com",
                expirationDate: 1741040407,
                hostOnly: true,
                httpOnly: false,
                name: "_ju_v",
                path: "/",
                sameSite: "unspecified",
                secure: true,
                session: false,
                storeId: "0",
                value: "4.1_6.13",
                id: 47,
            },
            {
                domain: "invictastores.com",
                expirationDate: 1774628935,
                hostOnly: true,
                httpOnly: false,
                name: "addshoppers.com",
                path: "/",
                sameSite: "unspecified",
                secure: true,
                session: false,
                storeId: "0",
                value: "2%7C1%3A0%7C10%3A1740068936%7C15%3Aaddshoppers.com%7C44%3AOTkxYmY0OGRlZjcwNGFiMWI0YzlkZmQ4NTM1YmI4MjA%3D%7Ceedc4b3c907313ca9888505efa59aba2f9124f373f43359bb882262efde60ed8",
                id: 48,
            },
            {
                domain: "invictastores.com",
                expirationDate: 1771604934,
                hostOnly: true,
                httpOnly: false,
                name: "CookieConsent",
                path: "/",
                sameSite: "unspecified",
                secure: true,
                session: false,
                storeId: "0",
                value: "{stamp:%274Bvzadxlnuo5xSv9c4PSOeZG705O1wRr8oOgNh+IQXFU348a78QYiw==%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cmethod:%27explicit%27%2Cver:1%2Cutc:1740068934608%2Cregion:%27pe%27}",
                id: 49,
            },
            {
                domain: "invictastores.com",
                expirationDate: 1741042207,
                hostOnly: true,
                httpOnly: false,
                name: "GlobalE_Gem_Data",
                path: "/",
                sameSite: "lax",
                secure: false,
                session: false,
                storeId: "0",
                value: "%7B%22CartID%22%3A%22193869599_7ca370c8315a43a7837bd88a185f8d5d%22%2C%22UserId%22%3A0%2C%22PreferedCulture%22%3A%22en-US%22%2C%22StoreCode%22%3A%22default%22%2C%22StoreInstanceCode%22%3A%22invictastores.com%22%7D",
                id: 50,
            },
            {
                domain: "invictastores.com",
                expirationDate: 1775599884,
                hostOnly: true,
                httpOnly: false,
                name: "private_content_version",
                path: "/",
                sameSite: "lax",
                secure: true,
                session: false,
                storeId: "0",
                value: "013697334bc114d678f97e4719e3f104",
                id: 51,
            }
        );
        await page.setExtraHTTPHeaders({
            "Accept-Language": "en-US,en;q=0.9",
            Referer: "https://invictastores.com/",
        });

        // Configurar User-Agent real
        /* await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );*/

        // Desactivar detección de WebDriver
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, "webdriver", {
                get: () => undefined,
            });
        });

        // Simular resolución de pantalla
        await page.setViewport({ width: 1920, height: 1080 });

        // Construir la URL dinámica
        const url = `https://invictastores.com/search/${encodeURIComponent(
            searchQuery
        )}`;

        // Captura una captura de pantalla para depuración
        // await page.screenshot({ path: "debug.png" });
        await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 });

        console.log("🖥 LOG DESDE EL NAVEGADOR:", await page.content());
        //await page.waitForNavigation({ waitUntil: "networkidle2" });
        // Simular interacciones humanas
        await page.mouse.move(300, 300);
        await page.mouse.down();
        await page.mouse.up();
        //await page.waitForTimeout(Math.random() * 2000 + 1000); // Espera entre 1 y 3 segundos

        // Simular scroll en la página
        await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight);
        });

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
