<template lang="html">
  <div class="editable" :contenteditable="editable" @input="update"></div>
</template>

<script type="text/javascript">
export default {
  props:[
    'content',
    'editable'
  ],
  mounted: function(){
    this.$el.innerText = this.content
    console.log(this.editable);
  },
  watch: {
    editable: function(val) {
      this.$el.innerText = this.content
    },
    content: function(val) {
      if (!this.editable) this.$el.innerText = this.content
    }
  },
  methods:{
    update:function(event) {
      this.$emit('update',event.target.innerText)
    }
  }
}
</script>
