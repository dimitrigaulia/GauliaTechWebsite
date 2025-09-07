import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/home', 
    pathMatch: 'full' 
  },
  { 
    path: 'home', 
    loadComponent: () => import('./components/hero/hero').then(m => m.HeroComponent),
    title: 'Gaulia Tech - Soluções em Tecnologia e Inovação',
    data: { 
      meta: {
        description: 'Gaulia Tech oferece soluções completas em tecnologia, desenvolvimento de software, consultoria em TI e inovação digital para empresas.',
        keywords: 'tecnologia, desenvolvimento, software, consultoria TI, inovação digital, Gaulia Tech'
      }
    }
  },
  { 
    path: 'about', 
    loadComponent: () => import('./components/about/about').then(m => m.AboutComponent),
    title: 'Sobre Nós - Gaulia Tech',
    data: { 
      meta: {
        description: 'Conheça a Gaulia Tech, nossa missão, visão e valores. Especialistas em tecnologia com foco em inovação e excelência.',
        keywords: 'sobre nós, empresa, missão, visão, valores, Gaulia Tech, tecnologia'
      }
    }
  },
  { 
    path: 'services', 
    loadComponent: () => import('./components/services/services').then(m => m.ServicesComponent),
    title: 'Serviços - Gaulia Tech',
    data: { 
      meta: {
        description: 'Conheça nossos serviços em desenvolvimento de software, consultoria em TI, soluções em nuvem e transformação digital.',
        keywords: 'serviços, desenvolvimento software, consultoria TI, soluções nuvem, transformação digital'
      }
    }
  },
  { 
    path: 'contact', 
    loadComponent: () => import('./components/contact/contact').then(m => m.ContactComponent),
    title: 'Contato - Gaulia Tech',
    data: { 
      meta: {
        description: 'Entre em contato com a Gaulia Tech. Estamos prontos para ajudar sua empresa com soluções em tecnologia e inovação.',
        keywords: 'contato, orçamento, consultoria, desenvolvimento, Gaulia Tech'
      }
    }
  }
];
