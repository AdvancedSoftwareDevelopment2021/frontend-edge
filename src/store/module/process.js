import { getAllProcessesApi, bindingProcessAndDeviceApi } from '@/api/process'

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
    activeProcess: {}
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
  },
  actions: {
    async getAllProcessesAction ({ state }) {
      let res = await getAllProcessesApi()
      state.processList = res
      console.log(`Get All processes from DB`)
    },
    async bindingDeviceAction ({ state }, { device }) {
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
    }
  }
}
