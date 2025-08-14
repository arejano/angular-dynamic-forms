import { CommonModule } from "@angular/common";
import { Component, Inject, Optional } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-select-field",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./select-field.component.html",
  styleUrl: "./select-field.component.scss",
})
export class SelectFieldComponent {
  public fieldId: string;

  constructor(
    @Inject(FormControl) public control: FormControl,
    @Optional() @Inject("options") public options?: any[],
    @Optional() @Inject("name") public fieldName?: string,
    @Optional() @Inject("placeholder") public placeholder?: string,
  ) {
    if (!this.options) {
      this.options = [];
    }
    // Usar sempre o fieldName como ID para garantir consistência com os labels
    this.fieldId = this.fieldName!;
  }
}
