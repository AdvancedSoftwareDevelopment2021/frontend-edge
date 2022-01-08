<template>
  <Poptip confirm transfer :title="popTipTitle" @on-ok="ok">
    <Button :class="buttonClass" v-bind="buttonProps">{{ buttonText }}</Button>
  </Poptip>
</template>
<script>
export default {
  props: ['popTipTitle', 'ok', 'buttonProps', 'buttonText', 'buttonClass']
}
</script>
