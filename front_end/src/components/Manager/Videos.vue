
<template>

  <!-- classify -->
  <div class="cms-classify">

    <div class="row" style="margin-bottom: 5px">

      <template v-for="line in classify.list" track-by="$index">
        <div class="col-sm-3"> <strong> {{ line.name }} </strong> </div>
        <div class="col-sm-9">
          <template v-for="item in line.list" track-by="$index">
            <a class="label label-pill 
              {{ line.current==$index?classify.active:classify.notactive }}"
              style="margin-right: 5px"
              v-on:click="change_classify(line, $index)"> {{ item }} </a>
          </template>
        </div>
      </template>
    </div>

  </div>

  <!-- tables -->
  <div style="margin-top: 10px">
    <table class="table table-hover">
      <thead class="thead-default">
        <tr>
          <th>Name</th>
          <th>Tags</th>
          <th>Watch</th>
          <th>Download</th>

          <th>Status</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="video in videos 
          | filterBy myfilter
          | orderBy my_order 1" 
          track-by="$index">
          <tr>
            <th scope="row"><button class="btn btn-link btn-sm"
              v-link="{ name: 'video', params: { hash: video.storage_name }}">
              {{ video.name }} </button> </th>
            <th>
              <template v-for="tag in video.tags" track-by="$index">
                <span class="label label-pill label-default"
                  style="margin-right: 5px"> {{ tag.name }} </span>
              </template>
            </th>
            <td>{{ video.watched_times }}</td>
            <td>{{ video.download_times }}</td>

            <td><button class="btn btn-info-outline btn-sm"
              v-on:click="change_state(video)">
              {{ video.is_public?'Public':'Private' }}</button> </td>
            <td><button class="btn btn-danger-outline btn-sm"
              v-on:click="delete_video(video)">Delete</button> </td>
          </tr>
          <tr> <th colspan=6>{{ 'Upload Date: '+ new Date(Date.parse(video.upload_time)) }} </th></tr>

        </template>
      </tbody>
    </table>
  </div>

</template>

<script>
  import client from '../../client.js' 

	export default {
    created: function(){
      this.get_tags();
      this.get_videos();
    },

		data() {
			return {
        classify :{
          list : [
            {
              name: 'Tags',
              current: 0,
              list: ['All'],
              ids: [-1 ], 
            },
            { 
              name: 'SortBy',
              current: 0,
              list: ['name', 'Upload Date', 'public', 'watched times', 'download times'],
            },
            {
              name: 'orderBy',
              current: 0,
              list: ['Descending', 'Ascending'],
            }
          ],
          active: 'label-success',
          notactive: 'label-default',
        },

        videos: [],
			}
		},
    methods: {
      my_order: function(a, b){
        let res = 0;
        let current = this.classify.list[1].current;
        if ( current==0 ) res = a.name < b.name ? -1 : 1;
        if ( current==1 ) res = a.upload_time < b.upload_time ? -1 : 1;
        if ( current==2 ) res = a.is_public < b.is_public ? -1 : 1;
        if ( current==3 ) res = a.watched_times < b.watched_times ? -1 : 1;
        if ( current==4 ) res = a.download_times < b.download_times ? -1 : 1;
        if ( this.classify.list[2].current==0 ) res = -res;
        return res;
      },
      myfilter: function(video){
        let videotags = video.tags;
        let ids = this.classify.list[0].ids;
        let current = this.classify.list[0].current;
        if ( current==0 ) return true;

        let v = this.classify.list[0].list[current];
        return videotags.some(function(elem, index, arr){
                return elem._id == ids[current];
              })
      },

      change_classify: function(line, index){
        line.current = index;
      },


      // client 
      get_tags: function(){
        let router = this.$router;

        let tags = {
          names: this.classify.list[0].list,
          ids : this.classify.list[0].ids,
        }

        client.tags.get_mytags(
          function(data){

            tags.names.splice(0, tags.names.length);
            tags.ids.splice(0, tags.ids.length);
            tags.names.push('All');
            tags.ids.push(0);

            for(let i in data){
              tags.names.push( data[i].name );
              tags.ids.push( data[i]._id );
            }
          },
          function(data){
            router.go({ name: 'index' })
          });
  
      },
      get_videos: function(){

        let router = this.$router;
        let videos = this.videos;

        client.videos.mine(
          function(data){
            videos.splice(0, videos.length);
            for(let i in data){
              videos.push(data[i]);
            }
          },
          function(data){
            router.go({ name: 'index' });
          });

      },


      delete_video: function(video){
        let videos = this.videos;
        let index = videos.indexOf(video);

        client.video.delete_video(
          video.storage_name,
          function(data){
            videos.splice(index, 1);
          }, null, null );

      },
      change_state: function(video){
        let videos = this.videos;
        let index = videos.indexOf(video);

        client.video.patch_video(
          video.storage_name,
          function(data){
            video.is_public = !video.is_public;
          }, null, null,
          { is_public: !video.is_public });

      },
    }
	}
</script>

<style type="text/css">
  .cms-classify{
    margin-top: 15px;
    
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: lightgrey;
  }

  .cms-item {
    padding: 5px;
    border-radius: 5px
  }
  .cms-item-img {
    width: 100%;
  }
  .cms-item-selected {
    font-weight: bold;
    background-color: #A6D8A6;

  }

  .mine-tags {
    margin-right: 2px;
  }
</style>