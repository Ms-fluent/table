import {Directive, TemplateRef} from '@angular/core';
import {MsPage} from './page';

@Directive({
  selector: '[ms-paginatorPageDef], [msPaginatorPageDef]'
})
export class MsPaginatorPageDef<T> {
  constructor(public template: TemplateRef<MsPage<T>>) {
  }
}
