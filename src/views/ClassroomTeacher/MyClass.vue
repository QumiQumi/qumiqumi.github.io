<template>
	<div class="my-class d-flex flex-column">
		<h1>Мой класс</h1>
		<nav class="my-class__nav d-flex flex-nowrap">
			<div class="my-class__select-class">
				<v-select
					outlined
					dense
					append-icon="mdi-chevron-down"
					v-model="classesSelect"
					:items="classes"
					item-text="class_number"
					item-value="id"
					@change="getStudents"
					>Класс</v-select
				>
			</div>

			<Button @click="modalOpen('add')">Добавить нового ученика</Button>
		</nav>
		<div id="students-table">
			<v-simple-table class="table">
				<template v-slot:default>
					<thead>
						<tr>
							<th class="text-left">ФИО</th>
							<th class="text-left">Логин</th>
							<th class="text-left">Пароль</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(student, index) in students" :key="index">
							<td>{{ student.full_name }}</td>
							<td>{{ student.user.name }}</td>
							<td>
								<span v-if="isPrint">{{ student.user.password }}</span>
								<input
									v-else
									readonly
									:value="student.user.password"
									:type="
										showPassword === student.user.password ? 'text' : 'password'
									"
								/>
								{{ student.isVisible }}
								<v-icon
									class="table__tool"
									@click="togglePassword(student.user.password)"
								>
									{{
										showPassword === student.user.password
											? "mdi-eye"
											: "mdi-eye-off"
									}}
								</v-icon>
							</td>
							<td class="text-right">
								<v-icon @click="modalOpen('edit', student)" class="table__tool"
									>mdi-square-edit-outline</v-icon
								>
								<v-icon
									@click="modalOpen('delete', student)"
									class="table__tool"
									>mdi-trash-can-outline</v-icon
								>
							</td>
						</tr>
					</tbody>
				</template>
			</v-simple-table>
		</div>
		<Button class="align-self-end my-class__print-btn" @click="print"
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
import { studentsUrl } from "@/store/urls.js";

export default {
	mounted() {
		this.classesSelect = this.classes[0].id;
		this.getStudents();
	},
	data() {
		return {
			showPassword: "",
			isPrint: false,
			dialog: false,
			action: "",
			classesSelect: "",
			editedStudent: null,
			modalProps: {},
			modalValidateRules: {
				required: function (value) {
					return !!value || "Необходимо заполнить поле";
				},
			},
		};
	},
	computed: {
		students() {
			return this.$store.getters.students;
		},
		classes() {
			return this.$store.getters.teacherClasses;
		},
	},
	methods: {
		print() {
			this.isPrint = true;
			this.$nextTick(() => {
				this.$htmlToPaper("students-table", null, () => {
					this.isPrint = false;
				});
			});
		},
		togglePassword(password) {
			if (this.showPassword === password) this.showPassword = false;
			else this.showPassword = password;
		},
		getStudents() {
			this.$store.dispatch("get", {
				getWhat: "students",
				id: this.classesSelect,
			});
		},
		editStudent(student) {
			return new Promise((resolve, reject) => {
				this.$store.dispatch("loadingOn");
				axios({
					url: studentsUrl + "/" + this.editedStudent.id,
					method: "put",
					data: {
						...student,
					},
					headers: {
						Authorization: `Bearer ${this.$store.getters.token}`,
					},
				})
					.then((resp) => {
						this.getStudents();
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
		deleteStudent() {
			return new Promise((resolve, reject) => {
				this.$store.dispatch("loadingOn");
				axios({
					url: studentsUrl + "/" + this.editedStudent.id,
					method: "delete",
					headers: {
						Authorization: `Bearer ${this.$store.getters.token}`,
					},
				})
					.then((resp) => {
						this.getStudents();
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
		addStudent(student) {
			return new Promise((resolve, reject) => {
				this.$store.dispatch("loadingOn");

				axios({
					url: studentsUrl,
					method: "post",
					data: {
						...student,
					},
					headers: {
						Authorization: `Bearer ${this.$store.getters.token}`,
					},
				})
					.then((resp) => {
						this.getStudents();
						resolve(resp);
					})
					.catch((err) => {
						reject(err);
					});
				this.$store.dispatch("loadingOff");
				resolve();
			});
		},
		modalCancel() {
			this.dialog = false;
		},
		modalAction(data) {
			this.dialog = false;
			switch (this.action) {
				case "add": {
					let student = {
						full_name: data.full_name.value,
						student_class_id: this.classesSelect,
					};
					this.addStudent(student);

					break;
				}
				case "edit": {
					let student = {
						full_name: data.full_name.value,
					};
					this.editStudent(student);

					break;
				}
				case "delete": {
					this.deleteStudent();
				}
			}
		},
		modalOpen(action, student = null) {
			if (student) this.editedStudent = student;
			this.action = action;
			switch (action) {
				case "add": {
					this.modalProps = {
						title: "Зарегистрировать ученика",
						inputs: {
							full_name: {
								label: "ФИО ученика",
								rules: [this.modalValidateRules.required],
								isTextField: true,
								value: "",
							},
						},
					};
					break;
				}
				case "edit": {
					this.modalProps = {
						title: "Изменить ученика",
						text: this.editedStudent.full_name,
						inputs: {
							full_name: {
								label: "ФИО ученика",
								rules: [this.modalValidateRules.required],
								isTextField: true,
								value: this.editedStudent.full_name,
							},
						},
					};
					break;
				}
				case "delete": {
					this.modalProps = {
						title: "Удалить ученика",
						text:
							"Вы действительно хотите удалить ученика " +
							this.editedStudent.full_name +
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
@import "@/scss/colors.scss";
.my-class {
	&__nav {
		margin-bottom: 43px;
	}
	h1 {
		margin-bottom: 20px;
	}
	&__select-class {
		width: 116px;
		margin-right: 26px;
	}

	&__print-btn {
		margin-top: 50px;
	}
}
</style>