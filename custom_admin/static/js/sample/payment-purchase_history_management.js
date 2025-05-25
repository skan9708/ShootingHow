// 쿠폰 삭제
$("#payment-cancel").click(function(){
  if (confirm("선택한 결제내역을 취소하시겠습니까?")) {
    var $crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');
    var formData = new FormData();
    formData.append("selected_history", document.getElementById("payment-cancel").value)

    $.ajax({
    //   type: "post", // 데이터를 전송하는 방법을 지정
      type: "delete", // 데이터를 전송하는 방법을 지정
      url: "/ktcsaipg/pay/history/purchase/", // 통신할 url을 지정
      headers:{"X-CSRFToken": $crf_token},
      dataType: "json",
      async: true,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      timeout: 60000,
      
      success: function(response){ 
        location.href = "/ktcsaipg/pay/history/purchase/"
        // location.reload()
        // alert("삭제 성공")
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
}
    else{

    }
  })