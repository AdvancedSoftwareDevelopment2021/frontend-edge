// 在任一组件上点击事件
import store from '@/store'

export default class bindingDeviceContextPad {
  constructor (config, contextPad, create, elementFactory, injector, translate) {
    this.create = create
    this.elementFactory = elementFactory
    this.translate = translate

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', false)
    }

    contextPad.registerProvider(this)
  }

  getContextPadEntries (element) {
    const {
      autoPlace,
      create,
      elementFactory
    } = this

    function appendServiceTask (event, element) {
      store.commit('setActiveElement', element)
      store.commit('setProcessModal', true)
      console.log(element)
      if (autoPlace) {
        // const shape = elementFactory.createShape({ type: 'bpmn:ServiceTask' });

        // autoPlace.append(element, shape);
      } else {
        // appendServiceTaskStart(event, element);
      }
    }

    function appendServiceTaskStart (event) {
      const shape = elementFactory.createShape({ type: 'bpmn:ServiceTask' })

      create.start(event, shape, element)
    }

    return {
      'append.service-task': {
        group: 'model',
        className: 'bpmn-icon-service-task',
        title: 'Append ServiceTask',
        action: {
          click: appendServiceTask,
          dragstart: appendServiceTaskStart
        }
      }
    }
  }
}

bindingDeviceContextPad.$inject = [
  'config',
  'contextPad',
  'create',
  'elementFactory',
  'injector',
  'translate'
]
