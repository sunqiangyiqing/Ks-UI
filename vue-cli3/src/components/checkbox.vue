<template>
    <label class="ks-checkbox" :class="{'is-checked':isChecked}">
        <span class="ks-checkbox__input">
           <span class="ks-checkbox__inner"></span>
           <input 
             type="text"
             class="ks-check__label"
             :name="name"
             v-model="model"
             :value="label"
           >
        </span>
        <span class="ks-checkbox__lable">
             <slot></slot>
             <template v-if="!$slot.default">{{label}}</template>
        </span>
    </label>
</template>

<script>
// import { Label } from '../../../ant-design-pro/node_modules/bizcharts/typings'
export default {
  name:'KsCheckbox',
  inject:{
    CheckboxGroup:{
        default:''
    }
  },
  computed: {
      
  },
  props:{
      value:{
          type:Boolean,
          default:false
      },
      name:{
          type:String,
          default:''
      },
      label:{
          type:String,
          default:''
      }

  }
}
</script>

<style lang="scss">
    .ks-checkbox {
  color: #606266;
  font-weight: 500;
  font-size: 14px;
  position: relative;
  cursor: pointer;
  display: inline-block;
  white-space: nowrap;
  user-select: none;
  margin-right: 30px;
  .ks-checkbox__input {
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    line-height: 1;
    position: relative;
    vertical-align: middle;
    .ks-checkbox__inner {
      display: inline-block;
      position: relative;
      border: 1px solid #dcdfe6;
      border-radius: 2px;
      box-sizing: border-box;
      width: 14px;
      height: 14px;
      background-color: #fff;
      z-index: 1;
      transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
      &:after {
        box-sizing: content-box;
        content: "";
        border: 1px solid #fff;
        border-left: 0;
        border-top: 0;
        height: 7px;
        left: 4px;
        position: absolute;
        top: 1px;
        transform: rotate(45deg) scaleY(0);
        width: 3px;
        transition: transform .15s ease-in .05s;
        transform-origin: center;
      }
    }
    .ks-checkbox__original {
      opacity: 0;
      outline: none;
      position: absolute;
      left: 10px;
      margin: 0;
      width: 0;
      height: 0;
      z-index: -1;
    }
  }
  .ks-checkbox__label {
    display: inline-block;
    padding-left: 10px;
    line-height: 19px;
    font-size: 14px;
  }
}
.ks-checkbox.is-checked {
  .ks-checkbox__input {
    .ks-checkbox__inner {
      background-color: #409eff;
      border-color: #409eff;
      &:after {
        transform: rotate(45deg) scaleY(1);
      }
    }
  }
  .ks-checkbox__label {
    color: #409eff;
  }
}
</style>