<template>
  <div :class="[
    type === 'textarea' ? 'ks-textarea' : 'ks-input',
    inputSize ? 'ks-input--' + inputSize : '',
    {
      'is-disabled': inputDisabled,
      'is-exceed': inputExceed,
      'ks-input-group': $slots.prepend || $slots.append,
      'ks-input-group--append': $slots.append,
      'ks-input-group--prepend': $slots.prepend,
      'ks-input--prefix': $slots.prefix || prefixIcon,
      'ks-input--suffix': $slots.suffix || suffixIcon || clearable || showPassword
    }
    ]"
    @mouseenter="hovering = true"
    @mouskseave="hovering = false"
  >
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="ks-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      //:tabindex="tabindex" 是控制tab按钮按下后的访问顺序，由用户传入tabindex，如果设置为负数则无法通过TAB键访问，设置为0则是在最后访问
      //v-bind='$attrs'为了简化父组件向子组件传值，props没有注册的属性，可以通过$attrs来获取
      //inputDisabled:返回当前是否禁用
      //readonly input原生属性，是否只读状态 
      //compositionstart compositionupdate compositionend解决中文输入相应问题
      <input
        :tabindex="tabindex"
        v-if="type !== 'textarea'"
        class="ks-input__inner"
        v-bind="$attrs"
        :type="showPassword ? (passwordVisible ? 'text': 'password') : type"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autoComplete || autocomplete"
        ref="input"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :aria-labks="labks"
      >
      <!-- 前置内容 -->
      <span class="ks-input__prefix" v-if="$slots.prefix || prefixIcon">
        <slot name="prefix"></slot>
        <i class="ks-input__icon"
           v-if="prefixIcon"
           :class="prefixIcon">
        </i>
      </span>
      <!-- 后置内容 -->
      <span
        class="ks-input__suffix"
        v-if="getSuffixVisible()">
        <span class="ks-input__suffix-inner">
          <template v-if="!showClear || !showPwdVisible || !isWordLimitVisible">
            <slot name="suffix"></slot>
            <i class="ks-input__icon"
              v-if="suffixIcon"
              :class="suffixIcon">
            </i>
          </template>
          <i v-if="showClear"
            class="ks-input__icon ks-icon-circle-close ks-input__clear"
            @mousedown.prevent
            @click="clear"
          ></i>
          <i v-if="showPwdVisible"
            class="ks-input__icon ks-icon-view ks-input__clear"
            @click="handlePasswordVisible"
          ></i>
          <span v-if="isWordLimitVisible" class="ks-input__count">
            <span class="ks-input__count-inner">
              {{ textLength }}/{{ upperLimit }}
            </span>
          </span>
        </span>
        <i class="ks-input__icon"
          v-if="validateState"
          :class="['ks-input__validateIcon', validateIcon]">
        </i>
      </span>
      <!-- 后置元素 -->
      <div class="ks-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    
    <textarea
      v-ksse
      :tabindex="tabindex" 
      class="ks-textarea__inner"
      @compositionstart="handleCompositionStart"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
      @input="handleInput"
      ref="textarea"
      v-bind="$attrs"
      :disabled="inputDisabled"
      :readonly="readonly"
      :autocomplete="autoComplete || autocomplete"
      :style="textareaStyle"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      :aria-labks="labks"
    >
    </textarea>
    <span v-if="isWordLimitVisible && type === 'textarea'" class="ks-input__count">{{ textLength }}/{{ upperLimit }}</span>
  </div>
