<template>
  <div 
    class="ks-input" 
    :class="{'ks-input--suffix': showSuffix,}"
  >
    <!-- 如果传了show-password, 判断是否需要切换 密码的显示 如果不传，不判断 -->
    <input
      class="ks-input__inner"
      :class="{'is-disabled': disabled}"
      :placeholder="placeholder"
      :type="showPassword ? (passwordVisible ? 'text':'password') : type"
      :name="name"
      :disabled="disabled"
      :value="value"
      :autocomplete="autocomplete || autoComplete"
      :readonly='readonly'
      ref="input"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
    >
    <span class="ks-input__suffix" v-if="showSuffix">
      <i class="ks-input__icon ks-icon-circle-close" v-if="clearable && value" @click="clear"></i>
      <i class="ks-input__icon ks-icon-view"
        v-if="showPassword"
        @click="handlePassword"
        :class="{'ks-icon-view-active':passwordVisible}"
      ></i>
    </span>
  </div>
</template>

<script>
export default {
  name: 'ksInput',
  componentName:"KsInput",
  inject:{
   ksForm:{
     default:""
   },
   ksFormItem:{
     default:""
   }
  },
  data () {
    return {
      // 用于控制是否显示密码框
      passwordVisible: false,
      focused:false
    }
  },
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    name: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String,Number],
      default: ''
    },
    clearable: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    validateEvent:{
      type: Boolean,
      default:true
    },
    autoszie:{
      type:[Boolean, Object],
      default: false
    },
    autocomplete:{
      type:String,
      default:'off'
    },
    readonly:{
      type:Boolean,
      default: false
    }
  },
  watch: {
    // value(val){
    //   this.$nextTick(this.resizeTextarea);
    //   if(this.validateEvent){
    //     this.despatch('ksFromItem', 'ks.from.change', [val])
    //   }
    // }
  },
  computed: {
    showSuffix () {
      return this.clearable || this.showPassword;
    },
    inputSize () {
      return this.size
    }
  },
  methods: {
    focus(){
      this.getInput().focus();
      // console.log(1111);
    },
    blur(){
      this.getInput().blur();
    },
    //选中input中的文字
    sksect(){
      this.getInput().sksect();
      // console.log(222);
    },
    handleInput (e) {
      this.$emit('input', e.target.value);
    },
    handleBlur(e){
      this.focused = false;
      this.$emit('blur', e)
    },
    clear () {
      // 把内容清空
      this.$emit('input', '');
      this.$emit('change', '');
      this.$emit('clear', '');
      return this.clearable && !this.readonly;
    },
    handlePassword () {
      this.passwordVisible = !this.passwordVisible;
    },
    handleFocus(e){
      this.focused = true;
      this.$emit('focus', e);
      // console.log(this.$parent.name);
    },
    getInput(){
      return this.$refs.input;
    },
    handleChange(e){
      this.$emit('change' ,e.target.value)
    },
    //判断 是否执行服务端渲染
    resizeTextarea(){
      if(this.$isServer) return;
      // const { autosiae, type} = this
    }
    
  },
  created(){
    this.$on('inputSksect', this.sksect);
  }
}
</script>

<style lang="scss">
.ks-input {
  width: 100%;
  position: relative;
  font-size: 14px;
  display: inline-block;
  .ks-input__inner {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: none;
    padding: 0 15px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;

    &:focus {
      outline: none;
      border-color: #409eff;
    }
    &.is-disabled {
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #c0c4cc;
      cursor: not-allowed;
    }
  }
}

.ks-input--suffix {
  .ks-input__inner {
    padding-right: 30px;
  }
  .ks-input__suffix {
    position: absolute;
    height: 100%;
    right: 10px;
    top: 0;
    line-height: 40px;
    text-align: center;
    color: #c0c4cc;
    transition: all .3s;
    z-index: 900;
    i {
      color: #c0c4cc;
      font-size: 14px;
      cursor: pointer;
      transition: color .2s cubic-bezier(.645,.045,.355,1);
    }
    .ks-icon-view-active {
      color: blue;
    }
  }

}
</style>
