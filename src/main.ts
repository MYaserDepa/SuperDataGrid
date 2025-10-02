import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Formio } from '@formio/angular';
import dataGridPlus from './customcomponent/dataGridPlus/DataGridPlus';
import dataGridPager from './customcomponent/dataGridPager/DataGridPager';
import sortAndFilter from './customcomponent/sortAndFilter/SortAndFilter';
import { dataGridPlusTemplate, dataGridPagerTemplate, sortAndFilterTemplate } from './customcomponent/templates/form';

Formio.use({
	components: {
		dataGridPlus,
		dataGridPager,
		sortAndFilter,
	},
	templates: {
		bootstrap: {
			dataGridPlus: {
				form: dataGridPlusTemplate
			},
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
