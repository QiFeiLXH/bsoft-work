<template>
    <div class="index"  align="center" :style="'height:'+cardHeight+'px'">
      <img src="../assets/indexbackground.png">
    </div>
</template>

<script>
    export default {
        name: "IndexView",
        data(){
          return{
            cardHeight : window.innerHeight -80
          }
        }
    }
</script>

<style scoped>
  .index{
    background-color: white;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>