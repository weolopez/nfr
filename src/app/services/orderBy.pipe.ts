import { Pipe } from "@angular/core";


@Pipe({
  name: "sort"
})
export class TodosSortPipe {
  transform(array: Array<any>, args: string): Array<any> {
    array.sort((a: any, b: any) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}