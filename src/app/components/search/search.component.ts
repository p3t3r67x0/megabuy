import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  rForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.rForm = fb.group({
      'search': [null, Validators.compose([Validators.required, Validators.minLength(2)])]
    });
  }

  ngOnInit() {}

  search(query) {
    this.router.navigateByUrl(`/search/${query.search}`);
  }
}
