
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
      <label class="form-control-label">{{ register_time }}</label>
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

        $.ajax({
          type: "get",
          url: '/api/user/myinfo',
          cache: false,
          async: true, 
          data: {},
          dataType: 'json',
          success: function(data){
            console.log(data);

            if ( data.status=='success' ){
              data = data.data;
              rt.email = data.email;
              rt.name = data.name;
              rt.group = data.group;
              rt.register_time = data.register_time;
            }
            else if ( data.status=='login_required' ){
              router.go({ name: 'login'});
            }
          }
        });
    	},
    	post_info: function(){
        var rt = this;

        var post_data = {};
        if ( this.name!='' )
          post_data.name = this.name;
        if ( this.newpassword!='')
          post_data.newpassword = this.newpassword;
        if ( this.oldpassword!='' )
          post_data.oldpassword = this.oldpassword;

        rt.password_wrong = false;

        if ( this.oldpassword ){
          $.ajax({
            type: "patch",
            url: '/api/user/myinfo',
            cache: false,
            async: true, 
            data: post_data,
            dataType: 'json',
            success: function(data){
              console.log(data);

              if ( data.status=='success' ){
                rt.get_info();
              }
              else {
                rt.password_wrong = true;
              }
            }
          })
        }
    	},
    },
	}
</script>

<style type="text/css">

</style>