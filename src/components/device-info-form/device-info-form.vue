<template>
  <!-- TODO: paceholder -->
  <div>
    <Form ref="formItem" :model="formItem" :label-width="80">
      <FormItem label="设备名称">
        <Input v-model="formItem.name"></Input>
      </FormItem>
      <!-- <FormItem label="类型">
            <Input v-model="category"></Input>
        </FormItem> -->
      <FormItem label="型号">
        <Input v-model="formItem.model"></Input>
      </FormItem>
      <FormItem label="设备描述">
        <Input
          v-model="formItem.description"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5 }"
        ></Input>
      </FormItem>
      <FormItem
        v-for="(item, listIndex) in formItem.values"
        :key="listIndex"
        :label="'data ' + item.valueIndex"
        :prop="'items.' + listIndex + '.value'"
      >
        <Row gutter="10">
          <Col span="6">
            <Input v-model="item.name" />
          </Col>
          <Col span="6">
            <Select v-model="item.type">
              <Option
                v-for="item in deviceDataTypeList"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </Col>
          <Col span="6">
            <Select v-model="item.protocol">
              <Option
                v-for="item in deviceDataProtocolList"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </Col>
          <Col span="1" offset="2">
            <!-- TODO: Button 美化 -->
            <Button
              type="error"
              @click="handleRemove(listIndex)"
              size="small"
              shape="circle"
            >
              <Icon type="md-close" />
            </Button>
          </Col>
        </Row>
      </FormItem>
      <FormItem>
        <Row>
          <Col span="12">
            <Button type="dashed" long @click="handleAdd" icon="md-add">
              Add item
            </Button>
          </Col>
        </Row>
      </FormItem>
      <Row :gutter="8" type="flex" justify="end">
        <Col>
          <slot name="cancelBtn" />
        </Col>
        <Col>
          <span @click="comfirmSlotClick">
            <slot name="comfirmBtn" />
          </span>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  name: "deviceInfoForm",
  components: {},
  props: {
    deviceInfo: {
      type: Object,
    },
  },
  data() {
    return {
      valueIndex: 1,
      formItem: {
        name: "",
        model: "",
        description: "",
        status: 1,
        values: [
          {
            valueIndex: 1,
            name: "",
            type: "",
            protocol: "",
          },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      deviceDataTypeList: (state) => state.device.deviceDataTypeList,
      deviceDataProtocolList: (state) => state.device.deviceDataProtocolList,
    }),
  },
  methods: {
    ...mapMutations(["modifyFormItem"]),
    ...mapActions(["addDevice"]),
    comfirmSlotClick() {
      // TODO: 为了去除values中的每个valuesIndex而出现以下令血压上升的代码(valuesIndex可能没有用), 或者可以改用delete values -> valueIndex
      let values = this.formItem.values
      values = values.map((item) => {
          return {
              name: item.name, 
              type: item.type, 
              protocol: item.protocol
            }
        })
      this.addDevice({
          name: this.formItem.name,
          model: this.formItem.model,
          description: this.formItem.description,
          values
      })
      this.resetFormItem()
    },
    resetFormItem() {
      this.valueIndex = 1
      this.formItem = {
        name: "",
        model: "",
        description: "",
        status: 1,
        values: [
          {
            valueIndex: 1,
            name: "",
            type: "",
            protocol: "",
          },
        ],
      }
    },
    handleAdd() {
      this.valueIndex++;
      this.formItem.values.push({
        valueIndex: this.valueIndex,
        name: "",
        type: "",
        protocol: "",
      });
    },
    handleRemove(listIndex) {
      console.log("Delete listItem: " + listIndex);
      this.formItem.values.splice(listIndex, 1);
    },
  },
};
</script>
