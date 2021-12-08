<template>
  <div>
    <Button type="primary" @click="addDeviceBtnClick" icon="md-add-circle">
      新增设备
    </Button>
    <Modal v-model="modalControl" title="新增设备" footer-hide :closable="false">
      <device-info-form
        :deviceInfo="deviceInfo"
        :parentCancelBtnClick="modalCancelBtnClick"
        :parentConfirmBtnClick="modalConfirmBtnClick"
      >
      </device-info-form>
    </Modal>
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
import deviceInfoForm from '_c/device-info-form'
export default {
  name: 'addDevice',
  components: {
    deviceInfoForm
  },
  props: {
    deviceInfo: {
      type: Object
    }
  },
  data () {
    return {
      modalControl: false
    }
  },
  computed: {},
  methods: {
    ...mapMutations(['resetFormItem', 'modeChange']),
    ...mapActions(['addDeviceAction']),
    async modalConfirmBtnClick (newDevice) {
      await new Promise((resolve) => {
        this.addDeviceAction(newDevice)
        setTimeout(() => {
          this.modalControl = false
          this.resetFormItem()
          resolve()
        }, 1000)
      })
      // console.log("AddDevice ConfirmBtnClick")
    },
    modalCancelBtnClick () {
      this.modalControl = false
      this.resetFormItem()
      // console.log("AddDevice cancelBtnClick")
    },
    addDeviceBtnClick () {
      this.modalControl = true
      this.modeChange('ADD')
    }
  }
}
</script>
