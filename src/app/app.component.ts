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
	currentPage = 0;
	pages: any[] = [];

	// Used with the form builder
	onChange(event: any) {
		this.jsonElement!.nativeElement.innerHTML = '';
		this.jsonElement!.nativeElement.appendChild(
			document.createTextNode(JSON.stringify(event.form, null, 4))
		);

		// Form renderer
		let jsonSchema = JSON.parse(this.jsonElement!.nativeElement.innerHTML);
		Formio.createForm(document.getElementById('formio'), jsonSchema);
	}
}
