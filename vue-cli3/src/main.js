import Vue from 'vue'
import App from './App.vue'
import KsButton from './components/button.vue'
import KsDialog from './components/dialog.vue'
import KsInput from './components/input.vue'
import KsSwitch from './components/switch.vue'
import KsRadio from './components/radio.vue'
import KsInputgroup from './components/input-group.vue'
// import ElForm from './components/form.vue'
Vue.config.productionTip = false
import "./assets/font.scss"
import ref from "vue-ref"

Vue.component(KsButton.name, KsButton)
Vue.component(KsDialog.name, KsDialog)
Vue.component(KsInput.name, KsInput)
Vue.component(KsSwitch.name, KsSwitch)
Vue.component(KsRadio.name, KsRadio)
Vue.component(KsInputgroup.name, KsInputgroup)
// Vue.component(ElForm.name, ElForm)
Vue.use(ref, { name: "ant-ref" });

new Vue({
  render: h => h(App)
}).$mount('#app')
