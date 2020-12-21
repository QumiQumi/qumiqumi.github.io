import Vue from "vue";
import Vuex from "vuex";
import authModule from "./auth";
import crudModule from "./crud";
Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		auth: authModule,
		crud: crudModule
	},
	state: {
		isLoading: false
	},
	getters: {},
	mutations: {
		loadingOn(state) {
			state.isLoading = true;
		},
		loadingOff(state) {
			state.isLoading = false;
		}
	},
	actions: {
		loadingOn(context) {
			context.commit("loadingOn");
		},
		loadingOff(context) {
			context.commit("loadingOff");
		}
	}
});
