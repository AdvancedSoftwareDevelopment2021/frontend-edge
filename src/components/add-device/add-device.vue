<template>
    <div>
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
    </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
    name: 'addDevice',
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
    methods: {
        ...mapMutations([
            'addDevice'
        ]),
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
    }
}
</script>
