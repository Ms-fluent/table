import {Component, ViewChild} from '@angular/core';
import {ELEMENT_DATA, PeriodicElement} from '../../element';
import {MsTable} from '../../components/table';

@Component({
  templateUrl: 'home.component.html'
})
export class HomeComponent {
  title = 'ng-fluent';

  letters = 'abcdefghijklmnoprstuvwxyz'.toUpperCase().split('');

  elements = ELEMENT_DATA;

  @ViewChild('table')
  msGrid: MsTable<PeriodicElement>;


  getFilterFn(type: string): (x: PeriodicElement) => boolean {
    return (x: PeriodicElement) => x.type === type;
  }

  filter(category: string) {
    this.msGrid.filter(this.getFilterFn(category));
  }

  filterByLetter(letter: string) {
    this.msGrid.filter(x => x.name.toUpperCase().indexOf(letter) > -1);
  }
}
