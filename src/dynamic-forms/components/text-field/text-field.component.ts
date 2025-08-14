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
    // Usar sempre o fieldName como ID para garantir consistência com os labels
    console.log(this.fieldName, this.placeholder)
    this.fieldId = this.fieldName!;
  }
}
