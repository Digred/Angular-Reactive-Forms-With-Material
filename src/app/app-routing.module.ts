import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerShellComponent } from './customer/containers/customer-shell/customer-shell.component';
import { WelcomeComponent } from './home/welcome.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'first-part', component: CustomerShellComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: '**', redirectTo: 'welcome', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
