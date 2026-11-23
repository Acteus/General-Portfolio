/* Regenerate the internship PDF from its editable HTML source. Requires Playwright Chromium. */
const { chromium } = require('playwright');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
(async () => {
 const browser = await chromium.launch();
 try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(path.resolve(__dirname, '../resume/intern-resume.html')).href);
  await page.pdf({path:path.resolve(__dirname,'../output/pdf/Garren-Dullas-Intern-Resume.pdf'),format:'Letter',preferCSSPageSize:true,printBackground:true,tagged:true});
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });
