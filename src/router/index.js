import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Items from '@/pages/Items.vue'
import ItemDetail from '@/pages/ItemDetail.vue'
import Profile from '@/pages/Profile.vue'
import Admin from '@/pages/Admin.vue'
import MyApplications from '@/pages/MyApplications.vue'
import CompanyApplications from '@/pages/CompanyApplications.vue'
import StudentProfile from '@/pages/StudentProfile.vue'
import NotFound from '@/pages/NotFound.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useAuthStore } from '@/stores/authStore'

const routes = [
    { path: '/login', name: 'Login', component: Login },
    {
        path: '/',
        component: MainLayout,
        children: [
            { path: '', name: 'Home', component: Home },
            {
                path: '/items',
                name: 'Items',
                component: Items,
                meta: { requiresAuth: true },
            },
            {
                path: '/items/:id',
                name: 'ItemDetail',
                component: ItemDetail,
                meta: { requiresAuth: true },
            },
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: Dashboard,
                meta: { requiresAuth: true },
            },
            {
                path: '/applications',
                name: 'MyApplications',
                component: MyApplications,
                meta: { requiresAuth: true },
            },
            {
                path: '/applications/company',
                name: 'CompanyApplications',
                component: CompanyApplications,
                meta: { requiresAuth: true, requiresCompany: true },
            },
            {
                path: '/profile',
                name: 'Profile',
                component: Profile,
                meta: { requiresAuth: true },
            },
            {
                path: '/students/:id',
                name: 'StudentProfile',
                component: StudentProfile,
                meta: { requiresAuth: true, requiresCompany: true },
            },
            {
                path: '/admin',
                name: 'Admin',
                component: Admin,
                meta: { requiresAuth: true, requiresAdmin: true },
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach((to, from, next) => {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) auth.loadFromStorage()

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return next('/login')
    }

    if (to.meta.requiresCompany && !(auth.isCompany || auth.isAdmin)) {
        return next('/dashboard')
    }

    if (to.meta.requiresAdmin && !auth.isAdmin) {
        return next('/dashboard')
    }

    return next()
})

export default router