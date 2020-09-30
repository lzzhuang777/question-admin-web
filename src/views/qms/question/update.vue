<template> 
  <Question-Detail :isEdit="true"></Question-Detail>
</template>
<script>
  import QuestionDetail from './components/QuestionDetail'
  export default {
    name: 'updateQuestion',
    components: { QuestionDetail }
  }
</script>
<style></style>


