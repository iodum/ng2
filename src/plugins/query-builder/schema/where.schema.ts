import { typeMapping as operators } from './operator';
import { suggestFactory, suggestsFactory } from './suggest.service';
import { QueryBuilderService, IQueryBuilderSchema } from '../query-builder.service';
import { isArray, noop } from 'ng2-qgrid/core/utility/index';
import { Validator } from './validator';

export const getValue = (line, id, props) => {
	const group = line.get(id);
	if (group) {
		if (group.expressions.length === 1) {
			const expr = group.expressions[0];
			const prop = props.filter(p => expr.hasOwnProperty(p))[0];
			if (prop) {
				const value = expr[prop];
				if (isArray(value) && value.length) {
					return value[0];
				}

				return value;
			}
		}
	}

	return null;
};

export class WhereSchema {
	constructor(private service: QueryBuilderService) {
	}

	factory(): IQueryBuilderSchema {
		const service = this.service;
		const suggest = suggestFactory(service, '#field');
		const suggests = suggestsFactory(service, '#field');
		const validator = new Validator();

		return this.service.build()
			.node('#logical', function (schema) {
				schema
					.attr('serialize', {
						'#logical-op': ['value']
					})
					.attr('class', {
						'qb-logical': true
					})
					.select('#logical-op', {
						classes: ['qb-operation'],
						options: ['AND', 'OR', 'ACTIONS', 'Add Expression', 'Add Group', 'Remove Group'],
						value: 'AND',
						oldValue: null,
						disabled: function (node, line, value) {
							switch (value) {
								case 'ACTIONS': return true;
								case 'Remove Group': return node.level <= 1;
								default: return false;
							}
						},
						icon: function (node, line, value) {
							switch (value) {
								case 'Add Expression':
									return 'playlist_add_check';
								case 'Add Group':
									return 'playlist_add';
								case 'Remove Group':
									return 'clear';
							}
						},
						open: function (node, line, isOpened) {
							if (isOpened) {
								this.oldValue = this.value;
							}
						},
						change: function (node, line, e) {
							const value = this.value;
							switch (value) {
								case 'Add Expression':
									e.source.value = this.oldValue;
									break;
								case 'Add Group':
									e.source.value = this.oldValue;
									node.addChildAfter(node.clone());
									break;
								case 'Remove Group':
									e.source.value = this.oldValue;
									node.remove();
									break;
							}
						}
					})
					// .iconButton('#add-logical', {
					// 	icon: 'add',
					// 	click: function (node, line) {
					// 		node.addChildAfter(node.clone());
					// 	}
					// })
					// .iconButton('#remove-logical', {
					// 	icon: 'close',
					// 	isVisible: function (node) {
					// 		return node.level > 1;
					// 	},
					// 	click: function (node) {
					// 		node.remove();
					// 	}
					// })
					.node('#condition', function (schema) {
						schema
							// .attr('placeholder', true)
							// .attr('class', {
							// 	'qb-placeholder': function (node) {
							// 		return node.attr('placeholder');
							// 	}
							// })
							.attr('serialize', {
								'#field': ['value'],
								'#operator': ['value'],
								'#value': ['value'],
								'#from': ['value'],
								'#to': ['value'],
								'#in-operand': ['values'],
								//'@attr': ['placeholder']
							})
							.select('#field', {
								classes: ['qb-field'],
								options: service.columns().map(c => c.key),
								value: service.columns().length ? service.columns()[0].key : '',
								getLabel: function (node, line, key) {
									const column = service.columns().filter(c => c.key === key)[0];
									return (column && column.title) || null;
								},
								getType: function (node, line, key) {
									const column = service.columns().filter(c => c.key === key)[0];
									return (column && column.type) || null;
								},
								change: function (node, line) {
									// if (node.attr('placeholder')) {
									// 	node.addAfter(node.clone());
									// 	node.attr('placeholder', false);
									// }

									const field = this.value;
									const type = this.getType(field);
									const ops = operators[type] || [];
									const op = line.get('#operator').expressions[0];

									if (ops.indexOf(op.value) < 0) {
										op.value = ops.length ? ops[0] : null;
										op.change();
									} else {
										const operand = line.get('#operand').expressions[0];
										operand.state = validator.for(field)(operand.value);
										if (operand.state.length) {
											operand.value = null;
											operand.state = validator.for(field)(operand.value);
										}
									}
								}
							})
							.select('#operator', {
								classes: ['qb-operator'],
								getOptions: function (node, line) {
									const field = line.get('#field').expressions[0];
									const name = field.value;
									const type = field.getType(name);

									return type ? operators[type] : [];
								},
								value: 'EQUALS',
								change: function (node, line) {
									// if (node.attr('placeholder')) {
									// 	node.addAfter(node.clone());
									// 	node.attr('placeholder', false);
									// }

									switch (this.value.toLowerCase()) {
										case 'equals':
										case 'not equals':
										case 'greater than':
										case 'less than':
										case 'greater or eq. to':
										case 'less or eq. to':
										case 'like':
										case 'not like':
										case 'starts with':
										case 'ends with':
											const value = getValue(line, '#operand', ['value', 'values']);

											line.put('#operand', node, function (schema) {
												schema.autocomplete('#value', {
													$watch: {
														'value': function () {
															const field = line.get('#field').expressions[0].value;
															this.state = validator.for(field)(this.value);
														}
													},
													state: [],
													classes: {
														'qb-operand': true,
														'qb-has-value': function () {
															return !!this.value;
														},
														'qb-invalid': function (node) {
															return !this.isValid(node);
														}
													},
													options: suggest,
													value: value,
													placeholderText: 'Select value'
												});
											});
											break;
										case 'between':
											line.put('#operand', node, function (schema) {
												schema
													.autocomplete('#from', {
														$watch: {
															'value': function () {
																const field = line.get('#field').expressions[0].value;
																this.state = validator.for(field)(this.value);
															}
														},
														classes: {
															'qb-operand': true,
															'qb-has-value': function () {
																return !!this.value;
															},
															'qb-invalid': function (node) {
																return !this.isValid(node);
															}
														},
														state: [],
														options: suggest,
														value: null,
														placeholderText: 'Select value'
													})
													.label('#and', {
														classes: ['qb-operand', 'qb-operand-and-label'],
														text: 'AND'
													})
													.autocomplete('#to', {
														$watch: {
															'value': function () {
																const field = line.get('#field').expressions[0].value;
																this.state = validator.for(field)(this.value);
															}
														},
														classes: {
															'qb-operand': true,
															'qb-has-value': function () {
																return !!this.value;
															},
															'qb-invalid': function (node) {
																return !this.isValid(node);
															}
														},
														state: [],
														options: suggest,
														value: null,
														placeholderText: 'Select value'
													});
											});
											break;
										case 'in':
											line.put('#operand', node, function (schema) {
												schema
													.label('#in-open', {
														text: '('
													})
													.multiselect('#in-operand', {
														$watch: {
															'values': function () {
																const field = line.get('#field').expressions[0].value;
																this.state = validator.for(field)(this.values);
															}
														},
														classes: {
															'qb-operand': true,
															'qb-has-value': function () {
																return !!this.values.length;
															},
															'qb-invalid': function (node) {
																return !this.isValid(node);
															}
														},
														state: [],
														values: [],
														options: suggests,
														placeholderText: 'Select value'
													})
													.label('#in-close', {
														text: ')'
													});
											});
											break;
										case 'is empty':
										case 'is not empty':
											line.put('#operand', node, noop);
											break;
									}
								}
							})
							.group('#operand', function (schema) {
								schema.autocomplete('#value', {
									$watch: {
										'value': function (newValue, oldValue, node, line) {
											const field = line.get('#field').expressions[0].value;
											this.state = validator.for(field)(this.value);
										}
									},
									classes: {
										'qb-operand': true,
										'qb-has-value': function () {
											return !!this.value;
										},
										'qb-invalid': function (node) {
											return !this.isValid(node);
										}
									},
									values: [],
									value: null,
									state: [],
									placeholderText: 'Select value',
									suggest: suggest,
									options: null,
									refresh: function (node, line) {
										this.options = this.suggest(node, line);
									},
									change: function (node, line) {
										// if (this.value) {
										// 	if (node.attr('placeholder')) {
										// 		node.addAfter(node.clone());
										// 		node.attr('placeholder', false);
										// 	}
										// }
									}
								});
							})
							.iconButton('#remove', {
								icon: 'close',
								// isVisible: function (node, line) {
								// 	return !node.attr('placeholder');
								// },
								click: function (node) {
									node.remove();
								}
							});
					});
			});
	}
}
