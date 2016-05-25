
<template>

<div class="container">
<div class="row">

  <!-- Left -->
  <div class="col-sm-3">
    <div class="list-group" >
      <a v-link="{name: 'home'}" class="list-group-item list-group-item-info">Home</a>
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
  import client from '../client.js'

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

        client.user.logout(function(data){
          router.go({ name: 'index', query: { change_state: true }});
        })
      },
      logged: function(){
        let router = this.$router;
        client.user.logged(null, function(data){
          router.go({ name: 'login' });
        })
      }
    },
	}
</script>