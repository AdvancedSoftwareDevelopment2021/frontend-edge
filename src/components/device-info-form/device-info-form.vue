<template>
  <!-- TODO: paceholder -->
  <div>
    <Form ref="formItem" :model="formItem" :label-width="80">
      <FormItem label="设备名称">
        <Input
          :disabled="isUpdateMode || isDetailMode"
          v-model="formItem.name"
        ></Input>
      </FormItem>
      <!-- <FormItem label="类型">
            <Input v-model="category"></Input>
        </FormItem> -->
      <FormItem label="型号">
        <Input
          :disabled="isUpdateMode || isDetailMode"
          v-model="formItem.model"
        ></Input>
      </FormItem>
      <FormItem label="设备描述">
        <Input
          :disabled="isUpdateMode || isDetailMode"
          v-model="formItem.description"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5 }"
        ></Input>
      </FormItem>
      <!-- TODO: validate -->
      <FormItem
        v-for="(item, listIndex) in formItem.values"
        :key="listIndex"
        :label="'Data ' + `${listIndex + 1}`"
        :prop="'values.' + listIndex + '.value'"
        :rules="{
          required: false,
          message: 'Data ' + `${listIndex + 1}` + ' 不能为空',
          trigger: 'blur',
        }"
      >
        <Row :gutter="10">
          <Col span="10">
            <Input :disabled="isDetailMode" v-model="item.name" />
          </Col>
          <Col span="5">
            <Select :disabled="isDetailMode" v-model="item.type">
              <Option
                v-for="item in deviceDataTypeList"
                :value="item.value"
                :key="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
          </Col>
          <Col span="6">
            <Select :disabled="isDetailMode" v-model="item.protocol">
              <Option
                v-for="item in deviceDataProtocolList"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </Col>
          <Col span="1">
            <Button
              v-if="!isDetailMode"
              @click="handleRemove(listIndex)"
              size="small"
              shape="circle"
            >
              <Icon type="md-close" />
            </Button>
          </Col>
        </Row>
        <Row
          v-if="isDetailMode && !item.sensorId"
          :style="{ 'margin-top': '1%' }"
          :gutter="10"
        >
          <Col span="4">
            <Button
              long
              type="primary"
              @click="dataSourceBindingBtnClick(item)"
            >
              绑定传感器
            </Button>
            <Modal
              v-model="bindingModalControl"
              title="绑定传感器"
              footer-hide
              :closable="false"
              width="50%"
            >
              <modbus-binding-form
                v-if="activeDataSource.protocol === 'Modbus'"
                protocolName="Modbus"
                :dataSourceName="activeDataSource.name"
                :parentCancelBtnClick="dataSourceBindingCancelBtnClick"
                :parentConfirmBtnClick="dataSourceBindingConfirmBtnClick"
              />
              <zigbee-binding-form
                v-else-if="activeDataSource.protocol === 'ZigBee'"
                protocolName="ZigBee"
                :dataSourceName="activeDataSource.name"
                :parentCancelBtnClick="dataSourceBindingCancelBtnClick"
                :parentConfirmBtnClick="dataSourceBindingConfirmBtnClick"
              />
              <websocket-binding-form
                v-else-if="activeDataSource.protocol === 'WebSocket'"
                protocolName="WebSocket"
                :dataSourceName="activeDataSource.name"
                :parentCancelBtnClick="dataSourceBindingCancelBtnClick"
                :parentConfirmBtnClick="dataSourceBindingConfirmBtnClick"
              />
              <http-binding-form
                v-else-if="activeDataSource.protocol === 'Http'"
                protocolName="Http"
                :dataSourceName="activeDataSource.name"
                :parentCancelBtnClick="dataSourceBindingCancelBtnClick"
                :parentConfirmBtnClick="dataSourceBindingConfirmBtnClick"
              />
            </Modal>
          </Col>
          <!-- TODO: 选择后应该有回馈 -->
          <!-- <Col span="6">
            <Input disabled placeholder="请选择传感器" />
          </Col> -->
        </Row>
        <Row
          :gutter="10"
          v-else-if="isDetailMode && item.sensorId"
          :style="{ 'margin-top': '1%' }"
        >
          <Col span="3">
            <Button long v-if="item.protocol === 'WebSocket' || item.protocol === 'ZigBee'" @click="startMonitorCommandBtnClick(item)">开始监听</Button>
            <Button long type="info" @click="startCommandBtnClick(item)" v-else>开始采集</Button>
          </Col>
          <Col span="3">
            <Button long v-if="item.protocol === 'WebSocket' || item.protocol === 'ZigBee'" @click="stopMonitorCommandBtnClick(item)">停止监听</Button>
            <Button long type="info" @click="stopCommandBtnClick(item)" v-else>停止采集</Button>
          </Col>
        </Row>
      </FormItem>
      <FormItem v-if="!isDetailMode">
        <Row type="flex" justify="start">
          <Col span="24">
            <Button type="dashed" long @click="handleAdd" icon="md-add">
              新增设备数据
            </Button>
          </Col>
        </Row>
      </FormItem>
      <Row :gutter="8" type="flex" justify="end">
        <Col>
          <!-- <span @click="cancelSlotClick">
            <slot name="cancelBtn" />
          </span> -->
          <Button @click="cancelBtnClick">取消</Button>
        </Col>
        <Col>
          <!-- <span @click="confirmSlotClick">
            <slot name="confirmBtn" />
          </span> -->
          <Button type="primary" :loading="loading" @click="confirmBtnClick">
            确认
          </Button>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
