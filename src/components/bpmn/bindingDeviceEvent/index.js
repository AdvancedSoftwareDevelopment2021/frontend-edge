import bindingDeviceContextPad from './bindingDeviceContextPad'
import bindingDevicePalette from './bindingDevicePalette'

export default {
  __init__: [ 'customContextPad', 'customPalette' ],
  customContextPad: [ 'type', bindingDeviceContextPad ],
  customPalette: [ 'type', bindingDevicePalette ]
}
