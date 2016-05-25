
<template>

  <div class="jumbotron jumbotron-fluid">
    <div class="container">
      <h1 class="display-3">Video manager</h1>
      <p class="lead">A site that you can manage you favor videos and share them</p>
      <a class="btn btn-primary" v-link="{ name: 'login' }" role="button">Register</a>
    </div>
  </div>

  <div class="container">
    <panel></panel>
  </div>


</template>

<script>
  import client from '../client.js'
  import Panel from './Videopanel.vue'

	export default {
    created: function(){
    },
		data() {
			return {
        videos: [],
      } 
		},
    methods: {
      
    },
    components: {
      Panel,
    }
	}
</script>

<style type="text/css">
.video-item {
  margin: 5px;
  width: 200px;
  height: 180px;

  transition: 0.3s ease-in;
}
.video-item:hover {
  color: #0B5F96;
  cursor:pointer;
}

.video-item-play {
  width: 100%;
  height: 150px;
/*  background-color: #aaaaaa;*/
  opacity: 0;

  transition: 0.3s ease-in;
} 
.video-item-play:hover {
  opacity: 0.5;
}

.video-background{
  width: 100%;
  height: 150px;
  background-repeat:no-repeat;
  background-size: 100% 100%;
  /*background-attachment:fixed;*/
  /*background-image:url("/images/play.png");*/
  background-position:center center;

  transition: 0.3s ease-in;
} 

.video-background:hover{
  background-size: 120% 120%;
} 

</style>