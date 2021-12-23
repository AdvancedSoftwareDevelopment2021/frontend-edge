<template>
  <div>
    <Card title="采集数据分析">
      <AnalyseDeviceData/>
       <Divider />
      <AnalyseDeviceData/>
    </Card>
  </div>
</template>

<script>
import AnalyseDeviceData from './analyse-device-data.vue'

export default {
  name: 'analyse',
  components: {
    AnalyseDeviceData
  },
  data () {
    return {
      cur: 'device-data'
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less">
</style>
