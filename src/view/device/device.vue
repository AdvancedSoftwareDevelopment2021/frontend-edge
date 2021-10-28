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
                @on-ok="asyncOK">
                <Form :model="formItem" :label-width="80">
                    <FormItem label="Input">
                        <Input v-model="formItem.input" placeholder="Enter something..."></Input>
                    </FormItem>
                    <FormItem label="Select">
                        <Select v-model="formItem.select">
                            <Option value="beijing">New York</Option>
                            <Option value="shanghai">London</Option>
                            <Option value="shenzhen">Sydney</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="DatePicker">
                        <Row>
                            <Col span="11">
                                <DatePicker type="date" placeholder="Select date" v-model="formItem.date"></DatePicker>
                            </Col>
                            <Col span="2" style="text-align: center">-</Col>
                            <Col span="11">
                                <TimePicker type="time" placeholder="Select time" v-model="formItem.time"></TimePicker>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="Radio">
                        <RadioGroup v-model="formItem.radio">
                            <Radio label="male">Male</Radio>
                            <Radio label="female">Female</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="Checkbox">
                        <CheckboxGroup v-model="formItem.checkbox">
                            <Checkbox label="Eat"></Checkbox>
                            <Checkbox label="Sleep"></Checkbox>
                            <Checkbox label="Run"></Checkbox>
                            <Checkbox label="Movie"></Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem label="Switch">
                        <i-switch v-model="formItem.switch" size="large">
                            <span slot="open">On</span>
                            <span slot="close">Off</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="Slider">
                        <Slider v-model="formItem.slider" range></Slider>
                    </FormItem>
                    <FormItem label="Text">
                        <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary">Submit</Button>
                        <Button style="margin-left: 8px">Cancel</Button>
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
import { mapState } from 'vuex'
export default {
    name: 'device',
    components: {

    },
    data () {
        return {
            modalControl: false,
            loading: true,
            formItem: {
                input: '',
                select: '',
                radio: 'male',
                checkbox: [],
                switch: true,
                date: '',
                time: '',
                slider: [20, 50],
                textarea: ''
            }
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
        asyncOK () {
            setTimeout(() => {
                this.modalControl = false;
            }, 2000);
        }
    },
    mounted() {
        // console.log(this.$route)
        console.log(this.deviceList)
    }
}
</script>
