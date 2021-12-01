<template>
  <div>
    <device-info-form
      :deviceInfo="device"
      :parentCancelBtnClick="cancelBtnClick"
      :parentConfirmBtnClick="confirmBtnClick"
    >
    </device-info-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import deviceInfoForm from '_c/device-info-form'
export default {
  name: 'deviceDetail',
  props: {
    device: {
      type: Object
    }
  },
  components: {
    deviceInfoForm
  },
  data () {
    return {}
  },
  computed: {},
  methods: {
    ...mapActions(['addSensorAction']),
    cancelBtnClick () {
      this.$router.go(-1)
    },
    async confirmBtnClick (bindingList) {
      console.log(bindingList)
      for (let { deviceId, sensor } of bindingList) {
        await this.addSensorAction({ deviceId, newSensor: sensor })
      }
      // bindingList.forEach(({ deviceId, sensor }) => {
      //   this.addSensorAction({ deviceId, sensor })
      // });
      this.$router.go(-1)
    }
  },
  watch: {},
  created () {}
}
</script>
