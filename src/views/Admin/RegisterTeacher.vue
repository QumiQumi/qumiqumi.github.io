<template>
	<div class="register-teacher d-flex flex-column">
		<h1>Учителя</h1>
		<nav class="register-teacher__nav d-flex flex-nowrap">
			<Button @click="modalOpen('add')">Добавить нового учителя</Button>
		</nav>
		<div id="teachers-table">
			<v-simple-table class="table">
				<template v-slot:default>
					<thead>
						<tr>
							<th class="text-left">ФИО</th>
							<th class="text-left">Логин</th>
							<th class="text-left">Пароль</th>
							<th class="text-left">Роль</th>
							<th class="text-left">Класс(ы)</th>
							<th class="text-left">Предмет(ы)</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="teacher in teachers" :key="teacher.password">
							<td>{{ teacher.full_name }}</td>
							<td>{{ teacher.user.name }}</td>
							<td>
								<span v-if="isPrint">{{ teacher.user.password }}</span>
								<input
									v-else
									readonly
									:value="teacher.user.password"
									:type="
										showPassword === teacher.user.password ? 'text' : 'password'
									"
								/>
								<v-icon
									class="table__tool"
									@click="togglePassword(teacher.user.password)"
								>
									{{
										showPassword === teacher.user.password
											? "mdi-eye"
											: "mdi-eye-off"
									}}
								</v-icon>
							</td>

							<td>
								{{
									teacher.user.roles[0] === "teacher"
										? "Учитель"
										: "Клас. руководитель"
								}}
							</td>
							<td>
								{{
									teacher.classes !== undefined && teacher.classes.length !== 0
										? clearArray(teacher.classes)
										: ""
								}}
							</td>
							<td>{{ teacher.subject.name }}</td>
							<td class="text-right">
								<v-icon @click="modalOpen('edit', teacher)" class="table__tool"
									>mdi-square-edit-outline</v-icon
								>
								<v-icon
									@click="modalOpen('delete', teacher)"
									class="table__tool"
									>mdi-trash-can-outline</v-icon
								>
							</td>
						</tr>
					</tbody>
				</template>
			</v-simple-table>
		</div>
		<Button @click="print" class="align-self-end register-teacher__print-btn"
			>Печать логинов и паролей</Button
		>
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
import axios from "axios";
import { teachersUrl, classTeachersUrl } from "@/store/urls.js";

