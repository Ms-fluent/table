import {Directive, DoCheck, EventEmitter, Input, OnInit, TemplateRef} from '@angular/core';

@Directive({
  selector: '[ms-tableRowDef], [MsTableRowDef]'
})
export class MsTableRowDef<T> implements DoCheck, OnInit {
  @Input('ms-tableRowDefOf')
  data: Array<T>;

  _oldData: Array<T>;

  ondatachange: EventEmitter<void> = new EventEmitter<void>();

  constructor(public template: TemplateRef<MsTableRowContext<T>>) {
  }

  ngDoCheck(): void {

    if (this._oldData === this.data) {

    } else {
      this._oldData = this.data;
      this.ondatachange.emit();
    }
  }

  ngOnInit(): void {
    if (this.data == null) {
      throw new Error('Can\'t create table with null value!');
    }
    this._oldData = this.data;
  }
}

export class MsTableRowContext<T> {
  odd: boolean;
  even: boolean;
  first: boolean;
  last: boolean;

  coord: DOMRect;
  visible: boolean = true;

  constructor(public $implicit: T,
              public index: number, total: number) {
    this.setData(index, total);
  }

  setData(index: number, total: number) {
    this.index = index;
    this.odd = index % 2 === 1;
    this.even = !this.odd;
    this.first = index === 0;
    this.last = index === total - 1;
  }
}
