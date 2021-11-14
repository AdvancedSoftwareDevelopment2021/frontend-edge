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
    _formItem: {
      id: null,
      name: "test1",
      category: "test2",
      model: "test3",
      info: "test4",
      status: 1
    },
    _newFormItemID: 6
  },
  getters: {
    newFormItemID(state) {
      //TODO: 改做闭包？
      return state._newFormItemID
    },
    formItem(state, getters) {
      return {...state._formItem, id: getters.newFormItemID}
    }
  },
  mutations: {
    initFormItem(state) {
      // console.log('Initial FormItem')
      state._formItem = {
        id: null,
        name: "test1",
        category: "test2",
        model: "test3",
        info: "test4",
        status: 1
      }
    },
    modifyFormItem(state, newState) {
      // const formItem = getters.formItem
      state._formItem = { ...state._formItem, ...newState };
    },
    deleteDevice(state, { id }) {
      //TODO: delete by id
      const deleteItem = state.deviceList.splice(id, 1)
      console.log(`Delete ${deleteItem.id}`)
    }
  },
  actions: {
    addDevice({ state, commit, getters }) {
      // TODO: 數據內容檢查, try catch
      const formItem = getters.formItem
      console.log(`Add ${formItem.id}`)
      state._newFormItemID += 1
      state.deviceList.push(formItem);
      commit('initFormItem')
      // TODO: 发给后端存入数据库
    },
    modifyDeviceList({ state, commit }) {
      // 因为device.id作为的key，为了不改变key，故有以下令人血压上升的代码
      const { name, category, model, info } = state._formItem
      state.deviceList[state._formItem.id-1] = {
        ...state.deviceList[state._formItem.id-1],
        name,
        category,
        model,
        info
      }
      commit('initFormItem')
  },
  }
};
