<template>
  <div>
    <Form :model="newDriverForm" :label-width="80">
      <Row>
          <FormItem label="serialNumber">
            <Input
              v-model="newDriverForm.point.serialNumber"
              placeholder="请输入serialNumber"
            ></Input>
          </FormItem>
      </Row>
      <Row>
          <FormItem label="baudRate">
            <Input
              v-model="newDriverForm.point.baudRate"
              placeholder="请输入baudRate"
            ></Input>
          </FormItem>
      </Row>
      <Row>
          <FormItem label="checkoutBit">
            <Input
              v-model="newDriverForm.point.checkoutBit"
              placeholder="请输入checkoutBit"
            ></Input>
          </FormItem>
      </Row>
      <Row>
          <FormItem label="dataBit">
            <Input
              v-model="newDriverForm.point.dataBit"
              placeholder="请输入dataBit"
            ></Input>
          </FormItem>
      </Row>
      <Row>
          <FormItem label="stopBit">
            <Input
              v-model="newDriverForm.point.stopBit"
              placeholder="请输入stopBit"
            ></Input>
          </FormItem>
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
export default {
  props: {
    driverForm: {
      required: true
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
      newDriverForm: this.driverForm
    }
  },
  methods: {
    cancelBtnClick () {
      this.parentCancelBtnClick()
    },
    confirmBtnClick () {
      this.parentConfirmBtnClick(this.newDriverForm)
    }
  }
}
</script>
