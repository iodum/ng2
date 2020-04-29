import { Command } from '@qgrid/core/command/command';
import { upload } from '@qgrid/core/services/upload';
import { readFile } from './read';

export class ImportPlugin {
	constructor(model, context) {
		this.model = model;

		const { element, options } = context;

		this.options = options;

		this.upload = new Command({
			source: 'import',
			execute: () => upload(element)
		});
	}

	load(e) {
		const files = e.target.files;

		for (let file of files) {
			const reader = new FileReader();
			reader.onload = e => {
				readFile(e, file, this.model, this.options);
			};
			reader.readAsBinaryString(file);
		}
	}
}
