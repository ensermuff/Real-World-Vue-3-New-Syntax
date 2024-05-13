import { createRouter, createWebHistory } from 'vue-router'
import About from '../views/AboutView.vue'
import EventList from '../views/EventListView.vue'
import EventDetails from '../views/event/EventDetails.vue'
import EventRegister from '../views/event/EventRegister.vue'
import EventEdit from '../views/event/EventEdit.vue'

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
      path: '/event/:id',
      name: 'EventDetails',
      props: true,
      component: EventDetails,
    },
    {
      path: '/event/:id/register',
      name: 'EventRegister',
      props: true,
      component: EventRegister,
    },
    {
      path: '/event/:id/edit',
      name: 'EventEdit',
      props: true,
      component: EventEdit,
    },
    {
      path: '/about',
      name: 'About',
      component: About,
    },
  ],
})

export default router
