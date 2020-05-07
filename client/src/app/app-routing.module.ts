import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { UseGuideComponent } from './components/use-guide/use-guide.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component:  EntryPointComponent},
  { path: 'drawing' , component: DrawingComponent },
  { path: 'use-guide' , component: UseGuideComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
