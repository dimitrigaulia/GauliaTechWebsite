import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit {
  title = 'gaulia-tech';

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.init();
    this.addSchemaOrg();
  }

  private addSchemaOrg(): void {
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Gaulia Tech",
      "url": "https://gauliatech.com",
      "logo": "https://gauliatech.com/assets/img/LOGO_PRETO_OTIMIZADO.png",
      "description": "Soluções completas em tecnologia, desenvolvimento de software, consultoria em TI e inovação digital para empresas.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "BR"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": "Portuguese"
      },
      "sameAs": [
        "https://linkedin.com/company/gaulia-tech",
        "https://github.com/gaulia-tech"
      ]
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Gaulia Tech",
      "url": "https://gauliatech.com",
      "description": "Soluções em tecnologia e inovação digital",
      "publisher": {
        "@type": "Organization",
        "name": "Gaulia Tech"
      }
    };

    this.seoService.addSchemaOrg(organizationSchema);
    this.seoService.addSchemaOrg(websiteSchema);
  }
}
