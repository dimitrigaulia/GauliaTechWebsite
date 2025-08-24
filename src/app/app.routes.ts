import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./components/hero/hero').then(m => m.HeroComponent) },
  { path: 'about', loadComponent: () => import('./components/about/about').then(m => m.AboutComponent) },
  { path: 'services', loadComponent: () => import('./components/services/services').then(m => m.ServicesComponent) },
  { path: 'contact', loadComponent: () => import('./components/contact/contact').then(m => m.ContactComponent) }
];
