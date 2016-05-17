
<template>

<div class="container">
<div class="row">

  <!-- Left -->
  <div class="col-sm-3">
    <div class="list-group" >
      <a href="#" class="list-group-item list-group-item-info">Home</a>
      <a v-link="{name: 'info'}" class="list-group-item list-group-item-info">Info</a>
      <a v-link="{name: 'videos'}" class="list-group-item list-group-item-warning">Videos</a>
      <a v-link="{name: 'tags'}" class="list-group-item list-group-item-warning">Tags</a>
      <a v-link="{name: 'upload'}" class="list-group-item list-group-item-warning">Upload</a>
      <a class="list-group-item btn btn-link list-group-item-danger"
        v-on:click="logout" >Logout</a>
    </div>
  </div>

  <!-- Right -->
  <div class="col-sm-9">
    <router-view></router-view>
  </div>
    
</div>
</div>

</template>

<script>

	export default {
    created: function(){
      this.logged();
    },
		data() {
			return {
      } 
		},
    methods: {
      logout: function(){
        let router = this.$router;

        $.ajax({
          type: "post",
          url: '/api/user/logout',
          cache: false,
          async: true, 
          data: {},
          dataType: 'json',
          success: function(data){
            console.log(data);

            if ( data.status=='success' ){
              // go to ...
              router.go({ name: 'index' })
            }
          }
        });

      },
      logged: function(){
        let router = this.$router;
        $.ajax({
          type: "get",
          url: '/api/user/logged',
          cache: false,
          async: true, 
          data: {},
          dataType: 'json',
          success: function(data){
            console.log(data);

            if ( data.status=='not_logged' ){
              // go to ...
              router.go({ name: 'login' })
            }
          }
        });
      }
    },
	}
</script>