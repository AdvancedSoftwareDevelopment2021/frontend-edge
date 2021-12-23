<template>
  <div>
    <Card title="历史状态分析">
      <Select v-model="deviceId" @on-change="handleDevice" style="width:200px;margin-right:20px" placeholder="请选择设备">
        <Option v-for="item in deviceList" :value="item.id" :key="item.id">
          {{ item.name }}
        </Option>
      </Select>
      <Select v-model="sensorId" @on-change="handleSensor" style="width:200px;margin-right:20px" placeholder="请选择传感器">
        <Option v-for="item in sensorList" :value="item.id" :key="item.id">
          {{ item.name }}
        </Option>
      </Select>
    </Card>
    <Card shadow style="margin-top:20px">
      <chart-gradient
        style="height:600px"
        :value="dataSource"
        :text="getChartName()"
      />
    </Card>
  </div>
</template>

<script>
import { ChartPie, ChartBar, ChartGradient } from '_c/charts'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'analyse',
  components: {
    ChartPie,
    ChartBar,
    ChartGradient
  },
  data () {
    return {
      deviceId: '',
      sensorId: '',
      dataSource: []
    }
  },
  computed: {
    ...mapState({
      deviceList: (state) => state.device.deviceList,
      sensorList: (state) => state.sensor.sensorList,
      sensorHistoryData: (state) => state.sensor.sensorHistoryData
    })
  },
  mounted () {
    this.getDeviceListAction()
  },
  methods: {
    ...mapActions([
      'getDeviceListAction',
      'getSensorListAction',
      'getSensorHistoryDataAction'
    ]),
    getChartName () {
      let sensors = this.sensorList.filter(item => item.id === this.sensorId)
      if (sensors && sensors.length > 0) {
        return sensors[0].name + '传感器历史状态图'
      } else {
        return '传感器历史状态图'
      }
    },
    handleDevice () {
      this.getSensorListAction({ deviceId: this.deviceId })
    },
    async handleSensor () {
      if (this.sensorId === '') return
      let sensor = this.sensorList.filter(item => item.id === this.sensorId)[0]
      await this.getSensorHistoryDataAction({ deviceId: this.deviceId, sensorName: sensor.name })
      this.dataSource = this.sensorHistoryData.map((item) => {
        return [item.timestamp, item.data]
      })
    }
  }
}
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
