import Vue from 'vue'
import App from './App.vue'
import KsButton from './components/button.vue'
import KsDialog from './components/dialog.vue'
import KsInput from './components/input.vue'
Vue.config.productionTip = false
import "./assets/font.scss"

Vue.component(KsButton.name, KsButton)
Vue.component(KsDialog.name, KsDialog)
Vue.component(KsInput.name, KsInput)

new Vue({
  render: h => h(App)
}).$mount('#app')
