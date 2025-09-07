import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private meta: Meta,
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  init(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe(data => {
        this.updateTitle(data['title']);
        this.updateMetaTags(data['meta']);
      });
  }

  updateTitle(title: string): void {
    if (title) {
      this.title.setTitle(title);
    }
  }

  updateMetaTags(metaData: any): void {
    if (metaData) {
      // Meta description
      if (metaData.description) {
        this.meta.updateTag({ name: 'description', content: metaData.description });
      }

      // Meta keywords
      if (metaData.keywords) {
        this.meta.updateTag({ name: 'keywords', content: metaData.keywords });
      }

      // Open Graph tags
      this.meta.updateTag({ property: 'og:title', content: metaData.title || this.title.getTitle() });
      this.meta.updateTag({ property: 'og:description', content: metaData.description });
      this.meta.updateTag({ property: 'og:type', content: 'website' });
      this.meta.updateTag({ property: 'og:url', content: `https://gauliatech.com${this.router.url}` });
      this.meta.updateTag({ property: 'og:image', content: 'https://gauliatech.com/assets/img/LOGO_PRETO_OTIMIZADO.png' });
      this.meta.updateTag({ property: 'og:site_name', content: 'Gaulia Tech' });

      // Twitter Card tags
      this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.meta.updateTag({ name: 'twitter:title', content: metaData.title || this.title.getTitle() });
      this.meta.updateTag({ name: 'twitter:description', content: metaData.description });
      this.meta.updateTag({ name: 'twitter:image', content: 'https://gauliatech.com/assets/img/LOGO_PRETO_OTIMIZADO.png' });

      // Additional meta tags
      this.meta.updateTag({ name: 'robots', content: 'index, follow' });
      this.meta.updateTag({ name: 'author', content: 'Gaulia Tech' });
      this.meta.updateTag({ name: 'viewport', content: 'width=device-width, initial-scale=1.0' });
    }
  }

  addSchemaOrg(schema: any): void {
    if (typeof document !== 'undefined') {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }
}
