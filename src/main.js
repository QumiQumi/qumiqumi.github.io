import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";
import Axios from "axios";

import "vue-search-select/dist/VueSearchSelect.css";
import "vue-search-select";
import ModalPanel from "./components/ModalPanel/ModalPanel.vue";
import Button from "./components/Button/Button.vue";
import IconBase from "./components/Icons/IconBase.vue";
import Loader from "@/components/Loader";
import VueHtmlToPaper from "vue-html-to-paper";

// Для авторизации и реквестов
Vue.prototype.$http = Axios;
const token = localStorage.getItem("token");
if (token) {
	Vue.prototype.$http.defaults.headers.common["Authorization"] = token;
}
// Глобальная регистрация компонентов
Vue.component("ModalPanel", ModalPanel);
Vue.component("Button", Button);
Vue.component("IconBase", IconBase);
Vue.component("Loader", Loader);
Vue.config.productionTip = false;
const options = {
	name: "_blank",
	specs: ["fullscreen=no", "titlebar=no", "scrollbars=no"],
	styles: ["https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css"]
};

Vue.use(VueHtmlToPaper, options);
let app;

if (!app) {
	app = new Vue({
		vuetify,
		router,
		store,
		render: h => h(App)
	}).$mount("#app");
}
