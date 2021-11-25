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
            <Cell title="设备状态">
              <span slot="extra" v-html="handleStatusCell(device.status)" />
            </Cell>
            <div @click="() => {console.log('HELLO')}">
            <Cell title="查看设备详细内容">
              <Icon slot="extra" type="ios-link" />
            </Cell>
            </div>
          </CellGroup>
          <Row type="flex" justify="space-around" style="padding: 10px">
            <Col span="10">
              <Button type="info" long @click="modifyDeviceBtnClick(device.id)"
                >修改设备信息</Button
              >
              <Modal v-model="modalControl" title="修改设备" footer-hide>
                <device-info-form
                  :deviceInfo="activeDevice"
                  :parentCancelBtnClick="modalCancelBtnClick"
                  :parentComfirmBtnClick="modalComfirmBtnClick"
                >
                  <!-- <template v-slot:cancelBtn>
                    <Button @click="modalCancelBtnClick">取消</Button>
                  </template> -->
                  <!-- <template v-slot:comfirmBtn>
                    <Button
                      type="primary"
                      :loading="loading"
                      @click="modalComfirmBtnClick"
                      >新增</Button
                    >
                  </template> -->
                </device-info-form>
              </Modal>
            </Col>
            <Col span="10">
              <Button type="error" long @click="deleteBtnClick(listIndex)"
                >删除设备</Button
              >
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
      // _activeDevice: null
    }
  },
  computed: {
    ...mapState({
      deviceList: (state) => state.device.deviceList
    }),
    ...mapGetters(['formItem'])
    // activeDevice: {
    //     get() {
    //         if (this._activeDevice == null) {
    //             this._activeDevice = this.deviceList[0]
    //         }
    //         return this._activeDevice
    //     },
    //     set(value) {
    //         this._activeDevice = value[value]
    //     }
    // }
  },
  methods: {
    ...mapMutations(['deleteDevice']),
    ...mapActions(['modifyDeviceList', 'getDeviceList']),
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
    modifyDeviceBtnClick (id) {
      this.modalControl = true
      this.activeDevice = this.deviceList.find((device) => device.id === id)
      // FIXME: bug? web browser特性? 連續兩次點擊同一個設備，第一次所修改的內容會保留到第二次中，但保存formItem的內容是每次點擊都會初始化成合適的內容
    },
    modalComfirmBtnClick (newDeviceInfo) {
      this.modalControl = false
      this.modifyDeviceList(newDeviceInfo)
    },
    modalCancelBtnClick () {
      this.modalControl = false
    },
    deleteBtnClick (listId) {
      this.deleteDevice(listId)
    }
  },
  watch: {},
  mounted () {
    this.getDeviceList()
  }
}
</script>
