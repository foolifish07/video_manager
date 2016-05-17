
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
          <th>Watch</th>
          <th>Download</th>
          <th>Date</th>
          <th>Status</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="item in videos 
          | orderBy my_order | filterBy my_filter' " 
          track-by="$index">
          <tr>
            <th scope="row"><button class="btn btn-link btn-sm"
              v-link="{ name: 'video', params: { hash: item.storage_name }}">
              {{ item.name }} </button> </th>
            <td>{{ item.watched_times }}</td>
            <td>{{ item.download_times }}</td>
            <td>{{ item.upload_time }}</td>
            <td><button class="btn btn-info-outline btn-sm"
              v-on:click="change_state(item)">
              {{ item.is_public?'Public':'Private' }}</button> </td>
            <td><button class="btn btn-danger-outline btn-sm"
              v-on:click="delete_video(item)">Delete</button> </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>

</template>

<script>


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

        videos: [
        ]
			}
		},
    methods: {
      my_order: function(a, b){
        let res = 0;
        let current = this.classify.list[1].current;
        if ( current==0 ) res = a.name < b.name;
        if ( current==1 ) res = a.upload_time < b.upload_time;
        if ( current==2 ) res = a.is_public < b.is_public;
        if ( current==3 ) res = a.watched_times < b.watched_times;
        if ( current==4 ) res = a.download_times < b.name.download_times;
        if ( this.classify.list[2].current==0 ) 
          res = !res;
        return res;
      },
      my_filter: function(){
        let current = this.classify.list[0].current;
        if ( current==0 ) return true;

        let v = this.classify.list[0].list[current];
        return this.videos.some(function(elem, index, arr){
          return elem.vidaotag && elem.vidaotag.tag && elem.videotag.tag.name == v;
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
        
        $.ajax({
          type: "get",
          url: '/api/tags',
          cache: false,
          async: true, 
          data: {},
          dataType: 'json',
          success: function(data){
            console.log(data);

            if ( data.status=='success' ){
              data = data.data;
              tags.names.splice(0, tags.names.length);
              tags.ids.splice(0, tags.ids.length);
              tags.names.push('All');
              tags.ids.push(0);
              for(let i in data){
                tags.names.push( data[i].name );
                tags.ids.push( data[i]._id );
              }
            }
            else {
              router.go({ name: 'login' });
            }

          }
        });
      },
      get_videos: function(){

        let data = {};
        let ids = this.classify.list[0].id;
        let current = this.classify.list[0].current;
        let videos = this.videos;
        if ( current!=0 ){
          data.tagid = ids[ current ];
        }
        $.ajax({
          type: "get",
          url: '/api/videos/mine',
          cache: false,
          async: true, 
          data: data,
          dataType: 'json',
          success: function(data){
            console.log(data);

            data = data.data;
            videos.splice(0, videos.length);
            for(let i in data){
              videos.push(data[i]);
            }
          }
        });
      },
      delete_video: function(item){
        let rt = this;
        $.ajax({
          type: "delete",
          url: '/api/video' + '/' + item.storage_name,
          cache: false,
          async: true, 
          data: {},
          dataType: 'json',
          success: function(data){
            console.log(data);

            rt.get_videos();
          }
        });
      },
      change_state: function(item){

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