import { Component, Input, OnInit, Optional } from '@angular/core';
import { PluginService } from '../plugin.service';
import { Command } from 'ng2-qgrid/core/command/command';
import { ExportView } from 'ng2-qgrid/plugin/export/export.view';
import { ColumnModel } from 'ng2-qgrid/core/column-type/column.model';
import { Xlsx } from './xlsx';
import { Pdf } from './pdf';
import { downloadFactory } from './download';
import { TemplateHostService } from '../../template/template-host.service';
import { Action } from 'ng2-qgrid/core/action/action';
import { Composite } from 'ng2-qgrid/core/infrastructure/composite';

@Component({
	selector: 'q-grid-export',
	templateUrl: './export.component.html',
	providers: [ TemplateHostService, PluginService ]
})
export class ExportComponent implements OnInit {
	@Input() type: string;

	context: { $implicit: ExportComponent } = {
		$implicit: this
	};

	constructor(private plugin: PluginService, private templateHost: TemplateHostService) {
	}

	ngOnInit() {
		this.templateHost.key = (source: string) => `${source}-${this.templateHostKey}`;
		const { model } = this.plugin;
		const exportView = new ExportView(model, { type: this.type });
		const action = new Action(
			new Command({ execute: () => exportView[this.type].execute() }),
			`Export to ${this.type}`,
			'file_download'
		);

		model.action({
			items: Composite.list([ [ action ], model.action().items ])
		}, {
			source: 'export.component'
		});
	}

	get rows() {
		return this.plugin.model.data().rows;
	}

	get columns() {
		return this.plugin.model.columnList().line;
	}

	get id() {
		return this.plugin.model.grid().id;
	}

	get templateContentKey() {
		return [ `content-${this.templateHostKey}`, 'plugin-export.tpl.html' ];
	}

	get templateHostKey() {
		return `plugin-export-${this.type}.tpl.html`;
	}
}
