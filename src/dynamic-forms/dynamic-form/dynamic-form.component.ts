import { CommonModule } from "@angular/common";
import {
  Component,
  InjectionToken,
  Injector,
  StaticProvider,
  ChangeDetectorRef,
  Input,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { TextFieldComponent } from "../components/text-field/text-field.component";
import { NumberFieldComponent } from "../components/number-field/number-field.component";
import { TextareaFieldComponent } from "../components/textarea-field/textarea-field.component";
import { SelectFieldComponent } from "../components/select-field/select-field.component";
import { MultiSelectFieldComponent } from "../components/multi-select-field/multi-select-field.component";
import { FormDataDTO, FormField } from "../models";

// Interfaces para tipagem dos campos
@Component({
  selector: "app-dynamic-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextFieldComponent,
    NumberFieldComponent,
    TextareaFieldComponent,
    SelectFieldComponent,
    MultiSelectFieldComponent,
  ],
  templateUrl: "./dynamic-form.component.html",
  styleUrls: ["./dynamic-form.component.scss"],
})
export class DynamicFormComponent {
  started: boolean = false;
  @Input() scheme: FormField[][] = []

  // Map de tokens para cada chave
  dynamicTokens = new Map<string, InjectionToken<any>>();

  // Cache de injectors para evitar re-criação dos componentes
  fieldInjectorsCache = new Map<string, Injector>();

  componentMap: Record<string, any> = {
    text: TextFieldComponent,
    number: NumberFieldComponent,
    textarea: TextareaFieldComponent,
    select: SelectFieldComponent,
    multiselect: MultiSelectFieldComponent,
  };

  form?: FormGroup;

  // Propriedades para controle de edição
  private originalFormData: any = {};
  public currentFormData: FormDataDTO | null = null;
  public isEditMode: boolean = false;
  public hasChanges: boolean = false;

  constructor(
    private fb: FormBuilder,
    private injector: Injector,
    private cdr: ChangeDetectorRef,
  ) {
  }

  start(scheme: FormField[][]) {
    this.scheme = scheme;
    this.form = this.fb.group({});
    this.scheme.forEach((row) => {
      row.forEach((field) => {
        const validators = this.mapValidators((field as any).validators);

        // Para campos multiselect, garantir que o valor inicial seja um array
        let initialValue = field.value;
        if (field.type === "multiselect") {
          initialValue = Array.isArray(field.value) ? field.value : [];
        }

        this.form.addControl(
          field.name,
          new FormControl(initialValue, validators),
        );
      });
    });

    // Observar mudanças no formulario para detectar alteracoes
    this.form.valueChanges.subscribe(() => {
      // Usar setTimeout para garantir que a mudanca seja processada
      setTimeout(() => {
        this.checkForChanges();
      }, 0);
    });

    // Tambem observar mudancas em status (dirty, touched)
    this.form.statusChanges.subscribe(() => {
      if (this.isEditMode) {
        setTimeout(() => {
          this.checkForChanges();
        }, 0);
      }
    });
    this.started = true;
  }

  createFieldInjector(field: FormField) {
    const cacheKey = field.name;

    if (this.fieldInjectorsCache.has(cacheKey)) {
      return this.fieldInjectorsCache.get(cacheKey)!;
    }
    const providers: StaticProvider[] = [
      { provide: FormControl, useValue: this.form?.get(field.name) },
    ];

    Object.keys(field).forEach((key) => {
      if (!["type", "value"].includes(key)) {
        // Para o SelectFieldComponent, usar string literal como token
        providers.push({ provide: key, useValue: field[key] });
      }
    });

    const injector = Injector.create({
      providers,
      parent: this.injector,
    });
    this.fieldInjectorsCache.set(cacheKey, injector);
    return injector;
  }

  getFieldId(field: FormField): string {
    return field.name;
  }

  generateFieldId(
    fieldName: string,
    fieldType: string,
    rowIndex: number,
    fieldIndex: number,
  ): string {
    return `${fieldType}-${fieldName}-row${rowIndex}-field${fieldIndex}`;
  }

