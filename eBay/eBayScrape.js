const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const FileSystem = require('fs');
const categories = require('./categories');
puppeteer.use(StealthPlugin());

puppeteer.launch({ headless: false }).then(async browser => {
	const page = await browser.newPage();

	// Goes through all main categories
	for (const key in categories) {
		// Goes through all sub categories
		for (const subKey in categories[key]) {
			// Goes through all the categories containing the actual items like dresses, skirts etc.
			for (const actualKey in categories[key][subKey]) {
				for (let i = 1; i <= 2; i++) {
					await page.goto(`${categories[key][subKey][actualKey]}?_pgn=${i}`, {
						waitUntil: 'load',
						timeout: 0
					});
					await page.waitFor(2000);

					// // Gets all item images
					// let images = await page.$$eval(
					// 	'ul.b-list__items_nofooter.srp-results.srp-grid li.s-item.s-item--large.s-item--bgcolored div.s-item__image-section .s-item__image-wrapper img.s-item__image-img',
					// 	imgs => imgs.map(img => img.src)
					// );

					// console.log(images);

					// let names = await page.$$eval(
					// 	'ul.b-list__items_nofooter.srp-results.srp-grid li .s-item__info.clearfix h3.s-item__title.s-item__title--has-tags',
					// 	names => names.map(name => name.innerHTML)
					// );

					// console.log(names);

					let cost = await page.$$eval(
						'ul.b-list__items_nofooter.srp-results.srp-grid li div.s-item__detail.s-item__detail--primary span.s-item__price',
						prices => prices.map(price => price.innerHTML)
					);

					console.log(cost);
				}
			}
		}
		// Goes through all subcategories
		// Initializes subcategory's array
		// totalResults[key][categories[key][i]] = [];

		// 		// Gets all celebs' names
		// 		let celebs = await page.$$eval(
		// 			'.Styled__StarcardGrid-sc-79dgm2-0.iLhTvt .Styled__Wrapper-sc-116g1k2-1.hNSzko .Styled__Name-sc-116g1k2-20.cogzsP',
		// 			names => names.map(name => name.innerHTML)
		// 		);

		// 		// Pushes results into subcategory's array
		// 		totalResults[key][categories[key][i]].push(...celebs);

		// 		// Counter to go to next page.
		// 		counter += 40;

		// 		// Goes through pages while the next page arrow exists.
		// 	} while (
		// 		await page.$(
		// 			'img._3bNgNHn00MmCb48sAJy5It[src="/rounded-arrow-white.svg"]'
		// 		)
		// 	);

		// 	// Resets counter and moves to the next subcategory
		// 	counter = 0;
		// }
	}

	// Creates JSON file w/ results
	// FileSystem.writeFile('Cameo.json', JSON.stringify(totalResults), error => {
	// 	if (error) throw error;
	// });
	// await browser.close();
});
