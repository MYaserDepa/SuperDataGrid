import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Formio } from '@formio/angular';
import dataGridPager from './customcomponent/dataGridPager/DataGridPager';
import sortAndFilter from './customcomponent/sortAndFilter/SortAndFilter';
import { sortAndFilterTemplate } from './customcomponent/templates/form';
import { dataGridPagerTemplate } from './customcomponent/templates/form';

Formio.use({
	components: {
		dataGridPager,
		sortAndFilter,
	},
	templates: {
		bootstrap: {
			dataGridPager: {
				form: dataGridPagerTemplate,
			},
			sortAndFilter: {
				form: sortAndFilterTemplate,
			},
		},
	},
});

bootstrapApplication(AppComponent, appConfig).catch((err) =>
	console.error(err)
);
