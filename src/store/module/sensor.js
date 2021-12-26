import {
  getSensorListApi,
  addSensorApi,
  sensorStartCommandApi,
  sensorStopCommandApi,
  sensorMonitorStopCommandApi,
  sensorMonitorStartCommandApi,
  getSensorAllHistoryDataApi,
  getSensorLatestStatusApi,
  getSensorAllHistoryStatusApi
} from '@/api/sensor'

import { SENSOR_STATUS } from '../../libs/constants'

// TODO: 可能要做Number和String的转换
export default {
  state: {
    sensorList: [],
    sensorFormItem: {
      Modbus: {
        name: '',
        collectScheduler: {
          interval: 10,
          unit: 'SECOND'
        },
        dataCollector: {
          type: 'Modbus',
          ip: '127.0.0.1',
          port: 502,
          slaveId: 3,
          offset: 0,
          modbusFunction: 'HOLDING_REGISTER',
          datatype: 'BINARY',
          num: 2
        }
      },
      Canbus: {},
      ZigBee: {
        name: '',
        dataCollector: {
          type: 'ZigBee',
          serialNumber: 'COM2',
          baudRate: 9600,
          checkoutBit: null,
          dataBit: 8,
          stopBit: 1
        }
      },
      WebSocket: {
        name: '',
        // collectScheduler: {
        //   interval: 1,
        //   unit: 'SECOND'
        // },
        dataCollector: {
          type: 'WebSocket',
          uri: 'http://localhost:8000/websocket'
        }
      },
      Http: {
        name: '',
        collectScheduler: {
          interval: 1,
          unit: 'SECOND'
        },
        dataCollector: {
          type: 'Http',
          url: 'http://localhost:8000/getdata'
        }
      }
    },
    unitList: [
      {
        value: 'SECOND',
        label: '秒'
      },
      {
        value: 'MINUTE',
        label: '分'
      },
      {
        value: 'HOUR',
        label: '小时'
      },
      {
        value: 'DAY',
        label: '天'
      },
      {
        value: 'WEEK',
        label: '周'
      },
      {
        value: 'MONTH',
        label: '月'
      }
    ],
    allHistoryDataList: [],
    sensorHistoryData: [],
    sensorHistoryStatus: []
  },
  mutations: {
    setSensorList (state, sensorList) {
      state.sensorList = sensorList
    },
    setSensorHistoryData (state, sensorHistoryData) {
      state.sensorHistoryData = sensorHistoryData
    },
    setSensorHistoryStatus (state, sensorHistoryStatus) {
      state.sensorHistoryStatus = sensorHistoryStatus
    },
    setSensorAllHistoryData (state, { sensorName, allHistoryDataList }) {
      if (!state.allHistoryDataList.some((c) => c.sensorName === sensorName)) {
        state.allHistoryDataList.push({
          sensorName,
          historyDataList: allHistoryDataList
        })
      }
    },
    releaseSensorAllHistoryData (state) {
      state.allHistoryDataList = []
    }
  },
  actions: {
    async getSensorListAction ({ commit }, { deviceId }) {
      let res = await getSensorListApi({ deviceId })
      commit('setSensorList', res)
      console.log('Get sensorList from DB')
    },
    async getSensorHistoryDataAction ({ commit }, { deviceId, sensorName }) {
      try {
        let res = await getSensorAllHistoryDataApi({ deviceId, sensorName })
        commit('setSensorHistoryData', res)
      } catch (e) {
        commit('setSensorHistoryData', [])
        console.log(e)
      }
    },
    async getSensorHistoryStatusAction ({ commit }, { sensorId }) {
      try {
        let res = await getSensorAllHistoryStatusApi({ sensorId })
        commit('setSensorHistoryStatus', res)
      } catch (e) {
        commit('setSensorHistoryStatus', [])
        console.log(e)
      }
    },
    async addSensorAction ({ state }, { deviceId, newSensor }) {
      if (newSensor.dataCollector.type === 'WebSocket') {
        newSensor.dataCollector.uri =
          newSensor.dataCollector.uri + '/' + deviceId
      }
      await addSensorApi({ deviceId, newSensor })
      console.log(
        `Add sensor deviceId: ${deviceId}, sensorName: ${newSensor.name}}`
      )
      // NOTE: vuex找不到device的actions getDeviceListAction
      // 只要 dispatch('getDeviceListAction', {}, {root: true})就可以了
      //   await dispatch('device/getDeviceListAction', {}, {root: true})
    },
    async sensorStartCommandAction (
      { state },
      { deviceId, sensorId, sensorName }
    ) {
      try {
        await sensorStartCommandApi({ deviceId, sensorId })
        console.log(`${sensorName}(${deviceId}): start`)
      } catch (e) {
        console.log(`ERROR: ${sensorName}(${deviceId}): start`)
      }
    },
    async sensorStopCommandAction (
      { state },
      { deviceId, sensorId, sensorName }
    ) {
      try {
        await sensorStopCommandApi({ deviceId, sensorId })
        console.log(`${sensorName}(${deviceId}): stop`)
      } catch (e) {
        console.log(`ERROR: ${sensorName}(${deviceId}): stop`)
      }
    },
    async sensorMonitorStartCommandAction (
      { state },
      { deviceId, sensorId, sensorName }
    ) {
      await sensorMonitorStartCommandApi({ deviceId, sensorId })
      console.log(`${sensorName}(${deviceId}): start`)
    },
    async sensorMonitorStopCommandAction (
      { state },
      { deviceId, sensorId, sensorName }
    ) {
      await sensorMonitorStopCommandApi({ deviceId, sensorId })
      console.log(`${sensorName}(${deviceId}): stop`)
    },
    async getSensorAllHistoryDataAction (
      { commit },
      { deviceId, sensorId, sensorName }
    ) {
      try {
        let res = await getSensorAllHistoryDataApi({ deviceId, sensorName })
        console.log(res)
        commit('setSensorAllHistoryData', {
          sensorName,
          allHistoryDataList: res
        })
      } catch (e) {
        console.log(e)
        commit('setSensorAllHistoryData', {
          sensorName,
          allHistoryDataList: []
        })
      }

      console.log(`Get ${sensorName} sensor all history data`)
    },
    async getSensorLatestStatusAction ({ state, commit, rootState }) {
      const deviceWithSensorIdList = rootState.device.deviceList.map(
        (device) => ({
          deviceId: device.id,
          sensorIdList: device.values.map((sensor) => sensor.sensorId)
        })
      )
      for (let { deviceId, sensorIdList } of deviceWithSensorIdList) {
        let sensor = []
        for (let sensorId of sensorIdList) {
          if (sensorId === null) {
            sensor.push({ sensorId, sensorStatus: SENSOR_STATUS.UNBOUND })
          } else {
            try {
              let res = await getSensorLatestStatusApi({ deviceId, sensorId })
              let status = res.status
              if (!status) {
                status = SENSOR_STATUS.FAILURE
              }
              sensor.push({ sensorId, sensorStatus: status })
            } catch (e) {
              sensor.push({ sensorId, sensorStatus: SENSOR_STATUS.FAILURE })
            }
          }
        }
        // console.log({ deviceId, sensor: sensor })
        commit('setDeviceStatus', { deviceId, sensor: sensor }, { root: true })
      }
      console.log(`Get all device status`)
    },
    async getSensorLatestStatusByIdAction (
      { state, commit, rootState },
      { deviceId, sensorId }
    ) {
      try {
        let res = await getSensorLatestStatusApi({ sensorId })
        let status = res.status
        if (!status) {
          status = SENSOR_STATUS.FAILURE
        }
        let deviceStatus = rootState.device.deviceStatusList.find(
          (item) => (item.deviceId === deviceId)
        )
        let sensorListIndex = deviceStatus.sensor.findIndex(
          (item) => item.sensorId === sensorId
        )
        deviceStatus.sensor[sensorListIndex].sensorStatus = status
      } catch (e) {
        console.log(e)
      }
    }
  }
}
