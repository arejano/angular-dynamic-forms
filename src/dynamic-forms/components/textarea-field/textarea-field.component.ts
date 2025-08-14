import { Component, Inject, Optional } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-textarea-field",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./textarea-field.component.html",
  styleUrl: "./textarea-field.component.scss",
})
export class TextareaFieldComponent {
  public fieldId: string;
  public currentCharCount: number = 0;
  public currentWordCount: number = 0;
  public maxLength: number | null = null;

  constructor(
    @Inject(FormControl) public control: FormControl,
    @Optional() @Inject("name") public fieldName?: string,
    @Optional() @Inject("placeholder") public placeholder?: string,
    @Optional() @Inject("max") public maxLengthValue?: number,
  ) {
    // Usar sempre o fieldName como ID para garantir consistência com os labels
    this.fieldId = this.fieldName!;
    console.log(`tamano maximo`, this.maxLength)
    this.maxLength = this.maxLengthValue || null;

    // Inicializar contadores com valor atual
    this.updateCounts(this.control.value || "");

    // Observar mudanças no valor para atualizar contadores
    this.control.valueChanges.subscribe((value: string) => {
      this.updateCounts(value || "");
    });
  }

  private updateCounts(text: string): void {
    this.currentCharCount = text.length;
    this.currentWordCount = this.countWords(text);
  }

  private countWords(text: string): number {
    if (!text || text.trim().length === 0) {
      return 0;
    }
    return text.trim().split(/\s+/).length;
  }

  public getCharCountStatus(): "normal" | "warning" | "danger" {
    if (!this.maxLength) return "normal";

    const percentage = (this.currentCharCount / this.maxLength) * 100;
    if (percentage >= 95) return "danger";
    if (percentage >= 80) return "warning";
    return "normal";
  }

  public isNearLimit(): boolean {
    return this.getCharCountStatus() !== "normal";
  }

  public getRemainingChars(): number {
    return this.maxLength ? this.maxLength - this.currentCharCount : 0;
  }
}
