import { Component, OnInit, HostListener } from '@angular/core';
import { JobPostService } from 'src/app/service/job-post.service';
import { Slide } from 'src/app/interfaces/article';
import { of, pipe } from 'rxjs';
import { mergeMap, groupBy, reduce } from 'rxjs/operators';
import { Validators, FormControl, FormBuilder } from '@angular/forms';
import { UserProfileService } from 'src/app/service/user-profile.service';
import { AuthService } from 'src/app/services/auth.service';
import { loads } from 'src/scripts/pickle'



function ArrayBufferToString(buffer) {
  return BinaryToString(String.fromCharCode.apply(null, Array.prototype.slice.apply(new Uint8Array(buffer))));
}

function StringToArrayBuffer(string) {
  return StringToUint8Array(string).buffer;
}

function BinaryToString(binary) {
  var error;

  try {
      return decodeURIComponent(escape(binary));
  } catch (_error) {
      error = _error;
      if (error instanceof URIError) {
          return binary;
      } else {
          throw error;
      }
  }
}

function StringToBinary(string) {
  var chars, code, i, isUCS2, len, _i;

  len = string.length;
  chars = [];
  isUCS2 = false;
  for (i = _i = 0; 0 <= len ? _i < len : _i > len; i = 0 <= len ? ++_i : --_i) {
      code = String.prototype.charCodeAt.call(string, i);
      if (code > 255) {
          isUCS2 = true;
          chars = null;
          break;
      } else {
          chars.push(code);
      }
  }
  if (isUCS2 === true) {
      return unescape(encodeURIComponent(string));
  } else {
      return String.fromCharCode.apply(null, Array.prototype.slice.apply(chars));
  }
}
function StringToUint8Array(string) {
  var binary, binLen, buffer, chars, i, _i;
  binary = StringToBinary(string);
  binLen = binary.length;
  buffer = new ArrayBuffer(binLen);
  chars  = new Uint8Array(buffer);
  for (i = _i = 0; 0 <= binLen ? _i < binLen : _i > binLen; i = 0 <= binLen ? ++_i : --_i) {
      chars[i] = String.prototype.charCodeAt.call(binary, i);
  }
  return chars;
}
@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {
  public templates : Slide[][]
   
  years = new Array(61).fill(null);
  bottom = new Date().getFullYear() - 60;
  months = new Array(12).fill(null);
  days = new Array(31).fill(null);
  someObject :any = ''

  schools = ['中学', '高校', '専門', '大学', '大学院'];
  states = ['卒業', '在学中', '中退'];

  image: File;

  form = this.fb.group({
    name: ['', [Validators.required]],
    address: ['', [Validators.required]],
    bday: this.fb.group({
      year: ['', [Validators.required]],
      month: ['', [Validators.required]],
      day: ['', [Validators.required]]
    }),
    gender: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    tel: ['', [Validators.required, Validators.pattern(/^0\d{9,10}$/)]],
    school: ['', [Validators.required]],
    state: ['', [Validators.required]],
    possibleDay: ['', [Validators.required]],
    tagOne: ['', []],
    tagSecond: ['', []],
    introduce: ['', []],
    belongs: ['', [Validators.required]]
  });
  userId: string;
  static someObject: any;

  get nameControl() {
    return this.form.get('name') as FormControl;
  }

  get addressControl() {
    return this.form.get('address') as FormControl;
  }
  get yearControl() {
    return this.form.get('bday.year') as FormControl;
  }

  get monthControl() {
    return this.form.get('bday.month') as FormControl;
  }

  get dayControl() {
    return this.form.get('bday.day') as FormControl;
  }

  get genderControl() {
    return this.form.get('gender') as FormControl;
  }

  get emailControl() {
    return this.form.get('email') as FormControl;
  }

  get telControl() {
    return this.form.get('tel') as FormControl;
  }

  get schoolControl() {
    return this.form.get('school') as FormControl;
  }

  get stateControl() {
    return this.form.get('state') as FormControl;
  }

  get possibleDayControl() {
    return this.form.get('possibleDay') as FormControl;
  }

  get tagOneControl() {
    return this.form.get('tagOne') as FormControl;
  }

  get tagSecondControl() {
    return this.form.get('tagSecond') as FormControl;
  }

  get introduceControl() {
    return this.form.get('introduce') as FormControl;
  }

  get belongsControl() {
    return this.form.get('belongs') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    // private userProfileService: UserProfileService,
    // private authService: AuthService,
  ) {}


  ngOnInit(): void {
  }

  get staticUrlArray(){
    return TopComponent.someObject;
  }

  download(){
    let target = JSON.stringify(TopComponent.someObject)
    var data = "data:text/json;charset=utf-8," + encodeURIComponent(target);
    var downloader = document.createElement('a');

    downloader.setAttribute('href', data);
    downloader.setAttribute('download', 'file.json');
    downloader.click();
  }

  setAvatar(event) {
    if (event.target.files.length > 0) {
      
      const image = event.target.files[0];
      var r = new FileReader();

      r.onload = function(e) { 
        let binary  = r.result as ArrayBuffer
        var bytes = new Uint8Array(binary);
        var len = bytes.byteLength;
        let bday = ''

        for (var i = 0; i < len; i++) {
          bday += String.fromCharCode(bytes[i]);
        }
     
        let result = loads(bday);
        TopComponent.someObject = result;
      }
      r.readAsArrayBuffer(event.target.files[0]);
      this.image = image;
    }
  }


  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.form.dirty) {
      $event.preventDefault();
      $event.returnValue = 'An error occured in this form';
    }
  }

}
