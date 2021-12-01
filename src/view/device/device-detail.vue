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
      // TODO: 现在每次submit后会返面设备管理页面，然后设备管理页面会重新从数据库中请求数据
      this.$router.go(-1)
    }
  },
  watch: {},
  created () {}
}
</script>
