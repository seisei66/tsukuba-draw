onmessage = function (e) {
	let pixel_data = [];
	for (let i = 0; i < e.data.wid * e.data.hei; i++) {
		if (e.data.af_pix.data[4 * i] != e.data.bef_pix.data[4 * i] || e.data.af_pix.data[4 * i + 1] != e.data.bef_pix.data[4 * i + 1] || e.data.af_pix.data[4 * i + 2] != e.data.bef_pix.data[4 * i + 2] || e.data.af_pix.data[4 * i + 3] != e.data.bef_pix.data[4 * i + 3]) {
			pixel_data.push(i % e.data.wid);
			pixel_data.push(Math.floor(i / e.data.wid));
			pixel_data.push(e.data.af_pix.data[4 * i]);
			pixel_data.push(e.data.af_pix.data[4 * i + 1]);
			pixel_data.push(e.data.af_pix.data[4 * i + 2]);
			pixel_data.push(e.data.af_pix.data[4 * i + 3]);
		}
	}
	e.data.bef_pix = e.data.af_pix;
	let pix = { bef_pix: e.data.bef_pix, af_pix: e.data.af_pix, pixel_data: pixel_data };
	postMessage(pix);
}