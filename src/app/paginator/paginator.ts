import {Subject} from 'rxjs';

export class Paginator<T> {
  change: Subject<void>;

  totalSize: number;
  pageSize: number;


}
