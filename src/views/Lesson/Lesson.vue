<template>
	<div>
		<div class="nav__back d-flex align-center" @click="$router.go(-1)">
			<v-icon large>mdi-chevron-left</v-icon>
			<div>Назад</div>
		</div>
		<div class="lesson d-flex flex-column">
			<div class="lesson__title d-flex justify-space-between">
				<h1>
					{{ lesson.subject ? lesson.subject.name : "" }},
					{{ lesson.class ? lesson.class.class_number : "" }}
				</h1>
				<v-icon v-if="!isEdit" @click="editLesson">mdi-pencil-outline</v-icon>
			</div>
			<div v-if="!isEdit">
				<div class="lesson__theme">
					<span v-if="!lesson.theme">Добавьте тему урока!</span>
					<span v-else> Тема: {{ lesson.theme }}</span>
				</div>
				<span v-if="!lesson.link">Добавьте ссылку на онлайн урок!</span>
				<a v-else :href="lesson.link">Онлайн - занятие</a>
			</div>
			<div v-else class="lesson__form">
				<v-text-field
					label="Тема урока"
					v-model="editedLesson.theme"
					dense
					outlined
					full-width
				></v-text-field>

				<v-text-field
					label="Ссылка на онлайн-урок"
					v-model="editedLesson.link"
					dense
					outlined
					full-width
				></v-text-field>
				<Button @click="saveLesson">Сохранить</Button>
			</div>
		</div>

		<div class=" ">
			<h2 class="lesson-homework__title">Домашние задания</h2>
			<div class="lesson-homework-empty">
				<img src="@/assets/images/nohomework.svg" alt="Ничего не задано" />
				<div class="lesson-homework__subtitle">У вас нет домашних заданий!</div>
				<Button @click="redirectToAddHomework">Добавить новое</Button>
			</div>
		</div>
	</div>
</template>

<script>
import { lessonsUrl } from "@/store/urls.js";
import axios from "axios";
export default {
	created() {
		this.loadLesson();
	},
	computed: {
		lesson() {
			return this.$store.getters.lesson;
		},
	},
	data() {
		return {
			isEdit: false,
			editedLesson: {},
		};
	},
	methods: {
		async loadLesson() {
			await this.$store.dispatch("get", {
				getWhat: "lesson",
				id: this.$route.params.id,
			});
		},
		editLesson() {
			this.isEdit = true;
			this.editedLesson = {
				theme: this.lesson.theme,
				link: this.lesson.link,
			};
		},

		saveLesson() {
			this.isEdit = false;
			if (
				this.editedLesson.theme === this.lesson.theme &&
				this.editedLesson.link === this.lesson.link
			)
				return;
			this.$store.dispatch("loadingOn");
			axios
				.put(lessonsUrl + "/" + this.$route.params.id, this.editedLesson, {
					headers: {
						Authorization: `Bearer ${this.$store.getters.token}`,
					},
				})
				.then(() => {
					this.loadLesson();
					this.$store.dispatch("loadingOff");
				})
				.catch((err) => {
					this.$store.dispatch("loadingOff");
					console.error(err);
				});
		},
		redirectToAddHomework() {
			this.$router.push({
				name: "addHomework",
			});
		},
	},
};
</script>

<style lang="scss">
@import "./lesson.scss";
</style>