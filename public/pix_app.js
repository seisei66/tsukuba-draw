onmessage = function (e) {
	let pixels = e.data.pixels;
	for (let i = 0; i < e.data.pixel_data.length; i += 6) {
		let pos = (e.data.pixel_data[i] + e.data.pixel_data[i + 1] * e.data.wid) * 4;
		pixels.data[pos] = e.data.pixel_data[i + 2];
		pixels.data[pos + 1] = e.data.pixel_data[i + 3];
		pixels.data[pos + 2] = e.data.pixel_data[i + 4];
		pixels.data[pos + 3] = e.data.pixel_data[i + 5];
	}
	let pix = { pixels: pixels, num: e.data.num };
	postMessage(pix);
}