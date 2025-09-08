import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
export class AppComponent implements AfterViewInit {
	@ViewChild('json') jsonElement?: ElementRef;
	@ViewChild('builderRef') builderComponent?: FormBuilderComponent;
	public form: Object = {
		components: [],
	};

	ngAfterViewInit(): void {
		const savedForm = localStorage.getItem('formBuilderData');
		if (savedForm) {
			this.form = JSON.parse(savedForm);

			Formio.createForm(
				document.getElementById('formio-renderer'),
				this.form
			).then((form: any) => {
				// Load previous submission
				const submissionData = localStorage.getItem('submissionData');
				if (submissionData) {
					form.submission = { data: JSON.parse(submissionData) };
				}

				// Attach submit listener
				form.on('submit', (submission: any) => {
					form.getComponents().forEach((comp: any) => {
						if (
							comp.component.type === 'dataPager' &&
							typeof comp.getAllGridRows === 'function'
						) {
							const [allGridRows, targetComponentKey] = comp.getAllGridRows(); // fetch full dataset
							submission.data[targetComponentKey] = allGridRows;
						}
					});

					localStorage.setItem(
						'submissionData',
						JSON.stringify(submission.data)
					);
					localStorage.setItem('formBuilderData', JSON.stringify(this.form));
				});
			});
		}
	}

	onChange(event: any) {
		// Form renderer
		Formio.createForm(
			document.getElementById('formio-renderer'),
			event.form
		).then((form: any) => {
			// On form submit in form renderer
			form.on('submit', (submission: any) => {
				form.getComponents().forEach((comp: any) => {
					if (
						comp.component.type === 'dataPager' &&
						typeof comp.getAllGridRows === 'function'
					) {
						const [allGridRows, targetComponentKey] = comp.getAllGridRows(); // fetch full dataset
						submission.data[targetComponentKey] = allGridRows;
					}
				});

				localStorage.setItem('submissionData', JSON.stringify(submission.data));
				localStorage.setItem('formBuilderData', JSON.stringify(event.form));
			});
		});
	}
}
