import {InjectionToken} from '@angular/core';

export const MS_TABLE_TOKEN = new InjectionToken<MsTableContract<any>>('MS_TABLE_TOKEN');

export interface MsTableContract<T> {
  id: string;

  sort(compareFn?: (a: T, b: T) => number);

  reverse();

  remove(item: T);

  resetSortColumn();
}
