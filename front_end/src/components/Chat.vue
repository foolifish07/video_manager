
<template>

	<div class="chat" v-bind:style="{ right: shown ? '0px':'-300px' }">
		<div class="chat-toggle " v-on:click="shown=true"
			v-show="!shown"> < </div>
		<header class="chat-header">
			<button type="button" class="close" v-on:click="shown=false">
          		<span aria-hidden="true">&times;</span>
	        </button>
			<h4>Chat Room</h4>
		</header>
		<section class="chat-main">
			<template v-for="item in messages" track-by="$index">
				<div class="clearfix">
					<label v-bind:class="[ item.email==email ? 
						'arrow_box-right' : 'arrow_box-left' ]" >
						<strong>{{ item.name }}:</strong>
						<div>{{ item.content }}</div>
					</label>
				</div>
			</template>			
		</section>
		<footer class="chat-input">
			<div class="input-group">
		      <input type="text" class="form-control" 
		      	v-model="content" placeholder="I want to say...">
		      <span class="input-group-btn">
		        <button class="btn btn-secondary" type="button"
		        	v-on:click="send_message">Send</button>
		      </span>
			</div>
    	</footer>

	</div>

</template>

<script>
	let socket = io();
	let event_name = 'chat';

	export default {
		created: function(){
			
			let rt = this;
			let messages = this.messages;	
			socket.on(event_name, function(data){
				messages.push(data);
			})
			socket.on('connect', function(data){
				console.log('connect');
			})
			socket.on('chat-init', function(messages){
				rt.messages.splice(0, rt.messages.length);
				for(let i in messages)
					rt.messages.push( messages[i] );
			})
			socket.on('email', function(email){
				console.log( 'email: ' + email );
				rt.email = email;
			})
		},
		props: {
			shown: {
				type: Boolean,
				default: true,
			}
		},
		data() {
			return {
				email: '', 
				messages: [], // { email, name, content } 
				content: '',
			}
		},
		methods: {
			send_message: function(){	
				let content = this.content;
				if ( this.email ){
					socket.emit(event_name, content);
					this.content = '';
				}
				else {
					console.log('not login');
					this.$router.go({ name: 'login' });
				}
			}			

		},
	}
</script>

<style type="text/css">
.chat {
	position: fixed;
	top: 80px;
	bottom: 0;
	right: 0px;
	max-width: 300px;
	border-radius: 10px;

	padding: 5px;
	background-color: #E4E4E4;
	transition: 0.5s;
}
.chat-toggle {
	position: absolute;
	left: -20px;
	top: 50%;
	height: 50px; 
	width: 20px;

	color: #999999;
	font-size: 30px;
	font-weight: bold;
	transition: 0.2s;
}
.chat-toggle:hover {
	cursor: pointer;
	color: #0275d8;
}
.chat-header {
	position: relative;
	width: 100%;
	height: 8%;
	padding: 5px;
	border-bottom: solid 2px #999999;
}
.chat-main {
	position: static;
	width: 100%;
	height: 82%;
	padding: 5px;
	overflow: auto;
}
.chat-input {
	position: static;
	width: 100%;
	height: 10%;
}


.arrow_box-left {
	position: relative;
	left: 10px;
	border: 0px solid #c2e1f5;
	background: #88b7d5;
	border-radius: 5px;

	word-break: break-all; 
	max-width: 80%;
	padding: 5px;
	font-size: 13px;
}
.arrow_box-left:after{
	display: block;
	right: 100%;
	top: 20px;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
	pointer-events: none;
	
	border-color: rgba(136, 183, 213, 0);
	border-right-color: #88b7d5;
	border-width: 10px;
	margin-top: -10px;
}

.arrow_box-right {
	position: relative;
	right: 15px;
	border: 0px solid #c2e1f5;
	background: #88b7d5;
	border-radius: 5px;

	float: right;
	word-break: break-all; 
	max-width: 80%;
	padding: 5px;
	font-size: 13px;
}
.arrow_box-right:after{
	left: 100%;
	top: 50%;
	border: solid transparent;
	content: "";
	height: 0;
	width: 0;
	position: absolute;
	pointer-events: none;
	
	border-color: rgba(136, 183, 213, 0);
	border-left-color: #88b7d5;
	border-width: 10px;
	margin-top: -10px;
}


</style>