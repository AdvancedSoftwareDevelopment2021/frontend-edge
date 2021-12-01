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
  props: {
    device: {
      type: Object
    }
  },
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
      allHistoryDataList: (state) => state.sensor.allHistoryDataList
    })
  },
  methods: {
    ...mapMutations(['releaseSensorAllHistoryData']),
    ...mapActions(['getSensorAllHistoryDataAction'])
  },
  watch: {},
  mounted () {
    console.log(this.allHistoryDataList)
  },
  async created () {
    for (let { name, sensorId } of this.device.values) {
      await this.getSensorAllHistoryDataAction({
        deviceId: this.device.id,
        sensorId,
        sensorName: name
      })
    }
  },
  destroyed () {
    this.releaseSensorAllHistoryData()
    console.log('Release history data')
  }
}
</script>
