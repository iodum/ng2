import { Directive, ElementRef, Input, Optional } from '@angular/core';
import { EventManager } from '@qgrid/core/infrastructure/event.manager';
import { EventListener } from '@qgrid/core/infrastructure/event.listener';
import { DragService } from '@qgrid/core/drag/drag.service';
import { GRID_PREFIX } from '@qgrid/core/definition';
import { Command } from '@qgrid/core/command/command';
import { GridRoot } from '../grid/grid-root';
import { isFunction } from '@qgrid/core/utility/kit';

@Directive({
	selector: '[q-grid-drag]'
})
export class DragDirective {
	@Input('q-grid-drag-data') data: any;
	@Input('q-grid-drag-effect') effect: string;
	@Input('q-grid-drag') drag: Command;
	@Input('q-grid-drop-area') area: string;

	constructor(
		@Optional() private root: GridRoot,
		private elementRef: ElementRef
	) {
		const element = elementRef.nativeElement;
		const listener = new EventListener(element, new EventManager(this));
		element.classList.add(`${GRID_PREFIX}-can-drag`);
		element.setAttribute('draggable', true);

		listener.on('dragstart', this.onStart);
		listener.on('dragend', this.onEnd);
	}

	onStart(e: DragEvent) {
		const transfer = e.dataTransfer;
		const data = this.data;
		const eventArg = { data };

		if (this.drag.canExecute(eventArg) === false) {
			e.preventDefault();
			transfer.effectAllowed = 'none';
			return false;
		}

		const result = this.drag.execute(eventArg);
		DragService.element =
			result && isFunction(result.getBoundingClientRect)
				? result : (e.srcElement || e.target);

		this.elementRef.nativeElement.classList.add(`${GRID_PREFIX}-drag`);

		transfer.setData(DragService.mimeType, DragService.encode(data));
		transfer.effectAllowed = this.effect || 'move';

		DragService.data = data;
		DragService.area = this.area;

		const rect = DragService.element.getBoundingClientRect();
		DragService.startPosition = {
			x: e.clientX,
			y: e.clientY,
			rect
		};

		if (this.root) {
			const { model } = this.root;
			model.drag({ isActive: true }, { source: 'drag.directive' });
		}
	}

	onEnd() {
		if (this.root) {
			const { model } = this.root;
			model.drag({ isActive: false }, { source: 'drag.directive' });
		}

		this.elementRef.nativeElement.classList.remove(`${GRID_PREFIX}-drag`);

		DragService.data = null;
		DragService.area = null;
		DragService.element = null;
		DragService.startPosition = null;
	}
}
