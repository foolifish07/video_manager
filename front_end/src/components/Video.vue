
<template>

<div class="container"  style="margin-top: 15px">

  <video width="100%" controls="controls"
    class="center-block">
    <source v-bind:src="video_url" type="video/mp4" />
  </video>
  <!--embed src="http://yuntv.letv.com/bcloud.swf" allowFullScreen="true" quality="high"  width="640" height="360" align="middle" allowScriptAccess="always" flashvars="uu=vhrrkr9rtg&vu=1310d79733&auto_play=1&gpcflag=1&width=640&height=360" type="application/x-shockwave-flash"></embed-->
  <div class="video-info">
    <div>
      <label class="lead">{{ video.name }} </label> 
      <small> upload on {{ video.upload_time }}</small>
      By
      <Strong>  {{ video.creator.name }}</strong>
      <button class="btn btn-primary btn-sm pull-right"> download </button>
    </div>
    <label>watched: {{ video.watched_times }} times,
          download: {{  video.download_times }} times
     </label>

  </div>

  <div style="margin-top: 15px" v-show="can_manage">
    
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
          <th>{{ video.creator.name }}</th>
        </tr>
        <tr>
          <th> Stats: </th>
          <th>{{ video.is_public?'Public':'private' }}</th>
          <th><button class="btn btn-primary btn-sm" 
            v-on:click="change_state">change</button></th>
        </tr>
        <tr>
          <th>image url</th>
          <th>{{ video.img_url?video.img_url:'No' }} </th>
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
          <th>Download: </th>
          <th>{{ video.download_times }}</th>
        </tr>
        <tr>
          <th>Tags:</th>
          <th>
            <template v-for="videotag in videotags" track-by="$index">
              <a class="label label-pill label-danger btn" style="margin-right: 5px"
                v-on:click="delete_videotag(videotag)" title="delete this tag"> 
                {{ videotag.tag.name }} </a>
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

</template>

<script>

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
          creator: { name: ''},
        },
        tags :[],
        videotags: [],

        new_name: '',
      } 
		},
    methods: {
      get_video: function(){
        let route = this.$route;
        let router = this.$router;
        let rt = this;

        $.ajax({
          type: "get",
          url: '/api/video/' + route.params.hash,
          cache: false,
          async: true, 
          data: {},
          dataType: 'json',
          success: function(data){
            console.log(data);

            if ( data.status=='can_manage' ){
              rt.can_manage = true;
              rt.video = data.data;
              rt.get_videotags();
            }
            else if ( data.status=='success' ){
              rt.can_manage = false;
              rt.video = data.data;
            }
            else {
              router.go({ name: 'index'});
            }
            
          }
        });

      },
      get_tags: function(){
        let router = this.$router;
        let tags = this.tags;

        $.ajax({
          type: "get",
          url: '/api/tags/',
          cache: false,
          async: true, 
          data: {},
          dataType: 'json',
          success: function(data){
            console.log(data);

            if ( data.status=='success' ){
              data = data.data;
              tags.splice(0, tags.length);
              for(let i in data){
                tags.push( data[i] );

              }
            }
          }
        });
      },
      get_videotags: function(){
        let videoid = this.video._id;
        let videotags = this.videotags;
          $.ajax({
            type: "get",
            url: '/api/videotag/',
            cache: false,
            async: true, 
            data: { videoid: videoid },
            dataType: 'json',
            success: function(data){
              console.log(data);

              if ( data.status=='success' ){
                data = data.data;
                videotags.splice(0, videotags.length);
                data.forEach(function(ele, index, arr){
                  videotags.push(ele);
                })
              }
            }
          });  
      },

      delete_videotag: function(videotag){
        let videotags = this.videotags;

        if ( videotag && videotag._id ){        
          $.ajax({
            type: "delete",
            url: '/api/videotag/',
            cache: false,
            async: true, 
            data: { id: videotag._id },
            dataType: 'json',
            success: function(data){
              console.log(data);

                for(let i in videotags){
                  if ( videotags[i]._id == videotag._id ){
                    videotags.splice(i, 1);
                    break;
                  }
                }
            }
          });        
        }
      },
      add_videotag: function(tag){
        if ( !this.video.videotag )
          this.video.videotag = [];
        var video = this.video;
        var videotags = this.videotags;

        $.ajax({
          type: "post",
          url: '/api/videotag/',
          cache: false,
          async: true, 
          data: { tagid: tag._id, videoid: video._id },
          dataType: 'json',
          success: function(data){
            console.log(data);

            if ( data.status=='success' ){
              data = data.data;
              data.tag = tag;
              videotags.push( data );
            }
          }
        });
      },

      change_name: function(){
        let item = this.video;
        let new_name = this.new_name

        if ( item && new_name ){
          $.ajax({
            type: "patch",
            url: '/api/video' + '/' + item.storage_name,
            cache: false,
            async: true, 
            data: { newname: new_name },
            dataType: 'json',
            success: function(data){
              console.log(data);
              item.name = new_name;
            }
          });
          
        }
      },
      change_state: function(){
        let item = this.video;

        if ( item && item.storage_name ){
          $.ajax({
            type: "patch",
            url: '/api/video' + '/' + item.storage_name,
            cache: false,
            async: true, 
            data: { is_public: !item.is_public },
            dataType: 'json', 
            success: function(data){
              console.log(data);
              item.is_public = !item.is_public
            }
          });
          
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