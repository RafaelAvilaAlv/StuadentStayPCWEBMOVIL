import { Component } from '@angular/core';
import { ChatbotService } from './chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  userMessage = '';
  messages: { sender: string, text: string }[] = [];
  isExpanded = false; 

  constructor(private chatbotService: ChatbotService) {}

  sendMessage() {
    if (this.userMessage.trim() === '') return;

    // Mensaje del usuario
    this.messages.push({ sender: 'Tú', text: this.userMessage });

    // Llamada al servicio del chatbot
    this.chatbotService.sendMessage(this.userMessage).subscribe(response => {
      this.messages.push({ sender: 'Chatbot', text: response.response });
    });

    // Limpiar el input
    this.userMessage = '';
    
  }

  toggleChat() {
    this.isExpanded = !this.isExpanded;  // Cambiar entre expandido y minimizado
  }

  
}
