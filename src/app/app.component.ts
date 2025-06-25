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
    window.onload = () => {
      Formio.createForm(document.getElementById('formio'), 'https://urtplhhekwrngij.form.io/email');
    };
  }

  onChange(event: any) {
    this.jsonElement!.nativeElement.innerHTML = '';
    this.jsonElement!.nativeElement.appendChild(document.createTextNode(JSON.stringify(event.form, null, 4)));
  }
}
