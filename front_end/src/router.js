import App from './App.vue'

import Index from './components/Index.vue'
import LoginRegister from './components/LoginRegister.vue'
import Video from './components/Video.vue'

import Manager from './components/Manager.vue'
import Info from './components/Manager/Info.vue'
import Videos from './components/Manager/Videos.vue'
import Tags from './components/Manager/Tags.vue'
import Upload from './components/Manager/Upload.vue'

export default {
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
            'manager': {
                name: 'manager',
                component: Manager,
                subRoutes: {
                    'info' : {
                        name: 'info',
                        component: Info,
                    },
                    'videos' : {
                        name: 'videos',
                        component: Videos,
                    },
                    'tags' : {
                        name: 'tags',
                        component: Tags,
                    },
                    'upload' : {
                        name: 'upload',
                        component: Upload
                    }
                }
            }
        }
    }
}