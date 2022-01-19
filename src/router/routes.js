
const routes = [
  {
    path: '/',
    component: () => import('pages/Resultado.vue'),
    children: [
      { 
        path: '/Resultados', 
        name: "Resultado", 
        component: () => import('pages/Resultado.vue') 
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
