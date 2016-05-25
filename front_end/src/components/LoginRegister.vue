
<template>

  <form class="form-signin-register">
    <fieldset class="form-group">
      <label>Email</label> 
      <span class="label label-danger" v-show="invalidEmail">Invaliid email</span>
      <input type="email" class="form-control" placeholder="Enter email" 
        required v-model="email">
    </fieldset>
    <fieldset class="form-group">
      <label>Password</label>
      <span class="label label-danger" v-show="passwordNotEmpty"> password should not be empty </span>
      <input type="password" class="form-control" placeholder="Password" 
        required v-model="password">
    </fieldset>
    <div class="checkbox">
      <label>
        <input type="checkbox" v-model="rememberme"> Remember me
      </label>
    </div>
    <button class="btn btn-primary" v-on:click="submit"> {{ status[currentStatus] }}</button>
    <a class="pull-right btn btn-link" v-on:click="change_status"> {{ tips[currentStatus] }}</a>
    
    <span class="label label-warning" v-show="noSuchUser">No such user</span>
    <span class="label label-warning" v-show="passwordWrong">Password wrong</span>
    <span class="label label-warning" v-show="emailRegistered">The account has been used</span>
  </form>

</template>

<script>
  import client from '../client.js' 

	export default {
		data() {
			return {
        currentStatus: 0, // 0 for login, 1 for register
				status: ['login', 'register'],
        tips: ['Have\'t register?', 'Login directly?'],

        email: '',
        password: '',
        rememberme: false,

        invalidEmail: false,
        passwordNotEmpty: false,

        noSuchUser: false,
        passwordWrong: false,
        emailRegistered: false,
			}
		},
    methods: {
      clear_tips: function(){
        this.invalidEmail = false;
        this.passwordNotEmpty = false;

        this.noSuchUser = false;
        this.passwordWrong = false;
        this.emailRegistered = false;
      },
      change_status: function(){
        this.clear_tips();
        this.currentStatus = 1 - this.currentStatus;
      },

      submit: function(){
        
        var rt = this;
        let router = this.$router;

        this.clear_tips();
        
        var post_data = {
          email: this.email,
          password: this.password,
        }

        // send 
        if ( this.currentStatus==0 ){
          // login 

          if ( post_data.email && post_data.password ){

            client.user.login(
              function(data){
                router.go({ name: 'info', query: {change_state: true} })
              },
              function(data){
                rt.noSuchUser = true;
              },
              function(data){
                rt.passwordWrong = true;
              }, 
              post_data );

          }

        }
        else {
          // register 

          if ( post_data.email && post_data.password ){
            client.user.register(
              function(data){
                router.go({ name: 'info', query: {change_state: true} })
              },
              function(data){
                rt.emailRegistered = true;
              }, 
              post_data );

          }

        }
      }
    }

	}
</script>

<style type="text/css">
  .form-signin-register{
    max-width: 330px;
    padding: 15px;
    margin: 0 auto;
  }
</style>