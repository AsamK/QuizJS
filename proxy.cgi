#!/bin/python3
import codecs
import os
import sys

import requests

sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

def printCorsHeaders():
	print("Access-Control-Allow-Headers:Content-Type,X-Cookie,Clientdate,Android-Id,Device-Info,Target-Path,Target-Host,Dt,H,W,Hmac")
	print("Access-Control-Expose-Headers:X-Set-Cookie,Set-Cookie")
	print("Access-Control-Allow-Methods:GET,HEAD,PUT,PATCH,POST,DELETE")
	print("Access-Control-Allow-Origin:http://localhost:8080")

if os.environ.get('REQUEST_METHOD') == "OPTIONS":
	printCorsHeaders()
	print("Status: 204 No Content\n")
	sys.exit()

# Check if http header is for valid host
host = os.environ.get('HTTP_TARGET_HOST', None)

if host == 'qkgermany.feoquizserver.com':
	method = os.environ.get('REQUEST_METHOD')

	path = os.environ.get('HTTP_TARGET_PATH', '')
	content_type = os.environ.get('CONTENT_TYPE', 'application/octet-stream')

	cookie = os.environ.get('HTTP_X_COOKIE', None)
	device_type = os.environ.get('HTTP_DT', None)
	device_info = os.environ.get('HTTP_DEVICE_INFO', None)
	android_id = os.environ.get('HTTP_ANDROID_ID', None)
	clientdate = os.environ.get('HTTP_CLIENTDATE', None)
	hmac = os.environ.get('HTTP_HMAC', None)
	height = os.environ.get('HTTP_H', None)
	width = os.environ.get('HTTP_W', None)

	session = requests.Session()

	headers = {
		   "Content-Type": content_type,
		   "Cookie": cookie,

		   "Clientdate": clientdate,
		   "Dt": device_type,
		   "Device-Info": device_info,
		   "Android-Id": android_id,
		   "Hmac": hmac,
		   "H": height,
		   "W": width,
		  }

	printCorsHeaders()
	print("Cache-Control: no-cache")

	url = "https://%s/%s" % (host, path)
	input_data = sys.stdin.buffer.read()
	try:
		if method == 'GET':
			r = session.get(url, headers=headers, data=input_data)
		elif method == 'POST':
			r = session.post(url, headers=headers, data=input_data)
	except:
		print("Content-Type: text/json")
		print("Status: 500 Internal Server Error\n")
		print('{"message":"Failed to contact remote server"}')
		sys.exit()

	for key, value in r.headers.items():
		if key == 'Content-Encoding' or key == 'Transfer-Encoding':
			continue
		if key == 'Set-Cookie':
			print("X-Set-Cookie: %s" % value)
			continue
		print("%s: %s" % (key, value))
	print("Status: %d %s\n" % (r.status_code, r.reason))

	# Forward response body
	r.encoding='utf-8'
	print(r.text)

	sys.exit()

print("Status: 403 Forbidden\n")
print("Forbidden")
sys.exit()
