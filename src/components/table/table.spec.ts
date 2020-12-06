import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MsTableModule} from './table.module';
import {ELEMENT_DATA, PeriodicElement} from '../../element';
import {Component, DebugElement} from '@angular/core';
import {MsTable} from './table';
import {MsTableRow} from './table-row';
import {MsTableHeadCell} from './table-head-cell';
import {By} from '@angular/platform-browser';

describe('Table component', () => {
  let fixture: ComponentFixture<TableTestComponent>;
  let tableDebugElement: DebugElement;

  let tableRowDebugElements: DebugElement[];
  let tableColumnDebugElements: DebugElement[];
  let tableRowElements: HTMLElement[];

  let testComponent: TableTestComponent;
  let tableInstance: MsTable;
  let tableRowInstances: MsTableRow[];
  let tableColumnInstances: MsTableHeadCell[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableTestComponent],
      imports: [MsTableModule]
    });
    TestBed.compileComponents();

    fixture = TestBed.createComponent(TableTestComponent);
    fixture.detectChanges();

    testComponent = fixture.componentInstance;
    tableDebugElement = fixture.debugElement.query(By.directive(MsTable));
    tableInstance = tableDebugElement.componentInstance;

    tableColumnDebugElements = fixture.debugElement.queryAll(By.directive(MsTableHeadCell));
    tableColumnInstances = tableColumnDebugElements.map(el => el.componentInstance);

    tableRowDebugElements = fixture.debugElement.queryAll(By.directive(MsTableRow));
    tableRowInstances = tableRowDebugElements.map(el => el.componentInstance);
    tableRowElements = tableRowDebugElements.map(el => el.nativeElement);
  });
  it('check table state and attribute', () => {
    expect(tableInstance).toBeDefined();
    expect(tableInstance.id).toBe('ms-table-0');
    expect(tableInstance._uniqueId).toBe('ms-table-0');


    fixture.whenStable().then(() => {
      console.log(tableInstance.host);
    });

    expect(tableInstance.host.className).toBe('ms-table');
    expect(tableInstance.host.getAttribute('role')).toBe('grid');
    expect(tableInstance.host.getAttribute('id')).toBe(tableInstance.id);
    expect(tableInstance.host.getAttribute('dir')).toBe(tableInstance.dir);
    expect(tableInstance.host.getAttribute('aria-describedby')).toBe(tableInstance.ariaDescribedby);
    expect(tableInstance.host.getAttribute('aria-labelledby')).toBe(tableInstance.ariaLabelledby);
    expect(tableInstance.host.getAttribute('aria-label')).toBe(tableInstance.ariaLabel);
    expect(tableInstance.host.getAttribute('aria-rowcount')).toBe(tableInstance.ariaRowCount.toString());
    expect(tableInstance.host.getAttribute('aria-colcount')).toBe(tableInstance.ariaColCount.toString());
  });


});


@Component({
  selector: 'table-test',
  template: `
      <MsTable #table [data]="elements"
               ariaDescribedby="describedBy"
               ariaLabelledby="labelledBy"
               ariaLabel="label" style="height: 300px">
          <tr *ms-tableHeadDef ms-tableHead>
              <th *ms-tableHeadCellDef ms-tableHeadCell name="#">#</th>
              <th *ms-tableHeadCellDef ms-tableHeadCell name="id">Id</th>
              <th *ms-tableHeadCellDef ms-tableHeadCell>Position</th>
              <th *ms-tableHeadCellDef ms-tableHeadCell>Name</th>
              <th *ms-tableHeadCellDef ms-tableHeadCell>Weight</th>
              <th *ms-tableHeadCellDef ms-tableHeadCell>Symbol</th>
              <th *ms-tableHeadCellDef ms-tableHeadCell>Type</th>
          </tr>

          <tr *ms-tableRowDef="let row of elements; let item; let i=index" ms-tableRowContent>
              <td *ms-tableCellDef ms-tableCell>{{i + 1}}</td>
              <td *ms-tableCellDef ms-tableCell>{{row.id}}</td>
              <td *ms-tableCellDef ms-tableCell>{{row.position}}</td>
              <td *ms-tableCellDef ms-tableCell>{{row.name}}</td>
              <td *ms-tableCellDef ms-tableCell>{{row.weight}}</td>
              <td *ms-tableCellDef ms-tableCell>{{row.symbol}}</td>
              <td *ms-tableCellDef ms-tableCell>{{row.type}}</td>
          </tr>
      </MsTable>
  `
})
export class TableTestComponent {

  elements: PeriodicElement[] = ELEMENT_DATA.slice(0, 10);
}
