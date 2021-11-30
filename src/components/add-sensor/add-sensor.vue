<template>
  <div>
    <Button type="primary" @click="addSensorBtnClick" icon="md-add-circle">
      新增传感器
    </Button>
    <Modal
      v-model="modalControl"
      title="新增传感器"
      footer-hide
      :closable="false"
      width="50%"
    >
      <Tabs v-model="activeTab">
        <TabPane label="Modbus" name="Modbus">
          <Form :model="newSensorFormItem" :label-width="80">
            <FormItem>
              <div>请选择想要绑定的设备数据来源</div>
              <Collapse accordion simple v-model="activeDeviceName">
                <Panel
                  v-for="device in deviceDataWithoutSensor"
                  :name="device.deviceName"
                  :key="device.deviceId"
                >
                  {{ "设备名称: " + device.deviceName }}
                  <template slot="content">
                    <!-- <List>
                      <ListItem
                        v-for="sensor in device.values"
                        :key="sensor.name"
                      >
                        <ListItemMeta :description="JSON.stringify(sensor)" />
                      </ListItem>
                    </List> -->
                    <Table :columns="tableCols" :data="device.values">
                      <template slot-scope="{ row, index }" slot="name">
                        <span>{{ row.name }}</span>
                      </template>
                      <template slot-scope="{ row, index }" slot="type">
                        <span>{{ row.type }}</span>
                      </template>
                      <template slot-scope="{ row, index }" slot="protocol">
                        <span>{{ row.protocol }}</span>
                      </template>
                      <template slot-scope="{ row, index }" slot="action">
                        <div
                          v-if="
                            selectSensor.sensorName === row.name &&
                            selectSensor.sensorIndex === index
                          "
                        >
                          <Button
                            type="primary"
                            @click="sensorSelectCancelBtnClick"
                          >
                            取消选择
                          </Button>
                        </div>
                        <div v-else>
                          <Button @click="sensorSelectBtnClick(row, index)">
                            选择
                          </Button>
                        </div>
                      </template>
                    </Table>
                  </template>
                </Panel>
              </Collapse>
            </FormItem>
            <Row>
              <Col span="12">
                <FormItem label="Interval">
                  <Input
                    v-model="
                      newSensorFormItem[activeTab].collectScheduler.interval
                    "
                    placeholder="请输入数据回传间隔时间"
                  ></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="Unit">
                  <Select
                    v-model="newSensorFormItem[activeTab].collectScheduler.unit"
                    placeholder="请选择时间单位"
                  >
                    <Option
                      v-for="item in unitList"
                      :value="item.value"
                      :key="item.value"
                    >
                      {{ item.label }}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem label="IP地址">
                  <Input
                    v-model="newSensorFormItem[activeTab].dataCollector.ip"
                    placeholder="请输入IP地址"
                  ></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="端口">
                  <Input
                    v-model="newSensorFormItem[activeTab].dataCollector.port"
                    placeholder="请输入端口"
                  ></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="slaveId">
                  <Input
                    v-model="newSensorFormItem[activeTab].dataCollector.slaveId"
                    placeholder="请输入slaveId"
                  ></Input>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="offset">
                  <Input
                    v-model="newSensorFormItem[activeTab].dataCollector.offset"
                    placeholder="请输入offset"
                  ></Input>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="num">
                  <Input
                    v-model="newSensorFormItem[activeTab].dataCollector.num"
                    placeholder="请输入num"
                  ></Input>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane label="Canbus" name="Canbus" disabled>标签二的内容</TabPane>
        <TabPane label="ZigBee" name="ZigBee">
          <Form :model="newSensorFormItem" :label-width="80">
            <FormItem>
              <div>请选择想要绑定的设备数据来源</div>
              <Collapse accordion simple v-model="activeDeviceName">
                <Panel
                  v-for="device in deviceDataWithoutSensor"
                  :name="'设备名称: ' + device.deviceName"
                  :key="device.deviceId"
                >
                  {{ device.deviceName }}
                  <template slot="content">
                    <!-- <List>
                      <ListItem
                        v-for="sensor in device.values"
                        :key="sensor.name"
                      >
                        <ListItemMeta :description="JSON.stringify(sensor)" />
                      </ListItem>
                    </List> -->
                    <Table :columns="tableCols" :data="device.values">
                      <template slot-scope="{ row }" slot="name">
                        <span>{{ row.name }}</span>
                      </template>
                      <template slot-scope="{ row }" slot="type">
                        <span>{{ row.type }}</span>
                      </template>
                      <template slot-scope="{ row }" slot="protocol">
                        <span>{{ row.protocol }}</span>
                      </template>
                      <template slot-scope="{ row, index }" slot="action">
                        <div
                          v-if="
                            selectSensor.sensorName === row.name &&
                            selectSensor.sensorIndex === index
                          "
                        >
                          <Button
                            type="primary"
                            @click="sensorSelectCancelBtnClick"
                          >
                            取消选择
                          </Button>
                        </div>
                        <div v-else>
                          <Button @click="sensorSelectBtnClick(row, index)">
                            选择
                          </Button>
                        </div>
                      </template>
                    </Table>
                  </template>
                </Panel>
              </Collapse>
            </FormItem>
            <Row>
              <Col span="12">
                <FormItem label="Interval">
                  <Input
                    v-model="
                      newSensorFormItem[activeTab].collectScheduler.interval
                    "
                    placeholder="请输入数据回传间隔时间"
                  ></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="Unit">
                  <Select
                    v-model="newSensorFormItem[activeTab].collectScheduler.unit"
                    placeholder="请选择时间单位"
                  >
                    <Option
                      v-for="item in unitList"
                      :value="item.value"
                      :key="item.value"
                    >
                      {{ item.label }}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane label="WebSocket" name="WebSocket" disabled
          >标签一的内容</TabPane
        >
        <TabPane label="Http" name="Http" disabled>标签一的内容</TabPane>
      </Tabs>
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
    </Modal>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex'
