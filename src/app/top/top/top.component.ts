import { Component, OnInit, HostListener } from '@angular/core';
import { JobPostService } from 'src/app/service/job-post.service';
import { Slide } from 'src/app/interfaces/article';
import { of, pipe } from 'rxjs';
import { mergeMap, groupBy, reduce } from 'rxjs/operators';
import { Validators, FormControl, FormBuilder } from '@angular/forms';
import { UserProfileService } from 'src/app/service/user-profile.service';
import { AuthService } from 'src/app/services/auth.service';
import {Buffer} from 'buffer'

export class Parser {
    stack : any = []
    mark = 'THIS-NEEDS-TO-BE-UNIQUE-TO-SERVE-AS-A-BOUNDARY';
    memo = {};


    load (data) {
        var parser = new Parser();
        return parser.load(data);
    };

    marker() {
        var k = this.stack.length - 1
        while (k > 0 && this.stack[k] !== this.mark) {
            --k;
        }
        return k;
    };

    buffer_readLine(buffer, i, pickle){
        var index = pickle.indexOf('\n', i);
        if (index == -1)
            throw "Could not find end of line";
        return pickle.substr(i, index - i);
    }


    loads(pickle) {
        var emulated = {
            'datetime.datetime': function(args) {
                var tmp = new Buffer(args[0], 'binary')
                , year = tmp.readUInt16BE(0)
                , month = tmp.readUInt8(2) - 1
                , day = tmp.readUInt8(3)
                , hour = tmp.readUInt8(4)
                , minute = tmp.readUInt8(5)
                , second = tmp.readUInt8(6)
                , microsecond = tmp.readUInt32BE(6) & 0xffffff;
                if (args[1] == 'UTC') {
                    return new Date(Date.UTC(year, month, day, hour, minute, second, microsecond / 1000));
                } else {
                    return new Date(year, month, day, hour, minute, second, microsecond / 1000);
                }
            },
            'django.utils.timezone.UTC': function(args) {
                return 'UTC';
            },
            'builtins.set' : function(args){
              throw "Cannot emulate global: " + module + " " + name; 
            }
        };
        var pst = function() {
            this.mark = 'THIS-NEEDS-TO-BE-UNIQUE-TO-SERVE-AS-A-BOUNDARY';
            this.memo = {};
            this.stack = [];
        };

    var MARK = '('              // push special markobject on stack
      , STOP = '.'              // every pickle ends with STOP
      , POP = '0'               // discard topmost stack item
      , POP_MARK = '1'          // discard stack top through topmost markobject
      , DUP = '2'               // duplicate top stack item
      , FLOAT = 'F'             // push float object; decimal string argument
      , INT = 'I'               // push integer or bool; decimal string argument
      , BININT = 'J'            // push 4-byte signed int
      , BININT1 = 'K'           // push 1-byte unsigned int
      , LONG = 'L'              // push long; decimal string argument
      , BININT2 = 'M'           // push 2-byte unsigned int
      , NONE = 'N'              // push None
      // missing PERSID
      // missing BINPERSID
      , REDUCE = 'R'            // apply callable to argtuple, both on stack
      , STRING = 'S'            // push string; NL-terminated string argument
      , BINSTRING = 'T'         // push string; counted binary string argument
      , SHORT_BINSTRING = 'U'   //  "     "   ;    "      "       "      " < 256 bytes
      , UNICODE = 'V'           // push Unicode string; raw-unicode-escaped'd argument
      , BINUNICODE = 'X'        //   "     "       "  ; counted UTF-8 string argument
      , APPEND = 'a'            // append stack top to list below it
      , BUILD = 'b'             // build the entire value
      , GLOBAL = 'c'            // push self.find_class(modname, name); 2 string args
      , DICT = 'd'              // build a dict from stack items
      , EMPTY_DICT = '}'        // push empty dict
      , APPENDS = 'e'           // extend list on stack by topmost stack slice
      , GET = 'g'               // push item from memo on stack; index is string arg
      , BINGET = 'h'            //   "    "    "    "   "   "  ;   "    " 1-byte arg
      // missing INST
      , LONG_BINGET = 'j'       // push item from memo on stack; index is 4-byte arg
      , LIST = 'l'              // build list from topmost stack items
      , EMPTY_LIST = ']'        // push empty list
      , OBJ = 'o'               // build a class instance using the objects between here and the mark
      , PUT = 'p'               // store stack top in memo; index is string arg
      , BINPUT = 'q'            //   "     "    "   "   " ;   "    " 1-byte arg
      , LONG_BINPUT = 'r'       //   "     "    "   "   " ;   "    " 4-byte arg
      , SETITEM = 's'           // add key+value pair to dict
      , TUPLE = 't'             // build tuple from topmost stack items
      , EMPTY_TUPLE = ')'       // push empty tuple
      , SETITEMS = 'u'          // modify dict by adding topmost key+value pairs
      , BINFLOAT = 'G'          // push float; arg is 8-byte float encoding
      // protocol 2
      , PROTO = '\x80'          // identify pickle protocol
      , NEWOBJ = '\x81'         // build object by applying cls.__new__ to argtuple
      , TUPLE1 = '\x85'         // build 1-tuple from stack top
      , TUPLE2 = '\x86'         // build 2-tuple from two topmost stack items
      , TUPLE3 = '\x87'         // build 3-tuple from three topmost stack items
      , NEWTRUE = '\x88'        // push True
      , NEWFALSE = '\x89'       // push False
      , LONG1 = '\x8a'          // push long from < 256 bytes
      , LONG4 = '\x8b'          // push really big long
      // protocol 3
      , BINBYTES = 'B'          // push bytes; counted binary string argument
      , SHORT_BINBYTES = 'C'    //  "     "   ;    "      "       "      " < 256 bytes

    //     // protocol 4
    //   , SHORT_BINUNICODE = '\x8c'
    //   , BINUNICODE8      = '\x8d'  
    //   , BINBYTES8        = '\x8e'  
    //   , EMPTY_SET        = '\x8f'  
    //   , ADDITEMS         = '\x90'  
    //  , FROZENSET        = '\x91'  
    //  , NEWOBJ_EX        = '\x92'  
    //  , STACK_GLOBAL     = '\x93'  
    //  , MEMOIZE          = '\x94'  
    //  , FRAME            = '\x95'  
    ;
      //protocol 4

    var buffer = new Buffer(pickle, 'binary');

    for (var i = 0; i < pickle.length; ) {
        var opindex = i
          , opcode = pickle[i++];
        //console.log('opcode ' + opindex + ' ' + opcode);
        switch (opcode) { 
        // protocol 2
        case PROTO:
            var proto = buffer.readUInt8(i++);
            if (proto !== 2 && proto !== 3)
                throw 'Unhandled pickle protocol version: ' + proto;
            break;
        case TUPLE1:
            var a = this.stack.pop();
            this.stack.push([a]);
            break;
        case TUPLE2:
            var b = this.stack.pop()
              , a = this.stack.pop();
            this.stack.push([a, b]);
            break;
        case TUPLE3:
            var c = this.stack.pop()
              , b = this.stack.pop()
              , a = this.stack.pop();
            this.stack.push([a, b, c]);
            break;
        case NEWTRUE:
            this.stack.push(true);
            break;
        case NEWFALSE:
            this.stack.push(false);
            break;
        case LONG1:
            var length = buffer.readUInt8(i++);
            // FIXME: actually decode LONG1
            i += length;
            this.stack.push(0);
            break;
        case LONG4:
            var length = buffer.readUInt32LE(i);
            i += 4;
            // FIXME: actually decode LONG4
            i += length;
            this.stack.push(0);
            break;
        // protocol 0 and protocol 1
        case POP:
            this.stack.pop();
            break;
        case POP_MARK:
            var mark = this.marker();
            this.stack = this.stack.slice(0, mark);
            break;
        case DUP:
            var value = this.stack[this.stack.length-1];
            this.stack.push(value);
            break;
        case EMPTY_DICT:
            this.stack.push({});
            break;
        case EMPTY_LIST:
        case EMPTY_TUPLE:
            this.stack.push([]);
            break;
        case GET:
            let index = this.buffer_readLine(buffer, i, pickle)
            i += index.length + 1;
            this.stack.push(this.memo[index]);
            break;
        case BINGET:
            let ind = buffer.readUInt8(i++);
            this.stack.push(this.memo[''+ind]);
            break;
        case LONG_BINGET:
            var indi = buffer.readUInt32LE(i);
            i+=4;
            this.stack.push(this.memo[''+indi]);
            break;
        case PUT:
            var indx = this.buffer_readLine(buffer, i, pickle)
            i += indx.length + 1;
            this.memo[indx] = this.stack[this.stack.length-1];
            break;
        case BINPUT:
            var xs = buffer.readUInt8(i++);
            this.memo['' + xs] = this.stack[this.stack.length-1];
            break;
        case LONG_BINPUT:
            var wsr = buffer.readUInt32LE(i);
            i+=4;
            this.memo['' + wsr] = this.stack[this.stack.length-1];
            break;
        case GLOBAL:
            var module = this.buffer_readLine(buffer, i, pickle)
            i += module.length + 1;
            var name = this.buffer_readLine(buffer, i, pickle)
            i += name.length + 1;
            var func = emulated[module + '.' + name];
            if (func === undefined) {
                throw "Cannot emulate global: " + module + " " + name;
            }
            this.stack.push(func);
            break;
        case OBJ:
            var obj = new (this.stack.pop())();
            var mark = this.marker();
            for (var pos = mark + 1; pos < this.stack.length; pos += 2) {
              obj[this.stack[pos]] = this.stack[pos + 1];
            }
            this.stack = this.stack.slice(0, mark);
            this.stack.push(obj);
            break;
        case BUILD:
            var dict = this.stack.pop();
            var obj = this.stack.pop();
            for ( var p in dict ) {
              obj[p] = dict[p];
            }
            this.stack.push(obj);
            break;
        case REDUCE:
            var args = this.stack.pop();
            var func = this.stack[this.stack.length - 1];
            this.stack[this.stack.length - 1] = func(args);
            break;
        case INT:
            var value = this.buffer_readLine(buffer, i, pickle)
            i += value.length + 1;
            if (value == '01')
                this.stack.push(true);
            else if (value == '00')
                this.stack.push(false);
            else
                this.stack.push(parseInt(value));
            break;
        case BININT:
            this.stack.push(buffer.readInt32LE(i));
            i += 4;
            break;
        case BININT1:
            this.stack.push(buffer.readUInt8(i));
            i += 1;
            break;
        case BININT2:
            this.stack.push(buffer.readUInt16LE(i));
            i += 2;
            break;
        case MARK:
            this.stack.push(this.mark);
            break;
        case FLOAT:
            var value = this.buffer_readLine(buffer, i, pickle)
            i += value.length + 1;
            this.stack.push(parseFloat(value));
            break;
        case LONG:
            var value = this.buffer_readLine(buffer, i, pickle)
            i += value.length + 1;
            this.stack.push(parseInt(value));
            break;
        case BINFLOAT:
            this.stack.push(buffer.readDoubleBE(i));
            i += 8;
            break;
        case STRING:
            var value = this.buffer_readLine(buffer, i, pickle)
            i += value.length + 1;
            var quotes = "\"'";
            if (value[0] == "'") {
                if (value[value.length-1] != "'")
                    throw "insecure string pickle";
            } else if (value[0] = '"') {
                if (value[value.length-1] != '"')
                    throw "insecure string pickle";
            } else {
                throw "insecure string pickle";
            }
            this.stack.push(value.substr(1, value.length-2));
            break;
        case UNICODE:
            var value = this.buffer_readLine(buffer, i, pickle)
            i += value.length + 1;
            this.stack.push(value);
            break;
        case BINSTRING:
        case BINBYTES:
            var length = buffer.readUInt32LE(i);
            i += 4;
            this.stack.push(buffer.toString('binary', i, i + length));
            i += length;
            break;
        case SHORT_BINSTRING:
        case SHORT_BINBYTES:
            var length = buffer.readUInt8(i++);
            this.stack.push(buffer.toString('binary', i, i + length));
            i += length;
            break;
        case BINUNICODE:
            var length = buffer.readUInt32LE(i);
            i += 4;
            this.stack.push(buffer.toString('utf8', i, i + length));
            i += length;
            break;
        case APPEND:
            var value = this.stack.pop();
            this.stack[this.stack.length-1].push(value);
            break;
        case APPENDS:
            var mark = this.marker(),
                list = this.stack[mark - 1];
            list.push.apply(list, this.stack.slice(mark + 1));
            this.stack = this.stack.slice(0, mark);
            break;
        case SETITEM:
            var value = this.stack.pop()
              , key = this.stack.pop();
            this.stack[this.stack.length-1][key] = value;
            break;
        case SETITEMS:
            var mark = this.marker()
              , obj = this.stack[mark - 1];
            for (var pos = mark + 1; pos < this.stack.length; pos += 2) {
                obj[this.stack[pos]] = this.stack[pos + 1];
            }
            this.stack = this.stack.slice(0, mark);
            break;
        case LIST:
        case TUPLE:
            var mark = this.marker()
              , list = this.stack.slice(mark + 1);
            this.stack = this.stack.slice(0, mark);
            this.stack.push(list);
            break;
        case DICT:
            var mark = this.marker()
                obj = {};
            for (var pos = mark + 1; pos < this.stack.length; pos += 2) {
                obj[this.stack[pos]] = this.stack[pos + 1];
            }
            this.stack = this.stack.slice(0, mark);
            this.stack.push(obj);
            break;
        case STOP:
            return this.stack.pop();
        case NONE:
            this.stack.push(null);
            break;
        default:
            throw "Unhandled opcode '" + opcode + "'";
        }
    }
    };

    

