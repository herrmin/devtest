var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var multer      = require('multer');
var xlstojson   = require("xls-to-json-lc");
var xlsxtojson  = require("xlsx-to-json-lc")
var fs          = require('fs');


    app.use(bodyParser.json());
    app.use(express.static('public'))
    app.set('view engine','ejs')
    //app.locals.jdata = require('./output.json')


    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });
    var upload = multer({ //multer settings
                    storage: storage,
                    fileFilter : function(req, file, callback){
                      if(['xls','xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1){
                        return callback(new Error('Wrong extension type'));
                      }
                      callback(null, true);
                    }
                }).single('file');
    /** API path that will upload the files */
    app.post('/ajx_upload', function(req, res) {
        var exceltojson; //초기화
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            /** Multer는 req.file 오브젝트에 파일을 넘긴다**/
            if(!req.file){
              res.json({error_code:1, err_desc:"No file passed"});
              return;
            }
            //xls를 json으로 변환 API
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
              exceltojson = xlsxtojson;
            }else{
              exceltojson = xlstojson;
            }
            try{
              exceltojson({
                input: req.file.path,
                output: null,lowerCaseHeaders:true
              }, function(err,result){
                if(err){
                  return res.json({error_code:1,err_desc:err,data:null});
                }
                var responseData = {error_code:0, err_desc:null, data:result};
                //res.render('table.ejs', {'data' : result})
                res.json(responseData);

              	//res.result;
                //res.render('table.ejs', {result : './output.json'});
                //fs.writeFileSync('output.json', JSON.stringify(result, null, 4), function(err){
                  console.log('File successfully written! - Check your project directory for the output.json file');
                })

            } catch (e){
              res.json({error_code:1,err_desc:"Corupted excel file"});
            }

        });
    });
    app.get('/',function(req,res){
    res.sendFile(__dirname + "/public/upload.html");
    });

    app.post('/ajx_upload', function(req,res){
      var contents = fs.readFileSync("./output.json");
      var jsonContent = JSON.parser(contents);
      res.json(jsonContent);
    });


    app.listen('3000', function(){
        console.log('running on 3000...');
    });
