
export interface BaseField {
  type: string;
  value: string | number | string[];
  name: string;
  label: string;
  placeholder?: string;
  validators?: (string | any)[];
}

export interface TextField extends BaseField {
  type: "text";
  value: string;
}

export interface NumberField extends BaseField {
  type: "number";
  value: number | string;
  min?: number;
  max?: number;
}

export interface SelectField extends BaseField {
  type: "select";
  value: string;
  options: Array<{ hash: string; descricao: string }>;
}

export interface TextareaField extends BaseField {
  type: "textarea";
  value: string;
  max?: number;
  mix?: number;
}

export interface MultiSelectField extends BaseField {
  type: "multiselect";
  value: string[];
  options: Array<{ hash: string; descricao: string }>;
}

export type FormField =
  | TextField
  | NumberField
  | SelectField
  | TextareaField
  | MultiSelectField;

// Interface para DTO de dados do formulário
export interface FormDataDTO {
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

