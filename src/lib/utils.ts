export function truncate(str: string, length = 13) {
	if (str.length <= length) {
		return str;
	}

	return str.slice(0, length - 3) + '...';
}
