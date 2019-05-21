import { NgModule } from '@angular/core';
import { CustomerShellComponent } from './containers/customer-shell/customer-shell.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CustomerShellComponent],
  imports: [
    SharedModule
  ]
})
export class CustomerModule { }
