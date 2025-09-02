import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilderComponent, FormioModule } from '@formio/angular';
import { Formio } from '@formio/angular';
import bootstrap4 from '@formio/bootstrap/bootstrap4';
(Formio as any).use(bootstrap4);

@Component({
	selector: 'app-root',
	imports: [FormioModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class AppComponent {
	@ViewChild('json') jsonElement?: ElementRef;
	@ViewChild('builderRef') builderComponent?: FormBuilderComponent;
	public form: Object = {
		components: [],
	};

	// Used with the form builder
	onChange(event: any) {
		this.jsonElement!.nativeElement.innerHTML = '';
		this.jsonElement!.nativeElement.appendChild(
			document.createTextNode(JSON.stringify(event.form, null, 4))
		);

		// Renders the form currently being built in the form builder
		Formio.createForm(document.getElementById('formio'), {
			components: [
				{
					label: 'Data Grid',
					key: 'dataGrid',
					type: 'datagrid',
					input: true,
					components: [
						{
							label: 'Text Field',
							key: 'textField',
							type: 'textfield',
							input: true,
						},
						{
							label: 'Text Field',
							key: 'textField1',
							type: 'textfield',
							input: true,
						},
					],
				},
				{ type: 'button', label: 'Submit', key: 'submit', input: true },
			],
		}).then((form: any) => {
			const dataGrid = form.getComponent('dataGrid');
			// console.log(dataGrid);
			dataGrid.on('change', (event: any) => {
				console.log('Data Grid changed:', event);
			});
		});
	}
}
