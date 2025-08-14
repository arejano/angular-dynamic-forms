import { Component, OnInit, ViewChild } from '@angular/core';
import { FormField } from '../../dynamic-forms/models';
import { DynamicFormComponent } from '../../dynamic-forms/dynamic-form/dynamic-form.component';
import { defaultFields } from '../../dynamic-forms/default-fields';

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
    const scheme: FormField | any[][] = [
      [
        defaultFields.anoLetivo,
        defaultFields.redes
      ],
      [
        defaultFields.descricao
      ],
      [
        defaultFields.pontosOcorrencia,
        defaultFields.series
      ]
    ]

    this.formulario.start(scheme);
  }
}
