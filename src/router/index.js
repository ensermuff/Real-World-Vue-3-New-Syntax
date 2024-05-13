import { createRouter, createWebHistory } from 'vue-router'
import About from '../views/AboutView.vue'
import EventList from '../views/EventListView.vue'
import EventDetails from '../views/event/EventDetails.vue'
import EventLayout from '../views/event/EventLayout.vue'
import EventRegister from '../views/event/EventRegister.vue'
import EventEdit from '../views/event/EventEdit.vue'
import NotFound from '../views/NotFound.vue'
import NetworkError from '../views/NetworkError.vue'
import nProgress from 'nprogress'
import EventService from '@/services/EventService.js'
import GStore from '@/store/index.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'EventList',
      component: EventList,
      props: (route) => ({ page: parseInt(route.query.page) || 1 }),
    },
    {
      path: '/events/:id',
      name: 'EventLayout',
      props: true,
      component: EventLayout,
      beforeEnter: (to) => {
        return EventService.getEvent(to.params.id)
          .then((response) => {
            GStore.event = response.data
          })
          .catch((error) => {
            console.log(error)
            if (error.response && error.response.status == 404) {
              return {
                name: '404Resource',
                params: { resource: 'event' },
              }
            } else {
              return { name: 'NetworkError' }
            }
          })
      },
      children: [
        {
          path: '',
          name: 'EventDetails',
          component: EventDetails,
        },
        {
          path: 'register',
          name: 'EventRegister',
          component: EventRegister,
        },
        {
          path: 'edit',
          name: 'EventEdit',
          component: EventEdit,
          meta: { requireAuth: true },
        },
      ],
    },
    {
      path: '/event/:afterEvent(.*)',
      redirect: (to) => {
        return { path: '/events/' + to.params.afterEvent }
      },
    },
    {
      path: '/about-us',
      name: 'About',
      component: About,
    },
    {
      path: '/about',
      redirect: { name: 'About' },
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFound,
    },
    {
      path: '/404/:resource',
      name: '404Resource',
      component: NotFound,
      props: true,
    },
    {
      path: '/network-error',
      name: 'NetworkError',
      component: NetworkError,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to && from && savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

router.beforeEach((to, from) => {
  nProgress.start()

  const notAuthorized = false // true
  if (to.meta.requireAuth && notAuthorized) {
    GStore.flashMessage = 'Sorry, you are not authorized to view this page'

    setTimeout(() => {
      GStore.flashMessage = ''
    }, 3000)

    if (from.href) {
      return false
    } else {
      return { path: '/' }
    }
  }
})

router.afterEach(() => {
  nProgress.done()
})

export default router
