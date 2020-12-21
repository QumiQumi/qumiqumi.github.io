import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index";
Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "Home",
		meta: { layout: "empty", requiresAuth: false },
		component: () => import("../views/Home/Home.vue")
	},
	{
		path: "/sign-in",
		name: "signIn",
		meta: { layout: "auth", requiresAuth: false },
		component: () => import("../views/Auth/SignIn")
	},
	{
		path: "/forgot-password",
		name: "ForgotPassword",
		meta: { layout: "auth" },

		component: () => import("../views/Auth/ForgotPassword.vue")
	},
	{
		path: "/reset-password",
		name: "ResetPassword",
		meta: { layout: "auth" },

		component: () => import("../views/Auth/ResetPassword.vue")
	},
	{
		path: "/register-teacher",
		name: "RegisterTeacher",
		meta: { layout: "main", requiresAuth: true, roles: ["admin"] },

		component: () => import("../views/Admin/RegisterTeacher.vue")
	},
	{
		path: "/my-class",
		name: "MyClass",
		meta: { layout: "main", requiresAuth: true, roles: ["class_teacher"] },

		component: () => import("../views/ClassroomTeacher/MyClass.vue")
	},
	{
		path: "/timetable",
		name: "timetable",
		meta: {
			layout: "main",
			requiresAuth: true,
			roles: ["all"]
		},
		component: () => import("../views/Timetable/Timetable.vue")
	},
	{
		path: "/timetable/lesson/:id",
		name: "lesson",
		meta: { layout: "main", requiresAuth: true, roles: ["class_teacher"] },
		component: () => import("../views/Lesson/Lesson.vue"),
		children: []
	},
	{
		path: "/timetable/lesson/:id/add-homework",
		name: "addHomework",
		meta: { layout: "main", requiresAuth: true, roles: ["class_teacher"] },
		component: () => import("../views/Lesson/AddHomework.vue")
	},
	{
		path: "/timetable/lesson/:id/homework/:homeworkId",
		name: "addHomework",
		meta: { layout: "main", requiresAuth: true, roles: ["class_teacher"] },
		component: () => import("../views/Lesson/AddHomework.vue")
	}
];

const router = new VueRouter({
	mode: "history",
	routes
});
router.beforeEach((to, from, next) => {
	const { roles } = to.meta;
	const currentRole = store.getters.role;

	// Если страница требует авторизации
	// и пользователь не авторизован то перенаправить на авторизацию
	if (to.matched.some(record => record.meta.requiresAuth)) {
		if (!store.getters.isLoggedIn) {
			next({
				path: "/sign-in",
				query: { redirect: to.fullPath }
			});
		} else if (
			roles &&
			(roles.includes("all") || roles.includes(currentRole))
		) {
			next();
		} else {
			next({ path: "/lk" });
		}
	} else {
		next();
	}
});

export default router;
