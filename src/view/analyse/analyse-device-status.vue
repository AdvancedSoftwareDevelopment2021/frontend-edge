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
      <chart-pie
        style="height:600px"
        :value="dataSource"
        :text="getChartName()"
      ></chart-pie>
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
      sensorHistoryStatus: (state) => state.sensor.sensorHistoryStatus
    })
  },
  mounted () {
    this.getDeviceListAction()
    this.resetDatasource()
  },
  methods: {
    ...mapActions([
      'getDeviceListAction',
      'getSensorListAction',
      'getSensorHistoryStatusAction'
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
    resetDatasource () {
      this.dataSource = [
        { name: 'sleeping', value: 0 },
        { name: 'running', value: 0 },
        { name: 'collecting', value: 0 },
        { name: 'success', value: 0 },
        { name: 'failure', value: 0 }
      ]
    },
    async handleSensor () {
      if (!this.sensorId || this.sensorId === '') return
      await this.getSensorHistoryStatusAction({ sensorId: this.sensorId })

      this.resetDatasource()
      let data = this.sensorHistoryStatus
      data.sort(function (a, b) { return a.timestamp < b.timestamp })
      for (let i = 0; i < data.length - 1; i++) {
        var start = new Date(data[i].timestamp).getTime()
        var end = new Date(data[i + 1].timestamp).getTime()
        let item = this.dataSource.filter(item => item.name === data[i].status)[0]
        item.value += end - start
      }
    }
  }
}
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
