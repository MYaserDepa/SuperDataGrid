import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Formio } from '@formio/angular';
import dataGridPlus from './customcomponent/dataGridPlus/DataGridPlus';
import { dataGridPlusTemplate } from './customcomponent/templates/form';

Formio.use({
	components: {
		dataGridPlus,
	},
	templates: {
		bootstrap: {
			dataGridPlus: {
				form: dataGridPlusTemplate
			},
		},
	},
});

bootstrapApplication(AppComponent, appConfig).catch((err) =>
	console.error(err)
);
