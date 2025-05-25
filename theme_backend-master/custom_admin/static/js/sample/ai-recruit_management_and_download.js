// 전형 삭제
$("#recruit-remove").click(function(){
  var rowData = new Array();
  var selected_recruit = new Array();
  var checkbox = $("input[name=object_CheckBox]:checked");
  // http://jsfiddle.net/jscodedev/awwkb5b9/1/
  checkbox.each(function(i) {
    var tr = checkbox.parent().parent().eq(i);
    var td = tr.children();
    
    rowData.push(tr.text());

    var code = td.eq(11).text();
    selected_recruit.push(code);

  });

  var $crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');
  var formData = new FormData();
  formData.append("selected_recruit", selected_recruit);

  $.ajax({
    type: "delete", // 데이터를 전송하는 방법을 지정
    url: "/ktcsaipg/ai/recruit/", // 통신할 url을 지정
    headers:{"X-CSRFToken": $crf_token},
    dataType: "json",
    async: true,
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    timeout: 60000,
    
    success: function(response){ 
      // alert("삭제 성공")
      location.reload()
      // $("#count-"+pk).html(response.like_count+"개");
      // var users = $("#like-user-"+pk).text();
      // if(users.indexOf(response.nickname) != -1){
      //   $("#like-user-"+pk).text(users.replace(response.nickname, ""));
      // }else{
      //   $("#like-user-"+pk).text(response.nickname+users);
      // }
    },
    error: function(request, status, error){ // 통신 실패시 - 로그인 페이지 리다이렉트
      alert("실패");
      // window.location.replace("/accounts/login/")
    },


  });
})


// 응시자 삭제
$("#interviewee_test-remove").click(function(){
  var rowData = new Array();
  var selected_interviewee = new Array();
  var checkbox = $("input[name=object_CheckBox]:checked");
  // http://jsfiddle.net/jscodedev/awwkb5b9/1/
  checkbox.each(function(i) {
    var tr = checkbox.parent().parent().eq(i);
    var td = tr.children();
    
    rowData.push(tr.text());

    var code = td.eq(7).text();
    selected_interviewee.push(code);

  });

  alert(selected_interviewee)


  var $crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');
  var formData = new FormData();
  formData.append("selected_interviewee", selected_interviewee);

  $.ajax({
    type: "delete", // 데이터를 전송하는 방법을 지정
    url: "/ktcsaipg/ai/recruit/detail/", // 통신할 url을 지정
    headers:{"X-CSRFToken": $crf_token},
    dataType: "json",
    async: true,
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    timeout: 60000,
    
    success: function(response){ 
      // alert("삭제 성공")
      location.reload()
      // $("#count-"+pk).html(response.like_count+"개");
      // var users = $("#like-user-"+pk).text();
      // if(users.indexOf(response.nickname) != -1){
      //   $("#like-user-"+pk).text(users.replace(response.nickname, ""));
      // }else{
      //   $("#like-user-"+pk).text(response.nickname+users);
      // }
    },
    error: function(request, status, error){ // 통신 실패시 - 로그인 페이지 리다이렉트
      alert("실패");
      // window.location.replace("/accounts/login/")
      //  alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
    },


  });
})


//응시자 개인리포트 다운로드
$("#download-individual-report").click(function(){
  var rowData = new Array();
  var selected_interviewee = new Array();
  var checkbox = $("input[name=object_CheckBox]:checked");
  // http://jsfiddle.net/jscodedev/awwkb5b9/1/
  checkbox.each(function(i) {
    var tr = checkbox.parent().parent().eq(i);
    var td = tr.children();
    
    rowData.push(tr.text());

    var code = td.eq(7).text();
    selected_interviewee.push(code);

  });

  var $crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');
  var formData = new FormData();
  formData.append("selected_interviewee", selected_interviewee);

  $.ajax({
    url: "/fileserver/report/interviewee/", // 통신할 url을 지정
    // beforeSubmit: loadingAjaxImage,
    contentType: false,
    // contentType: "application/x-www-form-urlencoded;charset=UTF-8",
    type: "post", // 데이터를 전송하는 방법을 지정
    headers:{"X-CSRFToken": $crf_token},
    // dataType: "json",
    async: true,
    data: formData,
    cache: false,
    processData: false,
    timeout: 60000,
    
    xhr: function () { 
      let xhr = new XMLHttpRequest(); 
      xhr.onreadystatechange = function () { 
                  //response 데이터를 바이너리로 처리한다. 세팅하지 않으면 default가 text 
        xhr.responseType = "blob"; 
      }; 
      return xhr; 
    },
    
    success: function (data, message, xhr){ 
      // hideAjaxImage(); 
				// 성공했을때만 파일 다운로드 처리하고
      let disposition = xhr.getResponseHeader('Content-Disposition'); 
      let filename; 
      if (disposition && disposition.indexOf('attachment') !== -1) { 
        let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/; 
        let matches = filenameRegex.exec(disposition); 
        if (matches != null && matches[1]) {
          filename = decodeURI(matches[1].replace(/['"]/g, ""));
        }
      } 
      let blob = new Blob([data]); 
      let link = document.createElement('a'); 
      link.href = window.URL.createObjectURL(blob); 
      link.download = filename; 
      link.click(); 
    },
    error: function(request, status, error){ // 통신 실패시 - 로그인 페이지 리다이렉트
      alert("선택 된 사용자가 존재하지 않습니다.")
    },
  });
})


// 전형 엑셀 다운로
$("#create-excel").click(function(){
  var rowData = new Array();
  var selected_recruit = new Array();
  var checkbox = $("input[name=object_CheckBox]:checked");
  // http://jsfiddle.net/jscodedev/awwkb5b9/1/
  checkbox.each(function(i) {
    var tr = checkbox.parent().parent().eq(i);
    var td = tr.children();
    
    rowData.push(tr.text());

    var code = td.eq(11).text();
    selected_recruit.push(code);

  });

  var $crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');
  var formData = new FormData();
  formData.append("selected_recruit", selected_recruit);

  $.ajax({
    url: "/fileserver/excel/recruit/", // 통신할 url을 지정
    // beforeSubmit: loadingAjaxImage,
    contentType: false,
    // contentType: "application/x-www-form-urlencoded;charset=UTF-8",
    type: "post", // 데이터를 전송하는 방법을 지정
    headers:{"X-CSRFToken": $crf_token},
    // dataType: "json",
    async: true,
    data: formData,
    cache: false,
    processData: false,
    timeout: 60000,
    
    xhr: function () { 
      let xhr = new XMLHttpRequest(); 
      xhr.onreadystatechange = function () { 
                  //response 데이터를 바이너리로 처리한다. 세팅하지 않으면 default가 text 
        xhr.responseType = "blob"; 
      }; 
      return xhr; 
    },
    
    success: function (data, message, xhr){ 
      // hideAjaxImage(); 
				// 성공했을때만 파일 다운로드 처리하고
      let disposition = xhr.getResponseHeader('Content-Disposition'); 
      let filename; 
      if (disposition && disposition.indexOf('attachment') !== -1) { 
        let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/; 
        let matches = filenameRegex.exec(disposition); 
        if (matches != null && matches[1]) {
          filename = decodeURI(matches[1].replace(/['"]/g, ""));
        }
      } 
      let blob = new Blob([data]); 
      let link = document.createElement('a'); 
      link.href = window.URL.createObjectURL(blob); 
      link.download = filename; 
      link.click(); 
    },
    error: function(request, status, error){ // 통신 실패시 - 로그인 페이지 리다이렉트
      alert("선택 된 전형이 존재하지 않습니다.")
    },
  });
})

