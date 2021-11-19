<template>
    <div>
        <Row style="margin: 0 1%">
            <Col span="2">
                <add-device :deviceInfo="formItem" />
            </Col>
            <!-- TODO: 实现search 功能 -->
            <Col span="10">
                <Input v-model="searchInput" search placeholder="输入设备名字搜索设备" />
            </Col>
        </Row>
        <Row>
        <Col span="6" v-for="device in deviceList" v-bind:key="device.id" style="padding: 10px;background: #f8f8f9">
            <Card :title="device.name" icon="ios-information-circle-outline" :padding="0" shadow style="width: 300px">
                <!-- <Badge dot slot="extra">
                    <a href="#" class="demo-badge"></a>
                </Badge> -->
                <Badge :status="handleStatus(device.status)" slot="extra">
                    <a href="#" class="demo-badge"></a>
                </Badge>
                <CellGroup>
                    <Cell :title="'类型: ' + device.category" />
                    <Cell :title="'型号: ' + device.model" />
                    <Cell title="设备状态">
                        <span slot="extra" v-html="handleStatusCell(device.status)" />
                    </Cell>
                </CellGroup>
                <Row type="flex" justify="space-around" style="padding: 10px">
                    <Col span="10">
                        <Button type="error" long @click="delDeviceBtnClick(device.id-1)">删除设备</Button>
                    </Col>
                    <Col span="10">
                        <Button type="info" long @click="modifyDeviceBtnClick(device.id-1)">修改设备信息</Button>
                        <Modal
                            v-model="modalControl"
                            title="修改设备"
                            @on-ok="modalComfirmBtnClick"
                            @on-cancel="modalCancelBtnClick">
                            <device-info-form :deviceInfo="activeDeivce"/>
                        </Modal>
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
export default {
  name: 'device',
  components: {
    addDevice,
    deviceInfoForm
  },
  data () {
    return {
      searchInput: '',
      modalControl: false,
      activeDeivce: {
        id: null,
        name: '',
        model: '',
        category: '',
        description: '',
        status: null
      }
      // _activeDeivce: null
    }
  },
  computed: {
    ...mapState({
      deviceList: state => state.device.deviceList
    }),
    ...mapGetters([
      'formItem'
    ])
    // activeDeivce: {
    //     get() {
    //         if (this._activeDeivce == null) {
    //             this._activeDeivce = this.deviceList[0]
    //         }
    //         return this._activeDeivce
    //     },
    //     set(value) {
    //         this._activeDeivce = value[value]
    //     }
    // }
  },
  methods: {
    ...mapMutations([
      'modifyFormItem',
      'initFormItem',
      'deleteDevice'
    ]),
    ...mapActions([
      'modifyDeviceList'
    ]),
    handleStatus (status) {
      let ret = ''
      switch (status) {
        case 1: {
          ret = 'processing'
          break
        }
        case 2: {
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
          ret = '<span style="color: green">空闲</span>'
          break
        }
        case 2: {
          ret = '<span style="color: red">出错</span>'
          break
        }
      }
      return ret
    },
    modifyDeviceBtnClick (id) {
      this.modalControl = true
      this.activeDeivce = this.deviceList[id]
      this.modifyFormItem(this.deviceList[id])
      // FIXME: bug? web browser特性? 連續兩次點擊同一個設備，第一次所修改的內容會保留到第二次中，但保存formItem的內容是每次點擊都會初始化成合適的內容
      // console.log(this.activeDeivce)
    },
    modalComfirmBtnClick () {
      this.modifyDeviceList()
    },
    modalCancelBtnClick () {
      this.initFormItem()
    },
    delDeviceBtnClick (id) {
      this.deleteDevice({ id })
    }
  },
  watch: {
  },
  mounted () {
  }
}
</script>
