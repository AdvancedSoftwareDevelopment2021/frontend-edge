<template>
  <div>
    <Form :model="newSensorFormItem" :label-width="80">
      <Row>
        <Col span="12">
          <FormItem label="Interval">
            <Input
              v-model="newSensorFormItem.collectScheduler.interval"
              placeholder="请输入数据回传间隔时间"
            ></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="Unit">
            <Select
              v-model="newSensorFormItem.collectScheduler.unit"
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
              v-model="newSensorFormItem.dataCollector.ip"
              placeholder="请输入IP地址"
            ></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="端口">
            <Input
              v-model="newSensorFormItem.dataCollector.port"
              placeholder="请输入端口"
            ></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="slaveId">
            <Input
              v-model="newSensorFormItem.dataCollector.slaveId"
              placeholder="请输入slaveId"
            ></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="offset">
            <Input
              v-model="newSensorFormItem.dataCollector.offset"
              placeholder="请输入offset"
            ></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="num">
            <Input
              v-model="newSensorFormItem.dataCollector.num"
              placeholder="请输入num"
            ></Input>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Row :gutter="8" type="flex" justify="end">
      <Col>
        <Button @click="cancelBtnClick">取消</Button>
      </Col>
      <Col>
        <Button type="primary" @click="confirmBtnClick">
          确认
        </Button>
      </Col>
    </Row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'modbusBindingForm',
  props: {
    dataSourceName: {
      type: String
    },
    protocolName: {
      type: String
    },
    parentCancelBtnClick: {
      type: Function
    },
    parentConfirmBtnClick: {
      type: Function
    }
  },
  data () {
    return {
      newSensorFormItem: {}
    }
  },
  computed: {
    ...mapState({
      sensorFormItem: (state) => state.sensor.sensorFormItem,
      unitList: (state) => state.sensor.unitList
    })
  },
  methods: {
    cancelBtnClick () {
      this.parentCancelBtnClick()
    },
    confirmBtnClick () {
      this.newSensorFormItem.name = this.dataSourceName
      this.parentConfirmBtnClick(this.newSensorFormItem)
    }
  },
  created () {
    this.newSensorFormItem = this.sensorFormItem[this.protocolName]
  }
}
</script>
