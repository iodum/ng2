import { Action } from '@grid/core/action';

export class ActionPlugin {
	constructor(model, context) {
		this.model = model;

		this.command = context.command;

		const action = new Action(context.command, context.title, context.icon);
		action.id = context.id;

		const items = Array.from(model.action().items);
		items.push(action);

		model.action({ items }, { source: 'action.view' });
	}

	execute() {
		return this.command && this.command.execute();
	}

	canExecute() {
		return this.command && this.command.canExecute();
	}
}
