import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Formio } from '@formio/angular';
import dataGridPager from './customComponent/dataGridPager/DataGridPager';
import { dataGridPagerTemplate } from './customComponent/templates/form';

Formio.use({
	components: {
		dataGridPager,
	},
	templates: {
		bootstrap: {
			dataGridPager: {
				form: dataGridPagerTemplate,
			},
		},
	},
});

bootstrapApplication(AppComponent, appConfig).catch((err) =>
	console.error(err)
);
