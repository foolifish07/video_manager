import VueRouter from 'vue-router'
import Vue from 'vue'



import App from './App.vue'

import Index from './components/Index.vue'
import LoginRegister from './components/LoginRegister.vue'
import Video from './components/Video.vue'
import Panel from './components/Videopanel.vue'
import Chat from './components/Chat.vue'

import Manager from './components/Manager.vue'
import Info from './components/Manager/Info.vue'
import Videos from './components/Manager/Videos.vue'
import Tags from './components/Manager/Tags.vue'
import Upload from './components/Manager/Upload.vue'

Vue.use(VueRouter);

let router = new VueRouter();
router.beforeEach(function (transition) {
    let to = transition.to;
    console.log( to.path );
    if (transition.to.path === '/nothing') {
        transition.abort();
    } else {
        transition.next()
    }
})

router.map({
    'chat': {
        component: Chat,
    },
    '/': {
        component: App,
        subRoutes: {
            '/index': {
                name: 'index',
                component: Index,
            },
            '/video/:hash': {
                name: 'video',
                component: Video,
            },
            '/login': {
                name: 'login',
                component: LoginRegister,
            },
            '/manager': {
                name: 'manager',
                component: Manager,
                subRoutes: {
                    '/home': {
                        name: 'home',
                        component: Panel,
                    },
                    '/info' : {
                        name: 'info',
                        component: Info,
                    },
                    '/videos' : {
                        name: 'videos',
                        component: Videos,
                    },
                    '/tags' : {
                        name: 'tags',
                        component: Tags,
                    },
                    '/upload' : {
                        name: 'upload',
                        component: Upload,
                    }
                }
            }
        }
    }
})
router.redirect({
  '/': '/index',
  '/manager': '/manager/info',
})

export default router

let route_show = Vue.extend({});
router.start(route_show, '#app');