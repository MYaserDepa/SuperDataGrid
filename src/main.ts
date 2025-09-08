import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Formio } from '@formio/angular';
import dataPager from './customComponent/dataPager/DataPager';
import { dataPagerTemplate } from './customComponent/templates/form';

Formio.use({
	components: {
		dataPager,
	},
	templates: {
		bootstrap: {
			dataPager: {
				form: dataPagerTemplate,
			},
		},
	},
});

bootstrapApplication(AppComponent, appConfig).catch((err) =>
	console.error(err)
);
