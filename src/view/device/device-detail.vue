<template>
  <div>
    <device-info-form
      :deviceInfo="device"
      :parentCancelBtnClick="() =>{}"
      :parentConfirmBtnClick="() => {}"
    >
    </device-info-form>
  </div>
</template>

<script>
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
  methods: {},
  watch: {},
  created () {}
}
</script>
