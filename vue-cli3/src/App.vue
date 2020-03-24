<template>
  <div id="app">
    <!-- <div class="row">
      <ks-button @click="fn" type="primary">按钮</ks-button>
      <ks-button type="success">按钮</ks-button>
      <ks-button type="info">按钮</ks-button>
      <ks-button type="warning">按钮</ks-button>
      <ks-button type="danger">按钮</ks-button>
    </div>
    <div class="row">
      <ks-button plain type="primary">按钮</ks-button>
      <ks-button plain type="success">按钮</ks-button>
      <ks-button plain type="info">按钮</ks-button>
      <ks-button plain type="warning">按钮</ks-button>
      <ks-button plain type="danger">按钮</ks-button>
    </div>
     <div class="row">
      <ks-button plain icon="ks-icon-delete" round type="primary">按钮</ks-button>
      <ks-button plain icon="ks-icon-delete" round type="success">按钮</ks-button>
      <ks-button plain icon="ks-icon-delete" round type="info">按钮</ks-button>
      <ks-button plain icon="ks-icon-delete" round type="warning">按钮</ks-button>
      <ks-button plain icon="ks-icon-delete" round type="danger">按钮</ks-button>
    </div>
     <div class="row">
      <ks-button plain circle type="primary">按钮</ks-button>
      <ks-button plain circle type="success">按钮</ks-button>
      <ks-button plain circle type="info">按钮</ks-button>
      <ks-button plain circle type="warning">按钮</ks-button>
      <ks-button plain circle type="danger">按钮</ks-button>
    </div>
     <div class="row">
      <ks-button disabled plain icon="ks-icon-delete" type="primary">按钮</ks-button>
      <ks-button plain icon="ks-icon-delete" type="success">按钮</ks-button>
      <ks-button plain icon="ks-icon-delete" type="info">按钮</ks-button>
      <ks-button plain icon="ks-icon-delete" type="warning">按钮</ks-button>
      <ks-button plain icon="ks-icon-delete" type="danger">按钮</ks-button>
      <ks-button>11</ks-button>
    </div>
    <div>
     
    </div> -->
    <!-- <ks-dialog title="温馨提示"></ks-dialog> -->
    <!-- <ks-dialog v-slot:title>
      <h3>我是标题</h3>
    </ks-dialog> -->
    <!-- <ks-button @click="visible=true">显示</ks-button>
    <ks-dialog width="40%" top="300px" :visible.sync="visible">
      1122
      <template v-slot:footer>
        <ks-button  @click="visible=false">取消</template>
        <ks-button type="primary"  @click="visible=false">确定</template>
      </template>
    </ks-dialog> -->

    <!-- <ks-input placeholder="请输入信息" v-model="username" clearable ></ks-input>
    <ks-input placeholder="请输入信息" type="password" v-model="username" show-password></ks-input> -->
    <!-- <ks-input placeholder="请输入信息" type="password" v-model="username"></ks-input> -->
    <!-- <ks-switch v-model="active"></ks-switch> -->
    <!-- <ks-switch v-model="active" active-color="#13ce66" inactive-color="green" name="username"></ks-switch> -->
  </div>
</template>

<script>
 

export default {
  data() {
    return {
      username:'ss',
      active:false
    }
  },
 methods: {
   fn(){
    //  console.log('123');
   },
 },
}
</script>

<style lang="scss" scoped>
  .row {
  margin-bottom: 20px;
  .ks-button {
    margin-right: 20px;
  }
}
.ks-input{
  width: 180px;
}

</style>
