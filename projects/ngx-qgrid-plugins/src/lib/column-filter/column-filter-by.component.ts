import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { ColumnModel } from '@qgrid/core/column-type/column.model';

@Component({
	selector: 'q-grid-column-filter-by',
	templateUrl: './column-filter-by.component.html'
})
export class ColumnFilterByComponent {
	@Input() by: Set<string>;
	@Input() column: ColumnModel;
	@Input() byBlanks: boolean;

	@Output() byBlanksChange = new EventEmitter();

	context: { $implicit: ColumnFilterByComponent } = {
		$implicit: this
	};

	get isBlanks() {
		return this.byBlanks;
	}

	remove(item: string): void {
		this.by.delete(item);
	}

	removeByBlanks() {
		this.byBlanksChange.emit(false);
	}
}
