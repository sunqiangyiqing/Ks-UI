<template>
  <form class="el-form" :class="[
    lablePosition ? 'el-form--lable-' + lablePosition : '',
  ]">
      <slot></slot>
  </form>
</template>
 
<script>
import objectAssign from '../../src/utils/merge';
export default {
  name:'ElForm',
  componentName:'ElForm',
  //注入组件实例
  provide(){
      return{
          elForm:this
      }
  },
  props:{
      //表单数据对象
     model:Object,
     //表单验证规则
     rules:Object,
     //表单标签域的位置，如果值为left或者right时，则需设置label-width
     labelPosition:String,
     // 表单域标签的宽度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。支持 auto。
     labelWidth:String,
      // 表单域标签的后缀
     labelSuffix:{
         type:String,
         default:''
     },
     // 用于控制该表单内组件的尺寸
     size:String,
      // 是否禁用该表单内的所有组件。若设置为 true，则表单内组件上的 disabled 属性不再生效
     disabled:Boolean,
      // 是否在 rules 属性改变后立即触发一次验证
     validateOnRuleChange:{
         type:Boolean,
         default: true
     },
     // 是否显示必填字段的标签旁边的红色星号
     hideRequiredAsterisk:{
         type:Boolean,
         default:false
     },
     inline:Boolean,
    // 是否以行内形式展示校验信息
     inlineMessage:Boolean,
      // 是否在输入框中显示校验结果反馈图标
     statusIcon:Boolean,
     // 是否显示校验错误信息
     showMessage:{
         type:Boolean,
         default:true
     }
  },
  watch: {
      //表单验证规则
      rules(){
          this.fields.forEach(field=>{
            field.removeValidateEvents();
            field.addValidateEvents();
          });

          if(this.validateOnRuleChange){
              this.validate(()=>{});
          }
      }
  },
  computed: {
      //设置表单标签域的宽度
       autoLabelWidth() {
        if (!this.potentialLabelWidthArr.length) return 0;
        const max = Math.max(...this.potentialLabelWidthArr);
        return max ? `${max}px` : '';
      }
  },
  data() {
      return {
          fields:[],
          //使用此数组计算自使用宽度
          potentialLabelWidthArr:[]
      }
  },
  created() {
          // 接收子组件添加rule验证事件,监听el.form.addField事件，触发；将form-item实例push到fields
      this.$on('el.form.addField', (field)=>{
          if(field.prop){
              this.fields.push(field);
          }
      });
         //删除事件监听，监听el.form.addField事件，触发；将form-item实例有prop规则属性从fields移除form-item实例
      this.$on('el.form.removeField', (field)=>{
          if(field.prop){
              this.fields.splice(this.fields.indexOf(field),1);
          }
      });
  },

  methods: {
      //重置验证 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      resetField(){
          if(!this.model){
              console.warn("逗逼");
              return;
          }
          this.fields.forEach(field =>{
              //每一项都重置
              field.resetField();
          });
      },
      //关闭验证 移除表单项的校验结果。传入待移除的表单项的 prop 属性或者 prop 组成的数组，如不传则移除整个表单的校验结果
      clearValidate(props = []){
          const fields = props.length ? (typeof props === 'string' ? this.fields.filter(field => props === field.prop) : this.fields.filter(field => props.indexOf(field.prop) > -1)) : this.fields;
          fields.forEach(field =>{
              //每一项都清除验证
              field.clearValidate();
          })
      },
      //表单验证 对整个表单进行校验的方法，参数为一个回调函数。
      //该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。
      //若不传入回调函数，则会返回一个 promise
      validate(callback) {
        //如果没有表单数据，则抛出警告
        if (!this.model) {
          console.warn('222');
          return;
        }

        let promise;
        // 如果callback 则返回promise
        if (typeof callback !== 'function' && window.Promise) {
          promise = new window.Promise((resolve, reject) => {
            callback = function(valid) {
              valid ? resolve(valid) : reject(valid);
            };
          });
        }

        let valid = true;
        let count = 0;
        // 如果需要验证的fields为空，调用验证时立刻返回callback
        if (this.fields.length === 0 && callback) {
          callback(true);
        }
        let invalidFields = {};
        //遍历所有实例，一个个验证
        this.fields.forEach(field => {
          field.validate('', (message, field) => {
            //如果有返回信息，则说明验证失败
            if (message) {
              valid = false;
            }
            //将错误对象复制到invalidFields
            invalidFields = objectAssign({}, invalidFields, field);
            if (typeof callback === 'function' && ++count === this.fields.length) {
              callback(valid, invalidFields);
            }
          });
        });

        if (promise) {
          return promise;
        }
      },
      //对部分表单进行验证
      validateField(props, cb){
        props = [].concat(props);
        const fields = this.fields.filter(field => props.indexOf(field.prop) !== -1);
        if(!fields.length){
          console.warn("qusiba")
          return
        }
     //验证对应规则的表单 
        fields.forEach(field=>{
          field.validate("", cb);
        })
      },
      //获取label下标
      getLableWidthIindex(width){
        const index = this.potentialLabelWidthArr.indexOf(width);
        if(index == -1){
          //自定义错误
          throw new Error('[ElementForm]unpected width', width)
        }
        return index
      },
      //重置LabelWidth
      registerLabelWidth(val, oldVal){
         if(val && oldVal){
           const index = this.getLableWidthIindex(oldVal);
           this.potentialLabelWidthArr.splice(index, 1, val);
         }else if(val){
           this.potentialLabelWidthArr.push(val);
         }
      },
      //移除此宽度
      deregisterLabelWidth(val){
          const index = this.getLableWidthIindex(val);
          this.potentialLabelWidthArr.splice(index, 1);
      }
  },
 
}
</script>

<style long="scss">
   
</style>