$("#business_user-remove").click(function(){
    if (confirm("선택한 사용자를 삭제하시겠습니까?")) {
    var rowData = new Array();
    var selected_object = new Array();
    var checkbox = $("input[name=object_CheckBox]:checked");
    // http://jsfiddle.net/jscodedev/awwkb5b9/1/
    checkbox.each(function(i) {
      var tr = checkbox.parent().parent().eq(i);
      var td = tr.children();
      
      rowData.push(tr.text());
      
      var id = td.eq(8).text();
      selected_object.push(id);
    });

    var $crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');
    var formData = new FormData();
    formData.append("selected_user", selected_object);
  
    $.ajax({
    //   type: "post", // 데이터를 전송하는 방법을 지정
      type: "delete", // 데이터를 전송하는 방법을 지정
      url: "/ktcsaipg/user/business/", // 통신할 url을 지정
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
    } else {
      // 취소 버튼 클릭 시 동작
      // alert("동작을 취소했습니다.");
  }
  })


  // 리뷰 생성
  $("#review-create").click(function(){
    // var f_obj = $("#review_thumbnail").get(0).files[0]; // get the upload file information
    // console.log("File object:",f_obj);
    // console.log("The file name is:",f_obj.name);
    // console.log("The file size is:",f_obj.size);
  
    var formData = new FormData();
    var $crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');
    // formData.append("username", username);
    // formData.append("rowData", rowData);
    // formData.append("selected_review", selected_review);
    // var coupon_code = document.getElementById("coupon_code").value;
    formData.append("review_title", document.getElementById("review_title").value)
    formData.append("review_status", document.getElementById("review_status").value)
    formData.append("review_content", document.getElementById("review_content").value)
    formData.append("review_company", document.getElementById("review_company").value)
    formData.append("user", document.getElementById("user").value)
  
    formData.append(
      "csrfmiddlewaretoken",
      $("input[name=csrfmiddlewaretoken]").val()
      );
    $.ajax({
      type: "POST",
      url: "/ktcsaipg/ai/review/create/", // 통신할 url을 지정
      success: function(response){ 
        // location.href = "/ktcsaipg/ai/review/"
        
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



  $("#business_user_detail-remove").click(function(){
    var obj_id = window.location.pathname.split('/');
    obj_id = obj_id[obj_id.length-2]
    var $crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');

    // formData.append("obj_id", obj_id);
    $.ajax({
    //   type: "post", // 데이터를 전송하는 방법을 지정
      type: "delete", // 데이터를 전송하는 방법을 지정
      url: "/ktcsaipg/user/business/detail/" + obj_id + "/", // 통신할 url을 지정
      headers:{"X-CSRFToken": $crf_token},
      dataType: "json",
      async: true,
      // data: formData,
      cache: false,
      contentType: false,
      processData: false,
      timeout: 60000,
      
      success: function(response){ 
        // alert("삭제 성공")
        window.location.replace("/ktcsaipg/user/business/")
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


  $("#business_user_detail-save").click(function(){
    var obj_id = window.location.pathname.split('/');
    obj_id = obj_id[obj_id.length-2]

    var formData = new FormData();
    var $crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');
    var data = {"key":"value"};

    formData.append("user_fullname", document.getElementById("user_fullname").value)
    formData.append("user_company_name", document.getElementById("user_company_name").value)
    formData.append("user_address", document.getElementById("user_address").value)
    formData.append("user_telephone", document.getElementById("user_telephone").value)
    formData.append("user_company_name", document.getElementById("user_company_name").value)
    formData.append("user_team_name", document.getElementById("user_team_name").value)
    formData.append("user_company_rank", document.getElementById("user_company_rank").value)
    formData.append("user_business_registration_number", document.getElementById("user_business_registration_number").value)

    // formData.append("obj_id", obj_id);
    $.ajax({
    //   type: "post", // 데이터를 전송하는 방법을 지정
      type: "put", // 데이터를 전송하는 방법을 지정
      url: "/ktcsaipg/user/business/detail/" + obj_id + "/", // 통신할 url을 지정
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
        // location.reload()
        window.location.replace("/ktcsaipg/user/business/detail/" + obj_id + "/")
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