// TODO: remove property valueIndex
import { mapActions, mapState } from 'vuex'
import {
  modbusBindingForm,
  zigbeeBindingForm,
  websocketBindingForm,
  httpBindingForm
} from '_c/protocol-binding-form'
export default {
  name: 'deviceInfoForm',
  components: {
    modbusBindingForm,
    zigbeeBindingForm,
    websocketBindingForm,
    httpBindingForm
  },
  props: {
    deviceInfo: {
      type: Object
    },
    parentCancelBtnClick: {
      type: Function
    },
    parentConfirmBtnClick: {
      type: Function
    }
  },
  data () {
    let valueIndex = 1
    let formItem = JSON.parse(JSON.stringify(this.deviceInfo))
    // formItem.values[0] = {...formItem.values[0], valueIndex}
    return {
      valueIndex,
      formItem,
      loading: false,
      bindingModalControl: false,
      activeDataSource: {},
      bindingList: []
    }
  },
  computed: {
    ...mapState({
      deviceDataTypeList: (state) => state.device.deviceDataTypeList,
      deviceDataProtocolList: (state) => state.device.deviceDataProtocolList,
      mode: (state) => state.device.mode
    }),
    isUpdateMode () {
      return this.mode === 'UPDATE'
    },
    isDetailMode () {
      return this.mode === 'DETAIL'
    }
  },
  methods: {
    ...mapActions(['sensorStartCommandAction', 'sensorStopCommandAction', 'sensorMonitorStartCommandAction', 'sensorMonitorStopCommandAction']),
    // 因为当parentConfirmBtnClick为Component addDevice所传的方法时，是异步方法，所以要在这加async用来等待异步完成
    async confirmBtnClick () {
      let newDevice = this.formItem
      this.loading = true
      if (this.isDetailMode) {
        await this.parentConfirmBtnClick(this.bindingList)
      } else {
        await this.parentConfirmBtnClick(newDevice)
      }
      this.loading = false
      this.resetFormItem()
    },
    cancelBtnClick () {
      this.parentCancelBtnClick()
      this.resetFormItem()
    },
    resetFormItem () {
      // this.valueIndex = 1
      this.formItem = JSON.parse(JSON.stringify(this.deviceInfo))
      // console.log(`reset: ${JSON.stringify(this.deviceInfo)}`)
    },
    handleAdd () {
      // this.valueIndex++
      this.formItem.values.push({
        // valueIndex: this.valueIndex,
        name: '',
        type: '',
        protocol: ''
      })
    },
    handleRemove (listIndex) {
      // console.log("Delete listItem: " + listIndex);
      this.formItem.values.splice(listIndex, 1)
    },
    dataSourceBindingBtnClick (item) {
      this.bindingModalControl = true
      this.activeDataSource = item
      console.log(this.activeDataSource)
    },
    dataSourceBindingCancelBtnClick () {
      this.bindingModalControl = false
    },
    dataSourceBindingConfirmBtnClick (sensor) {
      const { id } = this.deviceInfo
      this.bindingModalControl = false
      this.bindingList.push({ deviceId: id, sensor })
      console.log(`Add sensor: ${JSON.stringify({ deviceId: id, sensor })}`)
    },
    async startCommandBtnClick (item) {
      const deviceId = this.deviceInfo.id
      const sensorId = item.sensorId
      const sensorName = item.name
      await this.sensorStartCommandAction({ deviceId, sensorId, sensorName })
    },
    async stopCommandBtnClick (item) {
      const deviceId = this.deviceInfo.id
      const sensorId = item.sensorId
      const sensorName = item.name
      await this.sensorStopCommandAction({ deviceId, sensorId, sensorName })
    },
    async startMonitorCommandBtnClick (item) {
      const deviceId = this.deviceInfo.id
      const sensorId = item.sensorId
      const sensorName = item.name
      await this.sensorMonitorStartCommandAction({ deviceId, sensorId, sensorName })
    },
    async stopMonitorCommandBtnClick (item) {
      const deviceId = this.deviceInfo.id
      const sensorId = item.sensorId
      const sensorName = item.name
      await this.sensorMonitorStopCommandAction({ deviceId, sensorId, sensorName })
    }
  },
  watch: {
    deviceInfo (val) {
      this.formItem = JSON.parse(JSON.stringify(val))
      // console.log(`deviceInfo: ${JSON.stringify(val)}`)
    }
  },
  mounted () {
    this.$nextTick(() => {
      // console.log(this._uid)
    })
  }
}
</script>