  private mapValidators(validators?: (string | any)[]): any[] {
    if (!validators) return [];
    const map: any[] = [];

    validators.forEach((v) => {
      // Se for uma função de validação do Angular (Validators.required, etc)
      if (typeof v === "function") {
        map.push(v);
        return;
      }
      if (typeof v === "string") {
        if (v === "required") map.push(Validators.required);
        if (v === "email") map.push(Validators.email);

        if (v.startsWith("minLength:")) {
          const len = +v.split(":")[1];
          map.push(Validators.minLength(len));
        }
        if (v.startsWith("maxLength:")) {
          const len = +v.split(":")[1];
          map.push(Validators.maxLength(len));
        }
        if (v.startsWith("min:")) {
          const min = +v.split(":")[1];
          map.push(Validators.min(min));
        }
        if (v.startsWith("max:")) {
          const max = +v.split(":")[1];
          map.push(Validators.max(max));
        }
        if (v.startsWith("pattern:")) {
          const pattern = v.split(":")[1];
          map.push(Validators.pattern(pattern));
        }
      }

      // objeto com config customizadas
      if (typeof v === "object" && v !== null) {
        if (v.type === "minLength") map.push(Validators.minLength(v.value));
        if (v.type === "maxLength") map.push(Validators.maxLength(v.value));
        if (v.type === "min") map.push(Validators.min(v.value));
        if (v.type === "max") map.push(Validators.max(v.value));
        if (v.type === "pattern") map.push(Validators.pattern(v.value));
      }
    });

    return map;
  }

  getTokenForKey(key: string): InjectionToken<any> {
    if (!this.dynamicTokens.has(key)) {
      this.dynamicTokens.set(key, new InjectionToken<any>(key));
    }
    return this.dynamicTokens.get(key)!;
  }

  // TrackBy functions para melhorar performance
  trackByRowIndex(index: number): number {
    return index;
  }

  trackByFieldName(index: number, field: FormField): string {
    return field.name || index.toString();
  }

  onFieldFocus(fieldName: string) {
    console.log(`Campo ${fieldName} recebeu foco`);
  }

  onFieldBlur(fieldName: string) {
    console.log(`Campo ${fieldName} perdeu foco`);
  }

  clearInjectorsCache() {
    this.fieldInjectorsCache.clear();
    console.log("Cache de injectors limpo");
  }

  onSubmit() {
    if (this.form.valid && (!this.isEditMode || this.hasChanges)) {
      console.log("✅ Formulário válido - dados enviados:", this.form.value);

      if (this.isEditMode) {
        console.log("🔄 Modo de edição - ID:", this.currentFormData?.hash);
        console.log("📝 Campos alterados:", this.getChangedFields());
        alert(
          `Dados atualizados com sucesso! ID: ${this.currentFormData?.hash}`,
        );
      } else {
        console.log("✨ Modo de criação - novo registro");
        alert("Formulário enviado com sucesso!");
      }

      // Aqui você pode implementar a lógica de envio
      // Por exemplo: this.apiService.saveForm(this.form.value, this.currentFormData?.hash)

      // Atualizar dados originais após salvar (deep copy para arrays)
      this.originalFormData = this.deepCopy(this.form.value);
      this.hasChanges = false;
      this.cdr.detectChanges();
    } else if (this.isEditMode && !this.hasChanges) {
      alert("Nenhuma alteração foi feita.");
    } else {
      console.log(
        "❌ Formulário inválido - erros encontrados:",
        this.getFormErrors(),
      );
      this.form.markAllAsTouched();
      alert("Por favor, corrija os erros antes de enviar.");
    }
  }

  logFormData() {
    console.log(this.form?.value)
  }


  resetForm() {
    if (this.isEditMode) {
      // Se estiver em modo de edição, restaurar valores originais
      this.form.patchValue(this.originalFormData);
      console.log("🔄 Formulário restaurado para valores originais");
    } else {
      // Se for criação, limpar completamente
      this.form.reset();
      console.log("🔄 Formulário resetado");
    }
    this.hasChanges = false;
    this.cdr.detectChanges();
  }

