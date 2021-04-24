const path = require('path');
const makeDir = require('make-dir');
const fs = require('fs');
async function pagePrerender({ input, browser, selector }) {
  const rawData = fs.readFileSync(input, { encoding: 'utf-8' });

  const dataObject = JSON.parse(rawData);

  await Promise.all(
    dataObject.map(async d => {
      const { url } = d;
      const outputDirPath = `page-build${url}`;
      const outputDir = path.dirname(outputDirPath);
      await makeDir(outputDir);
      try {
        const page = await browser.newPage();
        await page.goto(`http://localhost:8081${url}`, {
          waitUntil: 'networkidle0'
        });
        await page.waitForSelector(selector); // ensure #posts exists in the DOM.
        const html = await page.content(); // serialized HTML of page DOM.
        debugger;
        const removedPrerenderTag = html
          .replace(/<prerender-component marka=".*" jsonurl=".*">/g, '')
          .replace(/<\/prerender-component>/g, '')
          .replace(/<script src=".*prerender-component.js"><\/script>/g, '');
        debugger;

        fs.writeFileSync(
          `${process.cwd()}/${outputDirPath}`,
          removedPrerenderTag
        );
      } catch (error) {
        debugger;
      }
    })
  );
}

module.exports = {
  pagePrerender
};
