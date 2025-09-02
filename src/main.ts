import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Formio } from '@formio/angular';
import dataPager from './customcomponent/dataPager/DataPager';
import {dataPagerTemplate} from './customcomponent/templates/form';

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
