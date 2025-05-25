// 쿠폰 삭제
$("#coupon-remove").click(function(){
  var rowData = new Array();
  var selected_coupon = new Array();
  var checkbox = $("input[name=object_CheckBox]:checked");
  // http://jsfiddle.net/jscodedev/awwkb5b9/1/
  checkbox.each(function(i) {
    var tr = checkbox.parent().parent().eq(i);
    var td = tr.children();
    
    rowData.push(tr.text());
    var code = td.eq(8).text();
    selected_coupon.push(code);

  });

  var $crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');
  var formData = new FormData();
  formData.append("selected_coupon", selected_coupon);

  $.ajax({
    type: "delete", // 데이터를 전송하는 방법을 지정
    url: "/ktcsaipg/ai/coupon/", // 통신할 url을 지정
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

// 쿠폰 생성
$("#coupon-create").click(function(){
  var formData = new FormData();
  var $crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');
  var data = {"key":"value"};
  // formData.append("username", username);
  // formData.append("rowData", rowData);
  // formData.append("selected_coupon", selected_coupon);
  // var coupon_code = document.getElementById("coupon_code").value;
  formData.append("coupon_name", document.getElementById("coupon_name").value)
  // formData.append("coupon_code", document.getElementById("coupon_code").value)
  formData.append("coupon_type", document.getElementById("coupon_type").value)
  formData.append("coupon_value", document.getElementById("coupon_value").value)
  formData.append("expired", document.getElementById("expired").value)
  formData.append("start_date", document.getElementById("start_date").value)
  formData.append("end_date", document.getElementById("end_date").value)
  formData.append("user", document.getElementById("user").value)
  
  formData.append(
    "csrfmiddlewaretoken",
    $("input[name=csrfmiddlewaretoken]").val()
  );
  $.ajax({
    type: "POST",
    url: "/ktcsaipg/ai/coupon/create/", // 통신할 url을 지정
    success: function(response){ 
      location.href = "/ktcsaipg/ai/coupon/"
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
    // data: {"a": "b"},
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    timeout: 60000,
  });
})

// 쿠폰 수정
$("#coupon-update").click(function(){
  var formData = new FormData();
  var $crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');
  var data = {"key":"value"};
  var obj_id = document.getElementById("coupon-update").value
  // formData.append("username", username);
  // formData.append("rowData", rowData);
  // formData.append("selected_coupon", selected_coupon);
  // var coupon_code = document.getElementById("coupon_code").value;
  formData.append("coupon_name", document.getElementById("coupon_name").value)
  formData.append("coupon_type", document.getElementById("coupon_type").value)
  formData.append("coupon_value", document.getElementById("coupon_value").value)
  formData.append("expired", document.getElementById("expired").value)
  formData.append("start_date", document.getElementById("start_date").value)
  formData.append("end_date", document.getElementById("end_date").value)
  formData.append("user", document.getElementById("user").value)

  formData.append(
    "csrfmiddlewaretoken",
    $("input[name=csrfmiddlewaretoken]").val()
  );
  $.ajax({
    type: "PUT",
    url: "/ktcsaipg/ai/coupon/update/" + obj_id + "/", // 통신할 url을 지정
    success: function(response){ 
      location.href = "/ktcsaipg/ai/coupon/"
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
    // data: {"a": "b"},
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    timeout: 60000,
  });
})