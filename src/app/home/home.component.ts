import {Component, ViewChild} from '@angular/core';
import {ELEMENT_DATA, PeriodicElement} from '../../element';
import {MsTable} from '../../components/table';

@Component({
  templateUrl: 'home.component.html'
})
export class HomeComponent {
  title = 'ng-fluent';

  letters = 'abcdefghijklmnoprstuvwxyz'.toUpperCase().split('');

  elements = ELEMENT_DATA.slice(0, 10);

  columns: string[] = ['#'];

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

  loadAll() {
    console.log('load all data');
    this.elements = ELEMENT_DATA.slice();
  }

  toggleColumnByName(value: string) {
    if (this.columns.indexOf(value) >= 0) {
      this.columns = this.columns.filter(c => c !== value);
    } else {
      this.columns.push(value);
      this.columns = this.columns.slice();
    }

    console.log(this.columns);
  }

  selectedColumn(value: string) {
    return this.columns.indexOf(value) >= 0;
  }
}
