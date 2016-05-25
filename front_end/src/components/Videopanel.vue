
<template>

  <div class="container-fluid">
    <h1>Public:</h1>

    <div class="row">
      
      <template v-for="item in videos | orderBy 'upload_time' | limitBy limitv" track-by="$index">
        <label class="col-sm-3 video-item" 
          v-link="{ name: 'video', params: { hash: item.storage_name }}">
          <div class="video-background" v-bind:style="{ backgroundImage: 'url('+item.img_url+')' }">
            <div class="video-item-play" >
              <img src="/images/play.png" class="center-block" style="height:100%">        
            </div>
          </div>
          <h5 class="text-center">{{ item.name }}</h5>
        </label>
      </template>  

    </div>

    <button class="btn btn-primary btn-lg btn-block" 
      v-on:click="change_state" >{{ limitv!=10?'Pack up':'More' }}</button>

  </div>

</template>

<script>
  import client from '../client.js'

	export default {
    created: function(){
      this.get_public_videos();
    },
		data() {
			return {
        videos: [],

        limitv: 10 ,
      } 
		},
    methods: {
      get_public_videos: function(){
        let videos = this.videos;

        client.videos.public(function(data){

          videos.splice(0, videos.length);
          for(let i in data){
            videos.push(data[i]);
          }
        })
      },
      change_state: function(){
        if ( this.limitv==10 )
          this.limitv = 100;
        else 
          this.limitv = 10;
      }
    },
	}
</script>

<style type="text/css">
/*
@media screen and (min-width:600px) {
  .video-item {
    width: 24%;
    height: 20%;
    transition: 0.3s ease-in;
  }
}
@media screen and (max-width:600px) {
  .video-item {
    width: 33%;
    width: ;
    transition: 0.3s ease-in;
  }
}
*/
.video-item {
    height: 180px;
    padding: 2px;

    transition: 0.3s ease-in;
  }
.video-item:hover {
  color: #0B5F96;
  cursor:pointer;
}

.video-background{
  width: 100%;
  height: 85%;

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

.video-item-play {
  width: 100%;
/*  background-color: #aaaaaa;*/
  opacity: 0;

  transition: 0.3s ease-in;
} 
.video-item-play:hover {
  opacity: 0.5;
}


</style>