export default {
	created() {
		this.getTeachers();
		this.getSubjects();
		this.getClasses();
	},
	data() {
		return {
			showPassword: "",
			dialog: false,
			action: "",
			classesSelect: "",
			editedTeacher: null,
			modalProps: {},
			isPrint: false,
			modalValidateRules: {
				required: function (value) {
					return !!value || "Необходимо заполнить поле";
				},
			},
		};
	},
	computed: {
		teachers() {
			return this.$store.getters.teachers;
		},
		subjects() {
			return this.$store.getters.subjects;
		},
		classes() {
			return this.$store.getters.freeClasses;
		},
	},

	methods: {
		print() {
			this.isPrint = true;
			this.$nextTick(() => {
				this.$htmlToPaper("teachers-table", null, () => {
					this.isPrint = false;
				});
			});
		},
		togglePassword(password) {
			if (this.showPassword === password) this.showPassword = false;
			else this.showPassword = password;
		},
		getTeachers(id = "") {
			if (id) {
				this.$store.dispatch("get", {
					getWhat: "teachersBySubject",
					id: id,
				});
			} else {
				this.$store.dispatch("get", {
					getWhat: "teachers",
				});
			}
		},
		getSubjects() {
			this.$store.dispatch("get", {
				getWhat: "subjects",
			});
		},
		getClasses() {
			this.$store.dispatch("get", {
				getWhat: "classes",
			});
		},
		clearArray(array) {
			return array
				.map((item) => item.class_number)
				.toString()
				.replace("[", "")
				.replace("]", "")
				.replace(",", ", ");
		},
		addTeacher(teacher, isClassTeacher) {
			return new Promise((resolve, reject) => {
				let url = isClassTeacher ? classTeachersUrl : teachersUrl;
				this.$store.dispatch("loadingOn");
				axios({
					url: url,
					method: "post",
					data: {
						...teacher,
					},
					headers: {
						Authorization: `Bearer ${this.$store.getters.token}`,
					},
				})
					.then((resp) => {
						this.getTeachers();
						if (isClassTeacher) this.getClasses();
						resolve(resp);
						this.$store.dispatch("loadingOff");
					})
					.catch((err) => {
						reject(err);
						this.$store.dispatch("loadingOff");
					});

				resolve();
			});
		},
		editTeacher(teacher) {
			return new Promise((resolve, reject) => {
				this.$store.dispatch("loadingOn");
				axios({
					url: teachersUrl + "/" + this.editedTeacher.id,
					method: "put",
					data: {
						...teacher,
					},
					headers: {
						Authorization: `Bearer ${this.$store.getters.token}`,
					},
				})
					.then((resp) => {
						this.getTeachers();
						resolve(resp);
						this.$store.dispatch("loadingOff");
					})
					.catch((err) => {
						reject(err);
						this.$store.dispatch("loadingOff");
					});

				resolve();
			});
		},
		deleteTeacher() {
			return new Promise((resolve, reject) => {
				this.$store.dispatch("loadingOn");
				axios({
					url: teachersUrl + "/" + this.editedTeacher.id,
					method: "delete",
					headers: {
						Authorization: `Bearer ${this.$store.getters.token}`,
					},
				})
					.then((resp) => {
						this.getTeachers();
						this.getClasses();
						this.$store.dispatch("loadingOff");
						resolve(resp);
					})
					.catch((err) => {
						this.$store.dispatch("loadingOff");
						reject(err);
					});

				resolve();
			});
		},
		modalCancel() {
			this.dialog = false;
		},
		modalAction(data) {
			this.dialog = false;
			this.$store.dispatch("loadingOn");

			switch (this.action) {
				case "add": {
					let teacher = {
						full_name: data.full_name.value,
						subject_id: data.subject.value,
						student_class_id: data.class.value,
					};

					this.addTeacher(teacher, data.checkbox.value);
					break;
				}
				case "edit": {
					let teacher = {
						full_name: data.full_name.value,
					};

					this.editTeacher(teacher);
					break;
				}
				case "delete": {
					this.deleteTeacher();
				}
			}
		},
		modalOpen(action, teacher = null) {
			if (teacher) this.editedTeacher = teacher;
			this.action = action;
			switch (action) {
				case "add": {
					this.modalProps = {
						title: "Зарегистрировать учителя",
						inputs: {
							full_name: {
								label: "ФИО учителя",
								rules: [this.modalValidateRules.required],
								isTextField: true,
								value: "",
							},
							subject: {
								label: "Предмет",
								rules: [this.modalValidateRules.required],
								isSearchSelect: true,
								options: this.subjects,
								value: "",
							},
							checkbox: {
								label: "Классный руководитель",
								isCheckbox: true,
								value: false,
							},
							class: {
								label: "Класс",
								rules: [this.modalValidateRules.required],
								isToggleSearchSelect: true,
								options: this.classes,
								value: "",
							},
						},
					};
					break;
				}
				case "edit": {
					this.modalProps = {
						title: "Редактировать учителя",
						text: this.editedTeacher.full_name,
						inputs: {
							full_name: {
								label: "ФИО учителя",
								rules: [this.modalValidateRules.required],
								isTextField: true,
								value: this.editedTeacher.full_name,
							},
						},
					};
					break;
				}
				case "delete": {
					this.modalProps = {
						title: "Удалить учителя",
						text:
							"Вы уверены что хотите удалить учителя " +
							this.editedTeacher.full_name +
							" из системы ?",
						actionBtnText: "Удалить",
					};
					break;
				}
			}
			this.dialog = true;
		},
	},
};
</script>
<style lang="scss">
.register-teacher {
	&__nav {
		margin-bottom: 43px;
	}
	h1 {
		margin-bottom: 20px;
	}
	&__fio {
		margin-top: 25px;
	}
	// &__select ~ &__select {
	// 	margin-top: 24px;
	// }
	&__button {
		margin-top: 48px;
	}
	&__print-btn {
		margin-top: 50px;
	}
}
</style>


