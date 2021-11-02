<template>
    <div>
        <Row style="margin: 0 1%">
            <add-device />
        </Row>
        <Row>
        <Col span="7" v-for="device in deviceList" v-bind:key="device.id" style="padding: 10px;background: #f8f8f9">
            <Card :title="device.name" icon="ios-information-circle-outline" :padding="0" shadow style="width: 300px;">
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
                    <Cell title="更多信息" :to="'/device/detail'" />
                </CellGroup>
            </Card>
        </Col>
        </Row>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import addDevice from '_c/add-device'
export default {
    name: 'device',
    components: {
        addDevice
    },
    data () {
        return {
            
        }
    },
    computed: {
        ...mapState({
            deviceList: state => state.device.deviceList,
        })
    },
    methods: {
        handleStatus (status) {
            let ret = ''
            switch(status) {
                case 1: {
                    ret = "success"
                    break
                }
                case 2: {
                    ret = "error"
                    break
                }
            }
            return ret
        },
        handleStatusCell (statue) {
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
    },
    mounted() {

    }
}
</script>
