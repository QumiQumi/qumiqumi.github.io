import axios from "axios";
import { authUrl } from "./urls";
export default {
	state: {
		// Авторизация
		authStatus: "",
		token: localStorage.getItem("token") || "",
		user: localStorage.getItem("user")
			? JSON.parse(localStorage.getItem("user"))
			: "",
		isAdmin: ""
	},
	getters: {
		isLoggedIn: state => !!state.token,
		token: state => state.token,
		authStatus: state => state.authStatus,
		role: state => {
			if (state.user) {
				return state.user.roles !== undefined
					? "admin"
					: state.user.user.roles[0];
			} else {
				return "";
			}
		},
		name: state => {
			if (state.user) {
				return state.user.roles !== undefined
					? "Администратор"
					: state.user.full_name;
			} else {
				return "";
			}
		},
		teacherClasses: state =>
			state.user.roles !== undefined ? [] : state.user.classes,
		user: state => state.user
	},
	mutations: {
		auth_request(state) {
			state.authStatus = "loading";
		},
		auth_success(state, { token, user }) {
			state.authStatus = "success";
			state.isAdmin = user.roles ? true : false;
			state.token = token;
			// console.log(token);
			state.user = user;
		},
		auth_error(state) {
			state.authStatus = "error";
		},
		logout(state) {
			state.authStatus = "";
			state.token = "";
		}
	},
	actions: {
		login({ commit }, user) {
			return new Promise((resolve, reject) => {
				commit("auth_request");
				axios({
					url: authUrl,
					data: {
						...user
					},
					method: "POST"
				})
					.then(resp => {
						const token = resp.data.token;
						const user = resp.data.user;
						localStorage.setItem("token", token);
						localStorage.setItem("user", JSON.stringify(user));
						// console.log(user);
						axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
						commit("auth_success", { token: token, user: user });
						resolve(resp);
					})
					.catch(err => {
						console.log(err);
						commit("auth_error");
						localStorage.removeItem("token");
						localStorage.removeItem("user");
						reject(err);
					});
			});
		},
		logout({ commit }) {
			return new Promise(resolve => {
				commit("logout");
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				delete axios.defaults.headers.common["Authorization"];
				resolve();
			});
		}
	}
};
