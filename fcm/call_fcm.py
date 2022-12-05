import firebase_admin
from firebase_admin import credentials
from firebase_admin import messaging

cred_path = "capstone-f5130-firebase-adminsdk-pz2fr-2e458339aa.json"
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

registration_token = 'dbG-D7v8TziMTbLRbRZuUN:APA91bEXKPuMBm4nXYIH0u73O6-48s_D29ElCG7JVOhH_DT9ZHj_sM7wwwb-2VizOitfoVUGY87YvTAnixNVTZHTpZdQsLPNlePODuNB14FNg3qFtthJ6B-1Hoc9CfyBaQyWJwu3s2fW'
message = messaging.Message(
    notification = messaging.Notification(
        title='주차앱',
        body='호출을 완료하였습니다.'
    ),
    token=registration_token,
)

response = messaging.send(message)
print('Successfully sent message:', response)