import time
import json
import logging
from pprint import pprint
from rest_framework.status import is_client_error, is_server_error

request_logger = logging.getLogger(__name__)

class RequestLogMiddleware:
    """Request / Response Logging"""
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        self.start_time = time.time()
        log_data = {
            "remote_address": request.META["REMOTE_ADDR"],
            # "server_hostname": socket.gethostname(),
            "request_method": request.method,
            "content_type": request.content_type,
            "request_path": request.get_full_path(),
        }
        
        full_path = str(request.get_full_path())
        is_logging = bool(
            "/api/" in full_path and
            "/api/fileserver/" not in full_path and
            "insomnia" not in request.headers.get("user_agent", "")
        )

        if is_logging:
            try:
                req_body = json.loads(request.body.decode("utf-8")) if request.body else {}
            except:
                req_body = []
                for line in request.body.split(b"\r"):
                    try:
                        decode_line = line.decode()
                    except:
                        pass
                    
                    if "Content-Disposition" in decode_line:
                        req_body.append(decode_line.strip())
                    
            log_data["request_body"] = req_body

            pprint(log_data, width=150, sort_dicts=False)
        
        # after response
        response = self.get_response(request)
        if not is_logging or is_server_error(response.status_code):
            return response

        try:
            response_body = json.loads(response.content.decode())
        except: 
            response_body = ""
        
        self.response_log = {
            "response_body": response_body,
        }

        return self.process_response(request, response)
    
    def process_response(self, request, response):
        pprint(self.response_log, width=150, sort_dicts=False, compact=True)
        pprint({"runtime": time.time() - self.start_time})
        return response

class ResponseFormattingMiddleware:
    """client error 통일"""
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        if not is_client_error(response.status_code) or not hasattr(response, "data"):
            return response
        
        response = self.process_response(request, response)
            
        return response

    def process_response(self, request, response):
        data = response.data
        while not isinstance(data, str):
            if isinstance(data, list):
                data = data[0]
                
            else:
                for k, v in data.items():
                    data = v
                    break

        response.data = {"error": data}
        
        response.content = response.render().rendered_content

        return response