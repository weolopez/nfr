import { Pipe } from "@angular/core";


@Pipe({
  name: "sort"
})
export class SortPipe {
  transform(array: Array<any>, args: string): Array<any> {
  if (!array || array === undefined || array.length === 0) return null;
    return array.filter(u=>u.seasons?.find(s => s.id == args)).sort((a: any, b: any) => {
      const aorder = a.seasons?.find(s => s.id == args).order
      const border = b.seasons?.find(s => s.id == args).order
      if (aorder < border) {
        return -1;
      } else if (aorder > border) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}