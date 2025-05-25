from django.conf import settings
from payment.models import PaymentHistory
import requests
import json

# TOSS_CONNECT = http.client.HTTPSConnection("api.tosspayments.com")

TOSS_HEADER = {
    'Authorization': f"Basic {settings.TOSS_SECRET_KEY_BASE64}",
    # 'Authorization': f"Basic {TOSS_SECRET_KEY_BASE64}",
    'Content-Type': "application/json"
    }

response_data = {
    "mId": "tosspayments",
    "version": "2022-06-08",
    "paymentKey": "aetsfnRj2G7duhd9txWUP",
    "status": "DONE",
    "transactionKey": "lCxiYTLTMaDMVrvqo05E2",
    "lastTransactionKey": "7QxmONBQllnnjapXuOdQF",
    "orderId": "71cec833-d8e4-4c0d-9f27-8f269a34dc8e",
    "orderName": "토스 티셔츠 주문",
    "requestedAt": "2022-06-08T15:40:09+09:00",
    "approvedAt": "2022-06-08T15:40:49+09:00",
    "useEscrow": False,
    "cultureExpense": False,
    "card": {
      "company": "농협",
      "number": "123456******7890",
      "installmentPlanMonths": 0,
      "isInterestFree": False,
      "interestPayer": None,
      "approveNo": "21974757",
      "useCardPoint": False,
      "cardType": "신용",
      "ownerType": "개인",
      "acquireStatus": "READY",
      "receiptUrl": "https://dashboard.tosspayments.com/sales-slip?transactionId=KAgfjGxIqVVXDxOiSW1wUnRWBS1dszn3DKcuhpm7mQlKP0iOdgPCKmwEdYglIHX&ref=PX",
      "amount": 15000
    },
    "virtualAccount": None,
    "transfer": None,
    "mobilePhone": None,
    "giftCertificate": None,
    "cashReceipt": None,
    "discount": None,
    "cancels": None,
    "secret": None,
    "type": "NORMAL",
    "easyPay": {
      "provider": "토스페이",
      "amount": 0,
      "discountAmount": 0
    },
    "country": "KR",
    "failure": None,
    "isPartialCancelable": True,
    "receipt": {
      "url": "https://dashboard.tosspayments.com/sales-slip?transactionId=KAgfjGxIqVVXDxOiSW1wUnRWBS1dszn3DKcuhpm7mQlKP0iOdgPCKmwEdYglIHX&ref=PX"
    },
    "currency": "KRW",
    "totalAmount": 15000,
    "balanceAmount": 15000,
    "suppliedAmount": 13636,
    "vat": 1364,
    "taxFreeAmount": 0,
    "method": "간편결제"
  }

def add_payment_history(response_data):
    data = {}

    # data["order_id"] = order_id
    data["order_name"] = response_data.get("orderName")
    data["status"] = response_data.get("status")
    data["easy_pay_info"] = response_data.get("easyPay")
    data["card_info"] = response_data.get("card")
    data["requested_at"] = response_data.get("requestedAt")
    data["approved_at"] = response_data.get("approvedAt")
    data["amount"] = response_data.get("totalAmount")
    data["raw_data"] = str(response_data)

    payment_history = PaymentHistory(**data)
    payment_history.save()

    return payment_history

def payment(data):
    # data_sample = {
    #     "paymentKey": "AYU6Y0f7Iyh0fK_IyUCqG",
    #     "amount":15000,
    #     "orderId":"x4eaHxNAthgw5459j7nvI"
    # }
    response_data = requests.post(
            url="https://api.tosspayments.com/v1/payments/confirm",
            data=json.dumps(data),
            headers=TOSS_HEADER,
        ).json()

    return response_data
