import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  };

  constructor(public router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  onSubmit() {
    // Aqui você implementaria a lógica para enviar o formulário
    console.log('Formulário enviado:', this.formData);
    alert('Obrigado pelo contato! Entraremos em contato em breve.');
    
    // Limpar formulário
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
