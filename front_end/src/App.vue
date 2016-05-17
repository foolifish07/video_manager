
<template>

	<div class="container-fluid" style="background-color: #e3f2fd;">
	<div class="container" style="background-color: #e3f2fd;">
		
	<nav class="navbar navbar-light" >
	  <a class="navbar-brand" v-link="{ name: 'index' }" >Video manager</a>
	  <ul class="nav navbar-nav pull-right">
	    <li class="nav-item active">
	      <a class="nav-link" v-link="{ name: 'index' }">Home</a>
	    </li>
	    <li class="nav-item">
	      <a class="nav-link" v-link="{ name: 'manager' }">Help</a>
	    </li>
	    <li class="nav-item">
	      <a class="nav-link" v-link="{ name: 'login' }">Log</a>
	    </li>
	  </ul>
	</nav>
	</div>
	</div>

	<router-view></router-view>

</template>

<script>

	export default {
		data() {
			return {
			}
		},
	}
</script>