 ArrayBufferToString(buffer) {
  return this.BinaryToString(String.fromCharCode.apply(null, Array.prototype.slice.apply(new Uint8Array(buffer))));
}

 StringToArrayBuffer(string) {
  return this.StringToUint8Array(string).buffer;
}

 BinaryToString(binary) {
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

 StringToBinary(string) {
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
 StringToUint8Array(string) {
  var binary, binLen, buffer, chars, i, _i;
  binary = this.StringToBinary(string);
  binLen = binary.length;
  buffer = new ArrayBuffer(binLen);
  chars  = new Uint8Array(buffer);
  for (i = _i = 0; 0 <= binLen ? _i < binLen : _i > binLen; i = 0 <= binLen ? ++_i : --_i) {
      chars[i] = String.prototype.charCodeAt.call(binary, i);
  }
  return chars;
}
}

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {
  public templates : Slide[][]
  get err() {
    return TopComponent.error;
  }
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

  private static error = '';


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
        TopComponent.error = ''
        let binary  = r.result as ArrayBuffer
        var bytes = new Uint8Array(binary);
        var len = bytes.byteLength;
        let bday = ''

        for (var i = 0; i < len; i++) {
          bday += String.fromCharCode(bytes[i]);
        }
     
        try{
          let result = new Parser().loads(bday);
          TopComponent.someObject = result;
        }
        catch(ex){
          TopComponent.error = ex
          TopComponent.someObject = null
        }
       
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
