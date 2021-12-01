<template>
  <div>
    <Row style="margin: 0 1%">
      <Col span="2">
        <add-device :deviceInfo="formItem" />
      </Col>
      <!-- TODO: 实现search 功能 -->
      <Col span="10">
        <Input
          v-model="searchInput"
          search
          placeholder="输入设备名字搜索设备"
        />
      </Col>
    </Row>
    <Row>
      <Col
        span="6"
        v-for="(device, listIndex) in deviceList"
        v-bind:key="listIndex"
        style="padding: 10px; background: #f8f8f9"
      >
        <Card
          :title="device.name"
          icon="ios-information-circle-outline"
          :padding="0"
          shadow
          style="width: 300px"
        >
          <Badge :status="handleStatus(device.status)" slot="extra">
            <a href="#" class="demo-badge"></a>
          </Badge>
          <CellGroup>
            <!-- <Cell :title="'类型: ' + device.category" /> -->
            <Cell :title="'型号: ' + device.model" />
<!--            <Cell title="设备状态">-->
<!--              <span slot="extra" v-html="handleStatusCell(device.status)" />-->
<!--            </Cell>-->
            <div @click="deviceDetailClick(device.id)">
              <Cell title="查看设备详细内容">
                <Icon slot="extra" type="ios-link" />
              </Cell>
              <!-- <Modal
                v-model="detailModalControl"
                title="设备详细内容"
                footer-hide
                :closable="false"
              >
                <device-info-form
                  :deviceInfo="activeDevice"
                  :parentCancelBtnClick="detailCancelBtnClick"
                  :parentConfirmBtnClick="detailConfirmBtnClick"
                >
                </device-info-form>
              </Modal> -->
            </div>
          </CellGroup>
          <Row type="flex" justify="space-around" style="padding: 10px">
            <Col span="10">
              <Button type="info" long @click="modifyDeviceBtnClick(device.id)">
                修改设备信息
              </Button>
              <Modal
                v-model="modalControl"
                title="修改设备"
                footer-hide
                :closable="false"
              >
                <device-info-form
                  :deviceInfo="activeDevice"
                  :parentCancelBtnClick="modalCancelBtnClick"
                  :parentConfirmBtnClick="modalConfirmBtnClick"
                >
                </device-info-form>
              </Modal>
            </Col>
            <Col span="10">
              <Button type="error" long @click="deleteBtnClick(listIndex)">
                删除设备
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import addDevice from '_c/add-device'
import deviceInfoForm from '_c/device-info-form'
import addSensor from '_c/add-sensor'
export default {
  name: 'device',
  components: {
    addDevice,
    deviceInfoForm,
    addSensor
  },
  data () {
    return {
      searchInput: '',
      modalControl: false,
      // detailModalControl: false,
      activeDevice: {
        id: null,
        name: '',
        model: '',
        description: '',
        status: null,
        values: [
          {
            valueIndex: null,
            name: '',
            type: '',
            protocol: ''
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      deviceList: (state) => state.device.deviceList
    }),
    ...mapGetters(['formItem'])
  },
  methods: {
    ...mapMutations(['modeChange']),
    ...mapActions([
      'modifyDeviceListAction',
      'getDeviceListAction',
      'deleteDeviceAction'
    ]),
    handleStatus (status) {
      let ret = ''
      switch (status) {
        case 1: {
          ret = 'processing'
          break
        }
        case 2: {
          ret = 'success'
          break
        }
        case 3: {
          ret = 'error'
          break
        }
      }
      return ret
    },
    handleStatusCell (statue) {
      let ret = ''
      switch (statue) {
        case 1: {
          ret = '<span style="color: green">处理中</span>'
          break
        }
        case 2: {
          ret = '<span style="color: green">空闲</span>'
          break
        }
        case 3: {
          ret = '<span style="color: red">出错</span>'
          break
        }
      }
      return ret
    },
    modifyDeviceBtnClick (deviceId) {
      this.modalControl = true
      this.activeDevice = this.deviceList.find(
        (device) => device.id === deviceId
      )
      this.modeChange('UPDATE')
    },
    modalConfirmBtnClick (updateDeviceInfo) {
      this.modalControl = false
      this.modifyDeviceListAction(updateDeviceInfo)
    },
    modalCancelBtnClick () {
      this.modalControl = false
    },
    deleteBtnClick (listId) {
      this.deleteDeviceAction(listId)
    },
    deviceDetailClick (deviceId) {
      // this.detailModalControl = true
      this.activeDevice = this.deviceList.find(
        (device) => device.id === deviceId
      )
      this.$router.push({
        name: '设备详情',
        params: {
          device: this.activeDevice
        }
      })
      this.modeChange('DETAIL')
    }
    // detailConfirmBtnClick () {
    //   this.detailModalControl = false
    // },
    // detailCancelBtnClick () {
    //   this.detailModalControl = false
    // }
  },
  watch: {},
  async created () {
    // TODO: 如果有网络延迟的话，可能会卡顿，或者在mounted中发请求？
    await this.getDeviceListAction()
  }
}
</script>
