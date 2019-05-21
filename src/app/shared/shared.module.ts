import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StarComponent } from './validators/star.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    StarComponent
  ],
  imports: [],
  exports: [
    HttpClientModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    StarComponent
  ]
})
export class SharedModule { }
