<template>
    <div>
        <Row style="margin: 0 1%">
            <Button type="primary" @click="modalControl = true">
                <Icon type="ios-add-circle-outline" />
                新增设备
            </Button>
            <Modal
                v-model="modalControl"
                title="新增设备"
                :loading="loading"
                @on-ok="modalComfirmBtnClick">
                <Form :model="formItem" :label-width="80">
                    <FormItem label="设备名字">
                        <Input v-model="formItem.name"></Input>
                    </FormItem>
                    <FormItem label="类型">
                        <Input v-model="formItem.category"></Input>
                    </FormItem>
                    <FormItem label="型号">
                        <Input v-model="formItem.model"></Input>
                    </FormItem>
                    <FormItem label="更多信息">
                        <Input v-model="formItem.info" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                </Form>
            </Modal>
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
import { mapMutations, mapState } from 'vuex'
export default {
    name: 'device',
    components: {

    },
    data () {
        return {
            modalControl: false,
            loading: true,
            formItem: {
                name: '',
                category: '',
                medel: '',
                info: ''
            }
        }
    },
    computed: {
        ...mapState({
            deviceList: state => state.device.deviceList,
        })
    },
    methods: {
        ...mapMutations([
            'addDevice'
        ]),
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
        modalComfirmBtnClick () {
            const { name, model, category, info } = this.formItem
            // TODO: 數據內容檢查, try catch
            let newDevice = {
                name,
                model,
                category,
                status: 1
            }
            setTimeout(() => {
                this.addDevice(newDevice)
                this.modalControl = false;
            }, 1000);
        }
    },
    mounted() {

    }
}
</script>
