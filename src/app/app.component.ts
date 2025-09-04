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
		// Form renderer
		Formio.createForm(
			document.getElementById('formio-renderer'),
			event.form
		).then((form: any) => {
			form.on('submit', (submission: any) => {
				// localStorage.setItem('submissionData', JSON.stringify(submission.data));
				// localStorage.setItem('formBuilderData', JSON.stringify(event.form));
			});
		});
	}

	onSubmit(event: any) {
		console.log(this.builderComponent?.form);
	}
}
