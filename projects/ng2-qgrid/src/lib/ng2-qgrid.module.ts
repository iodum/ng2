import { NgModule } from '@angular/core';

import {
	GridModule,
	ColumnListModule,
	ColumnModule,
	DndModule,
	ResizeModule,
	RowModule,
	TemplateModule,
	ThemeModule,
	ToolbarModule,
	VscrollModule,
	LayerModule,
} from '@qgrid/ngx';

import {
	ActionBarModule,
	ActionModule,
	AutoCompleteEditorModule,
	BackdropModule,
	BoolEditorModule,
	CaptionModule,
	CellEditorModule,
	ColumnChooserModule,
	ColumnFilterModule,
	ColumnSortModule,
	CommandModule,
	DataManipulationModule,
	EbModule,
	EditFormModule,
	ExportModule,
	FileModule,
	FocusModule,
	ImportModule,
	LayoutModule,
	LegendModule,
	LiveCellModule,
	LiveColumnModule,
	LiveRowModule,
	PagerModule,
	PaneModule,
	PersistenceModule,
	PipeModule,
	ProgressModule,
	QueryBuilderModule,
	ReferenceEditorModule,
	RestModule,
	StatusBarModule,
	TabTrapModule,
	TitleModule,
	ValidationModule,
	VisibilityModule,
} from '@qgrid/ngx-plugins';

@NgModule({
	exports: [
		GridModule,
		ColumnListModule,
		ColumnModule,
		ToolbarModule,
		RowModule,
		VscrollModule,
		ThemeModule,
		ResizeModule,
		DndModule,
		TemplateModule,

		ActionBarModule,
		ActionModule,
		AutoCompleteEditorModule,
		BackdropModule,
		BoolEditorModule,
		CaptionModule,
		CellEditorModule,
		ColumnChooserModule,
		ColumnFilterModule,
		ColumnSortModule,
		CommandModule,
		DataManipulationModule,
		EbModule,
		EditFormModule,
		ExportModule,
		FileModule,
		FocusModule,
		ImportModule,
		LayerModule,
		LayoutModule,
		LegendModule,
		LiveCellModule,
		LiveColumnModule,
		LiveRowModule,
		PagerModule,
		PaneModule,
		PersistenceModule,
		PipeModule,
		ProgressModule,
		QueryBuilderModule,
		ReferenceEditorModule,
		RestModule,
		StatusBarModule,
		TabTrapModule,
		TitleModule,
		ValidationModule,
		VisibilityModule,
	],
})
export class Ng2GridModule {
}
