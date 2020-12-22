<template>
	<div class="timetable d-flex flex-column">
		<h1 v-if="role === 'admin'">Изменить расписание</h1>
		<h1 v-else>Расписание</h1>
		<nav class="timetable__nav d-flex flex-nowrap">
			<!-- <Button @click="modalOpen('time')">Настроить время</Button>
			<Button @click="modalOpen('quart')">Настроить четверть</Button> -->
			<div
				class="timetable__select-class"
				v-if="
					role === 'admin' || role === 'class_teacher' || role === 'teacher'
				"
			>
				<v-select
					outlined
					dense
					append-icon="mdi-chevron-down"
					v-model="classesSelect"
					:items="classes"
					item-text="class_number"
					item-value="id"
					@change="loadTimetable"
					>Класс</v-select
				>
			</div>
			<h2 v-if="role === 'student'">
				Мое расписание: {{ $store.getters.classNumber }}
			</h2>
		</nav>
		<div
			class="timetable__carusel white--text d-flex justify-space-between align-center"
		>
			<v-icon color="white" @click="loadTimetable('down')"
				>mdi-arrow-left</v-icon
			>
			{{ date }}
			<v-icon color="white" @click="loadTimetable('up')"
				>mdi-arrow-right</v-icon
			>
		</div>
		<div class="timetable__grid">
			<div class="timetable__time">
				<div v-for="(item, index) in time" :key="index">{{ item }}</div>
			</div>
			<div class="timetable__days">
				<div v-for="(item, index) in days" :key="index">{{ item }}</div>
			</div>
			<div class="timetable__lessons">
				<div
					v-for="(day, name) in lessons"
					:key="name"
					class="timetable__lessons-column"
				>
					<div
						v-for="(item, index) in day"
						:key="index"
						class="timetable__cell"
					>
						<div
							v-if="item.isEmpty && role === 'admin'"
							class="timetable__cell-add"
							@click="modalOpen('add', item)"
						>
							<v-icon large>mdi-plus</v-icon>
						</div>
						<div
							v-else-if="item.isEmpty && role != 'admin'"
							class="timetable__cell-empty"
						></div>

						<div v-else class="timetable__cell-lesson">
							<div @click="redirectToLesson(item)">
								<p v-if="item.subject">{{ item.subject.name }}</p>
								<i v-if="item.teacher">{{ item.teacher.full_name }}</i>
							</div>

							<v-icon
								small
								class="timetable__cell-lesson__icon-close"
								:class="{ 'd-none': role != 'admin' }"
								@click="modalOpen('delete', item)"
								>mdi-close</v-icon
							>
						</div>
					</div>
				</div>
			</div>
		</div>
		<v-dialog v-model="dialog" width="fit-content">
			<modal-panel
				v-on:cancel="modalCancel"
				v-on:action="modalAction"
				v-bind="modalProps"
			>
			</modal-panel>
		</v-dialog>
	</div>
</template>

<script>
import { lessonsUrl } from "@/store/urls.js";
import axios from "axios";

