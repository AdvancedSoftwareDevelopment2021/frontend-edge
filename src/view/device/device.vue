<template>
    <div>
        <Row style="margin: 0 1%">
            <Col span="2">
                <add-device :deviceInfo="formItem" />
            </Col>
            <Col span="10">
                <Input v-model="searchInput" search placeholder="输入设备名字搜索设备" />
            </Col>
        </Row>
        <Row>
        <Col span="6" v-for="device in deviceList" v-bind:key="device.id" style="padding: 10px;background: #f8f8f9">
            <Card :title="device.name" icon="ios-information-circle-outline" :padding="0" shadow style="width: 300px; padding: 0 0 3% 0">
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
                <Row type="flex" justify="space-around">
                    <Col span="10">
                        <Button type="error" long>删除设备</Button>
                    </Col>
                    <Col span="10">
                    <!-- TODO: 所有設備內容只顯示deviceList[-1] -->
                        <Button type="info" long @click="editDeviceBtnClick(device.id-1)">修改设备信息</Button>
                        <Modal
                            v-model="modalControl"
                            title="修改设备"
                            @on-ok="modalComfirmBtnClick">
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
import { mapState } from 'vuex'
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
            activeDeivce: null,
        }
    },
    computed: {
        ...mapState({
            deviceList: state => state.device.deviceList,
            formItem: state => state.device.formItem
        }),
    },
    methods: {
        handleStatus(status) {
            let ret = ''
            switch(status) {
                case 1: {
                    ret = "processing"
                    break
                }
                case 2: {
                    ret = "error"
                    break
                }
            }
            return ret
        },
        handleStatusCell(statue) {
            let ret = ''
            switch(statue) {
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
        editDeviceBtnClick(id) {
            this.modalControl = true
            this.activeDeivce = this.deviceList[id]
        },
        modalComfirmBtnClick() {
            
        }
    },
    mounted() {
        this.activeDeivce = this.deviceList[0]
    }
}
</script>
