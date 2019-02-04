
  //ajax 변수지정
  var queue = new Array();
  var request;

  createRequest();

  function readData(data){
    JSON2Table(document.getElementByld("listTable"),"list",result);
  }

  //JSON 데이터를 테이블로 변환
  function JSON2Table(table, name, result){
    //헤더추가
    if(table.tHead == null){
      var thead = document.createElement("thead");
      var tr = document.createElement("tr");
      tr.id = "head";

      for(j in data[0])
      {
        var td = document.createElement("th");
        td.id = "head" + "-" +j;
        td.className = "head" + j.toString();
        td.name = j.toString();
        td.appendChild(document.createTextNode(j));
        tr.appendChild(td);
      }
      thead.appendChild(tr);
      table.appendChild(thead);
    }
    //항목별 내용추가
    for(var i=0; i<data.lenght; i++){
      var tr = document.createElement("tr");
      tr.id = name + "_" + data[i].id;
      for(j in data[i]){
        td.id = tr.id + "_" + j;
        td.className = j.toString();
        td.appendChild(document.createTextNode(data[i][j]))
        tr.appendChild(td);
      }
      table.tBodies[0].appendChild(tr);
    }
  }

  //XMLRequst 생성
  function createRequest(){
    try{
      request = new XMLHttpRequest();
    } catch(trymicrosoft){
      try{
        request = new ActiveXObject("Msxml2.XMLHTTP");
      }catch(othermicrosoft){
        try{
          request = new ActiveXObject("Microsoft.XMLHTTP");
        }catch(failed){
          request = false;
        }
      }
      }
      if(!request)
      alert('Error initializing XMLHttpRequest');
    }
    //요청을 보내는 함수
    function requestSend(url, callbackMethod){
      queue.push(new Array(url, callbackMethod));
      checkQueue();
    }
    //요청큐 상태 확인 후 보내야 할 내용이 있으면 처리
    function checkQueue(){
      if(queue > 0 && (request.readyState == 0 || request.readyState == 4)){
        var url = queue[0][0];
        var callbackMethod = queue[0][1];
        delete queue[0];
        if(queue.length)
        queue = queue.slice(1);
        requestExecute(url, callbackMethod);
      }
    }
    //요청 실행 함수
    function requestExecute(url, callbackMethod){
      request.open("POST",url,ture);
      request.onreadystatechange = function(){
        if(request.readyState == 4) //Ajax 요청 상태값 : 전송완
        if(request.status == 200)  //HTTP 요청 상태값 : 성공
        {
          var data = eval(request.responseText);
          callbackMethod(data);
        }
      };
      request.send(null);
    }
  }
