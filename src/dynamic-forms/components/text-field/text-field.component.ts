import { Component, Inject, Optional } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "text-field",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./text-field.component.html",
  styleUrl: "./text-field.component.scss",
})
export class TextFieldComponent {
  public fieldId: string;

  constructor(
    @Inject(FormControl) public control: FormControl,
    @Optional() @Inject("name") public fieldName?: string,
    @Optional() @Inject("placeholder") public placeholder?: string,
  ) {
    this.fieldId = this.fieldName!;
  }
}
