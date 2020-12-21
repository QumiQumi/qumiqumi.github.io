<template>
	<div class="home">
		<div class="nav d-flex align-center">
			<img src="@/assets/images/logo-purple.svg" />
		</div>
		<div class="header-bg"></div>
		<div class="header">
			<div class="header__title">
				<h2>«Перемена»‎ - современная платформа для онлайн-обучения!</h2>
				<router-link to="/sign-in" v-if="!isLoggedIn" class="justify-self-end">
					<div class="header__button-signin d-flex align-center justify-center">
						Войти
					</div>
				</router-link>
				<router-link to="/lk" v-else>
					<div class="header__button-signin d-flex align-center justify-center">
						Личный кабинет
					</div>
				</router-link>
			</div>
		</div>
		<div class="for-whom d-flex">
			<div>
				<img src="@/assets/images/teachers.svg" alt="Для учителей" />
				<p class="for-whom__title">Для учителей</p>
			</div>

			<div>
				<img src="@/assets/images/students.svg" alt="Для учеников" />
				<p class="for-whom__title">Для учеников</p>
			</div>
		</div>
		<div class="about d-flex flex-column align-center">
			<div class="about__title"><h2>O нас</h2></div>
			<div class="about__img"></div>
			<!-- <img src="@/assets/images/about.png" alt="О нас" /> -->
			<p class="about__desc">
				«Перемена»‎ - платформа, направленная на помощь в проведении
				дистанционного обучения. Для учителей больше нет нужды проверять сотни
				тетрадей, а школьники могут посмотреть все домашние задания в одном
				месте!
			</p>
		</div>
		<div class="advantages d-flex flex-column align-center">
			<div class="advantages__title"><h2>Преимущества</h2></div>
			<div class="advantages__content">
				<ul class="advantages__items pl-0">
					<li class="advantages__item">
						<div class="advantages__icon">
							<img src="@/assets/images/books.png" alt="Домашнее задание" />
						</div>
						<h3 class="advantages__title">Домашнее задание</h3>
						<p class="advantages__text">
							Теперь не нужно искать домашнее задание - оно будет приложено к
							каждому уроку
						</p>
					</li>
					<li class="advantages__item">
						<div class="advantages__icon">
							<img src="@/assets/images/bell.png" alt="Уведомления" />
						</div>
						<h3 class="advantages__title">Уведомления</h3>
						<p class="advantages__text">
							Получайте уведомления об изменениях в расписании или о проверке
							домашнего задания
						</p>
					</li>
					<li class="advantages__item">
						<div class="advantages__icon">
							<img src="@/assets/images/onlinestud.png" alt="Онлайн-занятия" />
						</div>
						<h3 class="advantages__title">Онлайн-занятия</h3>
						<p class="advantages__text">
							Больше нет нужды искать каждый раз ссылки на проведение
							онлайн-занятия - теперь они закреплены к каждому уроку в одном
							месте
						</p>
					</li>
				</ul>
			</div>
		</div>
		<div class="footer">
			<div class="footer__content d-flex justify-space-between align-center">
				<div class="footer__contacts d-flex flex-column">
					<span>Контактная информация</span>
					<span>+ 7 999 654 32 32</span>
					<span>eluniversity@gmail.com</span>
				</div>
				<div class="footer__questions d-flex flex-column">
					<span>Остались вопросы?</span>
					<router-link to="#">Техническая поддержка</router-link>
				</div>

				<div class="footer__social">
					<v-icon color="white">mdi-instagram</v-icon>
					<v-icon color="white">mdi-facebook</v-icon>
					<v-icon color="white">mdi-vk</v-icon>
				</div>
			</div>
		</div>
	</div>
</template>


<script>
export default {
	data: () => ({}),
	computed: {
		isLoggedIn() {
			return this.$store.getters.isLoggedIn;
		},
	},
	components: {},
};
</script>

<style lang="scss">
@import "./home.scss";
</style>
