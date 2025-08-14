import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { TextFieldComponent } from './components/text-field/text-field.component';



@NgModule({
  declarations: [
    DynamicFormComponent,
    TextFieldComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class DynamicFormsModule { }
