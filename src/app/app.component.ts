import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormioModule } from '@formio/angular';
import { Formio } from '@formio/angular';
import bootstrap4 from '@formio/bootstrap/bootstrap4';
(Formio as any).use(bootstrap4);

@Component({
  selector: 'app-root',
  imports: [FormioModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'formio-test';

  @ViewChild('json') jsonElement?: ElementRef;
  public form: Object = {
    components: []
  };

  ngAfterViewInit() {
    let submissionData;

    // My email testing form on my form.io account
    Formio.createForm(document.getElementById('formio'), 'https://urtplhhekwrngij.form.io/email');

    // Rendering the email form with the user's submission data after clicking submit 
    Formio.createForm(document.getElementById('formio'), 'https://urtplhhekwrngij.form.io/email')
      .then((form: any) => {
        form.on('submitDone', (submission: any) => {
          this.renderSubmission(submission)
        })
      });
  }

  renderSubmission(submissionData: any) {
    console.log(submissionData)
    Formio.createForm(document.getElementById('formio'), 'https://urtplhhekwrngij.form.io/email')
      .then((form: any) => {
        form.submission = submissionData
      });
  }

  // Used with the form builder
  onChange(event: any) {
    this.jsonElement!.nativeElement.innerHTML = '';
    this.jsonElement!.nativeElement.appendChild(document.createTextNode(JSON.stringify(event.form, null, 4)));

    let jsonSchema = JSON.parse(this.jsonElement!.nativeElement.innerHTML)
    Formio.createForm(document.getElementById('formio'), jsonSchema);
  }
}