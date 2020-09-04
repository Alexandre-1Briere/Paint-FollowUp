import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component:  EntryPointComponent},
  { path: 'drawing' , component: DrawingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
