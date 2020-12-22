<template>
	<div fluid class="main-layout">
		<nav class="sidebar d-flex flex-column align-center">
			<div class="sidebar__logo">
				<img src="@/assets/images/logo-purple.svg" />
			</div>
			<div class="sidebar__teacher">
				<h3>{{ $store.getters.name }}</h3>
			</div>
			<div class="main-menu d-flex flex-column align-center mb-auto">
				<div v-for="link in links" :key="link.route">
					<router-link
						v-if="isRouteAllowed(link.route)"
						class="main-menu__link d-flex align-center"
						active-class="main-menu__link-active"
						:to="link.route"
					>
						<icon-base :icon-name="link.icon" class="main-menu__icon">
							<component v-bind:is="link.icon" />
						</icon-base>
						<div>{{ link.title }}</div>
					</router-link>
				</div>
			</div>
			<div
				class="sidebar__help d-flex flex-column align-center justify-space-between"
			>
				<img src="@/assets/images/help.svg" alt="" />
				<div class="d-flex align-center flex-column">
					<span>Нужна помощь?</span>
					<span>Напишите нам на почту</span>
					<router-link to="/">peremena@gmail.com</router-link>
				</div>
			</div>
		</nav>
		<header class="main-header d-flex align-center">
			<nav class="d-flex align-center ml-auto">
				<div class="main-header__notify d-flex align-center justify-center">
					<icon-base
						icon-name="Оповещения"
						width="18"
						height="20"
						icon-color="#ffffff"
						><icon-bell
					/></icon-base>
				</div>
				<a
					class="main-header__auth d-flex align-center justify-space-between"
					@click="logout"
				>
					<icon-base icon-name="logout" width="24" height="24">
						<icon-logout />
					</icon-base>
					<span>Выйти</span>
				</a>
			</nav>
		</header>
		<section class="content">
			<div class="content__center"><router-view /></div>
		</section>
		<loader />
	</div>
</template>

<script>
import Calendar from "../components/Icons/IconCalendar";
import Message from "../components/Icons/IconMessage";
import Study from "../components/Icons/IconStudy";
import TeacherBook from "../components/Icons/IconTeacherBook";
import Settings from "../components/Icons/IconSettings";
import IconBell from "../components/Icons/IconBell";
import IconLogout from "../components/Icons/IconLogout";
import Profile from "../components/Icons/IconProfile";
export default {
	name: "main-layout",
	components: {
		Calendar,
		Message,
		Study,
		TeacherBook,
		Settings,
		IconBell,
		IconLogout,
		Profile,
	},
	data: () => ({
		links: [
			{
				title: "Расписание",
				route: "/timetable",
				exact: true,
				icon: "calendar",
			},
			{ title: "Учителя", route: "/register-teacher", icon: "profile" },
			{ title: "Мой класс", route: "/my-class", icon: "profile" },
		],
	}),
	computed: {
		role() {
			return this.$store.getters.role;
		},
		name() {
			return this.$store.getters.name;
		},
	},
	methods: {
		//TODO вынести метод в отдельный модуль
		// один из способов динамичеcкb подгружать иконки
		getIconUrl(iconName) {
			if (iconName) {
				var images = require.context("@/assets/icons", false, /\.svg$/);
				return images("./" + iconName + ".svg");
			}
		},
		logout() {
			this.$store.dispatch("logout").then(() => {
				this.$router.push("/sign-in");
			});
		},
		//TODO Настроить разрешения для роутов

		isRouteAllowed(url) {
			let roles = this.$router.resolve({ path: url }).route.meta.roles;
			let currentRole = this.$store.getters.role;

			if (roles && (roles.includes("all") || roles.includes(currentRole))) {
				return true;
			}

			return false;
		},
	},
};
</script>

<style lang="scss">
@import "./main-layout.scss";
</style>
