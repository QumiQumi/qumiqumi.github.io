<template>
	<div class="add-homework">
		<div class="nav__back d-flex align-center" @click="$router.go(-1)">
			<v-icon large>mdi-chevron-left</v-icon>
			<div>Назад</div>
		</div>
		<h1>Добавить новое задание</h1>
		<div class="add-homework__panel">
			<v-form
				v-model="form"
				@submit.prevent="saveHomework"
				class="d-flex flex-column"
			>
				<v-text-field
					v-model="theme"
					class="add-homework__input"
					label="Тема домашнего задания"
					dense
					:rules="[rules.required]"
					outlined
				></v-text-field>

				<v-menu
					ref="menu"
					v-model="menu"
					:close-on-content-click="false"
					transition="scale-transition"
					offset-y
					min-width="290px"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-text-field
							v-model="dateFormatted"
							class="add-homework__input"
							outlined
							dense
							label="Дедлайн"
							append-icon="mdi-calendar"
							readonly
							v-bind="attrs"
							v-on="on"
							:rules="[rules.required]"
						></v-text-field>
					</template>
					<v-date-picker locale="ru" v-model="date" @input="menu = false">
					</v-date-picker>
				</v-menu>

				<v-textarea
					label="Описание (не обязательно)"
					v-model="text"
					outlined
					height="142px"
					:rules="[rules.required]"
				></v-textarea>
				<v-file-input
					v-model="files"
					counter
					label="File input"
					multiple
					placeholder="Select your files"
					prepend-icon=""
					append-icon="mdi-paperclip"
					outlined
					:show-size="1000"
				>
					<template v-slot:selection="{ index, text }">
						<v-chip v-if="index < 5" color="#7A76FF" dark label small>
							{{ text }}
						</v-chip>

						<span
							v-else-if="index === 5"
							class="overline grey--text text--darken-3 mx-2"
						>
							+{{ files.length - 5 }} File(s)
						</span>
					</template>
				</v-file-input>
				<Button
					class="align-self-end mt-8"
					width="166px"
					type="submit"
					:disabled="!form"
					>Сохранить</Button
				>
			</v-form>
		</div>
	</div>
</template>

<script>
import { homeworksUrl, filesUrl } from "@/store/urls.js";
import axios from "axios";
export default {
	data() {
		return {
			form: false,
			date: new Date().toISOString().substr(0, 10),
			menu: false,
			files: null,
			theme: "",
			text: "",
			rules: {
				required: (v) => !!v || "Это обязательное поле",
			},
		};
	},
	computed: {
		dateFormatted() {
			return this.formatDate(this.date);
		},
	},
	methods: {
		formatDate(date) {
			if (!date) return null;

			const [year, month, day] = date.split("-");
			return `${day}.${month}.${year}`;
		},
		formatDateForBackend(date) {
			if (!date) return null;

			const [year, month, day] = date.split("-");
			return `${year}-${month}-${day}`;
		},
		saveHomework() {
			console.log(this.files);

			let homework = {
				lesson_id: this.$route.params.id,
				theme: this.theme,
				text: this.text,
				deadline: this.formatDateForBackend,
			};

			this.$store.dispatch("loadingOn");
			axios
				.post(homeworksUrl, homework, {
					headers: {
						Authorization: `Bearer ${this.$store.getters.token}`,
					},
				})
				.then((resp) => {
					let homeworkId = resp.data.data.id;
					this.files.forEach((file) => {
						this.uploadFile(file, homeworkId);
					});
				})
				.catch((err) => {
					this.$store.dispatch("loadingOff");
					console.error(err);
				});
			this.$router.go(-1);
		},
		uploadFile(file, homeworkId) {
			let url = filesUrl.replace("%", homeworkId);
			let formData = new FormData();
			formData.append("homework", file);

			console.log(file);
			console.log(formData);
			axios
				.post(url, formData, {
					headers: {
						Authorization: `Bearer ${this.$store.getters.token}`,
						"Content-Type": "form-data",
					},
				})
				.then(() => {
					this.$store.dispatch("loadingOff");
				})
				.catch((err) => {
					this.$store.dispatch("loadingOff");
					console.error(err);
				});
		},
	},
};
</script>

<style lang="scss">
@import "./addHomework.scss";
</style>