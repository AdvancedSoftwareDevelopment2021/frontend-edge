import axios from '@/libs/api.request'

export const getAllProcessesApi = () => {
  return axios.request({
    url: `process`,
    method: 'get'
  })
}

export const bindingProcessAndDeviceApi = ({ processId, taskId, deviceId }) => {
  //   console.log(`process/${processId}/${taskId}/device/${deviceId}`)
  return axios.request({
    url: `process/${processId}/${taskId}/device/${deviceId}`,
    method: 'post'
  })
}

export const cancelBindingProcessAndDeviceApi = ({ processId, taskId }) => {
  console.log(`process//${processId}/${taskId}/device`)
  return axios.request({
    url: `process//${processId}/${taskId}/device`,
    method: 'delete'
  })
}

export const getBindingListApi = (processId) => {
  return axios.request({
    url: `process/${processId}/device`,
    method: 'get'
  })
}

export const processStopApi = (processId) => {
  return axios.request({
    url: `/process/${processId}/stop`,
    method: 'post'
  })
}

export const processStartApi = (processId, number) => {
  return axios.request({
    url: `/process/${processId}/start/${number}`,
    method: 'post'
  })
}

export const deleteProcess = (processId) => {
  return axios.request({
    url: `/process/${processId}`,
    method: 'delete'
  })
}
