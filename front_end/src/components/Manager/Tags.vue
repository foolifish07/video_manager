
<template>

  <!-- tables -->
  <div style="margin-top: 10px">

    <form class="form-inline">
      <div class="form-group">
        <label>Tag Name:</label>
        <input type="text" class="form-control" 
          placeholder="Tag name" v-model="tag" required>
      </div>
      <button class="btn btn-primary btn-sm" v-on:click="new_tag">New</button>
    </form>

    <table class="table table-hover" style="margin-top: 20px">
      <thead class="thead-default">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>New name</th>
          <th>Update</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="item in tags" track-by="$index">
          <tr>
            <td>{{ $index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td><input type="text" class="form-control" 
              placeholder="new tag name" v-model="item.new_name"></td>
            <td><button class="btn btn-info-outline btn-sm" 
              v-on:click="change_name(item)">Update</button> </td>
            <td><button class="btn btn-danger-outline btn-sm"
              v-on:click="delete_tag(item)">Delete</button> </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>

  <!--template v-for="item in tags" >
    {{ item.new_name }}
    
  </template-->

</template>

<script>
  import client from '../../client.js' 

	export default {
    created: function(){
      this.get_tags();
    },

		data() {
			return {
        tags: [],

        tag: '',
      }
		},
    methods: {
      get_tags: function(){
        let router = this.$router;
        let tags = this.tags;

        client.tags.get_mytags(
          function(data){
            tags.splice(0, tags.length);
            for(let i in data)
              tags.push( data[i] );
          },
          function(data){
            router.go({ name: 'index'} );
          })
      },

      new_tag: function(){
        let router = this.$router;
        let tags = this.tags;
        let post_data = {
          name: this.tag,
        }

        if ( this.tag ){
          client.tag.new(
            function(data){
              tags.push(data);
            },
            function(data){
              router.go({ name: 'index' })
            },
            post_data)
        }
      },
      delete_tag: function(item){
          let router = this.$router;
          let tags = this.tags;
          let index = tags.indexOf(item);

          client.tag.delete(
            function(data){
              tags.splice(index, 1);
            },
            function(data){
              router.go({ name: 'index' })
            },
            { tagid: item._id})

      },
      change_name: function(item){
        let router = this.$router;
        let tags = this.tags;
        let index = tags.indexOf(item);

        if ( item.new_name ){
          client.tag.rename(
            function(data){
              tags.splice(index, 1, data);
            },
            function(data){
              router.go({ name: 'index' })
            },
            { tagid: item._id, name: item.new_name} )

        }
      },


    }
  }
</script>

<style type="text/css">

</style>