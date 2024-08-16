import chalk from "chalk";
import puppeteer from "puppeteer";

const url = "https://attack.mitre.org/matrices/enterprise/";

const main = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Get a sample of the rows and their inner HTML
    const rowsSample = await page.evaluate(() => {
        const rows = document.querySelectorAll('tr.technique-row');
        return Array.from(rows).slice(0, 5).map(row => row.innerHTML);
    });

    console.log(chalk.blue('Sample rows HTML:'), rowsSample);

    const allTactics = await page.evaluate(() => {
        const rows = document.querySelectorAll('tr.technique-row');
        console.log(`Found ${rows.length} rows`); // Debug log

        return Array.from(rows).map(row => {
            // Extracting tactic-related information
            const tacticElement = row.querySelector('.technique-cell a');
            if (!tacticElement) {
                console.log(chalk.red('No tactic element found in row')); // Debug log
                return null;
            }

            const tacticName = tacticElement.textContent.trim();
            const tacticUrl = tacticElement.href;

            // Extracting supertechnique information
            const supertechniqueElement = row.querySelector('.supertechniquecell a');
            const supertechniqueName = supertechniqueElement ? supertechniqueElement.textContent.trim() : "N/A";
            const supertechniqueUrl = supertechniqueElement ? supertechniqueElement.href : "N/A";

            // Extracting subtechniques
            const subtechniques = Array.from(row.querySelectorAll('.subtechniques .subtechnique .technique-cell a')).map(sub => ({
                subtechniqueName: sub.textContent.trim(),
                subtechniqueUrl: sub.href
            }));

            return {
                tacticName,
                tacticUrl,
                supertechniqueName,
                supertechniqueUrl,
                subtechniques
            };
        }).filter(tactic => tactic !== null);
    });

    console.log(chalk.green(`Found ${allTactics.length} tactics`)); // Debug log

    allTactics.forEach(tactic => {
        console.log(chalk.cyan(`Tactic: ${tactic.tacticName}`));
        console.log(chalk.yellow(`URL: ${tactic.tacticUrl}`));
        console.log(chalk.magenta(`Supertechnique: ${tactic.supertechniqueName} (${tactic.supertechniqueUrl})`));
        tactic.subtechniques.forEach(sub => {
            console.log(chalk.green(`  Subtechnique: ${sub.subtechniqueName} (${sub.subtechniqueUrl})`));
        });
        console.log('');
    });

    await browser.close();
};

main();
