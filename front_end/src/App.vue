
<template>

	<div class="container-fluid" style="background-color: #e3f2fd;">
	<div class="container" style="background-color: #e3f2fd;">
		
	<nav class="navbar navbar-light" >
	  <a class="navbar-brand" v-link="{ name: 'index' }" >Video manager</a>
	  <ul class="nav navbar-nav pull-right">
	    <li class="nav-item active">
	      <a class="nav-link" v-link="{ name: 'index' }">Home</a>
	    </li>
	    <li class="nav-item">
	      <a class="nav-link" v-link="{ path: '/nothing' }" v-on:click="chatshow=!chatshow">Chat</a>
	    </li>
	    <li class="nav-item" v-if="!logged">
	      <a class="nav-link" v-link="{ name: 'login' }">Login</a>
	    </li>
	    <li class="nav-item" v-if="logged">
	      <a class="nav-link" v-link="{ name: 'manager' }">{{ name }}</a>
	    </li>
	  </ul>
	</nav>

	</div>
	</div>

	<div>
		<router-view></router-view>
	</div>

	<div>
		<Chat v-bind:shown="chatshow"></Chat>
	</div>

</template>

<script>
	import client from './client.js' 
	import Chat from './components/Chat.vue'

	export default {
		created: function(){
			this.get_logged();
		},
		data() {
			return {
				logged: false,
				name: '',

				chatshow: false,
			}
		},
		methods: {
			get_logged: function(){
				let rt = this;
				client.user.get_myinfo(
					function(data){
						rt.logged = true;
						rt.name = data.name;						
					},
					function(data){
						rt.logged = false;
					})
			},

		},
		components: {
			Chat,
		},
		route: {
			canActivate: function (transition) {
			    //console.log('canActivate');
			    // return new Promise( function(resolve, reject){ resolve(true); } );
				return true;
			},
			data: function(transition){
				let to = transition.to;
				if ( to.query.change_state ){
					console.log('change state');
					this.get_logged();	
				}
				transition.next();
			},	
			canReuse: function (transition) {
			    console.log('canReuse');
			    return true;
			},
		}
	}
</script>
