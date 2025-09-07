import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { GlobeComponent } from './components/globe/globe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, HeaderComponent, FooterComponent, GlobeComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
  title = 'gaulia-tech';

  // Dados do formulário de contato
  formData = {
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  };

  // Método para navegação suave entre seções
  navigateTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Método para envio do formulário
  onSubmit(): void {
    console.log('Formulário enviado:', this.formData);
    // Aqui você pode implementar a lógica de envio
    alert('Mensagem enviada com sucesso!');
    
    // Limpar o formulário
    this.formData = {
      name: '',
      email: '',
      phone: '',
      company: '',
      service: '',
      message: ''
    };
  }
}
