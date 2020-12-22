 <template>
	<div class="homework">
		<div class="nav__back d-flex align-center" @click="$router.go(-1)">
			<v-icon large>mdi-chevron-left</v-icon>
			<div>Назад</div>
		</div>
		<h1>задание</h1>
		<div class="homework__panel">
			<h2>Дедлайн:</h2>
			<p>Описание</p>
			<a href="">Файлы </a>
		</div>
		<Button width="166px"></Button>
		<div></div>
	</div>
</template>
 
 <script>
export default {};
</script>
 
 <style lang="scss">
.homework {
	&__panel {
		padding: 21px 16px;
		background-color: #ffffff;
		box-shadow: 0px 22px 44px -15px rgba(236, 237, 254, 0.49);
		border-radius: 15px;
	}
}
</style>