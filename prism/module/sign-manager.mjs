const COIN_RESULTS = Object.freeze({
	trait: "trait",
	sign: "sign"
});

export function normalizeSign(value) {
	return typeof value === "string" ? value.trim() : "";
}

export function hasSign(value) {
	return normalizeSign(value).length > 0;
}

export function flipSignCoin(random = Math.random) {
	return random() < 0.5
		? COIN_RESULTS.trait
		: COIN_RESULTS.sign;
}

export function isCoinResult(value) {
	return Object.values(COIN_RESULTS).includes(value);
}
