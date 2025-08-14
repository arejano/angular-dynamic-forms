import { Component, Inject, Optional } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-number-field",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./number-field.component.html",
  styleUrl: "./number-field.component.scss",
})
export class NumberFieldComponent {
  public fieldId: string;

  constructor(
    @Inject(FormControl) public control: FormControl,
    @Optional() @Inject("name") public fieldName?: string,
    @Optional() @Inject("min") public min?: number,
    @Optional() @Inject("max") public max?: number,
  ) {
    // Usar sempre o fieldName como ID para garantir consistência com os labels
    this.fieldId = this.fieldName!;
  }
}
