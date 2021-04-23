import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AutheticationService } from '../@core/authentication/authetication-service.service';
@Component({
  selector: 'ngx-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  user:any= {};
  isValid:boolean=true;
  userID:any;
  constructor(private router: Router,
    private autheticationService: AutheticationService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    let id;

    id = this.route.snapshot.queryParamMap.get('s');
  
  this.userID = btoa(id);
  }
  navigatetoLogin(){
    this.router.navigate(['/login']);
  }

  changePassword(){

    var reqObj = {
      user_id: this.userID,
      password: this.user.newpassword
    }
    this.autheticationService.resetPassword(reqObj)
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
        this.router.navigate(['/login']);
      }
    },(err)=>{
      console.log(err);
    });
   
  }

  varifyPassword(vpassword){
    if(vpassword == this.user.newpassword){
      return this.isValid = true;
    } else {
      return this.isValid = false;
    }
  }
}
