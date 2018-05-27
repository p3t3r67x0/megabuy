import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  selectedFile: any = [];
  rForm: FormGroup;

  constructor(private http: Http, private fb: FormBuilder) {
    this.rForm = fb.group({
      'name': [null, Validators.required],
      'description': [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      'thumbnail': [null, Validators.required],
      'price': [null, Validators.required]
    });
  }

  ngOnInit() {
  }

  onFileSelected(event) {
    this.selectedFile = [];
    let file = '';

    for (file of event.target.files) {
      this.selectedFile.push(file);
    }
  }

  onUpload(value) {
    const fd = new FormData;
    let file: any = '';

    fd.append('name', value.name);
    fd.append('description', value.description);
    fd.append('price', value.price);

    for (file of this.selectedFile) {
      fd.append('thumbnail', file, file.name);
    }

    this.http.post('http://localhost:5000/upload', fd).subscribe(res => {
      console.log(res);
    });
  }
}
