// 전체선택
$('input[name=_selected_all_]').on('change', function(){
  $('input[name=object_CheckBox]').prop('checked', this.checked);
});

$("#create-excel").click(function(){
  var rowData = new Array();
  var selected_interviewee = new Array();
  var checkbox = $("input[name=object_CheckBox]:checked");
  // http://jsfiddle.net/jscodedev/awwkb5b9/1/
  checkbox.each(function(i) {
    var tr = checkbox.parent().parent().eq(i);
    var td = tr.children();
    
    rowData.push(tr.text());

    var code = td.eq(9).text();
    selected_interviewee.push(code);

  });

  var $crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');
  var formData = new FormData();
  formData.append("selected_interviewee", selected_interviewee);

  $.ajax({
    url: "/fileserver/detail/interviewee/", // 통신할 url을 지정
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
      alert("선택 된 응시자가 존재하지 않습니다.")
    },
  });
})

