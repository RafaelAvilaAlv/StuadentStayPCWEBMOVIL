import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], buscar: string): any[] {
    if (!items || !buscar) {
      return items;
    }

    buscar = buscar.toLowerCase();

    return items.filter(item => {
      const cedulaString = (item.clienteInfo?.cedula_persona !== undefined)
        ? item.clienteInfo.cedula_persona.toString()
        : '';
      const otroCampo = (item.otroCampo !== undefined) ? item.otroCampo : '';

      return cedulaString.includes(buscar) || otroCampo.toLowerCase().includes(buscar);
    });
  }

}
