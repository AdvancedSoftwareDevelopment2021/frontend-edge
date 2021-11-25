import axios from '@/libs/api.request'

export const getDeviceListApi = () => {
    return axios.request({
        url: 'device',
        method: 'get'
    })
}

export const addDeviceApi = (device) => {
    let {name, model, description, values} = device
    values = values.map(({ name, type, protocol }) => ({ name, type, protocol }))

}