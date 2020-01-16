<template>
    <div class="flex-row align-items-center like" :style="{ color: likeColor }">
        <i class="far fa-heart mg-r-10"></i>
        <small>{{count}}</small>
    </div>
</template>

<script>
    export default {
        name: "Like",
        props: ['likeColor', 'count'],
    }
</script>