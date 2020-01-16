<template>
  <div class="meta-data mg-top-10">
    <p v-if="this.$auth.isAdmin()">администратор</p>
    <p v-else-if="this.$auth.isEditor()">модератор</p>
    <p v-else-if="this.$auth.isCommentator()">комментатор</p>
  </div>
</template>

<script>
    export default {
        name: "Role"
    }
</script>

<style scoped>

</style>
