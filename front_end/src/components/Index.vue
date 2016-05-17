
<template>

  <div class="jumbotron jumbotron-fluid">
    <div class="container">
      <h1 class="display-3">Video manager</h1>
      <p class="lead">A site that you can manage you favor videos and share them</p>
      <a class="btn btn-primary" v-link="{ name: 'login' }" role="button">Register</a>
    </div>
  </div>


  <div class="container">
    
    <h3> More videos </h3>  

    <!-- tables -->
    <div style="margin-top: 10px">
      <table class="table table-hover">
        <thead class="thead-default">
          <tr>
            <th>Name</th>
            <th>Watched</th>
            <th>Download</th>
            <th>upload Date</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in videos" track-by="$index">
            <tr>
              <th scope="row"><button class="btn btn-link btn-sm">{{ item.name }} </button> </th>
              <td>{{ item.watched_times }}</td>
              <td>{{ item.download_times }}</td>
              <td>{{ item.upload_time }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>

</template>

<script>

	export default {
    created: function(){
      this.get_public_videos();
    },
		data() {
			return {
        videos: [],
      } 
		},
    methods: {
      get_public_videos: function(){
        let videos = this.videos;
        $.ajax({
          type: "get",
          url: '/api/videos/public',
          cache: false,
          async: true, 
          data: {},
          dataType: 'json',
          success: function(data){
            console.log(data);

            if ( data.status=='success' ){
              videos.splice(0, videos.length);
              for(let i in data.vjdesk ){
                videos.push(data.videos[i]);
              }
            }
          }
        });
      }
    },
	}
</script>

<style type="text/css">

</style>