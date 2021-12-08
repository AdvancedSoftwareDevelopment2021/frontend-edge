<template>
  <div>
    <Collapse v-model="collapseValue" accordion>
      <Panel
        v-for="sensorHistoryDataList in allHistoryDataList"
        :key="sensorHistoryDataList.sensorName"
        :name="sensorHistoryDataList.sensorName"
      >
        {{ sensorHistoryDataList.sensorName }}
        <p slot="content">
          <Table :columns="tableCols" :data="sensorHistoryDataList.historyDataList"></Table>
        </p>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'deviceHistoryData',
  data () {
    return {
      collapseValue: '',
      tableCols: [
        {
          title: 'timestamp',
          key: 'timestamp',
          width: 200
        },
        {
          title: 'data',
          key: 'data'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      allHistoryDataList: (state) => state.sensor.allHistoryDataList,
      deviceItem: (state) => state.device.deviceInfoForHistory
    })
  },
  methods: {
    ...mapMutations(['releaseSensorAllHistoryData']),
    ...mapActions(['getSensorAllHistoryDataAction']),
    refresh () {
      for (let { name, sensorId } of this.deviceItem.values) {
        this.getSensorAllHistoryDataAction({
          deviceId: this.deviceItem.id,
          sensorId,
          sensorName: name
        })
      }
    }
  },
  watch: {},
  mounted () {
    this.refresh()
  }
}
</script>
