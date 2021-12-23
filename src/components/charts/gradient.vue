<template>
  <div ref="dom" class="charts chart-gradient"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartGradient',
  props: {
    value: Array,
    text: String,
    subtext: String
  },
  watch: {
    value: {
      handler (data) {
        this.value = data
        this.init()
      },
      deep: true, // 深度监听
      immediate: true
    },
    text: {
      handler (data) {
        this.text = data
        this.init()
      },
      deep: true, // 深度监听
      immediate: true // 初次监听即执行
    }
  },
  data () {
    return {
      dom: null
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  },
  methods: {
    init () {
      const dateList = this.value.map(function (item) {
        return item[0]
      })
      const valueList = this.value.map(function (item) {
        return item[1]
      })
      this.$nextTick(() => {
        let option = {
          visualMap: [
            {
              show: false,
              type: 'continuous',
              seriesIndex: 1,
              dimension: 0,
              min: 0,
              max: dateList.length - 1
            }
          ],
          title: [
            {
              left: 'center',
              text: this.text
            }
          ],
          tooltip: {
            trigger: 'axis'
          },
          xAxis: [
            {
              data: dateList
            }
          ],
          yAxis: [
            {}
          ],
          grid: [
            {
              bottom: '10%',
              right: '10%'
            }
          ],
          series: [
            {
              type: 'line',
              showSymbol: false,
              data: valueList
            }
          ]
        }
        this.dom = echarts.init(this.$refs.dom, 'tdTheme')
        this.dom.setOption(option)
        on(window, 'resize', this.resize)
      })
    }
  }
}
</script>
