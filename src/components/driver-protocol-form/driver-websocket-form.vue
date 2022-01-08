<template>
  <div>
    <Form :model="newDriverForm" :label-width="80">
      <Row>
          <FormItem label="uri">
            <Input
              v-model="newDriverForm.point.uri"
              placeholder="请输入uri"
            ></Input>
          </FormItem>
      </Row>
    </Form>
    <Row :gutter="8" type="flex" justify="end">
      <Col>
        <Button @click="cancelBtnClick">取消</Button>
      </Col>
      <Col>
        <Button type="primary" @click="confirmBtnClick"> 确认 </Button>
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
