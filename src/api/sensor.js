import axios from '@/libs/api.request'

export const addSensorApi = ({ deviceId, newSensor }) => {
  return axios.request({
    url: `sensor/${deviceId}`,
    method: 'post',
    data: newSensor
  })
}

export const sensorStartCommandApi = ({ deviceId, sensorId }) => {
  return axios.request({
    url: `command/sensor/start/${deviceId}/${sensorId}`,
    method: 'post'
  })
}

export const sensorStopCommandApi = ({ deviceId, sensorId }) => {
  return axios.request({
    url: `command/sensor/stop/${deviceId}/${sensorId}`,
    method: 'post'
  })
}

export const getSensorAllHistoryDataApi = ({ deviceId, sensorName }) => {
  return axios.request({
    url: `/device/data/${deviceId}/${sensorName}`,
    method: 'get'
  })
}


export const sensorMonitorStartCommandApi = ({ deviceId, sensorId }) => {
  return axios.request({
    url: `command/start_monitor/${deviceId}/${sensorId}`,
    method: 'post'
  })
}

export const sensorMonitorStopCommandApi = ({ deviceId, sensorId }) => {
  return axios.request({
    url: `command/stop_monitor/${deviceId}/${sensorId}`,
    method: 'post'
  })
}
