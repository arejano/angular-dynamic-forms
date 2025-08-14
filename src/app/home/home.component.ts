import { Component, OnInit, ViewChild } from '@angular/core';
import { FormField } from '../../dynamic-forms/models';
import { DynamicFormComponent } from '../../dynamic-forms/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  @ViewChild('formulario', { static: true }) formulario: DynamicFormComponent;

  constructor() {
  }

  ngOnInit() {
    const scheme: FormField[][] = [
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
    ]


    this.formulario.start(scheme);
  }
}