  // Método para obter todos os erros do formulário
  getFormErrors(): any {
    const formErrors: any = {};

    Object.keys(this.form.controls).forEach((key) => {
      const controlErrors = this.form?.get(key)?.errors;
      if (controlErrors) {
        formErrors[key] = controlErrors;
      }
    });

    return formErrors;
  }

  hasFieldError(fieldName: string, errorType: string): boolean {
    const field = this.form?.get(fieldName);
    return !!(field && field.hasError(errorType) && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form?.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return "";
    }

    const errors = field.errors;

    if (errors["required"]) {
      return "Este campo é obrigatório";
    }
    if (errors["minlength"]) {
      return `Mínimo de ${errors["minlength"].requiredLength} caracteres`;
    }
    if (errors["maxlength"]) {
      return `Máximo de ${errors["maxlength"].requiredLength} caracteres`;
    }
    if (errors["min"]) {
      return `Valor mínimo: ${errors["min"].min}`;
    }
    if (errors["max"]) {
      return `Valor máximo: ${errors["max"].max}`;
    }
    if (errors["pattern"]) {
      return "Formato inválido";
    }
    if (errors["email"]) {
      return "Email inválido";
    }

    return "Campo inválido";
  }

  loadFormData(dto: FormDataDTO): void {
    this.currentFormData = dto;
    this.isEditMode = !!(dto.hash && dto.hash !== null);

    const formData: any = {};
    Object.keys(this.form.controls).forEach((fieldName) => {
      if (dto.hasOwnProperty(fieldName)) {
        const fieldValue = dto[fieldName];
        if (Array.isArray(fieldValue)) {
          formData[fieldName] = [...fieldValue];
        } else {
          formData[fieldName] = fieldValue;
        }
      }
    });

    this.form.patchValue(formData);

    this.originalFormData = this.deepCopy(formData);
    this.hasChanges = false;
    this.cdr.detectChanges();
  }

  private checkForChanges(): void {
    if (!this.isEditMode) {
      this.hasChanges = false;
      this.cdr.detectChanges();
      return;
    }

    const currentValues = this.form.value;
    const isEqual = this.deepEqual(this.originalFormData, currentValues);
    const previousHasChanges = this.hasChanges;
    this.hasChanges = !isEqual;

    if (previousHasChanges !== this.hasChanges) {
      this.cdr.detectChanges();
    }
  }

  private deepEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;

