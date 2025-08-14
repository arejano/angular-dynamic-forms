import { Routes } from "@angular/router";
import { DynamicFormComponent } from "../dynamic-forms/dynamic-form/dynamic-form.component";
import { HomeComponent } from "./home/home.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/form",
    pathMatch: "full",
  },
  {
    path: "home",
    component: HomeComponent,
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
