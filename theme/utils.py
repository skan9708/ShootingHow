import requests
from pprint import pprint

ALIGO_UIL = "https://apis.aligo.in"
default_sms_params = {
    'key': 's77bsz1xeej6yjazhdxor9aimwah2uz8',
    'user_id': '93293',
    'sender': '042-604-5056',
    'msg_type': 'LMS',
    'testmode_yn': 'Y',
}

def send_sms(params):
    pprint(params, sort_dicts=False)
    # mass_send_response = requests.post(f"{ALIGO_UIL}/send_mass/", data=params).json()
    
    # print("###########################")
    # pprint(mass_send_response, sort_dicts=False)
    # print("@@@@@@@@@@@@@@@@@@@@@@@@@@")
    # if int(mass_send_response['result_code']) < 0:
        # return mass_send_response['message']
    
    return