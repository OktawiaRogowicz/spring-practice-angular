import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'i18';

  public languageArray = ['English', 'Polski'];

  constructor(private translate: TranslateService, ) {
    this.translate.use('English');
  }

  changeLang(lang: string) {
    this.translate.use(lang);
    console.log("d bsbsdbds");
  }
}