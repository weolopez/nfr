import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: "sort"
})
export class OrderDatePipe {
  transform(array: Array<any>, args: string): Array<any> {
    if (!array) return [];
    return this.sortByMonth(array);

    array.sort((a: any, b: any) => {
      if (a.date < b.date) {
        return -1;
      } else if (a.date > b.date) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }

  sortByMonth(arr) {
    var months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
     arr.sort(function(a, b){
        let ma=a.date.split(',')[1].trim(); 
        let mb=b.date.split(',')[1].trim();
        return months.indexOf(a.date.split(',')[1].trim())
             - months.indexOf(b.date.split(',')[1].trim());
    });
    return arr;
  }
}