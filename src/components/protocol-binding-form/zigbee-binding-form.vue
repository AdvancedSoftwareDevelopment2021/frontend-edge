<template>
  <div>
    <Form :model="newSensorFormItem" :label-width="80">
      <Row>
        <Col span="12">
          <FormItem label="serialNumber">
            <Input
              v-model="newSensorFormItem.dataCollector.serialNumber"
              placeholder="请输入serialNumber"
            ></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="baudRate">
            <Input
              v-model="newSensorFormItem.dataCollector.baudRate"
              placeholder="请输入baudRate"
            ></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="checkoutBit">
            <Input
              v-model="newSensorFormItem.dataCollector.checkoutBit"
              placeholder="请输入checkoutBit"
            ></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="dataBit">
            <Input
              v-model="newSensorFormItem.dataCollector.dataBit"
              placeholder="请输入dataBit"
            ></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="stopBit">
            <Input
              v-model="newSensorFormItem.dataCollector.stopBit"
              placeholder="请输入stopBit"
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
  name: 'zigbeeBindingForm',
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
      sensorFormItem: (state) => state.sensor.sensorFormItem
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
