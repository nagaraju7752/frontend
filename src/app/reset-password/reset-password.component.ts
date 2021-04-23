import { AutheticationService } from './../@core/authentication/authetication-service.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'ngx-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  email:any;
  constructor(
    private router: Router,
    private autheticationService: AutheticationService) { }

  ngOnInit(): void {
  }

  navigatetoLogin(){
    this.router.navigate(['/login']);
  }

  resetPassword(){
    var reqObj = {
      email: this.email
    }
    this.autheticationService.sendPasswordEmail(reqObj)
    .subscribe((res:any) =>{
      console.log(res);
      if(res.is_error == true){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: ''+res.display_msg
        })
      } else {
        Swal.fire({
          icon: 'success', 
          title: '',
          text: ''+res.display_msg
        });
        this.router.navigate(['/new-password']);
      }
    },(err)=>{
      console.log(err);
    });
   

  }

}
