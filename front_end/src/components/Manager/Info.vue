
<template>

  <form class="col-sm-9" style="margin-top:10px">
    <div class="form-group row">
      <label class="col-sm-2 form-control-label">Email</label>
      <div class="col-sm-10">
      	<p class="form-control-static">{{ email }}</p>
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 form-control-label">Name</label>
      <div class="col-sm-10">
        <input type="text" class="form-control" placeholder="Name" v-model="name">
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 form-control-label">group</label>
      <div class="col-sm-10">
        <p class="form-control-static">{{ group }}</p>
      </div>
    </div>
    <div class="form-group row">
      <label class="form-control-label">register time:</label>
      <label class="form-control-label">{{ new Date(Date.parse(register_time)) }}</label>
    </div>

    <div class="form-group row">
      <label class="col-sm-4 form-control-label">New passwd</label>
      <div class="col-sm-8">
        <input type="password" class="form-control" placeholder="new password" v-model="newpassword">
      </div>
    </div>

    <div class="form-group row">
      <div class="col-sm-offset-2 col-sm-10">
        <button class="btn btn-primary" v-on:click="post_info">Save changing</button>
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-4 form-control-label">password</label>
      <div class="col-sm-8">
        <input type="password" class="form-control" 
        	placeholder="need password" required v-model="oldpassword">
      </div>
    </div>
    <div class="alert alert-danger" role="alert" v-show="password_wrong">
      <strong>Password wrong</strong>
    </div>
    
  </form>

</template>

<script>
  import client from '../../client.js'

  export default {
    
    created: function(){
      this.get_info();
    },
    data() {
			return {
				email: '',
				name: '',
				group: '',
				register_time: '',

        newpassword: '',
				oldpassword: '',
        password_wrong: false,
      } 
		},
    methods: {
    	get_info: function(){
        var router = this.$router;
        var rt = this;

        client.user.get_myinfo(
          function(data){
            rt.email = data.email;
            rt.name = data.name;
            rt.group = data.group
            rt.register_time = data.register_time;
          },
          function(data){
            router.go({ name: 'login' });
          })
    	},
    	post_info: function(){
        var router = this.$router;
        var rt = this;

        var post_data = {};
        if ( this.name!='' )
          post_data.name = this.name;
        if ( this.newpassword && this.newpassword!='')
          post_data.newpassword = this.newpassword;
        if ( this.oldpassword && this.oldpassword!='' )
          post_data.oldpassword = this.oldpassword;

        rt.password_wrong = false;

        if ( this.oldpassword ){
          client.user.patch_myinfo(
            function(data){
              rt.email = data.email;
              rt.name = data.name;
              rt.group = data.group
              rt.register_time = data.register_time;
            },
            function(data){
              router.go({ name: 'login' })
            },
            function(data){
              rt.password_wrong = true;
            },
            post_data );

        }
    	},
    },
	}
</script>

<style type="text/css">

</style>