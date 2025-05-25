const modal = document.getElementById("modal")

// modal 열기
$("#open_modal").click(function(){
  $("#modal_table").empty();
  var checkbox = $("input[name=object_CheckBox]:checked");
  var selected = new Array();
  var rowData = new Array();
  
  checkbox.each(function(i) {
    var tr = checkbox.parent().parent().eq(i);
    var td = tr.children();
    
    rowData.push(tr.text());

    var code = td.eq(15).text();
    selected.push(code);

  });

  var $crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');
  var formData = new FormData();
  formData.append("selected", selected);

  $.ajax({
    url: "/ktcsaipg/user/retired/", // 통신할 url을 지정
    type: "post",
    headers:{"X-CSRFToken": $crf_token},
    dataType: "json",
    async: true,
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    timeout: 60000,
    
    success: function (data, message, xhr){ 
      response = JSON.parse(xhr.responseText);
      tr = ''
      for (const obj of response.data) {
        var sex = obj.sex == "M" ? "남자": "여자"
        
        tr += '<tr>' +
        '<td>' + obj.fullname + '</td>' +
        '<td>' + obj.phone + '</td>' +
        '<td>' + obj.sex + '</td>' +
        '<td>' + obj.birthday + '</td>' +
        '<td>' + obj.hope_working_area + '</td>' +
        '<td>' + obj.sms_send_user + '</td>' +
        '<td>' + obj.sms_send_datetime + '</td>' +
        '<td>' + obj.is_sms + '</td>' +
        '<td style="display:none;" id=modal_id>' + obj.id + '</td>' +
        '</tr>'
      }
      $("#modal_table").append(tr)
      
    },
    error: function(xhr, status, error){ // 통신 실패시 - 로그인 페이지 리다이렉트
      response_text = JSON.parse(xhr.responseText);
      alert(response_text.error)
    },
  });

})

$("#send_sms").click(function(){
  var table = document.getElementById("modal_table_data");
  var modal_content = document.getElementById("modal_content").value;
  id_list = new Array();
  var rows = table.rows;
  var len = rows.length;
  var data = [];
  var cells;
  // id_list = document.getElementById("modal_id").innerHTML;

  for (var r = 1, n = table.rows.length; r < n; r++) {
    id_list.push(table.rows[r].cells[8].innerHTML)
    // for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
        // console.log(table.rows[r].cells[c].innerHTML + " / " + r + " / " + c);
      // }
    }
  var $crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');
  var formData = new FormData();
  formData.append("id_list", id_list)
  formData.append("modal_content", modal_content)

  $.ajax({
    url: "/ktcsaipg/user/retired/sms/", // 통신할 url을 지정
    type: "post", // 데이터를 전송하는 방법을 지정
    headers:{"X-CSRFToken": $crf_token},
    dataType: "json",
    async: true,
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    timeout: 60000,
    
    success: function (data, message, xhr){
      alert("문자 보내기 완료!")
      // location.reload()
    },
    error: function(xhr, status, error){ // 통신 실패시 - 로그인 페이지 리다이렉트
      response_text = JSON.parse(xhr.responseText);
      alert(response_text.error)
    },
  });
})

// modal 밖을 눌렀을 때 종료할 경우
// modal.addEventListener("click", e => {
//   const evTarget = e.target
//   if(evTarget.classList.contains("modal-overlay")) {
//       modal.style.display = "none"
//   }
// })

// 전체선택
$('input[name=_selected_all_]').on('change', function(){
  $('input[name=object_CheckBox]').prop('checked', this.checked);
});

$("#create-excel").click(function(){
  var rowData = new Array();
  var selected = new Array();
  var checkbox = $("input[name=object_CheckBox]:checked");
  // http://jsfiddle.net/jscodedev/awwkb5b9/1/
  checkbox.each(function(i) {
    var tr = checkbox.parent().parent().eq(i);
    var td = tr.children();
    
    rowData.push(tr.text());

    var code = td.eq(15).text();
    selected.push(code);

  });

  var $crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');
  var formData = new FormData();
  formData.append("selected", selected);

  $.ajax({
    url: "/fileserver/detail/retierd/", // 통신할 url을 지정
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
    error: function(xhr, status, error){ // 통신 실패시 - 로그인 페이지 리다이렉트
      alert("1명 이상 선택해야 합니다.")
    },
  });
})

$("#upload-excel").click(function(){
  var $crf_token = $('[name="csrfmiddlewaretoken"]').attr('value');
  var formData = new FormData();
  formData.append("uploaded_excel", document.getElementById("excel_file").files[0])

  $.ajax({
    url: "/fileserver/detail/retierd/upload/", // 통신할 url을 지정
    // beforeSubmit: loadingAjaxImage,
    // contentType: "application/x-www-form-urlencoded;charset=UTF-8",
    type: "post", // 데이터를 전송하는 방법을 지정
    headers:{"X-CSRFToken": $crf_token},
    // dataType: "json",
    dataType: "json",
    async: true,
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    timeout: 60000,
    
    success: function (data, message, xhr){
      alert("엑셀 업로드 성공!")
      location.reload()
    },
    error: function(xhr, status, error){ // 통신 실패시 - 로그인 페이지 리다이렉트
      response_text = JSON.parse(xhr.responseText);
      alert(response_text.error)
    },
  });
})

