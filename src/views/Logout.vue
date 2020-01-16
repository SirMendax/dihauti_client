<template>
    <div></div>
</template>

<script>
    export default {
        name: "Logout",
        created() {
            if(this.$auth.isAuthenticated()){
                this.$auth.destroyToken();
                window.location = '/';
            }
        }
    }
</script>