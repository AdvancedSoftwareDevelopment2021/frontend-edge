<template>
  <div>
    <!-- <device-info-form
      :deviceInfo="device"
      :parentCancelBtnClick="cancelBtnClick"
      :parentConfirmBtnClick="confirmBtnClick"
    >
    </device-info-form> -->
    <Form ref="formItem" :model="formItem" :label-width="80">
      <Card class="card">
        <p slot="title">设备基本信息</p>
        <FormItem label="设备名称">
          <!-- <Input :disabled="isDetailMode" v-model="formItem.name"></Input> -->
          <span>{{ formItem.name }}</span>
        </FormItem>
        <FormItem label="型号">
          <!-- <Input :disabled="isDetailMode" v-model="formItem.model"></Input> -->
          <span>{{ formItem.model }}</span>
        </FormItem>
        <FormItem label="设备描述">
          <!-- <Input
            :disabled="isDetailMode"
            v-model="formItem.description"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
          ></Input> -->
          <span>{{ formItem.description }}</span>
        </FormItem>
      </Card>
      <Card class="card">
        <p slot="title">传感器信息</p>
        <Table border :columns="columns" :data="formItem.values">
          <template slot-scope="{ row }" slot="status">
            <Badge :status="handleSensorStatus(row.sensorId)" />
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <!-- <Button
              type="primary"
              size="small"
              style="margin-right: 5px"
              @click="show(index)"
              >View</Button
            > -->
            <Row v-if="isDetailMode && !row.sensorId">
              <Col>
                <Button
                  v-if="showBindingBtn(index)"
                  long
                  type="primary"
                  @click="dataSourceBindingBtnClick(row, index)"
                >
                  绑定传感器
                </Button>
                <Button
                  v-else
                  long
                  type="default"
                  @click="dataSourceUnboundBtnClick(index)"
                >
                  取消绑定
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
              v-if="isDetailMode && row.sensorId"
              :style="{ 'margin-top': '1%' }"
            >
              <Col
                v-if="row.protocol === 'WebSocket' || row.protocol === 'ZigBee'"
              >
                <Button
                  long
                  v-if="showStartBtn(row.sensorId)"
                  @click="startMonitorCommandBtnClick(row)"
                >
                  开始监听
                </Button>
                <Button long v-else @click="stopMonitorCommandBtnClick(row)">
                  停止监听
                </Button>
              </Col>
              <Col
              v-if="row.protocol !== 'WebSocket' && row.protocol !== 'ZigBee'"
              >
                <Button
                  long
                  v-if="showStartBtn(row.sensorId)"
                  type="info"
                  @click="startCommandBtnClick(row)"
                >
                  开始采集
                </Button>
                <Button
                  long
                  v-else
                  type="info"
                  @click="stopCommandBtnClick(row)"
                >
                  停止采集
                </Button>
              </Col>
            </Row>
          </template>
        </Table>
        <Row :gutter="8" type="flex" justify="end" style="margin-top: 10px">
          <Col>
            <Button @click="cancelBtnClick">取消</Button>
          </Col>
          <Col>
            <Button type="primary" :loading="loading" @click="confirmBtnClick">
              确认
            </Button>
          </Col>
        </Row>
      </Card>
      <Card class="card">
        <p slot="title">控制器信息</p>
        <driver-management :deviceId="this.device.id"></driver-management>
      </Card>
    </Form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import {
  modbusBindingForm,
  zigbeeBindingForm,
  websocketBindingForm,
  httpBindingForm
} from '_c/protocol-binding-form'
import { SENSOR_STATUS } from '../../libs/constants'
import DriverManagement from '../driver/driver-management'
const columns = [
  {
    title: '名称',
    key: 'name'
  },
  {
    title: '数据类型',
    key: 'type'
  },
  {
    title: '通讯协议',
    key: 'protocol'
  },
  {
    title: '状态',
    slot: 'status'
  },
  {
    title: '操作',
    slot: 'action',
    width: 150,
    align: 'center'
  }
]
export default {
  name: 'deviceDetail',
  components: {
    DriverManagement,
    modbusBindingForm,
    zigbeeBindingForm,
    websocketBindingForm,
    httpBindingForm
  },
  data () {
    return {
      formItem: null,
      loading: false,
      bindingModalControl: false,
      activeDataSource: {},
      bindingList: [],
      columns: columns
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
      'sensorMonitorStopCommandAction',
      'getSensorLatestStatusByIdAction'
    ]),
    cancelBtnClick () {
      // this.resetFormItem();
      this.$router.go(-1)
    },
    async confirmBtnClick () {
      this.loading = true
      if (this.bindingList.length > 0) {
        for (let { deviceId, sensor } of this.bindingList) {
          await this.addSensorAction({ deviceId, newSensor: sensor })
        }
      }
      this.loading = false
      // this.resetFormItem();
      // TODO: 现在每次submit后会返回设备管理页面，然后设备管理页面会重新发请求从数据库取得数据
      this.$router.go(-1)
    },
    handleSensorStatus (sensorId) {
      let ret = 'default'
      if (this.formItem.id) {
        let deviceWithStatus = this.deviceStatusList.find(
          (deviceWithStatus) => deviceWithStatus.deviceId === this.formItem.id
        )
        let sensor = deviceWithStatus.sensor.find(
          (sensor) => sensor.sensorId === sensorId
        )
        if (sensor.sensorStatus === SENSOR_STATUS.FAILURE) {
          ret = 'error'
        } else if (sensor.sensorStatus === SENSOR_STATUS.SLEEPING) {
          ret = 'success'
        } else if (
          sensor.sensorStatus === SENSOR_STATUS.SUCCESS ||
          sensor.sensorStatus === SENSOR_STATUS.RUNNING ||
          sensor.sensorStatus === SENSOR_STATUS.COLLECTING
        ) {
          ret = 'processing'
        }
        console.log(sensor.sensorStatus)
      }
      return ret
    },
    dataSourceBindingBtnClick (item, listIndex) {
      this.bindingModalControl = true
      this.activeDataSource = item
      this.activeDataSource.listIndex = listIndex
    },
    dataSourceBindingCancelBtnClick () {
      this.activeDataSource = {}
      this.bindingModalControl = false
    },
    dataSourceBindingConfirmBtnClick (sensor) {
      const { id } = this.device
      this.bindingModalControl = false
      this.bindingList.push({
        deviceId: id,
        sensor,
        listIndex: this.activeDataSource.listIndex
      })
      console.log(`Ready to binding new sensor: ${JSON.stringify({ sensor })}`)
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
      await this.getSensorLatestStatusByIdAction({ deviceId, sensorId })
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
      await this.getSensorLatestStatusByIdAction({ deviceId, sensorId })
    },
    async startCommandBtnClick (item) {
      const deviceId = this.device.id
      const sensorId = item.sensorId
      const sensorName = item.name
      await this.sensorStartCommandAction({ deviceId, sensorId, sensorName })
      await this.getSensorLatestStatusByIdAction({ deviceId, sensorId })
    },
    async stopCommandBtnClick (item) {
      const deviceId = this.device.id
      const sensorId = item.sensorId
      const sensorName = item.name
      await this.sensorStopCommandAction({ deviceId, sensorId, sensorName })
      await this.getSensorLatestStatusByIdAction({ deviceId, sensorId })
    },
    showBindingBtn (listIndex) {
      if (this.bindingList.length <= 0) {
        return true
      }
      let res = this.bindingList.find((item) => item.listIndex === listIndex)
      if (res) {
        return false
      }
      return true
    },
    dataSourceUnboundCancelBtnClick (listIndex) {
      this.bindingList = this.bindingList.filter(
        (item) => item.listIndex !== listIndex
      )
    },
    showStartBtn (sensorId) {
      const deviceId = this.device.id
      let deviceStatus = this.deviceStatusList.find(
        (item) => item.deviceId === deviceId
      )
      let sensor = deviceStatus.sensor.find(
        (item) => item.sensorId === sensorId
      )
      let sensorStatus = sensor.sensorStatus
      if (
        sensorStatus === SENSOR_STATUS.SUCCESS ||
        sensorStatus === SENSOR_STATUS.RUNNING ||
        sensorStatus === SENSOR_STATUS.COLLECTING
      ) {
        return false
      }
      return true
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

<style scoped>
.card {
  margin-bottom: 10px;
}
</style>
