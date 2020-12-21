import axios from "axios";
import {
	classStudentsUrl,
	teachersUrl,
	subjectsUrl,
	classesUrl,
	timetableUrl,
	lessonsUrl
} from "./urls";

export default {
	state: {
		students: [],
		teachers: [],
		subjects: [],
		classes: [],
		timetable: {},
		lesson: {},
		getStatus: ""
	},
	getters: {
		students: state =>
			state.students.sort((a, b) => {
				return a.full_name.localeCompare(b.full_name);
			}),

		teachers: state =>
			state.teachers.sort((a, b) => {
				return a.full_name.localeCompare(b.full_name);
			}),
		subjects: state =>
			state.subjects.sort((a, b) => {
				return a.name.localeCompare(b.name);
			}),
		freeClasses: state =>
			state.classes.filter(item => item.teacher_id === null),

		classes: state => state.classes,

		timetable: state => state.timetable,

		lesson: state => state.lesson
	},
	mutations: {
		getSuccess(state, { getWhat, data }) {
			switch (getWhat) {
				case "students": {
					state.students = data.data;
					break;
				}
				case "teachers": {
					state.teachers = data.data;
					break;
				}
				case "subjects": {
					state.subjects = data.data;
					break;
				}
				case "classes": {
					state.classes = data.data;
					break;
				}
				case "timetable": {
					state.timetable = data.timetable;
					break;
				}
				case "lesson": {
					state.lesson = data.lesson;
					break;
				}
			}
			state.getStatus = "get " + getWhat + " - Success";
		},
		getError(state, error) {
			state.getStatus = error;
		},
		logStatus(state) {
			console.log(state.getStatus);
		}
	},
	actions: {
		// Универсальный гет
		async get({ commit, rootState }, { getWhat, id = null, params = null }) {
			let url;
			// let responce;
			switch (getWhat) {
				case "students": {
					url = classStudentsUrl.replace("%", id);
					break;
				}
				case "timetable": {
					url = timetableUrl.replace("%", id);
					break;
				}
				case "teachers": {
					url = teachersUrl;
					break;
				}
				case "subjects": {
					url = subjectsUrl;
					break;
				}
				case "classes": {
					url = classesUrl;
					break;
				}
				case "lesson": {
					url = lessonsUrl + "/" + id;
					break;
				}
			}

			commit("loadingOn");
			await axios
				.get(url, {
					headers: {
						Authorization: `Bearer ${rootState.auth.token}`
					},
					params: {
						...params
					}
				})
				.then(resp => {
					commit("getSuccess", { getWhat: getWhat, data: resp.data });
					commit("loadingOff");
				})
				.catch(error => {
					commit("getError", error);
					commit("loadingOff");
				});
			// commit("logStatus");
		}
	}
};
