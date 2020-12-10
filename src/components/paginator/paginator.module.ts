import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsPaginator} from './paginator';
import {MsPaginatorPageDef} from './page-def';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ MsPaginator, MsPaginatorPageDef ],
  exports: [ MsPaginator, MsPaginatorPageDef ]
})
export class MsPaginatorModule {}
