
<template>

  <h4 style="margin-top: 40px">Submit a file</h4>
  <form>
    <fieldset class="form-group">
      <label for="exampleInputFile">File input</label>
      <input id="{{ id1 }}" type="file" class="form-control-file" 
        accept="video/mp4" multiple>
      <small class="text-muted">You can select *.mp4 files to submit</small>
    </fieldset>
    <button class="btn btn-primary" v-on:click="submit_video(id1)">{{ submit1 }}</button>
  </form>

  <h4 style="margin-top: 40px">Submit a directory</h4>
  <form>
    <fieldset class="form-group">
      <label>Files input</label>
      <input id="{{ id2 }}" type="file" class="form-control-file" webkitdirectory>
      <small class="text-muted">You can put the *.mp4 in a directory and the submit them all here. We will only submit the *.mp4 file.</small>
    </fieldset>
    <button class="btn btn-primary" v-on:click="submit_video(id2)">{{ submit2 }}</button>
  </form>

  <!--h4 style="margin-top: 40px">Submit a directory</h4>
  <form action="{{ upload_url }}" method="POST" enctype="multipart/form-data">
    <fieldset class="form-group">
      <label>Files input</label>
      <input id="file2" type="file" class="form-control-file" webkitdirectory name="file"
        >
      <small class="text-muted">You can put the videos in a directory and the submit them all here</small>
    </fieldset>
    <button class="btn btn-primary">Submit</button>
  </form-->

</template>

<script>


	export default {
		data() {
			return {
        upload_url:'/api/video/upload',

        id1: 'file1',
        id2: 'file2',
        submit1: 'submit',
        submit2: 'submit',
      }
		},
    methods: {

      submit_video: function(fileid) {
        var rt = this;
        var fileSelect = document.getElementById(fileid);
        var url = this.upload_url;

        if ( fileid==this.id1 ) this.submit1 = 'Uploading...';
        else this.submit2 = 'Uploading...';

        var files = fileSelect.files;
        var formData = new FormData();
        for (var i = 0; i < files.length; i++) {
          var file = files[i];

          console.log(file.type);
          if (!file.type.match('video/mp4')) {
            continue;
          }

          formData.append('photos[]', file, file.name);
        }

        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.onload = function () {
          if (xhr.status === 200) {

            rt.submit1 = rt.submit2 = 'Submit';
          } else {
            alert('An error occurred!');
          }
        };
        xhr.send(formData);
        
      },
    }
	}
</script>

<style type="text/css">

</style>