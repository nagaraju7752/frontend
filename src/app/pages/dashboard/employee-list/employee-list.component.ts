import { takeUntil, filter } from 'rxjs/operators';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AutheticationService } from '../../../@core/authentication/authetication-service.service';
import { ReplaySubject } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  employeeList:any[] = []
  fullEmployeeList:any[] = [];
  searchItem:any;
  @Output() employeeDetails = new EventEmitter();
  p: number = 1;
  constructor(
    private autheticationService: AutheticationService,
    private router: Router) { }

  ngOnInit(): void {
      this.getEmpList()
  }

  getEmpList(){  
    var userDetails = localStorage.getItem('name');
    var userData:any = {};
    if(userDetails){
     userData = JSON.parse(userDetails);
    }
   this.autheticationService.getEmployeeList(userData.id)
     .pipe(takeUntil(this.destroyed$))
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
        this.employeeList = [];
        this.fullEmployeeList = [];
         res.data.filter(data =>{
           if(data.status == 'Y'){
            this.employeeList.push(data);
            this.fullEmployeeList.push(data);
           }
         });
        //  this.employeeList = res.data;
        //  this.fullEmployeeList = res.data;
       }
     },(err)=>{
       console.log(err);
     });
  }

  filterByDepartyment(e){
    console.log(e);
    if(e === 'All'){
      this.employeeList = this.fullEmployeeList;
    } else{
    let filterlist = [];
    this.fullEmployeeList.filter(data =>{
      if(data.department === e){
        filterlist.push(data);
      }
    });
    this.employeeList = filterlist
  } 
  return this.employeeList;
  }
  filterByLocation(e){
    console.log(e);
    if(e === 'All'){
      this.employeeList = this.fullEmployeeList;
    } else{
    let filterlist = [];
    this.fullEmployeeList.filter(data =>{
      if(data.location === e){
        filterlist.push(data);
      }
    });
    this.employeeList = filterlist
  } 
  return this.employeeList;
  }

  deleteEmployeeData(emp){
    var me = this;
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Okay'
    }).then((result) => {
      if (result.isConfirmed) {
        me.deleteConfirmation(emp)
      }
    })
  }

  deleteConfirmation(emp){
    var userDetails = localStorage.getItem('name');
    var userData:any = {};
    if(userDetails){
     userData = JSON.parse(userDetails);
    }
var reqObj = {
  id: emp._id,
  status: 'N'
  }
  this.autheticationService.deleteEomployee(reqObj)
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
          });
          this.getEmpList();
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

  editEmployeeData(emp){
    this.employeeDetails.emit(emp);
  }

}
