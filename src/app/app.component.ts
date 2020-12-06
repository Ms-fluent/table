import {Component} from '@angular/core';
import {ELEMENT_DATA} from '../element';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-fluent';

  elements = ELEMENT_DATA;
}
