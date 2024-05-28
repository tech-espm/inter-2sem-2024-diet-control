"use strict";

function waitSwal() {
	Swal.fire({
		html: "Por favor, aguarde...",
		allowOutsideClick: false,
		allowEscapeKey: false,
		allowEnterKey: false,
		didOpen: () => {
			Swal.showLoading()
		}
	});
}

async function exibirErro(response) {
	let r = await response.text();

	let json = null;
	try {
		json = JSON.parse(r);
	} catch (ex) {
		// Apenas ignora...
	}

	if (json) {
		if (typeof json === "string") {
			r = json;
		} else if (json.message) {
			r = json.message;
		}
	}

	return Swal.fire("Erro", r, "error");
}

window.encode = (function () {
	const amp = /\&/g, lt = /</g, gt = />/g, quot = /\"/g, apos = /\'/g, grave = /\`/g;
	window.encodeValue = function (x) {
		return (x ? x.replace(amp, "&amp;").replace(lt, "&lt;").replace(gt, "&gt;").replace(quot, "&#34;").replace(apos, "&#39;").replace(grave, "&#96;") : "");
	};
	return function (x) {
		return (x ? x.replace(amp, "&amp;").replace(lt, "&lt;").replace(gt, "&gt;") : "");
	};
})();
