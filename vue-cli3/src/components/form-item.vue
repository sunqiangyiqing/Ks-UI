<template>
  <div>
      <label-wrap>
          <label for="">
              <slot></slot>
          </label>
      </label-wrap>
      <div>
         <slot></slot> 
         <transition>
             <slot>
                <div>
                    
                </div>    
             </slot> 
         </transition>
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>