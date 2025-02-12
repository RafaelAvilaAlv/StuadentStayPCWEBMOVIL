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
  showChat = true;  // Nuevo flag para controlar la visibilidad del chat

  constructor(private chatbotService: ChatbotService, private router: Router) {}

  ngOnInit() {
    // Suscribirse a los cambios de ruta
    this.router.events.subscribe(() => {
      if (this.router.url === '/login') {
        this.showChat = false; // Ocultar el chat en la página de login
      } else {
        this.showChat = true; // Mostrar el chat en otras páginas
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
}