export default {
	async created() {
		await this.$store.dispatch("get", {
			getWhat: "classes",
		});
		this.classesSelect = this.classes[0].id;
		this.loadTimetable();
		this.getTeachers();
		this.getSubjects();
	},

	data() {
		return {
			dialog: false,
			action: "",
			modalProps: {},
			editedItem: "",
			classesSelect: "",
			lessons: {
				monday: "",
				tuesday: "",
				wednesday: "",
				thursday: "",
				friday: "",
				saturday: "",
			},
			time: [
				"8:50 - 9:30",
				"8:00 - 8:40",
				"9:45 - 10:25",
				"10:40 - 11:20",
				"11:35 - 12:15",
				"12:25 - 13:05",
				"13:10 - 13:50",
				"14:00 - 14:40",
			],
			days: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],

			modalValidateRules: {
				required: function (value) {
					return !!value || "Необходимо заполнить поле";
				},
			},
			subjectId: "",
		};
	},
	computed: {
		role() {
			return this.$store.getters.role;
		},
		classes() {
			return this.$store.getters.classes;
		},
		teachers() {
			let teachers = this.$store.getters.teachers;
			teachers.forEach((item) => {
				item.name = item.full_name;
			});
			return teachers;
		},
		subjects() {
			return this.$store.getters.subjects;
		},
		timetable() {
			return this.$store.getters.timetable;
		},
		date() {
			let options = {
				month: "numeric",
				day: "numeric",
			};
			let date = new Date(this.timetable.start_date);
			if (this.timetable.start_date)
				return (
					date.toLocaleString("ru", options) +
					" - " +
					new Date(date.setDate(date.getDate() + 7)).toLocaleString(
						"ru",
						options
					)
				);
			else return "";
		},
		currentDate() {
			if (this.timetable.start_date) {
				return this.timetable.start_date;
			} else {
				return new Date();
			}
		},
	},
	methods: {
		async getTeachers() {
			await this.$store.dispatch("get", {
				getWhat: "teachers",
			});
		},
		async getSubjects() {
			await this.$store.dispatch("get", {
				getWhat: "subjects",
			});
		},
		async loadTimetable(direction = "") {
			for (let key in this.lessons) {
				this.lessons[key] = "";
			}
			let monday = getMonday(direction, this.currentDate);
			await this.$store.dispatch("get", {
				getWhat: "timetable",
				id: this.classesSelect,
				params: { start_date: monday },
			});
			this.getTimetable();

			function getMonday(direction, currentDate) {
				let date = new Date(currentDate);
				let day = date.getDay(),
					diff = date.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
				let monday = new Date(date.setDate(diff));
				switch (direction) {
					case "up": {
						monday = monday.addDays(7);
						break;
					}
					case "down": {
						monday = monday.addDays(-7);

						break;
					}
				}
				return `${monday.getFullYear()}-${
					monday.getMonth() + 1
				}-${monday.getDate()}`;
			}
			Date.prototype.addDays = function (days) {
				var date = new Date(this.valueOf());
				date.setDate(date.getDate() + days);
				return date;
			};
		},
		getTimetable() {
			let i = 1;
			for (let key in this.lessons) {
				this.lessons[key] = this.getLessonsForDay(i);
				i++;
			}
		},
		getLessonsForDay(weekDay) {
			let timetable = this.$store.getters.timetable;

			// сортировка по номеру урока и фильтрация по дате
			let lessons = timetable.lessons
				.filter((item) => item.week_day === weekDay)
				.sort((a, b) => a.lesson_number - b.lesson_number);

			// алгоритм для получения массива уроков
			for (let i = 0; i <= lessons.length; i++) {
				let numberOfLesson = i + 1;
				let newLesson = {
					timetable_id: timetable.id,
					lesson_number: numberOfLesson,
					week_day: weekDay,
					isEmpty: true,
				};
				// если в массиве больше нет уроков
				if (i === lessons.length) {
					for (let k = i; k < 8; k++) {
						numberOfLesson = k + 1;
						newLesson = {
							timetable_id: timetable.id,
							lesson_number: numberOfLesson,
							week_day: weekDay,
							isEmpty: true,
						};
						lessons.push(newLesson);
					}
					break;
				}
				// обработка основного массива
				else {
					const lesson = lessons[i];
					if (lesson.lesson_number !== numberOfLesson) {
						lessons.splice(i, 0, newLesson);
					}
				}
				// чтоб наверняка!
				if (i >= 8) break;
			}

			return lessons;
		},
		deleteLesson() {
			axios
				.delete(lessonsUrl + "/" + this.editedItem.id, {
					headers: {
						Authorization: `Bearer ${this.$store.getters.token}`,
					},
				})
				.then(() => {
					this.loadTimetable();
					this.$store.dispatch("loadingOff");
				})
				.catch((err) => {
					this.$store.dispatch("loadingOff");
					console.error(err);
				});
		},
		addLesson(lesson) {
			axios
				.post(lessonsUrl, lesson, {
					headers: {
						Authorization: `Bearer ${this.$store.getters.token}`,
					},
				})
				.then(() => {
					this.loadTimetable();
					this.$store.dispatch("loadingOff");
				})
				.catch((err) => {
					this.$store.dispatch("loadingOff");
					console.error(err);
				});
		},
		modalCancel() {
			this.dialog = false;
			this.modalProps = "";
		},
		modalAction(data) {
			this.dialog = false;
			this.$store.dispatch("loadingOn");
			switch (this.action) {
				case "delete": {
					this.deleteLesson();
					this.modalProps = "";
					break;
				}
				case "add": {
					let lesson = {
						timetable_id: this.timetable.id,
						teacher_id: data.teacher.value,
						subject_id: data.subject.value,
						lesson_number: this.editedItem.lesson_number,
						week_day: this.editedItem.week_day,
						class_room_id: 1,
					};
					this.addLesson(lesson);
					this.modalProps = "";
					break;
				}
				case "time": {
					//тут надо подключить на время

					break;
				}
				case "quart": {
					//тут на четверть

					break;
				}
			}
		},
		modalOpen(action, item = null) {
			if (item) this.editedItem = item;
			this.action = action;
			switch (action) {
				case "delete": {
					this.modalProps = {
						title: "Удаление урока",
						text: "Вы действительно хотите удалить этот урок  из расписания?",
						actionBtnText: "Удалить",
					};
					break;
				}
				case "add": {
					this.modalProps = {
						title: "Добавить урок",
						inputs: {
							subject: {
								label: "Предмет",
								rules: [this.modalValidateRules.required],
								isSearchSelect: true,
								options: this.subjects,
								value: "",
							},
							teacher: {
								label: "Учитель",
								rules: [this.modalValidateRules.required],
								isSearchSelect: true,
								options: this.teachers,
								value: "",
							},
						},
						filterSelect() {},
					};
					break;
				}
				case "time": {
					this.modalProps = {
						title: "Настроить время",
						timeSet: true,
					};
					break;
				}
				case "quart": {
					this.modalProps = {
						title: "Настроить четверть",
						actionBtnText: "Добавить",
						quartSet: true,
					};
					break;
				}
			}
			this.dialog = true;
		},
		redirectToLesson(lesson) {
			let userId = this.$store.getters.user.id;
			if (this.role === "student" || userId === lesson.teacher.id)
				this.$router.push({
					name: "lesson",
					params: { id: lesson.id },
				});
		},
	},
};
</script>

<style lang="scss">
@import "./timetable.scss";
</style>
