import puppeteer from "puppeteer";
const url = "https://attack.mitre.org/matrices/enterprise/";
const main = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const allTactics = await page.evaluate(() => {
        const tactics = document.querySelectorAll('table');
        return Array.from(tactics).map(tactic => {
            const  tacticTitle = tactic.querySelector('tr');
            const url = tactic.querySelector('a').href;
            return{tacticTitle,url}   ;
        
    });
    });
    console.log(allTactics);
}
main()