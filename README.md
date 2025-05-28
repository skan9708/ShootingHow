# API 명세

http://localhost:8000/swagger/
http://localhost:8000/redoc/

# 결제 프로세스(업데이트 예정)
a. 결제 id 생성
http://localhost:8000/api/payment/check/
request : {
	"num_of_man": 1,
	"num_of_woman": 1,
	"start_time": "13:00",
	"calendar_date": 21,
	"product_option": 74
}

response : {
	"order_id": "f5d58fbe-6e30-43b0-a9ea-2ce62365f91b",
	"amount": 66000
}

b. toss 결제 callback url
http://localhost:8000/api/payment/