import { ColumnView } from '../scene/view/column.view';
import { ColumnModel } from './column.model';
import { TemplatePath } from '../template/template.path';

TemplatePath.register('cohort-cell', (template) => {
	return {
		model: template.for,
		resource: `${template.for}.${template.type}`
	};
});

export class CohortColumnModel extends ColumnModel {
	constructor() {
		super('cohort');

		this.key = '$cohort';
		this.class = 'control';

		this.canEdit = false;
		this.canSort = false;
		this.canResize = false;
		this.canHighlight = false;
		this.canFocus = false;
	}
}

export class CohortColumn extends ColumnView {
	constructor(model) {
		super(model);
	}

	static model(model) {
		return model ? CohortColumn.assign(model) : new CohortColumnModel();
	}
}