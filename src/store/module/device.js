export default {
    state: {
        deviceList: [
            {id: '1', name: 'machine1', model: 'RTX1', category: '加热器', status: 1},
            {id: '2', name: 'machine2', model: 'RTX2', category: '加热器', status: 1},
            {id: '3', name: 'machine3', model: 'RTX3', category: '加热器', status: 2},
            {id: '4', name: 'machine4', model: 'RTX4', category: '加热器', status: 2},
            {id: '5', name: 'machine5', model: 'RTX5', category: '加热器', status: 1},
        ],
    },
    getters: {

    },
    mutations: {
        addDevice (state, newDevice) {
            state.deviceList.push(newDevice)
        }
        // TODO: 發給後端保存
    },
    actions: {

    }
}