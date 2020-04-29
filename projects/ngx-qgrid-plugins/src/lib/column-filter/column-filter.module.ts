import { NgModule } from '@angular/core';
import { ColumnFilterComponent } from './column-filter.component';
import { ColumnFilterTriggerComponent } from './column-filter-trigger.component';
import { ColumnFilterByComponent } from './column-filter-by.component';
import { ColumnFilterItemListDirective } from './column-filter-item-list.directive';
import { ColumnFilterItemDirective } from './column-filter-item.directive';
import { ColumnFilterModel } from '@qgrid/plugins/column-filter/column.filter.model';
import { GridModelBuilder, TemplateModule } from '@qgrid/ngx';

@NgModule({
	declarations: [
		ColumnFilterComponent,
		ColumnFilterTriggerComponent,
		ColumnFilterByComponent,
		ColumnFilterItemListDirective,
		ColumnFilterItemDirective
	],
	exports: [
		ColumnFilterComponent,
		ColumnFilterTriggerComponent,
		ColumnFilterByComponent,
		ColumnFilterItemListDirective,
		ColumnFilterItemDirective
	],
	imports: [
		TemplateModule
	]
})
export class ColumnFilterModule {
	constructor(modelBuilder: GridModelBuilder) {
		modelBuilder.register('columnFilter', ColumnFilterModel);
	}
}
