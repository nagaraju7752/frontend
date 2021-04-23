import { AutheticationService } from './../../@core/authentication/authetication-service.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators' ;

import { Chart } from 'chart.js';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {

  private alive = true;
  pagePath:string;
  employeeList:any[]=[];
  childEmployeeData:any = {};

  designners:any[]=[];
  developers:any[]=[];
  testers:any[]=[];
  managers:any[]=[];
  single = [
    {
      name: 'Germany',
      value: 8940000,
    },
    {
      name: 'USA',
      value: 5000000,
    },
    {
      name: 'France',
      value: 7200000,
    },
  ];
  colorScheme: any;

  chart: any;

  solarValue: number;
  lightCard: CardSettings = {
    title: 'Light',
    iconClass: 'nb-lightbulb',
    type: 'primary',
  };
  rollerShadesCard: CardSettings = {
    title: 'Roller Shades',
    iconClass: 'nb-roller-shades',
    type: 'success',
  };
  wirelessAudioCard: CardSettings = {
    title: 'Wireless Audio',
    iconClass: 'nb-audio',
    type: 'info',
  };
  coffeeMakerCard: CardSettings = {
    title: 'Coffee Maker',
    iconClass: 'nb-coffee-maker',
    type: 'warning',
  };

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.coffeeMakerCard,
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
  } = {
    default: this.commonStatusCardsSet,
    cosmic: this.commonStatusCardsSet,
    corporate: [
      {
        ...this.lightCard,
        type: 'warning',
      },
      {
        ...this.rollerShadesCard,
        type: 'primary',
      },
      {
        ...this.wirelessAudioCard,
        type: 'danger',
      },
      {
        ...this.coffeeMakerCard,
        type: 'info',
      },
    ],
    dark: this.commonStatusCardsSet,
  };

  themeSubscription: any;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private themeService: NbThemeService,
              private autheticationService: AutheticationService,
              private router:Router,
              private changeDetector: ChangeDetectorRef) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
    });

    this.themeSubscription = this.themeService.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      this.colorScheme = {
        domain: [colors.primaryLight, colors.infoLight, colors.successLight, colors.warningLight, colors.dangerLight],
      };
    });

    
    

  
  }

  ngOnInit(){
    this.autheticationService.getPath()
      .subscribe(path =>{
        this.pagePath = path;
      })

      this.getEmployeeCount();
      this.childEmployeeData = {};

      this.autheticationService.actoken
        .subscribe(data => {
          if(data == true){
            this.getEmployeeCount();
          }
        })

  }


  getEmployeeCount(){
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
         this.employeeList = res.data;
         this.developers = [];
         this.designners = [];
         this.testers = [];
         this.managers = [];
         this.employeeList.filter(data =>{
           if(data.status == 'Y'){
           if(data.department == 'Developers'){
            this.developers.push(data);
           }
           if(data.department == 'Designers'){
            this.designners.push(data);
           }
           if(data.department == 'Testers'){
            this.testers.push(data);
           }
           if(data.department == 'Managers'){
            this.managers.push(data);
           }
          }
         })
         this.generateChart(this.developers, this.designners, this.testers, this.managers)
       }
     },(err)=>{
       console.log(err);
     });
  }

  generateChart(dev, desig, testr, manager){
    this.chart = new Chart('canvas', {
      type: 'doughnut',
      data: {
        labels: ['Developers','Designers', 'Testers', 'Managers'],
        datasets: [
          { 
            data: [dev.length, desig.length, testr.length, manager.length],
            backgroundColor: ['#fcba03','#fc3503','#03fc35','#03fcf8'],
            fill: false
          },
        ]
      },
      options: {
        legend: {
          display: true
        },
        tooltips:{
          enabled:true
        }
      }
    });
  }

  getselectedEmployee(data){
    console.log(data);
    this.childEmployeeData = data;
    this.autheticationService.sendPath('Create Employee')
  }

  updatedEmloyee(data){
    this.childEmployeeData = {};
  }

  ngAfterViewInit() {
    
    this.changeDetector.detectChanges();
 }

  ngOnDestroy() {
    this.alive = false;
  }
}
