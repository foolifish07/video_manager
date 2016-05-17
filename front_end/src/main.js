import Vue from 'vue'
import VueRouter from 'vue-router'

// route config
import route_config from './router.js'

Vue.config.debug = true;

Vue.use(VueRouter);

let router = new VueRouter()
router.map( route_config )


let route_show = Vue.extend({});


router.beforeEach(function (transition) {
 
  if (transition.to.path === '') {
    transition.abort()
    console.log('ddddddddd');
  } else {
    transition.next()
  }
})


router.start(route_show, '#app');