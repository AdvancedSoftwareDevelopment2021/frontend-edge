<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartPie',
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
  methods: {
    resize () {
      this.dom.resize()
    },
    init() {
      this.$nextTick(() => {
        let legend = this.value.map(_ => _.name)
        let option = {
          title: {
            text: this.text,
            subtext: this.subtext,
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: legend
          },
          series: [
            {
              type: 'pie',
              radius: '60%',
              center: ['50%', '55%'],
              data: this.value,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        this.dom = echarts.init(this.$refs.dom, 'tdTheme')
        this.dom.setOption(option)
        on(window, 'resize', this.resize)
      })
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
