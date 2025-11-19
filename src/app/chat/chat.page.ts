import { Component, inject, signal } from '@angular/core';
import { NgClass } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment-prod';



interface Chat {
  role: ('user' | 'assistant' | 'system'),
  message: string,
  showLoading?: boolean
}

@Component({
  selector: 'app-chat.page',
  imports: [NgClass, FormsModule],
  templateUrl: './chat.page.html',
  styleUrl: './chat.page.scss',
})
export class ChatPage {
  private http = inject(HttpClient);

  chats = signal<Chat[]>([]);
  userInput = signal('');


  async send() {
    const chats = [...this.chats()];
    chats.push({
      role: 'user',
      message: this.userInput()
    });
    const aiInputMessages = chats.map(chat => ({ role: chat.role, content: chat.message }));
    console.log('AI Input:', aiInputMessages);

    this.chats.update((chats) => {
      chats.push({
        role: 'user',
        message: this.userInput()
      },
        {
          role: 'assistant',
          message: '',
          showLoading: true
        }
      )
      return chats;
    });
    this.scrollToLatestChat();

    const response: { reply?: string } = await firstValueFrom(this.http.post(`${environment.apiUrl}/chat`, { messages: aiInputMessages }));

    this.chats.update((chats) => {
      chats[chats.length - 1] = {
        role: 'assistant',
        message: response?.reply || '',
        showLoading: false
      }
      return [...chats];
    });
    this.userInput.set('');
    this.scrollToLatestChat();
  }


  private scrollToLatestChat() {
    const timeout = setTimeout(() => {
      const element: HTMLElement | null = document.getElementById(`chat-${this.chats().length - 1}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      clearTimeout(timeout)
    }, 200);
  }
}
