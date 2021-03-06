import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'example-column-date-basic',
	templateUrl: 'example-column-date-basic.component.html',
	styleUrls: ['example-column-date-basic.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleColumnDateBasicComponent {
	static id = 'column-date-basic';

	rows = [
		{
			'number': 100.12,
			'bool': true,
			'date': new Date(2018, 9, 12),
			'null': null,
			'undefined': undefined,
			'empty': '',
			'text': '2018/3/28',
			'maxLength2': 'PI',
			'format': new Date(2018, 9, 12),
			'customTemplate': new Date(2018, 9, 12)
		}
	];
}
