'use strict';

const flattenObject = (object) => {
	const iteration = (object, path) => {
		if (Array.isArray(object)) {
			object.forEach((a, i) => {
				iteration(a, path.concat(i));
			});
			return;
		}

		if (object !== null && typeof object === 'object') {
			Object.keys(object).forEach((key) => {
				iteration(object[key], path.concat(key));
			});
			return;
		}
		paths[path.join('.')] = object;
	}

	let paths = {};
	iteration(object, []);
	return paths;
}

const arraySelect = () => {
	Array.prototype.select = function (indexes) {
		return indexes.map(index => this[index]);
	}
}

module.exports = {
	flattenObject,
	arraySelect
};