<template>
  <div>
    <!-- <device-info-form
      :deviceInfo="device"
      :parentCancelBtnClick="cancelBtnClick"
      :parentConfirmBtnClick="confirmBtnClick"
    >
    </device-info-form> -->
    <Form ref="formItem" :model="formItem" :label-width="80">
      <FormItem label="设备名称">
        <Input :disabled="isDetailMode" v-model="formItem.name"></Input>
      </FormItem>
      <FormItem label="型号">
        <Input :disabled="isDetailMode" v-model="formItem.model"></Input>
      </FormItem>
      <FormItem label="设备描述">
        <Input
          :disabled="isDetailMode"
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
                v-for="dataTypeItem in deviceDataTypeList"
                :value="dataTypeItem.value"
                :key="dataTypeItem.value"
              >
                {{ dataTypeItem.label }}
              </Option>
            </Select>
          </Col>
          <Col span="6">
            <Select :disabled="isDetailMode" v-model="item.protocol">
              <Option
                v-for="protocolItem in deviceDataProtocolList"
                :value="protocolItem.value"
                :key="protocolItem.value"
              >
                {{ protocolItem.label }}
              </Option>
            </Select>
          </Col>
          <Col span="1">
            <div>
              <Badge :status="handleSensorStatus(item.name)" />
            </div>
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
            <Button
              long
              v-if="item.protocol === 'WebSocket' || item.protocol === 'ZigBee'"
              @click="startMonitorCommandBtnClick(item)"
            >
              开始监听
            </Button>
            <Button long type="info" @click="startCommandBtnClick(item)" v-else>
              开始采集
            </Button>
          </Col>
          <Col span="3">
            <Button
              long
              v-if="item.protocol === 'WebSocket' || item.protocol === 'ZigBee'"
              @click="stopMonitorCommandBtnClick(item)"
            >
              停止监听
            </Button>
            <Button long type="info" @click="stopCommandBtnClick(item)" v-else>
              停止采集
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
import { mapActions, mapState } from 'vuex'
import deviceInfoForm from '_c/device-info-form'
export default {
  name: 'deviceDetail',
  components: {
    deviceInfoForm
  },
  data () {
    return {
      formItem: null,
      loading: false,
      bindingModalControl: false,
      activeDataSource: {}
    }
  },
  computed: {
    ...mapState({
      device: (state) => state.device.deviceInfo,
      mode: (state) => state.device.mode,
      deviceDataTypeList: (state) => state.device.deviceDataTypeList,
      deviceDataProtocolList: (state) => state.device.deviceDataProtocolList,
      deviceStatusList: (state) => state.device.deviceStatusList
    }),
    isDetailMode () {
      return this.mode === 'DETAIL'
    }
  },
  methods: {
    ...mapActions([
      'addSensorAction',
      'sensorStartCommandAction',
      'sensorStopCommandAction',
      'sensorMonitorStartCommandAction',
      'sensorMonitorStopCommandAction'
    ]),
    cancelBtnClick () {
      // this.resetFormItem();
      this.$router.go(-1)
    },
    async confirmBtnClick (bindingList) {
      this.loading = true
      for (let { deviceId, sensor } of bindingList) {
        await this.addSensorAction({ deviceId, newSensor: sensor })
      }
      // bindingList.forEach(({ deviceId, sensor }) => {
      //   this.addSensorAction({ deviceId, sensor })
      // });
      this.loading = false
      // this.resetFormItem();
      // TODO: 现在每次submit后会返回设备管理页面，然后设备管理页面会重新发请求从数据库取得数据
      this.$router.go(-1)
    },
    handleSensorStatus (sensorName) {
      // console.log(sensorName)
      // console.log(this.formItem.id)
      // FIXME: 返回到device页面时也会调用这函数，但此时this.formItem, sensorName都为null，故没有sensor.sensorStatus
      let ret = ''
      if (sensorName && this.formItem.id) {
        let deviceStatus = this.deviceStatusList.find(
          (deviceStatus) => deviceStatus.deviceId === this.formItem.id
        )
        let sensor = deviceStatus.sensor.find(
          (sensor) => sensor.sensorName === sensorName
        )
        if (sensor.sensorStatus === 'failure') {
          ret = 'error'
        } else if (sensor.sensorStatus === 'sleeping') {
          ret = 'success'
        }
        console.log(sensor.sensorStatus)
      }
      return ret
    },
    dataSourceBindingBtnClick (item) {
      this.bindingModalControl = true
      this.activeDataSource = item
      // console.log(this.activeDataSource)
    },
    dataSourceBindingCancelBtnClick () {
      this.bindingModalControl = false
    },
    dataSourceBindingConfirmBtnClick (sensor) {
      const { id } = this.device
      this.bindingModalControl = false
      this.bindingList.push({ deviceId: id, sensor })
      console.log(`Add sensor: ${JSON.stringify({ deviceId: id, sensor })}`)
    },
    async startMonitorCommandBtnClick (item) {
      const deviceId = this.device.id
      const sensorId = item.sensorId
      const sensorName = item.name
      await this.sensorMonitorStartCommandAction({
        deviceId,
        sensorId,
        sensorName
      })
    },
    async stopMonitorCommandBtnClick (item) {
      const deviceId = this.device.id
      const sensorId = item.sensorId
      const sensorName = item.name
      await this.sensorMonitorStopCommandAction({
        deviceId,
        sensorId,
        sensorName
      })
    },
    async startCommandBtnClick (item) {
      const deviceId = this.device.id
      const sensorId = item.sensorId
      const sensorName = item.name
      await this.sensorStartCommandAction({ deviceId, sensorId, sensorName })
    },
    async stopCommandBtnClick (item) {
      const deviceId = this.device.id
      const sensorId = item.sensorId
      const sensorName = item.name
      await this.sensorStopCommandAction({ deviceId, sensorId, sensorName })
    }
    // resetFormItem() {
    //   this.formItem = JSON.parse(JSON.stringify(this.device));
    // },
  },
  created () {
    this.formItem = JSON.parse(JSON.stringify(this.device))
  }
}
</script>
