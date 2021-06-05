const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const FileSystem = require('fs');
const categories = require('./categories');
puppeteer.use(StealthPlugin());

puppeteer.launch({ headless: false }).then(async browser => {
	const page = await browser.newPage();

	const totalResults = {
		actors: {},
		comedians: {},
		creators: {},
		gamers: {},
		more: {},
		musicians: {},
		'reality-tv': {},
		athletes: {}
	};
	let counter = 0;

	// Goes through all categories
	for (const key in categories) {
		// Goes through all subcategories
		for (let i = 0; i < categories[key].length; i++) {
			// Initializes subcategory's array
			totalResults[key][categories[key][i]] = [];
			do {
				await page.goto(
					`https://www.cameo.com/browse/${key}/${categories[key][i]}?nextToken=${counter}`,
					{ waitUntil: 'load', timeout: 0 }
				);
				await page.waitFor(2000);

				// Gets all celebs' names
				let celebs = await page.$$eval(
					'.Styled__StarcardGrid-sc-79dgm2-0.iLhTvt .Styled__Wrapper-sc-116g1k2-1.hNSzko .Styled__Name-sc-116g1k2-20.cogzsP',
					names => names.map(name => name.innerHTML)
				);

				// Pushes results into subcategory's array
				totalResults[key][categories[key][i]].push(...celebs);

				// Counter to go to next page.
				counter += 40;

				// Goes through pages while the next page arrow exists.
			} while (
				await page.$(
					'img._3bNgNHn00MmCb48sAJy5It[src="/rounded-arrow-white.svg"]'
				)
			);

			// Resets counter and moves to the next subcategory
			counter = 0;
		}
	}

	// Creates JSON file w/ results
	FileSystem.writeFile('Cameo.json', JSON.stringify(totalResults), error => {
		if (error) throw error;
	});
	await browser.close();
});

// For images, not working.
// let images = await page.$$eval(
// 	'.Styled__StarcardGrid-sc-79dgm2-0.iLhTvt .Styled__Wrapper-sc-116g1k2-1.hNSzko img',
// 	imgs => imgs.map(img => ({ title: item.alt, img: item.src }))
// );
