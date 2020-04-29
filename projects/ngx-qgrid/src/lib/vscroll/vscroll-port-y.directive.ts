import { Directive, ElementRef, Input, ChangeDetectorRef, ApplicationRef, SimpleChanges, OnChanges } from '@angular/core';
import { VscrollPort } from './vscroll.port';
import { VscrollContext } from './vscroll.context';
import { capitalize } from './vscroll.utility';
import { VscrollBox } from './vscroll.box';
import { VscrollLayout } from './vscroll.layout';
import { findPositionUsingItemSize, findPositionUsingOffsets, recycleFactory, IVscrollPosition } from './vscroll.position';
import { VscrollDirective } from './vscroll.directive';
import { VscrollLink } from './vscroll.link';
import { isNumber } from '@qgrid/core/utility/kit';
import { Guard } from '@qgrid/core/infrastructure/guard';

@Directive({
	selector: '[q-grid-vscroll-port-y]'
})
export class VscrollPortYDirective extends VscrollPort implements OnChanges {
	@Input('q-grid-vscroll-port-y') context: VscrollContext;
	markup = {};
	layout: VscrollLayout;
	link: VscrollLink;

	constructor(
		private elementRef: ElementRef,
		private cd: ChangeDetectorRef,
		private app: ApplicationRef,
		view: VscrollDirective
	) {
		super(view, elementRef.nativeElement);
	}

	ngOnChanges(changes: SimpleChanges) {
		const contextChange = changes['context'];
		if (contextChange && this.context) {
			this.layout = new VscrollLayout(this);
			this.link = new VscrollLink(this);
			this.context.container.fetchPage(0);
		}
	}

	public reset() {
		this.view.resetY();
	}

	emit(f: () => void) {
		const { settings } = this.context;
		if (settings.emit) {
			settings.emit(f);
		} else {
			f();

			this.cd.markForCheck();
			this.app.tick();
		}
	}

	getPositionUsingItemSize(itemSize: number, box: VscrollBox, arm: number): IVscrollPosition {
		const limitTop = box.scrollTop - arm;
		const limitBottom = box.scrollHeight - (box.portHeight + arm);
		const value = Math.min(limitBottom, Math.max(0, limitTop));
		return findPositionUsingItemSize(value, itemSize);
	}

	getPositionUsingOffsets(offsets: Array<number>, box: VscrollBox, arm: number): IVscrollPosition {
		const limitTop = box.scrollTop - arm;
		const limitBottom = box.scrollHeight - (box.portHeight + arm);
		const value = Math.min(limitBottom, Math.max(0, limitTop));
		return findPositionUsingOffsets(value, offsets);
	}

	move(top: number, bottom: number) {
		this.pad('top', top);
		this.pad('bottom', bottom);
	}

	getItemSize(): number {
		const rowHeight = this.context.settings.rowHeight as number;
		return isNumber(rowHeight) ? rowHeight : 0;
	}

	getScrollSize(box: VscrollBox) {
		return box.scrollHeight;
	}

	getSize(box: VscrollBox) {
		return box.portHeight;
	}

	recycleFactory(items: Array<any>) {
		const recycle = recycleFactory(items);
		return (index: number, count: number) => {
			const size = this.getItemSize();
			if (size) {
				return [];
			}

			return recycle(index, count);
		};
	}

	hasChanges(newBox: VscrollBox, oldBox: VscrollBox) {
		return !oldBox.portHeight || newBox.scrollTop !== oldBox.scrollTop;
	}

	private pad(pos: string, value: number) {
		if (this.markup.hasOwnProperty(pos)) {
			const mark = this.markup[pos];
			mark.style.height = value + 'px';
		} else {
			this.elementRef.nativeElement.style['padding' + capitalize(pos)] = value + 'px';
		}
	}
}