    if (obj1 == null && obj2 == null) return true;
    if (obj1 == null || obj2 == null) return false;

    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) return false;

      const sorted1 = [...obj1].sort();
      const sorted2 = [...obj2].sort();

      for (let i = 0; i < sorted1.length; i++) {
        if (sorted1[i] !== sorted2[i]) return false;
      }

      return true;
    }

    if (Array.isArray(obj1) || Array.isArray(obj2)) return false;

    if (typeof obj1 === "object" && typeof obj2 === "object") {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      if (keys1.length !== keys2.length) return false;

      for (const key of keys1) {
        if (!keys2.includes(key)) return false;

        if (!this.deepEqual(obj1[key], obj2[key])) return false;
      }

      return true;
    }

    if (typeof obj1 === "string" || typeof obj2 === "string") {
      const normalizedVal1 = obj1 == null ? "" : obj1;
      const normalizedVal2 = obj2 == null ? "" : obj2;
      return normalizedVal1 === normalizedVal2;
    }

    return obj1 === obj2;
  }

  private deepCopy(obj: any): any {
    if (obj === null || typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => this.deepCopy(item));
    }

    const copy: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        copy[key] = this.deepCopy(obj[key]);
      }
    }

    return copy;
  }

  getChangedFields(): { [key: string]: { from: any; to: any } } {
    if (!this.isEditMode) return {};

    const changes: { [key: string]: { from: any; to: any } } = {};
    const currentValues = this.form.value;

    Object.keys(this.originalFormData).forEach((key) => {
      const originalValue = this.originalFormData[key];
      const currentValue = currentValues[key];

      if (!this.deepEqual(originalValue, currentValue)) {
        changes[key] = {
          from: originalValue,
          to: currentValue,
        };
      }
    });

    return changes;
  }

  isFieldChanged(fieldName: string): boolean {
    if (!this.isEditMode) return false;

    const originalValue = this.originalFormData[fieldName];
    const currentValue = this.form?.get(fieldName)?.value;

    return !this.deepEqual(originalValue, currentValue);
  }

  clearFormData(): void {
    this.currentFormData = null;
    this.isEditMode = false;
    this.originalFormData = {};
    this.hasChanges = false;
    this.form.reset();
    this.cdr.detectChanges();
    console.log("🆕 Formulário em modo de criação");
  }

  getFormStatus(): {
    isEditMode: boolean;
    hasChanges: boolean;
    isValid: boolean;
    canSubmit: boolean;
    entityId?: string | null;
  } {
    return {
      isEditMode: this.isEditMode,
      hasChanges: this.hasChanges,
      isValid: this.form.valid,
      canSubmit: this.form.valid && (!this.isEditMode || this.hasChanges),
      entityId: this.currentFormData?.hash || null,
    };
  }

  loadExampleCreateMode(): void {
    console.log("🆕 Exemplo: Modo de criação");
    this.clearFormData();
  }

  loadExampleEditMode(): void {
    const exampleDTO: FormDataDTO = {
      hash: "0001",
      anoLetivo: "2024",
      redePagamento: "Pensi",
      descricao:
        "Lorem Lorem Lorem",
      pontos: 5,
      redes: "001",
      disciplinas: ["mat", "por", "his"],
      series: ["002"]
    };

    this.loadFormData(exampleDTO);
  }

  loadExamplePartialData(): void {
    console.log("📋 Exemplo: Carregando dados parciais");
    const partialDTO: FormDataDTO = {
      hash: "xyz-789-uvw-012",
      anoLetivo: "2023",
      descricao: "Descrição básica do projeto",
      email: "exemplo@teste.com",
      prioridade: "media",
      disciplinas: ["cie", "geo"],
      habilidades: ["react", "node"],
    };

    this.loadFormData(partialDTO);
  }

  // Método para obter informações sobre campos multiselect
  getMultiSelectInfo(): any {
    const info: any = {};

    this.scheme.forEach((row, rowIndex) => {
      row.forEach((field, fieldIndex) => {
        if (field.type === "multiselect") {
          const control = this.form?.get(field.name);
          const selectedValues = control?.value || [];
          const selectedOptions = field.options.filter((opt) =>
            selectedValues.includes(opt.hash),
          );

          info[field.name] = {
            label: field.label,
            totalOptions: field.options.length,
            selectedCount: selectedValues.length,
            selectedValues: selectedValues,
            selectedDescriptions: selectedOptions.map((opt) => opt.descricao),
            position: { row: rowIndex, field: fieldIndex },
          };
        }
      });
    });

    return info;
  }

  debugFormState(): void {
    console.log("- isEditMode:", this.isEditMode);
    console.log("- hasChanges:", this.hasChanges);
    console.log("- form.dirty:", this.form.dirty);
    console.log("- form.valid:", this.form.valid);
    console.log("- originalFormData:", JSON.stringify(this.originalFormData));
    console.log("- currentFormData:", JSON.stringify(this.form.value));
    console.log("- changedFields:", this.getChangedFields());
    console.log("- formStatus:", this.getFormStatus());

    Object.keys(this.form.controls).forEach((fieldName) => {
      const control = this.form?.get(fieldName);
      const currentValue = control?.value;

      if (Array.isArray(currentValue)) {
        console.log(`- Campo array "${fieldName}":`);
        console.log(
          `  Original: ${JSON.stringify(this.originalFormData[fieldName])}`,
        );
        console.log(`  Atual: ${JSON.stringify(currentValue)}`);
        console.log(`  Alterado: ${this.isFieldChanged(fieldName)}`);
        console.log(`  Dirty: ${control?.dirty}`);
        console.log(`  Touched: ${control?.touched}`);
      }
    });

    // Forçar detecção de mudanças para refletir visualmente
    this.checkForChanges();
  }
}