export default {
  name: 'addSensor',
  data () {
    return {
      modalControl: false,
      loading: false,
      activeTab: 'Modbus',
      newSensorFormItem: {
        /* collectScheduler: {
          interval: null,
          unit: null,
        },
        dataCollector: {
          ip: "127.0.0.1",
          port: 502,
          slaveId: 3,
          offset: 0,
          modbusFunction: "HOLDING_REGISTER",
          datatype: "BINARY",
          num: 2,
        },
        */
      },
      activeDeviceName: null,
      selectSensor: {
        sensorName: null,
        sensorIndex: null
      },
      tableCols: [
        {
          title: '传感器名称',
          slot: 'name'
        },
        {
          title: '传感器数据类型',
          slot: 'type'
        },
        {
          title: '传感器所用协议',
          slot: 'protocol'
        },
        {
          title: '选择',
          slot: 'action'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      sensorFormItem: (state) => state.sensor.sensorFormItem,
      unitList: (state) => state.sensor.unitList
    }),
    ...mapGetters(['deviceDataWithoutSensor'])
    // deviceDataWithoutSensor() {
    //     return this.$store.getters.deviceDataWithoutSensor
    // }
  },
  methods: {
    ...mapActions(['addSensorAction', 'getDeviceListAction']),
    addSensorBtnClick () {
      this.modalControl = true
    },
    cancelBtnClick () {
      this.modalControl = false
      this.resetSensorFormItem()
    },
    async confirmBtnClick () {
      this.loading = true
      const device = this.deviceDataWithoutSensor.find((device) => {
        return (
          device.deviceName.valueOf() === this.activeDeviceName[0].valueOf()
        )
      })
      // console.log(this.deviceDataWithoutSensor[0].deviceName.valueOf() === this.activeDeviceName[0].valueOf())
      let newSensor = {
        name: this.selectSensor.sensorName,
        collectScheduler:
          this.newSensorFormItem[this.activeTab].collectScheduler,
        dataCollector: this.newSensorFormItem[this.activeTab].dataCollector
      }
      await new Promise((resolve) => {
        this.addSensorAction({ deviceId: device.deviceId, newSensor })
        setTimeout(() => {
          this.modalControl = false
          this.resetSensorFormItem()
          resolve()
        }, 1000)
      })
      // FIXME:
      await this.getDeviceListAction()
      this.loading = false
    },
    sensorSelectBtnClick (row, index) {
      this.selectSensor.sensorName = row.name
      this.selectSensor.sensorIndex = index
    },
    sensorSelectCancelBtnClick () {
      this.selectSensor.sensorName = null
      this.selectSensor.sensorIndex = null
    },
    resetSensorFormItem () {
      this.newSensorFormItem = JSON.parse(JSON.stringify(this.sensorFormItem))
      this.activeDeviceName = null
      this.selectSensor.sensorName = null
      this.selectSensor.sensorIndex = null
    }
  },
  watch: {
    //   activeTab(val) {
    //       console.log(val)
    //       console.log(this.sensorFormItem[val])
    //   }
    // deviceDataWithoutSensor(val) {
    //     console.log("Watching deviceDataWithoutSensor")
    //     console.log(val)
    // }
    activeDeviceName (newVal, oldVal) {
      console.log(`Focus change: ${oldVal} --> ${newVal}`)
    }
  },
  created () {
    this.newSensorFormItem = JSON.parse(JSON.stringify(this.sensorFormItem))
  }
}
</script>
