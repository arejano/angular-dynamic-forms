import { CommonModule } from "@angular/common";
import {
  Component,
  InjectionToken,
  Injector,
  StaticProvider,
  ChangeDetectorRef,
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

// Interfaces para tipagem dos campos
interface BaseField {
  type: string;
  value: string | number | string[];
  name: string;
  label: string;
  placeholder?: string;
  validators?: (string | any)[];
}

interface TextField extends BaseField {
  type: "text";
  value: string;
}

interface NumberField extends BaseField {
  type: "number";
  value: number | string;
  min?: number;
  max?: number;
}

interface SelectField extends BaseField {
  type: "select";
  value: string;
  options: Array<{ hash: string; descricao: string }>;
}

interface TextareaField extends BaseField {
  type: "textarea";
  value: string;
  max?: number;
  mix?: number;
}

interface MultiSelectField extends BaseField {
  type: "multiselect";
  value: string[];
  options: Array<{ hash: string; descricao: string }>;
}

type FormField =
  | TextField
  | NumberField
  | SelectField
  | TextareaField
  | MultiSelectField;

// Interface para DTO de dados do formulário
interface FormDataDTO {
  hash?: string | null; // ID do objeto para edição
  anoLetivo?: string;
  redePagamento?: string;
  descricao?: string;
  pontos?: number;
  series?: number;
  redes?: string;
  categoria?: string;
  prioridade?: string;
  nomeAluno?: string;
  turno?: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  idade?: number;
  disciplinas?: string[];
  habilidades?: string[];
  [key: string]: any; // Para campos dinâmicos
}

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
  scheme: FormField[][] = [
    [
      {
        type: "text",
        value: "",
        name: "anoLetivo",
        label: "Ano Letivo",
        placeholder: "Digite o ano",
        validators: [
          "required",
          "minLength:4",
          "maxLength:4",
          "pattern:^[0-9]{4}$",
        ],
      },
      {
        type: "text",
        value: "",
        name: "redePagamento",
        label: "Rede de Pagamento",
        placeholder: "Nome da rede",
        validators: ["required", "minLength:3"],
      },
    ],
    [
      {
        type: "textarea",
        value: "",
        name: "descricao",
        label: "Descrição",
        placeholder: "Digite a descrição",
        validators: ["required", "minLength:10", "maxLength:300"],
        max: 300,
      },
    ],
    [
      {
        type: "number",
        value: "",
        name: "pontos",
        label: "Pontos",
        min: 0,
        max: 100,
        validators: ["required", "min:0", "max:100"],
      },
      {
        type: "number",
        value: "",
        name: "series",
        label: "Séries",
        validators: ["required", "min:1", "max:12"],
      },
      {
        type: "select",
        value: "",
        name: "redes",
        label: "Redes Disponíveis",
        placeholder: "Escolha uma rede de ensino",
        validators: ["required"],
        options: [
          { hash: "001", descricao: "Rede Municipal" },
          { hash: "002", descricao: "Rede Estadual" },
          { hash: "003", descricao: "Rede Federal" },
        ],
      },
      {
        type: "select",
        value: "",
        name: "categoria",
        label: "Categoria do Projeto",
        placeholder: "Selecione a categoria",
        validators: ["required"],
        options: [
          { hash: "tech", descricao: "Tecnologia" },
          { hash: "edu", descricao: "Educação" },
          { hash: "health", descricao: "Saúde" },
          { hash: "env", descricao: "Meio Ambiente" },
        ],
      },
      {
        type: "select",
        value: "",
        name: "prioridade",
        label: "Nível de Prioridade",
        placeholder: "Defina a prioridade",
        validators: ["required"],
        options: [
          { hash: "baixa", descricao: "Baixa" },
          { hash: "media", descricao: "Média" },
          { hash: "alta", descricao: "Alta" },
          { hash: "urgente", descricao: "Urgente" },
        ],
      },
      {
        type: "text",
        value: "",
        name: "nomeAluno",
        label: "Nome do Aluno",
        placeholder: "Digite o nome completo",
        validators: ["required", "minLength:2", "maxLength:100"],
      },
      {
        type: "select",
        value: "",
        name: "turno",
        label: "Turno de Estudo",
        placeholder: "Qual turno você estuda?",
        validators: ["required"],
        options: [
          { hash: "matutino", descricao: "Matutino (7h às 12h)" },
          { hash: "vespertino", descricao: "Vespertino (13h às 18h)" },
          { hash: "noturno", descricao: "Noturno (19h às 23h)" },
          { hash: "integral", descricao: "Período Integral" },
        ],
      },
    ],
    [
      {
        type: "text",
        value: "",
        name: "email",
        label: "Email",
        placeholder: "Digite seu email",
        validators: ["required", "email"],
      },
      {
        type: "text",
        value: "",
        name: "telefone",
        label: "Telefone",
        placeholder: "(11) 99999-9999",
        validators: [
          "required",
          "pattern:^\\([0-9]{2}\\)\\s[0-9]{4,5}-[0-9]{4}$",
        ],
      },
    ],
    [
      {
        type: "text",
        value: "",
        name: "cpf",
        label: "CPF",
        placeholder: "000.000.000-00",
        validators: [
          "required",
          "pattern:^[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}-[0-9]{2}$",
        ],
      },
      {
        type: "number",
        value: "",
        name: "idade",
        label: "Idade",
        placeholder: "Digite sua idade",
        validators: ["required", "min:0", "max:120"],
        min: 0,
        max: 120,
      },
    ],
    [
      {
        type: "multiselect",
        value: [],
        name: "disciplinas",
        label: "Disciplinas",
        placeholder: "Selecione as disciplinas",
        validators: ["required"],
        options: [
          { hash: "mat", descricao: "Matemática" },
          { hash: "por", descricao: "Português" },
          { hash: "cie", descricao: "Ciências" },
          { hash: "his", descricao: "História" },
          { hash: "geo", descricao: "Geografia" },
          { hash: "ing", descricao: "Inglês" },
          { hash: "edf", descricao: "Educação Física" },
          { hash: "art", descricao: "Artes" },
        ],
      },
      {
        type: "multiselect",
        value: [],
        name: "habilidades",
        label: "Habilidades Técnicas",
        placeholder: "Escolha suas habilidades",
        validators: ["required"],
        options: [
          { hash: "js", descricao: "JavaScript" },
          { hash: "ts", descricao: "TypeScript" },
          { hash: "angular", descricao: "Angular" },
          { hash: "react", descricao: "React" },
          { hash: "vue", descricao: "Vue.js" },
          { hash: "node", descricao: "Node.js" },
          { hash: "python", descricao: "Python" },
          { hash: "java", descricao: "Java" },
          { hash: "csharp", descricao: "C#" },
          { hash: "php", descricao: "PHP" },
          { hash: "sql", descricao: "SQL" },
          { hash: "mongodb", descricao: "MongoDB" },
        ],
      },
    ],
  ];

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

  form!: FormGroup;

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
    console.log(this.form.controls);

    // Observar mudanças no formulário para detectar alterações
    this.form.valueChanges.subscribe(() => {
      // Usar setTimeout para garantir que a mudança seja processada
      setTimeout(() => {
        this.checkForChanges();
      }, 0);
    });

    // Também observar mudanças em status (dirty, touched)
    this.form.statusChanges.subscribe(() => {
      if (this.isEditMode) {
        setTimeout(() => {
          this.checkForChanges();
        }, 0);
      }
    });
  }

  createFieldInjector(field: FormField) {
    // Usar o nome do campo como chave do cache
    const cacheKey = field.name;

    // Se já existe no cache, retornar o injector existente
    if (this.fieldInjectorsCache.has(cacheKey)) {
      return this.fieldInjectorsCache.get(cacheKey)!;
    }

    // Criar novo injector
    const providers: StaticProvider[] = [
      { provide: FormControl, useValue: this.form.get(field.name) },
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

    // Armazenar no cache
    this.fieldInjectorsCache.set(cacheKey, injector);
    return injector;
  }

  // Método para obter ID consistente do campo
  getFieldId(field: FormField): string {
    return field.name;
  }

  // Método auxiliar para gerar IDs únicos e contextuais
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

      // Se for uma string, mapear para o validator correspondente
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

      // Se for um objeto com configurações customizadas
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

  // Método para debug - monitora eventos de focus
  onFieldFocus(fieldName: string) {
    console.log(`Campo ${fieldName} recebeu foco`);
  }

  onFieldBlur(fieldName: string) {
    console.log(`Campo ${fieldName} perdeu foco`);
  }

  // Método para limpar cache se necessário (útil para debugging)
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
      const controlErrors = this.form.get(key)?.errors;
      if (controlErrors) {
        formErrors[key] = controlErrors;
      }
    });

    return formErrors;
  }

  // Método para verificar se um campo específico tem erro
  hasFieldError(fieldName: string, errorType: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.hasError(errorType) && field.touched);
  }

  // Método para obter mensagem de erro personalizada
  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
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

  // Método para carregar dados no formulário (modo edição)
  loadFormData(dto: FormDataDTO): void {
    console.log("📥 Carregando dados para edição:", dto);

    this.currentFormData = dto;
    this.isEditMode = !!(dto.hash && dto.hash !== null);

    // Criar objeto com apenas os campos que existem no formulário
    const formData: any = {};
    Object.keys(this.form.controls).forEach((fieldName) => {
      if (dto.hasOwnProperty(fieldName)) {
        // Para campos array, garantir que é um array
        const fieldValue = dto[fieldName];
        if (Array.isArray(fieldValue)) {
          formData[fieldName] = [...fieldValue]; // shallow copy do array
        } else {
          formData[fieldName] = fieldValue;
        }
      }
    });

    // Atualizar formulário com os dados
    this.form.patchValue(formData);

    // Salvar estado original para comparação (deep copy para arrays)
    this.originalFormData = this.deepCopy(formData);
    this.hasChanges = false;
    this.cdr.detectChanges();

    console.log(`📝 Modo: ${this.isEditMode ? "Edição" : "Criação"}`);
    if (this.isEditMode) {
      console.log(`🆔 ID do objeto: ${dto.hash}`);
    }
  }

  // Método para verificar se houve mudanças no formulário
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

    // Forçar detecção de mudanças se o estado mudou
    if (previousHasChanges !== this.hasChanges) {
      this.cdr.detectChanges();
    }
  }

  // Método para comparação profunda de objetos e arrays
  private deepEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;

    if (obj1 == null && obj2 == null) return true;
    if (obj1 == null || obj2 == null) return false;

    // Verificar se ambos são arrays
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) return false;

      // Ordenar arrays para comparação (caso a ordem não importe)
      const sorted1 = [...obj1].sort();
      const sorted2 = [...obj2].sort();

      for (let i = 0; i < sorted1.length; i++) {
        if (sorted1[i] !== sorted2[i]) return false;
      }

      return true;
    }

    // Se apenas um for array, são diferentes
    if (Array.isArray(obj1) || Array.isArray(obj2)) return false;

    // Comparação para objetos
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

    // Comparação para valores primitivos
    // Normalizar null/undefined como string vazia apenas para strings
    if (typeof obj1 === "string" || typeof obj2 === "string") {
      const normalizedVal1 = obj1 == null ? "" : obj1;
      const normalizedVal2 = obj2 == null ? "" : obj2;
      return normalizedVal1 === normalizedVal2;
    }

    return obj1 === obj2;
  }

  // Método para cópia profunda de objetos e arrays
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

  // Método para obter apenas os campos que foram alterados
  getChangedFields(): { [key: string]: { from: any; to: any } } {
    if (!this.isEditMode) return {};

    const changes: { [key: string]: { from: any; to: any } } = {};
    const currentValues = this.form.value;

    Object.keys(this.originalFormData).forEach((key) => {
      const originalValue = this.originalFormData[key];
      const currentValue = currentValues[key];

      // Usar deepEqual para comparação correta (incluindo arrays)
      if (!this.deepEqual(originalValue, currentValue)) {
        changes[key] = {
          from: originalValue,
          to: currentValue,
        };
      }
    });

    return changes;
  }

  // Método para verificar se um campo específico foi alterado
  isFieldChanged(fieldName: string): boolean {
    if (!this.isEditMode) return false;

    const originalValue = this.originalFormData[fieldName];
    const currentValue = this.form.get(fieldName)?.value;

    // Usar deepEqual para comparação correta (incluindo arrays)
    return !this.deepEqual(originalValue, currentValue);
  }

  // Método para limpar dados e voltar ao modo de criação
  clearFormData(): void {
    this.currentFormData = null;
    this.isEditMode = false;
    this.originalFormData = {};
    this.hasChanges = false;
    this.form.reset();
    this.cdr.detectChanges();
    console.log("🆕 Formulário em modo de criação");
  }

  // Método para obter status atual do formulário
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

  // Métodos de exemplo para demonstrar uso do sistema
  loadExampleCreateMode(): void {
    console.log("🆕 Exemplo: Modo de criação");
    this.clearFormData();
  }

  loadExampleEditMode(): void {
    console.log("✏️ Exemplo: Carregando dados para edição");
    const exampleDTO: FormDataDTO = {
      hash: "abc-123-def-456", // ID do objeto
      anoLetivo: "2024",
      redePagamento: "Rede Municipal de São Paulo",
      descricao:
        "Projeto de educação digital para estudantes do ensino fundamental",
      pontos: 85,
      series: 5,
      redes: "001",
      categoria: "edu",
      prioridade: "alta",
      nomeAluno: "João Silva Santos",
      turno: "matutino",
      email: "joao.silva@email.com",
      telefone: "(11) 99999-8888",
      cpf: "123.456.789-00",
      idade: 25,
      disciplinas: ["mat", "por", "his"],
      habilidades: ["js", "angular", "python", "sql"],
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

  // Método para simular carregamento de dados da API
  simulateLoadFromAPI(id: string): void {
    console.log(`🔄 Simulando carregamento da API para ID: ${id}`);

    // Simular delay da API
    setTimeout(() => {
      const mockDTO: FormDataDTO = {
        hash: id,
        anoLetivo: "2024",
        redePagamento: "Rede Estadual",
        descricao: "Dados carregados da API com sucesso",
        pontos: 75,
        series: 8,
        email: "api@exemplo.com",
        categoria: "tech",
        prioridade: "urgente",
        disciplinas: ["mat", "por", "cie"],
        habilidades: ["js", "ts", "angular", "node", "sql"],
      };

      this.loadFormData(mockDTO);
      console.log("✅ Dados carregados da API");
    }, 1000);
  }

  // Método para demonstrar funcionalidades do multiselect
  demonstrateMultiSelect(): void {
    console.log("🔧 Demonstrando funcionalidades do MultiSelect");

    // Testar seleção programática
    const disciplinasControl = this.form.get("disciplinas");
    const habilidadesControl = this.form.get("habilidades");

    if (disciplinasControl) {
      disciplinasControl.setValue(["mat", "cie", "his"]);
      console.log("📚 Disciplinas selecionadas:", disciplinasControl.value);
    }

    if (habilidadesControl) {
      habilidadesControl.setValue(["js", "angular", "python", "sql", "node"]);
      console.log("💻 Habilidades selecionadas:", habilidadesControl.value);
    }
  }

  // Método para obter informações sobre campos multiselect
  getMultiSelectInfo(): any {
    const info: any = {};

    this.scheme.forEach((row, rowIndex) => {
      row.forEach((field, fieldIndex) => {
        if (field.type === "multiselect") {
          const control = this.form.get(field.name);
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

  // Método para testar detecção de mudanças em multiselect
  testMultiSelectChanges(): void {
    // Carregar dados de exemplo
    this.loadExampleEditMode();

    setTimeout(() => {
      // Testar mudança em qualquer campo array
      Object.keys(this.form.controls).forEach((fieldName) => {
        const control = this.form.get(fieldName);
        const currentValue = control?.value;

        // Se é um array, testar mudança
        if (Array.isArray(currentValue)) {
          // Criar um novo array diferente para testar detecção de mudanças
          const newValue = [...currentValue, "teste"];
          control?.setValue(newValue);
          return; // Testar apenas o primeiro array encontrado
        }
      });

      setTimeout(() => {
        console.log("🧪 Teste de mudanças em MultiSelect:");
        console.log("- Mudanças detectadas:", this.hasChanges);
        console.log("- Status:", this.getFormStatus());
      }, 100);
    }, 100);
  }

  // Método para debug do estado em tempo real
  debugFormState(): void {
    console.log("🔍 Estado atual do formulário:");
    console.log("- isEditMode:", this.isEditMode);
    console.log("- hasChanges:", this.hasChanges);
    console.log("- form.dirty:", this.form.dirty);
    console.log("- form.valid:", this.form.valid);
    console.log("- originalFormData:", JSON.stringify(this.originalFormData));
    console.log("- currentFormData:", JSON.stringify(this.form.value));
    console.log("- changedFields:", this.getChangedFields());
    console.log("- formStatus:", this.getFormStatus());

    // Verificar cada campo array especificamente
    Object.keys(this.form.controls).forEach((fieldName) => {
      const control = this.form.get(fieldName);
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
