<template>
  <div>
    <Button class="add-new-project" type="primary" icon="md-add" @click="addDriverModalVisible = true" style="margin-bottom: 10px">
      新增控制器
    </Button>
    <Modal
      v-model="addDriverModalVisible"
      title="新增控制器"
      footer-hide
    >
      <Form :label-width="80">
        <Row>
          <FormItem label="名称">
            <Input v-model="name" placeholder="请输入控制器名称"></Input>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="协议">
            <Select v-model="protocol" @on-change="changeProtocol">
              <Option
                v-for="protocolItem in deviceDataProtocolList"
                :value="protocolItem.value"
                :key="protocolItem.value"
              >
                {{ protocolItem.label }}
              </Option>
            </Select>
          </FormItem>
        </Row>
      </Form>
      <DriverModbusForm
        v-if="protocol === 'Modbus'"
        :driverForm = "newDriver"
        :parentCancelBtnClick = "cancel"
        :parentConfirmBtnClick = "createDriver"
      />
      <DriverZigbeeForm
        v-else-if="protocol === 'ZigBee'"
        :driverForm = "newDriver"
        :parentCancelBtnClick = "cancel"
        :parentConfirmBtnClick = "createDriver"
      />
      <DriverHttpForm
        v-else-if="protocol === 'Http'"
        :driverForm = "newDriver"
        :parentCancelBtnClick = "cancel"
        :parentConfirmBtnClick = "createDriver"
      />
    </Modal>
    <paged-table
      ref="table"
      :loading="loading"
      :columns="columns"
      :data-source="drivers"
      :total="drivers.length"></paged-table>
  </div>
</template>

<script>
import { getDriverByDevice, createDriver, deleteDriver } from '@/api/driver'
import { mapState } from 'vuex'
import PagedTable from '_c/paged-table'
import {
  DriverModbusForm,
  DriverZigbeeForm,
  DriverHttpForm
} from '_c/driver-protocol-form'
import PopConfirmButton from '_c/pop-confirm-button'
const driverForm = {
  Modbus: {
    name: '',
    point: {
      type: 'Modbus',
      ip: '127.0.0.1',
      port: 502,
      slaveId: 3,
      offset: 0,
      modbusFunction: 'HOLDING_REGISTER',
      datatype: 'BINARY'
    }
  },
  ZigBee: {
    name: '',
    point: {
      type: 'ZigBee',
      serialNumber: 'COM2',
      baudRate: 9600,
      checkoutBit: null,
      dataBit: 8,
      stopBit: 1
    }
  },
  WebSocket: {
    name: '',
    point: {
      type: 'WebSocket',
      uri: 'http://localhost:8000/websocket'
    }
  },
  Http: {
    name: '',
    point: {
      type: 'Http',
      url: 'http://localhost:8000/getdata'
    }
  }
}
export default {
  name: 'driver-management',
  props: ['deviceId'],
  components: {
    DriverModbusForm,
    DriverZigbeeForm,
    DriverHttpForm,
    PagedTable
  },
  data () {
    return {
      loading: true,
      isShowCommand: false,
      addDriverModalVisible: false,
      newDriver: driverForm['Modbus'],
      name: '',
      protocol: 'Modbus',
      drivers: [],
      columns: [
        {
          title: '名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '通讯协议',
          key: 'protocol',
          align: 'center',
          render: (h, { row }) => h('span', row.point.type)
        },
        {
          title: '操作',
          key: 'operation',
          minWidth: 150,
          align: 'center',
          render: (h, { row }) => h('div',
            [h('Button', {
              props: { size: 'small', type: 'primary' },
              style: {
                margin: '1%'
              },
              on: {
                click: () => {
                  this.$router.push(`/device/driver/${row.id}`)
                }
              }
            }, '命令管理'),
            h(PopConfirmButton, {
              props: {
                buttonProps: {
                  size: 'small', type: 'error'
                },
                buttonText: '删除',
                popTipTitle: '确定删除？',
                ok: () => { this.deleteDriver(row.id) }
              }
            })
            ]
          )
        }
      ]
    }
  },
  computed: {
    ...mapState({
      deviceDataProtocolList: (state) => {
        const list = state.device.deviceDataProtocolList
        return list.filter(c => c.value !== 'WebSocket')
      }
    })
  },
  mounted () {
    this.refresh()
  },
  methods: {
    async refresh () {
      this.loading = true
      this.newDriver = driverForm['Modbus']
      this.protocol = 'Modbus'
      this.drivers = await getDriverByDevice(this.deviceId)
      this.loading = false
    },
    cancel () {
      this.addDriverModalVisible = false
      this.newDriver = driverForm['Modbus']
      this.protocol = 'Modbus'
    },
    createDriver (driver) {
      if (this.name === '') {
        this.$Message.error('请输入名称')
        return
      }
      const data = { ...driver, deviceId: this.deviceId, name: this.name }
      createDriver(data).then(() => {
        this.$Message.success('创建控制器成功')
        this.addDriverModalVisible = false
        this.refresh()
      }).catch(e => {
        this.$Message.error(e.message)
      })
    },
    deleteDriver (id) {
      deleteDriver(id).then(() => {
        this.$Message.success('删除控制器成功')
        this.refresh()
      }).catch(e => {
        this.$Message.error(e.message)
      })
    },
    updateDriver () {
    },
    changeProtocol () {
      this.newDriver = driverForm[this.protocol]
    }
  }
}
</script>

<style scoped>

</style>
