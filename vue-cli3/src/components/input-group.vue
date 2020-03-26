<template>
  <div class="ks-inputgroup">
      <slot></slot>
  </div>
</template>
<script>
export default {
  name:'KsInputgroup',
  data() {
      return {
          datas:[
              {
                  id:1,
                  lable:11
              },
              {
                  id:2,
                  lable:22
              },
              {
                  id:3,
                  lable:33
              }
          ]
      }
  },
  provide(){
      return{
          datas:this.datas
      }
  },
  props:
      {
          value:null
      }
  
}
</script>

<style>

</style>