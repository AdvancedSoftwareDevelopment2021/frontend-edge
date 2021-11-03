<template>
    <div>
        <Row style="margin: 0 1%">
            <Col span="2">
                <add-device />
            </Col>
            <Col span="10">
                <Input v-model="searchInput" search placeholder="输入设备名字搜索设备" />
            </Col>
            <Col span="2">
                <div>{{ searchInput }}</div>
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
                    <!-- TODO: route to detail modalView -->
                </CellGroup>
                <Row type="flex" justify="space-around">
                    <Col span="10">
                        <Button type="error" long>删除设备</Button>
                    </Col>
                    <Col span="10">
                        <Button type="info" long>修改设备信息</Button>
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
export default {
    name: 'device',
    components: {
        addDevice
    },
    data () {
        return {
            searchInput: ''
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
