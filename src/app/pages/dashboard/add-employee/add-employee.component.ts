import { Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AutheticationService } from '../../../@core/authentication/authetication-service.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'ngx-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {

  isUpdate:boolean = false;
  employee:any = {};
  @Input() selectedEmployee:any ={}
  @Output() employeeDetailsAddEdit = new EventEmitter();
  constructor(
    private autheticationService: AutheticationService,
    private router: Router) { }

 

  ngOnInit(){
    this.employee = {};
    console.log(this.selectedEmployee);
    if(this.selectedEmployee){
      
    this.employee.fullName = this.selectedEmployee.full_name;
    this.employee.jobTitle = this.selectedEmployee.job_title;
    this.employee.empId = this.selectedEmployee.emp_id;
    this.employee.department = this.selectedEmployee.department;
    this.employee.location = this.selectedEmployee.location;
    this.employee.age = this.selectedEmployee.age;
    this.employee.salary = this.selectedEmployee.salary;
    }

    if(this.EmptyCheck(this.selectedEmployee) == true){
      this.isUpdate = false;
    } else{
      this.isUpdate = true;
    }
    
  }

  createEmployee(){
    var userDetails = localStorage.getItem('name');
    var userData:any = {};
    if(userDetails){
     userData = JSON.parse(userDetails);
    }
var reqObj = {
  fullName:this.employee.fullName,
  jobTitle:this.employee.jobTitle,
  empId:this.employee.empId,
  department:this.employee.department,
  location:this.employee.location,
  age:this.employee.age,
  salary:this.employee.salary,
  userId: userData.id
  }
  this.autheticationService.createEmployee(reqObj)
      .subscribe((res:any) =>{
        if(res.is_error == true){
          if(res.display_msg == 'Session Expired! Please Login again'){
            Swal.fire({
              title: 'Are you sure?',
              text: "Your session expired,Please login again",
              icon: 'warning',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Okay'
            }).then((result) => {
              if (result.isConfirmed) {
               localStorage.clear();
               this.router.navigate(['/login']);
              }
            })
          }else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: ''+res.display_msg
          })
        }
         
        } else {
          this.employee = {};
          Swal.fire({
            icon: 'success', 
            title: '',
            text: ''+res.display_msg
          })
          this.autheticationService.sendPath('Dashboard');
          this.autheticationService.actoken.next(true);
        }
      },(err =>{
       
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err
        })
      }));
}


updateEmployee(){
  var userDetails = localStorage.getItem('name');
  var userData:any = {};
  if(userDetails){
   userData = JSON.parse(userDetails);
  }
var reqObj = {
fullName:this.employee.fullName,
jobTitle:this.employee.jobTitle,
empId:this.employee.empId,
department:this.employee.department,
location:this.employee.location,
age:this.employee.age,
salary:this.employee.salary,
userId: userData.id,
id:this.selectedEmployee._id
}
this.autheticationService.updateEmployee(reqObj)
    .subscribe((res:any) =>{
      if(res.is_error == true){
        if(res.display_msg == 'Session Expired! Please Login again'){
          Swal.fire({
            title: 'Are you sure?',
            text: "Your session expired,Please login again",
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Okay'
          }).then((result) => {
            if (result.isConfirmed) {
             localStorage.clear();
             this.router.navigate(['/login']);
            }
          })
        }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: ''+res.display_msg
        })
      }
       
      } else {
        
        Swal.fire({
          icon: 'success', 
          title: '',
          text: ''+res.display_msg
        })
        this.employeeDetailsAddEdit.emit('succes');
          this.employee = {};
        this.selectedEmployee = {};
        this.autheticationService.sendPath('Dashboard');
        this.autheticationService.actoken.next(true);
        
      }
    },(err =>{
     
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err
      })
    }));
}
EmptyCheck(obj) {
    return Object.keys(obj).length === 0;
}

ngOnDestroy(){
  this.selectedEmployee = {};
}

}
