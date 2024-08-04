import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'itemOpt',
  standalone: true
})
export class ItemOptPipe implements PipeTransform {

  transform(value: { [key: string]: any }): string {
    if (!value || typeof value !== 'object') {
      return '';
    }

    let result = '';
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        console.log(key)
        if(key == 'name') result += `<span> ${value[key]}</span>`;
        else result += `<span>${key} </span> <span> ${value[key]}</span>`;
      }
    }
    return result;
  }

}
