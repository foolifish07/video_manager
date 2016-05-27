
<template>

<div class="container"  style="margin-top: 15px">
<div class="col-md-offset-1 col-md-10">

  <video width="100%" controls="controls"class="center-block"
    v-bind:src="video.video_url" >
  </video>
  <!--embed src="http://yuntv.letv.com/bcloud.swf" allowFullScreen="true" quality="high"  width="640" height="360" align="middle" allowScriptAccess="always" flashvars="uu=vhrrkr9rtg&vu=1310d79733&auto_play=1&gpcflag=1&width=640&height=360" type="application/x-shockwave-flash"></embed-->
  <div class="video-info">
    <div>
      <label class="lead">{{ video.name }} </label> 
      <small> upload on {{ new Date(Date.parse(video.upload_time )) }}</small>
      By
      <Strong>  {{ video.creator.name }}</strong>
      <a class="btn btn-primary btn-sm pull-right" 
        v-bind:href=" '/api/video/download/' + video.storage_name"> download </a>
    </div>
    <label>watched: {{ video.watched_times }} times,
          download: {{  video.download_times }} times
     </label>

  </div>

  <div style="margin-top: 15px" v-show="can_manage">
    <h3> Manage panel </h3>
    <table class="table" style="margin-top: 15px">
      <tbody>
        <tr>
          <th>Name</th>
          <th>{{ video.name }}</th>
          <th>
            <input type="text" placeholder="new name" v-model="new_name">
            <button class="btn btn-primary btn-sm" 
              v-on:click="change_name">change</button>
          </th>
        </tr>
        <tr>
          <th>Creator: </th>
          <th>{{ video.creator.name }}({{ video.creator.email }})</th>
        </tr>
        <tr>
          <th> Stats: </th>
          <th>{{ video.is_public?'Public':'private' }}</th>
          <th><button class="btn btn-primary btn-sm" 
            v-on:click="change_state">change</button></th>
        </tr>
        <tr>
          <th>image url</th>
          <th style="max-width: 200px; word-wrap: break-word;">
            {{ video.img_url?video.img_url:'No' }} </th>
        </tr>
        <tr>
          <th>Watched: </th>
          <th>{{ video.watched_times }}</th>
        </tr>
        <tr>
          <th>Download: </th>
          <th>{{ video.download_times }}</th>
        </tr>
        <tr>
          <th>Tags:</th>
          <th>
            <template v-for="videotag in video.tags" track-by="$index">
              <a class="label label-pill label-danger btn" style="margin-right: 5px"
                v-on:click="delete_videotag(videotag)" title="delete this tag"> 
                {{ videotag.name }} </a>
            </template>
          </th>
          <th>
            <template v-for="tag in tags" track-by="$index">
              <a class="label label-pill label-primary btn" style="margin-right: 5px"
                v-on:click="add_videotag(tag)" title="add this tag"> 
                {{ tag.name }} </a>
            </template> 
          </th>
        </tr>
      </tbody>
    </table>
  </div>

</div>
</div>

</template>

<script> 
  import client from '../client.js'

	export default {
    created: function(){
      this.get_video();
      this.get_tags();
    },
		data() {
			return {
        can_manage: false,
        video_url: 'http://localhost:3000/files/mov_bbb.mp4',

        video: {
          name: '',
          is_public: false,
          download_times: 0,
          watched_times: 0,
          img_url: '',
          video_url: '',
          creator: { name: ''},
          tags: [],
        },
        tags :[],

        new_name: '',
      } 
		},
    methods: {
      get_video: function(){
        let route = this.$route;
        let router = this.$router;
        let rt = this;

        client.video.get_video(
          route.params.hash,
          function(data){
            rt.video = data;
            rt.video_url = data.video_url;
          },
          function(data){
            rt.video = data;
            rt.video_url = data.video_url;
            rt.can_manage = true;
          },
          function(data){
            router.go({ name: 'index' })
          },
          function(data){
            router.go({ name: 'index' })
          });

      },
      get_tags: function(){
        let rt = this;
        let router = this.$router;
        let tags = this.tags;

        client.tags.get_mytags(
          function(data){
            tags.splice(0, tags.length);
            for(let i in data)
              tags.push( data[i] );

          },
          function(data){
            tags.splice(0, tags.length);
            // router.go({ name: 'index' });
          })
      },

      delete_videotag: function(index){
        let rt = this;
        let video = this.video;
        let tags = video.tags;
        tags.splice(index, 1);
        client.video.patch_video(
          video.storage_name,
          function(data){
          }, null, null,
          {tags: JSON.stringify(tags) });
  
      },


      add_videotag: function(tag){
        
        var video = this.video;
        var tags = video.tags
        var has_tag = tags.some(function(ele, index, arr){
          return ele._id == tag._id;
        })
        if ( !has_tag ){
          tags.push( tag ); 
          client.video.patch_video(
            video.storage_name,
            function(data){

            }, null, null, 
            {tags: JSON.stringify(tags) })
        }
      },
      change_name: function(){
        let video = this.video;
        let new_name = this.new_name;

        if ( video && new_name ){
          client.video.patch_video(
            video.storage_name,
            function(data){
              video.name = new_name;
            }, null, null, 
            { newname: new_name } );

        }
      },
      change_state: function(){
        let video = this.video;
        let rt = this;

        if ( video && video.storage_name ){
          client.video.patch_video(
            video.storage_name,
            function(data){
              video.is_public = !video.is_public;
            }, null, null, 
            { is_public: !video.is_public } );
          
        }
      },

    },
  }
</script>

<style type="text/css">
  .video-info{
    margin-top: 15px;
    
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: #D0C2C2;
  }
</style>