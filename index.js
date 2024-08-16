import puppeteer from "puppeteer";

const url = "https://attack.mitre.org/matrices/enterprise/";

const main = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const allTactics = await page.evaluate(() => {
        const cells = document.querySelectorAll('td.tactic.name a');
        return Array.from(cells).map(cell => {
            const tacticName = cell.textContent.trim();
            const tacticUrl = cell.href;
            return { tacticName, tacticUrl };
        });
    });

    console.log(allTactics);

    await browser.close();
};

main();
