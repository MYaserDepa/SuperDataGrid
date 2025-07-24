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
					reorder: false,
					addAnotherPosition: 'bottom',
					layoutFixed: false,
					enableRowGroups: false,
					initEmpty: false,
					tableView: false,
					defaultValue: [{}],
					validateWhenHidden: false,
					key: 'dataGrid',
					type: 'datagrid',
					input: true,
					components: [
						{
							label: 'Text Field',
							applyMaskOn: 'change',
							tableView: true,
							validateWhenHidden: false,
							key: 'textField',
							type: 'textfield',
							input: true,
						},
						{
							label: 'Text Field',
							applyMaskOn: 'change',
							tableView: true,
							validateWhenHidden: false,
							key: 'textField1',
							type: 'textfield',
							input: true,
						},
					],
				},
				{
					type: 'button',
					label: 'Submit',
					key: 'submit',
					disableOnInvalid: true,
					input: true,
					tableView: false,
				},
			],
		}).then((form: any) => {
			const dataGrid = form.getComponent('dataGrid');
			form.on(
				'componentChanged',
				(instance: any, component: any, value: any, flags: any) => {
					console.log(instance);
					console.log(component);
					console.log(value);
					console.log(flags);
				}
			);
		});

		// Formio.createForm(document.getElementById('formio'), event.form).then(
		// 	(form: any) => {
		// 		form.on('change', (changed: any) => {
		// 			const grid = form.getComponent('dataGrid');
		// 			console.log(grid.components);
		// 		});
		// 	}
		// );
	}
}
// ngAfterViewInit() {
// 	let submissionData;

// 	// My email testing form on my form.io account
// 	Formio.createForm(
// 		document.getElementById('formio'),
// 		'https://urtplhhekwrngij.form.io/email'
// 	);

// 	// Rendering the email form with the user's submission data after clicking submit
// 	Formio.createForm(
// 		document.getElementById('formio'),
// 		'https://urtplhhekwrngij.form.io/email'
// 	).then((form: any) => {
// 		form.on('submitDone', (submission: any) => {
// 			this.renderSubmission(submission);
// 		});
// 	});
// }
//
// renderSubmission(submissionData: any) {
// 	console.log(submissionData);
// 	Formio.createForm(
// 		document.getElementById('formio'),
// 		'https://urtplhhekwrngij.form.io/email'
// 	).then((form: any) => {
// 		form.submission = submissionData;
// 	});
// }
