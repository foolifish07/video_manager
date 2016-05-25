let socket = io();
let event_name = 'char';
let send = function(data){
	if ( data && data!='' ){
		socket.emit(event_name, $('#m').val());
	}
}
let receive = function(fn){
	socket.on(event_name, fn);
}
let connected = function(setdata){
	socket.on('connnedted', function(data){
		setdata(data);
	})
}
export default {
	receive: receive,
	send: send,
}