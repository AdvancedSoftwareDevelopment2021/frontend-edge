<template>
  <div>
    <Select v-model="device" style="width:200px" placeholder="请选择设备">
      <Option v-for="item in deviceList" :value="item.name" :key="item.id">
        {{ item.name }}
      </Option>
    </Select>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
// import echarts from 'echarts'

export default {
  name: 'analyse-device-status',
  data () {
    return {
      device: ''
    }
  },
  computed: {
    ...mapState({
      deviceList: (state) => state.device.deviceList
    })
  },
  mounted () {
    this.getDeviceListAction()
  },
  methods: {
    ...mapActions([
      'getDeviceListAction'

    ])
  }
}
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
