<template>
    <Form :label-width="80">
        <FormItem label="设备名字">
            <Input v-model="name"></Input>
        </FormItem>
        <FormItem label="类型">
            <Input v-model="category"></Input>
        </FormItem>
        <FormItem label="型号">
            <Input v-model="model"></Input>
        </FormItem>
        <FormItem label="更多信息">
            <Input v-model="info" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
        </FormItem>
    </Form>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
    name: 'deviceInfoForm',
    data () {
        return {
        }
    },
    computed: {
        // ...mapState({
        //     formItem: state => state.device.formItem
        // })
        name: {
            get() {
                return this.$store.state.device.formItem.name
            },
            set(value) {
                this.modifyFormItem({name: value})
            }
        },
        category: {
            get() {
                return this.$store.state.device.formItem.category
            },
            set(value) {
                this.modifyFormItem({category: value})
            }
        },
        model: {
            get() {
                return this.$store.state.device.formItem.model
            },
            set(value) {
                this.modifyFormItem({model: value})
            }
        },
        info: {
            get() {
                return this.$store.state.device.formItem.info
            },
            set(value) {
                this.modifyFormItem({info: value})
            }
        },
    },
    methods: {
        ...mapMutations([
            'modifyFormItem'
        ])
    }
}
</script>
