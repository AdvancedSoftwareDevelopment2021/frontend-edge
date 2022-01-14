<template>
  <div>
    <div class="containers" style="height: 500px; width: 1000px">
      <!-- <Row>
        <Col span="20"> -->
      <div class="canvas" ref="canvas" />
      <!-- <panel v-if="bpmnModeler" :modeler="bpmnModeler" /> -->
      <div class="toolbar">
        <a title="download">下载</a>
        <a ref="saveDiagram" href="javascript:" title="download BPMN diagram"
          >BPMN</a
        >
        <a ref="saveSvg" href="javascript:" title="download as SVG image"
          >SVG</a
        >
      </div>
      <!-- </Col>
      </Row> -->
      <!-- <Row>
        <Col span="20"> -->
      <Table border :columns="columns" :data="bindingList">
        <template slot-scope="{ row }" slot="taskName">
          <strong>{{ row.taskName }}</strong>
        </template>
        <template slot-scope="{ row }" slot="action">
          <Row>
            <Col span="24">
              <Button
                type="error"
                size="small"
                @click="cancelBindingBtnClick(row)"
              >
                取消绑定
              </Button>
            </Col>
          </Row>
        </template>
      </Table>
    </div>
    <Modal v-model="modal" title="绑定设备" footer-hide :closable="false">
      <Form ref="bindingForm" :model="bindingForm" :label-width="80">
        <FormItem label="设备名称">
          <Row>
            <Col span="20">
              <Select v-model="bindingDevice">
                <Option
                  v-for="item in deviceListWithIdAndName"
                  :value="item"
                  :key="item.id"
                  >{{ item.name }}
                </Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <Row :gutter="8" type="flex" justify="end">
          <Col>
            <Button @click="cancelBtnClick">取消</Button>
          </Col>
          <Col>
            <Button type="primary" :loading="loading" @click="confirmBtnClick">
              确认
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
import BpmnModeler from 'bpmn-js/lib/Modeler' // bpmn-js 设计器
import BpmData from './BpmData'
import customControlsModule from './bindingDeviceEvent'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

const columns = [
  {
    title: '任务名称',
    slot: 'taskName'
  },
  {
    title: '设备名称',
    key: 'deviceName'
  },
  {
    title: '操作',
    slot: 'action',
    align: 'center'
  }
]

export default {
  name: 'bpmnGraph',
  data () {
    return {
      columns,
      bpmnModeler: null,
      element: null,
      bpmData: new BpmData(),
      loading: false,
      bindingForm: {},
      bindingDevice: {}
    }
  },
  computed: {
    ...mapState({
      activeElement: (state) => state.process.activeElement,
      modal: (state) => state.process.modal,
      activeProcess: (state) => state.process.activeProcess,
      activeBindingList: (state) => state.process.activeBindingList
    }),
    ...mapGetters(['deviceListWithIdAndName']),
    bindingList () {
      console.log(this.activeBindingList)
      if (
        this.activeBindingList === null ||
        this.activeBindingList.length <= 0
      ) {
        return []
      }
      let ret = this.activeBindingList.filter((item) => item.deviceId !== null)
      if (ret === null || ret.length <= 0) {
        return []
      }
      ret = ret.map((item) => {
        let deviceName = JSON.parse(item.deviceId).name
        return {
          taskName: item.taskName,
          deviceName: deviceName,
          taskId: item.taskId
        }
      })
      return ret === null ? [] : ret
    }
  },
  methods: {
    ...mapMutations(['setProcessModal']),
    ...mapActions([
      'bindingDeviceAction',
      'cancelBindingDeviceAction',
      'processStopAction',
      'processStartAction'
    ]),
    createNewDiagram () {
      const bpmnXmlStr = this.activeProcess.bpmn
      // 将字符串转换成图显示出来
      this.bpmnModeler.importXML(bpmnXmlStr, (err) => {
        if (err) {
          console.error(err)
        } else {
          this.adjustPalette()
        }
      })
    },
    // 调整左侧工具栏排版
    adjustPalette () {
      try {
        // 获取 bpmn 设计器实例
        const canvas = this.$refs.canvas
        const djsPalette = canvas.children[0].children[1].children[4]
        const djsPalStyle = {
          width: '130px',
          padding: '5px',
          background: 'white',
          left: '20px',
          borderRadius: 0
        }
        for (var key in djsPalStyle) {
          djsPalette.style[key] = djsPalStyle[key]
        }
        const palette = djsPalette.children[0]
        const allGroups = palette.children
        allGroups[0].style['display'] = 'none'
        // 修改控件样式
        for (var gKey in allGroups) {
          const group = allGroups[gKey]
          for (var cKey in group.children) {
            const control = group.children[cKey]
            const controlStyle = {
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              padding: '5px'
            }
            if (
              control.className &&
              control.dataset &&
              control.className.indexOf('entry') !== -1
            ) {
              const controlProps = this.bpmData.getControl(
                control.dataset.action
              )
              control.innerHTML = `<div style='font-size: 14px;font-weight:500;margin-left:15px;'>${controlProps['title']}</div>`
              for (var csKey in controlStyle) {
                control.style[csKey] = controlStyle[csKey]
              }
            }
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    saveSVG (done) {
      // 把传入的done再传给bpmn原型的saveSVG函数调用
      this.bpmnModeler.saveSVG(done)
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    saveDiagram (done) {
      // 把传入的done再传给bpmn原型的saveXML函数调用
      this.bpmnModeler.saveXML({ format: true }, function (err, xml) {
        done(err, xml)
      })
    },
    // 当图发生改变的时候会调用这个函数，这个data就是图的xml
    setEncoded (link, name, data) {
      // 把xml转换为URI，下载要用到的
      const encodedData = encodeURIComponent(data)
      // 获取到图的xml，保存就是把这个xml提交给后台
      this.xmlStr = data
      // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
      if (data) {
        link.className = 'active'
        link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
        link.download = name
      }
    },
    cancelBtnClick () {
      this.setProcessModal(false)
    },
    confirmBtnClick () {
      this.setProcessModal(false)
      this.bindingDeviceAction({ device: this.bindingDevice })
      //   console.log(this.bindingDevice);
    },
    cancelBindingBtnClick (row) {
      this.cancelBindingDeviceAction(row.taskId)
    }
  },
  mounted () {
    // console.log(this.deviceListWithIdAndName);
    const canvas = this.$refs.canvas
    // 生成实例
    this.bpmnModeler = new BpmnModeler({
      container: canvas,
      additionalModules: [customControlsModule]
    })

    // 获取a标签dom节点
    const downloadLink = this.$refs.saveDiagram
    const downloadSvgLink = this.$refs.saveSvg
    // 监听流程图改变事件
    const _this = this
    this.bpmnModeler.on('commandStack.changed', function () {
      _this.saveSVG(function (err, svg) {
        _this.setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg)
      })
      _this.saveDiagram(function (err, xml) {
        _this.setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml)
      })
    })

    // 新增流程定义
    this.createNewDiagram()
  }
}
</script>

<style lang="scss">
/*左边工具栏以及编辑节点的样式*/
@import "~bpmn-js/dist/assets/diagram-js.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
.containers {
  position: absolute;
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  .canvas {
    width: 100%;
    height: 100%;
  }
  .panel {
    position: absolute;
    right: 0;
    top: 50px;
    width: 300px;
  }
  .bjs-powered-by {
    display: none;
  }
  .toolbar {
    position: absolute;
    top: 20px;
    right: 350px;
    a {
      text-decoration: none;
      margin: 5px;
      color: #409eff;
    }
  }
}
</style>
