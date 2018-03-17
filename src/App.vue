<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
/* 滚动条整体样式 */
/*---滚动条默认显示样式--*/
::-webkit-scrollbar-thumb {
   background-color:rgba(0,0,0,0.15);
   height:50px;
   outline-offset:-2px;
   /*outline:2px solid #fff;*/
   -webkit-border-radius:4px;
   position: relative;
   left: 8px;
   -webkit-border: none;
 /*border: 2px solid #fff;*/
}

/*---鼠标点击滚动条显示样式--*/
::-webkit-scrollbar-thumb:hover{
   background-color:rgba(0,0,0,0.4);
   height:50px;
   -webkit-border-radius:4px;
   -webkit-border: none;
}
/*---滚动条大小--*/
::-webkit-scrollbar{
   width:8px;
   height:8px;
}
/*---滚动框背景样式--*/
::-webkit-scrollbar-track-piece{
  /* 全透明，不显示 */
   background-color:rgba(255,255,255,0);
   -webkit-border-radius:0;
   -webkit-border: none;
}
</style>
