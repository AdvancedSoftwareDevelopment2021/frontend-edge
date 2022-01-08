import axios from '@/libs/api.request'

export const getAllProcessesApi = () => {
  return axios.request({
    url: `process`,
    method: 'get'
  })
}

export const bindingProcessAndDeviceApi = ({ processId, taskId, deviceId }) => {
  console.log(`process/${processId}/${taskId}/device/${deviceId}`)
  return axios.request({
    url: `process/${processId}/${taskId}/device/${deviceId}`,
    method: 'post'
  })
}
