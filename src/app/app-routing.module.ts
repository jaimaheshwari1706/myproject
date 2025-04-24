import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { TableComponent } from './table/table.component';
import { ParentComponent } from './parent/parent.component';
import { ChildComponent } from './child/child.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { OrgtableComponent } from './orgtable/orgtable.component';

const routes: Routes = [
  {
    path: 'CRUD',
    component: TableComponent,
    canActivate: [AuthGuard] // Protect this route with AuthGuard
  },
  {
    path: 'add',
    component: FormComponent
  },
  {
    path: 'update/:id',
    component: FormComponent
  },
  {
    path: 'parent',
    component: ParentComponent
  },
  {
    path: 'child',
    component: ChildComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'table2',
    component: OrgtableComponent
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
