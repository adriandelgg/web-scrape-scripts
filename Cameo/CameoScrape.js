const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const FileSystem = require('fs');
const categories = require('./categories');
puppeteer.use(StealthPlugin());

puppeteer.launch().then(async browser => {
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
				await page.waitFor(1300);

				// Gets all celebs' names
				let celebs = await page.$$eval(
					'.Styled__StarcardGrid-sc-79dgm2-0.iLhTvt .Styled__Wrapper-sc-116g1k2-1.hNSzko .Styled__Name-sc-116g1k2-20.cogzsP',
					names => names.map(name => name.innerHTML)
				);

				// Get all celebs' prices
				let totalPrices = await page.$$eval(
					'.Styled__StarcardGrid-sc-79dgm2-0.iLhTvt .Styled__FooterContainer-sc-116g1k2-16.iuNkrn .Styled__BottomRowContainer-sc-116g1k2-21.jALSOf .Styled__FromPriceContainer-sc-116g1k2-24.ewWkSU .Styled__PriceContainer-sc-116g1k2-13.ftKQdq span',
					prices => prices.map(price => price.innerHTML)
				);

				// Pushes results into subcategory's array
				// Loops through celebs and totalPrices to create objects with pairs.
				for (let j = 0; j < totalPrices.length; j++) {
					totalResults[key][categories[key][i]].push({
						name: celebs[j],
						price: totalPrices[j]
					});
					console.log({ name: celebs[j], price: totalPrices[j] });
				}

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
	FileSystem.writeFile(
		'newCameo_Prices.json',
		JSON.stringify(totalResults),
		error => {
			if (error) throw error;
		}
	);
	await browser.close();
});

// For images, not working.
// let images = await page.$$eval(
// 	'.Styled__StarcardGrid-sc-79dgm2-0.iLhTvt .Styled__Wrapper-sc-116g1k2-1.hNSzko img',
// 	imgs => imgs.map(img => ({ title: item.alt, img: item.src }))
// );
