export default {
  state: {
    deviceList: [
      {
        id: 1,
        name: "machine1",
        model: "RTX1",
        category: "加热器",
        info: "",
        status: 1
      },
      {
        id: 2,
        name: "machine2",
        model: "RTX2",
        category: "加热器",
        info: "",
        status: 1
      },
      {
        id: 3,
        name: "machine3",
        model: "RTX3",
        category: "加热器",
        info: "",
        status: 2
      },
      {
        id: 4,
        name: "machine4",
        model: "RTX4",
        category: "加热器",
        info: "",
        status: 2
      },
      {
        id: 5,
        name: "machine5",
        model: "RTX5",
        category: "加热器",
        info: "",
        status: 1
      }
    ],
    formItem: {
      id: 6,
      name: "test1",
      category: "test2",
      model: "test3",
      info: "test4",
      status: 1
    }
  },
  getters: {},
  mutations: {
    modifyFormItem(state, newState) {
      state.formItem = { ...state.formItem, ...newState };
    },
    modifyDeviceList(state, ID) {
        //TODO:
    },
    addDevice(state, newDevice) {
      state.deviceList.push(state.formItem);
      state.formItem = {
        id: state.formItem.id + 1,
        name: "",
        category: "",
        model: "",
        info: "",
        status: 1
      };
      // TODO: 发给后端存入数据库
    }
  },
  actions: {}
};
