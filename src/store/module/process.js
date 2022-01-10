import {
  getAllProcessesApi,
  bindingProcessAndDeviceApi,
  cancelBindingProcessAndDeviceApi,
  getBindingListApi,
  processStopApi,
  processStartApi
} from '@/api/process'

export default {
  state: {
    activeElement: {},
    modal: false,
    // bpmn: "<?xml...
    // createdTime: "2021-12-09T03:09:50.117+00:00"
    // deviceList: []
    // id: "61d99fcae6524e6367960c4f"
    // name: "p2"
    // status: "CONSTRUCTING"
    // step: "DEVICE"
    processList: [],
    activeProcess: {},
    activeBindingList: []
  },
  mutations: {
    setActiveElement (state, element) {
      state.activeElement = element
    },
    setProcessModal (state, value) {
      state.modal = value
    },
    setActiveProcess (state, id) {
      const process = state.processList.find((process) => process.id === id)
      state.activeProcess = process
      // console.log(state.activeProcess)
    }
    // setActiveProcessBindingList(state, bindingList) {
    //     state.activeProcess.bindingList = bindingList;
    // }
  },
  actions: {
    async getAllProcessesAction ({ state }) {
      let res = await getAllProcessesApi()
      state.processList = res
      console.log(`Get All processes from DB`)
    },
    async bindingDeviceAction ({ state, dispatch }, { device }) {
      // const processId = state.businessObject.parent.id
      // TODO: process id
      const processId = state.activeProcess.id
      const taskId = state.activeElement.id
      //   console.log(device);
      const deviceId = device.id
      await bindingProcessAndDeviceApi({ processId, taskId, deviceId })
      console.log(
        `Binding process id: ${processId}, task id: ${taskId}, device id: ${deviceId}`
      )
      dispatch('getBindingListAction')
    },
    async cancelBindingDeviceAction ({ state, dispatch }, taskId) {
      const processId = state.activeProcess.id
      await cancelBindingProcessAndDeviceApi({ processId, taskId })
      console.log(
        `Cancel binding process id: ${processId}, task id: ${taskId}`
      )
      dispatch('getBindingListAction')
    },
    async getBindingListAction ({ state }) {
      const processId = state.activeProcess.id
      let res = await getBindingListApi(processId)
      // console.log(res)
      state.activeBindingList = res
    },
    async processStopAction ({ state }) {
      const processId = state.activeProcess.id
      await processStopApi(processId)
    },
    async processStartAction ({ state }) {
      const processId = state.activeProcess.id
      const number = 5
      await processStartApi(processId, number)
    }
  }
}
