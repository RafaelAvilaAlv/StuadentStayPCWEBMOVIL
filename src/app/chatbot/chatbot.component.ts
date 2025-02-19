import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatbotService } from './chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  userMessage = '';
  messages: { sender: string, text: string }[] = [];
  isMinimized = true;  
  isExpanded = false;
  showChat = true;

  constructor(private chatbotService: ChatbotService, private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      if (this.router.url === '/login') {
        this.showChat = false; 
      } else {
        this.showChat = true; 
      }
    });
  }

  sendMessage() {
    if (this.userMessage.trim() === '') return;
    this.messages.push({ sender: 'Tú', text: this.userMessage });

    this.chatbotService.sendMessage(this.userMessage).subscribe(response => {
      this.messages.push({ sender: 'Chatbot', text: response.response });
    });

    this.userMessage = '';
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  handleOption(option: string) {
    let userMessageText = '';
    let responseText = '';
  
    switch (option) {
      case 'about':
        userMessageText = '¿De qué se trata Room4U?';
        responseText = 'Room4U es una plataforma de alquileres para estudiantes internacionales, donde pueden encontrar habitaciones disponibles para su estadía.';
        break;
      case 'mission':
        userMessageText = 'Misión';
        responseText = 'Nuestra misión es facilitar el acceso a viviendas adecuadas para estudiantes internacionales, asegurando una experiencia cómoda y segura.';
        break;
      case 'vision':
        userMessageText = 'Visión';
        responseText = 'Nuestra visión es ser la plataforma líder en el mercado de alquileres para estudiantes a nivel mundial, conectando estudiantes con anfitriones confiables.';
        break;
      case 'values':
        userMessageText = 'Valores';
        responseText = 'Nuestros valores son la transparencia, confianza, accesibilidad y compromiso con la comodidad del estudiante.';
        break;
      default:
        userMessageText = 'Opción no reconocida';
        responseText = '¿En qué más puedo ayudarte?';
    }
  
    // Mostrar el mensaje del usuario y la respuesta del chatbot
    this.messages.push({ sender: 'Tú', text: userMessageText });
    this.messages.push({ sender: 'Chatbot', text: responseText });
  
    // Preguntar si puede ayudar en algo más
    this.messages.push({ sender: 'Chatbot', text: '¿Puedo ayudarte con algo más?' });
  }
}
