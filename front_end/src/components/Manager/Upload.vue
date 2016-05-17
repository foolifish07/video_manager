
<template>

  <h4 style="margin-top: 40px">Submit a file</h4>
  <form action="{{ upload_url }}" method="POST" enctype="multipart/form-data">
    <fieldset class="form-group">
      <label for="exampleInputFile">File input</label>
      <input type="file" class="form-control-file" name="file">
      <small class="text-muted">You can select a video to submit</small>
    </fieldset>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>

  <h4 style="margin-top: 40px">Submit a directory</h4>
  <form action="{{ upload_url }}" method="POST" enctype="multipart/form-data">
    <fieldset class="form-group">
      <label>Files input</label>
      <input type="file" class="form-control-file" webkitdirectory name="file">
      <small class="text-muted">You can put the videos in a directory and the submit them all here</small>
    </fieldset>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>

</template>

<script>


	export default {
		data() {
			return {
        upload_url:'/api/video/upload',
      }
		},
    methods: {
      submit_video: {

      },
      post_videos: {

      }
    }
	}
</script>

<style type="text/css">

</style>