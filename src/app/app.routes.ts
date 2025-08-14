import { Routes } from "@angular/router";
import { DynamicFormComponent } from "../dynamic-forms/dynamic-form/dynamic-form.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/form",
    pathMatch: "full",
  },
  {
    path: "form",
    component: DynamicFormComponent,
  },
  {
    path: "**",
    redirectTo: "/form",
  },
];
