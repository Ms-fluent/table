import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsTable} from './table';
import {MsTableCell} from './table-cell';
import {MsTableRow } from './table-row';
import {MsTableHead, MsTableHeadDef} from './table-head';
import {MsTableHeadCell} from './table-head-cell';
import {MsTableRowDef} from './table-row-def';

@NgModule({
  imports: [CommonModule],
  declarations: [MsTable, MsTableCell, MsTableRow, MsTableHead, MsTableHeadCell,
    MsTableRowDef, MsTableHeadDef],

  exports: [MsTable, MsTableCell, MsTableRow, MsTableHead, MsTableHeadCell,
    MsTableRowDef, MsTableHeadDef]
})
export class MsTableModule {
}