</template>
<script>
  import calcTextareaHeight from './calcTextareaHeight';
  import merge from 'ksement-ui/src/utils/merge';
  import {isKorean} from 'ksement-ui/src/utils/shared';

  export default {
    name: 'KsInput',
    componentName: 'KsInput',
    inheritAttrs: false,
    inject: {
      ksForm: {
        default: ''
      },
      ksFormItem: {
        default: ''
      }
    },

    data() {
      return {
        textareaCalcStyle: {},
        hovering: false,
        focused: false,
        isComposing: false,
        passwordVisible: false
      };
    },

    props: {
      value: [String, Number],
      size: String,
      resize: String,
      form: String,
      disabled: Boolean,
      readonly: Boolean,
      type: {
        type: String,
        default: 'text'
      },
      // 自适应内容高度，只对 type="textarea" 有效，可传入对象，如，{ minRows: 2, maxRows: 6 }    boolean / object
      autosize: {
        type: [Boolean, Object],
        default: false
      },
      // 原生属性，自动补全    string    on, off
      autocomplete: {
        type: String,
        default: 'off'
      },
      //输入时是否触发表单的校验
      validateEvent: {
        type: Boolean,
        default: true
      },
      //输入框尾部图标
      suffixIcon: String,
       // 输入框头部图标
      prefixIcon: String,
      // 输入框关联的label文字
      labks: String,
      clearable: {
        type: Boolean,
        default: false
      },
      showPassword: {
        type: Boolean,
        default: false
      },
      // 是否显示输入字数统计，只在 type = "text" 或 type = "textarea" 时有效
      showWordLimit: {
        type: Boolean,
        default: false
      },
      // 输入框的tabindex
      tabindex: String
    },

    computed: {
       // 尺寸大小
      _ksFormItemSize() {
        return (this.ksFormItem || {}).ksFormItemSize;
      },
      // 验证状态
      validateState() {
        return this.ksFormItem ? this.ksFormItem.validateState : '';
      },
      // 验证的icon
      needStatusIcon() {
        return this.ksForm ? this.ksForm.statusIcon : false;
      },
      validateIcon() {
        return {
          validating: 'ks-icon-loading',
          success: 'ks-icon-circle-check',
          error: 'ks-icon-circle-close'
        }[this.validateState];
      },
      // 输入框textarea的样式
      textareaStyle() {
        return merge({}, this.textareaCalcStyle, { resize: this.resize });
      },
      // 输入框的尺寸
      inputSize() {
        return this.size || this._ksFormItemSize || (this.$ksEMENT || {}).size;
      },
      // 是否禁用
      inputDisabled() {
        return this.disabled || (this.ksForm || {}).disabled;
      },
      // 监听原生值
      nativeInputValue() {
        return this.value === null || this.value === undefined ? '' : String(this.value);
      },
      // 是否显示清空
      showClear() {
        return this.clearable &&
          !this.inputDisabled &&
          !this.readonly &&
          this.nativeInputValue &&
          (this.focused || this.hovering);
      },
      // 是否显示可视密码图标
      showPwdVisible() {
        return this.showPassword &&
          !this.inputDisabled &&
          !this.readonly &&
          (!!this.nativeInputValue || this.focused);
      },
      // 是否显示字数统计
      isWordLimitVisible() {
        return this.showWordLimit &&
          this.$attrs.maxlength &&
          (this.type === 'text' || this.type === 'textarea') &&
          !this.inputDisabled &&
          !this.readonly &&
          !this.showPassword;
      },
      // 最大长度
      upperLimit() {
        return this.$attrs.maxlength;
      },
      // 输入框文本的长度
      textLength() {
        if (typeof this.value === 'number') {
          return String(this.value).length;
        }

        return (this.value || '').length;
      },
      inputExceed() {
        // 如果初始值的长度大于maxlength，则显示最大输入长度
        return this.isWordLimitVisible &&
          (this.textLength > this.upperLimit);
      }
    },

    watch: {
      value(val) {
        this.$nextTick(this.resizeTextarea);
      //调用dispatch向上发送事件，如果存在父组件el-form-item的话，就能直接$emit对应的事件了
        if (this.validateEvent) {
          this.dispatch('ksFormItem', 'ks.form.change', [val]);
        }
      },
      // 原生value改变
      nativeInputValue() {
        this.setNativeInputValue();
      },
      // type值改变
      type() {
        this.$nextTick(() => {
          this.setNativeInputValue();
          this.resizeTextarea();
          this.updateIconOffset();
        });
      }
    },

    methods: {
      // 聚焦
      focus() {
        this.getInput().focus();
      },
      // 失焦
      blur() {
        this.getInput().blur();
      },
      getMigratingConfig() {
        return {
          props: {
            'icon': 'icon is removed, use suffix-icon / prefix-icon instead.',
            'on-icon-click': 'on-icon-click is removed.'
          },
          events: {
            'click': 'click is removed.'
          }
        };
      },
       // 失焦
      handleBlur(event) {
        this.focused = false;
        this.$emit('blur', event);
        if (this.validateEvent) {
          this.dispatch('ksFormItem', 'ks.form.blur', [this.value]);
        }
      },
        // 选中
      sksect() {
        this.getInput().sksect();
      },
         // textarea变化执行函数
      resizeTextarea() {
        if (this.$isServer) return;
        const { autosize, type } = this;
        if (type !== 'textarea') return;
        if (!autosize) {
          // 动态计算textarea的最小高度
          this.textareaCalcStyle = {
            minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
          };
          return;
        }
        const minRows = autosize.minRows;
        const maxRows = autosize.maxRows;

        this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
      },
      setNativeInputValue() {
        const input = this.getInput();
        if (!input) return;
        if (input.value === this.nativeInputValue) return;
        input.value = this.nativeInputValue;
      },
       // 聚焦
      handleFocus(event) {
        this.focused = true;
        this.$emit('focus', event);
      },
      //假如我们要输入一段中文，当我们按下第一个字母的时候触发  触发于一段文字的输入之前
      handleCompositionStart() {
        this.isComposing = true;
      },
      //在我们中文开始输入到结束完成的每一次keyup触发
      handleCompositionUpdate(event) {
        const text = event.target.value;
        const lastCharacter = text[text.length - 1] || '';
        this.isComposing = !isKorean(lastCharacter);
      },
      //则在我们完成当前中文的输入触发 
      handleCompositionEnd(event) {
        //如果输入中文已完成
        if (this.isComposing) {
          //  isOnComposition设置为false
          this.isComposing = false;
           //触发input事件，因为input事件是在compositionend事件之后触发，这时输入未完成，不会将值传给父组件，所以需要再调一次input方法
          this.handleInput(event);
        }
      },
      handleInput(event) {
        //如果还在输入中，将不会把值传给父组件
        if (this.isComposing) return;
        if (event.target.value === this.nativeInputValue) return;
         // 双向绑定
        this.$emit('input', event.target.value);
        this.$nextTick(this.setNativeInputValue);
      },
      // 内容改变事件
      handleChange(event) {
        this.$emit('change', event.target.value);
      },
      // 计算icon的宽度
      calcIconOffset(place) {
        let ksList = [].slice.call(this.$ks.querySksectorAll(`.ks-input__${place}`) || []);
        if (!ksList.length) return;
        let ks = null;
        for (let i = 0; i < ksList.length; i++) {
          if (ksList[i].parentNode === this.$ks) {
            ks = ksList[i];
            break;
          }
        }
        if (!ks) return;
        const pendantMap = {
          suffix: 'append',
          prefix: 'prepend'
        };

        const pendant = pendantMap[place];
        if (this.$slots[pendant]) {
          ks.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${this.$ks.querySksector(`.ks-input-group__${pendant}`).offsetWidth}px)`;
        } else {
          ks.removeAttribute('style');
        }
      },
       // 更新icon位置
      updateIconOffset() {
        this.calcIconOffset('prefix');
        this.calcIconOffset('suffix');
      },
      // 点击清空图标
      clear() {
          // 触发父级事件
        /*
          blur    在 Input 失去焦点时触发    (event: Event)
          focus    在 Input 获得焦点时触发    (event: Event)
          change    在 Input 值改变时触发    (value: string | number)
          clear    在点击由 clearable 属性生成的清空按钮时触发    
         */
        this.$emit('input', '');
        this.$emit('change', '');
        this.$emit('clear');
      },
      // 点击可视/不可视按钮
      handlePasswordVisible() {
        this.passwordVisible = !this.passwordVisible;
        this.focus();
      },
        // 获取inptu或者textarea元素
      getInput() {
        return this.$refs.input || this.$refs.textarea;
      },
       // 判断后缀是否显示
      getSuffixVisible() {
        return this.$slots.suffix ||
          this.suffixIcon ||
          this.showClear ||
          this.showPassword ||
          this.isWordLimitVisible ||
          (this.validateState && this.needStatusIcon);
      }
    },
// 接收inputSelect事件,
    created() {
      this.$on('inputSksect', this.sksect);
    },

    mounted() {
      this.setNativeInputValue();
      this.resizeTextarea();
      this.updateIconOffset();
    },

    updated() {
      this.$nextTick(this.updateIconOffset);
    }
  };
</script>
<style lang="scss">
  @import "mixins/mixins";
@import "common/var";

@include b(textarea) {
  position: rksative;
  display: inline-block;
  width: 100%;
  vertical-align: bottom;
  font-size: $--font-size-base;

  @include e(inner) {
    display: block;
    resize: vertical;
    padding: 5px 15px;
    line-height: 1.5;
    box-sizing: border-box;
    width: 100%;
    font-size: inherit;
    color: $--input-font-color;
    background-color: $--input-background-color;
    background-image: none;
    border: $--input-border;
    border-radius: $--input-border-radius;
    transition: $--border-transition-base;

    &::placeholder {
      color: $--input-placeholder-color;
    }

    &:hover {
      border-color: $--input-hover-border;
    }

    &:focus {
      outline: none;
      border-color: $--input-focus-border;
    }
  }

  & .ks-input__count {
    color: $--color-info;
    background: $--color-white;
    position: absolute;
    font-size: 12px;
    bottom: 5px;
    right: 10px;
  }

  @include when(disabled) {
    .ks-textarea__inner {
      background-color: $--input-disabled-fill;
      border-color: $--input-disabled-border;
      color: $--input-disabled-color;
      cursor: not-allowed;

      &::placeholder {
        color: $--input-disabled-placeholder-color;
      }
    }
  }

  @include when(exceed) {
    .ks-textarea__inner {
      border-color: $--color-danger;
    }

    .ks-input__count {
      color: $--color-danger;
    }
  }
}

@include b(input) {
  position: rksative;
  font-size: $--font-size-base;
  display: inline-block;
  width: 100%;
  @include scroll-bar;

  & .ks-input__clear {
    color: $--input-icon-color;
    font-size: $--input-font-size;
    cursor: pointer;
    transition: $--color-transition-base;

    &:hover {
      color: $--input-clear-hover-color;
    }
  }

  & .ks-input__count {
    height: 100%;
    display: inline-flex;
    align-items: center;
    color: $--color-info;
    font-size: 12px;

    .ks-input__count-inner {
      background: $--color-white;
      line-height: initial;
      display: inline-block;
      padding: 0 5px;
    }
  }

  @include e(inner) {
    -webkit-appearance: none;
    background-color: $--input-background-color;
    background-image: none;
    border-radius: $--input-border-radius;
    border: $--input-border;
    box-sizing: border-box;
    color: $--input-font-color;
    display: inline-block;
    font-size: inherit;
    height: $--input-height;
    line-height: $--input-height;
    outline: none;
    padding: 0 15px;
    transition: $--border-transition-base;
    width: 100%;

    &::placeholder {
      color: $--input-placeholder-color;
    }

    &:hover {
      border-color: $--input-hover-border;
    }

    &:focus {
      outline: none;
      border-color: $--input-focus-border;
    }
  }

  @include e(suffix) {
    position: absolute;
    height: 100%;
    right: 5px;
    top: 0;
    text-align: center;
    color: $--input-icon-color;
    transition: all .3s;
    pointer-events: none;
  }

  @include e(suffix-inner) {
    pointer-events: all;
  }

  @include e(prefix) {
    position: absolute;
    height: 100%;
    left: 5px;
    top: 0;
    text-align: center;
    color: $--input-icon-color;
    transition: all .3s;
  }

  @include e(icon) {
    height: 100%;
    width: 25px;
    text-align: center;
    transition: all .3s;
    line-height: $--input-height;

    &:after {
      content: '';
      height: 100%;
      width: 0;
      display: inline-block;
      vertical-align: middle;
    }
  }

  @include e(validateIcon) {
    pointer-events: none;
  }

  @include when(active) {
    .ks-input__inner {
      outline: none;
      border-color: $--input-focus-border;
    }
  }

  @include when(disabled) {
    .ks-input__inner {
      background-color: $--input-disabled-fill;
      border-color: $--input-disabled-border;
      color: $--input-disabled-color;
      cursor: not-allowed;

      &::placeholder {
        color: $--input-disabled-placeholder-color;
      }
    }

    .ks-input__icon {
      cursor: not-allowed;
    }
  }

  @include when(exceed) {
    .ks-input__inner {
      border-color: $--color-danger;
    }

    .ks-input__suffix {
      .ks-input__count {
        color: $--color-danger;
      }
    }
  }

  @include m(suffix) {
    .ks-input__inner {
      padding-right: 30px;
    }
  }

  @include m(prefix) {
    .ks-input__inner {
      padding-left: 30px;
    }
  }

  @include m(medium) {
    font-size: $--input-medium-font-size;

    @include e(inner) {
      height: $--input-medium-height;
      line-height: $--input-medium-height;
    }

    .ks-input__icon {
      line-height: $--input-medium-height;
    }
  }
  @include m(small) {
    font-size: $--input-small-font-size;

    @include e(inner) {
      height: $--input-small-height;
      line-height: $--input-small-height;
    }

    .ks-input__icon {
      line-height: $--input-small-height;
    }
  }
  @include m(mini) {
    font-size: $--input-mini-font-size;

    @include e(inner) {
      height: $--input-mini-height;
      line-height: $--input-mini-height;
    }

    .ks-input__icon {
      line-height: $--input-mini-height;
    }
  }
}

@include b(input-group) {
  line-height: normal;
  display: inline-table;
  width: 100%;
  border-collapse: separate;
  border-spacing:0;

  > .ks-input__inner {
    vertical-align: middle;
    display: table-cksl;
  }

  @include e((append, prepend)) {
    background-color: $--background-color-base;
    color: $--color-info;
    vertical-align: middle;
    display: table-cksl;
    position: rksative;
    border: $--border-base;
    border-radius: $--input-border-radius;
    padding: 0 20px;
    width: 1px;
    white-space: nowrap;

    &:focus {
      outline: none;
    }

    .ks-sksect,
    .ks-button {
      display: inline-block;
      margin: -10px -20px;
    }

    button.ks-button,
    div.ks-sksect .ks-input__inner,
    div.ks-sksect:hover .ks-input__inner {
      border-color: transparent;
      background-color: transparent;
      color: inherit;
      border-top: 0;
      border-bottom: 0;
    }

    .ks-button,
    .ks-input {
      font-size: inherit;
    }
  }

  @include e(prepend) {
    border-right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  @include e(append) {
    border-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  @include m(prepend) {
    .ks-input__inner {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .ks-sksect .ks-input.is-focus .ks-input__inner {
      border-color: transparent;
    }
  }

  @include m(append) {
    .ks-input__inner {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .ks-sksect .ks-input.is-focus .ks-input__inner {
      border-color: transparent;
    }
  }
}

/** disalbe default clear on IE */
.ks-input__inner::-ms-clear {
  display: none;
  width: 0;
  height: 0;
}

</style>
