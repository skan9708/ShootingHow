// 이벤트 삭제
$("#event-remove").click(function(){
  var rowData = new Array();
  var selected_event = new Array();
  var checkbox = $("input[name=object_CheckBox]:checked");
  // http://jsfiddle.net/jscodedev/awwkb5b9/1/
  checkbox.each(function(i) {
    var tr = checkbox.parent().parent().eq(i);
    var td = tr.children();
    
    rowData.push(tr.text());
    
    var id = td.eq(10).text();
    selected_event.push(id);
    
  });
  
  var $crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');
  var formData = new FormData();
  formData.append("selected_event", selected_event);

  $.ajax({
    type: "delete", // 데이터를 전송하는 방법을 지정
    url: "/ktcsaipg/ai/event/", // 통신할 url을 지정
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
      alert("실패")
      // window.location.replace("/accounts/login/")
      //  alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
    },


  });
})

// 이벤트 생성
$("#event-create").click(function(){
  // var f_obj = $("#event_thumbnail").get(0).files[0]; // get the upload file information
  // console.log("File object:",f_obj);
  // console.log("The file name is:",f_obj.name);
  // console.log("The file size is:",f_obj.size);

  var formData = new FormData();
  var $crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');
  // formData.append("username", username);
  // formData.append("rowData", rowData);
  // formData.append("selected_event", selected_event);
  // var coupon_code = document.getElementById("coupon_code").value;
  formData.append("event_name", document.getElementById("event_name").value)
  formData.append("event_thumbnail", document.getElementById("event_thumbnail").files[0])
  formData.append("event_detail", document.getElementById("event_detail").files[0])
  formData.append("start_date", document.getElementById("start_date").value)
  formData.append("end_date", document.getElementById("end_date").value)
  formData.append("event_type", document.getElementById("event_type").value)
  formData.append("event_url", document.getElementById("event_url").value)

  formData.append(
    "csrfmiddlewaretoken",
    $("input[name=csrfmiddlewaretoken]").val()
    );
  $.ajax({
    type: "POST",
    url: "/ktcsaipg/ai/event/create/", // 통신할 url을 지정
    success: function(response){ 
      location.href = "/ktcsaipg/ai/event/"
      
    },
    
    error: function(xhr, status, error){ // 통신 실패시 - 로그인 페이지 리다이렉트
      response_text = JSON.parse(xhr.responseText);
      alert(response_text.message)
      
      // window.location.replace("/accounts/login/")
      //  alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
    },

    dataType: "json",
    async: true,
    headers:{"X-CSRFToken": $crf_token},
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    timeout: 60000,
  });
})