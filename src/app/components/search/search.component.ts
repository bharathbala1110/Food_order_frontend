import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
searchTerm='';
  constructor( activatedRoute:ActivatedRoute,private router:Router) { 
    console.log("search constructor")

    activatedRoute.params.subscribe((params)=>{
      if(params.searchTerm) this.searchTerm=params.searchTerm;
    })
  }

  ngOnInit(): void {
  }
   search(term:string){

    if(term){
    this.router.navigateByUrl('/search/'+term);
  }
}

}
