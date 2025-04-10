import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../services/state.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {
  stateService = inject(StateService);
  
  // Iconos
  faUser = faUser;
  faLock = faLock;
  faSignInAlt = faSignInAlt;
  
  // Credenciales por defecto
  username: string = 'admin';
  password: string = '123456';
  errorMessage: string = '';
  rememberMe: boolean = false;
  
  // Credenciales simuladas
  defaultCredentials = {
    username: 'admin',
    password: '123456'
  };
  
  ngOnInit() {
    // Verificar si ya hay credenciales guardadas
    const savedCredentials = localStorage.getItem('crazyBiteCredentials');
    if (savedCredentials) {
      const credentials = JSON.parse(savedCredentials);
      this.username = credentials.username;
      this.password = credentials.password;
      this.rememberMe = true;
    }
    
    // Verificar si ya hay una sesión activa
    const isLoggedIn = localStorage.getItem('crazyBiteLoggedIn');
    if (isLoggedIn === 'true') {
      this.redirectToApp();
    }
  }
  
  login() {
    // Validaciones básicas
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, ingresa usuario y contraseña';
      return;
    }
    
    // Verificación simulada
    if (this.username === this.defaultCredentials.username && 
        this.password === this.defaultCredentials.password) {
      
      // Guardar en localStorage si "Recordarme" está activado
      if (this.rememberMe) {
        localStorage.setItem('crazyBiteCredentials', JSON.stringify({
          username: this.username,
          password: this.password
        }));
      } else {
        localStorage.removeItem('crazyBiteCredentials');
      }
      
      // Marcar como autenticado
      localStorage.setItem('crazyBiteLoggedIn', 'true');
      
      this.redirectToApp();
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos';
    }
  }
  
  redirectToApp() {
    // Simulamos una redirección cambiando la vista
    this.stateService.currentView.set('tables');
  }
} 