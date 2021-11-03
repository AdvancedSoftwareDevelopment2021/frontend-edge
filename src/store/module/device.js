export default {
  state: {
    deviceList: [
      {
        id: "1",
        name: "machine1",
        model: "RTX1",
        category: "加热器",
        info: '',
        status: 1
      },
      {
        id: "2",
        name: "machine2",
        model: "RTX2",
        category: "加热器",
        info: '',
        status: 1
      },
      {
        id: "3",
        name: "machine3",
        model: "RTX3",
        category: "加热器",
        info: '',
        status: 2
      },
      {
        id: "4",
        name: "machine4",
        model: "RTX4",
        category: "加热器",
        info: '',
        status: 2
      },
      {
        id: "5",
        name: "machine5",
        model: "RTX5",
        category: "加热器",
        info: '',
        status: 1
      }
    ],
    formItem: {
        name: '',
        category: '',
        medel: '',
        info: '',
        status: 1
    }
  },
  getters: {},
  mutations: {
    modifyFormItem(state, str) {
        state.formItem = {...state.formItem, ...str}
    },
    addDevice(state, newDevice) {
      state.deviceList.push(state.formItem)
      state.formItem = {
                            name: '',
                            category: '',
                            medel: '',
                            info: '',
                            status: 1
                        }
      // TODO: 发给后端存入数据库
    },
  },
  actions: {}
};