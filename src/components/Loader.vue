<template>
	<v-overlay :value="$store.state.isLoading" opacity="0.2">
		<v-progress-circular
			:size="70"
			:width="7"
			color="#7A76FF"
			indeterminate
		></v-progress-circular>
	</v-overlay>
</template>

<script>
export default {
	data() {
		return {};
	},
};
</script>

<style lang="scss">
.loader {
}
</style>