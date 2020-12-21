<template>
	<div class="white modal-panel" :style="style">
		<v-form
			class="modal-panel__form"
			v-model="form"
			@submit.prevent="$emit('action', inputs)"
		>
			<div class="modal-panel__header">
				<slot name="title">
					<h2>
						{{ title }}
					</h2>
				</slot>
				<slot name="text" v-if="text">
					<span>
						{{ text }}
					</span>
				</slot>
			</div>
			<div class="modal-panel__inputs">
				<slot name="inputs">
					<div v-for="(input, index) in inputs" :key="index">
						<v-text-field
							class="modal-panel__input"
							v-if="input.isTextField"
							:label="input.label"
							:rules="input.rules"
							v-model="input.value"
							dense
							outlined
							full-width
						></v-text-field>
						<model-list-select
							class="modal-panel__input"
							v-if="input.isSearchSelect"
							:list="input.options"
							v-model="input.value"
							option-value="id"
							option-text="name"
							:placeholder="input.label"
						></model-list-select>
						<model-list-select
							class="modal-panel__input"
							v-if="input.isToggleSearchSelect && inputs.checkbox.value"
							:list="input.options"
							v-model="input.value"
							option-value="id"
							option-text="class_number"
							:placeholder="input.label"
						></model-list-select>
						<v-checkbox
							v-if="input.isCheckbox"
							v-model="input.value"
							:label="input.label"
						></v-checkbox>
					</div>
				</slot>
			</div>
			<div v-if="timeSet">
				<v-container class="time-setting__form__container">
					<v-row align="center" class="time-setting__row">
						<v-col cols="3">
							<span>1 урок</span>
						</v-col>
						<v-col cols="4">
							<div class="input time-setting__time">
								<v-text-field label="hh:mm" outlined dense />
							</div>
						</v-col>
						<v-col cols="1">
							<span>-</span>
						</v-col>
						<v-col cols="4">
							<div class="input time-setting__time">
								<v-text-field label="hh:mm" outlined dense />
							</div>
						</v-col>
					</v-row>
					<v-row align="center" class="time-setting__row">
						<v-col cols="3">
							<span>2 урок</span>
						</v-col>
						<v-col cols="4">
							<div class="input time-setting__time">
								<v-text-field label="hh:mm" outlined dense />
							</div>
						</v-col>
						<v-col cols="1">
							<span>-</span>
						</v-col>
						<v-col cols="4">
							<div class="input time-setting__time">
								<v-text-field label="hh:mm" outlined dense />
							</div>
						</v-col>
					</v-row>
					<v-row align="center" class="time-setting__row">
						<v-col cols="3">
							<span>3 урок</span>
						</v-col>
						<v-col cols="4">
							<div class="input time-setting__time">
								<v-text-field label="hh:mm" outlined dense />
							</div>
						</v-col>
						<v-col cols="1">
							<span>-</span>
						</v-col>
						<v-col cols="4">
							<div class="input time-setting__time">
								<v-text-field label="hh:mm" outlined dense />
							</div>
						</v-col>
					</v-row>
					<v-row align="center" class="time-setting__row">
						<v-col cols="3">
							<span>4 урок</span>
						</v-col>
						<v-col cols="4">
							<div class="input time-setting__time">
								<v-text-field label="hh:mm" outlined dense />
							</div>
						</v-col>
						<v-col cols="1">
							<span>-</span>
						</v-col>
						<v-col cols="4">
							<div class="input time-setting__time">
								<v-text-field label="hh:mm" outlined dense />
							</div>
						</v-col>
					</v-row>
					<v-row align="center" class="time-setting__row">
						<v-col cols="3">
							<span>5 урок</span>
						</v-col>
						<v-col cols="4">
							<div class="input time-setting__time">
								<v-text-field label="hh:mm" outlined dense />
							</div>
						</v-col>
						<v-col cols="1">
							<span>-</span>
						</v-col>
						<v-col cols="4">
							<div class="input time-setting__time">
								<v-text-field label="hh:mm" outlined dense />
							</div>
						</v-col>
					</v-row>
					<v-row align="center" class="time-setting__row">
						<v-col cols="3">
							<span>5 урок</span>
						</v-col>
						<v-col cols="4">
							<div class="input time-setting__time">
								<v-text-field label="hh:mm" outlined dense />
							</div>
						</v-col>
						<v-col cols="1">
							<span>-</span>
						</v-col>
						<v-col cols="4">
							<div class="input time-setting__time">
								<v-text-field label="hh:mm" outlined dense />
							</div>
						</v-col>
					</v-row>
					<v-row align="center" class="time-setting__row">
						<v-col cols="3">
							<span>6 урок</span>
						</v-col>
						<v-col cols="4">
							<div class="input time-setting__time">
								<v-text-field label="hh:mm" outlined dense />
							</div>
						</v-col>
						<v-col cols="1">
							<span>-</span>
						</v-col>
						<v-col cols="4">
							<div class="input time-setting__time">
								<v-text-field label="hh:mm" outlined dense />
							</div>
						</v-col>
					</v-row>
					<v-row align="center" class="time-setting__row">
						<v-col cols="3">
							<span>7 урок</span>
						</v-col>
						<v-col cols="4">
							<div class="input time-setting__time">
								<v-text-field label="hh:mm" outlined dense />
							</div>
						</v-col>
						<v-col cols="1">
							<span>-</span>
						</v-col>
						<v-col cols="4">
							<div class="input time-setting__time">
								<v-text-field label="hh:mm" outlined dense />
							</div>
						</v-col>
					</v-row>
					<v-row align="center" class="time-setting__row">
						<v-col cols="3">
							<span>8 урок</span>
						</v-col>
						<v-col cols="4">
							<div class="input time-setting__time">
								<v-text-field label="hh:mm" outlined dense />
							</div>
						</v-col>
						<v-col cols="1">
							<span>-</span>
						</v-col>
						<v-col cols="4">
							<div class="input time-setting__time">
								<v-text-field label="hh:mm" outlined dense />
							</div>
						</v-col>
					</v-row>
				</v-container>
			</div>
			<div v-if="quartSet">
				<v-container class="quart-setting__form__container">
					<v-row align="center" class="quart-setting__row">
						<v-col cols="6">
							<span>Начало четверти</span>
						</v-col>
						<v-col cols="6">
							<div class="input quart-setting__time">
								<v-text-field label="dd/mm/yyyy" outlined dense />
							</div>
						</v-col>
					</v-row>
					<v-row align="center" class="quart-setting__row">
						<v-col cols="6">
							<span>Конец четверти</span>
						</v-col>
						<v-col cols="6">
							<div class="input quart-setting__time">
								<v-text-field label="dd/mm/yyyy" outlined dense />
							</div>
						</v-col>
					</v-row>
				</v-container>
			</div>
			<div v-if="secondText" class="modal-panel__second-text">
				<slot name="second-text"> </slot>
			</div>
			<div class="modal-panel__buttons">
				<slot name="buttons">
					<Button
						v-for="(button, index) in buttons"
						:key="index"
						class="modal-panel__button"
						:disabled="!form"
						:loading="isLoading"
					>
						{{ button.text }}
					</Button>
				</slot>
				<Button
					v-if="!noActionBtn"
					class="modal-panel__button"
					:disabled="!validated"
					type="submit"
					:loading="isLoading"
				>
					{{ actionBtnText }}
				</Button>
				<Button
					secondary
					class="modal-panel__button"
					v-if="!noCancelBtn"
					@click="$emit('cancel')"
				>
					Отмена</Button
				>
			</div>
		</v-form>
	</div>
</template>

<script>
import { ModelListSelect } from "vue-search-select";

export default {
	data() {
		return {
			form: false,
			isLoading: false,
			isChecked: false,
		};
	},
	components: {
		ModelListSelect,
	},
	props: {
		width: { type: Number, default: 369 },
		title: { type: String },
		text: { type: String },
		secondText: { type: String },
		inputs: { type: Object },
		buttons: { type: Array },
		actionBtnText: { type: String, default: "Сохранить" },
		noActionBtn: { type: Boolean, default: false },
		noCancelBtn: { type: Boolean, default: false },
		timeSet: { type: Boolean },
		quartSet: { type: Boolean },
		lessonRemove: { type: Boolean },
		filterSelect: { type: Function },
	},
	computed: {
		style() {
			return "width:" + this.width + "px";
		},
		validated() {
			let isValidated = false;
			for (let key in this.inputs) {
				if (this.inputs[key].isCheckbox && this.inputs[key].value === false)
					break;
				isValidated = this.inputs[key].value ? true : false;
				if (!isValidated) return false;
			}
			return true;
		},
	},
	methods: {},
};
</script>

<style lang="scss">
@import "./modal-panel.scss";
</style>
