import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Formio } from '@formio/angular';
import rating from './customcomponent/rating/Rating';
import { ratingTemplate } from './customcomponent/templates/form';
import dataPager from './customcomponent/dataPager/DataPager';
import { dataPagerTemplate } from './customcomponent/templates/form';

Formio.use({
	components: {
		rating,
		dataPager,
	},
	templates: {
		bootstrap: {
			dataPager: {
				form: dataPagerTemplate,
			},
			rating: {
				form: ratingTemplate,
			},
		},
	},
});

bootstrapApplication(AppComponent, appConfig).catch((err) =>
	console.error(err)
);
