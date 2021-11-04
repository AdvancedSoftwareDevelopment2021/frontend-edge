export default {
  state: {
    newDeviceID: 6,
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
      id: "",
      name: "",
      category: "",
      medel: "",
      info: "",
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
      state.formItem = {
        ...state.formItem,
        id: state.newDeviceID
      };
      state.newDeviceID += 1;
      state.deviceList.push(state.formItem);
      state.formItem = {
        id: state.newDeviceID,
        name: "",
        category: "",
        medel: "",
        info: "",
        status: 1
      };
      // TODO: 发给后端存入数据库
    }
  },
  actions: {}
};
