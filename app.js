var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const { time } = require('console');
var path = require('path');

// 소켓 통신을 위해 포트를 지정
var PORT = 9999;
http.listen(PORT, () => {
	console.log('listening port: 9999');
	// var spawn = require('child_process').spawn;
	// spawn('python', ['./client.py']);
});

app.get('/', function(req, res){
    res.render('index');
});

target_token = ""
const admin = require('firebase-admin')

let serAccount = require('capstone-f5130-firebase-adminsdk-pz2fr-b2582cb73c.json')

admin.initializeApp({
  credential: admin.credential.cert(serAccount),
})

// .on = 메시지를 받았을 때 동작 수행.
// .emit = 메시지를 전송하는 동작 수행.

console.log("Waiting for user connection...");

// 클라이언트에서 connect에 성공 시 호출
io.on('connection', (socket) => {
	console.log('client connected');
	
    // 앱에서 주행시작 버튼을 눌렸을 때
	socket.on('drive', (obj) => {
        
		// 'drive'
		drive = obj
		console.log(drive);

		// 주행시작 신호를 파이썬으로 보내주기
		io.emit('drive', drive);
		
	});

	// 앱에서 호출 버튼을 눌렸을 때
	socket.on('call', (obj) => {
        
		// 'call'
		call = obj
		console.log(call);

		// 호출 신호를 파이썬으로 보내주기
		io.emit('call', call);
		
	});


	// 클라이언트에서 token을 받을 때
	socket.on('token', (obj) => {
		target_token = obj
		console.log('token:', target_token);
	});

	// 파이썬에서 주차완료 신호를 받을 때
	socket.on('parking', (obj) => {
		console.log(obj["data"]);

		// 파이썬에서 받은 주차완료 신호를 앱으로 넘겨주고 푸시알람 보내기
		io.emit('parking',obj["data"])
		var spawn = require('child_process').spawn;
		spawn('python3', ['./parking_fcm.py']);
		console.log('push parking');
		let target_token =
			'dbG-D7v8TziMTbLRbRZuUN:APA91bEXKPuMBm4nXYIH0u73O6-48s_D29ElCG7JVOhH_DT9ZHj_sM7wwwb-2VizOitfoVUGY87YvTAnixNVTZHTpZdQsLPNlePODuNB14FNg3qFtthJ6B-1Hoc9CfyBaQyWJwu3s2fW'
		//target_token은 푸시 메시지를 받을 디바이스의 토큰값입니다

		let message = {
			data: {
				title: '테스트 데이터 발송',
				body: '데이터가 잘 가나요?',
				style: '굳굳',
			},
			token: target_token,
		}

		admin
			.messaging()
			.send(message)
	});

	// 파이썬에서 호출 신호를 받을 때
	socket.on('callback', (obj) => {
		console.log(obj["data"]);

		// 파이썬에서 받은 주차완료 신호를 앱으로 넘겨주고 푸시알람 보내기
		io.emit('callback',obj["data"])
		var spawn = require('child_process').spawn;
		spawn('python3', ['./call_fcm.py']);
		console.log('push callback');
	});

	

	// 클라이언트의 연결이 끊어졌을 때 호출
	socket.on('disconnect', () => {    	
		console.log('server disconnected');
	});
});

// 파이썬 파일을 직접 실행할 시
		// var spawn = require('child_process').spawn;
		// const result = spawn('python', ['./server.py', drive]);
		// result.stdout.on('data', function(data) {
		// 	console.log(data.toString());
		// 	if(data.toString() == "paring")
		// 		spawn('python', ['./fcm.py']);	
		// });
// 'data'이벤트리스너로 실행결과를 받는다.
// result.stdout.on('data', function(data) {
// 	console.log(data.toString());
// });
// // 에러시 'data'이벤트리스너로 실행결과를 받는다.
// result.stderr.on('data', function(data) {
// 	console.log(data.toString());
// });
