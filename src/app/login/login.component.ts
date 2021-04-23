import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NbLoginComponent } from '@nebular/auth';
import { AutheticationService } from '../@core/authentication/authetication-service.service';
import { NbToastrService } from '@nebular/theme';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  user:any = {};
  username:any;
  password:any;
  constructor(private router:Router, 
    private autheticationService: AutheticationService) {
    
  }

  ngOnInit(): void {
  }

  doLogin(){
    var reqObj = {
      email:this.user.username,
      password: this.user.password
    }
    this.autheticationService.login(reqObj)
    .subscribe((res:any) =>{
      console.log(res.is_error);
      if(res.is_error == true){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: ''+res.display_msg
        })
       
      } else {
        localStorage.setItem('ac_tok', res.data.token);
        localStorage.setItem('name', JSON.stringify(res.data.userData));
        this.router.navigate(['/pages/dashboard']);
       
      }
      
    },(err =>{
      console.log(err);
    }));
  }

  doRegistration(){

    this.autheticationService.createUser(this.user)
      .subscribe((res:any) =>{
        if(res.is_error == true){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: ''+res.display_msg
          })
         
        } else {
          var loc = window.location.href.replace('toregister', 'tologin');
          window.location.href = loc;
          this.user = {};
        }
      },(err =>{
        console.log(err);
      }));
  }

  navigateResetPassword(){
    this.router.navigate(['/reset-password']);
  }

}
