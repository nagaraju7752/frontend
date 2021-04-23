import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { APP_CONFIG } from '../../app.config';

@Injectable({
  providedIn: 'root'
})
export class AutheticationService {
  public  subject = new Subject<any>();
  public  actoken = new BehaviorSubject<any>(0)

  accessDetails:any;
  accessToken:any;

  constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig) { 
    this.accessDetails = localStorage.getItem('ac_tok');
    if(this.accessDetails){
      this.accessToken = this.accessDetails;
    }
  
  }

  createUser(payload){
    return this.http.post(this.appConfig.nodeBaseURL+'/signup/register', payload);
  }

  login(payload){
    return this.http.post(this.appConfig.nodeBaseURL+'/Authentication/login', payload);
  }

  createEmployee(payload){
    var httpHeaders = new HttpHeaders()
      .append('authentication', 'bearer '+this.accessToken)
    return this.http.post(this.appConfig.nodeBaseURL+'/employee/create', payload, {headers: httpHeaders});
  }

  getEmployeeList(userId){
    this.accessDetails = localStorage.getItem('ac_tok');
    if(this.accessDetails){
      this.accessToken = this.accessDetails;
    }
    var httpHeaders = new HttpHeaders()
      .append('authentication', 'bearer '+this.accessToken)
    return this.http.get(this.appConfig.nodeBaseURL+'/employee/list?userId='+userId,{headers: httpHeaders})
  }

  deleteEomployee(payload){
    var httpHeaders = new HttpHeaders()
    .append('authentication', 'bearer '+this.accessToken)
  return this.http.post(this.appConfig.nodeBaseURL+'/employee/delete', payload, {headers: httpHeaders});
  }

  updateEmployee(payload){
    var httpHeaders = new HttpHeaders()
    .append('authentication', 'bearer '+this.accessToken)
  return this.http.post(this.appConfig.nodeBaseURL+'/employee/update', payload, {headers: httpHeaders});
  }

  sendPasswordEmail(payload){
    return this.http.post(this.appConfig.nodeBaseURL+'/Authentication/generateResetPasswordLink', payload);
  }

  resetPassword(payload){
    return this.http.post(this.appConfig.nodeBaseURL+'/Authentication/resetpassword', payload);
  }


  sendPath(message: string) {
    this.subject.next(message);
  }
  getPath(): Observable<any> {
    return this.subject.asObservable();
  }
}
